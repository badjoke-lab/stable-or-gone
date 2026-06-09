# Stable or Gone Roadmap

Updated: 2026-06-09

## Current stage

SOG v0 is publicly live at:

```txt
https://sog.badjoke-lab.com/
```

Current public baseline:

```txt
20 stablecoins
16 issuers
23 events
90 evidence records
40 reserve references
50 known unknowns
9 regulatory notes
37 deployments
75 static pages
```

PR-038 has a confirmed successful Cloudflare deployment. PR-039 event UX strengthening is implemented in the repository; its post-change Cloudflare deployment still needs explicit confirmation.

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
PR-036 event expansion pass 1
PR-037 event expansion pass 2
PR-038 event expansion pass 3
PR-039 event search / filters / sorting / counts
PR-040 docs and public update synchronization
```

## Event-layer progress

The event layer was the main weakness after the 20-record baseline.

Progress:

```txt
before expansion: 3 events
current: 23 events
short-term target of 15: completed
v0.1 target: 30+
later target: 60+
```

The registry now includes depeg, collapse, launch, protocol transition, regulatory, reserve-intervention, chain-halt, recovery, chain-expansion, and exchange-support lifecycle context.

The remaining problem is not only event count. Several records still need exact dated primary-source events instead of broad lifecycle placeholders.

## Current work item

```txt
PR-040 Event expansion docs / updates sync
```

Completed:

```txt
docs/current-spec.md synchronized to 23 events / 90 evidence / 75 pages
docs/roadmap.md synchronized to the event-expansion state
data/registry-updates.json updated for PR-036 to PR-039
docs/pr-040-status-sync.md added
```

## Next PR

```txt
PR-041 Event quality pass / 30-event target
```

Goal:

```txt
23 events → at least 30 reviewed events
replace or supplement broad lifecycle placeholders with exact-source events
increase useful timeline density without manufacturing weak events
```

Priority targets:

```txt
FRAX exact-source events
TUSD exact-source events
USDD depeg / market-stress exact-source event
GUSD attestation-history event
LUSD V1 / V2 / BOLD lifecycle separation
crvUSD exact launch / collateral events
USDe exact launch / reserve / risk event
sUSD V2 / V3 transition event
```

Source priority:

```txt
official dated announcement
regulator release
official protocol blog or documentation
official exchange notice
primary repository release
verified explorer / contract reference
```

Do not use a broad documentation homepage to assert an exact event date.

## Following PRs

```txt
PR-042 Comparison / reserve-history / issuer-deepening decision
PR-043 Selected feature implementation
```

PR-042 should compare the value and implementation cost of:

```txt
stablecoin comparison view
reserve-history view
issuer deepening
additional event-density work
```

The selected feature must strengthen the registry and evidence model rather than turn SOG into a market dashboard or safety score.

## Operating rules

- Continue implementation without waiting for every manual Cloudflare log check.
- Fix build failures immediately when logs are supplied.
- Keep `data/known-unknowns-pr034.json` until validator/import cleanup removes the dependency safely.
- Preserve nullable event fields where exact dates or recovery states are genuinely unresolved.
- Do not publish internal priorities, personal circumstances, revenue goals, or ChatGPT workflow details in public repository documents.
- Report each completed work unit with changed files, commits, resulting state, schedule position, and next PR.