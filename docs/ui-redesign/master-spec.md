# Stable or Gone UI and public-information repair specification

Status: canonical specification  
Updated: 2026-06-26  
Target release: 100 canonical stable assets

## 1. Purpose

This specification governs the full repair of SOG's public information architecture, public taxonomy, responsive behavior, navigation, evidence presentation, known-unknown presentation, and visual system.

The work is not a cosmetic reskin. It preserves the canonical registry model while repairing the public layer that currently exposes inconsistent labels, internal values, misleading summaries, destructive mobile behavior, and weak page hierarchy.

## 2. Product identity

SOG is a public historical registry for stablecoins and closely related stable-value assets.

It must answer:

> What is this asset, who is connected to it, how does it work, what has happened to it, what evidence supports the record, and what remains unknown?

SOG must not become:

- a live price dashboard;
- a trading terminal;
- a market-cap ranking;
- a yield ranking;
- a safety or risk ranking;
- a buy, sell, hold, avoid, or redemption recommendation service;
- an issuer, exchange, wallet, or account support service;
- an advertising-led crypto landing page.

## 3. Scope of repair

The repair covers five layers.

### 3.1 Production and route integrity

- all public pages must be generated from one intended canonical snapshot;
- HTML counts, route counts, sitemap counts, JSON-LD, `version.json`, and `data/manifest.json` must agree;
- old generated pages must not survive a production publication;
- build provenance must identify source commit, build time, canonical data hash, and route totals.

### 3.2 Public taxonomy

- internal values must not be exposed directly as public labels;
- canonical meaning, public category, public label, and legacy alias must be distinct;
- filters must use stable public categories, not arbitrary free-text values;
- public categories must not overwrite canonical detail.

### 3.3 Information architecture

- current state, mechanism, history, evidence, and unresolved questions must be visually distinct;
- asset, organization, and event pages must form one connected registry;
- editorial guides must remain separate from canonical records;
- long records must provide section orientation and direct anchors.

### 3.4 Responsive and accessible presentation

- no material field may disappear because of a generic column-number rule;
- every registry table requires a page-specific mobile transformation;
- color must not be the only status signal;
- keyboard, focus, semantic-heading, form-label, and result-announcement behavior must be explicit.

### 3.5 Visual system

- the interface must feel like a serious research registry;
- typography, density, borders, status treatment, evidence treatment, and unknown treatment must support scanning and comprehension;
- the interface must not imitate an exchange, portfolio, market terminal, or promotional crypto product.

## 4. Canonical model that must be preserved

The following record separation remains valid and must not be collapsed for visual convenience:

```text
stable asset
organization
stablecoin-organization relationship
classification
reserve and redemption profile
event
event detail
evidence
evidence relation
reserve report or reserve context
known unknown
regulatory note
deployment
legal profile
stable-asset relationship
reserve component
income profile
```

The redesign may change grouping, summary, navigation, and progressive disclosure. It must not erase these layers or convert them into one synthetic score.

## 5. Confirmed defects that the repair must address

### 5.1 Public-snapshot inconsistency

The repository and public origin have displayed different canonical totals, and at least one route family has shown an older data generation than the rest of the site.

Required repair:

- provenance metadata;
- full-route parity validation;
- stale-output detection;
- publication verification against the intended commit.

### 5.2 Lifecycle and legacy-status inconsistency

The public layer has used legacy labels such as `failed`, `discontinued`, and `limited` alongside canonical lifecycle values such as `collapsed`, `terminated`, `restricted`, and `winding_down`.

Required repair:

- canonical lifecycle remains the source of truth;
- legacy values become compatibility inputs only;
- list, detail, statistics, chips, and filters use one public-label mapping;
- issuance remains a separate axis.

### 5.3 Free-text model filters

Mechanism descriptions and historical explanations have been exposed as if they were comparable model categories.

Required repair:

- define stable public backing/model categories;
- preserve detailed mechanisms in record detail;
- never generate filter taxonomies from arbitrary unique strings.

### 5.4 Internal reference identifiers in public UI

Internal peg or reference identifiers have appeared directly in filters and tables.

Required repair:

- canonical structured reference values;
- human-readable public labels;
- detailed reference description where required;
- internal identifier available only where technically useful, not as the default label.

### 5.5 Event-category proliferation

Near-duplicate event values have accumulated for launches, migrations, rebrands, wind-downs, and related developments.

Required repair:

- public event category;
- precise event subtype;
- typed detail data;
- stable category filter;
- migration mapping for legacy values.

### 5.6 Evidence-axis contamination

Reliability, provenance, primary-source status, source medium, and repository/explorer identity have been mixed.

Required repair:

```text
source_type
source_provenance
is_primary
reliability
publisher
claim scopes
archive status
```

Reliability must remain a quality assessment, not a source-medium label.

### 5.7 Deployment work-state leakage

Internal work states such as source-review placeholders have appeared as deployment status, chain, or contract values.

