# PR #364 — Tier A Dossier Deepening Batch 4

Status: canonical work-item specification  
Updated: 2026-07-14

## 1. Purpose

PR #364 deepens at most five existing canonical stable-asset dossiers selected from the reviewed PR #363 non-ranking candidate queue.

The selected assets are:

```text
HUSD
poundtoken / 1GBP
RLUSD
USDG
USDS
```

Selection does not rank these assets and does not authorize automatic canonical changes. Every proposed change requires manual source review and an explicit source-backed outcome.

## 2. Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/roadmap-amendments/2026-07-14-pr363-record-depth-refresh-activation.md
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
config/tier-a-dossier-batch-4-pr364.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
```

## 3. Selection boundary

The selection rule is reviewed material-gap and new-source opportunity, not rank or score.

Three selected assets were not consumed by PR #354, PR #355, or PR #357:

```text
poundtoken
USDG
USDS
```

HUSD and RLUSD are bounded re-reviews because later or more precise source versions may support remaining redemption gaps. Prior accepted facts must not be duplicated or silently rewritten.

AUDD and NZDS are excluded because PR #357 recorded reviewed no-safe-change outcomes and no new source finding has yet been accepted.

BUSD, FRAX, and USDP are deferred because they were completed in earlier dossier batches and the unconsumed candidates take priority.

## 4. Authorized dimensions

```text
HUSD:       redemption
poundtoken: lifecycle, organization_relationships, redemption
RLUSD:      redemption
USDG:       legal_profile, redemption
USDS:       legal_profile
```

No other dimension or asset is authorized without a specification amendment.

## 5. Source-review requirements

Each asset must receive a reviewed finding that records:

- exact canonical asset identity;
- exact source identity and URL;
- publisher or controlling organization;
- source type and primary/secondary status;
- publication, effective, or access boundary when available;
- claim scope;
- proposed canonical record family and field;
- whether the source adds a new fact, clarifies an existing fact, supersedes a prior version, or supports no safe change;
- remaining uncertainty.

Official, regulator, issuer, protocol, legal, or archived primary sources are preferred. Secondary reporting may provide context but cannot alone establish legal terms, redemption rights, issuer relationships, or effective dates when a primary source is required.

## 6. Allowed canonical changes

Only the following record families are allowed:

```text
organizations
relationships
stablecoin_profiles
events
event_details
evidence
evidence_relations
legal_profiles
known_unknowns
regulatory_notes
```

No canonical change is required merely because an asset was selected. A reviewed no-safe-change outcome is valid.

Any new Evidence identity must be genuinely distinct, source-linked, deduplicated, and connected through an Evidence Relation. Existing source identities must be reused when they already represent the source.

## 7. Prohibited changes

PR #364 must not:

- add or remove a canonical stable asset;
- change Market Access Records;
- alter deployments, reserve reports, reserve components, or income profiles unless a separate amendment authorizes them;
- rewrite historical handoffs or Record Depth checkpoints;
- change Comparison Readiness or Facet Freshness semantics;
- auto-promote monitoring or editorial research;
- add a public route or product surface;
- create a rank, score, leaderboard, or investment recommendation;
- infer redemption availability, legal eligibility, or issuer obligations beyond the source.

## 8. Required internal outputs

Before canonical application, PR #364 must commit:

```text
docs/migration/tier-a-dossier-batch-4-pr364-review-queue.json
docs/migration/tier-a-dossier-batch-4-pr364-findings.json
```

At completion it must commit:

```text
docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json
```

The findings must include both changed and no-safe-change outcomes.

## 9. Validation

Validation must prove:

- exactly five selected canonical assets;
- every selected asset belongs to the PR #363 queue;
- no unselected asset is changed;
- only authorized dimensions and record families are changed;
- prior handoffs and PR #363 outputs are immutable;
- source identity and Evidence Relation integrity;
- no new asset, Market Access Record, rank, score, or public surface;
- deterministic counts, statistics history, build, and public-layer safety.

## 10. Handoff

PR #364 completes only after all selected assets have explicit reviewed outcomes and all validation passes.

The next authorized item is:

```text
PR #365 Evidence and Archive Maintenance Batch 2
```
