# Organization Index and Detail Implementation Audit

Date: 2026-06-27  
Phase: Phase 4 — Shared UI and registry indexes  
Plan unit: PR 25 — rebuild organization index and detail  
Implementation pull request: PR #197

## Result

Status: **PASS when all PR #197 workflows succeed**

The public term remains **Organizations**. Existing `/issuers/` and `/issuer/{slug}/` routes remain unchanged for compatibility. Route names are not treated as record semantics.

## Canonical scope

```text
Organizations: 86
Organization relationships: 101
Index route: /issuers/
Detail route family: /issuer/{slug}/
Route changes: 0
Canonical record changes: 0
```

## Organization index

Search covers:

```text
canonical name
slug
aliases
jurisdiction
connected stablecoin names
functional roles
```

Five multi-value filters are implemented:

```text
category
regulatory character
jurisdiction
functional role
relationship state
```

Five sort modes are implemented:

```text
name A–Z
name Z–A
most connected assets
most relationships
most public source identities
```

Search, filters, and sort are synchronized with shareable URL parameters. Typing uses `history.replaceState`; committed changes use `history.pushState`; Back and Forward restore the same state.

The index provides active-filter removal, Clear all, result counts, and zero-result recovery.

## Desktop and compact index representations

The complete eight-column table remains server-rendered:

```text
Organization
Organization category
Regulatory character
Jurisdiction
Functional roles
Relationship state
Connected assets
Evidence
```

Compact cards preserve:

```text
category
jurisdiction
regulatory character
functional roles
relationship states
connected asset count
relationship count
source identity count
record confidence
connected stablecoin names
```

Organization records do not receive a generic side-by-side scorecard. Their heterogeneous legal and functional roles make such a comparison misleading.

## Organization detail

The rebuilt detail page contains:

```text
overview
stablecoin relationships
events
evidence
known unknowns
corrections and further reading
```

Overview keeps separate:

```text
public organization category
canonical organization type
legal form and legal-form state
regulatory character
jurisdiction scope
functional roles
current and historical relationship counts
primary display relationship count
record confidence
last verified date
official site
```

## Relationship semantics

Primary display remains a navigation and summary choice only.

Every relationship preserves:

```text
stablecoin identity
functional role
relationship state
start date
end date
primary-display or additional-relationship state
```

Current and historical relationships remain distinguishable. A primary-display relationship never replaces the full relationship list.

## Events and evidence

Organization events include direct organization subjects and issuer-linked events. Event date, category, stablecoin subjects, and source count remain visible.

Evidence is deduplicated to public source identities through canonical evidence relations. The detail page retains publisher, publication date, reliability, archive availability, and relation count.

## Responsive transformations

PR #197 completes five additional protected table transformations:

```text
organization-index
organization-overview
organization-relationships
organization-events
organization-sources
```

Together with the stablecoin index, six of 25 protected table kinds now have page-specific compact representations. Nineteen remain pending.

The complete tables remain available as horizontal fallbacks.

## Validation

Protected by:

```text
scripts/validate-organization-index-detail-implementation.mjs
scripts/collect-index-interaction-audit.mjs
scripts/validate-index-interaction-contract.mjs
scripts/collect-responsive-accessibility-audit.mjs
scripts/validate-responsive-accessibility-contract.mjs
scripts/validate-organization-taxonomy-normalization.mjs
scripts/validate-primary-display-public-surfaces.mjs
scripts/verify-public-consistency.mjs
.github/workflows/organization-index-detail-implementation.yml
```

Expected totals:

```text
Filter groups: 5
Sort modes: 5
Index table headers: 8
Index compact field groups: 8
Detail sections: 6
Detail table kinds: 4
Detail compact representations: 4
Implemented indexes: 2
Deferred indexes: 1
Implemented mobile representations: 6
Page transformations pending: 19
Route changes: 0
Canonical record changes: 0
```

## Scope boundary

PR #197 does not:

```text
implement a generic organization comparison scorecard
rebuild the event index or event detail
change stablecoin dossier hierarchy
add stable assets
select Batch 18
change public routes
enable automatic production deployment
publish production
```

The next approved work is PR 26: rebuild the event index and detail page.
