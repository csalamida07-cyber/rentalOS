# RentalOS MVP Line 1 Execution Plan

This plan operationalizes the MVP scope for **Retention & Reputation Recovery** for Airbnb hosts and managers. It is intentionally constrained to a single product line so the team can ship quickly and validate value before expanding into adjacent workflows.

## Product Scope (Line 1 only)

### In scope
- Post-stay review request performance analytics (via GHL-connected lifecycle data).
- Negative sentiment triage and risk queue.
- Assistive response draft generation with compliance/safety checks.
- User-initiated Chrome extension panel for in-context draft assistance.
- Weekly digest with prioritized actions.

### Out of scope
- Dynamic pricing and revenue management.
- Turnover or maintenance operations.
- Multi-OTA unified inbox.
- Autonomous posting or unattended automations on Airbnb surfaces.

## Linear/Jira-Ready Backlog

> Use the naming format below to keep roadmap filtering clean:
> - **Epic key:** `MVP-L1-*`
> - **Story key:** `MVP-L1-<epic>-<story#>`
> - **Task key:** `MVP-L1-<epic>-<story#>-<task#>`

---

## Epic: MVP-L1-FOUNDATION

### Story: MVP-L1-FOUNDATION-1 — Define event taxonomy and schemas
**Description**
Create a canonical event dictionary for retention/reputation flows and enforce schema validation to ensure consistent analytics and downstream automations.

**Acceptance criteria**
- Event dictionary is published and versioned.
- Required fields are enforced via schema validator.
- Invalid payloads are rejected with clear error reasons.

**Tasks**
- MVP-L1-FOUNDATION-1-1: Define event names and required properties.
- MVP-L1-FOUNDATION-1-2: Implement JSON schema validation.
- MVP-L1-FOUNDATION-1-3: Add test fixtures for valid/invalid payloads.

---

### Story: MVP-L1-FOUNDATION-2 — Build baseline KPI aggregation jobs
**Description**
Implement daily KPI aggregation jobs for the MVP scorecard so product and pilot teams can monitor trend lines and intervention impact.

**Acceptance criteria**
- Aggregates compute on schedule and are queryable per workspace/listing/date range.
- Formula tests validate all KPI calculations.
- Re-runs are idempotent.

**Tasks**
- MVP-L1-FOUNDATION-2-1: Add aggregation pipeline for conversion, yield, SLA, adoption.
- MVP-L1-FOUNDATION-2-2: Add idempotent backfill routine.
- MVP-L1-FOUNDATION-2-3: Write unit tests for formulas and edge cases.

---

## Epic: MVP-L1-GHL

### Story: MVP-L1-GHL-1 — Ingest GHL review request lifecycle data
**Description**
Map GHL automation events into RentalOS canonical events and persist sequence metadata for variant and timing analysis.

**Acceptance criteria**
- GHL events are mapped to canonical lifecycle states.
- Sequence variant metadata is persisted.
- Duplicate inbound events do not double-count metrics.

**Tasks**
- MVP-L1-GHL-1-1: Implement event mapper service.
- MVP-L1-GHL-1-2: Persist variant/timing identifiers.
- MVP-L1-GHL-1-3: Add idempotency key checks and tests.

---

### Story: MVP-L1-GHL-2 — Expose sequence performance API
**Description**
Provide API endpoints to compare review request variants by conversion and sentiment outcomes.

**Acceptance criteria**
- Endpoint supports workspace/listing/date filters.
- Endpoint groups by variant/timing bucket.
- Contract tests verify response shape and determinism.

**Tasks**
- MVP-L1-GHL-2-1: Implement API endpoint.
- MVP-L1-GHL-2-2: Add query optimization/indexes as needed.
- MVP-L1-GHL-2-3: Add contract and integration tests.

---

## Epic: MVP-L1-DASHBOARD

### Story: MVP-L1-DASHBOARD-1 — Deliver retention dashboard shell
**Description**
Ship the first user-facing dashboard with KPI cards and global filters so hosts can immediately assess retention and reputation health.

