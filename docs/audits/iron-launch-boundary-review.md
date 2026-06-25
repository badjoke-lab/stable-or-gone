# IRON Launch-Boundary Review

Recorded: 2026-06-25

Result: IMPLEMENTED — LAUNCH RESOLVED AND LINEAGE BOUNDARIES SEPARATED

Stablecoin: `sog_st_iron`

Current canonical state:

```text
launch_date: 2021-03-06
status: failed
discontinued_date: 2021-06-16
```

## Reviewed boundaries

| Boundary | Date | Canonical treatment |
| --- | --- | --- |
| Original IRON protocol launch on Binance Smart Chain | 2021-03-06 | Canonical entity-level public launch |
| Polygon deployment with separate IRON and TITAN tokens | 2021-05-18 | Later chain deployment |
| Polygon IRON bank run and TITAN collapse | 2021-06-16 | Terminal failure of the original partially collateralized system |
| Rebuilding announcement and complete stablecoin redesign | June 2021 | Post-collapse successor-development boundary |
| IRON v2 launch | 2021-08-25 | Later redesigned product boundary; not recovery of the original failed deployment by default |

## Evidence

Iron Finance's first-party BSC launch article states that the IRON protocol was scheduled to launch on 2021-03-06 at 11:00 UTC. It describes public minting, redemption, liquidity pools, and a three-phase rollout beginning with full collateralization.

```text
https://ironfinance.medium.com/iron-the-first-partial-collateralized-stablecoin-on-binance-smart-chain-8c22c426cace
```

Iron Finance's Polygon expansion announcement states that Polygon would go live on 2021-05-18 and explicitly says Iron Finance first launched on BSC. It also states that Polygon used a separate IRON token set rather than bridging the BSC tokens.

```text
https://ironfinance.medium.com/iron-finance-expansion-to-polygon-8a714ba5635e
```

The official post-mortem records the June 2021 failure of the Polygon IRON and TITAN system. Later rebuilding material states that the core stablecoin would be redesigned from scratch. The August 2021 launch article describes IRON v2 as a new overcollateralized design using ICE and IronLend.

```text
https://ironfinance.medium.com/iron-finance-post-mortem-17-june-2021-6a4e9ccf23f5
https://ironfinance.medium.com/iron-finance-rebuilding-3f16be5cab8b
https://ironfinance.medium.com/iron-stablecoin-launch-606941fff49f
```

## Decision

Set the canonical entity-level `launch_date` to:

```text
2021-03-06
```

Reason:

- the source is first-party and day-level
- it describes the original public protocol launch and user functionality
- the Polygon launch is explicitly described as an expansion from the existing BSC protocol
- BSC and Polygon used separate chain deployments but remain part of the same original IRON product lineage in the current entity model
- the June failure and August v2 relaunch must not be substituted for the original launch

## Implementation result

1. Set IRON `launch_date` to `2021-03-06`.
2. Retain `status: failed` and `discontinued_date: 2021-06-16`.
3. Add a dated BSC launch event and launch detail.
4. Add a dated Polygon deployment event for 2021-05-18.
5. Add first-party BSC launch and Polygon expansion evidence.
6. Keep the existing June 16 collapse event.
7. Preserve IRON v2 as a post-collapse redesigned-product boundary rather than evidence of recovery.
8. Add or update known unknowns for the BSC contract, exact first mint, Polygon deployment identity, and v1/v2 continuity.
9. Remove IRON from the unresolved launch queue.
10. Reduce the queue from 19 to 18 and Category C from 13 to 12.
11. Synchronize baselines, generated outputs, README, audits, and roadmap.

## Scope boundary

This review resolves the first public launch of the current historical entity. It does not assert that the BSC and Polygon contracts were the same token, and it does not merge the later IRON v2 economic design into the failed v1 deployment without a separate lineage review.
