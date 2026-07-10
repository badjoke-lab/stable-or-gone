# SOG Market Access Record v1 — canonical schema and governance

Status: canonical implementation specification — PR #341  
Updated: 2026-07-10

## 1. Purpose

Market access is not a single country-level yes/no property of a stable asset.

A source-backed access observation must preserve the exact scope in which the claim is true. The canonical analytical unit is:

```text
asset
x jurisdiction
x platform/service
x function
x access state
x effective-from date
```

The canonical schema therefore stores one function-scoped observation per record. A source row that reports several functions must be flattened into separate candidate records before canonical review.

PR #341 defines the schema and governance contract and creates an empty canonical entrypoint. It does not promote the PR #339 Japan research rows into canonical data.

## 2. Canonical files

```text
schema:
schemas/market-access-record-v1.schema.json

governance:
config/market-access-governance-v1.json

canonical entrypoint:
data/market-access-records-v1.json

foundation checkpoint:
docs/migration/market-access-record-foundation-pr341.json
```

The PR #341 canonical data file starts empty. Its reviewed record count is zero.

## 3. Record identity

Each record requires a unique `id` using the `sog_ma_` namespace.

Logical uniqueness is defined over:

```text
asset_id
jurisdiction.country_code
jurisdiction.subdivision_code
platform.name
platform.service
function
access_state
effective_from
```

The same asset can have multiple records in the same jurisdiction when platform, service, function, state, or effective date differs.

A platform observation must not be generalized into a jurisdiction-wide claim.

## 4. Function axis

The v1 function vocabulary is:

```text
buy_sell
deposit
withdrawal
external_wallet_transfer
direct_issuer_mint
direct_issuer_redemption
```

One canonical record contains exactly one function.

The PR #339 reviewed research checkpoint stores a `functions` object for editorial analysis. Migration must flatten that object before canonical review. No nested multi-function object is valid as a canonical Market Access Record.

## 5. Access-state axis

The v1 access-state vocabulary is:

```text
available
available_with_conditions
account_internal_only
unavailable
temporarily_unavailable
restricted_customer_scope
restricted_network_scope
not_assessed
unknown
```

`not_assessed` means the reviewed source set did not assess the function. It is not equivalent to unavailable.

`unknown` means the function is in scope but the state cannot be established from reviewed evidence.

`account_internal_only` must not be rendered as external transfer availability.

## 6. Scope axes

### Jurisdiction

Country scope is explicit and uses an uppercase two-letter country code. Optional subdivision scope may be added when evidence supports it.

### Platform and service

Every record names the platform and service to which the observation applies. A canonical organization ID may be attached when the platform entity already exists in the registry, but the human-readable platform and service labels remain mandatory.

### Network scope

Network scope must be one of:

```text
any_platform_supported_network
specific_networks
account_internal_only
not_applicable
unknown
```

A platform supporting one network does not imply support on all deployments of the asset.

### Customer scope

Customer scope must be explicit or `unknown`. A provider's supported-customer population must not be generalized to all persons in the jurisdiction.

## 7. Time model

Market access is time-varying.

Every record requires:

```text
effective_from
observed_at
```

`effective_to` may be null for a state still current at the reviewed observation date.

A later change creates a new dated record. Future capability must not be backfilled into an earlier launch-state record.

When a later reviewed record replaces an earlier state, `supersedes_record_ids` may link the transition while preserving the earlier record.

## 8. Conditions and legal route

Conditions are separate from access state. Transaction limits, withdrawal limits, network support, customer eligibility, and account-internal restrictions are recorded as typed conditions.

Legal-route description is a scoped source-backed field, not a safety score or approval flag.

Allowed legal-route states are:

```text
documented
provider_characterization
not_assessed
unknown
```

Issuer or platform marketing language must not be promoted into:

- government value guarantee;
- government recommendation;
- universal jurisdiction availability;
- universal legal approval.

Absence from a reviewed register or provider list does not by itself prove that an asset is illegal or banned.

## 9. Evidence contract

Every canonical Market Access Record requires at least one canonical `evidence_id`.

Editorial research URLs and raw monitoring observations are not canonical evidence relations by themselves.

Promotion requires:

1. canonical asset identity exists;
2. all record scope axes are explicit;
3. function and state use the controlled vocabulary;
4. effective date is source-supported;
5. canonical evidence IDs exist;
6. claim scope does not exceed source scope;
7. manual review approves promotion.

Availability claims require platform/service-provider or regulator evidence.

Legal-route claims require regulator/official-register evidence or explicit provider legal characterization.

## 10. PR #339 research migration boundary

The reviewed checkpoint:

```text
data/editorial-research/japan-stablecoin-market-access-2026.json
```

contains three editorial research rows for USDC, RLUSD, and JPYSC.

PR #341 reviews migration eligibility but performs no canonical promotion.

Each source research row would expand into six function-scoped candidate records before review. The review must verify canonical evidence coverage for each function-scoped claim. A URL match alone is not sufficient where the canonical evidence record's claim scope does not support the proposed function/state claim.

## 11. Monitoring boundary

Monitoring may discover a candidate change but cannot write canonical Market Access Records directly.

The permitted path is:

```text
monitoring observation
→ private candidate
→ source review
→ canonical evidence relation
→ bounded Market Access candidate
→ manual review
→ canonical record
```

Raw monitoring output, stale-state output, source-discovery leads, and rejected candidates remain outside public canonical data.

## 12. Comparison boundary

PR #341 does not change Comparison Readiness output.

The schema foundation removes the schema-design blocker, but comparison projection and freshness semantics remain separate workstreams. Market access must not enter public comparison output until the required canonical records and freshness contract are ready.

## 13. PR #341 exit criteria

PR #341 completes when:

1. JSON Schema v1 exists and is internally valid;
2. governance contract exists and binds the canonical entrypoint;
3. canonical entrypoint exists and contains zero records;
4. the one-function-per-record rule is enforced;
5. canonical evidence IDs are mandatory;
6. temporal append/supersession rules are explicit;
7. PR #339 research migration eligibility is reviewed without promotion;
8. no canonical counts, statistics snapshots, comparison output, or monitoring baseline changes occur;
9. dedicated validation and general CI are green;
10. PR #342 is authorized as the next facet-freshness derivation contract and validator item.
