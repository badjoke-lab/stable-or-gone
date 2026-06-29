# Stable or Gone baseline update proposal flow

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #236

## Purpose

PR #236 defines a manual, review-driven flow for preparing an official-source baseline update after a human has inspected private monitoring material.

The flow produces a proposal bundle. It does not modify the repository baseline, create a commit, open a pull request, change canonical data, publish monitoring output, or deploy the site.

## Separation from monitoring execution

The manually dispatched monitoring workflow remains:

```text
workflow_dispatch
contents: read
```

A monitoring run may observe sources and compare them with accepted baselines. It may not accept its own observations or update:

```text
scripts/monitoring/baselines/official-source-baselines.json
```

Baseline acceptance occurs only through a later, separate repository pull request after human review.

## Inputs

The proposal command consumes four reviewed inputs:

```text
current repository baseline set
private monitoring manifest.json
private official-source-observations.json
human decision file
```

The command is:

```text
node scripts/monitoring/baselines/prepare-baseline-update.mjs \
  --manifest <private-run>/manifest.json \
  --observations <private-run>/official-source-observations.json \
  --decisions <reviewed-decisions.json> \
  --output data-staging/monitoring-baseline-updates/<proposal-id>
```

The command uses no network access and no repository write API.

## Monitoring-run requirements

The input manifest must show:

```text
mode: official-sources
source_commit: lowercase 40-character commit SHA
canonical_guard.ok: true
canonical_guard.changed_paths: []
baseline_set_id: current baseline set ID
```

The observation report must use the same baseline set ID and contain exactly one observation for every enabled official source.

A run with a failed canonical guard cannot become baseline-update input.

## Human decision file

Required top-level fields:

```text
schema_version
review_reference
reviewer
reviewed_at
decisions
```

Required fixed or validated values:

```text
schema_version: 1.0
review_reference: PR #<number>
reviewer: non-empty human review identity
reviewed_at: exact ISO-8601 timestamp
```

Every observed source requires exactly one decision:

```text
source_id
decision
rationale
```

Allowed decisions:

```text
accept
hold
reject
```

A rationale must explain the review outcome. Missing sources, duplicate decisions, unknown source IDs, and blank rationales are invalid.

## Decision meaning

### accept

`accept` copies reviewed observation metadata into the proposed baseline record:

```text
status: accepted
accepted_final_url
body_sha256
normalized_content_sha256
content_type
etag
last_modified
accepted_observed_at
accepted_repository_commit
accepted_review_reference
```

Acceptance is allowed only for a successful observation classified as:

```text
new_source
content_changed
```

The source URL and final URL must remain official, HTTPS, and allowlisted. Digests, timestamps, source commit, and review reference must pass the baseline validator.

Acceptance means only that this response becomes the next operational comparison point. It does not approve any canonical stablecoin fact.

### hold

`hold` leaves the current baseline record unchanged. It means more review is required before accepting or rejecting the observation.

### reject

`reject` also leaves the current baseline record unchanged. It means the reviewed observation must not replace the accepted comparison point.

Neither `hold` nor `reject` changes canonical data or public output.

## Proposal bundle

The command writes exactly three private files:

```text
proposed-official-source-baselines.json
baseline-update-manifest.json
baseline-update-report.md
```

The proposal manifest records:

```text
status: proposal_only
accepted_count
held_count
rejected_count
current_baseline_sha256
proposed_baseline_sha256
repository_baseline_written: false
automatic_commit: false
automatic_pull_request: false
canonical_action: none
public_output: false
production_publication: false
human_review_required: true
```

The report lists every decision, rationale, prior baseline state, proposed baseline state, and digest transition.

Raw response bodies and normalized page text remain prohibited in the proposal bundle.

## Output location

The command-line interface writes only below:

```text
data-staging/monitoring-baseline-updates/
```

That directory is ignored by Git. The command refuses to use the canonical baseline directory as output and refuses to overwrite an existing proposal bundle.

## Applying a proposal

The proposal is not self-applying. After inspection, an operator may open a separate baseline-update pull request and deliberately replace the canonical baseline file with the reviewed proposed file.

That later pull request must include:

```text
source IDs accepted, held, and rejected
monitoring run ID and source commit
review reference and reviewer
prior and proposed digests
redirect and content-type review
reason each accepted response is a safe comparison point
confirmation that canonical/public data did not change
```

Repository CI must validate the proposed baseline after it is deliberately copied into the canonical path.

## Prohibited behavior

The proposal command must not:

- fetch live sources;
- mutate the monitoring artifact;
- mutate the canonical baseline;
- run Git commands;
- create a branch, commit, or pull request;
- assign canonical evidence IDs;
- change stablecoin, organization, event, evidence, reserve, deployment, or relationship records;
- write public files;
- invoke Cloudflare or another deployment service.

## Deterministic validation

Offline fixtures must prove:

- accepted decisions update only the selected proposal records;
- hold and reject decisions preserve their current records exactly;
- missing or duplicate decisions fail;
- failed observations cannot be accepted;
- malformed run metadata or review references fail;
- the proposed baseline passes the PR #234 validator contract;
- exactly three proposal files are produced;
- raw fixture bodies do not leak;
- the repository baseline and canonical/public files remain unchanged;
- no workflow permission or production behavior is added.

## Deployment classification

```text
No production deployment required
```