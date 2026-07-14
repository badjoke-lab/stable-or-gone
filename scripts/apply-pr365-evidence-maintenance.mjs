import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(file)=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const write=(file,value)=>fs.writeFileSync(path.join(root,file),`${JSON.stringify(value,null,2)}\n`);
const queue=read('docs/migration/evidence-archive-maintenance-queue-pr365.json');
const selected=queue.selected_candidates.map((row)=>row.evidence_id);
const expected=[
  'sog_src_xaut_legal_batch_b','sog_src_bold_live_batch_c','sog_src_bold_overview_batch_c','sog_src_bold_redemptions_batch_c','sog_src_busd_binance_phaseout','sog_src_busd_paxos_issuer_update','sog_src_busd_paxos_statement_pr354','sog_src_circle_stability_update_2023_03_13','sog_src_circle_svb_update','sog_src_circle_usdc_contract_addresses'
];
if(JSON.stringify(selected)!==JSON.stringify(expected))throw new Error('PR #365 reviewed queue changed');

const changes={
  sog_src_xaut_legal_batch_b:{file:'data/evidence-batch-b.json',archived_url:'https://web.archive.org/web/20250320213402/https://gold.tether.to/legal/lawinforcementpolicy',timestamp:'20250320213402',digest:'BR46TIWJIMLBZXPDXTWDTG2KHCD4U2KN'},
  sog_src_bold_live_batch_c:{file:'data/evidence-batch-c.json',archived_url:'https://web.archive.org/web/20250609144742/https://docs.liquity.org/v2-documentation/friendly-fork-program',timestamp:'20250609144742',digest:'2YR3RE6C4TYRQF5IS7ZLQT2GZRGIEZYJ'},
  sog_src_bold_overview_batch_c:{file:'data/evidence-batch-c.json',archived_url:'https://web.archive.org/web/20250519194953/https://docs.liquity.org/v2-faq/bold-and-earn',timestamp:'20250519194953',digest:'ZE3KM6LVH4LJCF6XFX4PLKZGBGF4AVIN'}
};
for(const [id,change] of Object.entries(changes)){
  const rows=read(change.file);
  const row=rows.find((item)=>item.id===id);
  if(!row)throw new Error(`${id}: missing`);
  if(String(row.archived_url??'').trim()&&row.archived_url!==change.archived_url)throw new Error(`${id}: archived_url already differs`);
  row.archived_url=change.archived_url;
  write(change.file,rows);
}

const reasons={
  sog_src_bold_redemptions_batch_c:'The canonical legacy URL redirects to the Liquity V2 page, while exact captures returned for the legacy URL predate the reviewed May 2025 relaunch boundary; no source-equivalent dated capture was accepted.',
  sog_src_busd_binance_phaseout:'The live endpoint returned an asynchronous 202 response and no exact dated capture was verified.',
  sog_src_busd_paxos_issuer_update:'The official page remains live, but no exact dated capture was verified in the bounded review.',
  sog_src_busd_paxos_statement_pr354:'The official statement remains live, but archive lookup did not yield a verified exact capture in the bounded review.',
  sog_src_circle_stability_update_2023_03_13:'The canonical Circle URL returned 404 and no verified source-equivalent replacement or exact capture was established.',
  sog_src_circle_svb_update:'The canonical URL redirects to the generic Circle blog index and no exact source capture was verified.',
  sog_src_circle_usdc_contract_addresses:'The developer page remains live, but no exact dated capture was verified in the bounded review.'
};
const outcomes={
  schema_version:'1.0',outcome_id:'sog_evidence_archive_maintenance_outcomes_pr365_2026_07_14',status:'reviewed_bounded_maintenance',public_output:false,review_pr:365,queue_id:queue.queue_id,
  selected_count:10,changed_count:3,dated_archive_added_count:3,reviewed_no_safe_change_count:7,canonical_evidence_count_after:559,evidence_relation_count_after:559,archive_index_count_before:387,archive_index_count_after:390,archive_not_recorded_count_before:172,archive_not_recorded_count_after:169,
  changed_files:['data/evidence-batch-b.json','data/evidence-batch-c.json'],
  outcomes:selected.map((id)=>changes[id]?{evidence_id:id,decision:'dated_archive_added',previous_archived_url:null,new_archived_url:changes[id].archived_url,review_method:'current URL response plus exact-source Wayback CDX review',capture_timestamp:changes[id].timestamp,capture_digest:changes[id].digest,remaining_uncertainty:'Archive capture preserves the reviewed source URL; later page revisions remain possible.'}:{evidence_id:id,decision:'reviewed_no_safe_change',previous_archived_url:null,new_archived_url:null,review_method:'current URL response, redirect boundary, and exact-source archive lookup',reason:reasons[id],remaining_uncertainty:'A later reviewed batch may accept a newly verified exact capture or source-equivalent replacement.'})
};
write('docs/migration/evidence-archive-maintenance-outcomes-pr365.json',outcomes);

const previous='sog_tier_a_dossier_batch_4_canonical_112_checkpoint_pr364_2026_07_14';
const checkpoint={
  schema_version:'1.0',status:'reviewed_non_growth_checkpoint',checkpoint_id:'sog_evidence_archive_maintenance_batch_2_canonical_112_checkpoint_pr365_2026_07_14',checkpoint_kind:'non_growth_normalization_checkpoint',recorded_at:'2026-07-14',source_commit:'pr365-evidence-archive-maintenance-batch-2',asset_count:112,source_checkpoint_id:previous,previous_checkpoint_id:previous,maintenance_pr:365,
  expected_counts:{assets:112,organizations:107,relationships:124,events:187,evidence:559,market_access_records:8,reserve_reports:120,known_unknowns:325,regulatory_notes:9,deployments:174,legal_profiles:112,stable_asset_relationships:5,reserve_components:145,income_profiles:112},
  evidence_quality:{archive_index_count:390,archive_not_recorded_count:169,selected_for_review:10,canonical_changes:3,reviewed_no_safe_change:7,new_evidence_records:0},
  maintenance_outcome:{changed_evidence_ids:Object.keys(changes),reviewed_no_safe_change_evidence_ids:selected.filter((id)=>!changes[id])},
  notes:'Current deterministic canonical checkpoint after PR #365 Evidence and Archive Maintenance Batch 2. Three exact dated archive captures were added for XAUT and two Liquity BOLD sources; seven candidates were retained without unsafe inference. All canonical identities, relations, assets, Market Access records, non-Evidence record families, and public surfaces remain unchanged.'
};
write('docs/migration/current-canonical-checkpoint.json',checkpoint);
write('docs/migration/current-stats-history-checkpoint.json',{
  schema_version:'1.0',status:'reviewed_non_growth_checkpoint',checkpoint_id:'sog_evidence_archive_maintenance_batch_2_112_checkpoint_pr365_2026_07_14',checkpoint_kind:'non_growth_normalization_checkpoint',recorded_at:'2026-07-14',registry_version:'pr365-evidence-archive-maintenance-batch-2',asset_count:112,source_checkpoint_id:'sog_tier_a_dossier_batch_4_112_checkpoint_pr364_2026_07_14',canonical_checkpoint_id:checkpoint.checkpoint_id,previous_history_checkpoint_id:'sog_tier_a_dossier_batch_4_112_checkpoint_pr364_2026_07_14',maintenance_pr:365,notes:'Reviewed forward same-count statistics checkpoint for PR #365 Evidence and Archive Maintenance Batch 2. It records archive coverage 390 of 559 while preserving every canonical record count and public-surface boundary.'
});
console.log('Applied PR #365 reviewed Evidence maintenance decisions.');
