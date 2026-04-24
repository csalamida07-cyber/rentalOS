import { describe, expect, it } from 'vitest';
import { InMemoryReviewStore } from '../src/ingestion';
import { detectConfidenceDropAlerts } from '../src/alerting';

describe('confidence drop alerting', () => {
  it('alerts when recent confidence drops by parser version and page type', () => {
    const store = new InMemoryReviewStore();

    for (let i = 0; i < 10; i += 1) {
      store.insert({
        review_id: `a-${i}`,
        page_type: 'listing',
        parser_version: 'v1',
        extraction_confidence: 0.9,
      });
    }

    for (let i = 0; i < 10; i += 1) {
      store.insert({
        review_id: `b-${i}`,
        page_type: 'listing',
        parser_version: 'v1',
        extraction_confidence: 0.55,
      });
    }

    const alerts = detectConfidenceDropAlerts(store.all(), { dropThreshold: 0.2, lookbackWindow: 10 });
    expect(alerts).toHaveLength(1);
    expect(alerts[0].parser_version).toBe('v1');
    expect(alerts[0].page_type).toBe('listing');
  });
});
