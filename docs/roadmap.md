# Stable or Gone Roadmap

Updated: 2026-07-27  
Status: Full public UI contract complete and production-verified; Record Growth Batch 3 REVIEW GATE

## Current position

```text
Canonical stable assets: 116
Organizations: 107
Relationships: 128
Events: 191
Evidence: 571
Evidence Relations: 571
Deployments: 182
Market Access Records: 8
Archive recorded: 442
Archive not recorded: 129

Issue #281 UI v3 rebuild: complete and closed
Issue #457 CYA-dark redesign audit: complete and closed
UI completion: true
Current public UI merge: PR #470
Current public UI main commit: 3e3edf4dd4d6af8e6ab5f9336271f0cca5cd6723
Current exhaustive screenshot run: 30272641707
```

PR #470 changed no canonical record, route-semantic, or machine-readable contract. PR #467 extends the reviewed canonical checkpoint after the public UI production verification completed.

## UI V3 regression closure

The earlier representative-only completion decision was withdrawn because it did not establish acceptable readability, density, hierarchy, mobile behavior, or full-route coverage. The replacement closure sequence completed:

```text
PR #461  exhaustive V3 color-system repair
PR #463  exhaustive readability and hierarchy repair
PR #464  roadmap and archived authority closure
PR #465  top-level agent authority synchronization
```

The archived regression authority remains in `docs/ui-v3-remediation-authority.md`.

## Full public UI contract closure

Owner review later found that the accepted UI V3 implementation still depended on 78 stylesheets, 649,819 source bytes, and 4,905 `!important` declarations after PR #472. The route audit protected rendering but did not establish one maintainable page-family contract.

The owner-directed amendment `docs/roadmap-amendments/2026-07-27-pr470-full-public-ui-contract.md` authorized PR #470. It completed:

- one physical public stylesheet and one import;
- removal of the accumulated legacy cascade;
- shared shell, typography, interaction, badge, table, disclosure, and responsive contracts;
- complete desktop/mobile information preservation;
- exhaustive rendered UI, screenshot, color, readability, hierarchy, and overflow validation;
- production verification on the public deployment.

```text
PR #470 Full Public UI Contract — complete
PRODUCTION VISUAL VERIFICATION — complete
Merge commit — 3e3edf4dd4d6af8e6ab5f9336271f0cca5cd6723
```

## Canonical data baseline

```text
PR #426  Post-UI v3 Data-Growth Reset: complete
PR #427  Record Growth Candidate Audit v2: complete
PR #428  Post-PR #427 Review Gate: complete
PR #429  Record Growth Batch 2 — CHFAU and SEKAU: complete
PR #432  Generated-output repair workflow: complete
PR #433  Generated and persisted PR #429 outputs: complete
PR #466  Post-UI data-growth review gate: complete
PR #467  Record Growth Batch 3 — PLNQ and GBPQ: reviewed complete
```

PR #433 established the generated and built 114-asset baseline. PR #467 extends the reviewed checkpoint to 116 stable assets, 107 organizations, 128 relationships, 191 events, 571 Evidence records, and 182 deployments.

PR #427 retained PLNQ and GBPQ as review-ready candidates. PR #428 deferred them by sequencing rather than rejecting them. PR #429 promoted CHFAU and SEKAU. PR #466 later authorized exactly PLNQ and GBPQ, and PR #467 completed both records with the existing Quantoz organization and verified Ethereum deployments.

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

## Record Growth Batch 3 result

PR #467 is bounded to the exact reviewed pair:

```text
Quantoz PLNQ — sog_cand_pr427_plnq
Quantoz GBPQ — sog_cand_pr427_gbpq
```

The implementation:

- reuses the existing Quantoz Payments organization;
- adds no duplicate organization;
- adds no Market Access record;
- records only verified Ethereum deployments;
- leaves future Polygon, Stellar, XRPL, Algorand, and Xahau deployments as explicit known unknowns;
- preserves unsupported reserve-allocation and operational-redemption details as unknown;
- changes no public UI or route family.

## Active bounded sequence

```text
PR #466 Post-UI data-growth review gate: complete
PR #470 Full Public UI Contract: complete and production-verified
PR #467 Record Growth Batch 3 — PLNQ and GBPQ: reviewed complete
REVIEW GATE: active after PR #467
```

No later record-growth batch is pre-authorized. The next action after PR #467 is a separate review decision based on its actual merged and deployed result.

## Production publication boundary

`main` remains the source of truth. Production publication follows `docs/deployment-policy.md` through `.github/workflows/deploy-production.yml` and must verify the deployed commit against the intended main commit.

A repository merge is not itself evidence that production parity has completed. Production parity remains a separately verified deployment result, and Issue #66 remains the long-lived checkpoint record for production consistency.

## Mandatory operating rule

Every non-trivial PR must identify its governing specification, exact bounded scope, preserved public and canonical boundaries, validation evidence, and next review gate. Old handoffs, stale UI phases, and superseded PR numbers must not be treated as current authority.
