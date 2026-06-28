# Stable or Gone review-only monitoring pipeline

Status: canonical specification  
Updated: 2026-06-29  
Applies to: PR #230–#232

## Purpose

The monitoring pipeline observes official and high-value source changes, records private candidate material, performs duplicate and lineage checks, drafts evidence, and prepares reviewable material. It does not publish monitored findings or modify canonical records automatically.

The binding sequence is:

```text
official-source observation
→ private candidate record
→ duplicate and lineage checks
→ evidence draft
→ reviewable PR material
→ human approval before canonical publication
```

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

## PR responsibilities

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

## PR #230 trigger and permissions

The PR #230 workflow is manual-only:

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

## PR #230 output contract

Each run writes exactly one run directory:

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

Required fields:

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

For PR #230:

```text
mode: health-only
external_network_used: false
status: completed | failed
canonical_guard.before_hash
canonical_guard.after_hash
canonical_guard.changed_paths
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

PR #230 must produce:

```text
candidate_count: 0
```

### summary.md

Required sections:

```text
# SOG Review-only Monitoring
## Run
## Canonical guard
## Repository health
## Candidate output
## Operator action
```

The operator action for a successful PR #230 health-only run is `No canonical action required`.

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

`data-staging/monitoring/**` is ignored by Git and uploaded only as a workflow artifact during PR #230. Later PRs may deliberately retain reviewed monitoring fixtures, but raw monitoring runs remain untracked.

No raw monitoring URL, finding, candidate, or internal score may be surfaced publicly without a separate reviewed canonical-data or editorial PR.

## Failure behavior

A monitoring run fails when:

- canonical snapshot capture fails;
- protected JSON cannot be parsed;
- a protected file is missing;
- monitoring writes outside its output root;
- canonical before/after hashes differ;
- required output files are missing or invalid;
- the health monitor reports a fatal repository-integrity problem.

A failed monitoring run does not change canonical data and does not trigger production deployment.

## Data preservation

PR #230–#232 must preserve the current canonical registry counts unless a separate approved data PR changes them. Monitoring artifacts are excluded from all canonical counts.

## Deployment classification

```text
No production deployment required
```
