# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## 1. Required reading order

Before changing code, canonical data, workflows, monitoring, or documentation, read in this order:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/post-351-data-growth-operating-spec.md`
6. every active roadmap amendment named by the roadmap
7. the canonical specification for the active work item
8. every named baseline, queue, validator, audit, fixture, research checkpoint, release note, or prior output required by that work item

Current active amendment:

```text
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
```

Current post-351 operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Current next-work specification:

```text
docs/quality/record-depth-coverage-baseline-spec.md
```

## 2. Repository source of truth

Merged repository specifications outrank:

```text
chat memory
handoff prose
issue discussion
generated reports
stale roadmap text
unmerged drafts
mock images
```

PR numbering, active workstream state, and next approved work come from `docs/roadmap.md` plus the current active amendment.

Do not infer the schedule from old PR numbers in historical documents.

## 3. Current workstream

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

Do not skip ahead unless `docs/roadmap.md` is deliberately amended.

No PR number after the review gate is pre-authorized.

## 4. Operating mode

The public-surface expansion sequence is complete.

Default work now belongs to one of these lanes:

```text
reviewed data depth and record growth
canonical Market Access promotion
monitoring review without automatic promotion
corrections and evidence maintenance
monthly maintenance
```

A new public page, explorer, dashboard, ranking surface, or navigation family requires a separate roadmap amendment and canonical specification.

Small correctness, accessibility, readability, broken-link, and maintenance fixes remain allowed.

## 5. Mandatory PR traceability

Every post-351 non-trivial PR must cite:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
active roadmap amendment
work-item-specific specification
named baseline/queue/audit/research checkpoint or prior output
```

The PR body must identify:

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

A PR that cannot identify its roadmap item and governing specification must pause.

## 6. Core data rules

- Keep unknown values unknown unless reviewed evidence supports a value.
- Do not coerce partial-date evidence into a day-level date.
- Preserve evidence relations, known unknowns, deployments, source identities, and value states.
- Canonical counts change only through explicit audited data PRs.
- Rebrand, migration continuation, wrapped representation, deployment, or alias records do not become separate canonical assets without scope support and lineage review.
- Archive absence is a quality queue item, not permission to fabricate an archive URL.
- Missing capability data means unknown knowledge state, not `false`.

Protected unresolved states:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

## 7. Canonical/public safety boundary

Public release claims remain canonical-only.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

Candidate, monitoring, discovery, editorial-research, and private material remain outside canonical public release claims until separately reviewed and promoted through the proper canonical process.

## 8. Monitoring rules

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
publish candidates or leads
deploy
```

A registered source is not an accepted baseline.

A pending baseline is not accepted monitoring coverage.

Monitoring output is not canonical data.

## 9. Market Access rules

Canonical Market Access promotion must follow:

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

Do not reduce access to a universal allowed/banned boolean.

Preserve:

```text
asset
platform/service
platform legal entity when supported
jurisdiction or region
customer scope when supported
function or access route
access state
supported network when material
announcement date
effective date
review date
source identity
evidence relation
```

A platform licence is not proof that a specific asset/function combination is available.

Monitoring observations and editorial matrices are not canonical Market Access Records.

## 10. Record Depth Baseline rules

PR #353 is governed by:

```text
docs/quality/record-depth-coverage-baseline-spec.md
```

The baseline is an internal planning instrument.

Allowed planning states:

```text
strong
usable
partial
sparse
absent
not_applicable
```

The baseline must not become a risk score, safety score, quality ranking, transparency ranking, investment recommendation, or public leaderboard.

Every state assignment must be deterministic and auditable.

## 11. Dossier and growth rules

Tier A dossier batches normally cover no more than five existing assets.

They may deepen supporting canonical records and evidence but do not add new canonical assets unless explicitly approved as combined growth work.

If a growth PR adds new canonical stable assets:

```text
maximum two new canonical stable assets per growth PR
```

All applicable supporting record groups must be preserved.

## 12. Derived-surface rules

Statistics derive from reviewed canonical data and do not become live price, market-cap, APY, safety, transparency, or risk rankings.

Compare uses reviewed canonical data, preserves unresolved states, and does not score or recommend assets.

Comparison Readiness remains separate from factual value truth and facet freshness.

Facet freshness derives from authoritative record families.

Change Timeline preserves source date semantics and does not turn review/freshness dates into historical events.

Update Feed publication dates remain separate from historical subject dates.

Maintenance Log remains public-safe and aggregate-only.

## 13. Historical checkpoint rules

Do not rewrite historical checkpoints merely because the registry or operating mode changed.

Binding historical material includes:

```text
release-integrity baselines
reproducible-build baselines
audited asset checkpoints
monitoring snapshots
statistics history
closed Maintenance Log months
```

Historical detail remains in repository release, migration, quality, roadmap-amendment, monitoring-baseline, and history files.

## 14. Deployment rule

Normal merged changes publish from `main` under `docs/deployment-policy.md`.

Scheduled monitoring remains artifact-only and does not authorize monitoring artifact publication, canonical writes, guide edits, automatic pull requests, or Cloudflare deployment.

## 15. Review gate

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
