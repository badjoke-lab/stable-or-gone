import fs from 'node:fs';

const write = (file, value) => fs.writeFileSync(file, value.endsWith('\n') ? value : `${value}\n`);
const read = (file) => fs.readFileSync(file, 'utf8');
const replaceRequired = (body, from, to, file) => {
  if (!body.includes(from)) throw new Error(`${file}: replacement anchor not found`);
  return body.replace(from, to);
};

write('AGENTS.md', `# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## 1. Required reading order

Before changing code, canonical data, workflows, monitoring, or documentation, read in this order:

1. \`AGENTS.md\`
2. \`docs/spec-governance.md\`
3. \`docs/roadmap.md\`
4. \`docs/deployment-policy.md\`
5. \`docs/post-351-data-growth-operating-spec.md\`
6. every active roadmap amendment named by the roadmap
7. the canonical specification for the active work item
8. every named baseline, queue, validator, audit, fixture, research checkpoint, release note, or prior output required by that work item

Current active amendment:

\`\`\`text
docs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md
\`\`\`

Current operating specification:

\`\`\`text
docs/post-351-data-growth-operating-spec.md
\`\`\`

Current work-item specification:

\`\`\`text
docs/quality/record-depth-rebaseline-pr362-spec.md
\`\`\`

Current required prior outputs:

\`\`\`text
docs/migration/post-pr360-review-gate-2026-07-14.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/current-canonical-checkpoint.json
docs/migration/current-stats-history-checkpoint.json
\`\`\`

## 2. Repository source of truth

Merged repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, stale roadmap text, unmerged drafts, and mock images.

PR numbering, active workstream state, and next approved work come from \`docs/roadmap.md\` plus the active amendment named there.

Do not infer the schedule from historical documents.

## 3. Current workstream

\`\`\`text
Canonical stable assets: 112
PR #360 Evidence and Correction Batch: complete
post-PR #360 review gate: complete
PR #361 post-PR #360 review gate and authority reset: active
PR #362 112-asset Record Depth Rebaseline: next
\`\`\`

Approved bounded sequence:

\`\`\`text
PR #361  post-PR #360 review gate and authority reset
PR #362  112-asset Record Depth Rebaseline
PR #363  Tier A Dossier Deepening — Batch 4
PR #364  Market Access Pilot 3
PR #365  Evidence and Correction Batch 2
REVIEW GATE
\`\`\`

Do not skip ahead unless \`docs/roadmap.md\` is deliberately amended.

No PR number after the next review gate is pre-authorized.

## 4. Review-gate decision

The binding review checkpoint is:

\`\`\`text
docs/migration/post-pr360-review-gate-2026-07-14.json
\`\`\`

The next sequence prioritizes measurement, dossier depth, bounded Market Access utility, and Evidence maintenance.

Immediate asset growth and public-surface expansion are not authorized.

## 5. Operating mode

Default work belongs to reviewed data depth, canonical Market Access promotion, monitoring review without automatic promotion, corrections and Evidence maintenance, and monthly maintenance.

A new public page, explorer, dashboard, ranking surface, or navigation family requires a separate roadmap amendment and canonical specification.

Small correctness, accessibility, readability, broken-link, and maintenance fixes remain allowed.

## 6. Mandatory PR traceability

Every post-351 non-trivial PR must cite:

\`\`\`text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
active roadmap amendment
work-item-specific specification
named baseline, queue, audit, research checkpoint, or reviewed prior output
\`\`\`

The PR body must identify specification references, roadmap item, scope, explicit non-goals, named inputs and prior outputs, data preservation, validation, and deployment classification.

A PR that cannot identify its roadmap item and governing specification must pause.

## 7. PR #362 boundary

PR #362 remeasures all 112 canonical assets across the existing 16 Record Depth dimensions.

It must produce an internal reviewed summary, a delta against immutable PR #353, and a deterministic non-ranking candidate queue.

It must not write canonical data, rewrite historical checkpoints, publish planning rows, alter Compare or Facet Freshness semantics, add a public surface, rank assets, create a composite score, or make an investment recommendation.

## 8. Preserved safety boundaries

All work preserves canonical-only public release claims, candidate/private/monitoring separation, explicit unknowns, source identity, historical checkpoint immutability, statistics history immutability, no automatic monitoring promotion, no asset ranking, no composite risk or safety score, and no investment recommendation.
`);

