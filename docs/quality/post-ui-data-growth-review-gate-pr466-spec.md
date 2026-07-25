# PR #466 — Post-UI data-growth review gate specification

Status: canonical governance specification  
Recorded: 2026-07-25  
Governing operating mode: `docs/post-351-data-growth-operating-spec.md`

## Purpose

PR #466 closes the mandatory review boundary after PR #429 and after completion of the UI V3 remediation workstream. It authorizes at most one bounded next canonical growth batch. PR #466 itself changes no canonical or public data.

## Reviewed source state

The review must bind to the merged 114-asset baseline:

```text
Stable assets: 114
Organizations: 107
Relationships: 126
Events: 189
Evidence: 565
Evidence Relations: 565
Deployments: 180
Market Access Records: 8
Archive recorded / not recorded: 436 / 129
```

PR #427 reviewed 11 candidates and marked four complete-record feasible. PR #429 promoted CHFAU and SEKAU. PLNQ and GBPQ were explicitly retained for future review and not rejected. No later canonical asset growth occurred during the UI closure sequence.

## Decision

Authorize exactly:

```text
PR #467 — Record Growth Batch 3: Quantoz PLNQ and Quantoz GBPQ
REVIEW GATE after PR #467
```

The pair forms one coherent `quantoz_regulated_non_eur_expansion` context. The decision is not a ranking, endorsement, safety assessment, or recommendation.

## PR #467 entry checks

Before canonical edits, PR #467 must perform a fresh manual check for each candidate:

1. no canonical ID, slug, symbol, alias, deployment, or lineage duplicate now exists;
2. current official sources still support asset identity, legal issuer, lifecycle, regulatory structure, reserves, and redemption;
3. exact deployment or contract identity is confirmed from acceptable evidence;
4. the existing Quantoz organization can be reused without creating a duplicate organization;
5. all applicable complete-record families can be populated without invented values.

A candidate that fails any entry check must be withheld. The PR may merge one confirmed complete record instead of two, but it may not replace a blocked candidate with an unreviewed third asset.

## Complete-record requirement

Thin records are prohibited. Each promoted asset must include every applicable canonical layer:

- stablecoin identity;
- issuer and organization relationship;
- lifecycle and classification;
- stablecoin profile;
- issuance, backing, reserve, and redemption semantics;
- launch or material events and typed event detail;
- Evidence and Evidence Relations;
- reserve report or explicit reviewed not-applicable state;
- known unknowns;
- verified deployments;
- legal profile;
- reserve components;
- income profile;
- candidate-promotion mapping;
- generated checkpoints, statistics, parity, provenance, and handoff outputs required by the current repository contract.

Unknown values must remain explicit unknowns. Absence of evidence must never be converted into a factual value.

## Protected boundaries

PR #466 and the authorized PR #467 must not introduce:

- a third asset;
- a duplicate Quantoz organization;
- Market Access changes;
- monitoring publication;
- UI or public-route changes;
- new dashboard, explorer, ranking, or score surfaces;
- metadata-contract or machine-readable semantic changes unrelated to the exact canonical additions;
- automatic promotion or automatic canonical PR creation;
- investment recommendations or safety claims.

## Validation requirements

PR #466 must validate:

- current canonical counts;
- PR #427 handoff and source-coverage states;
- PR #429 promotion of CHFAU and SEKAU;
- retained PLNQ and GBPQ candidate identity;
- maximum two-asset authorization;
- complete-record and stop-condition boundaries;
- zero canonical and public changes in PR #466;
- roadmap and agent-authority synchronization.

## Exit boundary

PR #466 exits only to PR #467. PR #467 exits only to a mandatory `REVIEW GATE`. No later batch is pre-authorized.
