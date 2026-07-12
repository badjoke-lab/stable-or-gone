import fs from 'node:fs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = (file) => {
  const value = readJson(file);
  return Array.isArray(value) ? value : value.records;
};
const normalize = (value) => String(value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, ' ');
const compact = (value) => normalize(value).replace(/[^a-z0-9]+/g, '');

const baseline = loadRegistryV2Baseline(process.cwd());
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(rows);
const candidates = readJson('data/editorial-research/record-growth-batch-1-pr358-candidates.json').candidates;

const canonical = stablecoins.map((row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name ?? row.canonical_name ?? null,
  symbol: row.symbol ?? null,
  aliases: [...(row.aliases ?? [])]
})).sort((a, b) => a.id.localeCompare(b.id));

const collisions = candidates.map((candidate) => ({
  candidate_id: candidate.candidate_id,
  proposed_asset_id: candidate.proposed_asset_id,
  proposed_slug: candidate.proposed_slug,
  canonical_name: candidate.canonical_name,
  symbol: candidate.symbol,
  matches: canonical.filter((row) => (
    row.id === candidate.proposed_asset_id
    || normalize(row.slug) === normalize(candidate.proposed_slug)
    || normalize(row.name) === normalize(candidate.canonical_name)
    || compact(row.name) === compact(candidate.canonical_name)
    || normalize(row.symbol) === normalize(candidate.symbol)
    || row.aliases.some((alias) => candidate.aliases.some((candidateAlias) => normalize(alias) === normalize(candidateAlias)))
  ))
}));

const report = {
  schema_version: '1.0',
  audit_id: 'sog_pr358_canonical_identity_audit',
  canonical_asset_count: canonical.length,
  collisions,
  canonical
};
fs.writeFileSync('docs/migration/pr358-canonical-identity-audit.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({canonical_asset_count: canonical.length, collisions}, null, 2));
