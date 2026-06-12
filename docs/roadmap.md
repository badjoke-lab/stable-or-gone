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

The Registry v2 migration is complete. Routine record growth may resume after build/deployment verification, while corrections, broken links, major incidents, and build/deployment repairs remain allowed at any time.

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

### PR-050 — Methodology, guides, and SEO

- updated methodology copy for Registry v2 terminology
- added public explanations of lifecycle, issuance, reserve, redemption, event, and evidence relation fields
- aligned guides, glossary, and about pages with the normalized model
- added `public/llms.txt` for AI-readable site guidance
- preserved canonical public URL patterns

### PR-051 — Legacy cleanup and canonical consolidation

- consolidated public navigation wording around organizations while keeping `/issuer/[slug]/` compatibility URLs
- moved organization detail display toward Registry v2 lifecycle, event detail, and evidence-scope terminology
- added final Registry v2 validation
- added final validation to the build chain
- kept legacy compatibility fields available for staged data cleanup

## Current work item

```txt
Registry v2 migration complete
```

Next priorities:

```txt
run build/deployment verification
resume controlled record growth
expand 20 → 40 stablecoins
expand events from 23 → 60+
deepen evidence and reserve-history records
add /events/depegs/
add /events/regulatory/
add /stats/
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
PR-050 Methodology, guides, and SEO — completed
PR-051 Legacy cleanup and canonical consolidation — completed
```

Detailed specifications:

```txt
docs/registry-v2-migration-plan.md
docs/migration/registry-v2-field-mapping.md
docs/migration/registry-v2-record-templates.md
```

## Current position

```txt
Registry v2 migration: completed
Completed: 11
In progress: 0
Remaining: 0
Record-growth phase: ready to resume after build/deployment verification
Next: controlled record growth and post-migration expansion
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

- Every change must preserve existing stablecoin, organization, event, and evidence IDs unless a dedicated migration documents the replacement.
- Existing slugs and public URL patterns must be preserved.
- Public `/issuer/[slug]/` compatibility routes must remain available after internal organization consolidation.
- Fix build failures immediately.
- Record growth must remain source-backed and must not weaken baseline validation.
- After every migration or expansion batch, report the schedule position, validation state, and next work item.
