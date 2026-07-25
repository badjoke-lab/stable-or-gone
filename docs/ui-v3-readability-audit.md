# UI V3 exhaustive readability audit

Status: blocking remediation required

Audit basis:

- 457 desktop routes
- 457 mobile routes
- 914 full-page screenshots
- every route reviewed at top, middle, and bottom
- route families reviewed separately: home, registry indexes and pagination, 189 event dossiers, 107 organization dossiers, 114 stablecoin dossiers, guides, methodology, reference pages, utilities, statistics, timeline, access/regulation, compare, support, contact, and updates

The previous automated screenshot, overflow, color, and font-leakage gates did not measure whether the interface was readable or whether its information hierarchy worked. Their success must not be treated as visual acceptance.

## Blocking systemic findings

### 1. Text is too small across the entire product

Supporting copy, metadata, navigation, table text, definition lists, source rows, footer links, and utility controls routinely render below a comfortable reading size. The problem exists on both desktop and mobile and continues through lower sections of detail pages.

### 2. Display headings overpower their content

Large serif headings consume excessive space while body and metadata text remain undersized. The home masthead is theatrical rather than functional. Long event titles frequently occupy most of the first mobile viewport and wrap into four or more lines.

### 3. Link roles are not visually distinguishable

The cyan accent is used for ordinary internal record links, metadata links, source/archive links, arrows, search result types, and utility actions. A reader cannot reliably distinguish navigation, internal references, external evidence, archive access, and primary actions.

### 4. The home lifecycle module is semantically and visually wrong

`Records by lifecycle` presents lifecycle values through chip classes even though the section is an aggregate count table. The labels are tiny, colored like badges, and visually weaker than the surrounding decoration. It must become a readable count list or table with color reduced to a secondary indicator.

### 5. Registry index density exceeds usable scan density

Stablecoin, event, and organization indexes expose many fields at undersized text sizes. Desktop rows are difficult to scan; mobile records become long stacks of small labels and values. Pagination reproduces the same failure.

### 6. Detail page templates are difficult to read

Event, organization, and stablecoin dossiers share the same pattern: oversized title, weak deck, tiny metadata, dense bordered fact grids, and undersized lower sections. Evidence, relationships, structured details, known unknowns, and correction areas are especially difficult to scan.

### 7. Longform and analysis pages have an extreme title/body ratio

Methodology, guides, updates, statistics, timeline, compare, and access/regulation pages use large editorial titles but body copy, table content, captions, and navigation remain too small. Statistics is data-dense without sufficient readable hierarchy.

### 8. Header and footer are below acceptable readability

Primary navigation, masthead context, search controls, reference menu, footer links, and footer explanation are consistently too small. This affects every route.

### 9. Borders and boxes compete with content

Thin ruled layouts are repeated so aggressively that structural lines become more visible than the text they organize. Dense fact grids and repeated row boundaries increase visual noise, especially on mobile.

### 10. Mobile is not a compact readable version of desktop

It avoids horizontal overflow, but this is not sufficient. Mobile keeps the same excessive metadata density, undersized labels, long title treatments, and repeated bordered sections. Tap targets and link spacing are inconsistent.

## Required design rules

### Typography floors

- ordinary body copy: at least 15px desktop and 16px mobile
- navigation, table values, definition values, and interactive text: at least 14px desktop and 15px mobile
- metadata and overlines: at least 12px, used sparingly
- line-height: at least 1.5 for body copy and 1.35 for compact data rows

### Heading limits

- home H1 must no longer dominate an entire desktop or mobile viewport
- mobile H1 maximum target: 38px for ordinary pages, with bounded exceptions for short titles
- long event and guide titles require responsive length-aware sizing
- section headings must retain a proportional relationship to body copy

### Link roles

- internal record links: neutral text treatment with underline or clear hover/focus behavior
- evidence and archive links: dedicated source/archive accent
- quiet utility links: muted but readable
- primary actions: stronger weight and boundary, not merely cyan text
- generic anchors must not inherit the accent indiscriminately

### Data presentation

- aggregate lifecycle counts must use a count list/table, not status chips
- chips remain for status attached to an individual record
- tables and definition lists must use readable type and stronger row grouping
- reduce decorative borders where spacing and typography can carry structure

### Mobile

- avoid first-view titles that consume most of the viewport
- preserve data, but progressively disclose secondary detail where necessary
- ensure readable labels and values rather than shrinking the desktop layout
- interactive targets must be at least 40px high where presented as controls

## Page-family remediation scope

### Shared shell

Header, navigation, search, reference menu, footer, generic links, body scale, focus states, and shared spacing.

### Home

Masthead scale, register totals, search, material changes, lifecycle counts, reviewed records table, guide shelf, reference shelf, and footer transition.

### Registry indexes

Stablecoin, event, and organization indexes plus every static pagination route.

### Event dossiers

All 189 event routes: title scaling, deck, metadata, structured detail, subjects, evidence, and correction/reference sections.

### Organization dossiers

All 107 organization routes: identity header, metadata, relationships, stablecoins, events, evidence, and known-unknown sections.

### Stablecoin dossiers

All 114 stablecoin routes: title, lifecycle presentation, fact ledger, organization/deployment/reserve/redemption data, timeline, evidence, and known unknowns.

### Editorial/reference/analysis

Guides, methodology, about, glossary, models, updates, contact, support, compare, access/regulation, statistics, and timeline.

## Acceptance gate

This work is not complete until all of the following are true on a final single head commit:

1. automated computed-size audit covers every visible text element on all 457 desktop and 457 mobile routes;
2. no ordinary copy, table value, navigation item, or control falls below its permitted size floor;
3. heading/body ratios and mobile title heights remain within the agreed limits;
4. links are classified by role and generic accent inheritance is rejected;
5. mobile tap targets and wrapping checks pass;
6. 457 desktop and 457 mobile screenshots are regenerated;
7. every final screenshot is manually reviewed at top, middle, and bottom;
8. all route families pass direct readability inspection, not merely overflow or color checks;
9. all repository workflows pass;
10. no merge occurs while a known visual defect remains.
