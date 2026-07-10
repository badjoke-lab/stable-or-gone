import fs from 'node:fs';

const readText = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing required text: ${text}`);
const rejectText = (body, text, file) => expect(!body.includes(text), `${file}: stale or forbidden text remains: ${text}`);

const files = {
  readme: 'README.md',
  agents: 'AGENTS.md',
  governance: 'docs/spec-governance.md',
  roadmap: 'docs/roadmap.md',
  operatingSpec: 'docs/post-351-data-growth-operating-spec.md',
  activeAmendment: 'docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md',
  baselineSpec: 'docs/quality/record-depth-coverage-baseline-spec.md'
};

for (const [name, file] of Object.entries(files)) {
  expect(fs.existsSync(file), `${name}: required authority file missing: ${file}`);
}

const readme = readText(files.readme);
const agents = readText(files.agents);
const governance = readText(files.governance);
const roadmap = readText(files.roadmap);
const operatingSpec = readText(files.operatingSpec);
const amendment = readText(files.activeAmendment);
const baselineSpec = readText(files.baselineSpec);

for (const [file, body] of [
  [files.readme, readme],
  [files.agents, agents],
  [files.governance, governance],
  [files.roadmap, roadmap]
]) {
  requireText(body, 'Canonical stable assets: 110', file);
  requireText(body, 'PR #351 Monthly Maintenance Log: complete', file);
  requireText(body, 'PR #352 post-351 authority reset: active', file);
  requireText(body, 'PR #353 Record Depth & Coverage Baseline: next', file);
  requireText(body, 'docs/post-351-data-growth-operating-spec.md', file);
  requireText(body, 'docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md', file);
}

for (const [file, body] of [
  [files.agents, agents],
  [files.governance, governance],
  [files.roadmap, roadmap],
  [files.operatingSpec, operatingSpec],
  [files.activeAmendment, amendment]
]) {
  requireText(body, 'PR #360  Evidence and Correction Batch', file);
  requireText(body, 'REVIEW GATE', file);
}

requireText(operatingSpec, 'Product-surface freeze', files.operatingSpec);
requireText(operatingSpec, 'Data depth and record growth', files.operatingSpec);
requireText(operatingSpec, 'Canonical Market Access promotion', files.operatingSpec);
requireText(operatingSpec, 'Monitoring review', files.operatingSpec);
requireText(operatingSpec, 'Corrections and evidence maintenance', files.operatingSpec);
requireText(operatingSpec, 'Monthly maintenance', files.operatingSpec);
requireText(operatingSpec, 'Every post-351 non-trivial PR must cite:', files.operatingSpec);

requireText(amendment, 'current public-surface expansion sequence: complete', files.activeAmendment);
requireText(amendment, 'No later PR number is pre-authorized by this amendment.', files.activeAmendment);
requireText(amendment, 'Mandatory reference rule', files.activeAmendment);

requireText(baselineSpec, 'exactly 110 canonical assets are evaluated', files.baselineSpec);
requireText(baselineSpec, 'The baseline is an internal planning instrument.', files.baselineSpec);
requireText(baselineSpec, 'no numeric composite score is emitted', files.baselineSpec);
requireText(baselineSpec, 'no asset rank is emitted', files.baselineSpec);
requireText(baselineSpec, 'After PR #353 merges, PR #354 selects the first Tier A dossier batch', files.baselineSpec);

for (const [file, body] of [
  [files.readme, readme],
  [files.agents, agents],
  [files.governance, governance],
  [files.roadmap, roadmap]
]) {
  rejectText(body, 'Active: PR #324 bounded scheduled read-only monitoring', file);
  rejectText(body, 'Active workstream: statistics implementation', file);
  rejectText(body, 'Current item: PR #326 immutable checkpoint history', file);
  rejectText(body, 'PR #349+      optional natural-language filter translation', file);
}

expect(roadmap.includes('No PR number after the review gate is pre-authorized'), 'roadmap must stop authorization at the review gate');
expect(governance.includes('A PR that cannot cite an approved work item must pause'), 'governance must require roadmap/spec traceability');
expect(agents.includes('A PR that cannot identify its roadmap item and governing specification must pause.'), 'AGENTS must enforce pre-implementation authority check');
expect(readme.includes('A new public page, explorer, dashboard, ranking surface, or navigation family requires a separate reviewed roadmap amendment and canonical specification.'), 'README must expose the product-surface freeze boundary');

if (failures.length) {
  console.error('PR #352 post-351 authority reset validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  active_pr: 352,
  next_pr: 353,
  sequence_end_pr: 360,
  review_gate_required: true,
  product_surface_default: 'frozen_pending_separate_roadmap_approval',
  operating_mode: [
    'reviewed_data_growth',
    'canonical_market_access_promotion',
    'monitoring_review',
    'corrections_and_evidence_maintenance',
    'monthly_maintenance'
  ],
  authority_files: Object.values(files)
}, null, 2));