Required repair:

```text
deployment status
contract address
verification status
verification note
linked known unknown
```

Work queues must not become public canonical status values.

### 5.8 Primary-organization selection by array order

Primary display relationships must not be inferred from the first relationship in a list.

Required repair:

- explicit primary-display relationship or deterministic documented priority;
- current/historical distinction;
- validation against zero or multiple unintended primary relationships;
- visible indication of additional organizations and roles.

### 5.9 Evidence duplication

One source may support multiple claims, but it must not appear as accidental duplicate rows.

Required repair:

- one source presentation;
- multiple visible claim scopes or relations;
- source-level metadata separated from relation-level metadata.

### 5.10 Internal implementation language in public pages

Compatibility-path notes, registry-version overlay names, source-review placeholders, and other implementation terms must not appear as public record facts.

### 5.11 Destructive mobile column hiding

A generic responsive rule must never hide the same numbered column across unrelated tables.

Required repair:

- remove global numbered-column suppression;
- define a responsive representation per table and record type;
- maintain access to every material field.

### 5.12 Flat long-form detail pages

The stablecoin detail page currently presents many semantically different sections using nearly identical panels and tables.

Required repair:

- explicit dossier hierarchy;
- local section navigation;
- current-state summary;
- mechanism grouping;
- history grouping;
- visible evidence and unresolved-question summaries.

### 5.13 Hard-coded record copy in components

Asset-specific summaries must not be stored in rendering components.

Required repair:

- canonical or approved editorial-copy layer;
- consistent fallback rules;
- translation-ready separation;
- data-review traceability.

## 6. Public taxonomy rules

### 6.1 Four-layer mapping

Every public enum-like value must support:

```text
canonical value
public category
public label
legacy aliases
```

Optional fields:

```text
short definition
long definition
sort order
status tone
```

### 6.2 No dynamic taxonomy from unique free text

The UI must not create filter options by taking every unique descriptive string in canonical records.

Dynamic counts are allowed. Dynamic category definition is not.

### 6.3 Canonical-detail preservation

A public category is a navigation and comparison aid. It must not replace precise canonical fields or historical explanation.

### 6.4 Value-state semantics

Public records must distinguish:

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

The UI must not reduce all of these to `Unknown` or `—`.

## 7. Required stablecoin detail hierarchy

The stablecoin detail route remains one canonical record page.

Required order:

```text
1. Identity and current state
2. Organizations, roles, and control
3. How the asset works
   3.1 reference target
   3.2 backing and reserve structure
   3.3 stabilization mechanism
   3.4 redemption or exit
   3.5 yield or income mechanics where applicable
4. Deployments and legal context
5. Historical timeline
6. Evidence
7. Known unknowns and unresolved questions
8. Corrections and further reading
```

### 7.1 Identity and current state

Must expose:

- canonical name;
- symbol and aliases;
- asset class;
- lifecycle;
- issuance state;
- reference target;
- last reviewed;
- meaningful change summary;
- counts or alerts for organizations, events, evidence, and unresolved questions.

### 7.2 Organizations, roles, and control

Must expose:

- explicit primary-display relationship;
- all material current and historical roles;
- role dates where known;
- organization type and jurisdiction;
- control capability context;
- links to organization records.

One visible organization must not imply sole responsibility.

### 7.3 How the asset works

Reserve, redemption, stabilization, backing, and yield must remain separate concepts. The UI must not generate a safety score or simplified endorsement.

### 7.4 Deployments and legal context

Must distinguish:

- asset identity from chain deployment;
- native, bridged, wrapped, synthetic, and legacy deployment forms;
- verified contract identity from unverified identity;
- control capabilities from observed control events;
- legal classification from economic function.

### 7.5 Historical timeline

The timeline may combine events, reserve publications, regulatory notices, migrations, and material control actions, but each item must preserve its type and source connection.

### 7.6 Evidence

Evidence must show:

- source title;
- publisher;
- date;
- source type;
- primary or secondary character;
- reliability;
- archive availability;
- claims supported.

Evidence must be visible before the user reaches the absolute end of a very long record, through summary links or local navigation.

### 7.7 Known unknowns

Known unknowns are reviewed records, not accidental blanks.

The page must show:

- count near the top;
- high-priority unresolved items where relevant;
- local links from affected sections;
- topic, description, state, priority, and last checked date.

## 8. Registry indexes

### 8.1 Stablecoin index

Required capabilities:

- search by canonical name, symbol, alias, organization, role, and public taxonomy labels;
- filter by lifecycle, issuance, reference category, public backing/model category, organization, and other approved dimensions;
- URL query synchronization;
- clear-all and individual filter removal;
- active-filter summary;
- shareable state;
- desktop comparison table;
- mobile compact records;
- explicit multi-organization indicator;
- no internal enums or arbitrary free-text categories.

### 8.2 Organization index

Must present organizations as organizations, not assume every organization is an issuer.

Required capabilities:

- organization category;
- legal form where known;
- jurisdiction;
- connected assets;
- current and historical roles;
- confidence scope;
- search and filtering.

Compatibility URLs may remain, but compatibility implementation details must not be shown as record facts.

### 8.3 Event index

Required capabilities:

- public category filter;
- precise subtype in detail;
- impact;
- recovery applicability and outcome;
- direct links to assets and organizations;
- source count;
- URL-synchronized filters.

## 9. Global architecture

Required top-level grouping:

```text
Registry
  Stablecoins
  Organizations
  Events
  Explorer or Stats when approved

Learn
  Guides
  Glossary
  Methodology

Project
  Updates
  Corrections
  Data access
  Support
```

Support must remain available but must not visually outrank corrections, methodology, evidence, or data access.

## 10. Home-page purpose

The home page's primary purpose is entry into the registry.

Required order:

1. short product definition;
2. registry-wide search;
3. primary registry views;
4. meaningful recent changes;
5. representative research entry points;
6. methodology and data access;
7. secondary support link.

A section called selected or featured records must have an explicit selection rule. Array order is not a selection rule.

## 11. Editorial separation

Guides, glossary, methodology, and updates are editorial or explanatory layers.

Rules:

- they must not interrupt the canonical record before core record information is presented;
- guides appear as further reading or contextual help;
- methodology is the public definition source;
- updates describe meaningful changes, not merely review timestamps;
- canonical evidence is not replaced by guide prose.

## 12. Responsive requirements

Required tested widths:

```text
320
360
390
768
820
1024
1280+
```

Rules:

- no global `nth-child` suppression of material columns;
- no page may rely only on desktop tables with uncontrolled horizontal scrolling;
- horizontal scrolling may be used selectively for exact comparison data;
- mobile filter controls must expose active state and clear actions;
- contract addresses and long source titles must wrap or use safe truncation with full access;
- touch targets must remain usable;
- local detail navigation must work on small screens.

## 13. Accessibility requirements

At minimum:

- semantic heading order;
- landmark structure;
- visible keyboard focus;
- labels for all controls;
- non-color status text or icons;
- announced result-count changes;
- table headers associated with data;
- accessible expanded/collapsed state;
- reduced-motion support;
- sufficient contrast;
- skip or direct-navigation support for long records.

## 14. Performance and static-operation requirements

- remain compatible with Astro static generation;
- no live market API dependency;
- no account system;
- no large client application for basic record reading;
- build-time search index is permitted;
- client-side filtering must remain bounded and testable;
- machine-readable endpoints remain public and canonical-only;
- free or near-free operation remains a constraint.

## 15. Route and compatibility requirements

Preserve existing canonical routes unless a separately reviewed migration is approved:

```text
/stablecoins/
/stablecoin/[slug]/
/issuers/
/issuer/[slug]/
/events/
/event/[id]/
/guides/
/guides/[slug]/
/glossary/
/methodology/
/updates/
/contact/
/support/
```

Public wording may use `Organizations` while compatibility routes remain. Implementation details about compatibility routes must not be displayed as record content.

## 16. Machine-readable requirements

Preserve and validate:

```text
/version.json
/data/manifest.json
/llms.txt
/ai.txt
/robots.txt
/sitemap-index.xml
```

Visual redesign must not weaken:

- stable IDs;
- canonical URLs;
- count parity;
- canonical-only data policy;
- source-commit provenance;
- AI and automated-consumer discovery.

## 17. Mock approval requirements

No mock is approved unless it includes:

- the representative complex records named in the implementation plan;
- desktop and mobile versions;
- field-to-component mapping;
- unknown, missing, disputed, and not-applicable states;
- evidence and known-unknown presentation;
- relationship multiplicity;
- responsive behavior notes.

A visually attractive mock that omits required record layers is invalid.

## 18. Migration and preservation requirements

Every taxonomy or UI migration must report before-and-after counts for all canonical record groups.

Required protections:

- no silent record deletion;
- no ID or slug change without dedicated migration;
- no loss of evidence relations;
- no loss of known unknowns;
- no conversion of multiple roles into one role;
- no conversion of deployment records into separate canonical assets by default;
- no unsupported dates invented to complete the interface.

## 19. Release gate

The 100-record redesign release may be published only after:

- documentation-reset PR merged;
- production provenance and full-route parity checks pass;
- public taxonomy migration is complete;
- all 92 current assets pass the new display audit;
- all current organizations and events pass route and taxonomy audits;
- responsive and accessibility acceptance checks pass;
- machine-readable parity passes;
- the final eight records pass the normal canonical promotion policy;
- one production candidate build is verified as a single snapshot.

## 20. Explicit non-goals

The redesign does not add:

- live prices;
- current market-cap data;
- exchange trading links;
- portfolio tracking;
- wallet connection;
- alert subscriptions;
- safety grades;
- issuer-sponsored placement;
- automated publication of monitoring candidates.
