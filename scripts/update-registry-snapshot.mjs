import fs from 'node:fs';

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = JSON.parse(fs.readFileSync(v2Path, 'utf8'));
v2.baseline_id = 'sog_registry_v2_dola_launch_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'dola-launch';
v2.minimum_counts.events = 129;
v2.minimum_counts.event_details = 129;
v2.minimum_counts.evidence = 389;
v2.minimum_counts.evidence_relations = 389;
if (!v2.data_groups.evidence_relations.includes('data/evidence-batch-n.json')) {
  v2.data_groups.evidence_relations.push('data/evidence-batch-n.json');
}
fs.writeFileSync(v2Path, `${JSON.stringify(v2, null, 2)}\n`);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = JSON.parse(fs.readFileSync(v3Path, 'utf8'));
v3.baseline_id = 'sog_registry_v3_dola_launch_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'dola-launch';
v3.expected_counts.events = 129;
v3.expected_counts.event_details = 129;
v3.expected_counts.evidence = 389;
v3.quality.launch_date_unresolved = 22;
fs.writeFileSync(v3Path, `${JSON.stringify(v3, null, 2)}\n`);
