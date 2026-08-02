from pathlib import Path
import json
import re

ROOT = Path('.')
PRODUCTION_COMMIT = 'd33eda34830905e0fc7301dd55e1efd167f47efa'
PRODUCTION_HASH = 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb'

def read(path):
    return (ROOT / path).read_text(encoding='utf-8')

def write(path, content):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')

def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected one anchor, found {count}')
    return text.replace(old, new, 1)

def insert_before_once(text, anchor, block, label):
    count = text.count(anchor)
    if count != 1:
        raise RuntimeError(f'{label}: expected one anchor, found {count}')
    return text.replace(anchor, block + anchor, 1)

# Source-review artifact
review = {
  'schema_version': '1.0',
  'review_id': 'sog_terminal_date_boundary_review_batch_2_pr512_2026_08_02',
  'status': 'reviewed_bounded_no_canonical_date_change',
  'public_output': False,
  'authority_pr': 511,
  'implementation_pr': 512,
  'reviewed_at': '2026-08-02',
  'source_queue': 'data/quality/terminal-date-unresolved.json',
  'target_count': 2,
  'exact_terminal_day_resolved_count': 0,
  'reviewed_null_preserved_count': 2,
  'canonical_evidence_added_count': 0,
  'canonical_evidence_relation_added_count': 0,
  'method': 'Primary-source review of protocol continuation, V2 migration, governance, minting, and contract-continuity boundaries. Day-level dates were accepted only if they proved the final effective end of the same canonical stable-asset identity.',
  'dispositions': [
    {
      'stablecoin_id': 'sog_st_bac',
      'decision': 'reviewed_null_preserved',
      'canonical_terminal_date_before': None,
      'canonical_terminal_date_after': None,
      'best_known_range': 'Basis Cash V2 launched on 2021-04-26 and official roadmap activity continued through 2021-06-01; final BAC shutdown and contract end unresolved',
      'reason_code': 'official_continuation_without_shutdown_or_contract_end',
      'review_note': 'Official Basis Cash material records a V2 launch, BAS and BAC-liquidity migration work, and continued roadmap execution through 2021-06-01. These sources describe protocol continuation rather than final cessation. No reviewed primary source establishes an official BAC shutdown, final mint stop, governance disablement, contract disablement, or final token end. The final official update, V2 launch, migration window, depeg, low liquidity, and repository inactivity are not coerced into a terminal date.',
      'reviewed_primary_sources': [
        'https://medium.com/basis-cash/basis-v2-migration-plan-6bdd88198da2',
        'https://medium.com/basis-cash/basis-v2-launch-day-is-here-950900ac0a9f',
        'https://medium.com/basis-cash/roadmap-dev-update-fefda027496b',
        'https://github.com/Basis-Cash/basiscash-protocol'
      ],
      'rejected_shortcuts': [
        'v2_launch_as_terminal_date',
        'migration_window_as_bac_shutdown',
        'last_official_update_as_final_end',
        'last_repository_commit_as_terminal_date',
        'depeg_or_negligible_liquidity_as_terminal_date'
      ],
      'remaining_unknowns': [
        'official BAC shutdown notice',
        'final BAC mint stop',
        'governance disablement',
        'contract-level terminal end state'
      ],
      'evidence_identity_changes': 0,
      'evidence_relation_changes': 0
    },
    {
      'stablecoin_id': 'sog_st_dsd',
      'decision': 'reviewed_null_preserved',
      'canonical_terminal_date_before': None,
      'canonical_terminal_date_after': None,
      'best_known_range': 'DSD V2 and Sushiswap migration were operating by 2021-04-08; formal shutdown, governance revocation, and contract end unresolved',
      'reason_code': 'v2_execution_without_shutdown_or_terminal_effect',
      'review_note': 'Official Dynamic Set Dollar material shows that DIP-10 replaced the coupon system with CDSD, DSD V2 entered operation, and the primary liquidity pool migrated toward Sushiswap. Those changes continued the same protocol and token system; they did not terminate DSD. No reviewed primary source establishes a formal shutdown, final mint stop, governance revocation, contract disablement, final migration away from DSD, or final token end. V2 execution, liquidity-pool migration, the last official publication, depeg, and repository inactivity are not treated as terminal dates.',
      'reviewed_primary_sources': [
        'https://dynamicsetdollar.medium.com/dsd-sushiswap-migration-f413d795aa81',
        'https://dynamicsetdollar.medium.com/dsd-v2-final-specs-voting-d17db9c8b5a',
        'https://dynamicsetdollar.medium.com/a-guide-for-dsd-v2-a177026f2cb8',
        'https://github.com/dynamicsetdollar/dsd-protocol'
      ],
      'rejected_shortcuts': [
        'v2_execution_as_terminal_date',
        'sushiswap_migration_as_protocol_shutdown',
        'coupon_replacement_as_dsd_token_end',
        'last_official_publication_as_final_end',
        'last_repository_commit_or_depeg_as_terminal_date'
      ],
      'remaining_unknowns': [
        'formal DSD shutdown',
        'final DSD mint stop',
        'governance revocation',
        'contract-level terminal end state'
      ],
      'evidence_identity_changes': 0,
      'evidence_relation_changes': 0
    }
  ],
  'deferred_non_target': {
    'stablecoin_id': 'sog_st_gyen',
    'reason': 'official initial redemption period remains open through 2026-11-11',
    'not_before': '2026-11-12',
    'changed': False
  },
  'decision': {
    'all_targets_disposed': True,
    'exact_terminal_day_evidence_found': False,
    'unsupported_date_coercion': False,
    'canonical_counts_preserved': True,
    'terminal_queue_total_preserved': 6,
    'next_boundary': 'REVIEW_GATE'
  },
  'constraints': {
    'asset_changes': 0,
    'organization_changes': 0,
    'relationship_changes': 0,
    'event_changes': 0,
    'evidence_identity_changes': 0,
    'evidence_relation_changes': 0,
    'deployment_changes': 0,
    'market_access_changes': 0,
    'route_family_changes': 0,
    'material_ui_changes': 0,
    'legacy_redirect_changes': 0,
    'automatic_continuation': False
  }
}
write('data/editorial-research/terminal-date-boundary-review-batch-2-pr512-source-review.json', json.dumps(review, indent=2) + '\n')

