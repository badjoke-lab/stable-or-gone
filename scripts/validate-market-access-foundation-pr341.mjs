import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const schema = read('schemas/market-access-record-v1.schema.json');
const governance = read('config/market-access-governance-v1.json');
const records = read('data/market-access-records-v1.json');
const foundation = read('docs/migration/market-access-record-foundation-pr341.json');
const research = read('data/editorial-research/japan-stablecoin-market-access-2026.json');
const review = read('artifacts/market-access-migration-review-pr341.json');
const spec = fs.readFileSync(path.join(root, 'docs/market-access-record-spec.md'), 'utf8');
const baseline = loadRegistryV2Baseline(root);
const stablecoinRows = (baseline.data_groups?.stablecoins ?? []).flatMap(read);
const assetIds = new Set(stablecoinRows.map((row) => row.id));

const requiredTopLevel = new Set(schema.required ?? []);
const functionEnum = new Set(schema.properties?.function?.enum ?? []);
const accessStateEnum = new Set(schema.properties?.access_state?.enum ?? []);
const networkKindEnum = new Set(schema.properties?.network_scope?.properties?.kind?.enum ?? []);
const customerKindEnum = new Set(schema.properties?.customer_scope?.properties?.kind?.enum ?? []);
const logicalUnit = governance.record_unit ?? [];

expect(schema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'schema must use JSON Schema draft 2020-12');
expect(schema.title === 'Stable or Gone Market Access Record v1', 'schema title mismatch');
expect(schema.type === 'object', 'record schema root must be object');
expect(schema.additionalProperties === false, 'record schema must reject unknown top-level properties');
for (const field of ['id','schema_version','asset_id','jurisdiction','platform','function','access_state','effective_from','observed_at','network_scope','customer_scope','conditions','evidence_ids','confidence','review_status']) {
  expect(requiredTopLevel.has(field), `schema required field missing: ${field}`);
}
expect(schema.properties?.schema_version?.const === '1.0', 'record schema version must be 1.0');
expect(schema.properties?.review_status?.const === 'reviewed', 'canonical record review_status must be reviewed');
expect(schema.properties?.evidence_ids?.minItems === 1, 'canonical records must require at least one evidence ID');
expect(functionEnum.size === 6, `function vocabulary must contain 6 values, found ${functionEnum.size}`);
for (const value of ['buy_sell','deposit','withdrawal','external_wallet_transfer','direct_issuer_mint','direct_issuer_redemption']) expect(functionEnum.has(value), `function vocabulary missing ${value}`);
for (const value of ['available','available_with_conditions','account_internal_only','unavailable','temporarily_unavailable','restricted_customer_scope','restricted_network_scope','not_assessed','unknown']) expect(accessStateEnum.has(value), `access-state vocabulary missing ${value}`);
for (const value of ['any_platform_supported_network','specific_networks','account_internal_only','not_applicable','unknown']) expect(networkKindEnum.has(value), `network-scope vocabulary missing ${value}`);
for (const value of ['all_supported_customers','retail','institutional','business','qualified_only','mixed_or_platform_defined','unknown']) expect(customerKindEnum.has(value), `customer-scope vocabulary missing ${value}`);

expect(governance.schema_version === '1.0', 'governance schema version mismatch');
expect(governance.status === 'canonical_contract', 'governance status must be canonical_contract');
expect(governance.record_schema === 'schemas/market-access-record-v1.schema.json', 'governance schema binding mismatch');
expect(governance.canonical_data_path === 'data/market-access-records-v1.json', 'governance data-path binding mismatch');
expect(governance.promotion_policy?.automatic_promotion === false, 'automatic canonical promotion must be disabled');
expect(governance.promotion_policy?.review_required === true, 'manual review must be required');
expect(governance.promotion_policy?.editorial_research_is_canonical_source === false, 'editorial research must remain noncanonical');
expect(governance.promotion_policy?.monitoring_output_is_canonical_source === false, 'monitoring output must remain noncanonical');
expect(governance.promotion_policy?.minimum_canonical_evidence_records === 1, 'promotion must require at least one canonical evidence record');
expect(governance.temporal_policy?.append_history === true, 'market-access history must append state changes');
expect(governance.temporal_policy?.backfill_future_state_into_old_record === false, 'future state backfill must be forbidden');
expect(governance.temporal_policy?.state_change_requires_new_effective_from === true, 'state changes must require a new effective date');
expect(governance.publication_policy?.raw_monitoring_public === false, 'raw monitoring must remain private');
expect(governance.publication_policy?.unreviewed_candidates_public === false, 'unreviewed candidates must remain private');
expect(governance.pr341_boundary?.promote_pr339_rows_to_canonical === false, 'PR #341 must not promote PR #339 rows');
expect(governance.pr341_boundary?.change_comparison_readiness_output === false, 'PR #341 must not change comparison readiness output');
expect(logicalUnit.length === 8, `logical record unit must contain 8 axes, found ${logicalUnit.length}`);
for (const axis of ['asset_id','jurisdiction.country_code','jurisdiction.subdivision_code','platform.name','platform.service','function','access_state','effective_from']) expect(logicalUnit.includes(axis), `logical record unit missing axis ${axis}`);

