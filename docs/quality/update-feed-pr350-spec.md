# SOG Update Feed — PR #350

Status: public registry publication-feed specification  
Updated: 2026-07-10

## 1. Purpose

PR #350 upgrades `/updates/` into a searchable public Update Feed for reviewed registry publication changes.

The feed answers:

```text
When did Stable or Gone publish a reviewed change?
```

It does not answer:

```text
When did the historical stablecoin subject change?
```

Historical subject change remains the responsibility of `/timeline/` and `/data/change-timeline.json`.

## 2. Source boundary

The feed uses exactly one source record set:

```text
data/registry-updates.json
```

Machine-readable endpoint:

```text
/data/update-feed.json
```

The builder must not read:

- Change Timeline projection items;
- canonical historical event records;
- monitoring observations;
- monitoring candidates;
- editorial research;
- private notes.

## 3. Date semantics

The source field `date` is projected as:

```text
publication_date
```

A publication date means the registry published or recorded a reviewed public change on that date.

It must not be interpreted as:

- event date;
- recovery date;
- effective date;
- legal effective boundary;
- relationship boundary;
- review date for every related canonical record;
- Market Access observation date.

## 4. Feed item model

Each machine-readable feed entry contains:

```text
update_id
publication_date
year
category
title
summary
related_paths
route_families
```

The page may use presentation copy overrides for human-readable title and summary text, but filter counts and machine-readable source fields remain bound to `registry-updates.json`.

## 5. Ordering

Feed order is deterministic:

```text
publication_date descending
then update_id ascending
```

The UI must preserve this order and must not sort by category, route count, popularity, severity, or any score.

## 6. Filters

PR #350 exposes three filters:

```text
category
year
route_family
```

The route-family token is deterministically derived from each item's `related_paths`.

Route-family tokens are presentation/discovery aids. They do not alter the underlying related paths.

## 7. Search

Substring search covers:

```text
title
summary
related public paths
```

Search does not inspect Timeline items, monitoring text, or editorial research.

The search query parameter is:

```text
q
```

## 8. URL state

Update Feed state is represented by:

```text
q
category
year
route_family
```

Rules:

- unknown values are ignored;
- empty values are removed;
- filter changes push URL state;
- search changes replace URL state after a short debounce;
- browser back/forward restores search and filter state;
- Copy filtered view copies the normalized current URL.

## 9. Result limits

Initial visible result limit:

```text
20
```

Show more increment:

```text
20
```

Filtering applies to all feed entries before visible slicing.

The current feed may fit entirely within the initial limit. The Show more contract exists for future growth and must remain deterministic.

## 10. Page boundary explanation

The page must visibly separate two public timelines.

### Update Feed

```text
registry publication change date
```

Examples:

- data records added or deepened;
- guide published;
- UI filter capability released;
- audited checkpoint recorded;
- correction or source review published.

### Change Timeline

```text
historical subject change date
```

Examples:

- event date;
- recovery date;
- relationship start/end;
- legal effective-from/effective-to;
- Regulatory Note subject date;
- canonical Market Access effective boundary.

One date type must not substitute for the other.

## 11. Machine-readable feed

`/data/update-feed.json` contains:

```text
feed identity
source binding
ordering contract
publication-vs-subject semantics
summary counts
filter catalogs
feed entries
input digest
```

Repeated builds from identical config and source inputs must be byte-identical.

## 12. Manifest integration

`/data/manifest.json` must advertise:

```text
public_files.update_feed: /data/update-feed.json
```

and declare:

```text
page: /updates/
source_boundary: reviewed_registry_publication_changes_only
date_field: publication_date
publication_change_not_subject_change: true
historical_subject_dates_are_feed_dates: false
timeline_items_are_feed_items: false
live_monitoring_feed: false
single_composite_score: false
risk_ranking: false
```

## 13. Architecture integration

`/updates/` remains an existing Project navigation route.

PR #350 adds only one new route:

```text
/data/update-feed.json
```

The machine endpoint is discovered through the data manifest.

The PR #350 architecture target is:

```text
41 total routes
30 HTML routes
11 machine-readable routes
3 dynamic route families
```

Navigation destination counts remain unchanged.

## 14. Validation requirements

PR #350 validators and Actions must prove:

1. config binds exactly `data/registry-updates.json`;
2. feed entry count equals the source array length;
3. update IDs are unique;
4. publication dates are valid day-precision dates;
5. order is publication-date-desc then update-ID-asc;
6. source titles, summaries, categories, and dates remain unchanged in the machine projection;
7. category, year, and route-family catalogs recompute exactly from feed entries;
8. summary counts reconcile with catalogs and entries;
9. repeated builds are byte-identical;
10. builder does not read Timeline, Events, monitoring, or editorial research sources;
11. page visibly explains publication-vs-history separation;
12. dynamic category and route-family filters match built feed catalogs;
13. dynamic nonzero and zero filter intersections behave correctly;
14. a dynamically selected unique related path yields one search result;
15. URL state restores on desktop and mobile;
16. controls remain at least 44 px high;
17. desktop and mobile page-level overflow remain within 2 px;
18. built machine endpoint matches deterministic artifact exactly;
19. manifest and site architecture discovery are valid;
20. general CI, Site Architecture, Responsive Accessibility, screenshots, and dedicated PR #350 workflow are green.

## 15. Non-goals

PR #350 does not:

- add new registry update records merely to populate the UI;
- derive feed dates from historical subject dates;
- ingest Change Timeline items;
- ingest monitoring output;
- ingest editorial research;
- create live notifications;
- create risk scoring;
- create ranking;
- change canonical stablecoin records;
- change PR #348 timeline projection values;
- change Comparison Readiness;
- change facet freshness;
- change immutable statistics history.

## 16. Next item

After PR #350 merges, PR #351 is authorized to implement the monthly maintenance log and close the current public-surface expansion sequence.
