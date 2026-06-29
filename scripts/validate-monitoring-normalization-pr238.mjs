import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadOfficialSourceBaselines, validateOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { loadOfficialSources, observeOfficialSources } from './monitoring/monitors/official-source-observer.mjs';
import {
  OFFICIAL_SOURCE_NORMALIZATION_VERSION,
  normalizeOfficialSourceBody,
  officialSourceNormalizationProfile
} from './monitoring/normalization/official-source-normalizer.mjs';
import { runMonitoring } from './monitoring/run.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const sources = loadOfficialSources(root);
const baselineSet = loadOfficialSourceBaselines(root);

function digest(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function html(value) {
  return normalizeOfficialSourceBody(Buffer.from(value), 'text/html; charset=utf-8');
}

function json(value) {
  return normalizeOfficialSourceBody(Buffer.from(value), 'application/json');
}

const noisyHtml = `<!doctype html>
<html>
<head>
  <style>.generated { color: red; }</style>
  <script>const reserve = 'PR238_SCRIPT_NOISE';</script>
</head>
<body>
  <!-- PR238_COMMENT_NOISE reserve 999 -->
  <div>Reserve&nbsp;report</div>
  <template>PR238_TEMPLATE_NOISE 2035-01-01</template>
  <svg><text>PR238_SVG_NOISE 88%</text></svg>
  <p>Date: 2026-06-29</p>
  <p>Amount: &#x24;1,234.56</p>
  <p>Ratio: 98.7&#37;</p>
  <p>Address: 0xAbC123</p>
  <p>Issuer: Cafe\u0301 Trust</p>
  <p>Status: redemption remains available</p>
</body>
</html>`;
const cleanHtml = 'Reserve report Date: 2026-06-29 Amount: $1,234.56 Ratio: 98.7% Address: 0xAbC123 Issuer: Café Trust Status: redemption remains available';
const normalizedNoisy = html(noisyHtml);
const normalizedClean = html(cleanHtml);
if (normalizedNoisy !== normalizedClean) fail(`reviewed HTML noise did not normalize identically: ${normalizedNoisy}`);

for (const required of ['2026-06-29', '$1,234.56', '98.7%', '0xAbC123', 'Café Trust', 'redemption remains available']) {
  if (!normalizedNoisy.includes(required)) fail(`material value removed during normalization: ${required}`);
}
for (const forbidden of ['PR238_SCRIPT_NOISE', 'PR238_COMMENT_NOISE', 'PR238_TEMPLATE_NOISE', 'PR238_SVG_NOISE']) {
  if (normalizedNoisy.includes(forbidden)) fail(`non-semantic container leaked into normalized text: ${forbidden}`);
}

const materialVariants = [
  cleanHtml.replace('2026-06-29', '2026-07-01'),
  cleanHtml.replace('$1,234.56', '$1,200.00'),
  cleanHtml.replace('98.7%', '97.2%'),
  cleanHtml.replace('0xAbC123', '0xDef456'),
  cleanHtml.replace('Café Trust', 'Other Issuer'),
  cleanHtml.replace('redemption remains available', 'redemption is suspended')
];
for (const variant of materialVariants) {
  if (digest(html(variant)) === digest(normalizedClean)) fail(`material change was erased: ${variant}`);
}

const jsonA = '{"b":2,"a":{"y":2,"x":1},"list":[2,1],"status":"active"}';
const jsonB = '{ "status": "active", "list": [2,1], "a": {"x":1,"y":2}, "b": 2 }';
if (json(jsonA) !== json(jsonB)) fail('JSON object-key order or formatting created a normalized difference');
if (json(jsonA) === json('{"b":2,"a":{"y":2,"x":1},"list":[1,2],"status":"active"}')) fail('JSON array order was incorrectly ignored');
if (json(jsonA) === json('{"b":3,"a":{"y":2,"x":1},"list":[2,1],"status":"active"}')) fail('JSON numeric value change was incorrectly ignored');

const plainA = normalizeOfficialSourceBody(Buffer.from('Reserve\u200B   report\n2026-06-29'), 'text/plain');
const plainB = normalizeOfficialSourceBody(Buffer.from('Reserve report 2026-06-29'), 'text/plain');
if (plainA !== plainB) fail('zero-width or whitespace noise was not normalized');

const profile = officialSourceNormalizationProfile();
if (profile.version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('normalization profile version mismatch');
if (!Array.isArray(profile.source_specific_exceptions) || profile.source_specific_exceptions.length !== 0) fail('PR #238 must not contain source-specific exceptions');
if (baselineSet.normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('repository baseline normalization version mismatch');
const baselineFailures = validateOfficialSourceBaselines(baselineSet, sources);
if (baselineFailures.length) fail(`versioned repository baseline is invalid: ${baselineFailures.join('; ')}`);
const staleBaseline = structuredClone(baselineSet);
staleBaseline.normalization_version = 'stale-normalization-version';
if (!validateOfficialSourceBaselines(staleBaseline, sources).some((message) => message.includes('normalization_version'))) fail('stale normalization version must be rejected');

const firstSource = sources[0];
const firstPendingBaseline = {
  ...structuredClone(baselineSet),
  baselines: baselineSet.baselines.filter((row) => row.source_id === firstSource.source_id)
};
const visibleBody = '<html><body><p>Reserve report Date: 2026-06-29 Amount: $1,234.56 Ratio: 98.7% Address: 0xAbC123</p></body></html>';
const noisyEquivalentBody = '<!doctype html><html><head><script>reserve PR238_RAW_SCRIPT</script><style>.x{}</style></head><body><!-- reserve PR238_RAW_COMMENT --><div>Reserve&nbsp;report</div><p>Date: 2026-06-29 Amount: &#36;1,234.56 Ratio: 98.7&#37; Address: 0xAbC123</p></body></html>';
const responseFor = (body, etag = 'pr238-etag') => async () => new Response(body, {
  status: 200,
  headers: {
    'content-type': 'text/html; charset=utf-8',
    etag,
    'last-modified': 'Mon, 29 Jun 2026 06:00:00 GMT'
  }
});

try {
  const initial = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T06:00:00.000Z',
    fetchImpl: responseFor(visibleBody),
    sources: [firstSource],
    baselineSet: firstPendingBaseline
  });
  if (initial.candidate_count !== 1 || initial.change_counts?.new_source !== 1) fail('pending versioned source must produce one review candidate');
  const observation = initial.observations[0];
  const candidate = initial.candidates[0];
  if (initial.normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('official result normalization version missing');
  if (observation.normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('observation normalization version missing');
  if (candidate.normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('candidate normalization version missing');
  if (candidate.baseline_comparison?.baseline_normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('baseline comparison version missing');
  if (candidate.baseline_comparison?.observed_normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('observed comparison version missing');

  const acceptedBaseline = {
    ...structuredClone(firstPendingBaseline),
    updated_at: '2026-06-29T06:05:00.000Z',
    baselines: [{
      ...firstPendingBaseline.baselines[0],
      status: 'accepted',
      accepted_final_url: observation.final_url,
      body_sha256: observation.body_sha256,
      normalized_content_sha256: observation.normalized_content_sha256,
      content_type: observation.content_type,
      etag: observation.etag,
      last_modified: observation.last_modified,
      accepted_observed_at: observation.observed_at,
      accepted_repository_commit: 'a'.repeat(40),
      accepted_review_reference: 'PR #238'
    }]
  };
  const equivalent = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T06:10:00.000Z',
    fetchImpl: responseFor(noisyEquivalentBody),
    sources: [firstSource],
    baselineSet: acceptedBaseline
  });
  if (equivalent.change_counts?.metadata_changed !== 1 || equivalent.candidate_count !== 0) fail('reviewed HTML noise must remain metadata-only and candidate-free');
  if (equivalent.observations[0]?.baseline_comparison?.normalized_content_changed !== false) fail('reviewed HTML noise changed normalized digest');

  const scriptOnly = '<html><body><p>General information</p><script>reserve reserves redemption assurance PR238_SCRIPT_ONLY</script><!-- reserve PR238_COMMENT_ONLY --></body></html>';
  const noFalseSignal = await observeOfficialSources({
    root,
    observedAt: '2026-06-29T06:20:00.000Z',
    fetchImpl: responseFor(scriptOnly),
    sources: [firstSource],
    baselineSet: firstPendingBaseline
  });
  if (noFalseSignal.candidate_count !== 0 || noFalseSignal.observations[0]?.matched_signal_types?.length !== 0) fail('script or comment text created a false monitoring signal');

  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-pr238-run-'));
  try {
    const run = await runMonitoring({
      outputRoot,
      runId: '20260629T063000Z-pr238',
      startedAt: '2026-06-29T06:30:00.000Z',
      sourceCommit: 'b'.repeat(40),
      sourceBranch: 'pr238-test',
      mode: 'official-sources',
      fetchImpl: responseFor(visibleBody),
      sources: [firstSource],
      baselineSet: firstPendingBaseline
    });
    if (run.manifest.normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('manifest normalization version missing');
    const observationFile = JSON.parse(fs.readFileSync(path.join(run.run_directory, 'official-source-observations.json'), 'utf8'));
    const candidateFile = JSON.parse(fs.readFileSync(path.join(run.run_directory, 'monitoring-candidates.json'), 'utf8'));
    if (observationFile.normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('observation report normalization version missing');
    if (candidateFile.normalization_version !== OFFICIAL_SOURCE_NORMALIZATION_VERSION) fail('candidate report normalization version missing');
    const summary = fs.readFileSync(path.join(run.run_directory, 'summary.md'), 'utf8');
    if (!summary.includes(`Normalization version: \`${OFFICIAL_SOURCE_NORMALIZATION_VERSION}\``)) fail('summary normalization version missing');
    const serialized = fs.readdirSync(run.run_directory)
      .map((file) => fs.readFileSync(path.join(run.run_directory, file), 'utf8'))
      .join('\n');
    for (const marker of ['PR238_RAW_SCRIPT', 'PR238_RAW_COMMENT', 'Reserve report Date: 2026-06-29']) {
      if (serialized.includes(marker)) fail(`raw or normalized response content leaked: ${marker}`);
    }
    if (!run.manifest.canonical_guard?.ok || run.manifest.canonical_guard.changed_paths.length !== 0) fail('normalization fixture changed canonical files');
  } finally {
    fs.rmSync(outputRoot, { recursive: true, force: true });
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const spec = fs.readFileSync(path.join(root, 'docs/quality/monitoring-normalization-spec.md'), 'utf8');
for (const phrase of [
  'sog_official_source_normalization_v2',
  'No source-specific normalization exceptions are approved',
  'calendar date or reporting period',
  'contract or account address',
  'The normalized text is used in memory',
  'No production deployment required'
]) {
  if (!spec.includes(phrase)) fail(`PR #238 normalization specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #238 monitoring normalization validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PR #238 normalization valid: reviewed representation noise is suppressed, material values remain digest-significant, and normalization is versioned.');
