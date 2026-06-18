# Reserve time-context policy — 2026-06-19

SOG distinguishes dated reserve reports from continuing reserve-context records.

- A dated report uses `report_date` or `period_covered`.
- A continuously updated attestation index, transparency page, protocol dashboard, collateral model page, or historical model reference uses its own `as_of` or `last_verified_at` when present.
- When a continuing context record has no independent date field, its public verification context is inherited from the canonical parent stablecoin's `last_verified_at`.
- The inherited date is a verification date, not a claimed publication or report date.
- Known unknowns use `last_checked_at`; regulatory notes use `note_date`; generated outputs use `generated_at`.

The public-surface validator resolves this hierarchy before checking all 72 reserve-report or reserve-context records. It does not invent report dates or rewrite canonical JSON.
