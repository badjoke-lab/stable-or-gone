# USK Launch and Wind-Down Review

Recorded: 2026-06-25

Result: LAUNCH RESOLVED; CURRENT WIND-DOWN UPDATE REQUIRED

Stablecoin: `sog_st_usk`

Current canonical launch date: `null`

Recommended canonical launch date: `2022-09-12`

Recommended current status: retain `limited`

Recommended discontinued date: `null`

## Question

USK has two separate lifecycle questions:

1. Which day represents its original public launch?
2. How should SOG describe its present state during the Kujira-to-Rujira transition?

The launch, debt-product restriction, repayment-only state, wind-down, successor lending product, and final terminal date must remain separate boundaries.

## Reviewed boundaries

| Boundary | Date | Evidence status | Canonical treatment |
| --- | --- | --- | --- |
| USK design and planned launch described | 2022-08-08 | Day-level first-party article | Announcement boundary |
| Minting and liquidation workflow described before launch | 2022-08-19 | Day-level first-party guide | Pre-launch product-readiness boundary |
| Pre-launch expectations article | 2022-09-10 | Day-level first-party article | Explicit pre-launch boundary |
| USK and ORCA launched publicly | 2022-09-12 | Day-level first-party launch statement | Canonical public launch |
| Rujira transition announces USK wind-down | 2025-06-30 | Day-level first-party statement | Wind-down announcement |
| New USK debt disabled; existing positions repayment-only | 2025-06-30 statement | First-party current-state statement | Limited / repayment-only state |
| Final USK termination or completed successor migration | Unresolved | No final terminal evidence | Keep discontinued_date null |

## Launch evidence

### 1. Announcement and design phase

Team Kujira published its USK mechanism and launch article on 2022-08-08. It described USK as an upcoming native Cosmos overcollateralized stablecoin and explained minting, collateral, liquidation, and ecosystem plans.

Source:

```text
https://medium.com/team-kujira/kujira-usk-stablecoin-launch-kickstarting-grown-up-defi-26b4372d7aef
```

This is an announcement and product-design boundary, not completed public launch.

### 2. Pre-launch product readiness

Team Kujira published a minting and ORCA guide on 2022-08-19 and a separate article titled “What to Expect When USK Launches” on 2022-09-10.

Sources:

```text
https://medium.com/team-kujira/testnet-usk-minting-orca-liquidation-bids-4f1215e9677b
https://medium.com/team-kujira/what-to-expect-when-usk-launches-42ae87929d2
```

The September 10 article uses future launch language and is therefore explicit evidence that the launch boundary had not yet occurred.

### 3. Public launch

Team Kujira's weekly roundup published on 2022-09-12 states that USK and ORCA launched that day. It describes USK as mintable and usable with the newly launched liquidation system.

Source:

```text
https://medium.com/team-kujira/weekly-roundup-by-team-kujira-ep-3-d9f63dafdf9
```

This is a first-party, day-level, explicit public-launch statement and satisfies the canonical threshold.

## Current-state evidence

### 1. Rujira transition and wind-down

Rujira's first-party merge announcement dated 2025-06-30 states that USK will wind down and that its interest rate will increase gradually to encourage repayment.

Source:

```text
https://medium.com/rujiranetwork/introduction-to-the-merge-f52a277a3c3c
```

### 2. Repayment-only state

The same announcement states that Kujira debt products, including USK minting, were set to repayment-only and that users could not take on new debt. It also states that the Kujira network would remain active for at least a year after the merge while applications continued operating.

This supports `limited`, not `active` and not yet `discontinued`.

### 3. Successor boundary

The wind-down was linked to availability of a Rujira lending alternative. That successor product is not the same token identity as USK and does not justify classifying USK as migrated without a completed token or liability migration record.

## Decision

Set USK's canonical `launch_date` to:

```text
2022-09-12
```

Retain current status as:

```text
limited
```

Keep `discontinued_date` as:

```text
null
```

Reason:

- September 12 is an explicit first-party same-day launch statement
- September 10 is explicitly pre-launch
- the 2025 Rujira announcement establishes an orderly wind-down and repayment-only state
- the network and applications were expected to continue during the transition
- no reviewed first-party evidence establishes a final USK terminal date
- a successor lending product is not automatically a token migration

## Implementation requirements

The follow-up canonical implementation must:

1. set USK `launch_date` to `2022-09-12`
2. retain `status: limited`
3. keep `discontinued_date: null`
4. add a dated launch event for 2022-09-12
5. add a dated wind-down / repayment-only event for 2025-06-30
6. add first-party launch, pre-launch, and wind-down evidence
7. update the existing limited-status event and current-state notes
8. update the USK known unknowns to distinguish final terminal date, debt repayment, and successor-product boundaries
9. remove USK from the unresolved launch queue
10. reduce the unresolved launch queue from 22 to 21 and Category C from 16 to 15
11. synchronize baselines, generated outputs, README, audits, and roadmap

## Scope boundary

This review does not claim that USK has already terminated. It records an active wind-down in which new debt is disabled and repayment remains available, while the final terminal and successor-liability boundaries remain unresolved.
