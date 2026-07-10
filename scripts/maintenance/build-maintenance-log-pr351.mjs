import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const CONFIG_PATH = 'config/monthly-maintenance-log-v1.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));

export function buildMaintenanceLog() {
  const config = readJson(CONFIG_PATH);
  const entries = readJson(config.source_file)
    .map((entry) => ({
      month: entry.month,
      status: entry.status,
      as_of: entry.as_of,
      public_summary: entry.public_summary,
      checks: [...entry.checks].sort((left, right) => left.check_id.localeCompare(right.check_id)),
      counts: entry.counts,
      public_surface_releases: [...entry.public_surface_releases].sort((left, right) => left.id.localeCompare(right.id)),
      next_focus: [...entry.next_focus]
    }))
    .sort((left, right) => right.month.localeCompare(left.month));

  const summary = {
    entry_count: entries.length,
    closed_month_count: entries.filter((entry) => entry.status === 'closed').length,
    in_progress_month_count: entries.filter((entry) => entry.status === 'in_progress').length,
    latest_month: entries[0]?.month ?? null,
    latest_as_of: entries[0]?.as_of ?? null
  };

  const digest = crypto.createHash('sha256')
    .update(CONFIG_PATH).update('\0').update(readText(CONFIG_PATH)).update('\0')
    .update(config.source_file).update('\0').update(readText(config.source_file)).update('\0')
    .digest('hex');

  return {
    schema_version: '1.0',
    log_id: config.config_id,
    status: 'public_monthly_maintenance_log',
    generated_at: '2026-07-10',
    source_file: config.source_file,
    source_endpoint: config.source_endpoint,
    route: config.route,
    ordering: config.ordering,
    entry_policy: config.entry_policy,
    public_safety: config.public_safety,
    semantics: config.semantics,
    summary,
    input_digest_sha256: digest,
    entries
  };
}

export function serializeMaintenanceLog(log) {
  return `${JSON.stringify(log, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const log = buildMaintenanceLog();
  const serialized = serializeMaintenanceLog(log);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
    fs.writeFileSync(path.join(root, outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
