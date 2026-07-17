# PR #409 UI v3 Rebuild A — Design Contract and Failure Gates

Status: active specification and validation work  
Issue: #281  
Implementation PR: 409  
Production UI change: false

## Why UI v3 is reopened

The current site passes data integrity, route generation, rendering, and screenshot capture, but those checks did not establish product-design quality. The prior design direction overemphasized an editorial/newspaper masthead, used undersized typography, flattened different concepts into border-only panels, exposed long data dumps as primary browsing modes, and treated skipped visual review as if it were successful completion.

UI v3 therefore remains incomplete. PR #409 does not redesign the live site. It replaces the failed direction with an explicit contract and makes later visual acceptance auditable.

## Product direction

Stable or Gone is a modern evidence registry, not a digital newspaper and not a generic data table.

The interface must help a reader answer, in this order:

1. What is the current operational state?
2. Can the asset be issued and redeemed, and by whom?
3. What backs it and how is that backing evidenced?
4. Which organizations control or operate it?
5. What material lifecycle events changed its state?
6. Where is it deployed and accessible?
7. Which claims are well supported?
8. What remains unresolved?

Raw normalized fields remain available, but they must not control the first-screen hierarchy.

## Design-system requirements

The machine-readable contract is `config/ui-v3-rebuild-design-contract-pr409.json`.

### Typography

- normal body copy must not fall below 16px;
- dense table text must not fall below 14px;
- metadata must not fall below 13px;
- 9px, 10px, and 11px defaults are prohibited;
- reading width is bounded to approximately 74 characters;
- line height must remain readable in both normal and dense contexts.

### Density and layout

- 44px is the minimum touch target and standard table-row height;
- compact density may exist only as an explicit user choice;
- primary index pages may not default to unbounded multi-thousand-pixel dumps;
- more than 100 rows requires pagination or another bounded-rendering method;
- cards, sections, interactive states, and emphasis surfaces must have distinct hierarchy rather than relying on identical transparent panels.

### Interaction

Every filterable registry view must visibly provide:

- available options;
- selected states;
- active-filter chips;
- result count;
- clear/reset action;
- empty state;
- keyboard operation and visible focus.

### Responsive and accessibility

Acceptance includes widths of 320, 390, 768, 1280, and 1440 pixels. Page-level horizontal overflow is prohibited. Long labels and identifiers require explicit tests. The target is WCAG 2.2 AA, including contrast, reduced motion, forced-colors review, semantic headings, labels, synchronized ARIA state, and focus return for disclosures.

## Required SOG visual components

Later implementation phases must translate SOG data into recognizable components for:

- lifecycle status;
- redemption state;
- backing and reserve structure;
- issuer and control relationships;
- material-event timeline;
- deployment networks;
- evidence quality;
- unresolved questions;
- event severity;
- organization-to-asset relationships.

A page that merely restyles normalized rows does not satisfy this contract.

## Template priorities

### Home

Product search, registry state, recent material changes, issue watch, and direct exploration paths must take precedence over decorative branding.

### Stablecoin register

Search, filters, chips, result counts, sort, clear controls, responsive cards/table modes, compare state, and empty state must be understandable without reading implementation notes.

### Stablecoin dossier

The order is current status, redemption, backing/reserves, issuer/control, material events, deployments, unresolved questions, evidence, then lower-priority technical fields.

### Events and organizations

Both require bounded rendering, useful grouping, meaningful filters, clear severity/type or relationship distinctions, sticky or persistent context where appropriate, and responsive layouts.

### Guides and secondary pages

Long-form material requires controlled reading width, table of contents, callouts, examples, section navigation, and clearer source presentation.

## Visual review matrix

Fourteen representative captures are mandatory across home, register, filtered and empty states, dossier, events, organizations, and a long guide. Required owner-approval templates are:

```text
home
stablecoin register
stablecoin dossier
events
organizations
guides
```

Each required template must be reviewed on desktop and mobile. The exact routes, viewports, and states are defined in the machine-readable contract.

## Hard failure gates

UI closure must fail when any of the following is true:

- screenshot artifacts are missing;
- desktop or mobile captures are missing;
- the contact sheet is missing;
- visual audit was skipped;
- an automated render is presented as approval;
- required owner approvals are missing, rejected, or not recorded;
- production pages use prohibited undersized default text;
- an index page relies on an unbounded dump as its primary browsing mode;
- route, data, provenance, keyboard, focus, contrast, overflow, empty-state, or long-label checks fail.

A skipped visual audit is a failure, never a pass or neutral state.

## Phase boundary

PR #409 is PR A only.

```text
PR B — global shell and navigation: blocked
PR C — home and stablecoin register: blocked
PR D — stablecoin dossier: blocked
PR E — events and organizations: blocked
PR F — guides and secondary pages: blocked
PR G — full visual closure: blocked
```

No later phase is pre-authorized. PR #409 must stop at `REVIEW GATE`.

## Canonical boundary

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Production UI files changed: 0
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
```
