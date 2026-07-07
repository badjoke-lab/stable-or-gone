# Stable or Gone non-UI quality program

Status: canonical implementation plan — active  
Updated: 2026-07-07  
Registry checkpoint: 100 canonical stable assets

## Purpose

This program governs the core workstream after the dedicated UI correction program ended.

```text
100-record registry-wide audit — complete
-> EU market-access research and reviewed guide publication — complete
-> known-unknown and placeholder integrity audit — complete
-> monitoring coverage recalculation — complete
-> Registry v2/v3 and machine-readable parity — complete
-> release integrity — complete
-> reproducible build audit — complete
-> audited 100-record canonical checkpoint — complete
-> non-UI release material — complete
-> monitoring baseline synchronization — complete
-> reserve and redemption source expansion — complete
-> lifecycle/regulatory/access source and schema expansion — complete
-> bounded scheduled read-only monitoring — active
-> statistics implementation
-> controlled growth from 100 to 110
-> Comparison Foundation
-> Compare
-> Change Research Tools
-> Reviewed Public Update Layer
```

The canonical execution order and PR numbers are defined by `docs/roadmap.md` and active roadmap amendments.

UI remains maintenance-only until the roadmap reaches an approved product UI phase.

## Current status

```text
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Deployments: 140
Detail routes: 366

PR #316 release integrity: complete
PR #317 reproducible build audit: complete
PR #318 audited 100-record canonical checkpoint: complete
PR #319 guide spacing maintenance: complete, inserted work
PR #320 non-UI release material: complete
PR #321 100-asset monitoring baseline synchronization: complete
PR #322 reserve and redemption source expansion: complete
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion: complete
PR #324 bounded scheduled read-only monitoring: active
PR #325 deterministic statistics generator and validator: next
```

## Required reading order

Before changing canonical data, evidence, workflows, monitoring, statistics, comparison surfaces, or release integrity:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. every active roadmap amendment named by the roadmap
6. this document
7. the canonical specification for the active work item
8. every named baseline, validator, audit, queue, fixture, release note, publication-gate review, and research checkpoint

Current PR #324 work must read:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-lifecycle-regulatory-market-access-expansion-spec.md
docs/quality/monitoring-bounded-scheduled-read-only-spec.md
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
scripts/monitoring/scheduling/source-groups.mjs
scripts/monitoring/monitors/news-discovery.mjs
scripts/monitoring/monitors/article-stale-state-review.mjs
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Partial dates are not coerced into day-level dates.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- Scheduled output remains private workflow artifact material.
- News discovery is discovery-only and does not create canonical facts.
- Stale-state findings do not edit guides or research matrices automatically.
- Platform access preserves function, service state, legal entity, customer scope, supported network, geography, and dates.
- A platform licence is not proof of stablecoin function availability.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- Platform-policy, platform service-state, issuer/token regulation, CASP authorization, geography, and function scope remain separate.
- Comparison projections use reviewed canonical data only and preserve unresolved states.
- Facet freshness derives from authoritative record families rather than display-only root timestamps.
- No growth PR may contain more than two new stable assets.

## Completed foundation

```text
PR #217-#225  date, reserve, evidence, and traceability quality
PR #226-#229  deployment quality
PR #230-#245  review-only monitoring foundation and source coverage
PR #246         final-eight candidate audit
PR #247-#250   controlled growth through 98 records with recorded deviations
PR #278         rebuilt Growth D to 100 records from current implementation lineage
PR #279-#280   production verification and count-aware closure hardening
PR #284-#295   UI recovery and maintenance fixes; dedicated UI program stopped
PR #296-#302   registry-wide audit through lifecycle and relationship boundaries
PR #303-#307   EU market-access specification, research, re-audit, and publication
PR #308         known-unknown and placeholder integrity audit
PR #309         monitoring coverage recalculation
PR #311         Registry v2/v3 and machine-readable parity
PR #312         Ripple EU CASP guide update
PR #314         corrected guide follow-up
PR #315         schedule amendment and PR renumbering
PR #316         release integrity
PR #317         reproducible build audit
PR #318         audited 100-record canonical checkpoint
PR #319         guide maintenance, inserted work
PR #320         non-UI release material
PR #321         100-asset monitoring baseline synchronization
PR #322         reserve and redemption source expansion
PR #323         lifecycle, regulatory, and EU market-access source/schema expansion
```

## Monitoring pipeline boundary

The monitoring pipeline remains review-only:

```text
official-source observation
-> accepted-baseline comparison
-> change classification
-> private candidate
-> review material
-> evidence draft
-> human approval before canonical publication
```

Scheduled auxiliary lanes add:

```text
bounded news discovery -> private discovery leads
article stale-state review -> private review findings
```

The pipeline must not commit canonical data, accept its own baseline, publish candidates or discovery leads, edit guides automatically, create automatic canonical PRs, or deploy.

## Historical monitoring checkpoints

PR #321:

```text
24 sources
24 pending baselines
16 assets reached
84 uncovered assets
12 organizations reached
0 accepted baselines
0 accepted asset reach
7 multi-family assets
```

PR #322:

```text
30 sources
30 pending baselines
22 assets reached
78 uncovered assets
18 organizations reached
0 accepted baselines
0 accepted asset reach
11 multi-family assets
```

PR #321 and PR #322 snapshots are immutable.

## Current PR #323 monitoring boundary

```text
sources: 39
baseline rows: 39
pending: 39
accepted: 0
missing: 0
registered asset reach: 23
uncovered assets: 77
covered organizations: 18
accepted asset reach: 0
multi-family assets: 17
```

Current family reach:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 7 sources / 7 assets
regulatory: 9 sources / 8 assets
platform_policy: 3 sources / 12 mapped assets
platform_service_state: 1 source / 0 mapped assets
regulatory_register: 1 source / 0 mapped assets
```

Binding current snapshot:

```text
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
```

All 39 baselines remain pending. Accepted asset reach remains zero.

## Phase B — release hardening — complete

```text
PR #316 release integrity — complete
PR #317 reproducible build audit — complete
PR #318 audited 100-record canonical checkpoint — complete
PR #319 guide maintenance — complete, inserted work
PR #320 non-UI release material — complete
```

## Phase C — monitoring expansion and operation — active

```text
PR #321 100-asset monitoring baseline synchronization — complete
PR #322 reserve and redemption source expansion — complete
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion — complete
PR #324 bounded scheduled read-only monitoring — active
```

### PR #324 contract

Binding files:

```text
docs/quality/monitoring-bounded-scheduled-read-only-spec.md
scripts/monitoring/scheduling/source-groups.mjs
scripts/monitoring/monitors/news-discovery.mjs
scripts/monitoring/monitors/article-stale-state-review.mjs
scripts/validate-bounded-scheduled-monitoring-pr324.mjs
.github/workflows/monitoring-bounded-scheduled-read-only.yml
```

Scheduled partition:

```text
daily sources: 4
weekly sources: 35
overlap: 0
union: all 39 reviewed sources
source/baseline parity: exact for both groups
all 39 baselines remain pending
accepted baselines: 0
accepted asset reach: 0
```

Daily group:

```text
platform_policy sources
platform_service_state sources
bounded private news discovery
```

Weekly group:

```text
all remaining reviewed official sources
ESMA regulatory-register source
issuer reserve/transparency sources
redemption and mint-term sources
issuer lifecycle and regulatory sources
article/research stale-state review
```

News discovery is bounded to four queries and twenty retained items per query, uses a 1 MiB body limit, retains no raw response body, and remains `discovery_only` with `canonical_action: none` and `public_output: false`.

Article stale-state review is read-only and may report `current`, `review_due`, `stale`, `severely_stale`, or `missing_date`. It may not edit the public guide, research matrix, or canonical data.

The scheduled workflow uses `contents: read` only and uploads private artifacts. It may not create branches or canonical pull requests, accept baselines, publish candidates or leads, use Cloudflare deployment credentials, or deploy monitoring output.

## Phase D — statistics implementation

```text
PR #325 deterministic statistics generator and validator
PR #326 immutable checkpoint history
PR #327 /stats/ foundation
PR #328 historical, deployment, organization, and data-quality statistics
```

Statistics derive from reviewed canonical data and must not become price, market-cap, APY, safety, transparency, or risk rankings.

## Phase E — candidate audit and controlled growth from 100 to 110

```text
PR #329 next candidate audit
PR #330 100 -> 102
PR #331 102 -> 104
PR #332 104 -> 106
PR #333 106 -> 108
PR #334 108 -> 110
```

Growth remains blocked until monitoring, statistics, and candidate audit complete.

## Phase F — Comparison Foundation

```text
PR #335 define Comparison Readiness contract and audit method
PR #336 audit all 110 assets for comparison readiness
PR #337 normalize comparison-critical gaps and validators
PR #338 define canonical Market Access Record schema and governance
PR #339 define facet-freshness derivation contract and validators
```

Phase F is data- and contract-first. Compare UI work must not begin before readiness and normalization are complete.

## Phase G — Compare

```text
PR #340 deterministic comparison projection generator and machine-readable output
PR #341 /compare/ v1
PR #342 Compare presets
```

## Phase H — Change Research Tools

```text
PR #343 access and regulation index generator
PR #344 Access & Regulation Explorer
PR #345 change-timeline projection generator
PR #346 Change Timeline UI
```

## Phase I — Reviewed Public Update Layer

```text
PR #347 SOG Registry Update feed/page
PR #348 Monthly Stablecoin Change Log
```

These future surfaces derive from reviewed merged canonical changes. They are not raw monitoring feeds or automatic news digests.

## Optional Phase J — Query Translation

```text
PR #349+ natural-language filter translation after separate approval
```

This optional layer may translate natural-language requests into structured filters only after structured product surfaces are stable. It must not bypass canonical evidence or unresolved-state semantics.
