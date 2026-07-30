#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const research = JSON.parse(fs.readFileSync(path.join(root, 'artifacts/stablecoin-logo-research.json'), 'utf8'));
const candidateReport = JSON.parse(fs.readFileSync(path.join(root, 'artifacts/stablecoin-logo-candidates.json'), 'utf8'));
const candidateRoot = path.join(root, 'artifacts/stablecoin-logo-candidates');
const logoDir = path.join(root, 'public/stablecoin-logos');
const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
const decisionsPath = path.join(root, 'config/stablecoin-logo-decisions.json');
const readmePath = path.join(logoDir, 'README.md');
const auditPath = path.join(root, 'scripts/audit-stablecoin-logo-coverage.mjs');
const tempDir = path.join(root, 'artifacts/final-logo-import');
fs.mkdirSync(logoDir, { recursive: true });
fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(tempDir, { recursive: true });

const selections = {
  'acala-ausd': [3, 'official_project_mark'],
  'ae-coin': [5, 'official_product_mark'],
  'anzen-usdz': [1, 'official_product_mark'],
  'audd': [1, 'token_logo'],
  'avalon-usda': [2, 'official_project_mark'],
  'blast-usdb': [1, 'official_product_mark'],
  'bold': [1, 'token_logo'],
  'brz': [2, 'official_project_mark'],
  'cashio-dollar': [2, 'token_logo'],
  'chfau': [3, 'official_issuer_mark'],
  'coins-phpc': [1, 'official_issuer_mark'],
  'dforce-usx': [1, 'official_product_mark'],
  'eurau': [1, 'official_issuer_mark'],
  'eurcv': [1, 'token_logo'],
  'euri': [1, 'token_logo'],
  'eurq': [1, 'token_logo'],
  'fx-protocol-fxusd': [1, 'official_product_mark'],
  'gbpq': [3, 'official_issuer_mark'],
  'gyroscope-gyd': [2, 'token_logo'],
  'jpyc': [1, 'token_logo'],
  'jpysc': [1, 'token_logo'],
  'kava-usdx': [1, 'token_logo'],
  'loon-cadc': [6, 'token_logo'],
  'm0-m': [4, 'token_logo'],
  'mainstreet-msusd': [1, 'official_product_mark'],
  'mento-eurm': [1, 'token_logo'],
  'noble-usdn': [1, 'official_product_mark'],
  'nuon': [2, 'token_logo'],
  'plnq': [3, 'official_issuer_mark'],
  'reserve-usd3': [1, 'official_product_mark'],
  'sekau': [1, 'official_issuer_mark'],
  'sofiusd': [3, 'official_issuer_mark'],
  'solstice-usx': [1, 'token_logo'],
  'spot': [1, 'token_logo'],
  'stables-labs-usdx': [1, 'token_logo'],
  'stablr-eurr': [6, 'token_logo'],
  'stablr-usdr': [1, 'token_logo'],
  'straitsx-usd-xusd': [1, 'token_logo'],
  'straitsx-xidr': [1, 'token_logo'],
  'susds': [1, 'token_logo'],
  'usat': [2, 'token_logo'],
  'usdgo': [1, 'official_issuer_mark'],
  'usdh': [1, 'official_issuer_mark'],
  'usdn': [1, 'token_logo'],
  'usdq': [1, 'token_logo'],
  'usdy': [3, 'official_project_mark'],
  'usk': [3, 'official_project_mark'],
  'usr': [1, 'official_project_mark'],
  'usyc': [2, 'token_logo'],
  'uxd-protocol': [4, 'token_logo'],
  'vchf': [1, 'official_issuer_mark'],
  'zarp': [2, 'token_logo']
};

const manual = {
  'dynamic-set-dollar': {
    mark_type: 'token_logo',
    asset_url: 'https://dsd.finance/logo.png',
    source_page: 'https://github.com/dynamicsetdollar/dsd-protocol/blob/main/README.md',
    source_class: 'official_github_documented_asset',
    evidence: 'Official README identifies Dynamic Set Dollar, symbol DSD, mainnet contract, and the logo URL.'
  },
  'empty-set-dollar': {
    mark_type: 'token_logo',
    asset_url: 'https://raw.githubusercontent.com/emptysetsquad/dollar-dashboard/master/public/logo/esd_logo_circle.png',
    source_page: 'https://github.com/emptysetsquad/dollar/blob/master/README.md',
    source_class: 'official_github_asset',
    evidence: 'Official README identifies Empty Set Dollar, symbol ESD, mainnet contract, and the icon path.'
  },
  'nzds': {
    mark_type: 'token_logo',
    asset_url: 'https://www.techemynt.com/wp-content/uploads/2022/06/nzds-Icon-filled.svg',
    source_page: 'https://www.techemynt.com/nzds-brand-assets/',
    source_class: 'official_brand_asset',
    evidence: 'Issuer brand page provides the NZDS icon for listings and charts.'
  },
  'poundtoken': {
    mark_type: 'verified_directory_mark',
    asset_url: 'https://s2.coinmarketcap.com/static/img/coins/128x128/21145.png',
    source_page: 'https://coinmarketcap.com/currencies/poundtoken/',
    source_class: 'verified_directory_mark',
    evidence: 'CoinMarketCap UCID 21145; Poundtoken/1GBP name, symbol, historical branding, and canonical contract were cross-checked.',
    identity_basis: 'canonical contract address, Poundtoken/1GBP name and symbol, historical official branding, and CoinMarketCap UCID 21145'
  }
};

