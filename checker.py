"""
US Visa Appointment Checker
Monitors usvisascheduling.com for available slots in June
and sends a Telegram notification when one is found.

Usage:
    python checker.py

Requirements:
    See requirements.txt. Also run: playwright install chromium
"""

import asyncio
import logging
import os
import re
import time
from datetime import datetime

from dotenv import load_dotenv
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

from notifier import send_telegram_message

load_dotenv()

# ── Configuration ────────────────────────────────────────────────────────────
EMAIL = os.getenv("VISA_EMAIL", "")
PASSWORD = os.getenv("VISA_PASSWORD", "")
TARGET_YEAR = int(os.getenv("TARGET_YEAR", "2026"))
TARGET_MONTH = int(os.getenv("TARGET_MONTH", "6"))   # June = 6
CHECK_INTERVAL_SECONDS = int(os.getenv("CHECK_INTERVAL_SECONDS", "120"))  # 2 min default

BASE_URL = "https://www.usvisascheduling.com/he-IL"
LOGIN_URL = f"{BASE_URL}/"
SCHEDULE_URL = f"{BASE_URL}/schedule/?reschedule=true"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("checker.log"),
    ],
)
log = logging.getLogger(__name__)


# ── Helpers ───────────────────────────────────────────────────────────────────

def month_name(month: int) -> str:
    return datetime(2000, month, 1).strftime("%B")


async def login(page) -> bool:
    """Navigate to the scheduling site and log in."""
    log.info("Navigating to login page…")
    await page.goto(LOGIN_URL, wait_until="networkidle", timeout=60_000)

    # Accept cookies if banner appears
    try:
        await page.click("button:has-text('Accept')", timeout=5_000)
        log.info("Accepted cookie banner.")
    except PlaywrightTimeout:
        pass

    # Fill credentials
    try:
        await page.fill("input[type='email'], input[name*='email'], input[id*='email']", EMAIL, timeout=10_000)
        await page.fill("input[type='password'], input[name*='password'], input[id*='password']", PASSWORD, timeout=10_000)
        await page.click("button[type='submit'], button:has-text('Sign In'), button:has-text('Login')", timeout=10_000)
        await page.wait_for_load_state("networkidle", timeout=30_000)
        log.info("Login submitted.")
        return True
    except PlaywrightTimeout as e:
        log.error(f"Login failed — could not find form elements: {e}")
        return False


async def navigate_to_schedule(page) -> bool:
    """Go to the reschedule/schedule page."""
    log.info(f"Navigating to schedule page: {SCHEDULE_URL}")
    try:
        await page.goto(SCHEDULE_URL, wait_until="networkidle", timeout=60_000)
        return True
    except PlaywrightTimeout as e:
        log.error(f"Failed to load schedule page: {e}")
        return False


async def find_june_slots(page) -> list[str]:
    """
    Scan the calendar on the scheduling page for available dates in June.
    Returns a list of date strings for any available June slots found.
    """
    june_slots = []
    target_month_str = month_name(TARGET_MONTH)  # "June"

    # Wait for the calendar to render
    try:
        await page.wait_for_selector(
            "[class*='calendar'], [class*='Calendar'], [data-testid*='calendar'], table[class*='cal']",
            timeout=20_000,
        )
    except PlaywrightTimeout:
        log.warning("Calendar selector timed out — page structure may have changed.")

    # Strategy 1: intercept network calls (captured via route listener in run_check)
    # Strategy 2: parse the rendered calendar DOM
    page_text = await page.content()

    # Look for date patterns like "2026-06-XX" or "June 2026" with enabled day cells
    date_pattern = re.compile(r"2026-06-(\d{2})")
    found_dates = date_pattern.findall(page_text)

    # Also check via Playwright for enabled/available day elements
    try:
        # Common calendar button selectors that are NOT disabled
        available_buttons = await page.query_selector_all(
            "button[data-date], td[data-date], [class*='day']:not([class*='disabled']):not([class*='unavailable'])"
        )
        for btn in available_buttons:
            data_date = await btn.get_attribute("data-date") or ""
            text = (await btn.inner_text()).strip()
            aria_label = await btn.get_attribute("aria-label") or ""

            # Check if the element corresponds to our target month/year
            if f"{TARGET_YEAR}-{TARGET_MONTH:02d}" in data_date:
                june_slots.append(data_date or aria_label or text)
            elif target_month_str in aria_label and str(TARGET_YEAR) in aria_label:
                june_slots.append(aria_label)
    except Exception as e:
        log.debug(f"DOM calendar scan error: {e}")

    # Also include any dates found via regex in HTML
    for d in found_dates:
        slot = f"{TARGET_YEAR}-{TARGET_MONTH:02d}-{d}"
        if slot not in june_slots:
            june_slots.append(slot)

    return june_slots


