import {
  DATA_SAFETY,
  MACHINE_READABLE_SCHEMA_VERSION,
  MAIN_ROUTES,
  PROJECT,
  getBuildMetadata,
  getRecordCountBreakdown,
  getRecordCounts,
} from '../../lib/machine-readable';

export function GET() {
  const build = getBuildMetadata();
  const manifest = {
    schema_version: MACHINE_READABLE_SCHEMA_VERSION,
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
        'evidence_relation',
        'reserve_report',
        'known_unknown',
        'regulatory_note',
        'deployment',
      ],
    },
    public_files: {
      version: '/version.json',
      manifest: '/data/manifest.json',
      llms: '/llms.txt',
      ai: '/ai.txt',
    },
    main_routes: MAIN_ROUTES,
    record_counts: getRecordCounts(),
    record_count_breakdown: getRecordCountBreakdown(),
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
