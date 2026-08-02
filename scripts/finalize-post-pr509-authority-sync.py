#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTION_COMMIT = "96ae5edd42e9a9e8a652bb27acc2d6a6eb02dfd6"
PRODUCTION_HASH = "sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb"
WORKFLOW = ROOT / ".github/workflows/pr510-authority-sync-finalize.yml"
SELF = Path(__file__).resolve()


def read(path: str) -> str:
    return (ROOT / path).read_text()


def write(path: str, value: str) -> None:
    file = ROOT / path
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(value)


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if text.count(old) != 1:
        raise RuntimeError(f"replacement anchor {label!r} found {text.count(old)} times")
    return text.replace(old, new, 1)


def update_agents() -> None:
    path = "AGENTS.md"
    text = read(path)
    text = replace_once(
        text,
        "Current production checkpoint: a4f9c924b2966b1281429a13991ba6219df721d8",
        f"Current production checkpoint: {PRODUCTION_COMMIT}",
        "AGENTS production checkpoint",
    )
    text = replace_once(
        text,
        "17. PR #509 reviewed all three terminal-date boundaries, preserved all three canonical dates as null, and is under review.\n18. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.",
        "17. PR #509 reviewed all three terminal-date boundaries, preserved all three canonical dates as null, and was production-verified.\n18. PR #510 synchronizes the completed PR #509 checkpoint and returns repository authority to REVIEW GATE.\n19. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.",
        "AGENTS authority chain",
    )
    text = replace_once(
        text,
        "PR #508 Terminal Date Boundary Review — Batch 1 authorization: complete\nPR #509 Terminal Date Boundary Review — Batch 1: implementation under review\nRequired exit after PR #509 merge and production verification: REVIEW GATE",
        "PR #508 Terminal Date Boundary Review — Batch 1 authorization: complete\nPR #509 Terminal Date Boundary Review — Batch 1: complete and production-verified\nRequired exit after PR #509 merge and production verification: REVIEW GATE — satisfied\nPR #510 post-PR #509 authority synchronization: active\nCurrent repository authority: REVIEW GATE",
        "AGENTS current workstream",
    )
    text = replace_once(
        text,
        "After PR #509 merge and production verification, stop at REVIEW GATE. No later terminal-date batch is authorized automatically.",
        f"Production verification:\n\n```text\nsource commit: {PRODUCTION_COMMIT}\ncanonical hash: {PRODUCTION_HASH}\nconvergence attempt: 1\nstable assets: 117\norganizations: 108\nevents: 192\ndetail routes: 417\nmetadata-checked detail routes: 417\narchive recorded: 457\narchive not recorded: 122\n```\n\nRepository authority is now REVIEW GATE. No later terminal-date batch is authorized automatically.",
        "AGENTS PR509 production result",
    )
    write(path, text)


