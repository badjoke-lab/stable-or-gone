# SOG Comparison Readiness Contract — PR #336

Status: canonical implementation specification  
Updated: 2026-07-09  
Checkpoint: `sog_controlled_growth_110_checkpoint_pr335_2026_07_09`

## 1. Purpose

PR #336 defines how SOG will decide whether reviewed canonical records are structurally ready for deterministic comparison.

This PR does not audit all 110 assets and does not implement Compare UI. It creates the contract that PR #337 must apply to every canonical asset.

The contract answers a narrower question:

> Can a comparison projection render this dimension from reviewed canonical data without inventing facts, collapsing record boundaries, or hiding unresolved states?

Comparison readiness is not a safety, risk, transparency, quality, liquidity, or investment score.

## 2. Binding source boundary

Readiness analysis may read only reviewed canonical registry inputs and reviewed derived metadata that is already deterministically tied to canonical data.

Allowed source families:

```text
stable assets
organizations
stablecoin-organization relationships
classifications and reviewed extensions
reserve/redemption profiles
reserve reports
legal profiles
reserve components
deployments
events and typed event details
evidence and evidence relations
known unknowns
regulatory notes
stable-asset relationships
income profiles
current canonical checkpoint
```

Excluded inputs:

```text
candidate allocations
candidate promotion research before canonical merge
monitoring observations
monitoring candidates
news discovery output
editorial research matrices
article drafts
private notes
unpublished review material
third-party live market metrics
price, market cap, APY, or risk feeds
```

## 3. Protected unresolved states

The readiness program must preserve:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These states are not interchangeable.

A dimension may be comparison-ready while its factual value is unresolved. For example, an asset with `launch_date: null` may be ready when the unresolved-date queue explicitly preserves why a day-level launch date is not known.

The audit must fail or flag normalization when unresolved state is hidden by:

- coercing null to false;
- coercing unknown to unavailable;
- treating missing canonical records as not applicable;
- inferring active service from token persistence;
- inferring legal or market-access status from issuer identity;
- replacing unresolved dates with announcement, listing, migration, or deployment dates.

## 4. Readiness result model

The contract defines four result states.

### `ready`

The comparison dimension has a canonical source, required structural fields are valid, and its value can be projected without unsupported inference.

### `ready_with_unknowns`

The comparison dimension has a canonical source and explicit unresolved state. Compare may render the unresolved state as-is.

### `needs_normalization`

The underlying canonical facts may be usable, but representation is inconsistent, ambiguous, missing a required applicability state, or not safely projectable under one deterministic rule.

### `integrity_blocked`

A structural integrity failure prevents safe comparison, such as a missing identity relationship, broken evidence reference, invalid enum, cross-record reference failure, or contradictory canonical boundary.

PR #337 must report these states per asset and dimension. It must not collapse them into one numeric score.

## 5. Audit dimensions

The machine-readable contract defines nineteen dimensions.

### 5.1 Identity consistency

Source:

```text
stable asset
```

Required for every asset:

```text
id
slug
name
symbol or explicit unresolved state
```

Aliases remain multi-value. A duplicate or conflicting canonical identity is `integrity_blocked`.

### 5.2 Issuer versus asset boundary

Source:

```text
organization
stablecoin-organization relationship
```

Every asset must retain an organization relationship appropriate to its model. The audit must not copy organization-level legal or regulatory claims into the asset root record.

### 5.3 Lifecycle semantics

Source:

```text
classification.lifecycle_status
stable asset legacy status
```

The two layers must remain compatibility-consistent. `unknown` is renderable and does not automatically reduce readiness.

### 5.4 Reference target and currency

Source:

```text
classification.peg_reference
classification.reference_target
stable asset peg_asset compatibility field
```

The projection must preserve non-fiat targets and must not assume USD when reference currency is missing.

### 5.5 Asset class

Source:

```text
classification.asset_class
```

Asset class must come from canonical classification data, not symbol naming or market listings.

### 5.6 Backing model

Source:

```text
classification.backing_types
reserve profile
reserve components when available
```

Backing types are multi-select. Percentages are optional and must never be invented to make reserve components sum to 100.

### 5.7 Stabilization mechanism

Source:

```text
classification.stabilization_mechanism
```

The projection must preserve centralized issuer redemption, protocol mechanisms, collateralized models, hybrid models, and explicit unknown states.

### 5.8 Reserve disclosure comparability

Source:

```text
reserve profile.disclosure_status
reserve profile.latest_report_id
reserve report
reserve components
```

A reserve report row and a current report date are separate concepts. Historical source presence must not be represented as current disclosure availability.

### 5.9 Reserve-report date semantics

Source:

```text
reserve report report_date/as-of context
reserve component as_of_date
review metadata
```

Source period date, report publication date, and review date must remain distinct. Missing report dates are allowed when explicitly preserved.

### 5.10 Issuance comparability

Source:

```text
classification.issuance_status
reserve/redemption profile context
```

Issuance state must not be derived from lifecycle alone.

### 5.11 Redemption comparability

Source:

```text
redemption_profile.status
retail_access
institutional_access
eligible_parties
minimum_amount_text
jurisdiction_restrictions
```