# Update unresolved queue only for BAC and DSD.
queue_path = 'data/quality/terminal-date-unresolved.json'
queue = json.loads(read(queue_path))
assert queue.get('expected_total') == 6
by_id = {r['stablecoin_id']: r for r in queue['records']}
assert set(['sog_st_bac', 'sog_st_dsd', 'sog_st_gyen']).issubset(by_id)

bac = by_id['sog_st_bac']
bac.update({
  'strongest_known_boundary': '2021-06-01 latest recovered official roadmap and development update; final BAC shutdown unresolved',
  'boundary_type': 'reviewed_non_terminal_boundary',
  'last_confirmed_activity': '2026-06-25 canonical BAC ERC-20 remains deployed and transferable; recovered official project roadmap continued through 2021-06-01',
  'formal_shutdown_announcement': 'not_recovered_after_primary_source_review',
  'reason_code': 'official_continuation_without_shutdown_or_contract_end',
  'review_note': 'Official Basis Cash material records V2 launch, BAS and BAC-liquidity migration work, and continued roadmap execution through 2021-06-01. No reviewed primary source establishes an official BAC shutdown, final mint stop, governance disablement, contract disablement, or final token end. Continued transferability does not restore active protocol status or establish a terminal day.',
  'rejected_shortcuts': [
    'v2_launch_as_terminal_date',
    'migration_window_as_bac_shutdown',
    'last_official_update_as_final_end',
    'last_repository_commit_as_terminal_date',
    'depeg_or_negligible_liquidity_as_terminal_date'
  ],
  'future_review_target': 'official_shutdown_notice_or_final_mint_stop_or_governance_disablement_or_contract_level_terminal_end_state',
  'last_reviewed': '2026-08-02',
  'reviewed_primary_sources': [
    'https://medium.com/basis-cash/basis-v2-migration-plan-6bdd88198da2',
    'https://medium.com/basis-cash/basis-v2-launch-day-is-here-950900ac0a9f',
    'https://medium.com/basis-cash/roadmap-dev-update-fefda027496b',
    'https://github.com/Basis-Cash/basiscash-protocol'
  ],
  'review_outcome': 'reviewed_null_preserved',
  'canonical_terminal_date_before': None,
  'canonical_terminal_date_after': None
})

