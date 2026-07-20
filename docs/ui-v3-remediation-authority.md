# UI v3 Remediation Authority

Updated: 2026-07-20  
Status: active — rework required  
Issue: #281  
Completion: false

## Purpose

This is the mandatory working memo for every material Stable or Gone UI change until the replacement interface is explicitly approved.

Every UI-related issue, branch, commit, pull request, review gate, screenshot workflow, and completion report must read and cite this document. A UI pull request that does not identify the exact requirements it implements is out of scope and must not merge.

Do not create a competing UI plan. Implementation notes may add technical detail but may not weaken or replace this authority.

## Binding decision

The previous UI v3 completion decision is withdrawn. Passing build, route, screenshot-existence, and basic overflow checks did not establish acceptable product-design quality.

The current interface may remain deployed as a data projection while remediation proceeds, but it is not an accepted completed UI. Automated screenshots never constitute owner approval.

## Confirmed failures

### Global shell and typography

- Page titles and the decorative Home masthead are oversized.
- The desktop header uses an 82px primary row plus a 62px navigation row.
- Interface, prose, labels, and data fields use inconsistent font treatment.
- Monospace and serif treatments appear outside technical literals.
- Cyan is used for links, headings, labels, counts, and emphasis, weakening hierarchy.
- Borders, dark panels, and cards are applied to nearly every information group.
- The footer is too large, especially on mobile.

### Desktop

- Registers show too many columns and compensate with very small text.
- Filters and explanatory panels frequently appear before primary results.
- Long labels are forced into narrow cells.
- Detail pages follow normalized schema order instead of decision-useful order.
- Evidence, metadata, and technical fields receive too much default weight.

### Mobile

- Desktop tables become tall field-by-field cards instead of compact records.
- Filters are expanded by default.
- Repeated `More details` and comparison controls inflate every record.
- Navigation labels and ordinary words wrap or split unnaturally.
- Page heights are excessive and were previously accepted by permissive ceilings.

### Functional states

- Compare and Access/Regulation have displayed data-loading or contract-mismatch errors.
- Loading, empty, error, and ready states are not consistently separated.
- Internal diagnostic strings can reach public pages.

### Visual audit

- The previous final closure covered representative templates, not every public route and state.
- Glossary, Models, Updates, Maintenance, Contact, Support, 404, loading, and error states were not all mandatory captures.
- Existing automation checked file existence and basic overflow but not readability, density, duplication, hierarchy, runtime errors, or complete route coverage.

## Non-negotiable shared rules

### Typography

- Use one system sans-serif family for UI, prose, headings, labels, dates, symbols, statuses, and counts.
- Use monospace only for IDs, hashes, addresses, API paths, JSON keys, and literal code.
- Desktop H1: 40–48px.
- Mobile H1: 30–36px.
- Body: 16–18px desktop and 16–17px mobile.
- Table text: at least 14px.
- Do not use `word-break: break-all` for ordinary text.
- Do not hide essential names or descriptions behind ellipsis.

### Shell

- Desktop header: one row, approximately 64px.
- Mobile header: one row, approximately 56px, with search and a menu drawer.
- Remove the decorative Home masthead and giant background ornament.
- Use compact page headers on non-Home routes.
- Reduce footer size and collapse secondary groups on mobile.

### Surfaces and color

- Reserve cyan for links, selected state, and primary actions.
- Do not put every text block inside a bordered card.
- Use simple rows and separators for registers and Evidence lists.
- Distinguish active, limited, impaired, discontinued, failed, unknown, warning, and error using text plus visual treatment; never color alone.

### Density

- Desktop register row target: 48–64px.
- Mobile register record target: 72–112px.
- Desktop registers may show at most six primary information columns.
- Mobile records may show at most four primary fields before expansion.
- Mobile filters start closed; selected filters appear as removable chips.
- Repeated per-record `More details` buttons are prohibited when the row itself can be the link.

### States

Every interactive data surface must visibly separate:

1. loading;
2. empty;
3. error;
4. ready.

Public error states must not expose internal exception text or schema-contract diagnostics.

## Page remediation requirements

### Home

