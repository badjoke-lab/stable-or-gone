# Stable or Gone Roadmap

Updated: 2026-07-01  
Status: canonical execution schedule

## Current position

```text
Latest completed: PR #262 — shared Editorial Ledger shell
Active: PR #263 — Home
Next: PR #264 — Stablecoins register
Canonical stable assets: 98
Open stale draft: PR #251 — Growth D; do not merge as-is
Active workstream: UI remediation
Gate V3-A: passed
Gate V3-B: passed
Gate V3-F: not passed
Production publication: automatic on main
```

The previous UI v2 implementation through PR #216 is an intermediate repository state. Owner review rejected the Modern Data Product visual direction as an acceptable final presentation. The replacement direction is Editorial Ledger.

The UI remediation is the binding workstream. Growth D, the 100-record audit, and non-UI release preparation are paused until the UI remediation and representative desktop/mobile audit are complete.

## Current factual baseline

```text
Canonical stable assets: 98
Organizations: generated from current canonical main
Events: generated from current canonical main
Guide publication: metadata-driven
Production deployment: automatic after merge to main
Screenshot audit: representative mode available for desktop and mobile
Shared shell: Editorial Ledger v3
```

PR #251 was created from an older main base and contains the former Growth D implementation. It is not the active workstream and must not be merged as-is. After UI completion, Growth D must be rebuilt cleanly from the then-current main using only reviewed candidate data.

## Completed work

```text
PR #207-#216 UI v2 implementation before final owner review
PR #217-#229 record and deployment quality
PR #230-#245 monitoring foundation and coverage
PR #246 final-eight candidate audit
PR #247 Growth A: 92 -> 94
PR #248 Growth B: 94 -> 96
PR #249 UK stablecoin capital-rules guide
PR #250 Growth C: 96 -> 98
PR #252-#255 guide-publication and automatic-deployment corrections
PR #256-#257 screenshot capture and one-click audit workflow
PR #258-#260 guide publication and Open USD editorial corrections
PR #261 Editorial Ledger UI v3 specification and schedule alignment
PR #262 shared Editorial Ledger shell
```

## UI v3 direction

Canonical visual authority:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/approved-mocks-v3/README.md
docs/ui-redesign/implementation-plan.md
DESIGN.md
```

The v3 direction is fixed as:

```text
Editorial Ledger
paper-like light background
dark ink
muted dark-red accent
thin rules
minimal corner radius
no decorative shadows
existing approved S/G logo only
no SaaS dashboard composition
no oversized hero
no KPI-card row
no repeated rounded-card grid
```

## Active UI remediation sequence

### PR #261 — specification and schedule alignment — complete

- established UI v3 as canonical visual authority;
- marked UI v2 visual references as superseded;
- updated roadmap, governance, required reading, and active-workstream validation;
- preserved all canonical data and public routes.

### PR #262 — shared Editorial Ledger shell — complete

- retained existing approved S/G logo assets;
- replaced dark SaaS shell tokens with paper, ink, rule, and restrained-accent tokens;
- simplified primary navigation;
- added compact registry search and About disclosure;
- replaced default hero, metric-card, panel, button, field, chip, and support-banner treatment with editorial primitives;
- retained focus, reduced-motion, forced-colors, and 44px control foundations;
- added UI v3 foundation validation;
- changed no canonical data or public routes.

### PR #263 — Home — active

- remove the remaining Home-specific marketing composition;
- implement masthead, one-line registry summary, latest material changes, current registry status, recent updates, and guides/reference entrypoints;
- preserve canonical counts and deterministic record selection.

### PR #264 — Stablecoins register

- implement table-first public-register composition;
- compact search/filter/sort row;
- add bounded pagination or equivalent deliberate incremental rendering;
- prevent uncontrolled word wrapping;
- correct false empty-state behavior.

### PR #265 — Stablecoin dossier

- replace stacked-card detail pages with a research dossier hierarchy;
- prioritize current state, mechanism, history, evidence, and known unknowns;
- preserve every protected canonical field;
- test low-, medium-, and high-information records.

### PR #266 — Organizations and Events

- render organizations as responsible-body records, not corporate profile cards;
- render events as incident/public-record files, not alert dashboards;
- repair index density and false empty states;
- retain all relationships, evidence, and value states.

### PR #267 — Guides

- separate editorial article layout from registry records;
- use a readable article column, table of contents, notes, tables, and related-guide rail;
- preserve all published guide routes and metadata-driven visibility.

### PR #268 — Reference and utility pages

- align Models, Glossary, Methodology, Updates, About, Corrections, Support, and Contact;
- use distinct Reference, Long-form, and Utility page families;
- remove remaining UI v2 card composition.

### PR #269 — mobile transformation

- implement page-specific compact records and long-form navigation;
- preserve material fields;
- support 320px width, 200 percent zoom, keyboard, focus, reduced motion, and forced colors.

### PR #270 — representative all-family visual audit

- run desktop representative capture;
- run mobile representative capture;
- inspect all unique pages plus three samples per repeated detail family;
- fix overflow, false empty states, broken hierarchy, logo misuse, and legacy SaaS remnants;
- Gate V3-F remains pending until this PR passes.

### PR #271 — accessibility, performance, and legacy cleanup

- remove unused UI v2 CSS and obsolete components only after replacement is complete;
- verify headings, tables, labels, contrast, focus, and keyboard operation;
- verify canonical count and route parity.

### PR #272 — production verification and UI v3 closure

- verify automatic main deployment for the intended commit;
- verify public provenance and machine-readable parity;
- verify representative desktop/mobile production captures;
- record Gate V3-F result and exact immutable release commit.

## UI acceptance gates

```text
Gate V3-A  specification and visual authority aligned — passed
Gate V3-B  shared shell complete — passed
Gate V3-C  core registry page families complete — pending
Gate V3-D  editorial/reference families complete — pending
Gate V3-E  mobile and accessibility complete — pending
Gate V3-F  representative visual audit passed — pending
Gate V3-G  owner approves exact release candidate — pending
Gate V3-H  production commit and public parity verified — pending
```

No agent may claim UI v3 completion before Gate V3-H.

## Paused work

The following are paused until PR #272 completes:

```text
Growth D to 100 records
100-record registry-wide quality audit
non-UI release-candidate preparation
new statistics surface work
broad machine-readable schema changes
new logo work
alternative visual-direction exploration
```

Urgent factual corrections, source-backed guide corrections, security fixes, or verified public breakage may interrupt the sequence through a narrowly scoped PR.

## Work after UI v3

After PR #272:

```text
1. close or archive stale PR #251;
2. rebuild Growth D from latest main;
3. promote two reviewed assets from 98 to 100;
4. run the 100-record registry audit;
5. run non-UI release preparation against the actual 100-record and UI v3 state;
6. resume monitoring coverage expansion and later growth.
```

The post-UI PR numbers are assigned only after PR #272 because intervening factual corrections may consume repository numbers. The roadmap must be updated before that work starts.
