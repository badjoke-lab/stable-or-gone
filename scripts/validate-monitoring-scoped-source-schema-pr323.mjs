import fs from 'node:fs';
import { loadOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { loadOfficialSources, observeOfficialSources } from './monitoring/monitors/official-source-observer.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sources = loadOfficialSources(root);
const baselineSet = loadOfficialSourceBaselines(root);

check(sources.length === 42, `current scoped source count must be 42, found ${sources.length}`);
check(baselineSet.baselines?.length === 42, `current scoped baseline count must be 42, found ${baselineSet.baselines?.length ?? 0}`);
check((baselineSet.baselines ?? []).every((row) => row.status === 'pending_initial_acceptance'), 'all current baselines must remain pending');
check((baselineSet.baselines ?? []).every((row) => [
  'accepted_final_url','body_sha256','normalized_content_sha256','content_type','etag','last_modified',
  'accepted_observed_at','accepted_repository_commit','accepted_review_reference'
].every((field) => row[field] === null)), 'pending baseline accepted-only fields must remain null');

const sourceIds = sources.map((row) => row.source_id).sort();
const baselineIds = (baselineSet.baselines ?? []).map((row) => row.source_id).sort();
check(JSON.stringify(sourceIds) === JSON.stringify(baselineIds), 'source and baseline IDs must match exactly');

const fixtureIds = [
  'binance-eea-stablecoin-policy',
  'gemini-eea-account-closure',
  'esma-mica-interim-register-hub'
];
const fixtureSources = sources.filter((row) => fixtureIds.includes(row.source_id));
const fixtureBaselineSet = {
  ...structuredClone(baselineSet),
  baselines: baselineSet.baselines.filter((row) => fixtureIds.includes(row.source_id))
};
check(fixtureSources.length === 3, 'PR #323 scope fixture must contain three representative sources');

const bodies = new Map([
  ['binance-eea-stablecoin-policy', '<html><body>Stablecoins trading sell margin earn deposit withdrawal custody convert conversion policy update</body></html>'],
  ['gemini-eea-account-closure', '<html><body>Customer accounts closed. Service closure notice. Withdrawals remain part of the transition.</body></html>'],
  ['esma-mica-interim-register-hub', '<html><body>MiCA register EMT issuer ART issuer authorised CASP non-compliant entity white paper</body></html>']
]);

const fixtureFetch = async (url) => {
  const source = fixtureSources.find((row) => row.url === url);
  if (!source) throw new Error(`unexpected PR #323 fixture URL: ${url}`);
  return new Response(bodies.get(source.source_id), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', etag: `pr323-${source.source_id}` }
  });
};

