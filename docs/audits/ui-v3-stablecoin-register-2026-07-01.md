# UI v3 Editorial Ledger Stablecoins register audit

Status: supporting audit  
Date: 2026-07-01  
Roadmap item: PR #264

## Purpose

Replace the Stablecoins index Modern Data Product composition with a bounded Editorial Ledger public register while preserving canonical records, public taxonomy, search, filters, comparison, compact information, routes, and machine-readable parity.

## Removed composition

```text
PageHero index marketing block
Decorative coin illustration
Four metric cards
Dark rounded filter panels
Nine-column dashboard table
Unbounded first-page rendering of all records
False empty-state display after populated results
```

## New register structure

Desktop columns:

```text
Stablecoin
Symbol
Reference
Status
Primary organization
Model
Updated / evidence
```

The reduced column count does not remove protected facts. Supporting lines and compact records preserve:

- canonical record ID;
- lifecycle and issuance separately;
- asset class;
- reference category;
- primary organization and role;
- additional relationship count and connected organizations;
- backing and stabilization;
- review date;
- source identity count;
- event count;
- known-unknown count.

## Bounded rendering

```text
Page size: 20
Page query parameter: page
Search/filter/sort reset: page 1
Browser back/forward: restores page and all other state
Server-rendered visible records: first 20
All canonical record rows, compact records, and links remain in HTML: yes
```

This prevents page height from growing linearly with the registry while preserving link parity, no-script access to record destinations, and deterministic client-side filtering.

## Search, filters, and sorts

Search fields remain:

```text
canonical name
symbol
slug
aliases
official domain
organization names
```

Approved filter groups remain:

```text
lifecycle
issuance
asset class
reference
backing
stabilization
```

Sort modes remain:

```text
name ascending
name descending
lifecycle then name
launch oldest
launch newest
most source identities
```

Search, filter, sort, page, and comparison state are URL-synchronized.

## Empty state correction

The no-results surface is hidden in the server output and client code uses:

```text
noResults.hidden = matchCount !== 0
```

It appears only when the complete matched result set is empty. A populated register no longer displays a contradictory empty-state message after its rows.

## Comparison

The existing bounded comparison remains available:

```text
minimum records: 2
maximum records: 4
query parameter: compare
identity key: stablecoin slug
ranking: prohibited
recommendation: prohibited
unknown-as-zero: prohibited
```

## Mobile and compact preservation

The desktop table retains its page-specific identity and deliberate comparison scrolling contract. At compact widths, it changes to page-specific records preserving:

```text
symbol and canonical name
lifecycle
issuance
reference
backing
asset class
primary organization
relationship count
source identities
known unknowns
events
last reviewed
```

The final cross-site mobile hardening remains scheduled for PR #269.

## Data and route preservation

```text
Canonical stable assets: 98
Canonical data changes: 0
Route additions: 0
Route removals: 0
Redirect additions: 0
Logo changes: 0
Machine-readable shape changes: 0
```

## Validation

```text
npm run validate:ui-v3-stablecoin-index
npm run prepare:index-interaction-contract
npm run validate:active-workstream
npm run check
npm run build
npm run verify:consistency
```

The historical `validate:ui-v2-stablecoin-index` command remains as a compatibility alias and now validates the active UI v3 register.

## Remaining work

The next active item is PR #265 Stablecoin dossier. The register does not pass Gate V3-C alone; stablecoin details, Organizations, and Events remain pending.
