#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const logoDir = path.join(root, 'public/stablecoin-logos');
const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
const decisionsPath = path.join(root, 'config/stablecoin-logo-decisions.json');
const displayPolicyPath = path.join(root, 'config/stablecoin-logo-display-policy.json');
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
const displayPolicy = JSON.parse(fs.readFileSync(displayPolicyPath, 'utf8'));
const failures = [];
const localAssets = fs.readdirSync(logoDir).filter((name) => /\.(?:svg|png)$/.test(name)).sort();
const mappedAssets = new Set(mappings.map((mapping) => path.basename(mapping.asset)));
const decisionBySlug = new Map((decisions.records ?? []).map((record) => [record.slug, record]));
const displayTypes = new Set(displayPolicy.display_logo_mark_types ?? []);
const fallbackTypes = new Set(displayPolicy.neutral_fallback_mark_types ?? []);
const fallbackSlugs = new Set(displayPolicy.neutral_fallback_slugs ?? []);
const researchOnlyAssets = new Set((decisions.records ?? []).filter((record) => fallbackSlugs.has(record.slug) && record.asset_path).map((record) => path.basename(record.asset_path)));

if (recordsBySlug.size !== 116) failures.push(`expected 116 canonical records, found ${recordsBySlug.size}`);
if (mappings.length !== 98) failures.push(`expected 98 direct Stablecoin/product logo mappings, found ${mappings.length}`);
if (fallbackSlugs.size !== 18) failures.push(`expected 18 neutral fallback records, found ${fallbackSlugs.size}`);
if (!Array.isArray(decisions.records) || decisions.records.length !== 116) failures.push('research decision ledger must contain 116 records');
if (decisionBySlug.size !== 116) failures.push('research decision ledger contains duplicate slugs');

for (const [slug] of recordsBySlug) {
  const mapping = mappings.find((item) => item.slug === slug);
  const decision = decisionBySlug.get(slug);
  if (!decision) failures.push(`canonical record has no research decision: ${slug}`);
  if (decision && !decision.mark_type) failures.push(`research decision has no mark type: ${slug}`);
  const shouldDisplayLogo = decision && displayTypes.has(decision.mark_type);
  const shouldFallback = decision && fallbackTypes.has(decision.mark_type);
  if (shouldDisplayLogo && !mapping) failures.push(`direct logo record has no local mapping: ${slug}`);
  if (shouldFallback && mapping) failures.push(`issuer/project/directory mark must not render as Stablecoin logo: ${slug}`);
  if (shouldFallback && !fallbackSlugs.has(slug)) failures.push(`fallback policy missing slug: ${slug}`);
  if (!shouldDisplayLogo && !shouldFallback) failures.push(`unclassified display mark type for ${slug}: ${decision?.mark_type ?? 'missing'}`);
  if (mapping && decision && mapping.asset !== decision.asset_path) failures.push(`mapping/decision asset mismatch: ${slug}`);
}
for (const slug of fallbackSlugs) {
  if (!recordsBySlug.has(slug)) failures.push(`noncanonical fallback slug: ${slug}`);
  const decision = decisionBySlug.get(slug);
  if (!decision || !fallbackTypes.has(decision.mark_type)) failures.push(`fallback slug does not have a fallback mark type: ${slug}`);
}
for (const mapping of mappings) {
  if (!recordsBySlug.has(mapping.slug)) failures.push(`noncanonical mapping: ${mapping.slug}`);
  if (!mapping.asset.startsWith('/stablecoin-logos/')) failures.push(`nonlocal asset path: ${mapping.slug}`);
  if (!fs.existsSync(path.join(root, 'public', mapping.asset))) failures.push(`missing asset: ${mapping.slug}`);
}
for (const asset of localAssets) {
  if (!mappedAssets.has(asset) && !researchOnlyAssets.has(asset)) failures.push(`orphan local asset: ${asset}`);
  const absolute = path.join(logoDir, asset);
  if (asset.endsWith('.png')) {
    const bytes = fs.readFileSync(absolute);
    if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') failures.push(`invalid PNG: ${asset}`);
    else { const width = bytes.readUInt32BE(16); const height = bytes.readUInt32BE(20); if (width !== height || width < 32) failures.push(`invalid PNG geometry: ${asset} ${width}x${height}`); }
  } else if (!fs.readFileSync(absolute, 'utf8').includes('<svg')) failures.push(`invalid SVG: ${asset}`);
}
for (const collision of ['USX', 'USDX', 'USDN']) if (!resolver.includes(collision)) failures.push(`ambiguous symbol guard missing: ${collision}`);
const report = {
  schema_version: '3.0',
  generated_at: new Date().toISOString(),
  canonical_stablecoin_records: recordsBySlug.size,
  direct_logo_records: mappings.length,
  neutral_fallback_records: fallbackSlugs.size,
  direct_logo_coverage_percent: Number(((mappings.length / Math.max(recordsBySlug.size, 1)) * 100).toFixed(2)),
  research_decisions: decisionBySlug.size,
  display_logo_mark_types: [...displayTypes],
  neutral_fallback_mark_types: [...fallbackTypes],
  neutral_fallback_slugs: [...fallbackSlugs],
  local_logo_assets: localAssets.length,
  research_only_assets: [...researchOnlyAssets].sort(),
  orphan_assets: localAssets.filter((asset) => !mappedAssets.has(asset) && !researchOnlyAssets.has(asset)),
  failures
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
if (failures.length) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log(JSON.stringify(report, null, 2));
