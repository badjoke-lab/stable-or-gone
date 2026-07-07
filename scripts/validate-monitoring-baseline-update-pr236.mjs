import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadOfficialSourceBaselines, validateOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import {
  prepareBaselineUpdateProposal,
  writeBaselineUpdateBundle
} from './monitoring/baselines/prepare-baseline-update.mjs';
import { loadOfficialSources } from './monitoring/monitors/official-source-observer.mjs';
import { runMonitoring } from './monitoring/run.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const sources = loadOfficialSources(root);
const currentBaselineSet = loadOfficialSourceBaselines(root);
const historicalFixtureIds = [
  'tether-transparency',
  'circle-transparency',
  'paxos-pyusd-transparency',
  'ethena-custodian-attestations'
];
const fixtureSources = sources.filter((row) => historicalFixtureIds.includes(row.source_id));
const fixtureBaselineSet = {
  ...structuredClone(currentBaselineSet),
  baselines: currentBaselineSet.baselines.filter((row) => historicalFixtureIds.includes(row.source_id))
};
const canonicalBaselinePath = path.join(root, 'scripts/monitoring/baselines/official-source-baselines.json');
const canonicalBefore = fs.readFileSync(canonicalBaselinePath, 'utf8');

if (fixtureSources.length !== 4 || fixtureBaselineSet.baselines.length !== 4) fail('PR #236 historical four-source fixture is incomplete');

function expectThrow(fn, expected, label) {
  try {
    fn();
    fail(`${label}: expected failure`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes(expected)) fail(`${label}: unexpected error: ${message}`);
  }
}

const bodies = new Map([
  ['tether-transparency', '<html><body>Reserves circulation reserve update PR236_RAW_TETHER</body></html>'],
  ['circle-transparency', '<html><body>Total reserves issuance redemption assurance PR236_RAW_CIRCLE</body></html>'],
  ['paxos-pyusd-transparency', '<html><body>Reserve report portfolio composition attestation PR236_RAW_PAXOS</body></html>'],
  ['ethena-custodian-attestations', '<html><body>Custodian attestations backing assets transparency PR236_RAW_ETHENA</body></html>']
]);

const fixtureFetch = async (url) => {
  const source = fixtureSources.find((row) => row.url === url);
  if (!source) throw new Error(`unexpected fixture URL: ${url}`);
  return new Response(bodies.get(source.source_id), {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      etag: `pr236-${source.source_id}`,
      'last-modified': 'Mon, 29 Jun 2026 04:00:00 GMT'
    }
  });
};

const monitoringRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-pr236-monitoring-'));
const bundleRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-pr236-bundle-'));
try {
  const run = await runMonitoring({
    outputRoot: monitoringRoot,
    runId: '20260629T040000Z-pr236',
    startedAt: '2026-06-29T04:00:00.000Z',
    sourceCommit: 'd'.repeat(40),
    sourceBranch: 'pr236-test',
    mode: 'official-sources',
    fetchImpl: fixtureFetch,
    sources: fixtureSources,
    baselineSet: fixtureBaselineSet
  });
  const manifest = JSON.parse(fs.readFileSync(path.join(run.run_directory, 'manifest.json'), 'utf8'));
  const observationReport = JSON.parse(fs.readFileSync(path.join(run.run_directory, 'official-source-observations.json'), 'utf8'));
  const decisionSet = {
    schema_version: '1.0',
    review_reference: 'PR #999',
    reviewer: 'fixture-human-reviewer',
    reviewed_at: '2026-06-29T04:30:00.000Z',
    decisions: [
      { source_id: 'tether-transparency', decision: 'accept', rationale: 'Reviewed as the initial official comparison point for this source.' },
      { source_id: 'circle-transparency', decision: 'accept', rationale: 'Reviewed as the initial official comparison point for this source.' },
      { source_id: 'paxos-pyusd-transparency', decision: 'hold', rationale: 'Hold until the linked period-specific assurance document is reviewed.' },
      { source_id: 'ethena-custodian-attestations', decision: 'reject', rationale: 'Reject this observation as an unsuitable initial comparison snapshot.' }
    ]
  };

  const proposal = prepareBaselineUpdateProposal({
    root,
    manifest,
    observationReport,
    decisionSet,
    sources: fixtureSources,
    baselineSet: fixtureBaselineSet
  });

  if (proposal.proposalManifest.status !== 'proposal_only') fail('proposal status must be proposal_only');
  if (proposal.proposalManifest.accepted_count !== 2 || proposal.proposalManifest.held_count !== 1 || proposal.proposalManifest.rejected_count !== 1) fail('proposal decision counts are invalid');
  if (!proposal.proposalManifest.proposal_changed) fail('two accepted decisions must change the proposal digest');
  for (const [key, expected] of Object.entries({
    repository_baseline_written: false,
    automatic_commit: false,
    automatic_pull_request: false,
    canonical_action: 'none',
    public_output: false,
    production_publication: false,
    human_review_required: true
  })) {
    if (proposal.proposalManifest[key] !== expected) fail(`proposal manifest ${key} must be ${expected}`);
  }

  const proposedById = new Map(proposal.proposedBaselineSet.baselines.map((row) => [row.source_id, row]));
  const currentById = new Map(fixtureBaselineSet.baselines.map((row) => [row.source_id, row]));
  for (const sourceId of ['tether-transparency', 'circle-transparency']) {
    const proposed = proposedById.get(sourceId);
    const observation = observationReport.observations.find((row) => row.source_id === sourceId);
    if (proposed.status !== 'accepted') fail(`${sourceId}: accepted decision did not create accepted proposal state`);
    if (proposed.body_sha256 !== observation.body_sha256 || proposed.normalized_content_sha256 !== observation.normalized_content_sha256) fail(`${sourceId}: proposal digest does not match reviewed observation`);
    if (proposed.accepted_repository_commit !== manifest.source_commit || proposed.accepted_review_reference !== decisionSet.review_reference) fail(`${sourceId}: proposal review provenance mismatch`);
  }
  for (const sourceId of ['paxos-pyusd-transparency', 'ethena-custodian-attestations']) {
    if (JSON.stringify(proposedById.get(sourceId)) !== JSON.stringify(currentById.get(sourceId))) fail(`${sourceId}: hold or reject must preserve the current baseline record exactly`);
  }

  const proposalFailures = validateOfficialSourceBaselines(proposal.proposedBaselineSet, fixtureSources);
  if (proposalFailures.length) fail(`proposed baseline failed canonical validator: ${proposalFailures.join('; ')}`);

  const targetDirectory = path.join(bundleRoot, 'proposal');
  writeBaselineUpdateBundle(targetDirectory, proposal, { root, enforceStagingPath: false });
  const files = fs.readdirSync(targetDirectory).sort();
  const expectedFiles = ['baseline-update-manifest.json','baseline-update-report.md','proposed-official-source-baselines.json'];
  if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) fail(`proposal bundle file set mismatch: ${files.join(', ')}`);
  const serialized = files.map((file) => fs.readFileSync(path.join(targetDirectory, file), 'utf8')).join('\n');
  for (const marker of ['PR236_RAW_TETHER','PR236_RAW_CIRCLE','PR236_RAW_PAXOS','PR236_RAW_ETHENA']) {
    if (serialized.includes(marker)) fail(`raw response marker leaked into proposal bundle: ${marker}`);
  }
  for (const phrase of ['Proposal only','Decision: `accept`','Decision: `hold`','Decision: `reject`','Repository baseline written: false','Automatic pull request: false','Production publication: false']) {
    if (!proposal.report.includes(phrase)) fail(`proposal report missing: ${phrase}`);
  }
  expectThrow(() => writeBaselineUpdateBundle(targetDirectory, proposal, { root, enforceStagingPath: false }), 'refusing to overwrite existing proposal file', 'existing bundle overwrite');
  expectThrow(() => writeBaselineUpdateBundle(bundleRoot, proposal, { root, enforceStagingPath: true }), 'output must be a proposal subdirectory', 'staging path boundary');

  const missingDecision = structuredClone(decisionSet);
  missingDecision.decisions.pop();
  expectThrow(
    () => prepareBaselineUpdateProposal({ root, manifest, observationReport, decisionSet: missingDecision, sources: fixtureSources, baselineSet: fixtureBaselineSet }),
    'decision source IDs must exactly match',
    'missing decision'
  );

  const duplicateDecision = structuredClone(decisionSet);
  duplicateDecision.decisions.push(structuredClone(duplicateDecision.decisions[0]));
  expectThrow(
    () => prepareBaselineUpdateProposal({ root, manifest, observationReport, decisionSet: duplicateDecision, sources: fixtureSources, baselineSet: fixtureBaselineSet }),
    'duplicate decision',
    'duplicate decision'
  );

  const badReference = structuredClone(decisionSet);
  badReference.review_reference = 'chat approval';
  expectThrow(
    () => prepareBaselineUpdateProposal({ root, manifest, observationReport, decisionSet: badReference, sources: fixtureSources, baselineSet: fixtureBaselineSet }),
    'review_reference must use PR #<number>',
    'malformed review reference'
  );

  const failedObservation = structuredClone(observationReport);
  failedObservation.observations[0].fetch_status = 'error';
  failedObservation.observations[0].baseline_comparison.state = 'fetch_failed';
  expectThrow(
    () => prepareBaselineUpdateProposal({ root, manifest, observationReport: failedObservation, decisionSet, sources: fixtureSources, baselineSet: fixtureBaselineSet }),
    'failed observation cannot be accepted',
    'accept failed observation'
  );

  const unchangedObservation = structuredClone(observationReport);
  unchangedObservation.observations[0].baseline_comparison.state = 'unchanged';
  expectThrow(
    () => prepareBaselineUpdateProposal({ root, manifest, observationReport: unchangedObservation, decisionSet, sources: fixtureSources, baselineSet: fixtureBaselineSet }),
    'only new_source or content_changed observations may be accepted',
    'accept unchanged observation'
  );

  const badManifest = structuredClone(manifest);
  badManifest.canonical_guard.ok = false;
  expectThrow(
    () => prepareBaselineUpdateProposal({ root, manifest: badManifest, observationReport, decisionSet, sources: fixtureSources, baselineSet: fixtureBaselineSet }),
    'canonical guard must pass',
    'failed canonical guard'
  );
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
} finally {
  fs.rmSync(monitoringRoot, { recursive: true, force: true });
  fs.rmSync(bundleRoot, { recursive: true, force: true });
}

