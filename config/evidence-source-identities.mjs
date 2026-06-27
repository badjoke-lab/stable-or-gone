import { evidenceSourceGroupsA } from './evidence-source-groups-a.mjs';
import { evidenceSourceGroupsB } from './evidence-source-groups-b.mjs';
import { evidenceSourceGroupsC } from './evidence-source-groups-c.mjs';
import { evidenceSourceGroupsD } from './evidence-source-groups-d.mjs';

export const evidenceSourceIdentityGroups = Object.freeze(
  [...evidenceSourceGroupsA, ...evidenceSourceGroupsB, ...evidenceSourceGroupsC, ...evidenceSourceGroupsD]
    .map(([canonical_id, aliases, url]) => Object.freeze({ canonical_id, aliases: Object.freeze([...aliases]), url }))
);

export const evidenceAliasToCanonicalId = Object.freeze(Object.fromEntries(
  evidenceSourceIdentityGroups.flatMap((group) => group.aliases.map((alias) => [alias, group.canonical_id]))
));

export const evidenceCanonicalIds = Object.freeze(new Set(evidenceSourceIdentityGroups.map((group) => group.canonical_id)));
export const evidenceAliasIds = Object.freeze(new Set(Object.keys(evidenceAliasToCanonicalId)));
export const evidenceSourceIdentityGroupCount = evidenceSourceIdentityGroups.length;
export const evidenceSourceAliasCount = evidenceAliasIds.size;

export function resolveEvidenceIdentityId(id) {
  return evidenceAliasToCanonicalId[id] ?? id;
}

export function canonicalizeEvidenceIds(ids = []) {
  return [...new Set(ids.filter(Boolean).map(resolveEvidenceIdentityId))];
}
