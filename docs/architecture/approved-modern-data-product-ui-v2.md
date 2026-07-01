# Stable or Gone UI contract v2 — superseded

Status: historical plan — superseded  
Approved: 2026-06-27  
Superseded: 2026-07-01  
Former implementation family: Modern Data Product

## Replacement

The binding visual and page-layout authority is now:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
```

The active implementation schedule is:

```text
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

## Historical role

This document originally governed PR #207 through PR #216 and produced the intermediate UI v2 repository state. That implementation preserved valuable canonical-data mapping, public taxonomy, route structure, accessibility behavior, evidence presentation, known-unknown presentation, and the approved S/G production logo assets.

Owner review later rejected the Modern Data Product visual direction as the final SOG presentation. The dark navy SaaS composition, oversized hero, metric-card rows, bright-blue interaction emphasis, repeated rounded panels, and dashboard-like page composition no longer authorize visual implementation.

## What remains reusable

The following v2 outcomes may be retained where they do not conflict with v3:

- canonical data and route mapping;
- public taxonomy and value-state semantics;
- evidence and known-unknown preservation;
- deterministic primary-relationship selection;
- URL-synchronized filters;
- accessibility behavior;
- reduced-motion and forced-colors support;
- approved S/G production SVG logo assets;
- machine-readable parity and data-preservation checks.

## What is no longer authoritative

The following v2 choices are superseded:

- Modern Data Product as the visual family;
- dark navy as the default page background;
- bright blue as the dominant interaction identity;
- decorative glow;
- repeated medium-radius panels;
- PageHero and MetricCard as default page-composition primitives;
- dashboard-like Home composition;
- count-card treatment on index pages;
- identical card-family treatment across editorial and registry pages.

## Logo preservation

The logo was not rejected. The existing approved S/G assets remain mandatory:

```text
public/brand/sog-lockup-on-light.svg
public/brand/sog-lockup-on-dark.svg
public/brand/sog-mark-on-light.svg
public/brand/sog-mark-on-dark.svg
```

No implementation may use this superseded document to create or substitute another logo.

## Change-control rule

Do not cite this file as active visual authority in new implementation PRs. It may be cited only as historical context or as evidence for preserved data/accessibility behavior.
