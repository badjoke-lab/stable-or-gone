import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readJson, writeJson } from './fs-utils.mjs';

const BASELINE_FILES = [
  'docs/migration/registry-v2-baseline.json',
  'docs/migration/registry-v3-foundation.json',
  'docs/migration/registry-v3-income-profiles.json',
  'docs/migration/registry-v3-baseline.json'
];

const COMPATIBILITY_FILES = [
  'data/stablecoin-overrides-pr033.json',
  'data/stablecoin-overrides-pr034.json'
];

function flattenGroups(groups = {}) {
  return Object.values(groups).flatMap((files) => Array.isArray(files) ? files : []);
}

export function getProtectedPaths(root = process.cwd()) {
  const v2 = readJson(root, BASELINE_FILES[0]);
  const v3 = readJson(root, BASELINE_FILES[1]);
  const income = readJson(root, BASELINE_FILES[2]);
  const paths = [
    ...BASELINE_FILES,
    ...flattenGroups(v2.data_groups),
    ...flattenGroups(v3.data_groups),
    ...(Array.isArray(income.data_files) ? income.data_files : []),
    ...COMPATIBILITY_FILES.filter((relativePath) => fs.existsSync(path.join(root, relativePath)))
  ];
  return [...new Set(paths)].sort();
}

export function captureCanonicalSnapshot(root = process.cwd()) {
  const protectedPaths = getProtectedPaths(root);
  const files = protectedPaths.map((relativePath) => {
    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath)) throw new Error(`Protected canonical file is missing: ${relativePath}`);
    const bytes = fs.readFileSync(absolutePath);
    return {
      path: relativePath,
      size: bytes.length,
      sha256: crypto.createHash('sha256').update(bytes).digest('hex')
    };
  });
  const aggregate = crypto.createHash('sha256');
  for (const file of files) {
    aggregate.update(file.path);
    aggregate.update('\0');
    aggregate.update(file.sha256);
    aggregate.update('\0');
  }
  return {
    schema_version: '1.0',
    protected_path_count: files.length,
    aggregate_sha256: aggregate.digest('hex'),
    files
  };
}

export function compareCanonicalSnapshots(before, after) {
  const beforeMap = new Map(before.files.map((file) => [file.path, file]));
  const afterMap = new Map(after.files.map((file) => [file.path, file]));
  const paths = [...new Set([...beforeMap.keys(), ...afterMap.keys()])].sort();
  const changedPaths = paths.filter((relativePath) => {
    const left = beforeMap.get(relativePath);
    const right = afterMap.get(relativePath);
    return !left || !right || left.sha256 !== right.sha256 || left.size !== right.size;
  });
  return {
    ok: changedPaths.length === 0 && before.aggregate_sha256 === after.aggregate_sha256,
    before_hash: before.aggregate_sha256,
    after_hash: after.aggregate_sha256,
    before_path_count: before.protected_path_count,
    after_path_count: after.protected_path_count,
    changed_paths: changedPaths
  };
}

export function verifyCanonicalSnapshot(before, root = process.cwd()) {
  const after = captureCanonicalSnapshot(root);
  const result = compareCanonicalSnapshots(before, after);
  if (!result.ok) {
    throw new Error(`Monitoring canonical guard failed: ${result.changed_paths.join(', ') || 'aggregate hash changed'}`);
  }
  return result;
}

async function main() {
  const [command, snapshotPath, resultPath] = process.argv.slice(2);
  if (!['capture', 'verify'].includes(command) || !snapshotPath) {
    throw new Error('Usage: canonical-guard.mjs <capture|verify> <snapshot.json> [result.json]');
  }
  if (command === 'capture') {
    const snapshot = captureCanonicalSnapshot();
    writeJson(snapshotPath, snapshot);
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }
  const before = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  const result = verifyCanonicalSnapshot(before);
  if (resultPath) writeJson(resultPath, result);
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
