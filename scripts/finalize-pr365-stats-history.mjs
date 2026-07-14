import crypto from 'node:crypto';
import fs from 'node:fs';
import {generateCurrentHistorySnapshot} from './stats/build-history-snapshot.mjs';

const read=(file)=>JSON.parse(fs.readFileSync(file,'utf8'));
const write=(file,value)=>fs.writeFileSync(file,`${JSON.stringify(value,null,2)}\n`);
const history=read('data/stats-history.json');
const snapshot=generateCurrentHistorySnapshot();
const expected='sog_evidence_archive_maintenance_batch_2_112_checkpoint_pr365_2026_07_14';
if(snapshot.checkpoint_id!==expected)throw new Error(`unexpected PR #365 stats checkpoint ${snapshot.checkpoint_id}`);
const existing=history.snapshots.findIndex((row)=>row.checkpoint_id===expected);
if(existing>=0)history.snapshots[existing]=snapshot;
else{
  if(history.snapshots.at(-1)?.checkpoint_id!=='sog_tier_a_dossier_batch_4_112_checkpoint_pr364_2026_07_14')throw new Error('PR #364 is not the current history tail');
  history.snapshots.push(snapshot);
}
write('data/stats-history.json',history);
const outcomes=read('docs/migration/evidence-archive-maintenance-outcomes-pr365.json');
const handoff={
  schema_version:'1.0',handoff_id:'sog_evidence_archive_maintenance_batch_2_pr365_reviewed_handoff_2026_07_14',status:'reviewed_complete',review_pr:365,source_pr:364,source_merge_commit:'bf72662a86d252ab827be437ff4d498a6463e98e',queue_id:'sog_evidence_archive_maintenance_queue_pr365_2026_07_14',outcome_id:outcomes.outcome_id,
  canonical_checkpoint_id:'sog_evidence_archive_maintenance_batch_2_canonical_112_checkpoint_pr365_2026_07_14',stats_checkpoint_id:expected,
  canonical_counts:{assets:112,organizations:107,relationships:124,events:187,evidence:559,evidence_relations:559,reserve_reports:120,known_unknowns:325,regulatory_notes:9,deployments:174,market_access_records:8,legal_profiles:112,reserve_components:145,income_profiles:112},
  evidence_quality:{archive_recorded:390,archive_not_recorded:169,selected:10,changed:3,reviewed_no_safe_change:7},
  changed_evidence_ids:outcomes.outcomes.filter((row)=>row.decision==='dated_archive_added').map((row)=>row.evidence_id),reviewed_no_safe_change_evidence_ids:outcomes.outcomes.filter((row)=>row.decision==='reviewed_no_safe_change').map((row)=>row.evidence_id),
  stats_model_sha256:snapshot.stats_model_sha256,stats_snapshot_sha256:snapshot.snapshot_sha256,
  next_work_item:{decision:'review_gate_required',reason:'The PR #361 approved sequence ends after PR #365; no later growth, Market Access, or public-surface work is pre-authorized.'},
  boundaries:{new_asset:false,non_evidence_canonical_change:false,market_access_change:false,new_public_surface:false,ranking:false,automatic_monitoring_promotion:false},
  handoff_sha256:null
};
const unsigned=structuredClone(handoff);delete unsigned.handoff_sha256;handoff.handoff_sha256=crypto.createHash('sha256').update(JSON.stringify(unsigned)).digest('hex');
write('docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json',handoff);
console.log(JSON.stringify({checkpoint_id:snapshot.checkpoint_id,stats_model_sha256:snapshot.stats_model_sha256,snapshot_sha256:snapshot.snapshot_sha256},null,2));