const crops = {
  'loon-cadc': '512x512+512+0',
  'solstice-usx': '96x96+236+64'
};

const recordBySlug = new Map(research.records.map((record) => [record.slug, record]));
const candidatesBySlug = new Map(candidateReport.records.map((record) => [record.slug, record]));
const selectedSlugs = new Set([...Object.keys(selections), ...Object.keys(manual)]);
if (selectedSlugs.size !== 56) throw new Error(`expected 56 selected unresolved records, found ${selectedSlugs.size}`);
for (const record of research.unresolved) if (!selectedSlugs.has(record.slug)) throw new Error(`unresolved record has no final selection: ${record.slug}`);

const fetchAsset = async (url, output) => {
  const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Stable-or-Gone-logo-finalization/1.0 (+https://sog.badjoke-lab.com)', accept: 'image/*,*/*;q=0.5' } });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length || buffer.length > 4_000_000) throw new Error(`invalid asset size ${buffer.length} for ${url}`);
  fs.writeFileSync(output, buffer);
  return { content_type: response.headers.get('content-type') ?? '', final_url: response.url };
};

const isSvg = (filename, contentType = '') => filename.toLowerCase().endsWith('.svg') || contentType.includes('svg');
const runConvert = (input, output, crop = null) => {
  const args = [input];
  if (crop) args.push('-crop', crop, '+repage');
  args.push('-resize', '224x224', '-gravity', 'center', '-background', 'none', '-extent', '256x256', output);
  const result = spawnSync('convert', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ImageMagick failed for ${input}: ${result.stderr}`);
};

const imported = [];
for (const slug of [...selectedSlugs].sort()) {
  const canonical = recordBySlug.get(slug);
  if (!canonical) throw new Error(`selection is not canonical: ${slug}`);
  let sourceFile;
  let sourcePage;
  let sourceClass;
  let sourceUrl;
  let evidence;
  let markType;
  let identityBasis = 'canonical slug, stablecoin name, symbol, issuer, and attributable same-asset source';
  let contentType = '';

  if (manual[slug]) {
    const item = manual[slug];
    markType = item.mark_type;
    sourcePage = item.source_page;
    sourceClass = item.source_class;
    sourceUrl = item.asset_url;
    evidence = item.evidence;
    identityBasis = item.identity_basis ?? identityBasis;
    sourceFile = path.join(tempDir, `${slug}-download`);
    const fetched = await fetchAsset(sourceUrl, sourceFile);
    contentType = fetched.content_type;
    sourceUrl = fetched.final_url;
  } else {
    const [candidateIndex, selectedMarkType] = selections[slug];
    const candidateRecord = candidatesBySlug.get(slug);
    const candidate = candidateRecord?.candidates?.[candidateIndex - 1];
    if (!candidate) throw new Error(`candidate ${candidateIndex} missing for ${slug}`);
    markType = selectedMarkType;
    sourcePage = candidate.source_page;
    sourceClass = candidate.source_type;
    sourceUrl = candidate.asset_url;
    evidence = candidate.evidence;
    sourceFile = path.join(candidateRoot, candidate.local_file);
    contentType = candidate.content_type ?? '';
    if (!fs.existsSync(sourceFile)) throw new Error(`downloaded candidate file missing for ${slug}: ${candidate.local_file}`);
  }

  let assetName;
  if (isSvg(sourceFile, contentType)) {
    const source = fs.readFileSync(sourceFile, 'utf8');
    if (!source.includes('<svg')) throw new Error(`invalid SVG selected for ${slug}`);
    assetName = `${slug}.svg`;
    fs.writeFileSync(path.join(logoDir, assetName), source);
  } else {
    assetName = `${slug}.png`;
    runConvert(sourceFile, path.join(logoDir, assetName), crops[slug] ?? null);
  }
  imported.push({
    slug,
    name: canonical.name,
    symbol: canonical.symbol,
    decision: 'accepted_local_mark',
    mark_type: markType,
    asset_path: `/stablecoin-logos/${assetName}`,
    source_page: sourcePage,
    source_asset_url: sourceUrl,
    source_class: sourceClass,
    identity_basis: identityBasis,
    evidence: String(evidence ?? '').trim(),
    transformation: crops[slug] ? `cropped official artwork (${crops[slug]}) and centered on a 256px transparent canvas` : assetName.endsWith('.png') ? 'proportionally fitted to a 256px transparent canvas' : 'vendored without artwork changes'
  });
}

let resolver = fs.readFileSync(resolverPath, 'utf8');
const blockMatch = resolver.match(/const LOGOS_BY_SLUG:[\s\S]*?= \{([\s\S]*?)\n\};/);
if (!blockMatch) throw new Error('LOGOS_BY_SLUG block not found');
const existingMappings = new Map([...blockMatch[1].matchAll(/^\s*'([^']+)':\s*'([^']+)'\s*,?$/gm)].map((match) => [match[1], match[2]]));
for (const item of imported) existingMappings.set(item.slug, item.asset_path);
if (existingMappings.size !== 116) throw new Error(`expected 116 logo mappings after import, found ${existingMappings.size}`);
const newBlock = [...existingMappings.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([slug, asset]) => `  '${slug}': '${asset}'`).join(',\n');
resolver = resolver.replace(blockMatch[1], `\n${newBlock}`);
fs.writeFileSync(resolverPath, resolver);

const importedBySlug = new Map(imported.map((item) => [item.slug, item]));
const decisions = research.records.map((record) => importedBySlug.get(record.slug) ?? {
  slug: record.slug,
  name: record.name,
  symbol: record.symbol,
  decision: 'accepted_local_mark',
  mark_type: 'previously_audited_mark',
  asset_path: existingMappings.get(record.slug),
  source_page: 'public/stablecoin-logos/README.md',
  source_asset_url: existingMappings.get(record.slug),
  source_class: 'previously_audited_local_asset',
  identity_basis: 'previous audited slug mapping and pinned provenance recorded in the local asset README',
  evidence: 'Accepted before the corpus-wide closure pass; retained after canonical slug and asset existence revalidation.',
  transformation: 'as documented by the prior pinned-source import'
}).sort((left, right) => left.slug.localeCompare(right.slug));

const counts = decisions.reduce((output, item) => {
  output[item.mark_type] = (output[item.mark_type] ?? 0) + 1;
  return output;
}, {});
const ledger = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  policy: {
    canonical_records: 116,
    undecided_records_allowed: 0,
    neutral_fallback_records: 0,
    mark_is_decorative: true,
    adjacent_name_and_symbol_are_authoritative: true,
    generated_substitute_brand_artwork: false,
    accepted_mark_types: ['token_logo', 'official_product_mark', 'official_project_mark', 'official_issuer_mark', 'verified_directory_mark', 'previously_audited_mark']
  },
  counts,
  records: decisions
};
fs.mkdirSync(path.dirname(decisionsPath), { recursive: true });
fs.writeFileSync(decisionsPath, `${JSON.stringify(ledger, null, 2)}\n`);

let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(/Current audited coverage: \*\*\d+ of 116[^\n]*\*\*\./, 'Current audited coverage: **116 of 116 canonical records (100%)**.');
const closureHeading = '## Corpus-wide logo disposition closure';
const closure = `${closureHeading}\n\nAll 116 canonical Stablecoin records now have a final local image-mark decision. The adjacent canonical name and symbol remain authoritative. The decision ledger distinguishes token-specific logos from official product, project, issuer, and verified-directory marks; the interface does not imply that every image is a distinct token logo. No generated substitute brand artwork is used.\n\nDecision ledger: \`config/stablecoin-logo-decisions.json\`.\n\nImported during the closure pass: ${imported.length} records. Current mark-type counts: ${Object.entries(counts).sort().map(([key, value]) => `\`${key}\` ${value}`).join(', ')}.\n`;
if (readme.includes(closureHeading)) readme = readme.slice(0, readme.indexOf(closureHeading)).trimEnd() + `\n\n${closure}`;
else readme = readme.trimEnd() + `\n\n${closure}`;
fs.writeFileSync(readmePath, readme);

const auditSource = `#!/usr/bin/env node\nimport fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = process.cwd();\nconst dataDir = path.join(root, 'data');\nconst logoDir = path.join(root, 'public/stablecoin-logos');\nconst resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');\nconst decisionsPath = path.join(root, 'config/stablecoin-logo-decisions.json');\nconst outputPath = path.join(root, 'artifacts/stablecoin-logo-coverage.json');\nconst recordsBySlug = new Map();\nfor (const filename of fs.readdirSync(dataDir).filter((name) => /^stablecoins(?:-|\\.)/.test(name) && name.endsWith('.json'))) {\n  const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));\n  for (const record of (Array.isArray(parsed) ? parsed : parsed.stablecoins ?? parsed.records ?? parsed.items ?? [])) {\n    if (record && typeof record.slug === 'string') recordsBySlug.set(record.slug, { slug: record.slug, symbol: String(record.symbol ?? ''), name: String(record.name ?? record.slug) });\n  }\n}\nconst resolver = fs.readFileSync(resolverPath, 'utf8');\nconst mappingBlock = resolver.match(/const LOGOS_BY_SLUG:[\\s\\S]*?= \\{([\\s\\S]*?)\\n\\};/)?.[1] ?? '';\nconst mappings = [...mappingBlock.matchAll(/^\\s*'([^']+)':\\s*'([^']+)'\\s*,?$/gm)].map((match) => ({ slug: match[1], asset: match[2] }));\nconst decisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));\nconst failures = [];\nconst localAssets = fs.readdirSync(logoDir).filter((name) => /\\.(?:svg|png)$/.test(name)).sort();\nconst mappedAssets = new Set(mappings.map((mapping) => path.basename(mapping.asset)));\nif (recordsBySlug.size !== 116) failures.push(\`expected 116 canonical records, found \${recordsBySlug.size}\`);\nif (mappings.length !== 116) failures.push(\`expected 116 canonical logo mappings, found \${mappings.length}\`);\nif (!Array.isArray(decisions.records) || decisions.records.length !== 116) failures.push('decision ledger must contain 116 records');\nconst decisionBySlug = new Map((decisions.records ?? []).map((record) => [record.slug, record]));\nif (decisionBySlug.size !== 116) failures.push('decision ledger contains duplicate slugs');\nfor (const [slug] of recordsBySlug) {\n  const mapping = mappings.find((item) => item.slug === slug);\n  const decision = decisionBySlug.get(slug);\n  if (!mapping) failures.push(\`canonical record has no local mapping: \${slug}\`);\n  if (!decision) failures.push(\`canonical record has no final decision: \${slug}\`);\n  if (decision && (decision.decision !== 'accepted_local_mark' || !decision.mark_type || !decision.source_page || !decision.identity_basis || !decision.asset_path)) failures.push(\`incomplete final decision: \${slug}\`);\n  if (mapping && decision && mapping.asset !== decision.asset_path) failures.push(\`mapping/decision asset mismatch: \${slug}\`);\n}\nfor (const mapping of mappings) {\n  if (!recordsBySlug.has(mapping.slug)) failures.push(\`noncanonical mapping: \${mapping.slug}\`);\n  if (!mapping.asset.startsWith('/stablecoin-logos/')) failures.push(\`nonlocal asset path: \${mapping.slug}\`);\n  if (!fs.existsSync(path.join(root, 'public', mapping.asset))) failures.push(\`missing asset: \${mapping.slug}\`);\n}\nfor (const asset of localAssets) {\n  if (!mappedAssets.has(asset)) failures.push(\`orphan local asset: \${asset}\`);\n  const absolute = path.join(logoDir, asset);\n  if (asset.endsWith('.png')) {\n    const bytes = fs.readFileSync(absolute);\n    if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') failures.push(\`invalid PNG: \${asset}\`);\n    else { const width = bytes.readUInt32BE(16); const height = bytes.readUInt32BE(20); if (width !== height || width < 32) failures.push(\`invalid PNG geometry: \${asset} \${width}x\${height}\`); }\n  } else if (!fs.readFileSync(absolute, 'utf8').includes('<svg')) failures.push(\`invalid SVG: \${asset}\`);\n}\nfor (const collision of ['USX', 'USDX', 'USDN']) if (!resolver.includes(collision)) failures.push(\`ambiguous symbol guard missing: \${collision}\`);\nconst report = { schema_version: '2.0', generated_at: new Date().toISOString(), canonical_stablecoin_records: recordsBySlug.size, mapped_canonical_records: mappings.length, decided_canonical_records: decisionBySlug.size, coverage_percent: Number(((mappings.length / Math.max(recordsBySlug.size, 1)) * 100).toFixed(2)), local_logo_assets: localAssets.length, mark_type_counts: decisions.counts ?? {}, neutral_fallback_records: (decisions.records ?? []).filter((record) => record.decision !== 'accepted_local_mark').length, orphan_assets: localAssets.filter((asset) => !mappedAssets.has(asset)), failures };\nfs.mkdirSync(path.dirname(outputPath), { recursive: true });\nfs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\\n');\nif (failures.length) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }\nconsole.log(JSON.stringify(report, null, 2));\n`;
fs.writeFileSync(auditPath, auditSource);
console.log(JSON.stringify({ imported: imported.length, total_mappings: existingMappings.size, decisions: decisions.length, mark_type_counts: counts }, null, 2));
