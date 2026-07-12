import { getCompleteEvidence } from './data/evidenceSources';
import { getEvidenceRelationKind } from '../../config/evidence-relation-kinds.mjs';

function countValues(values: string[]) {
  const counts = values.reduce<Map<string, number>>((result, value) => {
    result.set(value, (result.get(value) ?? 0) + 1);
    return result;
  }, new Map());

  return Object.fromEntries(
    [...counts.entries()].sort(([left], [right]) => left.localeCompare(right))
  );
}

export function normalizePublicRecordBreakdown<T extends Record<string, unknown>>(breakdown: T) {
  return {
    ...breakdown,
    evidence_relation_kind: countValues(
      getCompleteEvidence().map((item) => getEvidenceRelationKind(item.id))
    ),
  };
}
