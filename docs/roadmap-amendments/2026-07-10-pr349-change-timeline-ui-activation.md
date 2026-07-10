# PR #349 Change Timeline UI activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #347 Access & Regulation Explorer: complete
PR #348 change-timeline projection generator: complete
PR #349 Change Timeline UI: active
PR #350 Update Feed: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #349 implements the public Change Timeline at:

```text
/timeline/
```

The UI consumes only:

```text
/data/change-timeline.json
```

## Date semantics boundary

The UI must preserve:

```text
source_family
date_kind
date_semantics
boundary_kind
```

The UI must not convert review dates, freshness anchors, or observed-at timestamps into historical change items.

## Filter boundary

UI filters:

```text
source_family
date_kind
boundary_kind
asset_slug
year
jurisdiction
```

Machine-only preserved axis:

```text
change_type
```

The seven-axis PR #348 catalog set must remain complete across the two groups.

## Ordering boundary

The UI preserves PR #348 projection order:

```text
date descending
source priority
item_id ascending
```

No severity, popularity, risk, or recommendation ranking may be introduced.

## Result boundary

```text
initial visible items: 40
Show more increment: 20
```

Filtering applies to the full projection before visible slicing.

## Navigation and architecture boundary

PR #349 must register both:

```text
/data/change-timeline.json
/timeline/
```

in site architecture.

The UI route is added to Registry grouped navigation and Registry footer navigation while primary navigation remains at six items.

## Completion condition

PR #349 completes when:

- Timeline route builds successfully;
- six UI filters bind PR #348 catalogs;
- `change_type` remains machine-only;
- projection order is preserved;
- date semantics and boundary kind are visible per item;
- review/freshness/observation dates remain excluded as change items;
- initial render and Show more limits behave correctly;
- dynamic source/date intersections reconcile with projection rows;
- URL state restoration works on desktop and mobile;
- mobile and desktop overflow stay within tolerance;
- controls remain at least 44 px high;
- machine route and UI route architecture registrations are valid;
- manifest and sitemap discovery are valid;
- dedicated PR #349 workflow and general CI are green;
- no canonical data, PR #348 projection values, readiness, freshness, or statistics-history values change.

## Next item

After PR #349 merges, PR #350 is authorized to implement the public Update Feed.

The Update Feed must distinguish registry publication changes from historical subject changes represented by the Timeline.
