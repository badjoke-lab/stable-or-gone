# Stable or Gone Roadmap

Updated: 2026-07-20  
Status: canonical 114-asset baseline stable; UI remediation R1 active

## Current position

```text
Canonical stable assets: 114
Organizations: 107
Relationships: 126
Events: 189
Evidence: 565
Evidence Relations: 565
Deployments: 180
Market Access Records: 8
Archive recorded: 436
Archive not recorded: 129

Issue #281 UI v3 rebuild: reopened
UI completion: false
Previous owner approval: withdrawn after failed visual review
UI remediation authority: docs/ui-v3-remediation-authority.md
Current UI phase: R1 authority reset and audit baseline
```

## Canonical data baseline

```text
PR #426 Post-UI v3 Data-Growth Reset: complete
PR #427 Record Growth Candidate Audit v2: complete
PR #428 Post-PR #427 Review Gate: complete
PR #429 Record Growth Batch 2 — CHFAU and SEKAU: complete
PR #432 Generated-output repair workflow: complete
PR #433 Generated and persisted PR #429 outputs: complete
```

PR #433 established the current generated and built baseline of 114 stable assets, 107 organizations, 126 relationships, 189 events, 565 Evidence records, and 180 deployments. UI remediation must preserve this canonical baseline unless a separate data authority explicitly authorizes a change.

## Withdrawn UI completion sequence

The following sequence was implemented and rendered, but its completion decision is no longer valid:

```text
PR #409 design contract and failure gates
PR #410 review gate
PR #411 global shell and navigation
PR #412 review gate
PR #413 home and stablecoin register
PR #414 review gate
PR #415 stablecoin dossier
PR #416 review gate
PR #417 events and organizations
PR #418 review gate
PR #419 guides and secondary pages
PR #420 review gate
PR #421 representative visual closure package
PR #422 owner approval and completion record
PR #424 production checker aligned with UI v3
PR #425 active authority aligned and Issue #281 closed
```

The prior closure captured representative states and passed build, route, screenshot-existence, and page-overflow checks. It did not establish acceptable typography, density, hierarchy, mobile browsing, full-route coverage, or runtime data-state quality. Representative automated screenshots are not a substitute for a complete manual product-design review.

## Active UI remediation sequence

The sole detailed authority is `docs/ui-v3-remediation-authority.md`.

```text
R1 Authority reset and complete audit baseline: active
R2 Global shell and tokens: blocked
R3 Home and Stablecoin Register: blocked
R4 Stablecoin Dossier: blocked
R5 Events and Organizations: blocked
R6 Guides and long-form pages: blocked
R7 Reference and utility pages: blocked
R8 Compare and Access/Regulation: blocked
R9 Timeline and Stats: blocked
R10 Full visual closure: blocked
```

### R1 — Authority reset and audit baseline

- make the remediation memo mandatory in `AGENTS.md`;
- reopen Issue #281;
- set UI completion false everywhere;
- inventory every public route and required loading, empty, error, filtered, ready, desktop, tablet, and mobile state;
- prevent visible runtime errors from passing visual closure.

### R2 — Global shell and tokens

- one readable UI font family;
- monospace only for technical literals;
- compact one-row desktop and mobile headers;
- remove the giant decorative Home masthead;
- normalize type scale, spacing, surfaces, color roles, focus, and footer density.

### R3 — Home and Stablecoin Register

- compact registry-first Home;
- immediate search and current counts;
- bounded recent content;
- collapsed filters, selected-filter chips, compact desktop table, compact mobile rows, and clear empty/error states.

### R4 — Stablecoin Dossier

- decision-useful summary first;
- redemption, backing, issuer/control, events, deployments, unresolved questions, Evidence, and technical fields in that order;
- bounded related lists and mobile disclosure.

### R5 — Events and Organizations

- compact bounded registers;
- useful grouping and filtering;
- remove duplicated detail fields;
- relationship-first organization details;
- Evidence shown at appropriate weight.

### R6 — Guides and long-form pages

- readable width and table of contents;
- responsive tables without card explosions;
- section navigation;
- separate appendices and source-heavy reference material where needed.

### R7 — Reference and utility pages

- redesign Glossary, Models, Updates, Maintenance, About, Contact, and Support;
- ensure every route receives desktop and mobile captures.

### R8 — Compare and Access/Regulation

- fix data-loading and contract-mismatch failures before visual approval;
- separate loading, empty, error, and ready states;
- rebuild comparison and access exploration for desktop and mobile.

### R9 — Timeline and Stats

- bounded chronology with year/month navigation;
- statistics overview and focused detail views;
- move raw exhaustive tables out of the default mobile experience.

### R10 — Full visual closure

- capture every unique route template and representative state at 1440, 1280, 768, 390, and 320 widths;
- fail on visible runtime errors, required-request failures, clipping, ordinary-word break-all, horizontal page overflow, unreadable typography, and skipped audit steps;
- require explicit manual approval of the final contact sheets.

## Mandatory operating rule

Every UI issue, pull request, review gate, and completion report must cite `docs/ui-v3-remediation-authority.md`, identify the exact requirement headings addressed, and update its progress table. Do not create a parallel UI plan that can drift from the authority.

## Completion boundary

UI completion remains false until R1–R10 are complete, all mandatory route/state captures exist, Compare and Access/Regulation no longer expose runtime contract errors, and the owner explicitly approves the final desktop and mobile contact sheets. Automated rendering never constitutes approval.