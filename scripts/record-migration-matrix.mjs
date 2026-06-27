import { resolveEvidenceIdentityId } from '../config/evidence-source-identities.mjs';
import { relationValues, uniqueStrings } from './record-public-copy-audit-lib.mjs';

function countStablecoinRelations(rows, stablecoinId, pluralKey = 'stablecoin_ids', singularKey = 'stablecoin_id') {
  return rows.filter((row) => relationValues(row, pluralKey, singularKey).includes(stablecoinId)).length;
}

export function buildRecordMigrationMatrix({
  stablecoins,
  relationships,
  events,
  evidence,
  sourceIdentities,
  knownUnknowns,
  deployments,
  reserveReports,
  occurrences
}) {
  const occurrencesByRecord = new Map(stablecoins.map((row) => [row.id, []]));
  for (const occurrence of occurrences) occurrencesByRecord.get(occurrence.stablecoin_id)?.push(occurrence);

  const sourceIdentityByStablecoin = new Map(stablecoins.map((row) => [row.id, new Set()]));
  for (const source of sourceIdentities) {
    for (const stablecoinId of source.stablecoin_ids ?? []) {
      sourceIdentityByStablecoin.get(stablecoinId)?.add(source.id);
    }
  }

  const canonicalRelations = evidence.map((row) => ({
    evidence_id: resolveEvidenceIdentityId(row.id),
    stablecoin_ids: [...row.stablecoin_ids],
    organization_ids: [...row.organization_ids],
    event_ids: [...row.event_ids],
    claim_scopes: [...row.claim_scopes]
  }));

  const matrix = stablecoins.map((record) => {
    const recordOccurrences = occurrencesByRecord.get(record.id) ?? [];
    const relationshipCount = relationships.filter((row) => row.stablecoin_id === record.id).length;
    const eventCount = countStablecoinRelations(events, record.id, 'subject_stablecoin_ids', 'stablecoin_id');
    const evidenceRelationCount = canonicalRelations.filter((row) => row.stablecoin_ids.includes(record.id)).length;
    const sourceIdentityCount = sourceIdentityByStablecoin.get(record.id)?.size ?? 0;
    const requiredIdentityComplete = Boolean(record.id && record.slug && (record.name ?? record.canonical_name));
    const coreRelationsComplete = relationshipCount > 0 && evidenceRelationCount > 0 && sourceIdentityCount > 0;

    return {
      stablecoin_id: record.id,
      slug: record.slug,
      name: record.name ?? record.canonical_name ?? null,
      symbol: record.symbol ?? null,
      route: `/stablecoin/${record.slug}/`,
      lifecycle_status: record.lifecycle_status ?? null,
      issuance_status: record.issuance_status ?? null,
      relationship_count: relationshipCount,
      event_count: eventCount,
      canonical_evidence_relation_count: evidenceRelationCount,
      public_source_identity_count: sourceIdentityCount,
      reserve_report_count: reserveReports.filter((row) => row.stablecoin_id === record.id).length,
      known_unknown_count: knownUnknowns.filter((row) => row.stablecoin_id === record.id).length,
      deployment_count: deployments.filter((row) => row.stablecoin_id === record.id).length,
      public_copy_occurrence_count: recordOccurrences.length,
      likely_public_copy_occurrence_count: recordOccurrences.filter((row) => row.likely_public_copy).length,
      public_copy_files: uniqueStrings(recordOccurrences.map((row) => row.file)).sort(),
      required_identity_complete: requiredIdentityComplete,
      core_relations_complete: coreRelationsComplete,
      migration_ready: requiredIdentityComplete && coreRelationsComplete
    };
  }).sort((left, right) => left.stablecoin_id.localeCompare(right.stablecoin_id));

  return { matrix, canonicalRelations };
}
