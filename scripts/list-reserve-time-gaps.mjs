import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));
const load = (file) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  return (Array.isArray(value) ? value : value.records).map((row) => ({ ...row, source_file: file }));
};
const reports = baseline.data_groups.reserve_reports.flatMap(load);
const missing = reports.filter((row) => !row.report_date && !row.period_covered && !row.as_of && !row.last_verified_at);
console.log(JSON.stringify(missing.map((row) => ({ id: row.id, stablecoin_id: row.stablecoin_id, report_type: row.report_type, source_file: row.source_file })), null, 2));
if (missing.length > 0) process.exitCode = 1;
