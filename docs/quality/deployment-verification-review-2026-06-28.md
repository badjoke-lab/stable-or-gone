# Deployment verification-state review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #228

## Scope

This review records an explicit verification state for all 130 canonical deployment records without claiming that any deployment is fully verified unless direct confirmation exists.

Verification is separate from:

- deployment canonicality;
- operational status;
- contract or token identifier presence;
- issuer support;
- redemption availability;
- bridge status.

## Result

```text
Deployments reviewed: 130
Verified: 0
Identifier recorded, verification not recorded: 45
Source linked, identifier not recorded: 69
Source review needed: 15
Unknown or unresolved: 1
Verification status recorded: 130
Verification status not recorded: 0
```

## Decision classes

### Identifier recorded, verification not recorded

Forty-five records contain a contract address, token identifier, Omni property ID, or equivalent deployment identifier. Presence of an identifier does not prove that the identifier has been checked against a current issuer registry, protocol address book, verified explorer, or current implementation.

These records receive:

```text
identifier_recorded_unverified
```

### Source linked, identifier not recorded

Sixty-nine records have one or more reviewed evidence relations but no canonical contract or token identifier. They remain useful deployment context without pretending that contract identity has been established.

These records receive:

```text
source_linked_no_identifier
```

### Source review needed

Fifteen records still use `source_review_needed` in the contract-address field. This is a work-queue state and requires a bounded source review before an identifier or no-identifier conclusion is recorded.

These records receive:

```text
review_needed
```

### Unknown or unresolved

The historical UST Terra record contains `not_applicable_or_source_review_needed`, which combines two unresolved possibilities. Until the historical chain identifier boundary is normalized, the verification state remains:

```text
unknown
```

## No verified records

PR #228 records zero `verified` deployments. A deployment may be marked verified only after direct confirmation of the identifier and network against an authoritative issuer, protocol, chain registry, repository, or explorer source with a clear review date.

## Canonical overlay

Verification states are stored in:

```text
data/deployment-verification-pr228.json
```

The overlay covers all 130 canonical deployment IDs exactly once. It avoids duplicating the same review field across every historical batch file while preserving the underlying deployment records unchanged.

The deployment taxonomy collector applies this overlay before generating public quality counts. The explicit state must match the previous conservative inference for every record, so PR #228 changes recording completeness rather than semantic classification.

## Fixed rules

- Identifier presence is not verification.
- Source linkage without an identifier is an explicit state, not a verified state.
- `review_needed` is distinct from `unknown`.
- `verified` requires direct confirmation and a future source-review record.
- Verification is separate from canonicality and operational status.
- The overlay must cover every canonical deployment exactly once.
- No deployment receives a favorable state from ticker, chain name, or third-party name matching alone.

## Data changes

PR #228 adds the canonical verification overlay, updates taxonomy collection and protection counts, and adds a validator. It does not add or delete deployments, identifiers, sources, routes, or public pages.

## Follow-up

PR #229 reviews the 15 `review_needed` contract identities, the one unresolved historical identifier state, and the remaining deployment source-status boundaries.

## Deployment classification

```text
No production deployment required
```
