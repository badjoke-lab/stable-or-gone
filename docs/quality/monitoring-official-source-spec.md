# Stable or Gone official-source monitoring

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #231

## Purpose

PR #231 extends the review-only monitoring skeleton with allowlisted official-source observation and private candidate generation. Observations and candidates are research inputs, not canonical facts or public classifications.

This specification supplements `docs/quality/monitoring-pipeline-spec.md` and does not weaken its canonical guard, private-output rule, manual trigger, or publication prohibition.

## Trigger and permissions

The workflow remains manual-only and read-only:

```text
workflow_dispatch
contents: read
```

PR #231 does not add a schedule, push trigger, pull-request trigger, write permission, automatic commit, automatic pull request, or production action.

## Modes

```text
health-only
  PR #230 repository-health run without external network access.

official-sources
  Allowlisted HTTPS observation followed by private candidate generation.
```

## Allowlist

Official sources are defined only in:

```text
scripts/monitoring/sources/official-sources.json
```

Each source record requires:

```text
source_id
display_name
url
allowed_hosts
source_kind
affected_stablecoin_ids
affected_organization_ids
signal_rules
enabled
```

Rules:

- `url` must use HTTPS.
- The configured hostname and final response hostname must appear in `allowed_hosts`.
- Redirects outside the allowlist fail that observation.
- Source IDs must be unique.
- Every affected stablecoin and organization ID must already exist in the canonical registry.
- The allowlist must contain only issuer-, protocol-, or project-controlled pages.
- API keys, cookies, authenticated pages, social-login pages, and scraping bypasses are prohibited.

## Initial sources

The first allowlist is deliberately small:

```text
Tether transparency
Circle transparency
Paxos PYUSD transparency
Ethena custodian attestations
```

These sources are monitored for reserve, assurance, issuance/redemption, or backing-attestation language. The presence of a keyword is a signal only and does not prove that a material change occurred.

## Observation contract

`official-source-observations.json` contains one row per configured source:

```text
observation_id
source_id
source_identity
source_url
final_url
observed_at
fetch_status
http_status
content_type
etag
last_modified
body_sha256
body_bytes
matched_signal_types
matched_keywords
error
```

Raw response bodies are not stored. Only response metadata, the body digest, and matched allowlisted keywords are retained.

Fetch limits:

```text
timeout: 20 seconds per source
maximum response body: 2 MiB
user agent: Stable-or-Gone-Review-Monitor/1.0
```

A source outage or HTTP failure produces an error observation. It does not create a candidate and does not alter canonical data.

## Candidate contract

`monitoring-candidates.json` contains private candidates only when a successful observation matches at least one configured signal rule.

Required fields:

```text
candidate_id
status
created_at
observation_id
source_id
source_url
affected_stablecoin_ids
affected_organization_ids
signal_types
matched_keywords
duplicate_review
lineage_review
canonical_action
```

Fixed values:

```text
status: needs_human_review
canonical_action: none
```

### Duplicate review

Duplicate review checks the configured stablecoin and organization IDs against the canonical registry.

States:

```text
existing_targets_confirmed
missing_target_reference
```

### Lineage review

Lineage review counts canonical organization relationships for the affected stablecoins and organizations.

States:

```text
canonical_relationships_found
no_canonical_relationship_found
```

Neither state approves a lifecycle, issuer, reserve, regulatory, or deployment change.

## Output contract

An `official-sources` run writes exactly:

```text
data-staging/monitoring/<run_id>/
  manifest.json
  health.json
  official-source-observations.json
  monitoring-candidates.json
  summary.md
```

The manifest records:

```text
external_network_used: true
observation_count
candidate_count
source_errors
canonical_guard
```

The canonical before/after path set and SHA-256 digest must remain identical.

## Test rule

Repository validation must not depend on live network availability. PR #231 validation uses an injected fixture fetch implementation and a fixture source set to verify:

- allowlist validation;
- body-size and redirect-host enforcement;
- deterministic observation and candidate IDs;
- target duplicate review;
- relationship lineage review;
- zero canonical changes;
- no raw body retention;
- exact five-file output.

Live official-source access occurs only in the manually dispatched workflow.

## Public-output rule

Observations and candidates remain excluded from public pages, public JSON, `version.json`, `data/manifest.json`, `llms.txt`, `ai.txt`, sitemap output, and canonical counts.

## Deployment classification

```text
No production deployment required
```
