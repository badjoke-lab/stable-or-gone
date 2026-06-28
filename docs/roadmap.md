# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #230
Active: PR #231
Next: PR #232
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
```

## PR #231

```text
Trigger: workflow_dispatch only
Modes: health-only / official-sources
Official sources: 4
Candidate status: needs_human_review
Canonical action: none
Output: private artifact only
```

PR #231 observes allowlisted official pages, stores metadata and body digests without raw bodies, generates private candidates from allowlisted signals, and checks canonical targets and organization lineage.

Specifications:

- `docs/quality/monitoring-pipeline-spec.md`
- `docs/quality/monitoring-official-source-spec.md`
- `docs/quality/monitoring-official-source-schema.md`

## Remaining sequence

```text
PR #232 reviewable monitoring reports and PR material
```

Normal quality work does not publish the site. Gate V2-F remains deferred.
