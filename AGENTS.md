# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. the canonical plan for the active work item
6. the relevant data, monitoring, statistics, comparison, change-research, editorial, or UI-maintenance specification
7. every queue, validator, audit, fixture, baseline, publication-gate review, and research checkpoint named by the work item

For active core data work, also read:

```text
docs/quality/non-ui-quality-program.md
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/migration/registry-v3-baseline.json
```

For monitoring work, also read:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
scripts/monitoring/audits/build-coverage-report.mjs
scripts/validate-current-coverage.mjs
```

For EU/EEA stablecoin market-access work, also read:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
data/editorial-research/eu-stablecoin-market-access-function-batch-03.json
data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json
docs/audits/eu-stablecoin-market-access-publication-gate-review-2026-07-05.md
docs/audits/eu-stablecoin-market-access-prepublication-reaudit-2026-07-05.md
```

For statistics work, also read `docs/stats-spec.md`.

For Phase F-I work after the reviewed 110-asset checkpoint, also read:

```text
docs/comparison-and-change-product-spec.md
```

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts. A decision becomes binding only when the relevant canonical repository document is updated and merged.

## Current workstream

The dedicated UI program is stopped. UI is maintenance-only until the roadmap reaches an approved product UI phase or is deliberately amended.

```text
Current main checkpoint: 020957942615af875afef391c57f31cc8dd1abc2
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366
PR #307 reviewed EU/EEA market-access guide: complete and published
PR #308 known-unknown and placeholder integrity audit: complete
PR #309 monitoring coverage recalculation: complete
Active: PR #310 Registry v2/v3 and machine-readable parity
Next: PR #311 counts, manifest, version, and provenance integrity
```

## Approved sequence

```text
PR #296-#302  registry-wide audit through lifecycle boundaries — complete
PR #303-#307  EU market-access research and guide publication — complete
PR #308       known-unknown and placeholder integrity audit — complete
PR #309       monitoring coverage recalculation — complete
PR #310-#314  non-UI release hardening — active
PR #315-#318  monitoring expansion and scheduled read-only operation
PR #319-#322  statistics implementation
PR #323       next candidate audit
PR #324-#328  controlled growth from 100 to 110
PR #329-#333  Comparison Foundation
PR #334-#336  Compare
PR #337-#340  Change Research Tools
PR #341-#342  Reviewed Public Update Layer
PR #343+      optional natural-language filter translation after separate approval
```

Do not skip ahead unless `docs/roadmap.md` is deliberately amended. PR #310-#328 remains unchanged. The post-110 sequence activates only after the reviewed 110-asset checkpoint and is governed by `docs/comparison-and-change-product-spec.md`.

## Core data rules

- Cite the exact queue, validator, audit, schema, fixture, baseline, publication-gate review, and research checkpoint used by each PR.
- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce partial-date evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Canonical record-group counts remain unchanged unless an explicit audited data PR authorizes a change.
- A rebrand, migration continuation, wrapped representation, deployment, or alias must not become a separate canonical asset without scope support and lineage review.
- Archive absence is a quality queue item, not permission to fabricate an archive URL.
- A deployment identifier is not verified merely because a value is recorded; direct source confirmation is required.
- Missing freeze or blacklist capability data means unknown knowledge state, not `false`.

## Protected unresolved states

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These states must not be erased merely to make records or comparison tables look complete. Structural fake values remain defects. A missing comparison value must not be converted into `false`, `no`, `available`, or `unavailable` merely to fill a cell.

## Lifecycle boundary rules

Preserve distinct boundaries for contract deployment, first mint, guarded beta, public launch, exchange listing, migration announcement, migration start, redemption deadline, wind-down start, terminal state, relationship end, and rebrand transition. Do not infer one boundary from another without direct evidence.

## Market-access rules

- Do not reduce access to an allowed/banned boolean.
- Preserve issuer identity, token regulatory path, platform legal entity, platform service state, region, customer scope, stablecoin, function or access route, supported network, announcement date, and effective date separately.
- Do not infer one function state from another function.
- Do not generalize a customer cohort, legal entity, member-state page, or global product page beyond its supported scope.
- Prefer regulators and official registers for authorization claims.
- Prefer first-party platform policy pages for function-level access claims.
- A platform licence is not proof of stablecoin function availability.
- The public guide is a reviewed dated snapshot and never updates automatically from monitoring output.
- Monitoring observations and editorial research matrices are not canonical market-access records.

## Monitoring rules

- Registered source reach is not accepted monitoring coverage.
- A pending baseline is not an accepted baseline.
- Issuer/protocol source reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- A generic product or issuer page is not function-level market-access monitoring.
- Monitoring output is candidate material only and must not write directly to canonical public data.
- Monitoring executions remain read-only and may not update their own accepted baseline.
- Monitoring may not create branches, pull requests, publications, guide edits, or deployments automatically.
- Source expansion and schema expansion remain PR #315-#317 work.
- Scheduled read-only operation remains PR #318 work.

## Statistics rules

- `docs/stats-spec.md` is binding for PR #319-#322.
- Statistics derive from canonical loader output at build time.
- Unknown categories remain visible.
- Multi-select dimensions are not presented as mutually exclusive.
- Asset counts and deployment counts remain distinct.
- Do not add live price, market-cap, yield, safety, transparency, or risk rankings.

## Comparison and change-product rules

For Phase F-I, `docs/comparison-and-change-product-spec.md` is binding.

- Preserve separate analytical layers for lifecycle, issuance/redemption, legal/regulatory state, and market access.
- Do not rebuild lifecycle or redemption semantics merely for comparison UI convenience.
- Legal and regulatory claims remain jurisdiction-scoped and evidence-backed.
- Canonical market-access records remain separate from monitoring observations and editorial matrices.
- Comparison projections derive from reviewed canonical data only.
- Compare must expose unknown and not-applicable states rather than filling them by inference.
- Facet freshness derives from authoritative record families; do not duplicate display-only timestamps into root asset records.
- Access and regulation may share an exploration surface but retain separate canonical record families.
- Change Timeline is a derived projection and must not replace source record families with a lossy generic event model.
- Public update surfaces derive from reviewed merged canonical changes, not raw monitoring candidates.
- Do not introduce safety scores, risk scores, best-asset rankings, or universal country availability maps.

## Growth rules

Growth beyond 100 begins only after the preceding audit, hardening, monitoring, statistics, and candidate-audit phases in `docs/roadmap.md`. Growth PRs contain no more than two new stable assets, use a fresh branch from current `main`, preserve supporting record groups, and keep unknown information explicit.

## Deployment rule

Development and production publication are connected by the `main` publication workflow described in `docs/deployment-policy.md`. GitHub CI success is the completion condition for normal pull-request development work. Monitoring execution remains publication-neutral and read-only. Do not claim production parity without the repository's production provenance and output-parity checks.
