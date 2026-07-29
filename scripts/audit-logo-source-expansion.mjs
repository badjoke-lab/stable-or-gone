import fs from 'node:fs';

const stablecoins = JSON.parse(fs.readFileSync('data/stablecoins.json', 'utf8'));
const deployments = JSON.parse(fs.readFileSync('data/deployments.json', 'utf8'));
const resolver = fs.readFileSync('src/utils/stablecoinLogo.ts', 'utf8');
const mappedSlugs = new Set([...resolver.matchAll(/^\s*'([^']+)':\s*'\/stablecoin-logos\//gm)].map((match) => match[1]));
const byId = new Map(stablecoins.map((record) => [record.id, record]));
const unsupported = stablecoins.filter((record) => !mappedSlugs.has(record.slug));

const readLines = (file) => fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
const trustPaths = readLines(process.env.TRUSTWALLET_PATHS || '/tmp/trustwallet-paths.txt');
const bgdPaths = readLines(process.env.BGD_PATHS || '/tmp/bgd-paths.txt');
const web3Paths = readLines(process.env.WEB3ICONS_PATHS || '/tmp/web3icons-paths.txt');

const chainFolders = new Map([
  ['Ethereum', 'ethereum'], ['BNB Chain', 'smartchain'], ['Polygon', 'polygon'],
  ['Avalanche', 'avalanchec'], ['Arbitrum', 'arbitrum'], ['Base', 'base'],
  ['Optimism', 'optimism'], ['Solana', 'solana'], ['TRON', 'tron'],
  ['XRP Ledger', 'xrp'], ['Stellar', 'stellar'], ['Gnosis Chain', 'xdai'],
  ['Celo', 'celo'], ['Cardano', 'cardano'], ['Waves', 'waves'],
  ['Algorand', 'algorand'], ['XDC Network', 'xdc'], ['Terra', 'terra'],
  ['Terra Classic', 'terra']
]);

const trustByIdentity = new Map();
for (const path of trustPaths) {
  const match = path.match(/^blockchains\/([^/]+)\/assets\/([^/]+)\/logo\.png$/i);
  if (!match) continue;
  trustByIdentity.set(`${match[1].toLowerCase()}|${match[2].toLowerCase()}`, path);
}

const direct = [];
for (const deployment of deployments) {
  const record = byId.get(deployment.stablecoin_id);
  if (!record || mappedSlugs.has(record.slug)) continue;
  const folder = chainFolders.get(deployment.chain);
  const identity = deployment.contract_address || deployment.deployment_identifier;
  if (!folder || !identity) continue;
  const path = trustByIdentity.get(`${folder}|${String(identity).toLowerCase()}`);
  if (!path) continue;
  direct.push({
    slug: record.slug,
    name: record.name,
    symbol: record.symbol,
    chain: deployment.chain,
    deployment_id: deployment.id,
    identity,
    source: 'trustwallet/assets',
    source_path: path,
    match: 'deployment_identity_exact',
    license: 'MIT'
  });
}

const uniqueDirect = [...new Map(direct.map((item) => [item.slug, item])).values()].sort((a, b) => a.slug.localeCompare(b.slug));
const directSlugs = new Set(uniqueDirect.map((item) => item.slug));

const bgdSymbols = new Set();
for (const path of bgdPaths) {
  const match = path.match(/^icons\/full\/([^/]+)\.svg$/i);
  if (match) bgdSymbols.add(match[1].toLowerCase());
}
const web3Symbols = new Set();
for (const path of web3Paths) {
  const match = path.match(/\/tokens\/background\/([^/]+)\.svg$/i);
  if (match) web3Symbols.add(match[1].toLowerCase());
}

const symbolCandidates = [];
for (const record of unsupported) {
  if (directSlugs.has(record.slug)) continue;
  const symbol = String(record.symbol || '').toLowerCase();
  if (bgdSymbols.has(symbol)) symbolCandidates.push({ slug: record.slug, name: record.name, symbol: record.symbol, source: 'bgd-labs/web3-icons', source_path: `icons/full/${symbol}.svg`, match: 'symbol_only_review_required', license: 'MIT' });
  if (web3Symbols.has(symbol)) symbolCandidates.push({ slug: record.slug, name: record.name, symbol: record.symbol, source: '0xa3k5/web3icons', source_path: `packages/core/src/svgs/tokens/background/${record.symbol}.svg`, match: 'symbol_only_review_required', license: 'MIT' });
}

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  canonical_records: stablecoins.length,
  current_mapped_records: mappedSlugs.size,
  unsupported_records: unsupported.length,
  direct_address_candidates: uniqueDirect,
  direct_address_candidate_count: uniqueDirect.length,
  projected_address_verified_coverage: mappedSlugs.size + uniqueDirect.length,
  symbol_candidates: symbolCandidates,
  symbol_candidate_record_count: new Set(symbolCandidates.map((item) => item.slug)).size,
  unresolved_after_direct_match: stablecoins.length - mappedSlugs.size - uniqueDirect.length
};

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/logo-source-expansion.json', `${JSON.stringify(result, null, 2)}\n`);
const lines = [
  '# SOG logo source expansion audit',
  '',
  `- Canonical records: ${result.canonical_records}`,
  `- Current mapped records: ${result.current_mapped_records}`,
  `- Exact deployment-address matches in Trust Wallet Assets: ${result.direct_address_candidate_count}`,
  `- Projected coverage after exact matches: ${result.projected_address_verified_coverage}`,
  `- Symbol-only MIT candidates requiring manual identity review: ${result.symbol_candidate_record_count}`,
  '',
  '## Exact-address candidates',
  ...uniqueDirect.map((item) => `- ${item.name} (${item.symbol}) — ${item.chain} — ${item.source_path}`),
  '',
  '## Symbol-only review queue',
  ...symbolCandidates.map((item) => `- ${item.name} (${item.symbol}) — ${item.source} — ${item.source_path}`)
];
fs.writeFileSync('artifacts/logo-source-expansion.md', `${lines.join('\n')}\n`);
console.log(JSON.stringify(result, null, 2));