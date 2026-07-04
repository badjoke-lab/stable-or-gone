import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const absolute = (relativePath) => path.join(root, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const loadFiles = (files = []) => files.flatMap((file) => readJson(file).map((row) => ({ ...row, __source_file: file })));
const normalize = (value) => String(value ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '');
const normalizeHost = (value) => {
  try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ''); }
  catch { return null; }
};
const groupBy = (rows, keyFn) => {
  const result = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    const list = result.get(key) ?? [];
    list.push(row);
    result.set(key, list);
  }
  return result;
};
const duplicateGroups = (rows, keyFn) => [...groupBy(rows, keyFn).entries()].filter(([, items]) => items.length > 1);
const sortedUnique = (values) => [...new Set(values.filter(Boolean))].sort();

const baseline = loadRegistryV2Baseline(root);
const stablecoins = loadFiles(baseline.data_groups.stablecoins ?? []);
const organizations = loadFiles(baseline.data_groups.organizations ?? []);
const relationships = loadFiles(baseline.data_groups.relationships ?? []);
const candidateMaster = readJson('docs/growth/candidate-master-70.json');
const candidateRows = loadFiles(candidateMaster.candidate_files ?? []);
const promotionFiles = fs.readdirSync(absolute('data'))
  .filter((name) => /^candidate-promotions-batch-[a-z0-9-]+\.json$/i.test(name))
  .sort()
  .map((name) => `data/${name}`);
const promotionRows = loadFiles(promotionFiles);
const promotionByCandidate = new Map(promotionRows.map((row) => [row.candidate_id, row]));
const candidates = candidateRows.map((row) => ({ ...row, ...(promotionByCandidate.get(row.candidate_id) ?? {}) }));
const promoted = candidates.filter((row) => row.status === 'promoted');

const lineageFiles = fs.readdirSync(absolute('data'))
  .filter((name) => /^stable-asset-relationships-v3.*\.json$/i.test(name))
  .sort()
  .map((name) => `data/${name}`);
const lineageRelationships = loadFiles(lineageFiles);

const critical = [];
const warnings = [];
const observations = [];

const pushDuplicates = (label, rows, keyFn, severity = 'critical') => {
  for (const [key, items] of duplicateGroups(rows, keyFn)) {
    const message = `${label} ${key}: ${items.map((row) => `${row.id ?? row.candidate_id} (${row.name ?? row.slug ?? row.symbol ?? 'unnamed'})`).join(', ')}`;
    (severity === 'critical' ? critical : warnings).push(message);
  }
};

pushDuplicates('duplicate stablecoin id', stablecoins, (row) => row.id);
pushDuplicates('duplicate exact slug', stablecoins, (row) => row.slug);
pushDuplicates('normalized slug collision', stablecoins, (row) => normalize(row.slug));
pushDuplicates('normalized canonical-name collision', stablecoins, (row) => normalize(row.name));
pushDuplicates('duplicate organization id', organizations, (row) => row.id);
pushDuplicates('duplicate organization slug', organizations, (row) => row.slug);

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const organizationById = new Map(organizations.map((row) => [row.id, row]));
const relationshipByStablecoin = groupBy(relationships, (row) => row.stablecoin_id);

const identityTokens = new Map();
for (const coin of stablecoins) {
  const values = [
    { kind: 'name', value: coin.name },
    { kind: 'symbol', value: coin.symbol },
    ...(coin.aliases ?? []).map((value) => ({ kind: 'alias', value }))
  ];
  const seenForCoin = new Set();
  for (const item of values) {
    const token = normalize(item.value);
    if (!token || seenForCoin.has(`${item.kind}:${token}`)) continue;
    seenForCoin.add(`${item.kind}:${token}`);
    const owners = identityTokens.get(token) ?? [];
    owners.push({ id: coin.id, slug: coin.slug, name: coin.name, symbol: coin.symbol, kind: item.kind, value: item.value });
    identityTokens.set(token, owners);
  }
}

const sharedIdentityTokens = [];
for (const [token, owners] of identityTokens) {
  const ids = sortedUnique(owners.map((row) => row.id));
  if (ids.length <= 1) continue;
  const nameOwners = sortedUnique(owners.filter((row) => row.kind === 'name').map((row) => row.id));
  const shared = { token, ids, owners };
  sharedIdentityTokens.push(shared);
  if (nameOwners.length > 1) critical.push(`canonical name token ${token} is shared by ${nameOwners.join(', ')}`);
  else warnings.push(`identity token ${token} is shared by ${ids.join(', ')}; symbol/alias collision requires disambiguated public identity`);
}

const symbolGroups = duplicateGroups(stablecoins, (row) => normalize(row.symbol)).map(([symbol, items]) => ({
  symbol,
  ids: items.map((row) => row.id).sort(),
  names: items.map((row) => row.name).sort()
}));
for (const group of symbolGroups) warnings.push(`shared symbol ${group.symbol}: ${group.ids.join(', ')}`);

