#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataRoot = path.join(root, 'data');
const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
const outputPath = path.join(root, 'artifacts/stablecoin-logo-research.json');

const jsonFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile() && entry.name.endsWith('.json')) jsonFiles.push(absolute);
  }
};
walk(dataRoot);

const objects = [];
const collect = (value, file) => {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, file);
    return;
  }
  if (!value || typeof value !== 'object') return;
  objects.push({ value, file: path.relative(root, file) });
  for (const child of Object.values(value)) collect(child, file);
};
for (const file of jsonFiles) {
  try { collect(JSON.parse(fs.readFileSync(file, 'utf8')), file); }
  catch { /* generated or noncanonical diagnostics are ignored when malformed */ }
}

const stablecoins = new Map();
const organizations = new Map();
const deployments = [];
const evidence = new Map();

for (const { value, file } of objects) {
  const id = typeof value.id === 'string' ? value.id : '';
  if (id.startsWith('sog_st_') && typeof value.slug === 'string' && typeof value.name === 'string') {
    stablecoins.set(id, { ...value, __file: file });
  }
  if ((id.startsWith('sog_issuer_') || id.startsWith('sog_org_')) && typeof value.name === 'string') {
    organizations.set(id, { ...value, __file: file });
  }
  if (typeof value.stablecoin_id === 'string' && (Object.hasOwn(value, 'contract_address') || Object.hasOwn(value, 'chain') || Object.hasOwn(value, 'token_standard'))) {
    deployments.push({ ...value, __file: file });
  }
  if (id.startsWith('sog_src_') && (typeof value.url === 'string' || typeof value.source_url === 'string')) {
    evidence.set(id, { ...value, __file: file });
  }
}

const resolver = fs.readFileSync(resolverPath, 'utf8');
const mappingBlock = resolver.match(/const LOGOS_BY_SLUG:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? '';
const mappedSlugs = new Set([...mappingBlock.matchAll(/^\s*'([^']+)':\s*'([^']+)'\s*,?$/gm)].map((match) => match[1]));

const urlKeys = new Set(['url', 'source_url', 'official_url', 'official_website', 'website', 'homepage', 'docs_url', 'repository_url']);
const collectUrls = (value, output = new Set()) => {
  if (Array.isArray(value)) {
    for (const item of value) collectUrls(item, output);
    return output;
  }
  if (!value || typeof value !== 'object') return output;
  for (const [key, child] of Object.entries(value)) {
    if (urlKeys.has(key) && typeof child === 'string' && /^https?:\/\//.test(child)) output.add(child);
    else collectUrls(child, output);
  }
  return output;
};

const evidenceIdsFor = (value, output = new Set()) => {
  if (Array.isArray(value)) {
    for (const item of value) evidenceIdsFor(item, output);
    return output;
  }
  if (!value || typeof value !== 'object') return output;
  for (const [key, child] of Object.entries(value)) {
    if ((key === 'evidence_id' || key === 'source_id') && typeof child === 'string') output.add(child);
    else if ((key === 'evidence_ids' || key === 'source_ids') && Array.isArray(child)) {
      for (const id of child) if (typeof id === 'string') output.add(id);
    } else evidenceIdsFor(child, output);
  }
  return output;
};

const records = [...stablecoins.values()].map((coin) => {
  const coinDeployments = deployments.filter((deployment) => deployment.stablecoin_id === coin.id);
  const issuer = organizations.get(coin.issuer_id) ?? null;
  const evidenceIds = new Set([...evidenceIdsFor(coin), ...coinDeployments.flatMap((deployment) => [...evidenceIdsFor(deployment)])]);
  const evidenceRecords = [...evidenceIds].map((id) => evidence.get(id)).filter(Boolean);
  const urls = new Set([...collectUrls(coin), ...collectUrls(issuer), ...evidenceRecords.flatMap((record) => [...collectUrls(record)])]);
  return {
    id: coin.id,
    slug: coin.slug,
    name: coin.name,
    symbol: String(coin.symbol ?? ''),
    aliases: Array.isArray(coin.aliases) ? coin.aliases : [],
    lifecycle_status: coin.lifecycle_status ?? coin.status ?? null,
    issuer: issuer ? { id: issuer.id, slug: issuer.slug ?? null, name: issuer.name, file: issuer.__file } : null,
    record_file: coin.__file,
    mapped_logo: mappedSlugs.has(coin.slug),
    deployments: coinDeployments.map((deployment) => ({
      id: deployment.id ?? null,
      chain: deployment.chain ?? null,
      token_standard: deployment.token_standard ?? null,
      contract_address: deployment.contract_address ?? deployment.asset_id ?? deployment.mint_address ?? null,
      status: deployment.status ?? null,
      canonicality: deployment.canonicality ?? null,
      is_primary: deployment.is_primary ?? null,
      file: deployment.__file
    })),
    candidate_official_urls: [...urls].sort(),
    evidence_ids: [...evidenceIds].sort()
  };
}).sort((a, b) => a.slug.localeCompare(b.slug));

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  json_files_scanned: jsonFiles.length,
  canonical_records: records.length,
  mapped_records: records.filter((record) => record.mapped_logo).length,
  unresolved_records: records.filter((record) => !record.mapped_logo).length,
  records,
  unresolved: records.filter((record) => !record.mapped_logo)
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  canonical_records: report.canonical_records,
  mapped_records: report.mapped_records,
  unresolved_records: report.unresolved_records,
  output: path.relative(root, outputPath)
}, null, 2));
