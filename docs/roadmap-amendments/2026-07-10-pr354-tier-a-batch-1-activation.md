# PR #354 Tier A Dossier Deepening — Batch 1 activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current position

```text
PR #352 post-351 authority reset: complete
PR #353 Record Depth & Coverage Baseline: complete
PR #354 Tier A Dossier Deepening — Batch 1: active
PR #355 Tier A Dossier Deepening — Batch 2: next
```

PR #354 is the first canonical dossier-deepening implementation selected from the reviewed PR #353 planning checkpoints.

## Binding references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md
docs/quality/record-depth-coverage-baseline-spec.md
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/quality/tier-a-dossier-batch-1-pr354-spec.md
```

## Selected assets

PR #354 selects exactly five reviewed Tier A queue members:

```text
usdt
usdc
rlusd
dai
busd
```

The selection is not a ranking.

It combines:

- existing Compare preset leverage;
- legal-profile material gaps across all five assets;
- additional redemption gaps for RLUSD and BUSD;
- protocol-model contrast through DAI;
- active issuer-backed contrast through USDT, USDC, and RLUSD;
- discontinued and regulatory-history contrast through BUSD.

## Reviewed queue reasons and material gaps

### USDT

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
```

### USDC

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
```

### RLUSD

```text
reasons:
  comparison_preset_member_with_material_dossier_gap
  historical_importance_with_multiple_material_dossier_gaps
material_dossier_gaps:
  legal_profile
  redemption
```

### DAI

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
```

### BUSD

```text
reasons:
  comparison_preset_member_with_material_dossier_gap
  historical_importance_with_multiple_material_dossier_gaps
material_dossier_gaps:
  legal_profile
  redemption
```

These reasons and gaps must match the committed PR #353 queue snapshot exactly.

## Target record families

### Required scope for all five assets

```text
legal profile deepening
legal-profile evidence linkage
claim-scope review
reserve ownership and segregation review
licensed/regulated role review where primary evidence supports it
```

### Additional bounded scope for RLUSD and BUSD

```text
redemption-profile evidence linkage
redemption eligibility and route review
current or historical redemption-state wording review
```

Only fields supported by reviewed primary evidence may be changed.

## Explicit non-goals

PR #354 does not:

- add new canonical stable assets;
- create canonical Market Access Records;
- add an Access pilot;
- use monitoring artifacts as canonical evidence;
- promote editorial research automatically;
- change Compare preset membership;
- change Comparison Readiness rules;
- change Facet Freshness rules;
- change Timeline date semantics;
- change Update Feed entries;
- change Maintenance Log month data;
- add a public page, explorer, dashboard, ranking, or navigation family;
- rank the selected five assets;
- claim that missing legal or regulatory rows imply no legal or regulatory issue.

## Evidence boundary

Primary evidence is preferred and should include, as applicable:

```text
issuer or protocol legal terms
official redemption or mint/redeem documentation
official reserve or transparency documentation
official regulator publications
official enforcement or supervisory publications
official protocol governance or technical documentation
```

Secondary sources may be used only for discovery or corroboration when primary evidence is unavailable and the canonical claim is appropriately bounded.

## Completion condition

PR #354 completes when:

- selected assets exactly match the reviewed PR #353 queue;
- batch size is five and does not exceed the policy maximum;
- each selected asset cites its reviewed queue reasons and material dossier gaps;
- legal-profile changes are evidence-backed and bounded;
- RLUSD/BUSD redemption changes occur only where primary evidence supports a stronger canonical statement;
- new evidence rows and evidence relations validate;
- no new canonical asset is added;
- no canonical Market Access Record is added;
- non-selected asset canonical records remain unchanged;
- PR #353 reviewed snapshots remain unchanged;
- post-change Record Depth recomputation shows targeted improvement or documents why evidence did not justify a state transition;
- dedicated PR #354 workflow and general non-regression workflows are green.

## Handoff

After PR #354 merges:

```text
PR #355 Tier A Dossier Deepening — Batch 2: active
```

PR #355 must select its batch from the remaining reviewed Tier A queue and the post-PR #354 recomputed planning state, without rewriting the historical PR #353 checkpoints.
