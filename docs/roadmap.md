# Stable or Gone Roadmap

Updated: 2026-06-28
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #223
Active: PR #224
Next: PR #225
Stable assets: 92
Gate V2-F: not passed
Record growth: paused
Production publication: deferred
```

## Completed UI sequence

```text
PR #207 approved v2 contract and governance
PR #208 shared visual foundation
PR #209 Home
PR #210 Stablecoins index
PR #211 Stablecoin detail
PR #212 Organizations index and detail
PR #213 Events index and detail
PR #214 Editorial and project pages
PR #215 Mobile and accessibility hardening
PR #216 Visual-mark correction
```

## Completed quality sequence

```text
PR #217 workstream transition
PR #218 launch-date source review
PR #219 historical launch-boundary review
PR #220 remaining launch-boundary review
PR #221 terminal and relationship-end review
PR #222 reserve applicability review
PR #223 evidence reliability review
```

## PR #224

```text
Total findings: 112
Replaceable after source review: 67
Intentionally unknown after review: 0
Invalid placeholder encoding: 45
```

Classification does not resolve or replace the underlying canonical facts. Deployment resolution remains scheduled for PR #226–#229. Invalid refers to field encoding, not automatically to the whole record.

Specification: `docs/quality/direct-workflow-placeholder-review-2026-06-28.md`
Manifest: `data/quality/direct-workflow-placeholder-review.json`
Validator: `scripts/validate-direct-workflow-placeholders-pr224.mjs`

## Remaining sequence

```text
PR #225 evidence traceability and duplicate invariants
PR #226-229 deployment quality
PR #230-232 review-only monitoring
```

Normal quality work does not publish the site. Gate V2-F remains deferred.
