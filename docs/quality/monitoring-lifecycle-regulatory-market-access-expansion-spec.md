# Stable or Gone lifecycle, regulatory, and market-access monitoring expansion specification

Status: canonical implementation specification — PR #323  
Updated: 2026-07-07

## 1. Purpose

PR #323 expands the review-only monitoring system in three distinct directions:

```text
issuer lifecycle monitoring
issuer/token regulatory monitoring
EU/EEA market-access and regulatory-register monitoring
```

The three domains remain separate. A lifecycle source is not a market-access source. An issuer regulatory page is not a regulatory register. A CASP authorization context is not proof of asset/function availability.

PR #323 starts from the reviewed PR #322 boundary:

```text
100 canonical stable assets
30 reviewed official sources
30 pending baseline rows
22 assets with registered source reach
78 uncovered assets
0 accepted baselines
0 accepted asset reach
```

PR #323 may add reviewed sources and observation scope metadata. It does not accept baselines, schedule monitoring, write canonical data, edit the public guide automatically, publish monitoring candidates, or deploy monitoring output.

## 2. Approved source expansion groups

### 2.1 Issuer lifecycle/regulatory additions

PR #323 adds reviewed first-party sources for bounded issuer/token lifecycle or regulatory context.

Approved initial additions:

```text
ripple-eu-emi-license
ripple-preliminary-mica-casp
banking-circle-euri-launch
sgforge-eurcv-stablecoin-elevation
```

These rows use existing canonical stablecoin and organization IDs and only the existing signal types:

```text
lifecycle_update
regulatory_update
```

### 2.2 Platform-policy additions

Approved reviewed first-party source rows:

```text
binance-eea-stablecoin-policy
kraken-eea-stablecoin-offerings
bitstamp-europe-mica-assets
```

These rows preserve platform, legal-entity when known, region, affected canonical asset IDs, and function scope.

### 2.3 Platform service-state addition

Approved reviewed first-party source row:

```text
gemini-eea-account-closure
```

This source is platform-wide. It must not be rewritten as a GUSD issuer or token-status conclusion.

### 2.4 Regulatory-register addition

Approved reviewed Tier-A source row:

```text
esma-mica-interim-register-hub
```

The source monitors official register structure and updates. It has no synthetic canonical stablecoin or issuer target.

## 3. Official-source schema extension

PR #323 keeps the existing required fields:

```text
source_id
display_name
url
allowed_hosts
source_kind
affected_stablecoin_ids
affected_organization_ids
signal_types
enabled
```

and adds one optional reviewed object:

```text
monitoring_scope
```

Allowed `monitoring_scope.kind` values:

```text
platform_policy
platform_service_state
regulatory_register
```

### 3.1 Platform-policy scope

```json
{
  "kind": "platform_policy",
  "platform_name": "Example Platform",
  "platform_legal_entity": null,
  "region_scope": "European Economic Area",
  "function_scope": ["buy", "sell", "spot_trading", "deposit", "withdraw"]
}
```

Allowed function identifiers:

```text
buy
sell
spot_trading
margin
earn
deposit
withdraw
custody
convert
auto_conversion
```

### 3.2 Platform service-state scope

```json
{
  "kind": "platform_service_state",
  "platform_name": "Example Platform",
  "platform_legal_entity": null,
  "region_scope": "EEA customer accounts",
  "function_scope": []
}
```

A platform-wide closure or service restriction must not create invented asset-function rows.

### 3.3 Regulatory-register scope

```json
{
  "kind": "regulatory_register",
  "authority_name": "ESMA",
  "region_scope": "European Union",
  "register_families": ["emt_issuers", "art_issuers", "casps", "non_compliant_entities"]
}
```

Allowed register families:

```text
non_art_emt_white_papers
art_issuers
emt_issuers
casps
non_compliant_entities
```

## 4. Subject-target rule

Every enabled source must have one of the following:

```text
canonical stablecoin/organization target context
or
reviewed monitoring_scope
```

Platform-policy and platform-service-state sources may reference canonical stable assets while leaving organization IDs empty when the platform is not represented as a canonical issuer organization.

Regulatory-register sources may leave both canonical target arrays empty when `monitoring_scope.kind = regulatory_register` is complete and valid.

Do not create fake issuer IDs or overload stablecoin IDs to represent platforms.

## 5. New signal types

PR #323 adds:

```text
platform_policy_update
platform_service_state_update
regulatory_register_update
```

