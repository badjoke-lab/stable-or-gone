# Stable or Gone public taxonomy specification

Status: canonical specification  
Updated: 2026-06-26

## 1. Purpose

This specification defines how canonical registry values become public labels, public filter categories, list summaries, and statistics groups.

It complements, but does not replace:

```text
docs/classification-spec.md
docs/data-model-v3-spec.md
```

Canonical record meaning remains in those data specifications. This file governs the public presentation and compatibility mapping layer.

## 2. Core rule

Every enum-like public value must be resolved through an approved mapping layer.

Required mapping fields:

```text
canonical_value
public_category
public_label
legacy_aliases
sort_order
```

Optional fields:

```text
short_definition
long_definition
visual_tone
is_filterable
is_deprecated
```

The public UI must not generate category definitions by collecting arbitrary unique free-text values from records.

## 3. Canonical, public, and legacy separation

### Canonical value

The stored reviewed meaning used by validators, loaders, machine-readable output, and record logic.

### Public category

A stable comparison or navigation group. It may group several canonical values but must not overwrite or replace them.

### Public label

Human-readable text shown in the interface.

### Legacy alias

An older value accepted only for migration and compatibility validation. It must not remain the default public label after migration.

## 4. Lifecycle

Canonical values remain:

```text
announced
active
restricted
suspended
winding_down
inactive
terminated
collapsed
migrated
rebranded
unknown
```

Approved public groups:

```text
operating
  active

constrained
  restricted
  suspended
  winding_down

historical_non_failure
  inactive
  terminated
  migrated
  rebranded

failed
  collapsed

other
  announced
  unknown
```

Rules:

- public detail pages show the canonical lifecycle label;
- list filters may use either canonical lifecycle or an explicitly labelled group view;
- group labels never replace canonical lifecycle in record detail;
- legacy values such as `failed`, `discontinued`, `limited`, or similar compatibility values require a reviewed mapping;
- price behavior alone does not determine lifecycle.

## 5. Issuance

Canonical issuance remains separate from lifecycle:

```text
open
restricted
paused
terminated
protocol_based
unknown
```

Rules:

- issuance must not be represented by the lifecycle chip;
- an asset may be active with restricted issuance;
- an asset may remain historically relevant after issuance terminates.

## 6. Reference target

Canonical reference kinds:

```text
fiat
commodity
crypto_asset
index
basket
floating
protocol_internal
none
unknown
```

Public presentation requires:

```text
reference kind
reference asset or code
public label
methodology description when non-obvious
```

Examples:

```text
fiat + USD → US dollar
fiat + EUR → euro
commodity + XAU → gold
floating + RAI methodology → floating redemption price
index + CPI methodology → CPI-adjusted target
```

Internal identifiers such as implementation constants must not be the default public label.

## 7. Public backing/model categories

Canonical backing types remain multi-select and detailed. Public comparison uses these approved high-level categories:

```text
fiat_and_cash_equivalent
crypto_collateralized
tokenized_asset_backed
commodity_backed
algorithmic_or_unbacked
synthetic_or_hedged
hybrid_or_mixed
wrapper_or_receipt
other
unknown
```

Rules:

- a public category is derived from reviewed canonical fields;
- detailed backing types and reserve components remain visible in detail pages;
- protocol-specific mechanism prose must not become a filter option;
- multi-category assets may expose more than one category when the specification explicitly permits it;
- statistics must document whether counts are exclusive or multi-select.

## 8. Stabilization mechanism

Canonical mechanisms remain separate from public backing category.

Current canonical mechanisms include:

```text
issuer_redemption
overcollateralized_vault
algorithmic_supply
delta_neutral
protocol_arbitrage
hybrid
bank_deposit_claim
fund_share_valuation
commodity_redemption
rebasing_or_repricing
other
unknown
```

The detail page must preserve the precise mechanism. The index may show a short approved label but must not merge mechanism and backing into one misleading field.

## 9. Event taxonomy

Approved public categories:

```text
launch
depeg
recovery
reserve
redemption
regulatory
control
security
migration
wind_down
governance
other
```

Each event also keeps a precise canonical subtype or typed detail kind.

Rules:

- `Launch`, `Launched`, `Product launch`, `Network launch`, and similar legacy values map to the public `launch` category while preserving a precise subtype;
- migration, rebrand, conversion, and protocol transition require reviewed subtype mapping;
- wind-down announcement, final redemption, and termination remain distinguishable subtypes;
- event filters use public categories;
- event detail exposes the precise subtype and typed facts;
- implementation phrases such as registry overlay names are not public labels.

