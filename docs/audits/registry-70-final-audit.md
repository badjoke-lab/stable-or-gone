# SOG 80-Record Final Registry Audit

- Audited at: 2026-06-24
- Baseline: `sog_registry_v2_agora_ausd_deployment_2026_06_24`
- Canonical stable assets: **81**
- Promoted candidates: **81 / 81**
- Critical findings: **0**
- Warnings: **3**

## Scope

- Canonical identity uniqueness and candidate-to-record mapping
- Legacy status and Registry v2 lifecycle compatibility
- Organization, event, evidence, deployment, and Registry v3 references
- Full-record coverage across required Registry v2/v3 layers
- Required, optional-review, and informational coverage visibility
- Generated registry statistics consistency
- Date freshness and explicit known-unknown inventory

## Registry Counts

| Layer | Count |
|---|---:|
| stablecoins | 81 |
| organizations | 70 |
| relationships | 83 |
| classifications | 81 |
| profiles | 81 |
| events | 124 |
| event_details | 124 |
| evidence | 377 |
| reserve_reports | 89 |
| known_unknowns | 197 |
| regulatory_notes | 9 |
| deployments | 115 |
| legal_profiles | 81 |
| stable_asset_relationships | 4 |
| reserve_components | 113 |
| income_profiles | 81 |

## Coverage

| Layer | Covered | Expectation |
|---|---:|---|
| classifications | 81 / 81 | required |
| profiles | 81 / 81 | required |
| relationships | 81 / 81 | required |
| evidence | 81 / 81 | required |
| reserve_reports | 69 / 81 | informational |
| known_unknowns | 81 / 81 | required |
| deployments | 81 / 81 | optional_review |
| events | 81 / 81 | optional_review |
| legal_profiles | 81 / 81 | required |
| reserve_components | 81 / 81 | required |
| income_profiles | 81 / 81 | required |

## Critical Findings

- None.

## Warnings

- sog_ev_susd_synthetix_lifecycle_context source_count=3, linked evidence=6
- sog_ev_lisusd_rebrand_batch_g source_count=5, linked evidence=6
- sog_ev_fxusd_launch_batch_m source_count=7, linked evidence=8

## Quality Observations

- reserve_reports context coverage is 69/81; this publication-specific layer is informational and is not expected for every asset. Missing: sog_st_mim, sog_st_usdn, sog_st_rai, sog_st_spot, sog_st_gho, sog_st_bold, sog_st_sai, sog_st_husd, sog_st_iron, sog_st_musd, sog_st_eurt, sog_st_alusd.
- 0 records have missing or older-than-one-year last_verified_at values: none.
- 25 records have no launch_date: sog_st_agoraausd, sog_st_bac, sog_st_brz, sog_st_cashio, sog_st_dola, sog_st_dsd, sog_st_esd, sog_st_eurt, sog_st_gyen, sog_st_honey, sog_st_husd, sog_st_iron, sog_st_mim, sog_st_msusd, sog_st_musd, sog_st_stablesusdx, sog_st_susde, sog_st_tryb, sog_st_usd1, sog_st_usdm, sog_st_usdz, sog_st_usk, sog_st_usyc, sog_st_vai, sog_st_vchf.
- 3 historical-side records have no discontinued_date: sog_st_bac, sog_st_dsd, sog_st_esd.
- 0 income profiles remain entirely unknown: none.

## Result

The 80-record canonical registry passes the cross-layer integrity audit. Warnings remain non-blocking review queues and do not represent broken references or duplicate canonical identities.
