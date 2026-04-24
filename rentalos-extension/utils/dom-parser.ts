export const PARSER_VERSION = '2026.03.layered-v1';

export type MissingField =
  | 'review_id'
  | 'author_name'
  | 'rating'
  | 'review_text'
  | 'review_date';

export interface ExtractedReviewPayload {
  review_id: string;
  author_name: string;
  rating: number | null;
  review_text: string;
  review_date: string;
  page_type: string;
  parser_version: string;
  extraction_confidence: number;
  missing_fields: MissingField[];
  extraction_notes: string[];
}

interface LayerResult {
  review_id?: string;
  author_name?: string;
  rating?: number | null;
  review_text?: string;
  review_date?: string;
  notes: string[];
}

const PRIMARY_SELECTORS = {
  reviewCard: '[data-review-id], article[data-review-id], [data-testid="review-card"], article:has([data-testid="review-text"])',
  reviewId: '[data-review-id]',
  authorName: '[data-testid="review-author"], .reviewer-name, h3[role="heading"]',
  rating: '[data-testid="review-rating"], [aria-label*="out of 5"], .review-rating',
  reviewText: '[data-testid="review-text"], .review-text, blockquote',
  reviewDate: '[data-testid="review-date"], time, .review-date',
} as const;

const SECONDARY_SELECTORS = {
  reviewCard: '[id^="review"], [class*="review-card"], article',
  authorName: '[class*="host"] [class*="name"], [itemprop="author"], [data-plugin-in-point-id*="guest-profile"]',
  rating: '[class*="rating"], [itemprop="ratingValue"], [aria-label*="stars"]',
  reviewText: '[class*="comment"], [class*="content"], [itemprop="reviewBody"]',
  reviewDate: '[class*="date"], [datetime], [itemprop="datePublished"]',
} as const;

const REQUIRED_FIELDS: MissingField[] = ['review_id', 'author_name', 'rating', 'review_text', 'review_date'];

export function parseReviews(documentRoot: Document): ExtractedReviewPayload[] {
  const cards = findReviewCards(documentRoot);
  if (cards.length === 0) {
    return [];
  }

  return cards.map((card, index) => {
    const primary = extractWithPrimarySelectors(card);
    const secondary = extractWithSecondarySelectors(card);
    const heuristic = extractWithHeuristics(card, index);

    const merged: LayerResult = {
      review_id: primary.review_id ?? secondary.review_id ?? heuristic.review_id,
      author_name: primary.author_name ?? secondary.author_name ?? heuristic.author_name,
      rating: primary.rating ?? secondary.rating ?? heuristic.rating ?? null,
      review_text: primary.review_text ?? secondary.review_text ?? heuristic.review_text,
      review_date: primary.review_date ?? secondary.review_date ?? heuristic.review_date,
      notes: [...primary.notes, ...secondary.notes, ...heuristic.notes],
    };

    const missing_fields = REQUIRED_FIELDS.filter((field) => {
      const value = merged[field as keyof LayerResult];
      return value === undefined || value === null || value === '';
    });

    const extraction_confidence = scoreConfidence(merged, missing_fields);

    return {
      review_id: merged.review_id ?? `unknown-${index + 1}`,
      author_name: merged.author_name ?? 'Unknown author',
      rating: merged.rating ?? null,
      review_text: merged.review_text ?? '',
      review_date: merged.review_date ?? '',
      page_type: inferPageType(documentRoot),
      parser_version: PARSER_VERSION,
      extraction_confidence,
      missing_fields,
      extraction_notes: merged.notes,
    };
  });
}

function findReviewCards(documentRoot: Document): Element[] {
  const primaryCards = [...documentRoot.querySelectorAll(PRIMARY_SELECTORS.reviewCard)];
  if (primaryCards.length > 0) {
    return dedupe(primaryCards);
  }

  const secondaryCards = [...documentRoot.querySelectorAll(SECONDARY_SELECTORS.reviewCard)].filter((node) => {
    const text = (node.textContent ?? '').toLowerCase();
    return text.includes('review') || text.includes('star') || text.includes('guest');
  });

  return dedupe(secondaryCards);
}

