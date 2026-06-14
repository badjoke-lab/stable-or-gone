# SOG record growth plan: 40 to 70

Status: specification fixed; candidate identities not yet frozen.

## Preconditions

Record growth resumes after Registry v3 schema and validators, migration of the existing 40 records, generated statistics, the public `/stats/` page, and a reviewed Candidate Master are complete.

## Batch schedule

```text
Batch F  40 → 45  active issuer-backed and regulated assets
Batch G  45 → 50  non-USD and regional assets
Batch H  50 → 55  decentralized collateral and vault systems
Batch I  55 → 60  historical algorithmic and partially collateralized systems
Batch J  60 → 65  yield-bearing, synthetic, and delta-neutral assets
Batch K  65 → 70  migrated, regional, historical, and coverage-gap assets
```

Default batch size is five. Reduce a batch to three or four when identity, legal structure, reserve history, migration history, or deployment history requires deeper review.

## Planning balance at 70

```text
active                         40
restricted or suspended         6
collapsed                      12
terminated or winding down      7
migrated, rebranded, inactive   5
total                          70
```

This is a planning target rather than a quota. Evidence and identity quality take priority.

## Required package

Every promoted asset requires canonical identity, organizations and relationships, classification, reserve and redemption profile, legal profile, lifecycle event and typed detail, scoped evidence, known unknowns, verified deployments, applicable stable-asset relationships, Candidate Master promotion, baseline and loader integration, and a review document.

## Candidate Master

Before Batch F, freeze thirty primary candidates plus backups. Record each candidate's intended batch, asset class, reference target, lifecycle target, legal-profile requirements, relationship requirements, and unresolved blockers. Check names, symbols, aliases, domains, contracts, issuers, wrappers, bridge representations, predecessors, and successors for duplicate or identity conflicts.

## Validation

Every batch must pass existing validation, Registry v3 validation, batch finalization, statistics generation and validation, Astro check and build, deployment verification, and public-layer verification.

## Seventy-record audit

After Batch K, run a separate audit for lifecycle balance, taxonomy coverage, legal profiles, deployment canonicality, yield mechanics, event completeness, evidence coverage, known unknowns, duplicate identity, statistics consistency, public pages, and machine-readable counts. Do not begin 70 → 100 planning until that audit is merged.
