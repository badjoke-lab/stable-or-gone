# Stable or Gone approved UI contract v3

Status: canonical visual and page-implementation contract  
Approved: 2026-07-01  
Implementation family: Editorial Ledger  
Supersedes for visual implementation: `docs/architecture/approved-modern-data-product-ui-v2.md`

## 1. Authority

This document is the binding visual and page-layout contract for the SOG UI remediation beginning after PR #260.

It governs visual direction, page composition, typography, spacing, navigation, component treatment, responsive transformation, and visual acceptance. It does not redefine canonical record meaning. Canonical data, taxonomy, evidence, value-state, monitoring, and publication rules remain governed by their own specifications.

Every UI implementation PR must cite:

```text
docs/ui-redesign/master-spec.md
docs/architecture/approved-editorial-ledger-ui-v3.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

When this document conflicts with UI v2 mocks, UI v2 components, generated mock files, chat history, or the current production presentation, this document wins for visual implementation.

## 2. Product direction

SOG is not a SaaS dashboard, product landing page, exchange interface, trading terminal, portfolio tracker, or startup analytics surface.

SOG is presented as the intersection of:

```text
stablecoin research ledger
historical record
financial and regulatory reference
source-backed public register
editorial archive
```

Working phrase:

```text
Editorial Ledger
```

The interface must feel:

- archival;
- sober;
- editorial;
- source-led;
- information-dense but readable;
- closer to a financial register, investigation file, public record, or newspaper index than to a software dashboard.

## 3. Explicitly prohibited visual patterns

The following are prohibited in the v3 implementation unless a later specification explicitly authorizes a narrow exception:

- oversized marketing hero sections;
- hero text paired with metric cards;
- rows of three or four KPI cards;
- large numbers used as decorative proof of product value;
- meaningless gradients;
- blue-purple glow;
- neon crypto styling;
- repeated rounded cards;
- cards inside cards;
- large promotional CTA buttons;
- `Overview`, `Explore`, or `Discover` sections used to disguise weak information architecture;
- every section placed in the same bordered box;
- dashboard sidebars;
- radar, donut, or decorative monitoring charts on registry pages;
- generated replacement logos;
- visual imitation of the rejected monitoring-dashboard mocks.

## 4. Existing logo contract

The approved S/G logo already exists and must be reused without redesign.

Production assets:

```text
public/brand/sog-lockup-on-light.svg
public/brand/sog-lockup-on-dark.svg
public/brand/sog-mark-on-light.svg
public/brand/sog-mark-on-dark.svg
```

Rules:

- do not create a new logo;
- do not redraw the letters;
- do not substitute a text-only logo;
- do not generate an imitation symbol;
- use the on-light lockup on the default paper background;
- retain the existing proportions and coral interruption motif;
- use the compact mark only where the full lockup cannot fit.

## 5. Visual system

### 5.1 Base palette

The default public surface is light, not dark.

Recommended implementation range:

```text
page background       #F3F0E8 to #F7F5EF
primary surface       transparent or same as page
secondary surface     #ECE8DE used sparingly
primary ink           #171717 to #222222
secondary ink         #53504A
muted ink             #777269
rule                   #B8B2A7 to #C8C2B7
strong rule            #5D5850
primary accent         #7A1F24 to #8E2B2F
active                 muted green
limited                muted amber
impaired               burnt orange
failed/discontinued    muted red
informational          restrained blue only when semantically required
```

Exact tokens are fixed in the shared-shell implementation PR. Accent color must remain sparse.

### 5.2 Typography

Use typography to create hierarchy instead of panels and effects.

- display and major editorial headings: restrained serif stack;
- navigation, body text, filters, and table labels: readable sans-serif stack;
- record IDs, dates, version strings, and machine-oriented identifiers: monospace stack;
- tabular numerals for aligned counts and dates;
- strong contrast between page title, section title, body, annotation, and metadata;
- no tiny text used to force a dashboard density.

### 5.3 Shape, depth, and rules

- square corners by default;
- maximum radius 2 to 4px where controls require it;
- no decorative box shadow;
- no raised dashboard surfaces;
- no glassmorphism;
- thin horizontal and vertical rules are primary layout tools;
- larger spacing is used between semantic sections, not between arbitrary cards;
- status labels are compact and factual.

### 5.4 Layout frame

Desktop pages use a wide editorial frame suitable for registers and multi-column reading.

Recommended maximum widths:

```text
registry and home pages: 1240 to 1380px
record dossiers:         1120 to 1280px
long-form guides:        1080 to 1240px overall
article body:             680 to 760px
```

## 6. Shared shell

### 6.1 Header

Desktop header hierarchy:

```text
approved S/G lockup
Register
Events
Organizations
Guides
Search
About disclosure
```

Secondary items move into the About disclosure or footer:

```text
Glossary
Models
Methodology
Updates
Corrections
Support
Contact
Data access
```

The header must remain compact and must not place every route at equal visual priority.

### 6.2 Footer

The footer may contain:

- approved lockup or compact mark;
- methodology;
- updates;
- about;
- corrections;
- support;
- contact;
- GitHub issues;
- machine-readable entrypoints;
- registry disclaimer.

The footer is structured with rules and columns, not a large CTA banner.

## 7. Page-family contracts

### 7.1 Home

Home is a first page of a register, not a landing-page hero.

Required order:

1. masthead, date, and one-sentence purpose;
2. one-line registry summary such as `98 assets · 93 organizations · 166 events`;
3. two-column lead area:
   - latest material changes;
   - current registry by status;
4. recently updated records;
5. guides and reference entrypoints;
6. compact footer.

The primary emphasis is:

- what materially changed;
- which records currently require attention;
- where to enter the register.

Counts must not become KPI cards.

### 7.2 Stablecoin register

The stablecoin index is a public register or financial-paper table.

Required desktop structure:

```text
STABLECOIN REGISTER                                  98 RECORDS
Search | Status | Peg | Model | Sort