const aliasCoverageGaps = [];
const candidateByRecord = new Map();
for (const candidate of promoted) {
  const recordId = candidate.promoted_record_id ?? candidate.proposed_record_id ?? candidate.proposed_stablecoin_id;
  if (!recordId) {
    critical.push(`${candidate.candidate_id} is promoted without a canonical record id`);
    continue;
  }
  const owners = candidateByRecord.get(recordId) ?? [];
  owners.push(candidate);
  candidateByRecord.set(recordId, owners);
}
for (const [recordId, rows] of candidateByRecord) {
  if (rows.length > 1) critical.push(`multiple promoted candidates map to ${recordId}: ${rows.map((row) => row.candidate_id).join(', ')}`);
}

for (const coin of stablecoins) {
  const mapped = candidateByRecord.get(coin.id) ?? [];
  if (mapped.length !== 1) {
    critical.push(`${coin.id} has ${mapped.length} promoted candidate mappings; expected exactly one`);
    continue;
  }
  const candidate = mapped[0];
  if (candidate.slug && candidate.slug !== coin.slug) warnings.push(`${coin.id} canonical slug ${coin.slug} differs from promoted candidate slug ${candidate.slug}`);
  if (candidate.name && normalize(candidate.name) !== normalize(coin.name) && !(coin.aliases ?? []).some((alias) => normalize(alias) === normalize(candidate.name))) {
    warnings.push(`${coin.id} candidate name ${candidate.name} is not preserved as canonical name or alias`);
  }
  const canonicalTokens = new Set([coin.name, coin.symbol, ...(coin.aliases ?? [])].map(normalize).filter(Boolean));
  const missingAliases = (candidate.aliases ?? []).filter((alias) => !canonicalTokens.has(normalize(alias)));
  if (missingAliases.length) {
    aliasCoverageGaps.push({ stablecoin_id: coin.id, candidate_id: candidate.candidate_id, missing_aliases: missingAliases });
    warnings.push(`${coin.id} omits candidate aliases: ${missingAliases.join(', ')}`);
  }
}
if (promoted.length !== stablecoins.length) critical.push(`promoted candidate count ${promoted.length} differs from stablecoin count ${stablecoins.length}`);

const organizationDomains = organizations.map((organization) => ({
  organization_id: organization.id,
  name: organization.name,
  host: normalizeHost(organization.official_url),
  official_url: organization.official_url
})).filter((row) => row.host);
const sharedOrganizationDomains = duplicateGroups(organizationDomains, (row) => row.host).map(([host, items]) => ({
  host,
  organization_ids: items.map((row) => row.organization_id).sort(),
  names: items.map((row) => row.name).sort()
}));
for (const group of sharedOrganizationDomains) warnings.push(`official domain ${group.host} is shared by organizations ${group.organization_ids.join(', ')}`);

const assetDomainRows = stablecoins.map((coin) => {
  const related = relationshipByStablecoin.get(coin.id) ?? [];
  const organizationIds = sortedUnique([coin.issuer_id, ...related.map((row) => row.organization_id)]);
  const domains = sortedUnique(organizationIds.map((id) => normalizeHost(organizationById.get(id)?.official_url)));
  return { stablecoin_id: coin.id, slug: coin.slug, organization_ids: organizationIds, official_domains: domains };
});
const assetsWithoutOfficialDomain = assetDomainRows.filter((row) => row.official_domains.length === 0);
for (const row of assetsWithoutOfficialDomain) warnings.push(`${row.stablecoin_id} has no official domain reachable through current organization relationships`);

const lineageTypeCounts = {};
for (const row of lineageRelationships) {
  lineageTypeCounts[row.relationship_type] = (lineageTypeCounts[row.relationship_type] ?? 0) + 1;
  if (!stablecoinById.has(row.from_asset_id)) critical.push(`${row.id} references missing from_asset_id ${row.from_asset_id}`);
  if (!stablecoinById.has(row.to_asset_id)) critical.push(`${row.id} references missing to_asset_id ${row.to_asset_id}`);
  if (row.from_asset_id === row.to_asset_id) critical.push(`${row.id} is a self-referential lineage relationship`);
}
pushDuplicates('duplicate lineage relationship id', lineageRelationships, (row) => row.id);

const samePairGroups = duplicateGroups(lineageRelationships, (row) => `${row.from_asset_id}|${row.to_asset_id}|${row.relationship_type}`);
for (const [key, items] of samePairGroups) critical.push(`duplicate lineage relationship ${key}: ${items.map((row) => row.id).join(', ')}`);

const directedAdjacency = new Map();
for (const row of lineageRelationships) {
  const next = directedAdjacency.get(row.from_asset_id) ?? [];
  next.push(row.to_asset_id);
  directedAdjacency.set(row.from_asset_id, next);
}
const lineageCycles = [];
const visit = (node, stack = [], active = new Set()) => {
  if (active.has(node)) {
    const index = stack.indexOf(node);
    lineageCycles.push([...stack.slice(index), node]);
    return;
  }
  const nextNodes = directedAdjacency.get(node) ?? [];
  if (!nextNodes.length) return;
  const nextActive = new Set(active);
  nextActive.add(node);
  for (const next of nextNodes) visit(next, [...stack, node], nextActive);
};
for (const node of directedAdjacency.keys()) visit(node);
for (const cycle of lineageCycles) critical.push(`lineage cycle detected: ${cycle.join(' -> ')}`);

