import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=(f)=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(root,f),JSON.stringify(v,null,2)+'\n');
const add=(a,v)=>{if(!a.includes(v))a.push(v)};
const count=(files)=>files.flatMap(read).length;
const baseline=read('docs/migration/registry-v2-baseline.json');
const files={
 stablecoins:['data/stablecoins-batch-l.json'],organizations:['data/organizations-batch-l.json'],relationships:['data/relationships-batch-l.json'],classifications:['data/stablecoin-classification-batch-l.json'],profiles:['data/stablecoin-profiles-batch-l.json'],events:['data/events-batch-l.json'],event_details:['data/event-details-batch-l.json'],evidence:['data/evidence-batch-l-a.json','data/evidence-batch-l-b.json','data/evidence-batch-l-c.json','data/evidence-batch-l-d1.json','data/evidence-batch-l-d2.json'],evidence_relations:['data/evidence-batch-l-a.json','data/evidence-batch-l-b.json','data/evidence-batch-l-c.json','data/evidence-batch-l-d1.json','data/evidence-batch-l-d2.json'],reserve_reports:['data/reserve-reports-batch-l.json'],known_unknowns:['data/known-unknowns-batch-l-a.json','data/known-unknowns-batch-l-b.json'],deployments:['data/deployments-batch-l.json']
};
for(const [group,paths] of Object.entries(files)){baseline.data_groups[group]??=[];for(const file of paths)add(baseline.data_groups[group],file)}
const assets=[['sog_st_m0m','m0-m'],['sog_st_usdf','falcon-usdf'],['sog_st_usx','dforce-usx'],['sog_st_usdz','anzen-usdz'],['sog_st_usda','avalon-usda']];
const orgs=[['sog_issuer_m0_protocol','m0-protocol'],['sog_issuer_falcon_finance','falcon-finance'],['sog_issuer_dforce','dforce'],['sog_issuer_anzen','anzen-finance'],['sog_issuer_avalon_labs','avalon-labs']];
for(const [id,slug] of assets)if(!baseline.protected_stablecoins.some(x=>x.id===id))baseline.protected_stablecoins.push({id,slug});
for(const [id,slug] of orgs)if(!baseline.protected_organizations.some(x=>x.id===id))baseline.protected_organizations.push({id,slug});
baseline.baseline_id='sog_registry_v2_post_batch_l_2026_06_21';baseline.captured_at='2026-06-21';baseline.source_commit='batch-l-current-stable-assets';
for(const key of Object.keys(baseline.minimum_counts))baseline.minimum_counts[key]=count(baseline.data_groups[key]??[]);
write('docs/migration/registry-v2-baseline.json',baseline);
const foundation=read('docs/migration/registry-v3-foundation.json');add(foundation.data_groups.legal_profiles,'data/legal-profiles-v3-batch-growth-l.json');add(foundation.data_groups.reserve_components,'data/reserve-components-v3-batch-l.json');for(const key of Object.keys(foundation.minimum_counts))foundation.minimum_counts[key]=count(foundation.data_groups[key]);write('docs/migration/registry-v3-foundation.json',foundation);
const income=read('docs/migration/registry-v3-income-profiles.json');add(income.data_files,'data/income-profiles-v3-l.json');income.minimum_count=count(income.data_files);write('docs/migration/registry-v3-income-profiles.json',income);
const view=read('docs/migration/registry-v3-view-67.json');view.minimum_count=baseline.minimum_counts.deployments;write('docs/migration/registry-v3-view-67.json',view);
const launch=read('data/quality/launch-date-unresolved.json');const pending=[{stablecoin_id:'sog_st_usdf',category:'B',best_known_range:'2025',reason_code:'partial_date_only',review_note:'Official material establishes 2025 without a reviewed day-level launch boundary.'},{stablecoin_id:'sog_st_usdz',category:'B',best_known_range:'2024-06',reason_code:'partial_date_only',review_note:'Official material establishes June 2024 without a reviewed day-level launch date.'},{stablecoin_id:'sog_st_usda',category:'B',best_known_range:'2024-11',reason_code:'partial_date_only',review_note:'Official material establishes November 2024 without a reviewed day-level launch date.'}];for(const item of pending)if(!launch.records.some(x=>x.stablecoin_id===item.stablecoin_id))launch.records.push(item);launch.frozen_at='2026-06-21';launch.expected_total=launch.records.length;launch.category_counts=Object.fromEntries(['B','C','D'].map(c=>[c,launch.records.filter(x=>x.category===c).length]));write('data/quality/launch-date-unresolved.json',launch);
const research=read('data/candidate-research-batch-12.json');research.status='promoted';research.canonical_assets=75;research.promoted_at='2026-06-21';for(const row of research.records)row.promotion_readiness='promoted';write('data/candidate-research-batch-12.json',research);
console.log('Batch L manifests prepared');
