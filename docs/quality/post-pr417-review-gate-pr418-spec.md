# PR #418 Post-PR #417 Review Gate Specification

Status: active mandatory review gate  
Review PR: 418  
Source implementation PR: 417  
Public output: false

## Objective

Review the event and organization rebuild, bind its successful contract/build and eight-state desktop/mobile visual audit, preserve every route, canonical, metadata, and owner-approval boundary, and authorize exactly one later implementation phase: PR #419, the guides and secondary-pages rebuild described as PR F in Issue #281.

## Binding findings

```text
UI v3 state: reopened
Completed phase: PR E — events and organizations
Source implementation merge: aa4e5b98ae25652c2aeb6327000ce6a7b8f14e51
Source implementation head: 8d9d9472e9458ac689b7edb624baf737e5119364
Visual review run: 29596605158
Visual artifact ID: 8413318222
Visual artifact digest: sha256:fe5529682a0bf1cfe8ef9a62ff4e642b60ae5a8157835f87232f11a7a620c735
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Required captures: 8
Completed captures: 8
Visual failures: 0
Horizontal-overflow failures: 0
Mobile vertical-density failures: 0
Events mobile body height: 8,886px
Organizations mobile body height: 8,514px
Mobile register ceiling: 9,000px
Automated rendering equals owner approval: false
Owner-approved desktop templates: 0
Owner-approved mobile templates: 0
Routes changed: 0
Canonical changes: 0
Public machine-readable changes: 0
Metadata-contract changes: 0
```

The event and organization indexes now render a bounded first page of 20 records and preserve search, five visible filter groups, selected-state feedback, active chips, sort, clear, result range/count, pagination, and explicit empty state. Event impact and historical lifecycle effect remain separate. Organization identity, jurisdiction, roles, connected assets, relationship state/count, evidence, and confidence remain separate.

The desktop and mobile event index, TerraUSD collapse event, organization index, and Circle organization record all passed. Every state contained the required route marker, shared shell, controls or detail sections, and exact viewport-width rendering. The two mobile registers passed the added vertical-density gate at 8,886px and 8,514px respectively.

The artifact establishes render, hierarchy, bounded browsing, responsive integrity, and density compliance. It does not accept owner visual approval and does not declare UI v3 complete.

## Authorized next work

PR #419 may rebuild exactly the existing guide and remaining secondary HTML route families:

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

### Guides and long-form requirements

- improve reading width, heading rhythm, table of contents, section navigation, callouts, examples, tables, and source presentation;
- keep methodology depth while removing uninterrupted wall-of-text presentation;
- distinguish definitions, examples, cautions, source notes, and correction paths;
- preserve article identity, publication/update semantics, canonical links, and evidence/source meaning;
- keep guide index browsing bounded and understandable;
- avoid converting research pages into marketing landing pages.

### Secondary registry-tool requirements

- preserve the current comparison, access/regulation, timeline, and statistics data semantics;
- expose inputs, selected state, result state, absence semantics, freshness/readiness, and clear actions visibly;
- keep tables and dense results locally scrollable rather than causing page overflow;
- retain shareable URL state where already present;
- use the modern evidence-registry hierarchy without inventing scores or changing derived-data contracts.

### Project and reference-page requirements

- provide clear reading hierarchy and local navigation for about, glossary, models, updates, maintenance, corrections, and support pages;
- preserve correction and support utility roles;
- distinguish canonical definitions from explanatory prose;
- keep operational/publication history readable without implying canonical record changes;
- preserve all existing external links and submission semantics.

## Required representative visual states

PR #419 must capture and audit these sixteen states:

```text
Desktop and mobile: /guides/ — guide index
Desktop and mobile: /guides/eu-stablecoin-access-after-mica/ — long-form guide with tables
Desktop and mobile: /methodology/ — deep methodology page
Desktop and mobile: /about/ — project introduction page
Desktop and mobile: /compare/ — comparison tool
Desktop and mobile: /access-regulation/ — access/regulation explorer
Desktop and mobile: /timeline/ — change timeline
Desktop and mobile: /stats/ — registry statistics
```

The visual audit must verify:

- no horizontal page overflow;
- readable body and metadata sizes;
- guide and methodology reading width is bounded;
- table of contents or local section navigation is present on long-form pages;
- tables use an explicit responsive strategy;
- comparison/access/timeline inputs and result state are visible;
- statistics hierarchy remains measured and registry-like;
- correction, support, source, and methodology links remain reachable;
- keyboard operation, focus, long labels, long URLs, forced colors, and narrow screens remain usable;
- automated capture does not modify owner approval.

## Required PR #419 validation

- only the authorized guide and secondary HTML route/template families and their specific components/styles/scripts may change;
- no route additions, removals, or renames;
- no canonical or public machine-readable data changes;
- no home, stablecoin register, stablecoin dossier, event, or organization redesign;
- the sixteen representative desktop/mobile captures are mandatory;
- contact sheet and machine visual manifest are mandatory;
- skipped visual audit or horizontal page overflow is a hard failure;
- contract, Astro, build, canonical, Evidence, compatibility, release-integrity, reproducibility, public-layer, responsive, and accessibility checks remain green;
- owner approval records stay pending;
- PR #419 stops before PR G.

## Prohibited work

- route or metadata-contract changes;
- canonical data growth or correction;
- public machine-readable schema or content changes;
- home, stablecoin, event, or organization template redesign;
- owner-approval status changes;
- safety, transparency, risk, incident, organization, or quality scores;
- UI completion declaration;
- PR G or later implementation.

## Exit condition

PR #418 confirms PR #417 is complete, preserves owner approval as pending, and authorizes exactly PR #419. After PR #419, the repository returns to `REVIEW GATE` before full visual closure.
