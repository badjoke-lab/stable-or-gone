import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const fail = (message) => { throw new Error(`Batch 17 full-layer draft: ${message}`); };

const research = read('data/candidate-research-batch-17.json');
const draft = read('data/batch-17-full-layer-draft.json');

const expectedCandidates = [
  'sog_cand_000088',
  'sog_cand_000089',
  'sog_cand_000090',
  'sog_cand_000091',
  'sog_cand_000092'
];
const expectedRecordIds = [
  'sog_st_usat',
  'sog_st_eurau',
  'sog_st_nobleusdn',
  'sog_st_usdh',
  'sog_st_aecoin'
];

if (draft.schema_version !== '1.0') fail('unexpected schema version');
if (draft.batch_id !== 'batch_017') fail('unexpected batch id');
if (draft.status !== 'full_layer_draft') fail('draft status must remain full_layer_draft');
if (draft.canonical_write_allowed !== false) fail('canonical writes must remain disabled');
if (draft.source_research !== 'data/candidate-research-batch-17.json') fail('research source mismatch');
if (!Array.isArray(draft.records) || draft.records.length !== 5) fail('exactly five draft records are required');

const researchIds = new Set(research.records.map((row) => row.candidate_id));
const draftCandidateIds = draft.records.map((row) => row.candidate_id);
const draftRecordIds = draft.records.map((row) => row.id);

for (const id of expectedCandidates) {
  if (!researchIds.has(id)) fail(`research candidate missing: ${id}`);
  if (!draftCandidateIds.includes(id)) fail(`draft candidate missing: ${id}`);
}
for (const id of expectedRecordIds) {
  if (!draftRecordIds.includes(id)) fail(`proposed record missing: ${id}`);
}
if (new Set(draftCandidateIds).size !== draftCandidateIds.length) fail('duplicate candidate id');
if (new Set(draftRecordIds).size !== draftRecordIds.length) fail('duplicate proposed record id');

const requiredObjectLayers = [
  'classification',
  'reserve_profile',
  'redemption_profile',
  'event',
  'legal_profile',
  'income_profile'
];

for (const row of draft.records) {
  for (const key of ['candidate_id', 'id', 'slug', 'name', 'symbol', 'status', 'issuer_id', 'summary', 'identity_notes']) {
    if (typeof row[key] !== 'string' || row[key].trim() === '') fail(`${row.id ?? row.candidate_id}: missing ${key}`);
  }
  if (row.launch_date !== null && (typeof row.launch_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.launch_date))) {
    fail(`${row.id}: launch_date must be YYYY-MM-DD or null`);
  }
  for (const layer of requiredObjectLayers) {
    if (!row[layer] || typeof row[layer] !== 'object' || Array.isArray(row[layer])) fail(`${row.id}: missing ${layer}`);
  }
  if (!Array.isArray(row.organizations) || row.organizations.length === 0) fail(`${row.id}: organization draft missing`);
  if (!row.organizations.some((org) => ['legal_issuer', 'protocol_operator'].includes(org.role))) fail(`${row.id}: primary issuer/operator role missing`);
  if (!Array.isArray(row.evidence) || row.evidence.length < 3) fail(`${row.id}: at least three evidence drafts are required`);
  if (!row.evidence.every((source) => /^https:\/\//.test(source.url))) fail(`${row.id}: invalid evidence URL`);
  if (!Array.isArray(row.deployments) || row.deployments.length === 0) fail(`${row.id}: deployment draft missing`);
  if (!Array.isArray(row.known_unknowns) || row.known_unknowns.length !== 5) fail(`${row.id}: all five blocking unknowns must remain explicit`);
  if (!Array.isArray(row.classification.backing_types) || row.classification.backing_types.length === 0) fail(`${row.id}: backing classification missing`);
  if (!/^https:\/\//.test(row.reserve_profile.context_url)) fail(`${row.id}: reserve context URL missing`);
  if (!/^https:\/\//.test(row.redemption_profile.redemption_url)) fail(`${row.id}: redemption URL missing`);
}

const usat = draft.records.find((row) => row.id === 'sog_st_usat');
if (!/separate from USD₮/.test(usat.identity_notes)) fail('USA₮ and USD₮ identity boundary missing');
if (!usat.organizations.some((org) => org.id === 'sog_issuer_anchorage_digital_bank' && org.role === 'legal_issuer')) fail('USA₮ Anchorage issuer boundary missing');

const eurau = draft.records.find((row) => row.id === 'sog_st_eurau');
if (!eurau.organizations.some((org) => org.id === 'sog_issuer_allunity' && org.role === 'legal_issuer')) fail('EURAU AllUnity issuer boundary missing');

const noble = draft.records.find((row) => row.id === 'sog_st_nobleusdn');
if (!/separate from Neutrino USD/.test(noble.identity_notes)) fail('Noble USDN collision boundary missing');
if (noble.income_profile.availability !== 'native' || noble.income_profile.accrual !== 'balance_rebase') fail('Noble USDN native income boundary missing');

const usdh = draft.records.find((row) => row.id === 'sog_st_usdh');
if (usdh.status !== 'limited' || usdh.classification.lifecycle_status !== 'winding_down') fail('USDH migration lifecycle boundary missing');
if (usdh.launch_date !== null || usdh.event.event_date !== null) fail('USDH unsupported dates must remain null');

const aeCoin = draft.records.find((row) => row.id === 'sog_st_aecoin');
if (!/Appointed agents/.test(aeCoin.identity_notes)) fail('AE Coin issuer and agent boundary missing');
if (aeCoin.launch_date !== null || aeCoin.event.event_date !== null) fail('AE Coin unsupported dates must remain null');
if (!aeCoin.deployments.some((row) => row.canonicality === 'unknown' && row.contract_address === null)) fail('AE Coin unresolved deployment must remain explicit');

if (draft.target.canonical_assets_before !== 87 || draft.target.canonical_assets_after !== 92) fail('canonical count target mismatch');
if (draft.target.candidate_total !== 92) fail('candidate total mismatch');
if (draft.target.pending_before !== 5 || draft.target.pending_after !== 0) fail('pending-candidate target mismatch');
if (draft.review_gate?.canonical_promotion_requires_separate_pr !== true) fail('separate canonical promotion gate missing');
if (draft.review_gate?.unsupported_dates_must_remain_null !== true) fail('unsupported-date guard missing');

console.log('Batch 17 full-layer draft validation passed.');
