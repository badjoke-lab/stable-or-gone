import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { observeOfficialSources, loadOfficialSources } from './monitoring/monitors/official-source-observer.mjs';
import { runMonitoring } from './monitoring/run.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const historicalIds = [
  'tether-transparency',
  'circle-transparency',
  'paxos-pyusd-transparency',
  'ethena-custodian-attestations'
];

let allSources = [];
let fixtureSources = [];
try {
  allSources = loadOfficialSources(root);
  if (new Set(allSources.map((row) => row.source_id)).size !== allSources.length) fail('source IDs must be unique');
  for (const source of allSources) {
    const parsed = new URL(source.url);
    if (parsed.protocol !== 'https:') fail(`${source.source_id}: HTTPS required`);
    if (!source.allowed_hosts?.includes(parsed.hostname)) fail(`${source.source_id}: host not allowlisted`);
    const hasCanonicalTargetContext = (source.affected_stablecoin_ids?.length ?? 0) > 0 || (source.affected_organization_ids?.length ?? 0) > 0;
    if (!hasCanonicalTargetContext && !source.monitoring_scope) fail(`${source.source_id}: canonical target context or monitoring_scope required`);
    if (!source.signal_types?.length) fail(`${source.source_id}: signal types required`);
  }
  fixtureSources = allSources.filter((row) => historicalIds.includes(row.source_id));
  if (fixtureSources.length !== 4) fail(`historical fixture expected 4 sources, found ${fixtureSources.length}`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const bodies = new Map([
  ['tether-transparency', '<html><body>Reserves current balances circulation RAW_BODY_SHOULD_NOT_BE_STORED</body></html>'],
  ['circle-transparency', '<html><body>Total reserves circulation issuance redemption assurance</body></html>'],
  ['paxos-pyusd-transparency', '<html><body>Reserve reports portfolio composition attestation</body></html>'],
  ['ethena-custodian-attestations', '<html><body>Custodian attestations backing assets reserve</body></html>']
]);
const fixtureFetch = async (url) => {
  const source = fixtureSources.find((row) => row.url === url);
  if (!source) throw new Error(`unexpected fixture URL: ${url}`);
  return new Response(bodies.get(source.source_id), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', etag: `fixture-${source.source_id}` }
  });
};

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-pr231-'));
try {
  const options = {
    outputRoot: temporaryRoot,
    runId: '20260629T010000Z-test2310',
    startedAt: '2026-06-29T01:00:00.000Z',
    sourceCommit: 'test231000000000000000000000000000000000',
    sourceBranch: 'pr231-test',
    mode: 'official-sources',
    fetchImpl: fixtureFetch,
    sources: fixtureSources
  };
  const first = await runMonitoring(options);
  const manifest = JSON.parse(fs.readFileSync(path.join(first.run_directory, 'manifest.json'), 'utf8'));
  const observations = JSON.parse(fs.readFileSync(path.join(first.run_directory, 'official-source-observations.json'), 'utf8'));
  const candidates = JSON.parse(fs.readFileSync(path.join(first.run_directory, 'monitoring-candidates.json'), 'utf8'));
  const files = fs.readdirSync(first.run_directory).sort();
  const expectedFiles = ['health.json','manifest.json','monitoring-candidates.json','official-source-observations.json','summary.md'];
  if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) fail('fixture output file set mismatch');
  if (manifest.observation_count !== 4 || observations.observation_count !== 4) fail('fixture must produce four observations');
  if (manifest.candidate_count !== 4 || candidates.candidate_count !== 4) fail('fixture must produce four candidates');
  if (manifest.source_errors !== 0 || observations.source_errors !== 0) fail('fixture source errors must be zero');
  if (!manifest.canonical_guard?.ok || manifest.canonical_guard?.changed_paths?.length) fail('canonical guard failed');
  if (JSON.stringify({ observations, candidates }).includes('RAW_BODY_SHOULD_NOT_BE_STORED')) fail('raw body leaked');

  const second = await observeOfficialSources({ root, observedAt: options.startedAt, fetchImpl: fixtureFetch, sources: fixtureSources });
  const firstIds = candidates.candidates.map((row) => row.candidate_id).sort();
  const secondIds = second.candidates.map((row) => row.candidate_id).sort();
  if (JSON.stringify(firstIds) !== JSON.stringify(secondIds)) fail('candidate IDs must be deterministic');

  const badRedirect = await observeOfficialSources({
    root,
    observedAt: options.startedAt,
    sources: [fixtureSources[0]],
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      url: 'https://example.invalid/redirected',
      headers: { get: () => 'text/html' },
      arrayBuffer: async () => new TextEncoder().encode('reserves').buffer
    })
  });
  if (badRedirect.source_errors !== 1 || badRedirect.candidate_count !== 0) fail('outside-host redirect must fail without candidate');
} catch (error) {
  fail(`historical fixture failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

const spec = fs.readFileSync(path.join(root, 'docs/quality/monitoring-official-source-spec.md'), 'utf8');
for (const phrase of ['status: needs_human_review','canonical_action: none','maximum response body: 2 MiB','Live official-source access occurs only in the approved manual or later bounded scheduled read-only workflow.']) {
  if (!spec.includes(phrase)) fail(`source specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #231 monitoring validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`PR #231 observer contract valid: historical four-source fixture passes while current allowlist contains ${allSources.length} sources.`);
