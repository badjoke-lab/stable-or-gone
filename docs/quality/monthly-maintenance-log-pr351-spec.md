# SOG monthly maintenance log — PR #351

Status: public operational transparency specification  
Updated: 2026-07-10

## 1. Purpose

PR #351 closes the current public-surface expansion sequence by publishing a monthly maintenance log at:

```text
/maintenance/
```

with a machine-readable endpoint:

```text
/data/maintenance-log.json
```

The log exposes public-safe aggregate operational outcomes without exposing internal research and monitoring material.

## 2. Public boundary

The monthly log may publish:

- month and checkpoint status;
- as-of date;
- public summary;
- aggregate contract-check results;
- aggregate public counts;
- released public surfaces;
- next public maintenance priorities.

The log must not publish:

- internal monitoring rows;
- unreviewed candidates;
- private notes;
- private source queues;
- candidate URLs;
- secrets.

## 3. Month policy

There is at most one entry per calendar month.

Allowed states:

```text
in_progress
closed
```

The current month may be updated while `in_progress`.

Once a month is `closed`, its entry is immutable. Future maintenance history grows by appending new month entries.

## 4. Required contract checks

Every month entry contains exactly these public check IDs:

```text
canonical_data_validation
registry_v2_v3_parity
statistics_history_immutability
site_architecture_contract
responsive_accessibility_contract
publication_feed_contract
```

Allowed results:

```text
passed
attention_required
not_run
not_applicable
```

A check result is an operational outcome only. It is not a stablecoin risk score, ranking, or compliance conclusion.

## 5. Public counts

PR #351 v1 records two public checkpoint counts:

```text
canonical_stable_assets
publication_feed_entries
```

For an `in_progress` current month, validators must reconcile these values against the current reviewed registry and deterministic Update Feed.

Closed historical months preserve their snapshot values even when later registry growth changes current counts.

## 6. Public surface releases

A monthly entry may list released public surfaces as:

```text
id
label
local public route
```

Routes must be local paths beginning with `/`.

External candidate URLs, source queues, and private review links are forbidden.

## 7. Operational semantics

The Maintenance Log answers:

```text
What public maintenance work and contract outcomes were recorded for this month?
```

It does not replace:

- Change Timeline historical subject changes;
- Update Feed registry publication changes;
- internal monitoring;
- candidate review queues;
- incident alerts.

## 8. Determinism

The machine projection:

- binds the config and source-file contents;
- sorts entries month descending;
- sorts checks by check ID;
- sorts public-surface releases by release ID;
- preserves next-focus order;
- emits a deterministic input digest;
- emits byte-identical JSON for identical inputs.

## 9. Initial July 2026 checkpoint

PR #351 starts the public log with:

```text
month: 2026-07
status: in_progress
as_of: 2026-07-10
```

The entry records the current reviewed public-surface expansion sequence and current public checkpoint counts.

The July entry is not closed by PR #351. It remains eligible for month-end review and closure.

## 10. Navigation and discovery

`/maintenance/` must be available from:

- Project grouped navigation;
- About/project menu;
- Project footer group;
- site architecture;
- sitemap;
- manifest main routes.

`/data/maintenance-log.json` must be:

- registered in site architecture;
- discovered through the data manifest;
- advertised from `public_files.maintenance_log`.

Primary navigation remains unchanged at six items.

## 11. Architecture target

After PR #351:

```text
43 total routes
31 HTML routes
12 machine-readable routes
3 dynamic route families
14 grouped navigation items
2 utility destinations
16 architecture navigation destinations
```

## 12. Manifest boundary

The manifest must declare:

```text
source_boundary: public_safe_aggregate_operational_outcomes_only
aggregate_outcomes_only: true
closed_months_immutable: true
current_month_may_be_in_progress: true
includes_internal_monitoring_rows: false
includes_unreviewed_candidates: false
includes_private_notes: false
includes_private_source_queues: false
includes_candidate_urls: false
includes_secrets: false
operational_log_not_subject_history: true
operational_log_not_publication_feed: true
no_live_monitoring_feed: true
single_composite_score: false
risk_ranking: false
```

## 13. Validation requirements

PR #351 must prove:

1. one unique entry per month;
2. valid month and as-of date shapes;
3. in-progress/closed status vocabulary only;
4. exact six required check IDs per month;
5. allowed check-result vocabulary only;
6. public entry/check/release object key whitelists;
7. exact two public count fields;
8. current in-progress counts reconcile with current canonical assets and Update Feed entries;
9. release routes are local public paths;
10. projection summary reconciles from source entries;
11. repeated builds are byte-identical;
12. builder does not read monitoring, candidate, editorial-research, or private sources;
13. page visibly explains public/internal boundaries;
14. machine endpoint exactly matches the deterministic artifact;
15. manifest, sitemap, global shell, and site architecture discovery are valid;
16. desktop and mobile screenshots have no page-level horizontal overflow;
17. general CI, Responsive Accessibility, statistics history, and dedicated PR #351 workflow are green.

## 14. Non-goals

PR #351 does not:

- publish monitoring rows;
- publish candidate queues;
- publish source-discovery queues;
- publish candidate URLs;
- add canonical stablecoin records;
- alter Timeline projection values;
- alter Update Feed publication entries;
- create alerts;
- create scores or rankings;
- close July before month-end review;
- change immutable statistics history.

## 15. Sequence closure

After PR #351 merges, the current public-surface expansion sequence is complete.

Future work returns to evidence-backed record growth, Market Access promotion under PR #341 governance, monitoring review, corrections, and monthly maintenance without automatically opening another public-surface PR chain.
