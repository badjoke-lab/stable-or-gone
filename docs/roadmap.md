# Stable or Gone Roadmap

Updated: 2026-07-01  
Status: canonical execution schedule

## Current position

```text
Latest completed: PR #265 — Editorial Ledger Stablecoin dossier
Active: PR #266 — Organizations and Events
Next: PR #267 — Guides
Canonical stable assets: 98
Open stale draft: PR #251 — Growth D; do not merge as-is
Active workstream: UI remediation
Gate V3-A: passed
Gate V3-B: passed
Gate V3-F: not passed
Production publication: automatic on main
```

The former UI v2 Modern Data Product implementation is an intermediate state. Editorial Ledger is the binding visual direction. Growth D, the 100-record audit, and non-UI release preparation remain paused until PR #272 completes.

## Current factual baseline

```text
Canonical stable assets: 98
Organizations and events: generated from canonical main
Guide publication: metadata-driven
Production deployment: automatic after merge to main
Screenshot audit: representative desktop and mobile modes available
Shared shell: Editorial Ledger v3
Home: Editorial Ledger registry front page
Stablecoins: seven-column table-first register, 20 records per page
Stablecoin details: Editorial Ledger research dossiers
```

PR #251 was created from an older main base. It must not be merged as-is. Growth D must later be rebuilt from the then-current main.

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
PR #256-#257 screenshot capture and audit workflow
PR #258-#260 guide publication and Open USD corrections
PR #261 Editorial Ledger UI v3 specification and schedule alignment
PR #262 shared Editorial Ledger shell
PR #263 Editorial Ledger Home
PR #264 Editorial Ledger Stablecoins register
PR #265 Editorial Ledger Stablecoin dossier
```

## Fixed UI direction

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

Canonical visual authority:

```text
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/approved-mocks-v3/README.md
docs/ui-redesign/implementation-plan.md
DESIGN.md
```

## UI remediation sequence

### PR #261 — specification and schedule alignment — complete

Established UI v3 authority, superseded v2 visual references, updated governance and the execution schedule, and preserved canonical data and routes.

### PR #262 — shared Editorial Ledger shell — complete

Replaced dark SaaS shell defaults with paper, ink, rules, compact navigation, registry search, structured footer, restrained primitives, and accessibility foundations.

### PR #263 — Home — complete

Replaced the marketing landing composition with an editorial masthead, canonical summary line, material changes, lifecycle counts, recently reviewed records, guides, and reference entrypoints.

### PR #264 — Stablecoins register — complete

Replaced the hero, KPI cards, filter panels, and nine-column dashboard table with a seven-column public register, six taxonomy filters, six sorts, URL state, two-to-four-record comparison, and 20-record pagination.

### PR #265 — Stablecoin dossier — complete

- removed PageHero, six MetricCards, circular glow art, dark panel navigation, and the repeated gradient-card stack;
- added a ruled dossier masthead with name, symbol, aliases, record ID, lifecycle, issuance, reference, primary organization, launch, redemption, backing, stabilization, last review, evidence access, and latest material change;
- ordered the body as assessment, organizations/control, mechanism, reserve/redemption, deployments/legal context, lifecycle history, evidence, known unknowns, and related records;
- preserved every protected relationship, value state, deployment, event, evidence, reserve, regulatory, and uncertainty field;
- placed evidence in upper facts and local navigation and before the final unknown/related sections;
- added intentional empty states for low-information records;
- added UI v3 dossier validation and retained the v2 command as a compatibility alias;
- changed no canonical data, public route, logo, or machine-readable output.

### PR #266 — Organizations and Events — active

- render organizations as responsible-body records, not corporate profile cards;
- render events as incident/public-record files, not alert dashboards;
- repair index density and false empty states;
- retain relationships, evidence, and value states.

### PR #267 — Guides

Use a distinct editorial article family with readable body width, contents navigation, notes, tables, related guides, and unchanged published routes.

### PR #268 — Reference and utility pages

Align Models, Glossary, Methodology, Updates, About, Corrections, Support, and Contact while keeping distinct Reference, Long-form, and Utility families.

### PR #269 — mobile transformation

Preserve material fields at 320px and 200 percent zoom with page-specific compact records, keyboard support, focus, reduced motion, and forced colors.

### PR #270 — representative all-family visual audit

Capture desktop and mobile representatives; inspect all unique pages and three samples per repeated detail family; fix overflow, false empty states, hierarchy, logo misuse, and remaining SaaS styling. Gate V3-F remains pending until this passes.

### PR #271 — accessibility, performance, and legacy cleanup

Remove obsolete v2 CSS/components after replacement, then verify headings, tables, labels, contrast, focus, keyboard operation, canonical counts, and route parity.

### PR #272 — production verification and UI v3 closure

Verify automatic deployment, public provenance, machine-readable parity, production captures, Gate V3-F, and the exact immutable release commit.

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

```text
Growth D to 100 records
100-record registry-wide quality audit
non-UI release-candidate preparation
new statistics surface work
broad machine-readable schema changes
new logo work
alternative visual-direction exploration
```

Urgent factual corrections, source-backed guide corrections, security fixes, or verified public breakage may interrupt through a narrowly scoped PR.

## Work after UI v3

```text
1. close or archive stale PR #251;
2. rebuild Growth D from latest main;
3. promote two reviewed assets from 98 to 100;
4. run the 100-record registry audit;
5. run non-UI release preparation against the actual 100-record and UI v3 state;
6. resume monitoring coverage expansion and later growth.
```
