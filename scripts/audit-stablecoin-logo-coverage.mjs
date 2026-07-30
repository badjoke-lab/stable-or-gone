#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const logoDir = path.join(root, 'public/stablecoin-logos');
const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
const decisionsPath = path.join(root, 'config/stablecoin-logo-decisions.json');
const outputPath = path.join(root, 'artifacts/stablecoin-logo-coverage.json');
const recordsBySlug = new Map();
for (const filename of fs.readdirSync(dataDir).filter((name) => /^stablecoins(?:-|\.)/.test(name) && name.endsWith('.json'))) {
  const parsed = JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf8'));
  for (const record of (Array.isArray(parsed) ? parsed : parsed.stablecoins ?? parsed.records ?? parsed.items ?? [])) {
    if (record && typeof record.slug === 'string') recordsBySlug.set(record.slug, { slug: record.slug, symbol: String(record.symbol ?? ''), name: String(record.name ?? record.slug) });
  }
}
const resolver = fs.readFileSync(resolverPath, 'utf8');
const mappingBlock = resolver.match(/const LOGOS_BY_SLUG:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? '';
const mappings = [...mappingBlock.matchAll(/^\s*'([^']+)':\s*'([^']+)'\s*,?$/gm)].map((match) => ({ slug: match[1], asset: match[2] }));
const decisions = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
const failures = [];
const localAssets = fs.readdirSync(logoDir).filter((name) => /\.(?:svg|png)$/.test(name)).sort();
const mappedAssets = new Set(mappings.map((mapping) => path.basename(mapping.asset)));
if (recordsBySlug.size !== 116) failures.push(`expected 116 canonical records, found ${recordsBySlug.size}`);
if (mappings.length !== 116) failures.push(`expected 116 canonical logo mappings, found ${mappings.length}`);
if (!Array.isArray(decisions.records) || decisions.records.length !== 116) failures.push('decision ledger must contain 116 records');
const decisionBySlug = new Map((decisions.records ?? []).map((record) => [record.slug, record]));
if (decisionBySlug.size !== 116) failures.push('decision ledger contains duplicate slugs');
for (const [slug] of recordsBySlug) {
  const mapping = mappings.find((item) => item.slug === slug);
  const decision = decisionBySlug.get(slug);
  if (!mapping) failures.push(`canonical record has no local mapping: ${slug}`);
  if (!decision) failures.push(`canonical record has no final decision: ${slug}`);
  if (decision && (decision.decision !== 'accepted_local_mark' || !decision.mark_type || !decision.source_page || !decision.identity_basis || !decision.asset_path)) failures.push(`incomplete final decision: ${slug}`);
  if (mapping && decision && mapping.asset !== decision.asset_path) failures.push(`mapping/decision asset mismatch: ${slug}`);
}
for (const mapping of mappings) {
  if (!recordsBySlug.has(mapping.slug)) failures.push(`noncanonical mapping: ${mapping.slug}`);
  if (!mapping.asset.startsWith('/stablecoin-logos/')) failures.push(`nonlocal asset path: ${mapping.slug}`);
  if (!fs.existsSync(path.join(root, 'public', mapping.asset))) failures.push(`missing asset: ${mapping.slug}`);
}
for (const asset of localAssets) {
  if (!mappedAssets.has(asset)) failures.push(`orphan local asset: ${asset}`);
  const absolute = path.join(logoDir, asset);
  if (asset.endsWith('.png')) {
    const bytes = fs.readFileSync(absolute);
    if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') failures.push(`invalid PNG: ${asset}`);
    else { const width = bytes.readUInt32BE(16); const height = bytes.readUInt32BE(20); if (width !== height || width < 32) failures.push(`invalid PNG geometry: ${asset} ${width}x${height}`); }
  } else if (!fs.readFileSync(absolute, 'utf8').includes('<svg')) failures.push(`invalid SVG: ${asset}`);
}
for (const collision of ['USX', 'USDX', 'USDN']) if (!resolver.includes(collision)) failures.push(`ambiguous symbol guard missing: ${collision}`);
const report = { schema_version: '2.0', generated_at: new Date().toISOString(), canonical_stablecoin_records: recordsBySlug.size, mapped_canonical_records: mappings.length, decided_canonical_records: decisionBySlug.size, coverage_percent: Number(((mappings.length / Math.max(recordsBySlug.size, 1)) * 100).toFixed(2)), local_logo_assets: localAssets.length, mark_type_counts: decisions.counts ?? {}, neutral_fallback_records: (decisions.records ?? []).filter((record) => record.decision !== 'accepted_local_mark').length, orphan_assets: localAssets.filter((asset) => !mappedAssets.has(asset)), failures };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
if (failures.length) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log(JSON.stringify(report, null, 2));
