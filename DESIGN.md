# DESIGN.md — Stable or Gone

Status: active restoration authority
Updated: 2026-07-03
Visual family: Terminal Registry
Tracking: issue #281
Restoration source: `3df568eab0a179d7690a88efb599156b0d659ab7`

## 0. Authority

The Modern Data Product, Editorial Ledger, and Modern Evidence Registry directions were rejected in owner review. They must not be revived as the controlling visual system.

The active authority is:

```text
DESIGN.md
docs/ui-redesign/rebuild-contract-v4.md
config/ui-v4-visual-acceptance.json
docs/roadmap.md
```

The current work restores the original terminal-style visual family while retaining the modernized data, routes, information architecture, responsive behavior, accessibility behavior, and interactions developed later.

No document or workflow may claim UI completion without satisfying the visual acceptance contract and explicit owner approval of the exact screenshot set.

## 1. Product identity

Stable or Gone is a source-backed historical and operational registry for stablecoins and related stable-value assets.

It must help a reader answer:

- What is this asset now?
- Can it be issued or redeemed?
- What backs or stabilizes it?
- Who issues, controls, or operates it?
- What material events changed it?
- What evidence supports the record?
- What remains unknown?

It must feel like a focused research terminal and evidence registry. It must not resemble a promotional crypto landing page, generic SaaS dashboard, newspaper reproduction, or trading interface with invented market data.

## 2. Visual direction

Use the restored Terminal Registry system:

- deep navy and near-black backgrounds;
- layered dark panels with restrained depth;
- cyan links and actions;
- green, amber, red, violet, and muted gray for semantic states;
- monospace typography as the default interface voice;
- square controls and panels rather than rounded card styling;
- compact, structured density appropriate for a research tool;
- visible borders and table structure;
- atmospheric radial/linear dark background treatment;
- clear focus, hover, selected, and expanded states;
- no light paper background;
- no red editorial accent as the primary action color;
- no giant newspaper masthead;
- no generic white SaaS card grid.

The terminal style is a visual language, not permission to make the site unreadable. Current responsive transformations, bounded index behavior, search, filtering, pagination, comparison, and mobile cards remain protected.

## 3. Protected assets and contracts

Preserve:

- 100 canonical stable assets;
- 94 organizations;
- 172 events;
- 501 evidence records;
- all current public routes;
- machine-readable outputs and provenance;
- current record hierarchy and field ownership;
- keyboard operation and visible focus;
- reduced-motion and forced-colors support;
- 320px behavior and 200 percent zoom support;
- mobile alternatives for dense tables;
- bounded index pagination and URL state;
- current S/G logo assets.

## 4. Typography and density

The interface may be compact, but important information must remain readable.

Targets:

- primary body and data: approximately 13–15px depending on context;
- controls: approximately 12–14px with at least 42–44px target height;
- metadata and headings may be smaller only when contrast and spacing remain sufficient;
- H1 and major counts must not overwhelm the operational content;
- long-form guide text must retain a comfortable line length and line height.

## 5. Page hierarchy

### Home

Retain current search, registry totals, material changes, lifecycle distribution, recently reviewed records, guides, and reference links. Present them through the terminal visual family.

### Stablecoin register

Retain search, visible filter state, clear action, sorting, pagination, comparison, desktop table, and mobile record cards. Use terminal panels, compact controls, and cyan/semantic states.

### Stablecoin dossier

Retain the current operational hierarchy:

1. current status and identity;
2. redemption and backing;
3. issuer and control;
4. material events and lifecycle history;
5. deployments and legal context;
6. evidence and unresolved questions;
7. raw registry fields and coverage.

### Events and Organizations

Retain current filters, bounded browsing, responsive transformations, record relationships, and evidence context. Apply the same terminal system without replacing the page semantics.

### Guides and long-form

Retain contents navigation, readable article width, examples, callouts, tables, and sources. Apply dark terminal surfaces without compressing prose into an unreadable data table.

## 6. Acceptance

Screenshot generation is not design approval. Automated rendering checks establish technical health only.

Completion requires:

- no required audit step skipped;
- desktop and mobile artifact review;
- explicit approval of Home, Register, Dossier, Events, Organizations, and Guides/long-form;
- all data, route, provenance, accessibility, and machine-readable checks green;
- explicit owner approval recorded against the exact commit and screenshot run.
