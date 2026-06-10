# Stable or Gone Registry v2 Migration Plan

Updated: 2026-06-10
Status: active

## Purpose

Migrate the existing public SOG registry to a normalized Registry v2 model without breaking public URLs, removing existing records, or interrupting the static Cloudflare Pages site.

This is a staged migration of the existing product, not a rebuild.

## Pre-migration baseline

The protected minimum state is:

```txt
20 stablecoins
16 organizations currently stored as issuers / protocols
23 events
90 evidence records
40 reserve references
50 known unknowns
9 regulatory notes
37 deployments
```

The machine-readable baseline is stored in:

```txt
docs/migration/registry-v2-baseline.json
```

The baseline protects:

- minimum record counts
- the existing 20 stablecoin IDs and slugs
- the existing 16 organization IDs and slugs
- required route source files
- current stablecoin, issuer-compatibility, and event URL patterns

## Non-breaking rules

The migration must preserve:

```txt
/stablecoin/[slug]/
/issuer/[slug]/
/event/[id]/
```

Existing IDs and slugs must not be renamed during migration.

The public `/issuer/` route remains as a compatibility URL even after the internal record becomes `organization_entity`.

Every migration PR must pass:

```txt
npm run validate:baseline
npm run validate:data
npm run check
npm run build
```

## Final Registry v2 model

```txt
stablecoin_entity
organization_entity
stablecoin_organization_relationship
stablecoin_event
evidence
reserve_report
known_unknown
deployment
```

`regulatory_note` remains temporarily and is reviewed during Event v2 migration.

### Stablecoin current state

```txt
lifecycle_status
issuance_status
peg_reference
backing_types[]
stabilization_mechanism
governance_model
reserve_profile
redemption_profile
```

### Organization relationship

```txt
stablecoin_id
organization_id
role
start_date
end_date
status
evidence_ids[]
```

Initial role vocabulary:

```txt
legal_issuer
brand_owner
protocol_operator
governance_body
reserve_manager
custodian
redemption_agent
technology_provider
```

### Event subjects

```txt
subject_stablecoin_ids[]
subject_organization_ids[]
```

Type-specific event blocks may include:

```txt
depeg_detail
regulatory_detail
reserve_change_detail
redemption_change_detail
migration_detail
```

### Evidence subjects

```txt
stablecoin_ids[]
organization_ids[]
event_ids[]
claim_scopes[]
```

## Implementation schedule

### PR-041 — Baseline and migration contract

- add machine-readable baseline
- add regression validator
- protect current IDs, slugs, counts, data files, and route sources
- replace the former event-growth next step with Registry v2 migration
- do not change public data or UI

### PR-042 — Common data loaders

- centralize all direct JSON imports
- provide loader functions for stablecoins, organizations, events, evidence, reserve reports, known unknowns, regulatory notes, and deployments
- keep rendered output unchanged

### PR-043 — Schema v2 and compatibility validator

- define old-to-new field mapping
- accept old and new records during migration
- validate equivalence when both forms are present
- add templates for new Registry v2 records

### PR-044 — Organization and relationship migration

- reinterpret existing issuer/protocol records as organizations
- create relationship records for the existing 20 stablecoins
- add organization roles and relationship periods
- preserve `/issuer/` URLs

### PR-045 — Stablecoin status and classification migration

- migrate `status` to `lifecycle_status`
- add `issuance_status`
- replace mixed `collateral_model` usage with peg, backing, mechanism, and governance fields

### PR-046 — Reserve and redemption normalization

- introduce `reserve_profile` for current state
- keep reserve reports as history
- replace flat redemption fields with `redemption_profile`
- connect current profiles to evidence

### PR-047 — Event v2 migration

- migrate single subject IDs to subject arrays
- add depeg and regulatory detail blocks
- classify existing regulatory notes as event promotion, supplemental note, or duplicate consolidation

### PR-048 — Evidence many-to-many migration

- migrate single subject fields to subject arrays
- update reference validation
- preserve all existing evidence IDs and source URLs

### PR-049 — UI v2

- render lifecycle, issuance, redemption, peg, backing, mechanism, governance, organization roles, reserve profile, event details, regulatory history, deployments, evidence, and known unknowns
- update filters to Registry v2 fields

### PR-050 — Methodology, guides, and SEO

- document all Registry v2 definitions
- update guide and glossary language
- update JSON-LD, metadata, sitemap, and internal links

### PR-051 — Legacy cleanup and canonical consolidation

- remove old compatibility field dependencies
- consolidate PR-specific and `*-extra.json` layers into canonical files
- remove obsolete loader compatibility code
- verify no baseline record, route, or source loss

## Data growth pause

Routine record-growth work is paused through PR-051.

Allowed exceptions:

- corrections to material errors
- broken source or route fixes
- major new incidents that should not wait
- build or deployment repairs

After PR-051, record growth resumes using only Registry v2 records.

## Post-migration order

```txt
20 → 40 stablecoins
organization and relationship expansion
23 → 60+ events
evidence and reserve-history deepening
/events/depegs/
/events/regulatory/
/stats/
```
