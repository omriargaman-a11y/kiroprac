#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# run.sh — One-shot setup + launch script for the US Visa Checker
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo "=============================="
echo " US Visa Appointment Checker  "
echo "=============================="

# 1. Create & activate virtual environment (if not already present)
if [ ! -d ".venv" ]; then
  echo "[1/4] Creating Python virtual environment…"
  python3 -m venv .venv
else
  echo "[1/4] Virtual environment already exists."
fi

source .venv/bin/activate

# 2. Install Python dependencies
echo "[2/4] Installing Python dependencies…"
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

# 3. Install Playwright browser (Chromium only — smallest footprint)
echo "[3/4] Installing Playwright Chromium…"
playwright install chromium

# 4. Copy .env if not present
if [ ! -f ".env" ]; then
  echo "[4/4] .env not found — copying from .env.example"
  cp .env.example .env
  echo ""
  echo "⚠️  Please edit .env and fill in your credentials before re-running!"
  echo "    nano .env"
  exit 1
else
  echo "[4/4] .env found."
fi

# 5. Optional: test Telegram first
if [ "$1" == "--test-telegram" ]; then
  echo ""
  echo "Testing Telegram notification…"
  python notifier.py
  exit 0
fi

# 6. Run the checker
echo ""
echo "Starting checker… (Ctrl+C to stop)"
echo "Logs are written to checker.log"
echo ""
python checker.py
