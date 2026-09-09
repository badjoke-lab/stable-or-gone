# Stable or Gone Specification Governance

Status: canonical governance specification
Updated: 2026-09-10

## Authority order

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts do not override merged repository authority.

Authority order:

1. `docs/deployment-policy.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. current reviewed authority / roadmap amendment
5. current workstream specification and execution schedule
6. permanent operating specifications
7. enduring regression authorities
8. named audits, baselines, queues, and reviewed prior outputs
9. conversation history and unmerged drafts

## Current reviewed stage

```text
Stage: POST_CUTOVER_STATS_HEALTH_SPLIT
Primary specification: docs/stats-spec.md
Current schedule: docs/UI-REDESIGN-SCHEDULE.md
Implementation branch: ui/stats-registry-health-20260910
Production branch: main
```

UI Redesign V4 completed production cutover through PR #636, merge commit `60940f0c1ad1d69961e839fa4979a7c4e29d91af`. The former `UI_REDESIGN_V4_AUTHORITY` remains historical implementation lineage rather than the current unfinished production-isolation state.

## Current product authority

The current workstream is a post-cutover information-architecture refinement:

```text
/stats/        public registry analysis
/maintenance/  public-safe Registry Health and maintenance
```

The workstream may change page composition, analytical hierarchy, and documented deterministic presentation rules, but it does not authorize canonical-fact mutation, schema/taxonomy mutation, predictive risk scoring, ranking/recommendation, private monitoring publication, DNS/Cloudflare account mutation, or new analytics identity creation.

## Release isolation rule

`main` publishes automatically. The Public Stats and Registry Health changes are developed together on `ui/stats-registry-health-20260910` and released as one unit after validation.

Do not merge only the Stats half or only the Registry Health half of the approved split.

Canonical record growth, evidence, guides, monitoring, and ordinary maintenance may continue independently on `main`; before release, the refinement branch must sync newer reviewed changes when necessary.

## Canonical boundary

Current counts and hash are dynamic because approved record-growth work may continue on `main`. Analytical pages read current canonical data at build time and must not freeze stale mockup counts.

The UI must not edit canonical facts merely to complete a desired chart. Unknown values remain visible.

Historical failure-rate presentation is permitted only as a deterministic descriptive calculation with the category numerator and denominator shown. It must not be framed as a safety/risk score, forecast, or investment recommendation.

## Public/private operational boundary

Registry Health may publish reviewed aggregate quality metrics and reviewed monthly maintenance outcomes.

It must not publish:

- monitoring candidates;
- unreviewed candidate stablecoins;
- private source queues;
- candidate URLs;
- private notes;
- secrets;
- row-level internal review tasks;
- unreviewed classifications.

The existing public monthly maintenance-log contract remains valid.

## Visual authority

`DESIGN.md` and `docs/stats-spec.md` control the current analytical page hierarchy. The V4 dark observatory design remains the production visual lineage.

Older UI-v3 layout baselines, generated SVG mock fidelity, and outgoing visual composition are not active acceptance gates.

## Required start protocol

Before substantive current-work implementation:

1. read `AGENTS.md`;
2. read `docs/stats-spec.md`;
3. read `DESIGN.md`, this file, roadmap, and deployment policy;
4. confirm current `main`, implementation branch head, open PRs, and relevant production state;
5. inspect `/stats/`, `/maintenance/`, canonical statistics, and maintenance-log sources;
6. sync current `main` when necessary;
7. do not start unrelated validators/frameworks without a demonstrated need.

## Closeout

After the paired Stats / Registry Health release is production-verified:

- update roadmap/schedule with final merge/deploy evidence;
- keep only demonstrated regression checks;
- continue normal record growth and registry work under the next reviewed lane;
- keep any remaining V4 cleanup as an explicit, non-destructive maintenance task.
