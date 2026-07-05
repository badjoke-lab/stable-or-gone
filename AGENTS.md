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
7. every queue, validator, audit, fixture, baseline, and research checkpoint named by the work item

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

For EU/EEA stablecoin market-access research, article work, or monitoring changes, also read:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-2026-07-05.md
docs/audits/eu-stablecoin-market-access-research-checkpoint-02-2026-07-05.md
```

For statistics work, also read `docs/stats-spec.md`.

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts. A decision becomes binding only when the relevant canonical repository document is updated and merged.

## Current workstream

The dedicated UI program is stopped. UI is maintenance-only.

Current position:

```text
Current main checkpoint: afaffd6b200803a873208d0fc8718d2642b0b9c8
Canonical stable assets: 100
Organizations: 94
Relationships: 110
Events: 172
Evidence: 502
Public source identities: 456
Evidence relations: 502
Deployments: 140
Detail routes: 366
Dedicated UI program: stopped after PR #295
UI mode: maintenance-only
PR #302 lifecycle and relationship boundary audit: complete
PR #303 EU market-access specification and schedule amendment: complete
Active: PR #304 EU/EEA market-access research checkpoint and schedule synchronization
Next public implementation: PR #305 reviewed EU stablecoin market-access guide after publication gates pass
```

## Active sequence

```text
PR #296-#302  registry-wide audit through lifecycle boundaries — complete
PR #303       EU market-access specification and schedule amendment — complete
PR #304       research checkpoint and schedule synchronization — active
PR #305       reviewed EU stablecoin market-access guide after publication gate passes
PR #306-#307  remaining 100-record registry-wide audit
PR #308-#312  non-UI release hardening
PR #313-#316  monitoring expansion and scheduled read-only operation
PR #317-#320  statistics implementation
PR #321       next candidate audit
PR #322-#326  controlled growth from 100 to 110
```

Do not skip ahead unless `docs/roadmap.md` is deliberately amended.

The article is not automatically authorized merely because the ten-platform breadth floor is met. PR #305 begins only after the publication gate in the market-access specification passes.

## UI maintenance rules

There is no active redesign sequence. A UI PR is allowed only for a concrete verified defect or explicit owner-directed change.

A maintenance PR must remain narrow, preserve the current terminal family unless explicitly changed, preserve canonical data and route meaning unless separately authorized, use actual rendered desktop/mobile evidence for visual claims, and not displace the active core schedule.

Do not invent another visual direction, substitute a logo, revive rejected redesign directions, or alter the core PR sequence without updating repository authority.

## Data and quality rules

- Cite the exact queue, validator, audit, schema, fixture, baseline, and research checkpoint used by each PR.
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

## Lifecycle boundary rules

PR #302 completed the lifecycle-boundary audit. Future work must preserve distinct boundaries for:

```text
contract deployment
first mint
guarded beta
public launch
exchange listing
migration announcement
migration start
redemption deadline
wind-down start
terminal state
relationship end
rebrand transition
```

Do not infer one boundary from another unless reviewed evidence explicitly supports the equivalence.

## EU market-access rules

- Do not reduce EU/EEA stablecoin access to an allowed/banned boolean.
- Preserve platform, legal entity, region, stablecoin, function, announcement date, and effective date separately.
- Do not infer deposit, withdrawal, custody, trading, Earn, margin, or conversion state from another function.
- Do not rewrite EEA as EU when the source scope is EEA.
- Do not generalize a customer-cohort or legal-entity notice to every global user.
- Prefer regulators and official registers for regulatory claims.
- Prefer first-party platform policy pages for function-level access claims.
- High-quality reporting may establish context or a reported notice but may not fill unsupported function cells.
- A platform licence is not proof of stablecoin function availability.
- A Global product page is not proof of EU/EEA service scope.
- The public guide is a reviewed dated snapshot and never updates automatically from monitoring output.
- Keep `not_confirmed` when evidence does not support a function state.
- Distinguish historical platform stablecoin policy from later platform-wide service or licensing changes.

## Monitoring rules

- Monitoring output is candidate material only and must not write directly to canonical public data.
- Monitoring executions remain read-only and may not update their own accepted baseline.
- An unchanged normalized official source must not create a candidate.
- Metadata-only changes and fetch failures must not masquerade as content changes.
- Monitoring may not create branches, pull requests, publications, guide edits, or deployments automatically.
- A baseline change requires a separate human-reviewed repository change.
- Platform-policy monitoring must preserve function-level, legal-entity, and geographic scope.

## Statistics rules

- `docs/stats-spec.md` is binding.
- Statistics derive from canonical loader output at build time.
- Unknown categories remain visible.
- Multi-select dimensions are not presented as mutually exclusive.
- Asset counts and deployment counts remain distinct.
- Do not add live price, market-cap, yield, safety, transparency, or risk rankings.

## Growth rules

Growth beyond 100 begins only after the preceding audit, hardening, monitoring, statistics, and candidate-audit phases in `docs/roadmap.md`.

When growth resumes:

- no more than two new stable assets per PR;
- fresh branch from current main;
- reviewed candidates only;
- duplicate and lineage checks required;
- all applicable supporting record groups required;
- unknown information remains explicit.

## Deployment rule

Development and production publication are connected by the `main` publication workflow described in `docs/deployment-policy.md`.

- GitHub CI success is the completion condition for normal pull-request development work.
- Monitoring execution remains publication-neutral and read-only.
- Do not claim production parity without the repository's production provenance and output-parity checks.
