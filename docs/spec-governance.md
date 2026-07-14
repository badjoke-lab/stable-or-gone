# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-13

## 1. Purpose

This file defines repository document authority, conflict resolution, change control, PR traceability, data-preservation boundaries, monitoring safety, product-surface control, dossier-deepening rules, and post-351 operating governance.

Merged repository specifications are the source of truth.

Chat memory, handoff prose, issue discussion, generated reports, stale roadmap text, and unmerged drafts do not override merged repository authority.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication and Cloudflare rules.
2. `docs/spec-governance.md` for document authority and change control.
3. `docs/roadmap.md` for current phase, active item, next item, and PR numbering.
4. Active merged roadmap amendments named by the roadmap.
5. Canonical operating specification for the active program.
6. Work-item-specific canonical specification.
7. Named audits, inventories, baselines, fixtures, release notes, research checkpoints, queues, and reviewed prior outputs.
8. Conversation history and unmerged drafts.

Current active amendments:

```text
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md
docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md
docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md
docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
```

Current operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Current work-item specification:

```text
docs/quality/post-pr360-review-gate-pr361-spec.md
```

Current required prior outputs:

```text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

Historical amendments remain historical records and do not override the current position.

## 3. Mandatory reading order

Before changing code, data, workflows, or documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read `docs/post-351-data-growth-operating-spec.md`;
6. read every active roadmap amendment named by the roadmap;
7. read the canonical work-item specification;
8. read every named queue, validator, audit, fixture, baseline, release note, research checkpoint, or prior output required by the work item.

A non-trivial PR is not ready for implementation until the exact roadmap item and governing specification are identified.

## 4. Current execution state

```text
Canonical stable assets: 112
PR #351 Monthly Maintenance Log: complete
current public-surface expansion sequence: complete
PR #352 post-351 authority reset: complete
PR #353 Record Depth & Coverage Baseline: complete
PR #354 Tier A Dossier Deepening — Batch 1: complete
PR #355 Tier A Dossier Deepening — Batch 2: complete
PR #356 Market Access Pilot 1: complete
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: complete
PR #359 Market Access Pilot 2: complete
PR #360 Evidence and Correction Batch: complete
PR #361 Post-PR #360 Review Gate: complete
```

Approved bounded sequence:

```text
PR #352  post-351 authority reset and specification/schedule synchronization — complete
PR #353  Record Depth & Coverage Baseline — complete
PR #354  Tier A Dossier Deepening — Batch 1 — complete
PR #355  Tier A Dossier Deepening — Batch 2 — complete
PR #356  Market Access Pilot 1 — complete
PR #357  Tier A Dossier Deepening — Batch 3 — complete
PR #358  Record Growth Batch 1 — complete
PR #359  Market Access Pilot 2 — complete
PR #360  Evidence and Correction Batch
REVIEW GATE
```

No sequence beyond the review gate is pre-authorized.

## 5. Governing specification families

### Repository and deployment

```text
docs/deployment-policy.md
docs/spec-governance.md
docs/roadmap.md
AGENTS.md
```

### Post-351 operating mode

```text
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
```

### Historical PR #353 Record Depth foundation

```text
docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md
docs/quality/record-depth-coverage-baseline-spec.md
config/record-depth-baseline-v1.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
```

The PR #353 snapshots are immutable historical planning checkpoints.

### Completed PR #354 Tier A dossier batch

```text
docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md
docs/quality/tier-a-dossier-batch-1-pr354-spec.md
config/tier-a-dossier-batch-1-pr354.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
```

### Completed PR #355 Tier A dossier batch

```text
docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md
docs/quality/tier-a-dossier-batch-2-pr355-spec.md
config/tier-a-dossier-batch-2-pr355.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
```

### Completed PR #356 Market Access Pilot 1

```text
docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md
docs/quality/market-access-pilot-1-pr356-spec.md
config/market-access-pilot-1-pr356.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

### Completed PR #357 Tier A Dossier Deepening — Batch 3

