# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #228
Active: PR #229
Next: PR #230
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
PR #228 deployment verification-state review
```

## PR #229

```text
Deployments reviewed in this pass: 16
Verified identifiers: 16
Identifier recorded, unverified: 45
Source linked, identifier missing: 69
Source review needed: 0
Unknown verification state: 0
Verification status recorded: 130 / 130
```

Historical UST is recorded as Terra Classic native denomination `uusd`; fifteen other rows receive reviewed contract or mint identifiers.

Specification: `docs/quality/deployment-source-status-review-2026-06-29.md`
Overlay: `data/deployment-verification-pr229.json`
Validator: `scripts/validate-deployment-source-status-pr229.mjs`

## Remaining sequence

```text
PR #230 monitoring skeleton and canonical guard
PR #231 official-source candidate generation
PR #232 reviewable monitoring reports
```

Normal quality work does not publish the site. Gate V2-F remains deferred.
