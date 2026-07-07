# Stable or Gone review-only monitoring pipeline

Status: canonical specification  
Updated: 2026-07-07  
Applies to: PR #230–#232, extended by PR #324

## Purpose

The monitoring pipeline observes official and high-value source changes, records private candidate material, performs duplicate and lineage checks, drafts evidence, and prepares reviewable material. It does not publish monitored findings or modify canonical records automatically.

The binding review sequence is:

```text
official-source observation
→ private candidate record
→ duplicate and lineage checks
→ evidence draft
→ reviewable PR material
→ human approval before canonical publication
```

PR #324 adds two private auxiliary lanes:

```text
bounded news discovery → private discovery leads
article stale-state review → private review findings
```

Neither lane creates canonical facts or public output.

## Non-negotiable safety boundary

Monitoring must never write directly to canonical public data.

Protected data includes all repository-controlled registry JSON, migration baselines, public-copy sources, taxonomy configuration, routes, and generated public-layer inputs. A monitoring run must fail when any protected file changes between its pre-run and post-run snapshots.

Monitoring output is private review material and must remain outside:

```text
data/**
public/**
src/**
config/**
docs/migration/**
```

The only monitoring-output root is:

```text
data-staging/monitoring/<run_id>/
```

Monitoring output must not be included in `version.json`, `data/manifest.json`, `llms.txt`, `ai.txt`, the sitemap, public routes, or canonical record counts.

## Historical PR responsibilities

### PR #230 — skeleton and canonical guard

PR #230 implements only:

- a manual review-only workflow;
- a deterministic run identifier;
- a health-only monitor with no external network access;
- a pre-run and post-run canonical snapshot guard;
- a JSON manifest, JSON health report, and Markdown summary;
- artifact upload for operator review;
- repository validation of the monitoring contract.

PR #230 does not add a schedule, external observation, candidate generation, automatic branches, automatic commits, or automatic pull requests.

### PR #231 — official-source candidate generation

PR #231 may add allowlisted official-source observation and private candidate records. Every observation must retain source identity, source URL, observed timestamp, signal type, affected stablecoin or organization candidate, and a duplicate/lineage review state.

PR #231 must not modify canonical records or treat a signal as a final classification.

### PR #232 — reviewable monitoring reports

PR #232 may create reviewable evidence drafts and pull-request material. Human approval remains mandatory before any separate canonical-data PR. Monitoring reports must distinguish observed facts, inferences, unresolved questions, and rejected duplicates.

## Historical PR #230 trigger and permissions

The PR #230 workflow remains manual-only:

```text
workflow_dispatch
```

It must not use:

```text
schedule
push
pull_request
workflow_run
contents: write
pull-requests: write
issues: write
wrangler
Cloudflare credentials
```

Required permission:

```text
contents: read
```

The historical manual workflow remains available and is not converted into the PR #324 scheduled workflow.

## Historical PR #230 output contract

Each health-only run writes exactly one run directory:

```text
data-staging/monitoring/<run_id>/
  manifest.json
  health.json
  summary.md
```

`run_id` format:

```text
YYYYMMDDTHHMMSSZ-<short_commit>
```

### manifest.json

Core fields:

```text
schema_version
run_id
mode
started_at
finished_at
status
source_commit
source_branch
external_network_used
canonical_guard
monitors
output_files
```

For PR #230 health-only mode:

```text
mode: health-only
external_network_used: false
status: completed | failed
canonical_guard.before_hash
canonical_guard.after_hash
canonical_guard.changed_paths
```

PR #324 extends scheduled manifests with:

```text
schedule_group
official_source_selection_count
news_discovery_item_count
news_discovery_error_count
article_stale_finding_count
```

Manual unscheduled runs use:

```text
schedule_group: null
```

### health.json

Required fields:

```text
schema_version
monitor
status
checked_at
canonical_file_count
canonical_json_file_count
parse_errors
missing_files
record_group_counts
candidate_count
findings
```

Health-only mode must produce:

```text
candidate_count: 0
```

### summary.md

Core sections remain:

