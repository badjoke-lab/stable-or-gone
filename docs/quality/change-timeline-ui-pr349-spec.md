# SOG Change Timeline UI — PR #349

Status: canonical UI implementation specification  
Updated: 2026-07-10

## 1. Purpose

PR #349 implements the public Change Timeline at:

```text
/timeline/
```

The page consumes the deterministic PR #348 projection:

```text
/data/change-timeline.json
```

The UI exposes reviewed canonical change history while preserving each source date's meaning. It is not a live incident feed, risk score, ranking, recommendation, legal opinion, or investment assessment.

## 2. Source boundary

The UI fetches only the PR #348 public projection.

It must not fetch or import:

- editorial research;
- monitoring observations;
- monitoring candidates;
- private notes;
- source-discovery queues;
- unreviewed candidates.

## 3. Filter boundary

The PR #348 projection exposes seven machine-readable catalogs.

PR #349 exposes six in the public UI:

```text
source_family
date_kind
boundary_kind
asset_slug
year
jurisdiction
```

The remaining catalog:

```text
change_type
```

remains machine-readable and is preserved for later UI expansion.

The UI and preserved machine axis must account for the exact seven-axis PR #348 filter set.

## 4. Search

The Timeline supports case-insensitive substring search across:

- title;
- summary;
- change type;
- source family;
- date kind;
- asset name;
- asset symbol;
- asset slug;
- organization name;
- jurisdiction token.

The search query parameter is:

```text
q
```

Search does not inspect monitoring or editorial text.

## 5. URL state

Timeline state is encoded through:

```text
q
source
date_kind
boundary
asset
year
jurisdiction
```

Rules:

- filter values are single-value in v1;
- unknown values are ignored;
- empty values are removed;
- filter changes push URL state;
- search changes replace URL state after a short debounce;
- browser back/forward restores search and filter state;
- Copy filtered view copies the normalized current URL.

## 6. Ordering

The UI must preserve PR #348 projection order exactly.

The UI must not sort by:

- severity;
- source family;
- asset popularity;
- change type;
- jurisdiction;
- item count;
- any synthetic score.

The projection order remains:

```text
date descending
source priority
item_id ascending
```

Source priority only stabilizes same-day output and must not be described as importance ranking.

## 7. Result limits

Initial visible item limit:

```text
40
```

Show more increment:

```text
20
```

Filtering applies to the full projection before visible slicing.

## 8. Timeline item presentation

Every rendered item must visibly expose:

```text
date
source family
date kind
boundary kind
title
summary
linked asset subjects
linked organization subjects
```

An expandable metadata region exposes:

```text
source family
date kind
boundary kind
change type
date semantics
source record ID
jurisdiction tokens when present
confidence when present
```

The UI must not collapse date kind and date semantics into a generic label such as `timestamp`.

## 9. Date-semantics boundary

The page must explicitly explain that historical subject dates may include:

- asset launch dates;
- canonical event dates;
- recovery dates;
- organization relationship start/end dates;
- legal effective-from/effective-to dates;
- Regulatory Note dates;
- canonical Market Access effective-from/effective-to dates.

The page must also explicitly explain that the following are not timeline change items:

- reviewed-at dates;
- last-verified dates;
- freshness-anchor dates;
- evidence-access dates;
- Market Access observed-at timestamps.

## 10. Market Access boundary

Only canonical PR #341 Market Access Records may appear through PR #348 projection items.

PR #339 editorial research must not enter the Timeline.

At PR #349 start, canonical Market Access remains empty, so the current projection contains no `market_access_record` items. The UI must not manufacture them from editorial or monitoring sources.

## 11. Result links

Asset subjects with canonical slugs link to:

```text
/stablecoin/{slug}/
```

Organization subjects are displayed as canonical names. PR #349 does not add a new organization route mapping layer beyond the projection references already present.

## 12. Responsive behavior

Desktop uses a two-column timeline row:

```text
date column | item content
```

Mobile stacks the date band above item content.

The page must preserve:

- page-level horizontal overflow at or below 2 px audit tolerance;
- controls at least 44 px high;
- readable body text using site readability tokens;
- semantic badges per rendered item;
- expandable metadata without overflow;
- stable asset links.

## 13. Navigation and discovery

`/timeline/` must be registered in:

- Registry navigation group;
- Registry footer group;
- site architecture map;
- sitemap;
- machine-readable manifest main routes;
- `change_timeline_projection.ui` in the manifest.

`/data/change-timeline.json` must also be registered in site architecture as a machine-readable data-manifest route.

Primary navigation remains unchanged at six items.

## 14. Validation requirements

PR #349 validators and Actions must prove:

1. six UI filters bind valid PR #348 catalogs;
2. `change_type` remains the one preserved machine-only catalog;
3. UI and preserved sets cover the exact seven PR #348 catalogs;
4. source projection is non-empty and contract-valid;
5. initial rendered item limit is 40;
6. Show more adds 20 items when more items remain;
7. source-family filter counts match projection catalogs dynamically;
8. source-family/date-kind intersections match projection rows dynamically;
9. a dynamically selected zero intersection renders the empty state correctly;
10. a unique asset slug chosen from projection catalogs yields one search result and restores through URL state on mobile;
11. every visible item has exactly three semantic badges: source, date kind, boundary;
12. URL state restores on desktop and mobile;
13. controls remain at least 44 px high;
14. desktop and mobile page-level horizontal overflow stay within 2 px;
15. built Timeline route and source projection contracts are valid;
16. manifest and sitemap discovery are valid;
17. general CI, Site Architecture, Responsive Accessibility, screenshots, and dedicated PR #349 workflow are green.

## 15. Non-goals

PR #349 does not:

- add canonical events;
- add Market Access Records;
- promote editorial research;
- ingest monitoring output;
- create alerts;
- infer missing dates;
- convert review dates into historical events;
- convert freshness into event timing;
- deduplicate semantically distinct provenance items;
- create risk scoring;
- create ranking;
- resort the projection;
- change canonical record counts;
- change Comparison Readiness;
- change facet freshness;
- change immutable statistics history.

## 16. Next item

After PR #349 merges, PR #350 is authorized to implement the public Update Feed.

The Update Feed must distinguish registry publication changes from historical subject changes represented by the Change Timeline.
