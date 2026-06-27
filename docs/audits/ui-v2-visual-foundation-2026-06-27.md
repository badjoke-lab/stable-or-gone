# UI v2 visual foundation audit

Date: 2026-06-27  
Program: Modern Data Product UI v2  
Plan item: PR #208 — shared visual foundation and approved brand assets

## Authority

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/README.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

## Implemented foundation

### Brand assets

```text
public/brand/sog-lockup-on-dark.svg
public/brand/sog-lockup-on-light.svg
public/brand/sog-mark-on-dark.svg
public/brand/sog-mark-on-light.svg
```

The shared layout uses the approved full S/G lockup in the desktop header and footer. The approved monogram is used as the SVG favicon.

The production assets preserve:

- combined S/G letterform;
- horizontal crossing line;
- coral interrupted segment at the right;
- dark- and light-surface variants;
- accessible SVG title and description.

### Token contract

`config/ui-v2-foundation.mjs` defines:

- dark-navy page and surface colors;
- bright-blue action and focus colors;
- approved teal and coral brand colors;
- positive, warning, critical, unknown, and inactive semantic colors;
- content widths;
- radius and spacing scales;
- required shared components and CSS classes;
- forbidden substitute-brand patterns.

### Shared components

```text
src/components/BrandLockup.astro
src/components/TickerBadge.astro
src/components/OrganizationBadge.astro
src/components/PageHero.astro
src/components/MetricCard.astro
src/components/SupportBanner.astro
```

Ticker and organization identity defaults to deterministic text badges. This PR does not introduce third-party logo dependencies.

### Shared visual primitives

`src/styles/shell.css` now provides:

```text
ui-panel
ui-button
ui-button--primary
ui-field
ui-chip
ticker-badge
organization-badge
page-hero
metric-card
support-banner
```

The existing shell retains:

- grouped desktop navigation;
- controlled compact navigation;
- current-page state;
- skip link and main focus target;
- Escape close and focus return;
- 44px control foundation;
- reduced-motion behavior;
- forced-colors behavior;
- long-value wrapping.

`src/styles/global.css` maps existing shared surfaces to the v2 token family so that legacy pages do not remain visually disconnected while page-specific redesigns are still pending.

## Validation

`scripts/validate-ui-v2-foundation.mjs` verifies:

- all eight approved page references and four logo references remain present;
- all four production brand assets remain present and accessible;
- the approved teal/coral asset treatment remains present;
- the shared layout uses `BrandLockup` in header and footer;
- the approved favicon is present;
- all required shared components and CSS classes exist;
- the approved token values are represented in the shell;
- the application font stack is sans-serif rather than a monospace default;
- forbidden substitute-brand terms do not appear in production source assets;
- canonical record and route changes remain zero for this foundation step.

The validator runs in both:

```text
npm run build
npm run build:site
```

## Explicit non-scope

This foundation PR does not complete:

- Home redesign;
- Stablecoins index redesign;
- Stablecoin detail redesign;
- Organizations pages redesign;
- Events pages redesign;
- Methodology/editorial redesign;
- mobile page-specific transformations;
- official coin or organization logo collection;
- canonical data changes;
- record growth;
- route changes;
- production publication.

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

## Completion condition

PR #208 may merge only after the v2 foundation validator, full build, Astro check, route/output parity, public consistency, registry integrity, and all existing pull-request workflows succeed.

No production deployment is required or permitted for this step.
