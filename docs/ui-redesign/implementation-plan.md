# Stable or Gone UI and public-information repair implementation plan

Status: canonical implementation plan  
Updated: 2026-06-26  
Target release: 100 canonical stable assets

## 1. Purpose

This file is the binding pull-request sequence for the SOG documentation reset, public-taxonomy repair, information-architecture rebuild, UI implementation, full-record audit, and 100-record release.

No implementation work may be reordered, combined, or skipped without updating this file and `docs/roadmap.md` in the same pull request.

## 2. Current position

```text
Canonical stable assets: 92
Canonical organizations: 86
Canonical relationships: 101
Canonical events: 150
Canonical evidence: 455
Current approved phase: documentation reset
Growth status: paused
Production publication: paused except verified emergency repair
```

The present branch is the documentation-reset pull request. It must merge before PR 1 below begins.

## 3. Binding working rules

Every PR must:

1. start from the latest confirmed `main`;
2. cite exact sections of `docs/ui-redesign/master-spec.md`;
3. cite its numbered item in this plan;
4. update `docs/roadmap.md` when current position or sequence changes;
5. preserve canonical counts unless an explicit audited migration says otherwise;
6. run repository validation and the checks introduced by earlier dependency PRs;
7. state one deployment classification from `docs/deployment-policy.md`;
8. avoid production deployment unless this plan marks a publication checkpoint;
9. remain independently buildable;
10. avoid combining unrelated repair layers.

## 4. Phase gates

```text
Gate A — documentation reset merged
Gate B — production integrity repaired
Gate C — taxonomy and data-semantics migration complete
Gate D — information architecture and mocks approved
Gate E — core registry UI complete
Gate F — full responsive/accessibility/performance hardening complete
Gate G — all 92 current records audited
Gate H — 100-record release candidate verified
Gate I — deliberate production publication and parity verification
```

A failed gate blocks the next dependent phase. It does not erase already completed unrelated work.

# Phase 0 — Documentation reset

## Documentation reset PR — Rewrite the source of truth

This is the current pull request.

### Scope

- add `docs/spec-governance.md`;
- add `docs/ui-redesign/master-spec.md`;
- add `docs/ui-redesign/implementation-plan.md`;
- update `AGENTS.md` required reading and traceability rules;
- update `docs/roadmap.md` current phase and full sequence;
- update `README.md` current counts and source-of-truth links;
- mark the old Registry v3 implementation plan as historical and replace its active schedule role;
- update deployment gates to pause routine growth and define the redesign release checkpoint.

### Completion criteria

- repository documents no longer direct work toward Batch 18 before the repair program;
- all future work has one authoritative reading order;
- the current 92-record checkpoint is recorded consistently;
- no production code or canonical data changes are included.

### Deployment classification

No production deployment required.

# Phase 1 — Emergency integrity repair

## PR 1 — Freeze repair baseline and defect inventory

### Work

Create a machine-readable and human-readable baseline containing:

- canonical record-group counts;
- generated route counts;
- public-origin counts;
- sitemap counts;
- machine-readable counts;
- known public-taxonomy defects;
- known mobile defects;
- known stale-output defects;
- representative complex records.

Representative cases must include active, restricted, winding-down, collapsed, migrated, non-USD, multi-organization, multi-deployment, evidence-heavy, unknown-heavy, wrapper/relationship, and regulation-heavy records.

### Completion criteria

- each confirmed defect has a reproducible check or audit entry;
- before/after comparisons can use this baseline;
- no canonical data changes.

## PR 2 — Add build provenance

### Work

Generate and expose:

```text
source commit
build timestamp
canonical data hash
record-group counts
generated route counts
```

Use the same generated provenance in `version.json`, build summaries, and production verification.

### Completion criteria

- a deployed page set can be tied to one commit and one data snapshot;
- provenance values are generated, not manually maintained.

## PR 3 — Enforce full-route and output parity

### Work

Validate:

- stablecoin, organization, and event list counts;
- detail-route counts;
- sitemap coverage;
- JSON-LD and canonical coverage;
- `version.json` and manifest parity;
- absence of stale generated pages from an earlier snapshot.

### Completion criteria

- partial or mixed-generation output fails CI;
- one route family cannot silently remain on an older dataset.

## PR 4 — Remove destructive mobile column suppression

### Work

- remove global numbered-column hiding;
- add explicit table identities;
- preserve all material fields until the full responsive redesign;
- document temporary overflow behavior.

### Completion criteria

Peg, impact, recovery, confidence, summary, and control-capability fields no longer disappear based only on column position.

### Gate B

