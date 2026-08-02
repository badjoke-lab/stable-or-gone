#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVIEWED_AT = "2026-08-02"
TARGETS = ["sog_st_fei", "sog_st_nearusn", "sog_st_esd"]
WORKFLOW = ROOT / ".github/workflows/pr509-terminal-date-review-finalize.yml"
SELF = Path(__file__).resolve()


def read_text(path: str) -> str:
    return (ROOT / path).read_text()


def write_text(path: str, value: str) -> None:
    file = ROOT / path
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(value)


def read_json(path: str):
    return json.loads(read_text(path))


def write_json(path: str, value) -> None:
    write_text(path, json.dumps(value, indent=2, ensure_ascii=False) + "\n")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise RuntimeError(f"missing replacement anchor: {label}")
    if text.count(old) != 1:
        raise RuntimeError(f"non-unique replacement anchor: {label}")
    return text.replace(old, new, 1)


def build_review():
    return {
        "schema_version": "1.0",
        "review_id": "sog_terminal_date_boundary_review_batch_1_pr509_2026_08_02",
        "status": "reviewed_bounded_no_canonical_date_change",
        "public_output": False,
        "authority_pr": 508,
        "implementation_pr": 509,
        "reviewed_at": REVIEWED_AT,
        "source_queue": "data/quality/terminal-date-unresolved.json",
        "target_count": 3,
        "exact_terminal_day_resolved_count": 0,
        "reviewed_null_preserved_count": 3,
        "canonical_evidence_added_count": 0,
        "canonical_evidence_relation_added_count": 0,
        "method": "Primary-source review of governance, redemption, protection-programme, migration, and contract-continuity boundaries. Day-level dates were accepted only if they proved the final effective end of the same canonical stable-asset identity.",
        "dispositions": [
            {
                "stablecoin_id": "sog_st_fei",
                "decision": "reviewed_null_preserved",
                "canonical_terminal_date_before": None,
                "canonical_terminal_date_after": None,
                "best_known_range": "2022-09-22 final-redemption governance approval; redemption route closure and residual distribution completion unresolved",
                "reason_code": "redemption_governance_without_final_route_or_distribution_end",
                "review_note": "TIP-121c established the final-redemption governance boundary and FEI-to-DAI redemption state. The reviewed primary material does not establish an executed final redemption completion day, residual distribution completion day, or final redemption-route shutdown. The vote end and redemption start are therefore not coerced into a terminal date.",
                "reviewed_primary_sources": [
                    "https://tribe.fei.money/t/tip-121-proposal-for-the-future-of-the-tribe-dao/4475/73",
                    "https://www.tally.xyz/governance/eip155:1:0x0BEF27FEB58e857046d630B2c03dFb7bae567494/proposal/64863446409291443125870692229577565231046239594774676712611109555958259692263",
                    "https://fei-protocol.github.io/user/user/"
                ],
                "rejected_shortcuts": [
                    "governance_vote_end_as_final_effective_end",
                    "redemption_start_as_redemption_completion",
                    "dao_terminal_state_as_route_shutdown",
                    "market_inactivity_as_terminal_date"
                ],
                "remaining_unknowns": [
                    "executed final redemption completion",
                    "residual distribution completion",
                    "final FEI redemption route shutdown"
                ],
                "evidence_identity_changes": 0,
                "evidence_relation_changes": 0
            },
            {
                "stablecoin_id": "sog_st_nearusn",
                "decision": "reviewed_null_preserved",
                "canonical_terminal_date_before": None,
                "canonical_terminal_date_after": None,
                "best_known_range": "2022-10-24 controlled wind-down start; Protection Programme stated through 2023-10-24; final token and residual settlement end unresolved",
                "reason_code": "programme_deadline_without_final_token_or_residual_settlement_end",
                "review_note": "Decentral Bank permanently stopped minting and began the controlled wind-down on 2022-10-24. NEAR Foundation described a one-year Protection Programme ending 2023-10-24, while the wind-down material also directed holders to separate redemption routes and did not establish final payout completion, residual-obligation settlement, contract disablement, or the final token end state. The programme deadline is not coerced into the canonical terminal date.",
                "reviewed_primary_sources": [
                    "https://www.near.org/blog/near-launches-usn-protection-programme-aurora",
                    "https://www.near.org/blog/statement-in-full-near-foundation-to-fund-usn-protection-programme",
                    "https://medium.com/@dcntrlbank/usn-wind-down-message-to-all-usn-holders-and-community-98b82dcdcc2c"
                ],
                "rejected_shortcuts": [
                    "wind_down_start_as_final_end",
                    "permanent_mint_stop_as_final_settlement",
                    "protection_programme_deadline_as_final_token_end",
                    "protection_programme_launch_as_completion",
                    "market_liquidity_decline_as_terminal_date"
                ],
                "remaining_unknowns": [
                    "Protection Programme final payout completion",
                    "residual obligation settlement",
                    "final supply and contract end state",
                    "final closure of all redemption routes"
                ],
                "evidence_identity_changes": 0,
                "evidence_relation_changes": 0
            },
            {
                "stablecoin_id": "sog_st_esd",
                "decision": "reviewed_null_preserved",
                "canonical_terminal_date_before": None,
                "canonical_terminal_date_after": None,
                "best_known_range": "2021-08-02 Empty Set V2 live and ESD/ESDS migration opened; V1 disablement and migration close unresolved",
                "reason_code": "migration_opening_without_v1_disablement_or_final_deadline",
                "review_note": "The official Empty Set publication establishes that V2 went live and the Treasury multisig initiated ESD and Bonded ESD migration on 2021-08-02. The reviewed primary material does not provide a V1 end block, contract disablement, final migration deadline, or final claim termination. Migration availability is therefore not treated as the final effective end of ESD.",
                "reviewed_primary_sources": [
                    "https://medium.com/emptysetdollar/empty-set-v2-live-migrate-now-2a6fceb55d08",
                    "https://medium.com/emptysetdollar/introducing-empty-sets-new-tokens-dsu-ess-9d43944123fe",
                    "https://github.com/emptysetsquad/emptyset"
                ],
                "rejected_shortcuts": [
                    "v2_launch_as_v1_final_end",
                    "migration_opening_as_migration_deadline",
                    "successor_token_launch_as_contract_disablement",
                    "last_repository_commit_as_terminal_date",
                    "market_inactivity_as_terminal_date"
                ],
                "remaining_unknowns": [
                    "V1 end block",
                    "V1 contract disablement",
                    "final migration deadline",
                    "final claim termination"
                ],
                "evidence_identity_changes": 0,
                "evidence_relation_changes": 0
            }
        ],
        "decision": {
            "all_targets_disposed": True,
            "exact_terminal_day_evidence_found": False,
            "unsupported_date_coercion": False,
            "canonical_counts_preserved": True,
            "terminal_queue_total_preserved": 6,
            "next_boundary": "REVIEW_GATE"
        },
        "constraints": {
            "asset_changes": 0,
            "organization_changes": 0,
            "relationship_changes": 0,
            "event_changes": 0,
            "evidence_identity_changes": 0,
            "evidence_relation_changes": 0,
            "deployment_changes": 0,
            "market_access_changes": 0,
            "route_family_changes": 0,
            "material_ui_changes": 0,
            "legacy_redirect_changes": 0,
            "automatic_continuation": False
        }
    }


