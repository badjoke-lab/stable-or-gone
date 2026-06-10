# Stable or Gone Roadmap

Updated: 2026-06-10

## Current stage

SOG v0 is publicly live at:

```txt
https://sog.badjoke-lab.com/
```

Protected baseline:

```txt
20 stablecoins
16 organizations
20 stablecoin-organization relationships
23 events
90 evidence records
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

- protected minimum record counts
- protected current stablecoin and organization IDs/slugs
- protected route source files and URL patterns
- added baseline validation
- fixed the PR-041 to PR-051 schedule

### PR-042 — Common data loaders

- centralized repository JSON composition
- centralized stablecoin override application
- removed PR-specific JSON composition from public routes
- preserved public records, routes, filters, sorting, and display behavior

### PR-043 — Schema v2 and compatibility validator

- added Registry v2 enums and TypeScript types
- added old/new field mapping and migration templates
- added compatibility validation
- allowed legacy-only records during staged migration
- rejected conflicting values, malformed profiles, invalid enums, and broken references

## Current work item

```txt
PR-044 Organization and relationship migration
```

Goals:

```txt
create canonical organization records
create explicit stablecoin-organization relationship records
preserve all existing organization IDs and slugs
preserve /issuer/[slug]/ compatibility URLs
require every stablecoin to have at least one relationship
show organization roles and relationship periods publicly
keep legacy issuer files until PR-051 cleanup
```

## Full implementation schedule

```txt
PR-041 Baseline and migration contract — completed
PR-042 Common data loaders — completed
PR-043 Schema v2 and compatibility validator — completed
PR-044 Organization and relationship migration — in progress
PR-045 Stablecoin status and classification migration
PR-046 Reserve and redemption normalization
PR-047 Event v2 migration
PR-048 Evidence many-to-many migration
PR-049 UI v2
PR-050 Methodology, guides, and SEO
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
Registry v2 migration: PR-044 of 11
Completed: 3
In progress: 1
Remaining after current PR: 7
Record-growth phase: paused
Next after PR-044: PR-045 Stablecoin status and classification migration
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

- Every migration PR must pass baseline validation, canonical data validation, compatibility validation, Astro check, and build.
- Existing stablecoin, organization, event, and evidence IDs must be preserved.
- Existing slugs and public URL patterns must be preserved.
- Do not merge unrelated record-growth work into migration PRs.
- Fix build failures immediately.
- Keep legacy issuer compatibility files until PR-051 removes them safely.
- After every merge, report the full schedule, current position, merge result, validation state, and next PR.
