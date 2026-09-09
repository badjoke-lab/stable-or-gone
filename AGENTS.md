# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Current stage: POST_CUTOVER_STATS_HEALTH_SPLIT
Active workstream specification: docs/stats-spec.md
Implementation branch: ui/stats-registry-health-20260910
Production branch: main
Official public origin: https://www.stableorgone.com
UI Redesign V4 production cutover: complete via PR #636 / merge 60940f0c1ad1d69961e839fa4979a7c4e29d91af
Partial Stats / Registry Health publication to main: forbidden
Ranking / scoring / recommendation authorized: no
DNS / Cloudflare account mutation authorized: no
New GA4 property / Measurement ID creation authorized: no
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts. The completed UI Redesign V4 authority remains historical implementation lineage; its accepted data, route, accessibility, mobile, and deployment contracts continue where they do not conflict with the current post-cutover workstream.

## Mandatory references

Before starting or resuming the current Stats / Registry Health work, read in this order:

1. `AGENTS.md`
2. `docs/stats-spec.md`
3. `DESIGN.md`
4. `docs/spec-governance.md`
5. `docs/roadmap.md`
6. `docs/deployment-policy.md`
7. `docs/ai-era-registry-spec.md`
8. `docs/ai-era-execution-schedule.md`
9. relevant permanent data/classification/evidence/deployment specifications
10. current implementation of `/stats/` and `/maintenance/`

Do not rely on chat summaries when merged repository documents are available.

## Current operating rule

At the start of each implementation session:

- fetch current `main` and `ui/stats-registry-health-20260910` heads;
- determine whether `main` advanced and must be synchronized before release;
- inspect the current Stats and Maintenance implementations and the canonical fields used by them;
- read `docs/stats-spec.md` before changing analytical semantics;
- keep the public Stats and Registry Health responsibilities separate;
- do not start unrelated framework, validator, or workflow work without a demonstrated need.

At the end of each implementation unit:

- update the relevant specification / roadmap / schedule status when deliverables changed;
- record branch/head and validation results;
- state completed and incomplete surfaces;
- state latest main sync point;
- state explicitly whether production changed.

## Public Stats / Registry Health boundary

`/stats/` is the public analytical view. It should answer:

- what the registry looks like now;
- how lifecycle states are distributed;
- how assets differ by supported canonical dimensions;
- where historical failures are concentrated, using descriptive historical rates only;
- how recorded material events changed over time;
- how much evidence and coverage supports the public view;
- where a reader can drill into the underlying registry.

`/maintenance/` is the public-safe Registry Health / operations view. It may show aggregate review freshness, coverage, known-unknown counts, evidence depth, reviewed-corpus growth, public-layer integrity, and the existing monthly maintenance log.

It must not publish monitoring candidates, private queues, candidate URLs, private notes, secrets, or row-level internal review tasks.

Corpus growth, review freshness, missing-field coverage, and operational integrity belong primarily to Registry Health rather than the main public Stats narrative.

## Data integrity

The UI adapts to canonical data. Canonical records must not be changed merely to make a desired visual state appear complete.

Do not invent market cap, price, lifecycle, backing, redemption, reserve, access, regulatory, evidence-coverage, issuer, deployment, failure-rate, or related values. Mockup numbers are not production data.

Derived analytical labels and rates require deterministic documented rules. Missing information must remain explicit as `Unknown`, `Not recorded`, or another approved null state.

Historical failure concentration is descriptive registry context, not a forecast, safety score, risk score, ranking, or investment recommendation.

Preserve deterministic per-asset JSON, provenance, evidence relationships, public machine-readable layers, Ledger Series projection, official-origin rules, legacy-host migration behavior, StablecoinMark/fallback behavior, and canonical logo-disposition requirements.

## UI validation policy

Preserve data/integrity/build/public-layer checks. New UI checks should target demonstrated failure modes: route health, broken links, horizontal overflow, control usability, basic accessibility, state correctness, and representative desktop/mobile inspection.

Do not restore obsolete UI-v3 visual baselines, generated SVG mock fidelity, or pixel-perfect equality to an outgoing composition as acceptance gates.

Do not create new audit frameworks, validators, or workflow layers unless required by a current specification or needed to cover an actual defect. Prefer implementing the product over expanding process machinery.

## Mobile

Mobile is part of each public surface. Stats uses one major chart or analytical block per row at narrow widths, preserves exact counts alongside graphics, and avoids squeezed multi-column dashboards. Registry Health follows the same rule.

## Production safety

`main` is the production source and publishes automatically. Develop the Stats / Registry Health split on `ui/stats-registry-health-20260910`; do not merge only one half of the split or an obviously incomplete analytical state.

Before release:

- sync current `main` if it advanced;
- run canonical, statistics, registry-integrity, Astro/build, public-layer, route/link, and representative responsive checks;
- record the pre-merge `main` SHA;
- merge the completed change once;
- verify production routes and public data after deployment;
- roll back on a critical regression.

## Enduring non-UI boundaries

Unless separately authorized:

```text
ranking / scoring / recommendation: forbidden
AI-generated canonical classification: forbidden
DNS / Cloudflare account mutation: forbidden
new GA4 identity creation or guessing: forbidden
remote runtime Stablecoin-logo fetching: forbidden
canonical fact invention for presentation: forbidden
private monitoring/candidate publication: forbidden
```