def update_queue(review) -> None:
    queue = read_json("data/quality/terminal-date-unresolved.json")
    by_id = {row["stablecoin_id"]: row for row in queue["records"]}
    dispositions = {row["stablecoin_id"]: row for row in review["dispositions"]}
    if set(TARGETS) - set(by_id):
        raise RuntimeError("target missing from terminal-date queue")
    for stablecoin_id in TARGETS:
        row = by_id[stablecoin_id]
        decision = dispositions[stablecoin_id]
        row["strongest_known_boundary"] = decision["best_known_range"].split(";", 1)[0]
        row["boundary_type"] = "reviewed_non_terminal_boundary"
        row["reason_code"] = decision["reason_code"]
        row["review_note"] = decision["review_note"]
        row["rejected_shortcuts"] = decision["rejected_shortcuts"]
        row["future_review_target"] = "_or_".join(value.lower().replace(" ", "_") for value in decision["remaining_unknowns"])
        row["last_reviewed"] = REVIEWED_AT
        row["reviewed_primary_sources"] = decision["reviewed_primary_sources"]
        row["review_outcome"] = "reviewed_null_preserved"
        row["canonical_terminal_date_before"] = None
        row["canonical_terminal_date_after"] = None
    write_json("data/quality/terminal-date-unresolved.json", queue)


