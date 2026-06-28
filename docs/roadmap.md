# Stable or Gone Roadmap

Updated: 2026-06-28
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #227
Active: PR #228
Next: PR #229
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
PR #224 direct workflow placeholder review
PR #225 evidence traceability and duplicate invariants
PR #226 seed and extra deployment canonicality
PR #227 remaining deployment canonicality
```

## PR #228

```text
Deployments reviewed: 130
Verified: 0
Identifier recorded, unverified: 45
Source linked, identifier missing: 69
Source review needed: 15
Unknown: 1
Verification status recorded: 130
Verification status not recorded: 0
```

The canonical overlay records the conservative state already implied by identifier and evidence coverage. It does not promote any deployment to verified.

Specification: `docs/quality/deployment-verification-review-2026-06-28.md`
Overlay: `data/deployment-verification-pr228.json`
Validator: `scripts/validate-deployment-verification-pr228.mjs`

## Remaining sequence

```text
PR #229 deployment source-status finalization
PR #230-232 review-only monitoring
```

Normal quality work does not publish the site. Gate V2-F remains deferred.
