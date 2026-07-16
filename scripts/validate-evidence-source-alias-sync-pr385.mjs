import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildPr385AliasSync } from './sync-evidence-source-alias-pr385.mjs';
import { evidenceSourceIdentityGroups } from '../config/evidence-source-identities.mjs';

const root = process.cwd();
const baseRef = process.env.SOG_PR385_BASE_REF ?? 'origin/main';
const file = 'data/evidence-events-pr037.json';
const aliasId = 'sog_src_fdusd_firstdigital_launch_event';
const canonicalId = 'sog_src_fdusd_site';
const oldUrl = 'https://firstdigitallabs.com/fdusd/';
const newUrl = 'https://www.firstdigitallabs.com/fdusd';
const rows = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const expected = buildPr385AliasSync();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

expect(same(rows, expected), `${file}: alias synchronization is not deterministic`);
const alias = rows.find((row) => row.id === aliasId);
expect(Boolean(alias), `${aliasId}: alias row missing`);
expect(alias?.url === newUrl, `${aliasId}: reviewed replacement URL not applied`);
const group = evidenceSourceIdentityGroups.find((row) => row.canonical_id === canonicalId);
expect(Boolean(group), `${canonicalId}: source identity group missing`);
expect(group?.url === newUrl, `${canonicalId}: source identity group URL not updated`);
expect(group?.aliases?.includes(aliasId), `${canonicalId}: source identity alias membership changed`);

try {
  const before = JSON.parse(execFileSync('git', ['show', `${baseRef}:${file}`], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }));
  expect(before.length === rows.length, `${file}: row count changed`);
  const afterById = new Map(rows.map((row) => [row.id, row]));
  for (const row of before) {
    const next = afterById.get(row.id);
    expect(Boolean(next), `${file}: row removed ${row.id}`);
    if (row.id === aliasId) {
      expect(row.url === oldUrl, `${aliasId}: base URL changed`);
      expect(same({ ...next, url: row.url }, row), `${aliasId}: fields outside url changed`);
    } else {
      expect(same(row, next), `${file}: non-target row changed ${row.id}`);
    }
  }
} catch (error) {
  if (process.env.SOG_PR385_ALLOW_DISK_BASE !== '1') failures.push(`${file}: unable to verify immutable base: ${error.message}`);
}

if (failures.length) {
  console.error('PR #385 Evidence source alias synchronization validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  canonical_id: canonicalId,
  alias_id: aliasId,
  previous_url: oldUrl,
  replacement_url: newUrl,
  row_count_preserved: rows.length
}, null, 2));