Name | Symbol | Peg | Status | Issuer | Model | Updated
```

Rules:

- table-first presentation;
- compact controls in one line where space allows;
- no filter cards;
- no card grid as the primary desktop representation;
- pagination or deliberate incremental rendering so record growth does not create an unbounded page;
- compact semantic status labels;
- column selection must prevent word-by-word vertical wrapping;
- empty state appears only when the filtered result is truly empty.

### 7.3 Stablecoin dossier

A stablecoin detail page is a research dossier.

Required upper section:

```text
SUSD / SYNTHETIX USD
Record SOG-000023                              IMPAIRED

Status
Peg
Issuer
Launch
Redemption
Backing
Last review
```

Required body hierarchy:

1. assessment or reviewed summary;
2. lifecycle;
3. reserve and redemption;
4. organizations and control relationships;
5. deployments and legal context where applicable;
6. material events;
7. evidence;
8. known unknowns;
9. related records and corrections.

Evidence, deployments, and known unknowns must not appear as a repetitive sequence of identical blue cards. Rules, headings, definition lists, timelines, and tables provide structure. Long secondary material may use controlled disclosure, but the current state and material evidence remain directly reachable.

No synthetic safety score or recommendation may be added.

### 7.4 Organization record

An organization page is a registry record of a responsible or connected body, not a corporate profile card.

Required hierarchy:

```text
ORGANIZATION RECORD
Name
Role in SOG
Jurisdiction or explicit value state
Related assets
Current and historical relationships
Material changes
Evidence
Known unknowns
```

The page must not imply that every organization is an issuer.

### 7.5 Event record

An event page is an incident or public-record file.

Required hierarchy:

```text
EVENT ID
Event title
Date or timeframe
Event type
Affected assets
Actors
Confidence and evidence state
Summary
What changed
Affected relationships or deployments
Evidence
Known unknowns
```

The page must not resemble an alert dashboard.

### 7.6 Guides

Guides use an editorial article layout distinct from registry records.

Required structure:

- article category;
- title;
- deck;
- published and updated dates;
- readable article column;
- on-page table of contents;
- notes, quotations, and tables treated editorially;
- related guides and glossary assistance.

The article body must not be enclosed in one giant rounded card. A guide may use a narrow body column with a left or right rail.

### 7.7 Reference and project pages

Page families:

```text
Reference: Models, Glossary
Long-form: Methodology, About
Utility: Updates, Corrections, Support, Contact
```

These families share the shell but do not all use identical internal composition.

## 8. Responsive contract

Mobile is a deliberate transformation, not the desktop page stacked into giant cards.

Required behavior:

- preserve the approved logo and key navigation;
- collapse secondary navigation into one controlled disclosure;
- retain search;
- convert register rows into compact two-level records or a deliberate comparison scroller;
- keep field labels attached to values;
- do not hide material fields using global column-number CSS;
- use an expandable table of contents for guides and long dossiers;
- preserve evidence and known unknown access;
- support 320px width and 200 percent zoom;
- preserve keyboard, focus, reduced-motion, forced-colors, and screen-reader behavior.

## 9. Data-truth rules

The v3 visual remediation must not invent:

- live price or market data;
- market capitalization or supply figures;
- holder or transfer counts;
- synthetic ratings;
- issuer verification badges;
- unsupported reserve totals;
- invented evidence counts;
- invented relative timestamps;
- unsupported legal conclusions;
- asset-specific copy stored only inside rendering components.

Canonical data, approved editorial copy, generated canonical counts, and reviewed local assets remain the only default public inputs.

## 10. Acceptance and visual audit

The screenshot workflow uses representative mode by default.

For each major implementation phase, verify:

- Home;
- all index families;
- three representative stablecoin dossiers;
- three representative organization records;
- three representative event records;
- three representative guides;
- all unique reference and utility pages;
- desktop and mobile states.

Detailed records with the same template are sampled; they are not all captured by default.

The implementation is not complete until:

- legacy SaaS cards and dashboard composition are removed from the affected page families;
- the existing approved logo is used everywhere required;
- desktop and mobile representative captures complete with zero failures;
- no false empty state remains;
- no uncontrolled horizontal overflow remains;
- canonical record counts and public routes are preserved;
- all repository validation passes.

## 11. Change control

Do not introduce another visual direction from memory. Any change to background family, logo, page-family hierarchy, primary navigation, register structure, or dossier hierarchy requires updates to this contract, `docs/ui-redesign/implementation-plan.md`, and `docs/roadmap.md` in the same reviewed change.
