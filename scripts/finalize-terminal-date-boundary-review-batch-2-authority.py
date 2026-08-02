from pathlib import Path
import json
import re

ROOT = Path(".")
PRODUCTION_COMMIT = "8344504f41df8debd2da90b1b60a61da6fba9a58"
PRODUCTION_HASH = "sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb"
AUTHORITY_PR = 511
IMPLEMENTATION_PR = 512
AUTHORITY_BRANCH = "agent/terminal-date-boundary-review-batch-2-authority"

def read(path):
    return (ROOT / path).read_text(encoding="utf-8")

def write(path, content):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")

def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one anchor, found {count}")
    return text.replace(old, new, 1)

def insert_before_once(text, anchor, block, label):
    count = text.count(anchor)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one anchor, found {count}")
    return text.replace(anchor, block + anchor, 1)

# AGENTS.md
agents = read("AGENTS.md")
agents = replace_once(
    agents,
    "Current production checkpoint: 96ae5edd42e9a9e8a652bb27acc2d6a6eb02dfd6",
    f"Current production checkpoint: {PRODUCTION_COMMIT}",
    "AGENTS production checkpoint",
)
agents = replace_once(
    agents,
    """17. PR #509 reviewed all three terminal-date boundaries, preserved all three canonical dates as null, and was production-verified.
18. PR #510 synchronizes the completed PR #509 checkpoint and returns repository authority to REVIEW GATE.
19. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.""",
    """17. PR #509 reviewed all three terminal-date boundaries, preserved all three canonical dates as null, and was production-verified.
18. PR #510 synchronized the completed PR #509 checkpoint, was production-verified, and returned repository authority to REVIEW GATE.
19. PR #511 authorizes one bounded terminal-date boundary review for BAC and DSD; implementation is reserved for PR #512.
20. PR #512 is reserved for the fixed BAC and DSD implementation and must return to REVIEW GATE.
21. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.""",
    "AGENTS authority chain",
)

reading_order = """## Mandatory reading order

Before changing code, canonical data, workflows, infrastructure, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-02-terminal-date-boundary-review-batch-2.md`
6. `docs/quality/terminal-date-boundary-review-batch-2-spec.md`
7. `config/terminal-date-boundary-review-batch-2.json`
8. `data/quality/terminal-date-unresolved.json`
9. `docs/roadmap-amendments/2026-08-01-terminal-date-boundary-review-batch-1.md`
10. `docs/quality/terminal-date-boundary-review-batch-1-spec.md`
11. `config/terminal-date-boundary-review-batch-1.json`
12. `docs/roadmap-amendments/2026-08-01-evidence-archive-payload-verification-batch-1.md`
13. `docs/quality/evidence-archive-payload-verification-batch-1-spec.md`
14. `config/evidence-archive-payload-verification-batch-1.json`
15. `docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md`
16. `docs/quality/launch-date-boundary-review-batch-1-spec.md`
17. `config/launch-date-boundary-review-batch-1.json`
18. `docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md`
19. `docs/post-351-data-growth-operating-spec.md`
20. `docs/quality/mnee-evidence-archive-maintenance-spec.md`
21. `config/mnee-evidence-archive-maintenance.json`
22. `data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json`
23. `docs/migration/current-canonical-checkpoint.json`
24. `docs/migration/current-review-checkpoint.json`
25. `docs/migration/current-stats-history-checkpoint.json`
26. every named baseline, queue, audit, handoff, source-coverage report, and prior output required by a separately authorized work item

"""
agents = re.sub(
    r"## Mandatory reading order\n\nBefore changing code, canonical data, workflows, infrastructure, or documentation, read:\n\n.*?\n\nMerged repository authority",
    reading_order + "Merged repository authority",
    agents,
    count=1,
    flags=re.S,
)
agents = replace_once(
    agents,
    """PR #509 Terminal Date Boundary Review — Batch 1: complete and production-verified
Required exit after PR #509 merge and production verification: REVIEW GATE — satisfied
PR #510 post-PR #509 authority synchronization: active
Current repository authority: REVIEW GATE""",
    """PR #509 Terminal Date Boundary Review — Batch 1: complete and production-verified
Required exit after PR #509 merge and production verification: REVIEW GATE — satisfied
PR #510 post-PR #509 authority synchronization: complete and production-verified
PR #511 Terminal Date Boundary Review — Batch 2 authorization: active
PR #512 Terminal Date Boundary Review — Batch 2: reserved implementation
Required exit after PR #512 merge and production verification: REVIEW GATE""",
    "AGENTS current workstream",
)

