# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-07

## 1. Purpose

This file defines document authority, conflict resolution, change control, roadmap discipline, release integrity, reproducible-build boundaries, audited checkpoint boundaries, monitoring checkpoint history, source-expansion boundaries, scheduled-operation boundaries, statistics boundaries, comparison boundaries, and publication safety.

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts do not override merged repository authority.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for current phase, active item, next item, and PR numbering.
4. Active merged roadmap amendments named by the roadmap.
5. The canonical specification for the active workstream.
6. Supporting audits, inventories, baselines, fixtures, release notes, publication-gate reviews, and research checkpoints.
7. Conversation history and unmerged drafts.

Current schedule amendments:

```text
docs/roadmap-amendments/2026-07-06-editorial-insertions-and-pr-renumbering.md
docs/roadmap-amendments/2026-07-06-pr319-maintenance-and-renumbering.md
```

## 3. Governing specifications

Release/checkpoint authority:

```text
docs/migration/registry-release-integrity-baseline.json
docs/migration/reproducible-build-output-baseline.json
docs/migration/audited-100-asset-canonical-checkpoint.json
docs/non-ui-release-material-spec.md
```

Current monitoring authority:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-baseline-synchronization-100-assets-spec.md
docs/quality/monitoring-reserve-redemption-source-expansion-spec.md
docs/quality/monitoring-lifecycle-regulatory-market-access-expansion-spec.md
docs/quality/monitoring-bounded-scheduled-read-only-spec.md
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
```

Statistics work is governed by `docs/stats-spec.md`. Phase F-I work is governed by `docs/comparison-and-change-product-spec.md` together with active numbering amendments.

## 4. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read every active roadmap amendment named by the roadmap;
6. read the canonical specification for the active work item;
7. read every named queue, validator, audit, fixture, baseline, release note, publication-gate review, and research checkpoint.

A non-trivial PR is not ready for review until it identifies the exact specification and roadmap item it implements.

## 5. Change control

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- canonical enum meaning;
- evidence interpretation;
- unknown-state semantics;
- route families or machine-readable output shape;
- count or denominator semantics;
- build provenance or canonical hash boundary;
- audited checkpoint source commit or digest boundary;
- dependency-lock or reproducible-build semantics;
- release-material derivation semantics;
- monitoring source schema;
- monitoring baseline-state semantics;
- monitoring checkpoint/snapshot digest boundary;
- monitoring source-family classification;
- monitoring coverage semantics;
- `monitoring_scope` semantics;
- platform/legal-entity/region/function/register scope semantics;
- schedule trigger, schedule group, or permission boundary;
- news-discovery query or retention bounds;
- article stale-state freshness bands;
- statistics semantics;
- comparison projection semantics;
- canonical Market Access Record semantics;
- production publication gates;
- approved PR sequence;
- active workstream state.

No implementation PR may introduce an undocumented alternative.

## 6. Pull-request traceability

Every non-trivial PR body must identify:

```text
Specification references
Roadmap item
Scope
Explicit non-goals
Data preservation
Validation
Deployment classification
```

A PR that cannot cite an approved work item must pause until repository authority is corrected.

## 7. Current execution state

```text
100 canonical stable assets reached
release integrity complete
reproducible build audit complete
audited 100-record canonical checkpoint complete
non-UI release material complete
PR #321 100-asset monitoring baseline synchronization complete
PR #322 reserve and redemption source expansion complete
PR #323 lifecycle, regulatory, and EU market-access source/schema expansion complete
PR #324 bounded scheduled read-only monitoring active
PR #325 deterministic statistics generator and validator next
PR #325-#328 statistics
PR #329-#334 candidate audit and controlled growth to 110
PR #335-#348 post-110 product sequence approved but inactive before reviewed 110-asset checkpoint
```

Do not rewrite completed history to make a changed plan appear unchanged. Historical monitoring snapshots remain immutable.

## 8. Release and checkpoint governance

Binding rules:

- canonical counts derive from composed canonical manifests and files;
- public count-path semantics remain stable unless explicitly versioned;
- runtime provenance uses real commit, branch, timestamp, non-zero canonical hash, and positive canonical file count;
- candidate, monitoring, editorial-research, discovery, and private material remain outside canonical public count surfaces and provenance boundaries;
- reproducibility-sensitive workflows use the reviewed lockfile and pinned Node runtime;
- protected historical inputs are not mutated by normal build;
- the audited checkpoint keeps identity and content digests separate;
- later noncanonical production commits are allowed only while public output, provenance, route/output parity, canonical hash parity, canonical file-count parity, and reviewed count parity remain valid.

## 9. Historical monitoring checkpoint governance

PR #321 snapshot:

```text
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
24 sources
24 pending baseline rows
16 assets reached
84 uncovered assets
12 organizations reached
0 accepted baselines
0 accepted asset reach
7 multi-family assets
```

PR #322 snapshot:

```text
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
30 sources
30 pending baseline rows
22 assets reached
78 uncovered assets
18 organizations reached
0 accepted baselines
0 accepted asset reach
11 multi-family assets
```

Historical validators check fixed counts and digests directly. Later source expansion or scheduling must not regenerate historical checkpoints against current configuration.

## 10. PR #323 lifecycle/regulatory/market-access source and schema governance

PR #323 is governed by:

```text
docs/quality/monitoring-lifecycle-regulatory-market-access-expansion-spec.md
docs/quality/monitoring-official-source-schema.md
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
scripts/validate-monitoring-scoped-source-schema-pr323.mjs
scripts/validate-monitoring-lifecycle-regulatory-market-access-expansion-100-assets.mjs
.github/workflows/monitoring-lifecycle-regulatory-market-access-expansion.yml
```

Binding current boundary:

```text
100 assets
94 organizations
110 relationships
39 reviewed source rows
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

