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
if (sources.length !== 4 || pendingBaselineSet.baselines.length !== 4) fail('PR #237 historical four-source fixture is incomplete');

const baseBodies = new Map([
  ['tether-transparency', '<html><body>Reserves current balances circulation PR237_RAW_TETHER</body></html>'],
  ['circle-transparency', '<html><body>Total reserves issuance redemption assurance PR237_RAW_CIRCLE</body></html>'],
  ['paxos-pyusd-transparency', '<html><body>Reserve report portfolio composition attestation PR237_RAW_PAXOS</body></html>'],
  ['ethena-custodian-attestations', '<html><body>Custodian attestations backing assets transparency PR237_RAW_ETHENA</body></html>']
]);

function fixtureFetch(bodies, metadata = new Map(), failingSourceId = null) {
  return async (url) => {
    const source = sources.find((row) => row.url === url);
    if (!source) throw new Error(`unexpected fixture URL: ${url}`);
    if (source.source_id === failingSourceId) throw new Error('fixture network failure');
    const body = bodies.get(source.source_id);
    if (!body) throw new Error(`missing fixture body: ${source.source_id}`);
    const overrides = metadata.get(source.source_id) ?? {};
    return new Response(body, {
      status: overrides.status ?? 200,
      headers: {
        'content-type': overrides.contentType ?? 'text/html; charset=utf-8',
        etag: overrides.etag ?? `pr237-${source.source_id}`,
        'last-modified': overrides.lastModified ?? 'Mon, 29 Jun 2026 05:00:00 GMT'
      }
    });
  };
}

function acceptedBaselinesFrom(result) {
  const observations = new Map(result.observations.map((row) => [row.source_id, row]));
  return {
    ...structuredClone(pendingBaselineSet),
    updated_at: '2026-06-29T05:05:00.000Z',
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
        accepted_repository_commit: 'e'.repeat(40),
        accepted_review_reference: 'PR #237'
      };
    })
  };
}

function assertCountTotal(result, label) {
  const counts = result.change_counts ?? {};
  const total = ['unchanged', 'metadata_changed', 'content_changed', 'new_source', 'fetch_failed']
    .reduce((sum, key) => sum + (counts[key] ?? 0), 0);
  if (total !== result.observation_count) fail(`${label}: change count total ${total} does not equal observation_count ${result.observation_count}`);
}

