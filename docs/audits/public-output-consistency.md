# Public Output Consistency Audit

Date: 2026-06-19

## Canonical checkpoint

```text
Stablecoins 70
Organizations 59
Relationships 72
Events 92
Evidence 279
Reserve reports 72
Deployments 101
Known unknowns 153
Regulatory notes 9
```

## Finding

The home page, stablecoin list, event list, version endpoint, and public manifest used the current canonical counts. The public organization list returned an older 16-organization / 20-stablecoin view.

The source file at the production build commit already generated the organization page from the same canonical registry loader and should have rendered 59 organizations and 72 relationships. No old static organization page was found in the repository. The mismatch therefore points to stale route-level HTML in the deployed Pages output or cache.

The existing build checked JSON counts and route existence, but did not compare visible HTML counts, list links, sitemap entries, or known legacy strings. README also contained an obsolete 40-record checkpoint.

## Canonical generation path

`docs/migration/registry-v2-baseline.json` lists the canonical data groups. `src/lib/data/registry` combines those groups for the human-readable pages. The public version, manifest, and sitemap are generated or validated against the same data.

Reserve reports, redemption profiles, deployments, regulatory notes, known unknowns, and evidence are displayed within stablecoin detail pages rather than separate list routes.

## Repair

- compare built HTML counts with canonical data
- count stablecoin, organization, and event detail links
- verify all detail routes and supporting-record references
- verify machine-readable counts, schema metadata, and canonical-only flags
- verify sitemap coverage
- reject known legacy count text
- require cache revalidation for HTML and public machine output
- add canonical language alternate metadata
- run a post-deploy public-origin check after every main push
- update README to the current checkpoint

No duplicate old route was found, so no route is removed in this repair.

Launch-date Batch O remains paused until this repair is merged and the production check succeeds.
