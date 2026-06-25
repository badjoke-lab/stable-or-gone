# VAI implementation checkpoint

Recorded: 2026-06-25

Result: IMPLEMENTED — FINAL CI PENDING

Canonical results:

- `launch_date` is `2020-11-24`
- status remains `active`
- `discontinued_date` remains `null`
- the 2020-11-24 Venus mainnet and public VAI minting boundary is recorded
- the 2020-10-17 alpha-testnet pre-launch boundary is preserved
- exact contract deployment and first mint remain unresolved
- later stability-fee and Peg Stability Module changes remain separate lifecycle boundaries
- VAI is removed from the unresolved launch-date queue
- queue totals are 20 overall and 14 in Category C

Post-implementation counts:

```text
Stable assets:              82
Events:                     137
Event v2 details:           137
Evidence:                   407
Evidence relations:         407
Known unknowns:             202
Launch dates unresolved:     20
```

The next bounded launch review is VCHF after all six workflows pass and PR #150 merges.