batch2_agents = f"""## PR #511 authorized terminal-date review — Batch 2

PR #512 must review exactly two unresolved terminal-date records:

```text
sog_st_bac
sog_st_dsd
```

BAC must be reviewed for an official shutdown notice, final mint stop, governance disablement, or contract-level terminal end state. DSD must be reviewed for an executed migration, formal shutdown, final mint stop, governance revocation, or contract-level terminal end state.

`sog_st_gyen` is explicitly excluded. Its official initial redemption period remains open through 2026-11-11, so the wind-down start, purchase disablement, and notice date cannot be treated as final token termination.

A canonical terminal date requires exact day-level primary evidence of the final effective end for the same canonical identity. Depeg, negligible liquidity, last repository activity, design publication, migration planning, successor discussion, and market inactivity are insufficient.

PR #512 must either resolve the exact final day or preserve null with a reviewed range, reason code, review date, primary-source list, and rejected shortcuts. No replacement target or automatic Evidence promotion is allowed.

Authority checkpoint:

```text
source production commit: {PRODUCTION_COMMIT}
canonical hash: {PRODUCTION_HASH}
convergence attempt: 2
stable assets: 117
organizations: 108
relationships: 129
events: 192
Evidence: 579
Evidence Relations: 579
deployments: 184
Market Access records: 8
detail routes: 417
metadata-checked routes: 417
archive recorded: 457
archive not recorded: 122
legacy redirect changes: 0
```

After PR #512 merge and production verification, stop at REVIEW GATE. No third terminal-date batch is authorized automatically.

"""
agents = insert_before_once(
    agents,
    "## PR #508 authorized terminal-date review",
    batch2_agents,
    "AGENTS batch 2 section",
)
write("AGENTS.md", agents)

# docs/roadmap.md
roadmap = read("docs/roadmap.md")
roadmap = replace_once(
    roadmap,
    "Status: PR #509 complete and production-verified; REVIEW GATE",
    "Status: PR #511 Terminal Date Boundary Review — Batch 2 authorized; PR #512 reserved",
    "roadmap status",
)
roadmap = replace_once(
    roadmap,
    "Current production checkpoint: 96ae5edd42e9a9e8a652bb27acc2d6a6eb02dfd6",
    f"Current production checkpoint: {PRODUCTION_COMMIT}",
    "roadmap production checkpoint",
)
roadmap = replace_once(
    roadmap,
    "Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #509 production converged with exact count, route, metadata, provenance, archive-partition, and canonical-hash parity.",
    "Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #510 production converged with exact count, route, metadata, provenance, archive-partition, and canonical-hash parity.",
    "roadmap production paragraph",
)
roadmap = replace_once(
    roadmap,
    """PR #508 Terminal Date Boundary Review — Batch 1 authorization: complete
PR #509 Terminal Date Boundary Review — Batch 1: complete and production-verified
PR #510 post-PR #509 authority synchronization: active""",
    """PR #508 Terminal Date Boundary Review — Batch 1 authorization: complete
PR #509 Terminal Date Boundary Review — Batch 1: complete and production-verified
PR #510 post-PR #509 authority synchronization: complete and production-verified
PR #511 Terminal Date Boundary Review — Batch 2 authorization: active
PR #512 Terminal Date Boundary Review — Batch 2: reserved implementation""",
    "roadmap acceptance points",
)
batch2_roadmap = f"""## Authorized current item

```text
Terminal Date Boundary Review — Batch 2
Authority PR: #511
Implementation PR: #512
Targets: BAC, DSD
Deferred non-target: GYEN until after its 2026-11-11 initial redemption deadline
```

PR #512 may resolve an exact terminal day only from day-level primary evidence of final effective cessation for the same canonical identity. BAC requires an official shutdown, final mint stop, governance disablement, or contract-level terminal record. DSD requires an executed migration, formal shutdown, final mint stop, governance revocation, or contract-level terminal record.

The following remain prohibited: depeg or low-liquidity inference, last-commit inference, design-publication inference, migration-planning inference, replacement targets, automatic Evidence promotion, new assets, Market Access changes, route changes, material UI changes, and legacy redirect changes.

Authority checkpoint:

```text
source production commit: {PRODUCTION_COMMIT}
canonical hash: {PRODUCTION_HASH}
convergence attempt: 2
stable assets: 117
organizations: 108
relationships: 129
events: 192
Evidence: 579
Evidence Relations: 579
deployments: 184
Market Access records: 8
detail routes: 417
metadata-checked routes: 417
archive recorded: 457
archive not recorded: 122
```

After PR #512 merge and production verification, return to REVIEW GATE.

"""
roadmap = insert_before_once(
    roadmap,
    "## PR #509 reviewed item",
    batch2_roadmap,
    "roadmap batch 2 section",
)
roadmap = replace_once(
    roadmap,
    """## Current boundary

```text
REVIEW GATE
```""",
    """## Current boundary

```text
PR #511 authority active
PR #512 reserved implementation
then REVIEW GATE
```""",
    "roadmap current boundary",
)
write("docs/roadmap.md", roadmap)

