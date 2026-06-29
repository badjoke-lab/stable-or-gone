# Stable or Gone reserve and assurance source expansion

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #241

## Purpose

PR #241 expands review-only official-source monitoring for reserve composition, reserve reports, assurance reports, attestations, and related transparency statements.

The expansion is bounded to official HTTPS pages that were manually reviewed for current ownership, final host, content type, canonical target IDs, and visible reserve or assurance language.

Adding a source does not accept a baseline, establish a canonical fact, change a stablecoin status, create evidence, publish monitoring output, or deploy the site.

## Added sources

```text
first-digital-fdusd-transparency
ripple-rlusd-overview
gemini-gusd-dollar
paxos-usdp-transparency
global-dollar-usdg-overview
```

Current source review is recorded in:

```text
scripts/monitoring/sources/reserve-assurance-source-review-pr241.json
```

The review record stores URLs, final hosts, content types, canonical targets, visible signal terms, and decisions. It stores no raw response body and no normalized page text.

## Source requirements

Every added source must:

- use HTTPS;
- remain on an allowlisted official host;
- target an existing canonical stablecoin;
- target an existing canonical organization;
- have a canonical stablecoin-to-organization relationship;
- use only approved reserve or assurance signal types;
- have current visible text matching at least one configured signal;
- receive exactly one matching baseline record;
- keep that baseline `pending_initial_acceptance` with all accepted fields null.

## Approved signal types

```text
reserve_update
assurance_update
backing_attestation_update
```

PR #241 adds no new signal type.

A signal match is a private review prompt only. It does not prove that reserves changed, that an assurance report is current, or that the monitored statement is independently correct.

## Baseline boundary

Every new source receives a matching baseline in:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

Required state:

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

No live response digest is committed in PR #241.

## Existing-source preservation

The four Phase A sources remain unchanged:

```text
tether-transparency
circle-transparency
paxos-pyusd-transparency
ethena-custodian-attestations
```

PR #241 must not weaken their hosts, targets, signal scopes, enabled state, or pending-baseline status.

## Deterministic validation

CI must prove:

- exactly five reviewed sources are added;
- all reviewed source IDs exist in the allowlist;
- allowlist and baseline source IDs match exactly;
- every new baseline remains pending with null accepted fields;
- every configured and reviewed final URL uses HTTPS;
- configured and final hosts are allowlisted;
- stablecoin and organization IDs exist canonically;
- a canonical relationship joins each stablecoin and organization pair;
- only reserve or assurance signal types are used;
- visible signal terms are non-empty;
- source review decisions equal `approve_pending_baseline`;
- original Phase A sources are unchanged;
- no canonical or public record count changes;
- workflow permissions and triggers remain unchanged;
- automatic canonical action, pull requests, public output, and production publication remain prohibited.

## Current-source review limitation

The review file is a point-in-time record dated 2026-06-29. A later redirect, ownership change, response-type change, outage, or page redesign must be treated as a new operational finding. It must not be silently normalized into approval.

## Deployment classification

```text
No production deployment required
```
