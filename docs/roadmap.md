# Stable or Gone Roadmap

Updated: 2026-08-05  
Status: PR #521 active Japan Market Access Pilot 3 JPYSC review

## Current production checkpoint

```text
Stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 584
Evidence Relations: 584
Reserve reports: 127
Known unknowns: 352
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 8
Archive recorded / not recorded: 462 / 122
Detail routes: 422
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Production commit: 196f8e20cd55c9b229c88127afa236dc5060b3fd
Canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 2
```

## Completed current-cycle work

```text
PR #514 — six-week cycle and Batch 5 audit authority
PR #515 — eight-proposal private audit
PR #516 — EUB/USB complete-record authority
PR #517 — EUB/USB complete canonical implementation
PR #518 — sibling-registry footer links
PR #519 — production closeout
PR #520 — JPYSC Pilot 3 review authority
```

## Current work

```text
PR #521 — JPYSC eligibility review only
```

PR #521 changes private reviewed artifacts and authority documentation only. Canonical and public data remain unchanged.

## Reviewed JPYSC result

```text
asset: JPYSC / sog_st_jpysc
canonical identity: present since PR #128
jurisdiction: JP / Japan
platform: SBI VC Trade
service: VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
```

JPYSC is canonical and available for account-internal purchase, sale, and conversion. The reviewed state does not establish deposit, withdrawal, external-wallet transfer, or current public-chain circulation.

PR #515's deferred JPYSC candidate was a duplicate growth proposal; it did not remove or invalidate the canonical identity created by PR #128.

Future capability remains future-only. JPYSC lending is outside Market Access Record v1 and is excluded.

## Eligibility decision

```text
eligible_for_later_separate_authority
```

The canonical asset prerequisite is satisfied and the four-function matrix is complete. PR #520 authorized review only, so PR #521 adds zero canonical assets, Evidence identities, Evidence Relations, Market Access Records, routes, and public changes. The Market Access count remains eight.

A later bounded authority may authorize exactly four provider-scoped JPYSC records and the count transition from 8 to 12. It must decide canonical Evidence reuse or additions for the current product and trading sources, preserve the reviewed function states, and require production convergence.

## Exit and next work

PR #521 exits only to `REVIEW GATE`.

The next recommended authority is:

```text
Japan Market Access Pilot 3 — JPYSC implementation
```

It is not implementation-authorized by PR #521.

Evidence Archive Payload Verification Batch 2 remains the later planned lane and also requires separate authority.

## Six-week cycle

```text
2026-08-03 to 2026-08-09  Record Growth Batch 5, navigation insertion, closeout, and Pilot 3 review
2026-08-05 onward          PR #521 review, then separate JPYSC implementation authority
2026-08-17 to 2026-08-23  Evidence Archive Payload Verification Batch 2, after separate authority
2026-08-24 to 2026-08-30  Tier A Dossier Deepening Batch 4, after separate authority
2026-08-31 to 2026-09-06  cycle review and backlog reconciliation
2026-09-07 to 2026-09-13  next operating authority and contingency
```

## Deferred candidates

```text
SoFiUSD / SOFID — exact deployments and current assurance evidence unresolved
USA₮ — exact deployments and product-specific holder terms unresolved
XREUR — announced circulation date is 2026-09-03
Swiss CHF sandbox — no final asset identity or market-launch decision
Hazel Network token design — infrastructure/testing without a final independent production asset
```

JPYSC is not a deferred canonical asset. Only its four Market Access records remain pending separate authority.

## Preserved exclusions

```text
duplicate JPYSC canonical asset
future capability represented as current access
lending represented as transfer evidence
country-wide availability inference
ranking, score, recommendation, or implied safety
large UI or navigation work
legacy redirect work
automatic promotion
```
