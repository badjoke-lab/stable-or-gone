# UI v3 Remediation Authority

Updated: 2026-07-22  
Status: active — rework required  
Issue: #281  
Completion: false

## Purpose and authority

This is the mandatory source of truth for every material Stable or Gone UI change until the replacement interface is explicitly approved.

Every UI issue, branch, commit, pull request, review gate, screenshot workflow, and completion report must cite this document and identify the exact requirements it implements. A UI pull request that does not do so is out of scope and must not merge.

Do not create a competing UI plan. Technical notes may add implementation detail but may not weaken or replace this authority.

## Binding decision

The earlier UI v3 completion decision is withdrawn. Build success, route existence, screenshot generation, and basic overflow checks did not establish acceptable product-design quality. The current interface may remain deployed while remediation proceeds, but it is not an accepted completed UI. Automated screenshots never constitute owner approval.

## Confirmed failure classes

### Global shell and typography

- Oversized page titles and Home masthead.
- Two-row desktop navigation and oversized mobile footer.
- Mixed font treatment across UI, prose, labels, and data.
- Monospace or serif treatment outside technical literals.
- Excessive cyan, borders, panels, cards, rounded controls, shadows, blur, and generic SaaS decoration.

### Desktop

- Too many register columns with small text.
- Filters and explanations before primary results.
- Detail pages following schema order instead of decision-useful order.
- Evidence, metadata, and technical fields receiving too much default weight.

### Mobile

- Desktop tables transformed into tall field-by-field cards.
- Filters and secondary sections open by default.
- Repeated per-record controls.
- Unnatural word splitting and excessive page height.

### Functional states and audit coverage

- Compare and Access/Regulation exposed load or contract-mismatch errors.
- Loading, empty, error, and ready states were not consistently separated.
- Internal diagnostic text could reach public pages.
- Previous closure omitted mandatory public routes and states and did not adequately check readability, density, duplication, hierarchy, runtime errors, or full route coverage.

## Non-negotiable shared rules

### Typography

- Use one system sans-serif family for UI, prose, headings, labels, dates, symbols, statuses, and counts.
- Use monospace only for IDs, hashes, addresses, API paths, JSON keys, and literal code.
- Serif display typography is prohibited.
- Desktop H1: 40–48px.
- Mobile H1: 30–36px.
- Body: 16–18px desktop and 16–17px mobile.
- Table text: at least 14px.
- Do not use `word-break: break-all` for ordinary text.
- Do not hide essential names or descriptions behind ellipsis.

### Shell, surfaces, and color

- Desktop header: one row, approximately 64px.
- Mobile header: one row, approximately 56px, with search and menu drawer.
- Use compact page headers outside Home.
- Keep the footer compact and collapse secondary groups on mobile.
- Reserve cyan for links, selected state, and primary actions.
- Do not put every text block in a bordered card.
- Prefer rows and separators for registers and Evidence lists.
- Protected shell and editorial surfaces must not use decorative gradients, panel shadows, backdrop blur, pill controls, or rounded SaaS panels.
- Statuses, warnings, and errors must use text plus visual treatment, never color alone.

### Density

- Desktop register row target: 48–64px.
- Mobile register record target: 72–112px.
- Desktop registers: at most six primary columns.
- Mobile records: at most four primary fields before expansion.
- Mobile filters start closed; selected filters appear as removable chips.
- Repeated per-record `More details` controls are prohibited when the row itself can link to the record.

### States

Every interactive data surface must visibly separate loading, empty, error, and ready. Public error states must not expose internal exception text or schema-contract diagnostics.

## Page remediation requirements

### Home

- Compact title, one-sentence purpose, search, and counts.
- Keep recent material events, selected records, three updates, three guides, and direct registry links.
- Remove repeated exploratory and explanatory sections.
- Remove decorative hero orbs, gradients, shadows, rounded cards, and non-technical monospace.
- Target heights: desktop under 4,000px; mobile under 6,000px.

### Stablecoin Register

- Search, sort, filter trigger, selected chips, and count in one compact control area.
- Filters closed by default.
- Primary columns: Asset, Lifecycle, Reference, Issuer, Model, Updated/Evidence.
- Compact mobile rows instead of nested field cards.
- Immediate empty state with one reset action.

### Stablecoin Dossier

- First viewport: lifecycle, reference, backing, redemption/exit, primary organization, and Evidence count.
- Organize remaining content into Overview, Reserves/Redemption, Organizations, Events, Deployments, Known unknowns, Evidence, Technical, and Related/Corrections.
- Keep raw schema and IDs below decision-useful information.
- Show at most five events and ten Evidence records initially.
- Use five primary organization columns.
- Close all secondary sections at tablet/mobile widths; keep only decision-useful sections open by default on desktop.

### Events

- Desktop fields: Date, Severity, Event, Subject, Effect.
- Group by year/month where useful.
- Mobile records show date, severity, title, subject/type, and effect in a compact row.
- Remove duplicate structured/prose fields from detail pages.
- Use a simple bounded Evidence list.

### Organizations

