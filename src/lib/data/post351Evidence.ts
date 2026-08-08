import evidencePr354Data from '../../../data/evidence-pr354-tier-a-batch-1.json';
import evidencePr355Data from '../../../data/evidence-pr355-tier-a-batch-2.json';
import evidencePr356Data from '../../../data/evidence-pr356-market-access-pilot-1.json';
import evidencePr364Data from '../../../data/evidence-pr364-tier-a-batch-4.json';
import evidencePr523Data from '../../../data/evidence-pr523-jpysc-market-access.json';
import type { EvidenceRelationRow, EvidenceRow } from './registryBase';

const unique = (items: Array<string | null | undefined>) => [
  ...new Set(items.filter((item): item is string => typeof item === 'string' && item.length > 0)),
];

const normalizeEvidence = (row: EvidenceRow): EvidenceRow => ({
  ...row,
  stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]),
  organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]),
  event_ids: unique([...(row.event_ids ?? []), row.event_id ?? undefined]),
  claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope]),
});

const rows = [
  ...(evidencePr354Data as EvidenceRow[]),
  ...(evidencePr355Data as EvidenceRow[]),
  ...(evidencePr356Data as EvidenceRow[]),
  ...(evidencePr364Data as EvidenceRow[]),
  ...(evidencePr523Data as EvidenceRow[]),
].map(normalizeEvidence);

export function getPost351Evidence(): EvidenceRow[] {
  return rows.map((row) => ({
    ...row,
    stablecoin_ids: [...(row.stablecoin_ids ?? [])],
    organization_ids: [...(row.organization_ids ?? [])],
    event_ids: [...(row.event_ids ?? [])],
    claim_scopes: [...(row.claim_scopes ?? [])],
  }));
}

export function getPost351EvidenceRelations(): EvidenceRelationRow[] {
  return rows.map((row) => ({
    id: `sog_er_${row.id.replace(/^sog_src_/, '')}`,
    evidence_id: row.id,
    stablecoin_ids: [...(row.stablecoin_ids ?? [])],
    organization_ids: [...(row.organization_ids ?? [])],
    event_ids: [...(row.event_ids ?? [])],
    claim_scopes: [...(row.claim_scopes ?? [])],
    relation_kind: 'explicit_v2',
  }));
}
