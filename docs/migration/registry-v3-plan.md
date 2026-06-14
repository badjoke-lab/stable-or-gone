# Registry v3 implementation plan

Status: specification
Migration type: additive
Starting baseline: 40 canonical stable assets

## Goal

Implement the extensions defined in:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
```

Registry v3 preserves existing IDs, slugs, public routes, canonical records, and Registry v2 compatibility.

## Non-goals

Registry v3 does not redesign the entire site, add live market data, create safety scores, auto-publish monitoring output, remove Registry v2 immediately, or treat simple wrappers and chain deployments as new canonical assets by default.

## Phase 1 — schema and templates

Add:

- legal-profile types and enums
- stable-asset relationship types and enums
- reserve-component types and enums
- `basket` in the core reference kinds
- approved backing and stabilization values
- yield source, accrual mechanism, and rate type
- deployment canonicality and origin fields
- additional Event detail kinds and typed detail objects
- JSON templates and examples

## Phase 2 — loaders and validators

Add canonical loaders:

```text
getLegalProfiles()
getStableAssetRelationships()
getReserveComponents()
```

Add validators for legal profiles, asset relationships, reserve components, Deployment v2, yield mechanics, new Event details, and Registry v3 completeness.

Extend the protected baseline, final-state validation, batch finalization guard, and public manifest counts.

## Phase 3 — migrate the existing forty records

For every canonical asset:

- create a legal profile, including explicit unknowns when necessary
- classify holder claim and reserve structure where supported
- classify every deployment
- complete yield mechanics
- create material migration, predecessor, successor, wrapper, and conversion relationships
- add known unknowns for unresolved legal, reserve, relationship, or deployment questions

Reserve components are added only when reliable structured data exists.

Suggested migration groups:

```text
A  issuer-backed and fiat-referenced assets
B  decentralized collateral and protocol assets
C  synthetic, yield, index, commodity, and experimental assets
D  collapsed, terminated, migrated, rebranded, and inactive assets
```

## Phase 4 — public presentation

Stable-asset pages should display economic class, legal classification, holder claim, reserve structure, redemption or exit model, yield mechanics, asset relationships, deployment canonicality, and unresolved questions.

Unknown and disputed values remain visible.

## Phase 5 — machine-readable public layer

Expose only reviewed Registry v3 canonical data. Exclude candidates, monitoring output, private research notes, and unsupported legal conclusions. Include schema version and stable references.

## Phase 6 — statistics

Implement `docs/stats-spec.md` after Registry v3 loaders are stable:

```text
stats generator
stats validator
stats JSON
checkpoint history
/stats/ page
navigation and methodology links
```

## Phase 7 — migration audit

Before 40 → 70 growth:

- all forty assets pass Registry v3 completeness rules
- every legal profile has evidence or an explicit unknown
- material lineage and wrapper relationships are represented
- every deployment has canonicality
- yield mechanics are complete
- no Registry v2 values conflict
- statistics match canonical loaders
- all build and public-layer checks pass

## Recommended PR sequence

```text
1  schema, enums, templates, and compatibility rules
2  loaders, validators, baseline groups, and finalization integration
3  migrate issuer-backed and fiat-referenced records
4  migrate protocol and collateralized records
5  migrate synthetic, yield, index, commodity, and experimental records
6  migrate historical and non-operating records
7  public-page presentation
8  machine-readable Registry v3 output
9  migration audit
```

Statistics implementation follows as separate PRs.

## Compatibility and rollback

- Every PR must be independently buildable.
- Registry v2 loaders and fields remain until a later cleanup plan.
- New public fields fall back to explicit unknown or unavailable states.
- A failed migration batch is reverted without altering unaffected records.
- Public URLs and canonical IDs remain protected.

## Completion criteria

```text
40/40 legal profiles present
40/40 yield profiles complete
67/67 current deployments classified or explicitly unknown
all material asset relationships represented
all new and existing validators pass
statistics consume Registry v3 loaders
public pages expose reviewed fields
machine-readable output is synchronized
migration audit merged
```

Relationship and reserve-component totals are evidence-driven and are not fixed in advance.
