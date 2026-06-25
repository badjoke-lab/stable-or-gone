import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const fail = (message) => { throw new Error(`Batch 16 full-layer draft: ${message}`); };

const research = read('data/candidate-research-batch-16.json');
const draft = read('data/batch-16-full-layer-draft.json');

const expectedCandidates = [
  'sog_cand_000083',
  'sog_cand_000084',
  'sog_cand_000085',
  'sog_cand_000086',
  'sog_cand_000087'
];
const expectedRecordIds = [
  'sog_st_unitedu',
  'sog_st_usdgo',
  'sog_st_sofiusd',
  'sog_st_solsticeusx',
  'sog_st_ousd'
];

if (draft.schema_version !== '1.0') fail('unexpected schema version');
if (draft.batch_id !== 'batch_016') fail('unexpected batch id');
if (draft.status !== 'full_layer_draft') fail('draft status must remain full_layer_draft');
if (draft.canonical_write_allowed !== false) fail('canonical writes must remain disabled');
if (draft.source_research !== 'data/candidate-research-batch-16.json') fail('research source mismatch');
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
  for (const key of ['candidate_id', 'id', 'slug', 'name', 'symbol', 'status', 'launch_date', 'issuer_id', 'summary', 'identity_notes']) {
    if (typeof row[key] !== 'string' || row[key].trim() === '') fail(`${row.id ?? row.candidate_id}: missing ${key}`);
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

const usdgo = draft.records.find((row) => row.id === 'sog_st_usdgo');
if (!usdgo.organizations.some((org) => org.id === 'sog_issuer_anchorage_digital_bank' && org.role === 'legal_issuer')) fail('USDGO legal issuer boundary missing');
if (!usdgo.organizations.some((org) => org.id === 'sog_org_osl_group' && org.role === 'brand_owner')) fail('USDGO OSL role boundary missing');

const solstice = draft.records.find((row) => row.id === 'sog_st_solsticeusx');
if (!/dForce USX/.test(solstice.identity_notes)) fail('Solstice USX collision boundary missing');

const sofi = draft.records.find((row) => row.id === 'sog_st_sofiusd');
if (!/tokenized deposits/.test(sofi.identity_notes)) fail('SoFi tokenized-deposit boundary missing');

const ousd = draft.records.find((row) => row.id === 'sog_st_ousd');
if (ousd.income_profile.availability !== 'native' || ousd.income_profile.accrual !== 'rebasing_balance') fail('OUSD native rebase income boundary missing');

if (draft.target.canonical_assets_before !== 82 || draft.target.canonical_assets_after !== 87) fail('canonical count target mismatch');
if (draft.target.pending_before !== 5 || draft.target.pending_after !== 0) fail('pending-candidate target mismatch');
if (draft.review_gate?.canonical_promotion_requires_separate_pr !== true) fail('separate canonical promotion gate missing');

console.log('Batch 16 full-layer draft validation passed.');
