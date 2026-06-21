# SOG 80-Record Final Registry Audit

- Audited at: 2026-06-22
- Baseline: `sog_registry_v2_post_batch_m_2026_06_22`
- Canonical stable assets: **80**
- Promoted candidates: **80 / 80**
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

## Critical Findings

- None.

## Warnings

- None.

## Quality Observations

- reserve_reports context coverage is 67/80; this publication-specific layer is informational and is not expected for every asset. Missing: sog_st_mim, sog_st_fei, sog_st_usdn, sog_st_rai, sog_st_spot, sog_st_gho, sog_st_bold, sog_st_sai, sog_st_husd, sog_st_iron, sog_st_musd, sog_st_eurt, sog_st_alusd.
- 0 records have missing or older-than-one-year last_verified_at values: none.
- 38 records have no launch_date: sog_st_agoraausd, sog_st_bac, sog_st_brz, sog_st_cashio, sog_st_dola, sog_st_dsd, sog_st_esd, sog_st_eura, sog_st_eurs, sog_st_eurt, sog_st_fxusd, sog_st_gyen, sog_st_honey, sog_st_husd, sog_st_iron, sog_st_lisusd, sog_st_mai, sog_st_mim, sog_st_mountainusdm, sog_st_musd, sog_st_nuon, sog_st_sdai, sog_st_spot, sog_st_stablesusdx, sog_st_susd, sog_st_susde, sog_st_tryb, sog_st_usd0, sog_st_usd1, sog_st_usda, sog_st_usdf, sog_st_usdm, sog_st_usdz, sog_st_usk, sog_st_usr, sog_st_usyc, sog_st_vai, sog_st_vchf.
- 4 historical-side records have no discontinued_date: sog_st_bac, sog_st_dsd, sog_st_esd, sog_st_usdn.
- 0 income profiles remain entirely unknown: none.

## Result

The 80-record canonical registry passes the cross-layer integrity audit with no critical findings or warnings. Informational coverage metrics remain visible without implying universal applicability.
