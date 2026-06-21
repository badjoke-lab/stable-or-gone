# Stable or Gone Roadmap

Updated: 2026-06-22

## Current position

Repository: `badjoke-lab/stable-or-gone`

Latest merged checkpoint:

`PR #92 — Review Batch 13 promotion boundaries`  
Merge: `d7c0b5df99c2511464a1aab500835e5252e5fa3d`

Active work:

`promote-batch-m-stable-assets`  
Target: **75 → 80 canonical stable assets**

## Batch M scope

- Gyroscope GYD
- f(x) Protocol fxUSD
- Berachain HONEY
- QiDAO MAI
- Stables Labs USDX

## Canonical registry after promotion

- stablecoins: 80
- organizations: 69
- relationships: 82
- classifications: 80
- profiles: 80
- events: 107
- event_details: 107
- evidence: 327
- reserve_reports: 87
- known_unknowns: 188
- regulatory_notes: 9
- deployments: 111
- legal_profiles: 80
- stable_asset_relationships: 4
- reserve_components: 112
- income_profiles: 80

## Quality state

- Candidate promotions: 80 / 80
- Pending candidates: 0
- Critical findings: 0
- Warnings: 0
- Launch-date unresolved: 38
- Terminal-date unresolved: 6
- Reserve applicability queue: 13
- Reserve-context coverage: 67 / 80
- All-unknown income profiles: 0

## Immediate next work

1. Open and complete the Batch M promotion PR.
2. Require every GitHub CI check to pass.
3. Merge only with zero critical findings and zero unresolved CI failures.
4. After merge, run one manual 80-record publication checkpoint.
5. Verify deployed commit, public counts, routes, machine-readable files, sitemap, and production consistency.
6. Do not begin 80 → 85 growth until the 80-record production-parity gate passes.

## Phase status

- Phase 1 — Launch-date quality: complete
- Phase 2 — Historical terminal dates: complete
- Phase 3 — Income profiles: complete
- Phase 4 — Reserve applicability and context: complete
- Phase 5 — 70-record quality baseline: complete
- Phase 6A — Growth 70 → 75: complete
- Phase 6B — 75-record production parity: complete
- Phase 6C — Manual publication controls: complete
- Phase 6D-1 — Batch 13 candidate intake: complete
- Phase 6D-2 — Batch 13 boundary review: complete
- Phase 6D-3 — Batch M promotion 75 → 80: active
- Phase 6D-4 — 80-record production parity: blocked pending merge

## Production constraint

Normal PRs and ordinary main merges do not publish. Cloudflare deployment is a separate manual checkpoint after the 80-record promotion is merged.
