import fs from 'node:fs';
const text=f=>fs.readFileSync(f,'utf8');
const json=f=>JSON.parse(text(f));
const failures=[];
const check=(v,m)=>{if(!v)failures.push(m)};
const markers=(body,list,label)=>list.forEach(x=>check(body.includes(x),`${label}: missing ${x}`));

const historical=json('docs/migration/audited-100-asset-canonical-checkpoint.json');
const current=json('docs/migration/current-canonical-checkpoint.json');
const historyCheckpoint=json('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline=json('docs/migration/registry-release-integrity-baseline.json');
const reproducible=json('docs/migration/reproducible-build-output-baseline.json');
const history=json('data/stats-history.json');
const reviewGate=json('docs/migration/post-pr360-review-gate-pr361.json');
const updates=json('data/registry-updates.json');
const readme=text('README.md');
const release=text('docs/releases/100-asset-checkpoint-2026-07-06.md');
const roadmap=text('docs/roadmap.md');
const historyAmendment=text('docs/roadmap-amendments/2026-07-08-pr326-history-activation.md');
const depthAmendment=text('docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md');

markers(readme,['Canonical stable assets: 112','PR #351 Monthly Maintenance Log: complete','PR #352 post-351 authority reset: complete','PR #354 Tier A Dossier Deepening — Batch 1: complete','PR #355 Tier A Dossier Deepening — Batch 2: complete','PR #356 Market Access Pilot 1: complete','PR #357 Tier A Dossier Deepening — Batch 3: complete','PR #358 Record Growth Batch 1: complete','PR #359 Market Access Pilot 2: complete','PR #360 Evidence and Correction Batch: complete','PR #361 Post-PR #360 Review Gate: complete','PR #363 Record Depth and Coverage Baseline Refresh: complete','StraitsX USD (XUSD)','Blast USDB'],'README.md');
for(const body of [readme,release])markers(body,['/version.json','/data/manifest.json','/llms.txt','/ai.txt','canonical_only = true','includes_unreviewed_candidates = false','includes_internal_monitoring = false','includes_private_notes = false'],body===readme?'README.md':'historical release note');
markers(release,['stable assets: 100','organizations: 94','relationships: 110','events: 172','evidence: 502','known unknowns: 289','deployments: 140','legal profiles: 100','reserve components: 133','income profiles: 100','detail routes: 366',historical.checkpoint_id,historical.source_commit,`canonical files: ${historical.canonical_file_count}`,historical.canonical_content_sha256,historical.canonical_identity_sha256,historical.release_integrity_baseline_id,historical.reproducible_build_baseline_id,historical.reproducibility_checkpoint.tree_sha256,`output files: ${historical.reproducibility_checkpoint.file_count}`,`total bytes: ${historical.reproducibility_checkpoint.total_bytes}`,'reproducible: true'],'historical release note');

check(historical.release_integrity_baseline_id==='sog_release_integrity_pr316_2026_07_06','historical release-integrity baseline changed');
check(historical.reproducible_build_baseline_id===reproducible.baseline_id,'historical reproducibility binding changed');
check(releaseBaseline.status==='current','release baseline status');
check(releaseBaseline.baseline_id==='sog_release_integrity_pr365_112_assets_2026_07_14','release baseline ID');
check(current.checkpoint_id==='sog_evidence_archive_maintenance_batch_2_canonical_112_checkpoint_pr365_2026_07_14','current checkpoint ID');
check(current.asset_count===112,'current asset count');
check(current.evidence_quality?.archive_index_count===390,'current archive count');
check(current.evidence_quality?.archive_not_recorded_count===169,'current no-archive count');
for(const [a,b,label] of [['stablecoins','asset_count','assets'],['organizations','organizations','organizations'],['events','events','events'],['evidence','evidence','evidence'],['deployments','deployments','deployments']])check(releaseBaseline.expected_v2_counts?.[a]===current[a==='stablecoins'?b:'expected_counts']?.[a==='stablecoins'?undefined:b]||a==='stablecoins'&&releaseBaseline.expected_v2_counts?.stablecoins===current.asset_count,`release/current ${label} mismatch`);
check(releaseBaseline.evidence_quality?.archive_index_count===390,'release archive count');
check(releaseBaseline.evidence_quality?.archive_not_recorded_count===169,'release no-archive count');

const first=history.snapshots?.[0],latest=history.snapshots?.at(-1);
check(first?.checkpoint_id===historical.checkpoint_id&&first?.asset_count===100,'historical stats snapshot');
check(latest?.checkpoint_id===historyCheckpoint.checkpoint_id,'latest history checkpoint');
check(latest?.canonical_checkpoint_id===current.checkpoint_id,'latest canonical binding');
check(latest?.totals?.assets===112&&latest?.totals?.evidence===559&&latest?.totals?.deployments===174&&latest?.totals?.market_access_records===8,'latest totals');
check(latest?.data_quality?.coverage?.archive_evidence?.count===390,'latest archive coverage');
check(historyCheckpoint.canonical_checkpoint_id===current.checkpoint_id,'history/current binding');

check(reviewGate.status==='deterministic_internal_review_gate'&&reviewGate.public_output===false,'review gate identity');
check(reviewGate.current_counts?.assets===112&&reviewGate.current_counts?.evidence===557&&reviewGate.current_counts?.market_access_records===8,'historical PR361 counts');
check(JSON.stringify(reviewGate.approved_next_sequence?.map(x=>x.pr))===JSON.stringify([363,364,365]),'approved sequence');
check(reviewGate.decisions?.market_access_pilot_3?.decision==='not_approved','Market Access Pilot 3 boundary');
check(reviewGate.decisions?.record_growth_batch_2?.decision==='not_approved_in_next_sequence','Record Growth Batch 2 boundary');
check(reviewGate.decisions?.new_public_surface?.decision==='not_approved','public surface boundary');

const update=updates.filter(x=>x.id==='sog_update_2026_07_06_audited_100_asset_checkpoint');
check(update.length===1&&update[0].date==='2026-07-06'&&update[0].category==='data','historical update row');
['/stablecoins/','/issuers/','/events/','/methodology/','/updates/','/data/manifest.json','/version.json'].forEach(route=>check(update[0]?.related_paths?.includes(route),`historical update route ${route}`));
markers(historyAmendment,['PR #325 deterministic statistics generator and validator: complete','PR #326 immutable checkpoint history: active','PR #327 /stats/ foundation: next'],'historical PR326 amendment');
markers(depthAmendment,['PR #353 Record Depth & Coverage Baseline: active','PR #354 Tier A Dossier Deepening — Batch 1: next','Queue order must be deterministic and non-ranking.'],'historical PR353 amendment');
markers(roadmap,['Canonical stable assets: 112','PR #363 Record Depth and Coverage Baseline Refresh','PR #364 Tier A Dossier Deepening Batch 4','PR #365 Evidence and Archive Maintenance Batch 2','112 stable assets','559 Evidence records','174 deployments','390 archive indexes recorded','169 archive indexes not recorded','REVIEW GATE'],'current roadmap');

if(failures.length){console.error('Non-UI release material validation failed:');failures.forEach(x=>console.error(`- ${x}`));process.exit(1)}
console.log(JSON.stringify({ok:true,historical_checkpoint_id:historical.checkpoint_id,current_checkpoint_id:current.checkpoint_id,current_history_checkpoint_id:historyCheckpoint.checkpoint_id,current_stable_assets:112,current_evidence:559,current_archive_indexes:390,current_deployments:174,current_market_access_records:8,current_release_integrity_baseline_id:releaseBaseline.baseline_id,active_workstream:'review_gate',next_workstream:'none_pre_authorized'},null,2));
