import {
  DATA_SAFETY,
  DATA_SCHEMA_VERSION,
  MACHINE_READABLE_SCHEMA_VERSION,
  MAIN_ROUTES,
  PROJECT,
  getBuildMetadata,
  getRecordCountBreakdown,
  getRecordCounts,
  getRegistryV3Summary,
} from '../../lib/machine-readable';
import { getEvidenceSourceIdentitySummary } from './evidenceSources';

export function GET() {
  const build = getBuildMetadata();
  const evidenceSourceIdentity = getEvidenceSourceIdentitySummary();
  const manifest = {
    schema_version: MACHINE_READABLE_SCHEMA_VERSION,
    data_schema_version: DATA_SCHEMA_VERSION,
    project_id: PROJECT.projectId,
    title: PROJECT.siteName,
    description: PROJECT.description,
    canonical_origin: PROJECT.canonicalOrigin,
    registry_family: PROJECT.registryFamily,
    registry_type: PROJECT.registryType,
    design_generation: PROJECT.designGeneration,
    build,
    data_model: {
      primary_record: 'stablecoin',
      supporting_records: [
        'organization',
        'stablecoin_organization_relationship',
        'stablecoin_event',
        'evidence',
        'evidence_source_identity',
        'evidence_relation',
        'reserve_report',
        'known_unknown',
        'regulatory_note',
        'deployment',
        'legal_profile',
        'stable_asset_relationship',
        'reserve_component',
        'income_profile',
        'derived_registry_statistics',
        'statistics_checkpoint_history',
        'deterministic_comparison_projection',
      ],
    },
    registry_v3: getRegistryV3Summary(),
    public_files: {
      version: '/version.json',
      manifest: '/data/manifest.json',
      stats: '/data/stats.json',
      stats_history: '/data/stats-history.json',
      comparison: '/data/comparison.json',
      llms: '/llms.txt',
      ai: '/ai.txt',
    },
    derived_statistics: {
      page: '/stats/',
      current: '/data/stats.json',
      checkpoint_history: '/data/stats-history.json',
      source_boundary: 'reviewed_canonical_registry_only',
      history_policy: 'append_only_reviewed_pr',
      excludes_live_market_metrics: true,
    },
    deterministic_comparison: {
      current: '/data/comparison.json',
      source_boundary: 'reviewed_canonical_registry_only',
      readiness_and_freshness_separate: true,
      single_composite_score: false,
      excludes_unreviewed_candidates: true,
      excludes_internal_monitoring: true,
      excludes_editorial_research: true,
    },
    main_routes: MAIN_ROUTES,
    record_counts: getRecordCounts(),
    record_count_breakdown: getRecordCountBreakdown(),
    evidence_source_identity: evidenceSourceIdentity,
    data_safety: DATA_SAFETY,
    correction_links: {
      page: '/contact/',
      github: 'https://github.com/badjoke-lab/stable-or-gone/issues',
    },
    repository: {
      type: 'github',
      url: 'https://github.com/badjoke-lab/stable-or-gone',
    },
    language: 'en',
    locales: ['en'],
    generated_at: build.generated_at,
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate',
    },
  });
}
