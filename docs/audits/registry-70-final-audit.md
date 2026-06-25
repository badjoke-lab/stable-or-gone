# SOG 92-Record Registry Audit

- Audited at: 2026-06-25
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p`
- Canonical stable assets: **92**
- Promoted candidates: **92 / 92**
- Critical findings: **0**
- Warnings: **4**

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
| stablecoins | 92 |
| organizations | 86 |
| relationships | 101 |
| classifications | 92 |
| profiles | 92 |
| events | 150 |
| event_details | 150 |
| evidence | 455 |
| reserve_reports | 100 |
| known_unknowns | 253 |
| regulatory_notes | 9 |
| deployments | 130 |
| legal_profiles | 92 |
| stable_asset_relationships | 4 |
| reserve_components | 125 |
| income_profiles | 92 |

## Coverage

| Layer | Covered | Expectation |
|---|---:|---|
| classifications | 92 / 92 | required |
| profiles | 92 / 92 | required |
| relationships | 92 / 92 | required |
| evidence | 92 / 92 | required |
| reserve_reports | 80 / 92 | informational |
| known_unknowns | 92 / 92 | required |
| deployments | 92 / 92 | optional_review |
| events | 92 / 92 | optional_review |
| legal_profiles | 92 / 92 | required |
| reserve_components | 92 / 92 | required |
| income_profiles | 92 / 92 | required |

## Critical Findings

- None.

## Warnings

- sog_ev_susd_synthetix_lifecycle_context source_count=3, linked evidence=6
- sog_ev_dola_2021_02_launch source_count=2, linked evidence=3
- sog_ev_lisusd_rebrand_batch_g source_count=5, linked evidence=6
- sog_ev_fxusd_launch_batch_m source_count=7, linked evidence=8

## Quality Observations

- reserve_reports context coverage is 80/92; this publication-specific layer is informational and is not expected for every asset. Missing: sog_st_mim, sog_st_usdn, sog_st_rai, sog_st_spot, sog_st_gho, sog_st_bold, sog_st_sai, sog_st_husd, sog_st_iron, sog_st_musd, sog_st_eurt, sog_st_alusd.
- 0 records have missing or older-than-one-year last_verified_at values: none.
- 20 records have no launch_date: sog_st_aecoin, sog_st_agoraausd, sog_st_brz, sog_st_dsd, sog_st_esd, sog_st_eurt, sog_st_gyen, sog_st_honey, sog_st_husd, sog_st_mim, sog_st_msusd, sog_st_musd, sog_st_stablesusdx, sog_st_susde, sog_st_tryb, sog_st_usd1, sog_st_usdh, sog_st_usdm, sog_st_usdz, sog_st_usyc.
- 3 historical-side records have no discontinued_date: sog_st_bac, sog_st_dsd, sog_st_esd.
- 0 income profiles remain entirely unknown: none.

## Result

The 92-record canonical registry passes the cross-layer integrity audit. Warnings remain non-blocking review queues and do not represent broken references or duplicate canonical identities.
