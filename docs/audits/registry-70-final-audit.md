# SOG 70-Record Final Registry Audit

- Audited at: 2026-06-17
- Baseline: `sog_registry_v2_post_batch_k_2026_06_17`
- Canonical stable assets: **70**
- Promoted candidates: **70 / 70**
- Critical findings: **19**
- Warnings: **7**

## Scope

- Canonical identity uniqueness and candidate-to-record mapping
- Legacy status and Registry v2 lifecycle compatibility
- Organization, event, evidence, deployment, and Registry v3 references
- Full-record coverage across required Registry v2/v3 layers
- Generated registry statistics consistency
- Date freshness and explicit known-unknown inventory

## Registry Counts

| Layer | Count |
|---|---:|
| stablecoins | 70 |
| organizations | 59 |
| relationships | 72 |
| classifications | 70 |
| profiles | 70 |
| events | 84 |
| event_details | 84 |
| evidence | 273 |
| reserve_reports | 72 |
| known_unknowns | 153 |
| regulatory_notes | 9 |
| deployments | 100 |
| legal_profiles | 70 |
| stable_asset_relationships | 4 |
| reserve_components | 102 |
| income_profiles | 70 |

## Critical Findings

- reserve_reports coverage is missing sog_st_mim
- reserve_reports coverage is missing sog_st_fei
- reserve_reports coverage is missing sog_st_usdn
- reserve_reports coverage is missing sog_st_rai
- reserve_reports coverage is missing sog_st_spot
- reserve_reports coverage is missing sog_st_nuon
- reserve_reports coverage is missing sog_st_gho
- reserve_reports coverage is missing sog_st_bold
- reserve_reports coverage is missing sog_st_usd0
- reserve_reports coverage is missing sog_st_usr
- reserve_reports coverage is missing sog_st_sai
- reserve_reports coverage is missing sog_st_husd
- reserve_reports coverage is missing sog_st_iron
- reserve_reports coverage is missing sog_st_musd
- reserve_reports coverage is missing sog_st_eurs
- reserve_reports coverage is missing sog_st_eurt
- reserve_reports coverage is missing sog_st_usdm
- reserve_reports coverage is missing sog_st_alusd
- deployments coverage is missing sog_st_husd

## Warnings

- sog_ev_usdc_2023_03_depeg source_count=4, linked evidence=2
- sog_ev_ust_2022_05_collapse source_count=5, linked evidence=3
- sog_ev_busd_2023_02_wind_down source_count=5, linked evidence=4
- sog_ev_usde_launch_context source_count=1, linked evidence=2
- sog_ev_susd_synthetix_lifecycle_context source_count=1, linked evidence=3
- sog_ev_rai_governance_minimization source_count=2, linked evidence=1
- sog_ev_nuon_base_launch source_count=2, linked evidence=3

## Quality Observations

- 0 records have missing or older-than-one-year last_verified_at values.
- 44 records have no launch_date.
- 6 historical-side records have no discontinued_date.
- 41 income profiles remain entirely unknown.

## Result

The registry does not pass the final audit until all critical findings are resolved.
