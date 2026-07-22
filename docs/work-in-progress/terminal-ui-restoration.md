# Terminal UI restoration working memo

Status: active temporary authority for branch `agent/restore-terminal-ui`

Purpose: restore the original terminal / log / ledger visual language without removing or weakening any existing function, route, data field, accessibility behavior, responsive behavior, machine-readable output, search/filter/sort state, compare behavior, pagination, or registry semantics.

This memo must be reviewed before every UI change on this branch and updated whenever scope, implementation, or validation changes.

## Non-negotiable preservation rules

Do not remove or change:

- canonical records, IDs, slugs, routes, schemas, counts, relationships, lifecycle logic, issuance logic, evidence relations, statistics calculations, sitemap coverage, JSON-LD, `version.json`, `data/manifest.json`, `llms.txt`, or `ai.txt`;
- search targets, filter dimensions, filter values, sorting behavior, result counts, URL query synchronization, individual filter removal, clear-all, compare selection, pagination, bounded rendering, loading, empty, error, keyboard operation, focus handling, accessible names, live announcements, skip links, mobile menu behavior, or responsive information preservation;
- stablecoin, event, organization, guide, methodology, corrections, data access, support, contact, compare, access, timeline, stats, maintenance, and error-page content;
- current public taxonomy and internal-value suppression;
- explicit primary-organization selection, known-unknown semantics, evidence deduplication, route parity, build provenance, stale-output detection, and mobile field preservation.

No functional control may be deleted merely because its current appearance is SaaS-like. Restyle the control without deleting its behavior.

## Canonical visual direction

SOG is a terminal-style historical registry: terminal, log, ledger, console, evidence record, flat, dense, rectangular, monospace-first, information-led.

Required:

- dark near-black / deep-navy background;
- off-white primary text, blue-gray secondary text;
- cyan links, yellow focus, green warning-safe/active, yellow caution, red critical/failed, purple unknown, gray inactive;
- monospace typography throughout interface and records;
- straight rules and row boundaries;
- square or near-square controls;
- compact but readable density;
- status shown as text such as `[ACTIVE]`, `[FAILED]`, `[UNKNOWN]`;
- filters shown as text state such as `lifecycle=active` rather than decorative pills;
- page hierarchy expressed through labels, numbering, rules, spacing, and typography rather than elevated cards.

## Prohibited visual drift

Do not introduce or retain as the dominant visual language:

- generic SaaS dashboard layouts;
- large rounded cards or card grids;
- pill-shaped status, filter, navigation, or metadata elements;
- box shadows, drop shadows, raised surfaces, glass surfaces, glow, decorative gradients, or backdrop blur;
- giant marketing heroes, feature grids, benefit cards, mission cards, KPI tiles, oversized CTA panels, or product-tour patterns;
- multiple decorative surface levels whose only purpose is visual elevation;
- proportional or serif typography as the primary interface voice;
- large empty decorative spacing;
- visual redesigns that change data priority or remove fields.

Necessary technical containers may retain a minimal 0-2px radius, but must remain flat and rectangular.

## Readability requirements

Do not restore old readability defects.

- body text: minimum 15px, preferred 16px;
- table / dense row text: minimum 14px;
- mobile body text: minimum 15px;
- touch targets: minimum 44px where interactive;
- no ordinary-text `break-all`;
- long IDs, addresses, URLs, and hashes must wrap safely;
- no horizontal page overflow at 320, 390, 768, 1280, or 1440px;
- no material field may disappear on mobile;
- color may not be the only status indicator.

## Functional restyling rules

Search remains search. Filters remain filters. Sort remains sort. Compare remains compare. Pagination remains pagination. Mobile transformation remains information-preserving.

Examples:

- active filter chips -> flat text line: `FILTERS lifecycle=active reference=usd [clear]`;
- rounded status pill -> terminal status text: `[ACTIVE]`;
- floating registry card -> ruled registry row;
- mobile card -> compact multi-line record separated by a rule;
- tab pills -> indexed local navigation such as `[01 IDENTITY] [02 EVENTS] [03 EVIDENCE]`;
- large empty/error cards -> concise terminal messages with existing recovery controls preserved.

## Initial implementation scope

The first review slice is limited to:

1. global shell;
2. header and navigation;
3. footer;
4. home page;
5. stablecoin registry index;
6. stablecoin index mobile transformation;
7. search, filters, active filter state, sort, result count, pagination, loading, empty, and error presentation on that index.

Do not expand to stablecoin dossiers, events, organizations, guides, methodology, compare, access, timeline, stats, or secondary pages until the first slice is visually reviewed.

## Initial files expected to change

- shared shell/layout files;
- shell and typography CSS;
- home-page CSS and minimal markup only where styling cannot achieve the terminal structure;
- stablecoin-index CSS and minimal markup only where styling cannot preserve behavior;
- a dedicated terminal-restoration validation script or contract;
- this memo.

Do not delete JavaScript or Astro behavior without proving it is unused and unrelated to preserved functionality.

## Validation checklist for every change

Before continuing, verify:

- no canonical data diff;
- no route or machine-readable output diff;
- search works;
- all filters work;
- active filters remain visible and removable;
- clear-all works;
- sorting works;
- result count updates and remains announced;
- URL query state is preserved;
- pagination works;
- compare selection remains available where currently supported;
- keyboard navigation and focus remain visible;
- loading, empty, and error are distinct;
- desktop and mobile retain all material fields;
- no horizontal overflow at required widths;
- no shadow, blur, glow, decorative gradient, dominant rounded-card grid, or pill-based status/filter presentation remains in the reviewed slice.

## Merge and rollout rule

- work only on `agent/restore-terminal-ui`;
- do not merge to `main` without explicit user approval;
- do not deploy production from this branch;
- screenshots and automated audits are evidence, not approval;
- stop after the first review slice and present the exact diff and representative screenshots before expanding scope.

## Change log

### 2026-07-22

- Created temporary authority memo.
- Locked functional preservation requirements.
- Locked terminal / log / ledger visual direction.
- Limited first implementation slice to shell, home, and stablecoin index.
