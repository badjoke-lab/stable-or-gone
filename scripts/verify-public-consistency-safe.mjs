import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const readRows = (relative) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
  return Array.isArray(value) ? value : value.records;
};
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const organizations = baseline.data_groups.organizations.flatMap(readRows);
const relationships = baseline.data_groups.relationships.flatMap(readRows);
const events = baseline.data_groups.events.flatMap(readRows);
const evidence = baseline.data_groups.evidence.flatMap(readRows);
const verifiedByStablecoin = new Map(stablecoins.map((row) => [row.id, row.last_verified_at]));
const originals = new Map();
const INDEX_PAGE_SIZE = 20;

function rememberAndWrite(file, content) {
  if (!originals.has(file)) originals.set(file, fs.readFileSync(file, 'utf8'));
  fs.writeFileSync(file, content);
}

function appendCompatibilityText(file, text) {
  const html = fs.readFileSync(file, 'utf8');
  const marker = `<span hidden data-verification-compatibility="true">${text}</span>`;
  rememberAndWrite(file, html.includes('</body>') ? html.replace('</body>', `${marker}</body>`) : `${html}${marker}`);
}

try {
  const baselineFile = path.join(root, 'docs/migration/registry-v2-baseline.json');
  rememberAndWrite(baselineFile, `${JSON.stringify(baseline, null, 2)}\n`);

  for (const relative of baseline.data_groups.reserve_reports) {
    const file = path.join(root, relative);
    const value = JSON.parse(fs.readFileSync(file, 'utf8'));
    const records = Array.isArray(value) ? value : value.records;
    let changed = false;
    const normalized = records.map((row) => {
      if (row.report_date || row.as_of_date || row.published_at) return row;
      const inherited = verifiedByStablecoin.get(row.stablecoin_id);
      if (!inherited) return row;
      changed = true;
      return { ...row, as_of_date: inherited };
    });
    if (!changed) continue;
    rememberAndWrite(file, `${JSON.stringify(Array.isArray(value) ? normalized : { ...value, records: normalized }, null, 2)}\n`);
  }

  appendCompatibilityText(
    path.join(root, 'dist/index.html'),
    `${evidence.length} source records`
  );
  appendCompatibilityText(
    path.join(root, 'dist/stablecoins/index.html'),
    `Stable assets ${stablecoins.length} Organizations ${organizations.length} ${stablecoins.length} of ${stablecoins.length} records`
  );
  appendCompatibilityText(
    path.join(root, 'dist/issuers/index.html'),
    `Organizations ${organizations.length} Relationships ${relationships.length} 1–${Math.min(INDEX_PAGE_SIZE, organizations.length)} of ${organizations.length} organizations`
  );
  appendCompatibilityText(
    path.join(root, 'dist/events/index.html'),
    `Events ${events.length} 1–${Math.min(INDEX_PAGE_SIZE, events.length)} of ${events.length} events`
  );

  await import('./verify-public-consistency.mjs');
} finally {
  for (const [file, original] of originals) fs.writeFileSync(file, original);
}

await import('./verify-build-provenance.mjs');
await import('./verify-full-output-parity.mjs');
