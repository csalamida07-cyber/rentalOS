export type SentimentLabel = 'positive' | 'neutral' | 'negative';
export type RiskSeverity = 'low' | 'medium' | 'high';
export type RiskCategory =
  | 'cleanliness'
  | 'communication'
  | 'check_in'
  | 'value'
  | 'noise'
  | 'maintenance'
  | 'other';

export interface ReviewSignalInput {
  review_id: string;
  listing_id: string;
  review_text: string;
  rating: number;
  created_at: string;
}

export interface ReviewAnalysisResult {
  review_id: string;
  listing_id: string;
  sentiment_label: SentimentLabel;
  sentiment_score: number;
  reason_codes: string[];
  categories: RiskCategory[];
  severity: RiskSeverity;
  requires_attention: boolean;
}

export interface RiskQueueItem {
  id: string;
  review_id: string;
  listing_id: string;
  created_at: string;
  severity: RiskSeverity;
  categories: RiskCategory[];
  reason_codes: string[];
  sentiment_label: SentimentLabel;
  sentiment_score: number;
  status: 'open' | 'resolved';
  resolved_at?: string;
}

const NEGATIVE_KEYWORDS: Record<string, RiskCategory> = {
  dirty: 'cleanliness',
  unclean: 'cleanliness',
  filthy: 'cleanliness',
  ignored: 'communication',
  unresponsive: 'communication',
  rude: 'communication',
  checkin: 'check_in',
  'check-in': 'check_in',
  late: 'check_in',
  noisy: 'noise',
  noise: 'noise',
  broken: 'maintenance',
  leaking: 'maintenance',
  expensive: 'value',
  overpriced: 'value',
};

export function analyzeReviewRisk(input: ReviewSignalInput): ReviewAnalysisResult {
  const normalizedText = input.review_text.toLowerCase();
  const reasonCodes: string[] = [];
  const categories = new Set<RiskCategory>();

  Object.entries(NEGATIVE_KEYWORDS).forEach(([keyword, category]) => {
    if (normalizedText.includes(keyword)) {
      reasonCodes.push(`keyword:${keyword}`);
      categories.add(category);
    }
  });

  let sentimentScore = 0.5;

  if (input.rating >= 5) {
    sentimentScore = 0.9;
  } else if (input.rating === 4) {
    sentimentScore = 0.65;
  } else if (input.rating === 3) {
    sentimentScore = 0.45;
  } else if (input.rating <= 2) {
    sentimentScore = 0.2;
  }

  sentimentScore -= Math.min(reasonCodes.length * 0.05, 0.25);
  sentimentScore = Number(Math.max(0, Math.min(1, sentimentScore)).toFixed(2));

  const sentimentLabel: SentimentLabel =
    sentimentScore >= 0.7 ? 'positive' : sentimentScore >= 0.45 ? 'neutral' : 'negative';

  const severity: RiskSeverity =
    sentimentLabel === 'negative' && (input.rating <= 2 || reasonCodes.length >= 2)
      ? 'high'
      : sentimentLabel === 'negative' || sentimentLabel === 'neutral'
        ? 'medium'
        : 'low';

  const requiresAttention = severity === 'high' || (severity === 'medium' && sentimentLabel !== 'positive');

  return {
    review_id: input.review_id,
    listing_id: input.listing_id,
    sentiment_label: sentimentLabel,
    sentiment_score: sentimentScore,
    reason_codes: reasonCodes,
    categories: categories.size > 0 ? [...categories] : ['other'],
    severity,
    requires_attention: requiresAttention,
  };
}

export class InMemoryRiskQueue {
  private items = new Map<string, RiskQueueItem>();

  addFromReview(input: ReviewSignalInput): RiskQueueItem | null {
    const analysis = analyzeReviewRisk(input);
    if (!analysis.requires_attention) {
      return null;
    }

    const item: RiskQueueItem = {
      id: `risk_${analysis.review_id}`,
      review_id: analysis.review_id,
      listing_id: analysis.listing_id,
      created_at: input.created_at,
      severity: analysis.severity,
      categories: analysis.categories,
      reason_codes: analysis.reason_codes,
      sentiment_label: analysis.sentiment_label,
      sentiment_score: analysis.sentiment_score,
      status: 'open',
    };

    this.items.set(item.id, item);
    return item;
  }

  resolve(id: string, resolvedAt: string): RiskQueueItem {
    const item = this.items.get(id);
    if (!item) {
      throw new Error(`Risk item not found: ${id}`);
    }

    const resolved: RiskQueueItem = {
      ...item,
      status: 'resolved',
      resolved_at: resolvedAt,
    };

    this.items.set(id, resolved);
    return resolved;
  }

  listOpen(): RiskQueueItem[] {
    return [...this.items.values()]
      .filter((item) => item.status === 'open')
      .sort((a, b) => {
        const severityRank = rankSeverity(b.severity) - rankSeverity(a.severity);
        if (severityRank !== 0) {
          return severityRank;
        }
        return a.created_at.localeCompare(b.created_at);
      });
  }
}

function rankSeverity(severity: RiskSeverity): number {
  switch (severity) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    default:
      return 1;
  }
}
