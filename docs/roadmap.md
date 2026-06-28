# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #229
Active: PR #230
Next: PR #231
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
```

## PR #230

```text
Trigger: workflow_dispatch only
Mode: health-only
External network used: false
Canonical writes: prohibited
Candidate count: 0
Output: private artifact only
```

PR #230 adds the monitoring run manifest, repository-health report, Markdown summary, canonical snapshot guard, manual workflow, and validator. It does not observe external sources, create candidates, commit run output, open pull requests automatically, or publish findings.

Specification: `docs/quality/monitoring-pipeline-spec.md`
Workflow: `.github/workflows/monitoring-review.yml`
Validator: `scripts/validate-monitoring-pipeline-pr230.mjs`

## Remaining sequence

```text
PR #231 official-source candidate generation
PR #232 reviewable monitoring reports
```

Normal quality work does not publish the site. Gate V2-F remains deferred.