Phase 1 is complete only when PRs 1–4 are merged and all new integrity checks pass.

# Phase 2 — Public taxonomy and canonical-semantics repair

## PR 5 — Add public-value registry and legacy mapping

### Work

Create one approved mapping layer for:

```text
canonical value
public category
public label
legacy aliases
short definition
sort order
```

Cover lifecycle, issuance, reference target, backing/model category, event category, organization category, relationship role, evidence fields, deployment state, and value-state semantics.

### Completion criteria

- UI code no longer needs ad hoc label rules;
- free-text values cannot become filter categories automatically.

## PR 6 — Normalize lifecycle and issuance presentation

### Work

- make canonical lifecycle the public source of truth;
- retain legacy status only for compatibility validation;
- map legacy values record by record;
- keep issuance separate;
- update chips, filters, list rows, detail summaries, and statistics inputs.

### Completion criteria

- list and detail pages cannot describe the same asset with conflicting lifecycle labels;
- compatibility validation rejects contradictory legacy and canonical values.

## PR 7 — Normalize reference targets and peg labels

### Work

- separate reference kind, asset/code, public label, and methodology description;
- migrate internal identifiers away from default display;
- define comparison categories for filters.

### Completion criteria

- internal enum strings do not appear as public peg labels;
- complex floating or indexed targets retain accurate descriptions.

## PR 8 — Normalize backing and stabilization presentation

### Work

Separate:

```text
public comparison category
canonical backing types
reserve components
primary stabilization mechanism
protocol-specific explanation
historical model changes
```

### Completion criteria

- model filters use a finite approved category list;
- detailed mechanism information remains available in asset records.

## PR 9 — Normalize event categories and subtypes

### Work

- define stable public event categories;
- map legacy event types to categories and precise subtypes;
- preserve typed detail records;
- remove implementation-facing overlay names from public copy.

### Completion criteria

- launch, migration, rebrand, and wind-down variants are consistently grouped;
- no material event detail is lost.

## PR 10 — Normalize organization classification

### Work

Separate:

```text
organization category
legal form
functional role
jurisdiction
regulatory character
```

### Completion criteria

- legal form and operational function are not treated as one enum;
- public Organization pages can explain multiple roles accurately.

## PR 11 — Separate evidence reliability, provenance, and type

### Work

Migrate evidence metadata so that:

- reliability is a quality assessment;
- primary/secondary status is independent;
- source type and source provenance are independent;
- claim scopes remain relation-level data where appropriate.

### Completion criteria

- values such as `high` and `primary_repository` cannot occupy the same semantic axis.

## PR 12 — Separate deployment status from verification work state

### Work

Add or normalize:

```text
deployment status
canonicality
contract address
verification status
verification note
linked known unknown
```

### Completion criteria

- review placeholders no longer appear as chain, contract, or deployment status values;
- unresolved contract identity remains visible through an explicit unknown state.

## PR 13 — Define and migrate value-state semantics

### Work

Implement the approved distinctions:

```text
known
unknown_after_review
not_recorded
not_applicable
not_public
unverified
disputed
approximate
```

### Completion criteria

- the public UI can distinguish investigated unknowns from missing data;
- validators prevent work-queue strings from substituting for value state.

## PR 14 — Make primary display relationships explicit

### Work

- stop using relationship array order;
- add an explicit primary display relationship or approved deterministic priority;
- validate current/historical relationship boundaries;
- support multiple visible organizations and roles.

### Completion criteria

- changing JSON order cannot change the public primary organization;
- zero or multiple unintended primaries fail validation.

## PR 15 — Deduplicate evidence sources while preserving claim relations

### Work

- identify duplicate source records and duplicate public rows;
- preserve one source identity with multiple evidence relations;
- show all supported claim scopes.

### Completion criteria

- no accidental duplicate source rows;
- evidence relation counts and claim coverage are preserved.

## PR 16 — Move record-specific public copy out of components and complete the 92-record migration

### Work

- move hard-coded asset summaries into the approved data/copy layer;
- apply PR 5–15 migrations to all 92 assets and related records;
- generate before/after preservation reports.

### Completion criteria

- rendering components contain no asset-specific summary table;
- all canonical record-group counts are preserved or explicitly audited;
- all 92 assets pass taxonomy validators.

### Gate C

Phase 2 is complete only when PRs 5–16 are merged and the 92-record migration audit passes.

# Phase 3 — Information architecture, responsive specification, and mocks

## PR 17 — Finalize site architecture and route roles

### Work

Define Registry, Learn, and Project navigation groups; preserve canonical route compatibility; remove compatibility implementation details from record content.