```text
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
docs/quality/tier-a-dossier-batch-3-pr357-spec.md
config/tier-a-dossier-batch-3-pr357.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

The selected assets were AUDD, FEI, HUSD, MIM, and NZDS. PR #357 preserved 110 assets and four canonical Market Access Records before handing off to PR #358.

### Active PR #358 Record Growth Batch 1

```text
docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md
docs/quality/record-growth-batch-1-pr358-spec.md
config/record-growth-batch-1-pr358.json
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
```

The active branch promotes complete reviewed XUSD and USDB records, advances the canonical checkpoint from 110 to 112 assets, preserves four Market Access Records, prohibits automatic promotion and thin records, and adds no new public product surface.

### Completed derived-surface semantics

The completed public-surface program remains governed by merged canonical specifications and validators for:

```text
statistics and immutable history
Comparison Readiness
Facet Freshness
canonical Market Access schema
Compare and presets
Access & Regulation Explorer
Change Timeline
Update Feed
Monthly Maintenance Log
```

Schedule portions in historical product specifications are superseded by `docs/roadmap.md` and active amendments. Their semantic boundaries remain binding unless deliberately amended.

### Monitoring

Monitoring authority remains in merged monitoring pipeline, official-source, baseline, bounded scheduled read-only specifications, reviewed source registries, and historical monitoring snapshots.

Historical monitoring snapshots remain immutable.

## 6. Change control

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- canonical enum meaning;
- evidence interpretation or source identity handling;
- unknown-state semantics;
- route families or machine-readable output shape;
- count or denominator semantics;
- build provenance or canonical hash boundary;
- audited checkpoint source or digest boundary;
- dependency-lock or reproducible-build semantics;
- monitoring source, baseline-state, source-family, schedule, permission, or retention semantics;
- statistics semantics;
- Comparison Readiness semantics;
- Facet Freshness semantics;
- Record Depth planning-state semantics;
- Tier A dossier selection or target-dimension semantics;
- canonical Market Access Record semantics;
- Timeline date semantics;
- Update Feed publication-date semantics;
- Maintenance Log public-safety semantics;
- production publication gates;
- approved PR sequence;
- active workstream state;
- product-surface freeze boundary.

No implementation PR may introduce an undocumented alternative.

## 7. Pull-request traceability

Every non-trivial PR body must identify:

```text
Specification references
Roadmap item
Scope
Explicit non-goals
Named inputs and prior outputs
Data preservation
Validation
Deployment classification
```

For post-351 work, every non-trivial PR must cite:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
active roadmap amendments
work-item-specific specification
named baseline/queue/audit/research checkpoint or prior output
```

A PR that cannot cite an approved work item must pause until repository authority is corrected.

## 8. Product-surface governance

The current public-surface expansion sequence is complete.

Existing surfaces are sufficient for the current phase:

```text
Registry records
Stats
Compare
Compare presets
Access & Regulation Explorer
Change Timeline
Update Feed
Maintenance Log
machine-readable projections and manifest discovery
```

A new page, explorer, dashboard, ranking surface, or navigation family requires:

1. an identified user or research need;
2. evidence that current surfaces cannot answer it;
3. a reviewed roadmap amendment;
4. a canonical specification;
5. route and machine-output preservation analysis.

Small correctness, accessibility, readability, broken-link, and maintenance fixes remain allowed.

## 9. Canonical/public boundary

Public machine-readable and HTML release claims remain canonical-only.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

Candidate, monitoring, discovery, editorial-research, and private material remain outside canonical public surfaces unless separately reviewed and promoted.

Record Depth baselines, Tier A queues, dossier handoffs, and dossier-impact reports remain internal planning infrastructure.

## 10. Monitoring governance

Monitoring remains private, review-only, and read-only with respect to canonical data.

Monitoring may observe, compare, classify, identify stale review state, prepare private review material, and discover bounded leads.

Monitoring may not write canonical data, self-accept baselines, edit guides automatically, create canonical pull requests automatically, publish candidates or discovery leads, or deploy.

A registered source is not an accepted baseline. Monitoring observations are not canonical Market Access Records.

PR #355 canonical claims must come from reviewed evidence, not monitoring artifacts or unpromoted editorial research.

## 11. Market Access governance

Market Access remains separate from:

```text
asset lifecycle
legal status
regulatory action
platform authorization
monitoring observation
editorial research
```

Canonical promotion flow:

```text
research or monitoring signal
-> duplicate and scope review
-> source confirmation
-> evidence relation
-> bounded claim drafting
-> manual canonical review
-> reviewed repository PR
-> merge
-> public canonical output
```

A platform licence is not proof that a specific asset/function combination is available.

