# Registry 81 Quality Checkpoint

Recorded: 2026-06-23

## Source merges

```text
PR #97 — Add MainStreet msUSD impaired incident
PR #98 — Resolve four Category B launch dates
PR #99 — Resolve Mountain USDM and USDN terminal dates
PR #100 — Resolve FEI reserve context
Latest merge: 39131d5c6dfdeecbf9a6e3359b21df6237fa7bd0
```

## Canonical counts

```text
Stable assets: 81
Organizations: 70
Relationships: 83
Classifications: 81
Profiles: 81
Events: 111
Event v2 details: 111
Evidence: 339
Reserve/report context records: 89
Known unknowns: 195
Regulatory notes: 9
Deployments: 112
Legal profiles: 81
Stable-asset relationships: 4
Reserve components: 113
Income profiles: 81
```

## Quality state

```text
Critical findings: 0
Warnings: 0
Stale verification records: 0
Launch-date unresolved: 34
Terminal-date unresolved: 4
Reserve applicability queue: 12
Reserve not applicable by design: 10
Reserve source status unresolved: 2
Reserve expected but missing: 0
```

## Recent resolutions

Launch dates resolved:

- EURS — 2018-06-22
- Mountain Protocol USDM — 2023-09-11
- USD0 — 2024-07-09
- USR — 2024-09-04

Terminal dates resolved:

- Mountain Protocol USDM — 2025-08-22
- Neutrino USD / USDN — 2023-01-31

Reserve context resolved:

- FEI — executed TIP-121c historical redemption and complete 1:1 DAI-backing package

FEI current route availability, universal redemption completion, and completion of every residual PCV distribution remain known unknowns.

## Remaining priority queues

### Category B launch dates

- BRZ
- Berachain HONEY
- Avalon USDa
- Anzen USDz

### Terminal dates

- Basis Cash
- Dynamic Set Dollar
- Empty Set Dollar
- GYEN

### Reserve source status

- HUSD
- EURT

## Production state

No Cloudflare action or production deployment is recorded at this checkpoint. The public site remains behind the 81-record GitHub baseline until manual publication and production-parity verification can be completed.

## Next work

Re-audit the four remaining Category B launch-date records. Promote only day-level dates supported by primary evidence and retain unresolved values as `null` otherwise.