- Replace the giant hero with a compact title, one-sentence purpose, search, and current counts.
- Keep only recent material events, selected records, latest updates, three guides, and direct registry links.
- Remove the large grid of exploratory cards and repeated explanatory sections.
- Desktop target height: under 4,000px.
- Mobile target height: under 6,000px.

### Stablecoin Register

- Put search, sort, filter trigger, selected-filter chips, and result count in one compact control area.
- Move desktop filters to a side panel or collapsible area.
- Use a maximum of six primary columns focused on Asset, Lifecycle, Reference, Issuer, Model, and Updated/Evidence.
- Move secondary backing and stabilization fields to expansion or the dossier.
- Use compact mobile rows; do not render each field as a nested card.
- Make empty state immediately visible and provide one clear reset action.

### Stablecoin Dossier

- The first viewport summarizes lifecycle, reference, backing, redemption, issuer, and Evidence count.
- Organize the rest as Overview, Reserves, Redemption, Organizations, Events, Deployments, Evidence, and Technical fields.
- Keep raw schema and IDs below decision-useful information.
- Bound initial event and Evidence lists and provide expansion or pagination.
- Collapse secondary sections by default on mobile.

### Events

- Desktop fields: Date, Severity, Event, Subject, Effect.
- Group by year and month where useful.
- Mobile records show date, severity, title, subject/type, and effect in a compact row.
- Remove duplicated structured and prose fields from event detail pages.
- Use a simple Evidence list when only a few sources exist.

### Organizations

- Desktop fields: Organization, Role, Jurisdiction, Connected assets, Relationships.
- Do not put long regulatory descriptions in register rows.
- Mobile records remain compact and avoid half-width metadata boxes.
- Detail pages prioritize organization summary and connected assets before Evidence and known unknowns.

### Guides

- Index records show title, two-line summary, region, current-through date, and category only.
- Article reading width: approximately 720–780px.
- Desktop contents navigation must be readable and show current section.
- Mobile contents start collapsed and provide section navigation.
- Split long reference tables and source appendices from the main article where necessary.

### Methodology

- Begin with a short operational summary of record model, status, Evidence, monitoring, and corrections.
- Separate internal enum dictionaries from the main explanation.
- Provide searchable definitions.
- Use mobile disclosure instead of one uninterrupted field dictionary.

### About, Contact, Support

- Use restrained prose layouts rather than registry-definition cards.
- About explains purpose, exclusions, coverage, review process, and operator.
- Contact has one primary correction action plus secondary evidence, technical, and general-contact paths.
- Support has one donation action, a short use-of-funds explanation, and editorial-independence disclosure.

### Glossary, Models, Updates, Maintenance

- Glossary: search plus A–Z compact definitions.
- Models: separate issuance, backing, and stabilization models with definitions and examples.
- Updates: paginated chronological change log with collapsed details.
- Maintenance: user-facing operational state first; developer diagnostics second.

### Compare

- Fix data loading before visual completion.
- Do not display an empty-state message together with a load error.
- Put asset selection before presets and facet configuration.
- Desktop uses a comparison table; mobile compares one facet at a time.

### Access and Regulation

- Fix frontend/index contract mismatch before visual completion.
- Never show total assets, zero matches, and index unavailable as one valid state.
- Hide unsupported Score and Ranking controls.
- Public error states provide a short explanation and retry action only.

### Timeline

- Paginate or load in bounded batches.
- Group by year and month.
- Remove repeated source/date-semantics controls from every row; place metadata in expansion.
- Provide year, asset, and event-type navigation.

### Stats

- Replace the raw all-in-one aggregation page with Overview, Lifecycle, Backing, Events, Deployments, Data quality, and History views.
- Show six headline KPIs and a small number of useful charts.
- Show top categories first; move exhaustive tables to disclosure or downloadable data.
- Do not retain desktop multi-column tables on mobile.

## Required implementation sequence

### R1 — Authority reset and audit baseline

- Add this document.
- Make it mandatory in `AGENTS.md`.
- Reopen Issue #281 and set UI completion false.
- Establish complete route and state requirements.

### R2 — Global shell and tokens

- Typography, header, navigation, page width, colors, spacing, footer, focus, and responsive primitives.

### R3 — Home and Stablecoin Register

- Compact Home entrypoint, usable filters, desktop table, compact mobile rows, and clear states.

