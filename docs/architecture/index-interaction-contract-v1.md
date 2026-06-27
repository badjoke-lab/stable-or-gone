# Stable or Gone Index Interaction Contract v1

Status: approved information-architecture specification  
Phase: Phase 3  
Plan unit: PR 19 — finalize list, search, filter, sort, and comparison behavior  
Implementation boundary: specification and validation only. Stablecoin, organization, and event index implementation begins in PRs 24–26.

## 1. Purpose

SOG has three different registry indexes:

```text
Stablecoins     /stablecoins/
Organizations   /issuers/
Events          /events/
```

They share interaction rules, but they do not share one generic record model. Search fields, filter axes, sort orders, mobile rows, and comparison behavior are defined separately for each index.

## 2. Current implementation audit

The current pages already provide server-rendered rows, one search input, select filters, sorting, result counts, an announced result summary, and a zero-result row.

```text
Index            Search inputs   Select controls   Table columns
Stablecoins      1               6                 9
Organizations    1               6                 8
Events           1               4                 8
```

The current implementation does not yet provide:

```text
shareable URL state
browser back/forward restoration
per-filter clear controls
clear-all behavior
stablecoin comparison
```

These are recorded as implementation gaps, not treated as PR 19 failures. PR 19 approves the target contract; PRs 24–26 implement it.

## 3. Shared interaction rules

All three indexes must:

- render an unfiltered record list without JavaScript;
- enhance the server-rendered list rather than replacing it with an external search service;
- use `q` as the search query parameter;
- use explicit canonical or public-taxonomy filter values;
- support multiple selected values per approved filter;
- serialize multiple values with commas;
- omit empty parameters;
- ignore unknown parameter values instead of inventing new categories;
- restore the same state from a shared URL;
- restore state through browser Back and Forward;
- use history replacement while typing and history push for committed filter changes;
- show result count, active-filter summary, per-filter removal, and Clear all;
- provide a zero-result state with a direct clear action;
- remain keyboard-operable and avoid pointer-only controls;
- preserve material mobile-row information;
- keep multi-role and multi-organization summaries even when a primary display relationship exists.

## 4. Search normalization

Search uses:

```text
Unicode NFKC normalization
case folding
leading and trailing trim
internal whitespace collapse
```

Fuzzy matching is not approved in this phase. Search is deterministic substring matching across the named public fields.

## 5. Stablecoin index

### Search fields

```text
canonical_name
symbol
slug
aliases
official_domain
organization_names
```

### Filters

| Parameter | Source axis | Values |
|---|---|---|
| `lifecycle` | `lifecycle_status` | public taxonomy |
| `issuance` | `issuance_status` | public taxonomy |
| `asset_class` | `asset_class` | canonical data |
| `reference` | `reference_comparison_category` | public taxonomy |
| `backing` | `public_model_category` | public taxonomy |
| `stabilization` | `stabilization_mechanism` | public taxonomy |

The old single Organization selector is not part of the final filter contract. Organization names remain searchable, and multi-organization context remains visible in rows. A later implementation may add an organization filter only through a dedicated contract change with stable IDs and URL behavior.

### Sorts

```text
name_asc
name_desc
lifecycle_then_name
launch_oldest
launch_newest
evidence_most
```

Unknown launch dates sort last in both launch-date directions. Unknown is not converted to zero or an artificial date.

### Mobile row fields

```text
canonical_name
symbol
lifecycle_status
issuance_status
reference_comparison_category
public_model_category
primary_display_organization
organization_relationship_count
public_source_identity_count
known_unknown_count
```

The primary organization is a compact summary only. The relationship count signals additional current or historical relationships.

## 6. Stablecoin comparison

Comparison is enabled only for stablecoins.

```text
Minimum records: 2
Maximum records: 4
URL parameter:   compare
Identity key:    slug
```

Comparison groups:

```text
identity and current state
reference, backing, and stabilization
reserve and redemption
organizations and control
deployments
event summary
evidence and known unknowns
```

Comparison must preserve value states. Unknown, not recorded, not public, unverified, disputed, approximate, and not applicable remain distinct.

Comparison excludes:

