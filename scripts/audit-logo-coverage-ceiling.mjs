#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
const outputJson = path.join(root, 'artifacts/logo-coverage-ceiling.json');
const outputMd = path.join(root, 'artifacts/logo-coverage-ceiling.md');

const readRecords = (prefix) => {
  const records = [];
  for (const filename of fs.readdirSync(dataDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json'))) {
    const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
    const items = Array.isArray(parsed) ? parsed : parsed.records ?? parsed.items ?? parsed[prefix] ?? [];
    records.push(...items);
  }
  return records;
};

const stablecoins = readRecords('stablecoins');
const deployments = readRecords('deployments');
const stablecoinById = new Map(stablecoins.map((record) => [record.id, record]));
const stablecoinBySlug = new Map(stablecoins.map((record) => [record.slug, record]));

const resolver = fs.readFileSync(resolverPath, 'utf8');
const mappingBlock = resolver.match(/const LOGOS_BY_SLUG:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? '';
const mappedSlugs = new Set([...mappingBlock.matchAll(/^\s*'([^']+)':\s*'([^']+)'\s*,?$/gm)].map((match) => match[1]));

const sourceFiles = [
  { key: 'metamask', label: 'MetaMask contract-metadata', license: 'ISC', commit: 'd693f70b9c14db177562957b00a70cfcd922b266', path: '/tmp/metamask-paths.txt' },
  { key: 'yearn', label: 'Yearn assets', license: 'MIT', commit: '192375774a16b2d5980fc130f208b9ccb4381443', path: '/tmp/yearn-paths.txt' }
];

const sourcePaths = new Map(sourceFiles.map((source) => [
  source.key,
  fs.existsSync(source.path) ? fs.readFileSync(source.path, 'utf8').split(/\r?\n/).filter(Boolean) : []
]));

const imagePath = (candidate) => /\.(?:svg|png|jpe?g|webp)$/i.test(candidate);
const normalizedAddress = (value) => /^0x[a-fA-F0-9]{40}$/.test(String(value ?? '')) ? String(value).toLowerCase() : null;
const matches = [];

for (const deployment of deployments) {
  const address = normalizedAddress(deployment.contract_address ?? deployment.deployment_identifier);
  if (!address) continue;
  const stablecoin = stablecoinById.get(deployment.stablecoin_id);
  if (!stablecoin || mappedSlugs.has(stablecoin.slug)) continue;
  for (const source of sourceFiles) {
    const paths = sourcePaths.get(source.key) ?? [];
    for (const candidatePath of paths) {
      if (!imagePath(candidatePath)) continue;
      if (!candidatePath.toLowerCase().includes(address)) continue;
      matches.push({
        slug: stablecoin.slug,
        name: stablecoin.name,
        symbol: stablecoin.symbol,
        stablecoin_id: stablecoin.id,
        deployment_id: deployment.id,
        chain: deployment.chain ?? null,
        address,
        source: source.label,
        source_key: source.key,
        source_license: source.license,
        source_commit: source.commit,
        asset_path: candidatePath
      });
    }
  }
}

const exactBySlug = new Map();
for (const match of matches) {
  if (!exactBySlug.has(match.slug)) exactBySlug.set(match.slug, []);
  exactBySlug.get(match.slug).push(match);
}

const clearSymbolReviewNames = [
  'Alchemix USD',
  'Ethena USDtb',
  'Mountain Protocol USD',
  'Staked USDe',
  'Angle Euro',
  'Mento Euro',
  'EURe',
  'Ripple USD',
  'Global Dollar',
  'USDS'
];
const clearSymbolCandidates = clearSymbolReviewNames
  .map((name) => stablecoins.find((record) => record.name === name))
  .filter(Boolean)
  .filter((record) => !mappedSlugs.has(record.slug));

const exactCandidateSlugs = new Set(exactBySlug.keys());
const clearSymbolOnly = clearSymbolCandidates.filter((record) => !exactCandidateSlugs.has(record.slug));
const auditedCeiling = mappedSlugs.size + exactCandidateSlugs.size + clearSymbolOnly.length;
const unresolvedAtCeiling = stablecoins.length - auditedCeiling;

const failures = [];
if (stablecoins.length !== 116) failures.push(`expected 116 stablecoins, found ${stablecoins.length}`);
if (mappedSlugs.size !== 50) failures.push(`expected 50 current logo mappings, found ${mappedSlugs.size}`);
for (const source of sourceFiles) if (!(sourcePaths.get(source.key)?.length)) failures.push(`missing source path list: ${source.key}`);
for (const name of clearSymbolReviewNames) if (!stablecoins.some((record) => record.name === name)) failures.push(`clear symbol candidate not found: ${name}`);

const exactCandidates = [...exactBySlug.entries()].map(([slug, sourceMatches]) => ({
  slug,
  name: stablecoinBySlug.get(slug)?.name ?? slug,
  symbol: stablecoinBySlug.get(slug)?.symbol ?? '',
  matches: sourceMatches
})).sort((a, b) => a.slug.localeCompare(b.slug));

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  canonical_records: stablecoins.length,
  current_mapped_records: mappedSlugs.size,
  current_coverage_percent: Number(((mappedSlugs.size / stablecoins.length) * 100).toFixed(2)),
  additional_exact_address_candidate_records: exactCandidateSlugs.size,
  additional_clear_symbol_candidate_records_not_already_exact: clearSymbolOnly.length,
  audited_permissive_source_ceiling_records: auditedCeiling,
  audited_permissive_source_ceiling_percent: Number(((auditedCeiling / stablecoins.length) * 100).toFixed(2)),
  unresolved_records_at_ceiling: unresolvedAtCeiling,
  exact_address_candidates: exactCandidates,
  clear_symbol_candidates_not_already_exact: clearSymbolOnly.map((record) => ({ slug: record.slug, name: record.name, symbol: record.symbol })),
  excluded_symbol_collision: [
    { symbol: 'USDX', records: stablecoins.filter((record) => String(record.symbol).toUpperCase() === 'USDX').map((record) => ({ slug: record.slug, name: record.name })) }
  ],
  sources: sourceFiles.map(({ path: ignored, ...source }) => source),
  failures
};

const markdown = [
  '# SOG logo coverage ceiling audit',
  '',
  `- Canonical records: ${report.canonical_records}`,
  `- Current mapped records: ${report.current_mapped_records} (${report.current_coverage_percent}%)`,
  `- New exact-address candidate records: ${report.additional_exact_address_candidate_records}`,
  `- Clear symbol candidates not duplicated by exact matches: ${report.additional_clear_symbol_candidate_records_not_already_exact}`,
  `- Audited permissive-source ceiling: ${report.audited_permissive_source_ceiling_records} (${report.audited_permissive_source_ceiling_percent}%)`,
  `- Unresolved at that ceiling: ${report.unresolved_records_at_ceiling}`,
  '',
  '## Exact-address candidates',
  ...exactCandidates.flatMap((candidate) => [
    `- ${candidate.name} (${candidate.symbol}) — ${candidate.slug}`,
    ...candidate.matches.map((match) => `  - ${match.source} — ${match.chain ?? 'chain not recorded'} — ${match.asset_path}`)
  ]),
  '',
  '## Clear symbol candidates not already exact-address matched',
  ...report.clear_symbol_candidates_not_already_exact.map((candidate) => `- ${candidate.name} (${candidate.symbol}) — ${candidate.slug}`),
  '',
  '## Excluded collision',
  ...report.excluded_symbol_collision.flatMap((collision) => [
    `- ${collision.symbol}`,
    ...collision.records.map((record) => `  - ${record.name} — ${record.slug}`)
  ]),
  '',
  '## Failures',
  ...(failures.length ? failures.map((failure) => `- ${failure}`) : ['- None'])
].join('\n');

fs.mkdirSync(path.dirname(outputJson), { recursive: true });
fs.writeFileSync(outputJson, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(outputMd, `${markdown}\n`);

console.log(JSON.stringify({
  current: report.current_mapped_records,
  exact_candidates: report.additional_exact_address_candidate_records,
  clear_symbol_only: report.additional_clear_symbol_candidate_records_not_already_exact,
  ceiling: report.audited_permissive_source_ceiling_records,
  ceiling_percent: report.audited_permissive_source_ceiling_percent,
  failures
}, null, 2));
if (failures.length) process.exit(1);
