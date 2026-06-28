import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { observeOfficialSources, loadOfficialSources } from './monitoring/monitors/official-source-observer.mjs';
import { runMonitoring } from './monitoring/run.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);

const requiredFiles = [
  'docs/quality/monitoring-official-source-spec.md',
  'scripts/monitoring/sources/official-sources.json',
  'scripts/monitoring/monitors/official-source-observer.mjs'
];
for (const file of requiredFiles) if (!fs.existsSync(path.join(root, file))) fail(`missing PR #231 file: ${file}`);

let sources = [];
try {
  sources = loadOfficialSources(root);
  if (sources.length !== 4) fail(`official source allowlist must contain 4 enabled sources, found ${sources.length}`);
  if (new Set(sources.map((source) => source.source_id)).size !== sources.length) fail('official source IDs must be unique');
  for (const source of sources) {
    const parsed = new URL(source.url);
    if (parsed.protocol !== 'https:') fail(`${source.source_id}: URL must use HTTPS`);
    if (!source.allowed_hosts?.includes(parsed.hostname)) fail(`${source.source_id}: configured hostname is not allowlisted`);
    if (!source.affected_stablecoin_ids?.length || !source.affected_organization_ids?.length) fail(`${source.source_id}: canonical targets are required`);
    if (!source.signal_types?.length) fail(`${source.source_id}: signal types are required`);
  }
} catch (error) {
  fail(`could not load official source allowlist: ${error instanceof Error ? error.message : String(error)}`);
}

const fixtureBodies = new Map([
  ['tether-transparency', '<html><body>Reserves current balances circulation RAW_BODY_SHOULD_NOT_BE_STORED</body></html>'],
  ['circle-transparency', '<html><body>Total reserves in circulation issuance redemption monthly assurance</body></html>'],
  ['paxos-pyusd-transparency', '<html><body>Reserve reports portfolio composition attestation independent third-party</body></html>'],
  ['ethena-custodian-attestations', '<html><body>Custodian attestations backing assets transparency reserve</body></html>']
]);

const fixtureFetch = async (url) => {
  const source = sources.find((item) => item.url === url);
  if (!source) throw new Error(`unexpected fixture URL: ${url}`);
  const body = fixtureBodies.get(source.source_id);
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      etag: `fixture-${source.source_id}`,
      'last-modified': 'Mon, 29 Jun 2026 00:00:00 GMT'
    }
  });
};

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-monitoring-pr231-'));
try {
  const options = {
    outputRoot: temporaryRoot,
    runId: '20260629T010000Z-test2310',
    startedAt: '2026-06-29T01:00:00.000Z',
    sourceCommit: 'test231000000000000000000000000000000000',
    sourceBranch: 'pr231-test',
    mode: 'official-sources',
    fetchImpl: fixtureFetch,
    sources
  };
  const first = await runMonitoring(options);
  const files = fs.readdirSync(first.run_directory).sort();
  const expectedFiles = ['health.json','manifest.json','monitoring-candidates.json','official-source-observations.json','summary.md'];
  if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) fail(`official-source output mismatch: ${files.join(', ')}`);

  const manifest = JSON.parse(fs.readFileSync(path.join(first.run_directory, 'manifest.json'), 'utf8'));
  const observationReport = JSON.parse(fs.readFileSync(path.join(first.run_directory, 'official-source-observations.json'), 'utf8'));
  const candidateReport = JSON.parse(fs.readFileSync(path.join(first.run_directory, 'monitoring-candidates.json'), 'utf8'));
  const serialized = JSON.stringify({ observationReport, candidateReport });

  if (manifest.mode !== 'official-sources' || manifest.external_network_used !== true) fail('official-source manifest mode or network flag is invalid');
  if (manifest.observation_count !== 4 || observationReport.observation_count !== 4) fail('fixture run must contain four observations');
  if (manifest.candidate_count !== 4 || candidateReport.candidate_count !== 4) fail('fixture run must contain four candidates');
  if (manifest.source_errors !== 0 || observationReport.source_errors !== 0) fail('fixture run must contain zero source errors');
  if (!manifest.canonical_guard?.ok || manifest.canonical_guard?.changed_paths?.length !== 0) fail('fixture run must preserve canonical snapshot');
  if (serialized.includes('RAW_BODY_SHOULD_NOT_BE_STORED')) fail('raw response body leaked into monitoring output');

  for (const observation of observationReport.observations ?? []) {
    if (observation.fetch_status !== 'ok' || !observation.body_sha256 || observation.body_bytes <= 0) fail(`${observation.source_id}: invalid observation metadata`);
    if (!observation.matched_signal_types?.length || !observation.matched_keywords?.length) fail(`${observation.source_id}: signal detection missing`);
    if ('body' in observation || 'raw_body' in observation) fail(`${observation.source_id}: raw body field is prohibited`);
  }
  for (const candidate of candidateReport.candidates ?? []) {
    if (candidate.status !== 'needs_human_review' || candidate.canonical_action !== 'none') fail(`${candidate.candidate_id}: candidate state is invalid`);
    if (candidate.duplicate_review?.state !== 'existing_targets_confirmed') fail(`${candidate.candidate_id}: duplicate review did not confirm canonical targets`);
    if (!['canonical_relationships_found','no_canonical_relationship_found'].includes(candidate.lineage_review?.state)) fail(`${candidate.candidate_id}: lineage state invalid`);
  }

  const second = await observeOfficialSources({ root, observedAt: options.startedAt, fetchImpl: fixtureFetch, sources });
  const firstIds = candidateReport.candidates.map((row) => row.candidate_id).sort();
  const secondIds = second.candidates.map((row) => row.candidate_id).sort();
  if (JSON.stringify(firstIds) !== JSON.stringify(secondIds)) fail('candidate IDs must be deterministic for the same observation content');

  const badRedirect = await observeOfficialSources({
    root,
    observedAt: options.startedAt,
    sources: [sources[0]],
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      url: 'https://example.invalid/redirected',
      headers: { get: () => 'text/html' },
      arrayBuffer: async () => new TextEncoder().encode('reserves').buffer
    })
  });
  if (badRedirect.source_errors !== 1 || badRedirect.candidate_count !== 0) fail('redirect outside allowlist must produce an error observation and no candidate');
} catch (error) {
  fail(`PR #231 fixture run failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

const spec = fs.readFileSync(path.join(root, 'docs/quality/monitoring-official-source-spec.md'), 'utf8');
for (const phrase of ['status: needs_human_review','canonical_action: none','maximum response body: 2 MiB','Live official-source access occurs only in the manually dispatched workflow.']) {
  if (!spec.includes(phrase)) fail(`official-source specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #231 monitoring validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #231 monitoring valid: four allowlisted sources, private candidates, deterministic IDs, canonical snapshot unchanged.');
