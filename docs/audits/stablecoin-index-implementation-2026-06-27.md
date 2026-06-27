# Stablecoin Index Implementation Audit

Date: 2026-06-27  
Phase: Phase 4 — Shared UI and registry indexes  
Plan unit: PR 24 — rebuild stablecoin index  
Implementation pull request: PR #196

## Result

Status: **PASS when all PR #196 workflows succeed**

The stablecoin index now implements the interaction, responsive, taxonomy, evidence, and comparison contracts approved in PRs 18–22.

## Canonical scope

```text
Stablecoin records: 92
Public route: /stablecoins/
Route changes: 0
Canonical record changes: 0
Stable assets added: 0
```

Desktop table rows, compact record cards, and comparison sources are generated from the same per-record object. The three presentation surfaces do not maintain separate factual values.

## Search

Search normalizes text with Unicode NFKC, case folding, trim, and whitespace collapse.

Approved searchable values:

```text
canonical name
symbol
slug
aliases
official domain when recorded
connected organization names
```

Fuzzy matching and external search services are not introduced.

## Multi-value filters

```text
lifecycle
issuance
asset_class
reference
backing
stabilization
```

All selected values are serialized into shareable query parameters. Empty values are omitted and unknown parameter values are ignored.

## Sort modes

```text
name_asc
name_desc
lifecycle_then_name
launch_oldest
launch_newest
evidence_most
```

Unknown launch dates sort last in both launch-date directions.

## URL and browser history

```text
Typing search: history.replaceState
Committed filter change: history.pushState
Sort change: history.pushState
Comparison selection: history.pushState
Back and Forward: restore search, filters, sort, and comparison
Parameter order: q, filters, sort, compare
```

Active filters are shown as individually removable controls. Clear all restores search, filters, and sort. A zero-result state provides its own clear action.

## Desktop and compact representations

The complete nine-column table remains server-rendered and available as a horizontal fallback:

```text
Name
Symbol
Primary display organization
Primary display role
Reference target
Backing model
Lifecycle
Issuance
Evidence
```

Compact screens receive a separate record-card representation preserving:

```text
name and symbol
lifecycle
issuance
reference
backing
asset class
primary organization
relationship count
organization count
evidence source count
known-unknown count
```

The stablecoin index is the first of 25 protected table kinds to receive a page-specific compact representation. Twenty-four transformations remain pending.

## Organization context

Primary display remains a navigation and summary choice only.

For records with multiple relationships, desktop rows and mobile cards show:

```text
additional relationship count
organization count
expandable all-connected-organizations summary
role summary
```

A primary organization never replaces the underlying relationship history.

## Evidence semantics

The index uses canonical evidence relations to calculate:

```text
unique public source identity count
evidence relation count
```

The list displays source identity count. The comparison panel displays both counts separately. Duplicate source relations do not become duplicate source identities.

## Stablecoin comparison

Comparison is stablecoin-only.

```text
Minimum meaningful comparison: 2 records
Maximum: 4 records
URL parameter: compare
Identity key: slug
```

Seven groups are rendered:

```text
identity and current state
reference, backing, and stabilization
reserve and redemption
organizations and control
deployments
event summary
evidence and known unknowns
```

Comparison excludes price, market capitalization, trading volume, TVL, APY, yield ranking, safety score, and investment rank. It is historical registry context, not a recommendation.

## Progressive enhancement

Without JavaScript, the server-rendered complete index remains available. JavaScript adds:

```text
search
multi-value filters
sorting
active-filter removal
clear all
URL synchronization
browser-history restoration
comparison
```

No external runtime search service or client-side canonical dataset is introduced.

## Validator migrations

Legacy validators previously looked for old single-select marker names. They were migrated while preserving their substantive checks:

```text
lifecycle / issuance: 92-record mapping and allowed pairs
reference target: 92-record mapping, internal-ID protection, machine-readable axes
backing / stabilization: 92 reviewed assignments, unknown count, machine-readable axes
primary display: deterministic selection and all-relationship reachability
mobile fields: protected field preservation
public consistency: canonical counts, links, metadata, sitemap, and data files
```

## Validation

Protected by:

```text
scripts/validate-stablecoin-index-implementation.mjs
scripts/collect-index-interaction-audit.mjs
scripts/validate-index-interaction-contract.mjs
scripts/collect-responsive-accessibility-audit.mjs
scripts/validate-responsive-accessibility-contract.mjs
scripts/verify-public-consistency.mjs
.github/workflows/stablecoin-index-implementation.yml
```

Expected totals:

```text
Filter groups: 6
Sort modes: 6
Protected table headers: 9
Material compact fields: 8 grouped field blocks
Comparison groups: 7
Implemented indexes: 1
Deferred indexes: 2
Implemented mobile representations: 1
Page transformations pending: 24
Route changes: 0
Canonical record changes: 0
```

## Scope boundary

PR #196 does not:

```text
rebuild the organization index
rebuild the event index
change stablecoin detail hierarchy
add stable assets
select Batch 18
change public routes
enable automatic production deployment
publish production
```

The next approved work is PR 25: rebuild the organization index and detail page.
