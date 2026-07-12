import {
  DATA_SCHEMA_VERSION,
  MACHINE_READABLE_SCHEMA_VERSION,
  PROJECT,
  ROUTES,
  getBuildMetadata,
  getRecordsLastReviewedAt,
  getRegistryV3Summary,
} from '../lib/machine-readable';
import {
  getCanonicalPublicRecordCountBreakdown,
  getCanonicalPublicRecordCounts,
} from './canonicalPublicCounts';
import { getEvidenceSourceIdentitySummary } from './data/evidenceSources';

export function GET() {
  const build = getBuildMetadata();
  const evidenceSourceIdentity = getEvidenceSourceIdentitySummary();
  const version = {
    schema_version: MACHINE_READABLE_SCHEMA_VERSION,
    project_id: PROJECT.projectId,
    site_name: PROJECT.siteName,
    registry_family: PROJECT.registryFamily,
    registry_type: PROJECT.registryType,
    canonical_origin: PROJECT.canonicalOrigin,
    release_channel: PROJECT.releaseChannel,
    design_generation: PROJECT.designGeneration,
    build,
    data: {
      data_schema_version: DATA_SCHEMA_VERSION,
      generated_at: build.generated_at,
      records_last_reviewed_at: getRecordsLastReviewedAt(),
      record_counts: getCanonicalPublicRecordCounts(),
      record_count_breakdown: getCanonicalPublicRecordCountBreakdown(),
      registry_v3: getRegistryV3Summary(),
      evidence_source_identity: evidenceSourceIdentity,
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
