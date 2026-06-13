import fs from 'node:fs';
import path from 'node:path';
const dataDir=path.join(process.cwd(),'data');
const failures=[];
const kinds=new Set(['depeg','regulatory','reserve_change','redemption_change','migration','issuer_control','other']);
const recovery=new Set(['recovered','partially_recovered','not_recovered','collapsed','unknown']);
const issuerControlSubtypes=new Set(['address_blacklisting','address_unblacklisting','token_freeze','token_unfreeze','burn','reissuance','other','unknown']);
const verificationStatuses=new Set(['verified_onchain','onchain_details_pending','partially_verified','reported_only','unknown']);
function read(file){try{const v=JSON.parse(fs.readFileSync(path.join(dataDir,file),'utf8'));if(!Array.isArray(v))failures.push(`${file}: expected array`);return Array.isArray(v)?v:[]}catch(e){failures.push(`${file}: ${e.message}`);return[]}}
function date(value,label){if(value!==null&&value!==undefined&&value!==''&&(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)))failures.push(`${label}: expected YYYY-MM-DD or null`)}
function ids(value,label){if(!Array.isArray(value)||value.length===0||value.some((item)=>typeof item!=='string'))failures.push(`${label}: expected non-empty string array`)}
function optionalString(value,label){if(value!==undefined&&value!==null&&typeof value!=='string')failures.push(`${label}: expected string or null`)}
function amount(value,label){if(value===undefined)return;if(!value||typeof value!=='object'||Array.isArray(value))failures.push(`${label}: expected object`);else{if(value.value!==undefined&&value.value!==null&&(typeof value.value!=='number'||value.value<0))failures.push(`${label}.value: expected non-negative number or null`);optionalString(value.symbol,`${label}.symbol`);optionalString(value.display_text,`${label}.display_text`);if(value.is_approximate!==undefined&&typeof value.is_approximate!=='boolean')failures.push(`${label}.is_approximate: expected boolean`)}}
const stablecoins=[...read('stablecoins.json'),...read('stablecoins-extra.json'),...read('stablecoins-batch-b.json')];
const organizations=[...read('organizations.json'),...read('organizations-batch-b.json')];
const events=[...read('events.json'),...read('events-pr036.json'),...read('events-pr037.json'),...read('events-pr038.json'),...read('events-batch-a.json'),...read('events-batch-b.json'),...read('events-issuer-control-2026.json')];
const overlays=[...read('event-details-v2.json'),...read('event-details-batch-a.json'),...read('event-details-batch-b.json'),...read('event-details-issuer-control-2026.json')];
const deployments=[...read('deployments.json'),...read('deployments-extra.json'),...read('deployments-batch-a.json'),...read('deployments-batch-b.json'),...read('deployments-issuer-control-2026.json')];
const stablecoinIds=new Set(stablecoins.map((row)=>row.id));
const organizationIds=new Set(organizations.map((row)=>row.id));
const deploymentIds=new Set(deployments.map((row)=>row.id));
const eventById=new Map(events.map((row)=>[row.id,row]));
const overlayById=new Map();
for(const overlay of overlays){
 if(!overlay.id){failures.push('event overlay row missing id');continue}
 if(overlayById.has(overlay.id))failures.push(`duplicate event overlay id: ${overlay.id}`);
 overlayById.set(overlay.id,overlay);
 const event=eventById.get(overlay.id);if(!event){failures.push(`event overlay references missing event: ${overlay.id}`);continue}
 ids(overlay.subject_stablecoin_ids,`${overlay.id}: subject_stablecoin_ids`);ids(overlay.subject_organization_ids,`${overlay.id}: subject_organization_ids`);
 for(const id of overlay.subject_stablecoin_ids??[])if(!stablecoinIds.has(id))failures.push(`${overlay.id}: missing stablecoin ${id}`);
 for(const id of overlay.subject_organization_ids??[])if(!organizationIds.has(id))failures.push(`${overlay.id}: missing organization ${id}`);
 if(event.stablecoin_id&&!overlay.subject_stablecoin_ids.includes(event.stablecoin_id))failures.push(`${overlay.id}: legacy stablecoin_id missing`);
 if(event.issuer_id&&!overlay.subject_organization_ids.includes(event.issuer_id))failures.push(`${overlay.id}: legacy issuer_id missing`);
 if(!kinds.has(overlay.event_detail_kind))failures.push(`${overlay.id}: invalid event_detail_kind ${overlay.event_detail_kind}`);
 if(overlay.depeg_detail){const d=overlay.depeg_detail;if(d.recovery_status&&!recovery.has(d.recovery_status))failures.push(`${overlay.id}: invalid recovery_status`);date(d.recovery_date,`${overlay.id}: depeg recovery_date`)}
 if(overlay.regulatory_detail){date(overlay.regulatory_detail.effective_date,`${overlay.id}: regulatory effective_date`);date(overlay.regulatory_detail.resolution_date,`${overlay.id}: regulatory resolution_date`)}
 if(overlay.issuer_control_detail){
   const d=overlay.issuer_control_detail;
   if(overlay.event_detail_kind!=='issuer_control')failures.push(`${overlay.id}: issuer_control_detail requires issuer_control kind`);
   if(!issuerControlSubtypes.has(d.event_subtype))failures.push(`${overlay.id}: invalid issuer-control subtype ${d.event_subtype}`);
   if(d.related_category!==undefined&&d.related_category!=='issuer_control')failures.push(`${overlay.id}: related_category must be issuer_control`);
   if(d.deployment_id&&!deploymentIds.has(d.deployment_id))failures.push(`${overlay.id}: missing deployment ${d.deployment_id}`);
   ids(d.affected_addresses,`${overlay.id}: affected_addresses`);
   optionalString(d.blacklist_transaction_hash,`${overlay.id}: blacklist_transaction_hash`);
   if(d.related_transaction_hashes!==undefined&&(!Array.isArray(d.related_transaction_hashes)||d.related_transaction_hashes.some((item)=>typeof item!=='string')))failures.push(`${overlay.id}: related_transaction_hashes must be a string array`);
   amount(d.reported_frozen_amount,`${overlay.id}: reported_frozen_amount`);
   amount(d.related_flow,`${overlay.id}: related_flow`);
   if(d.verification_status&&!verificationStatuses.has(d.verification_status))failures.push(`${overlay.id}: invalid verification_status ${d.verification_status}`);
   if(d.event_subtype==='address_blacklisting'&&d.blacklist_transaction_hash===null&&d.verification_status!=='onchain_details_pending')failures.push(`${overlay.id}: missing blacklist hash requires onchain_details_pending`);
 }
 if(overlay.event_detail_kind==='issuer_control'&&!overlay.issuer_control_detail)failures.push(`${overlay.id}: issuer_control kind requires issuer_control_detail`);
}
for(const event of events)if(!overlayById.has(event.id))failures.push(`missing event overlay for ${event.id}`);
if(overlayById.size!==eventById.size)failures.push(`event overlay count ${overlayById.size} does not match event count ${eventById.size}`);
if(failures.length){console.error('Stablecoin event v2 validation failed:');failures.forEach((x)=>console.error(`- ${x}`));process.exit(1)}
console.log(`Stablecoin event v2 validation passed: ${overlays.length} overlays for ${events.length} events.`);
