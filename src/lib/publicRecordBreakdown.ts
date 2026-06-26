import { getEvidence } from './data/registry';
import { getEvidenceRelationKind } from '../../config/evidence-relation-kinds.mjs';

function countValues(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

export function normalizePublicRecordBreakdown<T extends Record<string, unknown>>(breakdown: T) {
  return {
    ...breakdown,
    evidence_relation_kind: countValues(getEvidence().map((item) => getEvidenceRelationKind(item.id)))
  };
}