def update_roadmap() -> None:
    path = "docs/roadmap.md"
    text = read(path)
    text = replace_once(
        text,
        "Updated: 2026-08-01  \nStatus: PR #509 Terminal Date Boundary Review — Batch 1 under review; exit boundary REVIEW GATE",
        "Updated: 2026-08-02  \nStatus: PR #509 complete and production-verified; REVIEW GATE",
        "roadmap status",
    )
    text = replace_once(
        text,
        "Current production checkpoint: a4f9c924b2966b1281429a13991ba6219df721d8",
        f"Current production checkpoint: {PRODUCTION_COMMIT}",
        "roadmap production checkpoint",
    )
    text = replace_once(
        text,
        "Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #506 production converged with exact count, route, metadata, provenance, archive-partition, and canonical-hash parity.",
        "Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #509 production converged with exact count, route, metadata, provenance, archive-partition, and canonical-hash parity.",
        "roadmap equality statement",
    )
    text = replace_once(
        text,
        "PR #508 Terminal Date Boundary Review — Batch 1 authorization: complete\nPR #509 Terminal Date Boundary Review — Batch 1: implementation under review",
        "PR #508 Terminal Date Boundary Review — Batch 1 authorization: complete\nPR #509 Terminal Date Boundary Review — Batch 1: complete and production-verified\nPR #510 post-PR #509 authority synchronization: active",
        "roadmap acceptance points",
    )
    text = replace_once(
        text,
        "No canonical stable-asset, organization, relationship, event, Evidence, deployment, Market Access, route, UI, or legacy redirect changed. After merge and production verification, return to REVIEW GATE.",
        f"No canonical stable-asset, organization, relationship, event, Evidence, deployment, Market Access, route, UI, or legacy redirect changed.\n\nProduction result:\n\n```text\nsource commit: {PRODUCTION_COMMIT}\ncanonical hash: {PRODUCTION_HASH}\nconvergence attempt: 1\nstable assets: 117\norganizations: 108\nevents: 192\ndetail routes: 417\nmetadata-checked detail routes: 417\narchive recorded: 457\narchive not recorded: 122\n```\n\nThe repository is at REVIEW GATE.",
        "roadmap PR509 production result",
    )
    text = replace_once(
        text,
        "## Completed current item\n\n```text\nEvidence Archive Payload Verification — Batch 1\nAuthority PR: #505\nImplementation PR: #506\nAuthority synchronization PR: #507\nResult: complete and production-verified\n```",
        "## Completed current item\n\n```text\nTerminal Date Boundary Review — Batch 1\nAuthority PR: #508\nImplementation PR: #509\nAuthority synchronization PR: #510\nResult: complete and production-verified\n```",
        "roadmap completed current item",
    )
    text = replace_once(
        text,
        "PR #509 implementation under review, then REVIEW GATE",
        "REVIEW GATE",
        "roadmap current boundary",
    )
    write(path, text)


def update_governance() -> None:
    path = "docs/spec-governance.md"
    text = read(path)
    text = replace_once(text, "Updated: 2026-07-31", "Updated: 2026-08-02", "governance updated date")
    text = replace_once(
        text,
        "Current item:\n\n```text\nPR #509 Terminal Date Boundary Review — Batch 1 implementation under review\n```\n\nReviewed decision:\n\n```text\nPR #509 Terminal Date Boundary Review — Batch 1\nexact targets: sog_st_fei, sog_st_nearusn, sog_st_esd\nexact terminal days resolved: 0\nreviewed null preserved: 3\nnew Evidence identities or Relations: 0\ncanonical and public count changes: 0\nlegacy redirect changes: 0\nnext boundary after PR #509: REVIEW GATE\n```",
        f"Current item:\n\n```text\nREVIEW GATE — PR #509 complete and production-verified\n```\n\nReviewed decision:\n\n```text\nPR #509 Terminal Date Boundary Review — Batch 1 complete and production-verified\nproduction commit: {PRODUCTION_COMMIT}\nproduction canonical hash: {PRODUCTION_HASH}\nconvergence attempt: 1\nexact targets: sog_st_fei, sog_st_nearusn, sog_st_esd\nexact terminal days resolved: 0\nreviewed null preserved: 3\nnew Evidence identities or Relations: 0\ncanonical and public count changes: 0\nlegacy redirect changes: 0\ncurrent boundary: REVIEW GATE\n```",
        "governance current decision",
    )
    text = replace_once(
        text,
        "PR #509 records a reviewed-null-preserved outcome for all three fixed targets. The reviewed primary sources establish governance, wind-down, programme, and migration boundaries but not final effective termination of the same canonical identity. PR #509 adds no asset or Evidence identity, alters no Market Access record, route family, material UI, or legacy redirect, and exits to REVIEW GATE. No work beyond PR #509 is pre-authorized.",
        f"PR #509 recorded a reviewed-null-preserved outcome for all three fixed targets. The reviewed primary sources establish governance, wind-down, programme, and migration boundaries but not final effective termination of the same canonical identity. PR #509 added no asset or Evidence identity, altered no Market Access record, route family, material UI, or legacy redirect. Production commit `{PRODUCTION_COMMIT}` verified canonical hash `{PRODUCTION_HASH}`, the 117/108/129/192/579/579/184/8 canonical counts, 417 detail routes, 417 metadata-checked routes, and archive partition 457/122. The repository is at REVIEW GATE. No work beyond this checkpoint is pre-authorized.",
        "governance PR509 section",
    )
    text = replace_once(
        text,
        "PR #509 is the current implementation under review. Before merge and production acceptance, review:\n\n```text\nall three terminal-date dispositions\nexact-day primary evidence quality\nfinal-effective-end semantics\nnull-date preservation\nEvidence additions, if any\ncanonical counts and route parity\nproduction parity\n```\n\nOnly a later separate reviewed decision may authorize another work item.",
        "PR #509 is complete and production-verified. The repository is at:\n\n```text\nREVIEW GATE\n```\n\nNo later terminal-date batch, archive batch, launch-date batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material UI work is authorized automatically. Only a later separate reviewed decision may authorize another work item.",
        "governance review gate",
    )
    write(path, text)


