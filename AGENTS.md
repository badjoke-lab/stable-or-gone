# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Required reading order

Before changing code, data, workflows, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. the canonical plan for the active work item
6. the relevant data, monitoring, statistics, editorial, or UI-maintenance specification
7. every queue, validator, audit, fixture, baseline, publication-gate review, and research checkpoint named by the work item

For active core data work, also read:

```text
docs/quality/non-ui-quality-program.md
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/quality/registry-v2-v3-machine-readable-parity-spec.md
docs/migration/registry-v3-parity-baseline.json
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

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts. A decision becomes binding only when the relevant canonical repository document is updated and merged.

## Current workstream

The dedicated UI program is stopped. UI is maintenance-only.

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

## Active sequence

```text
PR #296-#302  registry-wide audit through lifecycle boundaries — complete
PR #303-#307  EU market-access specification, research, re-audit, and guide publication — complete
PR #308       known-unknown and placeholder integrity audit — complete
PR #309       monitoring coverage recalculation — complete
PR #310       Registry v2/v3 and machine-readable parity — active
PR #311-#314  remaining non-UI release hardening
PR #315-#318  monitoring expansion and scheduled read-only operation
PR #319-#322  statistics implementation
PR #323       next candidate audit
PR #324-#328  controlled growth from 100 to 110
```

Do not skip ahead unless `docs/roadmap.md` is deliberately amended.

## UI maintenance rules

There is no active redesign sequence. A UI PR is allowed only for a concrete verified defect or explicit owner-directed change. Preserve the current terminal visual family, canonical data, route meaning, machine-readable output, and accessibility contracts unless separately authorized.

## Data and quality rules

- Cite the exact queue, validator, audit, schema, fixture, baseline, publication-gate review, and research checkpoint used by each PR.
- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce partial-date evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Canonical record-group counts remain unchanged unless an explicit audited data PR authorizes a change.
- A rebrand, migration continuation, wrapped representation, deployment, or alias must not become a separate canonical asset without scope support and lineage review.
- Archive absence is a quality queue item, not permission to fabricate an archive URL.
- An undated reserve-context or index row must not be assigned a period-specific date without reviewed evidence.
- Do not collapse a historical redemption review state into `terminated` without verifying current contract or interface availability.
- A deployment identifier is not `verified` merely because a value is recorded; direct source confirmation is required.
- Missing freeze or blacklist capability data means unknown knowledge state, not `false`.
- Aggregate network-context rows must not be coerced into a single chain identity.

## Known-unknown and placeholder integrity rules

PR #308 established the current audited boundary.

Intentional unresolved semantics include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These values must not be erased merely to make records look complete. Structural fake values remain defects. Stale review age is a review queue, not permission to resolve or delete a known unknown.

## Lifecycle boundary rules

Preserve distinct boundaries for contract deployment, first mint, guarded beta, public launch, exchange listing, migration announcement, migration start, redemption deadline, wind-down start, terminal state, relationship end, and rebrand transition. Do not infer one boundary from another without direct evidence.

## Registry v2/v3 parity rules

PR #310 is governed by `docs/quality/registry-v2-v3-machine-readable-parity-spec.md`.

Fixed rules:

- Registry v3 remains additive and backward-compatible.
- Current parity is derived from the current composed Registry v2 baseline and active Registry v3 manifests/loaders, not from stale generated artifacts that happen to agree with one another.
- The 92-asset Registry v3 quality baseline is historical and must not be presented as the current 100-asset parity checkpoint.
- All 100 canonical assets require legal-profile and income-profile coverage; explicit `unknown` mechanics are valid where reviewed evidence does not resolve them.
- Reserve components remain optional and time-scoped; one reserve-component row per asset is not required.
- Stable-asset relationships remain applicability-based; universal relationship rows are not required.
- Every active V3 manifest file must be consumed by its runtime loader, and every loader data import must be represented by its active manifest.
- Do not rename the public machine-readable schema merely because additive V3 layers exist.
- The current public machine-readable contract remains V2-compatible with additive V3 internal layers unless a separate reviewed public-contract change is approved.
- Machine-readable data safety remains canonical-only and excludes unreviewed candidates, internal monitoring, and private notes.

## EU market-access rules

- Do not reduce EU/EEA stablecoin access to an allowed/banned boolean.
- Preserve issuer identity, token regulatory path, platform legal entity, platform service state, region, customer scope, stablecoin, function or access route, supported network, announcement date, and effective date separately.
- Do not infer deposit, withdrawal, custody, trading, Earn, margin, conversion, mint, redemption, or payment-rail state from another function.
- Do not rewrite EEA as EU when the source scope is EEA.
- Do not generalize a customer cohort, legal entity, member-state page, or Global product page beyond its supported scope.
- Prefer regulators and official registers for authorization claims.
- Prefer first-party platform policy pages for function-level access claims.
- High-quality reporting may establish context or a reported notice but may not fill unsupported function cells.
- A platform licence is not proof of stablecoin function availability.
- A platform-wide account closure or transition restriction is separate from asset-specific function policy.
- The public guide is a reviewed dated snapshot and never updates automatically from monitoring output.
- Keep unsupported evidence unclaimed rather than filling a false universal matrix.
- Distinguish historical stablecoin-specific policy from later platform-wide service or licensing changes.

Publication evidence layers remain:

```text
A. asset-specific function evidence
B. current platform-wide service-state evidence
C. general service/licensing context without asset-specific function support
```

## Monitoring coverage rules

PR #309 established the current monitoring-coverage boundary:

```text
registered sources: 24
registered asset reach: 16/100
accepted sources: 0
platform-policy coverage: 0
platform service-state coverage: 0
regulatory-register coverage: 0
EU/EEA function-level market-access coverage: 0
```

Fixed distinctions:

- Registered source reach is not accepted monitoring coverage.
- A pending baseline is not an accepted baseline.
- Issuer/protocol source reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- A generic product or issuer page is not function-level market-access monitoring.
- Zero market-access coverage is a valid audit conclusion and must not be filled by inference.

## Monitoring safety rules

- Monitoring output is candidate material only and must not write directly to canonical public data.
- Monitoring executions remain read-only and may not update their own accepted baseline.
- An unchanged normalized official source must not create a candidate.
- Metadata-only changes and fetch failures must not masquerade as content changes.
- Monitoring may not create branches, pull requests, publications, guide edits, or deployments automatically.
- A baseline change requires a separate human-reviewed repository change.
- Platform-policy monitoring must preserve function-level, legal-entity, service-state, geographic, customer-scope, payment-rail, and network context.

## Statistics rules

- `docs/stats-spec.md` is binding.
- Statistics derive from canonical loader output at build time.
- Unknown categories remain visible.
- Multi-select dimensions are not presented as mutually exclusive.
- Asset counts and deployment counts remain distinct.
- Do not add live price, market-cap, yield, safety, transparency, or risk rankings.

## Growth rules

Growth beyond 100 begins only after the preceding audit, hardening, monitoring, statistics, and candidate-audit phases in `docs/roadmap.md`. Growth PRs contain no more than two new stable assets, use a fresh branch from current `main`, preserve supporting record groups, and keep unknown information explicit.

## Deployment rule

Development and production publication are connected by the `main` publication workflow described in `docs/deployment-policy.md`. GitHub CI success is the completion condition for normal pull-request development work. Monitoring execution remains publication-neutral and read-only. Do not claim production parity without the repository's production provenance and output-parity checks.
