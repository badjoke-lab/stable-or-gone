import fs from 'node:fs';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const research = read('data/candidate-research-batch-13.json');
const candidates = read('data/candidate-stable-assets-growth-80.json');
const master = read('docs/growth/candidate-master-70.json');
const promotions = read('data/candidate-promotions-batch-m.json');
const errors = [];
const check = (value, message) => { if (!value) errors.push(message); };

check(research.batch_id === 'batch_013', 'batch_id must be batch_013');
check(research.status === 'promoted', 'research status must be promoted');
check(research.canonical_assets === 80, 'Batch 13 canonical asset checkpoint must remain 80');
check(Array.isArray(research.records) && research.records.length === 5, 'research must contain five records');
check(Array.isArray(candidates) && candidates.length === 5, 'candidate intake must contain five records');
check(Array.isArray(promotions) && promotions.length === 5, 'promotion manifest must contain five records');

const totalCandidates = master.protected_minimums?.total_candidates ?? 0;
const promotedCandidates = master.protected_minimums?.promoted_candidates ?? 0;
const allowedCheckpoints = new Set([80, 81, 82, 87, 92]);

check(totalCandidates >= 80, 'candidate total must preserve at least the Batch 13 checkpoint of 80');
check(promotedCandidates >= 80, 'promoted total must preserve at least the Batch 13 checkpoint of 80');
check(master.protected_minimums?.pending_candidates === 0, 'pending total must be zero');
check(totalCandidates === promotedCandidates, 'candidate and promoted totals must remain aligned after completed promotion batches');
check(allowedCheckpoints.has(totalCandidates), `candidate total must match a reviewed promotion checkpoint: ${totalCandidates}`);

if (totalCandidates > 80) {
  check(master.candidate_files?.includes('data/candidate-stable-assets-emergency-msusd.json'), 'post-80 candidates must include the documented msUSD emergency intake');
  check(master.promotion_policy?.batch_014_is_emergency_incident_exception === true, 'Batch 14 must remain marked as the emergency incident exception');
}

if (totalCandidates > 81) {
  check(master.candidate_files?.includes('data/candidate-stable-assets-emergency-jpysc.json'), 'post-81 candidates must include the documented JPYSC time-sensitive intake');
  check(master.promotion_policy?.batch_015_is_time_sensitive_launch_exception === true, 'Batch 15 must remain marked as the time-sensitive launch exception');
}

if (totalCandidates > 82) {
  check(master.promotion_policy?.production_record_parity_at_82_passed === true, 'ordinary growth after 82 requires recorded production parity at 82');
  check(master.promotion_policy?.no_80_to_85_work_without_production_parity === true, 'the production-parity gate must remain documented');
  check(master.candidate_files?.includes('data/candidate-stable-assets-growth-85.json'), 'Batch 16 candidate intake must remain registered');
  check(master.promotion_policy?.batch_016_research_complete === true, 'Batch 16 research must be complete before post-82 growth');
  check(master.promotion_policy?.batch_016_promotion_complete === true, 'Batch 16 promotion must be complete before the 87-record checkpoint');
  check(master.promotion_policy?.ordinary_growth_remains_blocked === false, 'ordinary growth must be unblocked only after the recorded 82-record production-parity gate');
} else if (totalCandidates > 80) {
  check(master.promotion_policy?.ordinary_growth_remains_blocked === true, 'ordinary growth must remain blocked while only emergency exceptions are present');
}

if (totalCandidates > 87) {
  check(master.candidate_files?.includes('data/candidate-stable-assets-growth-90.json'), 'Batch 17 candidate intake must remain registered');
  check(master.promotion_policy?.batch_017_research_complete === true, 'Batch 17 research must be complete before the 92-record checkpoint');
  check(master.promotion_policy?.batch_017_full_layer_draft_complete === true, 'Batch 17 full-layer draft must be complete before promotion');
  check(master.promotion_policy?.batch_017_promotion_complete === true, 'Batch 17 promotion must be complete at the 92-record checkpoint');
}

const promotionIds = new Set(promotions.filter((row) => row.status === 'promoted').map((row) => row.candidate_id));
const required = ['identity_decision','backing_decision','redemption_decision','income_decision','deployment_decision'];
for (const row of research.records ?? []) {
  check(promotionIds.has(row.candidate_id), 'missing promotion: ' + row.candidate_id);
  check(row.promotion_readiness === 'promoted', 'readiness must be promoted: ' + row.candidate_id);
  for (const field of required) check(typeof row[field] === 'string' && row[field].length >= 60, field + ' incomplete: ' + row.candidate_id);
  check(Array.isArray(row.primary_sources) && row.primary_sources.length >= 3, 'primary sources incomplete: ' + row.candidate_id);
  check(Array.isArray(row.blocking_unknowns) && row.blocking_unknowns.length >= 4, 'known unknowns incomplete: ' + row.candidate_id);
}
check(research.records.find((row) => row.candidate_id === 'sog_cand_000076')?.launch_date === '2023-12-07', 'GYD launch date mismatch');
if (errors.length) { errors.forEach((error) => console.error('Batch 13 research: ' + error)); process.exit(1); }
console.log(`Batch 13 promotion contract valid: 5 promoted candidates, 80-record checkpoint preserved, current reviewed checkpoint ${totalCandidates}`);
