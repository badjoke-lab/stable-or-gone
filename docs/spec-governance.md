# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-06-29

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

The active workstream plan is:

```text
docs/quality/non-ui-quality-program.md
```

The paused UI workstream remains governed by:

```text
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/architecture/approved-modern-data-product-ui-v2.md
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
6. Read the relevant data, monitoring, or UI specification.
7. Read each queue, validator, audit, fixture, and baseline named by the active work item.

A pull request is not ready for review until the exact specification sections it implements are identified.

## 4. Source-of-truth rule

A decision becomes binding only when it is written into the relevant canonical repository document and merged. Chat answers, issue comments, unmerged branches, mocks, generated reports, and old handoffs do not change the approved specification by themselves.

If implementation and specification disagree, implementation is treated as defective unless the specification is deliberately updated through review.

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
- the active workstream or its pause/resumption state.

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

Do not rewrite completed history to make a changed plan appear unchanged. Record deviations and pauses explicitly.

PR #233 authorizes the bounded continuation through PR #263 while visual review is unavailable. Later changes to that sequence require another deliberate roadmap amendment.

## 8. Specification status labels

Use one of:

```text
canonical specification
canonical implementation plan
canonical implementation schedule — paused
supporting audit
historical plan — superseded
working draft — not approved
```

A superseded document must point to its replacement and must not remain in a required reading list.

## 9. Mock and design authority

A visual mock is evidence of an approved direction, not an independent specification. It must map visible elements to canonical fields, public labels, value states, responsive behavior, and accessibility behavior.

The paused UI program does not permit broad visual changes without renewed owner review.

## 10. Data-preservation rule

UI, quality, taxonomy, monitoring, growth, and migration work must not silently reduce canonical coverage. Before and after a relevant change, verify at minimum:

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

Growth PRs are allowed only under the reviewed PR #246-#250 sequence. Each growth PR is limited to two stable assets and must preserve or explicitly extend every applicable record group.

## 11. Monitoring baseline governance

An accepted monitoring baseline is a repository-reviewed comparison point, not canonical evidence of a stablecoin fact.

- Monitoring executions remain read-only.
- A live observation may compare against a baseline but may not replace it.
- Baseline changes require a separate human-reviewed repository change.
- An unchanged normalized source must not create candidate material.
- A content change remains an unconfirmed review prompt until separately evidenced and approved.
- Metadata-only changes, fetch failures, and new sources require distinct states.
- Monitoring output must not write canonical or public data automatically.

## 12. Conflict-resolution procedure

1. Stop implementation of the conflicting area.
2. Identify the authoritative document.
3. Record the conflict in the active PR or audit.
4. Update the correct canonical specification.
5. Update the roadmap if sequence or scope changes.
6. Resume only after the documentation change is merged.

## 13. Current binding workstream

As of 2026-06-29, the binding workstream is the non-UI continuation program for material-change monitoring, source-coverage expansion, reviewed growth from 92 to 100, registry-wide audit, and non-UI release preparation.

Canonical documents:

```text
docs/quality/non-ui-quality-program.md
docs/roadmap.md
docs/spec-governance.md
```

The UI program remains paused after PR #216 and Gate V2-F remains pending. PR #263 does not authorize publication. Production publication remains deferred until owner-led visual review, Gate V2-F approval, an explicit publication checkpoint, manual deployment, and public-parity verification.