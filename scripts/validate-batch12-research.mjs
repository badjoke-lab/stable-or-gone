import fs from 'node:fs';

const research = JSON.parse(fs.readFileSync('data/candidate-research-batch-12.json', 'utf8'));
const candidates = JSON.parse(fs.readFileSync('data/candidate-stable-assets-growth-75.json', 'utf8'));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

check(research.schema_version === '1.0', 'schema_version must be 1.0');
check(research.batch_id === 'batch_012', 'batch_id must be batch_012');
check(research.status === 'reviewed_not_promoted', 'research must remain non-promoted');
check(research.canonical_assets === 70, 'canonical asset baseline must remain 70');
check(research.policy?.canonical_write_allowed === false, 'canonical writes must remain disabled');
check(research.policy?.manual_evidence_review_required === true, 'manual evidence review must remain required');
check(research.policy?.full_layer_draft_required === true, 'full layer drafts must remain required');
check(research.policy?.unsupported_day_precision_forbidden === true, 'unsupported day precision must remain forbidden');
check(research.policy?.yield_wrapper_is_not_alias === true, 'yield wrappers must remain separate identities');
check(research.policy?.production_parity_required_at_75 === true, '75-record parity gate must remain enabled');

check(Array.isArray(research.records) && research.records.length === 5, 'research must contain five records');
check(Array.isArray(candidates) && candidates.length === 5, 'candidate intake must contain five records');

const expectedCandidateIds = new Set(candidates.map((item) => item.candidate_id));
const expectedRecordIds = new Map(candidates.map((item) => [item.candidate_id, item.proposed_record_id]));
const seenCandidateIds = new Set();
const seenRecordIds = new Set();
const seenSlugs = new Set();

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
  check(['day', 'month', 'year'].includes(record.launch_precision), `invalid launch precision: ${record.candidate_id}`);
  if (record.launch_date !== null) {
    check(/^\d{4}-\d{2}-\d{2}$/.test(record.launch_date), `invalid launch date: ${record.candidate_id}`);
  } else {
    check(record.launch_precision !== 'day', `null launch date cannot claim day precision: ${record.candidate_id}`);
  }
  check(Array.isArray(record.primary_sources) && record.primary_sources.length >= 3, `insufficient source leads: ${record.candidate_id}`);
  for (const url of record.primary_sources ?? []) {
    check(/^https:\/\//.test(url), `source must use https: ${record.candidate_id}`);
  }
  check(Array.isArray(record.blocking_unknowns) && record.blocking_unknowns.length > 0, `blocking unknowns required: ${record.candidate_id}`);
  check(record.promotion_readiness !== 'promoted', `research contract cannot promote: ${record.candidate_id}`);
}

for (const candidateId of expectedCandidateIds) {
  check(seenCandidateIds.has(candidateId), `candidate missing from research: ${candidateId}`);
}

if (errors.length) {
  for (const error of errors) console.error(`Batch 12 research: ${error}`);
  process.exitCode = 1;
} else {
  console.log('Batch 12 research contract valid: 5 reviewed candidates, 0 promotions');
}
