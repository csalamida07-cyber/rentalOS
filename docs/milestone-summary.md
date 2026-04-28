# Milestone Summary

Single board for ReviewJet MVP delivery. Update the **Status** and **Signed Off** columns as phases progress. Source of truth for *what* is being built sits in [mvp-line1-execution-plan.md](mvp-line1-execution-plan.md); this file tracks *where we are*.

## Roles

| Role | Drives | Signs Off |
|---|---|---|
| **CEO** | Scope, priority, business outcome | Phase exit |
| **Orchestrator** | Sequencing, dependencies, decision-protocol enforcement | Phase entry (gate open) |
| **Builder** | Implementation + tests for the phase | Hands off to Developer |
| **Developer (Reviewer)** | Independent triple-check: (1) does it work, (2) does it break anything, (3) does it violate any guardrail | Audit pass before CEO sign-off |

Per-phase loop: **CEO sets intent → Orchestrator scopes → Builder implements → Developer audits → CEO signs off → next phase opens.**

## Phases

| # | Phase | Owner (drives) | Deliverable | Exit Criteria | Status | CEO Signed Off |
|---|---|---|---|---|---|---|
| 0 | Discovery & Lock | CEO + Orchestrator | Scope frozen to ReviewJet only; future modules explicitly deferred | CEO sign-off on scope; no parallel module work | Not Started | — |
| 1 | Persistence Foundation | Builder | Real DB (Postgres) replacing in-memory stores | All existing Vitest tests pass against DB; `event_id` idempotency preserved | Not Started | — |
| 2 | GHL Ingestion | Builder | GHL → canonical event mapper | Contract test green; replays idempotent | Not Started | — |
| 3 | Draft Generation Service | Builder | LLM-backed reply drafts + safety linter | Compliance script blocks `mode: "posted"`; audit log on every draft | Not Started | — |
| 4 | Extension Parser Coverage | Builder | DOM parser passing fixture set | Parser contract tests green; extraction confidence >80% | Not Started | — |
| 5 | Dashboard API | Builder | KPI aggregation endpoints per [kpi-framework.md](kpi-framework.md) | Each KPI returns from a real query | Not Started | — |
| 6 | Dashboard UI | Builder | Host-facing dashboard (risk queue, drafts, KPIs) | Three pilot screens render against real API | Not Started | — |
| 7 | Weekly Digest | Builder | Scheduled digest email service | Digest sent to test host; opt-out honored | Not Started | — |
| 8 | Pilot Hardening | Builder + Developer | Observability, audit review, smoke test, rollback plan | Compliance CI green; logs queryable; rollback documented | Not Started | — |
| 9 | Pilot Launch | CEO + Orchestrator | 3 hosts onboarded with instrumentation live | Exit criteria from [mvp-line1-execution-plan.md](mvp-line1-execution-plan.md) met | Not Started | — |

## Gate Rules

1. **No phase starts** until the previous phase is signed off by CEO.
2. **Developer audit is mandatory** — the Builder cannot self-approve.
3. **Compliance CI must be green** at every phase exit (see [compliance-guardrails.md](compliance-guardrails.md)).
4. **Contract changes are additive only** per [event-contracts.md](event-contracts.md). No phase mutates a live contract.
5. **Disagreements** follow the [decision-protocol.md](decision-protocol.md) — 2 rounds max, then forced Final Vote.

## Status Legend

- **Not Started** — phase not opened
- **In Progress** — Builder working
- **In Review** — Developer auditing
- **Blocked** — flagged in decision protocol, awaiting resolution
- **Done** — CEO signed off
