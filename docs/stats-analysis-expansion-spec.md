# SOG statistics analysis expansion specification

Status: canonical implementation specification — PR #328  
Updated: 2026-07-08

## 1. Purpose

PR #328 expands the reviewed statistics foundation into the first full registry-analysis surface.

It reuses the deterministic PR #325 model, the immutable PR #326 checkpoint history, and the public PR #327 statistics routes. It does not create a second statistics source or calculate independent page-only totals.

## 2. Source boundary

All public analysis derives from:

```text
scripts/build-stats.mjs
scripts/stats/build-stats-model.mjs
data/stats-history.json
src/lib/statsData.mjs
```

The `/stats/` page and `/data/stats.json` must read the same deterministic model.

Candidate, monitoring, discovery, stale-state, editorial-research, and private records remain excluded.

## 3. Public analysis sections

PR #328 adds these analysis families to `/stats/`:

```text
Classification
Historical events and failures
Deployment analysis
Organization analysis
Data quality and evidence coverage
```

Existing PR #327 sections remain:

```text
Header and methodology notice
Eight KPI blocks
Lifecycle group distribution
Lifecycle status table
Reviewed checkpoint history
Machine-readable data links
```

## 4. Classification analysis

Display reviewed distributions for:

- asset class;
- reference target;
- fiat reference currency where known;
- backing type;
- stabilization mechanism;
- governance model;
- legal classification.

Backing type is multi-select. Percentages may exceed 100 and must not be represented as a mutually exclusive composition.

Unknown categories remain visible.

## 5. Historical events and failures

Display:

- events by year;
- event types;
- event detail kinds;
- depeg outcomes;
- lifecycle transition counts;
- failed asset count;
- failures by stabilization mechanism;
- failures by backing type;
- failures by governance model;
- failure launch-year distribution;
- collapse-year distribution.

When historical checkpoint history contains fewer than two reviewed snapshots, no registry-growth trend line is shown.

## 6. Deployment analysis

Display:

- total deployments;
- assets with deployments;
- chain-level asset and deployment counts;
- deployment canonicality;
- deployment type;
- verification status;
- freeze capability known count;
- blacklist capability known count;
- control capability unknown count.

Asset count and deployment count must remain distinct.

## 7. Organization analysis

Display:

- total organizations;
- total asset-organization relationships;
- role-level relationship count;
- role-level organization count;
- role-level asset reach.

Organization roles are multi-role. Role counts must not be described as a mutually exclusive organization composition.

## 8. Data-quality analysis

Display:

- classification coverage;
- reserve/redemption profile coverage;
- legal profile coverage;
- deployment coverage;
- stable-asset relationship coverage;
- reserve-component coverage;
- archive evidence coverage;
- average evidence per asset;
- median evidence per asset;
- evidence-depth distribution;
- known-unknown total;
- high/critical known-unknown count;
- assets with high/critical known unknowns;
- verification recency bands;
- typed event-detail coverage.

Quality coverage is a description of registry completeness, not a safety, transparency, or risk score.

## 9. Visual contract

Use the existing quiet registry / editorial-ledger shell.

Allowed:

- exact tables;
- restrained horizontal bars;
- compact KPI blocks;
- year-distribution tables with proportional bars;
- two-column analytical layouts that collapse on smaller screens.

Not allowed:

- pie or donut charts;
- glossy dashboards;
- animated counters;
- live-market widgets;
- chart libraries added solely for this PR.

Exact counts remain visible next to graphical summaries.

## 10. Machine-readable parity

PR #328 does not change the public endpoint contract:

```text
/stats/
/data/stats.json
/data/stats-history.json
```

The expanded page must consume the deterministic model directly. Built `/data/stats.json` must remain byte-equivalent after JSON serialization to the deterministic generator result.

## 11. Safety and interpretation

The expanded statistics surface must continue to state that it is not:

- a live price dashboard;
- a market-cap ranking;
- a yield or APY ranking;
- a safety score;
- a transparency score;
- a risk score;
- an investment recommendation surface.

Unknown states are preserved and displayed.

## 12. Validation contract

PR #328 validation must prove:

- PR #327 foundation markers remain present;
- classification section markers exist;
- historical events and failures markers exist;
- deployment section markers exist;
- organization section markers exist;
- data-quality section markers exist;
- the page references deterministic model namespaces rather than duplicate static totals;
- multi-select caveats are visible;
- quality coverage is not described as a score;
- exact tables remain available;
- responsive breakpoints remain present;
- Astro check passes;
- static build passes;
- built `/stats/` contains all expansion section markers;
- built current statistics JSON still equals deterministic stats;
- built history JSON still equals canonical history;
- canonical registry counts remain unchanged.

## 13. Explicit non-goals

PR #328 does not:

- add live prices;
- add market-cap rankings;
- add APY or yield rankings;
- add safety, transparency, or risk scores;
- add comparison recommendations;
- add chart libraries;
- change canonical registry records;
- mutate statistics history automatically;
- begin candidate growth beyond the controlled Phase E sequence.

## 14. Completion condition

PR #328 is complete when:

```text
all five expansion analysis families are public on /stats/
source validator passes
built-output validator passes
Astro check passes
static build passes
full CI is green
independent audit workflows are green
canonical counts remain at the audited 100-asset checkpoint
PR #328 is merged before Phase E candidate audit begins
```
