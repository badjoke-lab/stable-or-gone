import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),failures=[];
function load(file){try{return JSON.parse(fs.readFileSync(path.join(root,file),'utf8'))}catch(e){failures.push(`${file}: ${e.message}`);return null}}
function group(files){return(files||[]).flatMap((file)=>{const value=load(file);if(!Array.isArray(value)){failures.push(`${file}: expected array`);return[]}return value})}
const baseline=load('docs/migration/registry-v2-baseline.json')||{},groups={};
for(const[name,files]of Object.entries(baseline.data_groups||{}))groups[name]=group(files);
for(const[name,min]of Object.entries(baseline.minimum_counts||{}))if((groups[name]||[]).length<min)failures.push(`${name}: expected ${min}, found ${(groups[name]||[]).length}`);
const stablecoins=groups.stablecoins||[],organizations=groups.organizations||[],relationships=groups.relationships||[],classifications=groups.classifications||[],extensions=groups.classification_extensions||[],profiles=groups.profiles||[],events=groups.events||[],details=groups.event_details||[],evidence=groups.evidence||[];
const stablecoinIds=new Set(stablecoins.map(x=>x.id)),organizationIds=new Set(organizations.map(x=>x.id)),eventIds=new Set(events.map(x=>x.id)),evidenceIds=new Set(evidence.map(x=>x.id));
const classificationIds=new Set(),profileIds=new Set(),detailIds=new Set();
for(const row of classifications){if(classificationIds.has(row.id))failures.push(`duplicate classification ${row.id}`);classificationIds.add(row.id);if(!stablecoinIds.has(row.id))failures.push(`${row.id}: classification without stablecoin`)}
for(const row of extensions)if(!classificationIds.has(row.id))failures.push(`${row.id}: extension without classification`);
for(const row of profiles){if(profileIds.has(row.id))failures.push(`duplicate profile ${row.id}`);profileIds.add(row.id);if(!stablecoinIds.has(row.id))failures.push(`${row.id}: profile without stablecoin`)}
for(const row of details){if(detailIds.has(row.id))failures.push(`duplicate event detail ${row.id}`);detailIds.add(row.id);if(!eventIds.has(row.id))failures.push(`${row.id}: detail without event`)}
for(const row of stablecoins){if(!classificationIds.has(row.id))failures.push(`${row.id}: missing classification`);if(!profileIds.has(row.id))failures.push(`${row.id}: missing profile`);if(!relationships.some(x=>x.stablecoin_id===row.id))failures.push(`${row.id}: missing relationship`)}
for(const row of events)if(!detailIds.has(row.id))failures.push(`${row.id}: missing event detail`);
for(const row of relationships){if(!stablecoinIds.has(row.stablecoin_id))failures.push(`${row.id}: missing stablecoin`);if(!organizationIds.has(row.organization_id))failures.push(`${row.id}: missing organization`);for(const id of row.evidence_ids||[])if(!evidenceIds.has(id))failures.push(`${row.id}: missing evidence ${id}`)}
for(const row of evidence){for(const id of row.stablecoin_ids||[])if(!stablecoinIds.has(id))failures.push(`${row.id}: missing stablecoin ${id}`);for(const id of row.organization_ids||[])if(!organizationIds.has(id))failures.push(`${row.id}: missing organization ${id}`);for(const id of row.event_ids||[])if(!eventIds.has(id))failures.push(`${row.id}: missing event ${id}`)}
for(const file of baseline.required_route_sources||[])if(!fs.existsSync(path.join(root,file)))failures.push(`missing route source ${file}`);
if(failures.length){console.error('Registry v2 final validation failed:');failures.forEach(x=>console.error(`- ${x}`));process.exit(1)}
console.log(`Registry v2 final validation passed: ${stablecoins.length} stablecoins, ${events.length} events, ${evidence.length} evidence records.`);