def update_agents() -> None:
    path = "AGENTS.md"
    text = read_text(path)
    text = replace_once(
        text,
        "16. PR #508 authorizes one bounded terminal-date boundary review for FEI, NEAR USN, and ESD; implementation is reserved for PR #509.\n17. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.",
        "16. PR #508 authorized one bounded terminal-date boundary review for FEI, NEAR USN, and ESD.\n17. PR #509 reviewed all three terminal-date boundaries, preserved all three canonical dates as null, and is under review.\n18. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.",
        "AGENTS authority chain"
    )
    text = replace_once(
        text,
        "PR #508 Terminal Date Boundary Review — Batch 1 authorization: active\nPR #509 Terminal Date Boundary Review — Batch 1: reserved implementation",
        "PR #508 Terminal Date Boundary Review — Batch 1 authorization: complete\nPR #509 Terminal Date Boundary Review — Batch 1: implementation under review",
        "AGENTS current item status"
    )
    marker = "## PR #506 reviewed archive-payload result"
    reviewed = """## PR #509 reviewed terminal-date result

PR #509 reviewed the fixed FEI, NEAR USN, and ESD terminal-date boundaries using primary sources. No source established the final effective end of the same canonical identity.

```text
exact terminal days resolved: 0
canonical null dates preserved: 3
new Evidence identities: 0
new Evidence Relations: 0
canonical or public count changes: 0
legacy redirect changes: 0
```

FEI final-redemption governance did not establish redemption-route shutdown or residual-distribution completion. The USN Protection Programme deadline did not establish the end of all redemption paths, residual settlement, or the token contract. Empty Set V2 migration availability did not establish a V1 end block, disablement, or final migration deadline.

After PR #509 merge and production verification, stop at REVIEW GATE. No later terminal-date batch is authorized automatically.

"""
    if marker not in text:
        raise RuntimeError("AGENTS result insertion anchor missing")
    text = text.replace(marker, reviewed + marker, 1)
    write_text(path, text)


def update_roadmap() -> None:
    path = "docs/roadmap.md"
    text = read_text(path)
    text = replace_once(
        text,
        "Status: PR #508 Terminal Date Boundary Review — Batch 1 authorized; PR #509 reserved",
        "Status: PR #509 Terminal Date Boundary Review — Batch 1 under review; exit boundary REVIEW GATE",
        "roadmap status"
    )
    text = replace_once(
        text,
        "PR #508 Terminal Date Boundary Review — Batch 1 authorization: active\nPR #509 Terminal Date Boundary Review — Batch 1: reserved implementation",
        "PR #508 Terminal Date Boundary Review — Batch 1 authorization: complete\nPR #509 Terminal Date Boundary Review — Batch 1: implementation under review",
        "roadmap current item status"
    )
    old = """## Authorized current item

```text
Terminal Date Boundary Review — Batch 1
Authority PR: #508
Implementation PR: #509
Targets: FEI, NEAR USN, ESD
```

PR #509 may resolve an exact terminal day only from day-level primary evidence of final effective cessation. If final redemption, settlement, residual distribution, migration, claim, or contract termination remains unresolved, null must be preserved. No replacement target is allowed.
"""
    new = """## PR #509 reviewed item

```text
Terminal Date Boundary Review — Batch 1
Authority PR: #508
Implementation PR: #509
Targets reviewed: FEI, NEAR USN, ESD
Exact terminal days resolved: 0
Reviewed null preserved: 3
```

FEI final-redemption governance did not establish redemption-route shutdown or residual-distribution completion. The USN Protection Programme deadline did not establish the end of all redemption paths, residual settlement, or the token contract. Empty Set V2 migration availability did not establish a V1 end block, disablement, or final migration deadline.

No canonical stable-asset, organization, relationship, event, Evidence, deployment, Market Access, route, UI, or legacy redirect changed. After merge and production verification, return to REVIEW GATE.
"""
    text = replace_once(text, old, new, "roadmap reviewed item")
    text = replace_once(
        text,
        "PR #509 implementation, then REVIEW GATE",
        "PR #509 implementation under review, then REVIEW GATE",
        "roadmap current boundary"
    )
    write_text(path, text)