**Acceptance criteria**
- Dashboard loads with date/listing filters.
- KPI cards render for selected filters.
- Empty states and loading states are handled.

**Tasks**
- MVP-L1-DASHBOARD-1-1: Build route and page shell.
- MVP-L1-DASHBOARD-1-2: Add shared filter components.
- MVP-L1-DASHBOARD-1-3: Implement KPI card components.

---

### Story: MVP-L1-DASHBOARD-2 — Add sequence comparison view
**Description**
Enable hosts to compare request variants and identify top-performing message/timing combinations.

**Acceptance criteria**
- Variant comparison table/chart is available.
- Lift/downtrend indicators are shown.
- Sorting and filtering are supported.

**Tasks**
- MVP-L1-DASHBOARD-2-1: Implement table/chart widgets.
- MVP-L1-DASHBOARD-2-2: Add ranking and delta calculations.
- MVP-L1-DASHBOARD-2-3: Add UI tests for sorting/filter behavior.

---

## Epic: MVP-L1-RISK

### Story: MVP-L1-RISK-1 — Sentiment scoring and issue tagging
**Description**
Classify review sentiment and map issue categories to create actionable risk records.

**Acceptance criteria**
- Incoming reviews receive sentiment label and confidence score.
- Risk categories are attached (e.g., cleanliness, communication).
- Negative reviews generate risk queue items.

**Tasks**
- MVP-L1-RISK-1-1: Implement sentiment pipeline.
- MVP-L1-RISK-1-2: Implement issue category tagging.
- MVP-L1-RISK-1-3: Persist reason codes and confidence values.

---

### Story: MVP-L1-RISK-2 — Build prioritized risk queue UI
**Description**
Provide a queue sorted by severity and age so hosts can process the highest-impact items first.

**Acceptance criteria**
- Queue ranks items by severity and staleness.
- Each item displays reason tags and timestamps.
- Quick actions include generate draft and mark resolved.

**Tasks**
- MVP-L1-RISK-2-1: Implement queue sorting logic.
- MVP-L1-RISK-2-2: Build queue row UI and action controls.
- MVP-L1-RISK-2-3: Add E2E workflow test for triage flow.

---

## Epic: MVP-L1-DRAFTS

### Story: MVP-L1-DRAFTS-1 — Generate assistive response drafts
**Description**
Create a drafting service that produces editable response suggestions based on review context and selected tone.

**Acceptance criteria**
- Draft generation supports at least 3 tone presets.
- Median response time is below 8 seconds in pilot environment.
- Regenerate action produces alternatives.

**Tasks**
- MVP-L1-DRAFTS-1-1: Build draft generation endpoint.
- MVP-L1-DRAFTS-1-2: Add tone preset controls.
- MVP-L1-DRAFTS-1-3: Add performance instrumentation and alerts.

---

### Story: MVP-L1-DRAFTS-2 — Add compliance and safety linter
**Description**
Run generated drafts through policy and quality checks before copy/export.

**Acceptance criteria**
- Linter runs on every generated draft.
- Warnings explain risky language and suggest alternatives.
- Linter outcomes are logged for audit.

**Tasks**
- MVP-L1-DRAFTS-2-1: Implement rule checks.
- MVP-L1-DRAFTS-2-2: Build warning UI and suggested fix copy.
- MVP-L1-DRAFTS-2-3: Add audit log write path.

---

### Story: MVP-L1-DRAFTS-3 — Enforce copy-only host action
**Description**
Ensure response usage is explicitly user-driven, with no auto-posting behavior.

**Acceptance criteria**
- Copy action requires explicit user click.
- No auto-send code path exists.
- Usage metrics are emitted on copy action.

**Tasks**
- MVP-L1-DRAFTS-3-1: Implement explicit copy interaction.
- MVP-L1-DRAFTS-3-2: Add static guard checks against autopost hooks.
- MVP-L1-DRAFTS-3-3: Emit analytics event on copy.

