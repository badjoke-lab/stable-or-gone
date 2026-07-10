# PR #350 Update Feed activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #348 change-timeline projection generator: complete
PR #349 Change Timeline UI: complete
PR #350 Update Feed: active
PR #351 monthly maintenance log: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #350 upgrades the existing `/updates/` page into a searchable registry publication feed and publishes:

```text
/data/update-feed.json
```

## Publication/history boundary

The feed answers:

```text
When did the registry publish a reviewed public change?
```

The Change Timeline answers:

```text
When did the historical subject change?
```

The two dates must not substitute for one another.

## Source boundary

Feed source:

```text
data/registry-updates.json
```

Forbidden feed inputs:

```text
Change Timeline items
historical Events source
monitoring observations
monitoring candidates
editorial research
private notes
```

## Filter boundary

UI filters:

```text
category
year
route_family
```

Search covers publication title, summary, and related public paths.

## Result boundary

```text
initial visible updates: 20
Show more increment: 20
```

Feed order remains publication date descending, then update ID ascending.

## Architecture boundary

`/updates/` remains the existing Project navigation destination.

Only one route is added:

```text
/data/update-feed.json
```

Target architecture totals:

```text
41 total routes
30 HTML routes
11 machine-readable routes
```

Navigation destination counts remain unchanged.

## Completion condition

PR #350 completes when:

- deterministic feed binds only `data/registry-updates.json`;
- feed count and entry identity reconcile with source data;
- publication-date semantics are explicit;
- Timeline and historical Events are not feed inputs;
- filter catalogs recompute from feed entries;
- `/updates/` supports search, filters, URL state, empty state, and future Show more growth;
- page visibly explains Update Feed vs Change Timeline semantics;
- machine endpoint exactly matches deterministic artifact;
- manifest and architecture discovery are valid;
- dedicated PR #350 workflow and general CI are green;
- no canonical record data, Timeline projection values, readiness, freshness, or statistics-history values change.

## Next item

After PR #350 merges, PR #351 is authorized to implement the monthly maintenance log and close the current public-surface expansion sequence.