function extractWithPrimarySelectors(card: Element): LayerResult {
  const notes: string[] = [];

  const reviewId = (card.querySelector(PRIMARY_SELECTORS.reviewId)?.getAttribute('data-review-id') ?? '').trim();
  if (reviewId) notes.push('review_id:primary-selector');

  const author = getText(card, PRIMARY_SELECTORS.authorName);
  if (author) notes.push('author_name:primary-selector');

  const rating = parseRating(getText(card, PRIMARY_SELECTORS.rating));
  if (rating !== null) notes.push('rating:primary-selector');

  const text = getText(card, PRIMARY_SELECTORS.reviewText);
  if (text) notes.push('review_text:primary-selector');

  const date = normalizeDate(getText(card, PRIMARY_SELECTORS.reviewDate));
  if (date) notes.push('review_date:primary-selector');

  return {
    review_id: reviewId || undefined,
    author_name: author || undefined,
    rating,
    review_text: text || undefined,
    review_date: date || undefined,
    notes,
  };
}

function extractWithSecondarySelectors(card: Element): LayerResult {
  const notes: string[] = [];

  const idAnchor = card.getAttribute('id') ?? '';
  const reviewId = idAnchor.startsWith('review') ? idAnchor : '';
  if (reviewId) notes.push('review_id:secondary-id-anchor');

  const author = getText(card, SECONDARY_SELECTORS.authorName);
  if (author) notes.push('author_name:secondary-selector');

  const rating = parseRating(getText(card, SECONDARY_SELECTORS.rating));
  if (rating !== null) notes.push('rating:secondary-selector');

  const text = getText(card, SECONDARY_SELECTORS.reviewText);
  if (text) notes.push('review_text:secondary-selector');

  const date = normalizeDate(getText(card, SECONDARY_SELECTORS.reviewDate));
  if (date) notes.push('review_date:secondary-selector');

  return {
    review_id: reviewId || undefined,
    author_name: author || undefined,
    rating,
    review_text: text || undefined,
    review_date: date || undefined,
    notes,
  };
}

function extractWithHeuristics(card: Element, index: number): LayerResult {
  const notes: string[] = [];
  const text = (card.textContent ?? '').replace(/\s+/g, ' ').trim();

  const authorMatch = text.match(/(?:^|\s)([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*(?:·|-)?\s*(?:Stayed|visited|reviewed)/i);
  const ratingMatch = text.match(/([1-5](?:\.\d)?)\s*(?:\/\s*5|out of 5|stars?)/i);
  const dateMatch = text.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/i);

  const blocks = [...card.querySelectorAll('p, span, div')]
    .map((n) => (n.textContent ?? '').trim())
    .filter((n) => n.length > 40);

  const reviewText = blocks.sort((a, b) => b.length - a.length)[0] ?? '';
  if (reviewText) notes.push('review_text:heuristic-longest-block');

  if (authorMatch) notes.push('author_name:heuristic-regex');
  if (ratingMatch) notes.push('rating:heuristic-regex');
  if (dateMatch) notes.push('review_date:heuristic-regex');

  return {
    review_id: `heuristic-${index + 1}`,
    author_name: authorMatch?.[1],
    rating: ratingMatch ? Number.parseFloat(ratingMatch[1]) : null,
    review_text: reviewText || undefined,
    review_date: normalizeDate(dateMatch?.[0] ?? '' ) || undefined,
    notes,
  };
}

function scoreConfidence(result: LayerResult, missing: MissingField[]): number {
  let score = 0.2;

  if (result.review_id && !result.review_id.startsWith('heuristic')) score += 0.2;
  if (result.author_name) score += 0.15;
  if (result.rating !== null && result.rating !== undefined) score += 0.2;
  if (result.review_text && result.review_text.length > 40) score += 0.2;
  if (result.review_date) score += 0.15;

  score -= missing.length * 0.08;
  return Math.max(0, Math.min(1, Number(score.toFixed(2))));
}

function inferPageType(documentRoot: Document): string {
  const canonical = documentRoot.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const path = canonical || documentRoot.location?.pathname || '';
  if (path.includes('/rooms/')) return 'listing';
  if (path.includes('/users/show/')) return 'profile';
  return 'unknown';
}

function getText(root: Element, selector: string): string {
  return (root.querySelector(selector)?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function parseRating(value: string): number | null {
  if (!value) return null;
  const match = value.match(/([1-5](?:\.\d)?)/);
  return match ? Number.parseFloat(match[1]) : null;
}

function normalizeDate(value: string): string {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value.trim();
  return parsed.toISOString().slice(0, 10);
}

function dedupe(elements: Element[]): Element[] {
  return [...new Set(elements)];
}
