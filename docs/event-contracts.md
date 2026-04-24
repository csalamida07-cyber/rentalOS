# Event Contracts

This document defines the common event envelope for all asynchronous publishers and the cross-service schema evolution policy.

## Standard event envelope (required)

All published async events MUST use the same envelope.

| Field | Type | Required | Rules |
|---|---|---|---|
| `event_id` | `string` (UUIDv7) | Yes | Globally unique event identifier; immutable. |
| `event_type` | `string` | Yes | Namespaced dot notation (e.g., `review.created`, `risk.assessment.updated`). |
| `version` | `string` | Yes | Contract schema version in semver major.minor format (e.g., `1.2`). |
| `occurred_at` | `string` datetime | Yes | RFC 3339 UTC timestamp for domain occurrence time. |
| `tenant_id` | `string` (UUIDv7) | Yes | Tenant partition key. |
| `payload` | `object` | Yes | Event-specific object constrained by the event schema/version. |
| `trace_id` | `string` | Yes | Distributed trace correlation ID; must propagate from request context when present. |

### Envelope invariants

- Publishers MUST NOT omit required envelope fields.
- Consumers MUST ignore unknown top-level fields to preserve forward compatibility.
- `event_id` SHOULD be used for consumer-side deduplication (exactly-once semantics are not assumed).
- `occurred_at` reflects business-event time, not broker enqueue time.

## Versioning and backward compatibility rules

### 1) Additive-first schema evolution

- Prefer additive changes (new optional fields, new enum values with safe defaults) over breaking changes.
- Existing required fields MUST keep semantics and type compatibility within a major version.
- Removing or renaming fields is forbidden in-place; introduce replacements first.

### 2) Deprecation window

- Deprecated fields or event types MUST be announced and documented before removal.
- Minimum deprecation period is **two release cycles or 90 days** (whichever is longer).
- During deprecation, publishers SHOULD emit both legacy and replacement fields/events when feasible.
- Removal is allowed only after all known consumers are verified migrated.

### 3) Contract test requirement before deployment

- Any producer schema change MUST include/update automated contract tests.
- Producer deployment is blocked unless contract tests pass in CI against:
  - producer schema validation,
  - at least one consumer compatibility suite (or shared pact/contracts),
  - regression fixtures for prior minor versions in the same major line.
- Breaking changes require major version increment and explicit migration plan.

## Publisher and consumer responsibilities

### Publisher responsibilities

- Validate envelope + payload against the declared versioned schema before publish.
- Ensure idempotent publication retries (same `event_id` for retried publish attempt).
- Publish documentation updates for new event types/versions in the same change.

### Consumer responsibilities

- Validate minimally required envelope fields.
- Be tolerant to additive fields in envelope and payload.
- Handle duplicate events via `event_id` and deterministic processing keys.
- Reject unsupported major versions with observable error telemetry.

## Example event envelope

```json
{
  "event_id": "0195f6e3-6d6b-7f21-8c73-1a5f8f3b1df9",
  "event_type": "analysis.result.created",
  "version": "1.0",
  "occurred_at": "2026-03-04T06:00:00Z",
  "tenant_id": "0195f6dc-2b60-7e0c-b28f-0d3470ea1d0f",
  "payload": {
    "analysis_result_id": "0195f6e3-2baf-7b1e-a603-5f43f46e76a6",
    "review_id": "0195f6df-6c91-7f68-a624-caf8f33bc17a",
    "sentiment_score": 0.82
  },
  "trace_id": "2af25cebf7da4d6caaf40fceea0fef4d"
}
```
