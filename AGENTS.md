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
7. every queue, validator, audit, fixture, and baseline named by the work item

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

For statistics work, also read:

```text
docs/stats-spec.md
```

## Repository source of truth

Repository specifications outrank chat memory, handoff prose, external mock copies, issue discussion, and unmerged drafts. A decision becomes binding only when the relevant canonical repository document is updated and merged.

## Current workstream

The dedicated UI program is stopped. UI is maintenance-only.

The active workstream is the 100-record registry-wide audit defined by:

```text
docs/quality/non-ui-quality-program.md
docs/roadmap.md
```

Current position:

```text
Current main checkpoint: 51b3acd075dc1a661930574339e9128d718c7b75
Canonical stable assets: 100
Organizations: 94
Events: 172
Evidence: 501
Detail routes: 366
Growth D: complete
100-record production verification: recorded
Dedicated UI program: stopped after PR #295
UI mode: maintenance-only
Active: PR #297 identity uniqueness and lineage audit
Next: PR #298 organization and relationship integrity audit
```

## Active sequence

```text
PR #296       resume core workstream and synchronize authority — complete
PR #297-#304  100-record registry-wide audit — active
PR #305-#309  non-UI release hardening
PR #310-#313  monitoring expansion and scheduled read-only operation
PR #314-#317  statistics implementation
PR #318        next candidate audit
PR #319-#323  controlled growth from 100 to 110
```

Do not skip ahead unless `docs/roadmap.md` is deliberately amended.

## UI maintenance rules

There is no active redesign sequence.

A UI PR is allowed only for a concrete verified defect or an explicit owner-directed change. A maintenance PR must:

- remain narrow;
- preserve the current terminal visual family unless the owner explicitly changes direction;
- preserve canonical data, route meaning, machine-readable output, and accessibility contracts unless separately authorized;
- use actual rendered desktop/mobile evidence for visual or responsive claims;
- not displace the active core schedule.

No agent may:

- invent another visual direction;
- substitute or generate another logo;
- redesign a page from memory;
- revive rejected Modern Data Product, Editorial Ledger, or Modern Evidence Registry directions as active authority;
- implement mock-only data as canonical data;
- alter the core PR sequence without updating the roadmap and canonical plan.

Approved production assets:

```text
public/brand/sog-lockup-on-light.svg
public/brand/sog-lockup-on-dark.svg
public/brand/sog-mark-on-light.svg
public/brand/sog-mark-on-dark.svg
```

Stablecoin identity may use a reviewed local official logo when available; otherwise use the ticker fallback. Do not hotlink or generate imitation coin or organization logos.

## Data and quality rules

- Cite the exact queue, validator, audit, schema, fixture, and baseline used by each PR.
- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce month- or year-level evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Canonical record-group counts remain unchanged unless an explicit audited data PR authorizes a change.
- A rebrand, migration continuation, wrapped representation, deployment, or alias must not become a separate canonical asset without scope support and lineage review.

## Monitoring rules

- Monitoring output is candidate material only and must not write directly to canonical public data.
- Monitoring executions remain read-only and may not update their own accepted baseline.
- An unchanged normalized official source must not create a candidate.
- Metadata-only changes and fetch failures must not masquerade as content changes.
- Monitoring may not create branches, pull requests, publications, or deployments automatically.
- A baseline change requires a separate human-reviewed repository change.

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

## Mock-only and unsupported-data exclusions

Do not add mock-only live prices, market capitalization, circulating supply, holder counts, market charts, growth deltas, saved views, watchlists, accounts, follow buttons, unsupported badges, transparency or safety scores, invented reserve totals, invented evidence counts, invented timestamps, or unsupported legal claims.

Only canonical data, approved editorial copy, generated canonical counts, and separately approved sourced integrations may become public claims.

## Deployment rule

Development and production publication are connected by the `main` publication workflow described in `docs/deployment-policy.md`.

- GitHub CI success is the completion condition for normal pull-request development work.
- Monitoring execution remains publication-neutral and read-only.
- Do not claim production parity without the repository's production provenance and output-parity checks.
