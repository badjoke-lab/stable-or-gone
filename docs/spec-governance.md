# Stable or Gone specification governance

Status: canonical governance specification  
Updated: 2026-07-10

## 1. Purpose

This file defines repository document authority, conflict resolution, change control, PR traceability, data-preservation boundaries, monitoring safety, product-surface control, and post-351 operating governance.

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
7. Named audits, inventories, baselines, fixtures, release notes, research checkpoints, queues, and publication-gate reviews.
8. Conversation history and unmerged drafts.

Current active amendment:

```text
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
```

Current operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Historical amendments remain historical records. They do not override the current position.

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
Canonical stable assets: 110
PR #351 Monthly Maintenance Log: complete
current public-surface expansion sequence: complete
PR #352 post-351 authority reset: active
PR #353 Record Depth & Coverage Baseline: next
```

Approved near-term sequence:

```text
PR #352  post-351 authority reset and specification/schedule synchronization
PR #353  Record Depth & Coverage Baseline
PR #354  Tier A Dossier Deepening — Batch 1
PR #355  Tier A Dossier Deepening — Batch 2
PR #356  Market Access Pilot 1
PR #357  Tier A Dossier Deepening — Batch 3
PR #358  Record Growth Batch 1
PR #359  Market Access Pilot 2
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

### Record Depth Baseline

```text
docs/quality/record-depth-coverage-baseline-spec.md
```

### Statistics

```text
docs/stats-spec.md
docs/stats-history-spec.md
```

### Comparison, freshness, access, timeline, update, and maintenance semantics

The completed public-surface program remains governed by its merged canonical specifications and validators, including:

```text
docs/comparison-and-change-product-spec.md
Comparison Readiness specifications and validators
Facet Freshness specifications and validators
canonical Market Access schema and governance
Access & Regulation index and Explorer specifications
Change Timeline projection and UI specifications
Update Feed specification
Monthly Maintenance Log specification
```

Schedule portions in historical product specifications are superseded by `docs/roadmap.md` and the current active amendment. Their semantic boundaries remain binding unless deliberately amended.

### Monitoring

Monitoring authority includes:

```text
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-baseline-spec.md
docs/quality/monitoring-bounded-scheduled-read-only-spec.md
reviewed source registries and historical baseline snapshots
```

Historical snapshots remain immutable.

## 6. Change control

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- canonical enum meaning;
- evidence interpretation;
- unknown-state semantics;
- route families or machine-readable output shape;
- count or denominator semantics;
- build provenance or canonical hash boundary;
- audited checkpoint source or digest boundary;
- dependency-lock or reproducible-build semantics;
- monitoring source schema;
- monitoring baseline-state semantics;
- monitoring source-family or coverage semantics;
- schedule trigger, group, or permission boundary;
- news-discovery or retention bounds;
- article stale-state bands;
- statistics semantics;
- Comparison Readiness semantics;
- facet freshness semantics;
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
active roadmap amendment
work-item-specific specification
named baseline/queue/audit/research checkpoint
```

A PR that cannot cite an approved work item must pause until repository authority is corrected.

## 8. Product-surface governance

The current public-surface expansion sequence is complete.

The existing surfaces are sufficient for the current operating phase:

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

Candidate, monitoring, discovery, editorial-research, and private material remain outside canonical public count surfaces unless separately reviewed and promoted through the proper canonical process.

## 10. Monitoring governance

Monitoring remains private, review-only, and read-only with respect to canonical data.

Monitoring may:

```text
observe
compare
classify
identify stale review state
prepare private review material
discover bounded leads
```

Monitoring may not:

```text
write canonical data
self-accept baselines
edit guides automatically
create canonical pull requests automatically
publish candidates or discovery leads
deploy
```

A registered source is not an accepted baseline.

A pending baseline is not accepted monitoring coverage.

Monitoring observations are not canonical Market Access Records.

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

## 12. Record Depth Baseline governance

PR #353 is governed by:

```text
docs/quality/record-depth-coverage-baseline-spec.md
```

The baseline is an internal planning instrument.

It must not become:

```text
risk score
safety score
quality ranking
transparency ranking
investment recommendation
public leaderboard
```

Allowed planning states:

```text
strong
usable
partial
sparse
absent
not_applicable
```

State derivation must be deterministic and auditable.

## 13. Growth governance

Dossier deepening and new-asset growth are distinct operations.

Tier A dossier batches normally cover no more than five existing assets.

Dossier batches may add supporting canonical records but do not add new canonical assets unless explicitly approved as combined growth work.

If a growth PR adds new canonical stable assets:

```text
maximum two new canonical stable assets per growth PR
```

All applicable supporting record groups and evidence boundaries remain preserved.

## 14. Unknown-value governance

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

These states must not be overwritten merely to satisfy completeness, baseline appearance, comparison presentation, or Market Access row count.

Missing capability data is unknown knowledge state, not `false`.

## 15. Derived-surface governance

Statistics derive from reviewed canonical data and must not become live price, market-cap, APY, safety, transparency, or risk rankings.

Compare uses reviewed canonical data, preserves unresolved states, and does not score or recommend assets.

Comparison Readiness remains separate from value truth and facet freshness.

Facet freshness derives from authoritative record families and does not replace factual record values.

Change Timeline preserves date semantics and does not convert review/freshness dates into historical change items.

Update Feed publication dates remain separate from historical subject dates.

Maintenance Log remains public-safe and aggregate-only.

## 16. Historical checkpoint governance

Release-integrity, reproducible-build, audited checkpoint, statistics history, monitoring baseline, and completed monthly maintenance records retain their original immutability rules.

Do not regenerate or rewrite historical snapshots against current configuration merely because the current registry grew or the active program changed.

Historical detail remains available in:

```text
docs/migration/
docs/releases/
docs/quality/
docs/roadmap-amendments/
scripts/monitoring/baselines/
data/stats-history.json
data/monthly-maintenance-log.json
```

## 17. Review-gate governance

After PR #360, the next sequence must be selected from reviewed evidence.

The review gate examines:

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

Only then may the roadmap authorize the next bounded sequence.

## 18. Deployment governance

Normal merged changes publish from `main` under `docs/deployment-policy.md`.

Scheduled monitoring remains artifact-only and does not authorize monitoring artifact publication, canonical writes, guide edits, automatic pull requests, or Cloudflare deployment.
