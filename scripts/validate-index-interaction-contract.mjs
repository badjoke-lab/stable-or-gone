import fs from 'node:fs';
import path from 'node:path';
import { indexInteractionContracts } from '../config/index-interaction-contract.mjs';
const root=process.cwd(),audit=JSON.parse(fs.readFileSync(path.join(root,'data/generated/index-interaction-audit.json'),'utf8')),failures=[];
const check=(value,message)=>{if(!value)failures.push(message)};
const sources={organizations:'src/components/OrganizationEditorialRegister.astro',events:'src/components/EventEditorialRegister.astro'};
const clients={stablecoins:'src/scripts/stablecoin-index.ts',organizations:'src/scripts/organization-index.ts',events:'src/scripts/event-index.ts'};
const expected={stablecoins:{route:'/stablecoins/',inputs:2,selects:1,headers:7},organizations:{route:'/issuers/',inputs:2,selects:1,headers:5},events:{route:'/events/',inputs:2,selects:1,headers:5}};
check(audit.schema_version==='1.1','audit schema changed');check(indexInteractionContracts.length===3,'three index contracts are required');
for(const [key,value] of Object.entries({search_fields:18,filters:16,sorts:15,mobile_row_fields:26,paginated_indexes:1,implemented_indexes:3,route_changes:0}))check(audit.totals?.[key]===value,`${key} changed`);
for(const contract of indexInteractionContracts){
  const target=expected[contract.id],clientFile=clients[contract.id];
  let current=audit.current_implementation.find((item)=>item.id===contract.id);
  if(sources[contract.id]){
    const source=fs.readFileSync(path.join(root,sources[contract.id]),'utf8'),client=fs.readFileSync(path.join(root,clientFile),'utf8'),behavior=`${source}\n${client}`;
    current={missing_source:false,client_file:clientFile,current_controls:{input_count:[...source.matchAll(/<input\b/g)].length,select_count:[...source.matchAll(/<select\b/g)].length},current_table_headers:[...source.matchAll(/<th\b/g)],current_behavior:{result_count_present:/data-(?:organization-|event-)?result-count/.test(source),zero_result_row_present:/data-(?:organization-|event-)?no-results/.test(source),aria_live_present:/aria-live=/.test(source),server_rendered_rows_present:/records\.map/.test(source),url_search_params_present:behavior.includes('URLSearchParams'),history_replace_present:behavior.includes('replaceState'),history_push_present:behavior.includes('pushState'),popstate_present:behavior.includes('popstate'),clear_all_present:/clear-all/i.test(behavior),comparison_present:false,pagination_present:false,page_state_present:false,visible_range_present:false}};
  }
  check(contract.route===target.route,`${contract.id}: route changed`);check(contract.search.fields.length===6,`${contract.id}: search contract changed`);check(current?.missing_source===false,`${contract.id}: source missing`);check(current?.client_file===clientFile,`${contract.id}: client mismatch`);check(current?.current_controls?.input_count===target.inputs,`${contract.id}: input inventory changed`);check(current?.current_controls?.select_count===target.selects,`${contract.id}: select inventory changed`);check(current?.current_table_headers?.length===target.headers,`${contract.id}: header inventory changed`);
  for(const key of ['result_count_present','zero_result_row_present','aria_live_present','server_rendered_rows_present','url_search_params_present','history_replace_present','history_push_present','popstate_present','clear_all_present'])check(current?.current_behavior?.[key]===true,`${contract.id}: behavior missing: ${key}`);
}
const validation={schema_version:'1.2',generated_at:new Date().toISOString(),ok:!failures.length,totals:{index_contracts:3,implemented_indexes:3,paginated_indexes:1,deferred_indexes:0,event_primary_columns:5,organization_primary_columns:5,failures:failures.length},failures};
fs.writeFileSync(path.join(root,'data/generated/index-interaction-validation.json'),JSON.stringify(validation,null,2)+'\n');if(failures.length){console.error(JSON.stringify(validation,null,2));process.exit(1)}console.log(JSON.stringify(validation,null,2));
