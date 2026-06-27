import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { deduplicateEvidenceRecords } from '../config/evidence-source-deduplication.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import {
  applyById,
  groupRows,
  normalizeEvidence,
  readRows,
  scanRoots,
  uniqueStrings
} from './record-public-copy-audit-lib.mjs';
import { collectRecordPublicCopyOccurrences } from './record-public-copy-occurrences.mjs';
import { buildRecordMigrationMatrix } from './record-migration-matrix.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const outputPath = path.join(root, 'data/generated/record-public-copy-audit.json');
const group = (name) => groupRows(root, baseline, name);

const stablecoins = applyById(group('stablecoins'), [
  readRows(root, 'data/stablecoin-overrides-pr033.json'),
  readRows(root, 'data/stablecoin-overrides-pr034.json'),
  group('classifications'),
  group('classification_extensions'),
  group('profiles')
]);
const relationships = group('relationships');
const events = applyById(group('events'), [group('event_details')]);
const evidence = group('evidence').map(normalizeEvidence);
const sourceIdentities = deduplicateEvidenceRecords(evidence);
const knownUnknowns = group('known_unknowns');
const deployments = group('deployments');
const reserveReports = group('reserve_reports');

const scan = collectRecordPublicCopyOccurrences(root, stablecoins);
const { matrix, canonicalRelations } = buildRecordMigrationMatrix({
  stablecoins,
  relationships,
  events,
  evidence,
  sourceIdentities,
  knownUnknowns,
  deployments,
  reserveReports,
  occurrences: scan.occurrences
});

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const likelyOccurrences = scan.occurrences.filter((row) => row.likely_public_copy);
const recordsWithOccurrences = new Set(scan.occurrences.map((row) => row.stablecoin_id));
const recordsWithLikelyCopy = new Set(likelyOccurrences.map((row) => row.stablecoin_id));
const incompleteRecords = matrix.filter((row) => !row.migration_ready);
const sourceIdentityIds = new Set(sourceIdentities.map((row) => row.id));
const orphanSourceRelationIds = uniqueStrings(canonicalRelations.map((row) => row.evidence_id))
  .filter((id) => !sourceIdentityIds.has(id));
const relatedStablecoinIds = uniqueStrings([
  ...relationships.map((row) => row.stablecoin_id),
  ...events.flatMap((row) => [row.stablecoin_id, ...(row.subject_stablecoin_ids ?? [])]),
  ...canonicalRelations.flatMap((row) => row.stablecoin_ids),
  ...knownUnknowns.map((row) => row.stablecoin_id),
  ...deployments.map((row) => row.stablecoin_id),
  ...reserveReports.map((row) => row.stablecoin_id)
]);
const invalidStablecoinRelationIds = relatedStablecoinIds.filter((id) => !stablecoinIds.has(id));
const inventoryDigest = createHash('sha256')
  .update(JSON.stringify({ files: scan.scanned_files, occurrences: scan.occurrences, matrix }))
  .digest('hex');

const audit = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  scan_policy: {
    roots: scanRoots,
    matching: 'quoted or token-bounded stablecoin id, slug, canonical name, and symbols of four or more characters'
  },
  totals: {
    stablecoins: stablecoins.length,
    scanned_files: scan.scanned_files.length,
    files_with_record_specific_occurrences: scan.files.length,
    record_specific_occurrences: scan.occurrences.length,
    likely_public_copy_occurrences: likelyOccurrences.length,
    records_with_occurrences: recordsWithOccurrences.size,
    records_with_likely_public_copy: recordsWithLikelyCopy.size,
    records_without_occurrences: stablecoins.length - recordsWithOccurrences.size,
    migration_ready_records: matrix.filter((row) => row.migration_ready).length,
    incomplete_records: incompleteRecords.length,
    canonical_evidence_relations: canonicalRelations.length,
    public_source_identities: sourceIdentities.length,
    orphan_source_relation_ids: orphanSourceRelationIds.length,
    invalid_stablecoin_relation_ids: invalidStablecoinRelationIds.length
  },
  findings_by_surface: Object.fromEntries([
    'public_component_or_page',
    'shared_utility_or_library',
    'data_overlay_candidate'
  ].map((surface) => [surface, scan.occurrences.filter((row) => row.surface === surface).length])),
  files: scan.files,
  occurrences: scan.occurrences,
  record_matrix: matrix,
  incomplete_records: incompleteRecords,
  orphan_source_relation_ids: orphanSourceRelationIds,
  invalid_stablecoin_relation_ids: invalidStablecoinRelationIds,
  inventory_digest: `sha256:${inventoryDigest}`
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit.totals, null, 2));
