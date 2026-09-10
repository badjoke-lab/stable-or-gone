# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Current stage: POST_CUTOVER_STATS_HEALTH_COMPLETE
Production branch: main
Official public origin: https://www.stableorgone.com
UI Redesign V4 production cutover: complete via PR #636 / merge 60940f0c1ad1d69961e839fa4979a7c4e29d91af
Public Stats / Registry Health split: complete via PR #653
Verified production commit after smoke-contract fix: 157ec8c391a9134552c9e0beabb3ff430e867fd6
Deploy production verification: run #516 / success
Ranking / scoring / recommendation authorized: no
DNS / Cloudflare account mutation authorized: no
New GA4 property / Measurement ID creation authorized: no
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts. Completed implementation branches are historical lineage and must not be treated as active work merely because they remain in repository history.

## Mandatory references

Before starting or resuming substantive work, read the specifications relevant to the requested lane. For presentation, analytics, or publication work, read at minimum:

1. `AGENTS.md`
2. `DESIGN.md`
3. `docs/spec-governance.md`
4. `docs/roadmap.md`
5. `docs/deployment-policy.md`
6. the workstream-specific specification, such as `docs/stats-spec.md`
7. relevant permanent data/classification/evidence/deployment specifications
8. current implementation of the affected public surfaces

Do not rely on chat summaries when merged repository documents are available.

## Current operating rule

At the start of each implementation session:

- fetch current `main` and relevant open PR/branch heads;
- inspect the current implementation and canonical fields used by the target surface;
- read the applicable permanent/workstream specification before changing semantics;
- determine whether the requested work is ordinary maintenance or needs a new reviewed workstream;
- do not resurrect completed branches as active work by default;
- do not start unrelated framework, validator, or workflow work without a demonstrated need.

At the end of each implementation unit:

- update the relevant specification / roadmap / schedule status when deliverables changed;
- record branch/head and validation results when applicable;
- state completed and incomplete work;
- state latest main sync point when a release branch exists;
- state explicitly whether production changed.

## Public Stats / Registry Health boundary

The completed production split is an enduring product contract.

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

Preserve data/integrity/build/public-layer checks. UI checks should target demonstrated failure modes: route health, broken links, horizontal overflow, control usability, basic accessibility, state correctness, and representative desktop/mobile inspection.

Do not restore obsolete UI-v3 visual baselines, generated SVG mock fidelity, or pixel-perfect equality to an outgoing composition as acceptance gates.

Do not create new audit frameworks, validators, or workflow layers unless required by a current specification or needed to cover an actual defect. Prefer implementing the product over expanding process machinery.

## Mobile

Mobile is part of each public surface. Stats uses one major chart or analytical block per row at narrow widths, preserves exact counts alongside graphics, and avoids squeezed multi-column dashboards. Registry Health follows the same rule.

## Production safety

`main` is the production source and publishes automatically. For a substantial change that should not ship partially:

- use an isolated implementation branch;
- sync current `main` if it advances;
- run applicable canonical, statistics, registry-integrity, Astro/build, public-layer, route/link, and representative responsive checks;
- record the pre-merge `main` SHA when rollback may be needed;
- merge only after the release unit is complete;
- verify production routes and public data after deployment;
- roll back on a critical regression.

The former `ui/stats-registry-health-20260910` release is complete and does not remain an active production-safety branch.

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
