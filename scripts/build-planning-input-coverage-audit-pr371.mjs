import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  config: 'config/planning-input-coverage-audit-pr371.json',
  publicLoader: 'src/lib/data/currentProfiles.ts',
  publicExport: 'src/lib/data/stablecoinProfiles.ts',
  legacyBaseline: 'docs/migration/registry-v2-baseline.json',
  baseBuilder: 'scripts/growth/build-record-depth-baseline-pr353.mjs',
  canonicalBuilder: 'scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs',
  v2Builder: 'scripts/build-record-depth-baseline-v2-refresh-pr368.mjs',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json'
};
const outputPaths = {
  manifest: 'docs/migration/planning-input-manifest-pr371.json',
  audit: 'docs/migration/planning-input-coverage-audit-pr371.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const uniq = (values) => [...new Set(values)];

function parsePublicProfileFiles(sourceText) {
  const files = [];
  const regex = /import\s+[A-Za-z0-9_$]+\s+from\s+['"]\.\.\/\.\.\/\.\.\/data\/([^'"]+\.json)['"]/g;
  for (const match of sourceText.matchAll(regex)) files.push(`data/${match[1]}`);
  return files;
}

function fileRows(file) {
  const rows = readJson(file);
  if (!Array.isArray(rows)) throw new Error(`${file} must contain a JSON array`);
  for (const [index, row] of rows.entries()) {
    if (!row || typeof row !== 'object' || typeof row.id !== 'string' || row.id.length === 0) {
      throw new Error(`${file}[${index}] must contain a non-empty string id`);
    }
  }
  return rows;
}

function buildComposition(files) {
  const occurrences = new Map();
  const winnerById = new Map();
  const fileRowsMap = new Map();
  for (const [fileIndex, file] of files.entries()) {
    const rows = fileRows(file);
    fileRowsMap.set(file, rows);
    for (const [rowIndex, row] of rows.entries()) {
      if (!occurrences.has(row.id)) occurrences.set(row.id, []);
      occurrences.get(row.id).push({ file, file_index: fileIndex, row_index: rowIndex, content_sha256: sha256(JSON.stringify(row)) });
      winnerById.set(row.id, { file, file_index: fileIndex, row_index: rowIndex, row });
    }
  }
  return { occurrences, winnerById, fileRowsMap };
}

function orderedFileReport(files, legacySet, publicComposition) {
  return files.map((file, index) => {
    const rows = publicComposition.fileRowsMap.get(file) ?? fileRows(file);
    const ids = rows.map((row) => row.id);
    return {
      order_index: index,
      path: file,
      role: legacySet.has(file) ? 'legacy_baseline_input' : 'reviewed_overlay_input',
      in_legacy_registry_baseline: legacySet.has(file),
      row_count: rows.length,
      unique_id_count: new Set(ids).size,
      duplicate_id_occurrences_within_file: ids.length - new Set(ids).size,
      content_sha256: sha256(readText(file))
    };
  });
}

function winnerRows(publicComposition, legacyComposition) {
  return [...publicComposition.winnerById.entries()]
    .map(([assetId, winner]) => {
      const all = publicComposition.occurrences.get(assetId) ?? [];
      const legacyWinner = legacyComposition.winnerById.get(assetId) ?? null;
      return {
        asset_id: assetId,
        occurrence_count: all.length,
        winning_file: winner.file,
        winning_file_order_index: winner.file_index,
        superseded_files: all.slice(0, -1).map((row) => row.file),
        legacy_winning_file: legacyWinner?.file ?? null,
        missing_from_legacy_planning_input: legacyWinner == null,
        public_winner_differs_from_legacy: legacyWinner != null && sha256(JSON.stringify(legacyWinner.row)) !== sha256(JSON.stringify(winner.row))
      };
    })
    .sort((left, right) => left.asset_id.localeCompare(right.asset_id));
}

export function buildPlanningInputCoverageAudit() {
  const configText = readText(paths.config);
  const config = JSON.parse(configText);
  const loaderText = readText(paths.publicLoader);
  const publicExportText = readText(paths.publicExport);
  const legacyBaselineText = readText(paths.legacyBaseline);
  const legacyBaseline = JSON.parse(legacyBaselineText);
  const baseBuilderText = readText(paths.baseBuilder);
  const canonicalBuilderText = readText(paths.canonicalBuilder);
  const v2BuilderText = readText(paths.v2Builder);
  const checkpoint = readJson(paths.checkpoint);

  const publicFiles = parsePublicProfileFiles(loaderText);
  const legacyFiles = legacyBaseline.data_groups?.profiles ?? [];
  const publicSet = new Set(publicFiles);
  const legacySet = new Set(legacyFiles);
  const missingFromPlanning = publicFiles.filter((file) => !legacySet.has(file));
  const legacyOnly = legacyFiles.filter((file) => !publicSet.has(file));
  const publicComposition = buildComposition(publicFiles);
  const legacyComposition = buildComposition(legacyFiles);
  const winners = winnerRows(publicComposition, legacyComposition);
  const duplicateAssets = winners.filter((row) => row.occurrence_count > 1);
  const missingAssetIds = winners.filter((row) => row.missing_from_legacy_planning_input).map((row) => row.asset_id);
  const changedWinnerAssetIds = winners.filter((row) => row.public_winner_differs_from_legacy).map((row) => row.asset_id);
  const orderedFiles = orderedFileReport(publicFiles, legacySet, publicComposition);
  const totalPublicRows = orderedFiles.reduce((sum, row) => sum + row.row_count, 0);
  const totalLegacyRows = legacyFiles.reduce((sum, file) => sum + fileRows(file).length, 0);

  const sourceDigest = sha256([
    configText,
    loaderText,
    publicExportText,
    legacyBaselineText,
    baseBuilderText,
    canonicalBuilderText,
    v2BuilderText,
    ...publicFiles.map((file) => readText(file))
  ].join('\0'));
  const manifestDigest = sha256(JSON.stringify({ publicFiles, orderedFiles, winners, sourceDigest }));

  const manifest = {
    schema_version: '1.0',
    manifest_id: 'sog_planning_input_manifest_pr371_v1',
    status: 'reviewed_internal_complete_profile_input_manifest',
    public_output: false,
    review_pr: 371,
    reviewed_at: config.reviewed_at,
    composition_semantics: {
      source_order: config.expected.planning_manifest_order,
      duplicate_asset_resolution: config.expected.public_loader_deduplication,
      exact_loader_source: paths.publicLoader
    },
    source_boundaries: {
      public_profile_loader: paths.publicLoader,
      legacy_registry_baseline: paths.legacyBaseline,
      legacy_baseline_id: legacyBaseline.baseline_id,
      current_checkpoint_id: checkpoint.checkpoint_id
    },
    ordered_profile_files: orderedFiles,
    counts: {
      ordered_file_count: orderedFiles.length,
      legacy_baseline_file_count: legacyFiles.length,
      reviewed_overlay_file_count: missingFromPlanning.length,
      total_row_occurrences: totalPublicRows,
      unique_asset_ids: publicComposition.winnerById.size,
      duplicate_asset_ids: duplicateAssets.length,
      duplicate_row_occurrences: totalPublicRows - publicComposition.winnerById.size
    },
    asset_winners: winners,
    manifest_digest_sha256: manifestDigest,
    source_digest_sha256: sourceDigest
  };

  const audit = {
    schema_version: '1.0',
    audit_id: 'sog_planning_input_coverage_audit_pr371_2026_07_15',
    status: 'reviewed_complete',
    public_output: false,
    review_pr: 371,
    reviewed_at: config.reviewed_at,
    source_checkpoint: {
      assets: checkpoint.expected_counts.assets,
      evidence: checkpoint.expected_counts.evidence,
      deployments: checkpoint.expected_counts.deployments,
      market_access_records: checkpoint.expected_counts.market_access_records
    },
    public_loader: {
      file_count: publicFiles.length,
      total_row_occurrences: totalPublicRows,
      unique_asset_ids: publicComposition.winnerById.size,
      duplicate_asset_ids: duplicateAssets.length,
      duplicate_row_occurrences: totalPublicRows - publicComposition.winnerById.size,
      deduplication: 'last_write_wins',
      profile_export_delegates_to_current_loader: publicExportText.includes("from './currentProfiles'")
    },
    legacy_planning_input: {
      file_count: legacyFiles.length,
      total_row_occurrences: totalLegacyRows,
      unique_asset_ids: legacyComposition.winnerById.size,
      source: paths.legacyBaseline
    },
    coverage_gap: {
      missing_profile_file_count: missingFromPlanning.length,
      missing_profile_files: missingFromPlanning,
      legacy_only_file_count: legacyOnly.length,
      legacy_only_files: legacyOnly,
      asset_ids_missing_from_legacy_input_count: missingAssetIds.length,
      asset_ids_missing_from_legacy_input: missingAssetIds,
      asset_ids_with_changed_public_winner_count: changedWinnerAssetIds.length,
      asset_ids_with_changed_public_winner: changedWinnerAssetIds,
      affected_asset_id_count: uniq([...missingAssetIds, ...changedWinnerAssetIds]).length,
      affected_asset_ids: uniq([...missingAssetIds, ...changedWinnerAssetIds]).sort()
    },
    planning_code_path: {
      base_builder_uses_legacy_registry_profile_group: baseBuilderText.includes("const profiles = group('profiles');"),
      reviewed_builder_delegates_to_base_builder: canonicalBuilderText.includes("from './build-record-depth-baseline-pr353.mjs'") && canonicalBuilderText.includes('buildRecordDepthBaseline()'),
      canonical_builder_uses_legacy_registry_profile_group: baseBuilderText.includes("const profiles = group('profiles');"),
      canonical_builder_defaults_profile_overrides_empty: canonicalBuilderText.includes('const profileOverrideFiles = options.profileOverrideFiles ?? [];'),
      v2_builder_calls_canonical_builder_without_options: v2BuilderText.includes('const current = buildReviewedRecordDepthBaseline();'),
      current_planning_input_matches_public_loader: false
    },
    decision: {
      complete_manifest_required: true,
      approved_manifest: outputPaths.manifest,
      next_work_item: config.next_work_item,
      baseline_recompute_allowed_in_pr371: false,
      canonical_data_change_allowed: false,
      public_surface_change_allowed: false,
      review_gate_after_pr372: config.review_gate_after_next_work_item
    },
    findings: [
      `The public profile loader composes ${publicFiles.length} ordered files while the legacy planning baseline lists ${legacyFiles.length}.`,
      `${missingFromPlanning.length} reviewed overlay files are absent from the default planning profile input.`,
      `${missingAssetIds.length} public profile asset IDs are absent from the legacy planning profile composition.`,
      `${changedWinnerAssetIds.length} asset IDs have a public last-write-wins profile that differs from the legacy planning winner.`,
      'The corrected planning manifest must preserve exact public loader order and last-write-wins semantics before PR #372 recomputes the baseline.'
    ],
    boundaries: {
      canonical_data_changed: false,
      public_loader_changed: false,
      public_surface_changed: false,
      baseline_recomputed: false,
      historical_outputs_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    manifest_digest_sha256: manifestDigest,
    source_digest_sha256: sourceDigest
  };

  return { manifest, audit };
}

export function writePlanningInputCoverageAudit(outputs = buildPlanningInputCoverageAudit()) {
  for (const [key, file] of Object.entries(outputPaths)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildPlanningInputCoverageAudit();
  if (process.argv.includes('--check')) {
    for (const [key, file] of Object.entries(outputPaths)) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else writePlanningInputCoverageAudit(outputs);
  console.log(JSON.stringify({
    ok: true,
    manifest_id: outputs.manifest.manifest_id,
    public_profile_files: outputs.audit.public_loader.file_count,
    legacy_planning_profile_files: outputs.audit.legacy_planning_input.file_count,
    missing_profile_files: outputs.audit.coverage_gap.missing_profile_file_count,
    public_unique_asset_ids: outputs.audit.public_loader.unique_asset_ids,
    legacy_unique_asset_ids: outputs.audit.legacy_planning_input.unique_asset_ids,
    affected_asset_ids: outputs.audit.coverage_gap.affected_asset_id_count,
    next_work_item: outputs.audit.decision.next_work_item
  }, null, 2));
}
