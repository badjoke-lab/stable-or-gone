import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { loadOfficialSources, observeOfficialSources } from './monitoring/monitors/official-source-observer.mjs';
import { runMonitoring } from './monitoring/run.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const allSources = loadOfficialSources(root);
const currentBaselineSet = loadOfficialSourceBaselines(root);
const historicalFixtureIds = [
  'tether-transparency',
  'circle-transparency',
  'paxos-pyusd-transparency',
  'ethena-custodian-attestations'
];
const sources = allSources.filter((row) => historicalFixtureIds.includes(row.source_id));
const pendingBaselineSet = {
  ...structuredClone(currentBaselineSet),
  baselines: currentBaselineSet.baselines.filter((row) => historicalFixtureIds.includes(row.source_id))
};
if (sources.length !== 4 || pendingBaselineSet.baselines.length !== 4) fail('PR #235 historical four-source fixture is incomplete');

const initialBodies = new Map([
  ['tether-transparency', '<html><body>Reserves current balances circulation PR235_RAW_TETHER</body></html>'],
  ['circle-transparency', '<html><body>Total reserves in circulation issuance redemption monthly assurance PR235_RAW_CIRCLE</body></html>'],
  ['paxos-pyusd-transparency', '<html><body>Reserve reports portfolio composition attestation independent third-party PR235_RAW_PAXOS</body></html>'],
  ['ethena-custodian-attestations', '<html><body>Custodian attestations backing assets transparency reserve PR235_RAW_ETHENA</body></html>']
]);

function fixtureFetchFrom(bodies) {
  return async (url) => {
    const source = sources.find((item) => item.url === url);
    if (!source) throw new Error(`unexpected fixture URL: ${url}`);
    const body = bodies.get(source.source_id);
    if (!body) throw new Error(`missing fixture body: ${source.source_id}`);
    return new Response(body, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        etag: `fixture-${source.source_id}`,
        'last-modified': 'Mon, 29 Jun 2026 00:00:00 GMT'
      }
    });
  };
}

function acceptedBaselinesFrom(observationResult) {
  const observations = new Map(observationResult.observations.map((row) => [row.source_id, row]));
  return {
    ...structuredClone(pendingBaselineSet),
    updated_at: '2026-06-29T03:05:00.000Z',
    baselines: pendingBaselineSet.baselines.map((row) => {
      const observation = observations.get(row.source_id);
      return {
        ...row,
        status: 'accepted',
        accepted_final_url: observation.final_url,
        body_sha256: observation.body_sha256,
        normalized_content_sha256: observation.normalized_content_sha256,
        content_type: observation.content_type,
        etag: observation.etag,
        last_modified: observation.last_modified,
        accepted_observed_at: observation.observed_at,
        accepted_repository_commit: 'b'.repeat(40),
        accepted_review_reference: 'PR #235'
      };
    })
  };
}