Binding source-family boundary:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 7 sources / 7 assets
regulatory: 9 sources / 8 assets
platform_policy: 3 sources / 12 mapped assets
platform_service_state: 1 source / 0 mapped assets
regulatory_register: 1 source / 0 mapped assets
```

Binding scoped coverage:

```text
platform-policy sources: 3
platform service-state sources: 1
regulatory-register sources: 1
market-access schema-capable sources: 5
scoped platforms: 4
scoped region values: 4
```

`monitoring_scope` is private review context, not a canonical Market Access Record. Platform name, legal entity, region, function scope, authority identity, and register families remain explicit. Platform/register scope counts are not divided by the 100-asset denominator.

## 11. PR #324 bounded scheduled read-only monitoring governance

PR #324 is governed by:

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

Partition boundary:

```text
daily source count: 4
weekly source count: 35
overlap: 0
union: all 39 reviewed sources
daily source/baseline parity: exact
weekly source/baseline parity: exact
all 39 repository baselines: pending_initial_acceptance
accepted baselines: 0
accepted asset reach: 0
```

Daily group contains reviewed `platform_policy` and `platform_service_state` sources plus bounded private news discovery.

Weekly group contains the remaining 35 reviewed official sources, including the ESMA regulatory-register source, plus article/research stale-state review.

News-discovery bounds:

```text
maximum queries per run: 4
maximum items retained per query: 20
maximum feed response body: 1 MiB
request timeout: 15 seconds
raw response retention: false
discovery only: true
canonical action: none
public output: false
```

Article stale-state bands:

```text
current: 0-7 days
review_due: 8-14 days
stale: 15-30 days
severely_stale: 31+ days
missing_date: no usable review date
```

Stale-state findings are private and do not edit the public guide, research matrix, or canonical data.

Scheduled workflow permission boundary:

```text
permissions:
  contents: read
```

The workflow may upload private artifacts. It may not use write permissions, create branches or canonical pull requests automatically, accept baselines, publish candidates or discovery leads, edit guides automatically, use Cloudflare deployment credentials, or deploy monitoring output.

## 12. Monitoring coverage governance

Coverage remains multidimensional:

```text
reserve/assurance reach
redemption/mint terms reach
issuer lifecycle reach
regulatory action/guidance reach
platform-policy reach
platform service-state reach
regulatory-register reach
EU/EEA market-access function reach
accepted-baseline reach
```

Rules:

- a registered source is not an accepted baseline;
- a pending baseline is not accepted monitoring coverage;
- issuer/protocol reach is not platform-policy coverage;
- regulatory action pages are not regulatory-register coverage;
- generic issuer/product pages are not function-level market-access coverage;
- zero coverage for a required domain is a valid audit result and must not be filled by inference;
- monitoring output, discovery leads, and stale-state findings remain private until separately reviewed.

## 13. Monitoring safety boundary

Monitoring remains review-only and read-only with respect to canonical data.

Fixed prohibitions:

```text
no canonical write
no self-accepting baseline
no automatic guide edit
no automatic canonical pull request
no candidate or discovery publication
no production deployment
```

Scheduled operation preserves read-only permissions and the existing no-write boundary.

## 14. Unknown-value governance

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These states are not structural placeholders and must not be overwritten merely to satisfy completeness or comparison presentation.

## 15. Statistics governance

`docs/stats-spec.md` is binding for PR #325-#328.

Statistics derive from reviewed canonical data and must not become live price, market-cap, APY, safety, transparency, or risk rankings.

## 16. Comparison and change-product governance

Phase F-I remains governed by `docs/comparison-and-change-product-spec.md` and active numbering amendments.

Binding boundaries:

- Phase F starts only after the reviewed 110-asset checkpoint;
- lifecycle, issuance/redemption, legal/regulatory state, and market access remain separate analytical layers;
- canonical Market Access Records remain distinct from monitoring observations and editorial research matrices;
- Compare derives from reviewed canonical data and preserves unresolved states;
- facet freshness derives from authoritative record families;
- Change Timeline is derived and does not replace source record families;
- public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds;
- safety scores, risk scores, best-asset rankings, and universal country availability claims are not approved.

## 17. Data preservation

UI, quality, taxonomy, monitoring, statistics, growth, editorial, release-material, comparison, market-access, timeline, and update-surface work must not silently reduce canonical coverage.

Before and after relevant changes, verify canonical asset, organization, relationship, event, evidence, reserve-context, known-unknown, regulatory-note, deployment, and route counts governed by the active baseline and audited checkpoint.
