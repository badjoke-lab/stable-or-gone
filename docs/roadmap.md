# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #245
Active: PR #246
Next: PR #247
Stable assets: 92
Gate V2-F: not passed
Record growth: authorized after PR #246 candidate audit
Production publication: deferred
```

## Non-UI boundary

UI review is unavailable. Gate V2-F remains not passed. Normal work may improve monitoring, records, data quality, machine-readable output, and release preparation, but may not approve the UI, deploy production, publish monitoring output, or write monitoring results directly to canonical data.

## Completed sequence

```text
PR #207-#216 UI v2 implementation and hardening
PR #217-#225 date, reserve, evidence, and record quality
PR #226-#229 deployment quality
PR #230-#232 review-only monitoring foundation
PR #233 non-UI continuation boundary
PR #234-#239 baseline-aware change detection and safety closure
PR #240 monitoring feasibility audit for all 92 assets
PR #241 reserve and assurance source expansion
PR #242 redemption and terms source expansion
PR #243 issuer, migration, and shutdown source expansion
PR #244 regulatory-source monitoring boundary
PR #245 monitoring coverage report and validator
```

## Permanent monitoring safety

```text
Workflow trigger: manual only
Workflow permission: contents read only
Automatic baseline write: false
Automatic canonical write: false
Automatic commit: false
Automatic pull request: false
Public monitoring output: false
Production publication: false
```

## Phase B result

```text
Canonical stable assets: 92
Enabled official sources: 24
Unique source URLs: 23
Covered stable assets: 16
Uncovered stable assets: 76
Stable-asset coverage: 17.39%
Multi-family covered assets: 7
Covered canonical organizations: 12
Pending baselines: 24
Accepted baselines: 0
Canonical records changed by monitoring: 0
```

Reporting-family coverage:

```text
reserve_assurance: 9 sources / 11 assets
redemption_terms: 5 sources / 7 assets
issuer_lifecycle: 5 sources / 5 assets
regulatory: 5 sources / 5 assets
```

Coverage means a reviewed source targets a canonical record. It is not a quality score, accepted baseline, current-reachability guarantee, or completeness claim. Private output remains under `data-staging/monitoring-coverage/`.

Specification: `docs/quality/monitoring-coverage-report-spec.md`

## Phase C — reviewed growth from 92 to 100

```text
PR #246 final-eight candidate audit and selection
PR #247 Growth A: 92 -> 94
PR #248 Growth B: 94 -> 96
PR #249 Growth C: 96 -> 98
PR #250 Growth D: 98 -> 100
```

The final eight are not predetermined. PR #246 must review duplicate risk, aliases, issuer or protocol identity, launch and lifecycle boundaries, stabilization, redemption, reserve applicability, deployments, events, evidence, and historical value.

Each growth PR is limited to two stable assets with all required supporting records. Unknown values remain unknown. Non-applicable record groups are documented rather than filled with placeholders.

## Phase D — 100-record registry audit

```text
PR #251 ID, slug, alias, and symbol uniqueness
PR #252 organization, issuer, and relationship integrity
PR #253 evidence URL, source identity, and duplication integrity
PR #254 reserve, redemption, and backing applicability
PR #255 deployment, contract, and chain identity
PR #256 launch, terminal, migration, and relationship boundaries
PR #257 known-unknown and placeholder integrity
PR #258 monitoring coverage recalculation for 100 assets
```

## Phase E — non-UI release preparation

```text
PR #259 Registry v2/v3 and machine-readable parity
PR #260 counts, manifest, version, and provenance integrity
PR #261 reproducible build and generated-output audit
PR #262 100-record canonical data freeze
PR #263 non-UI release-candidate material
```

PR #263 does not authorize production publication.

## UI resumption and publication gate

```text
owner all-route visual review
-> Gate V2-F correction PRs
-> Gate V2-F pass decision
-> explicit publication checkpoint approval
-> manual production deployment
-> deployed-commit and public-parity verification
```

Normal quality work does not publish the site.
