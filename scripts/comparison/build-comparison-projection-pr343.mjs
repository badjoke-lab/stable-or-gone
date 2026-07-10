import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from '../load-registry-v2-baseline.mjs';
import { buildComparisonReadinessAudit } from './build-readiness-audit-pr337.mjs';
import { buildFacetFreshnessAudit } from './build-facet-freshness-pr342.mjs';

const root = process.cwd();
const PROJECTION_CONTRACT_PATH = 'data/quality/comparison-projection-contract-v1.json';
const V3_FOUNDATION_PATH = 'docs/migration/registry-v3-foundation.json';
const MARKET_ACCESS_PATH = 'data/market-access-records-v1.json';
const LAUNCH_QUEUE_PATH = 'data/quality/launch-date-unresolved.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const unique = (values) => [...new Set(values)];
const byAsset = (rows, getIds) => {
  const map = new Map();
  for (const row of rows) {
    for (const id of unique(getIds(row).filter(Boolean))) {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(row);
    }
  }
  return map;
};
const sortStrings = (values) => unique(values.filter(Boolean)).sort();
const pick = (row, fields) => Object.fromEntries(fields.map((field) => [field, row?.[field] ?? null]));
const latestByDate = (rows, fields) => [...rows].sort((a, b) => {
  const left = fields.map((field) => a?.[field]).find(Boolean) ?? '';
  const right = fields.map((field) => b?.[field]).find(Boolean) ?? '';
  return String(right).localeCompare(String(left)) || String(a.id ?? '').localeCompare(String(b.id ?? ''));
})[0] ?? null;

