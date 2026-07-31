# SOG 501-Record Evidence and Source-Identity Integrity Audit

- Audit ID: `sog_registry_501_evidence_integrity_pr299`
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p_batch_q_batch_r_batch_s_batch_t_batch_u_batch_v_batch_w_batch_x_batch_y_batch_z_batch_za_batch_zb_batch_zc_batch_zd_batch_zz_batch_zzz_batch_zzzz`
- Canonical evidence records: **579**
- Public source identities: **530**
- Evidence relations: **579**
- Source identity groups: **35**
- Source aliases: **49**
- Critical findings: **0**

## Identity and Relation Integrity

- Exact duplicate URL groups: 35
- Normalized-only duplicate URL groups: 0
- Public duplicate URL groups: 0
- Orphan relation source identities: 0
- Public source identities without canonical relations: 0

## Metadata Review Queues

- Publisher not recorded: 0
- Reliability not recorded: 0
- Claim scope not recorded: 0
- Unknown public category: 0
- Unknown provenance: 0
- Unknown primary state: 0
- Unknown reliability: 0
- Archive states: `{"archive_index":400,"direct_snapshot":50,"not_recorded":129}`

## Critical Findings

- None.

## Review Warnings

- None.

## Observations

- Audited 579 canonical evidence records projected to 530 public source identities.
- 35 approved source identity groups account for 49 alias evidence ids.
- 35 exact duplicate URL groups are covered by approved identity groups; 0 normalized-only duplicate groups remain.
- 129 canonical evidence records have no archive recorded; archive coverage is tracked as data quality, not evidence invalidity.

## Result

PASS. Canonical evidence IDs, URL identity grouping, public source projection, subject references, and relation unions are structurally valid. Metadata and archive coverage queues remain explicit for review.
