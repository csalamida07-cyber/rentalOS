import type { StoredReviewRecord } from './ingestion';

export interface ConfidenceDropAlert {
  parser_version: string;
  page_type: string;
  baseline_confidence: number;
  recent_confidence: number;
  drop: number;
}

interface AlertingOptions {
  dropThreshold: number;
  lookbackWindow: number;
}

const DEFAULT_OPTIONS: AlertingOptions = {
  dropThreshold: 0.2,
  lookbackWindow: 10,
};

export function detectConfidenceDropAlerts(
  records: StoredReviewRecord[],
  options: Partial<AlertingOptions> = {},
): ConfidenceDropAlert[] {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const grouped = new Map<string, StoredReviewRecord[]>();

  records.forEach((record) => {
    const key = `${record.parser_version}::${record.page_type}`;
    const list = grouped.get(key) ?? [];
    list.push(record);
    grouped.set(key, list);
  });

  const alerts: ConfidenceDropAlert[] = [];

  grouped.forEach((group, key) => {
    if (group.length < config.lookbackWindow * 2) {
      return;
    }

    const sorted = [...group].sort((a, b) => a.ingested_at.localeCompare(b.ingested_at));
    const baselineSlice = sorted.slice(0, config.lookbackWindow);
    const recentSlice = sorted.slice(-config.lookbackWindow);

    const baseline = average(baselineSlice.map((x) => x.extraction_confidence));
    const recent = average(recentSlice.map((x) => x.extraction_confidence));
    const drop = Number((baseline - recent).toFixed(2));

    if (drop >= config.dropThreshold) {
      const [parser_version, page_type] = key.split('::');
      alerts.push({ parser_version, page_type, baseline_confidence: baseline, recent_confidence: recent, drop });
    }
  });

  return alerts;
}

function average(values: number[]): number {
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}