Access must not be reduced to a universal allowed/banned boolean.

PR #355 must not add rows to `data/market-access-records-v1.json`.

## 12. Record Depth and Tier A governance

PR #353 created an internal planning baseline over all 110 canonical assets and an 18-asset reviewed Tier A queue.

Required planning states remain:

```text
strong
usable
partial
sparse
absent
not_applicable
```

The planning system must not become a risk score, safety score, quality ranking, transparency ranking, numeric composite score, asset rank, investment recommendation, or public leaderboard.

PR #354 completed exactly five queue members:

```text
BUSD
DAI
RLUSD
USDC
USDT
```

PR #355 selects exactly five remaining queue members:

```text
FDUSD
FRAX
PYUSD
USDP
UST
```

Target dimensions:

```text
FDUSD  legal_profile
FRAX   legal_profile, redemption
PYUSD  legal_profile, redemption
USDP   legal_profile, redemption
UST    legal_profile
```

Queue reasons and historical material gaps must match the PR #353 snapshot exactly. PR #354 completed assets must remain excluded.

Planning improvement is not permission to infer unsupported factual claims. Unknown values remain unknown unless reviewed evidence supports replacement.

## 13. Dossier evidence discipline

Every changed legal-profile field must have reviewed evidence linkage.

For PR #355:

- official legal terms, official issuer statements, official protocol documentation, official redemption documentation, and regulator publications are preferred;
- legal entity scope must not be broadened beyond the source;
- reserve ownership, reserve segregation, and bankruptcy-remoteness claims must remain separate;
- direct issuer redemption must remain separate from exchange or secondary-market exit;
- customer eligibility and jurisdiction restrictions must remain explicit;
- duplicate source URLs must use evidence source identity and alias handling rather than redundant source rows;
- PayPal/Paxos roles for PYUSD must remain distinct;
- BUSD-specific evidence must not be reused as USDP evidence without asset-specific support;
- FRAX and UST protocol architecture must not be forced into issuer-backed fields.

Only FRAX, PYUSD, and USDP are authorized for redemption field-value changes in PR #355.

## 14. Growth governance

Dossier deepening and new-asset growth are distinct operations.

Tier A dossier batches normally cover no more than five existing assets.

Dossier batches may add supporting canonical records but do not add new canonical assets unless explicitly approved as combined growth work.

If a growth PR adds new canonical stable assets:

```text
maximum two new canonical stable assets per growth PR
```

All applicable supporting record groups and evidence boundaries remain preserved.

## 15. Unknown-value governance

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

Unknown values remain unknown until reviewed evidence supports a replacement. Missing evidence, a monitoring signal, a candidate row, or a planning gap is not proof of a value.

## 16. Historical checkpoint governance

Do not rewrite historical checkpoints because current canonical data or dossier depth changed.

Historical material includes release-integrity baselines, reproducible-build baselines, audited asset checkpoints, monitoring snapshots, statistics history, PR #353 planning snapshots, PR #354 reviewed handoff, and closed Maintenance Log months.

Forward-only count or statistics checkpoints may be appended when canonical supporting records change without asset growth.

## 17. Deployment governance

Normal merged changes publish from `main` under `docs/deployment-policy.md`.

Scheduled monitoring remains artifact-only and does not authorize canonical writes, guide edits, automatic canonical pull requests, or deployment.

## 18. Review gate

After PR #360, stop and review:

```text
remaining sparse record families
Tier A dossier improvement
Compare utility
Timeline historical density
canonical Market Access utility
monitoring signal usefulness
correction burden
monthly maintenance burden
external usage evidence when available
```

Only then define the next bounded sequence.

## PR #357 active authority

Current work item:

```text
PR #356 Market Access Pilot 1: complete
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: complete
```

Binding references:

```text
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
docs/quality/tier-a-dossier-batch-3-pr357-spec.md
config/tier-a-dossier-batch-3-pr357.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
```

Selected assets:

```text
AUDD
FEI
HUSD
MIM
NZDS
```

This is deterministic queue consumption, not a ranking. PR #357 preserves 110 canonical stable assets, four canonical Market Access Records, canonical-only publication, and the existing public-surface boundary.

## PR #358 active authority

Current work item:

```text
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: complete
PR #359 Market Access Pilot 2: complete
```

Binding references:

