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
check((master.protected_minimums?.total_candidates ?? 0) >= 80, 'candidate total must preserve at least the Batch 13 checkpoint of 80');
check((master.protected_minimums?.promoted_candidates ?? 0) >= 80, 'promoted total must preserve at least the Batch 13 checkpoint of 80');
check(master.protected_minimums?.pending_candidates === 0, 'pending total must be zero');
if ((master.protected_minimums?.total_candidates ?? 0) > 80) {
  check(master.candidate_files?.includes('data/candidate-stable-assets-emergency-msusd.json'), 'post-80 candidates must include the documented msUSD emergency intake');
  check(master.promotion_policy?.batch_014_is_emergency_incident_exception === true, 'post-80 growth must be marked as the Batch 14 emergency incident exception');
  check(master.promotion_policy?.ordinary_growth_remains_blocked === true, 'ordinary growth must remain blocked after the emergency exception');
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
console.log('Batch 13 promotion contract valid: 5 promoted candidates, 80-record checkpoint preserved, emergency exceptions explicitly gated');