### Completion criteria

- route map and global navigation map are approved;
- no route change is implied without a dedicated migration.

## PR 18 — Finalize stablecoin dossier hierarchy

### Work

Create the field-to-section matrix for:

```text
identity and current state
organizations and control
how the asset works
deployments and legal context
history
evidence
known unknowns
corrections and further reading
```

### Completion criteria

- every current public field has a destination, replacement, or explicit deprecation decision;
- evidence and unknowns cannot be omitted by design.

## PR 19 — Finalize list, search, filter, and comparison behavior

### Work

Specify stablecoin, organization, and event indexes, including URL-synchronized filters, active-filter summaries, search scope, multi-role summaries, and mobile record rows.

### Completion criteria

- filter behavior is shareable and testable;
- no approved filter depends on unique free-text enumeration.

## PR 20 — Define meaningful change history

### Work

Define public change types:

```text
status change
event added
evidence added
relationship change
reserve/redemption change
unknown added
unknown resolved
copy-only correction
```

### Completion criteria

- Updates and detail summaries can explain what changed, not merely when a record was reviewed.

## PR 21 — Finalize responsive and accessibility specification

### Work

Define page-specific mobile transformations, filter behavior, local detail navigation, table semantics, source expansion, contract handling, focus order, and result announcements.

### Completion criteria

- every current table has an explicit mobile representation;
- no material-information suppression remains unspecified.

## PR 22 — Approve visual system and image mocks

### Work

Produce and review the visual system and required desktop/mobile mocks using representative complex records.

Required mocks:

```text
stablecoin index desktop
stablecoin detail desktop
stablecoin index mobile
stablecoin detail mobile
organization detail
event detail
home
open filter state
evidence expanded state
known-unknown warning state
```

### Completion criteria

- every visible element maps to canonical fields and value-state rules;
- mocks satisfy desktop, mobile, evidence, unknown, and multi-relationship requirements.

### Gate D

No production UI implementation begins until PRs 17–22 are merged.

# Phase 4 — Shared UI and registry indexes

## PR 23 — Implement global shell and navigation

### Work

- Registry/Learn/Project navigation;
- desktop and mobile navigation;
- current-page state;
- footer hierarchy;
- corrections and data-access visibility;
- support as secondary utility.

### Completion criteria

- mobile header does not become an uncontrolled multi-row link list;
- compatibility path details are absent from record content.

## PR 24 — Rebuild stablecoin index

### Work

Implement approved taxonomy, URL filters, result-state controls, desktop comparison table, mobile compact rows, multi-organization indication, and meaningful review/change information.

### Completion criteria

- no internal enum or free-text mechanism appears as a filter category;
- shared filter URLs restore the same state.

## PR 25 — Rebuild organization index and detail

### Work

Implement organization category, legal form, jurisdiction, current/historical roles, connected assets, confidence scope, and relationship navigation.

### Completion criteria

- organization is not treated as synonymous with issuer;
- all material roles remain visible.

## PR 26 — Rebuild event index and detail

### Work

Implement public category, precise subtype, impact, recovery applicability/outcome, asset and organization links, evidence summary, and typed details.

### Completion criteria

- internal overlay names are not public;
- event category and subtype remain distinct.

# Phase 5 — Stablecoin dossier implementation

## PR 27 — Implement detail shell and local navigation

### Work

- dossier header;
- current-state summary;
- section outline;
- sticky desktop navigation;
- mobile section navigation;
- direct anchors;
- top-level event/evidence/unknown summaries.

### Completion criteria

- users can understand and navigate long records without reading from top to bottom.

## PR 28 — Implement identity, lifecycle, issuance, and organization relationships

### Work

Implement canonical identity, aliases, lifecycle, issuance, reference target, explicit primary relationship, additional roles, dates, control context, and organization links.

### Completion criteria

- a single visible organization cannot imply sole responsibility when multiple roles exist.

## PR 29 — Implement backing, reserve, stabilization, redemption, and income mechanics

### Work

Present each axis separately, connect section-local evidence and unknowns, and preserve dated reserve/redemption context.

### Completion criteria

- no safety score or recommendation is generated;
- current and historical mechanism data are distinguishable.

## PR 30 — Implement deployments, legal context, and control capabilities

### Work

Present chain, contract, canonicality, verification, legacy/current state, freeze/blacklist capability, observed control events, legal classification, and regulatory notes.

### Completion criteria

- unresolved verification is explicit without exposing internal work-queue strings.

## PR 31 — Implement unified history, evidence, and known unknowns

### Work

