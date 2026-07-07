# Stable or Gone bounded scheduled read-only monitoring specification

Status: canonical implementation specification — PR #324  
Updated: 2026-07-07

## 1. Purpose

PR #324 activates bounded scheduled monitoring for the reviewed monitoring system completed through PR #323.

The scheduled system is private, artifact-only, review-only, and read-only with respect to canonical data.

The scheduling layer may:

```text
fetch reviewed allowlisted official sources
fetch a bounded public news-discovery feed set
normalize observations
compare reviewed baseline state
classify observed source changes
produce private candidates
produce private review material
check reviewed article/research freshness
upload private workflow artifacts
```

It may not:

```text
write canonical registry data
accept or mutate monitoring baselines
edit the EU/EEA guide automatically
create branches automatically
open canonical pull requests automatically
publish monitoring candidates
publish news-discovery leads
publish article-stale-state findings
deploy monitoring output
use Cloudflare credentials
```

## 2. Starting boundary

PR #324 starts from the reviewed PR #323 monitoring boundary:

```text
100 canonical stable assets
94 organizations
110 relationships
39 reviewed official sources
39 pending baseline rows
0 accepted baselines
23 assets with registered source reach
77 uncovered assets
5 market-access schema-capable sources
4 scoped platforms
```

PR #321, PR #322, and PR #323 monitoring snapshots remain immutable.

## 3. Scheduled groups

The runtime uses exactly two scheduled groups:

```text
daily
weekly
```

A scheduled run must identify its group in the manifest.

### 3.1 Daily group

The daily group observes:

```text
platform_policy sources
platform_service_state sources
bounded news discovery
```

Current reviewed official-source membership:

```text
binance-eea-stablecoin-policy
kraken-eea-stablecoin-offerings
bitstamp-europe-mica-assets
gemini-eea-account-closure
```

Source-group membership is derived from reviewed `monitoring_scope.kind`, not duplicated in a second hand-maintained source list.

### 3.2 Weekly group

The weekly group observes:

```text
all reviewed official sources not assigned to the daily group
issuer reserve/transparency sources
redemption and mint-term sources
issuer lifecycle sources
issuer/token regulatory sources
regulator action sources
regulatory-register sources
article/research stale-state review
```

Current reviewed official-source membership is the remaining 35 of 39 sources.

The ESMA regulatory-register source is therefore weekly.

## 4. Trigger contract

The scheduled workflow uses two bounded cron triggers and a manual dispatch option.

```text
daily group: once per day
weekly group: once per week
```

No scheduled group may run more frequently than once per day.

The workflow must also support:

```text
workflow_dispatch group=daily|weekly
```

The workflow must not use:

```text
push
pull_request
workflow_run
contents: write
pull-requests: write
issues: write
id-token: write
wrangler
Cloudflare credentials
```

Required permission:

```text
contents: read
```

## 5. Official-source selection

Official-source selection is deterministic.

Daily source rule:

```text
monitoring_scope.kind in [platform_policy, platform_service_state]
```

Weekly source rule:

```text
all enabled reviewed sources not selected by the daily rule
```

The selector must prove:

```text
daily count = 4
weekly count = 35
overlap = 0
union = 39
source/baseline parity for each group = true
all selected baselines remain pending_initial_acceptance
```

A source cannot silently belong to both groups.

## 6. Bounded news discovery

News discovery is lead generation only.

The daily news monitor uses a fixed reviewed query set stored in code or a reviewed configuration file.

Initial query families:

```text
stablecoin MiCA exchange EEA
stablecoin delisting Europe exchange
stablecoin deposit withdrawal EEA exchange
stablecoin CASP authorization Europe
```

Boundaries:

```text
maximum queries per run: 4
maximum items retained per query: 20
maximum feed response body: 1 MiB
request timeout: 15 seconds
raw response body retention: prohibited
canonical classification: prohibited
public output: prohibited
```

Each retained discovery item contains only bounded metadata:

```text
title
link
publisher when available
published_at when available
query_id
discovered_at
status: discovery_only
canonical_action: none
```

News discovery may identify leads but does not create a canonical fact, event, regulatory state, or market-access state.

Feed failure is recorded as a private monitoring error and does not authorize fallback inference.

## 7. Article and research stale-state review

The weekly group performs a local read-only freshness review of the reviewed EU/EEA market-access research state.

