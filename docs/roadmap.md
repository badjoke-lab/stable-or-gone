# Stable or Gone Roadmap

Updated: 2026-06-28
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #226
Active: PR #227
Next: PR #228
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
```

## PR #227

Remaining batch A–E deployment canonicality review:

```text
Reviewed deployments: 28
Canonical bridge: 3
Issuer native: 5
Legacy: 8
Native: 9
Synthetic: 1
Explicit unknown: 2
Canonicality recorded registry-wide: 130
Canonicality not recorded: 0
```

EURS bridge representations on Arbitrum and Gnosis remain explicit unknown because the reviewed issuer source does not establish whether the bridge is canonical, issuer-controlled, or third-party.

Specification: `docs/quality/deployment-canonicality-batches-review-2026-06-28.md`
Manifest: `data/quality/deployment-canonicality-pr227.json`
Validator: `scripts/validate-deployment-canonicality-pr227.mjs`

## Remaining sequence

```text
PR #228 contract identity and verification status
PR #229 deployment source-status finalization
PR #230-232 review-only monitoring
```

Normal quality work does not publish the site. Gate V2-F remains deferred.
