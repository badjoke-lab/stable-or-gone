# Stable or Gone Roadmap

Updated: 2026-07-02  
Status: canonical execution schedule

## Current position

```text
Latest completed: PR #272 — accessibility, performance, and legacy cleanup
Partial precursor: PR #266 — Organization and Event row compaction; not Gate V3-C completion
Active: PR #273 — production verification and UI v3 closure
Next after UI closure: rebuild Growth D from latest main
Canonical stable assets: 98
Open stale draft: PR #251 — Growth D; do not merge as-is
Active workstream: UI remediation
Gate V3-A: passed
Gate V3-B: passed
Gate V3-C: passed
Gate V3-D: passed
Gate V3-E: passed
Gate V3-F: passed
Gate V3-G: pending exact release-candidate approval
Gate V3-H: pending production commit and public parity verification
Production publication: automatic on main
```

The former UI v2 Modern Data Product implementation is an intermediate state. Editorial Ledger is the binding visual direction. Growth D, the 100-record audit, and non-UI release preparation remain paused until PR #273 completes.

## Current factual baseline

```text
Canonical stable assets: 98
Organizations and events: Editorial Ledger registers and record files
Guide publication: metadata-driven
Production deployment: automatic after merge to main
Screenshot audit: desktop and mobile representative Gate V3-F audit passed
Shared shell: Editorial Ledger v3
Home: Editorial Ledger registry front page
Stablecoins: seven-column table-first register, 20 records per page
Stablecoin details: Editorial Ledger research dossiers
Organizations: six-column responsible-body register and record files
Events: six-column chronological register and incident/public-record files
Guides: Editorial Ledger archive and nine Editorial Article routes with on-page contents navigation
Reference: Models, Glossary, and Updates use scan-friendly indexes
Long-form: Methodology and About use readable columns and generated contents navigation
Utility: Contact/Corrections and Support preserve reporting, wallet, and copy functions
Mobile: compact information-preserving representations, controlled disclosures, keyboard support, copy feedback, reduced motion, and forced-colors support
Performance: PR #272 established passing source/build budgets and legacy-output guards
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
PR #266 partial Organization and Event row compaction
PR #267 corrective Editorial Ledger Organizations and Events completion
PR #268 Editorial Ledger Guides and Editorial Article family
PR #269 Reference, Long-form, and Utility page families
PR #270 mobile and accessibility hardening
PR #271 representative all-family visual audit and Gate V3-F
PR #272 accessibility, performance, and legacy cleanup
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
no giant hero
no KPI card row
no repeated rounded-card grid
no blue-purple glow
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

- added a ruled dossier masthead and protected fact ledger;
- ordered the body as assessment, organizations/control, mechanism, reserve/redemption, deployments/legal context, lifecycle history, evidence, known unknowns, and related records;
- preserved relationships, value states, deployments, events, evidence, reserve, regulatory, and uncertainty fields;
- changed no canonical data, public route, logo, or machine-readable output.

### PR #266 — Organization and Event row compaction — partial precursor

This merged PR changed only `OrganizationIndexRow.astro` and `EventIndexRow.astro`. It did not complete the page families and must not be treated as Gate V3-C completion.

### PR #267 — corrective Organizations and Events completion — complete

- rebuilt Organizations as a six-column responsible-body register and evidence-backed record files;
- rebuilt Events as a six-column chronological register and incident/public-record files;
- preserved search, filters, sorting, URL state, responsive records, taxonomy, relationships, typed details, subjects, evidence, recovery, value states, and known unknowns;
- passed all 18 pull-request workflows and Gate V3-C.

### PR #268 — Guides — complete

- replaced the Guides hero, KPI strip, category panels, and repeated mini-card grid with an Editorial Ledger guide archive;
- converted all nine guide routes to a shared Editorial Article family;
- added readable article columns, generated contents navigation, mobile disclosure, editorial tables, related records, revision history, glossary, methodology, and correction access;
- preserved article claims, source URLs, metadata, JSON-LD, sitemap coverage, related-guide links, routes, logos, and schemas.

### PR #269 — Reference and utility pages — complete

- converted Models, Glossary, and Updates into distinct scan-friendly Reference indexes;
- converted Methodology and About into Long-form pages with readable width and generated contents navigation;
- converted Contact/Corrections and Support into Utility pages with restrained action hierarchy;
- retained `/contact/` as the canonical corrections route;
- preserved reporting paths, support assets, networks, addresses, copy controls, fallback behavior, warnings, update history, public routes, and data;
- passed all 18 pull-request workflows and Gate V3-D.

### PR #270 — mobile and accessibility hardening — complete

- preserved all protected material fields at 320px and 200 percent zoom;
- added controlled navigation and contents disclosures with Escape focus return;
- retained twenty-five protected table contracts and compact mobile representations;
- added long-identifier wrapping, copy controls, polite success/failure feedback, visible focus, minimum targets, reduced motion, and forced-colors coverage;
- passed all 18 pull-request workflows, Astro check, production build, public consistency, and Gate V3-E.

### PR #271 — representative all-family visual audit — complete

- captured all twelve unique public pages on desktop and mobile;
- captured three stablecoin, organization, event, and guide detail representatives per device;
- uploaded and reviewed 48 full-page images;
- recorded zero capture failures, horizontal overflow, broken images, brand violations, legacy visual markers, false empty states, H1 errors, or main-landmark errors;
- passed all normal workflows, the rendered audit, human image review, and Gate V3-F;
- established the continuing representative visual-regression contract.

### PR #272 — accessibility, performance, and legacy cleanup — complete

- remove `PageHero.astro`, `MetricCard.astro`, and `editorial-v2.css` only after confirmed zero production references;
- remove the superseded stylesheet import and obsolete Hero/KPI compatibility selectors from active v3 CSS;
- preserve skip-link, focus, keyboard, Escape return, live announcements, 320px, 200 percent zoom, reduced motion, forced colors, long values, and protected mobile tables;
- add a static legacy-reintroduction guard;
- add post-build CSS, JavaScript, route, H1, main-landmark, and legacy-output measurements with explicit regression budgets;
- rerun all normal workflows and the 48-image representative desktop/mobile regression;
- change no canonical data, public route, logo, support destination, wallet value, or machine-readable schema.

### PR #273 — production verification and UI v3 closure — active

Verify automatic deployment, public provenance, machine-readable parity, production captures, Gate V3-G owner approval, Gate V3-H production parity, and the exact immutable release commit.

## UI acceptance gates

```text
Gate V3-A  specification and visual authority aligned — passed
Gate V3-B  shared shell complete — passed
Gate V3-C  core registry page families complete — passed
Gate V3-D  editorial/reference families complete — passed
Gate V3-E  mobile and accessibility complete — passed
Gate V3-F  representative visual audit passed — passed
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
