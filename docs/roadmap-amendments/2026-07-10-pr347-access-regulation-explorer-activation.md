# PR #347 Access & Regulation Explorer activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #345 Compare presets: complete
PR #346 access and regulation index generator: complete
PR #347 Access & Regulation Explorer: active
PR #348 change-timeline projection generator: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #347 implements a public Explorer for canonical legal, regulatory, and Market Access index context.

Route:

```text
/access-regulation/
```

The Explorer consumes only:

```text
/data/access-regulation-index.json
```

## Filter boundary

PR #347 exposes nine primary UI filters and preserves five additional PR #346 machine axes for later UI expansion.

The UI filter set covers:

- lifecycle;
- legal profile state;
- legal classification;
- legal jurisdiction;
- Regulatory Note record state;
- Regulatory Note type;
- regulatory jurisdiction;
- Market Access record state;
- Market Access state.

The Explorer does not rank results.

Result order remains canonical asset ID order.

## Absence boundary

The page must preserve:

```text
No Regulatory Note != no regulatory action
No Market Access Record != unavailable
Unclassified legal profile != illegal
Unclassified legal profile != unregulated
zero filter results != legal/regulatory/access conclusion
```

## Current Market Access boundary

Canonical Market Access remains empty at PR #347 start.

Therefore:

```text
market_access_record_state=no_canonical_record -> 110 assets
market_access_state -> no canonical filter values, control disabled
```

The Explorer must not fill Market Access options from PR #339 editorial research or monitoring output.

## Pagination boundary

```text
initial visible cards: 50
Show more increment: 25
```

Filtering applies to all 110 rows before visible slicing.

## Completion condition

PR #347 completes when:

- Explorer route builds successfully;
- nine UI filters bind valid PR #346 axes;
- five remaining machine axes remain preserved;
- all fourteen PR #346 axes are accounted for exactly once across UI and preserved sets;
- search and filter state are shareable through URL parameters;
- browser back/forward restores filter state;
- initial 110-result view renders 50 cards;
- Show more renders 75 cards;
- current checkpoint filter counts match deterministic index behavior;
- Market Access empty axes remain empty and disabled;
- readiness and freshness remain separate per layer;
- no ranking or score is introduced;
- desktop and mobile interaction audits pass;
- page-level horizontal overflow stays within tolerance;
- controls remain at least 44 px high;
- general CI, Site Architecture, responsive accessibility, screenshots, and dedicated PR #347 workflow are green;
- no canonical data, index data, readiness, freshness, or statistics-history values change.

## Next item

After PR #347 merges, PR #348 is authorized to build the change-timeline projection generator.

The next projection must preserve canonical date semantics and must not read monitoring-only or editorial-only observations as canonical events.
