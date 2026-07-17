# PR #419 UI v3 Guides and Secondary Pages Specification

Status: active implementation  
Implementation PR: 419  
Source review PR: 418  
Issue: 281  
Phase: PR F

## Objective

Rebuild the existing guide, long-form, reference, project, utility, comparison, access/regulation, timeline, and statistics HTML surfaces into the same modern evidence-registry system used by the completed primary templates.

The work must improve reading hierarchy, table of contents, section navigation, callouts, examples, source presentation, visible tool state, responsive tables, and bounded results without changing routes, canonical records, public projections, or derived-data semantics.

No safety, transparency, risk, incident, organization, quality, or investment score may be introduced.

## Authorized route families

```text
/guides/
/guides/[article]/
/methodology/
/about/
/glossary/
/models/
/updates/
/maintenance/
/contact/
/support/
/compare/
/access-regulation/
/timeline/
/stats/
```

No route addition, removal, or rename is authorized.

## Guide index requirements

- present the guide archive as a reviewed research index rather than a marketing or newspaper page;
- preserve category navigation, publication dates, information-current-through dates, summaries, and links;
- provide a desktop table with local horizontal containment and compact mobile records;
- keep the archive reference links to glossary, methodology, and canonical stablecoin records;
- preserve every guide route and guide-catalog value.

## Guide article requirements

- use a bounded reading column and a separately navigable table of contents;
- keep publication date, current-through date, update date, and reviewed-update notices distinct;
- convert section headings into usable local navigation without changing article claims;
- distinguish summary, explanatory prose, examples, cautions, tables, related records, revision history, and sources;
- keep wide tables locally scrollable;
- preserve article title, metadata, canonical path, JSON-LD, sources, and related-record links;
- keep correction and methodology paths reachable.

## Methodology and about requirements

- retain the existing long-form table of contents generated from section headings;
- bound reading width and prevent uninterrupted wall-of-text presentation;
- distinguish canonical definitions from explanatory prose and entrypoint cards;
- preserve status, event, relationship, evidence, value-state, correction, and support semantics;
- use responsive tables rather than page-wide overflow.

## Reference, project, and utility requirements

Applies to glossary, models, updates, maintenance, contact, and support.

- present page identity and facts in a consistent evidence-registry header;
- preserve reference tables, update history, submission paths, support instructions, addresses, external links, and correction semantics;
- use clear section hierarchy and local table containment;
- preserve 44px touch targets, copy controls, long identifiers, long URLs, and forced-colors behavior.

## Secondary registry-tool requirements

Applies to comparison, access/regulation, timeline, and statistics.

- preserve all canonical and deterministic input data and machine-readable projections;
- expose input state, selected state, clear actions, result state, empty/absence state, and machine-readable links visibly;
- preserve shareable URL state where already implemented;
- keep comparison readiness, freshness, record absence, date semantics, and scope boundaries separate;
- use bounded result containers and local scrolling for wide matrices or tables;
- keep statistics measured and registry-like rather than turning the page into a promotional dashboard;
- preserve every no-score/no-ranking boundary.

## Shared visual system

- use page, section, raised, interactive, and emphasis surfaces;
- use restrained borders, modest radius, and limited shadow;
- replace oversized editorial mastheads with bounded evidence-registry headers;
- use sans-serif headings and readable body text;
- preserve metadata at 13px or larger and dense table text at 14px or larger;
- keep every representative page H1 at 28px or larger in the rendered desktop and mobile audit;
- maintain 44px controls and disclosure targets;
- avoid decorative gradients, glassmorphism, and marketing-dashboard styling;
- preserve keyboard operation, focus visibility, reduced motion, forced colors, semantic headings, and form labels.

## Mandatory visual matrix

```text
Desktop /guides/
Mobile  /guides/
Desktop /guides/eu-stablecoin-access-after-mica/
Mobile  /guides/eu-stablecoin-access-after-mica/
Desktop /methodology/
Mobile  /methodology/
Desktop /about/
Mobile  /about/
Desktop /compare/
Mobile  /compare/
Desktop /access-regulation/
Mobile  /access-regulation/
Desktop /timeline/
Mobile  /timeline/
Desktop /stats/
Mobile  /stats/
```

The machine audit must verify:

- shared shell present;
- guide, editorial, or existing secondary-tool root marker present;
- long-form table of contents or local navigation present where required;
- guide index category navigation present;
- comparison/access/timeline inputs, clear actions, and result or empty state present;
- statistics methodology notice and KPI section present;
- representative H1 text remains at least 28px;
- responsive tables use local containment;
- no horizontal page overflow;
- required desktop and mobile captures are complete.

Missing capture, skipped audit, missing required hierarchy, undersized H1, or horizontal page overflow is a hard failure. Automated rendering does not update owner approval.

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Home changed: 0
Stablecoin register changed: 0
Stablecoin dossier changed: 0
Event pages changed: 0
Organization pages changed: 0
Owner approval records changed: 0
UI completion declared: false
PR G pre-authorized: false
```

## Exit condition

PR #419 ends at `REVIEW GATE`. Full visual closure remains blocked pending a separate post-PR #419 review.
