import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { PARSER_VERSION, parseReviews } from '../utils/dom-parser';

function loadFixture(name: string): Document {
  const fullPath = path.join(process.cwd(), 'rentalos-extension/tests/fixtures/airbnb-pages', name);
  const html = fs.readFileSync(fullPath, 'utf-8');
  return new JSDOM(html, { url: 'https://www.airbnb.com' }).window.document;
}

describe('dom parser contract', () => {
  it('parses semantic variant with high confidence and parser version', () => {
    const reviews = parseReviews(loadFixture('variant-semantic.html'));
    expect(reviews).toHaveLength(1);
    expect(reviews[0].parser_version).toBe(PARSER_VERSION);
    expect(reviews[0].extraction_confidence).toBeGreaterThan(0.8);
    expect(reviews[0].missing_fields).toEqual([]);
  });

  it('parses attribute-anchor variant through secondary selectors', () => {
    const reviews = parseReviews(loadFixture('variant-attribute-anchor.html'));
    expect(reviews[0].review_id).toBe('review-991');
    expect(reviews[0].extraction_notes.join(' ')).toContain('secondary');
    expect(reviews[0].extraction_confidence).toBeGreaterThan(0.55);
  });

  it('falls back to heuristics and emits diagnostics', () => {
    const reviews = parseReviews(loadFixture('variant-heuristic.html'));
    expect(reviews[0].extraction_notes.join(' ')).toContain('heuristic');
    expect(reviews[0].page_type).toBe('profile');
    expect(reviews[0].missing_fields.length).toBeGreaterThanOrEqual(0);
  });
});
