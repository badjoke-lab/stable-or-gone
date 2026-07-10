# SOG Comparison Readiness Normalization — PR #338

Status: canonical implementation specification  
Updated: 2026-07-09  
Source audit: `sog_comparison_readiness_audit_pr337_110_assets`  
Checkpoint: `sog_controlled_growth_110_checkpoint_pr335_2026_07_09`

## 1. Purpose

PR #338 consumes the reviewed PR #337 normalization queue and performs only the bounded canonical normalization required to remove those findings.

The reviewed queue contains exactly twenty rows. Every row is:

```text
dimension_id: asset_class
state: needs_normalization
reason_code: missing_asset_class
```

No integrity blocker exists in the source audit.

## 2. Binding queue

The sole source of targets is:

```text
data/quality/comparison-readiness-normalization-queue-pr337.json
```

The target assets are exactly:

```text
sog_st_busd
sog_st_crvusd
sog_st_dai
sog_st_eurc
sog_st_fdusd
sog_st_frax
sog_st_gusd
sog_st_lusd
sog_st_pyusd
sog_st_rlusd
sog_st_susd
sog_st_tusd
sog_st_usdc
sog_st_usdd
sog_st_usde
sog_st_usdg
sog_st_usdp
sog_st_usds
sog_st_usdt
sog_st_ust
```

PR #338 may not expand the target set without a new reviewed audit finding.

## 3. Canonical change

All twenty queue targets are canonical stablecoin records in `data/stablecoin-classification-v2.json` and already have stablecoin-specific peg, issuance, backing, stabilization, and governance classification fields.

PR #338 adds only:

```json
"asset_class": "stablecoin"
```

to those twenty classification rows.

No lifecycle, issuance, peg-reference, backing, stabilization, governance, legal, reserve, redemption, deployment, event, evidence, or known-unknown value may change as part of this normalization.

## 4. Re-audit requirement

After the canonical normalization, PR #338 must regenerate the PR #337 Comparison Readiness audit using the same fixed PR #336 contract.

Expected result:

```text
asset_count: 110
dimension_count: 19
comparison_cell_count: 2090

ready: 0
ready_with_unknowns: 110
needs_normalization: 0
integrity_blocked: 0

normalization_queue_count: 0
integrity_blocked_dimension_count: 0
needs_normalization_dimension_count: 0
```

The expected `ready_with_unknowns` result is not a defect. The fixed contract intentionally preserves unresolved but explicit states such as legal uncertainty, reserve-report date gaps, market-access schema deferral, launch-date uncertainty, and known unknowns.

## 5. Market-access boundary

PR #338 does not create Market Access Records.

For all 110 assets, the readiness audit must continue to report:

```text
dimension_id: market_access_applicability
state: ready_with_unknowns
readiness_scored: false
reason_code: deferred_canonical_schema
```

## 6. Validation requirements

PR #338 validation must prove:

- queue ID and source audit ID are exact;
- queue count is exactly twenty;
- all twenty queue rows target only `asset_class`;
- all twenty use `missing_asset_class`;
- target asset IDs are unique;
- the canonical classification set contains every target exactly once;
- every target now has `asset_class: stablecoin`;
- no non-target record is changed by the PR #338 canonical normalization step;
- canonical asset denominator remains 110;
- deterministic re-audit contains 2,090 cells;
- re-audit normalization queue is empty;
- re-audit contains zero integrity blockers;
- all 110 asset overall states are `ready_with_unknowns`;
- market access remains deferred and unscored for all 110 assets;
- no score, ranking, recommendation, price, market-cap, APY, safety-score, or risk-score output is introduced.

## 7. Explicit non-goals

PR #338 does not:

- change the PR #336 readiness contract;
- add assets;
- remove assets;
- change lifecycle history;
- fill unresolved reserve, redemption, legal, launch-date, deployment, or regulatory fields;
- create Market Access Records;
- implement comparison projection;
- implement `/compare/`;
- publish readiness results publicly;
- score or rank assets.

## 8. Deployment classification

Canonical classification normalization, internal reviewed queue preservation, deterministic re-audit validation, and read-only CI only. No new public route, public API surface, monitoring publication, or Cloudflare configuration change is authorized.
