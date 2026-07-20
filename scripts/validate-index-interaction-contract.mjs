import fs from 'node:fs';
import path from 'node:path';
import { indexInteractionContracts, sharedInteractionPolicy } from '../config/index-interaction-contract.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/index-interaction-audit.json');
const outputPath = path.join(root, 'data/generated/index-interaction-validation.json');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

check(fs.existsSync(auditPath), 'index interaction audit is missing');
if (!fs.existsSync(auditPath)) process.exit(1);
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const contractById = new Map(indexInteractionContracts.map((contract) => [contract.id, contract]));
const expected = {
  stablecoins: { route: '/stablecoins/', source: 'src/pages/stablecoins/index.astro', client: 'src/scripts/stablecoin-index.ts', headers: 6 },
  organizations: { route: '/issuers/', source: 'src/components/OrganizationEditorialRegister.astro', client: 'src/scripts/organization-index.ts', headers: 5 },
  events: { route: '/events/', source: 'src/components/EventEditorialRegister.astro', client: 'src/scripts/event-index.ts', headers: 5 }
};

check(audit.schema_version === '1.1', 'audit schema changed');
check(indexInteractionContracts.length === 3, 'three index contracts are required');
check(new Set(indexInteractionContracts.map((contract) => contract.id)).size === 3, 'index contract IDs must be unique');
check(sharedInteractionPolicy.query_parameters_are_shareable === true, 'shareable query state is required');
check(sharedInteractionPolicy.query_parameters_replace_history_on_typing === true, 'typing must replace history state');
check(sharedInteractionPolicy.query_parameters_push_history_on_committed_filter_change === true, 'committed filters must push history state');
check(sharedInteractionPolicy.browser_back_forward_restores_state === true, 'back/forward restoration is required');
check(sharedInteractionPolicy.zero_result_state_required === true, 'zero-result state is required');
check(sharedInteractionPolicy.zero_result_state_must_offer_clear === true, 'zero-result clear action is required');
check(sharedInteractionPolicy.result_count_required === true, 'result count is required');

for (const [id, spec] of Object.entries(expected)) {
  const contract = contractById.get(id);
  check(Boolean(contract), `${id}: contract missing`);
  if (!contract) continue;
  check(contract.route === spec.route, `${id}: route changed`);
  check(contract.search.query_param === 'q', `${id}: query parameter changed`);
  check(contract.search.fields.length === 6, `${id}: six search fields are required`);
  check(contract.filters.length > 0, `${id}: filters are required`);
  check(contract.sorts.length > 0, `${id}: sort options are required`);
  check(contract.mobile_row_fields.length > 0, `${id}: mobile row fields are required`);

  const source = read(spec.source);
  const client = read(spec.client);
  const headerCount = [...source.matchAll(/<th\b/g)].length;
  check(headerCount === spec.headers, `${id}: expected ${spec.headers} primary headers, found ${headerCount}`);
  check(source.includes('aria-live="polite"'), `${id}: result announcement missing`);
  check(/data-(?:organization-|event-)?result-count/.test(source), `${id}: result count marker missing`);
  check(/data-(?:organization-|event-)?no-results/.test(source), `${id}: zero-result state missing`);
  check(/data-(?:organization-|event-)?clear-all/.test(source) || source.includes('data-clear-all') || source.includes('data-stablecoin-clear-all'), `${id}: clear-all action missing`);
  check(source.includes('records.map'), `${id}: server-rendered rows missing`);
  check(client.includes('URLSearchParams'), `${id}: URL state parser missing`);
  check(client.includes('replaceState'), `${id}: replaceState missing`);
  check(client.includes('pushState'), `${id}: pushState missing`);
  check(client.includes('popstate'), `${id}: popstate restoration missing`);

  if (id === 'stablecoins') check(source.includes('stablecoin-index-page-r3') || source.includes('data-index-version="r3"'), 'stablecoins: R3 marker missing');
  if (id === 'organizations') check(source.includes('data-register-version="r5-organizations"'), 'organizations: R5 marker missing');
  if (id === 'events') check(source.includes('data-register-version="r5-events"'), 'events: R5 marker missing');
}

const validation = {
  schema_version: '1.5',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    index_contracts: indexInteractionContracts.length,
    implemented_indexes: 3,
    stablecoin_columns: 6,
    organization_columns: 5,
    event_columns: 5,
    route_changes: 0,
    failures: failures.length
  },
  failures
};
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(validation, null, 2)); process.exit(1); }
console.log(JSON.stringify(validation, null, 2));
