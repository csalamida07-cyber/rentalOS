#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Block implementation of automation-oriented posting routes.
if rg -n --glob '!scripts/no-autopost-endpoints.sh' --glob '!tests/**' '(app|router)\.post\s*\(\s*["'"'"']\/airbnb\/(auto-post|send-reply|post-reply)' "$ROOT_DIR/src"; then
  echo "[compliance] blocked prohibited API posting route"
  exit 1
fi

if rg -n --glob '!scripts/no-autopost-endpoints.sh' --glob '!tests/**' '(autoPost|sendReply|postReply)\s*\(' "$ROOT_DIR/src"; then
  echo "[compliance] blocked prohibited API automation function"
  exit 1
fi
