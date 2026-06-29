# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #232
Active: post-monitoring decision gate
Next: roadmap amendment required
Stable assets: 92
Gate V2-F: not passed
Record growth: paused
Production publication: deferred
```

## Completed UI sequence

```text
PR #207 approved v2 contract and governance
PR #208 shared visual foundation
PR #209 Home
PR #210 Stablecoins index
PR #211 Stablecoin detail
PR #212 Organizations index and detail
PR #213 Events index and detail
PR #214 Editorial and project pages
PR #215 Mobile and accessibility hardening
PR #216 Visual-mark correction
```

## Completed quality sequence

```text
PR #217-#225 date, reserve, and evidence quality
PR #226-#229 deployment quality
PR #230 monitoring skeleton and canonical guard
PR #231 official-source observations and private candidates
PR #232 review reports, evidence drafts, and draft PR material
```

## PR #232 result

```text
Trigger: workflow_dispatch only
Permissions: contents read
Official-source output: private artifact only
Review output files: 9
Candidate status: needs_human_review
Evidence status: draft_only
Canonical action: none
Automatic pull request: false
Automatic canonical write: false
Production publication: false
```

PR #232 separates observed facts, unconfirmed low-confidence inferences, unresolved questions, and rejected duplicate candidates. It creates reviewable evidence drafts, an operator report, and DRAFT ONLY pull-request material while preserving the canonical repository snapshot.

Specifications:

- `docs/quality/monitoring-pipeline-spec.md`
- `docs/quality/monitoring-official-source-spec.md`
- `docs/quality/monitoring-official-source-schema.md`
- `docs/quality/monitoring-review-material-spec.md`

## Decision gate

The PR #217–#232 non-UI quality and monitoring sequence is complete. No additional workstream starts automatically.

The next roadmap amendment must explicitly choose one or more of:

```text
resume owner-led all-route UI review and Gate V2-F work
select a repaired 92-record publication candidate
approve reviewed growth toward 100 before publication
extend monitoring source coverage under a separately approved scope
```

Until that amendment is merged:

- Gate V2-F remains not passed;
- record growth remains paused;
- no release candidate is selected;
- production publication remains deferred;
- monitored candidates remain private review material.

Normal quality work does not publish the site.
