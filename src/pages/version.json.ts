import {
  DATA_SCHEMA_VERSION,
  MACHINE_READABLE_SCHEMA_VERSION,
  PROJECT,
  ROUTES,
  getBuildMetadata,
  getRecordCountBreakdown,
  getRecordCounts,
  getRecordsLastReviewedAt,
} from '../lib/machine-readable';

export function GET() {
  const generatedAt = new Date().toISOString();
  const version = {
    schema_version: MACHINE_READABLE_SCHEMA_VERSION,
    project_id: PROJECT.projectId,
    site_name: PROJECT.siteName,
    registry_family: PROJECT.registryFamily,
    registry_type: PROJECT.registryType,
    canonical_origin: PROJECT.canonicalOrigin,
    release_channel: PROJECT.releaseChannel,
    design_generation: PROJECT.designGeneration,
    build: getBuildMetadata(generatedAt),
    data: {
      data_schema_version: DATA_SCHEMA_VERSION,
      generated_at: generatedAt,
      records_last_reviewed_at: getRecordsLastReviewedAt(),
      record_counts: getRecordCounts(),
      record_count_breakdown: getRecordCountBreakdown(),
    },
    routes: ROUTES,
  };

  return new Response(JSON.stringify(version, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300, must-revalidate',
    },
  });
}