```text
docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md
docs/quality/record-growth-batch-1-pr358-spec.md
config/record-growth-batch-1-pr358.json
data/editorial-research/record-growth-batch-1-pr358-candidates.json
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
```

Selected context group:

```text
current USD payment stablecoins with distinct stabilization models
```

Selected candidates:

```text
StraitsX USD / XUSD / sog_st_xusd
USDB / USDB / sog_st_usdb
```

Candidate selection is not canonical promotion. PR #358 may add no more than two fully reviewed records, must reject thin records, preserves four canonical Market Access Records, and adds no public product surface.

## PR #359 active authority

Current work item:

```text
PR #358 Record Growth Batch 1: complete
PR #359 Market Access Pilot 2: complete
PR #360 Evidence and Correction Batch: complete
```

Binding references:

```text
docs/roadmap-amendments/2026-07-13-pr359-market-access-pilot-2-activation.md
docs/quality/market-access-pilot-2-pr359-spec.md
config/market-access-pilot-2-pr359.json
docs/market-access-record-spec.md
schemas/market-access-record-v1.schema.json
config/market-access-governance-v1.json
data/editorial-research/japan-stablecoin-market-access-2026.json
docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json
```

Exact bounded scope:

```text
Japan / SBI VC Trade / VCTRADE
RLUSD / sog_st_rlusd
buy_sell, deposit, withdrawal, external_wallet_transfer
effective_from 2026-06-24
observed_at 2026-07-13
maximum four new records
```

PR #359 preserves 112 canonical assets, 557 canonical Evidence identities, and 174 deployments. It expands Market Access from four to eight records by reusing existing canonical source identities. It adds no public product surface, ranking, score, or automatic monitoring promotion.

## PR #360 active authority

Current work item:

```text
PR #359 Market Access Pilot 2: complete
PR #360 Evidence and Correction Batch: complete
PR #361 Post-PR #360 Review Gate: complete
```

Binding references:

```text
docs/roadmap-amendments/2026-07-14-pr360-evidence-correction-batch-activation.md
docs/quality/evidence-correction-batch-pr360-spec.md
config/evidence-correction-batch-pr360.json
docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json
docs/migration/evidence-correction-queue-pr360.json
```

Starting boundary:

```text
canonical assets: 112
canonical Evidence: 557
Evidence Relations: 557
archive indexes recorded: 380
archive not recorded: 177
Market Access Records: 8
```

PR #360 may touch at most 10 Evidence records and 5 non-Evidence records. Queue selection is internal and does not authorize automatic canonical correction. No asset, Market Access, ranking, score, or public product surface may be added.

## PR #361 active review-gate authority

Current work item:

```text
PR #360 Evidence and Correction Batch: complete
PR #361 Post-PR #360 Review Gate: complete
PR #363 Record Depth and Coverage Baseline Refresh: active
```

Approved bounded sequence after review:

```text
PR #363 Record Depth and Coverage Baseline Refresh
PR #364 Tier A Dossier Deepening Batch 4
PR #365 Evidence and Archive Maintenance Batch 2
review gate
```

Not approved in this sequence:

```text
Market Access Pilot 3
Record Growth Batch 2
new public product surface
asset ranking or composite score
automatic monitoring promotion
```

Binding references:

```text
docs/quality/post-pr360-review-gate-pr361-spec.md
config/post-pr360-review-gate-pr361.json
docs/migration/evidence-correction-batch-pr360-reviewed-handoff.json
docs/migration/post-pr360-review-gate-pr361.json
```


PR #364 Tier A Dossier Deepening Batch 4: next


## PR #363 active Record Depth refresh authority

Current work item:

```text
PR #361 Post-PR #360 Review Gate: complete
PR #363 Record Depth and Coverage Baseline Refresh: active
PR #364 Tier A Dossier Deepening Batch 4: next
```

Binding references:

```text
docs/roadmap-amendments/2026-07-14-pr363-record-depth-refresh-activation.md
docs/quality/record-depth-baseline-refresh-pr363-spec.md
config/record-depth-baseline-refresh-pr363.json
docs/migration/post-pr360-review-gate-pr361.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
```

Required outputs:

```text
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
```

PR #363 changes no canonical data or public product surface. The refreshed queue is internal, deterministic, and non-ranking. PR #364 may select at most five assets only after manual source review.
