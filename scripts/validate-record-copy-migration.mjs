import fs from 'node:fs';
import path from 'node:path';
import { stablecoinPublicCopySlugs } from '../config/stablecoin-public-copy.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/record-copy-migration-audit.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(fs.existsSync(auditPath), 'record-copy migration audit is missing');
if (!fs.existsSync(auditPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const counts = audit.canonical_counts_after ?? {};
const preservation = audit.preservation ?? {};
const records = audit.records ?? [];

assert(audit.schema_version === '1.0', 'record-copy audit schema must be 1.0');
assert(counts.stablecoins === 92, `expected 92 stablecoins, found ${counts.stablecoins}`);
assert(counts.organizations === 86, `expected 86 organizations, found ${counts.organizations}`);
assert(counts.relationships === 101, `expected 101 relationships, found ${counts.relationships}`);
assert(counts.events === 150, `expected 150 events, found ${counts.events}`);
assert(counts.evidence === 455, `expected 455 canonical evidence records, found ${counts.evidence}`);
assert(counts.deployments === 130, `expected 130 deployments, found ${counts.deployments}`);
assert(counts.known_unknowns === 253, `expected 253 known unknowns, found ${counts.known_unknowns}`);
assert(records.length === 92, `expected 92 record audit rows, found ${records.length}`);
assert(new Set(records.map((row) => row.stablecoin_id)).size === 92, 'stablecoin audit IDs must be unique');
assert(new Set(records.map((row) => row.slug)).size === 92, 'stablecoin audit slugs must be unique');
assert(preservation.canonical_counts_equal === true, 'canonical before and after counts differ');
assert(preservation.canonical_stablecoin_ids_preserved === true, 'canonical stablecoin IDs were not preserved');
assert(preservation.public_copy_entries === stablecoinPublicCopySlugs.length, 'public copy entry count mismatch');
assert(stablecoinPublicCopySlugs.length === 20, `expected 20 migrated curated summaries, found ${stablecoinPublicCopySlugs.length}`);
assert((preservation.invalid_copy_slugs ?? []).length === 0, `invalid public copy slugs: ${(preservation.invalid_copy_slugs ?? []).join(', ')}`);
assert((preservation.copy_entries_with_missing_summary ?? []).length === 0, `empty public copy entries: ${(preservation.copy_entries_with_missing_summary ?? []).join(', ')}`);
assert((preservation.duplicate_copy_summaries ?? []).length === 0, 'duplicate curated stablecoin summaries found');
assert(preservation.component_asset_specific_findings === 0, `component/page asset-specific findings remain: ${preservation.component_asset_specific_findings}`);
assert((audit.summary_source_counts?.fallback_missing ?? 0) === 0, `records still use missing-summary fallback: ${audit.summary_source_counts?.fallback_missing ?? 0}`);
assert((audit.summary_source_counts?.curated_copy_layer ?? 0) === 20, `expected 20 curated-copy records, found ${audit.summary_source_counts?.curated_copy_layer ?? 0}`);
assert((audit.summary_source_counts?.canonical_record ?? 0) === 72, `expected 72 canonical-summary records, found ${audit.summary_source_counts?.canonical_record ?? 0}`);
assert((audit.migration_result_counts?.pass ?? 0) === 92, `expected 92 passing records, found ${audit.migration_result_counts?.pass ?? 0}`);
assert((audit.migration_result_counts?.fail ?? 0) === 0, `record migration failures remain: ${audit.migration_result_counts?.fail ?? 0}`);

for (const row of records) {
  assert(row.migration_pass === true, `${row.stablecoin_id}: migration did not pass`);
  assert(Array.isArray(row.missing_required_axes) && row.missing_required_axes.length === 0, `${row.stablecoin_id}: missing axes ${row.missing_required_axes?.join(', ')}`);
  assert(row.summary_length > 0, `${row.stablecoin_id}: public summary is empty`);
  assert(row.organization_relationships > 0, `${row.stablecoin_id}: organization relationship missing`);
  assert(row.canonical_evidence_records > 0, `${row.stablecoin_id}: canonical evidence missing`);
  assert(row.source_identities > 0, `${row.stablecoin_id}: evidence source identity missing`);
  assert(row.deployments > 0, `${row.stablecoin_id}: deployment missing`);
}

const componentSource = fs.readFileSync(path.join(root, 'src/components/StablecoinDetailView.astro'), 'utf8');
assert(!componentSource.includes('const publicSummaries'), 'StablecoinDetailView still contains an asset-specific summary map');
assert(componentSource.includes('getStablecoinPublicSummary'), 'StablecoinDetailView must use the canonical public copy resolver');
assert(componentSource.includes('Source identities'), 'StablecoinDetailView must distinguish source identities');
assert(componentSource.includes('Evidence records'), 'StablecoinDetailView must preserve canonical evidence record count');

const copySource = fs.readFileSync(path.join(root, 'src/data/stablecoinPublicCopy.ts'), 'utf8');
assert(copySource.includes("../../config/stablecoin-public-copy.mjs"), 'TypeScript copy layer must import the canonical MJS registry');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    stablecoins: records.length,
    curated_copy_records: audit.summary_source_counts?.curated_copy_layer ?? 0,
    canonical_summary_records: audit.summary_source_counts?.canonical_record ?? 0,
    passing_records: audit.migration_result_counts?.pass ?? 0,
    component_asset_specific_findings: preservation.component_asset_specific_findings ?? null
  },
  failures
};

const outputPath = path.join(root, 'data/generated/record-copy-migration-validation.json');
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);

if (failures.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(validation, null, 2));