def write_validator() -> None:
    value = f'''import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => {{ if (!condition) failures.push(message); }};

const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const review = readJson('data/editorial-research/terminal-date-boundary-review-batch-1-pr509-source-review.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const productionCommit = '{PRODUCTION_COMMIT}';
const productionHash = '{PRODUCTION_HASH}';

expect(review.status === 'reviewed_bounded_no_canonical_date_change', 'PR #509 review status changed');
expect(review.target_count === 3 && review.exact_terminal_day_resolved_count === 0 && review.reviewed_null_preserved_count === 3, 'PR #509 reviewed outcomes changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'PR #509 Evidence boundary changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(agents.includes('Current production checkpoint: ' + productionCommit), 'AGENTS production commit missing');
expect(agents.includes('Current production canonical hash: ' + productionHash), 'AGENTS production hash missing');
expect(agents.includes('PR #509 Terminal Date Boundary Review — Batch 1: complete and production-verified'), 'AGENTS completion missing');
expect(agents.includes('Current repository authority: REVIEW GATE'), 'AGENTS review gate missing');
expect(roadmap.includes('Status: PR #509 complete and production-verified; REVIEW GATE'), 'roadmap status missing');
expect(roadmap.includes('Current production checkpoint: ' + productionCommit), 'roadmap production commit missing');
expect(roadmap.includes('Current production canonical hash: ' + productionHash), 'roadmap production hash missing');
expect(governance.includes('REVIEW GATE — PR #509 complete and production-verified'), 'governance current item missing');
expect(governance.includes('production commit: ' + productionCommit), 'governance production commit missing');
expect(governance.includes('production canonical hash: ' + productionHash), 'governance production hash missing');
expect(governance.includes('No work beyond this checkpoint is pre-authorized.'), 'governance stop boundary missing');
expect(active === "import './validate-post-pr509-authority-sync-pr510.mjs';", 'active workstream is not wired to PR #510');
for (const temp of [
  '.github/workflows/pr510-authority-sync-finalize.yml',
  'scripts/finalize-post-pr509-authority-sync.py'
]) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${{temp}}`);

if (failures.length) {{
  console.error('PR #510 post-PR #509 authority synchronization failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}}
console.log(JSON.stringify({{
  ok: true,
  production_commit: productionCommit,
  production_hash: productionHash,
  exact_terminal_day_resolved: 0,
  reviewed_null_preserved: 3,
  canonical_counts_preserved: true,
  legacy_redirect_changes: 0,
  current_boundary: 'REVIEW_GATE'
}}, null, 2));
'''
    write("scripts/validate-post-pr509-authority-sync-pr510.mjs", value)
    write("scripts/validate-active-workstream.mjs", "import './validate-post-pr509-authority-sync-pr510.mjs';\n")


def main() -> None:
    update_agents()
    update_roadmap()
    update_governance()
    write_validator()
    if WORKFLOW.exists():
        WORKFLOW.unlink()
    if SELF.exists():
        SELF.unlink()
    print("PR #510 authority synchronization generated")


if __name__ == "__main__":
    main()