Initial input:

```text
data/editorial-research/eu-stablecoin-market-access.json
```

The monitor reads:

```text
information_current_through
reviewed_sources[].last_checked_at
reviewed_sources[].review_state
```

It writes a private report only.

Initial freshness bands:

```text
current: 0-7 days
review_due: 8-14 days
stale: 15-30 days
severely_stale: 31+ days
missing_date: no usable review date
```

A stale-state finding does not edit the guide, research matrix, monitoring source configuration, or canonical data.

## 8. Scheduled output contract

Scheduled runs continue to use:

```text
data-staging/monitoring/<run_id>/
```

Common official-source files remain:

```text
manifest.json
health.json
official-source-observations.json
monitoring-candidates.json
review-material.json
evidence-drafts.json
review-report.md
pr-material.md
summary.md
```

Daily runs additionally write:

```text
news-discovery.json
```

Weekly runs additionally write:

```text
article-stale-state-review.json
```

All output remains ignored by Git and is uploaded as a private workflow artifact.

## 9. Manifest extension

Scheduled manifests add:

```text
schedule_group: daily | weekly | null
official_source_selection_count
news_discovery_item_count
news_discovery_error_count
article_stale_finding_count
```

Manual unscheduled runs use:

```text
schedule_group: null
```

## 10. Canonical guard

The canonical guard remains mandatory.

It protects repository-controlled data and public source roots, including:

```text
data/**
config/**
src/**
public/**
docs/migration/**
```

The guard must compare pre-run and post-run snapshots and fail when any protected bytes or protected path set changes.

Scheduled extras do not weaken the guard.

## 11. Failure and partial-result behavior

Fatal failures:

```text
invalid schedule group
source-group overlap
source-group union mismatch
source/baseline mismatch
canonical guard failure
protected JSON parse failure
output contract violation
```

Nonfatal private monitoring errors:

```text
one official source fetch failure
one news feed fetch failure
missing optional publisher metadata
stale article/research dates
```

A nonfatal fetch error is recorded. It must not be converted into an availability, regulatory, lifecycle, or canonical conclusion.

## 12. Workflow safety contract

The scheduled workflow must have:

```text
permissions:
  contents: read
```

It must not contain:

```text
contents: write
pull-requests: write
issues: write
id-token: write
wrangler
CLOUDFLARE_
create-pull-request
checkout push credentials for write operations
```

Artifact upload is allowed.

## 13. Validation requirements

PR #324 validation must prove:

```text
daily selector contains exactly 4 current platform sources
weekly selector contains exactly 35 remaining sources
daily/weekly overlap is zero
daily/weekly union is all 39 sources
baseline subset parity is exact for both groups
all 39 repository baselines remain pending
news discovery fixture enforces 4-query and 20-item bounds
news discovery fixture stores no raw feed body
article stale-state fixture classifies all freshness bands
scheduled daily fixture writes news-discovery.json
scheduled weekly fixture writes article-stale-state-review.json
scheduled manifests identify schedule_group
manual unscheduled monitoring remains backward compatible
canonical guard remains unchanged and passes
workflow permissions remain contents: read only
workflow contains only daily and weekly schedules
workflow does not create branches, pull requests, canonical writes, or deployments
full monitoring validation chain passes
```

## 14. Explicit non-goals

PR #324 does not:

- accept a baseline;
- publish monitoring output;
- write stablecoin records;
- write organization records;
- write events or evidence;
- edit the EU/EEA guide;
- create canonical Market Access Records;
- create automatic canonical branches or pull requests;
- deploy monitoring artifacts;
- start statistics implementation;
- start growth beyond 100 assets;
- implement Compare, Explorer, Timeline, or public update surfaces.

Statistics begin at PR #325 after PR #324 closes Phase C.

## 15. Completion condition

PR #324 is complete when:

```text
source selector contract is implemented
bounded daily news discovery is implemented
weekly article stale-state review is implemented
scheduled runner integrates daily and weekly groups
scheduled workflow uses read-only permissions
scheduled workflow has one daily and one weekly trigger
all scheduled output remains private artifact material
PR #321/#322/#323 snapshots remain valid
all 39 baselines remain pending
accepted baseline count remains zero
accepted asset reach remains zero
repository authority shows PR #324 active / PR #325 next
full CI and independent audit workflows are green
```
