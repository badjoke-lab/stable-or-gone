import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildComparisonProjection } from '../comparison/build-comparison-projection-pr343.mjs';

const root = process.cwd();
const CONTRACT_PATH = 'data/quality/access-regulation-index-contract-v1.json';
const GOVERNANCE_PATH = 'config/market-access-governance-v1.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const uniqueSorted = (values) => [...new Set(values.filter((value) => value !== null && value !== undefined && value !== '').map((value) => String(value)))].sort();
const asObject = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const asArray = (value) => Array.isArray(value) ? value : [];

function facet(asset, dimensionId) {
  const row = asset.facets.find((candidate) => candidate.dimension_id === dimensionId);
  if (!row) throw new Error(`Missing comparison facet ${asset.asset_id}/${dimensionId}`);
  return row;
}

function publicState(facetRow) {
  return {
    readiness: facetRow.readiness,
    freshness: facetRow.freshness
  };
}

function deriveLegalProfileState(legalValue) {
  const legal = asObject(legalValue);
  const classifications = asArray(legal.classifications);
  if (!classifications.length) return 'no_classification_record';
  const explicit = classifications.some((row) => asObject(row).classification && asObject(row).classification !== 'unclassified');
  return explicit ? 'explicit_classification_present' : 'unclassified_only';
}

function countAssetsByToken(rows, getter) {
  const values = new Map();
  for (const row of rows) {
    for (const value of uniqueSorted(getter(row))) values.set(value, (values.get(value) ?? 0) + 1);
  }
  return [...values.entries()].map(([value, asset_count]) => ({ value, asset_count })).sort((left, right) => right.asset_count - left.asset_count || left.value.localeCompare(right.value));
}

