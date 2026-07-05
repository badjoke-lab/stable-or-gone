# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-05

## 1. Purpose

This file defines document authority, conflict resolution, and change control. SOG work must not depend on chat memory, an old handoff, or an unstated interpretation. Repository specifications are the source of truth.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for the current phase and next approved work.
4. The canonical specification or implementation plan for the active workstream.
5. Supporting audits, inventories, examples, and research checkpoints.
6. Conversation history, issue discussion, generated output, and unmerged drafts.

The active core program is governed by:

```text
docs/quality/non-ui-quality-program.md
docs/roadmap.md
```

Canonical data semantics are governed by:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
```

Monitoring semantics are governed by:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

EU/EEA market-access research, the dated guide, its research matrix, and the later platform/regulatory monitoring extension are governed by:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

Merged supporting research checkpoints are:

```text
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
docs/audits/eu-stablecoin-market-access-research-checkpoint-2026-07-05.md
docs/audits/eu-stablecoin-market-access-research-checkpoint-02-2026-07-05.md
```

Checkpoint 03 artifacts become supporting research authority only after their reviewed PR merges.

UI is maintenance-only. The current production visual direction is the restored terminal family implemented through PR #288-#295. Historical UI plans and rejected visual directions are implementation history, not authority for new redesign work.

## 3. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. Read `AGENTS.md`.
2. Read this file.
3. Read `docs/roadmap.md`.
4. Read `docs/deployment-policy.md`.
5. Read the canonical plan for the active work item.
6. Read the relevant data, monitoring, statistics, editorial, or maintenance specification.
7. Read each queue, validator, audit, fixture, baseline, and research checkpoint named by the active work item.

A pull request is not ready for review until the exact specification sections and roadmap item it implements are identified.

## 4. Source-of-truth rule

A decision becomes binding only when it is written into the relevant canonical repository document and merged. Chat answers, issue comments, generated reports, research findings, and unmerged branches do not change the approved specification by themselves.

If implementation and specification disagree, implementation is defective unless the specification is deliberately updated through review.

Supporting research may record a fact, unresolved state, or source gap. It does not authorize publication until the applicable publication gate passes.

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
- statistics denominator or grouping semantics;
- monitoring observation or baseline semantics;
- market-access research fields or publication gates;
- production publication gates;
- the approved PR sequence;
- the active workstream or its pause/resumption state;
- visual direction, logo, navigation hierarchy, register composition, dossier hierarchy, or page-family composition.

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

Do not rewrite completed history to make a changed plan appear unchanged. Record deviations, consumed PR numbers, research-only checkpoints, superseded visual directions, and stale branches explicitly.

Current execution state:

```text
100 canonical stable assets reached
100-record production verification recorded
dedicated UI program stopped after PR #295
UI maintenance-only
PR #302 lifecycle and relationship boundary audit complete
PR #303 EU market-access specification and schedule amendment complete
PR #304 reviewed market-access matrix and checkpoints 01-02 complete
PR #305 checkpoint 03 schedule amendment active
PR #306 function-matrix checkpoint 03 next
PR #307 market-access guide blocked until publication gates pass
remaining core audit resumes at PR #308
```

The additional schedule amendment is justified because new source review produced material current-state findings that must be recorded before publication, including platform-wide service changes that cannot be safely folded into earlier historical policy rows.

Urgent factual corrections, verified public breakage, owner-directed dated editorial work, or security fixes may interrupt the sequence through a narrow PR. When that happens, the roadmap must be updated before the planned sequence resumes.

## 8. Specification status labels

Use one of:

```text
canonical specification
canonical governance specification
canonical implementation plan — active
canonical execution schedule — active
canonical implementation schedule — paused
supporting audit
historical plan — superseded
historical reference set — superseded
working draft — not approved
```

A superseded document must point to its replacement and must not remain in an active required-reading list except where explicitly identified as historical context.

## 9. UI maintenance governance

There is no active redesign sequence.

A UI maintenance PR must:

- start from a concrete observed defect;
- preserve the terminal visual family unless an explicit owner decision changes direction;
- preserve canonical data, route meaning, machine-readable output, and accessibility contracts unless separately authorized;
- use actual rendered desktop/mobile evidence when the defect is visual or responsive;
- remain narrow enough not to displace the active core roadmap.

No agent may invent a new visual direction, substitute a new logo, or revive a rejected redesign program without a roadmap and specification amendment.

Approved production brand assets remain:

```text
public/brand/sog-lockup-on-light.svg
public/brand/sog-lockup-on-dark.svg
public/brand/sog-mark-on-light.svg
public/brand/sog-mark-on-dark.svg
```

Stablecoin identity may use a reviewed local official logo when available; otherwise use the ticker fallback. Do not hotlink or generate imitation coin or organization logos.

## 10. Data-preservation rule

UI, quality, taxonomy, monitoring, statistics, growth, editorial, and migration work must not silently reduce canonical coverage. Before and after a relevant change, verify at minimum:

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

Editorial research files remain outside canonical registry counts and must not masquerade as canonical records.

## 11. Growth governance

The registry has reached the audited-growth target of 100 canonical stable assets. Further growth is not automatic.

The next controlled growth phase begins only after:

```text
remaining 100-record registry-wide audit
non-UI release hardening
monitoring expansion
statistics implementation
next candidate audit
```

Then growth may proceed from 100 to 110 under the roadmap:

- no more than two new stable assets per growth PR;
- reviewed candidates only;
- full duplicate and lineage checks;
- all applicable supporting record groups;
- explicit unknown preservation;
- current-main branch base;
- roadmap authorization.

## 12. Monitoring baseline governance

An accepted monitoring baseline is a repository-reviewed comparison point, not canonical evidence of a stablecoin fact.

Monitoring execution remains read-only. It may observe sources, compare against accepted baselines, classify changes, and produce private review material. It may not:

- update its own accepted baseline;
- write canonical data;
- edit editorial guides automatically;
- create branches or pull requests automatically;
- publish candidate findings;
- deploy.

A baseline change requires a separate human-reviewed repository change.

EU/EEA market-access monitoring inherits the same rule. Platform-policy and regulatory-register observations may create private review candidates only. A source change must not update the public market-access guide or its research matrix automatically.

## 13. Market-access publication governance

The market-access article is a reviewed dated editorial snapshot, not a live dashboard.

Publication requires the gate in `docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md` to pass. In particular:

- platform breadth alone is insufficient;
- asset breadth alone is insufficient;
- a platform licence is not proof of stablecoin function availability;
- a Global product page is not proof of EU/EEA scope;
- a member-state page is not automatically an EEA-wide statement;
- high-quality reporting may establish context but may not populate unsupported function fields;
- EU, EEA, member-state, legal-entity, and customer-cohort scopes remain separate;
- historical policy must be separated from later service-state changes;
- current service context must be rechecked at publication time.

## 14. Statistics governance

Statistics derive from reviewed canonical loaders at build time. A statistics page or machine-readable statistics output must not:

- manually maintain counts that can diverge from canonical loaders;
- silently discard unknown categories;
- present multi-select dimensions as mutually exclusive;
- confuse asset count with deployment count;
- become a live price, market-cap, yield, safety, or risk ranking.

`docs/stats-spec.md` is the binding statistics implementation specification.