- Desktop fields: Organization, Role, Jurisdiction, Connected assets, Relationships.
- Keep long regulatory descriptions out of register rows.
- Mobile records remain compact and avoid half-width metadata boxes.
- Detail pages prioritize summary and connected assets before Evidence and known unknowns.

### Guides and long-form

- Guide index: title, two-line summary, region, current-through date, category.
- Reading width approximately 720–780px.
- Readable desktop contents navigation with current section.
- Mobile contents start collapsed.
- Split long reference tables and source appendices where needed.
- Methodology begins with a short operational summary and separates internal enum dictionaries from primary explanation.
- Use the shared system sans; do not use editorial serif or decorative monospace.

### Reference and utility pages

- About: purpose, exclusions, coverage, review process, operator.
- Contact: one primary correction action plus secondary evidence, technical, and general paths.
- Support: one donation action, use-of-funds explanation, editorial independence.
- Glossary: search plus A–Z compact definitions.
- Models: issuance, backing, and stabilization definitions/examples.
- Updates: paginated chronological log with collapsed details.
- Maintenance: user-facing operational state before developer diagnostics.
- Use flat rows and separators, not rounded SaaS cards, filled hero CTAs, pill navigation, shadows, or gradients.

### Compare and Access/Regulation

- Fix runtime data loading and contract mismatches before visual completion.
- Never show empty and error states together.
- Compare starts with asset selection; desktop uses a table, mobile compares one facet at a time.
- Access/Regulation must not show total assets, zero matches, and unavailable index as one state.
- Hide unsupported Score and Ranking controls.
- Public errors use a short explanation and retry action only.

### Timeline and Stats

- Timeline uses bounded batches, year/month grouping, compact metadata, and year/asset/event-type navigation.
- Stats uses Overview, Lifecycle, Backing, Events, Deployments, Data quality, and History views.
- Show six headline KPIs and a small number of useful charts.
- Move exhaustive tables to disclosure or downloadable data.
- Do not retain wide desktop tables on mobile.

## Required implementation sequence

1. R1 — Authority reset and audit baseline.
2. R2 — Global shell and tokens.
3. R3 — Home and Stablecoin Register.
4. R4 — Stablecoin Dossier.
5. R5 — Events and Organizations.
6. R6 — Guides and long-form pages.
7. R7 — Reference and utility pages plus typography-regression correction.
8. R8 — Compare and Access/Regulation.
9. R9 — Timeline and Stats.
10. R10 — Full visual closure.

No later phase is automatically authorized by an earlier phase. Each phase ends at a review gate and must update the progress table.

## Mandatory pull-request protocol

Every UI pull request must include:

- `Authority: docs/ui-v3-remediation-authority.md`;
- exact requirements addressed;
- routes and states changed;
- desktop and mobile screenshots;
- before/after heights for changed long pages;
- confirmation of canonical data, route, metadata, and machine-readable preservation unless separately authorized;
- visible-error, console-error, failed-request, overflow, clipping, typography, keyboard, and computed-style results;
- remaining unchecked items.

Every merged UI pull request must update the progress table.

## Screenshot and audit matrix

Required widths: 1440×900, 1280×800, 768×1024, 390×844, and 320×568.

Required families and states:

- Home;
- Stablecoin Register default, filtered, and empty;
- active, failed/collapsed, and winding-down dossiers;
- Events default, filtered, empty, and detail;
- Organizations default, filtered, empty, and detail;
- Guides index and article;
- Methodology, About, Glossary, Models, Updates, Maintenance, Contact, Support;
- Compare empty, ready, and error;
- Access/Regulation ready and error;
- Timeline, Stats, 404, and loading.

Hard failures:

- skipped screenshot or visual-audit step;
- visible `failed to load`, `contract mismatch`, or `index unavailable` on a ready capture;
- console errors or failed required requests;
- visible serif or non-technical monospace;
- protected rounded SaaS surfaces, decorative shadow, gradient, or backdrop blur;
- horizontal overflow, clipped/overlapping text, ordinary break-all, or essential ellipsis;
- mobile filters or secondary dossier sections open by default;
- desktop table text below 14px;
- completion declared without explicit owner approval.

## Progress

| Phase | Status | PR | Notes |
|---|---|---:|---|
| R1 Authority reset and audit baseline | complete | #436 | Mandatory memo merged; Issue #281 reopened; UI completion false |
| R2 Global shell and tokens | complete | #437 | 35/35 captures passed in run 29738874474; one-row shell, typography, compact footer, overflow fixes |
| R3 Home and Stablecoin Register | complete | #438 | 20/20 captures passed in run 29741326782; compact Home and six-column/compact-mobile register |
| R4 Stablecoin Dossier | complete | #439 | Validation and 15/15 captures passed in run 29784166384; screenshots manually reviewed; desktop max 7,154px, tablet max 3,191px, mobile max 3,620px |
| R5 Events and Organizations | complete | #440 | Validation and 40/40 captures passed in run 29800031326 at head `787bec1c`; screenshots manually reviewed; five-column registers and 96–123px mobile rows |
| R6 Guides and long-form | complete | #442 | Validation and 15/15 captures passed in run 29803262075 at head `1b6ddf0f`; screenshots manually reviewed; single responsive Guide register, 760px reading width, one contents navigation, and closed internal Methodology reference |
| R7 Reference and utility plus typography correction | complete | #443 | All gates and 50/50 computed-style captures passed in run 29885162733 at head `9cef0fa2`; screenshots manually reviewed; one system sans and flat archival surfaces restored |
| R8 Compare and Access/Regulation | next | — | Runtime and state correctness are the next blockers |
| R9 Timeline and Stats | blocked | — | — |
| R10 Full visual closure | blocked | — | Requires complete manual review and explicit owner approval |

