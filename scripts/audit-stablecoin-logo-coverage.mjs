#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const logoDir = path.join(root, 'public/stablecoin-logos');
const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
const outputPath = path.join(root, 'artifacts/stablecoin-logo-coverage.json');

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
const mappingBlock = resolver.match(/const LOGOS_BY_SLUG:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? '';
const mappings = [...mappingBlock.matchAll(/^\s*'([^']+)':\s*'([^']+)'\s*,?$/gm)].map((match) => ({ slug: match[1], asset: match[2] }));
const mappedSlugs = new Set(mappings.map((mapping) => mapping.slug));
const mappedAssets = new Set(mappings.map((mapping) => path.basename(mapping.asset)));
const localAssets = fs.readdirSync(logoDir).filter((name) => name.endsWith('.svg')).sort();
const failures = [];

if (recordsBySlug.size !== 116) failures.push(`expected 116 canonical stablecoin records, found ${recordsBySlug.size}`);
if (mappings.length !== 39) failures.push(`expected 39 canonical logo mappings, found ${mappings.length}`);
for (const mapping of mappings) {
  if (!recordsBySlug.has(mapping.slug)) failures.push(`noncanonical or obsolete logo mapping: ${mapping.slug}`);
  if (!mapping.asset.startsWith('/stablecoin-logos/')) failures.push(`nonlocal logo asset path for ${mapping.slug}: ${mapping.asset}`);
  if (!fs.existsSync(path.join(root, 'public', mapping.asset))) failures.push(`missing logo asset for ${mapping.slug}: ${mapping.asset}`);
}
for (const asset of localAssets) {
  if (!mappedAssets.has(asset)) failures.push(`orphan local stablecoin logo asset: ${asset}`);
}
for (const collision of ['USX', 'USDX', 'USDN']) {
  if (!resolver.includes(collision)) failures.push(`ambiguous symbol guard missing: ${collision}`);
}
for (const requiredSlug of ['beanstalk-bean', 'berachain-honey', 'crvusd', 'djed', 'eurs', 'musd', 'near-usn', 'united-stables-u']) {
  if (!mappedSlugs.has(requiredSlug)) failures.push(`newly audited logo mapping missing: ${requiredSlug}`);
}

const covered = [...recordsBySlug.values()].filter((record) => mappedSlugs.has(record.slug));
const unsupported = [...recordsBySlug.values()].filter((record) => !mappedSlugs.has(record.slug));
const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  canonical_stablecoin_records: recordsBySlug.size,
  mapped_canonical_records: covered.length,
  coverage_percent: Number(((covered.length / Math.max(recordsBySlug.size, 1)) * 100).toFixed(2)),
  local_svg_assets: localAssets.length,
  orphan_assets: localAssets.filter((asset) => !mappedAssets.has(asset)),
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
  local_svg_assets: report.local_svg_assets,
  failures: 0
}, null, 2));
