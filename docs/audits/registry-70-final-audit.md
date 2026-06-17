# SOG 70-Record Final Registry Audit

- Audited at: 2026-06-17
- Baseline: `sog_registry_v2_post_batch_k_2026_06_17`
- Canonical stable assets: **70**
- Promoted candidates: **70 / 70**
- Critical findings: **0**
- Warnings: **3**

## Scope

- Canonical identity uniqueness and candidate-to-record mapping
- Legacy status and Registry v2 lifecycle compatibility
- Organization, event, evidence, deployment, and Registry v3 references
- Full-record coverage across required Registry v2/v3 layers
- Optional event, reserve-report, and deployment coverage visibility
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

## Coverage

| Layer | Covered | Required |
|---|---:|:---:|
| classifications | 70 / 70 | yes |
| profiles | 70 / 70 | yes |
| relationships | 70 / 70 | yes |
| evidence | 70 / 70 | yes |
| reserve_reports | 52 / 70 | no |
| known_unknowns | 70 / 70 | yes |
| deployments | 69 / 70 | no |
| events | 63 / 70 | no |
| legal_profiles | 70 / 70 | yes |
| reserve_components | 70 / 70 | yes |
| income_profiles | 70 / 70 | yes |

## Critical Findings

- None.

## Warnings

- reserve_reports coverage 52/70; missing sog_st_mim, sog_st_fei, sog_st_usdn, sog_st_rai, sog_st_spot, sog_st_nuon, sog_st_gho, sog_st_bold, sog_st_usd0, sog_st_usr, sog_st_sai, sog_st_husd, sog_st_iron, sog_st_musd, sog_st_eurs, sog_st_eurt, sog_st_usdm, sog_st_alusd
- deployments coverage 69/70; missing sog_st_husd
- events coverage 63/70; missing sog_st_frax, sog_st_tusd, sog_st_rlusd, sog_st_eurc, sog_st_usdp, sog_st_usdg, sog_st_usds

## Quality Observations

- 0 records have missing or older-than-one-year last_verified_at values.
- 44 records have no launch_date.
- 6 historical-side records have no discontinued_date.
- 41 income profiles remain entirely unknown.

## Result

The 70-record canonical registry passes the cross-layer integrity audit. Warnings remain non-blocking review queues and do not represent broken references or duplicate canonical identities.
