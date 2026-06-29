import fs from 'node:fs';
import path from 'node:path';
import { loadOfficialSources } from './monitoring/monitors/official-source-observer.mjs';
import {
  loadOfficialSourceBaselines,
  validateOfficialSourceBaselines
} from './monitoring/baselines/baseline-store.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);

const requiredFiles = [
  'docs/quality/monitoring-baseline-spec.md',
  'scripts/monitoring/baselines/official-source-baselines.json',
  'scripts/monitoring/baselines/baseline-store.mjs'
];
for (const file of requiredFiles) if (!fs.existsSync(path.join(root, file))) fail(`missing PR #234 file: ${file}`);

let sources = [];
let baselineSet = null;
try {
  sources = loadOfficialSources(root);
  baselineSet = loadOfficialSourceBaselines(root);
  for (const error of validateOfficialSourceBaselines(baselineSet, sources)) fail(error);
} catch (error) {
  fail(`could not load monitoring baselines: ${error instanceof Error ? error.message : String(error)}`);
}

if (baselineSet) {
  if (baselineSet.baselines.length !== sources.length) fail('baseline count must equal enabled official source count');
  if (baselineSet.baselines.some((row) => row.status !== 'pending_initial_acceptance')) fail('PR #234 initial baselines must remain pending initial acceptance');

  const sourceIds = sources.map((row) => row.source_id).sort();
  const baselineIds = baselineSet.baselines.map((row) => row.source_id).sort();
  if (JSON.stringify(sourceIds) !== JSON.stringify(baselineIds)) fail('baseline source IDs must exactly match enabled official source IDs');

  const serialized = JSON.stringify(baselineSet);
  for (const forbidden of ['"body"','"raw_body"','"response_body"','"normalized_body"','"normalized_text"','"page_text"','"content"','"html"']) {
    if (serialized.includes(forbidden)) fail(`baseline set contains prohibited content field ${forbidden}`);
  }

  const acceptedFixture = structuredClone(baselineSet);
  acceptedFixture.updated_at = '2026-06-29T01:00:00.000Z';
  acceptedFixture.baselines = acceptedFixture.baselines.map((row, index) => ({
    ...row,
    status: 'accepted',
    accepted_final_url: row.source_url,
    body_sha256: String(index + 1).padStart(64, '0'),
    normalized_content_sha256: String(index + 5).padStart(64, '0'),
    content_type: 'text/html; charset=utf-8',
    etag: `fixture-${row.source_id}`,
    last_modified: 'Mon, 29 Jun 2026 00:00:00 GMT',
    accepted_observed_at: '2026-06-29T00:30:00.000Z',
    accepted_repository_commit: 'a'.repeat(40),
    accepted_review_reference: 'PR #234'
  }));
  const acceptedFailures = validateOfficialSourceBaselines(acceptedFixture, sources);
  if (acceptedFailures.length) fail(`valid accepted fixture rejected: ${acceptedFailures.join('; ')}`);

  const outsideHost = structuredClone(acceptedFixture);
  outsideHost.baselines[0].accepted_final_url = 'https://example.invalid/transparency';
  if (!validateOfficialSourceBaselines(outsideHost, sources).some((message) => message.includes('host is not allowlisted'))) fail('outside-host accepted URL must be rejected');

  const malformedDigest = structuredClone(acceptedFixture);
  malformedDigest.baselines[0].normalized_content_sha256 = 'not-a-digest';
  if (!validateOfficialSourceBaselines(malformedDigest, sources).some((message) => message.includes('normalized_content_sha256'))) fail('malformed normalized digest must be rejected');

  const missingSource = structuredClone(baselineSet);
  missingSource.baselines.pop();
  if (!validateOfficialSourceBaselines(missingSource, sources).some((message) => message.includes('missing a baseline record'))) fail('missing source baseline must be rejected');

  const populatedPending = structuredClone(baselineSet);
  populatedPending.baselines[0].etag = 'must-not-be-populated';
  if (!validateOfficialSourceBaselines(populatedPending, sources).some((message) => message.includes('must be null while pending'))) fail('populated pending baseline must be rejected');
}

const spec = fs.readFileSync(path.join(root, 'docs/quality/monitoring-baseline-spec.md'), 'utf8');
for (const phrase of [
  'A baseline is not canonical evidence',
  'pending_initial_acceptance',
  'normalized_content_sha256',
  'Monitoring execution may read this file but may not modify it',
  'No monitoring run may acquire write permission',
  'no live page digest is invented or silently accepted',
  'No production deployment required'
]) {
  if (!spec.includes(phrase)) fail(`monitoring baseline specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #234 monitoring baseline validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PR #234 monitoring baselines valid: four pending records, strict accepted-state validation, no write or publication authority.');