# docs/spec-governance.md
governance = read("docs/spec-governance.md")
governance = replace_once(
    governance,
    """Current item:

```text
REVIEW GATE — PR #509 complete and production-verified
```

Reviewed decision:

```text
PR #509 Terminal Date Boundary Review — Batch 1 complete and production-verified
production commit: 96ae5edd42e9a9e8a652bb27acc2d6a6eb02dfd6
production canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb
convergence attempt: 1
exact targets: sog_st_fei, sog_st_nearusn, sog_st_esd
exact terminal days resolved: 0
reviewed null preserved: 3
new Evidence identities or Relations: 0
canonical and public count changes: 0
legacy redirect changes: 0
current boundary: REVIEW GATE
```

No later work is pre-authorized.""",
    f"""Current item:

```text
PR #511 Terminal Date Boundary Review — Batch 2 authority active
PR #512 reserved implementation
```

Reviewed decision:

```text
PR #510 post-PR #509 authority synchronization complete and production-verified
production commit: {PRODUCTION_COMMIT}
production canonical hash: {PRODUCTION_HASH}
convergence attempt: 2
PR #511 fixed targets: sog_st_bac, sog_st_dsd
explicitly deferred: sog_st_gyen until after 2026-11-11
implementation PR: #512
next boundary after PR #512: REVIEW GATE
```

Only PR #512 is authorized by this decision.""",
    "governance current item",
)
batch2_governance = f"""## 10A. Terminal Date Boundary Review — Batch 2 authority

PR #511 closes the current review gate only for a two-target terminal-date evidence review. Implementation is reserved for PR #512.

The exact target set is `sog_st_bac` and `sog_st_dsd`.

- BAC requires day-level primary evidence of an official shutdown, final mint stop, governance disablement, or contract-level terminal end state.
- DSD requires day-level primary evidence of an executed migration, formal shutdown, final mint stop, governance revocation, or contract-level terminal end state.
- GYEN is not a target. Its official initial redemption period remains open through 2026-11-11, so no final terminal day may be inferred from the wind-down start, purchase disablement, or notice date.

Allowed outcomes are `exact_terminal_day_resolved` and `reviewed_null_preserved`. Every target must receive a reviewed range, reason code, review date, primary-source list, and rejected-shortcut record.

The implementation may not add a replacement target, infer a date from depeg, price lows, negligible liquidity, last repository activity, design publication, migration planning, successor discussion, or market inactivity, or automatically promote a new Evidence identity.

The authority checkpoint is production commit `{PRODUCTION_COMMIT}`, canonical hash `{PRODUCTION_HASH}`, convergence attempt 2, canonical counts 117/108/129/192/579/579/184/8, 417 detail routes, 417 metadata-checked routes, and archive partition 457/122. No legacy redirect change is authorized.

PR #512 must return to REVIEW GATE. No third terminal-date batch is authorized automatically.

"""
governance = insert_before_once(
    governance,
    "## 11. YLDS scope boundary",
    batch2_governance,
    "governance batch 2 section",
)
governance = re.sub(
    r"## 19\. Review gate\n\nPR #509 is complete and production-verified\. The repository is at:\n\n```text\nREVIEW GATE\n```\n\nNo later terminal-date batch, archive batch, launch-date batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material UI work is authorized automatically\. Only a later separate reviewed decision may authorize another work item\.",
    """## 19. Review gate

PR #511 is the active authority item. Before PR #512 may merge, review:

```text
exact target set: sog_st_bac, sog_st_dsd
GYEN exclusion through the 2026-11-11 redemption boundary
day-level primary evidence quality
final-effective-end semantics
null-date preservation when unresolved
Evidence identity and Relation changes: 0 unless separately authorized
canonical count and route parity
legacy redirect changes: 0
production parity after PR #512
```

After PR #512 merge and production verification, return to REVIEW GATE. No later terminal-date batch, archive batch, launch-date batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material UI work is authorized automatically.""",
    governance,
    count=1,
)
write("docs/spec-governance.md", governance)

