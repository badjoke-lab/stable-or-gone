import fs from 'node:fs';
import path from 'node:path';
import { indexInteractionContracts } from '../config/index-interaction-contract.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/index-interaction-audit.json');
const clients = {
  stablecoins: 'src/scripts/stablecoin-index.ts',
  organizations: 'src/scripts/organization-index.ts'
};
const clean = (value) => value.replace(/<[^>]+>/g, ' ').replace(/\{[^}]+\}/g, ' ').replace(/\s+/g, ' ').trim();

function inspect(contract) {
  const sourcePath = path.join(root, contract.source_file);
  if (!fs.existsSync(sourcePath)) return { id: contract.id, source_file: contract.source_file, missing_source: true };
  const source = fs.readFileSync(sourcePath, 'utf8');
  const clientFile = clients[contract.id] ?? null;
  const client = clientFile ? fs.readFileSync(path.join(root, clientFile), 'utf8') : '';
  const behavior = `${source}\n${client}`;
  return {
    id: contract.id,
    route: contract.route,
    source_file: contract.source_file,
    client_file: clientFile,
    missing_source: false,
    current_controls: {
      input_count: [...source.matchAll(/<input\b[^>]*>/g)].length,
      select_count: [...source.matchAll(/<select\b[^>]*>/g)].length
    },
    current_table_headers: [...source.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((match) => clean(match[1])).filter(Boolean),
    current_behavior: {
      result_count_present: /data-(?:organization-|event-)?result-count/.test(source),
      zero_result_row_present: /data-(?:organization-|event-)?no-results/.test(source),
      aria_live_present: /aria-live=/.test(source),
      url_search_params_present: behavior.includes('URLSearchParams'),
      history_replace_present: behavior.includes('replaceState'),
      history_push_present: behavior.includes('pushState'),
      popstate_present: behavior.includes('popstate'),
      clear_all_present: /clear-all|clear filters|reset filters/i.test(behavior),
      comparison_present: /data-compare|comparison-panel|compare=/i.test(behavior),
      server_rendered_rows_present: /records\.map|stablecoins\.map|organizations\.map|\.map\(\(/.test(source)
    }
  };
}

const current = indexInteractionContracts.map(inspect);
const gaps = current.map((item) => ({
  id: item.id,
  url_state_missing: !item.current_behavior?.url_search_params_present,
  browser_history_restore_missing: !item.current_behavior?.popstate_present,
  clear_all_missing: !item.current_behavior?.clear_all_present,
  comparison_missing: indexInteractionContracts.find((contract) => contract.id === item.id)?.comparison.enabled === true && !item.current_behavior?.comparison_present
}));
const audit = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  totals: {
    index_contracts: 3,
    current_source_files: current.filter((item) => !item.missing_source).length,
    search_fields: indexInteractionContracts.reduce((sum, item) => sum + item.search.fields.length, 0),
    filters: indexInteractionContracts.reduce((sum, item) => sum + item.filters.length, 0),
    sorts: indexInteractionContracts.reduce((sum, item) => sum + item.sorts.length, 0),
    mobile_row_fields: indexInteractionContracts.reduce((sum, item) => sum + item.mobile_row_fields.length, 0),
    comparison_enabled_indexes: indexInteractionContracts.filter((item) => item.comparison.enabled).length,
    comparison_disabled_indexes: indexInteractionContracts.filter((item) => !item.comparison.enabled).length,
    implemented_indexes: gaps.filter((gap) => !gap.url_state_missing && !gap.browser_history_restore_missing && !gap.clear_all_missing && !gap.comparison_missing).length,
    route_changes: 0
  },
  current_implementation: current,
  target_contracts: indexInteractionContracts,
  implementation_gaps: gaps
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit.totals, null, 2));
