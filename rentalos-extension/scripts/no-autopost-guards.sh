#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Patterns that indicate message submission automation.
read -r -d '' PROHIBITED_PATTERNS <<'PATTERNS' || true
\.submit\s*\(
\.click\s*\(
button\[type=['\"]submit['\"]\]
(data-testid|aria-label).*(send|reply|post)
dispatchEvent\s*\(\s*new\s+Event\s*\(\s*['\"]submit['\"]
PATTERNS

fail=0
while IFS= read -r pattern; do
  [[ -z "$pattern" ]] && continue
  if rg -n --glob '!scripts/no-autopost-guards.sh' "$pattern" "$ROOT_DIR/src"; then
    echo "[compliance] blocked prohibited extension pattern: $pattern"
    fail=1
  fi
done <<< "$PROHIBITED_PATTERNS"

exit "$fail"
