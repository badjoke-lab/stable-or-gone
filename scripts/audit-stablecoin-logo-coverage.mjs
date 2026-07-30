#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const logoDir = path.join(root, 'public/stablecoin-logos');
const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
const readmePath = path.join(logoDir, 'README.md');
const trustWalletLicensePath = path.join(logoDir, 'LICENSE-trustwallet-assets.txt');
const outputPath = path.join(root, 'artifacts/stablecoin-logo-coverage.json');
const expectedTrustWalletCommit = '34d808acb2a71e55c41505cd8f15c827db21b0fc';

const recordsBySlug = new Map();
for (const filename of fs.readdirSync(dataDir).filter((name) => /^stablecoins(?:-|\.)/.test(name) && name.endsWith('.json'))) {
  const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
  const records = Array.isArray(parsed) ? parsed : parsed.stablecoins ?? parsed.records ?? parsed.items ?? [];
  for (const record of records) {
    if (!record || typeof record.slug !== 'string') continue;
    recordsBySlug.set(record.slug, {
      slug: record.slug,
      symbol: String(record.symbol ?? ''),
      name: String(record.name ?? record.slug)
    });
  }
}

const resolver = fs.readFileSync(resolverPath, 'utf8');
const readme = fs.readFileSync(readmePath, 'utf8');
const trustWalletLicense = fs.readFileSync(trustWalletLicensePath, 'utf8');
const mappingBlock = resolver.match(/const LOGOS_BY_SLUG:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? '';
const mappings = [...mappingBlock.matchAll(/^\s*'([^']+)':\s*'([^']+)'\s*,?$/gm)].map((match) => ({ slug: match[1], asset: match[2] }));
const mappedSlugs = new Set(mappings.map((mapping) => mapping.slug));
const mappedAssets = new Set(mappings.map((mapping) => path.basename(mapping.asset)));
const localAssets = fs.readdirSync(logoDir).filter((name) => /\.(?:svg|png)$/.test(name)).sort();
const failures = [];
const assetGeometry = [];

if (recordsBySlug.size !== 116) failures.push(`expected 116 canonical stablecoin records, found ${recordsBySlug.size}`);
if (mappings.length !== 50) failures.push(`expected 50 canonical logo mappings, found ${mappings.length}`);
if (!readme.includes('Current audited coverage: **50 of 116')) failures.push('README coverage statement is not 50 of 116');
if (!readme.includes(expectedTrustWalletCommit)) failures.push('pinned Trust Wallet Assets commit is missing from README');
if (!trustWalletLicense.startsWith('MIT License')) failures.push('Trust Wallet Assets MIT license notice is missing or malformed');

for (const mapping of mappings) {
  if (!recordsBySlug.has(mapping.slug)) failures.push(`noncanonical or obsolete logo mapping: ${mapping.slug}`);
  if (!mapping.asset.startsWith('/stablecoin-logos/')) failures.push(`nonlocal logo asset path for ${mapping.slug}: ${mapping.asset}`);
  if (!fs.existsSync(path.join(root, 'public', mapping.asset))) failures.push(`missing logo asset for ${mapping.slug}: ${mapping.asset}`);
}

for (const asset of localAssets) {
  const absolutePath = path.join(logoDir, asset);
  if (!mappedAssets.has(asset)) failures.push(`orphan local stablecoin logo asset: ${asset}`);
  if (asset.endsWith('.png')) {
    const bytes = fs.readFileSync(absolutePath);
    const validSignature = bytes.length >= 24 && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
    if (!validSignature) {
      failures.push(`invalid PNG signature: ${asset}`);
      continue;
    }
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    assetGeometry.push({ asset, format: 'png', width, height });
    if (width !== height || width < 32) failures.push(`invalid PNG geometry for ${asset}: ${width}x${height}`);
  } else {
    const source = fs.readFileSync(absolutePath, 'utf8').trimStart();
    assetGeometry.push({ asset, format: 'svg' });
    if (!source.includes('<svg')) failures.push(`invalid SVG content: ${asset}`);
  }
}

for (const collision of ['USX', 'USDX', 'USDN']) {
  if (!resolver.includes(collision)) failures.push(`ambiguous symbol guard missing: ${collision}`);
}
for (const requiredSlug of ['agora-ausd', 'basis-cash', 'busd', 'falcon-usdf', 'lisusd', 'mento-dollar', 'qidao-mai', 'sdai', 'usd0', 'usd1', 'ust', 'beanstalk-bean', 'berachain-honey', 'crvusd', 'djed', 'eurs', 'musd', 'near-usn', 'united-stables-u']) {
  if (!mappedSlugs.has(requiredSlug)) failures.push(`newly audited logo mapping missing: ${requiredSlug}`);
}

const covered = [...recordsBySlug.values()].filter((record) => mappedSlugs.has(record.slug));
const unsupported = [...recordsBySlug.values()].filter((record) => !mappedSlugs.has(record.slug));
const report = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  canonical_stablecoin_records: recordsBySlug.size,
  mapped_canonical_records: covered.length,
  coverage_percent: Number(((covered.length / Math.max(recordsBySlug.size, 1)) * 100).toFixed(2)),
  local_logo_assets: localAssets.length,
  pinned_trustwallet_commit: expectedTrustWalletCommit,
  orphan_assets: localAssets.filter((asset) => !mappedAssets.has(asset)),
  asset_geometry: assetGeometry,
  covered_records: covered.sort((a, b) => a.slug.localeCompare(b.slug)),
  unsupported_records: unsupported.sort((a, b) => a.slug.localeCompare(b.slug)),
  failures
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  canonical_stablecoin_records: report.canonical_stablecoin_records,
  mapped_canonical_records: report.mapped_canonical_records,
  coverage_percent: report.coverage_percent,
  local_logo_assets: report.local_logo_assets,
  pinned_trustwallet_commit: report.pinned_trustwallet_commit,
  failures: 0
}, null, 2));
