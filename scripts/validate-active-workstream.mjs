import fs from 'node:fs';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';
import './validate-deployment-canonicality-pr226.mjs';
import './validate-deployment-canonicality-pr227.mjs';
import './validate-deployment-source-status-pr229.mjs';

const documents = {
  roadmap: fs.readFileSync('docs/roadmap.md', 'utf8'),
  program: fs.readFileSync('docs/quality/non-ui-quality-program.md', 'utf8'),
  governance: fs.readFileSync('docs/spec-governance.md', 'utf8'),
  agents: fs.readFileSync('AGENTS.md', 'utf8'),
  baseline: fs.readFileSync('docs/quality/monitoring-baseline-spec.md', 'utf8'),
  review: fs.readFileSync('docs/quality/monitoring-review-material-spec.md', 'utf8'),
  change: fs.readFileSync('docs/quality/monitoring-change-detection-spec.md', 'utf8'),
  baselineUpdate: fs.readFileSync('docs/quality/monitoring-baseline-update-spec.md', 'utf8'),
  classification: fs.readFileSync('docs/quality/monitoring-observation-classification-spec.md', 'utf8'),
  normalization: fs.readFileSync('docs/quality/monitoring-normalization-spec.md', 'utf8'),
  phaseAAudit: fs.readFileSync('docs/quality/monitoring-phase-a-audit.md', 'utf8'),
  feasibility: fs.readFileSync('docs/quality/monitoring-feasibility-audit-spec.md', 'utf8')
};

const required = {
  roadmap: [
    'Latest completed: PR #240',
    'Active: PR #241',
    'Next: PR #242',
    'Stable assets: 92',
    'Gate V2-F: not passed',
    'Record growth: authorized after PR #246 candidate audit',
    'Production publication: deferred',
    'PR #239 deterministic monitoring audit and safety closure',
    'PR #240 monitoring feasibility audit for all 92 assets',
    'Canonical stable assets audited: 92',
    'Live source registration: 0',
    'Accepted baseline changes: 0',
    'PR #241 reserve and assurance source expansion',
    'PR #263 non-UI release-candidate material'
  ],
  program: [
    'Growth is allowed only through PR #246-#250',
    'No growth PR may contain more than two new stable assets',
    'Production publication remains deferred through PR #263',
    'After PR #263, continuation stops'
  ],
  governance: [
    'An accepted monitoring baseline is a repository-reviewed comparison point',
    'Monitoring executions remain read-only',
    'PR #263 does not authorize publication'
  ],
  agents: [
    'Growth beyond 92 assets is permitted only after PR #246',
    'Production publication remains prohibited through PR #263'
  ],
  baseline: [
    'A baseline is not canonical evidence',
    'pending_initial_acceptance',
    'normalization_version',
    'Monitoring execution may read this file but may not modify it'
  ],
  review: [
    'observed_facts',
    'inferences',
    'unresolved_questions',
    'Human approval required',
    'Automatic pull request: false'
  ],
  change: [
    'An unchanged source must create zero candidates',
    'metadata_changed',
    'content_changed',
    'fetch_failed',
    'No candidate authorizes canonical data'
  ],
  baselineUpdate: [
    'The flow produces a proposal bundle',
    'accept',
    'hold',
    'reject',
    'repository_baseline_written: false',
    'The proposal is not self-applying'
  ],
  classification: [
    'metadata_changed',
    'normalized_content_same_metadata_differs',
    'A metadata-only observation creates zero content-change candidates',
    'The count total must equal `observation_count`'
  ],
  normalization: [
    'sog_official_source_normalization_v2',
    'No source-specific normalization exceptions are approved',
    'calendar date or reporting period',
    'contract or account address',
    'The normalized text is used in memory'
  ],
  phaseAAudit: [
    'Phase A is complete for the current four-source, review-only monitoring scope',
    'Automatic canonical writes: prohibited',
    'Automatic pull requests: prohibited',
    'Accepted baselines: 0',
    'Pending baselines: 4',
    'Production publication: prohibited'
  ],
  feasibility: [
    'classifies every current canonical stable asset',
    'automatically_monitorable',
    'partially_monitorable',
    'manual_review_only',
    'no_reliable_official_source',
    'record count equals the canonical stablecoin count and currently equals 92',
    'PR #240 itself adds no live source and accepts no baseline',
    'No production deployment required'
  ]
};

for (const [documentName, phrases] of Object.entries(required)) {
  for (const phrase of phrases) {
    if (!documents[documentName].includes(phrase)) throw new Error(`${documentName} missing: ${phrase}`);
  }
}

console.log('Active workstream validation passed: PR #240 is complete and PR #241 reserve and assurance expansion is active.');
