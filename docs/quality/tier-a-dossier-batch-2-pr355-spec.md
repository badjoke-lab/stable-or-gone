# SOG Tier A Dossier Deepening — Batch 2 — PR #355

Status: canonical work-item specification  
Updated: 2026-07-12

## 1. Purpose

PR #355 deepens five existing canonical stable-asset dossiers selected from the remaining reviewed PR #353 Tier A queue after PR #354 completion.

Selected assets:

```text
FDUSD
FRAX
PYUSD
USDP
UST
```

This is a dossier-depth PR. It does not add new canonical stable assets.

## 2. Selection authority

Historical selection sources:

```text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
```

Completed prior-batch handoff:

```text
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

The selected set must remain exactly:

```text
fdusd
frax
pyusd
usdp
ust
```

Selection order has no ranking meaning.

PR #354 completed assets must not be selected again:

```text
busd
dai
rlusd
usdc
usdt
```

## 3. Asset-specific target scope

### 3.1 FDUSD

Reviewed queue basis:

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gap:
  legal_profile
```

Target:

- issuer/legal-entity scope;
- holder claim semantics;
- reserve ownership and segregation semantics;
- licensed or regulated role claims only at the exact entity/jurisdiction level;
- legal-profile primary evidence linkage.

Do not infer universal retail redemption or bankruptcy remoteness from reserve attestations alone.

### 3.2 FRAX

Reviewed queue basis:

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
  redemption
```

Target:

- protocol and governance legal-role scope;
- holder claim semantics appropriate to protocol architecture;
- reserve/collateral ownership and control semantics;
- current redemption mechanisms, eligibility, settlement asset, and restrictions;
- legal and redemption primary evidence linkage.

Do not force protocol-controlled collateral into issuer-backed legal fields where not applicable.

### 3.3 PYUSD

Reviewed queue basis:

```text
reason:
  historical_importance_with_multiple_material_dossier_gaps
material_dossier_gaps:
  legal_profile
  redemption
```

Target:

- exact issuer and PayPal/Paxos role separation;
- holder claim semantics;
- reserve ownership, segregation, and bankruptcy-remoteness claims only where exact primary terms support them;
- redemption eligibility, route, settlement, and restrictions;
- legal and redemption primary evidence linkage.

Do not collapse PayPal distribution/branding roles into the legal issuer role.

### 3.4 USDP

Reviewed queue basis:

```text
reasons:
  comparison_and_evidence_maintenance_leverage
  comparison_preset_member_with_material_dossier_gap
material_dossier_gaps:
  legal_profile
  redemption
```

Target:

- Paxos issuer and trust-company scope;
- holder claim semantics;
- reserve ownership, segregation, and bankruptcy-remoteness claims where exact terms/regulator material support them;
- redemption eligibility and current route;
- evidence identity and source-linkage maintenance;
- legal and redemption primary evidence linkage.

Do not reuse BUSD-specific wind-down claims as USDP claims without asset-specific source support.

### 3.5 UST

Reviewed queue basis:

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gap:
  legal_profile
```

Target:

- protocol/organization legal-role scope during the canonical UST period;
- holder claim semantics and absence of a conventional fiat issuer claim where primary protocol documentation supports it;
- reserve/collateral ownership applicability;
- collapse-era legal/regulatory context only where directly relevant and sourced;
- legal-profile evidence linkage.

Do not rewrite UST history using later successor-token or unrelated wrapped-asset claims.

## 4. Evidence rules

Preferred evidence:

```text
official issuer stablecoin terms
official protocol documentation
official redemption/mint-redeem documentation
official reserve or transparency disclosures
official regulator publications
official court/enforcement publications when directly relevant
```

Every changed legal-profile field must have canonical evidence support.

Every changed redemption field must preserve direct redemption versus secondary-market exit, customer eligibility, restrictions, effective dates, and current/historical context.

Duplicate source URLs must be resolved through existing evidence identity and alias rules rather than adding redundant evidence rows.

## 5. Protected unresolved states

The following remain valid and must not be filled merely to improve planning coverage:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

A reviewed planning gap is a research target, not evidence.

## 6. Authorized redemption scope

Only these three assets are authorized for redemption field-value changes in PR #355:

```text
frax
pyusd
usdp
```

FDUSD and UST may receive evidence-linkage corrections only. Any redemption field-value change for them requires a deliberate work-item amendment.

## 7. Post-change planning validation

PR #355 must regenerate current Record Depth state using the PR #353 derivation rules.

Immutable inputs remain unchanged:

```text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

Expected targeted dimensions:

```text
FDUSD  legal_profile
FRAX   legal_profile, redemption
PYUSD  legal_profile, redemption
USDP   legal_profile, redemption
UST    legal_profile
```

A state transition is not mandatory where reviewed evidence does not justify one. The unresolved state and evidence limitation must then be preserved.

Non-selected asset planning states must remain unchanged except for deterministic effects caused by explicitly audited shared evidence-identity maintenance.

## 8. Canonical count boundary

PR #355 preserves:

```text
canonical stable assets: 110
```

Supporting evidence/evidence-relation counts may increase through explicit audited forward checkpoints.

No new Market Access Record is added.

## 9. Public-surface boundary

PR #355 does not add:

- a public page;
- an explorer;
- a dashboard;
- a ranking;
- a navigation family;
- a public planning-baseline endpoint.

Existing canonical dossier and comparison surfaces may improve automatically from deeper reviewed data.

## 10. Validation requirements

PR #355 must prove:

1. exactly five selected assets;
2. all selected assets exist in the immutable PR #353 queue;
3. selected reasons and material gaps match exactly;
4. all PR #354 completed assets are excluded;
5. target dimensions are authorized;
6. only FRAX/PYUSD/USDP receive redemption field-value changes;
7. legal and redemption claims have exact reviewed evidence;
8. no duplicate evidence-source identity regression is introduced;
9. canonical asset count remains 110;
10. Market Access record count remains zero;
11. PR #353 snapshots and PR #354 handoff remain unchanged;
12. no score or ranking is introduced;
13. no new public product surface is introduced;
14. current baseline impact is deterministic;
15. Registry v2/v3, evidence relations, parity, Readiness, Freshness, Timeline, Update Feed, statistics history, and site build remain green.

## 11. Handoff

After PR #355 merges, PR #356 Market Access Pilot 1 becomes active.

Dossier facts may inform research, but PR #356 must create access claims only through the canonical asset × jurisdiction × platform/service × function × effective-date model and its separate governance.
