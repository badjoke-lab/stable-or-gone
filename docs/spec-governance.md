# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-06-26

## 1. Purpose

This file defines which repository documents are authoritative, how conflicts are resolved, and how future work must prove that it follows the approved specification.

SOG work must not depend on chat memory, an old handoff, or an unstated interpretation. Repository specifications are the source of truth.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for production publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for the current phase, current position, and next approved work item.
4. The canonical specification for the active workstream.
5. Supporting audits, inventories, examples, and handoff documents.
6. Conversation history, issue discussion, and unmerged drafts.

For the UI and public-information repair workstream, the canonical workstream documents are:

```text
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
```

For data semantics, the canonical documents remain:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
```

The UI redesign specification may define public labels, grouping, display hierarchy, and migration gates. It must not silently redefine canonical record meaning. If a UI requirement needs a canonical schema change, the relevant data specification must be updated in the same pull request before implementation.

## 3. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. Read `AGENTS.md`.
2. Read `docs/spec-governance.md`.
3. Read `docs/roadmap.md`.
4. Read `docs/deployment-policy.md`.
5. Read the canonical specification and implementation plan for the active work item.
6. Read any audit or baseline named by that work item.

A pull request is not ready for review until the author can identify the exact specification sections it implements.

## 4. Source-of-truth rule

A decision becomes binding only when it is written into the relevant canonical repository document and merged.

The following do not change the approved specification by themselves:

- a chat answer;
- a temporary issue comment;
- an unmerged branch;
- a mock image;
- a code implementation that contradicts the written specification;
- an old handoff document;
- a generated report.

If implementation and specification disagree, implementation is treated as defective unless the specification is updated through review.

## 5. Change-control rule

A change to any of the following requires a specification update in the same pull request or in an earlier dependency pull request:

- canonical enum meaning;
- public status grouping;
- primary-relationship selection;
- evidence interpretation;
- unknown or missing-value semantics;
- route families or canonical URLs;
- page information hierarchy;
- mobile information suppression;
- machine-readable output shape;
- production publication gates;
- the approved pull-request sequence.

No implementation pull request may introduce an undocumented alternative.

## 6. Pull-request traceability

Every non-trivial pull request must include these fields in its body:

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

A pull request that cannot cite the approved work item must be paused until the roadmap or specification is corrected.

## 7. Roadmap discipline

`docs/roadmap.md` is the canonical execution schedule.

Update it when:

- the current phase changes;
- a planned PR is merged, split, combined, blocked, or reordered;
- canonical counts change;
- a production checkpoint succeeds or fails;
- a new blocker changes the next approved work item.

Do not rewrite completed history to make the current plan appear unchanged. Record deviations explicitly.

## 8. Specification status labels

Use one of these labels at the top of specification documents:

```text
canonical specification
canonical implementation plan
supporting audit
historical plan — superseded
working draft — not approved
```

A superseded document must point to its replacement and must not remain in a required reading list.

## 9. Mock and design authority

A visual mock is evidence of an approved visual direction, not an independent specification.

Every approved mock must map visible elements to:

- canonical fields;
- public labels;
- value-state rules;
- responsive behavior;
- accessibility behavior.

If a mock conflicts with `docs/ui-redesign/master-spec.md`, the mock is invalid until the specification is deliberately changed.

## 10. Data-preservation rule

A UI, taxonomy, or migration change must not silently reduce canonical coverage.

Before and after each migration, verify at minimum:

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

Intentional removals require a record-by-record audit and explicit approval.

## 11. Conflict-resolution procedure

When a conflict is found:

1. Stop implementation of the conflicting area.
2. Identify the authoritative document under Section 2.
3. Record the conflict in the active PR or audit.
4. Update the correct canonical specification.
5. Update the roadmap if sequence or scope changes.
6. Resume implementation only after the documentation change is merged.

## 12. Current binding workstream

As of 2026-06-26, the binding workstream is the 100-record UI and public-information repair program.

Canonical documents:

```text
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

Growth beyond the current 92 canonical assets is paused until the documentation-reset and repair gates in those files permit it.