## 10. Organization taxonomy

Organization presentation must separate:

```text
organization_category
legal_form
functional_roles
jurisdiction
regulatory_character
```

Approved high-level organization categories may include:

```text
company
bank_or_trust
fund_or_investment_vehicle
protocol_or_dao
government_or_regulator
network_or_infrastructure
service_provider
other
unknown
```

Functional roles remain relationship data, including:

```text
legal issuer
brand owner
protocol operator
governance body
reserve manager
custodian
redemption agent
distribution or liquidity partner
network or infrastructure provider
other material role
```

Rules:

- an organization category does not replace its roles;
- public wording uses `Organizations` even while compatibility routes remain `/issuers/` and `/issuer/[slug]/`;
- compatibility URL details must not appear as organization facts;
- one organization may have multiple roles across time and assets.

## 11. Primary relationship

Primary display relationship must be explicit or derived by a documented deterministic priority.

It must not be selected by array order.

Required concepts:

```text
is_primary_for_display or approved equivalent
role priority
current versus historical
start date
end date
relationship status
```

Validation must reject:

- more than one unintended current primary display relationship;
- a primary relationship pointing to a missing organization;
- a historical ended relationship presented as current without an explicit reason.

The UI must indicate additional organizations and roles when they exist.

## 12. Evidence taxonomy

Evidence fields are independent:

```text
source_type
source_provenance
is_primary
reliability
publisher
published date
archive status
claim scopes
```

Reliability values must remain quality assessments such as:

```text
high
medium
low
unknown
```

Source provenance or medium values such as repository, explorer, interface, regulator, issuer, archive, or news source must not occupy the reliability axis.

One evidence source may support multiple claim scopes. The public UI should show one source entry with multiple supported claims rather than accidental duplicate rows.

## 13. Deployment taxonomy

Deployment presentation must separate:

```text
deployment status
canonicality
contract identity
verification status
control capabilities
observed control events
```

Canonicality may include:

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

Verification state may include:

```text
verified
partially_verified
unverified
not_applicable
unknown
```

Rules:

- work-queue values such as source-review placeholders are not deployment status;
- an unverified contract address is null or explicitly unverified, not stored as a placeholder string;
- material unresolved deployment identity creates or links to a known-unknown record;
- a deployment does not create a new canonical stable asset by itself.

## 14. Value-state taxonomy

Approved public value states:

```text
known
unknown_after_review
not_recorded
not_applicable
not_public
unverified
disputed
approximate
```

Public-label guidance:

```text
known                show the value
unknown_after_review Unknown after review
not_recorded         Not yet recorded
not_applicable       Not applicable
not_public           Not publicly disclosed
unverified           Not yet verified
disputed             Disputed
approximate          Approximate
```

Rules:

- blank, null, and unknown are not automatically interchangeable;
- `—` may be used only when the surrounding label and accessible text preserve the exact state;
- known unknowns are reviewed records and must not be reduced to missing data;
- unsupported dates remain null with an approved value state.

## 15. Public filter rules

Every filter must have:

```text
approved field
approved category list
public labels
sort order
URL query key
clear behavior
empty-state behavior
```

Filters must not:

- enumerate arbitrary free-text descriptions;
- expose internal constants as default labels;
- imply safety, quality, or investment ranking;
- collapse multiple independent axes into one ambiguous field.

## 16. Statistics rules

Statistics consume canonical values and approved derived public groups.

They must not consume:

- legacy public labels;
- raw display strings;
- work-queue placeholder values;
- arbitrary unique free text.

`docs/stats-spec.md` remains authoritative for statistical content, but all groupings must comply with this file.

## 17. Migration requirements

The taxonomy migration must produce:

- a complete legacy-to-canonical mapping;
- a complete canonical-to-public mapping;
- unmapped-value failure checks;
- before-and-after counts;
- per-record exceptions;
- compatibility validation;
- a report of removed public placeholder values;
- a report of remaining explicit unknown states.

No legacy value may silently map by string similarity alone when meaning is uncertain.

## 18. Change control

Changes to public categories, labels, or legacy mappings require:

1. update to this specification;
2. update to affected canonical data specifications when meaning changes;
3. validator changes;
4. test or fixture changes;
5. roadmap update when sequence or release scope changes.

The approved implementation sequence is `docs/ui-redesign/implementation-plan.md`.
