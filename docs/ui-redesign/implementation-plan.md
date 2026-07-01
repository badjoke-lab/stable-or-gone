# Stable or Gone UI implementation plan v3

Status: canonical implementation schedule — active  
Updated: 2026-07-01  
Registry checkpoint: 98 canonical stable assets  
Visual direction: Editorial Ledger

## Authority

Every UI pull request must follow:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/approved-mocks-v3/README.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
docs/public-taxonomy-spec.md
DESIGN.md
```

Reference direction controls hierarchy and visual language, not public facts. Canonical data, approved editorial copy, reviewed local assets, and generated canonical counts are the only allowed public inputs.

## Current position

```text
Completed through: PR #265 Editorial Ledger Stablecoin dossier
Current UI: shared v3 shell, v3 Home, v3 Stablecoins register, and v3 Stablecoin dossiers; remaining page families are transitional
Active work item: PR #266 Organizations and Events
Next implementation: PR #267 Guides
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Gate V3-A: passed
Gate V3-B: passed
Gate V3-F: not passed
Release candidate: not selected
Production publication: automatic on main
```

The Modern Data Product direction is superseded. Remaining v2 page implementations are temporary migration content and sources of reusable data mapping, interaction, accessibility, and approved logo behavior only.

## Preservation rules

Every v3 PR must preserve unless separately approved:

- canonical stable assets;
- organizations and relationships;
- classifications and public taxonomy meaning;
- reserve and redemption profiles;
- events and event details;
- evidence and evidence relations;
- reserve reports and context;
- known unknowns;
- regulatory notes;
- deployments and legal profiles;
- stable-asset relationships;
- reserve components and income profiles;
- guide publication metadata;
- route families and machine-readable outputs.

The UI may regroup or progressively disclose information. It may not erase protected fields or convert uncertainty into certainty.

## Completed v3 work

### PR #261 — documentation and authority alignment

Established Editorial Ledger authority, superseded v2 visual references, paused Growth D, and preserved canonical data, routes, and logo assets.

### PR #262 — shared Editorial Ledger shell

Added paper, ink, rule, accent, typography, spacing, compact navigation, truthful search, structured footer, restrained primitives, and accessibility foundations.

### PR #263 — Editorial Ledger Home

Replaced the marketing landing composition with a registry masthead, one-line canonical summary, material changes, lifecycle counts, recently reviewed records, guides, and reference entrypoints.

### PR #264 — Editorial Ledger Stablecoins register

Implemented the seven-column table-first register, six filters, six sorts, URL-synchronized state, bounded comparison, 20-record pagination, visible range, true zero-result handling, and protected compact records.

Validation:

```text
npm run validate:ui-v3-stablecoin-index
npm run prepare:index-interaction-contract
```

### PR #265 — Editorial Ledger Stablecoin dossier

Upper record:

- canonical name, symbol, aliases, and record ID;
- lifecycle and issuance state;
- reference target;
- primary organization and additional relationship indication;
- launch, redemption, backing, stabilization, and last review;
- direct evidence access;
- latest dated material change.

Body hierarchy:

- reviewed assessment;
- organizations and control;
- mechanism;
- reserve and redemption;
- deployments and legal context;
- lifecycle and event history;
- evidence;
- known unknowns;
- corrections and further reading.

Presentation:

- removed PageHero, six MetricCards, circular glow art, dark rounded navigation, and repeated gradient panels;
- replaced them with a ruled masthead, fact ledger, definition lists, timelines, tables, and controlled disclosure;
- kept Evidence reachable from upper facts and local navigation and before the final unknown/related sections;
- added explicit low-information states without inventing defaults;
- preserved dense high-information records and every protected canonical field;
- added `npm run validate:ui-v3-stablecoin-detail`;
- retained `validate:ui-v2-stablecoin-detail` as a compatibility alias.

Acceptance:

- no synthetic score;
- no repetitive identical card stack;
- no route, canonical data, logo, or machine-readable shape change;
- evidence remains directly reachable;
- low-, medium-, and high-information records render intentionally.

## Active sequence

### PR #266 — Organizations and Events

Organizations:

- responsible-body record hierarchy;
- role, jurisdiction, connected assets, current and historical relationships, material changes, evidence, and known unknowns;
- no issuer assumption.

Events:

- incident/public-record hierarchy;
- ID, date or timeframe, category/subtype, affected records, actors, impact, summary, typed detail, evidence, and known unknowns;
- no alert-dashboard composition.

Indexes:

- repair density and false empty states;
- reduce non-comparison columns;
- add bounded pagination or equivalent rendering where needed.

Acceptance:

- Gate V3-C may pass only when the Stablecoins register, Stablecoin dossier, Organizations, and Events page families all satisfy the v3 contract;
- all relationships, evidence, typed details, and value states remain reachable;
- organization pages do not imply every connected body is an issuer;
- event pages do not resemble monitoring alerts.

### PR #267 — Guides

- distinct editorial article family;
- title, deck, publication and revision dates;
- readable body width and on-page contents;
- editorial notes, quotations, and tables;
- related guides and glossary assistance;
- all published and evergreen guide visibility preserved.

### PR #268 — Reference and utility pages

```text
Reference: Models, Glossary
Long-form: Methodology, About
Utility: Updates, Corrections, Support, Contact
```

Acceptance:

- one shared shell;
- distinct family-level layouts;
- no return to identical card stacks;
- machine-readable and correction entrypoints remain available.

### PR #269 — mobile, accessibility, and compact-layout hardening

- controlled navigation disclosure;
- compact two-level register rows or deliberate comparison scrollers;
- field labels remain attached to values;
- expandable local contents for guides and long dossiers;
- 320px width and 200 percent zoom;
- keyboard-only operation and visible focus;
- result announcements, reduced motion, forced colors, and protected information parity.

### PR #270 — representative visual audit

Capture desktop and mobile representatives for Home, every unique index/project page, three stablecoin details, three organization details, three event details, three guides, and every unique reference/utility page.

Acceptance:

- no legacy SaaS composition remains in the sampled release candidate;
- no material overflow or false empty state;
- approved logo use is consistent;
- Gate V3-F is recorded only after the representative audit passes.

### PR #271 — accessibility, performance, and legacy cleanup

- remove unused v2 CSS and obsolete components only after replacements exist;
- verify headings, labels, tables, contrast, focus, keyboard operation, reduced motion, forced colors, counts, routes, and build output;
- keep cleanup separate from page-family redesign.

### PR #272 — production verification and closure

- verify automatic main deployment for the intended commit;
- verify provenance and machine-readable parity;
- verify representative desktop/mobile production captures;
- record Gate V3-F and the immutable production commit;
- do not claim UI v3 completion before Gate V3-H.

## Validation rule

Each implementation PR must run normal repository checks and the relevant page-family checks. Current v3 commands are:

```text
npm run validate:ui-v3-foundation
npm run validate:ui-v3-home
npm run validate:ui-v3-stablecoin-index
npm run validate:ui-v3-stablecoin-detail
npm run validate:active-workstream
npm run validate:mobile-information
npm run check
npm run build
npm run verify:consistency
```

## Screenshot rule

Representative capture is the default. Repeated detail families are sampled rather than exhaustively captured. Full capture remains available only for targeted debugging.

## Paused non-UI work

Until PR #272 completes:

```text
Growth D to 100 records
100-record registry-wide audit
non-UI release preparation
new stats surface
broad schema work
new logo work
alternative visual directions
```