---

## Epic: MVP-L1-EXTENSION

### Story: MVP-L1-EXTENSION-1 — Ship extension panel shell and auth
**Description**
Deliver a minimal extension UI with authenticated session handoff to RentalOS services.

**Acceptance criteria**
- Panel loads on supported Airbnb pages.
- User session is validated before actions.
- Permissions are minimal and documented.

**Tasks**
- MVP-L1-EXTENSION-1-1: Implement extension panel shell.
- MVP-L1-EXTENSION-1-2: Add auth handoff and token refresh handling.
- MVP-L1-EXTENSION-1-3: Validate permission scope in manifest.

---

### Story: MVP-L1-EXTENSION-2 — User-initiated context extraction
**Description**
Capture review context only when the user explicitly requests analysis.

**Acceptance criteria**
- Extraction is initiated by explicit click only.
- No background scraping loop is implemented.
- Captured fields are minimized and documented.

**Tasks**
- MVP-L1-EXTENSION-2-1: Add analyze button and click handler.
- MVP-L1-EXTENSION-2-2: Implement minimal context parser.
- MVP-L1-EXTENSION-2-3: Add tests for allowlisted field capture.

---

### Story: MVP-L1-EXTENSION-3 — Display draft + warnings + copy
**Description**
Render generated draft and lint warnings in-panel, then allow host copy action.

**Acceptance criteria**
- Draft and warning states are clearly rendered.
- Copy action succeeds with clear feedback.
- Deep link back to RentalOS risk item is available.

**Tasks**
- MVP-L1-EXTENSION-3-1: Build draft/warning panel state machine.
- MVP-L1-EXTENSION-3-2: Add copy interaction + success feedback.
- MVP-L1-EXTENSION-3-3: Add deep link handler to web app.

---

## Epic: MVP-L1-DIGEST

### Story: MVP-L1-DIGEST-1 — Generate weekly action digest
**Description**
Create a weekly summary with KPI trends and top recommended actions.

**Acceptance criteria**
- Digest includes week-over-week KPI deltas.
- Includes top 3 recommendations and at-risk listings.
- Per-workspace generation is scheduled and tracked.

**Tasks**
- MVP-L1-DIGEST-1-1: Implement digest assembly service.
- MVP-L1-DIGEST-1-2: Add recommendation ranking logic.
- MVP-L1-DIGEST-1-3: Add generation job monitoring.

---

### Story: MVP-L1-DIGEST-2 — Deliver digest via email
**Description**
Deliver digest to workspace admins/managers with deep links for immediate action.

**Acceptance criteria**
- Digest email sends to configured recipients.
- Delivery status and bounce outcomes are tracked.
- Links navigate directly to relevant app views.

**Tasks**
- MVP-L1-DIGEST-2-1: Integrate email provider transport.
- MVP-L1-DIGEST-2-2: Add delivery status tracking.
- MVP-L1-DIGEST-2-3: QA deep links and template rendering.

---

## Epic: MVP-L1-OPERATIONS

### Story: MVP-L1-OPERATIONS-1 — Pilot onboarding runbook
**Description**
Standardize pilot onboarding so customers can reach first value quickly and consistently.

**Acceptance criteria**
- Onboarding checklist is complete and reusable.
- Teams can complete onboarding under 10 minutes for qualified pilots.
- First data ingestion verification step is included.

**Tasks**
- MVP-L1-OPERATIONS-1-1: Publish onboarding checklist.
- MVP-L1-OPERATIONS-1-2: Add workspace setup verification script.
- MVP-L1-OPERATIONS-1-3: Add pilot handoff template.

---

### Story: MVP-L1-OPERATIONS-2 — Observability and failure alerting
**Description**
Add telemetry and alerts for ingestion, scoring, and digest pipelines.

**Acceptance criteria**
- Structured logs include trace IDs.
- Alerts trigger for failure rate thresholds.
- Dead-letter queue or retry path is in place.

