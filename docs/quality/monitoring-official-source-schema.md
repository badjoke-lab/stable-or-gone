# Official-source allowlist schema

Status: canonical specification  
Updated: 2026-06-29  
Applies to: PR #231

This file fixes the runtime shape of `scripts/monitoring/sources/official-sources.json`.

The required signal field is:

```text
signal_types
```

This runtime field replaces the conceptual `signal_rules` label in the broader PR #231 overview. Keyword dictionaries remain in monitoring code and are not repeated in the source allowlist.

Required source fields:

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

Allowed initial signal types:

```text
reserve_update
assurance_update
issuance_redemption_update
backing_attestation_update
```

No source row may define executable code, authentication material, request headers, cookies, or arbitrary match expressions.