Unknown or restricted eligibility must remain visible. Direct issuer redemption and protocol exit are not the same comparison value.

### 5.12 Legal classification comparability

Source:

```text
legal profile.classifications
jurisdiction
effective dates
authority or basis
evidence relations
```

Legal classification is jurisdiction-scoped. The projection must not produce a universal `compliant` or `regulated` boolean.

### 5.13 Regulatory-action scope

Source:

```text
regulatory notes
organization and asset references
jurisdiction and authority context
```

The absence of a regulatory-note row is not evidence of no regulatory action. PR #337 records coverage and applicability state without inventing a negative claim.

### 5.14 Market-access applicability

Status in PR #336:

```text
inventory_only
not readiness-scored
```

Canonical market-access records do not yet exist. Monitoring and editorial research are excluded from Compare readiness. PR #339 is scheduled to define the canonical Market Access Record schema and governance. Until then, this dimension may report `deferred_canonical_schema` only.

### 5.15 Launch-date semantics

Source:

```text
stable asset launch_date
data/quality/launch-date-unresolved.json
```

A null launch date is comparison-ready when the unresolved queue deliberately preserves the unknown boundary. A date conflict or untracked coercion is `needs_normalization` or `integrity_blocked` depending on severity.

### 5.16 Verification-date semantics

Source:

```text
canonical last_verified_at and reviewed record metadata
```

Verification date is a review date, not a source period date, legal effective date, reserve report date, or launch date.

### 5.17 Unknown-state semantics

Source:

```text
all comparison-critical canonical families
known unknowns
quality queues
```

The audit checks that unresolved states survive projection and that missing records are not silently converted to factual negatives.

### 5.18 Evidence scope and relation depth

Source:

```text
evidence
evidence relations
record evidence_ids
```

The audit checks reference integrity and comparison-critical evidence linkage. Readiness is structural and does not rank source publishers.

### 5.19 Known-unknown visibility

Source:

```text
known_unknown records
```

Known unknowns must remain visible in readiness output. A comparison projection may summarize count and relevant topics but must link back to canonical unresolved records.

## 6. Applicability model

Each dimension defines one applicability mode:

```text
all_assets
record_present
conditional
inventory_only
future_canonical_schema
```

Rules:

- `all_assets`: every canonical asset receives a readiness state;
- `record_present`: audit applies when a canonical record exists, while absence is separately reported as coverage state;
- `conditional`: deterministic applicability rule must be recorded;
- `inventory_only`: report coverage but do not determine readiness;
- `future_canonical_schema`: never infer from excluded research material.

## 7. Severity model

Findings use:

```text
critical
high
medium
low
info
```

Suggested interpretation:

- critical: broken identity/reference integrity or unsafe cross-record contradiction;
- high: comparison-critical representation cannot be deterministically projected;
- medium: normalization or applicability clarification required;
- low: completeness improvement that does not block deterministic unresolved-state display;
- info: explicit unknown, deferred schema, or coverage inventory.

Severity is not an asset risk score.

## 8. PR #337 audit output contract

PR #337 must audit exactly 110 canonical assets and produce an internal reviewed audit artifact with at least:

```json
{
  "checkpoint_id": "sog_controlled_growth_110_checkpoint_pr335_2026_07_09",
  "asset_count": 110,
  "dimensions": [],
  "assets": [],
  "summary": {
    "ready": 0,
    "ready_with_unknowns": 0,
    "needs_normalization": 0,
    "integrity_blocked": 0
  },
  "normalization_queue": []
}
```

Per-asset readiness output must contain dimension-level states. PR #337 must not emit one composite readiness score.

## 9. PR #338 normalization boundary

PR #338 may:

- align field semantics;
- add explicit applicability states;
- add validators;
- repair evidence linkage;
- add reviewed schema extensions required for deterministic comparison;
- preserve explicit unknown states.

PR #338 may not:

- invent missing facts;
- change lifecycle history for display convenience;
- collapse issuer and asset identity;
- convert historical source presence into current availability;
- convert missing regulatory or market-access records into negative claims;
- use monitoring or editorial research as canonical data without a reviewed canonicalization PR.

## 10. Validation requirements

PR #336 validation must prove:

- contract checkpoint is the reviewed 110-asset checkpoint;
- exactly nineteen dimensions are defined;
- all required dimension IDs are unique;
- source families are from an allowlist of reviewed canonical groups;
- excluded private/candidate/monitoring/editorial sources are absent;
- all four readiness states are defined;
- protected unresolved states are present;
- market access is `future_canonical_schema` and not readiness-scored;
- no numeric score, ranking, recommendation, price, market-cap, APY, safety, or risk output is authorized;
- PR #337 is the next item and PR #338 is normalization;
- current canonical asset count remains exactly 110.

## 11. Explicit non-goals

PR #336 does not:

- audit all 110 assets;
- produce readiness results;
- normalize canonical records;
- implement comparison projection;
- implement `/compare/`;
- create Market Access Records;
- publish monitoring output;
- add live market data;
- calculate scores or rankings;
- change canonical record counts.

## 12. Deployment classification

Internal specification, machine-readable audit contract, and validation only. No public route, public API output, canonical record mutation, monitoring publication, or Cloudflare configuration change is authorized.
