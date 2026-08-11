# Post-PR #549 Russia USDT Regulation Guide Closeout Specification

Status: active closeout specification  
Recorded: 2026-08-12

## Goal

Close the bounded Russia USDT Regulation Guide public-content lane after verified production publication, preserve canonical state exactly, and restore Evidence Archive Payload Verification Batch 2 to `REVIEW_GATE`.

## Required lineage

```text
Authority PR: 548
Implementation PR: 549
Authority merge: 04349e7960512c865866d4f3e036b3a9f1ae9c6a
Implementation/main merge: f99d9583105587625a409b959ac928de44248e7b
Production run: 31504346502 success
Production job: 93822011080 success
Deployment history issue: 479
Deployment report step: success
```

## Accepted implementation scope

Exactly these existing public files were authorized for the Guide implementation:

```text
src/pages/guides/russia-stablecoin-rules-2026/index.astro
src/pages/guides/global-stablecoin-regulation-2026/index.astro
src/data/guideCatalog.ts
```

No material UI/CSS change occurred, so a new screenshot acceptance lane is not required by this closeout. Existing build, metadata, official-origin, route, and production-verification gates remain binding.

## Canonical invariants

```text
Stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked routes: 422
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Last canonical-changing commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
```

Any deviation fails closeout.

## Russia Guide closure rules

The accepted public wording must retain all of the following semantics:

- the Russia Guide is current through 2026-08-11;
- enacted-framework statements and implementation/draft-rule statements remain distinguishable;
- the BTC/ETH/USDT point remains source-qualified rather than a permanent statutory whitelist;
- country-level legal permission does not prove provider-level USDT availability;
- domestic cryptocurrency payment prohibition remains distinct from trading/investment and cross-border contexts;
- Watcher.Guru remains discovery-only and is not a public legal source or canonical Evidence.

PR #548/#549 become historical authority/implementation lineage after this closeout. They do not authorize continued Guide editing.

## Restored Evidence Archive boundary

Evidence Archive Payload Verification Batch 2 is restored to:

```text
stage: REVIEW_GATE
reviewed: 10
dated exact archive proposals: 8
reviewed no-safe-change: 2
canonical archive additions authorized: 0
separate implementation authority required: true
automatic promotion: false
```

Any canonical archive promotion requires a separate reviewed and merged implementation authority binding the exact eight Evidence identities and dated archive URLs. This closeout must not change canonical `archived_url`, Evidence identity, Evidence Relations, Market Access, assets, schema, taxonomy, public routes, ranking, scoring, or recommendations.

## Validation requirements

The active-workstream validator must verify:

1. closeout lineage and production run IDs;
2. canonical checkpoint counts/hash/file count against the current checkpoint;
3. the completed Batch 2 review artifact still contains 10 decisions, 8 dated proposals, and 2 no-safe-change outcomes;
4. forward governance identifies Evidence Archive Payload Verification Batch 2 at `REVIEW_GATE`;
5. forward governance records PR #548/#549 and production run `31504346502` as completed lineage;
6. the active validator points to this closeout;
7. no automatic canonical continuation is authorized.

Exit: `REVIEW_GATE`.
