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
check(audit.schema_version === '1.0', 'audit schema changed');
check(indexInteractionContracts.length === 3, 'three index contracts are required');
check(audit.totals?.search_fields === 18, 'search field total changed');
check(audit.totals?.filters === 16, 'filter total changed');
check(audit.totals?.sorts === 15, 'sort total changed');
check(audit.totals?.mobile_row_fields === 26, 'mobile field total changed');
check(audit.totals?.implemented_indexes === 1, 'only the stablecoin index may be implemented at PR 24');
check(audit.totals?.route_changes === 0, 'routes must not change');

const expected = {
  stablecoins: { route: '/stablecoins/', inputs: 2, selects: 1, headers: 9 },
  organizations: { route: '/issuers/', inputs: 1, selects: 6, headers: 8 },
  events: { route: '/events/', inputs: 1, selects: 4, headers: 8 }
};

for (const contract of indexInteractionContracts) {
  const current = audit.current_implementation.find((item) => item.id === contract.id);
  const target = expected[contract.id];
  check(contract.route === target.route, `${contract.id}: route changed`);
  check(contract.search.fields.length === 6, `${contract.id}: search contract changed`);
  check(contract.filters.every((filter) => filter.mode === 'multi'), `${contract.id}: filters must remain multi-value`);
  check(contract.sorts.some((sort) => sort.id === contract.default_sort), `${contract.id}: default sort missing`);
  check(current?.missing_source === false, `${contract.id}: source audit missing`);
  check(current?.current_controls?.input_count === target.inputs, `${contract.id}: input inventory changed`);
  check(current?.current_controls?.select_count === target.selects, `${contract.id}: select inventory changed`);
  check(current?.current_table_headers?.length === target.headers, `${contract.id}: header inventory changed`);
  for (const key of ['result_count_present', 'zero_result_row_present', 'aria_live_present', 'server_rendered_rows_present']) check(current?.current_behavior?.[key] === true, `${contract.id}: required behavior missing: ${key}`);
}

const stable = audit.current_implementation.find((item) => item.id === 'stablecoins');
check(stable?.client_file === 'src/scripts/stablecoin-index.ts', 'stablecoin controller is not audited');
for (const key of ['url_search_params_present', 'history_replace_present', 'history_push_present', 'popstate_present', 'clear_all_present', 'comparison_present']) check(stable?.current_behavior?.[key] === true, `stablecoin behavior missing: ${key}`);

const stableGap = audit.implementation_gaps.find((item) => item.id === 'stablecoins');
for (const key of ['url_state_missing', 'browser_history_restore_missing', 'clear_all_missing', 'comparison_missing']) check(stableGap?.[key] === false, `stablecoin gap remains: ${key}`);
for (const id of ['organizations', 'events']) {
  const gap = audit.implementation_gaps.find((item) => item.id === id);
  check(gap?.url_state_missing === true, `${id}: URL work changed out of sequence`);
  check(gap?.browser_history_restore_missing === true, `${id}: history work changed out of sequence`);
  check(gap?.clear_all_missing === true, `${id}: clear-all work changed out of sequence`);
}

const stableContract = indexInteractionContracts.find((item) => item.id === 'stablecoins');
check(stableContract?.comparison.enabled === true, 'stablecoin comparison must remain enabled');
check(stableContract?.comparison.minimum_records === 2 && stableContract?.comparison.maximum_records === 4, 'comparison limits changed');
check(stableContract?.comparison.sections.length === 7, 'comparison sections changed');
check(stableContract?.comparison.excluded_axes.length === 8, 'excluded comparison axes changed');
for (const id of ['organizations', 'events']) check(indexInteractionContracts.find((item) => item.id === id)?.comparison.enabled === false, `${id}: comparison must remain disabled`);

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: { index_contracts: 3, implemented_indexes: 1, deferred_indexes: 2, failures: failures.length },
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(validation, null, 2)); process.exit(1); }
console.log(JSON.stringify(validation, null, 2));
