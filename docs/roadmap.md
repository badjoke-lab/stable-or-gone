# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #234
Active: PR #235
Next: PR #236
Stable assets: 92
Gate V2-F: not passed
Record growth: authorized after PR #246 candidate audit
Production publication: deferred
```

## Fixed boundary while UI review is unavailable

The owner cannot currently perform the required all-route desktop and mobile visual review. UI work therefore remains paused and Gate V2-F remains not passed.

The non-UI continuation program may advance monitoring, reviewed record growth, registry-wide quality, machine-readable parity, build reproducibility, and release-candidate documentation. It must not:

- approve the current UI;
- pass Gate V2-F;
- select or execute a production deployment;
- publish monitored candidates automatically;
- write monitoring output directly to canonical data;
- claim public parity before an explicitly approved deployment.

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
PR #233 non-UI continuation roadmap and safety boundary
PR #234 monitoring baseline specification and pending source records
```

## PR #234 result

```text
Baseline set: scripts/monitoring/baselines/official-source-baselines.json
Enabled source records: 4
Initial state: pending_initial_acceptance
Live digests invented: false
Monitoring write allowed: false
Canonical evidence: false
Public output: false
Automatic pull request: false
Production publication: false
```

PR #234 defines an accepted baseline as a human-reviewed comparison point, not evidence of a stablecoin fact. The four current official sources remain pending until a later reviewed observation is explicitly accepted. Repository validation rejects missing sources, URL mismatches, unsafe redirects, malformed digests, populated pending fields, raw content fields, and write/publication authority.

Specification: `docs/quality/monitoring-baseline-spec.md`

## Approved continuation sequence

### Phase A — material-change monitoring

```text
PR #234 monitoring baseline specification
PR #235 baseline-aware material-change detection
PR #236 human-approved baseline update flow
PR #237 observation change classification
PR #238 content normalization and noise suppression
PR #239 deterministic monitoring audit and safety closure
```

Phase A must establish the following behavior:

```text
unchanged source                    -> no monitoring candidate
materially changed source           -> private candidate
metadata-only change                -> classified separately
fetch failure                       -> operational finding, not content change
new source without accepted baseline -> explicit new_source state
baseline update                     -> separate human-reviewed PR
canonical write                     -> prohibited
```

### Phase B — monitored-source coverage

```text
PR #240 monitoring feasibility audit for all 92 assets
PR #241 reserve and assurance source expansion
PR #242 redemption and terms source expansion
PR #243 issuer, migration, and shutdown source expansion
PR #244 regulatory-source monitoring boundary
PR #245 monitoring coverage report and validator
```

Source-count growth alone is not completion. Every monitored source requires official ownership, an allowlisted HTTPS host, canonical target IDs, signal scope, a reviewable baseline state, and no automatic canonical action.

### Phase C — reviewed growth from 92 to 100

```text
PR #246 final-eight candidate audit and selection
PR #247 Growth A: 92 -> 94
PR #248 Growth B: 94 -> 96
PR #249 Growth C: 96 -> 98
PR #250 Growth D: 98 -> 100
```

PR #246 must complete duplicate, alias, issuer/protocol, launch boundary, lifecycle, stabilization, redemption, reserve-applicability, deployment, event, evidence, and historical-significance review before any candidate is promoted.

Each growth PR is limited to two stable assets and all required supporting records. Unknown values remain unknown. Non-applicable record groups must be documented rather than populated with invented placeholders.

### Phase D — 100-record registry audit

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

The goal is not to eliminate unknown values. The goal is to ensure each value is supported, explicitly unresolved, unavailable from an official source, or correctly non-applicable.

### Phase E — non-UI release preparation

```text
PR #259 Registry v2/v3 and machine-readable parity
PR #260 counts, manifest, version, and provenance integrity
PR #261 reproducible build and generated-output audit
PR #262 100-record canonical data freeze
PR #263 non-UI release-candidate material
```

PR #263 may prepare release notes, known-unknown inventories, monitoring coverage, deployment and rollback checklists, and a candidate commit. It does not authorize production publication.

## UI resumption and publication gate

After PR #263, non-UI continuation stops at a prepared repository candidate. Work resumes only when the owner can inspect representative desktop and mobile routes.

```text
owner all-route visual review
-> Gate V2-F correction PRs
-> Gate V2-F pass decision
-> explicit publication checkpoint approval
-> manual production deployment
-> deployed-commit and public-parity verification
```

Normal quality work does not publish the site.