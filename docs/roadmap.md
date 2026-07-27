# Stable or Gone Roadmap

Updated: 2026-07-27  
Status: Full public UI contract remediation active; Record Growth Batch 3 paused

## Current position

```text
Canonical stable assets: 114
Organizations: 107
Relationships: 126
Events: 189
Evidence: 565
Evidence Relations: 565
Deployments: 180
Market Access Records: 8
Archive recorded: 436
Archive not recorded: 129

Issue #281 UI v3 rebuild: complete and closed
Issue #457 CYA-dark redesign audit: complete and closed
UI completion: true
Final UI merge: PR #463
Final main commit: 88db81ed27b63ff8798883ef618045f2bbe1a9b3
Final exhaustive screenshot run: 30147237015
```

The canonical data baseline established through PR #433 remains unchanged by the UI closure work. UI remediation did not authorize canonical record, route-semantic, or machine-readable contract changes.

## UI V3 closure

The earlier representative-only completion decision was withdrawn because it did not establish acceptable readability, density, hierarchy, mobile behavior, or full-route coverage. The replacement closure sequence completed the following:

```text
PR #461  exhaustive V3 color-system repair
PR #463  exhaustive readability and hierarchy repair
PR #464  roadmap and archived authority closure
PR #465  top-level agent authority synchronization
```

Final verification on the PR #463 head covered:

- 457 desktop routes;
- 457 mobile routes;
- 914 regenerated full-page screenshots;
- zero failed captures;
- zero blocking exhaustive-UI findings;
- zero blocking color-system findings;
- zero blocking readability findings;
- explicit detection of overlapping section-heading content;
- repair and direct reinspection of the mobile event-dossier overlap found during artifact review;
- all repository workflows green before merge.

The final UI merge commit is `88db81ed27b63ff8798883ef618045f2bbe1a9b3`. Issue #281 and the superseded UI audit threads are closed. The former UI remediation authority is retained as an archived regression contract in `docs/ui-v3-remediation-authority.md`.

## Canonical data baseline

```text
PR #426  Post-UI v3 Data-Growth Reset: complete
PR #427  Record Growth Candidate Audit v2: complete
PR #428  Post-PR #427 Review Gate: complete
PR #429  Record Growth Batch 2 — CHFAU and SEKAU: complete
PR #432  Generated-output repair workflow: complete
PR #433  Generated and persisted PR #429 outputs: complete
```

PR #433 established the current generated and built baseline of 114 stable assets, 107 organizations, 126 relationships, 189 events, 565 Evidence records, and 180 deployments.

PR #427 retained PLNQ and GBPQ as review-ready candidates. PR #428 deferred them by sequencing rather than rejecting them. PR #429 promoted the other reviewed pair, CHFAU and SEKAU. No canonical assets were added during the subsequent UI closure sequence.

## Active operating mode

The governing operating specification is `docs/post-351-data-growth-operating-spec.md`.

Normal work proceeds through these lanes:

```text
reviewed data depth and record growth
canonical Market Access promotion
read-only monitoring review
corrections and Evidence maintenance
monthly maintenance
small correctness, accessibility, readability, and broken-link fixes
```

New public pages, dashboards, rankings, explorer families, or major navigation changes remain frozen unless a separate reviewed roadmap amendment and canonical specification authorize them.

## Active full public UI contract

Owner review found that the accepted UI V3 implementation still depended on 78 stylesheets, 649,819 source bytes, and 4,905 `!important` declarations after PR #472. The full-route audit established regression coverage but did not establish one maintainable or consistently applied page-family contract.

The owner-directed amendment `docs/roadmap-amendments/2026-07-27-pr470-full-public-ui-contract.md` therefore authorizes:

```text
PR #470 Full Public UI Contract — active
PRODUCTION VISUAL VERIFICATION
PR #467 Record Growth Batch 3 — resumes only after verification
```

PR #470 changes no canonical data, counts, routes, metadata, sitemap, or machine-readable semantics. It replaces the accumulated public cascade with one physical stylesheet and one import, applies the shared design contract to every existing page family, and preserves the exhaustive UI regression gates.

## Active bounded sequence

```text
PR #466 Post-UI data-growth review gate: complete
PR #470 Full Public UI Contract: active
PR #467 Record Growth Batch 3 — PLNQ and GBPQ: authorized but paused until PR #470 production verification
REVIEW GATE after PR #467
```

PR #466 is governance-only. It authorizes at most two exact candidates in one coherent Quantoz regulated non-EUR context:

```text
Quantoz PLNQ — sog_cand_pr427_plnq
Quantoz GBPQ — sog_cand_pr427_gbpq
```

Before canonical edits, PR #467 must perform a fresh duplicate, current official-source, exact deployment-identity, reserve, and redemption review. It must reuse the existing Quantoz organization and create no duplicate organization.

Thin records are prohibited. Each promoted candidate must support all applicable complete canonical layers. A candidate that cannot satisfy the entry gate must be withheld; it may not be replaced by a third candidate.

PR #467 may not change Market Access, monitoring publication, UI, route families, dashboards, scores, rankings, recommendation semantics, or unrelated machine-readable contracts. No later batch is pre-authorized.

## Production publication boundary

`main` remains the source of truth. Production publication follows `docs/deployment-policy.md` through `.github/workflows/deploy-production.yml` and must verify the deployed commit against the intended main commit.

A repository merge is not itself evidence that production parity has completed. Production parity remains a separately verified deployment result, and Issue #66 remains the long-lived checkpoint record for production consistency.

## Mandatory operating rule

Every non-trivial PR must identify its governing specification, exact bounded scope, preserved public and canonical boundaries, validation evidence, and next review gate. Old handoffs, stale UI phases, and superseded PR numbers must not be treated as current authority.
