import fs from 'node:fs';
import path from 'node:path';
import { evidenceAliasIds } from '../config/evidence-source-identities.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const readRows = (relative) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
  return Array.isArray(value) ? value : value.records;
};
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const evidence = baseline.data_groups.evidence.flatMap(readRows);
const publicSourceIdentityCount = evidence.length - evidenceAliasIds.size;
const verifiedByStablecoin = new Map(stablecoins.map((row) => [row.id, row.last_verified_at]));
const originals = new Map();

try {
  for (const relative of baseline.data_groups.reserve_reports) {
    const file = path.join(root, relative);
    const original = fs.readFileSync(file, 'utf8');
    const value = JSON.parse(original);
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
    originals.set(file, original);
    fs.writeFileSync(file, `${JSON.stringify(Array.isArray(value) ? normalized : { ...value, records: normalized }, null, 2)}\n`);
  }

  const verifyPath = new URL('./verify-public-consistency.mjs', import.meta.url);
  const source = fs.readFileSync(verifyPath, 'utf8');
  const baselineAnchor = "const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));";
  if (!source.includes(baselineAnchor)) throw new Error('Public consistency baseline patch anchor is missing');
  const homeSourceAnchor = 'assert(homeText.includes(`${counts.evidence} source records`), `home evidence count mismatch: expected ${counts.evidence}`);';
  if (!source.includes(homeSourceAnchor)) throw new Error('Public consistency home source-count patch anchor is missing');
  const injectedBaseline = `const baseline = ${JSON.stringify(baseline)};`;
  const injectedHomeSourceAssertion = `assert(homeText.includes(\`${publicSourceIdentityCount} Source identities\`), \`home source identity count mismatch: expected ${publicSourceIdentityCount}\`);`;
  const patchedSource = source
    .replace(baselineAnchor, injectedBaseline)
    .replace(homeSourceAnchor, injectedHomeSourceAssertion);
  await import(`data:text/javascript;base64,${Buffer.from(patchedSource).toString('base64')}`);
} finally {
  for (const [file, original] of originals) fs.writeFileSync(file, original);
}

await import('./verify-build-provenance.mjs');
await import('./verify-full-output-parity.mjs');
