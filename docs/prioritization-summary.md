# Prioritization Summary

Explains *why* the phase order in [milestone-summary.md](milestone-summary.md) is what it is. Use this file as the anchor when scope debates arise — every item lists the dependency that justifies its slot.

## Three Buckets

### Must-Have for Pilot

These ship before the first paying host onboards. Cutting any of them means the pilot cannot run.

| Item | Phase | Justifying Dependency |
|---|---|---|
| Persistence layer | 1 | Every downstream phase reads/writes events. In-memory stores cannot survive process restarts or support multi-tenant isolation. |
| GHL ingestion | 2 | Without a live source of retention events, the risk queue and drafts have nothing to operate on. |
| Draft generation service | 3 | Core ReviewJet value prop: assistive drafting. No drafts = no product. |
| Extension parser coverage | 4 | Confidence-gated extraction is the data spine for both ingestion fallback and risk scoring. Drift here breaks Phase 2 + Phase 5. |
| Pilot hardening | 8 | Observability + rollback are non-negotiable before live hosts touch the system. |
| Pilot launch | 9 | The MVP exit criteria require 3+ active pilot hosts. |

### Needed Before Scale

Required for the product to be usable, but the pilot can begin with manual workarounds for short windows.

| Item | Phase | Justifying Dependency |
|---|---|---|
| Dashboard API | 5 | Hosts can be served via Slack/email reports during early pilot, but a real API is needed before host count grows past ~5. |
| Dashboard UI | 6 | Same as above — UI follows API. Consumes endpoints from Phase 5. |
| Weekly digest | 7 | Retention/engagement mechanism. Pilot can run without it for 1–2 weeks, but [kpi-framework.md](kpi-framework.md) thresholds depend on it for measurement. |

### Explicitly Deferred

Out of MVP scope. Listed here so the boundary is unambiguous and future scope debates have an anchor.

| Item | Reason for Deferral |
|---|---|
| Auto-posting / autonomous reply submission | Hard-blocked by [compliance-guardrails.md](compliance-guardrails.md). Not deferred — **forbidden**. |
| Multi-OTA inbox (Booking.com, VRBO, Expedia) | MVP is Airbnb-only per [rentalos-product-architecture.md](rentalos-product-architecture.md). |
| Dynamic pricing | Not part of ReviewJet scope. |
| GuestFlow, AutoRebooker, GhostFilter, SilentButler, CleanerPulse, UpsellMachine, VIPLoop | Future RentalOS modules. Reopen only after ReviewJet pilot exit criteria are met. |
| Persistent queue / distributed worker pool | In-memory + cron is sufficient for pilot scale (≤10 hosts). Revisit in Phase 8 hardening if load testing fails. |

## Why This Order

The sequence is dictated by **data flow**, not feature attractiveness:

1. **Storage before ingestion** — you cannot reliably ingest into something you cannot replay.
2. **Ingestion before drafts** — drafts need real review context.
3. **Parser before dashboard** — KPIs that show garbage extraction destroy host trust faster than no dashboard at all.
4. **Hardening before launch** — the compliance audit log + rollback plan must exist before a real host's reputation is anywhere near our system.

## Trade-offs Accepted

- **No dashboard at pilot day 1.** Hosts get Slack/email summaries in the first sprint. Trade: slower onboarding polish, faster signal on whether the core drafting loop works.
- **In-memory queue retained through Phase 7.** Trade: Phase 8 must include a load smoke test; if it fails, a distributed queue moves into scope.
- **GHL is the only ingestion source.** Trade: hosts not on GHL cannot pilot. Acceptable per [mvp-line1-execution-plan.md](mvp-line1-execution-plan.md).

## How to Reopen This File

When a stakeholder argues an item should move buckets:

1. Identify the dependency they claim is broken.
2. Check whether that dependency is documented in this file or in [mvp-line1-execution-plan.md](mvp-line1-execution-plan.md).
3. If yes → the item stays put. If no → run the [decision-protocol.md](decision-protocol.md) to amend.
