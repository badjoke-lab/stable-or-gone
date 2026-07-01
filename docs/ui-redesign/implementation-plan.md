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
```

Reference direction controls hierarchy and visual language, not public facts. Canonical data, approved editorial copy, reviewed local assets, and generated canonical counts are the only allowed public inputs.

## Current position

```text
Completed through: PR #260
Current UI: rejected intermediate UI v2 presentation
Active work item: PR #261 specification and schedule alignment
Next implementation: PR #262 shared Editorial Ledger shell
Canonical stable assets: 98
Growth D PR #251: stale draft; do not merge as-is
Gate V3-F: not passed
Release candidate: not selected
Production publication: automatic on main
```

Owner visual review has resumed. The Modern Data Product direction is no longer approved as the final SOG presentation. The replacement direction is Editorial Ledger.

## Completed historical UI work

```text
PR #207  UI v2 contract and references
PR #208  UI v2 visual foundation and approved S/G logo assets
PR #209  UI v2 Home
PR #210  UI v2 Stablecoins index
PR #211  UI v2 Stablecoin detail
PR #212  UI v2 Organizations
PR #213  UI v2 Events
PR #214  UI v2 editorial/project pages
PR #215  UI v2 mobile and accessibility
PR #216  UI v2 owner-review mark correction
```

These changes are retained as implementation history and as a source of reusable data and accessibility behavior. They are not the visual authority for v3.

## Preservation rules

Every v3 PR must preserve unless its scope explicitly and separately approves a change:

- canonical stable assets;
- organizations;
- relationships;
- classifications;
- reserve and redemption profiles;
- events and event details;
- evidence and evidence relations;
- reserve reports and context;
- known unknowns;
- regulatory notes;
- deployments;
- legal profiles;
- stable-asset relationships;
- reserve components;
- income profiles;
- guide publication metadata;
- route families;
- machine-readable outputs.

The UI may regroup or progressively disclose information. It may not erase protected fields or convert uncertainty into certainty.

## PR sequence

### PR #261 — documentation and authority alignment

Scope:

- add canonical v3 design contract;
- update roadmap and required reading;
- mark UI v2 visual authority as superseded;
- pause Growth D and non-UI continuation;
- update active-workstream validation.

Non-scope:

- no application UI implementation;
- no canonical data changes;
- no route changes;
- no logo changes.

### PR #262 — shared Editorial Ledger shell

Scope:

- retain existing approved S/G production assets;
- add paper, ink, rule, accent, status, typography, spacing, and table tokens;
- simplify desktop and mobile navigation;
- replace dashboard card primitives with editorial primitives;
- preserve focus, reduced motion, forced colors, and semantic structure.

Expected implementation areas:

```text
src/layouts/BaseLayout.astro
src/styles/global.css
src/styles/shell.css
shared navigation and brand components
shared editorial/register primitives
v3 foundation validator
```

Acceptance:

- existing logo only;
- no oversized hero primitive in the shared shell;
- no default KPI-card row primitive;
- no blue-purple glow;
- no repeated medium-radius dashboard panels as the base page language.

### PR #263 — Home

Required hierarchy:

1. masthead, date, and concise purpose;
2. one-line registry summary;
3. latest material changes;
4. current registry by status;
5. recently updated records;
6. guides and reference entrypoints;
7. compact footer.

Acceptance:

- no marketing hero;
- no metric-card row;
- canonical counts remain generated;
- latest and selected records use deterministic rules;
- page remains useful without decorative illustration.

### PR #264 — Stablecoins register

Required:

- table-first desktop register;
- compact filter and sort line;
- approved public taxonomy only;
- bounded pagination or equivalent deliberate incremental rendering;
- clear result count and filter state;
- true empty state only;
- page-specific mobile representation prepared for PR #269.

Acceptance:

- no unbounded 98-row initial page;
- no word-by-word table wrapping at supported desktop width;
- no hidden protected fields;
- query state remains shareable where the existing contract requires it.

### PR #265 — Stablecoin dossier

Required upper information:

- canonical name and symbol;
- record ID;
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

Required:

- distinct editorial article family;
- title, deck, publication and revision dates;
- readable body width;
- on-page contents;
- editorial treatment for notes, quotations, and tables;
- related guides and glossary assistance;
- all published and evergreen guide visibility preserved.

### PR #268 — Reference and utility pages

Reference family:

```text
Models
Glossary
```

Long-form family:

```text
Methodology
About
```

Utility family:

```text
Updates
Corrections
Support
Contact
```

Acceptance:

- one shared shell;
- distinct family-level layouts;
- no return to identical card stacks;
- machine-readable and correction entrypoints remain available.

### PR #269 — mobile, accessibility, and compact-layout hardening

Required:

- controlled navigation disclosure;
- compact two-level register rows or deliberate comparison scrollers;
- field labels remain attached to values;
- expandable local contents for guides and long dossiers;
- 320px width;
- 200 percent zoom;
- keyboard-only operation;
- focus visibility;
- result announcements;
- reduced motion;
- forced colors;
- protected information parity.

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

Required:

- remove unused UI v2 CSS and components after confirmed non-use;
- preserve reusable data, behavior, and accessibility logic;
- verify headings, table semantics, labels, contrast, focus, and keyboard flow;
- verify build size and unnecessary client JavaScript;
- run full repository validation.

### PR #272 — production verification and closure

Required:

- merge exact reviewed candidate to main;
- verify automatic production deployment;
- verify deployed commit and provenance;
- verify routes, counts, sitemap, JSON-LD, version, manifest, and machine-readable parity;
- run representative production desktop and mobile captures;
- record Gate V3-G owner approval and Gate V3-H production result.

## Gate definitions

```text
Gate V3-A  canonical specifications and schedule aligned
Gate V3-B  shared shell complete
Gate V3-C  core registry families complete
Gate V3-D  editorial/reference families complete
Gate V3-E  mobile/accessibility complete
Gate V3-F  representative visual audit complete
Gate V3-G  owner approves exact immutable candidate
Gate V3-H  production commit and parity verified
```

## Validation expectations

Each implementation PR must run the normal repository checks and the relevant page-family validator. During migration, existing UI v2 validators may remain as data-preservation or behavior checks, but they must not be treated as visual authority. New v3 validators replace or amend visual assertions as each page family moves.

## Screenshot rule

Representative mode is the default. Repeated record templates are sampled, not exhaustively captured. Exhaustive capture is reserved for a specific defect investigation or final exceptional audit and is never the default growth path.

## Growth and other work

Growth D, the 100-record audit, and non-UI release preparation remain paused through PR #272. Urgent factual corrections, source-backed editorial corrections, verified public breakage, and security fixes may use narrow interruption PRs.

After PR #272, Growth D must be rebuilt from the then-current main. The old PR #251 must not be merged as-is.
