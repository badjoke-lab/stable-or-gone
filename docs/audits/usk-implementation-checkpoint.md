# USK implementation checkpoint

Recorded: 2026-06-25

Result: IMPLEMENTED — FINAL CI PENDING

Canonical results:

- `launch_date` is `2022-09-12`
- status remains `limited`
- `discontinued_date` remains `null`
- the 2025-06-30 wind-down and repayment-only state are recorded
- USK is removed from the unresolved launch-date queue
- queue totals are 21 overall and 15 in Category C

Post-implementation counts:

```text
Stable assets:              82
Events:                     136
Event v2 details:           136
Evidence:                   405
Evidence relations:         405
Known unknowns:             202
Launch dates unresolved:     21
```

The next bounded launch review is VAI after all six workflows pass and PR #148 merges.
