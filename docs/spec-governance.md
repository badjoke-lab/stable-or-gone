# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-07-31

## 1. Purpose

This document defines repository authority, conflict resolution, change control, PR traceability, canonical-data preservation, monitoring safety, public-surface control, deployment governance, and bounded continuation rules.

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, generated reports, stale roadmap text, and unmerged drafts do not override merged repository authority.

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
docs/roadmap-amendments/2026-07-31-record-growth-batch-4-candidate-audit.md
```

Current operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Current work-item specification:

```text
docs/quality/record-growth-batch-4-candidate-audit-pr496-spec.md
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
Official-domain migration production checkpoint: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
```

Current `main` and production equality is verified dynamically by `.github/workflows/deploy-production.yml` and Issue #479.

Completed acceptance points:

```text
PR #467 reviewed 116-asset canonical-data checkpoint
PR #492 Statistics panel flow and deployment-chain normalization
PR #493 official-domain migration and production verification
PR #495 post-domain authority synchronization and issue reconciliation
```

Current item:

```text
PR #496 Record Growth Batch 4 candidate audit
```

Current reviewed private result:

```text
ready_for_full_record_review: MNEE, Figure YLDS
prelaunch_or_noncanonical: Open USD, Roughrider Coin, Qivalis euro stablecoin
insufficient_current_evidence: FIUSD, ANZ A$DC, USDF Consortium USDF
exact canonical duplicates: 0
canonical changes: 0
public changes: 0
next boundary: REVIEW GATE
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
- candidate-audit disposition semantics;
- complete-record feasibility semantics;
- duplicate, symbol-collision, or lineage decisions;
- Statistics semantics;
- canonical Market Access Record semantics;
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

A candidate source lead is not canonical Evidence. A current product page does not by itself prove launch, circulation, contract identity, reserve custody, assurance, or redemption eligibility.

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

## 8. PR #496 candidate-audit governance

PR #496 may:

- review exactly eight private candidates;
- record primary-source identities and bounded claim scopes;
- record blocking unknowns;
- classify complete-record feasibility;
- record duplicate, symbol-collision, and lineage risk;
- produce a private review-gate handoff.

PR #496 may not:

- change canonical record families;
- change public counts, routes, metadata, UI, CSS, machine-readable output, sitemap, or guides;
- create candidate pages;
- automatically promote a candidate;
- create an automatic canonical PR;
- score, rank, recommend, or imply safety;
- authorize a later batch indefinitely.

“Ready for full-record review” means only that current primary sources appear sufficient to attempt a complete record while preserving unsupported values as explicit unknowns. It is not a promotion decision.

## 9. Duplicate and lineage governance

Name or symbol similarity is not identity.

- USDF Consortium USDF is distinct from canonical Falcon USDf and must not be merged automatically.
- Open USD and Origin Dollar require explicit OUSD symbol and issuer disambiguation.
- Consortium membership, platform integration, wrapper availability, or shared infrastructure does not create or merge canonical stable-asset identities.
- Automatic deduplication and automatic lineage inference remain prohibited.

## 10. Canonical growth governance

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
Evidence and archive review
known-unknown preservation
manual canonical review
reviewed repository PR
```

Automatic promotion, thin records, inferred facts, indefinite batch sequences, and ranking or recommendation semantics are prohibited.

## 11. Monitoring governance

Monitoring remains private, review-only, and read-only with respect to canonical data.

Monitoring may observe, compare, classify, identify stale review state, prepare private review material, and discover bounded leads.

Monitoring may not write canonical data, self-accept baselines, edit guides automatically, create canonical pull requests automatically, publish candidates, or deploy.

A registered source is not an accepted baseline. Monitoring observations are not canonical Evidence or canonical Market Access Records.

## 12. Product-surface governance

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

A new page, explorer, dashboard, ranking surface, or navigation family requires an identified need, evidence that current surfaces cannot answer it, a reviewed roadmap amendment, a canonical specification, and route, metadata, machine-output, and deployment analysis.

Small correctness, accessibility, readability, broken-link, and maintenance fixes remain allowed.

## 13. Material UI and Statistics governance

`docs/ui-v3-remediation-authority.md` remains the regression contract for material public UI work.

PR #492 is the current Statistics acceptance point. Its semantic and responsive rules are binding until deliberately amended.

Material UI work requires desktop and mobile screenshots and direct human inspection of generated artifacts. CI success cannot override visible defects.

Binding deployment-chain examples:

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

A Pages Function workaround is not authorized because it would change static-serving, request-accounting, and header behavior for the official site. Issue #479 remains open for this externally blocked redirect.

## 15. Historical checkpoints

Do not rewrite historical checkpoints merely because current counts, UI, domain, or workstream changed.

Historical material includes release-integrity and reproducible-build baselines, audited asset checkpoints, monitoring snapshots, Statistics history, completed PR-specific handoffs, closed Maintenance Log periods, and completed UI and domain acceptance records.

Forward-only checkpoints may be added when current canonical state advances.

## 16. Deployment governance

Normal merged changes publish from `main` under `docs/deployment-policy.md`.

Production parity requires independent verification after merge. Issue #479 is the current deployment record.

Scheduled monitoring and candidate auditing remain artifact-only and do not authorize canonical writes, guide edits, automatic canonical pull requests, or deployment decisions outside the normal main workflow.

## 17. Review gate

After PR #496, stop and review:

```text
MNEE complete-record feasibility
YLDS stable-value scope, security classification, and income representation
source recency
identity and lineage risk
organization reuse
reserve and redemption support
deployment identity support
Evidence and archive coverage
known unknowns
maintenance burden
value of adding records versus deepening existing dossiers
whether to authorize zero, one, or at most two later additions
```

Only a separate reviewed decision may authorize a canonical promotion PR.
