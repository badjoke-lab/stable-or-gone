import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from '../load-registry-v2-baseline.mjs';

const root = process.cwd();
const CONTRACT_PATH = 'data/quality/facet-freshness-contract-v1.json';
const COMPARISON_CONTRACT_PATH = 'data/quality/comparison-readiness-contract-v1.json';
const MARKET_ACCESS_GOVERNANCE_PATH = 'config/market-access-governance-v1.json';
const MARKET_ACCESS_DATA_PATH = 'data/market-access-records-v1.json';
const V3_FOUNDATION_PATH = 'docs/migration/registry-v3-foundation.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const unique = (values) => [...new Set(values)];
const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const dayNumber = (value) => Math.floor(Date.parse(`${value}T00:00:00Z`) / 86400000);
const latestDay = (values) => values.filter(validDay).sort().at(-1) ?? null;

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

export function buildFacetFreshnessAudit() {
  const contract = readJson(CONTRACT_PATH);
  const comparisonContract = readJson(COMPARISON_CONTRACT_PATH);
  const marketAccessGovernance = readJson(MARKET_ACCESS_GOVERNANCE_PATH);
  const marketAccessRecords = readJson(MARKET_ACCESS_DATA_PATH);
  const baseline = loadRegistryV2Baseline(root);
  const v3Foundation = readJson(V3_FOUNDATION_PATH);

  const sourceFiles = new Set([
    CONTRACT_PATH,
    COMPARISON_CONTRACT_PATH,
    MARKET_ACCESS_GOVERNANCE_PATH,
    MARKET_ACCESS_DATA_PATH,
    V3_FOUNDATION_PATH
  ]);
  for (const files of Object.values(baseline.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);
  for (const files of Object.values(v3Foundation.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);

  const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap((file) => readJson(file));
  const v3Group = (name) => (v3Foundation.data_groups?.[name] ?? []).flatMap((file) => readJson(file));

  const stablecoins = group('stablecoins').sort((a, b) => a.id.localeCompare(b.id));
  const profiles = group('profiles');
  const reserveReports = group('reserve_reports');
  const regulatoryNotes = group('regulatory_notes');
  const evidence = group('evidence');
  const knownUnknowns = group('known_unknowns');
  const legalProfiles = v3Group('legal_profiles');

  const profileById = new Map(profiles.map((row) => [row.id, row]));
  const legalById = new Map(legalProfiles.map((row) => [row.id, row]));
  const reportsByAsset = byAsset(reserveReports, (row) => [row.stablecoin_id]);
  const regulatoryByAsset = byAsset(regulatoryNotes, (row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  const marketAccessByAsset = byAsset(marketAccessRecords, (row) => [row.asset_id]);
  const evidenceByAsset = byAsset(evidence, (row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  const unknownsByAsset = byAsset(knownUnknowns, (row) => [row.stablecoin_id]);

  const rulesByDimension = new Map(contract.dimension_rules.map((rule) => [rule.dimension_id, rule]));
  const asOfDay = dayNumber(contract.as_of_date);

  const resolveAnchor = (asset, rule) => {
    const profile = profileById.get(asset.id);
    const legal = legalById.get(asset.id);
    const reports = reportsByAsset.get(asset.id) ?? [];
    const regulatory = regulatoryByAsset.get(asset.id) ?? [];
    const access = marketAccessByAsset.get(asset.id) ?? [];
    const assetEvidence = evidenceByAsset.get(asset.id) ?? [];
    const assetUnknowns = unknownsByAsset.get(asset.id) ?? [];

    switch (rule.anchor_kind) {
      case 'asset_last_verified_at':
        return { anchor_date: validDay(asset.last_verified_at) ? asset.last_verified_at : null, record_count: 1 };
      case 'reserve_profile_as_of_date':
        return { anchor_date: validDay(profile?.reserve_profile?.as_of_date) ? profile.reserve_profile.as_of_date : null, record_count: profile?.reserve_profile ? 1 : 0 };
      case 'latest_reserve_report_date':
        return { anchor_date: latestDay(reports.flatMap((row) => [row.report_date, row.as_of_date])), record_count: reports.length };
      case 'redemption_profile_as_of_date':
        return { anchor_date: validDay(profile?.redemption_profile?.as_of_date) ? profile.redemption_profile.as_of_date : null, record_count: profile?.redemption_profile ? 1 : 0 };
      case 'legal_profile_review_date': {
        const dates = [legal?.reviewed_at, legal?.last_verified_at, legal?.as_of_date, ...(legal?.classifications ?? []).flatMap((row) => [row.reviewed_at, row.last_verified_at, row.as_of_date])];
        return { anchor_date: latestDay(dates), record_count: legal ? 1 : 0 };
      }
      case 'latest_regulatory_review_date':
        return { anchor_date: latestDay(regulatory.flatMap((row) => [row.reviewed_at, row.last_checked_at, row.last_verified_at])), record_count: regulatory.length };
      case 'latest_market_access_observed_at':
        return { anchor_date: latestDay(access.map((row) => row.observed_at)), record_count: access.length };
      case 'latest_evidence_accessed_at':
        return { anchor_date: latestDay(assetEvidence.map((row) => row.accessed_at)), record_count: assetEvidence.length };
      case 'latest_known_unknown_checked_at':
        return { anchor_date: latestDay(assetUnknowns.map((row) => row.last_checked_at)), record_count: assetUnknowns.length };
      default:
        throw new Error(`Unsupported facet freshness anchor kind: ${rule.anchor_kind}`);
    }
  };

  const deriveState = (rule, anchor) => {
    if (anchor.record_count === 0 && rule.no_record_state) {
      return { freshness_state: rule.no_record_state, age_days: null, reason_code: 'no_canonical_record' };
    }
    if (!anchor.anchor_date) {
      return { freshness_state: rule.no_date_state ?? 'undated', age_days: null, reason_code: 'explicit_freshness_anchor_missing' };
    }
    const ageDays = asOfDay - dayNumber(anchor.anchor_date);
    if (ageDays < 0) throw new Error(`Future freshness anchor ${anchor.anchor_date} for ${rule.dimension_id}`);
    const threshold = contract.threshold_profiles[rule.threshold_profile];
    if (!threshold) throw new Error(`Missing threshold profile ${rule.threshold_profile}`);
    if (ageDays <= threshold.fresh_max_days) return { freshness_state: 'fresh', age_days: ageDays, reason_code: 'within_fresh_window' };
    if (ageDays <= threshold.aging_max_days) return { freshness_state: 'aging', age_days: ageDays, reason_code: 'within_aging_window' };
    return { freshness_state: 'stale', age_days: ageDays, reason_code: 'beyond_aging_window' };
  };

  const assets = [];
  for (const asset of stablecoins) {
    const facets = comparisonContract.dimensions.map((dimension) => {
      const rule = rulesByDimension.get(dimension.id);
      if (!rule) throw new Error(`No freshness rule for comparison dimension ${dimension.id}`);
      const anchor = resolveAnchor(asset, rule);
      const derived = deriveState(rule, anchor);
      return {
        dimension_id: dimension.id,
        freshness_state: derived.freshness_state,
        anchor_kind: rule.anchor_kind,
        anchor_date: anchor.anchor_date,
        age_days: derived.age_days,
        threshold_profile: rule.threshold_profile,
        date_semantics: rule.date_semantics,
        inherited_review_anchor: rule.inherited_review_anchor,
        canonical_record_count: anchor.record_count,
        reason_code: derived.reason_code
      };
    });
    assets.push({ asset_id: asset.id, slug: asset.slug, facets });
  }

  const allCells = assets.flatMap((asset) => asset.facets);
  const stateSummary = Object.fromEntries(contract.freshness_states.map((state) => [state, allCells.filter((row) => row.freshness_state === state).length]));
  const dimensionSummary = comparisonContract.dimensions.map((dimension) => ({
    dimension_id: dimension.id,
    state_counts: Object.fromEntries(contract.freshness_states.map((state) => [state, assets.filter((asset) => asset.facets.find((row) => row.dimension_id === dimension.id)?.freshness_state === state).length]))
  }));

  const digest = crypto.createHash('sha256');
  for (const file of [...sourceFiles].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
    digest.update('\0');
  }

  return {
    schema_version: '1.0',
    audit_id: 'sog_facet_freshness_audit_pr342_110_assets',
    status: 'internal_deterministic_derivation',
    as_of_date: contract.as_of_date,
    contract_id: contract.contract_id,
    comparison_contract_id: comparisonContract.contract_id,
    market_access_governance_id: marketAccessGovernance.governance_id,
    canonical_only: true,
    public_output: false,
    single_composite_score: false,
    asset_count: assets.length,
    dimension_count: comparisonContract.dimensions.length,
    cell_count: allCells.length,
    input_digest_sha256: digest.digest('hex'),
    summary: {
      freshness_states: stateSummary,
      dimension_states: dimensionSummary
    },
    assets
  };
}

export function serializeFacetFreshnessAudit(audit) {
  return `${JSON.stringify(audit, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const audit = buildFacetFreshnessAudit();
  const output = serializeFacetFreshnessAudit(audit);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
    fs.writeFileSync(path.join(root, outputPath), output);
    console.log(outputPath);
  } else {
    process.stdout.write(output);
  }
}
