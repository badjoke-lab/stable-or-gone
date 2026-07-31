# SOG Current Registry Audit

- Audited at: 2026-07-31
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p_batch_q_batch_r_batch_s_batch_t_batch_u_batch_v_batch_w_batch_x_batch_y_batch_z_batch_za_batch_zb_batch_zc_batch_zd_batch_zz_batch_zzz_batch_zzzz`
- Canonical stable assets: **117**
- Promoted candidates: **117 / 117**
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
| stablecoins | 117 |
| organizations | 108 |
| relationships | 129 |
| classifications | 117 |
| profiles | 117 |
| events | 192 |
| event_details | 192 |
| evidence | 579 |
| reserve_reports | 125 |
| known_unknowns | 342 |
| regulatory_notes | 9 |
| deployments | 184 |
| legal_profiles | 117 |
| stable_asset_relationships | 5 |
| reserve_components | 151 |
| income_profiles | 117 |

## Coverage

| Layer | Covered | Expectation |
|---|---:|---|
| classifications | 117 / 117 | required |
| profiles | 117 / 117 | required |
| relationships | 117 / 117 | required |
| evidence | 117 / 117 | required |
| reserve_reports | 105 / 117 | informational |
| known_unknowns | 117 / 117 | required |
| deployments | 117 / 117 | optional_review |
| events | 115 / 117 | optional_review |
| legal_profiles | 117 / 117 | required |
| reserve_components | 117 / 117 | required |
| income_profiles | 117 / 117 | required |

## Critical Findings

- None.

## Warnings

- sog_ev_busd_2023_02_wind_down source_count=4, linked evidence=5
- events coverage 115/117; missing sog_st_audd, sog_st_nzds

## Quality Observations

- reserve_reports context coverage is 105/117; this publication-specific layer is informational and is not expected for every asset. Missing: sog_st_mim, sog_st_usdn, sog_st_rai, sog_st_spot, sog_st_gho, sog_st_bold, sog_st_sai, sog_st_husd, sog_st_iron, sog_st_musd, sog_st_eurt, sog_st_alusd.
- 0 records have missing or older-than-one-year last_verified_at values: none.
- 29 records have no launch_date: sog_st_1gbp, sog_st_aecoin, sog_st_agoraausd, sog_st_audd, sog_st_brz, sog_st_cadc, sog_st_dsd, sog_st_esd, sog_st_eure, sog_st_eurr, sog_st_eurt, sog_st_honey, sog_st_husd, sog_st_mim, sog_st_msusd, sog_st_musd, sog_st_nzds, sog_st_phpc, sog_st_stablesusdx, sog_st_stablrusdr, sog_st_susde, sog_st_tryb, sog_st_usd1, sog_st_usdh, sog_st_usdm, sog_st_usdz, sog_st_usyc, sog_st_xusd, sog_st_zarp.
- 4 historical-side records have no discontinued_date: sog_st_bac, sog_st_dsd, sog_st_esd, sog_st_nearusn.
- 3 income profiles remain entirely unknown: sog_st_1gbp, sog_st_audd, sog_st_nzds.

## Result

The current canonical registry passes the cross-layer integrity audit. Warnings remain non-blocking review queues and do not represent broken references or duplicate canonical identities.
