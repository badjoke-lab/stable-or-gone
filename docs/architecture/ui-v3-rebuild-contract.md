# Stable or Gone UI rebuild contract

Updated: 2026-07-03
Status: binding visual-rebuild contract

## Decision

The Editorial Ledger implementation is not accepted as the completed product UI.

It remains a technically functioning intermediate presentation layer, but it does not satisfy the product-design standard for Stable or Gone. Previous completion language is withdrawn.

## Why the previous closure was invalid

The previous process proved that pages rendered, routes existed, machine-readable data matched, screenshots could be produced, and no obvious overflow or broken-image failure was detected. It did not prove that the interface was understandable, readable, efficient, or visually complete.

A screenshot workflow must not be treated as a visual-quality pass when its audit step is skipped. Automated rendering checks and human design approval are separate gates.

## Binding product direction

Stable or Gone must be presented as a modern evidence registry, not as a decorative newspaper and not as a generic SaaS dashboard.

The interface must make the registry's specific value visible:

- lifecycle state;
- issuer and control relationships;
- backing and reserve structure;
- redemption availability and restrictions;
- material events and lifecycle transitions;
- evidence coverage and unresolved questions.

## Required visual system

- neutral application background with distinct content surfaces;
- readable default body size of at least 15px on desktop and 16px-equivalent on mobile;
- metadata and table labels must remain readable and may not default to 10px;
- hierarchy must use spacing, surface, typography, position, and restrained color, not thin rules alone;
- the dark-red SOG accent is reserved for actions, warnings, and selected state;
- no giant decorative masthead;
- no repeated rounded-card wall;
- no blue-purple dashboard gradient;
- no unbounded all-record dump as the primary browsing mode.

## Required primary templates

The first approval milestone contains only:

1. Home;
2. Stablecoin register;
3. Stablecoin dossier.

Events, Organizations, Guides, Methodology, About, and utility pages must not be rolled out to the new system until these three templates are approved from real rendered screenshots.

## Home requirements

The first viewport must expose:

- product identity and one-sentence purpose;
- registry search;
- stablecoin, organization, and event totals;
- recent material changes;
- records requiring attention;
- direct exploration by lifecycle or subject.

The brand title must not dominate the useful product controls.

## Stablecoin register requirements

- search, filters, selected-filter chips, result count, sorting, and clear action;
- filter options and their counts are visible and understandable;
- no headings that show an unexplained zero;
- bounded page length through pagination or equivalent progressive rendering;
- desktop table and mobile record layout designed separately;
- compare selection produces a visible action state;
- sticky context where long scrolling remains necessary.

## Stablecoin dossier requirements

The first screen and first sections must prioritize:

1. current lifecycle and operational state;
2. redemption;
3. backing and reserves;
4. primary issuer and control;
5. latest material events;
6. last verification and unresolved-question count.

Raw schema fields remain available, but they appear after the decision-useful summary.

The dossier must provide a lifecycle/event timeline and a relationship summary when the underlying data exists.

## Acceptance states

Screenshots must include at least:

- desktop and mobile;
- active, collapsed/failed, and migrated/rebranded records;
- long organization and stablecoin names;
- missing or unresolved data;
- search active;
- filters selected;
- compare selected;
- empty result;
- long evidence or identifier values.

## Automated gates

Automated checks must fail on:

- skipped visual-audit steps;
- horizontal overflow;
- broken images;
- missing main landmark or invalid H1 structure;
- false empty states;
- inaccessible focus or controls;
- protected data lost from responsive layouts;
- reintroduction of superseded visual components.

Automated checks do not grant design approval.

## Human approval gate

UI completion requires explicit owner approval of rendered desktop and mobile screenshots for:

- Home;
- Stablecoin register;
- Stablecoin dossier;
- Events;
- Organizations;
- Guide/article.

A closure report must record the approved artifact run and approval reference. Without that record, the UI remains open.

## Delivery sequence

- PR A: governance, failed-closure correction, and non-skippable approval gates;
- PR B: shared shell and navigation;
- PR C: Home and Stablecoin register;
- PR D: Stablecoin dossier;
- PR E: Events and Organizations;
- PR F: Guides and secondary pages;
- PR G: complete desktop/mobile artifact review and production closure.

## Preservation rules

The rebuild must not alter canonical records, evidence meaning, public route identities, machine-readable schemas, provenance generation, or automatic deployment behavior except where a dedicated non-UI change is explicitly reviewed.
