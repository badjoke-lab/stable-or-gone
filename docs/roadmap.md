# Stable or Gone Roadmap

Updated: 2026-06-07

## Current stage

SOG v0 is publicly live at:

```txt
https://sog.badjoke-lab.com/
```

The current detailed state is maintained in:

```txt
docs/current-spec.md
docs/pr-032-status-sync.md
```

## Current milestone

```txt
20 stablecoin records
16 issuer records
3 event records
59 evidence records
30 reserve references
45 known unknowns
9 regulatory notes
31 deployments
```

Latest confirmed deploy:

```txt
validate:data passed
astro check passed with 0 errors and 0 warnings
astro build generated 55 pages
Cloudflare Pages deploy succeeded
```

## Completed major work

```txt
foundation docs and data placeholders
Astro scaffold and Terminal Registry UI
public v0 foundation
issuer/event/report/evidence/redemption/regulatory/deployment UI
seed expansion to 20 stablecoin records
source-deepening for USDT / USDC / DAI / UST / BUSD
source-deepening for RLUSD / EURC / USDP / USDG / USDS
registry filtering and sorting
guides and glossary
registry updates page
public SEO baseline
shared stablecoin detail view
validator and supplemental data integration
docs and status sync
```

## Next PR

```txt
PR-033 Original seed record bottom-up pass 1
```

Target set:

```txt
FRAX
TUSD
FDUSD
PYUSD
USDD
```

Goal:

```txt
Strengthen the shallow middle layer by adding official evidence, reserve/transparency references, deployment notes, known unknowns, and stablecoin body updates where needed.
```

## Following PRs

```txt
PR-034 Original seed record bottom-up pass 2: GUSD / LUSD / crvUSD / USDe / sUSD
PR-035 Registry updates and docs sync
PR-036 Comparison or reference page decision
```

## Operating rule

Do not add complex automation before the registry model, source handling, and review process are stable.
