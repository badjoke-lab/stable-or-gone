import fs from 'node:fs';
import path from 'node:path';
import {
  comparisonPolicy,
  indexInteractionContracts,
  sharedInteractionPolicy
} from '../config/index-interaction-contract.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/index-interaction-audit.json');
const validationPath = path.join(root, 'data/generated/index-interaction-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (values) => new Set(values).size === values.length;

assert(fs.existsSync(auditPath), 'index interaction audit is missing');
if (!fs.existsSync(auditPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
assert(audit.schema_version === '1.0', 'audit schema version must be 1.0');
assert(indexInteractionContracts.length === 3, 'exactly three index contracts are required');
assert(JSON.stringify(indexInteractionContracts.map((item) => item.id)) === JSON.stringify(['stablecoins', 'organizations', 'events']), 'index contract order must be stablecoins, organizations, events');
assert(audit.totals?.index_contracts === 3, 'audit must contain three index contracts');
assert(audit.totals?.current_source_files === 3, 'all three current index source files must exist');
assert(audit.totals?.search_fields === 18, `expected 18 search fields, found ${audit.totals?.search_fields}`);
assert(audit.totals?.filters === 16, `expected 16 filters, found ${audit.totals?.filters}`);
assert(audit.totals?.sorts === 15, `expected 15 sorts, found ${audit.totals?.sorts}`);
assert(audit.totals?.mobile_row_fields === 26, `expected 26 mobile row fields, found ${audit.totals?.mobile_row_fields}`);
assert(audit.totals?.comparison_enabled_indexes === 1, 'only one index may enable comparison');
assert(audit.totals?.comparison_disabled_indexes === 2, 'two indexes must explicitly disable comparison');
assert(audit.totals?.route_changes === 0, 'PR 19 must not change routes');

const expectedRoutes = new Map([
  ['stablecoins', '/stablecoins/'],
  ['organizations', '/issuers/'],
  ['events', '/events/']
]);
const expectedCurrentHeaders = new Map([
  ['stablecoins', 9],
  ['organizations', 8],
  ['events', 8]
]);
const expectedCurrentSelects = new Map([
  ['stablecoins', 6],
  ['organizations', 6],
  ['events', 4]
]);

for (const contract of indexInteractionContracts) {
  assert(contract.route === expectedRoutes.get(contract.id), `${contract.id}: route changed unexpectedly`);
  assert(fs.existsSync(path.join(root, contract.source_file)), `${contract.id}: source file is missing`);
  assert(contract.search.query_param === 'q', `${contract.id}: search parameter must be q`);
  assert(contract.search.fields.length === 6, `${contract.id}: six explicit search fields are required`);
  assert(unique([...contract.search.fields]), `${contract.id}: search fields must be unique`);
  assert(JSON.stringify(contract.search.normalization) === JSON.stringify(['unicode_nfkc', 'case_fold', 'trim', 'collapse_whitespace']), `${contract.id}: search normalization is not approved`);
  assert(contract.search.fuzzy_matching === false, `${contract.id}: fuzzy matching must remain disabled until separately specified`);
  assert(contract.filters.length > 0, `${contract.id}: filters are missing`);
  assert(unique(contract.filters.map((filter) => filter.id)), `${contract.id}: filter IDs must be unique`);
  assert(unique(contract.filters.map((filter) => filter.query_param)), `${contract.id}: filter query parameters must be unique`);
  for (const filter of contract.filters) {
    assert(filter.mode === 'multi', `${contract.id}.${filter.id}: filters must support multiple values`);
    assert(['public_taxonomy', 'canonical_data'].includes(filter.values_from), `${contract.id}.${filter.id}: invalid filter value source`);
    assert(typeof filter.source_axis === 'string' && filter.source_axis.length > 0, `${contract.id}.${filter.id}: source axis is missing`);
  }
  assert(contract.sorts.some((sort) => sort.id === contract.default_sort), `${contract.id}: default sort is not declared`);
  assert(unique(contract.sorts.map((sort) => sort.id)), `${contract.id}: sort IDs must be unique`);
  for (const sort of contract.sorts) assert(['asc', 'desc'].includes(sort.direction), `${contract.id}.${sort.id}: sort direction is invalid`);
  assert(contract.mobile_row_fields.length >= 8, `${contract.id}: mobile row contract is too thin`);
  assert(unique([...contract.mobile_row_fields]), `${contract.id}: mobile row fields must be unique`);

  const current = audit.current_implementation.find((item) => item.id === contract.id);
  assert(Boolean(current) && current.missing_source === false, `${contract.id}: current implementation audit is missing`);
  assert(current?.current_controls?.input_count === 1, `${contract.id}: current index must retain one search input before redesign`);
  assert(current?.current_controls?.select_count === expectedCurrentSelects.get(contract.id), `${contract.id}: unexpected current select count`);
  assert(current?.current_table_headers?.length === expectedCurrentHeaders.get(contract.id), `${contract.id}: current table header inventory changed without contract review`);
  assert(current?.current_behavior?.result_count_present === true, `${contract.id}: result count must remain present`);
  assert(current?.current_behavior?.zero_result_row_present === true, `${contract.id}: zero-result state must remain present`);
  assert(current?.current_behavior?.aria_live_present === true, `${contract.id}: result count must remain announced`);
  assert(current?.current_behavior?.server_rendered_rows_present === true, `${contract.id}: server-rendered unfiltered rows must remain available`);
}

const stablecoinContract = indexInteractionContracts.find((item) => item.id === 'stablecoins');
assert(stablecoinContract?.comparison.enabled === true, 'stablecoin comparison must be enabled in the target contract');
assert(stablecoinContract?.comparison.minimum_records === 2, 'stablecoin comparison minimum must be two');
assert(stablecoinContract?.comparison.maximum_records === 4, 'stablecoin comparison maximum must be four');
assert(stablecoinContract?.comparison.query_param === 'compare', 'stablecoin comparison parameter must be compare');
assert(stablecoinContract?.comparison.sections.length === 7, 'stablecoin comparison must contain seven information groups');
assert(stablecoinContract?.comparison.excluded_axes.length === 8, 'stablecoin comparison must exclude eight market or ranking axes');
for (const id of ['organizations', 'events']) {
  const contract = indexInteractionContracts.find((item) => item.id === id);
  assert(contract?.comparison.enabled === false, `${id}: generic side-by-side comparison must remain disabled`);
  assert(typeof contract?.comparison.reason === 'string' && contract.comparison.reason.length > 40, `${id}: comparison exclusion reason is missing`);
}

for (const [key, value] of Object.entries(sharedInteractionPolicy)) {
  if (typeof value === 'boolean' && key !== 'route_changes_allowed') assert(value === true, `shared policy ${key} must remain true`);
}
assert(sharedInteractionPolicy.multi_value_separator === ',', 'multi-value separator must be a comma');
assert(sharedInteractionPolicy.implementation_deferred === true, 'PR 19 must remain specification-only');
assert(sharedInteractionPolicy.implementation_starts_at_pr === 25, 'index interaction implementation must remain deferred to PR 25');
assert(sharedInteractionPolicy.route_changes_allowed === false, 'PR 19 must not change routes');

for (const [key, value] of Object.entries(comparisonPolicy)) assert(value === true, `comparison policy ${key} must remain true`);
assert(comparisonPolicy.stablecoin_only === true, 'comparison must remain stablecoin-only');

const gaps = audit.implementation_gaps ?? [];
assert(gaps.length === 3, 'implementation gap inventory must contain three indexes');
for (const gap of gaps) {
  assert(gap.url_state_missing === true, `${gap.id}: current URL-state gap changed and must be re-audited`);
  assert(gap.browser_history_restore_missing === true, `${gap.id}: current history-restoration gap changed and must be re-audited`);
  assert(gap.clear_all_missing === true, `${gap.id}: current clear-all gap changed and must be re-audited`);
}
assert(gaps.find((gap) => gap.id === 'stablecoins')?.comparison_missing === true, 'stablecoin comparison implementation gap must remain explicit');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    index_contracts: indexInteractionContracts.length,
    search_fields: audit.totals.search_fields,
    filters: audit.totals.filters,
    sorts: audit.totals.sorts,
    mobile_row_fields: audit.totals.mobile_row_fields,
    comparison_enabled_indexes: audit.totals.comparison_enabled_indexes,
    implementation_gaps: gaps.length,
    failures: failures.length
  },
  failures
};

fs.writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
