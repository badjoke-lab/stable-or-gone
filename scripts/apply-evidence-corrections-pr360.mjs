import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const queue = readJson('docs/migration/evidence-correction-queue-pr360.json');
const config = readJson('config/evidence-correction-batch-pr360.json');
const baseline = loadRegistryV2Baseline(root);

const archiveIds = new Set([
  'sog_src_busd_reuters_sec_2024',
  'sog_src_usdt_cftc_2021_event',
  'sog_src_usdt_nyag_2021_event',
  'sog_src_ust_sec_2023_32'
]);
const noChangeIds = new Set([
  'sog_src_nuon_disclaimer_batch_b',
  'sog_src_rlusd_user_terms',
  'sog_src_tether_legal_terms',
  'sog_src_usdc_terms_pr354',
  'sog_src_usde_terms_batch_a',
  'sog_src_usdt_terms_pr354'
]);
const selectedIds = new Set(queue.selected_candidates.map((row) => row.evidence_id));
const expectedIds = new Set([...archiveIds, ...noChangeIds]);
if (selectedIds.size !== 10 || expectedIds.size !== 10 || [...selectedIds].some((id) => !expectedIds.has(id))) {
  throw new Error(`PR #360 queue identity mismatch: ${JSON.stringify([...selectedIds].sort())}`);
}
if (archiveIds.size > config.maximum_canonical_evidence_records_touched) throw new Error('PR #360 correction count exceeds configured maximum.');

const outcomes = [];
const seen = new Set();
const changedFiles = [];
for (const file of baseline.data_groups?.evidence ?? []) {
  const absolute = path.join(root, file);
  const parsed = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  const rows = Array.isArray(parsed) ? parsed : parsed.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or { records: [] }`);
  let changed = false;
  for (const row of rows) {
    if (!selectedIds.has(row.id)) continue;
    if (seen.has(row.id)) throw new Error(`Duplicate selected Evidence ID: ${row.id}`);
    seen.add(row.id);
    if (archiveIds.has(row.id)) {
      if (String(row.archived_url ?? '').trim()) throw new Error(`${row.id}: archived_url already recorded`);
      if (!/^https:\/\//.test(row.url ?? '')) throw new Error(`${row.id}: HTTPS source URL required`);
      const archivedUrl = `https://web.archive.org/web/*/${row.url}`;
      row.archived_url = archivedUrl;
      changed = true;
      outcomes.push({
        evidence_id: row.id,
        source_file: file,
        review_status: 'reviewed_archive_index_added',
        correction_type: 'archive_supplementation',
        previous_value: { archived_url: null },
        new_value: { archived_url: archivedUrl },
        reason: 'Dated regulator or high-quality reporting source selected from the deterministic no-archive queue. Added the Wayback Machine capture index for the exact canonical source URL without changing source identity, subject relations, claim scope, title, publisher, or publication date.',
        remaining_uncertainty: 'The index is not treated as proof of any individual timestamped capture; individual captures remain subject to later source review.'
      });
    } else {
      outcomes.push({
        evidence_id: row.id,
        source_file: file,
        review_status: 'reviewed_no_safe_canonical_change',
        correction_type: null,
        previous_value: { archived_url: null, url: row.url },
        new_value: null,
        reason: 'Dynamic legal or terms page. A generic archive index was not added because the currently recorded claim scope may depend on a specific terms version and no reviewed dated capture was bound in this batch.',
        remaining_uncertainty: 'A later correction may add a dated archive capture after matching the capture text and effective version to the canonical claim scope.'
      });
    }
  }
  if (changed) {
    if (Array.isArray(parsed)) writeJson(file, rows);
    else writeJson(file, {...parsed, records: rows});
    changedFiles.push(file);
  }
}

if (seen.size !== selectedIds.size) throw new Error(`Selected Evidence coverage mismatch: saw ${seen.size}, expected ${selectedIds.size}`);
const changedOutcomes = outcomes.filter((row) => row.review_status === 'reviewed_archive_index_added');
const unchangedOutcomes = outcomes.filter((row) => row.review_status === 'reviewed_no_safe_canonical_change');
if (changedOutcomes.length !== 4 || unchangedOutcomes.length !== 6) throw new Error('Unexpected PR #360 outcome split.');

const report = {
  schema_version: '1.0',
  report_id: 'sog_evidence_correction_outcomes_pr360_2026_07_14',
  status: 'reviewed_internal_correction_report',
  public_output: false,
  review_pr: 360,
  queue_id: queue.queue_id,
  canonical_evidence_count_before: 557,
  canonical_evidence_count_after: 557,
  evidence_relation_count_before: 557,
  evidence_relation_count_after: 557,
  archive_index_count_before: 380,
  archive_index_count_after: 384,
  archive_not_recorded_count_before: 177,
  archive_not_recorded_count_after: 173,
  selected_count: outcomes.length,
  changed_count: changedOutcomes.length,
  reviewed_no_change_count: unchangedOutcomes.length,
  changed_files: [...new Set(changedFiles)].sort(),
  outcomes: outcomes.sort((a, b) => a.evidence_id.localeCompare(b.evidence_id)),
  constraints: {
    new_evidence_identities: 0,
    removed_evidence_identities: 0,
    evidence_relation_changes: 0,
    asset_changes: 0,
    market_access_record_changes: 0,
    new_public_surface: false
  }
};
writeJson('docs/migration/evidence-correction-outcomes-pr360.json', report);
console.log(JSON.stringify({
  ok: true,
  changed_evidence_ids: changedOutcomes.map((row) => row.evidence_id).sort(),
  reviewed_no_change_ids: unchangedOutcomes.map((row) => row.evidence_id).sort(),
  changed_files: report.changed_files,
  archive_index_count_after: report.archive_index_count_after,
  archive_not_recorded_count_after: report.archive_not_recorded_count_after
}, null, 2));