export function buildAccessRegulationIndex() {
  const contract = readJson(CONTRACT_PATH);
  const governance = readJson(GOVERNANCE_PATH);
  const projection = buildComparisonProjection();

  if (projection.projection_id !== contract.source_projection_id) {
    throw new Error(`Projection ID mismatch: ${projection.projection_id} != ${contract.source_projection_id}`);
  }
  if (governance.governance_id !== contract.market_access_governance_id) {
    throw new Error(`Market Access governance mismatch: ${governance.governance_id} != ${contract.market_access_governance_id}`);
  }

  const rows = projection.assets.map((asset) => {
    const lifecycleFacet = facet(asset, 'lifecycle_semantics');
    const legalFacet = facet(asset, 'legal_classification_comparability');
    const regulatoryFacet = facet(asset, 'regulatory_action_scope');
    const accessFacet = facet(asset, 'market_access_applicability');

    const lifecycle = asObject(lifecycleFacet.value);
    const legal = asObject(legalFacet.value);
    const regulatory = asObject(regulatoryFacet.value);
    const marketAccess = asObject(accessFacet.value);

    const legalClassifications = asArray(legal.classifications).map((row) => {
      const value = asObject(row);
      return {
        classification: value.classification ?? null,
        jurisdiction: value.jurisdiction ?? null,
        effective_from: value.effective_from ?? null,
        effective_to: value.effective_to ?? null,
        authority_or_basis: value.authority_or_basis ?? null,
        confidence: value.confidence ?? null
      };
    }).sort((left, right) => String(left.jurisdiction ?? '').localeCompare(String(right.jurisdiction ?? '')) || String(left.classification ?? '').localeCompare(String(right.classification ?? '')) || String(left.effective_from ?? '').localeCompare(String(right.effective_from ?? '')));

    const regulatoryRecords = asArray(regulatory.records).map((row) => {
      const value = asObject(row);
      return {
        id: value.id ?? null,
        note_type: value.note_type ?? null,
        note_date: value.note_date ?? null,
        jurisdiction: value.jurisdiction ?? null,
        authority_or_source: value.authority_or_source ?? null,
        summary: value.summary ?? null
      };
    }).sort((left, right) => String(left.note_date ?? '').localeCompare(String(right.note_date ?? '')) || String(left.id ?? '').localeCompare(String(right.id ?? '')));

    const marketAccessRecords = asArray(marketAccess.records).map((row) => {
      const value = asObject(row);
      const jurisdiction = asObject(value.jurisdiction);
      const platform = asObject(value.platform);
      return {
        id: value.id ?? null,
        jurisdiction: {
          country_code: jurisdiction.country_code ?? null,
          subdivision_code: jurisdiction.subdivision_code ?? null
        },
        platform: {
          name: platform.name ?? null,
          service: platform.service ?? null
        },
        function: value.function ?? null,
        access_state: value.access_state ?? null,
        effective_from: value.effective_from ?? null,
        effective_to: value.effective_to ?? null,
        observed_at: value.observed_at ?? null,
        network_scope: value.network_scope ?? null,
        customer_scope: value.customer_scope ?? null,
        conditions: asArray(value.conditions)
      };
    }).sort((left, right) => String(left.jurisdiction.country_code ?? '').localeCompare(String(right.jurisdiction.country_code ?? '')) || String(left.platform.name ?? '').localeCompare(String(right.platform.name ?? '')) || String(left.function ?? '').localeCompare(String(right.function ?? '')) || String(left.effective_from ?? '').localeCompare(String(right.effective_from ?? '')));

    const legalProfileState = deriveLegalProfileState(legal);
    const regulatoryRecordState = regulatoryRecords.length ? 'canonical_records_present' : 'no_canonical_record';
    const marketAccessRecordState = marketAccessRecords.length ? 'canonical_records_present' : 'no_canonical_record';

    const filterTokens = {
      lifecycle_status: uniqueSorted([lifecycle.lifecycle_status]),
      legal_profile_state: [legalProfileState],
      legal_classification: uniqueSorted(legalClassifications.map((row) => row.classification)),
      legal_jurisdiction: uniqueSorted(legalClassifications.map((row) => row.jurisdiction)),
      licensed_or_regulated_as: uniqueSorted(asArray(legal.licensed_or_regulated_as)),
      regulatory_record_state: [regulatoryRecordState],
      regulatory_note_type: uniqueSorted(regulatoryRecords.map((row) => row.note_type)),
      regulatory_jurisdiction: uniqueSorted(regulatoryRecords.map((row) => row.jurisdiction)),
      regulatory_authority_or_source: uniqueSorted(regulatoryRecords.map((row) => row.authority_or_source)),
      market_access_record_state: [marketAccessRecordState],
      market_access_jurisdiction: uniqueSorted(marketAccessRecords.map((row) => row.jurisdiction.country_code)),
      market_access_function: uniqueSorted(marketAccessRecords.map((row) => row.function)),
      market_access_state: uniqueSorted(marketAccessRecords.map((row) => row.access_state)),
      market_access_platform: uniqueSorted(marketAccessRecords.map((row) => row.platform.name))
    };

    return {
      asset_id: asset.asset_id,
      slug: asset.slug,
      name: asset.name,
      symbol: asset.symbol,
      lifecycle_status: lifecycle.lifecycle_status ?? null,
      legal: {
        profile_state: legalProfileState,
        classifications: legalClassifications,
        holder_claim_type: legal.holder_claim_type ?? null,
        reserve_ownership: legal.reserve_ownership ?? null,
        reserve_segregation: legal.reserve_segregation ?? null,
        bankruptcy_remoteness: legal.bankruptcy_remoteness ?? null,
        licensed_or_regulated_as: uniqueSorted(asArray(legal.licensed_or_regulated_as)),
        ...publicState(legalFacet)
      },
      regulatory: {
        record_state: regulatoryRecordState,
        record_count: regulatoryRecords.length,
        records: regulatoryRecords,
        ...publicState(regulatoryFacet)
      },
      market_access: {
        record_state: marketAccessRecordState,
        record_count: marketAccessRecords.length,
        records: marketAccessRecords,
        ...publicState(accessFacet)
      },
      filter_tokens: filterTokens
    };
  }).sort((left, right) => left.asset_id.localeCompare(right.asset_id));

  const filters = contract.index_axes.map((axis) => ({
    axis,
    values: countAssetsByToken(rows, (row) => row.filter_tokens[axis] ?? [])
  }));

  const summary = {
    asset_count: rows.length,
    legal_profile_states: Object.fromEntries(filters.find((row) => row.axis === 'legal_profile_state')?.values.map((row) => [row.value, row.asset_count]) ?? []),
    assets_with_regulatory_records: rows.filter((row) => row.regulatory.record_count > 0).length,
    regulatory_record_count: rows.reduce((sum, row) => sum + row.regulatory.record_count, 0),
    assets_with_market_access_records: rows.filter((row) => row.market_access.record_count > 0).length,
    market_access_record_count: rows.reduce((sum, row) => sum + row.market_access.record_count, 0)
  };

  const digest = crypto.createHash('sha256')
    .update(readText(CONTRACT_PATH))
    .update('\0')
    .update(readText(GOVERNANCE_PATH))
    .update('\0')
    .update(JSON.stringify(projection))
    .digest('hex');

  return {
    schema_version: '1.0',
    index_id: contract.contract_id,
    status: 'public_canonical_index',
    generated_at: projection.generated_at,
    checkpoint_id: projection.checkpoint_id,
    source_projection_id: projection.projection_id,
    market_access_governance_id: governance.governance_id,
    data_safety: contract.data_safety,
    absence_semantics: contract.absence_semantics,
    single_composite_score: false,
    risk_ranking: false,
    asset_count: rows.length,
    input_digest_sha256: digest,
    summary,
    filters,
    rows
  };
}

export function serializeAccessRegulationIndex(index) {
  return `${JSON.stringify(index, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const index = buildAccessRegulationIndex();
  const serialized = serializeAccessRegulationIndex(index);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
    fs.writeFileSync(path.join(root, outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
