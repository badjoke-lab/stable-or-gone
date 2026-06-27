# Stablecoin Identity and Current State Implementation

Date: 2026-06-27  
Plan unit: PR 27  
Implementation pull request: PR #200

Implemented scope:

```text
Dossier hero: record summary
Local navigation destinations: 8
Identity/current-state fields: 9
Compact stablecoin-overview representation: implemented
Implemented mobile representations after merge: 11
Pending protected table transformations: 14
Route changes: 0
Canonical record changes: 0
```

The identity section owns canonical name, symbol, asset class, lifecycle status, issuance status, record ID, route slug, confidence, and last-reviewed state.

Hero metrics remain summaries and do not replace detailed fields. Lifecycle and issuance belong to identity/current state; event count belongs to history; source count belongs to evidence.

Reference, backing, stabilization, redemption, valuation, yield, classification, governance, and primary-display fields remain visible in explicit preview blocks until PRs 28 and 29 complete their final hierarchy.