try {
  const result = await observeOfficialSources({
    root,
    observedAt: '2026-07-07T00:00:00.000Z',
    fetchImpl: fixtureFetch,
    sources: fixtureSources,
    baselineSet: fixtureBaselineSet
  });
  check(result.observation_count === 3, 'scope fixture must produce three observations');
  check(result.candidate_count === 3, 'scope fixture must produce three private review candidates');
  check(result.change_counts?.new_source === 3, 'scope fixture must classify all pending rows as new_source');

  const observationById = new Map(result.observations.map((row) => [row.source_id, row]));
  const candidateById = new Map(result.candidates.map((row) => [row.source_id, row]));

  const binanceObservation = observationById.get('binance-eea-stablecoin-policy');
  const binanceCandidate = candidateById.get('binance-eea-stablecoin-policy');
  check(binanceObservation?.monitoring_scope?.kind === 'platform_policy', 'Binance observation scope kind mismatch');
  check(binanceObservation?.monitoring_scope?.region_scope === 'European Economic Area', 'Binance EEA scope must remain exact');
  check(binanceCandidate?.monitoring_scope?.region_scope === 'European Economic Area', 'Binance candidate EEA scope must remain exact');
  check(binanceCandidate?.monitoring_scope?.platform_legal_entity === null, 'Binance legal entity null state must be preserved');
  check(binanceCandidate?.monitoring_scope?.function_scope?.includes('auto_conversion'), 'Binance function scope must preserve auto_conversion');
  check(binanceCandidate?.duplicate_review?.state === 'existing_targets_confirmed', 'Binance mapped asset targets must resolve');
  check(binanceCandidate?.lineage_review?.state === 'not_applicable_noncanonical_subject_scope', 'Binance platform scope must not invent issuer lineage');

  const geminiCandidate = candidateById.get('gemini-eea-account-closure');
  check(geminiCandidate?.monitoring_scope?.kind === 'platform_service_state', 'Gemini scope kind mismatch');
  check(geminiCandidate?.monitoring_scope?.region_scope === 'UK, EEA, and Australia customer accounts', 'Gemini regional scope must remain exact');
  check(geminiCandidate?.affected_stablecoin_ids?.length === 0, 'Gemini service-state source must not invent stablecoin targets');
  check(geminiCandidate?.duplicate_review?.state === 'scoped_noncanonical_subject_confirmed', 'Gemini noncanonical platform subject state mismatch');
  check(geminiCandidate?.lineage_review?.state === 'not_applicable_noncanonical_subject_scope', 'Gemini service-state lineage must be not applicable');

  const esmaCandidate = candidateById.get('esma-mica-interim-register-hub');
  check(esmaCandidate?.monitoring_scope?.kind === 'regulatory_register', 'ESMA scope kind mismatch');
  check(esmaCandidate?.monitoring_scope?.authority_name === 'ESMA', 'ESMA authority identity mismatch');
  check(esmaCandidate?.monitoring_scope?.region_scope === 'European Union', 'ESMA EU scope must remain exact');
  check(esmaCandidate?.monitoring_scope?.register_families?.length === 5, 'ESMA register family coverage mismatch');
  check(esmaCandidate?.affected_stablecoin_ids?.length === 0 && esmaCandidate?.affected_organization_ids?.length === 0, 'ESMA register source must not invent canonical targets');
  check(esmaCandidate?.duplicate_review?.state === 'scoped_noncanonical_subject_confirmed', 'ESMA noncanonical register subject state mismatch');
  check(esmaCandidate?.lineage_review?.state === 'not_applicable_noncanonical_subject_scope', 'ESMA lineage state must be not applicable');

  const serialized = JSON.stringify(result);
  check(!serialized.includes('canonical_write'), 'scope fixture must not contain canonical write instruction');
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
}

const openUsd = sources.find((row) => row.source_id === 'open-standard-open-usd');
const vsp = sources.find((row) => row.source_id === 'visa-stablecoin-platform');
const samsungWallet = sources.find((row) => row.source_id === 'samsung-wallet-stablecoin-support');
check(openUsd?.monitoring_scope?.subject_kind === 'prelaunch_stablecoin', 'Open USD subject-kind scope missing');
check(openUsd?.monitoring_scope?.canonical_record === false, 'Open USD scope became canonical');
check(vsp?.monitoring_scope?.subject_kind === 'stablecoin_infrastructure', 'VSP subject-kind scope missing');
check(vsp?.monitoring_scope?.canonical_record === false, 'VSP scope became canonical');
check(samsungWallet?.monitoring_scope?.kind === 'platform_policy', 'Samsung Wallet scope kind mismatch');
check(samsungWallet?.monitoring_scope?.subject_kind === 'consumer_wallet_stablecoin_support', 'Samsung Wallet subject-kind scope missing');
check(samsungWallet?.monitoring_scope?.launch_state === 'announced_prelaunch', 'Samsung Wallet launch state must remain announced_prelaunch');
check(samsungWallet?.monitoring_scope?.canonical_record === false, 'Samsung Wallet scope became canonical');
check(samsungWallet?.affected_stablecoin_ids?.length === 0, 'Samsung Wallet source must not invent a supported stablecoin target');

const schema = fs.readFileSync('docs/quality/monitoring-official-source-schema.md', 'utf8');
for (const marker of [
  'platform_policy',
  'platform_service_state',
  'regulatory_register',
  'auto_conversion',
  'non_compliant_entities',
  'Do not create fake canonical IDs'
]) {
  check(schema.includes(marker), `source schema missing marker: ${marker}`);
}

if (failures.length) {
  console.error('Current scoped source schema validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Current scoped source schema valid: 42 pending sources preserve platform, region, function, register, pre-launch, infrastructure, and consumer-wallet support scope without canonical writes.');
