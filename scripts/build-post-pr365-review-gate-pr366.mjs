import fs from 'node:fs';

const paths = {
  config: 'config/post-pr365-review-gate-pr366.json',
  baseline: 'docs/migration/record-depth-baseline-pr363-summary.json',
  pr364: 'docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json',
  pr365: 'docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json',
  outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
  output: 'docs/migration/post-pr365-review-gate-pr366.json'
};

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const round2 = (value) => Math.round(value * 100) / 100;

function dimension(summary, id) {
  const row = summary.summary.dimension_states.find((item) => item.dimension_id === id);
  if (!row) throw new Error(`Missing planning dimension: ${id}`);
  return row.state_counts;
}

function build() {
  const config = readJson(paths.config);
  const baseline = readJson(paths.baseline);
  const pr364 = readJson(paths.pr364);
  const pr365 = readJson(paths.pr365);
  const outcomes = readJson(paths.outcomes);

  const marketAccess = dimension(baseline, 'canonical_market_access');
  const regulatory = dimension(baseline, 'regulatory_notes');
  const deployment = dimension(baseline, 'deployment');
  const freshness = dimension(baseline, 'facet_freshness_support');
  const absent = baseline.summary.state_counts.absent;
  const twoDimensionAbsent = marketAccess.absent + regulatory.absent;

  return {
    schema_version: '1.0',
    report_id: 'sog_post_pr365_review_gate_pr366_2026_07_15',
    status: 'reviewed_internal_authority_decision',
    public_output: false,
    review_pr: 366,
    reviewed_at: '2026-07-15',
    source_checkpoint: {
      assets: pr365.canonical_counts.assets,
      organizations: pr365.canonical_counts.organizations,
      relationships: pr365.canonical_counts.relationships,
      events: pr365.canonical_counts.events,
      evidence: pr365.canonical_counts.evidence,
      evidence_relations: pr365.canonical_counts.evidence_relations,
      deployments: pr365.canonical_counts.deployments,
      market_access_records: pr365.canonical_counts.market_access_records,
      archive_recorded: pr365.evidence_quality.archive_recorded,
      archive_not_recorded: pr365.evidence_quality.archive_not_recorded
    },
    evaluation: {
      planning_semantics: {
        cell_count: baseline.cell_count,
        absent_cells: absent,
        not_applicable_cells: baseline.summary.state_counts.not_applicable,
        market_access_absent_cells: marketAccess.absent,
        regulatory_notes_absent_cells: regulatory.absent,
        two_dimension_absent_cells: twoDimensionAbsent,
        two_dimension_share_of_absent_percent: round2((twoDimensionAbsent / absent) * 100),
        deployment_partial_cells: deployment.partial,
        facet_freshness_partial_cells: freshness.partial,
        finding: 'The current planning model concentrates nearly all absent states in two structurally sparse dimensions while assigning no not_applicable states anywhere; candidate selection should not continue unchanged.'
      },
      recent_batch_yield: {
        tier_a_batch_4_reviewed_assets: pr364.selected_asset_slugs.length,
        tier_a_batch_4_changed_assets: pr364.canonical_improvement_asset_slugs.length,
        tier_a_batch_4_change_yield_percent: round2((pr364.canonical_improvement_asset_slugs.length / pr364.selected_asset_slugs.length) * 100),
        evidence_archive_batch_2_reviewed_records: outcomes.selected_count,
        evidence_archive_batch_2_changed_records: outcomes.changed_count,
        evidence_archive_batch_2_change_yield_percent: round2((outcomes.changed_count / outcomes.selected_count) * 100),
        finding: 'Both bounded batches produced valid improvements, but the remaining queue is increasingly constrained by source availability and planning semantics.'
      },
      evidence_maintenance: {
        archive_recorded: pr365.evidence_quality.archive_recorded,
        archive_not_recorded: pr365.evidence_quality.archive_not_recorded,
        archive_recorded_percent: round2((pr365.evidence_quality.archive_recorded / pr365.canonical_counts.evidence) * 100),
        archive_not_recorded_percent: round2((pr365.evidence_quality.archive_not_recorded / pr365.canonical_counts.evidence) * 100),
        finding: 'Archive coverage remains incomplete, but another immediate identical archive batch is not the highest-priority next step after a 3-of-10 yield.'
      },
      market_access: {
        records: pr365.canonical_counts.market_access_records,
        assets: 2,
        platforms: 1,
        jurisdictions: 1,
        decision: 'hold',
        reason: 'The repository still lacks the breadth and reviewed external evidence required to justify Market Access Pilot 3 or a new public surface.'
      },
      monitoring: {
        decision: 'continue_private_review_only',
        automatic_canonical_promotion_allowed: false
      },
      external_usage: {
        status: 'not_available_in_reviewed_repository_evidence',
        decision_effect: 'No growth or public-surface approval is based on unverified usage claims.'
      }
    },
    decisions: {
      planning_dimension_semantics_audit: {
        decision: 'approved_required',
        pr: 367,
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      record_depth_baseline_v2_refresh: {
        decision: 'approved_after_semantics_audit',
        pr: 368,
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      tier_a_dossier_batch_5: {
        decision: 'approved_after_baseline_refresh',
        pr: 369,
        maximum_assets: config.decision_rules.maximum_dossier_assets_after_refresh,
        existing_assets_only: true,
        new_asset_allowed: false,
        market_access_change_allowed: false,
        public_surface_allowed: false
      },
      evidence_archive_maintenance_batch_3: {
        decision: 'not_approved_in_next_sequence',
        reason: 'Reassess archive-priority semantics and source-equivalence policy after the planning audit instead of immediately repeating the same bounded lookup.'
      },
      market_access_pilot_3: { decision: 'not_approved' },
      record_growth_batch_2: { decision: 'not_approved' },
      new_public_surface: { decision: 'not_approved' }
    },
    approved_next_sequence: [
      {
        pr: 367,
        work_item: 'Planning Dimension Semantics Audit',
        scope: 'Review all 16 planning dimensions, define absent versus not_applicable versus unobserved semantics, and revise no canonical data.',
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      {
        pr: 368,
        work_item: 'Record Depth Baseline v2 Refresh',
        scope: 'Recompute the non-ranking 112-asset planning baseline using the approved semantics while preserving all historical baselines.',
        canonical_data_change_allowed: false,
        public_surface_allowed: false
      },
      {
        pr: 369,
        work_item: 'Tier A Dossier Deepening Batch 5',
        scope: 'Select no more than five existing assets from the refreshed non-ranking queue and deepen only source-supported material gaps.',
        maximum_assets: config.decision_rules.maximum_dossier_assets_after_refresh,
        new_asset_allowed: false,
        market_access_change_allowed: false,
        public_surface_allowed: false
      }
    ],
    not_approved_in_next_sequence: config.forbidden_without_later_review_gate.includes('Evidence and Archive Maintenance Batch 3')
      ? config.forbidden_without_later_review_gate
      : ['Evidence and Archive Maintenance Batch 3', ...config.forbidden_without_later_review_gate],
    review_gate_after_sequence: true,
    activation_rule: 'PR #367 must update AGENTS.md and docs/roadmap.md to activate the approved sequence before changing planning contracts.'
  };
}

const rendered = `${JSON.stringify(build(), null, 2)}\n`;
if (process.argv.includes('--check')) {
  const existing = fs.readFileSync(paths.output, 'utf8');
  if (existing !== rendered) {
    console.error(`${paths.output} is not reproducible. Run this builder without --check.`);
    process.exit(1);
  }
  console.log('PR #366 review-gate report is reproducible.');
} else {
  fs.writeFileSync(paths.output, rendered);
  console.log(`Wrote ${paths.output}`);
}
