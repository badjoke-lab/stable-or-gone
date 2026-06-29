# Stable or Gone official-source monitoring

Status: canonical specification  
Updated: 2026-06-29  
Roadmap items: PR #231, amended by PR #235

## Purpose

PR #231 introduced allowlisted official-source observation and private candidate generation. PR #235 makes candidate generation baseline-aware so recurring standing language does not produce a candidate on every run.

Observations, comparison states, and candidates are research inputs, not canonical facts or public classifications.

This specification supplements:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-change-detection-spec.md
```

It does not weaken the canonical guard, private-output rule, manual trigger, baseline approval boundary, or publication prohibition.

## Trigger and permissions

The workflow remains manual-only and read-only:

```text
workflow_dispatch
contents: read
```

The workflow has no schedule, push trigger, pull-request trigger, write permission, automatic commit, automatic pull request, baseline mutation, or production action.

## Modes

```text
health-only
  Repository-health run without external network access.

official-sources
  Allowlisted HTTPS observation, accepted-baseline comparison, and private candidate generation.
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
signal_types
enabled
```

Rules:

- `url` must use HTTPS.
- The configured hostname and final response hostname must appear in `allowed_hosts`.
- Redirects outside the allowlist fail that observation.
- Source IDs must be unique.
- Every affected stablecoin and organization ID must already exist in the canonical registry.
- The allowlist must contain only issuer-, protocol-, or project-controlled pages under the current PR #231 scope.
- API keys, cookies, authenticated pages, social-login pages, and scraping bypasses are prohibited.

## Baseline input

Accepted comparison points are defined in:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

Each enabled source requires one baseline record. A baseline may be:

```text
pending_initial_acceptance
accepted
```

A monitoring execution may read a baseline but may not update or accept it. Baseline changes require a separate human-reviewed repository pull request.

## Initial sources

The initial allowlist remains deliberately small:

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
normalized_content_sha256
body_bytes
matched_signal_types
matched_keywords
baseline_comparison
error
```

`baseline_comparison` contains:

```text
state
baseline_status
baseline_body_sha256
baseline_normalized_content_sha256
observed_body_sha256
observed_normalized_content_sha256
exact_body_changed
normalized_content_changed
accepted_observed_at
accepted_repository_commit
accepted_review_reference
```

Allowed comparison states under PR #235:

```text
new_source
unchanged
content_changed
fetch_failed
```

Raw response bodies and normalized page text are not stored. Only response metadata, digests, matched allowlisted keywords, and comparison metadata are retained.

Fetch limits:

```text
timeout: 20 seconds per source
maximum response body: 2 MiB
user agent: Stable-or-Gone-Review-Monitor/1.0
```

A source outage, rejected redirect, size failure, or HTTP failure produces a `fetch_failed` observation. It does not create a content-change candidate and does not alter canonical data.

## Candidate contract

`monitoring-candidates.json` contains private candidates only when all conditions are true:

```text
fetch_status == ok
matched_signal_types is not empty
baseline_comparison.state is new_source or content_changed
```

An accepted source with identical normalized content is `unchanged` and creates zero candidates, even when standing page text contains configured keywords.

Required candidate fields:

```text
candidate_id
status
created_at
observation_id
source_id
source_url
change_state
baseline_comparison
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

`change_state` is `new_source` or `content_changed`. Neither state proves that a stablecoin fact changed.

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

Neither duplicate nor lineage state approves a lifecycle, issuer, reserve, regulatory, or deployment change.

## Output contract

A review-disabled `official-sources` run writes exactly:

```text
data-staging/monitoring/<run_id>/
  manifest.json
  health.json
  official-source-observations.json
  monitoring-candidates.json
  summary.md
```

A review-enabled run retains the nine-file PR #232 contract.

The manifest and official-source reports record:

```text
baseline_set_id
observation_count
candidate_count
source_errors
change_counts.unchanged
change_counts.content_changed
change_counts.new_source
change_counts.fetch_failed
canonical_guard
```

The canonical before/after path set and SHA-256 digest must remain identical.

## Test rule

Repository validation must not depend on live network availability. Injected fixture fetch implementations verify:

- allowlist and baseline validation;
- body-size and redirect-host enforcement;
- deterministic observation and candidate IDs;
- pending baseline behavior;
- identical accepted-baseline behavior with zero candidates;
- material fixture change behavior;
- fetch-failure behavior;
- target duplicate review;
- relationship lineage review;
- zero canonical changes;
- no raw or normalized body retention;
- exact five-file and nine-file output contracts.

Live official-source access occurs only in the manually dispatched workflow.

## Public-output rule

Observations, baselines, comparisons, and candidates remain excluded from public pages, public JSON, `version.json`, `data/manifest.json`, `llms.txt`, `ai.txt`, sitemap output, and canonical counts.

## Deployment classification

```text
No production deployment required
```