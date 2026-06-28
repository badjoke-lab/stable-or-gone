import fs from 'node:fs';
import path from 'node:path';
import { getProtectedPaths } from '../core/canonical-guard.mjs';
import { readJson } from '../core/fs-utils.mjs';

function rowCount(value) {
  if (Array.isArray(value)) return value.length;
  if (Array.isArray(value?.records)) return value.records.length;
  return null;
}

export function runRepositoryHealthMonitor(root = process.cwd(), checkedAt = new Date().toISOString()) {
  const parseErrors = [];
  const missingFiles = [];
  let protectedPaths = [];
  try {
    protectedPaths = getProtectedPaths(root);
  } catch (error) {
    parseErrors.push({ path: 'canonical-baseline', error: error instanceof Error ? error.message : String(error) });
  }

  let canonicalJsonFileCount = 0;
  for (const relativePath of protectedPaths) {
    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath)) {
      missingFiles.push(relativePath);
      continue;
    }
    if (relativePath.endsWith('.json')) {
      canonicalJsonFileCount += 1;
      try {
        JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
      } catch (error) {
        parseErrors.push({ path: relativePath, error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  const recordGroupCounts = {};
  try {
    const baseline = readJson(root, 'docs/migration/registry-v2-baseline.json');
    for (const [group, files] of Object.entries(baseline.data_groups ?? {})) {
      let total = 0;
      for (const relativePath of Array.isArray(files) ? files : []) {
        const value = readJson(root, relativePath);
        const count = rowCount(value);
        if (count === null) throw new Error(`${relativePath}: expected array or records array`);
        total += count;
      }
      recordGroupCounts[group] = total;
    }
  } catch (error) {
    parseErrors.push({ path: 'record-group-counts', error: error instanceof Error ? error.message : String(error) });
  }

  const findings = [
    ...missingFiles.map((relativePath) => ({ severity: 'critical', category: 'missing_canonical_file', path: relativePath })),
    ...parseErrors.map((item) => ({ severity: 'critical', category: 'canonical_json_parse_error', ...item }))
  ];
  const status = findings.length === 0 ? 'ok' : 'failed';

  return {
    schema_version: '1.0',
    monitor: 'repository-health',
    status,
    checked_at: checkedAt,
    canonical_file_count: protectedPaths.length,
    canonical_json_file_count: canonicalJsonFileCount,
    parse_errors: parseErrors,
    missing_files: missingFiles,
    record_group_counts: recordGroupCounts,
    candidate_count: 0,
    findings
  };
}
