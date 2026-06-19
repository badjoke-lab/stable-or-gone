# Launch-date Batch P Review

Updated: 2026-06-19

## Scope

This batch promotes the final two category-A launch dates from the 38-record review while preserving the 70-record canonical checkpoint.

| Asset | Canonical date | Launch boundary | Primary evidence |
|---|---:|---|---|
| sUSDS | 2024-09-18 | Sky Token and Product Launch activation | Sky governance launch proposal and approval trail |
| USDtb | 2024-12-16 | Ethena product launch | Ethena launch page plus Curve’s dated launch publication |

## Boundary decisions

- sUSDS is recorded as a product activation inside the continuing Maker/Sky lineage. The new launch event does not replace the separate current-model event and does not imply that sDAI ceased on the same date.
- USDtb updates the existing launch event rather than creating a duplicate. Ethena’s official page establishes the launch, while the dated Curve publication fixes the exact day.
- Neither date changes the canonical stable-asset count or creates a new issuer record.

## Deterministic result

```text
Stable assets:             70 unchanged
Events:                    96 → 97
Event details:             96 → 97
Evidence:                 284 → 286
Missing launch dates:      33 → 31
Critical findings:          0
Warnings:                   0
```

The branch migration regenerated registry statistics and the integrity audit, validated generated statistics, and completed the full repository build successfully before removing its one-time migration machinery.

The final normal PR validation also completed successfully across CI, Public consistency, Registry integrity, Registry stats, Registry v3 view, and Registry v3 income profiles.

## Next work

Launch-date unresolved queue freeze for the remaining category B, C, and D records.
