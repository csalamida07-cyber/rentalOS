# Domain Model (Canonical Entities)

This document defines canonical entities shared across rentalOS services, including required fields, validation constraints, identifier conventions, timestamps, idempotency requirements, and service ownership boundaries.

## Global conventions

- **Identifier format**: All primary IDs are strings in UUIDv7 format unless explicitly noted.
- **Timestamps**: All timestamps are required RFC 3339 / ISO-8601 UTC strings (e.g., `2026-03-04T06:00:00Z`).
- **Tenant scoping**: All entities are tenant-scoped and MUST include `tenant_id`.
- **Idempotency key handling**:
  - `idempotency_key` is required for write operations that can be retried.
  - Writers MUST enforce uniqueness per `(tenant_id, entity_type, idempotency_key)` for at least 24h.
- **Audit fields**:
  - `created_at` and `updated_at` are required on all persisted entities.
  - `updated_at` MUST be greater than or equal to `created_at`.
- **Soft delete**: Where deletion is supported, use nullable `deleted_at`; hard deletion is an operational concern.

---

## 1) User

### Ownership boundary
- **Writer service**: `identity-service`
- Other services MAY cache or index User records but MUST NOT authoritatively mutate canonical fields.

### Required fields
| Field | Type | Rules |
|---|---|---|
| `user_id` | `string` (UUIDv7) | Primary key, immutable, globally unique. |
| `tenant_id` | `string` (UUIDv7) | Required, immutable after create. |
| `email` | `string` | Required, lowercase, valid RFC 5322 email, unique per tenant among active users. |
| `display_name` | `string` | Required, 1-120 chars, trimmed, no control chars. |
| `role` | `enum` | Required: `tenant_admin`, `property_manager`, `analyst`, `viewer`. |
| `status` | `enum` | Required: `active`, `invited`, `suspended`, `deleted`. |
| `created_at` | `string` datetime | Required. |
| `updated_at` | `string` datetime | Required. |
| `idempotency_key` | `string` | Required for create/update commands, max 128 chars. |

---

## 2) Property

### Ownership boundary
- **Writer service**: `property-service`
- Read-only copies may exist in analytics/reporting stores.

### Required fields
| Field | Type | Rules |
|---|---|---|
| `property_id` | `string` (UUIDv7) | Primary key, immutable. |
| `tenant_id` | `string` (UUIDv7) | Required, immutable. |
| `external_ref` | `string` | Required, 1-64 chars, unique per tenant. |
| `name` | `string` | Required, 1-200 chars, trimmed. |
| `address` | `object` | Required; contains `line1`, `city`, `region`, `postal_code`, `country_code` (ISO-3166-1 alpha-2). |
| `unit_count` | `integer` | Required, `>= 0`. |
| `status` | `enum` | Required: `active`, `inactive`, `archived`. |
| `created_at` | `string` datetime | Required. |
| `updated_at` | `string` datetime | Required. |
| `idempotency_key` | `string` | Required for create/update commands, max 128 chars. |

---

## 3) Review

### Ownership boundary
- **Writer service**: `review-service`
- Ingestion adapters may submit data, but canonical writes are normalized by `review-service`.

### Required fields
| Field | Type | Rules |
|---|---|---|
| `review_id` | `string` (UUIDv7) | Primary key. |
| `tenant_id` | `string` (UUIDv7) | Required. |
| `property_id` | `string` (UUIDv7) | Required, must reference existing Property in same tenant. |
| `author_user_id` | `string` (UUIDv7) | Required if internal author exists; otherwise use `source_author`. |
| `source_author` | `string` | Required when `author_user_id` absent, 1-120 chars. |
| `rating` | `number` | Required, scale `1.0` to `5.0`, increments of `0.5`. |
| `title` | `string` | Optional, max 140 chars. |
| `body` | `string` | Required, 1-10,000 chars, UTF-8 normalized. |
| `reviewed_at` | `string` datetime | Required, cannot be in the future by more than 5 minutes. |
| `created_at` | `string` datetime | Required. |
| `updated_at` | `string` datetime | Required. |
| `idempotency_key` | `string` | Required for ingestion/creation command dedupe. |

---

## 4) AnalysisResult

### Ownership boundary
- **Writer service**: `analysis-service`
- Immutable analytical output generated from Review/Property/User context.

