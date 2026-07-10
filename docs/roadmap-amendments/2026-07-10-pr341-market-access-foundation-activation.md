# PR #341 Market Access Record foundation activation

Status: active roadmap amendment  
Updated: 2026-07-10

## Authoritative current workstream

```text
Phase E controlled growth to 110 assets: complete
PR #336 Comparison Readiness contract and audit method: complete
PR #337 audit all 110 assets for comparison readiness: complete
PR #338 bounded asset_class normalization and same-count statistics checkpoint: complete
PR #339 Japan stablecoin access guide and reviewed research checkpoint: complete
PR #340 site-wide text hierarchy and readability remediation: complete
PR #341 canonical Market Access Record schema and governance: active
PR #342 facet-freshness derivation contract and validators: next
```

This amendment supersedes stale current-position wording in earlier roadmap amendments while preserving their historical implementation boundaries.

## Purpose

PR #341 creates the canonical Market Access Record foundation without publishing or promoting any market-access observation.

The canonical analytical unit is:

```text
asset
x jurisdiction
x platform/service
x function
x access state
x effective-from date
```

One canonical record represents exactly one function-scoped access observation. Multi-function research rows must be flattened before canonical review.

## Binding files

```text
schema:
schemas/market-access-record-v1.schema.json

governance:
config/market-access-governance-v1.json

canonical entrypoint:
data/market-access-records-v1.json

implementation spec:
docs/market-access-record-spec.md

foundation checkpoint:
docs/migration/market-access-record-foundation-pr341.json
```

## PR #341 canonical boundary

PR #341 starts the canonical entrypoint at:

```text
market access records: 0
```

PR #341 does not migrate the three PR #339 Japan research rows into canonical data.

The PR #339 research checkpoint remains:

```text
status: reviewed_research_checkpoint
canonical_action: none
included_in_public_canonical_counts: false
```

Migration eligibility is reviewed only through a deterministic artifact generated from the source research checkpoint and existing canonical evidence records.

## Evidence boundary

Every future canonical Market Access Record must contain at least one canonical evidence ID.

A source URL appearing in reviewed editorial research does not itself create a canonical evidence relation. URL matches may identify existing evidence records, but manual review must still confirm that the evidence claim scope supports the proposed function-specific state.

Promotion path:

```text
reviewed research or monitoring candidate
→ canonical evidence relation
→ function-scoped candidate
→ manual scope review
→ canonical record
```

Automatic promotion is prohibited.

## Temporal boundary

Market access changes append history.

A later access state creates a new dated record. Future transfer capability, a newly supported network, or a changed customer scope must not be backfilled into an earlier launch-state record.

## No-universalization boundary

PR #341 governance must preserve all of the following:

- one platform observation is not a country-wide availability claim;
- one supported network is not support for every deployment network;
- provider customer scope is not all persons in the jurisdiction;
- register or provider-list absence does not by itself prove illegality or a ban;
- marketing language is not a government guarantee, recommendation, or universal approval claim.

## Validation requirement

PR #341 completes when:

- JSON Schema v1 is present and internally consistent;
- governance binds the schema and canonical data path;
- canonical data entrypoint exists with zero records;
- one-function-per-record semantics are enforced;
- canonical evidence is mandatory;
- temporal append/supersession rules are explicit;
- the PR #339 three-row research checkpoint deterministically expands to eighteen function-scoped migration-review candidates;
- migration review performs no canonical promotion;
- no canonical registry counts or statistics history values change;
- Comparison Readiness output remains unchanged;
- monitoring baselines and raw monitoring publication boundary remain unchanged;
- dedicated PR #341 validation and general CI are green.

## Next item

After PR #341 merges, PR #342 is authorized to define facet-freshness derivation rules and validators.

PR #342 may define how freshness is derived for comparison facets, including Market Access when canonical records exist, but it must not bypass the PR #341 promotion and evidence governance contract.