export function buildComparisonProjection() {
  const contract = readJson(PROJECTION_CONTRACT_PATH);
  const readinessAudit = buildComparisonReadinessAudit();
  const freshnessAudit = buildFacetFreshnessAudit();
  const baseline = loadRegistryV2Baseline(root);
  const v3Foundation = readJson(V3_FOUNDATION_PATH);
  const marketAccessRecords = readJson(MARKET_ACCESS_PATH);
  const launchQueue = readJson(LAUNCH_QUEUE_PATH);

  const sourceFiles = new Set([PROJECTION_CONTRACT_PATH, V3_FOUNDATION_PATH, MARKET_ACCESS_PATH, LAUNCH_QUEUE_PATH]);
  for (const files of Object.values(baseline.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);
  for (const files of Object.values(v3Foundation.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);

  const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap((file) => readJson(file));
  const v3Group = (name) => (v3Foundation.data_groups?.[name] ?? []).flatMap((file) => readJson(file));

  const stablecoins = group('stablecoins').sort((a, b) => a.id.localeCompare(b.id));
  const organizations = group('organizations');
  const relationships = group('relationships');
  const classifications = group('classifications');
  const profiles = group('profiles');
  const reserveReports = group('reserve_reports');
  const evidence = group('evidence');
  const knownUnknowns = group('known_unknowns');
  const regulatoryNotes = group('regulatory_notes');
  const legalProfiles = v3Group('legal_profiles');
  const reserveComponents = v3Group('reserve_components');

  const organizationById = new Map(organizations.map((row) => [row.id, row]));
  const classificationById = new Map(classifications.map((row) => [row.id, row]));
  const profileById = new Map(profiles.map((row) => [row.id, row]));
  const legalById = new Map(legalProfiles.map((row) => [row.id, row]));
  const launchQueueByAsset = new Map((launchQueue.records ?? []).map((row) => [row.stablecoin_id, row]));
  const readinessByAsset = new Map(readinessAudit.assets.map((row) => [row.asset_id, row]));
  const freshnessByAsset = new Map(freshnessAudit.assets.map((row) => [row.asset_id, row]));

  const relationshipsByAsset = byAsset(relationships, (row) => [row.stablecoin_id]);
  const reportsByAsset = byAsset(reserveReports, (row) => [row.stablecoin_id]);
  const evidenceByAsset = byAsset(evidence, (row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  const unknownsByAsset = byAsset(knownUnknowns, (row) => [row.stablecoin_id]);
  const regulatoryByAsset = byAsset(regulatoryNotes, (row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  const componentsByAsset = byAsset(reserveComponents, (row) => [row.stablecoin_id]);
  const marketAccessByAsset = byAsset(marketAccessRecords, (row) => [row.asset_id]);

  const projectValue = (dimensionId, asset) => {
    const classification = classificationById.get(asset.id);
    const profile = profileById.get(asset.id);
    const legal = legalById.get(asset.id);
    const rels = relationshipsByAsset.get(asset.id) ?? [];
    const reports = reportsByAsset.get(asset.id) ?? [];
    const assetEvidence = evidenceByAsset.get(asset.id) ?? [];
    const assetUnknowns = unknownsByAsset.get(asset.id) ?? [];
    const assetRegulatory = regulatoryByAsset.get(asset.id) ?? [];
    const assetComponents = componentsByAsset.get(asset.id) ?? [];
    const assetAccess = marketAccessByAsset.get(asset.id) ?? [];

    switch (dimensionId) {
      case 'identity_consistency':
        return { name: asset.name, symbol: asset.symbol ?? null, aliases: sortStrings(asset.aliases ?? []) };
      case 'issuer_asset_boundary':
        return {
          relationships: rels
            .map((row) => ({
              organization_id: row.organization_id ?? null,
              organization_name: organizationById.get(row.organization_id)?.name ?? null,
              role: row.role ?? null,
              status: row.status ?? null,
              start_date: row.start_date ?? null,
              end_date: row.end_date ?? null
            }))
            .sort((a, b) => String(a.organization_id).localeCompare(String(b.organization_id)) || String(a.role).localeCompare(String(b.role)))
        };
      case 'lifecycle_semantics':
        return { lifecycle_status: classification?.lifecycle_status ?? null };
      case 'reference_target_and_currency':
        return { peg_reference: classification?.peg_reference ?? null };
      case 'asset_class':
        return { asset_class: classification?.asset_class ?? null };
      case 'backing_model_representation':
        return {
          backing_types: sortStrings(classification?.backing_types ?? []),
          reserve_components: assetComponents
            .map((row) => pick(row, ['id', 'asset_category', 'asset_label', 'as_of_date', 'confidence']))
            .sort((a, b) => String(a.id).localeCompare(String(b.id)))
        };
      case 'stabilization_mechanism_representation':
        return {
          stabilization_mechanism: classification?.stabilization_mechanism ?? null,
          governance_model: classification?.governance_model ?? null
        };
      case 'reserve_disclosure_comparability':
        return {
          reserve_profile: profile?.reserve_profile ? pick(profile.reserve_profile, ['disclosure_status', 'as_of_date', 'latest_report_id', 'confidence']) : null,
          reserve_report_count: reports.length,
          reserve_component_count: assetComponents.length
        };
      case 'reserve_report_date_semantics': {
        const latest = latestByDate(reports, ['report_date', 'as_of_date']);
        return {
          reserve_report_count: reports.length,
          latest_report: latest ? pick(latest, ['id', 'report_type', 'report_date', 'as_of_date', 'period_start', 'period_end']) : null
        };
      }
      case 'issuance_comparability':
        return { issuance_status: classification?.issuance_status ?? null };
      case 'redemption_comparability':
        return {
          redemption_profile: profile?.redemption_profile
            ? pick(profile.redemption_profile, ['status', 'settlement_asset', 'eligible_parties', 'retail_access', 'institutional_access', 'minimum_amount_text', 'fee_text', 'settlement_time_text', 'jurisdiction_restrictions', 'as_of_date', 'confidence'])
            : null
        };
      case 'legal_classification_comparability':
        return legal
          ? {
              classifications: [...(legal.classifications ?? [])].sort((a, b) => String(a.jurisdiction ?? '').localeCompare(String(b.jurisdiction ?? '')) || String(a.classification ?? '').localeCompare(String(b.classification ?? ''))),
              holder_claim_type: legal.holder_claim_type ?? null,
              reserve_ownership: legal.reserve_ownership ?? null,
              reserve_segregation: legal.reserve_segregation ?? null,
              bankruptcy_remoteness: legal.bankruptcy_remoteness ?? null,
              licensed_or_regulated_as: sortStrings(legal.licensed_or_regulated_as ?? [])
            }
          : null;
      case 'regulatory_action_scope':
        return {
          record_count: assetRegulatory.length,
          records: assetRegulatory
            .map((row) => pick(row, ['id', 'note_type', 'note_date', 'jurisdiction', 'authority_or_source', 'summary']))
            .sort((a, b) => String(a.note_date ?? '').localeCompare(String(b.note_date ?? '')) || String(a.id).localeCompare(String(b.id)))
        };
      case 'market_access_applicability':
        return {
          record_state: assetAccess.length ? 'canonical_records_present' : 'no_canonical_record',
          record_count: assetAccess.length,
          records: assetAccess.map((row) => ({
            id: row.id,
            jurisdiction: row.jurisdiction,
            platform: row.platform,
            function: row.function,
            access_state: row.access_state,
            effective_from: row.effective_from,
            effective_to: row.effective_to ?? null,
            observed_at: row.observed_at,
            network_scope: row.network_scope,
            customer_scope: row.customer_scope,
            conditions: row.conditions
          })).sort((a, b) => String(a.id).localeCompare(String(b.id)))
        };
      case 'launch_date_semantics': {
        const queueRow = launchQueueByAsset.get(asset.id);
        return {
          launch_date: asset.launch_date ?? null,
          unresolved_tracking: asset.launch_date == null ? (queueRow ? 'tracked_unknown' : 'untracked_null') : 'not_applicable'
        };
      }
      case 'verification_date_semantics':
        return { last_verified_at: asset.last_verified_at ?? null };
      case 'unknown_state_semantics': {
        const readinessRow = readinessByAsset.get(asset.id)?.dimensions.find((row) => row.dimension_id === dimensionId);
        return {
          protected_unresolved_state_visible: readinessRow?.state === 'ready_with_unknowns',
          known_unknown_count: assetUnknowns.length
        };
      }
      case 'evidence_scope_and_relation_depth':
        return {
          evidence_count: assetEvidence.length,
          claim_scopes: sortStrings(assetEvidence.flatMap((row) => [row.claim_scope, ...(row.claim_scopes ?? [])]))
        };
      case 'known_unknown_visibility':
        return {
          record_count: assetUnknowns.length,
          topics: sortStrings(assetUnknowns.map((row) => row.topic)),
          severity_counts: assetUnknowns.reduce((counts, row) => {
            const key = row.severity ?? 'unknown';
            counts[key] = (counts[key] ?? 0) + 1;
            return counts;
          }, {})
        };
      default:
        throw new Error(`Unsupported comparison projection dimension: ${dimensionId}`);
    }
  };

  const assets = stablecoins.map((asset) => {
    const readinessAsset = readinessByAsset.get(asset.id);
    const freshnessAsset = freshnessByAsset.get(asset.id);
    if (!readinessAsset || !freshnessAsset) throw new Error(`Missing readiness or freshness audit row for ${asset.id}`);

    const facets = readinessAsset.dimensions.map((readinessRow) => {
      const freshnessRow = freshnessAsset.facets.find((row) => row.dimension_id === readinessRow.dimension_id);
      if (!freshnessRow) throw new Error(`Missing freshness row for ${asset.id}/${readinessRow.dimension_id}`);
      return {
        dimension_id: readinessRow.dimension_id,
        value: projectValue(readinessRow.dimension_id, asset),
        readiness: {
          state: readinessRow.state,
          scored: readinessRow.readiness_scored
        },
        freshness: {
          state: freshnessRow.freshness_state,
          anchor_date: freshnessRow.anchor_date,
          age_days: freshnessRow.age_days,
          date_semantics: freshnessRow.date_semantics,
          inherited_review_anchor: freshnessRow.inherited_review_anchor
        }
      };
    });

    return {
      asset_id: asset.id,
      slug: asset.slug,
      name: asset.name,
      symbol: asset.symbol ?? null,
      overall_readiness: readinessAsset.overall_state,
      facets
    };
  });

  const digest = crypto.createHash('sha256');
  for (const file of [...sourceFiles].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
    digest.update('\0');
  }
  digest.update(readinessAudit.input_digest_sha256);
  digest.update('\0');
  digest.update(freshnessAudit.input_digest_sha256);

  return {
    schema_version: '1.0',
    projection_id: 'sog_comparison_projection_pr343_v1',
    status: 'public_canonical_projection',
    generated_at: freshnessAudit.as_of_date,
    checkpoint_id: readinessAudit.checkpoint_id,
    readiness_contract_id: readinessAudit.contract_id,
    freshness_contract_id: freshnessAudit.contract_id,
    projection_contract_id: contract.contract_id,
    data_safety: contract.data_safety,
    asset_count: assets.length,
    dimension_count: readinessAudit.dimension_count,
    cell_count: assets.reduce((sum, asset) => sum + asset.facets.length, 0),
    single_composite_score: false,
    input_digest_sha256: digest.digest('hex'),
    dimensions: readinessAudit.summary.dimension_states.map((row) => ({
      dimension_id: row.dimension_id,
      readiness_scored: row.readiness_scored
    })),
    summary: {
      readiness_asset_states: readinessAudit.summary.asset_states,
      freshness_states: freshnessAudit.summary.freshness_states
    },
    assets
  };
}

export function serializeComparisonProjection(projection) {
  return `${JSON.stringify(projection, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const projection = buildComparisonProjection();
  const serialized = serializeComparisonProjection(projection);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
    fs.writeFileSync(path.join(root, outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
