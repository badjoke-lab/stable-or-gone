# Stable or Gone Roadmap

Updated: 2026-06-14

## Current stage

SOG is publicly live at:

```text
https://sog.badjoke-lab.com/
```

The Registry v2 normalization and the controlled 20 → 40 growth phase are complete.

Protected canonical checkpoint:

```text
40 stable assets
32 organizations
40 stablecoin-organization relationships
40 classification records
40 reserve/redemption profiles
48 events
48 Event v2 detail records
182 evidence records
182 evidence relation projections
42 reserve-report references
93 known unknowns
9 regulatory notes
67 deployments
```

The batch finalization guard is active and part of both `npm run build` and CI.

## Current objective

Before resuming large-scale record growth, SOG will:

```text
1. freeze the 40-record checkpoint
2. finalize the stable-asset scope and taxonomy
3. specify Registry v3 additive fields
4. specify and implement generated statistics
5. create the reviewed 40 → 70 Candidate Master
6. resume controlled five-record growth batches
```

Record corrections, broken-link fixes, major incident updates, and build or deployment repairs remain allowed at any time.

## Canonical model

Current Registry v2 model:

```text
stable_asset
organization
stablecoin_organization_relationship
event
event_detail
evidence
evidence_relation
reserve_report
known_unknown
regulatory_note
deployment
```

Planned Registry v3 additions:

```text
legal_profile
stable_asset_relationship
reserve_component
deployment_v2_fields
expanded_yield_mechanics
expanded_event_details
```

Registry v3 is additive. It must preserve current IDs, slugs, routes, and the existing Registry v2 compatibility layer until a dedicated cleanup phase proves removal safe.

## Protected public URL patterns

```text
/stablecoin/[slug]/
/issuer/[slug]/
/event/[id]/
```

Planned addition:

```text
/stats/
```

The `/issuer/[slug]/` route remains a compatibility route even where the internal entity is described as an organization.

## Completed phases

### Registry v2 normalization

Completed work includes:

- baseline and migration contract
- common data loaders
- Registry v2 schema and compatibility validation
- organization and relationship migration
- stablecoin classification normalization
- reserve and redemption profiles
- Event v2 details
- evidence many-to-many projection
- Registry v2 UI and methodology alignment
- final validation and legacy compatibility retention

Historical specifications remain in:

```text
docs/registry-v2-migration-plan.md
docs/migration/registry-v2-field-mapping.md
docs/migration/registry-v2-record-templates.md
```

### Controlled record growth: 20 → 40

Completed batches expanded coverage across:

- major protocol stablecoins
- RWA-backed stablecoins
- synthetic and delta-neutral designs
- floating, index, commodity, and experimental stable-value assets
- historical failures, migrations, terminations, and restricted assets
- euro-denominated and non-USD examples

The completed 28 → 40 phase is recorded in:

```text
docs/record-growth-28-to-40.md
```

### Forty-record checkpoint protection

Completed:

- batch finalization validator
- Candidate Master and canonical count checks
- classification/profile/event-detail coverage checks
- runtime loader and compatibility loader checks
- temporary batch artifact rejection
- CI and build integration

Specification:

```text
docs/batch-finalization-guard.md
```

## Next implementation sequence

```text
PR A  Update canonical scope, taxonomy, data-model, stats, and growth specifications
PR B  Implement Registry v3 additive schema and validators
PR C  Migrate the existing 40 records to required Registry v3 coverage
PR D  Add generated stats data and stats validation
PR E  Add the public /stats/ page
PR F  Freeze the reviewed 40 → 70 Candidate Master
PR G  Batch F: 40 → 45
PR H  Batch G: 45 → 50
PR I  Batch H: 50 → 55
PR J  Batch I: 55 → 60
PR K  Batch J: 60 → 65
PR L  Batch K: 65 → 70
PR M  Seventy-record quality and coverage audit
```

The exact GitHub PR numbers are assigned at implementation time. The logical order is fixed.

## Registry v3 priorities

Registry v3 must add:

- legal classification and holder-claim structure
- stable-asset-to-stable-asset relationships
- structured reserve components
- deployment canonicality and origin relationships
- structured yield source, accrual mechanism, and rate type
- basket as a first-class reference target
- security, oracle, collateral, insolvency, governance, bridge, launch, and termination event details

Full specification:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/migration/registry-v3-plan.md
```

## Statistics priorities

SOG statistics must explain the registry, not rank assets.

The statistics system will cover:

- lifecycle groups
- asset classes and reference targets
- backing and stabilization mechanisms
- issuance and redemption access
- legal and yield classifications
- failures, depegs, recoveries, wind-downs, and migrations
- evidence and data-quality coverage

It will not include live price, market-cap, yield, or safety rankings.

Specification:

```text
docs/stats-spec.md
```

## Record-growth priorities

The next checkpoint is 70 canonical assets.

Default batch size:

```text
5 stable assets per PR
```

Complex batches may be reduced to three or four assets when they include major collapses, multiple migrations, complex legal structures, or extensive deployment histories.

Growth specification:

```text
docs/record-growth-40-to-70.md
```

## Operating rules

- Preserve existing stable-asset, organization, event, and evidence IDs unless a dedicated migration documents the replacement.
- Preserve existing slugs and public URL patterns.
- Keep `/issuer/[slug]/` compatibility routes available.
- Treat chain-specific native, bridged, wrapped, and legacy deployments as deployment records unless identity analysis requires a separate canonical asset.
- Do not promote simple wrappers, vault shares, or LP tokens as independent canonical assets by default.
- Keep candidates, canonical data, loaders, baseline counts, validators, public output, and review documentation synchronized.
- Fix build failures immediately.
- Keep record growth source-backed and review-gated.
- Do not auto-publish research candidates or monitoring output.
- After each migration or growth batch, report the current checkpoint, validation result, and next work item.
