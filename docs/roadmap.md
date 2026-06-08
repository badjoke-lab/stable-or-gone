# Stable or Gone Roadmap

Updated: 2026-06-08

## Current stage

SOG v0 is publicly live at:

```txt
https://sog.badjoke-lab.com/
```

Current state references:

```txt
docs/current-spec.md
docs/pr-035-status-sync.md
```

## Current milestone

The 20-record baseline and original-record bottom-up passes are complete.

Expected post-PR-034 validation counts:

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

Latest deploy confirmation for PR-034 should be checked in Cloudflare before treating this as fully merged/public.

## Completed major work

```txt
foundation docs and data placeholders
Astro scaffold and Terminal Registry UI
public v0 foundation
issuer/event/report/evidence/redemption/regulatory/deployment UI
seed expansion to 20 stablecoin records
source-deepening for USDT / USDC / DAI / UST / BUSD
source-deepening for RLUSD / EURC / USDP / USDG / USDS
bottom-up pass for FRAX / TUSD / FDUSD / PYUSD / USDD
bottom-up pass for GUSD / LUSD / crvUSD / USDe / sUSD
registry filtering and sorting
guides and glossary
registry updates page
public SEO baseline
shared stablecoin detail view
validator and supplemental data integration
```

## Main remaining weakness

The event layer is too thin.

Current events:

```txt
USDC March 2023 depeg
UST May 2022 collapse
BUSD wind-down
```

SOG should now shift from entity/evidence thickening to event-density expansion.

## Next PR

```txt
PR-036 Event layer expansion pass 1
```

Target set:

```txt
USDT
USDC
DAI
UST
BUSD
```

Goal:

```txt
Increase event density for the original top records and make SOG read more like a historical lifecycle registry rather than only a stablecoin card catalog.
```

## Following PRs

```txt
PR-037 Event layer expansion pass 2: FRAX / TUSD / FDUSD / PYUSD / USDD
PR-038 Event layer expansion pass 3: GUSD / LUSD / crvUSD / USDe / sUSD
PR-039 Event UX strengthening
PR-040 Event expansion docs sync
PR-041 Next expansion decision
```

## Event targets

```txt
short-term: 15 events
v0.1: 30 events
later: 60+ events
```

## Operating rule

Do not add complex automation before the registry model, source handling, and review process are stable.
