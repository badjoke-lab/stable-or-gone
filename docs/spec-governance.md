# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-01

## 1. Purpose

This file defines document authority, conflict resolution, and change control. SOG work must not depend on chat memory, an old handoff, or an unstated interpretation. Repository specifications are the source of truth.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for the current phase and next approved work.
4. The canonical specification or implementation plan for the active workstream.
5. Supporting audits, inventories, examples, and handoff documents.
6. Conversation history, issue discussion, and unmerged drafts.

The active UI workstream is governed by:

```text
docs/ui-redesign/master-spec.md
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/approved-mocks-v3/README.md
docs/ui-redesign/implementation-plan.md
```

The former UI v2 visual contract and mock set are historical and superseded:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/
```

They may be consulted only for implementation history and compatible data, route, accessibility, and logo behavior. They do not authorize current visual work.

The paused non-UI continuation is documented by:

```text
docs/quality/non-ui-quality-program.md
```

Canonical data semantics remain governed by:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
```

Monitoring semantics remain governed by:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
```

A UI or quality plan may define workflow, public labels, grouping, and review gates. It must not silently redefine canonical record meaning.

## 3. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. Read `AGENTS.md`.
2. Read this file.
3. Read `docs/roadmap.md`.
4. Read `docs/deployment-policy.md`.
5. Read the canonical plan for the active work item.
6. Read the relevant data, monitoring, editorial, or UI specification.
7. Read each queue, validator, audit, fixture, and baseline named by the active work item.

A pull request is not ready for review until the exact specification sections it implements are identified.

## 4. Source-of-truth rule

A decision becomes binding only when it is written into the relevant canonical repository document and merged. Chat answers, issue comments, unmerged branches, generated reports, and old handoffs do not change the approved specification by themselves.

A mock is not independently authoritative. It must be interpreted through the current canonical visual contract.

If implementation and specification disagree, implementation is defective unless the specification is deliberately updated through review.

## 5. Change-control rule

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- canonical enum meaning;
- public status grouping;
- primary-relationship selection;
- evidence interpretation;
- unknown or missing-value semantics;
- route families or canonical URLs;
- page information hierarchy;
- mobile information suppression;
- machine-readable output shape;
- monitoring observation or baseline semantics;
- production publication gates;
- the approved PR sequence;
- the active workstream or its pause/resumption state;
- visual direction, background family, logo, navigation hierarchy, register composition, dossier hierarchy, or page-family composition.

No implementation PR may introduce an undocumented alternative.

## 6. Pull-request traceability

Every non-trivial PR body must include:

```text
Specification references:
- file and section

Roadmap item:
- phase and PR number

Scope:
- what changes
- what explicitly does not change

Data preservation:
- record groups and counts checked

Validation:
- commands and checks run

Deployment classification:
- one value from docs/deployment-policy.md
```

A PR that cannot cite an approved work item must pause until the roadmap or specification is corrected.

## 7. Roadmap discipline

`docs/roadmap.md` is the canonical execution schedule. Update it when a phase changes, a PR is merged or reordered, counts change, a publication checkpoint changes, or a blocker changes the next work item.

Do not rewrite completed history to make a changed plan appear unchanged. Record deviations, consumed PR numbers, pauses, superseded visual directions, and stale branches explicitly.

As of 2026-07-01:

```text
PR #260 is the latest completed work.
PR #261 aligns the repository to UI v3.
PR #262-#272 are reserved for the Editorial Ledger remediation sequence.
PR #251 is a stale Growth D draft and must not be merged as-is.
Growth D, the 100-record audit, and non-UI release preparation are paused through PR #272.
```

Urgent factual corrections or verified public breakage may consume an intervening PR number. When that occurs, the roadmap must be renumbered before implementation resumes.

## 8. Specification status labels

Use one of:

```text
canonical specification
canonical implementation plan
canonical implementation schedule — active
canonical implementation schedule — paused
supporting audit
historical plan — superseded
historical reference set — superseded
working draft — not approved
```

A superseded document must point to its replacement and must not remain in an active required-reading list except where explicitly identified as historical context.

## 9. Mock and design authority

The binding visual authority is:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
```

The active reference description is:

```text
docs/ui-redesign/approved-mocks-v3/README.md
```

The approved direction is Editorial Ledger: paper-like light background, dark ink, restrained dark-red accent, thin rules, existing S/G logo, and page-specific register, dossier, record, and article families.

The following are prohibited without a later approved specification:

- new or replacement logo;
- dashboard sidebar;
- oversized marketing hero;
- KPI-card row;
- blue-purple glow;
- repeated rounded-card grid as the default composition;
- another visual direction invented from memory.

## 10. Data-preservation rule

UI, quality, taxonomy, monitoring, growth, editorial, and migration work must not silently reduce canonical coverage. Before and after a relevant change, verify at minimum:

```text
stable assets
organizations
relationships
classifications
reserve/redemption profiles
events
event details
evidence
evidence relations
reserve reports/context
known unknowns
regulatory notes
deployments
legal profiles
stable-asset relationships
reserve components
income profiles
```

Unknown values remain unknown unless evidence supports a canonical value. Intentional removals require record-by-record audit and explicit approval.

UI v3 work changes presentation and information hierarchy only unless a PR explicitly states a separately approved data correction.

## 11. Growth governance

Canonical stable assets remain at 98 during the UI v3 sequence.

The old Growth D PR #251 is not the active plan and must not be merged as-is. After PR #272, Growth D must be rebuilt from the latest main with:

- reviewed candidates only;
- no more than two new stable assets;
- full duplicate and lineage checks;
- all applicable supporting record groups;
- explicit unknown preservation;
- updated roadmap authorization.

## 12. Monitoring baseline governance

An accepted monitoring baseline is a repository-reviewed comparison point, not canonical evidence of a stablecoin fact.

- Monitoring executions remain read-only.
- A live observation may compare against a baseline but may not replace it.
- Baseline changes require a separate human-reviewed repository change.
- An unchanged normalized source must not create candidate material.
- A content change remains an unconfirmed review prompt until separately evidenced and approved.
- Metadata-only changes, fetch failures, and new sources require distinct states.
- Monitoring output must not write canonical or public data automatically.

## 13. Conflict-resolution procedure

1. Stop implementation of the conflicting area.
2. Identify the authoritative document.
3. Record the conflict in the active PR or audit.
4. Update the correct canonical specification.
5. Update the roadmap if sequence or scope changes.
6. Resume only after the documentation change is merged.

## 14. Current binding workstream

As of 2026-07-01, the binding workstream is the Editorial Ledger UI v3 remediation.

Canonical documents:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/approved-mocks-v3/README.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
docs/spec-governance.md
```

The active sequence starts with documentation alignment in PR #261 and proceeds through shared shell, page families, mobile hardening, representative visual audit, cleanup, and production verification through PR #272.

Ordinary merged changes publish automatically from `main` under `docs/deployment-policy.md`. UI quality and owner approval remain separate gates; production success may be claimed only after the intended deployed commit and public parity are verified.
