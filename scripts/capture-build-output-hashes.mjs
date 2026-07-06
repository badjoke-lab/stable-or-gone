import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const roots = [
  'dist',
  'data/generated/build-provenance.json',
  'data/generated/deployment-taxonomy-migration.json'
];

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function collectFiles(target) {
  if (!fs.existsSync(target)) throw new Error(`Missing build output: ${target}`);
  if (fs.statSync(target).isFile()) return [target];

  const files = [];
  function walk(directory) {
    for (const name of fs.readdirSync(directory).sort()) {
      const child = path.join(directory, name);
      if (fs.statSync(child).isDirectory()) walk(child);
      else files.push(child.split(path.sep).join('/'));
    }
  }
  walk(target);
  return files;
}

const files = roots.flatMap(collectFiles).sort();
const entries = {};
const tree = crypto.createHash('sha256');
let totalBytes = 0;

for (const file of files) {
  const bytes = fs.readFileSync(file);
  const digest = sha256(bytes);
  totalBytes += bytes.length;
  entries[file] = { bytes: bytes.length, sha256: digest };
  tree.update(file);
  tree.update('\0');
  tree.update(digest);
  tree.update('\0');
}

const report = {
  schema_version: '1.0',
  audit_id: 'sog_reproducible_build_pr317',
  build_context: {
    source_commit: process.env.SOG_BUILD_COMMIT ?? null,
    source_branch: process.env.SOG_BUILD_BRANCH ?? null,
    build_timestamp: process.env.SOG_BUILD_TIMESTAMP ?? null,
    source_date_epoch: process.env.SOURCE_DATE_EPOCH ?? null,
    node: process.version
  },
  output_roots: roots,
  file_count: files.length,
  total_bytes: totalBytes,
  tree_sha256: tree.digest('hex'),
  files: entries
};

const output = process.env.SOG_REPRO_CAPTURE_FILE || 'artifacts/reproducible-build-capture.json';
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ output, file_count: report.file_count, total_bytes: report.total_bytes, tree_sha256: report.tree_sha256 }, null, 2));
