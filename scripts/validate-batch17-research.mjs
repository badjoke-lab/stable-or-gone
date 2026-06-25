import fs from 'node:fs';

const research = JSON.parse(fs.readFileSync('data/candidate-research-batch-17.json', 'utf8'));
const candidates = JSON.parse(fs.readFileSync('data/candidate-stable-assets-growth-90.json', 'utf8'));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

check(research.schema_version === '1.0', 'schema_version must be 1.0');
check(research.batch_id === 'batch_017', 'batch_id must be batch_017');
check(research.status === 'accepted', 'research status must be accepted');
check(research.canonical_assets === 87, 'canonical asset baseline must be 87');
check(research.policy?.canonical_write_allowed === false, 'research cannot write canonical data');
check(research.policy?.manual_evidence_review_required === true, 'manual evidence review must remain required');
check(research.policy?.full_layer_draft_required === true, 'full layer drafts must remain required');
check(research.policy?.unsupported_day_precision_forbidden === true, 'unsupported day precision must remain forbidden');
check(research.policy?.identity_deduplication_required === true, 'identity deduplication must remain required');
check(research.policy?.symbol_collision_requires_disambiguation === true, 'symbol collisions must require disambiguation');
check(Array.isArray(research.records) && research.records.length === 5, 'research must contain five records');
check(Array.isArray(candidates) && candidates.length === 5, 'candidate intake must contain five records');

const expected = new Map(candidates.map((row) => [row.candidate_id, row]));
const seenCandidates = new Set();
const seenRecords = new Set();
const seenSlugs = new Set();
for (const record of research.records ?? []) {
  const candidate = expected.get(record.candidate_id);
  check(Boolean(candidate), `unexpected candidate_id: ${record.candidate_id}`);
  if (candidate) {
    check(candidate.proposed_record_id === record.proposed_record_id, `record id mismatch: ${record.candidate_id}`);
    check(candidate.slug === record.slug, `slug mismatch: ${record.candidate_id}`);
    check(candidate.name === record.name, `name mismatch: ${record.candidate_id}`);
    check(candidate.symbol === record.symbol, `symbol mismatch: ${record.candidate_id}`);
    check(candidate.status === 'accepted', `candidate must remain accepted: ${record.candidate_id}`);
    check(candidate.target_batch === 'batch_017', `candidate target batch mismatch: ${record.candidate_id}`);
  }
  check(!seenCandidates.has(record.candidate_id), `duplicate candidate id: ${record.candidate_id}`);
  check(!seenRecords.has(record.proposed_record_id), `duplicate proposed record id: ${record.proposed_record_id}`);
  check(!seenSlugs.has(record.slug), `duplicate slug: ${record.slug}`);
  seenCandidates.add(record.candidate_id);
  seenRecords.add(record.proposed_record_id);
  seenSlugs.add(record.slug);
  check(['active', 'limited'].includes(record.proposed_status), `invalid proposed status: ${record.candidate_id}`);
  check(['day','month','year','unresolved'].includes(record.launch_precision), `invalid launch precision: ${record.candidate_id}`);
  if (record.launch_date !== null) check(/^\d{4}-\d{2}-\d{2}$/.test(record.launch_date), `invalid launch date: ${record.candidate_id}`);
  if (record.launch_precision === 'unresolved') check(record.launch_date === null, `unresolved launch must remain null: ${record.candidate_id}`);
  check(Array.isArray(record.primary_sources) && record.primary_sources.length >= 3, `insufficient source leads: ${record.candidate_id}`);
  for (const url of record.primary_sources ?? []) check(/^https:\/\//.test(url), `source must use https: ${record.candidate_id}`);
  check(Array.isArray(record.blocking_unknowns) && record.blocking_unknowns.length === 5, `exactly five blocking unknowns required: ${record.candidate_id}`);
  check(record.promotion_readiness === 'accepted', `promotion readiness must be accepted: ${record.candidate_id}`);
}
for (const id of expected.keys()) check(seenCandidates.has(id), `candidate missing from research: ${id}`);

const usat = candidates.find((row) => row.proposed_record_id === 'sog_st_usat');
check(usat?.proposed_record_id !== 'sog_st_usdt', 'USA₮ must not reuse the USD₮ record id');
check(usat?.slug !== 'usdt', 'USA₮ must not reuse the USD₮ slug');

const noble = candidates.find((row) => row.proposed_record_id === 'sog_st_nobleusdn');
check(noble?.slug === 'noble-usdn', 'Noble Dollar must use a disambiguated slug');
check(noble?.proposed_record_id !== 'sog_st_usdn', 'Noble Dollar must not reuse the Neutrino USD record id');

const usdh = research.records?.find((row) => row.proposed_record_id === 'sog_st_usdh');
check(usdh?.proposed_status === 'limited', 'USDH must preserve the migration-period limited proposal');
check(usdh?.launch_date === null, 'USDH launch date must remain unresolved until verified');

const aeCoin = research.records?.find((row) => row.proposed_record_id === 'sog_st_aecoin');
check(aeCoin?.launch_date === null, 'AE Coin launch date must remain unresolved until verified');
check(/agents/.test(aeCoin?.identity_decision ?? ''), 'AE Coin issuer and agent roles must remain separated');

if (errors.length) {
  for (const error of errors) console.error(`Batch 17 research: ${error}`);
  process.exitCode = 1;
} else {
  console.log('Batch 17 research contract valid: 5 accepted candidates, zero canonical promotions');
}
