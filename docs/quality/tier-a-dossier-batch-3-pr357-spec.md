# PR #357 Tier A Dossier Deepening — Batch 3 Specification

Status: active work-item specification  
Updated: 2026-07-13

## 1. Roadmap item

PR #357 — Tier A Dossier Deepening — Batch 3.

PR #356 Market Access Pilot 1 is complete and merged at:

```text
ff48267a54333bd05c2fae1606c7744c3d5e200d
```

Its reviewed handoff is:

```text
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

## 2. Purpose

PR #357 returns to the reviewed PR #353 Tier A queue and deepens a maximum of five existing canonical stable-asset dossiers. It does not add new stable assets and does not expand Market Access.

The work targets material dossier gaps that remain after reviewed Batch 1 and Batch 2 completion.

## 3. Deterministic selection

The source queue is explicitly non-ranking and ordered by `asset_slug` ascending.

Selection applies this rule:

```text
1. read the immutable PR #353 queue
2. exclude assets completed by PR #354 and PR #355
3. preserve queue order
4. select the first five remaining assets
```

The selected assets are:

```text
AUDD  / sog_st_audd
FEI   / sog_st_fei
HUSD  / sog_st_husd
MIM   / sog_st_mim
NZDS  / sog_st_nzds
```

This is deterministic queue consumption, not a ranking or score.

## 4. Authorized target dimensions

### AUDD

```text
events
lifecycle
organization_relationships
redemption
```

### FEI

```text
legal_profile
```

### HUSD

```text
legal_profile
redemption
```

### MIM

```text
legal_profile
```

### NZDS

```text
events
lifecycle
organization_relationships
redemption
```

A target dimension may remain unchanged when source review cannot support a safe canonical improvement. Unsupported values must remain unknown or unchanged rather than guessed.

## 5. Authorized record families

PR #357 may modify only the record families needed by the selected target dimensions:

```text
stablecoins
organizations
relationships
classifications
stablecoin_profiles
events
event_details
evidence
evidence_relations
legal_profiles
known_unknowns
regulatory_notes
```

Every change must remain linked to one or more of the five selected assets.

## 6. Evidence standard

Every canonical factual change requires reviewed canonical Evidence.

Preferred sources:

```text
official issuer or protocol documentation
official redemption or terms documentation
official shutdown, migration, or lifecycle announcement
regulator or court document
primary reserve or legal document
high-quality reporting when primary material is unavailable
reviewed archive capture for unavailable historical pages
```

Evidence must state the claim scope it supports. A general product page is not automatically evidence for redemption rights, legal claims, lifecycle termination, or organization relationships.

## 7. Lifecycle and event rules

AUDD and NZDS may receive lifecycle and event deepening only when the event date, event type, status effect, and source scope are reviewable.

PR #357 must distinguish:

```text
launch or issuance start
service or minting suspension
redemption restriction
issuer transition
migration or successor relationship
orderly wind-down
termination
unresolved inactivity
```

Do not infer `terminated`, `inactive`, or successor relationships solely from a dead URL.

## 8. Organization relationship rules

AUDD and NZDS may receive organization and relationship changes only when the relevant issuer, operator, custodian, distributor, redeemer, or successor role is supported by canonical Evidence.

Do not create duplicate organizations or duplicate logical relationships.

## 9. Redemption rules

Redemption changes are authorized only for:

```text
audd
husd
nzds
```

The review must separate:

```text
direct issuer redemption
platform redemption
institutional-only access
retail access
minimum amount
fees
jurisdiction restrictions
holder claim type
historical versus current availability
```

Absence of a public redemption page does not prove that redemption was unavailable.

## 10. Legal-profile rules

Legal-profile changes are authorized only for:

```text
fei
husd
mim
```

Legal profiles must preserve explicit unknown states and must not transform governance, collateral, or protocol mechanics into unsupported legal conclusions.

## 11. Required preservation

PR #357 must preserve:

```text
110 canonical stable assets
4 canonical Market Access Records
PR #353 immutable planning snapshots
PR #354 reviewed handoff
PR #355 reviewed handoff
PR #356 reviewed handoff
Comparison Readiness semantics
Facet Freshness semantics
Timeline date semantics
Update Feed publication-date semantics
Maintenance Log public-safety boundary
canonical-only publication
no automatic monitoring promotion
no asset ranking
no composite score
```

## 12. Explicit non-goals

PR #357 does not:

```text
add a new stable asset
add or change Market Access Records
add a new page, explorer, dashboard, ranking, or navigation family
change Compare preset membership
change Comparison Readiness definitions
change Facet Freshness definitions
rewrite historical checkpoints
promote monitoring candidates automatically
force every target dimension to change
```

## 13. Validation

The dedicated workflow must validate:

```text
exact five-asset deterministic selection
completed Batch 1 and Batch 2 exclusions
PR #356 handoff identity and merge commit
authorized target dimensions and record families
no new canonical stable assets
Market Access count remains four
canonical data and references
evidence relations
Registry v2/v3 parity
release integrity
deterministic statistics and immutable history
Astro check and site build
public-layer safety
```

A post-change impact report must describe, per selected asset:

```text
changed record families
changed dimensions
new Evidence IDs
new Event IDs
new or changed relationship IDs
redemption changes
legal-profile changes
remaining unresolved target dimensions
```

## 14. Exit criteria

PR #357 completes when:

1. all five selected dossiers have been reviewed;
2. supported improvements are committed and unsupported gaps remain explicit;
3. no unrelated asset or record family has changed;
4. canonical counts and deterministic projections are synchronized;
5. dedicated validation and general CI are green;
6. a reviewed PR #357 handoff is committed for PR #358 Record Growth Batch 1.