- unified but typed timeline;
- source-deduplicated evidence presentation;
- claim scopes;
- primary/official/archive indicators;
- top and section-local known-unknown links;
- priority and last-checked information.

### Completion criteria

- evidence is not a buried appendix;
- known unknowns are not presented as accidental missing data.

### Gate E

Core registry UI is complete only when PRs 23–31 are merged.

# Phase 6 — Search, home, editorial alignment, and hardening

## PR 32 — Add build-time registry-wide search

### Work

Index approved public fields across assets, organizations, and events without introducing a live external search dependency.

### Completion criteria

- results are grouped by record type;
- contract, alias, organization, role, event, and reference searches work as specified.

## PR 33 — Rebuild home page

### Work

Prioritize registry entry, global search, main record families, meaningful recent changes, methodology, data access, and secondary support.

### Completion criteria

- no selected/featured record section depends on array order;
- registry access is the primary purpose.

## PR 34 — Align guides, glossary, methodology, updates, contact, support, and data access

### Work

Separate editorial content from canonical records, update methodology to match public taxonomy, implement meaningful update types, strengthen corrections, and formalize machine-readable data access.

### Completion criteria

- guides do not interrupt core record sections;
- methodology matches canonical/public mappings.

## PR 35 — Complete responsive transformation

### Work

Test and repair all pages at required widths; implement page-specific table and record transformations; verify filters, long text, contracts, evidence, and local navigation.

### Completion criteria

- no material field is silently removed;
- mobile operation does not depend only on horizontal scrolling.

## PR 36 — Complete accessibility and interaction audit

### Work

Audit semantic structure, keyboard operation, focus, labels, result announcements, non-color states, expanded state, reduced motion, and contrast.

### Completion criteria

- no known critical keyboard, screen-reader, or contrast defect remains.

## PR 37 — Complete performance, SEO, build, and machine-readable parity audit

### Work

Audit static generation, client bundle, search index, route counts, canonical metadata, JSON-LD, sitemap, version, manifest, AI/LLM entrypoints, and canonical-only data boundaries.

### Completion criteria

- all parity and performance gates pass on one candidate build.

### Gate F

PRs 32–37 must merge before the full-record audit or count growth resumes.

# Phase 7 — Full-record audit and 100-record release

## PR 38 — Audit all 92 current assets under the repaired public layer

### Work

For every current asset verify:

```text
identity
lifecycle
issuance
reference label
public backing/model category
primary and additional relationships
reserve and redemption
income/yield
legal profile
deployments
events
evidence deduplication
known unknowns
mobile layout
metadata
machine-readable parity
```

Also audit all current organization and event routes.

### Completion criteria

- 92/92 assets pass the repair checklist;
- no unexplained canonical-count loss;
- no route-generation discrepancy;
- unresolved defects are either fixed or explicitly block release.

## PR 39 — Promote the final eight assets for the 100-record release

### Work

Select and promote eight records using the normal candidate, full-layer, evidence, validation, and bounded-batch policy. This PR may be split into two bounded growth PRs if required by the five-record routine batch limit. If split, update this plan and roadmap before work begins.

### Completion criteria

- 100 canonical assets;
- every added record passes the repaired taxonomy and UI audit;
- no shortcut or thin placeholder record is used to reach the number.

## PR 40 — Build and verify the 100-record release candidate

### Work

Create one candidate build from the intended main commit and verify:

- all canonical counts;
- all list and detail routes;
- sitemap;
- canonical and JSON-LD;
- version and manifest;
- search;
- filter URLs;
- compatibility routes;
- responsive smoke tests;
- machine-readable outputs;
- production provenance fields.

### Completion criteria

- one immutable intended commit passes the complete release checklist.

### Gate H

No production publication occurs until PR 40 is merged and the release candidate audit passes.

# Phase 8 — Production publication

## Publication checkpoint — 100-record repaired UI

### Work

- manually dispatch the approved production workflow from the intended `main` commit;
- verify the deployed source commit;
- verify public counts and all route families;
- verify no stale route family remains;
- run production consistency;
- record the publication report in the repository.

### Completion criteria

```text
deployed commit equals intended main
100 stable assets visible
all public counts match canonical data
all route counts match
machine-readable parity passes
no material responsive or navigation regression
```

### Deployment classification

Publication checkpoint deployment required after merge.

# Phase 9 — Post-release work

Only after Gate I passes may the roadmap select:

- post-release defects;
- statistics implementation or revision;
- further record growth;
- additional languages;
- optional explorer enhancements.

These items are not part of the 100-record repaired-UI release unless this plan is deliberately amended.