# New config
config = {
    "schema_version": "1.0",
    "authority_id": "sog_terminal_date_boundary_review_batch_2_pr511_2026_08_02",
    "status": "approved_bounded_review",
    "public_output": False,
    "authority_pr": AUTHORITY_PR,
    "implementation_pr": IMPLEMENTATION_PR,
    "reviewed_at": "2026-08-02",
    "source_queue": "data/quality/terminal-date-unresolved.json",
    "source_queue_expected_total": 6,
    "target_count": 2,
    "target_stablecoin_ids": ["sog_st_bac", "sog_st_dsd"],
    "explicitly_deferred": {
        "stablecoin_id": "sog_st_gyen",
        "reason": "official_initial_redemption_period_open",
        "not_before": "2026-11-12",
        "source_boundary": "initial redemption period open through 2026-11-11"
    },
    "target_boundaries": {
        "sog_st_bac": [
            "official shutdown notice",
            "final mint stop",
            "governance disablement",
            "contract-level terminal end state"
        ],
        "sog_st_dsd": [
            "executed migration",
            "formal shutdown",
            "final mint stop",
            "governance revocation",
            "contract-level terminal end state"
        ]
    },
    "allowed_outcomes": [
        "exact_terminal_day_resolved",
        "reviewed_null_preserved"
    ],
    "acceptance_requirements": {
        "exact_day_level_primary_evidence": True,
        "same_canonical_identity": True,
        "final_effective_terminal_boundary": True,
        "announcement_or_design_publication_alone_insufficient": True,
        "depeg_liquidity_or_market_inactivity_insufficient": True,
        "last_commit_or_last_capture_insufficient": True
    },
    "prohibited": [
        "replacement_target",
        "premature_gyen_review",
        "terminal_date_inference_from_depeg",
        "terminal_date_inference_from_price_low",
        "terminal_date_inference_from_negligible_liquidity",
        "terminal_date_inference_from_last_commit",
        "terminal_date_inference_from_design_publication",
        "terminal_date_inference_from_market_inactivity",
        "new_asset",
        "new_evidence_identity_without_separate_review",
        "market_access_change",
        "public_route_change",
        "material_ui_change",
        "legacy_redirect_change",
        "automatic_continuation_after_pr512"
    ],
    "authority_checkpoint": {
        "production_commit": PRODUCTION_COMMIT,
        "canonical_hash": PRODUCTION_HASH,
        "convergence_attempt": 2
    },
    "canonical_counts_must_remain": {
        "assets": 117,
        "organizations": 108,
        "relationships": 129,
        "events": 192,
        "evidence": 579,
        "evidence_relations": 579,
        "deployments": 184,
        "market_access_records": 8,
        "detail_routes": 417,
        "metadata_checked_routes": 417,
        "archive_recorded": 457,
        "archive_not_recorded": 122
    },
    "next_boundary": "REVIEW_GATE"
}
write("config/terminal-date-boundary-review-batch-2.json", json.dumps(config, indent=2) + "\n")

