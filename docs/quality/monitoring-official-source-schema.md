# Official-source allowlist schema

Status: canonical specification  
Updated: 2026-07-07  
Applies to: PR #231, amended by PR #323

## Required fields

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

## Allowed signal types

```text
reserve_update
assurance_update
issuance_redemption_update
backing_attestation_update
lifecycle_update
regulatory_update
platform_policy_update
platform_service_state_update
regulatory_register_update
```

## Optional `monitoring_scope`

Allowed kinds:

```text
platform_policy
platform_service_state
regulatory_register
```

Platform scope fields:

```text
kind
platform_name
platform_legal_entity
region_scope
function_scope
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

Regulatory-register scope fields:

```text
kind
authority_name
region_scope
register_families
```

Allowed register families:

```text
non_art_emt_white_papers
art_issuers
emt_issuers
casps
non_compliant_entities
```

Each enabled source requires canonical target context or a complete reviewed `monitoring_scope`. Platform sources may omit issuer organization IDs. Regulatory-register sources may omit both canonical target arrays.

Do not create fake canonical IDs or use stablecoin IDs as platform identities.

No source row may define executable code, authentication material, cookies, credentials, arbitrary match expressions, canonical write instructions, publication instructions, or deployment behavior.

`monitoring_scope` is private observation context only. It does not create a canonical Market Access Record or authorize public output.
