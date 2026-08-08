# Guide and Research Surface Readability Remediation

Status: authorized next implementation after authority reconciliation  
Date: 2026-08-08  
Scope: shared Guide article layout, shared long-form support behavior where directly coupled, and the home Research & Guides block

## Why this remediation exists

Direct production review on 2026-08-08 found that the current Guide presentation is not acceptable even though automated screenshot, geometry, contrast, and build checks passed.

The defect is shared by newly published and pre-existing guides. The production examples used for acceptance are:

```text
/
/guides/global-stablecoin-regulation-2026/
/guides/uk-stablecoin-capital-rules-2026/
```

The UK page is an existing guide and demonstrates that the defect is in the common Guide system rather than only in PR #531 article markup.

## Blocking visual defects

The next implementation must correct all of the following as one shared-system repair:

1. **Left-rail TOC consumes reading width.** Desktop Guide pages reserve a fixed left column while constraining the article body to 860px, making long tables and dense sections unnecessarily narrow and vertically excessive.
2. **Section hierarchy is visually too weak.** `.bar` labels are converted into section `h2` elements while retaining small monospace overline styling. A primary article section must look like a real section heading, not metadata.
3. **Every section reads like a spreadsheet/form box.** Repeated panel borders plus dense tables create a continuous audit-sheet appearance instead of readable long-form research.
4. **Support UI is duplicated and mispositioned.** Guide/long-form pages can show an article support callout and the global footer support callout in the same flow. The Guide support callout can also occupy the former TOC column rather than the full article width.
5. **Home Research & Guides composition is unbalanced.** Three secondary guide links produce a two-column grid with an orphaned final half-width tile. The desktop composition must be balanced without an empty paired cell.
6. **Full-page length is inflated by avoidable layout constraints.** The repair must reduce avoidable vertical growth through wider data presentation, stronger hierarchy, and removal of duplicate support blocks; content must not be deleted merely to shorten the page.

## Required design contract

### Guide article layout

- Do not use a persistent desktop left rail for the Guide table of contents.
- Present the table of contents above the article body as a full-width disclosure/navigation block. On wide screens its links may use multiple columns; on small screens it remains a normal disclosure.
- Guide article content may use up to approximately 1080–1120px for data-heavy sections and tables.
- Ordinary prose remains measure-limited to approximately 68–76ch; widening tables must not create overlong prose lines.
- Shared layout/CSS must fix all Guide articles. Per-article layout overrides are prohibited unless a separately documented semantic need exists.

### Typography and hierarchy

- Ordinary Guide prose: at least 17px desktop and 16px mobile, line-height at least 1.6.
- Primary Guide section headings: visually distinct serif or equivalent display treatment, at least 24px desktop and 22px mobile.
- Monospace/overline typography remains metadata only; it must not be the sole visual treatment for primary article section headings.
- Table body copy must remain at least 14px desktop and 15px mobile where rendered as table text or mobile replacement records.
- Existing UI V3 readability floors remain binding.

### Section and table presentation

- Guide sections must not all render as full bordered `panel` boxes.
- Use whitespace and a single section separator/hierarchy treatment rather than continuous four-sided box repetition.
- Tables may span the wider article data width and must receive sufficient cell padding for scanning.
- Existing mobile table replacement semantics and protected fields must remain intact.
- No horizontal page overflow is allowed.

### Support behavior

- A Guide or long-form article exposes one contextual support block in the article flow.
- The generic footer support block must not immediately duplicate it on the same page.
- The contextual support block must span the intended article width and must not fall into a narrow former-TOC column.
- Header support access remains unchanged.

### Home Research & Guides block

- Keep registry entries before editorial research.
- Keep the global 2026 guide as the lead item.
- Secondary guides must use a balanced desktop composition with no orphaned half-width card and no unexplained empty grid cell.
- Mobile must stack cleanly without reducing text below the UI V3 floor.
- Do not turn the home page into an article portal; the registry remains the primary product identity.

## Content and data preservation

This remediation changes presentation only.

It must not change:

- canonical Stablecoin, Organization, Event, Evidence, Evidence Relation, Deployment, or Market Access records;
- guide factual wording, source claims, current-through dates, or article URLs except where a markup-only accessibility change is required;
- machine-readable schemas or canonical counts;
- canonical/OG URLs, sitemap membership, JSON-LD meaning, or official origin;
- legacy-host 301 behavior;
- ranking, scoring, recommendation, or investment-advice boundaries.

## Required verification

Automated checks are necessary but not sufficient.

Before merge, capture and directly inspect at minimum:

```text
Desktop 1440px:
  /
  /guides/global-stablecoin-regulation-2026/
  /guides/uk-stablecoin-capital-rules-2026/

Mobile 390px:
  /
  /guides/global-stablecoin-regulation-2026/
  /guides/uk-stablecoin-capital-rules-2026/
```

For each route inspect both initial viewport and full-page output.

Blocking conditions include:

- article remains visually compressed into a narrow column;
- primary section headings still read as metadata labels;
- duplicate support blocks remain adjacent in the page flow;
- support callout occupies a narrow side column;
- home secondary guides retain an orphaned half-width tile;
- horizontal overflow, clipping, overlapping text, unreadably dense tables, or essential-content loss;
- any direct visual defect identified during review, even if CI reports success.

The shared screenshot/readability audit should be strengthened where practical so the specific regression is machine-detectable after the visual fix.

## Exit

After successful merge and production verification, record the Guide/readability remediation as complete and resume the paused PR #523 JPYSC Market Access implementation by reconciling it against the then-current `main`.
