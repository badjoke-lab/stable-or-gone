# SOG Tier A Dossier Deepening — Batch 1 — PR #354

Status: canonical work-item specification  
Updated: 2026-07-10

## 1. Purpose

PR #354 deepens five existing canonical stable-asset dossiers selected from the reviewed PR #353 planning queue.

Selected assets:

```text
USDT
USDC
RLUSD
DAI
BUSD
```

This batch improves reviewed canonical depth. It is not a growth PR and does not add new canonical assets.

## 2. Selection authority

Selection source:

```text
docs/migration/tier-a-candidate-queue-pr353.json
```

Reviewed baseline source:

```text
docs/migration/record-depth-baseline-pr353-summary.json
```

The batch is selected for product leverage and material dossier gaps, not because queue position implies rank.

The selected asset set must remain exactly:

```text
busd
dai
rlusd
usdc
usdt
```

Validation may sort slugs for deterministic comparison, but selection order has no ranking meaning.

## 3. Asset-specific target scope

### 3.1 USDT

Reviewed queue basis:

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gap:
  legal_profile
```

Target:

- holder claim semantics;
- claim-against organization scope where supported;
- reserve ownership and segregation semantics where supported;
- licensed or regulated roles where primary evidence supports the exact entity and jurisdiction;
- legal-profile evidence linkage.

Do not convert broad reserve or transparency statements into unsupported bankruptcy-remoteness claims.

### 3.2 USDC

Reviewed queue basis:

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gap:
  legal_profile
```

Target:

- holder redemption/claim semantics;
- issuer-entity and jurisdiction scope;
- reserve ownership/segregation semantics;
- regulated or licensed role claims only at the correct legal-entity level;
- legal-profile evidence linkage.

Do not collapse U.S. and EEA issuer structures into one universal claim.

### 3.3 RLUSD

Reviewed queue basis:

```text
reasons:
  comparison_preset_member_with_material_dossier_gap
  historical_importance_with_multiple_material_dossier_gaps
material_dossier_gaps:
  legal_profile
  redemption
```

Target:

- issuer and holder claim semantics;
- reserve ownership/segregation claims where official terms support them;
- regulatory status at the correct legal-entity/jurisdiction scope;
- redemption eligibility, route, settlement, and restrictions where official terms support bounded fields;
- legal and redemption evidence linkage.

Do not infer retail redemption availability from exchange availability or regulator approval.

### 3.4 DAI

Reviewed queue basis:

```text
reason:
  comparison_preset_member_with_material_dossier_gap
material_dossier_gap:
  legal_profile
```

Target:

- protocol-based holder claim semantics;
- absence of a conventional issuer claim where primary protocol documentation supports that structure;
- collateral/reserve ownership semantics appropriate to protocol-controlled smart-contract collateral;
- governance/legal-role scope without inventing a universal regulatory classification;
- legal-profile evidence linkage.

Do not force protocol architecture into issuer-backed legal-profile fields where the model does not apply.

### 3.5 BUSD

Reviewed queue basis:

```text
reasons:
  comparison_preset_member_with_material_dossier_gap
  historical_importance_with_multiple_material_dossier_gaps
material_dossier_gaps:
  legal_profile
  redemption
```

Target:

- issuer and holder claim semantics;
- reserve ownership, segregation, and bankruptcy-remoteness only where primary Paxos or regulator material supports exact claims;
- New York regulatory context and issuer role;
- wind-down and redemption-state review;
- legal and redemption evidence linkage.

Do not treat Binance-branded or Binance-Peg BUSD representations as identical to Paxos-issued canonical BUSD without explicit scope.

## 4. Evidence rules

Preferred sources:

```text
official issuer terms
official issuer stablecoin terms
official reserve/transparency disclosures
official protocol documentation
official protocol governance documentation
official regulator publications
official court or enforcement publications when directly relevant
```

Every changed canonical legal-profile field must have evidence support through existing canonical evidence/evidence-relation structures.

