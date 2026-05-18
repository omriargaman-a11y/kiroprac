# 🇺🇸 US Visa Appointment Checker

A Python bot that **continuously monitors [usvisascheduling.com](https://www.usvisascheduling.com/he-IL/schedule/?reschedule=true)** for available appointment slots in **June** and **sends you a Telegram notification** the moment one opens up.

---

## How It Works

1. Launches a headless Chromium browser via **Playwright** (bypasses JavaScript/Cloudflare).
2. Logs into the scheduling site with your credentials.
3. Navigates to the reschedule calendar page.
4. Scans the calendar DOM **and** intercepts API network responses for June dates.
5. If any June slots are found → fires a **Telegram message** with the dates and a direct booking link.
6. Sleeps for the configured interval, then repeats.

```
┌──────────────────────────────────────────┐
│  checker.py  ──► login ──► calendar scan │
│      │                                   │
│      └──► June slot found?               │
│               YES → notifier.py          │
│                       └──► Telegram 📲  │
└──────────────────────────────────────────┘
```

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| Python 3.10+ | Tested on 3.11 |
| A valid account on [usvisascheduling.com](https://www.usvisascheduling.com) | Required to view the calendar |
| A Telegram Bot | Free — see setup below |

---

## Quick Start

### 1. Clone & enter the repo

```bash
git clone https://github.com/omriargaman-a11y/kiroprac.git
cd kiroprac
```

### 2. Configure your `.env`

```bash
cp .env.example .env
nano .env   # (or open in any editor)
```

Fill in:

| Variable | Description |
|----------|-------------|
| `VISA_EMAIL` | Your usvisascheduling.com login email |
| `VISA_PASSWORD` | Your usvisascheduling.com password |
| `TARGET_YEAR` | Year to watch (default `2026`) |
| `TARGET_MONTH` | Month to watch — `6` for June |
| `CHECK_INTERVAL_SECONDS` | Seconds between checks (default `120`) |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token |
| `TELEGRAM_CHAT_ID` | Your personal Telegram chat ID |

### 3. Set up a Telegram Bot (5 minutes)

1. Open Telegram → search **@BotFather** → `/newbot`
2. Follow the prompts → copy the **token** into `TELEGRAM_BOT_TOKEN`
3. Send any message to your new bot
4. Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
5. Copy the **`id`** field inside `"chat"` into `TELEGRAM_CHAT_ID`

Test it works:
```bash
bash run.sh --test-telegram
```

### 4. Run

```bash
bash run.sh
```

This will:
- Create a Python virtual environment
- Install all dependencies
- Install Playwright's Chromium browser
- Start the checker loop

---

## Running Continuously (Server / Background)

If you want it to keep running after you close the terminal:

```bash
# Using nohup
nohup bash run.sh > checker.log 2>&1 &
echo $! > checker.pid

# Stop it later
kill $(cat checker.pid)
```

Or use **screen**:
```bash
screen -S visa-checker
bash run.sh
# Detach: Ctrl+A then D
# Re-attach: screen -r visa-checker
```

---

## Files

```
kiroprac/
├── checker.py        # Main loop — login, scan, detect slots
├── notifier.py       # Telegram notification sender
├── requirements.txt  # Python dependencies
├── .env.example      # Configuration template
├── run.sh            # Setup + launch script
└── README.md
```

---

## ⚠️ Important Notes

- **Don't set `CHECK_INTERVAL_SECONDS` below 60** — checking too frequently may trigger rate limits or get your account flagged.
- The script saves a **screenshot** (`last_check.png`) after each check, useful for debugging.
- If the site's HTML structure changes, the selectors in `checker.py → find_june_slots()` may need updating.
- This tool is for **personal use only** — please respect the site's Terms of Service.

---

## Notification Example

When a slot is found, you'll receive a Telegram message like:

> 🗓️ **US Visa Appointment Alert!**
>
> Found **2** available slot(s) in **June 2026**:
>
> • `2026-06-10`
> • `2026-06-17`
>
> 👉 [Book now](https://www.usvisascheduling.com/he-IL/schedule/?reschedule=true)