def update_governance() -> None:
    path = "docs/spec-governance.md"
    text = read_text(path)
    old = """Current item:

```text
PR #508 Terminal Date Boundary Review — Batch 1 authorization; PR #509 implementation reserved
```

Reviewed decision:

```text
PR #508 Terminal Date Boundary Review — Batch 1 authorization
implementation PR: #509
exact targets: sog_st_fei, sog_st_nearusn, sog_st_esd
source queue total: 6
allowed outcomes: exact_terminal_day_resolved or reviewed_null_preserved
replacement targets: prohibited
unsupported terminal-date inference: prohibited
canonical and public counts: preserved
next boundary after PR #509: REVIEW GATE
```
"""
    new = """Current item:

```text
PR #509 Terminal Date Boundary Review — Batch 1 implementation under review
```

Reviewed decision:

```text
PR #509 Terminal Date Boundary Review — Batch 1
exact targets: sog_st_fei, sog_st_nearusn, sog_st_esd
exact terminal days resolved: 0
reviewed null preserved: 3
new Evidence identities or Relations: 0
canonical and public count changes: 0
legacy redirect changes: 0
next boundary after PR #509: REVIEW GATE
```
"""
    text = replace_once(text, old, new, "governance current decision")
    text = replace_once(
        text,
        "PR #509 must record a reviewed outcome for every target and may not substitute another record. It may resolve an exact terminal day or preserve null. It may not add an asset, alter Market Access, add a route family, change material UI, or automatically promote candidate source material to canonical Evidence. It exits to REVIEW GATE. No work beyond PR #509 is pre-authorized.",
        "PR #509 records a reviewed-null-preserved outcome for all three fixed targets. The reviewed primary sources establish governance, wind-down, programme, and migration boundaries but not final effective termination of the same canonical identity. PR #509 adds no asset or Evidence identity, alters no Market Access record, route family, material UI, or legacy redirect, and exits to REVIEW GATE. No work beyond PR #509 is pre-authorized.",
        "governance PR509 section"
    )
    text = replace_once(
        text,
        "PR #508 is the current reviewed decision. Execute only PR #509 and then stop to review:",
        "PR #509 is the current implementation under review. Before merge and production acceptance, review:",
        "governance review gate"
    )
    write_text(path, text)


def update_spec() -> None:
    path = "docs/quality/terminal-date-boundary-review-batch-1-spec.md"
    text = read_text(path)
    text = replace_once(
        text,
        "Status: authorized bounded private review",
        "Status: implementation reviewed; pending merge and production verification",
        "work-item spec status"
    )
    marker = "## Preserved boundaries"
    reviewed = """## Reviewed PR #509 result

```text
Targets reviewed: 3
Exact terminal days resolved: 0
Reviewed null preserved: 3
New Evidence identities: 0
Evidence Relation changes: 0
Canonical and public count changes: 0
Legacy redirect changes: 0
```

FEI retains a null terminal date because final-redemption governance and continuing redemption mechanics do not establish final route shutdown or residual-distribution completion. NEAR USN retains null because the Protection Programme deadline does not establish the end of all redemption paths, residual settlement, or the token contract. ESD retains null because V2 migration availability does not establish a V1 end block, disablement, or final migration deadline.

"""
    if marker not in text:
        raise RuntimeError("work-item spec insertion anchor missing")
    text = text.replace(marker, reviewed + marker, 1)
    write_text(path, text)


