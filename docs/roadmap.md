# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

## Current position

```text
Latest completed: PR #247
Active: PR #248
Next: PR #249
Stable assets: 94
Gate V2-F: not passed
Record growth: Growth B authorized for corrected candidates only
Production publication: deferred
```

UI review remains paused. Normal quality work does not approve or publish the UI.

## Completed UI milestones

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

## Completed non-UI milestones

```text
PR #217-#225 record quality
PR #226-#229 deployment quality
PR #230-#239 monitoring foundation and safety
PR #240-#245 monitoring audit and coverage
PR #246 initial growth selection
PR #247 corrected selection and Growth A
```

## Current monitoring snapshot

```text
Enabled official sources: 24
Covered stable assets: 16
Uncovered stable assets: 78
Pending baselines: 24
Accepted baselines: 0
Public monitoring output: false
Production publication: false
```

## Growth sequence

```text
PR #247 Growth A: 92 -> 94 — complete
PR #248 Growth B: 94 -> 96
PR #249 Growth C: 96 -> 98
PR #250 Growth D: 98 -> 100
```

The corrected candidate identities and allocations are defined in `data/final-eight-candidate-audit-pr246.json`, `data/final-eight-candidate-corrections-pr247.json`, and `data/candidate-stable-assets-growth-100.json`.

Each growth PR is limited to two corrected candidates. Unknown values remain unknown.

## Growth A result

```text
Canonical stable assets: 94
Batch: Q / batch_018
Added stablecoins: 2
Added organizations: 3
Added relationships: 3
Added lifecycle events: 5
Added evidence records: 9
Added explicit open items: 10
Added deployments: 2
Production publication: false
```

## Remaining work

```text
PR #251 identity uniqueness audit
PR #252 organization and relationship audit
PR #253 evidence integrity audit
PR #254 applicability audit
PR #255 deployment identity audit
PR #256 lifecycle boundary audit
PR #257 explicit-unknown audit
PR #258 monitoring coverage recalculation
PR #259 Registry parity
PR #260 count and provenance integrity
PR #261 reproducible build audit
PR #262 canonical data freeze
PR #263 non-UI release-candidate material
```

PR #263 does not authorize production publication.
