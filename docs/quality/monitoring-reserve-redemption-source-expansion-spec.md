# Stable or Gone reserve and redemption source expansion specification

Status: canonical implementation specification — PR #322  
Updated: 2026-07-07

## 1. Purpose

PR #322 expands the reviewed official-source allowlist for reserve, assurance, and issuance/redemption monitoring while preserving the review-only monitoring architecture.

The expansion begins from the PR #321 synchronized boundary:

```text
24 reviewed official sources
24 pending baseline rows
16 assets with registered source reach
84 uncovered assets
0 accepted baselines
0 accepted asset reach
```

PR #322 adds reviewed first-party reserve/redemption sources for six canonical assets:

```text
TUSD
EURA
EURCV
EURI
EURQ
VCHF
```

PR #322 does not accept any baseline, perform live baseline acceptance, add lifecycle/regulatory/access sources, schedule monitoring, write canonical data, or publish monitoring output.

## 2. Approved source additions

Exactly six source rows are approved in PR #322.

### 2.1 TrueUSD transparency

```text
source_id: trueusd-transparency
asset: sog_st_tusd
organization: sog_issuer_trueusd
URL: https://tusd.io/transparency
families: reserve_assurance
signals: reserve_update, assurance_update
```

The official page describes reserve transparency and daily attestations.

### 2.2 Angle EURA overview

```text
source_id: angle-eura-overview
asset: sog_st_eura
organization: sog_issuer_angle
URL: https://docs.angle.money/
families: reserve_assurance, redemption_terms
signals: reserve_update, issuance_redemption_update
```

The official documentation describes segregated stablecoin reserves, Transmuter reserve baskets, and permissionless redemption behavior.

### 2.3 SG-FORGE EUR CoinVertible

```text
source_id: sgforge-eurcv-coinvertible
asset: sog_st_eurcv
organization: sog_issuer_sg_forge
URL: https://www.sgforge.com/product/coinvertible/
families: reserve_assurance, redemption_terms
signals: reserve_update, issuance_redemption_update
```

The official product page describes cash backing, segregated collateral, daily disclosure, subscription, and 1:1 redemption.

### 2.4 Eurite EURI overview

```text
source_id: eurite-euri-overview
asset: sog_st_euri
organization: sog_issuer_banking_circle
URL: https://www.eurite.com/
families: reserve_assurance, redemption_terms
signals: reserve_update, assurance_update, issuance_redemption_update
```

The official page describes 1:1 cash backing, segregated safeguarded funds, attestation, and redemption.

### 2.5 Quantoz EURQ and USDQ overview

```text
source_id: quantoz-eurq-usdq
asset: sog_st_eurq
organization: sog_issuer_quantoz_payments
URL: https://www.quantoz.com/products/eurq-usdq
families: reserve_assurance, redemption_terms
signals: reserve_update, issuance_redemption_update
```

The official page describes reserve assets, segregation, and issuer redemption rights at par.

### 2.6 VNX VCHF overview

```text
source_id: vnx-vchf-overview
asset: sog_st_vchf
organization: sog_issuer_vnx_commodities
URL: https://vnx.li/vchf/
family: redemption_terms
signal: issuance_redemption_update
```

The official product page describes exchange between VCHF and Swiss francs. PR #322 does not infer reserve composition from that page.

## 3. Source-row rule

Each added source row must:

- use HTTPS;
- identify the exact canonical asset and organization IDs;
- use an allowlisted first-party host;
- contain only approved reserve/assurance/redemption signal types;
- remain enabled for review-only observation;
- have exactly one matching pending baseline row;
- preserve canonical action `none`.

PR #322 must not add lifecycle or regulatory signal types to the six new rows.

## 4. Baseline rule

Each new source receives one row in:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

All six new rows must use:

```text
status: pending_initial_acceptance
```

All accepted-only fields remain null.

The baseline set remains internal. PR #322 does not fetch live pages for acceptance and does not convert any existing row to `accepted`.

## 5. Historical PR #321 checkpoint preservation

The PR #321 snapshot remains immutable historical state:

```text
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

Its validator checks the historical fixed counts and digests directly.

PR #322 must not rewrite PR #321 source/baseline counts or digests.

## 6. Binding PR #322 expansion snapshot

The current post-expansion state is fixed in:

```text
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

The snapshot records:

- audited checkpoint ID;
- canonical counts;
- current source/baseline counts;
- pending/accepted/missing baseline counts;
- registered asset reach;
- uncovered asset count;
- covered organization count;
- accepted asset reach;
- multi-family asset count;
- source-family source counts;
- asset-family reach counts;
- deterministic asset, organization, source/baseline, uncovered queue, allowlist-file, and baseline-file digests;
- expansion source IDs;
- safety policy.

## 7. Generator and validator

Current observation generator:

```text
scripts/generate-monitoring-baseline-sync-100-assets.mjs
```

PR #322 binding validator:

```text
scripts/validate-monitoring-reserve-redemption-expansion-100-assets.mjs
```

The validator regenerates current monitoring state and compares it exactly with the PR #322 expansion snapshot.

It also verifies:

- the six approved source IDs exist exactly once;
- no unapproved PR #322 source ID is added;
- each approved source uses the specified canonical asset and organization IDs;
- allowed hosts match the configured first-party host family;
- signal types remain within reserve/assurance/redemption scope;
- every source has a matching pending baseline row;
- accepted count remains zero;
- accepted asset reach remains zero;
- historical PR #321 snapshot validator still passes.

## 8. Expected direction of coverage change

PR #322 is intended to increase registered source reach for reserve and redemption research.

The exact post-expansion counts and digests must be derived by the deterministic generator and captured in the binding PR #322 snapshot. They must not be guessed by hand.

PR #322 should produce:

- six additional reviewed source rows;
- six additional pending baseline rows;
- six newly reached canonical assets if none were previously covered;
- reserve/assurance family expansion;
- redemption-terms family expansion;
- no lifecycle/regulatory family expansion;
- zero accepted coverage.

## 9. Safety boundary

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

External web review used to select first-party source URLs is research input to the PR. The deterministic repository snapshot generator itself performs no network access.

## 10. Explicit non-goals

PR #322 does not:

- accept any monitoring baseline;
- add lifecycle sources;
- add regulatory sources;
- add platform-policy sources;
- add platform service-state sources;
- add regulatory-register sources;
- add EU/EEA market-access observation schema;
- change signal taxonomy;
- change normalization version;
- schedule monitoring;
- write canonical data;
- create evidence records automatically;
- edit public guides automatically;
- create automatic branches or canonical pull requests;
- publish monitoring candidates;
- deploy monitoring output.

Lifecycle, regulatory, and EU market-access source/schema expansion remains PR #323. Bounded scheduled read-only monitoring remains PR #324.

## 11. Completion condition

PR #322 is complete when:

```text
six approved source rows exist
six matching pending baseline rows exist
no baseline is accepted
historical PR #321 snapshot remains unchanged and valid
PR #322 current expansion snapshot exists
current observation matches expansion snapshot exactly
source/baseline ID parity is true
coverage expansion counts are recorded deterministically
accepted baseline count remains zero
accepted asset reach remains zero
monitoring validation chain includes PR #322 validator
dedicated PR #322 CI workflow passes
authority shows PR #322 active / PR #323 next
full CI and monitoring-related workflows are green
```
