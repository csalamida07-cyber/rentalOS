export interface IncomingReviewPayload {
  review_id: string;
  page_type: string;
  parser_version: string;
  extraction_confidence: number;
  [key: string]: unknown;
}

export interface StoredReviewRecord extends IncomingReviewPayload {
  ingested_at: string;
}

export class InMemoryReviewStore {
  private records: StoredReviewRecord[] = [];

  insert(review: IncomingReviewPayload): StoredReviewRecord {
    const stored: StoredReviewRecord = {
      ...review,
      parser_version: review.parser_version,
      extraction_confidence: review.extraction_confidence,
      ingested_at: new Date().toISOString(),
    };

    this.records.push(stored);
    return stored;
  }

  all(): StoredReviewRecord[] {
    return this.records;
  }
}
