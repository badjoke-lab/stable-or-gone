# SOG statistics foundation specification

Status: canonical implementation specification — PR #327  
Updated: 2026-07-08

## 1. Purpose

PR #327 creates the first public statistics foundation for Stable or Gone.

It connects the deterministic PR #325 statistics model and PR #326 immutable checkpoint history to:

```text
/stats/
/data/stats.json
/data/stats-history.json
```

The foundation is intentionally smaller than the full PR #328 analysis surface.

## 2. Source boundary

Current statistics derive from:

```text
scripts/build-stats.mjs
scripts/stats/build-stats-model.mjs
```

Checkpoint history derives from:

```text
data/stats-history.json
```

Shared public adapter:

```text
src/lib/statsData.mjs
```

The page and JSON routes must use the same deterministic current model and canonical history source.

## 3. Public routes

PR #327 adds:

```text
/stats/
/data/stats.json
/data/stats-history.json
```

These routes must appear in the site architecture contract.

`/stats/` must appear in:

```text
primary navigation
registry navigation group
footer registry group
sitemap
machine-readable main route inventory
```

The JSON routes must appear in:

```text
data manifest
llms.txt
ai.txt
statistics page data-access section
site architecture inventory
```

## 4. Foundation page scope

PR #327 `/stats/` includes only:

```text
page header and scope statement
reviewed checkpoint date
asset denominator
history snapshot count
methodology/safety notice
8 current KPI blocks
lifecycle group distribution
lifecycle status table
reviewed checkpoint history block
machine-readable data links
```

PR #328 remains responsible for the full historical, deployment, organization, classification, event, failure, and data-quality analysis expansion.

## 5. KPI foundation

The first 8 KPI blocks are:

```text
total assets
operating
constrained
historical non-failure
failed
organizations
events
evidence
```

Values come from the deterministic model.

No KPI may be computed independently in the page template from a second source.

## 6. Lifecycle foundation

The page displays:

```text
lifecycle groups as restrained horizontal bars
lifecycle statuses in an exact accessible table
```

Group and status counts come from the deterministic model.

Unknown states are not silently removed.

The visual bar is supplemental; exact counts and percentages remain available in text/table form.

## 7. History foundation

When history has exactly one reviewed snapshot:

```text
do not render a trend line
render checkpoint summary instead
explain that a trend line requires at least two reviewed checkpoints
```

When two or more snapshots exist, the page may render a checkpoint table in PR #327. Full trend visualization remains within the later statistics expansion.

History remains append-only reviewed checkpoint data.

## 8. Machine-readable contract

Current endpoint:

```text
/data/stats.json
```

must exactly equal the deterministic PR #325 model serialized as JSON.

History endpoint:

```text
/data/stats-history.json
```

must exactly equal `data/stats-history.json`.

The data manifest must declare:

```text
public_files.stats
public_files.stats_history
derived_statistics.page
derived_statistics.current
derived_statistics.checkpoint_history
derived_statistics.source_boundary
derived_statistics.history_policy
derived_statistics.excludes_live_market_metrics
```

## 9. Safety and interpretation

The page must state that statistics:

```text
describe registry records
are not market rankings
are not safety scores
are not investment recommendations
preserve unknown states
exclude live price
exclude market cap
exclude APY
exclude yield ranking
exclude safety scores
exclude risk scores
```

Candidate, monitoring, discovery, stale-state, editorial-research, and private inputs remain excluded from the deterministic model.

## 10. Visual direction

The page follows the existing editorial-ledger shell.

Required visual character:

```text
restrained
registry-like
border-led
number-first
accessible
responsive
not card-heavy
not glossy
not trading-terminal-like
```

Foundation visualization uses CSS only. No chart library is added.

Mobile rules:

```text
KPI grid: 2 columns
checkpoint grid: 2 columns
analysis layouts collapse to 1 column
machine-readable links collapse to 1 column
exact table content remains horizontally accessible where necessary
```

## 11. Validation contract

PR #327 validation must prove:

```text
deterministic stats totals remain 100 / 94 / 172 / 502 for core KPI inputs
current checkpoint exists in history
stats page foundation markers exist
shared adapter reuses deterministic generator
shared adapter reads canonical history source
all three routes are declared in site architecture
stats page is in sitemap and navigation
manifest declares both JSON endpoints and derived statistics policy
llms.txt and ai.txt expose both JSON endpoints
responsive CSS breakpoints exist
lifecycle visualization has accessible exact content
built stats JSON equals deterministic model
built history JSON equals canonical history source
built manifest declares stats routes
built stats HTML contains foundation sections
built sitemap contains /stats/
```

## 12. Explicit non-goals

PR #327 does not:

- implement the full PR #328 analysis surface;
- add chart libraries;
- add live market data;
- add price charts;
- add market-cap rankings;
- add APY rankings;
- add safety scores;
- add risk scores;
- reconstruct historical checkpoints;
- mutate statistics history automatically;
- change canonical registry records.

## 13. Completion condition

PR #327 is complete when:

```text
/stats/ builds and is navigable
/data/stats.json builds and matches deterministic stats
/data/stats-history.json builds and matches canonical history
manifest, AI discovery, site architecture, and sitemap are synchronized
source validator passes
built-output validator passes
site architecture audit passes
Astro check passes
static build passes
package.json and package-lock.json remain unchanged
canonical registry counts remain unchanged
authority shows PR #327 active / PR #328 next
full CI and independent audit workflows are green
```