write('docs/spec-governance.md', `# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-14

## 1. Purpose

This file defines repository authority, conflict resolution, change control, PR traceability, data-preservation boundaries, monitoring safety, product-surface control, and post-351 operating governance.

Merged repository specifications are the source of truth.

## 2. Authority order

When documents disagree, use this order:

1. \`docs/deployment-policy.md\` for publication and Cloudflare rules.
2. \`docs/spec-governance.md\` for document authority and change control.
3. \`docs/roadmap.md\` for current phase, active item, next item, and PR numbering.
4. Active merged roadmap amendments named by the roadmap.
5. Canonical operating specification for the active program.
6. Work-item-specific canonical specification.
7. Named audits, inventories, baselines, fixtures, release notes, research checkpoints, queues, and reviewed prior outputs.
8. Conversation history and unmerged drafts.

Current active amendment:

\`\`\`text
docs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md
\`\`\`

Current operating specification:

\`\`\`text
docs/post-351-data-growth-operating-spec.md
\`\`\`

Current work-item specification:

\`\`\`text
docs/quality/record-depth-rebaseline-pr362-spec.md
\`\`\`

Current required prior output:

\`\`\`text
docs/migration/post-pr360-review-gate-2026-07-14.json
\`\`\`

Historical amendments and checkpoints remain historical and do not override the current position.

## 3. Mandatory reading order

Before changing code, data, workflows, or documentation, read \`AGENTS.md\`, this file, \`docs/roadmap.md\`, \`docs/deployment-policy.md\`, the post-351 operating specification, the active amendment, the current work-item specification, and all named inputs.

A non-trivial PR is not ready until the exact roadmap item and governing specification are identified.

## 4. Current execution state

\`\`\`text
Canonical stable assets: 112
PR #360 Evidence and Correction Batch: complete
post-PR #360 review gate: complete
PR #361 post-PR #360 review gate and authority reset: active
PR #362 112-asset Record Depth Rebaseline: next
\`\`\`

Approved bounded sequence:

\`\`\`text
PR #361  post-PR #360 review gate and authority reset
PR #362  112-asset Record Depth Rebaseline
PR #363  Tier A Dossier Deepening — Batch 4
PR #364  Market Access Pilot 3
PR #365  Evidence and Correction Batch 2
REVIEW GATE
\`\`\`

No sequence beyond the next review gate is pre-authorized.

## 5. Review-gate authority

The binding decision checkpoint is \`docs/migration/post-pr360-review-gate-2026-07-14.json\`.

It authorizes measurement, dossier depth, bounded Market Access expansion, and Evidence maintenance. It does not authorize immediate asset growth or a new public surface.

## 6. Governing specification families

Repository and deployment:

\`\`\`text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
\`\`\`

Current post-review-gate sequence:

\`\`\`text
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md
docs/migration/post-pr360-review-gate-2026-07-14.json
docs/quality/record-depth-rebaseline-pr362-spec.md
config/record-depth-rebaseline-pr362.json
\`\`\`

Historical PR #353 Record Depth foundation remains immutable:

\`\`\`text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
\`\`\`

Completed public-surface semantics remain governed by merged specifications and validators for statistics and immutable history, Comparison Readiness, Facet Freshness, Market Access, Compare, Access & Regulation, Change Timeline, Update Feed, and Maintenance Log.

Monitoring remains read-only and review-only with respect to canonical data.

## 7. Change control

A specification update is required for any change to canonical enum meaning, evidence interpretation, source identity, unknown-state semantics, route or machine-output shape, count or denominator semantics, build provenance, checkpoint digest boundaries, monitoring semantics, statistics semantics, Comparison Readiness, Facet Freshness, Record Depth planning semantics, Market Access semantics, Timeline dates, Update Feed publication dates, Maintenance Log safety, production gates, approved PR sequence, active workstream, or product-surface freeze.

No implementation PR may introduce an undocumented alternative.

## 8. Pull-request traceability

Every non-trivial PR body must identify specification references, roadmap item, scope, explicit non-goals, named inputs, data preservation, validation, and deployment classification.

## 9. Data preservation

Historical canonical checkpoints, statistics history, Record Depth baselines, monitoring snapshots, completed handoffs, release integrity baselines, and public semantic contracts are immutable unless a new specification explicitly defines a forward migration. Corrections append a new reviewed state; they do not silently rewrite history.

## 10. Product and scoring boundary

The default operating mode is data depth and maintenance. No new public page, explorer, dashboard, ranking surface, or navigation family is allowed without a separate reviewed amendment and specification.

Record Depth is planning coverage only. It must not become a risk score, safety score, quality ranking, transparency ranking, numeric composite score, asset rank, investment recommendation, or public leaderboard.
`);

