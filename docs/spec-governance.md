# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-07-31

## 1. Purpose

This document defines repository authority, conflict resolution, change control, PR traceability, canonical-data preservation, monitoring safety, public-surface control, deployment governance, and bounded continuation rules.

Merged repository specifications are the source of truth.

Chat memory, handoff prose, issue discussion, generated reports, stale roadmap text, and unmerged drafts do not override merged repository authority.

## 2. Authority order

When documents disagree, use this order:

1. `docs/deployment-policy.md` for publication, production verification, Cloudflare, and domain rules.
2. `docs/spec-governance.md` for authority and change control.
3. `docs/roadmap.md` for current phase, active item, next item, and bounded sequence.
4. active merged roadmap amendments named by the roadmap.
5. the canonical operating specification for the active program.
6. the work-item-specific canonical specification.
7. named audits, inventories, baselines, fixtures, release notes, research checkpoints, queues, and reviewed prior outputs.
8. conversation history and unmerged drafts.

Current active roadmap amendment:

```text
docs/roadmap-amendments/2026-07-31-post-domain-authority-sync.md
```

Current operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Historical amendments and PR-specific specifications remain historical records. Their completed semantic contracts remain useful, but their old “current” wording and schedules do not override the current roadmap.

## 3. Mandatory reading order

Before changing code, canonical data, workflows, infrastructure, or documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read the active roadmap amendment;
6. read `docs/post-351-data-growth-operating-spec.md`;
7. read the work-item-specific specification;
8. read every named queue, validator, audit, fixture, baseline, handoff, release note, research checkpoint, and prior output required by the work item.

A non-trivial PR is not ready for implementation until its exact roadmap item and governing specification are identified.

## 4. Current execution state

```text
Canonical stable assets: 116
Organizations: 107
Relationships: 128
Events: 191
Evidence: 571
Evidence Relations: 571
Deployments: 182
Market Access Records: 8
Detail routes: 414
Metadata-checked detail routes: 414
Official public origin: https://www.stableorgone.com
Current main and production commit: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
```

Completed acceptance points:

```text
PR #467 reviewed 116-asset canonical-data checkpoint
PR #492 Statistics panel flow and deployment-chain normalization
PR #493 official-domain migration and production verification
```

Current item:

```text
PR #495 post-domain authority synchronization
```

Bounded continuation after PR #495:

```text
issue and checkpoint reconciliation
Record Growth Batch 4 candidate audit
REVIEW GATE before canonical promotion
```

No candidate and no later growth batch is pre-authorized.

## 5. Change control

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- canonical enum meaning;
- evidence interpretation or source identity handling;
- unknown-state semantics;
- route families or machine-readable output shape;
- count or denominator semantics;
- deployment-chain normalization semantics;
- build provenance or canonical-hash boundaries;
- audited checkpoint source or digest boundaries;
- dependency-lock or reproducible-build semantics;
- monitoring source, baseline, schedule, permission, or retention semantics;
- Statistics semantics;
- Comparison Readiness or Facet Freshness semantics;
- Record Depth planning semantics;
- canonical Market Access Record semantics;
- Timeline, Update Feed, or Maintenance Log semantics;
- production publication gates;
- official public origin;
- legacy-host redirect behavior;
- approved PR sequence;
- active workstream state;
- product-surface freeze boundary.

No implementation PR may introduce an undocumented alternative.

## 6. Pull-request traceability

Every non-trivial PR body must identify:

```text
Specification references
Roadmap item
Scope
Explicit non-goals
Named inputs and prior outputs
Canonical-data preservation
Public-output preservation
Validation
Deployment classification
Next review gate
```

A PR that cannot cite an approved work item must pause until repository authority is corrected.

## 7. Canonical and public safety boundary

Public HTML and machine-readable release claims remain canonical-only.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

Candidate, monitoring, discovery, editorial-research, and private material remains outside canonical public surfaces unless separately reviewed and promoted.

Unknown values remain unknown until reviewed evidence supports replacement.

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

Missing evidence, a candidate row, a monitoring signal, or a planning gap is not proof of a value.

## 8. Canonical growth governance

Dossier deepening and new-asset growth are distinct operations.

A growth PR may add at most two canonical stable assets unless a separate reviewed amendment changes the limit.

Every canonical promotion requires:

```text
candidate identity and scope review
current-source review
duplicate and lineage review
organization reuse review
lifecycle review
reserve and redemption review
deployment identity review
evidence and archive review
known-unknown preservation
manual canonical review
reviewed repository PR
```

