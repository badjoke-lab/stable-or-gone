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
Completed through: PR #263 Editorial Ledger Home
Current UI: shared v3 shell and v3 Home; remaining page families still use transitional v2 content
Active work item: PR #264 Stablecoins register
Next implementation: PR #265 Stablecoin dossier
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

Every v3 PR must preserve unless its scope explicitly and separately approves a change:

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

- added the canonical Editorial Ledger contract and reference direction;
- updated roadmap, governance, required reading, and active-workstream validation;
- marked UI v2 visual authority as superseded;
- paused Growth D and the non-UI continuation;
- preserved canonical data, routes, and logo assets.

### PR #262 — shared Editorial Ledger shell

- retained the existing approved S/G production assets;
- added exact paper, ink, rule, accent, status, typography, spacing, and width tokens;
- changed the default brand surface to the existing `on-light` assets;
- replaced grouped SaaS navigation with compact primary navigation, truthful register search, About disclosure, mobile disclosure, and structured footer;
- removed dark navy, gradients, glow, decorative shadows, and medium-radius dashboard defaults from shared primitives;
- converted shared hero, metric, panel, button, field, chip, badge, and support-banner foundations to restrained editorial forms;
- preserved focus, 44px controls, reduced motion, forced colors, semantic markup, canonical counts, and routes;
- added `npm run validate:ui-v3-foundation`.

### PR #263 — Editorial Ledger Home

Deterministic selection rules:

```text
featured guides: published featured metadata, latest four
material changes: dated canonical events, descending, first five
recently reviewed records: stablecoin last_verified_at descending, first eight
registry review date: latest recorded review, event, or guide-current date used on Home
```

Completed:

- removed PageHero, MetricCard, SupportBanner, coin-stack illustration, KPI row, generic registry-entry card grid, and selected-slug showcase;
- added an editorial masthead with a truthful review-through date;
- added a one-line canonical summary for stable assets, organizations, events, and source identities;
- preserved searchable stablecoin, organization, and event records;
- added latest material changes from canonical event records and reviewed public copy;
- added lifecycle counts with an explicit statement that lifecycle is not a rating or recommendation;
- added recently reviewed stablecoin records with primary organization and review date;
- added metadata-driven guides plus Methodology, Glossary, Models, Updates, and Corrections entrypoints;
- preserved canonical counts, routes, search behavior, and WebSite JSON-LD;
- added UI v3 Home validation while retaining the old command as a workflow alias.

## Active sequence

### PR #264 — Stablecoins register

Required:

- table-first desktop register;
- compact search, filter, and sort line;
- approved public taxonomy only;
- bounded pagination or equivalent deliberate incremental rendering;
- clear result count and active-filter state;
- true empty state only;
- page-specific mobile representation prepared for PR #269.

Acceptance:

- no unbounded 98-row initial page;
- no word-by-word table wrapping at supported desktop width;
- no hidden protected fields;
- lifecycle and issuance remain separate;
- query state remains shareable where the existing contract requires it.

### PR #265 — Stablecoin dossier

Required upper information:

- canonical name, symbol, aliases, and record ID;
- lifecycle and issuance state;
- reference target;
- primary organization and additional relationship indication;
- backing, stabilization, redemption, launch, and last review;
- material change summary.

Required body:

- assessment or reviewed summary;
- organizations and control;
- mechanism;
- reserve and redemption;
- deployments and legal context;
- lifecycle and event history;
- evidence;
- known unknowns;
- corrections and further reading.

Acceptance:

- no synthetic score;
- no repetitive identical card stack;
- evidence is reachable before the absolute end of a long page;
- low-, medium-, and high-information records all render intentionally.

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

### PR #267 — Guides

- distinct editorial article family;
- title, deck, publication and revision dates;
- readable body width and on-page contents;
- editorial treatment for notes, quotations, and tables;
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

Capture mode:

```text
desktop representative
mobile representative
```

Coverage:

- Home;
- every unique index and project page;
- three stablecoin detail samples;
- three organization detail samples;
- three event detail samples;
- three guide samples;
- all unique reference and utility pages.

Acceptance:

- zero capture failures;
- zero false empty states;
- zero uncontrolled horizontal overflow;
- existing approved logo used correctly;
- no visible legacy SaaS dashboard composition in migrated pages;
- canonical count and route parity.

Gate V3-F passes only after this audit and its repair list are complete.

### PR #271 — cleanup and release hardening

- remove unused UI v2 CSS and components after confirmed non-use;
- preserve reusable data, behavior, and accessibility logic;
- verify headings, table semantics, labels, contrast, focus, and keyboard flow;
- verify build size and unnecessary client JavaScript;
- run full repository validation.

### PR #272 — production verification and closure

- merge the exact reviewed candidate to main;
- verify automatic production deployment and deployed provenance;
- verify routes, counts, sitemap, JSON-LD, version, manifest, and machine-readable parity;
- run representative production desktop and mobile captures;
- record Gate V3-G owner approval and Gate V3-H production result.

## Gate definitions

```text
Gate V3-A  canonical specifications and schedule aligned — passed
Gate V3-B  shared shell complete — passed
Gate V3-C  core registry families complete — pending
Gate V3-D  editorial/reference families complete — pending
Gate V3-E  mobile/accessibility complete — pending
Gate V3-F  representative visual audit complete — pending
Gate V3-G  owner approves exact immutable candidate — pending
Gate V3-H  production commit and parity verified — pending
```

## Validation expectations

Each implementation PR must run normal repository checks and the relevant page-family validator. Existing UI v2 commands may remain temporarily as aliases for current v3 validators so workflow wiring does not enforce superseded visual rules.

```text
npm run validate:ui-v3-foundation
node scripts/validate-ui-v3-home.mjs
```

## Screenshot rule

Representative mode is the default. Repeated record templates are sampled, not exhaustively captured. Exhaustive capture is reserved for a specific defect investigation or exceptional final audit.

## Growth and other work

Growth D, the 100-record audit, and non-UI release preparation remain paused through PR #272. Urgent factual corrections, source-backed editorial corrections, verified public breakage, and security fixes may use narrow interruption PRs.

After PR #272, Growth D must be rebuilt from the then-current main. The old PR #251 must not be merged as-is.
