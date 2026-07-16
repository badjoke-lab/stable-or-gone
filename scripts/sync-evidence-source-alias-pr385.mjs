import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const baseRef = process.env.SOG_PR385_BASE_REF ?? 'origin/main';
const file = 'data/evidence-events-pr037.json';
const aliasId = 'sog_src_fdusd_firstdigital_launch_event';
const oldUrl = 'https://firstdigitallabs.com/fdusd/';
const newUrl = 'https://www.firstdigitallabs.com/fdusd';
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;

function readBaseRows() {
  try {
    return JSON.parse(execFileSync('git', ['show', `${baseRef}:${file}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }));
  } catch (error) {
    if (process.env.SOG_PR385_ALLOW_DISK_BASE === '1') {
      return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
    }
    throw new Error(`${file}: unable to read immutable base ${baseRef}: ${error.message}`);
  }
}

export function buildPr385AliasSync() {
  const rows = readBaseRows();
  let matched = 0;
  const output = rows.map((row) => {
    if (row.id !== aliasId) return row;
    matched += 1;
    if (row.url !== oldUrl) throw new Error(`${aliasId}: base URL changed before PR #385`);
    return { ...row, url: newUrl };
  });
  if (matched !== 1) throw new Error(`${aliasId}: expected exactly one alias row, found ${matched}`);
  return output;
}

export function writePr385AliasSync(output = buildPr385AliasSync()) {
  fs.writeFileSync(path.join(root, file), serialize(output));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const output = buildPr385AliasSync();
  if (process.argv.includes('--check')) {
    const current = fs.readFileSync(path.join(root, file), 'utf8');
    if (current !== serialize(output)) {
      console.error(`${file} is not reproducible for PR #385 alias synchronization`);
      process.exit(1);
    }
  } else {
    writePr385AliasSync(output);
  }
  console.log(JSON.stringify({
    ok: true,
    source_file: file,
    alias_id: aliasId,
    previous_url: oldUrl,
    replacement_url: newUrl,
    canonical_identity: 'sog_src_fdusd_site'
  }, null, 2));
}