```text
# SOG Review-only Monitoring
## Run
## Canonical guard
## Repository health
## Candidate output
## Operator action
```

Scheduled runs may add private sections for news discovery and article stale-state review.

The operator action for a successful health-only run remains `No canonical action required`.

## Canonical snapshot guard

The guard derives protected paths from:

- `docs/migration/registry-v2-baseline.json` data groups;
- `docs/migration/registry-v3-foundation.json` data groups;
- `docs/migration/registry-v3-income-profiles.json` data files;
- compatibility files used by build provenance when present;
- canonical migration baseline JSON files themselves.

The guard records a stable SHA-256 digest over sorted relative paths and file bytes. Verification fails when:

- a protected file is missing;
- a protected file is added or removed during the run;
- file bytes differ;
- the protected-path set differs;
- the before and after aggregate hashes differ.

The guard does not authorize writes merely because a file is outside the protected set. Monitoring code is still limited to the monitoring-output root.

## Private-output rule

`data-staging/monitoring/**` is ignored by Git and uploaded only as a workflow artifact. Later PRs may deliberately retain reviewed monitoring fixtures, but raw monitoring runs remain untracked.

No raw monitoring URL, finding, candidate, discovery lead, stale-state finding, or internal score may be surfaced publicly without a separate reviewed canonical-data or editorial PR.

## PR #324 bounded scheduled read-only operation

Binding specification:

```text
docs/quality/monitoring-bounded-scheduled-read-only-spec.md
```

PR #324 activates exactly two scheduled groups:

```text
daily
weekly
```

The current deterministic partition is:

```text
daily source count: 4
weekly source count: 35
overlap: 0
union: all 39 reviewed official sources
source/baseline parity: exact for both groups
all 39 baselines remain pending_initial_acceptance
```

Daily group:

```text
platform_policy sources
platform_service_state sources
bounded private news discovery
```

Weekly group:

```text
all remaining reviewed official sources
ESMA regulatory-register source
issuer reserve/transparency sources
redemption and mint-term sources
issuer lifecycle and regulatory sources
article/research stale-state review
```

The scheduled workflow uses:

```text
permissions:
  contents: read
```

It may upload private artifacts. It must not create branches, commits, canonical pull requests, guide edits, candidate publication, discovery publication, baseline acceptance, canonical writes, or deployment actions.

## Bounded news discovery

News discovery is private lead generation only.

Bounds:

```text
maximum queries per run: 4
maximum items retained per query: 20
maximum response body: 1 MiB
request timeout: 15 seconds
raw response retention: false
status: discovery_only
canonical_action: none
public_output: false
```

Feed failures are private monitoring errors and must not be converted into availability, regulatory, lifecycle, or canonical conclusions.

## Article stale-state review

Weekly stale-state review reads reviewed research timestamps and classifies:

```text
current: 0-7 days
review_due: 8-14 days
stale: 15-30 days
severely_stale: 31+ days
missing_date: no usable date
```

The output is private review material only. It does not edit the guide, editorial research matrix, monitoring source configuration, or canonical data.

## Failure behavior

A monitoring run fails when:

- canonical snapshot capture fails;
- protected JSON cannot be parsed;
- a protected file is missing;
- monitoring writes outside its output root;
- canonical before/after hashes differ;
- required output files are missing or invalid;
- schedule group is invalid;
- daily/weekly source partition overlaps or does not cover all reviewed sources;
- selected source/baseline IDs differ;
- the health monitor reports a fatal repository-integrity problem.

Individual source fetch failures, individual news-feed failures, and stale review dates are recorded as private review outcomes and do not authorize inference.

A failed monitoring run does not change canonical data and does not trigger production deployment.

## Data preservation

Monitoring work preserves current canonical registry counts unless a separate approved data PR changes them. Monitoring artifacts, discovery leads, and stale-state findings are excluded from all canonical counts.

All 39 repository monitoring baselines remain pending in PR #324. Accepted baseline count and accepted asset reach remain zero.

## Deployment classification

```text
No production deployment required
```
