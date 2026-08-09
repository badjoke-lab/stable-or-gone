# Market Access Expansion Review Authority — 2026-08-09

Status: active review-only work-item specification  
Entry production commit: `8ba1ed2b4aff36aaa9545c6f3e3cdd113dbb5ed2`  
Implementation boundary: `REVIEW GATE`

## Purpose

Reconcile forward governance to the production-verified PR #534 closeout and perform a bounded source review for the next Market Access expansion candidate set without changing canonical or public data.

## Entry checkpoint

```text
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical files: 466
Stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Deployments: 186
Market Access Records: 12
Archive recorded / not recorded: 463 / 122
Detail routes / metadata checks: 422 / 422
```

`77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da` remains the historical PR #523 canonical-changing production checkpoint. `8ba1ed2b4aff36aaa9545c6f3e3cdd113dbb5ed2` is the current production-verified repository/closeout commit and does not change the canonical hash.

## Governing contracts

The review must preserve:

- `docs/market-access-record-spec.md`;
- `config/market-access-governance-v1.json`;
- one function per canonical Market Access Record;
- provider/service-scoped observations rather than country-wide inference;
- append-only time semantics for later state changes;
- canonical Evidence requirements for any future promotion;
- manual review and no automatic promotion.

## Review scope

```text
lane: Japan Market Access Expansion Review Batch 1
jurisdiction: JP / Japan
candidate limit: 3 asset x platform/service pairs
asset prerequisite: existing canonical asset identity
provider/service: source-led, not predetermined
functions:
- buy_sell
- deposit
- withdrawal
- external_wallet_transfer
```

Excluded from this review:

```text
direct_issuer_mint
direct_issuer_redemption
lending
staking
yield
```

## Required source review

For each candidate pair, record:

1. asset identity and canonical asset ID;
2. provider/platform and service scope;
3. jurisdiction scope;
4. each in-scope function and the strongest source-supported state;
5. effective date and observation date where supported;
6. network and customer scope where explicit;
7. provider/service primary URLs;
8. regulator or official-register URLs when registration/legal route is claimed;
9. issuer/protocol or reputable secondary sources only as supporting context;
10. existing canonical Evidence identity reuse eligibility;
11. duplicate source URL review;
12. unresolved or unsupported values that must remain unknown/out of scope.

## Promotion boundary

This specification authorizes no promotion.

```text
canonical changes: 0
new Market Access Records: 0
new Evidence: 0
new Evidence Relations: 0
new assets: 0
new organizations: 0
new events: 0
new deployments: 0
public route changes: 0
material UI changes: 0
```

If the review supports promotion, a later implementation-authority PR must bind the exact candidate pair(s), functions, states, effective dates, Evidence identities/URLs, maximum row deltas, count transitions, and required validators before canonical data may change.

## Acceptance criteria

The review authority is complete when:

1. forward governance reflects the current `8ba1ed2b...` production checkpoint and 585/585/12/463 counts;
2. historical PR #523/#534 closeout artifacts remain unchanged;
3. the active workstream validator binds this review-only authority;
4. at most three Japan candidate asset × platform/service pairs are selected from current sources or a no-go result is recorded;
5. source dispositions are function-scoped and do not exceed source scope;
6. unsupported values remain unknown or excluded;
7. no canonical/public mutation occurs;
8. CI is green;
9. exit is `REVIEW GATE`.

## Next boundary

A source-reviewed implementation proposal is not implementation authority. Canonical promotion requires a new separately reviewed and merged authority PR.
