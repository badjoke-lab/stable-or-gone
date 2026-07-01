# UI v3 Editorial Ledger stablecoin dossier audit

Status: supporting audit  
Date: 2026-07-01  
Roadmap item: PR #265

## Purpose

Replace the transitional Modern Data Product stablecoin detail composition with the approved Editorial Ledger research dossier while preserving canonical facts, relationships, events, evidence, value states, routes, and machine-readable output.

## Removed composition

```text
PageHero marketing block
Six MetricCard current-state tiles
Circular glowing ticker visual
Dark rounded sticky navigation panel
Repeated gradient panel stack
Card-grid related links
```

## New upper record structure

```text
STABLECOIN DOSSIER
Record ID
Symbol / canonical name
Aliases
Lifecycle status

Lifecycle | Issuance | Reference | Primary organization | Launch
Redemption | Backing | Stabilization | Last review | Evidence

Latest material change
```

The upper facts are canonical or directly derived from canonical relationships, events, and evidence. No score, recommendation, market metric, or invented verification claim is added.

## Body hierarchy

```text
Reviewed assessment
Organizations and control
Mechanism
Reserve and redemption
Deployments and legal context
Lifecycle and event history
Evidence
Known unknowns
Related records and corrections
```

Rules, headings, definition lists, timelines, tables, and controlled disclosure replace the repeated-card hierarchy.

## Protected information

The dossier preserves:

- canonical name, symbol, aliases, ID, slug, asset class, confidence, and last review;
- lifecycle and issuance as separate states;
- reference target, kind, category, value, and methodology;
- backing, reserve components, stabilization, valuation, yield, and classification notes;
- every organization relationship and primary-display context;
- reserve profiles, redemption profiles, reserve reports, and regulatory notices;
- deployment state, canonicality, verification, contract identity, control capabilities, and legal context;
- material events, model-history events, and issuer-control events;
- evidence provenance, supported claims, archive state, reliability, and publication date;
- known unknowns and correction entrypoints.

## Evidence reachability

Evidence is available in three ways before the page end:

1. the upper facts link directly to `#evidence`;
2. the local dossier navigation includes Evidence;
3. the evidence section appears before known unknowns and related reading.

## Information-density states

Low-, medium-, and high-information records share one hierarchy. Missing material-event, reserve-component, model-history, relationship, deployment, evidence, and open-question data use explicit empty states rather than blank cards or invented defaults.

## Responsive behavior

- the fact ledger reduces from five columns to three and then one;
- wide canonical tables remain horizontally reachable;
- organization relationships transform to the existing protected compact representation below 720px;
- field labels remain attached to values;
- local navigation remains keyboard accessible and becomes non-sticky on compact screens;
- reduced motion and forced-colors behavior remain available.

Final cross-site 320px and 200-percent-zoom hardening remains scheduled for PR #269.

## Data and route preservation

```text
Canonical stable assets: 98
Canonical data changes: 0
Route additions: 0
Route removals: 0
Redirect additions: 0
Logo changes: 0
Machine-readable shape changes: 0
Synthetic scores: 0
```

## Validation

```text
npm run validate:ui-v3-stablecoin-detail
npm run validate:mobile-information
npm run validate:active-workstream
npm run check
npm run build
npm run verify:consistency
```

The historical `validate:ui-v2-stablecoin-detail` command remains as a compatibility alias and now validates the active UI v3 dossier.

## Remaining work

PR #266 must migrate Organizations and Events before Gate V3-C can pass. Guides, reference pages, final mobile hardening, representative visual audit, cleanup, and production closure remain pending.