Automatic promotion, thin records, inferred facts, indefinite batch sequences, and ranking or recommendation semantics are prohibited.

The next candidate audit may evaluate candidates but does not authorize promotion.

## 9. Monitoring governance

Monitoring remains private, review-only, and read-only with respect to canonical data.

Monitoring may observe, compare, classify, identify stale review state, prepare private review material, and discover bounded leads.

Monitoring may not:

```text
write canonical data
self-accept baselines
edit guides automatically
create canonical pull requests automatically
publish candidates or discovery leads
deploy
```

A registered source is not an accepted baseline. Monitoring observations are not canonical Evidence or canonical Market Access Records.

## 10. Market Access governance

Market Access remains separate from asset lifecycle, legal status, regulatory action, platform authorization, monitoring observation, and editorial research.

Canonical promotion flow:

```text
research or monitoring signal
-> duplicate and scope review
-> source confirmation
-> Evidence relation
-> bounded claim drafting
-> manual canonical review
-> reviewed repository PR
-> merge
-> public canonical output
```

A platform licence is not proof that a specific asset/function combination is available. Access must not be reduced to a universal allowed/banned boolean.

## 11. Product-surface governance

Existing public surfaces are sufficient for the current phase:

```text
Registry records
Stats
Compare
Compare presets
Access & Regulation Explorer
Change Timeline
Update Feed
Maintenance Log
Guides
machine-readable projections and manifest discovery
```

A new page, explorer, dashboard, ranking surface, or navigation family requires:

1. an identified research or user need;
2. evidence that current surfaces cannot answer it;
3. a reviewed roadmap amendment;
4. a canonical specification;
5. route, metadata, machine-output, and deployment analysis.

Small correctness, accessibility, readability, broken-link, and maintenance fixes remain allowed.

## 12. Material UI governance

`docs/ui-v3-remediation-authority.md` remains the regression contract for material public UI work.

PR #492 is the current Statistics acceptance point. Its semantic and responsive rules are binding until deliberately amended.

Material UI work requires desktop and mobile screenshots and direct human inspection of generated artifacts. CI success cannot override visible defects.

## 13. Deployment-chain governance

Canonical deployment-chain projections must preserve identity rather than guessing from ambiguous labels.

Binding examples:

```text
BNB Chain / BNB Smart Chain -> BNB Chain
Gnosis / Gnosis Chain -> Gnosis Chain
Arbitrum One -> Arbitrum One
Arbitrum Nova -> Arbitrum Nova
bare Arbitrum -> unresolved
```

Total deployments must reconcile as canonical-chain counts plus unresolved deployments.

## 14. Official-domain governance

The only official origin is:

```text
https://www.stableorgone.com
```

Repository output must not reintroduce `sog.badjoke-lab.com` as a canonical origin, production base URL, sitemap host, machine-readable canonical origin, OGP URL, or documentation public site.

The legacy host redirect is external Cloudflare zone configuration. It must preserve path and query and must not redirect every old URL to the new homepage.

The current deployment token has Pages publication access but no visible `badjoke-lab.com` zone. No zone write may be attempted until suitable Zone Read and Redirect Edit permission exists.

A Pages Function workaround is not authorized because it would change static-serving, request-accounting, and header behavior for the official site.

## 15. Historical checkpoints

Do not rewrite historical checkpoints merely because current counts, UI, or domain changed.

Historical material includes:

- release-integrity and reproducible-build baselines;
- audited asset checkpoints;
- monitoring snapshots;
- Statistics history;
- Record Depth and Tier A planning outputs;
- completed PR-specific handoffs;
- closed Maintenance Log periods;
- completed UI and domain acceptance records.

Forward-only checkpoints may be added when current canonical state advances.

## 16. Deployment governance

Normal merged changes publish from `main` under `docs/deployment-policy.md`.

Production parity requires independent verification after merge. Issue #479 is the current deployment record.

Scheduled monitoring remains artifact-only and does not authorize canonical writes, guide edits, automatic canonical pull requests, or deployment.

## 17. Review gate

After the bounded candidate audit, stop and review:

```text
candidate completeness
source recency
identity and lineage risk
organization reuse
reserve and redemption support
deployment identity support
Evidence and archive coverage
known unknowns
maintenance burden
value of adding records versus deepening existing dossiers
```

Only a separate reviewed decision may authorize a canonical promotion batch.