dsd = by_id['sog_st_dsd']
dsd.update({
  'strongest_known_boundary': '2021-04-08 DSD V2 operating guide after DIP-10 and Sushiswap migration activity; final protocol end unresolved',
  'boundary_type': 'reviewed_non_terminal_boundary',
  'last_confirmed_activity': '2021-04-08 DSD V2 operating guide and launch activity',
  'first_confirmed_successor_or_inactive': '2021-04-08 V2 mechanics operating as continuation of DSD, not a successor termination',
  'formal_shutdown_announcement': 'not_recovered_after_primary_source_review',
  'reason_code': 'v2_execution_without_shutdown_or_terminal_effect',
  'review_note': 'Official Dynamic Set Dollar material shows DIP-10 replaced the coupon system with CDSD, DSD V2 entered operation, and liquidity migrated toward Sushiswap. These changes continued DSD and did not terminate the canonical token identity. No reviewed primary source establishes formal shutdown, final mint stop, governance revocation, contract disablement, or final token end.',
  'rejected_shortcuts': [
    'v2_execution_as_terminal_date',
    'sushiswap_migration_as_protocol_shutdown',
    'coupon_replacement_as_dsd_token_end',
    'last_official_publication_as_final_end',
    'last_repository_commit_or_depeg_as_terminal_date'
  ],
  'future_review_target': 'formal_shutdown_or_final_mint_stop_or_governance_revocation_or_contract_level_terminal_end_state',
  'last_reviewed': '2026-08-02',
  'reviewed_primary_sources': [
    'https://dynamicsetdollar.medium.com/dsd-sushiswap-migration-f413d795aa81',
    'https://dynamicsetdollar.medium.com/dsd-v2-final-specs-voting-d17db9c8b5a',
    'https://dynamicsetdollar.medium.com/a-guide-for-dsd-v2-a177026f2cb8',
    'https://github.com/dynamicsetdollar/dsd-protocol'
  ],
  'review_outcome': 'reviewed_null_preserved',
  'canonical_terminal_date_before': None,
  'canonical_terminal_date_after': None
})
write(queue_path, json.dumps(queue, indent=2) + '\n')

# Update Batch 2 spec with reviewed result.
spec_path = 'docs/quality/terminal-date-boundary-review-batch-2-spec.md'
spec = read(spec_path)
spec = replace_once(spec, 'Status: authorized bounded private review', 'Status: reviewed bounded implementation — no canonical date change', 'spec status')
result_block = '''## Reviewed implementation result

PR #512 reviewed both fixed targets using first-party project publications and repositories.

```text
exact terminal days resolved: 0
reviewed null preserved: 2
new Evidence identities: 0
new Evidence Relations: 0
canonical and public count changes: 0
legacy redirect changes: 0
```

BAC V2 launch, migration work, and the 2021-06-01 roadmap update establish continuation rather than final cessation. DSD V2 execution and Sushiswap migration establish continued protocol operation rather than shutdown. Neither target has day-level primary evidence of an official final end.

GYEN remained excluded and unchanged because its initial redemption period is open through 2026-11-11.

'''
spec = insert_before_once(spec, '## Exit', result_block, 'spec result')
write(spec_path, spec)

