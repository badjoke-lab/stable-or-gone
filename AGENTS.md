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
docs/migration/registry-v3-baseline.json
```

For monitoring work, also read:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
```

For EU/EEA stablecoin market-access work, also read:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
data/editorial-research/eu-stablecoin-market-access-function-batch-03.json
data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-2026-07-05.md
docs/audits/eu-stablecoin-market-access-research-checkpoint-02-2026-07-05.md
docs/audits/eu-stablecoin-market-access-research-checkpoint-03-2026-07-05.md
docs/audits/eu-stablecoin-market-access-publication-gate-review-2026-07-05.md
docs/audits/eu-stablecoin-market-access-prepublication-reaudit-2026-07-05.md
```

For statistics work, also read `docs/stats-spec.md`.

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts. A decision becomes binding only when the relevant canonical repository document is updated and merged.

## Current workstream

The dedicated UI program is stopped. UI is maintenance-only.

```text
Current main checkpoint: 4d7b12936b5ca8497219c09392e743947c1109b9
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366
PR #302 lifecycle and relationship boundary audit: complete
PR #303 EU market-access specification and schedule amendment: complete
PR #304 reviewed research matrix and checkpoints 01-02: complete
PR #305 checkpoint 03 schedule amendment: complete
PR #306 function-matrix research checkpoint 03: complete
PR #307 reviewed EU/EEA market-access guide: complete and published
Active: PR #308 known-unknown and placeholder integrity audit
Next: PR #309 monitoring coverage recalculation for 100 assets
```

## Active sequence

```text
PR #296-#302  registry-wide audit through lifecycle boundaries — complete
PR #303-#307  EU market-access specification, research, re-audit, and guide publication — complete
PR #308       known-unknown and placeholder integrity audit — active
PR #309       monitoring coverage recalculation — next
PR #310-#314  non-UI release hardening
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

PR #308 must preserve the distinction between an explicit unknown state and a structural placeholder.

Intentional unresolved semantics include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These values must not be erased merely to make records look complete. A known-unknown row must have a unique ID, a canonical asset reference, a valid issuer reference when present, a specific topic, a meaningful description, a valid severity, and a non-future review date.

Structural fake values are defects, including TODO/TBD identity fields, fake example URLs, fabricated dates, and placeholder addresses/contracts/identifiers. Stale review age is a review queue, not permission to resolve or delete a known unknown.

## Lifecycle boundary rules

Preserve distinct boundaries for contract deployment, first mint, guarded beta, public launch, exchange listing, migration announcement, migration start, redemption deadline, wind-down start, terminal state, relationship end, and rebrand transition. Do not infer one boundary from another without direct evidence.

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

## Monitoring rules

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
