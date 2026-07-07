# PR #327 statistics foundation activation

Status: active roadmap amendment  
Updated: 2026-07-08

## Purpose

This amendment records the transition from completed immutable statistics checkpoint history to the active public statistics foundation.

It supersedes stale current-position wording that still describes PR #326 as active or PR #327 as next.

## Authoritative current workstream

```text
PR #325 deterministic statistics generator and validator: complete
PR #326 immutable checkpoint history: complete
PR #327 /stats/ foundation: active
PR #328 historical, deployment, organization, and data-quality statistics: next
```

## PR #327 boundary

Binding specifications:

```text
docs/stats-spec.md
docs/stats-history-spec.md
docs/stats-foundation-spec.md
```

PR #327 may:

- publish the first `/stats/` foundation page;
- publish `/data/stats.json` from the deterministic PR #325 generator;
- publish `/data/stats-history.json` from the canonical PR #326 history source;
- expose eight current KPI blocks;
- expose lifecycle group distribution and exact lifecycle status counts;
- expose reviewed checkpoint history without fabricating trend data;
- synchronize navigation, sitemap, site architecture, manifest, `llms.txt`, and `ai.txt` with the public statistics routes;
- add source-level and built-output validation for the statistics foundation.

PR #327 does not:

- implement the full PR #328 analysis surface;
- add live price, market-cap, APY, or yield-ranking data;
- add safety or risk scores;
- reconstruct unaudited historical checkpoints;
- mutate statistics history automatically;
- change canonical registry records.

## Phase D sequence

```text
PR #325 deterministic statistics generator and validator — complete
PR #326 immutable checkpoint history — complete
PR #327 /stats/ foundation — active
PR #328 historical, deployment, organization, and data-quality statistics — next
```

## Completion condition

PR #327 is complete when:

- `/stats/` builds and is navigable;
- `/data/stats.json` matches the deterministic statistics model;
- `/data/stats-history.json` matches canonical checkpoint history;
- navigation, sitemap, architecture, manifest, and AI discovery surfaces are synchronized;
- Astro check and static build pass;
- source and built-output statistics-foundation validators pass;
- canonical registry counts and protected package inputs remain unchanged;
- the exact PR head is green across required CI and independent audit workflows.

## Data preservation

The audited 100-asset canonical checkpoint remains unchanged. `package.json` and `package-lock.json` remain protected and unchanged in PR #327.
