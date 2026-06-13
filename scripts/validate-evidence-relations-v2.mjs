import fs from 'node:fs';
import path from 'node:path';
const dataDir=path.join(process.cwd(),'data');
const failures=[];
const evidenceFiles=['evidence.json','evidence-extra.json','evidence-pr033.json','evidence-events-pr036.json','evidence-events-pr037.json','evidence-events-pr038.json','evidence-batch-a.json','evidence-batch-b.json'];
const eventFiles=['events.json','events-pr036.json','events-pr037.json','events-pr038.json','events-batch-a.json','events-batch-b.json'];
function read(file){try{const v=JSON.parse(fs.readFileSync(path.join(dataDir,file),'utf8'));if(!Array.isArray(v))failures.push(`${file}: expected array`);return Array.isArray(v)?v:[]}catch(e){failures.push(`${file}: ${e.message}`);return[]}}
const stablecoins=[...read('stablecoins.json'),...read('stablecoins-extra.json'),...read('stablecoins-batch-b.json')];
const organizations=[...read('organizations.json'),...read('organizations-batch-b.json')];
const events=eventFiles.flatMap(read);
const evidence=evidenceFiles.flatMap(read);
const stablecoinIds=new Set(stablecoins.map((row)=>row.id));
const organizationIds=new Set(organizations.map((row)=>row.id));
const eventIds=new Set(events.map((row)=>row.id));
const evidenceIds=new Set();
const unique=(items)=>[...new Set(items.filter((item)=>typeof item==='string'&&item.length>0))];
const project=(row)=>({evidence_id:row.id,stablecoin_ids:unique([...(row.stablecoin_ids??[]),row.stablecoin_id]),organization_ids:unique([...(row.organization_ids??[]),row.issuer_id]),event_ids:unique([...(row.event_ids??[]),row.event_id]),claim_scopes:unique([...(row.claim_scopes??[]),row.claim_scope])});
for(const row of evidence){
 if(!row.id){failures.push('evidence row missing id');continue}
 if(evidenceIds.has(row.id))failures.push(`duplicate evidence id: ${row.id}`);evidenceIds.add(row.id);
 const relation=project(row);
 if(row.stablecoin_id&&!relation.stablecoin_ids.includes(row.stablecoin_id))failures.push(`${row.id}: legacy stablecoin_id missing`);
 if(row.issuer_id&&!relation.organization_ids.includes(row.issuer_id))failures.push(`${row.id}: legacy issuer_id missing`);
 if(row.event_id&&!relation.event_ids.includes(row.event_id))failures.push(`${row.id}: legacy event_id missing`);
 if(row.claim_scope&&!relation.claim_scopes.includes(row.claim_scope))failures.push(`${row.id}: legacy claim_scope missing`);
 for(const id of relation.stablecoin_ids)if(!stablecoinIds.has(id))failures.push(`${row.id}: missing stablecoin ${id}`);
 for(const id of relation.organization_ids)if(!organizationIds.has(id))failures.push(`${row.id}: missing organization ${id}`);
 for(const id of relation.event_ids)if(!eventIds.has(id))failures.push(`${row.id}: missing event ${id}`);
 if(relation.stablecoin_ids.length===0&&relation.organization_ids.length===0&&relation.event_ids.length===0)failures.push(`${row.id}: relation has no subjects`);
}
if(evidence.length<133)failures.push(`evidence count fell below protected minimum 133: ${evidence.length}`);
if(failures.length){console.error('Evidence v2 relation validation failed:');failures.forEach((x)=>console.error(`- ${x}`));process.exit(1)}
console.log(`Evidence v2 relation validation passed: ${evidence.length} evidence rows projected into relation arrays.`);
