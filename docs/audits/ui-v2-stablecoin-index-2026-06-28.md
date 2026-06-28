# UI v2 Stablecoins index implementation audit

Date: 2026-06-28  
Program: Modern Data Product UI v2  
Plan item: PR #210 — approved Stablecoins index

## Authority

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/02-stablecoin-index.webp
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

## Implemented composition

The Stablecoins index now uses:

1. approved v2 page hero;
2. four dynamic canonical metric cards;
3. search, sort, and clear controls;
4. six approved taxonomy filter groups;
5. active-filter summary and live result count;
6. dense nine-column desktop table;
7. protected compact cards;
8. secondary bounded historical comparison.

## Preserved interaction contract

The existing client controller remains responsible for:

- URL search parameters;
- deterministic parameter ordering;
- `pushState` and `replaceState` updates;
- browser `popstate` restoration;
- six filter groups;
- six sort modes;
- active-filter removal;
- clear-all behavior;
- two-to-four record comparison;
- maximum-four selection guard.

No filter or sort axis is derived from arbitrary free text.

## Canonical metrics

The metric cards are generated from runtime registry data:

```text
records.length
records filtered to lifecycle === active
organizations.length
deduplicated evidence source identities
```

The active count is explicitly a lifecycle count, not a safety or quality rating.

## Record presentation

Desktop rows and compact cards now include deterministic ticker badges.

The page preserves:

- name and symbol;
- primary display organization;
- primary display role;
- reference target;
- backing model;
- lifecycle;
- issuance;
- evidence count.

Additional canonical context includes:

- last reviewed date when recorded;
- linked event count;
- known-unknown count;
- relationship and connected-organization counts.

The nine protected desktop headers remain unchanged.

## Compact representation

The compact card keeps the protected fields required by the existing mobile contract and adds events and last-reviewed context. The desktop table is removed from compact display at the existing breakpoint and the cards become the primary compact representation.

## Comparison

The existing comparison is retained because it is bounded, account-free, URL-addressable, and based on canonical historical fields. It remains secondary and explicitly states that it is not a ranking, recommendation, or investment assessment.

The rejected mock-style saved comparison tray is not implemented.

## Mock-only exclusions

The implementation does not add:

- price or market-cap data;
- supply, holder, or transfer metrics;
- saved views;
- watchlists;
- accounts or follows;
- recently viewed history;
- safety or transparency scores;
- promotional actions.

## Validation

`scripts/validate-ui-v2-stablecoin-index.mjs` verifies:

- approved reference presence;
- shared v2 component use;
- dynamic metrics;
- six filters and six sorts;
- active-filter and result announcements;
- nine protected headers;
- ticker badges and review context;
- compact protected fields;
- bounded non-ranking comparison disclosure;
- v2 responsive style markers;
- existing URL/history/selection interaction markers;
- mock-only feature absence;
- absence of external runtime fetching.

The validator runs in both `npm run build` and `npm run build:site`.

## Agent authority correction

`AGENTS.md` no longer maintains a separate stale current-step number. It now requires agents to read `docs/roadmap.md` and `docs/ui-redesign/implementation-plan.md` for current work before implementation.

## Data preservation

Expected unchanged checkpoint:

```text
Stable assets:                 92
Organizations:                 86
Organization relationships:   101
Events:                       150
Canonical evidence records:   455
Public source identities:      410
Evidence relations:            455
Known unknowns:                253
Deployments:                   130
```

## Deployment classification

No production deployment required.

PR #210 may merge only after its validator, the existing Stablecoin index validator, Astro check, full build, registry integrity, route/output parity, and all pull-request workflows succeed.
