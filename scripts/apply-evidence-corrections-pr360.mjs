import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const queue = readJson('docs/migration/evidence-correction-queue-pr360.json');
const config = readJson('config/evidence-correction-batch-pr360.json');
const baseline = loadRegistryV2Baseline(root);

const reviewedArchives = new Map([
  ['sog_src_nuon_disclaimer_batch_b', {
    archived_url: 'https://web.archive.org/web/20260416023630/https://docs.nuon.fi/resources/legal-documents/investment-disclaimer',
    timestamp: '20260416023630',
    digest: 'VFTRBAYOI7EGEIVLFS7B2DCEQQWJEIUD'
  }],
  ['sog_src_rlusd_user_terms', {
    archived_url: 'https://web.archive.org/web/20260414072541/https://ripple.com/legal/stablecoin/',
    timestamp: '20260414072541',
    digest: 'OKICX4AY7TQ44FZ44BJU42MA2ZPPWBSB'
  }],
  ['sog_src_usdc_terms_pr354', {
    archived_url: 'https://web.archive.org/web/20251220022409/https://www.circle.com/legal/usdc-terms',
    timestamp: '20251220022409',
    digest: 'QKET4U64GVSVM7ATK5YO6C3TQF5I7DZS'
  }],
  ['sog_src_usde_terms_batch_a', {
    archived_url: 'https://web.archive.org/web/20260124121957/https://docs.ethena.fi/resources/usde-terms-and-conditions',
    timestamp: '20260124121957',
    digest: 'K466DMNGPNCYICZ7SFOAL57SCJFVSUSU'
  }],
  ['sog_src_usdt_cftc_2021_event', {
    archived_url: 'https://web.archive.org/web/20211015150107/https://www.cftc.gov/PressRoom/PressReleases/8450-21',
    timestamp: '20211015150107',
    digest: 'C57FSCO44WC5PRHLRJMRV6JM7TTY47E2'
  }],
  ['sog_src_usdt_nyag_2021_event', {
    archived_url: 'https://web.archive.org/web/20210223124057/https://ag.ny.gov/press-release/2021/attorney-general-james-ends-virtual-currency-trading-platform-bitfinexs-illegal',
    timestamp: '20210223124057',
    digest: 'JZDZLP2JI2DWUNM4TISKYNEUN4E4VB5Z'
  }],
  ['sog_src_ust_sec_2023_32', {
    archived_url: 'https://web.archive.org/web/20240702092147/https://www.sec.gov/newsroom/press-releases/2023-32',
    timestamp: '20240702092147',
    digest: 'I76X6ZI5GRHHWFFPEJ3EBOR6MUQ4NA5K'
  }]
]);

const noChangeReasons = new Map([
  ['sog_src_busd_reuters_sec_2024', 'The CDX response contained no valid snapshot rows, so no archive URL is recorded.'],
  ['sog_src_tether_legal_terms', 'The available bounded probe did not produce a capture close enough to the 2026 review date to bind the current terms version safely.'],
  ['sog_src_usdt_terms_pr354', 'The legacy /legal/ route returned only old captures and cannot support the February 2026 terms version recorded by this Evidence row.']
]);

const selectedIds = new Set(queue.selected_candidates.map((row) => row.evidence_id));
const expectedIds = new Set([...reviewedArchives.keys(), ...noChangeReasons.keys()]);
if (selectedIds.size !== 10 || expectedIds.size !== 10 || [...selectedIds].some((id) => !expectedIds.has(id))) {
  throw new Error(`PR #360 queue identity mismatch: ${JSON.stringify([...selectedIds].sort())}`);
}
if (reviewedArchives.size > config.maximum_canonical_evidence_records_touched) throw new Error('PR #360 correction count exceeds configured maximum.');

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
    const reviewed = reviewedArchives.get(row.id);
    if (reviewed) {
      if (String(row.archived_url ?? '').trim() && row.archived_url !== reviewed.archived_url) throw new Error(`${row.id}: conflicting archived_url already recorded`);
      const previous = row.archived_url ?? null;
      row.archived_url = reviewed.archived_url;
      changed ||= previous !== reviewed.archived_url;
      outcomes.push({
        evidence_id: row.id,
        source_file: file,
        review_status: 'reviewed_dated_archive_added',
        correction_type: 'archive_supplementation',
        previous_value: {archived_url: previous},
        new_value: {archived_url: reviewed.archived_url},
        evidence_basis: {
          method: 'Wayback CDX exact-source probe',
          capture_timestamp: reviewed.timestamp,
          capture_digest: reviewed.digest,
          source_url: row.url
        },
        reason: 'A successful HTTP 200 Wayback capture was found for the exact canonical source URL and was reviewed against the publication/access boundary.',
        remaining_uncertainty: 'The archive preserves the captured source version only; later page changes are not inferred.'
      });
    } else {
      outcomes.push({
        evidence_id: row.id,
        source_file: file,
        review_status: 'reviewed_no_safe_canonical_change',
        correction_type: null,
        previous_value: {archived_url: row.archived_url ?? null, url: row.url},
        new_value: null,
        evidence_basis: {method: 'Wayback CDX exact-source probe'},
        reason: noChangeReasons.get(row.id),
        remaining_uncertainty: 'A later batch may add a dated capture or perform source-identity maintenance after version-equivalence review.'
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
const changedOutcomes = outcomes.filter((row) => row.review_status === 'reviewed_dated_archive_added');
const unchangedOutcomes = outcomes.filter((row) => row.review_status === 'reviewed_no_safe_canonical_change');
if (changedOutcomes.length !== 7 || unchangedOutcomes.length !== 3) throw new Error('Unexpected PR #360 outcome split.');

const report = {
  schema_version: '1.1',
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
  archive_index_count_after: 387,
  archive_not_recorded_count_before: 177,
  archive_not_recorded_count_after: 170,
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
