# SOG-specific terminal restoration working memo

Status: active temporary authority for branch `agent/restore-sog-specific-terminal-v2`

Purpose: correct the HEI-like visual regression introduced by PR #446 and restore SOG's own terminal / log / evidence-registry identity without removing or weakening any function, route, data field, accessibility behavior, responsive behavior, machine-readable output, search/filter/sort state, compare behavior, pagination, or registry semantics.

Historical visual authority: commit `884351842fc01c028eeceb32bcd9fcc1ef7ffa09` and its protected-function contract.

## Non-negotiable preservation rules

Do not remove or change:

- canonical records, IDs, slugs, routes, schemas, counts, relationships, lifecycle logic, issuance logic, evidence relations, statistics calculations, sitemap coverage, JSON-LD, `version.json`, `data/manifest.json`, `llms.txt`, or `ai.txt`;
- search targets, filter dimensions, filter values, sorting behavior, result counts, URL query synchronization, individual filter removal, clear-all, compare selection, pagination, bounded rendering, loading, empty, error, keyboard operation, focus handling, accessible names, live announcements, skip links, mobile menu behavior, or responsive information preservation;
- stablecoin, event, organization, guide, methodology, corrections, data access, support, contact, compare, access, timeline, stats, maintenance, and error-page content;
- current public taxonomy, explicit primary-organization selection, known-unknown semantics, evidence deduplication, route parity, build provenance, stale-output detection, and mobile field preservation.

No functional control may be deleted because the appearance is wrong. Restyle it without deleting behavior.

## Corrective finding

PR #446 failed visually because it used a generic global flattening layer and reproduced the shared HEI-style registry composition:

- two-level registry navigation;
- large explanatory hero paired with a search box;
- KPI strip;
- grid of registry destinations;
- repeated ruled panels with the same hierarchy;
- large multi-column sitemap footer.

This is not an acceptable SOG restoration. Removing SaaS decoration is not enough when the resulting composition becomes an HEI clone.

## Canonical SOG direction

SOG is a focused stablecoin research terminal. Its visual hierarchy must prioritize:

1. lifecycle state;
2. peg, reserve, redemption, and issuer context;
3. material changes and unresolved questions;
4. evidence and review state;
5. chronological record browsing.

Required visual traits:

- deep navy and near-black backgrounds;
- cyan actions and links;
- amber focus;
- semantic green, amber, red, violet, and gray states;
- monospace interface voice;
- compact controls with visible boundaries;
- layered dark surfaces used selectively, not a universal card grid;
- terminal command cues and status notation where useful;
- readable prose on guides and methodology pages;
- page-specific hierarchy rather than one shared dashboard template.

## Explicitly prohibited

- reproducing HEI's home composition;
- generic SaaS dashboard layouts;
- universal selectors that force every component into the same border, radius, shadow, or typography treatment;
- hiding sections or controls to make the layout easier;
- replacing page semantics with a shared registry template;
- giant marketing heroes, product-tour sections, KPI dashboards, decorative CTA panels, or large sitemap footers;
- claiming completion without representative screenshots and owner review.

## Current corrective implementation

The current branch changes only presentation files and this memo:

- `src/styles/shell.css` — restores a compact SOG shell while preserving all navigation and search;
- the retired `public/ui-remediation-r2.css` browser-final override was removed when PR #470 established `src/styles/public-ui.css` as the only physical stylesheet;
- this memo.

The correction must not modify Astro behavior, JavaScript, canonical data, routes, schemas, or machine-readable output.

## Validation checklist

Before merge, verify:

- no canonical data diff;
- no route or public-output diff;
- search, filters, sorting, comparison, URL state, and pagination remain functional;
- all navigation destinations remain present on desktop or mobile;
- no material field disappears at 320, 390, 768, 1280, or 1440px;
- loading, empty, and error states remain distinct;
- visible focus and keyboard operation remain intact;
- Home no longer reads as an HEI clone;
- footer remains complete without dominating the page;
- guides and methodology remain readable;
- representative Home, register, dossier, Events, Organizations, and Guides screenshots are reviewed.

## Merge rule

- work only on `agent/restore-sog-specific-terminal-v2`;
- do not remove functionality;
- do not merge solely because CI is green;
- require visual review of the exact branch output;
- do not call the UI complete before that review.

## Change log

### 2026-07-23

- Recorded PR #446 as an HEI-like visual regression.
- Replaced generic global flattening with SOG-specific presentation.
- Restored the historical terminal baseline as visual authority.
- Reaffirmed that every existing function and route is protected.
