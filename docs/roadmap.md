# Stable or Gone Roadmap

Updated: 2026-07-25  
Status: UI V3 remediation complete; reviewed data-growth operating mode resumed

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

The final merge commit is `88db81ed27b63ff8798883ef618045f2bbe1a9b3`. Issue #281 and the superseded UI audit threads are closed. The former UI remediation authority is retained as an archived regression contract in `docs/ui-v3-remediation-authority.md`.

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

## Active operating mode

The governing operating specification is `docs/post-351-data-growth-operating-spec.md`.

Normal work now proceeds through these lanes:

```text
reviewed data depth and record growth
canonical Market Access promotion
read-only monitoring review
corrections and Evidence maintenance
monthly maintenance
small correctness, accessibility, readability, and broken-link fixes
```

New public pages, dashboards, rankings, explorer families, or major navigation changes remain frozen unless a separate reviewed roadmap amendment and canonical specification authorize them.

## Next bounded work item

The next substantive work item is a **post-UI data-growth review gate**. It must recompute the current 114-asset planning state from merged canonical data and choose exactly one bounded follow-on batch from reviewed evidence.

The review gate may authorize one of the existing operating lanes, but it must not pre-authorize an indefinite PR sequence. It must record:

- current dossier-depth and evidence-maintenance gaps;
- remaining reviewed candidate queue state;
- Market Access utility and evidence readiness;
- monitoring leads that are eligible only for manual review;
- correction and archive-maintenance load;
- the exact scope, record bound, evidence requirement, and stop condition for the next PR.

No score, safety ranking, investment recommendation, or automatic canonical promotion is permitted.

## Production publication boundary

`main` remains the source of truth. Production publication follows `docs/deployment-policy.md` through `.github/workflows/deploy-production.yml` and must verify the deployed commit against the intended main commit.

A repository merge is not itself evidence that production parity has completed. Production parity remains a separately verified deployment result, and Issue #66 remains the long-lived checkpoint record for production consistency.

## Mandatory operating rule

Every non-trivial PR must identify its governing specification, exact bounded scope, preserved public and canonical boundaries, validation evidence, and next review gate. Old handoffs, stale UI phases, and superseded PR numbers must not be treated as current authority.