write('docs/roadmap.md', `# Stable or Gone Roadmap

Updated: 2026-07-14  
Status: canonical execution schedule — active

## 1. Current position

\`\`\`text
Canonical stable assets: 112
PR #351 Monthly Maintenance Log: complete
PR #352 post-351 authority reset: complete
PR #353 Record Depth & Coverage Baseline: complete
PR #354 Tier A Dossier Deepening — Batch 1: complete
PR #355 Tier A Dossier Deepening — Batch 2: complete
PR #356 Market Access Pilot 1: complete
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: complete
PR #359 Market Access Pilot 2: complete
PR #360 Evidence and Correction Batch: complete
post-PR #360 review gate: complete
PR #361 post-PR #360 review gate and authority reset: active
PR #362 112-asset Record Depth Rebaseline: next
\`\`\`

The public-surface expansion sequence is complete. The current operating mode is reviewed data depth, bounded Market Access promotion, monitoring review without automatic promotion, corrections and Evidence maintenance, and monthly maintenance.

## 2. Current authority

Read in this order:

\`\`\`text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md
docs/migration/post-pr360-review-gate-2026-07-14.json
docs/quality/record-depth-rebaseline-pr362-spec.md
config/record-depth-rebaseline-pr362.json
named validators, audits, baselines, queues, and current work-item outputs
\`\`\`

Earlier amendments remain historical records and do not override this current position.

## 3. Review-gate findings

The completed review gate established:

- the immutable PR #353 baseline covers 110 assets while the registry now contains 112;
- 15 of 18 original Tier A candidates were reviewed, with 13 bounded improvements and two no-safe-change outcomes;
- Compare improvement has not been remeasured after the dossier sequence;
- Timeline contains 187 fully typed events but lacks a reviewed density delta;
- eight Market Access records prove the schema and manual-review flow but cover only two assets and one jurisdiction/platform context;
- 170 of 557 Evidence records still have no archive recorded;
- no repository-authoritative usage or referral evidence supports a new public surface.

Binding checkpoint:

\`\`\`text
docs/migration/post-pr360-review-gate-2026-07-14.json
\`\`\`

## 4. Approved bounded sequence

\`\`\`text
PR #361  post-PR #360 review gate and authority reset
PR #362  112-asset Record Depth Rebaseline
PR #363  Tier A Dossier Deepening — Batch 4
PR #364  Market Access Pilot 3
PR #365  Evidence and Correction Batch 2
REVIEW GATE
\`\`\`

No PR number after the next review gate is pre-authorized.

Immediate asset growth and public-surface expansion are not authorized in this sequence.

## 5. PR #361 — active

PR #361 records the review-gate decision, synchronizes repository authority, adds the PR #362 specification and configuration, and updates active-workstream validation.

It changes no canonical data, Market Access Record, public route, machine-readable output, monitoring snapshot, or statistics checkpoint.

## 6. PR #362 — next

PR #362 remeasures all 112 canonical assets across the existing 16 Record Depth dimensions and produces:

\`\`\`text
docs/migration/record-depth-rebaseline-pr362-summary.json
docs/migration/record-depth-rebaseline-pr362-delta.json
docs/migration/tier-a-candidate-queue-pr362.json
\`\`\`

The outputs are internal, deterministic, non-ranking, and non-canonical. PR #353 remains immutable.

## 7. Later authorized items

PR #363 may deepen at most five existing assets selected from the reviewed PR #362 queue.

PR #364 may promote only a bounded, manually reviewed Market Access scope with explicit jurisdiction, platform/service, asset, function, date, evidence, and row limits.

PR #365 may apply only bounded, manually reviewed Evidence and correction changes from a deterministic internal queue.

## 8. Preserved boundaries

All work preserves canonical-only public output, candidate/private/monitoring separation, unknown-state semantics, historical checkpoint immutability, statistics history immutability, no automatic monitoring promotion, no asset ranking, no composite risk or safety score, no investment recommendation, and no public-surface expansion without a separate amendment.
`);