def write_validator() -> None:
    validator = r'''import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const targets = ['sog_st_fei', 'sog_st_nearusn', 'sog_st_esd'];

const authority = readJson('config/terminal-date-boundary-review-batch-1.json');
const review = readJson('data/editorial-research/terminal-date-boundary-review-batch-1-pr509-source-review.json');
const queue = readJson('data/quality/terminal-date-unresolved.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const spec = readText('docs/quality/terminal-date-boundary-review-batch-1-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

expect(authority.authority_pr === 508 && authority.implementation_pr === 509, 'authority PR sequence changed');
expect(JSON.stringify(authority.target_stablecoin_ids) === JSON.stringify(targets), 'authority target set changed');
expect(review.status === 'reviewed_bounded_no_canonical_date_change', 'review status changed');
expect(review.target_count === 3, 'review target count changed');
expect(review.exact_terminal_day_resolved_count === 0, 'unsupported exact terminal day introduced');
expect(review.reviewed_null_preserved_count === 3, 'null-preserved count changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'Evidence identity or Relation changed');
expect(JSON.stringify(review.dispositions.map((row) => row.stablecoin_id)) === JSON.stringify(targets), 'review target order or identity changed');
for (const row of review.dispositions) {
  expect(row.decision === 'reviewed_null_preserved', `${row.stablecoin_id}: decision changed`);
  expect(row.canonical_terminal_date_before === null && row.canonical_terminal_date_after === null, `${row.stablecoin_id}: terminal date was coerced`);
  expect(Array.isArray(row.reviewed_primary_sources) && row.reviewed_primary_sources.length >= 3, `${row.stablecoin_id}: primary-source review incomplete`);
  expect(Array.isArray(row.rejected_shortcuts) && row.rejected_shortcuts.length >= 4, `${row.stablecoin_id}: rejected-shortcut record incomplete`);
  expect(row.evidence_identity_changes === 0 && row.evidence_relation_changes === 0, `${row.stablecoin_id}: Evidence boundary changed`);
}
expect(queue.expected_total === 6 && queue.records.length === 6, 'terminal queue total changed');
const byId = new Map(queue.records.map((row) => [row.stablecoin_id, row]));
for (const id of targets) {
  const row = byId.get(id);
  expect(Boolean(row), `${id}: missing from terminal queue`);
  if (!row) continue;
  expect(row.last_reviewed === '2026-08-02', `${id}: review date missing`);
  expect(row.review_outcome === 'reviewed_null_preserved', `${id}: queue outcome changed`);
  expect(row.canonical_terminal_date_before === null && row.canonical_terminal_date_after === null, `${id}: queue date was coerced`);
  expect(Array.isArray(row.reviewed_primary_sources) && row.reviewed_primary_sources.length >= 3, `${id}: queue source list incomplete`);
}
expect(byId.get('sog_st_gyen')?.reason_code === 'redemption_period_still_open', 'non-target GYEN boundary changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(agents.includes('PR #509 Terminal Date Boundary Review — Batch 1: implementation under review'), 'AGENTS implementation status missing');
expect(agents.includes('exact terminal days resolved: 0'), 'AGENTS reviewed result missing');
expect(roadmap.includes('Status: PR #509 Terminal Date Boundary Review — Batch 1 under review; exit boundary REVIEW GATE'), 'roadmap status missing');
expect(governance.includes('PR #509 Terminal Date Boundary Review — Batch 1 implementation under review'), 'governance current item missing');
expect(spec.includes('Status: implementation reviewed; pending merge and production verification'), 'work-item spec status missing');
expect(active === "import './validate-terminal-date-boundary-review-pr509.mjs';", 'active workstream is not wired to PR #509');
for (const temp of [
  '.github/workflows/pr509-terminal-date-review-finalize.yml',
  'scripts/extract-pr509-terminal-review-source.py'
]) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${temp}`);

if (failures.length) {
  console.error('PR #509 Terminal Date Boundary Review failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  authority_pr: 508,
  implementation_pr: 509,
  targets,
  exact_terminal_day_resolved: 0,
  reviewed_null_preserved: 3,
  evidence_identity_changes: 0,
  canonical_counts_preserved: true,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
'''
    write_text("scripts/validate-terminal-date-boundary-review-pr509.mjs", validator)
    write_text("scripts/validate-active-workstream.mjs", "import './validate-terminal-date-boundary-review-pr509.mjs';\n")


def main() -> None:
    review = build_review()
    write_json("data/editorial-research/terminal-date-boundary-review-batch-1-pr509-source-review.json", review)
    update_queue(review)
    update_agents()
    update_roadmap()
    update_governance()
    update_spec()
    write_validator()

    if WORKFLOW.exists():
        WORKFLOW.unlink()
    if SELF.exists():
        SELF.unlink()

    print(json.dumps({
        "ok": True,
        "targets": TARGETS,
        "exact_terminal_day_resolved": 0,
        "reviewed_null_preserved": 3,
        "canonical_changes": 0,
        "legacy_redirect_changes": 0,
        "next_boundary": "REVIEW_GATE"
    }, indent=2))


if __name__ == "__main__":
    main()
