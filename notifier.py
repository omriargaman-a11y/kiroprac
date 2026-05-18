"""
Telegram Notifier
Sends a message to your Telegram chat via a Bot.

Setup:
  1. Talk to @BotFather on Telegram → create a bot → get the TOKEN.
  2. Send any message to your bot, then visit:
       https://api.telegram.org/bot<TOKEN>/getUpdates
     and note your numeric CHAT_ID.
  3. Add both to your .env file.
"""

import logging
import os

import requests
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

log = logging.getLogger(__name__)


def send_telegram_message(text: str) -> bool:
    """
    Send a Markdown-formatted message via Telegram Bot API.
    Returns True on success, False on failure.
    """
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        log.warning(
            "Telegram is not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing). "
            "Message not sent:\n%s",
            text,
        )
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False,
    }

    try:
        resp = requests.post(url, json=payload, timeout=15)
        resp.raise_for_status()
        log.info("Telegram message sent successfully.")
        return True
    except requests.RequestException as e:
        log.error(f"Failed to send Telegram message: {e}")
        return False


def test_telegram() -> None:
    """Quick sanity-check — run this standalone to verify your bot works."""
    result = send_telegram_message(
        "✅ *Test Message*\nYour US Visa checker bot is configured correctly!"
    )
    if result:
        print("✅ Telegram message sent successfully!")
    else:
        print("❌ Failed to send message. Check your .env values.")


if __name__ == "__main__":
    test_telegram()
