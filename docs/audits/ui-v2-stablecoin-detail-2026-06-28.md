# UI v2 Stablecoin detail implementation audit

Date: 2026-06-28  
Program: Modern Data Product UI v2  
Plan item: PR #211 — approved Stablecoin detail

## Authority

```text
docs/architecture/approved-modern-data-product-ui-v2.md
docs/ui-redesign/approved-mocks-v2/03-stablecoin-detail.webp
docs/architecture/stablecoin-dossier-hierarchy-v1.md
docs/ui-redesign/implementation-plan.md
docs/roadmap.md
```

## Implemented composition

Every canonical stablecoin detail route now uses:

1. approved v2 record hero;
2. ticker badge, lifecycle, issuance, and registry-return controls;
3. six current-state metric cards;
4. sticky section navigation;
5. record profile;
6. organizations and control;
7. mechanics;
8. reserve and redemption sections;
9. deployments and legal context;
10. historical model and event sections;
11. evidence;
12. known unknowns;
13. coverage, guides, corrections, and machine-readable access.

## Current-state cards

The six summary cards are generated from canonical or derived reviewed fields:

```text
Lifecycle
Reference target
Backing model
Issuance
Primary organization and jurisdiction
Last reviewed with source and event counts
```

These cards summarize the record and do not replace the underlying fields.

## Dossier order

The implementation preserves the approved eight-section ownership contract:

```text
identity_current_state
organizations_control
how_asset_works
deployments_legal_context
history
evidence
known_unknowns
corrections_further_reading
```

Reserve, legal, and unknown sections are rendered through explicit component modes so Open questions appear after Evidence rather than before Deployments and History.

## Preserved field families

### Identity and current state

- name;
- symbol;
- asset class;
- lifecycle;
- issuance;
- canonical ID;
- route slug;
- confidence;
- last reviewed;
- public summary.

The desktop identity table and compact identity cards preserve the same fields.

### Organizations and control

- all current, ended, and unknown-state relationships;
- organization category;
- regulatory character;
- jurisdiction;
- functional role;
- primary display state;
- relationship dates and status;
- governance;
- freeze and blacklist capability summaries;
- deployment control-event references;
- observed issuer-control events.

The desktop table and compact organization cards remain available.

### Mechanics, reserves, and redemption

- reference target, kind, category, value, and methodology;
- public and canonical backing models;
- reserve component categories and entries;
- stabilization mechanism;
- model description;
- redemption or exit model;
- valuation source;
- yield or rebase profile;
- classification notes;
- reserve profile;
- redemption profile;
- reserve and attestation history.

### Deployments and legal context

All deployment axes remain separate, including operational state, canonicality, verification state, contract identity state, network record state, control capabilities, and control-event references. Regulatory and official notices remain a separate source-backed table.

### History, evidence, and unknowns

- historical model changes;
- issuer-control events;
- complete event timeline;
- evidence source identities and evidence axes;
- open-question topic, description, value state, priority, and last checked;
- record coverage counts.

## Further reading and correction paths

The detail page exposes:

```text
Stablecoins registry
Primary organization
Events registry
Related guides
Methodology
Corrections
Public data manifest
```

## Responsive behavior

At compact widths:

- current-state metrics become one column;
- local navigation becomes non-sticky and remains horizontally reachable;
- identity and organization tables are replaced by their protected compact cards;
- reserve, redemption, legal, deployment, evidence, and unknown tables remain reachable through deliberate horizontal containers;
- action controls retain the 44px foundation;
- reduced motion and forced-colors behavior remain defined.

## Mock-only exclusions

The implementation does not add:

- live price or market capitalization;
- supply, holder, or transfer metrics;
- synthetic safety or transparency scores;
- unsupported reserve values;
- account, watchlist, follow, or recent-history features;
- invented verification or licensing claims.

The stale reference to a future “PR 29” reorganization is removed because the mechanics section is now implemented.

## Validation

`scripts/validate-ui-v2-stablecoin-detail.mjs` verifies:

- approved reference presence;
- shared v2 hero, metric, and ticker components;
- six current-state cards;
- required section markers and DOM order;
- local navigation destinations;
- identity fields in table and compact cards;
- mechanics fields;
- organization and control fields;
- reserve, legal, and unknown component modes;
- deployment, event, evidence, and unknown axes;
- corrections and further-reading destinations;
- responsive style markers;
- stale placeholder and synthetic-score absence;
- absence of external runtime fetching.

The validator runs in both `npm run build` and `npm run build:site`.

## Agent authority correction

`AGENTS.md` no longer contains a hardcoded active PR number. Agents must read the roadmap and implementation plan for the current item.

## Data preservation

Expected unchanged checkpoint:

```text
Stable assets:                 92
Organizations:                 86
Organization relationships:   101
Events:                       150
Canonical evidence records:   455
Public source identities:      410
Evidence relations:            455
Known unknowns:                253
Deployments:                   130
```

All 92 existing `/stablecoin/[slug]/` routes remain generated from the runtime registry.

## Deployment classification

No production deployment required.

PR #211 may merge only after its validator, dossier hierarchy and field-ownership checks, mobile protected-field checks, Astro check, full build, registry integrity, route/output parity, and all pull-request workflows succeed.