expect(Array.isArray(records), 'canonical Market Access entrypoint must be an array');
expect(records.length === 0, `PR #341 canonical Market Access record count must be 0, found ${records.length}`);

expect(foundation.schema_version === '1.0', 'foundation schema version mismatch');
expect(foundation.status === 'schema_and_governance_foundation', 'foundation status mismatch');
expect(foundation.record_schema === governance.record_schema, 'foundation schema path differs from governance');
expect(foundation.governance_contract === 'config/market-access-governance-v1.json', 'foundation governance path mismatch');
expect(foundation.canonical_data_path === governance.canonical_data_path, 'foundation data path differs from governance');
expect(foundation.canonical_record_count === 0, 'foundation canonical record count must be zero');
expect(foundation.source_research_record_count === 3, 'foundation must bind 3 source research rows');
expect(foundation.migration_action === 'review_only_no_promotion', 'foundation migration action must remain review-only');
expect(foundation.public_canonical_count_change === 0, 'PR #341 must not change public canonical counts');
expect(foundation.next_item === 'PR #342 facet-freshness derivation contract and validators', 'foundation next item mismatch');

expect(research.status === 'reviewed_research_checkpoint', 'source research status mismatch');
expect(research.canonical_boundary?.canonical_action === 'none', 'source research canonical action must remain none');
expect(research.canonical_boundary?.included_in_public_canonical_counts === false, 'source research must remain outside canonical counts');
expect((research.records ?? []).length === 3, `source research record count must remain 3, found ${(research.records ?? []).length}`);
for (const sourceRow of research.records ?? []) {
  expect(assetIds.has(sourceRow.asset_id), `${sourceRow.record_id}: source research asset does not exist in canonical registry`);
  expect(sourceRow.jurisdiction_code === 'JP', `${sourceRow.record_id}: PR #339 source jurisdiction must remain JP`);
  expect(Object.keys(sourceRow.functions ?? {}).length === 6, `${sourceRow.record_id}: source research row must expose 6 function observations`);
}

expect(review.schema_version === '1.0', 'migration review schema version mismatch');
expect(review.review_id === 'sog_market_access_migration_review_pr341_2026_07_10', 'migration review ID mismatch');
expect(review.source_research_id === research.research_id, 'migration review source research mismatch');
expect(review.governance_id === governance.governance_id, 'migration review governance mismatch');
expect(review.canonical_action === 'none', 'migration review must not take canonical action');
expect(review.source_research_record_count === 3, 'migration review must bind 3 source rows');
expect(review.flattened_candidate_count === 18, `migration review must flatten to 18 candidates, found ${review.flattened_candidate_count}`);
expect(review.promotion_ready_count === 0, 'PR #341 promotion-ready count must remain zero');
expect((review.records ?? []).length === 18, `migration review record list must contain 18 rows, found ${(review.records ?? []).length}`);

const candidateKeys = new Set();
for (const row of review.records ?? []) {
  const label = `${row.source_record_id}/${row.function}`;
  expect(row.asset_exists === true, `${label}: candidate asset identity missing`);
  expect(functionEnum.has(row.function), `${label}: function is outside canonical vocabulary`);
  expect(accessStateEnum.has(row.mapped_access_state), `${label}: mapped state is outside canonical vocabulary`);
  expect(row.jurisdiction_code === 'JP', `${label}: jurisdiction mismatch`);
  expect(row.automatic_promotion === false, `${label}: automatic promotion must remain false`);
  expect(['blocked_missing_canonical_evidence','review_required_claim_scope_check'].includes(row.migration_status), `${label}: unsupported migration status`);
  const key = [row.asset_id,row.jurisdiction_code,row.platform,row.platform_service,row.function,row.effective_from].join('|');
  expect(!candidateKeys.has(key), `${label}: duplicate flattened candidate identity`);
  candidateKeys.add(key);
}

for (const text of [
  'one function-scoped observation per record',
  'A platform observation must not be generalized into a jurisdiction-wide claim.',
  'Every canonical Market Access Record requires at least one canonical `evidence_id`.',
  'Raw monitoring output, stale-state output, source-discovery leads, and rejected candidates remain outside public canonical data.',
  'PR #341 does not change Comparison Readiness output.'
]) expect(spec.includes(text), `market-access spec missing required boundary text: ${text}`);

if (failures.length) {
  console.error('PR #341 Market Access foundation validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  canonical_record_count: records.length,
  source_research_record_count: research.records.length,
  flattened_candidate_count: review.flattened_candidate_count,
  promotion_ready_count: review.promotion_ready_count,
  migration_status_counts: review.migration_status_counts,
  function_vocabulary_count: functionEnum.size,
  access_state_vocabulary_count: accessStateEnum.size,
  next_item: foundation.next_item
}, null, 2));
