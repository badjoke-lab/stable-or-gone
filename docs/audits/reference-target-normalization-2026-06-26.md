# SOG reference target normalization audit

Status: supporting audit  
Recorded: 2026-06-26  
Phase: 2 / PR 7  
Record checkpoint: 92 canonical stable assets

## 1. Purpose

This audit records the separation of four concepts that older public pages presented as one peg value:

```text
reference kind
canonical reference asset or methodology code
public reference label
comparison category
```

A reference target is not a market price, redemption quote, recovery status, or safety judgment. Complex floating and indexed targets retain their methodology instead of being flattened into a fiat label.

## 2. Canonical coverage

```text
Stable assets:                 92
Classification records:       92
Missing reference kind:        0
Missing reference asset:       0
Unmapped reference asset:      0
Kind/mapping contradictions:   0
```

Generated reports:

```text
data/generated/reference-target-migration.json
data/generated/reference-target-validation.json
```

Validation command:

```text
npm run validate:reference-target
```

## 3. Reference kind distribution

| Reference kind | Count |
|---|---:|
| Fiat | 88 |
| Commodity | 2 |
| Floating | 1 |
| Index | 1 |
| **Total** | **92** |

## 4. Public comparison categories

The public filter and statistics layer uses seven approved categories.

| Comparison category | Count |
|---|---:|
| US dollar | 71 |
| Euro | 8 |
| Japanese yen | 3 |
| Other fiat currency | 5 |
| Gold | 2 |
| Floating protocol target | 1 |
| Indexed or inflation-linked target | 2 |
| **Total** | **92** |

These categories support comparison without replacing the canonical record-level reference definition.

## 5. Canonical reference values

Canonical values remain available for data integrity and compatibility.

| Canonical value | Count | Public label |
|---|---:|---|
| USD | 71 | US dollar |
| EUR | 8 | Euro |
| JPY | 3 | Japanese yen |
| AED | 1 | UAE dirham |
| BRL | 1 | Brazilian real |
| CHF | 1 | Swiss franc |
| SGD | 1 | Singapore dollar |
| TRY | 1 | Turkish lira |
| GOLD | 2 | Gold |
| RAI_REDEMPTION_PRICE | 1 | Floating protocol redemption price |
| AMPL_CPI_ADJUSTED_TARGET | 1 | CPI-adjusted AMPL target |
| USD_WITH_TRUFLATION_LINKED_REBASE | 1 | US dollar with Truflation-linked rebase |

## 6. Complex reference records

Three records previously risked exposing implementation-style identifiers as default public text.

| Record | Canonical code | Public label | Comparison category |
|---|---|---|---|
| Nuon | `USD_WITH_TRUFLATION_LINKED_REBASE` | US dollar with Truflation-linked rebase | Indexed or inflation-linked target |
| RAI | `RAI_REDEMPTION_PRICE` | Floating protocol redemption price | Floating protocol target |
| SPOT | `AMPL_CPI_ADJUSTED_TARGET` | CPI-adjusted AMPL target | Indexed or inflation-linked target |

The detail page preserves a methodology description for each record. The canonical code remains machine-usable but is not the default public label.

## 7. Public presentation changes

The following surfaces now use the normalized reference layer:

```text
home selected-record table
stablecoin index rows
stablecoin index search
stablecoin index sorting
stablecoin index filters
stablecoin detail overview
stablecoin detail metadata keywords
```

The stablecoin index filters by approved comparison category rather than by enumerating raw reference codes.

The detail overview separately displays:

```text
Reference target
Reference kind
Comparison category
Target value
Reference methodology
```

## 8. Machine-readable and statistics changes

The public machine-readable breakdown now exposes:

```text
reference_kind
reference_comparison_category
```

It does not expose raw reference codes as the normal public aggregation axis.

Registry statistics now expose:

```text
composition.reference_target_categories
```

Canonical codes are retained only as compatibility diagnostics:

```text
composition.canonical_reference_assets_compatibility
```

## 9. Mapping source

The approved mapping source is:

```text
config/reference-targets.mjs
```

It defines for every current canonical reference value:

```text
reference_kind
comparison_category
public_label
methodology_description
```

The UI resolves these fields through:

```text
src/utils/referenceTarget.ts
```

## 10. Validation guarantees

The validator rejects:

- missing classification coverage;
- missing reference kind or asset;
- unregistered canonical reference values;
- disagreement between a record's kind and its approved mapping;
- duplicate comparison categories, labels, or sort orders;
- public labels that expose implementation identifiers;
- missing methodology descriptions;
- direct public UI reads from `coin.peg_asset` or the canonical reference code;
- restoration of the legacy raw peg filter;
- machine-readable aggregation by raw reference code;
- statistics that treat canonical codes as the normal comparison axis.

## 11. Non-scope

This work does not change:

- market-price history;
- depeg or recovery events;
- redemption value or access;
- backing-model classification;
- stabilization-mechanism classification;
- event taxonomy;
- deployment state;
- canonical record counts;
- production deployment state.
