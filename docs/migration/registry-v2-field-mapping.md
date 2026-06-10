# Registry v2 Field Mapping

Updated: 2026-06-10
Status: compatibility contract

## Purpose

This document defines how the existing SOG fields map to Registry v2 fields during PR-043 through PR-051.

Old fields remain readable during the compatibility period. New records and migrated records should use Registry v2 fields.

## Stablecoin fields

| Legacy field | Registry v2 field | Compatibility rule |
|---|---|---|
| `status` | `lifecycle_status` | Both may exist during migration. Values must be compatible. |
| `issuer_id` | `organization_relationships[]` | The legacy issuer must appear as an organization relationship when both exist. |
| `peg_asset` | `peg_reference` | Legacy display remains until UI v2. |
| `collateral_model` | `backing_types[]` + `stabilization_mechanism` + `governance_model` | No one-to-one automatic conversion is assumed. Migration requires review. |
| `reserve_disclosure_status` | `reserve_profile.disclosure_status` | Both may exist during migration. |
| `redemption_status` | `redemption_profile.status` | Legacy values are not copied mechanically; review is required. |
| `who_can_redeem` | `redemption_profile.eligible_parties` | Copy only after source review. |
| `retail_redemption` | `redemption_profile.retail_access` | Preserve source-backed wording. |
| `institutional_redemption` | `redemption_profile.institutional_access` | Preserve source-backed wording. |
| `minimum_redemption` | `redemption_profile.minimum_amount_text` | Do not convert unknown placeholders into facts. |
| `redemption_region_notes` | `redemption_profile.jurisdiction_restrictions[]` or explanatory notes | Structured restrictions require source review. |

## Lifecycle compatibility

```txt
active       -> active
limited      -> restricted
impaired     -> restricted | suspended
discontinued -> winding_down | inactive | terminated
failed       -> collapsed
rebranded    -> rebranded
migrated     -> migrated
unknown      -> unknown
```

A legacy value and a Registry v2 value may coexist only when they match this compatibility table.

## Organization relationships

A Stablecoin v2 record may contain:

```json
{
  "organization_relationships": [
    {
      "organization_id": "sog_issuer_example",
      "role": "legal_issuer",
      "start_date": null,
      "end_date": null,
      "status": "active",
      "evidence_ids": []
    }
  ]
}
```

When `issuer_id` and `organization_relationships` both exist, the legacy `issuer_id` must be represented in the relationship array.

## Event fields

| Legacy field | Registry v2 field | Compatibility rule |
|---|---|---|
| `stablecoin_id` | `subject_stablecoin_ids[]` | Legacy ID must appear in the array when both exist. |
| `issuer_id` | `subject_organization_ids[]` | Legacy ID must appear in the array when both exist. |
| `recovered` / `recovery_date` | `depeg_detail.recovery_status` / `depeg_detail.recovery_date` | Use only for depeg-like events. |
| `failure_mechanism` | event-specific detail | Preserve the legacy field until Event v2 migration. |
| evidence linked by `event_id` | `evidence_ids[]` | Both directions may coexist during migration. |

## Evidence fields

| Legacy field | Registry v2 field | Compatibility rule |
|---|---|---|
| `stablecoin_id` | `stablecoin_ids[]` | Legacy ID must appear in the array when both exist. |
| `issuer_id` | `organization_ids[]` | Legacy ID must appear in the array when both exist. |
| `event_id` | `event_ids[]` | Legacy ID must appear in the array when both exist. |
| `claim_scope` | `claim_scopes[]` | Legacy scope must appear in the array when both exist. |

## Allowed during compatibility period

- legacy-only records
- v2-only records created from an approved template
- records containing both forms when values are consistent
- nullable dates where exact dates are not supportable

## Rejected during compatibility period

- invalid Registry v2 enum values
- legacy and v2 lifecycle values that conflict
- missing referenced organization, stablecoin, event, evidence, or reserve-report IDs
- malformed subject arrays
- malformed profile objects
- legacy subject IDs omitted from corresponding v2 subject arrays
- invented dates or numeric depeg values used only to satisfy a schema

## Removal point

Legacy fields remain supported until PR-051. Removal requires:

- all existing records migrated
- UI v2 using Registry v2 fields
- methodology updated
- canonical JSON consolidated
- baseline validation still passing
