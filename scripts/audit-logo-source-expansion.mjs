import fs from 'node:fs';
import path from 'node:path';

const dataDir = 'data';
const recordsBySlug = new Map();
const recordsById = new Map();
const deployments = [];

for (const filename of fs.readdirSync(dataDir).filter((name) => /^stablecoins(?:-|\.)/.test(name) && name.endsWith('.json'))) {
  const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
  const records = Array.isArray(parsed) ? parsed : parsed.stablecoins ?? parsed.records ?? parsed.items ?? [];
  for (const record of records) {
    if (!record || typeof record.slug !== 'string') continue;
    recordsBySlug.set(record.slug, record);
    if (typeof record.id === 'string') recordsById.set(record.id, record);
  }
}
for (const filename of fs.readdirSync(dataDir).filter((name) => /^deployments(?:-|\.)/.test(name) && name.endsWith('.json'))) {
  const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
  const records = Array.isArray(parsed) ? parsed : parsed.deployments ?? parsed.records ?? parsed.items ?? [];
  deployments.push(...records.filter(Boolean));
}

const stablecoins = [...recordsBySlug.values()];
const resolver = fs.readFileSync('src/utils/stablecoinLogo.ts', 'utf8');
const mappingBlock = resolver.match(/const LOGOS_BY_SLUG:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? '';
const mappedSlugs = new Set([...mappingBlock.matchAll(/^\s*'([^']+)':\s*'([^']+)'\s*,?$/gm)].map((match) => match[1]));
const unsupported = stablecoins.filter((record) => !mappedSlugs.has(record.slug));

const readLines = (file) => fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
const trustPaths = readLines(process.env.TRUSTWALLET_PATHS || '/tmp/trustwallet-paths.txt');
const bgdPaths = readLines(process.env.BGD_PATHS || '/tmp/bgd-paths.txt');
const web3Paths = readLines(process.env.WEB3ICONS_PATHS || '/tmp/web3icons-paths.txt');

const chainFolders = new Map([
  ['Ethereum', 'ethereum'], ['BNB Chain', 'smartchain'], ['BNB Smart Chain', 'smartchain'],
  ['Polygon', 'polygon'], ['Avalanche', 'avalanchec'], ['Arbitrum', 'arbitrum'],
  ['Base', 'base'], ['Optimism', 'optimism'], ['Solana', 'solana'], ['TRON', 'tron'],
  ['XRP Ledger', 'xrp'], ['Stellar', 'stellar'], ['Gnosis Chain', 'xdai'],
  ['Celo', 'celo'], ['Cardano', 'cardano'], ['Waves', 'waves'],
  ['Algorand', 'algorand'], ['XDC Network', 'xdc'], ['Terra', 'terra'],
  ['Terra Classic', 'terra'], ['Fantom', 'fantom'], ['Aptos', 'aptos'],
  ['Sui', 'sui'], ['Near', 'near'], ['NEAR', 'near']
]);

const trustByIdentity = new Map();
for (const sourcePath of trustPaths) {
  const match = sourcePath.match(/^blockchains\/([^/]+)\/assets\/([^/]+)\/logo\.png$/i);
  if (!match) continue;
  trustByIdentity.set(`${match[1].toLowerCase()}|${match[2].toLowerCase()}`, sourcePath);
}

const direct = [];
for (const deployment of deployments) {
  const record = recordsById.get(deployment.stablecoin_id);
  if (!record || mappedSlugs.has(record.slug)) continue;
  const folder = chainFolders.get(deployment.chain);
  const identity = deployment.contract_address || deployment.deployment_identifier;
  if (!folder || !identity) continue;
  const sourcePath = trustByIdentity.get(`${folder}|${String(identity).toLowerCase()}`);
  if (!sourcePath) continue;
  direct.push({
    slug: record.slug,
    name: record.name,
    symbol: record.symbol,
    chain: deployment.chain,
    deployment_id: deployment.id,
    identity,
    source: 'trustwallet/assets',
    source_path: sourcePath,
    match: 'deployment_identity_exact',
    license: 'MIT'
  });
}

const uniqueDirect = [...new Map(direct.map((item) => [item.slug, item])).values()].sort((a, b) => a.slug.localeCompare(b.slug));
const directSlugs = new Set(uniqueDirect.map((item) => item.slug));

const bgdSymbols = new Set();
for (const sourcePath of bgdPaths) {
  const match = sourcePath.match(/^icons\/full\/([^/]+)\.svg$/i);
  if (match) bgdSymbols.add(match[1].toLowerCase());
}
const web3Symbols = new Set();
for (const sourcePath of web3Paths) {
  const match = sourcePath.match(/\/tokens\/background\/([^/]+)\.svg$/i);
  if (match) web3Symbols.add(match[1].toLowerCase());
}

const symbolCandidates = [];
for (const record of unsupported) {
  if (directSlugs.has(record.slug)) continue;
  const symbol = String(record.symbol || '').toLowerCase();
  if (!symbol) continue;
  if (bgdSymbols.has(symbol)) symbolCandidates.push({ slug: record.slug, name: record.name, symbol: record.symbol, source: 'bgd-labs/web3-icons', source_path: `icons/full/${symbol}.svg`, match: 'symbol_only_review_required', license: 'MIT' });
  if (web3Symbols.has(symbol)) symbolCandidates.push({ slug: record.slug, name: record.name, symbol: record.symbol, source: '0xa3k5/web3icons', source_path: `packages/core/src/svgs/tokens/background/${record.symbol}.svg`, match: 'symbol_only_review_required', license: 'MIT' });
}

const result = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  canonical_records: stablecoins.length,
  current_mapped_records: mappedSlugs.size,
  unsupported_records: unsupported.length,
  deployment_records_scanned: deployments.length,
  direct_address_candidates: uniqueDirect,
  direct_address_candidate_count: uniqueDirect.length,
  projected_address_verified_coverage: mappedSlugs.size + uniqueDirect.length,
  symbol_candidates: symbolCandidates,
  symbol_candidate_record_count: new Set(symbolCandidates.map((item) => item.slug)).size,
  unresolved_after_direct_match: stablecoins.length - mappedSlugs.size - uniqueDirect.length,
  failures: []
};
if (stablecoins.length !== 116) result.failures.push(`expected 116 canonical stablecoin records, found ${stablecoins.length}`);
if (mappedSlugs.size !== 39) result.failures.push(`expected 39 current mappings, found ${mappedSlugs.size}`);

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/logo-source-expansion.json', `${JSON.stringify(result, null, 2)}\n`);
const lines = [
  '# SOG logo source expansion audit', '',
  `- Canonical records: ${result.canonical_records}`,
  `- Current mapped records: ${result.current_mapped_records}`,
  `- Unsupported records: ${result.unsupported_records}`,
  `- Deployment records scanned: ${result.deployment_records_scanned}`,
  `- Exact deployment-address matches in Trust Wallet Assets: ${result.direct_address_candidate_count}`,
  `- Projected coverage after exact matches: ${result.projected_address_verified_coverage}`,
  `- Symbol-only MIT candidates requiring manual identity review: ${result.symbol_candidate_record_count}`,
  '', '## Exact-address candidates',
  ...uniqueDirect.map((item) => `- ${item.name} (${item.symbol}) — ${item.chain} — ${item.source_path}`),
  '', '## Symbol-only review queue',
  ...symbolCandidates.map((item) => `- ${item.name} (${item.symbol}) — ${item.source} — ${item.source_path}`),
  '', '## Failures',
  ...(result.failures.length ? result.failures.map((failure) => `- ${failure}`) : ['- None'])
];
fs.writeFileSync('artifacts/logo-source-expansion.md', `${lines.join('\n')}\n`);
console.log(JSON.stringify(result, null, 2));
if (result.failures.length) process.exit(1);