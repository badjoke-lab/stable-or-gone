# Terminal-Date Checkpoint

Recorded: 2026-06-25

Result: ALL FOUR TERMINAL DATES REMAIN UNRESOLVED

## Policy

A canonical terminal date requires day-level evidence for a matching end boundary such as:

- formal shutdown
- final mint or issuance stop
- final redemption or migration deadline
- executed governance termination
- contract-level disablement
- final end of the old token identity

A depeg, negligible liquidity, last repository commit, migration opening, or market delisting is not used as the default terminal date.

## Basis Cash

```text
status: failed
terminal date: null
```

The original launch and V2 activation are documented, but no first-party shutdown, final mint stop, governance termination, redemption end, or contract-level end state was recovered. Continued ERC-20 transferability does not establish active protocol operation and does not provide a terminal boundary.

## Dynamic Set Dollar

```text
status: failed
terminal date: null
```

April 2021 V2 design and voting material confirms continued protocol work at that time. It does not establish that migration executed, issuance stopped, governance ended, or every original claim terminated on a particular day.

## Empty Set Dollar

```text
status: failed
terminal date: null
```

The 2021-08-02 Empty Set V2 migration opening is a successor-availability boundary. It does not prove final cessation of all ESD contracts, Bonded ESD claims, migration routes, or residual holder rights.

## GYEN

```text
status: discontinued
terminal date: null
```

GMO Trust's official wind-down notice establishes:

```text
2026-05-15 — orderly wind-down commenced and new purchases stopped
2026-11-11 — initial redemption period closes
```

The redemption period remains open on the review date. The wind-down start and purchase-disable date are not the final token termination date.

Source:

```text
https://medium.com/gmo-z-com-trust-company/wind-down-of-gyen-and-zusd-stablecoin-issuance-b6c32083470d
```

## Queue result

```text
Terminal-date unresolved: 4
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

No canonical terminal date changes are made.

## Reopen rules

- BAC: official shutdown, final mint or governance-disable record, or contract-level end state
- DSD: executed migration, formal shutdown, or governance termination
- ESD: final migration deadline, V1 disablement, or final claim termination
- GYEN: official final redemption or termination notice after the announced period

## Next phase

The bounded launch-date wave and cross-queue reserve and terminal checkpoints are complete. SOG may resume controlled record growth in reviewed batches of no more than five complete assets, followed by manual publication and parity verification.