# Update AGENTS.
agents = read('AGENTS.md')
agents = replace_once(agents, 'Current production checkpoint: 8344504f41df8debd2da90b1b60a61da6fba9a58', f'Current production checkpoint: {PRODUCTION_COMMIT}', 'AGENTS production')
agents = replace_once(
  agents,
  '19. PR #511 authorizes one bounded terminal-date boundary review for BAC and DSD; implementation is reserved for PR #512.\n20. PR #512 is reserved for the fixed BAC and DSD implementation and must return to REVIEW GATE.',
  '19. PR #511 authorized one bounded terminal-date boundary review for BAC and DSD.\n20. PR #512 reviewed both fixed targets, preserved both canonical terminal dates as null, and is under review.',
  'AGENTS authority chain'
)
agents = replace_once(
  agents,
  'PR #511 Terminal Date Boundary Review — Batch 2 authorization: active\nPR #512 Terminal Date Boundary Review — Batch 2: reserved implementation\nRequired exit after PR #512 merge and production verification: REVIEW GATE',
  'PR #511 Terminal Date Boundary Review — Batch 2 authorization: complete and production-verified\nPR #512 Terminal Date Boundary Review — Batch 2: implementation under review\nRequired exit after PR #512 merge and production verification: REVIEW GATE',
  'AGENTS workstream'
)
review_block = '''## PR #512 reviewed terminal-date result — Batch 2

PR #512 reviewed the fixed BAC and DSD terminal-date boundaries using first-party project publications and repositories. No source established the final effective end of the same canonical identity.

```text
exact terminal days resolved: 0
canonical null dates preserved: 2
new Evidence identities: 0
new Evidence Relations: 0
canonical or public count changes: 0
legacy redirect changes: 0
```

BAC's V2 launch, BAS and BAC-liquidity migration work, and official roadmap activity through 2021-06-01 establish protocol continuation, not an official BAC shutdown or contract end. DSD's DIP-10 execution, CDSD mechanics, and Sushiswap migration establish continued DSD operation, not formal shutdown, governance revocation, or token termination.

GYEN remained excluded and unchanged because its official initial redemption period remains open through 2026-11-11.

After PR #512 merge and production verification, stop at REVIEW GATE. No third terminal-date batch is authorized automatically.

'''
agents = insert_before_once(agents, '## PR #511 authorized terminal-date review — Batch 2', review_block, 'AGENTS review result')
write('AGENTS.md', agents)

# Update roadmap.
roadmap = read('docs/roadmap.md')
roadmap = replace_once(roadmap, 'Status: PR #511 Terminal Date Boundary Review — Batch 2 authorized; PR #512 reserved', 'Status: PR #512 Terminal Date Boundary Review — Batch 2 under review; exit boundary REVIEW GATE', 'roadmap status')
roadmap = replace_once(roadmap, 'Current production checkpoint: 8344504f41df8debd2da90b1b60a61da6fba9a58', f'Current production checkpoint: {PRODUCTION_COMMIT}', 'roadmap production')
roadmap = replace_once(roadmap, 'Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #510 production converged with exact count, route, metadata, provenance, archive-partition, and canonical-hash parity.', 'Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #511 production converged with exact count, route, metadata, provenance, archive-partition, and canonical-hash parity.', 'roadmap production paragraph')
roadmap = replace_once(roadmap, 'PR #511 Terminal Date Boundary Review — Batch 2 authorization: active\nPR #512 Terminal Date Boundary Review — Batch 2: reserved implementation', 'PR #511 Terminal Date Boundary Review — Batch 2 authorization: complete and production-verified\nPR #512 Terminal Date Boundary Review — Batch 2: implementation under review', 'roadmap acceptance')
result_roadmap = '''## PR #512 reviewed item

```text
Terminal Date Boundary Review — Batch 2
Authority PR: #511
Implementation PR: #512
Targets reviewed: BAC, DSD
Exact terminal days resolved: 0
Reviewed null preserved: 2
Deferred and unchanged: GYEN
```

BAC official V2 launch, migration, and roadmap sources establish continued protocol work but no official shutdown, final mint stop, governance disablement, contract disablement, or final token end. DSD official DIP-10, V2, and Sushiswap migration sources establish continued operation but no formal shutdown, final mint stop, governance revocation, contract disablement, or final token end.

No canonical stable-asset, organization, relationship, event, Evidence, deployment, Market Access, route, UI, or legacy redirect changed.

After merge and production verification, return to REVIEW GATE.

'''
roadmap = insert_before_once(roadmap, '## Authorized current item', result_roadmap, 'roadmap result')
roadmap = replace_once(roadmap, 'PR #511 authority active\nPR #512 reserved implementation\nthen REVIEW GATE', 'PR #512 implementation under review, then REVIEW GATE', 'roadmap boundary')
write('docs/roadmap.md', roadmap)

