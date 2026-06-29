import fs from 'node:fs';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';
import './validate-deployment-canonicality-pr226.mjs';
import './validate-deployment-canonicality-pr227.mjs';
import './validate-deployment-source-status-pr229.mjs';
import './validate-monitoring-reserve-assurance-pr241.mjs';
import './validate-monitoring-redemption-terms-pr242.mjs';

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
  feasibility: fs.readFileSync('docs/quality/monitoring-feasibility-audit-spec.md', 'utf8'),
  reserveAssurance: fs.readFileSync('docs/quality/monitoring-reserve-assurance-expansion-spec.md', 'utf8'),
  redemptionTerms: fs.readFileSync('docs/quality/monitoring-redemption-terms-expansion-spec.md', 'utf8')
};

const required = {
  roadmap: [
    'Latest completed: PR #242',
    'Active: PR #243',
    'Next: PR #244',
    'Stable assets: 92',
    'Gate V2-F: not passed',
    'Record growth: authorized after PR #246 candidate audit',
    'Production publication: deferred',
    'PR #241 reserve and assurance source expansion',
    'PR #242 redemption and terms source expansion',
    'Enabled official sources: 14',
    'Redemption and terms sources added: 5',
    'Pending baselines: 14',
    'Accepted baselines: 0',
    'PR #243 issuer, migration, and shutdown source expansion',
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
  ],
  reserveAssurance: [
    'expands review-only official-source monitoring',
    'exactly five reviewed sources are added',
    'keep that baseline `pending_initial_acceptance`',
    'No live response digest is committed in PR #241',
    'The four Phase A sources remain unchanged',
    'No production deployment required'
  ],
  redemptionTerms: [
    'expands review-only monitoring for issuer redemption',
    'exactly five reviewed PR #242 sources are added',
    'secondary_market_sale_is_not_issuer_redemption: true',
    'No live response digest is committed in PR #242',
    'All nine sources present after PR #241 must remain enabled',
    'No production deployment required'
  ]
};

for (const [documentName, phrases] of Object.entries(required)) {
  for (const phrase of phrases) {
    if (!documents[documentName].includes(phrase)) throw new Error(`${documentName} missing: ${phrase}`);
  }
}

console.log('Active workstream validation passed: PR #242 is complete and PR #243 issuer lifecycle expansion is active.');
