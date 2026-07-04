# SOG 100-Record Reserve, Redemption, and Backing Applicability Audit

- Audit ID: `sog_registry_100_reserve_redemption_backing_pr300`
- Baseline: `sog_registry_v2_reserve_source_context_2026_06_25_batch_o_batch_p_batch_q_batch_r_batch_s_batch_t`
- Stable assets: **100**
- Classifications: **100**
- Reserve/redemption profiles: **100**
- Reserve-context rows: **108**
- Critical findings: **0**
- Review warnings: **1**

## Reserve Applicability Partition

Every canonical asset is covered by exactly one side of the reserve-applicability partition:

```text
assets covered by reserve-context rows: 88
assets covered by explicit applicability decisions: 12
overlap: 0
uncovered: 0
```

The 12 explicit applicability decisions are:

```text
not_applicable_by_design: 10
source_status_unresolved: 2
```

The unresolved source-status assets are:

```text
sog_st_eurt
sog_st_husd
```

They remain unresolved because reviewed evidence does not support inventing a product-specific reserve-report boundary.

## Cross-Layer Consistency

```text
classification/profile backing mismatches: 0
invalid latest-report references: 0
missing reserve evidence references: 0
missing redemption evidence references: 0
invalid redemption URLs: 0
applicability decision evidence gaps: 0
issuer-redemption/not-applicable conflicts: 0
unbacked/available-disclosure conflicts: 0
```

Backing type semantics agree between classification and reserve-profile layers for all 100 assets.

## Reserve Context Date Semantics

The audit distinguishes a dated period report from a reserve-context or index row.

```text
reserve-context rows without period-specific report_date: 64
```

These rows include transparency indexes, attestation indexes, protocol documentation, proof-of-reserve entry points, historical context, fund disclosure entry points, and other source-context records. They are not treated as invalid merely because they do not assert a period-specific report date.

When `report_date` is present, its format is validated. The audit does not fabricate a date for undated context rows.

## Redemption Review Queues

One lifecycle/redemption combination remains explicitly reviewable:

```text
stablecoin: sog_st_fei
lifecycle_status: terminated
redemption_status: restricted
```

FEI preserves historical final-redemption context. The audit does not silently convert `restricted` to `terminated` without verifying current contract and interface availability.

Ten redemption fields explicitly retain `source_review_needed`:

```text
sog_st_busd   retail_access
sog_st_tusd   retail_access
sog_st_tusd   institutional_access
sog_st_pyusd  institutional_access
sog_st_usdd   retail_access
sog_st_usdd   institutional_access
sog_st_rlusd  retail_access
sog_st_eurc   retail_access
sog_st_usdp   retail_access
sog_st_usdg   retail_access
```

These remain quality queues rather than guessed access conclusions.

## Result

PASS. Every canonical asset has classification and reserve/redemption profile coverage. Classification and reserve-profile backing semantics agree. Reserve-context coverage and explicit applicability decisions form a complete 88 + 12 partition. All checked references are structurally valid.

PR #300 closes with bounded review queues rather than guessed corrections:

```text
critical findings: 0
reserve context rows without period-specific date: 64
FEI lifecycle/redemption review item: 1
redemption source-review-needed fields: 10
reserve source-status unresolved assets: 2
```

The next registry-wide audit item is PR #301: deployment and chain identity integrity.