**Tasks**
- MVP-L1-OPERATIONS-2-1: Add trace identifiers across services.
- MVP-L1-OPERATIONS-2-2: Configure alert policies.
- MVP-L1-OPERATIONS-2-3: Implement retry/dead-letter handling.

---

## Epic: MVP-L1-COMPLIANCE

### Story: MVP-L1-COMPLIANCE-1 — Enforce data minimization and retention
**Description**
Apply privacy-by-design by limiting collected fields and setting retention controls.

**Acceptance criteria**
- Data inventory is documented.
- Retention window configuration exists.
- Pseudonymization is applied where feasible.

**Tasks**
- MVP-L1-COMPLIANCE-1-1: Publish field-level data inventory.
- MVP-L1-COMPLIANCE-1-2: Add retention configuration and cleanup job.
- MVP-L1-COMPLIANCE-1-3: Implement pseudonymization for identifiers.

---

### Story: MVP-L1-COMPLIANCE-2 — Implement deletion/export admin workflows
**Description**
Support account-level data lifecycle requests with auditability.

**Acceptance criteria**
- Admins can request export/deletion.
- Actions are logged with actor, timestamp, scope.
- End-to-end test verifies removal from primary stores.

**Tasks**
- MVP-L1-COMPLIANCE-2-1: Build admin endpoint for export/deletion requests.
- MVP-L1-COMPLIANCE-2-2: Add audit logging for requests/outcomes.
- MVP-L1-COMPLIANCE-2-3: Add integration tests for deletion propagation.

---

## RACI (MVP Line 1)

Roles:
- **FOUNDER/PM**: Product lead and pilot owner.
- **ENG**: Engineering team (backend + extension + frontend).
- **DESIGN**: Product design / UX.
- **DATA/ML**: Analytics and sentiment/risk modeling.
- **COMPLIANCE**: Legal/privacy/compliance reviewer.
- **CS**: Customer success / pilot implementation.

| Workstream | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I) |
|---|---|---|---|---|
| Event taxonomy + KPI definitions | DATA/ML | FOUNDER/PM | ENG, CS | COMPLIANCE, DESIGN |
| GHL ingestion + mapping | ENG | ENG Lead | FOUNDER/PM, DATA/ML | CS |
| Dashboard UX + delivery | DESIGN, ENG | FOUNDER/PM | CS, DATA/ML | COMPLIANCE |
| Sentiment/risk pipeline | DATA/ML, ENG | DATA/ML Lead | FOUNDER/PM, CS | COMPLIANCE |
| Draft generation service | ENG | ENG Lead | FOUNDER/PM, COMPLIANCE | CS |
| Safety/compliance linter | ENG, COMPLIANCE | COMPLIANCE Lead | FOUNDER/PM | CS, DESIGN |
| Chrome extension panel | ENG | ENG Lead | DESIGN, COMPLIANCE | FOUNDER/PM |
| Weekly digest + recommendations | DATA/ML, ENG | FOUNDER/PM | CS | COMPLIANCE |
| Pilot onboarding and feedback loops | CS | FOUNDER/PM | ENG, DESIGN | COMPLIANCE |
| Data retention + deletion workflows | ENG, COMPLIANCE | COMPLIANCE Lead | FOUNDER/PM | CS |

## Sprint Priority Order (Most important first)

1. **Foundation + GHL ingestion + KPI baseline**
2. **Dashboard shell + Risk queue**
3. **Draft assistant + copy-only controls + safety linter**
4. **Extension panel (user-initiated)**
5. **Weekly digest + pilot hardening**
6. **Deletion/export workflows and reliability hardening completion**

## MVP Exit Criteria

- Three or more pilot hosts are active weekly.
- Negative-review response SLA improves by at least 20% from baseline.
- Draft assistant is used on at least 50% of flagged items.
- At least one message variant shows measurable conversion lift.
- No auto-post or unattended automation path exists in extension/API flows.
