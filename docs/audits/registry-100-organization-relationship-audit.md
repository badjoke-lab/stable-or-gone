# SOG 100-Record Organization and Relationship Integrity Audit

- Audit ID: `sog_registry_100_organization_relationship_pr298`
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p_batch_q_batch_r_batch_s_batch_t_batch_u_batch_v_batch_w_batch_x_batch_y_batch_z_batch_za_batch_zb_batch_zc_batch_zd_batch_zz_batch_zzz_batch_zzzz`
- Stable assets: **117**
- Organizations: **108**
- Relationships: **129**
- Critical findings: **0**
- Review warnings: **7**

## Primary Display Integrity

- Invalid selections: 0
- Ambiguous selections: 0
- Selected role counts: `{"legal_issuer":54,"protocol_operator":61,"brand_owner":1,"reserve_manager":1}`
- Selected status counts: `{"active":98,"ended":14,"unknown":5}`

## Organization Source Boundaries

- Organizations without official URL: 2
- Invalid official URLs: 0
- Exact shared official URLs: 2
- Shared official hosts: 4
- Orphan organizations: 0

## Relationship Boundaries

- Ended relationships without supported end date: 4
- Active relationships with end date: 0
- Start-after-end relationships: 0
- Legacy issuer compatibility gaps: 0
- Multiple-active-legal-issuer assets: 1

## Critical Findings

- None.

## Review Warnings

- exact official URL https://paxos.com/ is shared by sog_issuer_paxos, sog_issuer_paxos_digital_singapore, sog_issuer_paxos_issuance_europe
- exact official URL https://circle.com/usyc is shared by sog_issuer_circle_bermuda, sog_org_hashnote_sdyf
- sog_rel_husd_stable_universal: ended relationship has no supported end date
- sog_rel_esd_empty_set_operator: ended relationship has no supported end date
- sog_rel_bac_basis_cash_operator: ended relationship has no supported end date
- sog_rel_dsd_protocol_operator: ended relationship has no supported end date
- sog_st_usdg: multiple active legal issuers sog_issuer_paxos_digital_singapore, sog_issuer_paxos_issuance_europe

## Observations

- Audited 108 organizations and 129 stablecoin-organization relationships across 117 assets.
- 2 organizations have no official_url recorded.
- 4 official-domain hosts are shared across more than one organization record.
- 0 organizations are not referenced by current canonical relationships.
- 4 ended relationships preserve an unresolved end-date boundary.

## Result

PASS. Organization identity, relationship references, role/status enums, temporal consistency, issuer compatibility coverage, and primary-display selection are structurally valid. Review warnings remain explicit for unresolved source and boundary questions.
