# PR-035 Status Sync

Updated: 2026-06-08

## Current milestone

SOG has completed the 20-record baseline and bottom-up pass for the original shallow records.

Expected validation counts after PR-034:

```txt
20 stablecoin records
16 issuer records
3 event records
80 evidence records
40 reserve references
55 known unknowns
9 regulatory notes
37 deployments
```

Cloudflare deploy confirmation for PR-034 is still pending unless a newer build log is provided.

## Completed bottom-up passes

```txt
PR-033: FRAX / TUSD / FDUSD / PYUSD / USDD
PR-034: GUSD / LUSD / crvUSD / USDe / sUSD
```

Each pass added or connected:

```txt
evidence references
reserve or protocol references
known unknowns
stablecoin body overrides
detail-page display integration
validator integration
```

## Main remaining weakness

The event layer is still thin.

Current events:

```txt
USDC March 2023 depeg
UST May 2022 collapse
BUSD wind-down
```

This means SOG has enough entity/evidence/uncertainty structure, but not enough lifecycle events to look like a full historical event registry.

## Next phase

```txt
PR-036: Event layer expansion pass 1 — USDT / USDC / DAI / UST / BUSD
PR-037: Event layer expansion pass 2 — FRAX / TUSD / FDUSD / PYUSD / USDD
PR-038: Event layer expansion pass 3 — GUSD / LUSD / crvUSD / USDe / sUSD
PR-039: Event UX strengthening
PR-040: Event expansion docs sync
```

Target:

```txt
short-term: 15 events
v0.1: 30 events
later: 60+ events
```
