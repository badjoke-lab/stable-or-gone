# DESIGN.md — Stable or Gone

Status: canonical design overview  
Updated: 2026-07-01  
Visual family: Editorial Ledger

## 0. Authority

The binding visual and page-layout specification is:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
```

The active implementation schedule is:

```text
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

The active reference direction is:

```text
docs/ui-redesign/approved-mocks-v3/README.md
```

This overview must not override those documents. The former Terminal Registry and Modern Data Product directions are historical and do not authorize current visual work.

## 1. Product identity

Stable or Gone is a source-backed historical registry for stablecoins and closely related stable-value assets.

It should feel like the intersection of:

```text
financial register
research dossier
public record
editorial archive
source index
```

It must not feel like:

- a SaaS dashboard;
- a trading terminal;
- an exchange;
- a portfolio tracker;
- a market-cap dashboard;
- a promotional crypto landing page;
- a safety or recommendation product.

## 2. Visual direction

```text
Editorial Ledger
```

Core visual rules:

- paper-like off-white background;
- dark ink;
- muted dark-red accent used sparingly;
- thin rules as the primary separation device;
- square or nearly square corners;
- no decorative shadows;
- no blue-purple glow;
- no giant marketing hero;
- no KPI-card row;
- no repeated rounded-card grid;
- no cards inside cards;
- no new logo.

Hierarchy is created through typography, rules, spacing, columns, labels, and data density rather than surface effects.

## 3. Existing logo

The approved S/G logo already exists and must be reused.

```text
public/brand/sog-lockup-on-light.svg
public/brand/sog-lockup-on-dark.svg
public/brand/sog-mark-on-light.svg
public/brand/sog-mark-on-dark.svg
```

Default light Editorial Ledger surfaces use the `on-light` assets. Do not redraw, regenerate, imitate, or replace the logo.

## 4. Exact shared tokens

The implementation source of truth for shared tokens is:

```text
config/ui-v3-foundation.mjs
src/styles/shell.css
```

Current foundation:

```text
paper             #F4F1E9
paper subtle      #ECE7DC
paper emphasis    #E2DCCF
ink               #1B1A18
muted ink         #5C5851
quiet ink         #7A746B
rule              #C4BDB1
strong rule       #5D5850
accent            #7F242A
accent strong     #641A1F
focus             #1D5F85
positive          #2F6B4F
warning           #93651B
critical          #8B2B2B
unknown           #655C79
```

Typography:

```text
display headings  Georgia / Cambria / Times New Roman
body and controls Inter / system sans-serif
IDs and dates     system monospace
```

## 5. Shared shell

Desktop primary navigation:

```text
approved logo
Register
Events
Organizations
Guides
Search register
About disclosure
```

The About disclosure and footer contain secondary destinations such as Methodology, Glossary, Models, Updates, Corrections, Support, Contact, and data access.

The shell must preserve:

- keyboard operation;
- visible focus;
- 44px interactive targets;
- reduced-motion support;
- forced-colors support;
- mobile controlled disclosure;
- existing routes and canonical data.

## 6. Page families

### Home

A registry front page, not a product landing page.

```text
masthead and purpose
one-line registry summary
latest material changes
current registry state
recently updated records
guides and reference entrypoints
```

### Stablecoins

A table-first public register with compact search, filter, sort, and bounded pagination.

### Stablecoin detail

A research dossier that separates current state, mechanism, organizations, history, evidence, known unknowns, and corrections.

### Organizations

Responsible-body records, not corporate profile cards.

### Events

Incident and public-record files, not alert-dashboard cards.

### Guides

A distinct editorial article layout with a readable body column, table of contents, notes, tables, and related material.

### Reference and utility pages

Models and Glossary are reference pages. Methodology and About are long-form pages. Updates, Corrections, Support, and Contact are utility pages. They share the shell but do not use one generic card template.

## 7. Mobile

Mobile is a deliberate transformation, not desktop stacked into cards.

- preserve field labels and values;
- retain protected information;
- use page-specific compact rows or deliberate comparison scrolling;
- use expandable local navigation for long dossiers and guides;
- support 320px width and 200 percent zoom;
- avoid generic numbered-column hiding.

## 8. Data truth

The visual system must not invent:

- live price or market data;
- market capitalization or supply figures;
- holder or transfer counts;
- synthetic scores;
- unsupported reserve totals;
- unsupported verification or licensing claims;
- invented evidence counts;
- invented relative timestamps;
- asset-specific facts stored only in rendering components.

Canonical data, approved editorial copy, generated canonical counts, and reviewed local assets are the only default public inputs.

## 9. Validation

Shared-shell validation:

```text
npm run validate:ui-v3-foundation
```

Visual review uses representative desktop and mobile screenshot capture. Repeated detail templates are sampled by default rather than captured exhaustively.
