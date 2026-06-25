# mUSD Launch-Boundary Review

Recorded: 2026-06-25

Result: PUBLIC LAUNCH DATE REMAINS UNRESOLVED

Stablecoin: `sog_st_musd`

Current canonical launch date: `null`

Recommended canonical launch date: `null`

Best-known public-launch candidate: `2020-05-29`

## Question

mStable USD entered production through several closely spaced but distinct boundaries:

- Ethereum contract deployment and verification
- mainnet availability
- first permissionless mint, swap, and redemption access
- production-security coverage
- Save-product activation
- later basket, contract, and Polygon changes

This review determines whether one day-level boundary can safely represent the original public launch of the continuing mUSD asset.

## Reviewed boundaries

| Boundary | Date | Evidence status | Canonical treatment |
| --- | --- | --- | --- |
| Ethereum mUSD contract source verified | 2020-05-28 | Day-level on-chain explorer evidence | Deployment-readiness boundary |
| Contemporaneous mainnet-live record | 2020-05-29 | Day-level contemporaneous link record; original outbound source not recovered | Best-known public-launch candidate, insufficient for canonical date |
| Secondary historical launch reference | 2020-05-29 | Independent secondary source | Supports candidate date only |
| First protocol version reported on Ethereum mainnet | 2020-06-01 | Dated secondary report | Confirms operation by this date |
| Official production-security program covers core functions | 2020-06-05 | Day-level official documentation | Confirms production functionality by this date |
| Save / imUSD product activation | July 2020 | Separate product boundary | Not the original mUSD launch |

## Decision

Keep mUSD's canonical `launch_date` as `null`.

The 2020-05-29 mainnet-live record is the strongest recovered candidate, but its original first-party outbound announcement was not recovered. The repository requires day-level primary or on-chain public evidence before assigning a canonical date.

## Follow-up implementation

1. Preserve the official Ethereum mUSD address.
2. Record 2020-05-28 as a verified deployment-readiness boundary.
3. Preserve 2020-05-29 as the best-known launch candidate without coercing it into `launch_date`.
4. Add a medium-confidence mainnet-availability event.
5. Add the official 2020-06-05 production-security boundary.
6. Keep Save and imUSD separate from the base mUSD launch.
7. Add a launch-specific known unknown.
8. Keep mUSD in the unresolved launch queue.
9. Keep the total queue at 22 and Category C at 16.
