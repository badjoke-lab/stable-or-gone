# Historical Terminal-date Review

Updated: 2026-06-19

## Scope

This review covers the four canonical records that are already classified as failed or rebranded but still have `discontinued_date: null`:

```text
BAC   Basis Cash
DSD   Dynamic Set Dollar
ESD   Empty Set Dollar
USDN  Neutrino USD
```

The purpose is to distinguish economic failure, protocol-version migration, public abandonment, token rebranding, and formal shutdown. A depeg or market collapse date is not automatically a canonical terminal date.

## Decision summary

```text
BAC   retain null — no first-party shutdown or cessation date recovered
DSD   retain null — April 2021 V2 activity is not a shutdown date
ESD   retain null — 2021-08-02 V2 migration start is not proven as final cessation
USDN  retain null — XTN transition is confirmed, but its effective date is not fixed by the recovered primary source
```

No canonical date is changed by this review.

## Review method

For each asset, the review separates:

- sustained peg failure
- last confirmed protocol-development activity
- migration or rebrand announcement
- migration availability
- minting or redemption termination
- frontend disappearance
- governance abandonment
- formal shutdown announcement
- final effective date

Dates are accepted only when a source supports the same lifecycle boundary represented by `discontinued_date`.

# BAC — Basis Cash

## Confirmed

The canonical record identifies BAC as a failed three-token seigniorage system involving BAC, Basis Bonds, and Basis Shares. The existing collapse event states that the system failed to restore durable dollar parity, but intentionally leaves `event_date` null.

Recovered first-party sources:

- protocol repository: https://github.com/Basis-Cash/basiscash-protocol
- documentation archive entry point: https://docs.basis.cash/
- historical project site: https://basis.cash/

These sources support identity and mechanism history. They do not provide a recovered formal shutdown date, minting-stop date, redemption-stop date, or governance-termination date.

## Rejected terminal-date shortcuts

Do not use:

- the first day BAC lost its peg
- the price chart's lowest point
- the last repository commit
- the last website capture
- the date market liquidity became negligible

None of those boundaries proves formal or practical protocol cessation by itself.

## Review result

```text
last confirmed operational date: unresolved
first confirmed non-operational date: unresolved
formal shutdown announcement: not recovered
canonical discontinued_date: null
confidence: medium
```

# DSD — Dynamic Set Dollar

## Confirmed

Existing first-party evidence includes:

- Dynamic Set Dollar FAQ, published 2020-12-14
- DSD V2 high-level specification, published 2021-02-04
- DSD V2 final specifications and voting material, published in April 2021
- official publication archive: https://dynamicsetdollar.medium.com/

The V2 material confirms continuing protocol design and governance activity in 2021. It does not establish that DSD ceased operation on the publication date, nor does it identify a final migration, shutdown, minting stop, or governance revocation.

## Rejected terminal-date shortcuts

Do not use:

- the publication date of the V2 final specification
- the first or worst sustained depeg date
- a version vote as the end of the previous version without an effective migration record
- the last Medium publication as an automatic shutdown date

## Review result

```text
last confirmed development activity: April 2021
last confirmed operational date: unresolved
first confirmed non-operational date: unresolved
formal shutdown announcement: not recovered
canonical discontinued_date: null
confidence: medium
```

# ESD — Empty Set Dollar

## Confirmed

Existing evidence establishes the original ESD design and later Empty Set V2 architecture. A first-party migration announcement dated 2021-08-02 states that the V2 protocol was live and that users could exchange ESD and Bonded ESD for ESS:

- https://medium.com/emptysetdollar/empty-set-v2-live-migrate-now-2a6fceb55d08

Other existing sources include the Empty Set V2 audit, official repository, and V2 audit announcement.

The 2021-08-02 announcement is a strong migration boundary. It is not automatically a final terminal date because it does not prove that all original ESD functions, contracts, claims, or user exit paths ceased on that day.

## Rejected terminal-date shortcuts

Do not use:

- the V2 audit date
- the V2 migration opening date as final cessation without an effective-end statement
- the first sustained ESD depeg date
- the launch of DSU or ESS as proof that every ESD function ended immediately

## Review result

```text
confirmed successor migration availability: 2021-08-02
last confirmed original-protocol activity: on or before 2021-08-02
first confirmed non-operational date: unresolved
formal shutdown announcement: not recovered
canonical discontinued_date: null
confidence: medium
```

# USDN — Neutrino USD

## Confirmed

The canonical record treats USDN as rebranded and no longer functioning as a hard-USD stablecoin identity. Existing first-party evidence includes:

- Neutrino Protocol FAQ for the original USDN model
- SURF recapitalization material dated 2022-08-08
- current Neutrino / XTN protocol page
- Neutrino's 2023-07-20 explanation that XTN was formerly known as USDN:
  https://medium.com/neutrinoteam/why-xtn-is-not-actually-burned-fc4716390ae1

The July 2023 source proves that the identity transition had occurred by then. It does not state the exact effective day when USDN stopped being classified as a dollar stablecoin and became Neutrino Index / XTN.

A January 2023 ecosystem article describes a proposed transition away from the stablecoin model, but it is not sufficient on its own to establish the canonical effective date.

## Rejected terminal-date shortcuts

Do not use:

- the April 2022 depeg
- the August 2022 persistent-depeg period
- the December 2022 severe price decline
- the date a transition proposal was discussed
- the 2023-07-20 retrospective article date as the effective rebrand date

These are different lifecycle boundaries.

## Review result

```text
last confirmed hard-USD impairment: 2022, exact terminal boundary unresolved
XTN identity confirmed no later than: 2023-07-20
formal effective rebrand date: not recovered
canonical discontinued_date: null
confidence: medium
```

# Review conclusion

All four records remain `discontinued_date: null` after review.

This is not an unexplained gap. Each record now has an explicit reason for remaining null:

```text
BAC   no shutdown or cessation source
DSD   continuing V2 activity without a final termination boundary
ESD   migration opening does not prove final cessation
USDN  rebrand confirmed without a recovered effective date
```

## Next work

Create a machine-readable terminal-date unresolved queue that records:

- strongest known terminal boundary
- last confirmed activity
- first confirmed inactive or successor state
- unresolved definition
- rejected shortcut dates
- future review target

The queue validator must require the four canonical null terminal dates to remain synchronized with the maintained review set.

## Deployment classification

No production deployment required. This review changes no canonical records, counts, routes, or generated public output and does not require Cloudflare access.
