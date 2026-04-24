# Compliance Guardrails

This document defines code-level guardrails that prevent automated posting behavior and keep the platform limited to assistive reply generation.

## Scope

- Browser extension code under `rentalos-extension/`.
- API code under `rentalos-api/`.

## Acceptance Criteria

### 1) Extension permissions are minimized

- `manifest.json` uses the minimum host permission scope required for read-only inbox context.
- Wildcard host permissions (for example, `https://*/*`) are prohibited.
- Permissions that can be used for autonomous execution (`alarms`, `declarativeNetRequest`, broad background automation patterns) are prohibited unless explicitly justified in a compliance review.

### 2) Message submission DOM actions are prohibited

Code in `rentalos-extension/` must not:

- Call `form.submit()`.
- Click UI controls associated with send/reply/post actions.
- Dispatch synthetic submit/click events to trigger sending.

Prohibited selector/API examples:

- `button[type='submit']`
- `button[data-testid*='send']`
- `button[data-testid*='reply']`
- `.click()` on send/reply/post elements
- `dispatchEvent(new Event('submit'))`

### 3) Static compliance checks must block prohibited patterns

- CI runs static guard scripts for both extension and API.
- Guard scripts fail the build if prohibited APIs/selectors or endpoint names are introduced.
- Required checks:
  - `rentalos-extension/scripts/no-autopost-guards.sh`
  - `rentalos-api/scripts/no-autopost-endpoints.sh`

### 4) Outbound operations require explicit user initiation

- Any outbound operation (even non-posting actions) must require an explicit user event.
- Guard logic must reject non-user events (`event.isTrusted !== true`) and missing explicit action intents.
- No timers, background listeners, or autonomous loops may trigger outbound message actions.

### 5) API posting automation is rejected

- API routes that imply automatic posting to Airbnb are forbidden.
- Only generation/review endpoints are allowed.
- Any request attempting `mode: "posted"` or equivalent is rejected.

### 6) Audit logging for generation-only workflow

- Reply-generation actions must create audit log entries with `action: "generated_only"`.
- Logged records must never contain `action: "posted"`.
- Logs should include actor, listing/conversation context, and UTC timestamp.

### 7) Compliance tests are mandatory

- Test suite must validate that no automation path exists:
  - Posted-mode requests are rejected.
  - Audit logs are generated as `generated_only`.
  - Static checks fail when prohibited patterns are present.

## Allowed vs Prohibited Actions

### Allowed

- Generate a draft reply for user review.
- Read Airbnb conversation context from allowed host pages.
- Copy draft text to clipboard on explicit user click.
- Display recommended response templates.

### Prohibited

- Programmatically posting a reply to Airbnb.
- Clicking send/reply/post buttons through script.
- Submitting forms automatically or by synthetic events.
- API endpoints named or implemented for auto-post/send behavior.

## Review Checklist

- [ ] `manifest.json` host permissions are narrowed and justified.
- [ ] Extension static guard script passes.
- [ ] API static guard script passes.
- [ ] Compliance tests pass.
- [ ] No `posted` action appears in generation audit logs.