async def run_check(playwright) -> list[str]:
    """Launch browser, log in, and check for June slots."""
    browser = await playwright.chromium.launch(
        headless=True,
        args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
    )
    context = await browser.new_context(
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        locale="he-IL",
        timezone_id="Asia/Jerusalem",
    )

    # Intercept API responses that list available dates
    captured_api_dates: list[str] = []

    async def handle_response(response):
        url = response.url
        if any(k in url for k in ["available", "slot", "date", "calendar", "schedule"]):
            try:
                body = await response.text()
                # Look for June dates in the JSON body
                matches = re.findall(
                    rf"{TARGET_YEAR}-{TARGET_MONTH:02d}-\d{{2}}", body
                )
                for m in matches:
                    if m not in captured_api_dates:
                        captured_api_dates.append(m)
                        log.info(f"[API intercept] Found potential slot: {m}")
            except Exception:
                pass

    page = await context.new_page()
    page.on("response", handle_response)

    try:
        logged_in = await login(page)
        if not logged_in:
            log.error("Aborting check — login failed.")
            return []

        navigated = await navigate_to_schedule(page)
        if not navigated:
            return []

        # Give the calendar time to fully render
        await asyncio.sleep(5)

        dom_slots = await find_june_slots(page)
        all_slots = list(set(dom_slots + captured_api_dates))

        # Save a screenshot for debugging
        await page.screenshot(path="last_check.png", full_page=True)
        log.info("Screenshot saved to last_check.png")

        return all_slots

    except Exception as e:
        log.error(f"Unexpected error during check: {e}")
        try:
            await page.screenshot(path="error_screenshot.png", full_page=True)
        except Exception:
            pass
        return []
    finally:
        await context.close()
        await browser.close()


# ── Main loop ─────────────────────────────────────────────────────────────────

async def main():
    if not EMAIL or not PASSWORD:
        log.error(
            "VISA_EMAIL and VISA_PASSWORD must be set in your .env file. "
            "See .env.example for reference."
        )
        return

    log.info(
        f"Starting US Visa Checker — looking for {month_name(TARGET_MONTH)} {TARGET_YEAR} slots. "
        f"Checking every {CHECK_INTERVAL_SECONDS}s."
    )

    notified_slots: set[str] = set()

    async with async_playwright() as playwright:
        while True:
            log.info("━" * 50)
            log.info(f"Running check at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}…")

            try:
                slots = await run_check(playwright)
            except Exception as e:
                log.error(f"run_check raised: {e}")
                slots = []

            if slots:
                new_slots = [s for s in slots if s not in notified_slots]
                if new_slots:
                    msg = (
                        f"🗓️ *US Visa Appointment Alert!*\n\n"
                        f"Found *{len(new_slots)}* available slot(s) in "
                        f"*{month_name(TARGET_MONTH)} {TARGET_YEAR}*:\n\n"
                        + "\n".join(f"  • `{s}`" for s in sorted(new_slots))
                        + f"\n\n👉 [Book now]({SCHEDULE_URL})"
                    )
                    log.info(f"NEW SLOTS FOUND: {new_slots}")
                    send_telegram_message(msg)
                    notified_slots.update(new_slots)
                else:
                    log.info(f"Slots found but already notified: {slots}")
            else:
                log.info(f"No {month_name(TARGET_MONTH)} slots available yet.")

            log.info(f"Sleeping {CHECK_INTERVAL_SECONDS}s until next check…")
            await asyncio.sleep(CHECK_INTERVAL_SECONDS)


if __name__ == "__main__":
    asyncio.run(main())
