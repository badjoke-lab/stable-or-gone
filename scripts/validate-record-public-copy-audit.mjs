import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/record-public-copy-audit.json');
const preservationPath = path.join(root, 'data/generated/record-public-copy-preservation.json');
const v3BaselinePath = path.join(root, 'docs/migration/registry-v3-baseline.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(fs.existsSync(auditPath), 'record public-copy audit is missing');
assert(fs.existsSync(preservationPath), 'record public-copy preservation report is missing');
assert(fs.existsSync(v3BaselinePath), 'registry-v3 baseline is missing');
if (!fs.existsSync(auditPath) || !fs.existsSync(preservationPath) || !fs.existsSync(v3BaselinePath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const preservation = JSON.parse(fs.readFileSync(preservationPath, 'utf8'));
const v3Baseline = JSON.parse(fs.readFileSync(v3BaselinePath, 'utf8'));
const totals = audit.totals ?? {};
const matrix = audit.record_matrix ?? [];
const occurrences = audit.occurrences ?? [];
const findingsByDisposition = audit.findings_by_disposition ?? {};
const expectedStablecoins = v3Baseline.expected_counts?.stablecoins;
const expectedEvidenceRelations = v3Baseline.expected_counts?.evidence;
const expectedPublicSourceIdentities = 412;

assert(audit.schema_version === '1.0', 'audit schema version must be 1.0');
assert(preservation.schema_version === '1.0', 'preservation schema version must be 1.0');
assert(typeof audit.baseline_id === 'string' && audit.baseline_id.length > 0, 'baseline id is missing');
assert(totals.stablecoins === expectedStablecoins, `expected ${expectedStablecoins} stablecoins, found ${totals.stablecoins}`);
assert(matrix.length === expectedStablecoins, `expected ${expectedStablecoins} migration rows, found ${matrix.length}`);
assert(totals.canonical_evidence_relations === expectedEvidenceRelations, `expected ${expectedEvidenceRelations} canonical evidence relations, found ${totals.canonical_evidence_relations}`);
assert(totals.public_source_identities === expectedPublicSourceIdentities, `expected ${expectedPublicSourceIdentities} public source identities, found ${totals.public_source_identities}`);
assert(totals.orphan_source_relation_ids === 0, 'orphan evidence source relation ids must be zero');
assert(totals.invalid_stablecoin_relation_ids === 0, 'invalid stablecoin relation ids must be zero');
assert(totals.invalid_public_copy_override_ids === 0, 'public-copy overrides must reference canonical stablecoin ids');
assert(totals.approved_public_copy_overrides === 20, `expected 20 reviewed stablecoin public-copy overrides, found ${totals.approved_public_copy_overrides}`);
assert(totals.records_using_canonical_summary_fallback === 72, `expected 72 canonical-summary fallbacks, found ${totals.records_using_canonical_summary_fallback}`);
assert(totals.migration_target_occurrences === 0, `unresolved record-specific public-copy occurrences remain: ${totals.migration_target_occurrences}`);
assert(totals.migration_target_files === 0, `unresolved record-specific public-copy files remain: ${totals.migration_target_files}`);
assert(totals.public_copy_preservation_ok === true, 'public-copy preservation result must pass');
assert(preservation.ok === true, 'before/after public-copy preservation report must pass');
assert(Object.values(preservation.preserved ?? {}).every(Boolean), 'all public-copy preservation axes must pass');
assert(preservation.before?.summary_override_count === 20, 'before report must contain 20 embedded summary overrides');
assert(preservation.after?.summary_override_count === 20, 'after report must contain 20 data-layer summary overrides');
assert(preservation.before?.canonical_summary_fallback_count === 72, 'before report must contain 72 canonical-summary fallbacks');
assert(preservation.after?.canonical_summary_fallback_count === 72, 'after report must contain 72 canonical-summary fallbacks');
assert(preservation.before?.summary_map_sha256 === preservation.after?.summary_map_sha256, 'summary text digest changed during migration');
assert((audit.migration_target_files ?? []).length === 0, 'migration target file list must be empty');
assert((audit.orphan_source_relation_ids ?? []).length === 0, 'orphan source relation list must be empty');
assert((audit.invalid_stablecoin_relation_ids ?? []).length === 0, 'invalid stablecoin relation list must be empty');
assert((audit.invalid_public_copy_override_ids ?? []).length === 0, 'invalid public-copy override list must be empty');
assert(totals.scanned_files > 0, 'source-file scan must not be empty');
assert(Array.isArray(audit.files), 'file inventory is missing');
assert(Array.isArray(occurrences), 'occurrence inventory is missing');
assert(typeof audit.inventory_digest === 'string' && audit.inventory_digest.startsWith('sha256:'), 'inventory digest is missing');

const dispositionTotal = Object.values(findingsByDisposition).reduce((sum, count) => sum + Number(count), 0);
assert(dispositionTotal === occurrences.length, 'finding dispositions must sum to the occurrence inventory');
assert(findingsByDisposition.migration_target === 0, 'migration-target disposition must be empty');
assert((findingsByDisposition.approved_data_overlay ?? 0) > 0, 'approved public-copy data overlays must remain visible in the audit');
assert((findingsByDisposition.editorial_reference ?? 0) > 0, 'editorial stablecoin references must remain visible in the audit');

const ids = new Set();
const slugs = new Set();
const routes = new Set();
for (const row of matrix) {
  assert(typeof row.stablecoin_id === 'string' && row.stablecoin_id.length > 0, 'migration row id is missing');
  assert(!ids.has(row.stablecoin_id), `duplicate migration row id: ${row.stablecoin_id}`);
  ids.add(row.stablecoin_id);
  assert(typeof row.slug === 'string' && row.slug.length > 0, `${row.stablecoin_id}: slug is missing`);
  assert(!slugs.has(row.slug), `duplicate migration slug: ${row.slug}`);
  slugs.add(row.slug);
  assert(row.route === `/stablecoin/${row.slug}/`, `${row.stablecoin_id}: route does not match slug`);
  assert(!routes.has(row.route), `duplicate migration route: ${row.route}`);
  routes.add(row.route);
  assert(row.required_identity_complete === true, `${row.stablecoin_id}: required identity is incomplete`);
  assert(row.relationship_count > 0, `${row.stablecoin_id}: organization relationship is missing`);
  assert(row.canonical_evidence_relation_count > 0, `${row.stablecoin_id}: canonical evidence relation is missing`);
  assert(row.public_source_identity_count > 0, `${row.stablecoin_id}: public source identity is missing`);
  assert(row.migration_ready === true, `${row.stablecoin_id}: record migration is incomplete`);
}

const overrideIds = audit.public_copy_override_ids ?? [];
assert(new Set(overrideIds).size === overrideIds.length, 'public-copy override ids must be unique');
for (const overrideId of overrideIds) assert(ids.has(overrideId), `public-copy override references unknown stablecoin ${overrideId}`);

for (const occurrence of occurrences) {
  assert(ids.has(occurrence.stablecoin_id), `${occurrence.file}:${occurrence.line}: occurrence references unknown stablecoin ${occurrence.stablecoin_id}`);
  assert(typeof occurrence.context === 'string' && occurrence.context.length > 0, `${occurrence.file}:${occurrence.line}: occurrence context is missing`);
  assert(typeof occurrence.disposition === 'string' && occurrence.disposition.length > 0, `${occurrence.file}:${occurrence.line}: occurrence disposition is missing`);
}

const componentSource = fs.readFileSync(path.join(root, 'src/components/StablecoinDetailView.astro'), 'utf8');
assert(componentSource.includes('getStablecoinPublicSummary'), 'StablecoinDetailView must use the stablecoin public-copy resolver');
assert(componentSource.includes('<p>{publicSummary}</p>'), 'StablecoinDetailView must render the resolved public summary');
assert(!componentSource.includes('const publicSummaries'), 'record-specific summary map remains embedded in StablecoinDetailView');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    stablecoins: matrix.length,
    scanned_files: totals.scanned_files,
    files_with_record_specific_occurrences: totals.files_with_record_specific_occurrences,
    record_specific_occurrences: occurrences.length,
    likely_public_copy_occurrences: totals.likely_public_copy_occurrences,
    migration_target_occurrences: totals.migration_target_occurrences,
    approved_public_copy_overrides: totals.approved_public_copy_overrides,
    records_using_canonical_summary_fallback: totals.records_using_canonical_summary_fallback,
    migration_ready_records: matrix.filter((row) => row.migration_ready).length,
    incomplete_records: matrix.filter((row) => !row.migration_ready).length,
    public_copy_preservation_ok: preservation.ok
  },
  findings_by_disposition: findingsByDisposition,
  failures
};

fs.writeFileSync(path.join(root, 'data/generated/record-public-copy-validation.json'), `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
