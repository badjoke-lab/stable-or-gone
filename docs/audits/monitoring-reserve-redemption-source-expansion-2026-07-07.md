# Monitoring reserve and redemption source expansion audit

Status: supporting audit — PR #322  
Date: 2026-07-07

## Purpose

This audit records the six first-party source additions used by PR #322 to expand review-only reserve, assurance, and issuance/redemption monitoring coverage.

The audit records why each page is suitable for monitoring scope and what PR #322 deliberately does not infer from it.

## Boundary before expansion

Historical PR #321 synchronization state:

```text
sources: 24
baseline rows: 24
pending: 24
accepted: 0
registered asset reach: 16
uncovered assets: 84
covered organizations: 12
accepted asset reach: 0
```

PR #322 does not rewrite that historical snapshot.

## Approved source additions

### TrueUSD transparency

```text
source_id: trueusd-transparency
asset: TUSD
canonical asset id: sog_st_tusd
organization id: sog_issuer_trueusd
URL: https://tusd.io/transparency
signals: reserve_update, assurance_update
```

Monitoring rationale:

- first-party TrueUSD transparency surface;
- reserve transparency and attestation context;
- appropriate for reserve and assurance change observation.

Boundary:

- source registration does not mean the page has an accepted baseline;
- PR #322 does not infer asset safety or complete reserve coverage.

### Angle EURA overview

```text
source_id: angle-eura-overview
asset: EURA
canonical asset id: sog_st_eura
organization id: sog_issuer_angle
URL: https://docs.angle.money/
signals: reserve_update, issuance_redemption_update
```

Monitoring rationale:

- first-party protocol documentation;
- describes EURA reserve architecture and redemption mechanism;
- suitable for reserve-configuration and redemption-term changes.

Boundary:

- protocol documentation is not treated as an accepted monitoring baseline until separately reviewed through the baseline-acceptance process.

### SG-FORGE EUR CoinVertible

```text
source_id: sgforge-eurcv-coinvertible
asset: EURCV
canonical asset id: sog_st_eurcv
organization id: sog_issuer_sg_forge
URL: https://www.sgforge.com/product/coinvertible/
signals: reserve_update, issuance_redemption_update
```

Monitoring rationale:

- first-party issuer product surface;
- describes reserve/collateral structure and subscription/redemption mechanics;
- suitable for reserve and redemption-term observation.

Boundary:

- page registration does not replace evidence review or canonical data review.

### Eurite EURI overview

```text
source_id: eurite-euri-overview
asset: EURI
canonical asset id: sog_st_euri
organization id: sog_issuer_banking_circle
URL: https://www.eurite.com/
signals: reserve_update, assurance_update, issuance_redemption_update
```

Monitoring rationale:

- first-party EURI product surface;
- describes backing, safeguarded funds, attestation, and redemption concepts;
- suitable for reserve, assurance, and redemption-term observation.

Boundary:

- source registration does not imply complete legal, regulatory, or platform-access coverage.

### Quantoz EURQ and USDQ overview

```text
source_id: quantoz-eurq-usdq
asset: EURQ
canonical asset id: sog_st_eurq
organization id: sog_issuer_quantoz_payments
URL: https://www.quantoz.com/products/eurq-usdq
signals: reserve_update, issuance_redemption_update
```

Monitoring rationale:

- first-party Quantoz product surface;
- describes reserve structure, segregation, and redemption rights;
- suitable for reserve and redemption-term observation.

Boundary:

- PR #322 monitors EURQ through this source row because EURQ is the canonical covered asset in the current source mapping;
- the shared EURQ/USDQ page does not automatically add USDQ as a canonical monitored mapping in this PR.

### VNX VCHF overview

```text
source_id: vnx-vchf-overview
asset: VCHF
canonical asset id: sog_st_vchf
organization id: sog_issuer_vnx_commodities
URL: https://vnx.li/vchf/
signals: issuance_redemption_update
```

Monitoring rationale:

- first-party VCHF product surface;
- describes exchange between VCHF and Swiss francs;
- suitable for issuance/redemption-term observation.

Boundary:

- PR #322 does not assign reserve-update or assurance-update signals from this page;
- no reserve-composition conclusion is inferred from the monitored page.

## Post-expansion deterministic result

Binding current snapshot:

```text
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

Measured state:

```text
sources: 30
baseline rows: 30
pending: 30
accepted: 0
missing: 0
registered asset reach: 22
uncovered assets: 78
covered organizations: 18
accepted asset reach: 0
multi-family assets: 11
```

Family reach:

```text
reserve_assurance: 14 sources / 16 assets
redemption_terms: 11 sources / 12 assets
issuer_lifecycle: 5 sources / 5 assets
regulatory: 5 sources / 5 assets
```

## Safety result

PR #322 preserves:

```text
human_review_required: true
monitoring_write_allowed: false
canonical_evidence: false
public_output: false
automatic_pull_request: false
production_publication: false
network_access_used_for_snapshot: false
canonical_action: none
```

All six new baseline rows remain `pending_initial_acceptance`. No live page digest is accepted by PR #322.

## Conclusion

PR #322 expands review-only registered source reach from 16 to 22 of 100 assets while preserving zero accepted monitoring coverage. The expansion is limited to reserve, assurance, and issuance/redemption scope and leaves lifecycle, regulatory, platform-policy, regulatory-register, and EU/EEA function-level market-access expansion for later roadmap work.
