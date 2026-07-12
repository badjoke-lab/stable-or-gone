import { deduplicateEvidenceRecords } from '../../../config/evidence-source-deduplication.mjs';
import {
  canonicalizeEvidenceIds,
  evidenceAliasToCanonicalId,
  evidenceSourceAliasCount,
  evidenceSourceIdentityGroupCount,
  resolveEvidenceIdentityId
} from '../../../config/evidence-source-identities.mjs';
import { getEvidence as getRegistryEvidence, getEvidenceRelations as getRegistryEvidenceRelations } from './registry';
import { getPost351Evidence, getPost351EvidenceRelations } from './post351Evidence';
import type { EvidenceRelationRow, EvidenceRow } from './registryBase';

export type EvidenceSourceIdentityRow = EvidenceRow & {
  source_alias_ids: string[];
};

export function getCompleteEvidence(): EvidenceRow[] {
  return [...getRegistryEvidence(), ...getPost351Evidence()].map((row) => ({
    ...row,
    stablecoin_ids: [...(row.stablecoin_ids ?? [])],
    organization_ids: [...(row.organization_ids ?? [])],
    event_ids: [...(row.event_ids ?? [])],
    claim_scopes: [...(row.claim_scopes ?? [])],
  }));
}

export function getCompleteEvidenceRelations(): EvidenceRelationRow[] {
  return [...getRegistryEvidenceRelations(), ...getPost351EvidenceRelations()].map((row) => ({
    ...row,
    stablecoin_ids: [...row.stablecoin_ids],
    organization_ids: [...row.organization_ids],
    event_ids: [...row.event_ids],
    claim_scopes: [...row.claim_scopes],
  }));
}

export function getEvidenceSourceIdentities(): EvidenceSourceIdentityRow[] {
  return deduplicateEvidenceRecords(getCompleteEvidence()).map((row) => ({
    ...row,
    stablecoin_ids: [...(row.stablecoin_ids ?? [])],
    organization_ids: [...(row.organization_ids ?? [])],
    event_ids: [...(row.event_ids ?? [])],
    claim_scopes: [...(row.claim_scopes ?? [])],
    source_alias_ids: [...(row.source_alias_ids ?? [])]
  }));
}

export function getCanonicalEvidenceRelations(): EvidenceRelationRow[] {
  return getCompleteEvidenceRelations().map((relation) => ({
    ...relation,
    evidence_id: resolveEvidenceIdentityId(relation.evidence_id),
    stablecoin_ids: [...relation.stablecoin_ids],
    organization_ids: [...relation.organization_ids],
    event_ids: [...relation.event_ids],
    claim_scopes: [...relation.claim_scopes]
  }));
}

export function canonicalizeLinkedEvidenceIds(ids?: Array<string | null | undefined>): string[] {
  return canonicalizeEvidenceIds(ids);
}

export function getEvidenceSourceIdentitySummary() {
  const rawEvidenceRecords = getCompleteEvidence();
  const sourceIdentities = getEvidenceSourceIdentities();
  const relations = getCanonicalEvidenceRelations();
  const relationEvidenceIds = new Set(relations.map((relation) => relation.evidence_id));
  const sourceIdentityIds = new Set(sourceIdentities.map((source) => source.id));

  return {
    raw_evidence_records: rawEvidenceRecords.length,
    source_identities: sourceIdentities.length,
    source_identity_groups: evidenceSourceIdentityGroupCount,
    source_aliases: evidenceSourceAliasCount,
    removed_public_duplicate_rows: rawEvidenceRecords.length - sourceIdentities.length,
    evidence_relations: relations.length,
    relation_source_identities: relationEvidenceIds.size,
    orphan_relation_source_ids: [...relationEvidenceIds].filter((id) => !sourceIdentityIds.has(id)).sort(),
    unmapped_alias_ids: Object.keys(evidenceAliasToCanonicalId).filter((id) => !rawEvidenceRecords.some((source) => source.id === id)).sort()
  };
}
