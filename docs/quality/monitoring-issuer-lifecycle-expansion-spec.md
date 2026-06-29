# Stable or Gone issuer lifecycle source expansion

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #243

## Purpose

PR #243 expands review-only monitoring for issuer and protocol lifecycle statements: minting halts, wind-downs, optional upgrades, migrations, rebrands, successor products, and explicit continuation statements.

The expansion must preserve distinct lifecycle meanings. A wind-down is not the same as a rebrand. An optional upgrade is not discontinuation. A parallel successor is not migration. An issuer announcement is not automatic authority to change a canonical asset status.

## Added sources

```text
paxos-busd-minting-halt
sky-dai-usds-upgrade
acala-ausd-aseed-migration
liquity-lusd-v1-continuity
paxos-pax-usdp-rebrand
```

The point-in-time review record is:

```text
scripts/monitoring/sources/issuer-lifecycle-source-review-pr243.json
```

It stores reviewed URLs, final hosts, content types, canonical targets, lifecycle classifications, visible terms, interpretation boundaries, and decisions. It stores no raw response body or normalized page text.

## Signal scope

PR #243 introduces one signal type:

```text
lifecycle_update
```

Approved normalized-text keywords include terms for:

```text
migration
migrate
upgrade
upgraded
optional
rebrand
renamed
now be known as
wind down
winding down
halt minting
cease issuance
shutdown
retire
retirement
conversion
convert
here to stay
```

A keyword match is only a private review prompt after baseline comparison. It does not determine status, migration identity, predecessor/successor relationships, or implementation state.

## Reviewed lifecycle classifications

### wind_down

Used for the Paxos BUSD minting halt and wind-down source. The source may support a lifecycle review, but it does not by itself authorize changing canonical dates or redemption fields.

### optional_reversible_upgrade

Used for the DAI to USDS upgrade route. The reviewed source describes an optional 1:1 upgrade. SOG must not convert this into a claim that DAI is discontinued or unavailable.

### migrated_same_identity

Used for Acala aUSD to aSEED. The reviewed documentation describes conversion and asset-registry change in an existing canonical lineage. Documentation is not treated as fresh execution proof for every holder or every date.

### parallel_successor_no_migration

Used for Liquity V1/LUSD alongside Liquity V2/BOLD. The reviewed source explicitly says Liquity V1 and LUSD continue. SOG must not classify LUSD as migrated merely because BOLD exists.

### rebrand_same_identity

Used for Paxos Standard PAX to Pax Dollar USDP. The reviewed source describes a name and ticker change. SOG keeps one canonical identity unless contrary evidence requires a split.

## Interpretation boundary

The following are fixed:

```text
issuer_announcement_is_not_automatic_asset_status_change: true
optional_upgrade_is_not_discontinuation: true
parallel_successor_is_not_migration: true
proposal_is_not_implementation: true
rebrand_preserves_identity_unless_evidence_says_otherwise: true
documentation_is_not_fresh_execution_proof: true
```

These boundaries are mandatory because lifecycle pages often mix current product language, historical announcements, future plans, and user eligibility. Monitoring must surface a reviewable change without collapsing those meanings.

## Source requirements

Every PR #243 source must:

- use HTTPS;
- remain on an allowlisted official host;
- target existing canonical stablecoin and organization IDs;
- have a canonical relationship for every stablecoin and organization pair;
- use `lifecycle_update` only;
- have a reviewed lifecycle classification from the approved five-value vocabulary;
- contain non-empty reviewed lifecycle terms;
- receive exactly one matching `pending_initial_acceptance` baseline;
- retain all accepted baseline fields as null.

## Baseline boundary

No live response digest is committed in PR #243.

Every new baseline remains:

```text
status: pending_initial_acceptance
accepted_final_url: null
body_sha256: null
normalized_content_sha256: null
content_type: null
etag: null
last_modified: null
accepted_observed_at: null
accepted_repository_commit: null
accepted_review_reference: null
```

## Prior-source preservation

All fourteen sources present after PR #242 must remain enabled with matching baseline records. PR #243 may add lifecycle sources but must not weaken, retarget, accept, or remove earlier sources.

## Deterministic validation

CI must prove:

- exactly five reviewed PR #243 sources are added;
- total configured sources and baselines equal 19;
- source IDs and baseline source IDs match exactly;
- all fourteen prior source IDs remain present;
- configured and final URLs use HTTPS;
- configured and final hosts are allowlisted;
- every target exists canonically;
- canonical stablecoin-to-organization relationships exist;
- every new source uses only `lifecycle_update`;
- lifecycle classifications use only the approved five values;
- visible lifecycle terms are non-empty;
- all interpretation boundaries are fixed;
- every new baseline remains pending with null accepted fields;
- canonical stable assets remain 92;
- workflow triggers and permissions remain manual and read-only;
- automatic canonical action, pull requests, public output, and production publication remain prohibited.

## Current-source review limitation

The review record is dated 2026-06-29. Later redirects, product changes, governance decisions, implementation changes, or documentation rewrites require a new observation and human review. A monitored source is not permanent proof of a lifecycle state.

## Deployment classification

```text
No production deployment required
```
