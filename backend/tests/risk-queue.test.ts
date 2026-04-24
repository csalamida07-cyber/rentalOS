import { describe, expect, it } from 'vitest';
import { InMemoryRiskQueue, analyzeReviewRisk } from '../src/riskQueue';

describe('risk analysis and queue', () => {
  it('creates high severity risk item for low rating with multiple issue keywords', () => {
    const queue = new InMemoryRiskQueue();
    const item = queue.addFromReview({
      review_id: 'rev-1',
      listing_id: 'lst-1',
      review_text: 'The place was dirty and the host was unresponsive during check-in.',
      rating: 1,
      created_at: '2026-04-24T00:00:00Z',
    });

    expect(item).not.toBeNull();
    expect(item?.severity).toBe('high');
    expect(item?.categories).toEqual(expect.arrayContaining(['cleanliness', 'communication', 'check_in']));
    expect(queue.listOpen()).toHaveLength(1);
  });

  it('does not create queue item for positive review', () => {
    const queue = new InMemoryRiskQueue();
    const item = queue.addFromReview({
      review_id: 'rev-2',
      listing_id: 'lst-1',
      review_text: 'Fantastic stay, great communication, very clean.',
      rating: 5,
      created_at: '2026-04-24T01:00:00Z',
    });

    expect(item).toBeNull();
    expect(queue.listOpen()).toHaveLength(0);
  });

  it('resolves queue item and removes it from open list', () => {
    const queue = new InMemoryRiskQueue();
    const created = queue.addFromReview({
      review_id: 'rev-3',
      listing_id: 'lst-2',
      review_text: 'Overpriced and noisy at night.',
      rating: 3,
      created_at: '2026-04-24T02:00:00Z',
    });

    expect(created).not.toBeNull();

    const resolved = queue.resolve(created!.id, '2026-04-24T03:00:00Z');
    expect(resolved.status).toBe('resolved');
    expect(resolved.resolved_at).toBe('2026-04-24T03:00:00Z');
    expect(queue.listOpen()).toHaveLength(0);
  });

  it('produces deterministic sentiment scoring for same input', () => {
    const input = {
      review_id: 'rev-4',
      listing_id: 'lst-3',
      review_text: 'The room was broken and dirty.',
      rating: 2,
      created_at: '2026-04-24T04:00:00Z',
    };

    const a = analyzeReviewRisk(input);
    const b = analyzeReviewRisk(input);

    expect(a.sentiment_score).toBe(b.sentiment_score);
    expect(a.sentiment_label).toBe('negative');
  });
});