## R4 completion evidence

Run `29784166384` at head `3d28d0fca8928990d71dc1929f351eda3da0b830` passed shared dossier contracts, canonical validation, Evidence relations, compatibility, final contract, Astro check, build, public-layer verification, and all 15 visual captures.

Representative final heights:

- USDC desktop 1440: 7,154px.
- UST desktop 1440: 6,812px.
- BUSD desktop 1440: 6,546px.
- USDC tablet 768: 3,191px.
- USDC mobile 390: 3,408px.
- USDC mobile 320: 3,620px.

The audit confirmed six primary facts, at most five initial events, at most ten Evidence rows, five organization columns, 14px minimum visible table text, zero page overflow, zero runtime/load failures, six open desktop sections, and zero open tablet/mobile secondary sections. Desktop, tablet, and mobile screenshots were manually inspected before merge.

## R5 completion evidence

Run `29800031326` at head `787bec1c0d6ffdafa76364361d963d345d07c688` passed static authority containment, index interaction, responsive accessibility, canonical and Evidence contracts, Astro check, build, public verification, and all 40 required captures.

Representative final measurements:

- Events desktop 1440 default: 3,034px.
- Organizations desktop 1440 default: 3,065px.
- Event detail desktop 1440: 3,321px.
- Organization detail desktop 1440: 4,917px.
- Events mobile 390 default: 4,001px; maximum row 96.3px.
- Organizations mobile 390 default: 4,033px; maximum row 111.8px.
- Events mobile 320 default: 4,235px; maximum row 112.9px.
- Organizations mobile 320 filtered: 2,459px; maximum row 123.1px.

The audit confirmed five-column desktop registers, compact mobile records, closed filters, working filtered and empty states, six primary detail facts, five relationship columns, 14px minimum visible table text, zero horizontal overflow, zero runtime/load failures, no repeated More-details controls, and no duplicate Overview or Evidence card sets. Desktop, tablet, and mobile screenshots were manually inspected before merge.

## R6 completion evidence

Run `29803262075` at head `1b6ddf0f92eb6f2456230f518b2c67fc4b82afa1` passed static authority containment, canonical and Evidence contracts, Guide/reference contracts, Astro check, static site generation, public verification, and all 15 required captures.

Representative final measurements:

- Guide index desktop 1440: 2,840px.
- Guide article desktop 1440: 2,776px.
- Methodology desktop 1440: 4,140px.
- Guide index tablet 768: 3,416px.
- Guide index mobile 390: 4,084px; maximum row 159.2px.
- Guide index mobile 320: 4,249px; maximum row 162.6px.
- Guide article mobile 320: 4,328px.
- Methodology mobile 320: 6,286px.

The audit confirmed four columns in every Guide register, one responsive dataset, zero duplicate mobile Guide surface, 14px minimum table text, zero horizontal overflow, zero runtime/load failures, one current-section contents navigation, desktop-open and mobile-closed contents behavior, zero visible legacy Guide contents, zero horizontally scrolling mobile article tables, Guide reference navigation after the article body, and a closed internal Methodology reference. Desktop, tablet, 390px, and 320px screenshots were manually inspected before merge.

## R7 completion evidence

Run `29885162733` at head `9cef0fa2bf082d2a04db00fb92ed51619295d22f` passed typography authority, reference/utility contracts, canonical validation, Astro check, static build, and all 50 computed-style captures.

The 50-capture matrix covered Home, a Guide article, the USDC dossier, About, Contact, Support, Glossary, Models, Updates, and Maintenance at 1440px, 1280px, 768px, 390px, and 320px.

The audit confirmed:

- one visible system sans-serif family for every non-technical text role;
- monospace limited to IDs, addresses, hashes, API/data keys, and literal code;
- zero visible Georgia, Cambria, Times, or generic serif use;
- zero protected rounded surfaces, panel shadows, decorative gradients, or backdrop blur;
- zero horizontal overflow;
- zero console errors or failed required requests;
- flat Home, Guide, Dossier, reference, and utility presentation using rows and separators.

Representative desktop, tablet, 390px, and 320px screenshots were manually inspected before merge, including Home, Guide article, USDC dossier, About, Glossary, and Updates.

## Completion rule

UI completion remains false until R1–R10 are complete, all mandatory captures exist, runtime data errors are corrected, and the owner explicitly approves the final desktop and mobile contact sheets. Automated rendering never constitutes approval.