let readme = read('README.md');
readme = replaceRequired(readme, `PR #360 Evidence and Correction Batch: active\npost-PR #360 review gate: next`, `PR #360 Evidence and Correction Batch: complete\npost-PR #360 review gate: complete\nPR #361 post-PR #360 review gate and authority reset: active\nPR #362 112-asset Record Depth Rebaseline: next`, 'README.md');
readme = replaceRequired(readme, `PR #360  Evidence and Correction Batch\nREVIEW GATE`, `PR #360  Evidence and Correction Batch — complete\nREVIEW GATE — complete\nPR #361  post-PR #360 review gate and authority reset\nPR #362  112-asset Record Depth Rebaseline\nPR #363  Tier A Dossier Deepening — Batch 4\nPR #364  Market Access Pilot 3\nPR #365  Evidence and Correction Batch 2\nREVIEW GATE`, 'README.md');
readme = replaceRequired(readme, `docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json\n\`\`\``, `docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json\ndocs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md\ndocs/migration/post-pr360-review-gate-2026-07-14.json\ndocs/quality/record-depth-rebaseline-pr362-spec.md\nconfig/record-depth-rebaseline-pr362.json\n\`\`\``, 'README.md');
readme = replaceRequired(readme, `PR #358 has promoted complete reviewed records for StraitsX USD (XUSD) and Blast USDB on its branch. The current branch checkpoint contains 112 canonical assets, 557 Evidence records, 174 deployments, full v2/v3 coverage, and four preserved Market Access Records. Merge remains blocked until deterministic statistics history and all release/CI contracts are green.`, `PR #358 promoted complete reviewed records for StraitsX USD (XUSD) and Blast USDB. The merged checkpoint contains 112 canonical assets, 557 Evidence records, 174 deployments, full v2/v3 coverage, and four preserved Market Access Records.`, 'README.md');
readme = replaceRequired(readme, `PR #359 promotes exactly four provider-scoped RLUSD Market Access records for Japan / SBI VC Trade / VCTRADE. Existing canonical Evidence identities are reused and expanded; no duplicate Evidence identity or new public product surface is allowed.`, `PR #359 promoted exactly four provider-scoped RLUSD Market Access records for Japan / SBI VC Trade / VCTRADE. Existing canonical Evidence identities were reused, Market Access increased from four to eight records, and no public product surface was added.`, 'README.md');
readme = replaceRequired(readme, `## Active PR #360 Evidence and Correction Batch\n\nPR #360 is a bounded quality-maintenance batch for broken links, archives, source identities, Evidence Relations, wording, dates, organization relationships, and known unknowns. It adds no asset or public product surface.`, `## Completed PR #360 Evidence and Correction Batch\n\nPR #360 added or replaced seven verified dated archives, removed one unverified wildcard archive, preserved 112 assets and 557 Evidence identities, and reduced the no-archive queue from 177 to 170.\n\n## Active PR #361 review gate authority reset\n\nPR #361 records the completed review gate and authorizes PR #362 as the next implementation item. It changes no canonical data or public surface.`, 'README.md');
readme = replaceRequired(readme, `PR #353 evaluated all 110 canonical assets across 16 planning dimensions and committed an immutable reviewed summary and 18-asset non-ranking Tier A queue.\n\nPR #354 and PR #355 completed two reviewed five-asset dossier batches. PR #356 uses the merged PR #355 handoff and the reviewed Japan research checkpoint for a bounded Market Access pilot.`, `PR #353 evaluated 110 canonical assets across 16 planning dimensions and remains an immutable historical baseline.\n\nPR #354, PR #355, and PR #357 reviewed 15 of the original 18 Tier A candidates. PR #362 will remeasure all 112 current assets and produce a new internal non-ranking queue without rewriting PR #353.`, 'README.md');
readme = readme.replace(/## PR #360 active authority[\s\S]*$/, `## PR #361 active authority\n\nCurrent work item:\n\n\`\`\`text\nPR #360 Evidence and Correction Batch: complete\npost-PR #360 review gate: complete\nPR #361 post-PR #360 review gate and authority reset: active\nPR #362 112-asset Record Depth Rebaseline: next\n\`\`\`\n\nBinding references:\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md\ndocs/migration/post-pr360-review-gate-2026-07-14.json\ndocs/quality/record-depth-rebaseline-pr362-spec.md\nconfig/record-depth-rebaseline-pr362.json\ndocs/migration/current-canonical-checkpoint.json\ndocs/migration/current-stats-history-checkpoint.json\n\`\`\`\n\nReview-gate decision:\n\n\`\`\`text\nmeasure the current 112-asset registry first\nprioritize dossier depth and bounded Market Access utility\ncontinue Evidence maintenance\ndo not authorize immediate asset growth\ndo not authorize a new public surface\n\`\`\`\n\nPR #361 changes authority documents and validation only. PR #362 is the next data-planning implementation item.\n`);
write('README.md', readme);

write('scripts/check-workstream-120.mjs', `import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), \`${file}: missing ${text}\`);

const reviewGate = readJson('docs/migration/post-pr360-review-gate-2026-07-14.json');
const config = readJson('config/record-depth-rebaseline-pr362.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const historyCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const spec = read('docs/quality/record-depth-rebaseline-pr362-spec.md');
const amendment = read('docs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md');

for (const file of ['README.md','AGENTS.md','docs/spec-governance.md','docs/roadmap.md']) {
  const body = read(file);
  for (const marker of [
    'Canonical stable assets: 112',
    'PR #360 Evidence and Correction Batch: complete',
    'post-PR #360 review gate: complete',
    'PR #361 post-PR #360 review gate and authority reset: active',
    'PR #362 112-asset Record Depth Rebaseline: next',
    'docs/roadmap-amendments/2026-07-14-post-pr360-review-gate.md',
    'docs/migration/post-pr360-review-gate-2026-07-14.json',
    'docs/quality/record-depth-rebaseline-pr362-spec.md',
    'config/record-depth-rebaseline-pr362.json'
  ]) requireText(body, marker, file);
}

expect(reviewGate.status === 'reviewed_internal_governance_checkpoint', 'review gate status mismatch');
expect(reviewGate.source_commit === '0bdda598b596b406ae8a01827072f5b8c253b23e', 'review gate source commit mismatch');
expect(reviewGate.current_checkpoint?.assets === 112, 'review gate asset count mismatch');
expect(reviewGate.current_checkpoint?.evidence === 557, 'review gate Evidence count mismatch');
expect(reviewGate.current_checkpoint?.market_access_records === 8, 'review gate Market Access count mismatch');
expect(reviewGate.current_checkpoint?.archive_not_recorded === 170, 'review gate archive queue mismatch');
expect(reviewGate.decision?.asset_growth_in_next_sequence === false, 'review gate must not authorize immediate asset growth');
expect(reviewGate.decision?.public_surface_expansion_in_next_sequence === false, 'review gate must not authorize public-surface expansion');
expect(reviewGate.decision?.approved_sequence?.[0]?.pr === 361, 'approved sequence must begin with PR #361');
expect(reviewGate.decision?.approved_sequence?.[1]?.pr === 362, 'PR #362 must follow PR #361');
expect(reviewGate.decision?.approved_sequence?.[4]?.pr === 365, 'approved sequence must end implementation at PR #365');

expect(config.status === 'review_gate_authorized_internal_rebaseline', 'PR #362 config status mismatch');
expect(config.canonical_asset_count === 112, 'PR #362 asset count mismatch');
expect(config.dimension_count === 16, 'PR #362 dimension count mismatch');
expect(config.planning_states?.length === 6, 'PR #362 planning state count mismatch');
expect(config.required_outputs?.length === 3, 'PR #362 required output count mismatch');
for (const boundary of ['canonical_write_allowed','market_access_write_allowed','monitoring_auto_promotion_allowed','editorial_research_auto_promotion_allowed','public_output_allowed','new_public_surface_allowed','historical_checkpoint_rewrite_allowed','comparison_readiness_semantics_change_allowed','facet_freshness_semantics_change_allowed','asset_rank','single_composite_score','investment_recommendation']) {
  expect(config.boundaries?.[boundary] === false, \`PR #362 boundary changed: ${boundary}\`);
}
expect(config.next_work_item === 'PR #363 Tier A Dossier Deepening — Batch 4', 'PR #362 next work item mismatch');

expect(checkpoint.checkpoint_id === 'sog_evidence_correction_batch_canonical_112_checkpoint_pr360_2026_07_14', 'current canonical checkpoint changed during authority reset');
expect(checkpoint.asset_count === 112, 'current asset count changed during authority reset');
expect(historyCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'history checkpoint binding mismatch');

for (const marker of ['exactly 112 canonical assets','exactly 16 dimensions','cell count is exactly 1,792','PR #353 files are byte-preserved','internal outputs do not appear']) requireText(spec, marker, 'PR #362 specification');
requireText(amendment, 'PR #361 post-PR #360 review gate and authority reset: active', 'review-gate amendment');
requireText(amendment, 'PR #362 112-asset Record Depth Rebaseline: next', 'review-gate amendment');

if (failures.length) {
  console.error('Post-PR #360 review-gate authority validation failed:');
  failures.forEach((failure) => console.error(\`- ${failure}\`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  active_workstream: 'pr361_post_pr360_review_gate_authority_reset',
  next_workstream: 'pr362_record_depth_rebaseline',
  assets: checkpoint.asset_count,
  evidence: reviewGate.current_checkpoint.evidence,
  market_access_records: reviewGate.current_checkpoint.market_access_records,
  archive_not_recorded: reviewGate.current_checkpoint.archive_not_recorded,
  approved_sequence: reviewGate.decision.approved_sequence
}, null, 2));
`);

let nonUi = read('scripts/validate-non-ui-release-material.mjs');
nonUi = replaceRequired(nonUi, `'PR #360 Evidence and Correction Batch: active',\n  'post-PR #360 review gate: next',`, `'PR #360 Evidence and Correction Batch: complete',\n  'post-PR #360 review gate: complete',\n  'PR #361 post-PR #360 review gate and authority reset: active',\n  'PR #362 112-asset Record Depth Rebaseline: next',`, 'scripts/validate-non-ui-release-material.mjs');
nonUi = replaceRequired(nonUi, `'PR #360 Evidence and Correction Batch: active',\n  'post-PR #360 review gate: next',\n  '112 stable assets',`, `'PR #360 Evidence and Correction Batch: complete',\n  'post-PR #360 review gate: complete',\n  'PR #361 post-PR #360 review gate and authority reset: active',\n  'PR #362 112-asset Record Depth Rebaseline: next',\n  '112 stable assets',`, 'scripts/validate-non-ui-release-material.mjs');
nonUi = replaceRequired(nonUi, `active_workstream: 'pr360_evidence_correction_batch',\n  next_workstream: 'post_pr360_review_gate'`, `active_workstream: 'pr361_post_pr360_review_gate_authority_reset',\n  next_workstream: 'pr362_record_depth_rebaseline'`, 'scripts/validate-non-ui-release-material.mjs');
write('scripts/validate-non-ui-release-material.mjs', nonUi);

console.log(JSON.stringify({
  ok: true,
  updated: [
    'README.md',
    'AGENTS.md',
    'docs/spec-governance.md',
    'docs/roadmap.md',
    'scripts/check-workstream-120.mjs',
    'scripts/validate-non-ui-release-material.mjs'
  ]
}, null, 2));
