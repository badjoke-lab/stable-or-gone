# Stable or Gone UI implementation plan v2

Updated: 2026-06-28  
Status: canonical implementation schedule

## Current position

```text
Completed through: PR #215
Current work: PR #216 visual mark correction
Next work: PR #217 all-route audit
Stable assets: 92
Organizations: 86
Relationships: 101
Events: 150
Record growth: paused
Production publication: deferred
```

## Rules

Every change starts from current `main`, preserves canonical data and protected information, runs the existing checks, and does not publish production during normal implementation work.

## PR #216 — visual mark correction

Stablecoin ticker marks remain the fallback where a reviewed local official logo is unavailable. Other record families use their names, dates, taxonomy, and state labels rather than circular letters. Summary cards use labels, values, and detail text. Home destination letters and non-stablecoin hero marks are removed from presentation. Functional filter counts use compact rounded rectangles.

The correction preserves routes, counts, filters, sorts, evidence, evidence relations, known unknowns, deployments, and production state. It does not complete Gate V2-F.

## PR #217 — 92-record and all-route audit

Required coverage:

```text
all 92 stablecoin routes
all 86 organization routes
all 150 event routes
all editorial and project routes
all machine-readable endpoints
desktop and compact page families
320px width
200 percent zoom
keyboard-only operation
reduced motion
forced colors
protected information parity
canonical counts and route/output parity
before/after and exception report
```

Gate V2-F passes after the audit. Gate V2-G requires explicit owner approval of one exact immutable candidate.

## Publication

After Gate V2-G, PR #218 or a publication report may publish the exact candidate through the manual workflow. Gate V2-H passes after deployed commit, route, count, desktop/mobile, and machine-readable parity verification.

## Growth

Routine record growth remains paused at 92 until Gate V2-F.
