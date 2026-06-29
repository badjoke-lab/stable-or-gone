import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadOfficialSources } from '../monitors/official-source-observer.mjs';
import {
  loadOfficialSourceBaselines,
  validateOfficialSourceBaselines
} from './baseline-store.mjs';

const DECISIONS = new Set(['accept', 'hold', 'reject']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function objectDigest(value) {
  return sha256(JSON.stringify(value));
}

function isExactIso(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

function indexUnique(rows, field, label) {
  const map = new Map();
  for (const row of rows ?? []) {
    assert(row && typeof row === 'object' && !Array.isArray(row), `every ${label} must be an object`);
    const id = row[field];
    assert(typeof id === 'string' && id.length > 0, `${label} ${field} is required`);
    assert(!map.has(id), `${id}: duplicate ${label}`);
    map.set(id, row);
  }
  return map;
}

function validateInputs({ manifest, observationReport, decisionSet, baselineSet, sources }) {
  assert(manifest?.mode === 'official-sources', 'monitoring manifest mode must be official-sources');
  assert(typeof manifest?.run_id === 'string' && manifest.run_id.length > 0, 'monitoring manifest run_id is required');
  assert(typeof manifest?.source_commit === 'string' && /^[a-f0-9]{40}$/.test(manifest.source_commit), 'monitoring manifest source_commit must be a lowercase 40-character SHA');
  assert(manifest?.canonical_guard?.ok === true, 'monitoring manifest canonical guard must pass');
  assert(Array.isArray(manifest?.canonical_guard?.changed_paths) && manifest.canonical_guard.changed_paths.length === 0, 'monitoring manifest must contain zero canonical path changes');
  assert(manifest?.baseline_set_id === baselineSet.baseline_set_id, 'monitoring manifest baseline_set_id must match the repository baseline set');
  assert(manifest?.normalization_version === baselineSet.normalization_version, 'monitoring manifest normalization_version must match the repository baseline set');

  assert(observationReport?.monitor === 'official-source-observer', 'observation report monitor mismatch');
  assert(observationReport?.baseline_set_id === baselineSet.baseline_set_id, 'observation report baseline_set_id must match the repository baseline set');
  assert(observationReport?.normalization_version === baselineSet.normalization_version, 'observation report normalization_version must match the repository baseline set');

  assert(decisionSet?.schema_version === '1.0', 'decision schema_version must be 1.0');
  assert(typeof decisionSet?.review_reference === 'string' && /^PR #[1-9][0-9]*$/.test(decisionSet.review_reference), 'review_reference must use PR #<number>');
  assert(typeof decisionSet?.reviewer === 'string' && decisionSet.reviewer.trim().length > 0, 'reviewer is required');
  assert(isExactIso(decisionSet?.reviewed_at), 'reviewed_at must be an exact ISO-8601 timestamp');
  assert(Array.isArray(decisionSet?.decisions), 'decisions must be an array');

  const baselineFailures = validateOfficialSourceBaselines(baselineSet, sources);
  assert(baselineFailures.length === 0, `current baseline set is invalid: ${baselineFailures.join('; ')}`);

  const sourceIds = sources.map((source) => source.source_id).sort();
  const observations = indexUnique(observationReport.observations, 'source_id', 'observation');
  const decisions = indexUnique(decisionSet.decisions, 'source_id', 'decision');
  assert(observationReport.observation_count === observations.size, 'observation_count mismatch');
  assert(JSON.stringify([...observations.keys()].sort()) === JSON.stringify(sourceIds), 'observation source IDs must exactly match enabled official source IDs');
  assert(JSON.stringify([...decisions.keys()].sort()) === JSON.stringify(sourceIds), 'decision source IDs must exactly match enabled official source IDs');

  for (const sourceId of sourceIds) {
    const observation = observations.get(sourceId);
    const decision = decisions.get(sourceId);
    assert(observation.normalization_version === baselineSet.normalization_version, `${sourceId}: observation normalization_version mismatch`);
    assert(observation.baseline_comparison?.baseline_normalization_version === baselineSet.normalization_version, `${sourceId}: baseline comparison normalization_version mismatch`);
    assert(observation.baseline_comparison?.observed_normalization_version === baselineSet.normalization_version, `${sourceId}: observed comparison normalization_version mismatch`);
    assert(DECISIONS.has(decision.decision), `${sourceId}: invalid decision ${decision.decision}`);
    assert(typeof decision.rationale === 'string' && decision.rationale.trim().length >= 12, `${sourceId}: rationale must contain at least 12 characters`);
    if (decision.decision === 'accept') {
      assert(observation.fetch_status === 'ok', `${sourceId}: failed observation cannot be accepted`);
      assert(['new_source', 'content_changed'].includes(observation.baseline_comparison?.state), `${sourceId}: only new_source or content_changed observations may be accepted`);
      assert(typeof observation.final_url === 'string' && observation.final_url.length > 0, `${sourceId}: accepted observation final_url is required`);
      assert(typeof observation.body_sha256 === 'string' && /^[a-f0-9]{64}$/.test(observation.body_sha256), `${sourceId}: accepted observation body_sha256 is invalid`);
      assert(typeof observation.normalized_content_sha256 === 'string' && /^[a-f0-9]{64}$/.test(observation.normalized_content_sha256), `${sourceId}: accepted observation normalized_content_sha256 is invalid`);
      assert(typeof observation.content_type === 'string' && observation.content_type.trim().length > 0, `${sourceId}: accepted observation content_type is required`);
      assert(isExactIso(observation.observed_at), `${sourceId}: accepted observation observed_at is invalid`);
    }
  }
  return { observations, decisions };
}

function acceptedRecord(current, observation, manifest, decisionSet) {
  return {
    ...current,
    status: 'accepted',
    accepted_final_url: observation.final_url,
    body_sha256: observation.body_sha256,
    normalized_content_sha256: observation.normalized_content_sha256,
    content_type: observation.content_type,
    etag: observation.etag ?? null,
    last_modified: observation.last_modified ?? null,
    accepted_observed_at: observation.observed_at,
    accepted_repository_commit: manifest.source_commit,
    accepted_review_reference: decisionSet.review_reference
  };
}

function reportText(manifest, decisionSet, actions, proposalManifest) {
  const lines = [
    '# SOG Baseline Update Proposal',
    '',
    '> Proposal only. The repository baseline was not written.',
    '',
    '## Review context',
    '',
    `- Monitoring run: \`${manifest.run_id}\``,
    `- Source commit: \`${manifest.source_commit}\``,
    `- Normalization version: \`${manifest.normalization_version}\``,
    `- Review reference: \`${decisionSet.review_reference}\``,
    `- Reviewer: ${decisionSet.reviewer}`,
    `- Reviewed at: \`${decisionSet.reviewed_at}\``,
    '',
    '## Decisions',
    ''
  ];
  for (const action of actions) {
    lines.push(
      `### ${action.source_id}`,
      '',
      `- Decision: \`${action.decision}\``,
      `- Rationale: ${action.rationale}`,
      `- Prior status: \`${action.prior_status}\``,
      `- Proposed status: \`${action.proposed_status}\``,
      `- Prior normalized digest: \`${action.prior_normalized_content_sha256 ?? 'none'}\``,
      `- Observed normalized digest: \`${action.observed_normalized_content_sha256 ?? 'none'}\``,
      `- Proposed normalized digest: \`${action.proposed_normalized_content_sha256 ?? 'none'}\``,
      ''
    );
  }
  lines.push(
    '## Summary',
    '',
    `- Accepted: ${proposalManifest.accepted_count}`,
    `- Held: ${proposalManifest.held_count}`,
    `- Rejected: ${proposalManifest.rejected_count}`,
    `- Proposal changed: \`${proposalManifest.proposal_changed}\``,
    `- Current baseline digest: \`${proposalManifest.current_baseline_sha256}\``,
    `- Proposed baseline digest: \`${proposalManifest.proposed_baseline_sha256}\``,
    '',
    '## Safety boundary',
    '',
    '- Repository baseline written: false.',
    '- Automatic commit: false.',
    '- Automatic pull request: false.',
    '- Canonical action: none.',
    '- Public output: false.',
    '- Production publication: false.',
    '- Human review remains required before a separate repository change.',
    ''
  );
  return lines.join('\n');
}

export function prepareBaselineUpdateProposal(options = {}) {
  const root = options.root ?? process.cwd();
  const sources = options.sources ?? loadOfficialSources(root);
  const baselineSet = options.baselineSet ?? loadOfficialSourceBaselines(root);
  const { manifest, observationReport, decisionSet } = options;
  const { observations, decisions } = validateInputs({ manifest, observationReport, decisionSet, baselineSet, sources });

  const actions = [];
  const proposedBaselines = baselineSet.baselines.map((current) => {
    const decision = decisions.get(current.source_id);
    const observation = observations.get(current.source_id);
    const proposed = decision.decision === 'accept' ? acceptedRecord(current, observation, manifest, decisionSet) : structuredClone(current);
    actions.push({
      source_id: current.source_id,
      decision: decision.decision,
      rationale: decision.rationale.trim(),
      normalization_version: baselineSet.normalization_version,
      prior_status: current.status,
      proposed_status: proposed.status,
      prior_body_sha256: current.body_sha256,
      observed_body_sha256: observation.body_sha256 ?? null,
      proposed_body_sha256: proposed.body_sha256,
      prior_normalized_content_sha256: current.normalized_content_sha256,
      observed_normalized_content_sha256: observation.normalized_content_sha256 ?? null,
      proposed_normalized_content_sha256: proposed.normalized_content_sha256
    });
    return proposed;
  });

  const acceptedCount = actions.filter((action) => action.decision === 'accept').length;
  const proposedBaselineSet = {
    ...structuredClone(baselineSet),
    updated_at: acceptedCount > 0 ? decisionSet.reviewed_at : baselineSet.updated_at,
    baselines: proposedBaselines
  };
  const proposalFailures = validateOfficialSourceBaselines(proposedBaselineSet, sources);
  assert(proposalFailures.length === 0, `proposed baseline set is invalid: ${proposalFailures.join('; ')}`);

  const currentDigest = objectDigest(baselineSet);
  const proposedDigest = objectDigest(proposedBaselineSet);
  const proposalManifest = {
    schema_version: '1.0',
    proposal_id: `baseline_proposal_${sha256(`${manifest.run_id}|${decisionSet.review_reference}|${JSON.stringify(actions)}`).slice(0, 20)}`,
    status: 'proposal_only',
    created_from_run_id: manifest.run_id,
    source_commit: manifest.source_commit,
    baseline_set_id: baselineSet.baseline_set_id,
    normalization_version: baselineSet.normalization_version,
    review_reference: decisionSet.review_reference,
    reviewer: decisionSet.reviewer.trim(),
    reviewed_at: decisionSet.reviewed_at,
    accepted_count: acceptedCount,
    held_count: actions.filter((action) => action.decision === 'hold').length,
    rejected_count: actions.filter((action) => action.decision === 'reject').length,
    current_baseline_sha256: currentDigest,
    proposed_baseline_sha256: proposedDigest,
    proposal_changed: currentDigest !== proposedDigest,
    repository_baseline_written: false,
    automatic_commit: false,
    automatic_pull_request: false,
    canonical_action: 'none',
    public_output: false,
    production_publication: false,
    human_review_required: true,
    output_files: ['proposed-official-source-baselines.json', 'baseline-update-manifest.json', 'baseline-update-report.md']
  };
  return { proposedBaselineSet, proposalManifest, actions, report: reportText(manifest, decisionSet, actions, proposalManifest) };
}

export function writeBaselineUpdateBundle(outputDirectory, proposal, options = {}) {
  const root = options.root ?? process.cwd();
  const resolvedOutput = path.resolve(outputDirectory);
  if (options.enforceStagingPath !== false) {
    const stagingRoot = path.resolve(root, 'data-staging/monitoring-baseline-updates');
    const relative = path.relative(stagingRoot, resolvedOutput);
    assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'output must be a proposal subdirectory under data-staging/monitoring-baseline-updates');
  }
  const targetFiles = {
    baseline: path.join(resolvedOutput, 'proposed-official-source-baselines.json'),
    manifest: path.join(resolvedOutput, 'baseline-update-manifest.json'),
    report: path.join(resolvedOutput, 'baseline-update-report.md')
  };
  for (const filePath of Object.values(targetFiles)) assert(!fs.existsSync(filePath), `refusing to overwrite existing proposal file: ${filePath}`);
  fs.mkdirSync(resolvedOutput, { recursive: true });
  fs.writeFileSync(targetFiles.baseline, jsonText(proposal.proposedBaselineSet));
  fs.writeFileSync(targetFiles.manifest, jsonText(proposal.proposalManifest));
  fs.writeFileSync(targetFiles.report, `${proposal.report}\n`);
  return targetFiles;
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    assert(token.startsWith('--'), `unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    assert(value && !value.startsWith('--'), `missing value for --${key}`);
    result[key] = value;
    index += 1;
  }
  for (const key of ['manifest', 'observations', 'decisions', 'output']) assert(typeof result[key] === 'string', `--${key} is required`);
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const proposal = prepareBaselineUpdateProposal({
    root: process.cwd(),
    manifest: readJson(path.resolve(args.manifest)),
    observationReport: readJson(path.resolve(args.observations)),
    decisionSet: readJson(path.resolve(args.decisions))
  });
  const files = writeBaselineUpdateBundle(path.resolve(args.output), proposal, { root: process.cwd() });
  console.log(JSON.stringify({
    proposal_id: proposal.proposalManifest.proposal_id,
    status: proposal.proposalManifest.status,
    normalization_version: proposal.proposalManifest.normalization_version,
    accepted_count: proposal.proposalManifest.accepted_count,
    held_count: proposal.proposalManifest.held_count,
    rejected_count: proposal.proposalManifest.rejected_count,
    repository_baseline_written: false,
    files
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
