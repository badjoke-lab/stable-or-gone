# SOG Compare v1 — PR #344

Status: canonical UI implementation specification  
Updated: 2026-07-10

## 1. Purpose

PR #344 implements the first public interactive comparison page:

```text
/compare/
```

The page consumes the deterministic PR #343 public projection and presents canonical values, Comparison Readiness, and facet freshness as separate axes.

The page is not a ranking, recommendation, risk score, safety score, legal opinion, or investment assessment.

## 2. Selection model

The v1 selection contract is:

```text
minimum meaningful comparison: 2 assets
maximum selected assets: 4
selection source: explicit user selection or URL state
```

PR #344 does not define curated Compare presets. Presets remain PR #345.

The page must not silently choose a default asset set when the URL contains no selection.

## 3. Shareable URL state

Selected asset slugs are encoded as:

```text
/compare/?assets=usdt,usdc,rlusd
```

Rules:

- unknown slugs are ignored;
- duplicate slugs are ignored during URL restore;
- input order is preserved;
- more than four valid slugs are bounded to the first four;
- user slot changes update browser history;
- back/forward navigation restores selection;
- the Copy comparison link action copies the current normalized URL.

## 4. Facet organization

All nineteen PR #343 projection dimensions are shown exactly once and grouped into four public sections:

```text
Identity and current state
Mechanism, reserves, and redemption
Legal, regulatory, and access context
Evidence and uncertainty
```

The grouping is a presentation layer only. It does not change dimension identity, readiness, freshness, or canonical value semantics.

Binding configuration:

```text
config/compare-v1-dimensions.json
```

## 5. Cell contract

Every selected asset × facet cell contains:

```text
canonical value summary
readiness badge
freshness badge
freshness anchor context
expandable canonical field detail
```

The cell must preserve explicit values such as:

```text
unknown
source_review_needed
not_recorded
no_canonical_record
undated
stale
```

The UI must not convert these states into positive or negative scores.

## 6. Value presentation

The first visible line is a dimension-specific human-readable summary.

The full canonical value object remains available through an expandable details disclosure. The disclosure must render structured data as labeled fields and record lists, not as raw JSON text.

Repeated rows remain bounded to the canonical projection supplied by PR #343.

## 7. Readiness presentation

Public readiness is displayed independently from freshness.

Example states include:

```text
ready
ready_with_unknowns
needs_normalization
integrity_blocked
```

PR #344 does not reinterpret these states.

## 8. Freshness presentation

Freshness is displayed independently from readiness and value.

The UI shows:

```text
freshness state
anchor date when present
age_days when present
date semantics when no anchor is present
```

`undated` is not displayed as stale.

`no_canonical_record` is not displayed as unavailable, illegal, banned, or not applicable.

## 9. Market Access boundary

Canonical Market Access Records remain empty at the start of PR #344.

The Compare page therefore shows the PR #343 projected state:

```text
record_state: no_canonical_record
record_count: 0
```

PR #339 editorial research is not read by the Compare page.

## 10. Responsive behavior

Desktop and wide tablet layouts use a local horizontally scrollable matrix when necessary.

Page-level horizontal overflow is forbidden.

At the compact breakpoint, each facet becomes:

```text
facet label
asset 1 cell
asset 2 cell
asset 3 cell
asset 4 cell
```

Each mobile asset cell repeats the asset identity so the reader does not need to rely on an off-screen column header.

Interactive controls must remain at least 44 px high.

## 11. Accessibility

The page must provide:

- one `h1`;
- labeled stablecoin selectors;
- live status for selection state;
- assertive duplicate-selection error reporting;
- keyboard-usable native selects and details disclosures;
- visible focus styling inherited from the global shell;
- semantic links back to stablecoin dossier pages;
- no page-level horizontal overflow.

## 12. Navigation and discovery

`/compare/` must be registered in:

- primary navigation;
- Registry navigation group;
- Registry footer group;
- site architecture map;
- sitemap.

The PR #343 machine-readable endpoint remains available separately at:

```text
/data/comparison.json
```

## 13. Validation requirements

PR #344 validators and Actions must prove:

1. the public grouping covers all nineteen projection dimensions exactly once;
2. page selection is bounded to two-to-four intended comparison slots;
3. URL state restores three representative assets in order;
4. five valid URL assets are bounded to four;
5. duplicate slot selection is cleared and announced;
6. three assets render four groups, nineteen facet rows, and fifty-seven value cells;
7. readiness and freshness each render fifty-seven badges for the representative three-asset comparison;
8. interactive controls remain at least 44 px high;
9. desktop and mobile have no page-level horizontal overflow;
10. general CI, responsive accessibility, full-page screenshot capture, and dedicated PR #344 workflow are green.

## 14. Non-goals

PR #344 does not:

- define Compare presets;
- define curated asset groups;
- rank assets;
- calculate a score;
- publish editorial research as canonical data;
- change PR #343 projection values;
- change readiness;
- change freshness derivation;
- change canonical record counts;
- change immutable statistics history.

## 15. Next item

After PR #344 merges, PR #345 is authorized to define Compare presets.

Presets must only select assets and/or visible facet groups. They must not modify underlying values, readiness, freshness, evidence boundaries, or scoring policy.
