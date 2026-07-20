import fs from 'node:fs';
import path from 'node:path';
import { indexInteractionContracts } from '../config/index-interaction-contract.mjs';

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
  stablecoins: { route: '/stablecoins/', source: 'src/pages/stablecoins/index.astro', client: 'src/scripts/stablecoin-index.ts', headers: 7 },
  organizations: { route: '/issuers/', source: 'src/components/OrganizationEditorialRegister.astro', client: 'src/scripts/organization-index.ts', headers: 5 },
  events: { route: '/events/', source: 'src/components/EventEditorialRegister.astro', client: 'src/scripts/event-index.ts', headers: 5 }
};

check(audit.schema_version === '1.1', 'audit schema changed');
check(indexInteractionContracts.length === 3, 'three index contracts are required');
check(new Set(indexInteractionContracts.map((contract) => contract.id)).size === 3, 'index contract IDs must be unique');

for (const [id, spec] of Object.entries(expected)) {
  const contract = contractById.get(id);
  check(Boolean(contract), `${id}: contract missing`);
  if (!contract) continue;
  check(contract.route === spec.route, `${id}: route changed`);
  check(contract.search.fields.length === 6, `${id}: six search fields are required`);
  check(contract.filters.length > 0, `${id}: filters are required`);
  check(contract.sort.options.length > 0, `${id}: sort options are required`);
  check(contract.mobile_row.fields.length > 0, `${id}: mobile row fields are required`);
  check(contract.url_state.query_parameter === 'q', `${id}: query parameter changed`);
  check(contract.url_state.history_mode === 'replace_then_push', `${id}: history mode changed`);
  check(contract.zero_results.result_count_required === true, `${id}: zero-result count is required`);
  check(contract.accessibility.result_count_aria_live === 'polite', `${id}: result count must remain polite`);

  const source = read(spec.source);
  const client = read(spec.client);
  const headerCount = [...source.matchAll(/<th\b/g)].length;
  check(headerCount === spec.headers, `${id}: expected ${spec.headers} primary headers, found ${headerCount}`);
  check(source.includes('aria-live="polite"'), `${id}: result announcement missing`);
  check(/data-(?:organization-|event-)?result-count/.test(source), `${id}: result count marker missing`);
  check(/data-(?:organization-|event-)?no-results/.test(source), `${id}: zero-result state missing`);
  check(/data-(?:organization-|event-)?clear-all/.test(source) || source.includes('data-stablecoin-clear-all'), `${id}: clear-all action missing`);
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
  schema_version: '1.3',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    index_contracts: indexInteractionContracts.length,
    implemented_indexes: 3,
    stablecoin_columns: 7,
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
