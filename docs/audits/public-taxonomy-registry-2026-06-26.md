# SOG public taxonomy registry baseline

Status: supporting audit  
Recorded: 2026-06-26  
Registry: `config/public-taxonomy.mjs`  
Specification: `docs/public-taxonomy-spec.md`

## 1. Purpose

This audit records the first complete approved mapping layer between current SOG registry values and public categories, labels, legacy handling, and filter eligibility.

The mapping layer does not rewrite canonical records. It establishes the contract that later migration PRs must follow.

## 2. Generated outputs

```text
data/generated/public-taxonomy-values.json
data/generated/public-taxonomy-registry.json
data/generated/public-taxonomy-validation.json
```

Generation and validation commands:

```text
npm run generate:public-taxonomy-values
npm run generate:public-taxonomy
npm run validate:public-taxonomy
npm run prepare:public-taxonomy
```

## 3. Registry scope

The registry contains:

```text
Managed axes:          26
Mapped entries:       411
Legacy-value rules:    10
Descriptive axes:       3
```

Managed axes include:

- lifecycle and issuance;
- asset class;
- reference kind and reference asset;
- backing type and approved public model category;
- stabilization and governance;
- organization category inputs;
- relationship roles and status;
- event type, detail kind, impact, status effect, and recovery;
- evidence reliability and source type;
- deployment status, type, canonicality, and verification state;
- value-state semantics;
- known-unknown severity;
- redemption status.

## 4. Current-data coverage

The validator compared the registry against the current 92-record canonical dataset and found no unmapped managed values.

| Observed axis | Values | Unmapped |
|---|---:|---:|
| Lifecycle status | 8 | 0 |
| Legacy status | 7 | 0 |
| Issuance status | 5 | 0 |
| Asset class | 5 | 0 |
| Reference kind | 4 | 0 |
| Reference asset | 12 | 0 |
| Backing type | 14 | 0 |
| Stabilization mechanism | 8 | 0 |
| Governance model | 4 | 0 |
| Organization type | 47 | 0 |
| Relationship role | 7 | 0 |
| Relationship status | 3 | 0 |
| Event type | 53 | 0 |
| Event detail kind | 11 | 0 |
| Event impact | 4 | 0 |
| Event status effect | 25 | 0 |
| Recovery status | 3 | 0 |
| Evidence reliability | 8 | 0 |
| Evidence source type | 75 | 0 |
| Deployment status | 22 | 0 |
| Deployment type | 38 | 0 |
| Deployment canonicality | 5 | 0 |
| Known-unknown severity | 3 | 0 |
| Redemption status | 8 | 0 |

## 5. Legacy-value handling

Legacy values are not all treated as simple aliases.

Safe reviewed mappings include:

```text
failed   -> collapsed
limited  -> restricted
impaired -> restricted
```

`discontinued` remains a per-record migration decision because it may correspond to inactive, winding down, or terminated depending on the record history.

Evidence reliability values that actually describe provenance or medium are explicitly marked for split migration rather than silently converted to quality scores:

```text
explorer
primary
primary_interface
primary_or_ecosystem_dashboard
primary_repository
primary_repository_index
```

These values require PR 11 to separate source provenance from reliability.

## 6. Descriptive values excluded from filters

The following axes are explicitly non-filterable:

```text
evidence_claim_scope
known_unknown_topic
reserve_disclosure_status
```

They contain reviewed, record-specific descriptions. They must not be converted into public filter lists by enumerating unique strings.

## 7. Internal reference labels

The registry provides public labels for current implementation identifiers so they are not shown directly as default labels:

```text
AMPL_CPI_ADJUSTED_TARGET         -> CPI-adjusted target
RAI_REDEMPTION_PRICE             -> Floating redemption price
USD_WITH_TRUFLATION_LINKED_REBASE -> US dollar with Truflation-linked rebase
```

PR 7 remains responsible for canonical reference-target normalization.

## 8. Validation guarantees

`validate-public-taxonomy-registry.mjs` rejects:

- missing required mapping fields;
- duplicate canonical values within an axis;
- duplicate or colliding aliases;
- duplicate sort orders;
- legacy rules targeting missing canonical values;
- unregistered current values;
- filterable descriptive axes;
- missing required taxonomy axes.

The validation report is retained as a CI artifact.

## 9. Non-scope

This PR does not:

- change any canonical record meaning;
- migrate lifecycle or issuance data;
- change list filters;
- change public status chips;
- rewrite event, organization, evidence, or deployment records;
- deploy production.

Those changes remain assigned to PRs 6 through 16.
