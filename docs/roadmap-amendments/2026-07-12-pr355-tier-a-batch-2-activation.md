# PR #355 Tier A Dossier Deepening — Batch 2 activation

Status: active roadmap amendment  
Updated: 2026-07-12

## Authoritative current position

```text
PR #352 post-351 authority reset: complete
PR #353 Record Depth & Coverage Baseline: complete
PR #354 Tier A Dossier Deepening — Batch 1: complete
PR #355 Tier A Dossier Deepening — Batch 2: active
PR #356 Market Access Pilot 1: next
```

PR #355 is the second canonical dossier-deepening implementation selected from the reviewed PR #353 queue after excluding the five assets completed in PR #354.

## Binding references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md
docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md
docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md
docs/quality/record-depth-coverage-baseline-spec.md
docs/quality/tier-a-dossier-batch-2-pr355-spec.md
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

## Selected assets

PR #355 selects exactly five remaining reviewed Tier A queue members:

```text
fdusd
frax
pyusd
usdp
ust
```

The selection is not a ranking.

The batch combines:

- comparison-preset leverage through FDUSD, FRAX, USDP, and UST;
- active issuer-backed legal and redemption contrast through FDUSD, PYUSD, and USDP;
- protocol-backed legal and redemption contrast through FRAX;
- failed algorithmic historical contrast through UST;
- evidence-maintenance leverage through USDP;
- Timeline and Access & Regulation leverage across all five assets.

## Reviewed queue reasons and material gaps

### FDUSD

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
```

### FRAX

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
  redemption
```

### PYUSD

```text
reason:
  historical_importance_with_multiple_material_dossier_gaps
material_dossier_gaps:
  legal_profile
  redemption
```

### USDP

```text
reasons:
  comparison_and_evidence_maintenance_leverage
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
  redemption
```

### UST

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
```

These reasons and gaps must match the immutable PR #353 queue snapshot exactly.

## Target record families

### Required scope for all five assets

```text
legal profile deepening
legal-profile evidence linkage
claim-scope review
reserve ownership and segregation review
licensed/regulated role review where exact primary evidence supports it
```

### Additional bounded scope for FRAX, PYUSD, and USDP

```text
redemption-profile evidence linkage
redemption eligibility and route review
settlement asset and restriction review
current versus historical redemption-state wording review
```

Only fields supported by reviewed primary evidence may change.

## Explicit non-goals

PR #355 does not:

- add new canonical stable assets;
- create canonical Market Access Records;
- implement Market Access Pilot 1;
- change canonical data for PR #354 completed assets;
- use monitoring artifacts as canonical evidence;
- promote editorial research automatically;
- change Compare preset membership;
- change Comparison Readiness rules;
- change Facet Freshness rules;
- change Timeline date semantics;
- change Update Feed entries;
- change Maintenance Log month data;
- add a public page, explorer, dashboard, ranking, or navigation family;
- rank selected assets;
- create a composite score.

## Completion condition

PR #355 completes when:

- selected assets exactly match the remaining reviewed PR #353 queue subset defined here;
- batch size is five;
- every selected asset cites exact queue reasons and material dossier gaps;
- PR #354 completed assets remain excluded and unchanged;
- legal-profile changes are evidence-backed and bounded;
- FRAX/PYUSD/USDP redemption changes occur only where primary evidence supports stronger canonical statements;
- new evidence and evidence relations validate without duplicate-source regression;
- canonical stable-asset count remains 110;
- Market Access record count remains zero;
- PR #353 snapshots and PR #354 reviewed handoff remain unchanged;
- current Record Depth recomputation documents targeted improvement or preserved unresolved states;
- no score, ranking, or public planning endpoint is introduced;
- dedicated PR #355 workflow and general non-regression workflows are green.

## Handoff

After PR #355 merges:

```text
PR #356 Market Access Pilot 1: active
```

PR #356 must reread repository authority from `main` and use the canonical Market Access governance rather than treating dossier facts as platform/function access claims.