observations.push(`Audited ${stablecoins.length} stable assets, ${organizations.length} organizations, ${relationships.length} organization relationships, ${promoted.length} promoted candidate mappings, and ${lineageRelationships.length} explicit stable-asset lineage relationships.`);
observations.push(`${symbolGroups.length} canonical symbol groups are shared by more than one asset and remain visible for disambiguation review.`);
observations.push(`${sharedIdentityTokens.length} normalized identity tokens are shared across canonical records.`);
observations.push(`${assetsWithoutOfficialDomain.length} assets have no official domain reachable through current organization relationships.`);

const summary = {
  schema_version: '1.0',
  audit_id: 'sog_registry_100_identity_lineage_pr297',
  baseline_id: baseline.baseline_id,
  audited_counts: {
    stable_assets: stablecoins.length,
    organizations: organizations.length,
    organization_relationships: relationships.length,
    promoted_candidate_mappings: promoted.length,
    explicit_asset_lineage_relationships: lineageRelationships.length
  },
  identity: {
    shared_symbol_groups: symbolGroups,
    shared_identity_tokens: sharedIdentityTokens.map(({ token, ids, owners }) => ({ token, ids, owners })),
    alias_coverage_gaps: aliasCoverageGaps,
    assets_without_official_domain: assetsWithoutOfficialDomain,
    shared_organization_domains: sharedOrganizationDomains
  },
  lineage: {
    relationship_type_counts: lineageTypeCounts,
    relationships: lineageRelationships.map((row) => ({
      id: row.id,
      from_asset_id: row.from_asset_id,
      to_asset_id: row.to_asset_id,
      relationship_type: row.relationship_type,
      status: row.status
    })),
    cycles: lineageCycles
  },
  findings: { critical, warnings, observations },
  result: critical.length === 0 ? 'pass_with_review_warnings' : 'fail'
};

const markdownList = (rows, empty = 'None.') => rows.length ? rows.map((row) => `- ${row}`).join('\n') : `- ${empty}`;
const markdown = [
  '# SOG 100-Record Identity and Lineage Audit',
  '',
  `- Audit ID: \`${summary.audit_id}\``,
  `- Baseline: \`${summary.baseline_id}\``,
  `- Stable assets: **${stablecoins.length}**`,
  `- Organizations: **${organizations.length}**`,
  `- Promoted candidate mappings: **${promoted.length}**`,
  `- Explicit asset-lineage relationships: **${lineageRelationships.length}**`,
  `- Critical findings: **${critical.length}**`,
  `- Review warnings: **${warnings.length}**`,
  '',
  '## Scope',
  '',
  '- canonical ID and slug uniqueness;',
  '- normalized canonical-name collisions;',
  '- symbol and alias collision visibility;',
  '- candidate-to-canonical one-to-one mapping;',
  '- candidate alias preservation;',
  '- organization official-domain reachability;',
  '- explicit stable-asset relationship reference integrity;',
  '- duplicate lineage edges and directed lineage cycles.',
  '',
  '## Shared Symbol Groups',
  '',
  ...(symbolGroups.length ? symbolGroups.map((group) => `- \`${group.symbol}\`: ${group.ids.join(', ')}`) : ['- None.']),
  '',
  '## Explicit Lineage Relationships',
  '',
  ...(lineageRelationships.length ? lineageRelationships.map((row) => `- \`${row.id}\`: ${row.from_asset_id} -> ${row.to_asset_id} (${row.relationship_type}, ${row.status})`) : ['- None.']),
  '',
  '## Critical Findings',
  '',
  markdownList(critical),
  '',
  '## Review Warnings',
  '',
  markdownList(warnings),
  '',
  '## Observations',
  '',
  markdownList(observations),
  '',
  '## Result',
  '',
  critical.length === 0
    ? 'PASS. No duplicate canonical identity, broken candidate mapping, invalid lineage reference, duplicate lineage edge, or lineage cycle was detected. Shared symbols and aliases remain explicit review warnings because symbol reuse alone does not prove duplicate asset identity.'
    : 'FAIL. Critical identity or lineage findings must be resolved before the audit can close.',
  ''
].join('\n');

const outputJson = 'data/generated/registry-identity-lineage-audit.json';
const outputMarkdown = 'docs/audits/registry-100-identity-lineage-audit.md';
fs.mkdirSync(path.dirname(absolute(outputJson)), { recursive: true });
fs.mkdirSync(path.dirname(absolute(outputMarkdown)), { recursive: true });
fs.writeFileSync(absolute(outputJson), `${JSON.stringify(summary, null, 2)}\n`);
fs.writeFileSync(absolute(outputMarkdown), markdown);

console.log(JSON.stringify({
  audit_id: summary.audit_id,
  result: summary.result,
  stable_assets: stablecoins.length,
  critical: critical.length,
  warnings: warnings.length,
  shared_symbol_groups: symbolGroups.length,
  explicit_lineage_relationships: lineageRelationships.length
}, null, 2));

if (critical.length) process.exit(1);
