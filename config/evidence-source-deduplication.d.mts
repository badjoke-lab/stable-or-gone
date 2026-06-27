export type EvidenceSourceRecord = {
  id: string;
  url: string;
  title: string;
  publisher?: string | null;
  published_at?: string | null;
  accessed_at?: string | null;
  archived_url?: string | null;
  source_type?: string | null;
  source_provenance?: string | null;
  is_primary?: boolean | null;
  reliability?: string | null;
  stablecoin_ids?: string[];
  organization_ids?: string[];
  event_ids?: string[];
  claim_scopes?: string[];
  notes?: string;
  source_alias_ids?: string[];
};

export function deduplicateEvidenceRecords<T extends EvidenceSourceRecord>(records: T[]): Array<T & { source_alias_ids: string[] }>;
