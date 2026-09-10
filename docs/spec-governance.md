# Stable or Gone Specification Governance

Status: canonical governance specification
Updated: 2026-09-11

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
Stage: POST_CUTOVER_STATS_HEALTH_COMPLETE
Permanent analytical specification: docs/stats-spec.md
Historical execution ledger: docs/UI-REDESIGN-SCHEDULE.md
Production branch: main
Completed implementation branch: ui/stats-registry-health-20260910
Verified production commit: 157ec8c391a9134552c9e0beabb3ff430e867fd6
```

UI Redesign V4 completed production cutover through PR #636. The later Public Stats / Registry Health split completed through PR #653; PR #658 corrected a stale pre-split production smoke assertion, and Deploy production run #516 verified the resulting production commit.

The former implementation branches remain historical lineage, not active release isolation state.

## Current product authority

The completed information architecture remains the default public contract:

```text
/stats/        public registry analysis
/maintenance/  public-safe Registry Health and maintenance
```

`docs/stats-spec.md` remains the permanent analytical contract unless superseded by a separately reviewed specification.

This contract does not authorize canonical-fact mutation, schema/taxonomy mutation, predictive risk scoring, ranking/recommendation, private monitoring publication, DNS/Cloudflare account mutation, or new analytics identity creation.

## Release rule

`main` publishes automatically. Substantial future changes should be completed and validated on an isolated branch before merge when partial publication would create an inconsistent product state.

The paired Stats / Registry Health release rule has been satisfied and is closed. Do not infer that `ui/stats-registry-health-20260910` remains an active implementation branch.

Canonical record growth, evidence, guides, monitoring, SEO, article publication, and ordinary maintenance may continue on `main` under their applicable specifications.

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

`DESIGN.md` and `docs/stats-spec.md` control the current analytical hierarchy. The V4 dark observatory design remains the production visual lineage.

Older UI-v3 layout baselines, generated SVG mock fidelity, and outgoing visual composition are not active acceptance gates.

## Required start protocol

Before substantive future work:

1. read `AGENTS.md`;
2. read the specifications relevant to the requested work;
3. read `DESIGN.md`, this file, roadmap, and deployment policy when presentation or publication is involved;
4. confirm current `main`, relevant open PRs, and production state;
5. inspect the current implementation and canonical fields used by the target surface;
6. sync current `main` when necessary;
7. do not start unrelated validators/frameworks without a demonstrated need.

## Closeout record

The Public Stats / Registry Health workstream is production-verified and closed.

```text
Feature PR: #653
Feature merge: 0fc86a7d1020e1271306b5c479e2747383b84680
Smoke hotfix PR: #658
Verified production commit: 157ec8c391a9134552c9e0beabb3ff430e867fd6
Deploy production: #516 / run 34497114140 / success
```

Any next substantial workstream requires its own reviewed scope. Remaining V4 cleanup is non-blocking maintenance and must remain non-destructive.
