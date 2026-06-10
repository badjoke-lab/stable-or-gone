# Stable or Gone Roadmap

Updated: 2026-06-10

## Current stage

SOG v0 is publicly live at:

```txt
https://sog.badjoke-lab.com/
```

Current protected baseline:

```txt
20 stablecoins
16 organizations currently stored as issuers / protocols
23 events
90 evidence records
40 reserve references
50 known unknowns
9 regulatory notes
37 deployments
75 static pages
```

The project is in the Registry v2 migration phase. Routine record growth is paused until PR-051 completes, except for corrections, broken links, major incidents, and build/deployment repairs.

## Completed major work

```txt
foundation docs and data placeholders
Astro scaffold and Terminal Registry UI
public v0 foundation
issuer/event/report/evidence/redemption/regulatory/deployment UI
seed expansion to 20 stablecoin records
source-deepening for core and later records
registry and event filtering / sorting
shared stablecoin detail view
guides and glossary
registry updates page
public SEO baseline
validator and supplemental data integration
event expansion from 3 to 23 records
public copy cleanup through 2026-06-10
PR-041 Registry v2 baseline and migration contract
```

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

## Current work item

```txt
PR-042 Common data loaders
```

Goals:

```txt
centralize all repository JSON composition
remove PR-specific JSON knowledge from public pages
keep rendered output, record counts, routes, filters, and sort behavior unchanged
prepare a single compatibility boundary for Schema v2
```

## Full implementation schedule

```txt
PR-041 Baseline and migration contract — completed
PR-042 Common data loaders — in progress
PR-043 Schema v2 and compatibility validator
PR-044 Organization and relationship migration
PR-045 Stablecoin status and classification migration
PR-046 Reserve and redemption normalization
PR-047 Event v2 migration
PR-048 Evidence many-to-many migration
PR-049 UI v2
PR-050 Methodology, guides, and SEO
PR-051 Legacy cleanup and canonical consolidation
```

Detailed specification:

```txt
docs/registry-v2-migration-plan.md
```

## Current position

```txt
Registry v2 migration: PR-042 of 11
Completed: 1
In progress: 1
Remaining after current PR: 9
Record-growth phase: paused
Next after PR-042: PR-043 Schema v2 and compatibility validator
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

- Every migration PR must pass baseline validation, canonical data validation, Astro check, and build.
- Existing stablecoin, organization, event, and evidence IDs must be preserved.
- Existing slugs and public URL patterns must be preserved.
- Do not merge unrelated record-growth work into the migration PRs.
- Fix build failures immediately.
- Keep compatibility files until PR-051 removes them safely.
- After every merge, report the full schedule, current position, merge result, validation state, and next PR.