const canonicalAfter = fs.readFileSync(canonicalBaselinePath, 'utf8');
if (canonicalAfter !== canonicalBefore) fail('PR #236 validation mutated the repository baseline');

const script = fs.readFileSync(path.join(root, 'scripts/monitoring/baselines/prepare-baseline-update.mjs'), 'utf8');
for (const forbidden of ['node:child_process', 'execFile', 'create_pull_request', 'wrangler', 'CLOUDFLARE_']) {
  if (script.includes(forbidden)) fail(`baseline proposal command contains prohibited capability: ${forbidden}`);
}
const workflow = fs.readFileSync(path.join(root, '.github/workflows/monitoring-review.yml'), 'utf8');
if (workflow.includes('prepare-baseline-update')) fail('monitoring workflow must not execute the baseline proposal command');
for (const forbidden of ['contents: write', 'pull-requests: write', 'schedule:', 'wrangler']) {
  if (workflow.includes(forbidden)) fail(`monitoring workflow contains prohibited token: ${forbidden}`);
}
if (!fs.readFileSync(path.join(root, '.gitignore'), 'utf8').split(/\r?\n/).includes('data-staging/monitoring-baseline-updates/')) fail('private baseline proposal directory must be ignored');

const spec = fs.readFileSync(path.join(root, 'docs/quality/monitoring-baseline-update-spec.md'), 'utf8');
for (const phrase of [
  'The flow produces a proposal bundle',
  'accept',
  'hold',
  'reject',
  'repository_baseline_written: false',
  'The proposal is not self-applying',
  'It does not modify the repository baseline',
  'No production deployment required'
]) {
  if (!spec.includes(phrase)) fail(`PR #236 specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #236 baseline update proposal validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PR #236 baseline update proposal valid: historical four-source fixture passes against the current ${sources.length}-source configuration and the repository baseline remains unchanged.`);
