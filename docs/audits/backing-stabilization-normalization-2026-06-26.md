# SOG backing and stabilization normalization audit

Status: supporting audit  
Recorded: 2026-06-26  
Phase: 2 / PR 8  
Record checkpoint: 92 canonical stable assets

## 1. Purpose

This audit records the separation of four concepts that older public pages compressed into one free-text model field:

```text
public comparison model
canonical non-exclusive backing types
reserve component records
primary stabilization mechanism
```

The public comparison model is a browsing and filtering category. It is not a safety score, reserve-quality judgment, redemption guarantee, or replacement for the underlying record.

## 2. Canonical coverage

```text
Stable assets:                    92
Classification records:          92
Reviewed public assignments:     92
Missing public model category:    0
Missing canonical backing type:   0
Missing stabilization mechanism:  0
Reserve component records:      125
```

Generated reports:

```text
data/generated/backing-stabilization-migration.json
data/generated/backing-stabilization-validation.json
```

Validation command:

```text
npm run validate:backing-stabilization
```

## 3. Approved public comparison models

Every canonical stable asset has one reviewed public comparison category.

| Public model category | Count |
|---|---:|
| Fiat and cash-equivalent backed | 31 |
| Crypto-collateralized | 27 |
| Hybrid or mixed | 10 |
| Tokenized asset-backed | 7 |
| Synthetic or hedged | 6 |
| Algorithmic or unbacked | 4 |
| Wrapper or receipt | 3 |
| Commodity-backed | 2 |
| Unknown | 2 |
| Other | 0 |
| **Total** | **92** |

The two `unknown` assignments remain limited to AE Coin and VCHF. They are not forced into a stronger category without sufficient canonical support.

## 4. Canonical backing types

Canonical backing types remain non-exclusive. A record may contain several values.

| Backing type | Records using the type |
|---|---:|
| Mixed | 33 |
| Stablecoin collateral | 27 |
| Crypto collateral | 26 |
| Cash | 18 |
| Government securities | 18 |
| Bank deposits | 14 |
| Tokenized fund | 10 |
| Other | 5 |
| Unbacked | 4 |
| Unknown | 4 |
| Commodity | 2 |
| Private credit | 1 |
| Receivables | 1 |
| Secured loans | 1 |

These counts overlap and must not be summed as an exclusive distribution.

## 5. Primary stabilization mechanisms

| Stabilization mechanism | Count |
|---|---:|
| Issuer redemption | 42 |
| Hybrid | 17 |
| Overcollateralized vault | 15 |
| Protocol arbitrage | 8 |
| Algorithmic supply | 4 |
| Delta neutral | 2 |
| Fund-share valuation | 2 |
| Rebasing or repricing | 2 |
| **Total** | **92** |

The primary mechanism is displayed separately from backing composition. For example, a record can use mixed backing while its primary stabilization mechanism is issuer redemption or protocol arbitrage.

## 6. Public presentation changes

The following public surfaces now use the normalized layer:

```text
home selected-record table
stablecoin index rows
stablecoin index search
stablecoin index sorting
stablecoin index filters
stablecoin detail overview
stablecoin detail metadata keywords
```

The stablecoin index now filters by a finite reviewed public model category. It no longer derives filter options from free-text `collateral_model` values.

The stablecoin detail overview separately displays:

```text
Public backing model
Canonical backing types
Reserve component categories
Primary stabilization mechanism
Recorded model description
```

The detail page also displays reserve component records and a separate list of related historical model-change events.

## 7. Reserve components and model history

Reserve components remain record-level data and are not collapsed into the public model category. Where available, the detail page preserves:

```text
asset label
asset category
share percentage
liquidity class
maturity bucket
as-of date
notes
```

Historical model changes remain event records. A current public category does not erase prior collateral, reserve, governance, migration, rebrand, or protocol-transition history.

## 8. Machine-readable and statistics changes

The public machine-readable breakdown now exposes:

```text
public_model_category
backing_type_non_exclusive
stabilization_mechanism
```

Registry statistics expose:

```text
composition.public_model_categories
composition.backing_types_non_exclusive
composition.stabilization_mechanisms
composition.reserve_component_categories
```

The names explicitly distinguish the one-category public comparison model from non-exclusive canonical backing types.

## 9. Mapping source

The reviewed record-level mapping source is:

```text
config/backing-models.mjs
```

It assigns exactly one public model category to every current canonical slug.

The UI resolves public and canonical fields through:

```text
src/utils/backingModel.ts
```

The finite category definitions remain governed by:

```text
config/public-taxonomy.mjs
```

## 10. Validation guarantees

The validator rejects:

- missing or extra record-level assignments;
- unknown public category values;
- duplicate public category values, labels, or sort orders;
- missing canonical backing types;
- missing primary stabilization mechanisms;
- missing recorded model descriptions;
- restoration of a filter derived from free-text `collateral_model` values;
- public list or home presentation that bypasses the reviewed model mapping;
- detail pages that omit canonical backing, reserve components, stabilization, or recorded model detail;
- machine-readable output that omits exclusive/non-exclusive distinctions;
- statistics that omit the reviewed public model axis.

## 11. Non-scope

This work does not change:

- lifecycle or issuance status;
- reference target or peg methodology;
- reserve-report applicability;
- redemption access or redemption value;
- event category normalization;
- evidence reliability taxonomy;
- deployment status;
- canonical record counts;
- production deployment state.