try {
  const initial = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T05:00:00.000Z',
    fetchImpl: fixtureFetch(baseBodies),
    sources,
    baselineSet: pendingBaselineSet
  });
  assertCountTotal(initial, 'pending baseline');
  if (initial.change_counts?.new_source !== 4 || initial.candidate_count !== 4) fail('pending baseline fixture must produce four new_source candidates');

  const acceptedBaselineSet = acceptedBaselinesFrom(initial);
  const exact = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T05:10:00.000Z',
    fetchImpl: fixtureFetch(baseBodies),
    sources,
    baselineSet: acceptedBaselineSet
  });
  assertCountTotal(exact, 'exact match');
  if (exact.change_counts?.unchanged !== 4 || exact.candidate_count !== 0) fail('exact match fixture must produce four unchanged observations and zero candidates');

  const mixedBodies = new Map(baseBodies);
  mixedBodies.set('tether-transparency', '<html>\n<body>  Reserves current balances circulation PR237_RAW_TETHER </body>\n</html>');
  mixedBodies.set('paxos-pyusd-transparency', '<html><body>Reserve report portfolio composition attestation. New reviewed period appears in this fixture. PR237_CONTENT_CHANGED</body></html>');
  const mixedMetadata = new Map([
    ['circle-transparency', { etag: 'pr237-circle-metadata-only' }]
  ]);
  const mixed = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T05:20:00.000Z',
    fetchImpl: fixtureFetch(mixedBodies, mixedMetadata),
    sources,
    baselineSet: acceptedBaselineSet
  });
  assertCountTotal(mixed, 'mixed classification');
  if (mixed.change_counts?.metadata_changed !== 2) fail(`mixed fixture must produce two metadata_changed observations, found ${mixed.change_counts?.metadata_changed}`);
  if (mixed.change_counts?.content_changed !== 1) fail(`mixed fixture must produce one content_changed observation, found ${mixed.change_counts?.content_changed}`);
  if (mixed.change_counts?.unchanged !== 1) fail(`mixed fixture must produce one unchanged observation, found ${mixed.change_counts?.unchanged}`);
  if (mixed.candidate_count !== 1) fail(`mixed fixture must produce exactly one candidate, found ${mixed.candidate_count}`);

  const tether = mixed.observations.find((row) => row.source_id === 'tether-transparency');
  if (tether?.baseline_comparison?.state !== 'metadata_changed') fail('byte-only Tether fixture must classify as metadata_changed');
  if (tether?.baseline_comparison?.normalized_content_changed !== false) fail('byte-only Tether fixture must preserve identical normalized content');
  if (!tether?.baseline_comparison?.metadata_changes?.includes('exact_body_sha256')) fail('byte-only Tether fixture must identify exact_body_sha256');
  if (mixed.candidates.some((row) => row.source_id === 'tether-transparency')) fail('byte-only change must not create a candidate');

  const circle = mixed.observations.find((row) => row.source_id === 'circle-transparency');
  if (circle?.baseline_comparison?.state !== 'metadata_changed') fail('ETag-only Circle fixture must classify as metadata_changed');
  if (JSON.stringify(circle?.baseline_comparison?.metadata_changes) !== JSON.stringify(['etag'])) fail(`ETag-only Circle metadata list mismatch: ${JSON.stringify(circle?.baseline_comparison?.metadata_changes)}`);
  if (mixed.candidates.some((row) => row.source_id === 'circle-transparency')) fail('ETag-only change must not create a candidate');

  const paxos = mixed.observations.find((row) => row.source_id === 'paxos-pyusd-transparency');
  const candidate = mixed.candidates[0];
  if (paxos?.baseline_comparison?.state !== 'content_changed') fail('Paxos normalized-text fixture must classify as content_changed');
  if (paxos?.baseline_comparison?.classification_reason !== 'normalized_content_digest_changed') fail('content change classification reason mismatch');
  if (candidate?.source_id !== 'paxos-pyusd-transparency' || candidate?.change_state !== 'content_changed') fail('content-change candidate identity or state mismatch');
  if (candidate?.classification_reason !== 'normalized_content_digest_changed') fail('candidate classification reason missing');
  if (!candidate?.baseline_comparison?.baseline_normalized_content_sha256 || !candidate?.baseline_comparison?.observed_normalized_content_sha256) fail('candidate must retain prior and observed normalized digests');
  if (candidate.baseline_comparison.baseline_normalized_content_sha256 === candidate.baseline_comparison.observed_normalized_content_sha256) fail('content-change candidate digests must differ');
  if (candidate.status !== 'needs_human_review' || candidate.canonical_action !== 'none') fail('content-change candidate safety state invalid');

  const firstSource = sources[0];
  const firstBaseline = {
    ...structuredClone(acceptedBaselineSet),
    baselines: acceptedBaselineSet.baselines.filter((row) => row.source_id === firstSource.source_id)
  };
  const failed = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T05:30:00.000Z',
    fetchImpl: fixtureFetch(baseBodies, new Map(), firstSource.source_id),
    sources: [firstSource],
    baselineSet: firstBaseline
  });
  assertCountTotal(failed, 'fetch failure');
  if (failed.change_counts?.fetch_failed !== 1 || failed.candidate_count !== 0) fail('fetch failure must remain separate and candidate-free');

  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-pr237-run-'));
  try {
    const run = await runMonitoring({
      outputRoot,
      runId: '20260629T054000Z-pr237',
      startedAt: '2026-06-29T05:40:00.000Z',
      sourceCommit: 'f'.repeat(40),
      sourceBranch: 'pr237-test',
      mode: 'official-sources',
      fetchImpl: fixtureFetch(mixedBodies, mixedMetadata),
      sources,
      baselineSet: acceptedBaselineSet
    });
    if (run.manifest.change_counts?.metadata_changed !== 2 || run.manifest.candidate_count !== 1) fail('monitoring manifest classification counts mismatch');
    if (!run.manifest.canonical_guard?.ok || run.manifest.canonical_guard.changed_paths.length !== 0) fail('PR #237 fixture must preserve canonical snapshot');
    const files = fs.readdirSync(run.run_directory).sort();
    const expected = ['health.json','manifest.json','monitoring-candidates.json','official-source-observations.json','summary.md'];
    if (JSON.stringify(files) !== JSON.stringify(expected)) fail(`PR #237 output file set mismatch: ${files.join(', ')}`);
    const summary = fs.readFileSync(path.join(run.run_directory, 'summary.md'), 'utf8');
    if (!summary.includes('Metadata changed: 2')) fail('summary missing metadata change count');
    if (!summary.includes('Metadata-only changes create candidates: false')) fail('summary missing metadata candidate boundary');
    const serialized = files.map((file) => fs.readFileSync(path.join(run.run_directory, file), 'utf8')).join('\n');
    for (const marker of ['PR237_RAW_TETHER','PR237_RAW_CIRCLE','PR237_RAW_PAXOS','PR237_RAW_ETHENA','PR237_CONTENT_CHANGED']) {
      if (serialized.includes(marker)) fail(`raw fixture marker leaked: ${marker}`);
    }
  } finally {
    fs.rmSync(outputRoot, { recursive: true, force: true });
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const classificationSpec = fs.readFileSync(path.join(root, 'docs/quality/monitoring-observation-classification-spec.md'), 'utf8');
for (const phrase of [
  'metadata_changed',
  'normalized_content_same_metadata_differs',
  'exact_body_sha256',
  'A metadata-only observation creates zero content-change candidates',
  'The count total must equal `observation_count`',
  'No production deployment required'
]) {
  if (!classificationSpec.includes(phrase)) fail(`PR #237 classification specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #237 observation classification validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PR #237 classification contract valid on historical four-source fixture; current allowlist contains ${allSources.length} sources.`);