spec = """# Terminal Date Boundary Review — Batch 2

Status: authorized bounded private review  
Authority PR: #511  
Implementation PR: #512  
Public output: false

## Objective

Review exactly two unresolved terminal-date records that remain eligible for present-day primary-source research after Batch 1.

## Fixed targets

```text
sog_st_bac
sog_st_dsd
```

No replacement or third target is allowed.

## Explicitly deferred record

`sog_st_gyen` is outside this batch. GMO Trust's official boundary keeps the initial redemption period open through 2026-11-11. The wind-down start, purchase disablement, and notice date are not final token termination. A later review may be considered no earlier than 2026-11-12 and only through a separate authority decision.

## Acceptance rule

A canonical terminal day may be written only when day-level primary evidence proves a final effective terminal boundary for the same canonical identity.

BAC may be resolved only through an official shutdown notice, final mint stop, governance disablement, contract-level terminal end state, or an equivalent explicit final end.

DSD may be resolved only through an executed migration, formal shutdown, final mint stop, governance revocation, contract-level terminal end state, or an equivalent explicit final end.

The following are insufficient by themselves:

- depeg or price-low dates;
- negligible liquidity or market inactivity;
- last repository commit or last website capture;
- design or proposal publication;
- migration planning or successor discussion;
- retrospective source publication dates.

## Allowed outcomes

- `exact_terminal_day_resolved`
- `reviewed_null_preserved`

Every target must receive a reviewed range, reason code, review date, reviewed primary-source list, and explicit rejected-shortcut record.

## Preserved boundaries

PR #511 changes authority only. PR #512 must preserve 117 assets, 108 organizations, 129 relationships, 192 events, 579 Evidence identities, 579 Evidence Relations, 184 deployments, 8 Market Access records, 417 detail routes, 417 metadata-checked routes, and archive partition 457/122 unless a separate reviewed Evidence change is authorized.

No asset, organization, relationship, deployment, Market Access, route family, material UI, ranking, score, recommendation, or legacy redirect change is allowed.

## Exit

After PR #512 merge and production verification, return to `REVIEW GATE`. No third terminal-date batch is authorized automatically.
"""
write("docs/quality/terminal-date-boundary-review-batch-2-spec.md", spec)

amendment = """# Terminal Date Boundary Review — Batch 2

Date: 2026-08-02  
Authority PR: #511  
Implementation PR: #512

## Decision

The post-PR #510 review gate is closed only for one bounded terminal-date evidence review over BAC and DSD.

## Fixed targets and evidence questions

```text
BAC: official shutdown, final mint stop, governance disablement, or contract-level terminal end state
DSD: executed migration, formal shutdown, final mint stop, governance revocation, or contract-level terminal end state
```

## Deferred non-target

GYEN remains inside an officially open initial redemption period through 2026-11-11. It is excluded from this batch and may not be substituted for either fixed target.

## Constraints

- exact two-target set;
- primary-source-only day-level resolution;
- no replacement target;
- null remains null without a final effective boundary;
- no inference from depeg, price low, negligible liquidity, last commit, design publication, migration planning, or market inactivity;
- no automatic Evidence promotion;
- no new asset, Market Access, route, material UI, or legacy redirect work;
- all canonical and public counts remain fixed.

## Authority checkpoint

```text
production commit: 8344504f41df8debd2da90b1b60a61da6fba9a58
canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb
convergence attempt: 2
```

## Exit boundary

PR #512, then `REVIEW GATE`.
"""
write("docs/roadmap-amendments/2026-08-02-terminal-date-boundary-review-batch-2.md", amendment)

