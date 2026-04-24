/**
 * Generated from rentalos-api/openapi.yaml.
 * Do not hand-edit; regenerate when the OpenAPI contract changes.
 */

export interface ErrorModel {
  code: string;
  message: string;
  details: Record<string, unknown>;
  trace_id: string;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface CreateReviewRequest {
  listing_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  created_at: string;
}

export interface RiskFactor {
  name: string;
  impact: number;
}

export interface RiskProfile {
  listing_id: string;
  score: number;
  level: "low" | "medium" | "high";
  factors: RiskFactor[];
  updated_at: string;
}

export interface ExtensionClientOptions {
  baseUrl: string;
  accessToken: string;
  fetchImpl?: typeof fetch;
}

export class ExtensionApiClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ExtensionClientOptions) {
    this.baseUrl = options.baseUrl;
    this.accessToken = options.accessToken;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async createReview(body: CreateReviewRequest, idempotencyKey: string): Promise<Review> {
    return this.request<Review>("/v1/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(body),
    });
  }

  async getRiskProfile(listingId: string): Promise<RiskProfile> {
    return this.request<RiskProfile>(`/v1/risk/listings/${encodeURIComponent(listingId)}`, {
      method: "GET",
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        ...(init.headers ?? {}),
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as ErrorModel;
      throw new Error(`[${error.code}] ${error.message} (trace_id=${error.trace_id})`);
    }

    return (await response.json()) as T;
  }
}
