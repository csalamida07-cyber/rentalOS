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

export interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  created_at: string;
}

export interface ReviewHistoryEntry extends Review {
  event_type: "created" | "updated" | "approved" | "rejected";
  event_at: string;
}

export interface PageInfo {
  has_next: boolean;
  next_cursor: string | null;
}

export interface ReviewHistoryPage {
  items: ReviewHistoryEntry[];
  page: PageInfo;
}

export interface AnalyticsRow {
  listing_id: string;
  average_rating: number;
  review_count: number;
  region: string;
  property_type: string;
  created_at: string;
}

export interface AnalyticsPage {
  items: AnalyticsRow[];
  page: PageInfo;
}

export interface PaginationQuery {
  cursor?: string;
  limit?: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
  [key: string]: string | number | undefined;
}

export interface DashboardClientOptions {
  baseUrl: string;
  accessToken: string;
  fetchImpl?: typeof fetch;
}

export class DashboardApiClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: DashboardClientOptions) {
    this.baseUrl = options.baseUrl;
    this.accessToken = options.accessToken;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async listReviewHistory(query: PaginationQuery = {}): Promise<ReviewHistoryPage> {
    return this.request<ReviewHistoryPage>(`/v1/review-history${this.toQueryString(query)}`, {
      method: "GET",
    });
  }

  async getReviewAnalytics(query: PaginationQuery = {}): Promise<AnalyticsPage> {
    return this.request<AnalyticsPage>(`/v1/analytics/reviews${this.toQueryString(query)}`, {
      method: "GET",
    });
  }

  private toQueryString(query: PaginationQuery): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    }

    const serialized = params.toString();
    return serialized ? `?${serialized}` : "";
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