```text
price
market cap
trading volume
TVL
APY
yield ranking
safety score
investment rank
```

Comparison is not a ranking or recommendation. Source identity counts and evidence relation counts remain separate. Current and historical values remain separate.

## 7. Organization index

### Search fields

```text
canonical_name
slug
aliases
jurisdiction
related_stablecoin_names
functional_roles
```

### Filters

| Parameter | Source axis | Values |
|---|---|---|
| `category` | `public_organization_category` | public taxonomy |
| `regulatory` | `regulatory_character` | public taxonomy |
| `jurisdiction` | `jurisdiction_scope` | public taxonomy |
| `role` | `functional_role` | canonical data |
| `relationship_status` | `relationship_status` | canonical data |

### Sorts

```text
name_asc
name_desc
assets_most
relationships_most
evidence_most
```

### Mobile row fields

```text
canonical_name
public_organization_category
jurisdiction_scope
functional_roles
relationship_statuses
related_stablecoin_count
relationship_count
public_source_identity_count
```

Generic side-by-side comparison is disabled. Organization records can have different legal and functional roles, so a common scorecard would imply false equivalence. Search, filters, counts, and explicit role summaries provide the comparison mechanism.

## 8. Event index

### Search fields

```text
title
description
event_id
stablecoin_names
organization_names
publisher_names
```

### Filters

| Parameter | Source axis | Values |
|---|---|---|
| `category` | `public_event_category` | public taxonomy |
| `subtype` | `canonical_event_subtype` | canonical data |
| `status_effect` | `event_status_effect_category` | public taxonomy |
| `recovery` | `event_recovery_category` | public taxonomy |
| `year` | `event_year` | canonical data |

The final contract replaces the old Impact filter with precise status-effect and subtype filters. Impact may remain visible as record content, but it is not an approved core filter because it does not replace event category, subtype, status effect, or recovery.

### Sorts

```text
date_desc
date_asc
title_asc
evidence_most
```

Unknown event dates sort last.

### Mobile row fields

```text
event_date
title
public_event_category
canonical_event_subtype
subject_names
event_status_effect_category
event_recovery_category
public_source_identity_count
```

Generic side-by-side comparison is disabled. Events are chronological records with different scopes and subjects. Shared taxonomy and filters provide structured comparison without a scorecard.

## 9. URL contract

Examples:

```text
/stablecoins/?q=dollar&lifecycle=active,limited&backing=fiat_backed&sort=name_asc
/issuers/?role=legal_issuer,reserve_manager&relationship_status=active&sort=assets_most
/events/?category=depeg,collapse&year=2022,2023&sort=date_desc
/stablecoins/?compare=usdt,usdc,dai
```

Parameter order is not semantically meaningful. Implementations should emit a stable order for readable shared URLs.

## 10. Accessibility and progressive enhancement

- The unfiltered list remains present in server-rendered HTML.
- Search and filter controls have programmatic labels.
- Result changes are announced without moving focus unexpectedly.
- Active filters are operable by keyboard.
- Clear controls identify the filter they remove.
- Comparison selection is not conveyed by color alone.
- Mobile operation does not depend on horizontal scrolling alone.
- JavaScript failure leaves a usable unfiltered index.

## 11. Machine validation

Authoritative configuration:

```text
config/index-interaction-contract.mjs
```

Generated diagnostics:

```text
data/generated/index-interaction-audit.json
data/generated/index-interaction-validation.json
```

Protected source pages:

```text
src/pages/stablecoins/index.astro
src/pages/issuers/index.astro
src/pages/events/index.astro
```

The validator requires:

```text
3 index contracts
18 explicit search fields
16 multi-value filters
15 sort modes
26 material mobile-row fields
1 comparison-enabled index
2 explicitly comparison-disabled indexes
0 route changes
```

It also records the current missing URL state, browser-history restoration, clear-all behavior, and stablecoin comparison as future implementation work.

## 12. Implementation boundary

```text
PR 19: specification and validation only
PR 24: stablecoin index and comparison implementation
PR 25: organization index implementation
PR 26: event index implementation
Route changes: none
Production deployment: none
```

The next approved work after PR 19 is PR 20: define meaningful public change history.
