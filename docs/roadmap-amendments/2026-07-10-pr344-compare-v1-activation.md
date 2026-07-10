# PR #344 Compare v1 activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
PR #342 facet-freshness derivation contract and validators: complete
PR #343 deterministic comparison projection and machine-readable output: complete
PR #344 /compare/ v1: active
PR #345 Compare presets: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #344 implements the first public comparison interface at:

```text
/compare/
```

The interface consumes the PR #343 deterministic public projection and keeps canonical value, Comparison Readiness, and freshness as separate axes.

## Selection boundary

```text
meaningful comparison minimum: 2 assets
maximum selection: 4 assets
URL state: ?assets=slug,slug,...
```

No default curated asset set is authorized in PR #344.

Compare presets remain a separate PR #345 workstream.

## Facet boundary

All nineteen projection dimensions are shown exactly once across four presentation groups.

The grouping changes presentation only. It does not alter:

- canonical values;
- dimension identity;
- readiness state;
- freshness state;
- evidence boundaries;
- unknown-state semantics.

## Interaction boundary

The Compare page must support:

- explicit two-to-four asset selection;
- duplicate-selection rejection;
- URL state restoration;
- browser back/forward restoration;
- four-asset URL bounding;
- copyable normalized comparison URL;
- expandable structured canonical fields.

## Responsive boundary

Desktop may use a locally scrollable comparison matrix.

Page-level horizontal overflow is forbidden.

Mobile must repeat asset identity inside each value cell and stack selected asset cells beneath each facet label.

## Navigation and discovery

PR #344 adds Compare to:

- primary navigation;
- Registry navigation group;
- Registry footer group;
- site architecture map;
- sitemap.

## Completion condition

PR #344 completes when:

- `/compare/` builds successfully;
- the four-group presentation config covers all nineteen dimensions exactly once;
- representative USDT/USDC/RLUSD URL state restores in order;
- three selected assets render nineteen rows and fifty-seven cells;
- readiness and freshness each render fifty-seven badges;
- five URL assets are bounded to four;
- duplicate selection is cleared and announced;
- control height is at least 44 px;
- desktop and mobile page-level horizontal overflow is zero or within the 2 px audit tolerance;
- desktop and mobile screenshots are reviewed;
- dedicated PR #344 validation, general CI, responsive accessibility, and representative screenshot workflows are green;
- no canonical data, readiness, freshness, comparison projection, or statistics-history values change.

## Next item

After PR #344 merges, PR #345 is authorized to implement Compare presets.

Presets may select assets or presentation groups only. They must not modify the underlying projection or introduce scoring.