### Required fields
| Field | Type | Rules |
|---|---|---|
| `analysis_result_id` | `string` (UUIDv7) | Primary key. |
| `tenant_id` | `string` (UUIDv7) | Required. |
| `review_id` | `string` (UUIDv7) | Required, same tenant. |
| `property_id` | `string` (UUIDv7) | Required, same tenant. |
| `model_name` | `string` | Required, 1-100 chars. |
| `model_version` | `string` | Required semantic version string. |
| `sentiment_score` | `number` | Required, range `-1.0` to `1.0`. |
| `topic_labels` | `array<string>` | Required, 1-25 items, unique values. |
| `summary` | `string` | Required, 1-2,000 chars. |
| `created_at` | `string` datetime | Required. |
| `updated_at` | `string` datetime | Required. |
| `idempotency_key` | `string` | Required, deterministic hash of `(review_id, model_name, model_version)` recommended. |

---

## 5) AnalyticsSnapshot

### Ownership boundary
- **Writer service**: `analytics-service`
- Snapshot records are append-only periodic rollups.

### Required fields
| Field | Type | Rules |
|---|---|---|
| `snapshot_id` | `string` (UUIDv7) | Primary key. |
| `tenant_id` | `string` (UUIDv7) | Required. |
| `scope` | `enum` | Required: `tenant`, `property`. |
| `property_id` | `string` (UUIDv7/null) | Required when `scope=property`; null otherwise. |
| `window_start` | `string` datetime | Required. |
| `window_end` | `string` datetime | Required, greater than `window_start`. |
| `review_count` | `integer` | Required, `>= 0`. |
| `avg_rating` | `number` | Required, range `0` to `5`. |
| `avg_sentiment` | `number` | Required, range `-1` to `1`. |
| `created_at` | `string` datetime | Required. |
| `updated_at` | `string` datetime | Required. |
| `idempotency_key` | `string` | Required, unique per `(tenant_id, scope, property_id, window_start, window_end)`. |

---

## 6) RiskAssessment

### Ownership boundary
- **Writer service**: `risk-service`
- Risk assessments are recalculated and superseded over time.

### Required fields
| Field | Type | Rules |
|---|---|---|
| `risk_assessment_id` | `string` (UUIDv7) | Primary key. |
| `tenant_id` | `string` (UUIDv7) | Required. |
| `property_id` | `string` (UUIDv7) | Required. |
| `risk_score` | `number` | Required, range `0` to `100`. |
| `risk_level` | `enum` | Required: `low`, `medium`, `high`, `critical`. |
| `factors` | `array<object>` | Required, non-empty; each factor has `code`, `weight`, `explanation`. |
| `effective_at` | `string` datetime | Required. |
| `expires_at` | `string` datetime | Required, must be after `effective_at`. |
| `created_at` | `string` datetime | Required. |
| `updated_at` | `string` datetime | Required. |
| `idempotency_key` | `string` | Required for recomputation request dedupe. |

---

## 7) AutomationEvent

### Ownership boundary
- **Writer service**: `automation-service`
- Represents system-initiated or user-triggered workflow actions and outcomes.

### Required fields
| Field | Type | Rules |
|---|---|---|
| `automation_event_id` | `string` (UUIDv7) | Primary key. |
| `tenant_id` | `string` (UUIDv7) | Required. |
| `event_name` | `string` | Required, dot-separated lowercase (`workflow.step.executed`). |
| `trigger_type` | `enum` | Required: `scheduled`, `rule`, `manual`, `webhook`. |
| `status` | `enum` | Required: `queued`, `running`, `succeeded`, `failed`, `cancelled`. |
| `related_entity_type` | `enum` | Required: `user`, `property`, `review`, `analysis_result`, `risk_assessment`, `snapshot`, `other`. |
| `related_entity_id` | `string` | Required when `related_entity_type != other`. |
| `details` | `object` | Required, free-form JSON object <= 64KB. |
| `occurred_at` | `string` datetime | Required. |
| `created_at` | `string` datetime | Required. |
| `updated_at` | `string` datetime | Required. |
| `idempotency_key` | `string` | Required for command dedupe and retry-safe side effects. |

---

## Referential integrity and consistency rules

- Cross-entity references (`property_id`, `review_id`, `user_id`) MUST resolve within the same `tenant_id`.
- Services MUST reject writes with unknown referenced IDs unless explicitly documented as eventual-consistency tolerant.
- Canonical entity writers are responsible for publishing state-change events after successful persistence.
