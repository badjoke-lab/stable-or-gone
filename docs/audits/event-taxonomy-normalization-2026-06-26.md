# SOG event taxonomy normalization audit

Status: supporting audit  
Recorded: 2026-06-26  
Phase: 2 / PR 9  
Record checkpoint: 150 canonical events

## 1. Purpose

This audit records the separation of five concepts that older public pages mixed together:

```text
public event category
canonical event subtype
structured detail kind
lifecycle status effect
recovery or reversal state
```

Impact level remains a separate severity descriptor. None of these fields is a safety score, investment recommendation, or substitute for the event description and evidence.

## 2. Canonical coverage

```text
Canonical events:                    150
Event detail records:                150
Missing canonical event subtype:       0
Unmapped canonical event subtype:      0
Missing structured detail kind:        0
Unmapped lifecycle status effect:      0
Structured typed-detail records:     120
Description-and-source-only records:  30
```

Every event has an event-detail record. Thirty records intentionally remain descriptive records without a typed detail object; the public page marks those records explicitly instead of pretending that structured fields exist.

Generated diagnostics:

```text
data/generated/event-taxonomy-migration.json
data/generated/event-taxonomy-validation.json
```

Validation command:

```text
npm run validate:event-taxonomy
```

## 3. Approved public event categories

Each canonical event subtype maps to one reviewed public category.

| Public event category | Count |
|---|---:|
| Launch and introduction | 75 |
| Lifecycle review | 12 |
| Migration and rebrand | 12 |
| Governance and protocol change | 11 |
| Depeg and peg stress | 10 |
| Security and chain incident | 6 |
| Wind-down and termination | 6 |
| Regulatory action | 4 |
| Adoption and expansion | 3 |
| Recovery | 2 |
| Redemption change | 2 |
| Reserve change | 2 |
| Failure and collapse | 1 |
| Issuer control action | 1 |
| Market and liquidity support | 1 |
| Ownership change | 1 |
| Testing and pre-launch activity | 1 |
| Other material event | 0 |
| **Total** | **150** |

`other` remains available for future genuinely unclassifiable events, but no current canonical event is left in that category.

## 4. Canonical subtypes

The canonical event subtype remains the precise record-level value. Examples include:

```text
launch
mainnet_availability_report
major_depeg
regulatory_settlement
issuer_freeze
protocol_upgrade_announced
wind_down_and_final_redemption
status_review
```

The public category is used for browsing and comparison. It does not replace or rewrite the canonical subtype.

## 5. Lifecycle status-effect normalization

Twenty-five implementation values are grouped into ten public lifecycle-effect categories.

| Public lifecycle effect | Count |
|---|---:|
| Remained active | 77 |
| No lifecycle change | 38 |
| Restricted or impaired | 15 |
| Collapsed or failed | 10 |
| Entered wind-down | 3 |
| Historical context only | 2 |
| Migrated | 2 |
| Became inactive | 1 |
| Rebranded | 1 |
| Terminated | 1 |
| **Total** | **150** |

The canonical value remains visible on event detail pages. Values such as `active_current_v5`, `active_with_security_incident_context`, `failed_context`, and `version_transition_context` are not displayed as if they were user-facing lifecycle statuses.

## 6. Recovery normalization

| Recovery category | Count |
|---|---:|
| Not applicable | 135 |
| Not recovered | 9 |
| Collapsed | 3 |
| Recovered | 3 |
| Partially recovered | 0 |
| Unknown or unresolved | 0 |
| **Total** | **150** |

A missing legacy `recovered` boolean no longer appears as an unexplained blank. Non-depeg events are explicitly treated as `Not applicable`.

## 7. Structured detail coverage

Typed detail objects remain separate from the public event category. Current non-exclusive coverage is:

| Typed detail family | Records |
|---|---:|
| Launch detail | 57 |
| Migration detail | 26 |
| Depeg detail | 7 |
| Governance-change detail | 7 |
| Termination detail | 6 |
| Regulatory detail | 5 |
| Reserve-change detail | 5 |
| Redemption-change detail | 4 |
| Security-incident detail | 2 |
| Issuer-control detail | 1 |

The shared event-detail component renders all supported detail families and preserves every recorded field, including summaries, status, dates, affected deployments, related organizations, loss or exposure text, transaction references, and issuer-control metadata.

## 8. Public presentation changes

The normalized event taxonomy is now used by:

```text
event index filters
event index rows
event detail overview
event detail structured fields
stablecoin event timelines
organization event tables
JSON-LD event keywords and subjects
machine-readable public breakdowns
registry statistics
```

The event index uses public categories rather than exposing the full canonical subtype vocabulary as the primary filter.

The event detail page separately displays:

```text
Public event category
Canonical event subtype
Structured detail kind
Effect on stablecoin lifecycle
Canonical status-effect value
Recovery or reversal
Structured detail coverage
```

## 9. Machine-readable and statistics changes

The public machine-readable breakdown exposes:

```text
public_event_category
canonical_event_subtype
event_detail_kind
event_status_effect_category
event_recovery_category
```

Registry statistics expose:

```text
composition.public_event_categories
composition.canonical_event_subtypes
composition.event_detail_kinds
composition.event_status_effect_categories
composition.event_recovery_categories
composition.event_impact_levels
```

## 10. Mapping source

The reviewed mapping source is:

```text
config/event-taxonomy.mjs
```

Presentation helpers are provided by:

```text
src/utils/eventTaxonomy.ts
src/components/StablecoinEventTimeline.astro
src/components/StructuredEventDetail.astro
```

## 11. Validation guarantees

The validator rejects:

- missing or duplicate event/detail IDs;
- a canonical event without a matching detail record;
- unregistered event subtypes;
- unregistered lifecycle status-effect values;
- current canonical events falling into `other`;
- category, label, or sort-order collisions;
- restoration of the raw event-type filter;
- event lists that collapse category and subtype into one column;
- event detail pages that omit category, subtype, status effect, recovery, or structured coverage;
- stablecoin and organization timelines that bypass the normalized taxonomy;
- machine-readable and statistics output that omit the normalized event axes;
- mobile presentation that silently removes category, subtype, status effect, or recovery.

## 12. Non-scope

This work does not change:

- canonical event dates or descriptions;
- evidence reliability and provenance taxonomy;
- organization classification;
- deployment status;
- lifecycle or issuance status of stable assets;
- reference target or backing model assignments;
- canonical record counts;
- production deployment state.
