# SOG 70-Record Final Registry Audit

- Audited at: 2026-06-17
- Baseline: `sog_registry_v2_post_batch_k_2026_06_17`
- Canonical stable assets: **70**
- Promoted candidates: **70 / 70**
- Critical findings: **0**
- Warnings: **0**

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
| stablecoins | 70 |
| organizations | 59 |
| relationships | 72 |
| classifications | 70 |
| profiles | 70 |
| events | 96 |
| event_details | 96 |
| evidence | 284 |
| reserve_reports | 72 |
| known_unknowns | 153 |
| regulatory_notes | 9 |
| deployments | 101 |
| legal_profiles | 70 |
| stable_asset_relationships | 4 |
| reserve_components | 102 |
| income_profiles | 70 |

## Coverage

| Layer | Covered | Expectation |
|---|---:|---|
| classifications | 70 / 70 | required |
| profiles | 70 / 70 | required |
| relationships | 70 / 70 | required |
| evidence | 70 / 70 | required |
| reserve_reports | 52 / 70 | informational |
| known_unknowns | 70 / 70 | required |
| deployments | 70 / 70 | optional_review |
| events | 70 / 70 | optional_review |
| legal_profiles | 70 / 70 | required |
| reserve_components | 70 / 70 | required |
| income_profiles | 70 / 70 | required |

## Critical Findings

- None.

## Warnings

- None.

## Quality Observations

- reserve_reports context coverage is 52/70; this publication-specific layer is informational and is not expected for every asset. Missing: sog_st_mim, sog_st_fei, sog_st_usdn, sog_st_rai, sog_st_spot, sog_st_nuon, sog_st_gho, sog_st_bold, sog_st_usd0, sog_st_usr, sog_st_sai, sog_st_husd, sog_st_iron, sog_st_musd, sog_st_eurs, sog_st_eurt, sog_st_usdm, sog_st_alusd.
- 0 records have missing or older-than-one-year last_verified_at values: none.
- 33 records have no launch_date: sog_st_agoraausd, sog_st_bac, sog_st_brz, sog_st_cashio, sog_st_dola, sog_st_dsd, sog_st_esd, sog_st_eura, sog_st_eurs, sog_st_eurt, sog_st_gyen, sog_st_husd, sog_st_iron, sog_st_lisusd, sog_st_mim, sog_st_mountainusdm, sog_st_musd, sog_st_nuon, sog_st_sdai, sog_st_spot, sog_st_susd, sog_st_susde, sog_st_susds, sog_st_tryb, sog_st_usd0, sog_st_usd1, sog_st_usdm, sog_st_usdtb, sog_st_usk, sog_st_usr, sog_st_usyc, sog_st_vai, sog_st_vchf.
- 4 historical-side records have no discontinued_date: sog_st_bac, sog_st_dsd, sog_st_esd, sog_st_usdn.
- 41 income profiles remain entirely unknown: sog_st_acalaausd, sog_st_alusd, sog_st_bold, sog_st_busd, sog_st_crvusd, sog_st_dai, sog_st_eurc, sog_st_eurs, sog_st_eurt, sog_st_fdusd, sog_st_fei, sog_st_frax, sog_st_gho, sog_st_gusd, sog_st_husd, sog_st_iron, sog_st_lusd, sog_st_mim, sog_st_musd, sog_st_nuon, sog_st_paxg, sog_st_pyusd, sog_st_rai, sog_st_rlusd, sog_st_sai, sog_st_spot, sog_st_susd, sog_st_tusd, sog_st_usd0, sog_st_usdc, sog_st_usdd, sog_st_usde, sog_st_usdg, sog_st_usdm, sog_st_usdn, sog_st_usdp, sog_st_usds, sog_st_usdt, sog_st_usr, sog_st_ust, sog_st_xaut.

## Result

The 70-record canonical registry passes the cross-layer integrity audit with no critical findings or warnings. Informational coverage metrics remain visible without implying universal applicability.
