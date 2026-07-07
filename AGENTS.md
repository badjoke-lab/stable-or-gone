# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. every active roadmap amendment named by the roadmap
6. the canonical specification for the active work item
7. every queue, validator, audit, fixture, baseline, release note, publication-gate review, and research checkpoint named by that work item

Current schedule amendments:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

Current monitoring work must read:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-baseline-synchronization-100-assets-spec.md
docs/quality/monitoring-reserve-redemption-source-expansion-spec.md
docs/quality/monitoring-lifecycle-regulatory-market-access-expansion-spec.md
docs/quality/monitoring-bounded-scheduled-read-only-spec.md
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
```

Release/checkpoint authority remains binding:

```text
docs/migration/registry-release-integrity-baseline.json
docs/migration/reproducible-build-output-baseline.json
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/releases/100-asset-checkpoint-2026-07-06.md
```

Statistics work must read `docs/stats-spec.md`. Phase F-I work must read `docs/comparison-and-change-product-spec.md` together with current roadmap amendments.

## Repository source of truth

Merged repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

For PR numbering after inserted work, `docs/roadmap.md` and active roadmap amendments override older numeric labels in subordinate plans.

## Current workstream

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
Active: PR #324 bounded scheduled read-only monitoring
Next: PR #325 deterministic statistics generator and validator
```

Approved remaining sequence:

```text
PR #324       bounded scheduled read-only monitoring
PR #325-#328  statistics implementation
PR #329       next candidate audit
PR #330-#334  controlled growth from 100 to 110
PR #335-#339  Comparison Foundation
PR #340-#342  Compare
PR #343-#346  Change Research Tools
PR #347-#348  Reviewed Public Update Layer
PR #349+      optional natural-language filter translation after separate approval
```

Do not skip ahead unless `docs/roadmap.md` is deliberately amended.

## Core data rules

- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce partial-date evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Canonical counts change only through an explicit audited data PR.
- Rebrand, migration continuation, wrapped representation, deployment, or alias records must not become separate canonical assets without scope support and lineage review.
- Archive absence is a quality queue item, not permission to fabricate an archive URL.
- Missing capability data means unknown knowledge state, not `false`.

Protected unresolved states:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## Release and checkpoint rules

- Release-integrity, reproducible-build, and audited 100-asset checkpoint files remain binding.
- Candidate, monitoring, editorial-research, and private material remain outside canonical public count surfaces and provenance boundaries.
- Production must continue to pass public output, provenance, route/output parity, canonical hash parity, canonical file-count parity, and reviewed count parity.

## Historical monitoring checkpoint rules

The PR #321 snapshot is historical and immutable:

```text
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

It preserves:

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

The PR #322 snapshot is also historical and immutable:

```text
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

It preserves:

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

Later source expansion must not overwrite either historical checkpoint.

## PR #323 lifecycle/regulatory/market-access expansion rules

Binding files:

```text
docs/quality/monitoring-lifecycle-regulatory-market-access-expansion-spec.md
docs/quality/monitoring-official-source-schema.md
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
scripts/validate-monitoring-scoped-source-schema-pr323.mjs
scripts/validate-monitoring-lifecycle-regulatory-market-access-expansion-100-assets.mjs
.github/workflows/monitoring-lifecycle-regulatory-market-access-expansion.yml
```

Current reviewed monitoring boundary:

```text
100 assets
94 organizations
110 relationships
39 sources
39 baseline rows
39 pending_initial_acceptance
0 accepted
0 missing
23 assets with registered source reach
77 uncovered assets
18 organizations reached
0 accepted asset reach
17 multi-family assets
```

