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
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
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
Active: PR #322 reserve and redemption source expansion
Next: PR #323 lifecycle, regulatory, and EU market-access source/schema expansion
```

Approved remaining sequence:

```text
PR #322-#324  monitoring expansion and scheduled read-only operation
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

Later source expansion must not overwrite these historical counts or digests.

## PR #322 reserve/redemption expansion rules

Binding files:

```text
docs/quality/monitoring-reserve-redemption-source-expansion-spec.md
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
scripts/validate-monitoring-reserve-redemption-expansion-100-assets.mjs
.github/workflows/monitoring-reserve-redemption-expansion.yml
```

Current reviewed monitoring boundary:

```text
100 assets
94 organizations
110 relationships
30 sources
30 baseline rows
30 pending_initial_acceptance
0 accepted
0 missing
22 assets with registered source reach
78 uncovered assets
18 organizations reached
0 accepted asset reach
11 multi-family assets
```

PR #322 adds exactly six first-party source rows and six pending baseline rows:

```text
trueusd-transparency
angle-eura-overview
sgforge-eurcv-coinvertible
eurite-euri-overview
quantoz-eurq-usdq
vnx-vchf-overview
```

Scope rules:

- new PR #322 rows may use only `reserve_update`, `assurance_update`, and `issuance_redemption_update`;
- all six baselines remain pending;
- accepted-only fields remain null;
- reserve/assurance source count is 14 and asset reach is 16;
- redemption-terms source count is 11 and asset reach is 12;
- lifecycle source count remains 5 and asset reach remains 5;
- regulatory source count remains 5 and asset reach remains 5;
- source/baseline ID parity must be exact;
- synchronization generator is offline and performs no canonical action;
- monitoring remains private, review-only, and read-only.

PR #322 may not accept baselines, add lifecycle/regulatory/access sources, change normalization version, schedule monitoring, write canonical data, edit guides automatically, create automatic canonical PRs, publish candidates, or deploy.

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
- Monitoring output is private candidate material only.
- Monitoring may not write canonical data, accept its own baselines, create branches or canonical PRs automatically, edit guides automatically, publish candidates, or deploy.
- PR #323 handles lifecycle, regulatory, platform/access, and schema expansion.
- PR #324 handles bounded scheduled read-only operation.

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

Normal merged changes publish from `main` under `docs/deployment-policy.md`. Monitoring source expansion remains internal and does not authorize monitoring artifact publication, canonical writes, guide edits, or automatic pull requests.
