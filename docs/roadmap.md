# Stable or Gone Roadmap

Updated: 2026-06-12

## Current stage

SOG v0 is publicly live at:

```txt
https://sog.badjoke-lab.com/
```

Protected baseline:

```txt
20 stablecoins
20 Registry v2 classification records
20 Registry v2 reserve/redemption profiles
16 organizations
20 stablecoin-organization relationships
23 events
23 Event v2 detail records
90 evidence records
90 Evidence v2 relation projections
40 reserve references
50 known unknowns
9 regulatory notes
37 deployments
75 static pages
```

The project is in the Registry v2 migration phase. Routine record growth is paused until PR-051 completes, except for corrections, broken links, major incidents, and build/deployment repairs.

## Registry v2 objective

Normalize the existing registry without changing public URLs or losing records.

Final model:

```txt
stablecoin_entity
organization_entity
stablecoin_organization_relationship
stablecoin_event
evidence
evidence_relation
reserve_report
known_unknown
deployment
```

Protected public URL patterns:

```txt
/stablecoin/[slug]/
/issuer/[slug]/
/event/[id]/
```

## Completed migration work

### PR-041 — Baseline and migration contract

- protected minimum record counts, IDs, slugs, routes, and URL patterns
- added baseline validation
- fixed the PR-041 to PR-051 schedule

### PR-042 — Common data loaders

- centralized repository JSON composition and override application
- removed PR-specific JSON composition from public routes
- preserved public output and behavior

### PR-043 — Schema v2 and compatibility validator

- added Registry v2 enums, types, field mapping, and templates
- allowed staged legacy compatibility
- rejected conflicting values, malformed profiles, invalid enums, and broken references

### PR-044 — Organization and relationship migration

- created 16 canonical organization records
- created 20 explicit stablecoin-organization relationships
- added roles, periods, and relationship status
- preserved legacy issuer compatibility files and `/issuer/[slug]/` URLs
- switched public organization displays to the relationship layer

### PR-045 — Stablecoin status and classification migration

- created 20 Registry v2 classification records
- added lifecycle, issuance, peg, backing, stabilization mechanism, and governance fields
- preserved legacy status, peg, and collateral fields for compatibility
- added classification validation to the build chain

### PR-046 — Reserve and redemption normalization

- created 20 Registry v2 reserve/redemption profile records
- separated current reserve profile from reserve-report history
- separated redemption profile from legacy flat redemption fields
- added profile validation to the build chain

### PR-047 — Event v2 migration

- created 23 Event v2 detail overlay records
- added event subject stablecoin and organization arrays
- added event detail kind shells for depeg, regulatory, reserve-change, redemption-change, and migration contexts
- added Event v2 validation to the build chain

### PR-048 — Evidence many-to-many migration

- projected legacy evidence subjects into V2 stablecoin, organization, event, and claim-scope arrays
- added the evidence relation view layer
- preserved legacy evidence fields until PR-051
- added Evidence relation validation to the build chain

### PR-049 — UI v2

- surfaced Registry v2 classification fields on stablecoin pages
- surfaced reserve_profile and redemption_profile on stablecoin pages
- surfaced Event v2 subject arrays and detail overlays on event pages
- surfaced Evidence v2 claim-scope arrays on source tables
- preserved legacy public URLs and existing table structure

## Current work item

```txt
PR-050 Methodology, guides, and SEO
```

Goals:

```txt
update methodology copy for Registry v2 terminology
add public explanation of lifecycle, issuance, reserve, redemption, event, and evidence relation fields
align guides and glossary with the normalized model
prepare SEO and AI-readable descriptions without changing canonical URLs
leave legacy cleanup and canonical consolidation for PR-051
```

## Full implementation schedule

```txt
PR-041 Baseline and migration contract — completed
PR-042 Common data loaders — completed
PR-043 Schema v2 and compatibility validator — completed
PR-044 Organization and relationship migration — completed
PR-045 Stablecoin status and classification migration — completed
PR-046 Reserve and redemption normalization — completed
PR-047 Event v2 migration — completed
PR-048 Evidence many-to-many migration — completed
PR-049 UI v2 — completed
PR-050 Methodology, guides, and SEO — next
PR-051 Legacy cleanup and canonical consolidation
```

Detailed specifications:

```txt
docs/registry-v2-migration-plan.md
docs/migration/registry-v2-field-mapping.md
docs/migration/registry-v2-record-templates.md
```

## Current position

```txt
Registry v2 migration: PR-050 of 11
Completed: 9
In progress: 0
Remaining: 2
Record-growth phase: paused
Next: PR-050 Methodology, guides, and SEO
```

## Post-migration priorities

```txt
20 → 40 stablecoins
organization and relationship expansion
23 → 60+ events
evidence and reserve-history deepening
/events/depegs/
/events/regulatory/
/stats/
```

## Operating rules

- Every migration PR must pass baseline validation, canonical data validation, compatibility validation, classification validation, profile validation, Event v2 validation, Evidence relation validation, Astro check, and build.
- Existing stablecoin, organization, event, and evidence IDs must be preserved.
- Existing slugs and public URL patterns must be preserved.
- Do not merge unrelated record-growth work into migration PRs.
- Fix build failures immediately.
- Keep legacy compatibility fields and files until PR-051 removes them safely.
- After every merge, report the full schedule, current position, merge result, validation state, and next PR.
