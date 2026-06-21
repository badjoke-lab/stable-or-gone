# SOG 80-Record Quality Baseline

Recorded: 2026-06-22

## Result

- Canonical stable assets: **80**
- Promoted candidates: **80 / 80**
- Pending candidates: **0**
- Critical findings: **0**
- Warnings: **0**
- Production parity: **pending after merge**

## Counts

| Layer | Count |
|---|---:|
| stablecoins | 80 |
| organizations | 69 |
| relationships | 82 |
| classifications | 80 |
| profiles | 80 |
| events | 107 |
| event_details | 107 |
| evidence | 327 |
| reserve_reports | 87 |
| known_unknowns | 188 |
| regulatory_notes | 9 |
| deployments | 111 |
| legal_profiles | 80 |
| stable_asset_relationships | 4 |
| reserve_components | 112 |
| income_profiles | 80 |

## Coverage

| Layer | Covered | Expectation |
|---|---:|---|
| classifications | 80 / 80 | required |
| profiles | 80 / 80 | required |
| relationships | 80 / 80 | required |
| evidence | 80 / 80 | required |
| reserve_reports | 67 / 80 | informational |
| known_unknowns | 80 / 80 | required |
| deployments | 80 / 80 | optional_review |
| events | 80 / 80 | optional_review |
| legal_profiles | 80 / 80 | required |
| reserve_components | 80 / 80 | required |
| income_profiles | 80 / 80 | required |

## Quality queues

- Launch-date unresolved: 38
- Terminal-date unresolved: 6
- Reserve-report applicability queue: 13
- All-unknown income profiles: 0

## Promotion boundary

Batch M promotes GYD, fxUSD, HONEY, MAI, and Stables Labs USDX. Base assets remain separate from sGYD, fxSAVE and position products, HONEY receipts or bridges, chain-specific MAI representations, unrelated USDX assets, and sUSDX.

## Deployment classification

No production deployment is performed by this branch. One manual publication checkpoint and full production parity are required after merge.
