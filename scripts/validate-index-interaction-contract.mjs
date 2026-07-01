import fs from 'node:fs';
import path from 'node:path';
import { indexInteractionContracts } from '../config/index-interaction-contract.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/index-interaction-audit.json');
const outputPath = path.join(root, 'data/generated/index-interaction-validation.json');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(auditPath), 'index interaction audit is missing');
if (!fs.existsSync(auditPath)) process.exit(1);
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
check(audit.schema_version === '1.1', 'audit schema changed');
check(indexInteractionContracts.length === 3, 'three index contracts are required');
check(audit.totals?.search_fields === 18, 'search field total changed');
check(audit.totals?.filters === 16, 'filter total changed');
check(audit.totals?.sorts === 15, 'sort total changed');
check(audit.totals?.mobile_row_fields === 26, 'mobile field total changed');
check(audit.totals?.paginated_indexes === 1, 'only the Stablecoins register should be paginated in this PR');
check(audit.totals?.implemented_indexes === 3, 'all three registry indexes must remain implemented');
check(audit.totals?.route_changes === 0, 'routes must not change');

const expected = {
  stablecoins: { route: '/stablecoins/', inputs: 2, selects: 1, headers: 7, client: 'src/scripts/stablecoin-index.ts' },
  organizations: { route: '/issuers/', inputs: 2, selects: 1, headers: 8, client: 'src/scripts/organization-index.ts' },
  events: { route: '/events/', inputs: 2, selects: 1, headers: 8, client: 'src/scripts/event-index.ts' }
};

for (const contract of indexInteractionContracts) {
  const current = audit.current_implementation.find((item) => item.id === contract.id);
  const target = expected[contract.id];
  check(contract.route === target.route, `${contract.id}: route changed`);
  check(contract.search.fields.length === 6, `${contract.id}: search contract changed`);
  check(contract.filters.every((filter) => filter.mode === 'multi'), `${contract.id}: filters must remain multi-value`);
  check(contract.sorts.some((sort) => sort.id === contract.default_sort), `${contract.id}: default sort missing`);
  check(current?.missing_source === false, `${contract.id}: source audit missing`);
  check(current?.client_file === target.client, `${contract.id}: client controller mismatch`);
  check(current?.current_controls?.input_count === target.inputs, `${contract.id}: input inventory changed`);
  check(current?.current_controls?.select_count === target.selects, `${contract.id}: select inventory changed`);
  check(current?.current_table_headers?.length === target.headers, `${contract.id}: header inventory changed`);
  for (const key of ['result_count_present', 'zero_result_row_present', 'aria_live_present', 'server_rendered_rows_present']) check(current?.current_behavior?.[key] === true, `${contract.id}: required behavior missing: ${key}`);
  for (const key of ['url_search_params_present', 'history_replace_present', 'history_push_present', 'popstate_present', 'clear_all_present']) check(current?.current_behavior?.[key] === true, `${contract.id}: behavior missing: ${key}`);
  const gap = audit.implementation_gaps.find((item) => item.id === contract.id);
  for (const key of ['url_state_missing', 'browser_history_restore_missing', 'clear_all_missing']) check(gap?.[key] === false, `${contract.id}: implementation gap remains: ${key}`);
}

const stable = audit.current_implementation.find((item) => item.id === 'stablecoins');
check(stable?.current_behavior?.comparison_present === true, 'stablecoin comparison is missing');
check(stable?.current_behavior?.pagination_present === true, 'stablecoin pagination controls are missing');
check(stable?.current_behavior?.page_state_present === true, 'stablecoin page URL state is missing');
check(stable?.current_behavior?.visible_range_present === true, 'stablecoin visible range is missing');
const stableGap = audit.implementation_gaps.find((item) => item.id === 'stablecoins');
check(stableGap?.comparison_missing === false, 'stablecoin comparison gap remains');
check(stableGap?.pagination_missing === false, 'stablecoin pagination gap remains');
for (const id of ['organizations', 'events']) {
  const current = audit.current_implementation.find((item) => item.id === id);
  check(current?.current_behavior?.comparison_present === false, `${id}: generic comparison must remain disabled`);
  const gap = audit.implementation_gaps.find((item) => item.id === id);
  check(gap?.comparison_missing === false, `${id}: comparison gap state changed`);
  check(gap?.pagination_missing === false, `${id}: unexpected pagination requirement appeared`);
}

const stableContract = indexInteractionContracts.find((item) => item.id === 'stablecoins');
check(stableContract?.comparison.enabled === true && stableContract?.comparison.minimum_records === 2 && stableContract?.comparison.maximum_records === 4, 'stablecoin comparison contract changed');
check(stableContract?.pagination?.enabled === true && stableContract?.pagination?.page_size === 20 && stableContract?.pagination?.query_param === 'page', 'stablecoin pagination contract is incomplete');
for (const id of ['organizations', 'events']) check(indexInteractionContracts.find((item) => item.id === id)?.comparison.enabled === false, `${id}: generic comparison must remain disabled`);

const validation = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: { index_contracts: 3, implemented_indexes: 3, paginated_indexes: 1, deferred_indexes: 0, failures: failures.length },
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(validation, null, 2)); process.exit(1); }
console.log(JSON.stringify(validation, null, 2));
