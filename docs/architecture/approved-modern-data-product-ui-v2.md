# Stable or Gone approved UI contract v2

Status: canonical visual and page-implementation contract  
Approved: 2026-06-27  
Implementation family: Modern Data Product  
Supersedes for visual implementation: `docs/architecture/visual-system-and-mocks-v1.md`

## 1. Authority

This document is the binding visual and page-layout contract for the next SOG UI implementation.

The v1 visual-system document remains historical evidence of the earlier repair program, but it no longer authorizes production visual work. When this document conflicts with v1 mocks, generated SVG mocks, chat history, or already-merged partial UI, this document wins.

Every UI implementation PR must cite:

```text
docs/ui-redesign/master-spec.md
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

No page may be redesigned from memory or from an unapproved generated image.

## 2. Approved product direction

SOG is presented as a modern, search-first historical data product.

The interface must feel:

- contemporary;
- precise;
- research-grade;
- dense but readable;
- clearly different from the previous flat text-and-table site;
- useful for exploring connected stablecoin, organization, event, evidence, and methodology records.

The interface must not feel like:

- an exchange;
- a trading terminal;
- a portfolio tracker;
- a market-cap dashboard;
- a token-promotion site;
- a safety-rating product;
- an issuer-sponsored directory.

## 3. Approved reference mocks

The approved desktop reference set contains one image per page:

```text
docs/ui-redesign/approved-mocks-v2/01-home.webp
docs/ui-redesign/approved-mocks-v2/02-stablecoin-index.webp
docs/ui-redesign/approved-mocks-v2/03-stablecoin-detail.webp
docs/ui-redesign/approved-mocks-v2/04-organization-index.webp
docs/ui-redesign/approved-mocks-v2/05-organization-detail.webp
docs/ui-redesign/approved-mocks-v2/06-event-index.webp
docs/ui-redesign/approved-mocks-v2/07-event-detail.webp
docs/ui-redesign/approved-mocks-v2/08-methodology.webp
```

Approved logo references:

```text
docs/ui-redesign/approved-mocks-v2/logo-lockup-light-reference.webp
docs/ui-redesign/approved-mocks-v2/logo-symbol-light-reference.webp
docs/ui-redesign/approved-mocks-v2/logo-lockup-dark-reference.webp
docs/ui-redesign/approved-mocks-v2/logo-symbol-dark-reference.webp
```

These images define composition, hierarchy, density, tone, spacing relationships, and component families. They do not authorize invented data or unsupported functionality.

## 4. Brand and logo contract

The site uses the approved S/G monogram crossed by a horizontal line that becomes a short coral broken segment on the right.

Rules:

- use the approved S/G mark only;
- do not substitute the blue stacked-cube symbol shown in rejected mocks;
- do not generate a new logo during implementation;
- use the full lockup in desktop header and footer where space permits;
- use the monogram for compact navigation, favicon, and small brand surfaces;
- produce implementation SVG assets from the approved references without altering proportions or the coral interruption motif;
- preserve adequate contrast on dark and light surfaces.

The final SVG asset paths must be stable and documented in the implementation PR.

## 5. Visual system

### 5.1 Color direction

The approved UI is dark navy with bright blue interaction accents and restrained semantic colors.

Implementation tokens must be derived from this range:

```text
page background        #030B16 to #061221
surface                 #081727 to #0C1D30
surface raised          #0D2136 to #112A43
line                    #17344D to #245071
primary text            #F2F7FB
secondary text          #A8BAC9
muted text              #73899C
primary accent          #10AFFF to #2CBFFF
primary accent strong   #058EE8
logo teal               approved S/G reference
logo coral              approved S/G reference
positive                green, text plus shape
warning                 amber, text plus shape
negative                red, text plus shape
informational           blue or violet, text plus shape
```

Exact values are fixed in the visual-foundation implementation PR and must pass contrast checks.

### 5.2 Typography

- use a clean sans-serif system for application UI and record content;
- preserve the approved logo typography as an image/SVG asset rather than attempting to recreate it with page fonts;
- use large, bold sans-serif page titles;
- use compact uppercase eyebrow labels sparingly;
- use tabular numerals for counts, dates, and aligned data;
- do not use tiny text to force dense content into one screen.

### 5.3 Shape and depth

- medium-radius panels;
- thin blue-gray borders;
- subtle layered backgrounds rather than heavy shadows;
- bright blue focus and active states;
- restrained glow only in decorative hero illustrations;
- no glassmorphism that lowers readability;
- no oversized gradients behind body text.

### 5.4 Decorative illustrations

The glowing coin-stack, organization-building, and event-calendar illustrations are optional decorative motifs.

If implemented, they must:

- be local static assets or CSS/SVG;
- remain non-essential;
- never encode canonical facts;
- be hidden from assistive technology when decorative;
- not block text or controls;
- not materially increase page weight.

## 6. Asset identity rules

### 6.1 Stablecoin marks

SOG must not depend on arbitrary externally hosted token logos.

Default presentation:

- circular ticker badge;
- short symbol such as `USDC`, `USDT`, `DAI`, or `UST`;
- deterministic accessible label;
- consistent SOG styling.

An official coin logo may replace the ticker badge only when all of the following are recorded:

```text
stablecoin_id
local asset path
source URL
source type
verification date
review status
```

No hotlinking. No generated imitation logos. No name-only matching from third-party logo sets.

### 6.2 Organization marks

Default presentation is an organization-initial badge or generic organization-category icon. Official organization marks require the same local-source and verification record as stablecoin marks.

## 7. Data truth and prohibited mock-only features

The approved mocks contain visual placeholders that must not become product claims.

Do not implement without a separately approved data source and specification:

- live prices;
- market capitalization;
- circulating supply;
- holder counts;
- transfer counts;
- market charts;
- monthly growth deltas;
- saved views;
- watchlists;
- follow buttons;
- user accounts;
- recently viewed history;
- live notifications;
- issuer verification badges without a canonical verification field;
- transparency scores;
- safety assessments;
- unsupported reserve totals;
- invented evidence counts;
- invented relative timestamps;
- unsupported licensing conclusions.

Existing canonical fields, generated counts, evidence relations, reserve records, deployments, and known unknowns remain the only default source of public claims.

## 8. Shared shell

### 8.1 Desktop header

- approved S/G lockup on the left;
- grouped navigation across Registry, Learn, and Project;
- Corrections remains visible;
- Support remains secondary;
- current-page state uses text and line/shape, not color alone;
- header must not wrap into uncontrolled rows at supported desktop widths.

### 8.2 Footer

- approved lockup or symbol;
- methodology, updates, about, corrections, support, GitHub issues, version JSON, data manifest, LLM guide, and AI/API entrypoints where they exist;
- registry disclaimer;
- canonical-only and known-unknown preservation note.

### 8.3 Reusable components

The implementation must establish shared components for:

```text
AppShell
BrandLockup
GroupedNavigation
PageHero
RegistrySearch
MetricCard
ActionCard
FilterBar
ActiveFilterSummary
StatusChip
TickerBadge
OrganizationBadge
DataTable
CompactRecordCard
EvidenceList
KnownUnknownPanel
SupportBanner
EditorialSectionNav
EditorialCard
```

Page code must not duplicate visual primitives with slightly different local CSS.

## 9. Page contracts

### 9.1 Home

Reference: `01-home.webp`

Required hierarchy:

1. product statement;
2. registry-wide search or the widest truthful search currently supported;
3. canonical counts for stablecoins, organizations, events, and source identities;
4. primary registry entry cards;
5. guide entry cards;
6. explicitly selected stablecoin records using a documented rule;
7. support banner;
8. footer.

The selected-record section must never depend on raw array order.

### 9.2 Stablecoin index

Reference: `02-stablecoin-index.webp`

Required:

- page title and scope statement;
- search;
- approved taxonomy filters;
- clear-all and active-state behavior;
- canonical registry counts;
- dense desktop table;
- mobile compact record representation;
- lifecycle and issuance kept separate;
- primary organization and last-reviewed fields when available;
- export link only when a real export exists.

Mock-only saved views and compare tray are excluded from the first implementation release. The already approved bounded comparison contract may be implemented later only if it remains truthful and account-free.

### 9.3 Stablecoin detail

Reference: `03-stablecoin-detail.webp`

Required:

- ticker badge, canonical name, symbol, short summary;
- lifecycle, reference target, model, issuance, primary organization, and jurisdiction summary;
- record/profile summary;
- all material organizations and control relationships;
- reserve and redemption information where applicable;
- deployments;
- recent or major events;
- evidence;
- guides as secondary context;
- known unknowns;
- explicit value states for missing, unavailable, unverified, disputed, approximate, and not-applicable information.

No synthetic overall assessment or transparency score.

### 9.4 Organization index

Reference: `04-organization-index.webp`

Required:

- organization search;
- organization category, functional role, jurisdiction, connected stablecoin, and status filters where canonical mappings exist;
- count cards;
- organization table or compact cards;
- connected assets and recent events;
- no assumption that every organization is an issuer.

### 9.5 Organization detail

Reference: `05-organization-detail.webp`

Required:

- initial badge or reviewed official mark;
- organization identity and description;
- category/legal form, jurisdiction, functional roles, connected stablecoins, and events;
- current and historical relationships;
- evidence;
- legal or regulatory context only when source-backed;
- known unknowns;
- related guides.

### 9.6 Event index

Reference: `06-event-index.webp`

Required:

- event search;
- public category, stablecoin, organization, year, lifecycle impact, and evidence-related filters where supported;
- event, stablecoin, organization, date, impact, and relationship columns;
- no implementation-facing subtype names as default public labels.

### 9.7 Event detail

Reference: `07-event-detail.webp`

Required:

- event title, category/subtype, date or timeframe, lifecycle impact, and evidence state;
- summary;
- affected records;
- related organizations;
- typed event details;
- timeline only when the canonical event detail supports multiple dated moments;
- source evidence;
- known unknowns;
- related guides.

No unsupported casualty, market-loss, or legal-liability claim may be copied from the mock.

### 9.8 Methodology and editorial family

Reference: `08-methodology.webp`

Methodology uses:

- on-page navigation;
- modular explanatory cards;
- data-model diagram;
- classification and lifecycle definitions;
- issuance/backing fields;
- reserve disclosure method;
- known-unknown policy;
- canonical-only publication policy;
- review process;
- public files and access.

Guides, Glossary, Models, Updates, About, Corrections, and Support use the same visual family but retain page-specific content and semantics.

## 10. Responsive contract

The approved images are desktop references. Mobile is not a scaled screenshot.

Required implementation behavior:

- collapse grouped navigation into one controlled disclosure;
- preserve search and active-filter controls;
- turn dense tables into page-specific cards or deliberate comparison scrollers;
- retain every material field;
- provide section navigation for long detail pages;
- keep evidence and known unknowns reachable near their relevant sections;
- maintain 44px interactive targets;
- support 320px width and 200% zoom;
- preserve focus, labels, result announcements, reduced motion, and forced-colors operation.

Mobile reference images must be produced from the implementation branch before release approval.

## 11. Implementation acceptance

A page is not complete merely because its colors resemble the mock.

Each implementation PR must prove:

```text
approved mock/page reference cited
canonical field mapping documented
mock-only fields excluded
no unsupported values invented
all canonical counts preserved
mobile behavior documented
accessibility checks passed
build and output parity passed
no production publication
```

The final release candidate additionally requires screenshot review at desktop and mobile widths and explicit publication approval.

## 12. Change control

Any change to the approved direction requires one documentation PR that updates:

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

Implementation may not silently reinterpret or replace the approved design.
