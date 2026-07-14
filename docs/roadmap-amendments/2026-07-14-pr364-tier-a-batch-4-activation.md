# PR #364 Tier A Dossier Deepening — Batch 4 Activation

Status: active roadmap amendment  
Date: 2026-07-14

## 1. Activation

PR #363 Record Depth and Coverage Baseline Refresh is complete and merged at:

```text
5357134b07d70c34b4315028d743699baa38d989
```

Its reviewed internal outputs are:

```text
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
```

The active work item is now:

```text
PR #364 Tier A Dossier Deepening Batch 4: active
PR #365 Evidence and Archive Maintenance Batch 2: next
```

## 2. Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-14-pr364-tier-a-batch-4-activation.md
docs/quality/tier-a-dossier-batch-4-pr364-spec.md
config/tier-a-dossier-batch-4-pr364.json
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
docs/migration/tier-a-dossier-batch-4-pr364-review-queue.json
```

## 3. Reviewed non-ranking selection

```text
husd
poundtoken
rlusd
usdg
usds
```

This is a bounded review selection, not an asset rank. HUSD and RLUSD are limited re-reviews of source-versioned remaining gaps. poundtoken, USDG, and USDS were not consumed by the completed earlier dossier batches.

## 4. Authorized targets

```text
HUSD: redemption
poundtoken: lifecycle, organization_relationships, redemption
RLUSD: redemption
USDG: legal_profile, redemption
USDS: legal_profile
```

Each asset may conclude with either a source-supported canonical change or an explicit reviewed-no-safe-change finding.

## 5. Boundaries

PR #364 must not:

```text
add canonical stable assets
add or change Market Access Records
change deployments, reserve reports, reserve components, or income profiles
add a new public product surface
change Compare preset membership
change Comparison Readiness semantics
change Facet Freshness semantics
rank assets
create a composite score
automatically promote monitoring or editorial research
rewrite historical checkpoints
```

## 6. Implementation sequence

```text
1. bind the PR #363 reviewed baseline and queue
2. validate the five-asset review selection
3. review exact primary-source identities and versions
4. record changed or reviewed-no-safe-change findings for every asset
5. apply only evidence-supported canonical improvements
6. update forward-only canonical, parity, release, and statistics checkpoints
7. verify all internal planning and findings remain non-public
8. validate and merge
```

## 7. Completion and handoff

Completion requires green dedicated validation and general CI, plus:

```text
docs/migration/tier-a-dossier-batch-4-pr364-findings.json
docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json
```

After PR #364 merges:

```text
PR #365 Evidence and Archive Maintenance Batch 2: active
REVIEW GATE: next
```