# Update governance.
governance = read('docs/spec-governance.md')
governance = replace_once(
  governance,
  'PR #511 Terminal Date Boundary Review — Batch 2 authority active\nPR #512 reserved implementation',
  'PR #512 Terminal Date Boundary Review — Batch 2 implementation under review',
  'governance current item'
)
governance = replace_once(
  governance,
  'PR #510 post-PR #509 authority synchronization complete and production-verified\nproduction commit: 8344504f41df8debd2da90b1b60a61da6fba9a58\nproduction canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb\nconvergence attempt: 2\nPR #511 fixed targets: sog_st_bac, sog_st_dsd\nexplicitly deferred: sog_st_gyen until after 2026-11-11\nimplementation PR: #512\nnext boundary after PR #512: REVIEW GATE',
  f'PR #511 Terminal Date Boundary Review — Batch 2 authority complete and production-verified\nproduction commit: {PRODUCTION_COMMIT}\nproduction canonical hash: {PRODUCTION_HASH}\nconvergence attempt: 1\nPR #512 exact targets: sog_st_bac, sog_st_dsd\nexact terminal days resolved: 0\nreviewed null preserved: 2\nnew Evidence identities or Relations: 0\ncanonical and public count changes: 0\nlegacy redirect changes: 0\nexplicitly deferred and unchanged: sog_st_gyen until after 2026-11-11\nnext boundary after PR #512: REVIEW GATE',
  'governance decision'
)
governance = replace_once(governance, 'Only PR #512 is authorized by this decision.', 'PR #512 is the only authorized implementation and is now under review.', 'governance authorization sentence')
implementation_text = '''PR #512 reviewed both fixed targets and preserved both canonical terminal dates as null. BAC V2 launch, migration activity, and the 2021-06-01 roadmap update do not establish official shutdown, final mint stop, governance disablement, contract disablement, or final token end. DSD DIP-10 execution, CDSD mechanics, and Sushiswap migration do not establish formal shutdown, final mint stop, governance revocation, contract disablement, or final token end. PR #512 adds no Evidence identity or Relation, alters no Market Access record, route family, material UI, or legacy redirect, and must exit to REVIEW GATE after production verification.

'''
governance = insert_before_once(governance, '## 11. YLDS scope boundary', implementation_text, 'governance implementation result')
governance = replace_once(governance, 'PR #511 is the active authority item. Before PR #512 may merge, review:', 'PR #512 is the current implementation under review. Before merge and production acceptance, review:', 'governance review gate')
write('docs/spec-governance.md', governance)

