# SOG 100-Record Reserve, Redemption, and Backing Applicability Audit

- Audit ID: `sog_registry_100_reserve_redemption_backing_pr300`
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p_batch_q_batch_r_batch_s_batch_t_batch_u_batch_v_batch_w_batch_x_batch_y_batch_z_batch_za_batch_zb_batch_zc_batch_zd_batch_zz_batch_zzz_batch_zzzz`
- Stable assets: **117**
- Classifications: **117**
- Profiles: **117**
- Reserve-context rows: **125**
- Critical findings: **0**
- Review warnings: **1**

## Reserve Applicability Partition

- Assets covered by reserve-context rows: 105
- Assets covered by applicability decisions: 12
- Overlap: 0
- Uncovered: 0
- Queue categories: `{"not_applicable_by_design":10,"source_status_unresolved":2}`

## Cross-Layer Consistency

- Backing mismatches: 0
- Invalid latest-report references: 0
- Missing reserve evidence references: 0
- Missing redemption evidence references: 0
- Invalid redemption URLs: 0
- Applicability decision evidence gaps: 0

## Review Queues

- Reserve-context rows without period-specific report_date: 80
- Terminal lifecycle / redemption review: 1
- Issuer-redemption / not-applicable conflicts: 0
- Unbacked / available disclosure conflicts: 0
- Redemption source-review-needed fields: 9
- Reserve source status unresolved assets: 2

## Critical Findings

- None.

## Review Warnings

- sog_st_fei: terminal lifecycle terminated with redemption status restricted requires review

## Observations

- Audited 117 assets, 117 classifications, 117 profiles, and 125 reserve-context rows.
- 105 assets are covered by reserve-context rows and 12 assets by explicit applicability decisions.
- 80 reserve-context rows are indexes or context entries without a period-specific report_date.
- 9 redemption fields explicitly retain source-review-needed text.

## Result

PASS. Every asset has classification and profile coverage; backing semantics align; reserve-context coverage and explicit applicability decisions form a complete partition; references are structurally valid. Review queues remain explicit.
