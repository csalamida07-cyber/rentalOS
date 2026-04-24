export const RETENTION_EVENT_TYPES = [
  'review_request_sent',
  'review_request_delivered',
  'review_received',
  'review_sentiment_scored',
  'risk_item_created',
  'draft_generated',
  'draft_copied',
  'response_marked_sent',
] as const;

export type RetentionEventType = (typeof RETENTION_EVENT_TYPES)[number];

export interface RetentionEventEnvelope {
  event_id: string;
  event_type: RetentionEventType;
  version: string;
  occurred_at: string;
  tenant_id: string;
  trace_id: string;
  payload: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const SEMVER_MINOR_PATTERN = /^\d+\.\d+$/;

export function validateRetentionEventEnvelope(event: Partial<RetentionEventEnvelope>): ValidationResult {
  const errors: string[] = [];

  if (!event.event_id || typeof event.event_id !== 'string') {
    errors.push('event_id is required and must be a string');
  }

  if (!event.event_type || !RETENTION_EVENT_TYPES.includes(event.event_type as RetentionEventType)) {
    errors.push(`event_type must be one of: ${RETENTION_EVENT_TYPES.join(', ')}`);
  }

  if (!event.version || typeof event.version !== 'string' || !SEMVER_MINOR_PATTERN.test(event.version)) {
    errors.push('version is required and must use major.minor format (e.g., 1.0)');
  }

  if (!event.occurred_at || typeof event.occurred_at !== 'string' || Number.isNaN(Date.parse(event.occurred_at))) {
    errors.push('occurred_at is required and must be a valid RFC 3339 timestamp');
  }

  if (!event.tenant_id || typeof event.tenant_id !== 'string') {
    errors.push('tenant_id is required and must be a string');
  }

  if (!event.trace_id || typeof event.trace_id !== 'string') {
    errors.push('trace_id is required and must be a string');
  }

  if (!event.payload || typeof event.payload !== 'object' || Array.isArray(event.payload)) {
    errors.push('payload is required and must be an object');
  }

  return { valid: errors.length === 0, errors };
}

export class InMemoryRetentionEventStore {
  private events = new Map<string, RetentionEventEnvelope>();

  upsert(event: Partial<RetentionEventEnvelope>): RetentionEventEnvelope {
    const validation = validateRetentionEventEnvelope(event);
    if (!validation.valid) {
      throw new Error(`Invalid retention event: ${validation.errors.join('; ')}`);
    }

    const normalized = event as RetentionEventEnvelope;
    this.events.set(normalized.event_id, normalized);
    return normalized;
  }

  all(): RetentionEventEnvelope[] {
    return [...this.events.values()].sort((a, b) => a.occurred_at.localeCompare(b.occurred_at));
  }

  count(): number {
    return this.events.size;
  }
}
