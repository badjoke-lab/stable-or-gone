#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const logoDir = path.join(root, 'public/stablecoin-logos');
const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
const readmePath = path.join(logoDir, 'README.md');
const trustWalletLicensePath = path.join(logoDir, 'LICENSE-trustwallet-assets.txt');
const bgdLicensePath = path.join(logoDir, 'LICENSE-bgd-web3-icons.txt');
const moneyOnChainLicensePath = path.join(logoDir, 'LICENSE-money-on-chain-gpl3.txt');
const outputPath = path.join(root, 'artifacts/stablecoin-logo-coverage.json');
const expectedTrustWalletCommit = '34d808acb2a71e55c41505cd8f15c827db21b0fc';
const expectedBgdCommit = 'fd03ac0b5aaaeb9d0e6b85958e56eaaf9613db22';
const expectedMoneyOnChainCommit = '9398b8bfc70ee2c84528560ae0ec4f9055179439';

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
const bgdLicense = fs.readFileSync(bgdLicensePath, 'utf8');
const moneyOnChainLicense = fs.readFileSync(moneyOnChainLicensePath, 'utf8');
const mappingBlock = resolver.match(/const LOGOS_BY_SLUG:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? '';
const mappings = [...mappingBlock.matchAll(/^\s*'([^']+)':\s*'([^']+)'\s*,?$/gm)].map((match) => ({ slug: match[1], asset: match[2] }));
const mappedSlugs = new Set(mappings.map((mapping) => mapping.slug));
const mappedAssets = new Set(mappings.map((mapping) => path.basename(mapping.asset)));
const localAssets = fs.readdirSync(logoDir).filter((name) => /\.(?:svg|png)$/.test(name)).sort();
const failures = [];
const assetGeometry = [];

if (recordsBySlug.size !== 116) failures.push(`expected 116 canonical stablecoin records, found ${recordsBySlug.size}`);
if (mappings.length !== 60) failures.push(`expected 60 canonical logo mappings, found ${mappings.length}`);
if (!readme.includes('Current audited coverage: **60 of 116')) failures.push('README coverage statement is not 60 of 116');
if (!readme.includes(expectedTrustWalletCommit)) failures.push('pinned Trust Wallet Assets commit is missing from README');
if (!readme.includes(expectedBgdCommit)) failures.push('pinned BGD Labs commit is missing from README');
if (!readme.includes(expectedMoneyOnChainCommit)) failures.push('pinned Money on Chain commit is missing from README');
if (!trustWalletLicense.startsWith('MIT License')) failures.push('Trust Wallet Assets MIT license notice is missing or malformed');
if (!bgdLicense.startsWith('MIT License')) failures.push('BGD Labs MIT license notice is missing or malformed');
if (!moneyOnChainLicense.startsWith('SPDX-License-Identifier: GPL-3.0-only')) failures.push('Money on Chain GPL-3.0 notice is missing or malformed');
if (!readme.includes('The `EURm` file was rejected because it represents Monerium EUR Money rather than Mento Euro.')) failures.push('Mento Euro false-positive rejection is not documented');

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

const requiredSlugs = [
  'alusd',
  'usdtb',
  'mountain-usdm',
  'susde',
  'eura',
  'monerium-eure',
  'rlusd',
  'usdg',
  'usds',
  'dollar-on-chain',
  'agora-ausd',
  'basis-cash',
  'busd',
  'falcon-usdf',
  'lisusd',
  'mento-dollar',
  'qidao-mai',
  'sdai',
  'usd0',
  'usd1',
  'ust',
  'beanstalk-bean',
  'berachain-honey',
  'crvusd',
  'djed',
  'eurs',
  'musd',
  'near-usn',
  'united-stables-u'
];
for (const requiredSlug of requiredSlugs) {
  if (!mappedSlugs.has(requiredSlug)) failures.push(`newly audited logo mapping missing: ${requiredSlug}`);
}
if (mappedSlugs.has('mento-eurm')) failures.push('rejected Mento Euro false-positive logo mapping must not be present');
if (fs.existsSync(path.join(logoDir, 'mento-eurm.svg'))) failures.push('rejected Mento Euro false-positive logo asset must not be present');

const dollarOnChainSource = fs.readFileSync(path.join(logoDir, 'dollar-on-chain.svg'), 'utf8');
if (!dollarOnChainSource.includes('<title>moc/config/icon-tp</title>')) failures.push('official Dollar on Chain SVG identity marker is missing');

const covered = [...recordsBySlug.values()].filter((record) => mappedSlugs.has(record.slug));
const unsupported = [...recordsBySlug.values()].filter((record) => !mappedSlugs.has(record.slug));
const report = {
  schema_version: '1.2',
  generated_at: new Date().toISOString(),
  canonical_stablecoin_records: recordsBySlug.size,
  mapped_canonical_records: covered.length,
  coverage_percent: Number(((covered.length / Math.max(recordsBySlug.size, 1)) * 100).toFixed(2)),
  local_logo_assets: localAssets.length,
  pinned_source_commits: {
    trustwallet_assets: expectedTrustWalletCommit,
    bgd_web3_icons: expectedBgdCommit,
    money_on_chain_interface: expectedMoneyOnChainCommit
  },
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
  pinned_source_commits: report.pinned_source_commits,
  failures: 0
}, null, 2));
