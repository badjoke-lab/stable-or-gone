# PR #367 Planning Dimension Semantics Audit Specification

## Status

This specification governs the first work item approved by the merged PR #366 review gate.

PR #367 is internal planning-contract work. It may change governance pointers, planning semantics, deterministic audit outputs, validators, and workflows. It may not change canonical data, recompute the 112-asset baseline, or add a public surface.

## Authority

Binding authority:

- `AGENTS.md`
- `docs/roadmap.md`
- `docs/roadmap-amendments/2026-07-15-pr366-post-pr365-review-gate.md`
- `docs/migration/post-pr365-review-gate-pr366.json`
- `config/planning-dimension-semantics-pr367.json`

PR #366 approved exactly PR #367, PR #368, and PR #369, followed by another review gate.

## Required inputs

- `config/record-depth-baseline-v1.json`
- `docs/migration/record-depth-baseline-pr363-summary.json`
- `scripts/growth/build-record-depth-baseline-pr353.mjs`
- `scripts/growth/build-reviewed-record-depth-baseline-pr353.mjs`
- `docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json`
- `docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json`
- `docs/archive/AGENTS-through-pr366.md`
- `docs/archive/roadmap-through-pr366.md`

## Audit question

Can the internal Record Depth model distinguish:

1. a well-supported applicable dimension;
2. an applicable but incomplete dimension;
3. an applicable dimension with no canonical representation;
4. a dimension outside the current reviewed scope;
5. a dimension that has not been observed;
6. a dimension for which adequate source support was unavailable;

without converting knowledge gaps into negative factual claims or rankings?

## Binding state model

The planning quality axis remains:

```text
strong
usable
partial
sparse
absent
not_applicable
```

PR #367 adds two orthogonal axes:

```text
applicability:
  applicable
  not_applicable_to_current_scope

observation/source support:
  observed_supported
  observed_limited
  unobserved
  source_unavailable
  not_applicable
```

Rules:

- `strong` requires applicable plus observed support at the reviewed threshold.
- `usable` requires applicable canonical structure with adequate but limited depth or freshness.
- `partial` and `sparse` require applicability and some incomplete, weak, or source-limited representation.
- `absent` is allowed only for an applicable dimension and means no canonical representation is present.
- `absent` never means the real-world feature does not exist.
- `not_applicable` means outside the current reviewed planning scope or explicitly inapplicable under a source-supported mechanism rule.
- `not_applicable` never counts as a gap or queue trigger.
- `unobserved` and `source_unavailable` are knowledge states, not factual negatives.
- no state authorizes fabricated canonical data, false booleans, or fabricated archive URLs.

## Dimension classes

Exactly 16 dimensions are reviewed.

### Universal dossier dimensions — 11

```text
identity
lifecycle
organization_relationships
mechanism_classification
issuance
deployment
legal_profile
events
evidence_depth
known_unknowns
comparison_readiness
```

### Conditional structural dimensions — 3

```text
reserve_structure
redemption
facet_freshness_support
```

### Scoped observational dimensions — 2

```text
regulatory_notes
canonical_market_access
```

The detailed applicability, absence, not-applicable, and observation rules are canonicalized in `config/planning-dimension-semantics-v2.json`.

## Queue roles

The default dossier queue uses roles rather than all unresolved states indiscriminately:

```text
material_dossier: 11 dimensions
maintenance_only: 2 dimensions
scoped_non_dossier: 2 dimensions
diagnostic_only: 1 dimension
```

Only `partial`, `sparse`, and `absent` cells in `material_dossier` dimensions may directly contribute a material dossier gap. Every candidate still requires manual source review.

Deployment and facet freshness remain maintenance signals. Regulatory notes and Market Access remain bounded-scope research surfaces. Comparison Readiness remains diagnostic and non-ranking.

## Specific corrections

- An explicit, source-supported `redemption_profile.status` of `not_applicable` maps to planning `not_applicable`; it must not become `partial` merely because retail, institutional, or minimum fields are also not applicable.
- Regulatory-note absence outside a named regulatory research scope is not a universal dossier defect.
- Market Access absence outside an asset/jurisdiction/platform/function/effective-date research scope is not an availability, ban, or support claim.
- Reserve structure is conditional on the reviewed stabilization/backing mechanism.
- Facet freshness is not applicable when no included facet has a freshness expectation.

## Required outputs

- `config/planning-dimension-semantics-v2.json`
- `docs/migration/planning-dimension-semantics-audit-pr367.json`
- `scripts/build-planning-dimension-semantics-audit-pr367.mjs`
- `scripts/validate-planning-dimension-semantics-audit-pr367.mjs`
- `scripts/check-workstream-124.mjs`
- `.github/workflows/pr367-planning-dimension-semantics-audit.yml`

## Historical preservation

PR #367 does not rewrite any v1 baseline, queue, or builder.

The pre-PR367 `AGENTS.md` and `docs/roadmap.md` blobs are preserved exactly at:

```text
docs/archive/AGENTS-through-pr366.md
docs/archive/roadmap-through-pr366.md
```

Those files are historical only. Current authority remains in the root `AGENTS.md` and `docs/roadmap.md`.

## Explicit non-goals

- no 112-asset baseline recomputation;
- no candidate queue generation for PR #369;
- no canonical record, Evidence, deployment, or Market Access change;
- no new asset;
- no public page or explorer;
- no ranking, score, recommendation, or automatic promotion;
- no Evidence and Archive Maintenance Batch 3;
- no Market Access Pilot 3;
- no Record Growth Batch 2.

## Handoff

On merge, PR #368 must consume `sog_planning_dimension_semantics_v2_pr367` and produce a new non-ranking 112-asset baseline while retaining applicability and observation state in every planning cell.
