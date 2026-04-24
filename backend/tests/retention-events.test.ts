import { describe, expect, it } from 'vitest';
import {
  InMemoryRetentionEventStore,
  RETENTION_EVENT_TYPES,
  validateRetentionEventEnvelope,
} from '../src/retentionEvents';

const baseEvent = {
  event_id: 'evt-001',
  event_type: 'review_request_sent' as const,
  version: '1.0',
  occurred_at: '2026-04-24T00:00:00Z',
  tenant_id: 'tenant-001',
  trace_id: 'trace-001',
  payload: {
    listing_id: 'listing-123',
    sequence_variant_id: 'variant-a',
  },
};

describe('retention event contracts', () => {
  it('accepts all configured retention event types', () => {
    for (const type of RETENTION_EVENT_TYPES) {
      const result = validateRetentionEventEnvelope({ ...baseEvent, event_type: type, event_id: `evt-${type}` });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });

  it('rejects invalid envelope fields', () => {
    const result = validateRetentionEventEnvelope({
      ...baseEvent,
      event_type: 'unsupported_event' as never,
      version: '1',
      occurred_at: 'not-a-date',
      payload: [] as never,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('event_type must be one of'),
        expect.stringContaining('version is required and must use major.minor format'),
        expect.stringContaining('occurred_at is required and must be a valid RFC 3339 timestamp'),
        expect.stringContaining('payload is required and must be an object'),
      ]),
    );
  });

  it('deduplicates by event_id to support idempotent retries', () => {
    const store = new InMemoryRetentionEventStore();

    store.upsert(baseEvent);
    store.upsert({ ...baseEvent, payload: { listing_id: 'listing-123', retry: true } });

    expect(store.count()).toBe(1);
    expect(store.all()[0].payload).toEqual({ listing_id: 'listing-123', retry: true });
  });
});
