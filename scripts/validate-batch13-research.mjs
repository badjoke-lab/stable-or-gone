import fs from 'node:fs';

const research = JSON.parse(fs.readFileSync('data/candidate-research-batch-13.json', 'utf8'));
const candidates = JSON.parse(fs.readFileSync('data/candidate-stable-assets-growth-80.json', 'utf8'));
const master = JSON.parse(fs.readFileSync('docs/growth/candidate-master-70.json', 'utf8'));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

check(research.schema_version === '1.0', 'schema_version must be 1.0');
check(research.batch_id === 'batch_013', 'batch_id must be batch_013');
check(research.status === 'reviewed_not_promoted', 'research status must be reviewed_not_promoted');
check(research.canonical_assets === 75, 'canonical asset baseline must be 75');
check(research.policy?.canonical_write_allowed === false, 'boundary review cannot directly write canonical data');
check(research.policy?.manual_evidence_review_required === true, 'manual evidence review must remain required');
check(research.policy?.full_layer_draft_required === true, 'full layer drafts must remain required');
check(research.policy?.unsupported_day_precision_forbidden === true, 'unsupported day precision must remain forbidden');
check(research.policy?.yield_wrapper_is_not_alias === true, 'yield wrappers must remain separate identities');
check(research.policy?.identity_deduplication_required === true, 'identity deduplication must remain required');
check(research.policy?.production_parity_required_at_80 === true, '80-record parity gate must remain enabled');
check(Array.isArray(research.records) && research.records.length === 5, 'research must contain five records');
check(Array.isArray(candidates) && candidates.length === 5, 'candidate intake must contain five records');
check(master.candidate_files?.includes('data/candidate-stable-assets-growth-80.json'), 'candidate master must include the 80-growth file');
check(master.protected_minimums?.total_candidates === 80, 'candidate master total must be 80');
check(master.protected_minimums?.promoted_candidates === 75, 'promoted minimum must remain 75');
check(master.protected_minimums?.pending_candidates === 5, 'pending minimum must be 5');
check(master.planned_batches?.batch_013?.minimum_candidates === 5, 'batch_013 must require five candidates');

const expectedIds = ['sog_cand_000076', 'sog_cand_000077', 'sog_cand_000078', 'sog_cand_000079', 'sog_cand_000080'];
const expectedCandidateIds = new Set(candidates.map((item) => item.candidate_id));
const expectedRecordIds = new Map(candidates.map((item) => [item.candidate_id, item.proposed_record_id]));
const seenCandidateIds = new Set();
const seenRecordIds = new Set();
const seenSlugs = new Set();
const allowedReadiness = new Set([
  'needs_layer_draft',
  'needs_identity_and_income_resolution',
  'needs_lifecycle_and_deployment_resolution',
  'needs_legal_and_counterparty_resolution'
]);
const requiredDecisionFields = [
  'identity_decision',
  'backing_decision',
  'redemption_decision',
  'income_decision',
  'deployment_decision'
];

check(expectedIds.every((id) => expectedCandidateIds.has(id)), 'candidate IDs must be contiguous from 76 through 80');

for (const candidate of candidates) {
  check(candidate.target_batch === 'batch_013', `candidate must target batch_013: ${candidate.candidate_id}`);
  check(candidate.status === 'candidate', `candidate status must remain candidate: ${candidate.candidate_id}`);
  check(candidate.priority === 'P0', `candidate priority must be P0: ${candidate.candidate_id}`);
}

for (const record of research.records ?? []) {
  check(expectedCandidateIds.has(record.candidate_id), `unexpected candidate_id: ${record.candidate_id}`);
  check(expectedRecordIds.get(record.candidate_id) === record.proposed_record_id, `proposed_record_id mismatch: ${record.candidate_id}`);
  check(!seenCandidateIds.has(record.candidate_id), `duplicate candidate_id: ${record.candidate_id}`);
  check(!seenRecordIds.has(record.proposed_record_id), `duplicate proposed_record_id: ${record.proposed_record_id}`);
  check(!seenSlugs.has(record.slug), `duplicate slug: ${record.slug}`);
  seenCandidateIds.add(record.candidate_id);
  seenRecordIds.add(record.proposed_record_id);
  seenSlugs.add(record.slug);

  check(record.proposed_status === 'active', `candidate must remain an active proposal: ${record.candidate_id}`);
  if (record.launch_date !== null) {
    check(/^\d{4}-\d{2}-\d{2}$/.test(record.launch_date), `launch_date must be ISO day precision: ${record.candidate_id}`);
    check(record.launch_precision === 'day', `non-null launch_date requires day precision: ${record.candidate_id}`);
  } else {
    check(['unresolved', 'year', 'month'].includes(record.launch_precision), `null launch_date must retain bounded precision: ${record.candidate_id}`);
  }

  for (const field of requiredDecisionFields) {
    check(typeof record[field] === 'string' && record[field].length >= 60, `${field} is incomplete: ${record.candidate_id}`);
  }
  check(Array.isArray(record.primary_sources) && record.primary_sources.length >= 3, `insufficient reviewed primary sources: ${record.candidate_id}`);
  for (const url of record.primary_sources ?? []) check(/^https:\/\//.test(url), `source must use https: ${record.candidate_id}`);
  check(Array.isArray(record.blocking_unknowns) && record.blocking_unknowns.length >= 4, `blocking unknowns required: ${record.candidate_id}`);
  check(allowedReadiness.has(record.promotion_readiness), `invalid promotion readiness: ${record.candidate_id}`);
}

for (const candidateId of expectedCandidateIds) check(seenCandidateIds.has(candidateId), `candidate missing from research: ${candidateId}`);
check(research.records.filter((record) => record.launch_date !== null).length === 1, 'only the reviewed GYD day-level launch date may be asserted');
check(research.records.find((record) => record.candidate_id === 'sog_cand_000076')?.launch_date === '2023-12-07', 'GYD launch date must match the official mainnet announcement');
check(research.records.find((record) => record.candidate_id === 'sog_cand_000079')?.identity_decision.includes('previously called miMATIC'), 'MAI review must preserve official miMATIC continuity');
check(research.records.find((record) => record.candidate_id === 'sog_cand_000080')?.identity_decision.includes('sUSDX is a separate'), 'USDX review must keep sUSDX separate');

if (errors.length) {
  for (const error of errors) console.error(`Batch 13 research: ${error}`);
  process.exitCode = 1;
} else {
  console.log('Batch 13 boundary review valid: 5 reviewed candidates, 0 canonical promotions');
}
