# SOG 70-Record Final Registry Audit

- Audited at: 2026-06-21
- Baseline: `sog_registry_v2_post_batch_l_2026_06_21`
- Canonical stable assets: **75**
- Promoted candidates: **75 / 75**
- Critical findings: **0**
- Warnings: **2**

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
| stablecoins | 75 |
| organizations | 64 |
| relationships | 77 |
| classifications | 75 |
| profiles | 75 |
| events | 102 |
| event_details | 102 |
| evidence | 306 |
| reserve_reports | 82 |
| known_unknowns | 173 |
| regulatory_notes | 9 |
| deployments | 106 |
| legal_profiles | 75 |
| stable_asset_relationships | 4 |
| reserve_components | 107 |
| income_profiles | 75 |

## Coverage

| Layer | Covered | Expectation |
|---|---:|---|
| classifications | 75 / 75 | required |
| profiles | 75 / 75 | required |
| relationships | 75 / 75 | required |
| evidence | 75 / 75 | required |
| reserve_reports | 62 / 75 | informational |
| known_unknowns | 75 / 75 | required |
| deployments | 75 / 75 | optional_review |
| events | 75 / 75 | optional_review |
| legal_profiles | 75 / 75 | required |
| reserve_components | 75 / 75 | required |
| income_profiles | 75 / 75 | required |

## Critical Findings

- None.

## Warnings

- sog_ev_m0_launch_batch_l source_count=3, linked evidence=4
- sog_ev_usx_launch_batch_l source_count=3, linked evidence=4

## Quality Observations

- reserve_reports context coverage is 62/75; this publication-specific layer is informational and is not expected for every asset. Missing: sog_st_mim, sog_st_fei, sog_st_usdn, sog_st_rai, sog_st_spot, sog_st_gho, sog_st_bold, sog_st_sai, sog_st_husd, sog_st_iron, sog_st_musd, sog_st_eurt, sog_st_alusd.
- 0 records have missing or older-than-one-year last_verified_at values: none.
- 34 records have no launch_date: sog_st_agoraausd, sog_st_bac, sog_st_brz, sog_st_cashio, sog_st_dola, sog_st_dsd, sog_st_esd, sog_st_eura, sog_st_eurs, sog_st_eurt, sog_st_gyen, sog_st_husd, sog_st_iron, sog_st_lisusd, sog_st_mim, sog_st_mountainusdm, sog_st_musd, sog_st_nuon, sog_st_sdai, sog_st_spot, sog_st_susd, sog_st_susde, sog_st_tryb, sog_st_usd0, sog_st_usd1, sog_st_usda, sog_st_usdf, sog_st_usdm, sog_st_usdz, sog_st_usk, sog_st_usr, sog_st_usyc, sog_st_vai, sog_st_vchf.
- 4 historical-side records have no discontinued_date: sog_st_bac, sog_st_dsd, sog_st_esd, sog_st_usdn.
- 0 income profiles remain entirely unknown: none.

## Result

The 70-record canonical registry passes the cross-layer integrity audit. Warnings remain non-blocking review queues and do not represent broken references or duplicate canonical identities.
