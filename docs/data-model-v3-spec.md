# SOG Registry v3 data-model specification

Status: implementation specification  
Migration mode: additive and backward-compatible  
Base: protected forty-record Registry v2 checkpoint

## Objective

Registry v3 extends the current model so that SOG can accurately represent legal structure, stable-asset lineage, structured reserves, deployment canonicality, yield mechanics, and additional historical events.

Registry v3 must not:

- change existing canonical IDs without a dedicated migration
- change existing slugs or public URL patterns
- delete Registry v2 fields before compatibility validation proves removal safe
- merge distinct historical identities
- create separate canonical assets merely for chain deployments or simple wrappers

## Existing model retained

```text
stable_asset
organization
stablecoin_organization_relationship
classification
reserve_and_redemption_profile
event
event_detail
evidence
evidence_relation
reserve_report
known_unknown
regulatory_note
deployment
```

## New record groups

### Legal profile

Suggested file group:

```text
data/legal-profiles*.json
```

Shape:

```json
{
  "id": "sog_st_example",
  "classifications": [
    {
      "classification": "e_money_token",
      "jurisdiction": "EU",
      "effective_from": null,
      "effective_to": null,
      "authority_or_basis": null,
      "confidence": "high",
      "evidence_ids": []
    }
  ],
  "holder_claim_type": "direct_claim_on_issuer",
  "claim_against_organization_ids": [],
  "reserve_ownership": "issuer_owned_for_holders",
  "reserve_segregation": "stated_segregated",
  "bankruptcy_remoteness": "stated",
  "licensed_or_regulated_as": [],
  "notes": null,
  "evidence_ids": []
}
```

Suggested enums:

```text
reserve_ownership
  issuer_owned
  issuer_owned_for_holders
  trust_or_custodial
  fund_owned
  protocol_controlled
  holder_owned
  mixed
  unclear
  unknown

reserve_segregation
  legally_segregated
  stated_segregated
  operationally_separate
  not_segregated
  not_applicable
  unclear
  unknown

bankruptcy_remoteness
  confirmed
  stated
  limited
  not_established
  not_applicable
  unclear
  unknown
```

Legal profiles are evidence-backed descriptions, not legal opinions.

### Stable-asset relationship

Suggested file group:

```text
data/stable-asset-relationships*.json
```

Shape:

```json
{
  "id": "sog_ar_example",
  "from_asset_id": "sog_st_wrapper",
  "to_asset_id": "sog_st_base",
  "relationship_type": "yield_wrapper_of",
  "status": "active",
  "start_date": null,
  "end_date": null,
  "conversion_terms": null,
  "evidence_ids": [],
  "notes": null
}
```

Relationship types:

```text
predecessor_of
successor_of
rebranded_as
migrated_to
wrapper_of
yield_wrapper_of
receipt_for
bridged_representation_of
redeemable_into
collateralized_by
basket_contains
fork_of
other
unknown
```

Relationship direction must be documented and tested.

### Reserve component

Suggested file group:

```text
data/reserve-components*.json
```

Shape:

```json
{
  "id": "sog_rc_example",
  "stablecoin_id": "sog_st_example",
  "reserve_report_id": "sog_rr_example",
  "asset_category": "government_securities",
  "asset_label": null,
  "share_percent": 72.5,
  "amount_text": null,
  "currency": "USD",
  "liquidity_class": "high",
  "maturity_bucket": "under_90_days",
  "custodian_organization_id": null,
  "as_of_date": "2026-03-31",
  "confidence": "high",
  "evidence_ids": [],
  "notes": null
}
```

Reserve components are optional and time-scoped. Do not invent percentages to force totals to 100.

## Existing record extensions

### Peg reference

Add:

```text
basket
```

to the core peg-reference kinds.

Optional fields:

```json
{
  "basket_component_ids": [],
  "index_provider_organization_id": null,
  "reference_methodology_url": null
}
```

### Backing types

Add:

```text
private_credit
receivables
corporate_bonds
secured_loans
insurance_or_guarantee
```

### Stabilization mechanisms

Consider adding:

```text
bank_deposit_claim
fund_share_valuation
commodity_redemption
rebasing_or_repricing
```

### Yield profile

Extend the existing yield profile:

```json
{
  "mode": "yield_bearing",
  "accrual_target": "asset",
  "yield_source": "reserve_income",
  "accrual_mechanism": "exchange_rate_increase",
  "rate_type": "variable",
  "rate_source": null,
  "notes": null
}
```

### Deployment v2

Extend deployment records:

```json
{
  "canonicality": "issuer_native",
  "origin_deployment_id": null,
  "bridge_operator_organization_id": null,
  "mint_authority_type": "issuer_multisig",
  "contract_version": null,
  "is_primary": true
}
```

Canonicality values:

```text
native
issuer_native
canonical_bridge
third_party_bridge
wrapped
synthetic
legacy
unknown
```

### Event detail kinds

Add:

```text
security_incident
oracle_failure
collateral_impairment
insolvency
governance_change
bridge_or_chain_incident
termination
launch
```

Each new kind receives a typed detail object before canonical use.

## Reference rules

- Every legal profile ID must reference one canonical stable asset.
- Every stable-asset relationship endpoint must exist.
- Relationship self-links are invalid unless an explicitly allowed rebrand representation requires one; the preferred model is normally an event and aliases for same-identity rebrands.
- Every reserve component must reference a canonical stable asset and, when supplied, an existing reserve report and custodian organization.
- Every deployment origin and bridge operator must reference existing records.
- Every evidence ID must exist.
- Every enum value must be validated.
- Date ranges must not end before they begin.

## Required coverage

### Existing forty records

Migration requires:

- legal profile present, even when classification is `unclassified` or `unknown`
- stable-asset relationships for known migrations, predecessors, successors, wrappers, and material conversions
- deployment canonicality for every existing deployment
- expanded yield mechanics for every record
- reserve components only where reliable structured data exists
- known unknowns for unresolved legal and deployment questions

### New records after Registry v3

Every promoted asset must include:

- canonical identity
- classification
- reserve and redemption profile
- legal profile
- organization relationship
- at least one meaningful lifecycle event and typed event detail
- scoped evidence
- known unknowns
- deployment records when verifiable
- stable-asset relationships when applicable
- Candidate Master promotion
- baseline and loader integration

## Loader and file policy

Batch files remain acceptable, but every file must be listed in the protected baseline and connected to the appropriate runtime loader.

Suggested loader additions:

```text
getLegalProfiles()
getStableAssetRelationships()
getReserveComponents()
```

Public page code must consume composed canonical loaders rather than importing batch files directly.

## Compatibility policy

Registry v2 remains readable throughout migration.

During the transition:

- new fields are additive
- legacy fields remain available
- compatibility validators reject conflicting values
- public pages can adopt Registry v3 fields incrementally
- machine-readable public data exposes only reviewed canonical data
- candidate, monitoring, and private research data remain excluded

## Validation additions

Add dedicated validators for:

```text
legal profiles
stable-asset relationships
reserve components
deployment v2
yield mechanics
expanded event details
Registry v3 completeness
```

The batch finalization guard must be extended to include new data groups and runtime loaders.

## Public display policy

Registry v3 fields should be presented as factual descriptors:

- no safety score
- no risk score
- no legal conclusion beyond sourced classification
- no implied guarantee from reserve composition
- no yield recommendation
- no live ranking

Unknown and disputed states remain visible.
