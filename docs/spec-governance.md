# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-06

## 1. Purpose

This file defines document authority, conflict resolution, and change control. SOG work must not depend on chat memory, an old handoff, or an unstated interpretation. Repository specifications are the source of truth.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for the current phase and next approved work.
4. The canonical specification or implementation plan for the active workstream.
5. Supporting audits, inventories, examples, publication-gate reviews, and research checkpoints.
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

Post-110 comparison, market-access canonicalization, change research tools, and reviewed update surfaces are governed by:

```text
docs/comparison-and-change-product-spec.md
```

Monitoring semantics are governed by:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

EU/EEA market-access research, the dated guide, its research matrix, and platform/regulatory monitoring extension are governed by:

```text
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

Supporting market-access review files include:

```text
data/editorial-research/eu-stablecoin-market-access.json
data/editorial-research/eu-stablecoin-market-access-context-batch-02.json
data/editorial-research/eu-stablecoin-market-access-function-batch-03.json
data/editorial-research/eu-stablecoin-market-access-reaudit-batch-04.json
docs/audits/eu-stablecoin-market-access-publication-gate-review-2026-07-05.md
docs/audits/eu-stablecoin-market-access-prepublication-reaudit-2026-07-05.md
```

UI is maintenance-only until the roadmap reaches an approved product UI phase. Historical UI plans and rejected visual directions are implementation history, not authority for new redesign work.

## 3. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. Read `AGENTS.md`.
2. Read this file.
3. Read `docs/roadmap.md`.
4. Read `docs/deployment-policy.md`.
5. Read the canonical plan for the active work item.
6. Read the relevant data, monitoring, statistics, comparison, change-research, editorial, or maintenance specification.
7. Read each queue, validator, audit, fixture, baseline, publication-gate review, and research checkpoint named by the active work item.

A pull request is not ready for review until the exact specification sections and roadmap item it implements are identified.

For any Phase F-I work, `docs/comparison-and-change-product-spec.md` is mandatory reading.

## 4. Source-of-truth rule

A decision becomes binding only when it is written into the relevant canonical repository document and merged. Chat answers, issue comments, generated reports, research findings, and unmerged branches do not change the approved specification by themselves.

If implementation and specification disagree, implementation is defective unless the specification is deliberately updated through review.

Supporting research may record a fact, unresolved state, or source gap. It does not authorize publication until the applicable review or publication gate passes.

Monitoring observations and editorial research matrices are not canonical market-access records. Canonical market-access publication requires the reviewed record family and governance approved under the post-110 product specification.

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
- comparison projection shape or comparison semantics;
- facet-freshness derivation semantics;
- monitoring observation, coverage, source-family, or baseline semantics;
- market-access research fields or publication gates;
- canonical market-access record semantics;
- Access & Regulation Explorer indexing semantics;
- Change Timeline projection semantics;
- reviewed public update derivation semantics;
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

Do not rewrite completed history to make a changed plan appear unchanged. Record deviations, consumed PR numbers, research-only checkpoints, publication-gate reviews, superseded visual directions, and stale branches explicitly.

Current execution state:

```text
100 canonical stable assets reached
100-record production verification recorded
dedicated UI program stopped after PR #295
UI maintenance-only until an approved product UI phase
PR #302 lifecycle and relationship boundary audit complete
PR #303 EU market-access specification and schedule amendment complete
PR #304 reviewed market-access matrix and checkpoints 01-02 complete
PR #305 checkpoint 03 schedule amendment complete
PR #306 function-matrix checkpoint 03 complete
PR #307 reviewed market-access guide published
PR #308 known-unknown and placeholder integrity audit complete
PR #309 monitoring coverage recalculation complete
PR #310 Registry v2/v3 and machine-readable parity active
PR #311 counts, manifest, version, and provenance integrity next
PR #310-#328 current sequence unchanged
PR #329-#342 post-110 comparison and change-product sequence approved but not active before reviewed 110-asset checkpoint
```

Urgent factual corrections, verified public breakage, owner-directed dated editorial work, or security fixes may interrupt the sequence through a narrow PR. When that happens, the roadmap must be updated before the planned sequence resumes.

## 8. Unknown-value and placeholder governance

Unknown or missing-value semantics are protected data semantics.

Intentional unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These states are not structural placeholders and must not be overwritten merely to satisfy completeness or comparison presentation. A known-unknown record is a reviewed statement of unresolved knowledge and remains canonical until reviewed evidence resolves it.

Comparison projections must expose unresolved states rather than converting them to false factual claims.

Structural placeholders such as TODO/TBD identity fields, fake example URLs, fabricated dates, and placeholder addresses, contracts, or identifiers are defects.

## 9. Monitoring coverage governance

PR #309 completed coverage recalculation from the checked-in source allowlist and baseline state. It was an audit item, not a source-expansion item.

Coverage remains multidimensional and separated at minimum into:

```text
issuer/protocol source reach
reserve/assurance reach
redemption/mint terms reach
issuer lifecycle reach
regulatory action/guidance reach
platform-policy reach
platform service-state reach
regulatory-register reach
EU/EEA market-access function reach
accepted-baseline reach
```

Governance rules:

- A registered source is not an accepted baseline.
- A pending initial baseline is not accepted monitoring coverage.
- Issuer/protocol reach is not platform-policy coverage.
- Regulatory action pages are not regulatory-register coverage.
- A generic issuer or product page is not function-level market-access coverage.
- Zero coverage for a required domain is a valid audit result and must not be filled by inference.
- Source and schema expansion remain scheduled for PR #315-#317.
- Scheduled read-only operation remains PR #318.
- Monitoring output remains private candidate material until reviewed through the approved boundary.
- Monitoring observation schema does not by itself create a canonical Market Access Record family.

## 10. Comparison and change-product governance

Phase F-I is governed by `docs/comparison-and-change-product-spec.md`.

Binding boundaries include:

- The current PR #310-#328 sequence remains unchanged.
- Phase F starts only after the reviewed 110-asset checkpoint.
- Asset lifecycle, issuance/redemption, legal/regulatory state, and market access remain separate analytical layers.
- Existing lifecycle and redemption semantics are not replaced merely for comparison convenience.
- Legal and regulatory claims remain jurisdiction-scoped and evidence-backed.
- Canonical market-access records remain distinct from monitoring observations and editorial research matrices.
- Compare derives from reviewed canonical data and preserves unresolved states.
- Facet freshness derives from authoritative record families and distinguishes source period, effective date, and review date.
- Access and regulation may share an exploration surface while retaining separate canonical record families.
- Change Timeline is a derived projection and may not replace source record families with a lossy generic event object.
- Public update surfaces derive from reviewed merged canonical changes, not raw monitoring feeds.
- Safety scores, risk scores, best-asset rankings, and universal country availability claims are not approved.

## 11. Specification status labels

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

## 12. UI maintenance and approved product UI governance

There is no free-standing redesign sequence. A UI maintenance PR must start from a concrete observed defect, preserve the terminal visual family unless explicitly changed, preserve canonical data and route meaning, use rendered evidence for visual claims, and remain narrow enough not to displace the active roadmap.

When the roadmap reaches approved product UI phases such as Compare, Access & Regulation Explorer, or Change Timeline, those implementations are governed by the relevant canonical specification and roadmap PR item. Approval of those product surfaces does not reopen an unrestricted site-wide redesign program.

Approved production brand assets remain:

```text
public/brand/sog-lockup-on-light.svg
public/brand/sog-lockup-on-dark.svg
public/brand/sog-mark-on-light.svg
public/brand/sog-mark-on-dark.svg
```

## 13. Data-preservation rule

UI, quality, taxonomy, monitoring, statistics, growth, editorial, comparison, market-access, timeline, and update-surface work must not silently reduce canonical coverage.

Before and after a relevant change, verify at minimum the canonical asset, organization, relationship, event, evidence, reserve-context, known-unknown, regulatory-note, deployment, and route counts governed by the active baseline.

After canonical market-access records are introduced, relevant PRs must also verify their count, referential integrity, evidence linkage, scope fields, date semantics, and exclusion from private monitoring candidate data.
