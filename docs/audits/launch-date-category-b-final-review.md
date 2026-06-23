# Launch-date Category B Final Review

Recorded: 2026-06-23

## Scope

This review re-audits the four remaining Category B launch-date records under the day-level primary-evidence policy:

- BRZ
- Berachain HONEY
- Avalon USDa
- Anzen USDz

## Result

```text
Resolved: 1
Retained unresolved: 3
Launch-date queue: 34 → 33
Category B: 4 → 3
```

## Avalon USDa — resolved

Avalon Labs published the first-party article `Introducing USDa: Bitcoin-Powered Stablecoin` on 2024-11-07. The article introduces USDa as Avalon's flagship CDP stablecoin and presents supported DEX and Avalon swap routes. This is treated as a public product-launch boundary rather than a future-only announcement.

Canonical launch date:

```text
2024-11-07
```

## BRZ — retained unresolved

Current first-party Transfero material states that BRZ launched in 2019. Reviewed Transfero-owned historical material also refers to BRZ after launch during November 2019, but no primary day-level launch statement was recovered.

Decision: retain `launch_date: null` with best-known range `2019`.

## Berachain HONEY — retained unresolved

Official Berachain documentation establishes HONEY as a native mainnet stablecoin, and the dated Honeypaper places the product in the February 2025 mainnet context. The review did not recover a HONEY-specific day-level public launch statement that safely separates protocol documentation, network genesis, contract availability, and public mint/redemption activation.

Decision: retain `launch_date: null` with best-known range `2025`.

## Anzen USDz — retained unresolved

Official Anzen material states that USDz launched in June 2024. Current guides contain embedded recordings dated in May 2024, but those recordings do not prove the canonical day on which the product became publicly available. A retrospective month-level statement is not coerced into a day-level date.

Decision: retain `launch_date: null` with best-known range `2024-06`.

## Policy upheld

- no exchange listing is used as the default launch boundary
- no month or year is coerced into a day
- network launch is not automatically substituted for an asset-specific launch
- dated documentation is not treated as a launch date unless it proves public product activation

## Production status

No Cloudflare action or production deployment is performed.