# Dedicated validator.
validator = f"""import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => {{ if (!condition) failures.push(message); }};

const config = readJson('config/terminal-date-boundary-review-batch-2.json');
const review = readJson('data/editorial-research/terminal-date-boundary-review-batch-2-pr512-source-review.json');
const queue = readJson('data/quality/terminal-date-unresolved.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const spec = readText('docs/quality/terminal-date-boundary-review-batch-2-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const targets = ['sog_st_bac', 'sog_st_dsd'];
const productionCommit = '{PRODUCTION_COMMIT}';
const productionHash = '{PRODUCTION_HASH}';

expect(config.authority_pr === 511 && config.implementation_pr === 512, 'authority chain changed');
expect(JSON.stringify(config.target_stablecoin_ids) === JSON.stringify(targets), 'authorized target set changed');
expect(config.explicitly_deferred?.stablecoin_id === 'sog_st_gyen' && config.explicitly_deferred?.not_before === '2026-11-12', 'GYEN deferment changed');
expect(review.status === 'reviewed_bounded_no_canonical_date_change', 'review status changed');
expect(review.target_count === 2 && review.exact_terminal_day_resolved_count === 0 && review.reviewed_null_preserved_count === 2, 'review outcomes changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'Evidence boundary changed');
expect(JSON.stringify(review.dispositions.map((d) => d.stablecoin_id)) === JSON.stringify(targets), 'review target set changed');
for (const disposition of review.dispositions) {{
  expect(disposition.decision === 'reviewed_null_preserved', `decision changed: ${{disposition.stablecoin_id}}`);
  expect(disposition.canonical_terminal_date_before === null && disposition.canonical_terminal_date_after === null, `terminal null changed: ${{disposition.stablecoin_id}}`);
  expect(disposition.evidence_identity_changes === 0 && disposition.evidence_relation_changes === 0, `Evidence changes found: ${{disposition.stablecoin_id}}`);
}}
expect(review.deferred_non_target?.stablecoin_id === 'sog_st_gyen' && review.deferred_non_target?.changed === false, 'GYEN changed');

expect(queue.expected_total === 6 && queue.records.length === 6, 'terminal queue total changed');
const records = new Map(queue.records.map((record) => [record.stablecoin_id, record]));
for (const id of targets) {{
  const record = records.get(id);
  expect(record?.review_outcome === 'reviewed_null_preserved', `queue outcome missing: ${{id}}`);
  expect(record?.canonical_terminal_date_before === null && record?.canonical_terminal_date_after === null, `queue terminal date changed: ${{id}}`);
  expect(record?.last_reviewed === '2026-08-02', `queue review date missing: ${{id}}`);
}}
expect(records.get('sog_st_bac')?.reason_code === 'official_continuation_without_shutdown_or_contract_end', 'BAC reason changed');
expect(records.get('sog_st_dsd')?.reason_code === 'v2_execution_without_shutdown_or_terminal_effect', 'DSD reason changed');
expect(records.get('sog_st_gyen')?.reason_code === 'redemption_period_still_open', 'GYEN queue changed');
expect(!('review_outcome' in records.get('sog_st_gyen')), 'GYEN was reviewed prematurely');

expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(agents.includes('Current production checkpoint: ' + productionCommit), 'AGENTS production checkpoint missing');
expect(agents.includes('PR #512 Terminal Date Boundary Review — Batch 2: implementation under review'), 'AGENTS implementation state missing');
expect(roadmap.includes('Status: PR #512 Terminal Date Boundary Review — Batch 2 under review; exit boundary REVIEW GATE'), 'roadmap status missing');
expect(governance.includes('PR #512 Terminal Date Boundary Review — Batch 2 implementation under review'), 'governance state missing');
expect(spec.includes('exact terminal days resolved: 0') && spec.includes('reviewed null preserved: 2'), 'spec result missing');
expect(active === \"import './validate-terminal-date-boundary-review-pr512.mjs';\", 'active workstream is not wired to PR #512');
for (const temp of ['.github/workflows/pr512-terminal-date-review-finalize.yml', 'scripts/finalize-terminal-date-boundary-review-batch-2-pr512.py']) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${{temp}}`);

if (failures.length) {{
  console.error('PR #512 terminal-date review validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}}
console.log(JSON.stringify({{
  ok: true,
  authority_pr: 511,
  implementation_pr: 512,
  targets,
  exact_terminal_day_resolved: 0,
  reviewed_null_preserved: 2,
  deferred_unchanged: 'sog_st_gyen',
  production_commit: productionCommit,
  production_hash: productionHash,
  canonical_counts_preserved: true,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}}, null, 2));
"""
write('scripts/validate-terminal-date-boundary-review-pr512.mjs', validator)
write('scripts/validate-active-workstream.mjs', "import './validate-terminal-date-boundary-review-pr512.mjs';\n")

# Remove temporary finalizer artifacts before validator runs.
for temp in ['.github/workflows/pr512-terminal-date-review-finalize.yml', 'scripts/finalize-terminal-date-boundary-review-batch-2-pr512.py']:
    p = ROOT / temp
    if p.exists():
        p.unlink()