### R4 — Stablecoin Dossier

- Decision-useful hierarchy, bounded related lists, and mobile disclosure.

### R5 — Events and Organizations

- Compact registers, deduplicated detail pages, relationship views, and bounded Evidence.

### R6 — Guides and long-form pages

- Reading width, navigation, responsive tables, and appendix separation.

### R7 — Reference and utility pages

- Glossary, Models, Updates, Maintenance, About, Contact, and Support.

### R8 — Compare and Access/Regulation

- Resolve runtime data errors, then rebuild controls and responsive results.

### R9 — Timeline and Stats

- Bounded chronology and dashboard-style statistics.

### R10 — Full visual closure

- Capture and manually review every public template and representative state at all required widths.

No later phase is automatically authorized by an earlier phase. Each phase ends at a review gate and must update the progress table below.

## Mandatory pull-request protocol

Every UI pull request must include:

- `Authority: docs/ui-v3-remediation-authority.md`;
- exact requirement headings addressed;
- routes and states changed;
- desktop and mobile screenshots;
- before/after page heights for changed long pages;
- confirmation that canonical data, routes, metadata, and machine-readable outputs are preserved unless separately authorized;
- visible error, console error, failed request, overflow, clipping, and keyboard results;
- remaining unchecked items from this document.

Every merged UI pull request must update this progress table.

## Screenshot and audit matrix

Required widths:

- 1440×900;
- 1280×800;
- 768×1024;
- 390×844;
- 320×568.

Required route/state families:

- Home;
- Stablecoin Register default, filtered, and empty;
- active, failed/collapsed, and winding-down dossiers;
- Events default, filtered, empty, and detail;
- Organizations default, filtered, empty, and detail;
- Guides index and article;
- Methodology, About, Glossary, Models, Updates, Maintenance, Contact, Support;
- Compare empty, ready, and error;
- Access/Regulation ready and error;
- Timeline;
- Stats;
- 404;
- loading state.

Hard failures:

- skipped screenshot or visual-audit step;
- visible `failed to load`, `contract mismatch`, or `index unavailable` on a ready capture;
- console errors or failed required requests;
- horizontal page overflow;
- clipped or overlapping text;
- ordinary words split with break-all behavior;
- essential text hidden by ellipsis;
- mobile filters expanded by default;
- desktop table text below 14px;
- completion declared without explicit manual approval.

## Progress

| Phase | Status | PR | Notes |
|---|---|---:|---|
| R1 Authority reset and audit baseline | complete | #436 | Memo and mandatory reference merged; Issue #281 reopened; UI completion set false |
| R2 Global shell and tokens | complete | #437 | 35/35 captures passed in run 29738874474; one-row shell, typography, compact footer, and overflow fixes merged |
| R3 Home and Stablecoin Register | active | #438 | Compact Home and six-column/compact-mobile register under 20-capture review |
| R4 Stablecoin Dossier | blocked | — | Starts after R3 review |
| R5 Events and Organizations | blocked | — | — |
| R6 Guides and long-form | blocked | — | — |
| R7 Reference and utility | blocked | — | — |
| R8 Compare and Access/Regulation | blocked | — | Runtime errors are completion blockers |
| R9 Timeline and Stats | blocked | — | — |
| R10 Full visual closure | blocked | — | Requires complete manual review |

## Current R3 evidence

Branch: `agent/ui-v3-r3-home-register`  
Pull request: #438

R3 removes duplicated Home sections, retains only the required entrypoint content, reduces the desktop register to six primary columns, closes filters by default, and replaces mobile field-by-field cards with compact rows.

The R3 workflow captures Home plus Stablecoin Register default, filtered, and empty states at all five required widths. It fails on runtime errors, horizontal overflow, page-height budgets, incorrect desktop/mobile representation, more than six columns, open default filters, absent empty state, desktop rows above 68px, or mobile rows above 112px.

R3 remains active until the generated contact sheet is manually inspected, every failure is corrected, and PR #438 is merged.

## Completion rule

UI completion remains false until R1–R10 are complete, all mandatory captures exist, runtime data errors are corrected, and the owner explicitly approves the final desktop and mobile contact sheets. Automated rendering never constitutes approval.
