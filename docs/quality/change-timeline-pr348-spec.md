# SOG change timeline projection — PR #348

Status: canonical public projection specification  
Updated: 2026-07-10

## 1. Purpose

PR #348 creates a deterministic public change-timeline projection from reviewed canonical SOG records.

The projection preserves the meaning of each date boundary rather than flattening all dates into one generic timestamp.

Public endpoint:

```text
/data/change-timeline.json
```

The projection is a historical record index, not a risk score, ranking, recommendation, or live monitoring feed.

## 2. Canonical source families

PR #348 uses six canonical source families:

```text
stable_asset_identity
canonical_event
organization_relationship
legal_classification
regulatory_note
market_access_record
```

The builder must not read:

- PR #339 editorial research;
- monitoring observations;
- monitoring candidates;
- private review notes;
- source-discovery queues;
- unreviewed candidates.

## 3. Date kinds

The projection defines ten date kinds:

```text
asset_launch_date
event_date
event_recovery_date
relationship_start_date
relationship_end_date
legal_effective_from
legal_effective_to
regulatory_note_date
market_access_effective_from
market_access_effective_to
```

Each item also carries:

```text
date_semantics
boundary_kind
source_family
source_record_id
change_type
```

The valid boundary kinds are:

```text
milestone
start
end
```

## 4. Excluded date semantics

The following must not become change items:

```text
last_verified_at
reviewed_at
last_checked_at
freshness_anchor_date
market_access_observed_at
evidence_accessed_at
```

These dates may describe review, observation, or evidence maintenance. They are not historical subject-change dates.

## 5. Stable-asset launch items

A stable asset with a canonical day-precision `launch_date` emits one launch item.

The item uses:

```text
source_family: stable_asset_identity
date_kind: asset_launch_date
boundary_kind: milestone
change_type: asset_launch
```

A launch event on the same date may coexist as a distinct canonical event item. PR #348 does not cross-source deduplicate semantically distinct provenance records.

## 6. Canonical event items

Every canonical event with a day-precision `event_date` emits an event item.

The event item preserves:

- event type;
- impact level;
- status effect;
- recovered flag;
- failure mechanism;
- event-detail kind when present;
- event confidence;
- asset and organization subjects.

If a canonical event records `recovery_date`, the recovery date emits a second item:

```text
date_kind: event_recovery_date
change_type: event_recovery
```

The recovery milestone remains linked to the same source event ID.

## 7. Organization relationship items

Canonical organization relationships may emit two date-boundary items:

```text
start_date -> relationship_start_date / start
end_date   -> relationship_end_date / end
```

The item preserves organization role and relationship status.

Relationship start and end dates are not inferred when absent.

## 8. Legal classification items

Each jurisdiction-scoped legal classification may emit:

```text
effective_from -> legal_effective_from / start
effective_to   -> legal_effective_to / end
```

The item preserves:

- legal classification;
- jurisdiction;
- authority or basis;
- confidence;
- asset and claim-against organization references.

Review dates do not become legal-change items.

## 9. Regulatory Note items

A canonical Regulatory Note with day-precision `note_date` emits one timeline item.

The item preserves:

- note type;
- jurisdiction;
- authority or source;
- canonical summary;
- confidence;
- asset and organization subjects.

The date semantics remain:

```text
canonical_regulatory_note_subject_date
```

PR #348 does not relabel Regulatory Note dates as review dates or effective dates.

## 10. Market Access items

Only canonical PR #341 Market Access Records may emit timeline items.

Each canonical record may emit:

```text
effective_from -> market_access_effective_from / start
effective_to   -> market_access_effective_to / end
```

The item may carry `observed_at` only as metadata. `observed_at` must not become a timeline change item.

At PR #348 start, canonical Market Access remains empty, so the current projection must emit zero `market_access_record` timeline items.

PR #339 editorial research remains excluded.

## 11. Item model

Every projected item contains:

```text
item_id
date
year
date_kind
date_semantics
boundary_kind
source_family
source_record_id
change_type
asset_ids
assets
organization_ids
organizations
jurisdiction_tokens
title
summary
confidence
metadata
```

Item IDs are deterministic and unique per source date boundary.

## 12. Sorting

Projection order is deterministic:

```text
date descending
then source priority
then item_id ascending
```

Source priority exists only to make same-day ordering stable. It is not a severity or importance ranking.

## 13. Filter catalogs

The projection emits deterministic filter catalogs for:

```text
source_family
date_kind
boundary_kind
change_type
asset_slug
year
jurisdiction
```

Catalog counts are timeline-item counts containing each token.

They are not risk, severity, or recommendation scores.

## 14. Data-safety contract

The projection must remain:

```text
canonical_only: true
includes_unreviewed_candidates: false
includes_internal_monitoring: false
includes_editorial_research: false
includes_private_notes: false
```

The timeline is not a live incident feed.

## 15. Manifest integration

`/data/manifest.json` must advertise:

```text
/data/change-timeline.json
```

and declare:

```text
source_boundary: reviewed_canonical_records_only
date_semantics_preserved: true
cross_source_deduplication: false
review_dates_excluded: true
freshness_dates_excluded: true
single_generic_timestamp: false
single_composite_score: false
risk_ranking: false
```

## 16. Validation requirements

PR #348 validators must prove:

1. six source families and ten date kinds remain contract-bound;
2. item IDs are unique;
3. item dates are valid day-precision dates;
4. items are sorted deterministically by date/source priority/item ID;
5. each item uses an allowed source family, date kind, and boundary kind;
6. filter catalogs recompute exactly from projected items;
7. source-family and date-kind summaries reconcile with filter catalogs;
8. asset and organization coverage summaries recompute from items;
9. review dates and freshness dates do not enter the item stream;
10. Market Access `observed_at` does not become a change item;
11. current empty canonical Market Access emits zero Market Access timeline items;
12. builder does not read editorial research or monitoring output;
13. repeated builds are byte-identical;
14. built public endpoint matches deterministic artifact exactly;
15. manifest discovery and date-semantics metadata are valid;
16. general CI and dedicated PR #348 workflow are green.

## 17. Non-goals

PR #348 does not:

- implement the Change Timeline UI;
- create live alerts;
- promote monitoring observations;
- promote editorial research;
- add canonical events;
- add Market Access Records;
- infer missing dates;
- convert review dates into historical events;
- convert freshness into change timing;
- cross-source deduplicate provenance records;
- create risk scoring;
- create ranking;
- change canonical record counts;
- change Comparison Readiness;
- change facet freshness;
- change immutable statistics history.

## 18. Next item

After PR #348 merges, PR #349 is authorized to implement the public Change Timeline UI.

The UI must consume this projection, expose the preserved date semantics, and must not present review or freshness dates as historical change events.
