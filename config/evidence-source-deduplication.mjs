import {
  evidenceAliasIds,
  evidenceSourceIdentityGroups
} from './evidence-source-identities.mjs';

const uniqueStrings = (values) => [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))];
const reliabilityRank = new Map([['high', 0], ['medium', 1], ['low', 2], ['unknown', 3]]);

function bestArchiveUrl(rows) {
  return uniqueStrings(rows.map((row) => row.archived_url)).sort((left, right) => {
    const leftRank = /web\.archive\.org\/web\/\d{8,14}/i.test(left) ? 0 : /web\.archive\.org\/web\/\*\//i.test(left) ? 1 : 2;
    const rightRank = /web\.archive\.org\/web\/\d{8,14}/i.test(right) ? 0 : /web\.archive\.org\/web\/\*\//i.test(right) ? 1 : 2;
    return leftRank - rightRank || left.localeCompare(right);
  })[0] ?? null;
}

function bestReliability(rows, fallback) {
  return uniqueStrings(rows.map((row) => row.reliability))
    .filter((value) => reliabilityRank.has(value))
    .sort((left, right) => reliabilityRank.get(left) - reliabilityRank.get(right))[0] ?? fallback;
}

function mergedNotes(rows) {
  const values = uniqueStrings(rows.map((row) => row.notes?.trim()));
  return values.length > 0 ? values.join(' | ') : undefined;
}

export function deduplicateEvidenceRecords(records) {
  const byId = new Map(records.map((record) => [record.id, record]));
  const mergedByCanonicalId = new Map();
  const issues = [];

  for (const group of evidenceSourceIdentityGroups) {
    const ids = [group.canonical_id, ...group.aliases];
    const missing = ids.filter((id) => !byId.has(id));
    if (missing.length > 0) {
      issues.push(`${group.canonical_id}: missing ${missing.join(', ')}`);
      continue;
    }

    const members = ids.map((id) => byId.get(id));
    const urls = uniqueStrings(members.map((row) => String(row.url ?? '').trim()));
    if (urls.length !== 1 || urls[0] !== group.url) {
      issues.push(`${group.canonical_id}: URL set changed`);
      continue;
    }

    const publishedDates = uniqueStrings(members.map((row) => row.published_at));
    if (publishedDates.length > 1) {
      issues.push(`${group.canonical_id}: conflicting published_at values`);
      continue;
    }

    const canonical = byId.get(group.canonical_id);
    const accessedDates = uniqueStrings(members.map((row) => row.accessed_at)).sort();
    const sourceProvenance = canonical.source_provenance ?? members.find((row) => row.source_provenance)?.source_provenance;
    const isPrimary = typeof canonical.is_primary === 'boolean'
      ? canonical.is_primary
      : members.find((row) => typeof row.is_primary === 'boolean')?.is_primary;

    mergedByCanonicalId.set(group.canonical_id, {
      ...canonical,
      published_at: publishedDates[0] ?? canonical.published_at ?? null,
      accessed_at: accessedDates.at(-1) ?? canonical.accessed_at ?? null,
      archived_url: bestArchiveUrl(members) ?? canonical.archived_url ?? null,
      reliability: bestReliability(members, canonical.reliability),
      ...(sourceProvenance ? { source_provenance: sourceProvenance } : {}),
      ...(typeof isPrimary === 'boolean' ? { is_primary: isPrimary } : {}),
      stablecoin_ids: uniqueStrings(members.flatMap((row) => row.stablecoin_ids ?? [])),
      organization_ids: uniqueStrings(members.flatMap((row) => row.organization_ids ?? [])),
      event_ids: uniqueStrings(members.flatMap((row) => row.event_ids ?? [])),
      claim_scopes: uniqueStrings(members.flatMap((row) => row.claim_scopes ?? [])),
      source_alias_ids: [...group.aliases],
      notes: mergedNotes(members)
    });
  }

  if (issues.length > 0) throw new Error(issues.join('\n'));

  return records
    .filter((record) => !evidenceAliasIds.has(record.id))
    .map((record) => mergedByCanonicalId.get(record.id) ?? { ...record, source_alias_ids: [] });
}