try {
  const first = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T03:00:00.000Z',
    fetchImpl: fixtureFetchFrom(initialBodies),
    sources,
    baselineSet: pendingBaselineSet
  });
  if (first.observation_count !== 4 || first.candidate_count !== 4) fail('pending baseline fixture must produce four observations and four candidates');
  if (first.change_counts?.new_source !== 4) fail('pending baseline fixture must classify all sources as new_source');
  if (first.change_counts?.unchanged !== 0 || first.change_counts?.content_changed !== 0 || first.change_counts?.fetch_failed !== 0) fail('pending baseline change counts are invalid');

  const acceptedBaselineSet = acceptedBaselinesFrom(first);
  const unchanged = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T03:10:00.000Z',
    fetchImpl: fixtureFetchFrom(initialBodies),
    sources,
    baselineSet: acceptedBaselineSet
  });
  if (unchanged.observation_count !== 4 || unchanged.candidate_count !== 0) fail('identical accepted-baseline fixture must produce four observations and zero candidates');
  if (unchanged.change_counts?.unchanged !== 4) fail('identical accepted-baseline fixture must classify all sources as unchanged');

  const changedBodies = new Map(initialBodies);
  changedBodies.set('tether-transparency', '<html><body>Reserves current balances circulation. Material portfolio composition update for June 2026. PR235_CHANGED_RAW</body></html>');
  const changed = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T03:20:00.000Z',
    fetchImpl: fixtureFetchFrom(changedBodies),
    sources,
    baselineSet: acceptedBaselineSet
  });
  if (changed.candidate_count !== 1) fail(`one changed fixture must produce one candidate, found ${changed.candidate_count}`);
  if (changed.change_counts?.content_changed !== 1 || changed.change_counts?.unchanged !== 3) fail('changed fixture counts must be one content_changed and three unchanged');
  const changedCandidate = changed.candidates[0];
  if (changedCandidate?.source_id !== 'tether-transparency' || changedCandidate?.change_state !== 'content_changed') fail('changed candidate identity or state invalid');
  if (changedCandidate?.canonical_action !== 'none') fail('changed candidate canonical action must remain none');

  const noSignalBodies = new Map(initialBodies);
  noSignalBodies.set('tether-transparency', '<html><body>A completely different page without configured monitoring terms. PR235_NO_SIGNAL_RAW</body></html>');
  const changedWithoutSignal = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T03:30:00.000Z',
    fetchImpl: fixtureFetchFrom(noSignalBodies),
    sources,
    baselineSet: acceptedBaselineSet
  });
  if (changedWithoutSignal.change_counts?.content_changed !== 1) fail('no-signal changed fixture must still record content_changed');
  if (changedWithoutSignal.candidates.some((row) => row.source_id === 'tether-transparency')) fail('content change without an allowlisted signal must not create a candidate');

  const firstSource = sources[0];
  const firstBaseline = {
    ...structuredClone(acceptedBaselineSet),
    baselines: acceptedBaselineSet.baselines.filter((row) => row.source_id === firstSource.source_id)
  };
  const failed = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T03:40:00.000Z',
    sources: [firstSource],
    baselineSet: firstBaseline,
    fetchImpl: async () => { throw new Error('fixture network failure'); }
  });
  if (failed.change_counts?.fetch_failed !== 1 || failed.candidate_count !== 0) fail('fetch failure must be classified separately with zero candidates');

  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-monitoring-pr235-'));
  try {
    const run = await runMonitoring({
      outputRoot: temporaryRoot,
      runId: '20260629T035000Z-pr235',
      startedAt: '2026-06-29T03:50:00.000Z',
      sourceCommit: 'c'.repeat(40),
      sourceBranch: 'pr235-test',
      mode: 'official-sources',
      fetchImpl: fixtureFetchFrom(initialBodies),
      sources,
      baselineSet: acceptedBaselineSet
    });
    const files = fs.readdirSync(run.run_directory).sort();
    const expected = ['health.json','manifest.json','monitoring-candidates.json','official-source-observations.json','summary.md'];
    if (JSON.stringify(files) !== JSON.stringify(expected)) fail(`PR #235 output file set mismatch: ${files.join(', ')}`);
    if (run.manifest.candidate_count !== 0 || run.manifest.change_counts?.unchanged !== 4) fail('manifest must report four unchanged sources and zero candidates');
    if (!run.manifest.canonical_guard?.ok || run.manifest.canonical_guard.changed_paths.length !== 0) fail('PR #235 fixture must preserve canonical snapshot');
    const serialized = files.map((file) => fs.readFileSync(path.join(run.run_directory, file), 'utf8')).join('\n');
    for (const marker of ['PR235_RAW_TETHER','PR235_RAW_CIRCLE','PR235_RAW_PAXOS','PR235_RAW_ETHENA']) {
      if (serialized.includes(marker)) fail(`raw fixture marker leaked: ${marker}`);
    }
    const summary = fs.readFileSync(path.join(run.run_directory, 'summary.md'), 'utf8');
    if (!summary.includes('Unchanged: 4') || !summary.includes('Unchanged sources create candidates: false')) fail('summary missing unchanged-source outcome');
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const spec = fs.readFileSync(path.join(root, 'docs/quality/monitoring-change-detection-spec.md'), 'utf8');
for (const phrase of [
  'unchanged source must create zero candidates',
  'content_changed',
  'new_source',
  'fetch_failed',
  'normalized_content_sha256',
  'Monitoring remains read-only',
  'No production deployment required'
]) {
  if (!spec.includes(phrase)) fail(`PR #235 specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #235 monitoring change detection validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PR #235 change-detection contract valid on historical four-source fixture; current allowlist contains ${allSources.length} sources.`);