Current source-family boundary:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 7 sources / 7 assets
regulatory: 9 sources / 8 assets
platform_policy: 3 sources / 12 mapped assets
platform_service_state: 1 source / 0 mapped assets
regulatory_register: 1 source / 0 mapped assets
```

Current scoped coverage:

```text
platform-policy sources: 3
platform service-state sources: 1
regulatory-register sources: 1
market-access schema-capable sources: 5
scoped platforms: 4
scoped region values: 4
```

Scope rules:

- `monitoring_scope` may represent `platform_policy`, `platform_service_state`, or `regulatory_register`.
- Platform name, legal entity, region, function scope, authority identity, and register family must remain explicit.
- A platform licence is not proof of stablecoin function availability.
- Platform-wide service state must not be rewritten as asset status.
- Regulatory-register sources may use reviewed noncanonical subject scope without fake stablecoin or issuer IDs.
- Platform/register scope counts are not divided by the 100-asset denominator.
- All 39 baselines remain pending.
- Accepted-only fields remain null.
- Source/baseline ID parity must be exact.
- Snapshot generation is offline and performs no canonical action.
- Monitoring remains private, review-only, read-only, and non-publishing.

PR #323 completed source/schema expansion without accepting baselines, writing canonical data, editing guides automatically, publishing candidates, creating canonical Market Access Records, or deploying monitoring output.

## PR #324 bounded scheduled read-only monitoring rules

Binding files:

```text
docs/quality/monitoring-bounded-scheduled-read-only-spec.md
scripts/monitoring/scheduling/source-groups.mjs
scripts/monitoring/monitors/news-discovery.mjs
scripts/monitoring/monitors/article-stale-state-review.mjs
scripts/validate-bounded-scheduled-monitoring-pr324.mjs
.github/workflows/monitoring-bounded-scheduled-read-only.yml
```

Scheduled groups are exactly:

```text
daily
weekly
```

Daily group:

```text
4 reviewed official sources
platform_policy
platform_service_state
bounded private news discovery
```

Weekly group:

```text
35 reviewed official sources
all reviewed sources not in daily group
ESMA regulatory-register source
issuer reserve/transparency sources
redemption and mint-term sources
issuer lifecycle sources
issuer/token regulatory sources
article/research stale-state review
```

Partition rules:

```text
daily source count: 4
weekly source count: 35
overlap: 0
union: all 39 reviewed sources
source/baseline parity: exact for both groups
all 39 repository baselines: pending_initial_acceptance
accepted baselines: 0
accepted asset reach: 0
```

News discovery boundaries:

```text
maximum queries per run: 4
maximum items retained per query: 20
maximum feed body: 1 MiB
raw response retention: false
discovery only: true
canonical action: none
public output: false
```

Article stale-state review is local and read-only. It may classify review_due, stale, severely_stale, and missing_date states but may not edit the public guide, editorial research, or canonical data.

The scheduled workflow must use:

```text
permissions:
  contents: read
```

PR #324 may not accept baselines, write canonical data, create automatic branches or canonical pull requests, edit guides automatically, publish candidates or news leads, publish stale-state findings, use Cloudflare credentials, or deploy monitoring output.

## Market-access rules

- Do not reduce access to a universal allowed/banned boolean.
- Preserve issuer identity, token regulatory path, service-provider authorization, legal entity, platform service state, geography, customer scope, function or access route, supported network, announcement date, and effective date separately.
- A platform licence is not proof of stablecoin function availability.
- Monitoring observations and editorial research matrices are not canonical Market Access Records.
- The public guide is a reviewed dated snapshot and is never edited automatically from monitoring output.

## Monitoring rules

- Registered source reach is not accepted monitoring coverage.
- A pending baseline is not an accepted baseline.
- Issuer/protocol reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- Monitoring output, discovery leads, and stale-state findings remain private artifact material.
- Scheduled monitoring may observe, compare, classify, prepare private review material, discover bounded news leads, and report stale review state.
- Monitoring may not write canonical data, accept its own baselines, create branches or canonical PRs automatically, edit guides automatically, publish candidates or leads, or deploy.
- PR #324 closes Phase C scheduled operation.
- PR #325 begins statistics implementation after PR #324 completes.

## Statistics and comparison rules

- `docs/stats-spec.md` is binding for PR #325-#328.
- Statistics derive from reviewed canonical data and do not become live price, market-cap, APY, safety, transparency, or risk rankings.
- Phase F-I begins only after the reviewed 110-asset checkpoint.
- Preserve separate analytical layers for lifecycle, issuance/redemption, legal/regulatory state, and market access.
- Compare uses reviewed canonical data, preserves unknown states, and does not score or recommend assets.
- Change Timeline is derived and does not replace source record families.
- Public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds.

## Growth rule

Growth beyond 100 begins only after monitoring, statistics, and candidate-audit phases. Growth PRs contain no more than two new stable assets and preserve all applicable supporting record groups.

## Deployment rule

Normal merged changes publish from `main` under `docs/deployment-policy.md`. Scheduled monitoring remains artifact-only and does not authorize monitoring artifact publication, canonical writes, guide edits, automatic pull requests, or Cloudflare deployment.
