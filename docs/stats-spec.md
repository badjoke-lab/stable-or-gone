# SOG statistics and registry-health specification

Status: implemented production specification  
Updated: 2026-09-11  
Completed implementation branch: `ui/stats-registry-health-20260910`  
Feature PR: #653  
Verified production commit: `157ec8c391a9134552c9e0beabb3ff430e867fd6`

Public routes:

```text
/stats/        public analytical view
/maintenance/  public-safe Registry Health and maintenance view
```

Machine-readable outputs remain:

```text
/data/stats.json
/data/stats-history.json
/data/maintenance-log.json
```

## Purpose

SOG separates two different questions that were previously mixed together.

`/stats/` helps readers understand the reviewed stablecoin registry: current lifecycle state, composition, historical failure concentration, material-event change over time, and the confidence/coverage available for interpreting those views.

`/maintenance/` helps readers understand the health of the registry itself: review freshness, public data coverage, known-unknown aggregates, evidence depth, reviewed-corpus growth, route/public-layer integrity, and monthly public maintenance checkpoints.

Neither page is:

- a live price dashboard;
- a market-cap ranking;
- a yield ranking;
- a safety score;
- a risk score;
- an investment comparison tool;
- a publication surface for private monitoring queues or unreviewed candidates.

All values are derived from reviewed canonical repository data at build time or from reviewed public maintenance checkpoints.

## Public Stats contract

### Required reading order

The public Stats page should answer the following questions in order:

1. What does the registry look like now?
2. How are lifecycle states distributed?
3. What kinds of stable assets are recorded?
4. Where are historical failures concentrated?
5. How has recorded material activity changed over time?
6. How complete and current is the evidence behind the view?
7. Where should a reader drill into the underlying register next?

### Executive summary

Display exact current totals for:

```text
Stable assets
Organizations
Material events
Evidence
```

A short analytical summary may be generated only from deterministic current totals and distributions. It must not introduce unsourced causal claims or forecasts.

### Current state

Primary lifecycle grouping remains:

```text
Operating
  active

Constrained
  restricted
  suspended
  winding_down

Historical non-failure
  inactive
  terminated
  migrated
  rebranded

Failed
  collapsed

Other
  announced
  unknown
```

The public view must preserve the distinction between closure/migration and failure. Exact counts must accompany any visual representation.

### Composition

The main Stats page should limit the first analytical layer to a small number of high-value dimensions instead of dumping every classification into equal-sized panels.

Primary public composition dimensions:

```text
Reference target / fiat reference where supportable
Backing type
Redemption status / exit state
Deployment chains
```

Additional classification detail remains available through the register, machine-readable stats, and methodology.

Backing type is multi-select. Percentages across backing types do not sum to 100 and must not be rendered as a mutually exclusive pie chart.

Deployment asset count and deployment count are different quantities and must not be conflated.

### Historical failure patterns

The page may show descriptive historical failure concentration by dimensions already represented in canonical statistics, including:

```text
stabilization mechanism
backing type
reference target when explicitly implemented
launch / collapse year when dates are supported
```

A displayed category failure share is calculated as:

```text
failed assets in category / all recorded assets in the same category
```

The UI must show the numerator and denominator alongside the percentage.

For multi-select backing types, category denominators overlap; this must be stated in the UI or methodology note.

Do not label these descriptive historical rates as future risk, probability of failure, safety, or recommendation. Do not create a composite risk score or ranked investment list.

### Depeg and recovery context

Where canonical event details support it, display depeg outcome counts:

```text
recovered
partially_recovered
not_recovered
collapsed
unknown
```

Do not fabricate price extremes, durations, or recovery states.

### Change over time

The main Stats page should prioritize subject activity, not repository work volume.

Preferred event-time views:

```text
material events by month for the latest recorded period
material events by year for longer history
major event-type distribution
lifecycle transitions where supportable
```

A monthly presentation may group canonical `event_date` values into `YYYY-MM` buckets at build time. Unknown or incomplete dates are not silently assigned to a month.

Corpus-growth checkpoints do not belong in the primary public Stats narrative; they belong to Registry Health.

### Coverage and confidence

The public Stats page keeps a compact, reader-oriented confidence section. Appropriate indicators include:

```text
assets with at least one evidence item
verification freshness bands
assets with reserve reports
assets with deployment data
known-unknown counts
```

These metrics describe registry coverage, not asset safety.

### Explore next

The page should end with real drilldowns to supported registry surfaces, such as:

```text
failed assets
constrained assets
assets with recorded depeg history
material events
organizations
Registry Health
```

Links may use only query parameters already supported by the public register.

## Registry Health / Maintenance contract

### Purpose

