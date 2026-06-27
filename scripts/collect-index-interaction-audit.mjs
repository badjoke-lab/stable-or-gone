import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { comparisonPolicy, indexInteractionContracts, sharedInteractionPolicy } from '../config/index-interaction-contract.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/index-interaction-audit.json');
const unique = (values) => [...new Set(values)].sort();
const clean = (value) => value.replace(/<[^>]+>/g, ' ').replace(/\{[^}]+\}/g, ' ').replace(/\s+/g, ' ').trim();
const clientFiles = Object.freeze({ stablecoins: 'src/scripts/stablecoin-index.ts' });

function attributes(tag) {
  const output = {};
  for (const match of tag.matchAll(/\b([a-zA-Z_:][-a-zA-Z0-9_:.]*)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g)) output[match[1]] = match[2] ?? match[3] ?? `{${match[4]}}`;
  return output;
}

function inspect(contract) {
  const absolute = path.join(root, contract.source_file);
  if (!fs.existsSync(absolute)) return { id: contract.id, source_file: contract.source_file, missing_source: true };
  const source = fs.readFileSync(absolute, 'utf8');
  const clientFile = clientFiles[contract.id];
  const clientSource = clientFile && fs.existsSync(path.join(root, clientFile)) ? fs.readFileSync(path.join(root, clientFile), 'utf8') : '';
  const behaviorSource = `${source}\n${clientSource}`;
  const inputs = [...source.matchAll(/<input\b[^>]*>/g)].map((match) => attributes(match[0]));
  const selects = [...source.matchAll(/<select\b[^>]*>[\s\S]*?<\/select>/g)].map((match) => {
    const open = match[0].match(/<select\b[^>]*>/)?.[0] ?? '';
    return { ...attributes(open), options: [...match[0].matchAll(/<option\b[^>]*>([\s\S]*?)<\/option>/g)].map((item) => clean(item[1])).filter(Boolean) };
  });
  const headers = [...source.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((match) => clean(match[1])).filter(Boolean);
  const dataAttributes = unique([...behaviorSource.matchAll(/\bdata-([a-zA-Z0-9_-]+)/g)].map((match) => match[1]));
  const targetParams = unique([contract.search.query_param, ...contract.filters.map((filter) => filter.query_param), 'sort', ...(contract.comparison.enabled ? [contract.comparison.query_param] : [])]);
  return {
    id: contract.id,
    route: contract.route,
    source_file: contract.source_file,
    client_file: clientFile ?? null,
    missing_source: false,
    current_controls: { input_count: inputs.length, select_count: selects.length, inputs, selects, data_attributes: dataAttributes },
    current_table_headers: headers,
    current_behavior: {
      result_count_present: /data-(?:organization-|event-)?result-count/.test(source),
      zero_result_row_present: /data-(?:organization-|event-)?no-results/.test(source),
      aria_live_present: /aria-live=/.test(source),
      url_search_params_present: /URLSearchParams|searchParams/.test(behaviorSource),
      history_replace_present: /history\.(?:replaceState|\[.*replace.*\])/.test(behaviorSource),
      history_push_present: /history\.(?:pushState|\[.*push.*\])/.test(behaviorSource) || /pushState/.test(behaviorSource),
      popstate_present: /popstate/.test(behaviorSource),
      clear_all_present: /data-clear-all|clear-all|clear filters|reset filters/i.test(behaviorSource),
      comparison_present: /data-compare|comparison-panel|compare=/i.test(behaviorSource),
      server_rendered_rows_present: /records\.map|stablecoins\.map|\.map\(\(/.test(source) || /\.map\(\w+\s*=>/.test(source)
    },
    target_query_parameters: targetParams,
    source_digest: `sha256:${createHash('sha256').update(behaviorSource).digest('hex')}`
  };
}

const currentImplementation = indexInteractionContracts.map(inspect);
const targetContracts = indexInteractionContracts.map((contract) => ({ id: contract.id, route: contract.route, record_kind: contract.record_kind, default_sort: contract.default_sort, search: contract.search, filters: contract.filters, sorts: contract.sorts, mobile_row_fields: contract.mobile_row_fields, comparison: contract.comparison }));
const implementationGaps = currentImplementation.map((current) => ({
  id: current.id,
  url_state_missing: !current.current_behavior?.url_search_params_present,
  browser_history_restore_missing: !current.current_behavior?.popstate_present,
  clear_all_missing: !current.current_behavior?.clear_all_present,
  comparison_missing: indexInteractionContracts.find((item) => item.id === current.id)?.comparison.enabled === true && !current.current_behavior?.comparison_present,
  note: current.id === 'stablecoins' ? 'Stablecoin index implementation begins in PR 24.' : 'Implementation remains deferred to its page-specific PR.'
}));

const audit = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  implementation_boundary: { specification_only: sharedInteractionPolicy.implementation_deferred, implementation_starts_at_pr: sharedInteractionPolicy.implementation_starts_at_pr, route_changes_allowed: sharedInteractionPolicy.route_changes_allowed },
  totals: {
    index_contracts: indexInteractionContracts.length,
    current_source_files: currentImplementation.filter((item) => !item.missing_source).length,
    search_fields: indexInteractionContracts.reduce((sum, item) => sum + item.search.fields.length, 0),
    filters: indexInteractionContracts.reduce((sum, item) => sum + item.filters.length, 0),
    sorts: indexInteractionContracts.reduce((sum, item) => sum + item.sorts.length, 0),
    mobile_row_fields: indexInteractionContracts.reduce((sum, item) => sum + item.mobile_row_fields.length, 0),
    comparison_enabled_indexes: indexInteractionContracts.filter((item) => item.comparison.enabled).length,
    comparison_disabled_indexes: indexInteractionContracts.filter((item) => !item.comparison.enabled).length,
    implemented_indexes: implementationGaps.filter((gap) => !gap.url_state_missing && !gap.browser_history_restore_missing && !gap.clear_all_missing && !gap.comparison_missing).length,
    route_changes: sharedInteractionPolicy.route_changes_allowed ? 1 : 0
  },
  current_implementation: currentImplementation,
  target_contracts: targetContracts,
  implementation_gaps: implementationGaps,
  shared_policy: sharedInteractionPolicy,
  comparison_policy: comparisonPolicy,
  contract_digest: `sha256:${createHash('sha256').update(JSON.stringify({ indexInteractionContracts, sharedInteractionPolicy, comparisonPolicy })).digest('hex')}`
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit.totals, null, 2));
