# PR #351 monthly maintenance log activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #349 Change Timeline UI: complete
PR #350 Update Feed: complete
PR #351 monthly maintenance log: active
current public-surface expansion sequence: closes after PR #351
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #351 publishes public-safe monthly maintenance checkpoints at:

```text
/maintenance/
/data/maintenance-log.json
```

## Public boundary

Allowed public content:

```text
aggregate outcomes
contract check results
public checkpoint counts
released public surfaces
next public maintenance priorities
```

Forbidden public content:

```text
internal monitoring rows
unreviewed candidates
private notes
private source queues
candidate URLs
secrets
```

## Month policy

```text
one entry per month
current month may be in_progress
closed months immutable
closed history grows append-only
```

PR #351 starts July 2026 as `in_progress`; month-end closure is separate maintenance work.

## Required check boundary

Every monthly entry records:

```text
canonical_data_validation
registry_v2_v3_parity
statistics_history_immutability
site_architecture_contract
responsive_accessibility_contract
publication_feed_contract
```

Check results remain operational outcomes only and never become stablecoin risk scoring.

## Architecture target

```text
43 total routes
31 HTML routes
12 machine-readable routes
14 grouped navigation items
2 utility destinations
16 architecture navigation destinations
```

Primary navigation remains six items.

## Completion condition

PR #351 completes when:

- Maintenance page and machine endpoint build successfully;
- July 2026 in-progress entry validates;
- required check set and result vocabulary validate;
- current public counts reconcile;
- closed-month immutability and append-only policy are explicit;
- public object key whitelists validate;
- private/internal/monitoring boundaries are explicit;
- deterministic artifact and built endpoint match exactly;
- Project navigation, About menu, footer, sitemap, manifest, global shell, and site architecture are valid;
- desktop/mobile screenshot audits pass;
- general CI and all non-regression workflows are green;
- no canonical record data, Timeline projection, Update Feed source entries, readiness, freshness, or statistics history values change.

## Sequence closure

After PR #351 merges:

```text
current public-surface expansion sequence: complete
```

The default next operating mode returns to:

- evidence-backed record growth;
- Market Access promotion review under PR #341 governance;
- monitoring review without automatic public promotion;
- corrections and source-link maintenance;
- monthly maintenance log updates.

A new public-surface PR chain requires a separate reviewed roadmap decision.