`/maintenance/` is a public-safe operational quality view of SOG itself. It does not become an admin console and does not expose private research work.

### Required sections

1. Registry Health summary
2. Review freshness
3. Public data coverage
4. Known-unknown and evidence-depth aggregates
5. Public-layer / contract integrity from reviewed maintenance checks
6. Reviewed corpus growth / checkpoint history
7. Monthly public maintenance log

### Allowed public aggregate signals

Examples:

```text
verification recency bands
assets with zero evidence
assets with high/critical known unknowns
assets lacking deployment coverage
assets lacking reserve-component coverage
classification/profile/legal/deployment coverage
average and median evidence depth
reviewed checkpoint growth
public contract check outcomes
```

### Forbidden operational disclosure

Do not publish:

```text
monitoring candidate rows
unreviewed stablecoin candidates
private source queues
candidate URLs
private notes
secret values
internal reviewer assignments
row-level internal task queues
unreviewed classifications
```

If a mockup contains row-level “Needs review” examples, production must replace them with public-safe aggregate signals unless a separately reviewed publication authority explicitly allows the rows.

### Monthly log preservation

The existing reviewed `/data/maintenance-log.json` and monthly checkpoint semantics remain public. The page may present the log below Registry Health as progressive disclosure rather than forcing all checkpoint detail into the first screen.

Closed monthly entries remain immutable and append-only under the existing maintenance-log contract.

## Data-quality statistics

The machine-readable statistics continue to support:

- classification coverage;
- reserve/redemption profile coverage;
- legal-profile coverage;
- deployment coverage;
- stable-asset relationship coverage;
- reserve-component coverage;
- archive URL coverage;
- average and median evidence per asset;
- known-unknown count;
- assets with high-severity known unknowns;
- verification recency bands;
- events with complete typed details.

Quality coverage is not a safety score.

## Existing generated data format

`stats.json` remains deterministic and contains the existing major groups:

```json
{
  "schema_version": "1.0",
  "generated_at": "build-time ISO timestamp",
  "registry_version": "repository commit or public version",
  "totals": {},
  "lifecycle": {},
  "classification": {},
  "issuance": {},
  "redemption": {},
  "yield": {},
  "events": {},
  "deployments": {},
  "organizations": {},
  "data_quality": {},
  "methodology": {}
}
```

This production contract does not require a schema migration merely to change page composition. Page-only deterministic projections may be calculated from the same reviewed canonical input at build time where necessary, provided the calculation is documented here and does not use private sources.

`stats-history.json` remains reviewed checkpoint history. It is used primarily by Registry Health for corpus-growth context rather than as a headline public-market statistic.

## Visual design rules

### Public Stats

- clear hierarchy before density;
- current lifecycle state is the visual centerpiece;
- four substantial composition panels are preferable to a wall of tiny category cards;
- historical failure patterns and change over time are primary analytical sections;
- exact counts remain visible beside charts;
- one major chart or analytical block per row on narrow screens;
- no decorative globe/Earth art;
- no retro-terminal treatment;
- no generic card wall where all metrics receive equal visual weight.

### Registry Health

- operational but still public-facing;
- aggregate health signals first;
- public contract outcomes and coverage gaps are explicit;
- monthly logs use progressive disclosure;
- internal/private queue semantics must not leak into visual examples or production copy.

## Validation rules

Fail or block release when:

- totals do not match canonical loaders;
- lifecycle groups omit or double-count a canonical status;
- single-select dimensions do not equal the correct denominator;
- multi-select dimensions are presented as mutually exclusive;
- an unknown category is silently discarded;
- a historical failure rate uses the wrong category denominator;
- a page calls descriptive failure concentration a safety/risk score or forecast;
- stats or maintenance pages contain mockup placeholder numbers;
- private candidate/monitoring data appears in public output;
- history snapshots are reordered or rewritten without explicit migration;
- live market, price, market-cap, or yield data enters the canonical stats output;
- public Stats and Registry Health regress into the same undifferentiated dashboard;
- responsive layouts introduce horizontal overflow or hide exact counts.

## Implementation and release record

The initial production implementation followed this sequence:

```text
update specification and agent authority
-> implement Public Stats
-> implement Registry Health / Maintenance
-> validate canonical/statistics/registry contracts
-> Astro check + production-equivalent build
-> route/link + responsive inspection
-> sync latest main
-> merge both surfaces together in PR #653
-> correct stale pre-split Stats production smoke assertion in PR #658
-> verify production on Deploy production run #516
```

Production verification succeeded on commit `157ec8c391a9134552c9e0beabb3ff430e867fd6`. Future changes must continue to satisfy this specification but do not reopen the completed implementation branch by default.
