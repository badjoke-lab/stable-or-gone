# UI v2 Organizations implementation audit

Date: 2026-06-28  
Program: Modern Data Product UI v2  
Plan item: PR #212 — Organizations index and detail

## Authority

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/04-organization-index.webp
docs/ui-redesign/approved-mocks-v2/05-organization-detail.webp
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

## Index implementation

The Organizations index now uses the shared v2 page hero, four canonical metric cards, the existing five reviewed taxonomy filter groups, five sort modes, URL and browser-history state, the protected eight-column desktop table, and compact organization cards.

The metrics remain derived from reviewed repository data:

```text
Organizations
Relationships
Connected assets
Source identities
```

## Detail implementation

Every organization detail route now uses:

1. shared v2 record hero;
2. deterministic initials badge;
3. category, jurisdiction, connected-asset, relationship, event, and source metrics;
4. local record navigation;
5. reviewed identity and taxonomy;
6. complete current, ended, and unknown-state stablecoin relationships;
7. typed events and issuer-control actions;
8. evidence identities and relations;
9. known unknowns;
10. corrections, methodology, registry, and data-manifest destinations.

## Preservation

The implementation preserves:

- all 86 organization routes;
- all 101 organization relationships;
- primary-display semantics as navigation only;
- current and historical relationship separation;
- organization category, legal form, regulatory character, jurisdiction, functional roles, confidence, and last-reviewed fields;
- event taxonomy and evidence relations;
- desktop tables and protected compact cards;
- no external runtime fetching.

## Responsive and accessibility behavior

At compact widths, metric grids collapse to one column, local navigation becomes horizontally reachable and non-sticky, protected tables switch to their compact representations, actions remain at least 44px, and focus-visible, reduced-motion, and forced-colors behavior remain explicit.

## Exclusions

The implementation does not add live market data, rankings, safety scores, transparency scores, accounts, watchlists, follows, recent-history features, invented organization logos, or unsupported licensing claims.

## Validation

`scripts/validate-ui-v2-organizations.mjs` runs in both full and site builds and verifies the v2 components, canonical metrics, filters, sorts, protected fields, relationship preservation, compact representations, accessibility markers, correction paths, and rejected-feature absence.

## Deployment classification

No production deployment required.