validator = f"""import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => {{ if (!condition) failures.push(message); }};

const config = readJson('config/terminal-date-boundary-review-batch-2.json');
const queue = readJson('data/quality/terminal-date-unresolved.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const spec = readText('docs/quality/terminal-date-boundary-review-batch-2-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-08-02-terminal-date-boundary-review-batch-2.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const targetIds = ['sog_st_bac', 'sog_st_dsd'];
const productionCommit = '{PRODUCTION_COMMIT}';
const productionHash = '{PRODUCTION_HASH}';

expect(config.status === 'approved_bounded_review', 'authority status is not approved_bounded_review');
expect(config.authority_pr === 511 && config.implementation_pr === 512, 'PR authority chain changed');
expect(config.target_count === 2, 'target_count changed');
expect(JSON.stringify(config.target_stablecoin_ids) === JSON.stringify(targetIds), 'target set or order changed');
expect(config.explicitly_deferred?.stablecoin_id === 'sog_st_gyen', 'GYEN deferment missing');
expect(config.explicitly_deferred?.not_before === '2026-11-12', 'GYEN not-before boundary changed');
expect(config.authority_checkpoint?.production_commit === productionCommit, 'production commit checkpoint changed');
expect(config.authority_checkpoint?.canonical_hash === productionHash, 'production hash checkpoint changed');
expect(config.authority_checkpoint?.convergence_attempt === 2, 'convergence attempt changed');

expect(queue.expected_total === 6, 'terminal queue total changed');
const records = new Map(queue.records.map((record) => [record.stablecoin_id, record]));
for (const id of targetIds) expect(records.has(id), `queue target missing: ${{id}}`);
expect(records.get('sog_st_bac')?.reason_code === 'shutdown_source_absent', 'BAC queue reason changed');
expect(records.get('sog_st_dsd')?.reason_code === 'development_activity_without_terminal_effect', 'DSD queue reason changed');
expect(records.get('sog_st_gyen')?.reason_code === 'redemption_period_still_open', 'GYEN deferment reason changed');
expect(String(records.get('sog_st_gyen')?.review_note || '').includes('2026-11-11'), 'GYEN redemption deadline missing');

const counts = config.canonical_counts_must_remain;
expect(counts.assets === 117 && counts.organizations === 108 && counts.relationships === 129, 'identity count contract changed');
expect(counts.events === 192 && counts.evidence === 579 && counts.evidence_relations === 579, 'event or Evidence count contract changed');
expect(counts.deployments === 184 && counts.market_access_records === 8, 'deployment or Market Access count contract changed');
expect(counts.detail_routes === 417 && counts.metadata_checked_routes === 417, 'route count contract changed');
expect(counts.archive_recorded === 457 && counts.archive_not_recorded === 122, 'archive partition contract changed');

expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'canonical identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'canonical event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'canonical deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'canonical route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'canonical archive partition changed');

expect(agents.includes('PR #511 Terminal Date Boundary Review — Batch 2 authorization: active'), 'AGENTS authority state missing');
expect(agents.includes('PR #512 Terminal Date Boundary Review — Batch 2: reserved implementation'), 'AGENTS implementation reservation missing');
expect(agents.includes('Current production checkpoint: ' + productionCommit), 'AGENTS production commit missing');
expect(agents.includes('sog_st_bac') && agents.includes('sog_st_dsd'), 'AGENTS target set missing');
expect(roadmap.includes('Status: PR #511 Terminal Date Boundary Review — Batch 2 authorized; PR #512 reserved'), 'roadmap status missing');
expect(roadmap.includes('Deferred non-target: GYEN until after its 2026-11-11 initial redemption deadline'), 'roadmap GYEN deferment missing');
expect(governance.includes('PR #511 Terminal Date Boundary Review — Batch 2 authority active'), 'governance authority state missing');
expect(governance.includes('Only PR #512 is authorized by this decision.'), 'governance implementation boundary missing');
expect(spec.includes('No replacement or third target is allowed.'), 'spec target lock missing');
expect(amendment.includes('GYEN remains inside an officially open initial redemption period through 2026-11-11.'), 'amendment GYEN boundary missing');
expect(active === \"import './validate-terminal-date-boundary-review-pr511.mjs';\", 'active workstream is not wired to PR #511');

for (const temp of [
  '.github/workflows/pr511-terminal-date-authority-finalize.yml',
  'scripts/finalize-terminal-date-boundary-review-batch-2-authority.py'
]) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${{temp}}`);

if (failures.length) {{
  console.error('PR #511 terminal-date authority validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}}

console.log(JSON.stringify({{
  ok: true,
  authority_pr: 511,
  implementation_pr: 512,
  targets: targetIds,
  deferred: 'sog_st_gyen',
  production_commit: productionCommit,
  production_hash: productionHash,
  canonical_counts_preserved: true,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}}, null, 2));
"""
write("scripts/validate-terminal-date-boundary-review-pr511.mjs", validator)
write("scripts/validate-active-workstream.mjs", "import './validate-terminal-date-boundary-review-pr511.mjs';\n")

# Remove finalizer scaffolding before validation/commit.
for temp in [
    ".github/workflows/pr511-terminal-date-authority-finalize.yml",
    "scripts/finalize-terminal-date-boundary-review-batch-2-authority.py",
]:
    p = ROOT / temp
    if p.exists():
        p.unlink()