Every changed redemption field must have evidence support through the profile evidence list and/or evidence relations as required by current validators.

Primary evidence should be day- or period-bounded when the claim is time-sensitive.

## 5. Legal-profile field discipline

Allowed changes must follow the existing legal-profile schema and value-state semantics.

Protected unresolved states remain valid:

```text
unknown
not_recorded
not_applicable
source_review_needed
null
```

Do not replace an unresolved state merely to improve the planning baseline.

A planning target is not evidence.

## 6. Regulatory note boundary

PR #354 may add a canonical Regulatory Note only when:

- the note type is valid under current schema;
- the source is official or otherwise meets canonical evidence requirements;
- the note is directly relevant to the selected asset;
- the note adds a bounded fact not already adequately represented by an event or legal profile;
- the change remains within dossier deepening rather than creating a Market Access claim.

Regulatory Note absence is not a claim of no regulatory issue.

## 7. Redemption boundary

Only RLUSD and BUSD are pre-authorized for redemption-profile deepening in this batch.

USDT, USDC, and DAI redemption records may receive evidence linkage corrections only if required for consistency, but field-value changes require an explicit amendment to this work-item scope.

For RLUSD and BUSD:

- direct redemption must be distinguished from exchange or secondary-market exit;
- customer eligibility must be preserved;
- current versus historical wind-down context must be explicit;
- retail availability must not be inferred from institutional terms;
- minimum, fee, and settlement claims remain unresolved unless official evidence supports them.

## 8. Post-change planning validation

PR #354 must regenerate the current Record Depth baseline using the PR #353 derivation rules.

The historical PR #353 snapshots remain immutable:

```text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
```

Validation must compare selected asset dimension states before and after PR #354.

Expected targeted dimensions:

```text
USDT   legal_profile
USDC   legal_profile
RLUSD  legal_profile, redemption
DAI    legal_profile
BUSD   legal_profile, redemption
```

A state transition is not mandatory if reviewed evidence does not support one. In that case, the PR must preserve the unresolved state and record the evidence limitation.

Non-selected asset dimension states must remain unchanged.

## 9. Canonical count boundary

PR #354 must preserve:

```text
canonical stable assets: 110
```

No new asset is added.

Supporting records may increase where evidence-backed dossier deepening requires them.

## 10. Market Access boundary

PR #354 must not add rows to:

```text
data/market-access-records-v1.json
```

Market Access promotion begins in the separately bounded PR #356 pilot.

Legal, regulatory, and redemption facts must not be converted into asset × jurisdiction × platform × function access claims in this PR.

## 11. Public-surface boundary

PR #354 does not add:

- new public page;
- new explorer;
- new dashboard;
- new ranking;
- new navigation family;
- new public planning-baseline endpoint.

Existing surfaces may improve automatically because canonical dossier data becomes deeper.

## 12. Validation requirements

PR #354 must prove:

1. exactly five selected assets;
2. every selected asset exists in the reviewed PR #353 queue;
3. selected queue reasons match exactly;
4. selected material dossier gaps match exactly;
5. target dimensions are authorized by this specification;
6. all changed legal-profile fields pass schema and evidence validation;
7. RLUSD/BUSD redemption changes pass schema and evidence validation;
8. no new canonical asset is added;
9. Market Access record count remains unchanged;
10. PR #353 reviewed snapshots remain byte-unchanged;
11. non-selected asset canonical records remain unchanged;
12. non-selected Record Depth dimension states remain unchanged;
13. post-change baseline is deterministic;
14. no score or ranking is introduced;
15. no public product surface is introduced;
16. canonical data validation, parity, Readiness, Freshness, Timeline, Update Feed, statistics history, and site build remain green.

## 13. Handoff

After PR #354 merges, PR #355 becomes active.

PR #355 must:

- reread repository authority from `main`;
- reread the immutable PR #353 queue snapshot;
- read PR #354 post-change baseline comparison output;
- select the next bounded batch from remaining reviewed candidates;
- avoid duplicating work already completed in PR #354.
