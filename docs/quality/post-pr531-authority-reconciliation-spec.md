# Post-PR #531 Authority Reconciliation Specification

Status: active  
Date: 2026-08-08

## Scope

Reconcile repository authority and schedule with production commit `210d68001fbd2560ffadf538fdb7cc9302b400a7`, recognize merged PRs #524–#531, and authorize only the current-main reconciliation and completion of existing PR #523.

This specification changes repository control documentation only. It authorizes no canonical mutation in this reconciliation PR.

## Required source-of-truth sequence

Before every substantive continuation, read the merged current versions of:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-08-post-pr531-authority-reconciliation.md`
6. this specification
7. the active work-item specification and named inputs

Chat history, handoff prose, stale branch state, old generated reports, and unmerged drafts do not override the merged repository documents above.

## Current verified baseline

```text
production commit: 210d68001fbd2560ffadf538fdb7cc9302b400a7
canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
convergence attempt: 1
assets: 119
organizations: 109
relationships: 131
events: 194
Evidence: 584
Evidence Relations: 584
reserve reports: 127
known unknowns: 352
regulatory notes: 9
deployments: 186
legal profiles: 119
reserve components: 153
income profiles: 119
Market Access Records: 8
archive recorded: 462
archive not recorded: 122
detail routes: 422
metadata-checked routes: 422
```

## Required authority assertions

- PRs #524 through #531 are recognized as merged current-main history.
- The legacy SOG host migration is complete through the Pages Advanced Mode worker and strict migration gate.
- The only next canonical implementation authorized is existing PR #523.
- PR #523 is authorized only after current-main reconciliation; its stale pre-#524 state may not be merged directly.
- PR #523 must preserve the merged behavior of PRs #524–#531.
- The PR #522 JPYSC semantic/evidence boundary remains binding unless a later merged authority explicitly changes it.
- PR #523 must exit through production verification to a separate REVIEW GATE closeout.
- Evidence Archive Payload Verification Batch 2 and every later lane remain planned, not implementation-authorized.

## PR #523 bounded transition

```text
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Archive not recorded: 122 -> 122
Detail routes: 422 -> 422
Metadata-checked routes: 422 -> 422
```

No asset, organization, relationship, event, deployment, legal-profile, reserve-component, income-profile, route-family, schema, ranking, score, recommendation, or unrelated UI addition is authorized by PR #523.

## Schedule contract

```text
2026-08-08..2026-08-09  reconcile authority/specification/schedule
2026-08-08..2026-08-10  reconcile and complete PR #523 on current main
post-#523                 production verify and close out to REVIEW GATE
2026-08-10..2026-08-16  stabilization and preparation only
2026-08-17..2026-08-23  Evidence Archive Payload Verification Batch 2; separate authority required
2026-08-24..2026-08-30  Tier A Dossier Deepening Batch 4; separate authority required
2026-08-31..2026-09-06  cycle review and backlog reconciliation
2026-09-07..2026-09-13  next operating authority and contingency
```

Dates are planning windows, not permission boundaries. If a work item slips, authority remains bounded; the schedule must be revised rather than silently authorizing the next lane.

## Editorial contract

The regulation guide cluster is maintenance-only for the current phase. No automatic new-article cadence exists. New editorial pages require a material regulatory change, material correction/source update, or observed search-demand/content-gap basis. Existing evergreen URLs should be updated in place when practical.

## Next-cycle planning contract

Planning priority is:

```text
Market Access expansion
> Tier A dossier deepening
> Record Growth
> new UI
```

This is not implementation authority.

## Preservation

This reconciliation must not alter canonical registry data, public counts, machine-readable schemas, route families, UI behavior, guide content, Cloudflare behavior, or production output. It updates control documents and validation only.

## Exit

The reconciliation exits with PR #523 as the only authorized canonical implementation, subject to current-main integration and current validation. PR #523 itself must exit to a separately recorded `REVIEW GATE` after production verification.