Existing signals remain unchanged.

Signal detection is lead generation for private review only. Keyword detection does not create a canonical fact or public classification.

## 6. Observation and candidate scope propagation

When `monitoring_scope` exists, both the private observation and private candidate must include an exact structured copy.

The monitoring system must not:

- rewrite `European Economic Area` as `European Union`;
- drop platform legal entity information;
- broaden a member-state page into EEA-wide scope;
- infer unlisted functions;
- turn platform service-state into stablecoin regulatory status;
- turn register status into platform function availability.

## 7. Duplicate and lineage semantics

For canonical-target sources, existing duplicate and lineage review rules remain.

For a source with reviewed noncanonical subject scope and no canonical target pair:

```text
duplicate_review.state = scoped_noncanonical_subject_confirmed
lineage_review.state = not_applicable_noncanonical_subject_scope
```

This prevents platform/register observations from being misclassified as missing canonical lineage.

## 8. Coverage semantics

PR #323 extends source families to:

```text
reserve_assurance
redemption_terms
issuer_lifecycle
regulatory
platform_policy
platform_service_state
regulatory_register
```

Asset-family reach is meaningful only for families with canonical asset mappings.

Platform and register coverage must also be reported separately:

```text
platform_policy_source_count
platform_service_state_source_count
regulatory_register_source_count
market_access_schema_capable_source_count
scoped_platform_count
scoped_region_count
```

Do not divide platform count or register count by the 100-asset registry denominator.

## 9. Baseline rule

Every added source receives exactly one matching row in:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

All new and existing rows remain:

```text
status: pending_initial_acceptance
```

All accepted-only fields remain null.

PR #323 does not perform live baseline acceptance.

## 10. Snapshot governance

Historical snapshots remain immutable:

```text
PR #321:
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json

PR #322:
scripts/monitoring/baselines/monitoring-reserve-redemption-expansion-100-assets.json
```

PR #323 creates a successor current-state snapshot rather than rewriting historical counts or digests.

Binding PR #323 successor snapshot:

```text
scripts/monitoring/baselines/monitoring-lifecycle-regulatory-market-access-expansion-100-assets.json
```

The exact post-expansion counts and digests are derived by deterministic generator output and fixed only after capture. They must not be guessed.

## 11. Required fixtures

PR #323 validator coverage must prove:

```text
platform-policy scope survives observation and candidate generation
platform legal entity survives unchanged
EEA scope is not rewritten as EU
function scope survives unchanged
platform-wide service state does not require fake stablecoin rows
regulatory register source works without fake canonical targets
multiple canonical assets may be mapped to one platform-policy source
cosmetic/no-signal content does not create a material candidate
all baselines remain pending
accepted coverage remains zero
historical PR #321 and PR #322 snapshots remain unchanged
```

## 12. Safety boundary

PR #323 preserves:

```text
human_review_required: true
monitoring_write_allowed: false
canonical_evidence: false
public_output: false
automatic_pull_request: false
production_publication: false
snapshot_network_access: false
canonical_action: none
```

Market-access observations remain private candidate material.

## 13. Explicit non-goals

PR #323 does not:

- accept a baseline;
- activate a schedule trigger;
- create automatic branches;
- create automatic canonical pull requests;
- write stablecoin or organization records;
- write events or evidence;
- revise the EU/EEA guide automatically;
- publish function matrices;
- create a canonical Market Access Record family;
- create Compare;
- create Access & Regulation Explorer;
- create Change Timeline;
- deploy monitoring output.

Bounded scheduled read-only operation remains PR #324. Canonical Market Access Record design remains post-110 Phase F.

## 14. Completion condition

PR #323 is complete when:

```text
official-source schema supports reviewed monitoring_scope
observer validates and propagates monitoring_scope
new market-access signal types are covered by validators
approved lifecycle/regulatory sources are registered
approved platform-policy/service-state/register sources are registered
matching pending baseline rows exist
historical PR #321 and PR #322 snapshots remain valid
successor PR #323 snapshot exists
current observation matches successor snapshot exactly
current source/baseline ID parity is true
accepted baseline count remains zero
accepted asset reach remains zero
coverage reports separate asset reach from platform/register scope
market-access scope fixtures pass
full monitoring chain passes
dedicated PR #323 workflow passes
authority shows PR #323 active / PR #324 next
full CI and independent audit workflows are green
```
