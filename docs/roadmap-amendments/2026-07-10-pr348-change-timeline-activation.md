# PR #348 change timeline projection activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #346 access and regulation index generator: complete
PR #347 Access & Regulation Explorer: complete
PR #348 change-timeline projection generator: active
PR #349 Change Timeline UI: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #348 creates a deterministic canonical change-timeline projection at:

```text
/data/change-timeline.json
```

The projection preserves source-specific date semantics rather than collapsing every date into one generic timestamp.

## Canonical source boundary

Allowed source families:

```text
stable_asset_identity
canonical_event
organization_relationship
legal_classification
regulatory_note
market_access_record
```

Excluded inputs:

```text
editorial research
monitoring observations
monitoring candidates
private notes
source-discovery queues
unreviewed candidates
```

## Date boundary

Allowed date kinds:

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

Review dates, freshness anchors, evidence-access dates, and Market Access `observed_at` are not timeline change items.

## Market Access boundary

Canonical Market Access remains governed by PR #341.

At PR #348 start, the canonical Market Access entrypoint remains empty. Therefore the current projection must emit zero `market_access_record` timeline items.

PR #339 editorial research remains excluded.

## Determinism boundary

Timeline items are ordered by:

```text
date descending
source priority
item_id ascending
```

Source priority only stabilizes same-day ordering. It is not risk or importance ranking.

Cross-source provenance records are not deduplicated merely because they share a date or describe related history.

## Completion condition

PR #348 completes when:

- six canonical source families remain contract-bound;
- ten date kinds remain contract-bound;
- deterministic builder emits unique item IDs;
- date semantics and boundary kinds remain explicit;
- review/freshness dates remain excluded;
- filter catalogs reconcile from item rows;
- source/date summaries reconcile;
- repeated builds are byte-identical;
- current empty Market Access emits zero timeline items;
- built endpoint exactly matches the generator artifact;
- manifest and site architecture discovery are valid;
- dedicated PR #348 workflow and general CI are green;
- no canonical data, readiness, freshness, comparison values, access/regulation index values, or statistics-history values change.

## Next item

After PR #348 merges, PR #349 is authorized to implement the public Change Timeline UI.

PR #349 must consume the deterministic projection and preserve date semantics rather than presenting review or freshness dates as historical changes.
