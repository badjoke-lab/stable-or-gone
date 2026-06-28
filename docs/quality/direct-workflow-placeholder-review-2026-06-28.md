# Direct workflow placeholder review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #224

## Scope

This review covers the 112 direct-value findings classified by the canonical value-state scanner as `work_queue_placeholder` or `mixed_placeholder`.

These are field-level findings across stablecoin, profile, reserve-report, and deployment records. They are not 112 evidence records.

## Inventory

```text
Total findings: 112
Work-queue placeholders: 111
Mixed placeholders: 1

Deployments: 36
Profiles: 11
Reserve reports: 35
Stablecoins: 30
```

The exact finding set is protected by:

```text
sha256:ca105a3d83b34ecd6e3f2108315154f015ebad756871fe6d53ff069d65676711
```

The digest covers sorted keys containing group, source file, record ID, field path, signal, and raw value.

## Dispositions

```text
Replaceable after source review: 67
Intentionally unknown after review: 0
Invalid placeholder encoding: 45
```

### Replaceable after source review

These fields contain exactly `source_review_needed` and expect a concrete canonical value after bounded source review.

```text
Deployments: 31
Profiles: 9
Stablecoins: 27
```

PR #224 does not guess those facts. Deployment resolution remains scheduled for PR #226–#229.

### Intentionally unknown after review

No finding qualifies yet. A work-queue marker does not prove that a completed review found the fact unknowable, non-public, or not applicable.

### Invalid placeholder encoding

`Invalid` refers to the field encoding, not automatically to the entire record.

```text
Reserve reports: 35
Deployments: 5
Profiles: 2
Stablecoins: 3
```

All 35 reserve-report findings are invalid encodings because `source_review_needed` is not an asset category or publisher.

The other ten invalid encodings combine a tentative semantic conclusion with a work marker:

```text
available_or_source_review_needed
final_redemption_or_source_review_needed
inactive_or_source_review_needed
indirect_or_source_review_needed
issuer_supported_source_review_needed
not_applicable_or_source_review_needed
related_asset_source_review_needed
```

These strings conflate separate axes and cannot become public taxonomy values.

## Field distribution

```text
Deployments: chain 2, contract_address 16, status 18
Profiles: institutional_access 3, retail_access 7, disclosure_status 1
Reserve reports: asset_categories 34, publisher 1
Stablecoins: institutional_redemption 4, minimum_redemption 16,
             redemption_status 1, reserve_disclosure_status 1,
             retail_redemption 8
```

## Fixed rules

- Workflow state is not a public data value.
- Classification does not resolve the underlying fact.
- Placeholder strings are not silently converted into a favorable semantic state.
- `unknown_after_review` requires a completed source review.
- Reserve-report asset categories and publishers require typed domain values.
- Deployment resolution remains in PR #226–#229.
- This audit authorizes no automatic canonical replacement.

## Result

PR #224 classifies and protects the exact 112-finding set. It does not mutate the underlying canonical field values.

## Deployment classification

```text
No production deployment required
```
