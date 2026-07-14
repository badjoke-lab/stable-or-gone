import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {loadRegistryV2Baseline} from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const rowsOf = (value, file) => {
  const rows = Array.isArray(value) ? value : value.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or {records: []}`);
  return rows;
};
const normalize = (value) => JSON.stringify(value, Object.keys(value).sort());
const withoutArchive = (row) => {
  const copy = structuredClone(row);
  delete copy.archived_url;
  return copy;
};

const config = readJson('config/evidence-correction-batch-pr360.json');
const queue = readJson('docs/migration/evidence-correction-queue-pr360.json');
const outcomes = readJson('docs/migration/evidence-correction-outcomes-pr360.json');
const baseline = loadRegistryV2Baseline(root);
const evidenceFiles = baseline.data_groups?.evidence ?? [];
const currentRows = evidenceFiles.flatMap((file) => rowsOf(readJson(file), file).map((row) => ({...row, __file: file})));
const currentById = new Map(currentRows.map((row) => [row.id, row]));
const selectedIds = queue.selected_candidates.map((row) => row.evidence_id).sort();
const outcomeIds = outcomes.outcomes.map((row) => row.evidence_id).sort();

const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
expect(queue.selected_count === 10 && selectedIds.length === 10, 'selected queue must contain exactly ten Evidence records');
expect(new Set(selectedIds).size === 10, 'selected Evidence IDs must be unique');
expect(JSON.stringify(selectedIds) === JSON.stringify(outcomeIds), 'outcome IDs must exactly match selected queue IDs');
expect(outcomes.changed_count === 8, 'changed_count must be 8');
expect(outcomes.dated_archive_added_or_replaced_count === 7, 'dated archive count must be 7');
expect(outcomes.invalid_wildcard_removed_count === 1, 'invalid wildcard removal count must be 1');
expect(outcomes.reviewed_no_change_count === 2, 'reviewed no-change count must be 2');
expect(outcomes.archive_index_count_before === 380 && outcomes.archive_index_count_after === 387, 'archive count transition must be 380 -> 387');
expect(outcomes.archive_not_recorded_count_before === 177 && outcomes.archive_not_recorded_count_after === 170, 'no-archive count transition must be 177 -> 170');
expect(outcomes.canonical_evidence_count_after === 557, 'canonical Evidence count must remain 557');
expect(outcomes.evidence_relation_count_after === 557, 'Evidence Relation count must remain 557');
expect(outcomes.changed_count <= config.maximum_canonical_evidence_records_touched, 'Evidence touch maximum exceeded');

const expectedArchives = new Map([
  ['sog_src_nuon_disclaimer_batch_b','https://web.archive.org/web/20260416023630/https://docs.nuon.fi/resources/legal-documents/investment-disclaimer'],
  ['sog_src_rlusd_user_terms','https://web.archive.org/web/20260414072541/https://ripple.com/legal/stablecoin/'],
  ['sog_src_usdc_terms_pr354','https://web.archive.org/web/20251220022409/https://www.circle.com/legal/usdc-terms'],
  ['sog_src_usde_terms_batch_a','https://web.archive.org/web/20260124121957/https://docs.ethena.fi/resources/usde-terms-and-conditions'],
  ['sog_src_usdt_cftc_2021_event','https://web.archive.org/web/20211015150107/https://www.cftc.gov/PressRoom/PressReleases/8450-21'],
  ['sog_src_usdt_nyag_2021_event','https://web.archive.org/web/20210223124057/https://ag.ny.gov/press-release/2021/attorney-general-james-ends-virtual-currency-trading-platform-bitfinexs-illegal'],
  ['sog_src_ust_sec_2023_32','https://web.archive.org/web/20240702092147/https://www.sec.gov/newsroom/press-releases/2023-32']
]);
for (const [id, archivedUrl] of expectedArchives) expect(currentById.get(id)?.archived_url === archivedUrl, `${id}: dated archived_url mismatch`);
for (const id of ['sog_src_busd_reuters_sec_2024','sog_src_tether_legal_terms','sog_src_usdt_terms_pr354']) expect(!String(currentById.get(id)?.archived_url ?? '').trim(), `${id}: must not retain an unreviewed archived_url`);

for (const file of outcomes.changed_files) {
  let baseValue;
  try {
    baseValue = JSON.parse(execFileSync('git', ['show', `origin/main:${file}`], {encoding: 'utf8'}));
  } catch (error) {
    failures.push(`${file}: unable to load origin/main baseline: ${error.message}`);
    continue;
  }
  const currentValue = readJson(file);
  const baseRows = rowsOf(baseValue, file);
  const changedRows = rowsOf(currentValue, file);
  expect(baseRows.length === changedRows.length, `${file}: row count changed`);
  const baseById = new Map(baseRows.map((row) => [row.id, row]));
  const changedById = new Map(changedRows.map((row) => [row.id, row]));
  expect(baseById.size === changedById.size, `${file}: Evidence identity count changed`);
  for (const [id, current] of changedById) {
    const base = baseById.get(id);
    if (!base) {
      failures.push(`${file}: new Evidence identity ${id}`);
      continue;
    }
    if (JSON.stringify(withoutArchive(base)) !== JSON.stringify(withoutArchive(current))) failures.push(`${file}: ${id} changed outside archived_url`);
    if (!selectedIds.includes(id) && (base.archived_url ?? null) !== (current.archived_url ?? null)) failures.push(`${file}: non-selected ${id} archive changed`);
  }
}

const archiveRecorded = currentRows.filter((row) => String(row.archived_url ?? '').trim()).length;
expect(currentRows.length === 557, `current Evidence count is ${currentRows.length}, expected 557`);
expect(archiveRecorded === 387, `current archive-recorded count is ${archiveRecorded}, expected 387`);
expect(currentRows.length - archiveRecorded === 170, `current no-archive count is ${currentRows.length - archiveRecorded}, expected 170`);

if (failures.length) {
  console.error('PR #360 Evidence correction validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  selected: selectedIds.length,
  changed: outcomes.changed_count,
  dated_archives: outcomes.dated_archive_added_or_replaced_count,
  invalid_wildcards_removed: outcomes.invalid_wildcard_removed_count,
  reviewed_no_change: outcomes.reviewed_no_change_count,
  evidence: currentRows.length,
  archive_recorded: archiveRecorded,
  archive_not_recorded: currentRows.length - archiveRecorded,
  changed_files: outcomes.changed_files
}, null, 2));
