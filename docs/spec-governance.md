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
docs/roadmap-amendments/2026-07-31-record-growth-batch-4-mnee.md
```

Current operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Current work-item specification:

```text
docs/quality/record-growth-batch-4-mnee-pr498-spec.md
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
8. read the PR #496 candidate-audit specification and handoff;
9. read every named queue, validator, audit, fixture, baseline, release note, research checkpoint, and prior output required by the work item.

A non-trivial PR is not ready for implementation until its exact roadmap item and governing specification are identified.

## 4. Current execution state

```text
Canonical stable assets: 117
Organizations: 108
Relationships: 129
Events: 192
Evidence: 579
Evidence Relations: 579
Deployments: 184
Market Access Records: 8
Detail routes: 417
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
PR #496 Record Growth Batch 4 candidate audit
```

Current item:

```text
PR #497 Record Growth Batch 4 review gate
```

Reviewed decision:

```text
PR #498 Record Growth Batch 4 — MNEE: authorized next
maximum new canonical assets: 1
replacement candidate: prohibited
Figure YLDS: deferred pending separate scope amendment
next boundary after PR #498: REVIEW GATE
```

No work after PR #498 is pre-authorized.

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
- stable-value scope, security, face-amount, or yield-bearing product semantics;
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

## 8. PR #496 candidate-audit checkpoint

PR #496 reviewed exactly eight private candidates, recorded 21 primary source identities, found no exact canonical duplicates, and changed no canonical or public data.

The reviewed complete-record-feasible candidates were MNEE and Figure YLDS. That disposition was not promotion authorization.

USDF Consortium USDF remains distinct from Falcon USDf. Open USD requires explicit OUSD issuer and lineage disambiguation from Origin Dollar.

## 9. PR #497 review-gate checkpoint

PR #497 authorized exactly one complete-record implementation for MNEE and prohibited replacement candidates, YLDS promotion, and continuation after PR #498. That decision is complete.

## 10. PR #498 Record Growth Batch 4 — MNEE

PR #498 is the current reviewed canonical-growth checkpoint. It added exactly one stable asset, one issuer organization, one legal-issuer relationship, one launch event, eight canonical Evidence records, one reserve-report context, five explicit known unknowns, two deployment identifiers, one legal profile, two reserve components, and one income profile.

Binding identity checkpoint:

```text
MNEE stablecoin ID: sog_st_mnee
MNEE Limited issuer ID: sog_issuer_mnee_limited
1Sat Ordinals production token ID: ae59f3b898ec61acbdb6cc7a245fabeded0c094bf046f35206a3aec60ef88127_0
Ethereum contract: 0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf
launch date: 2025-03-03
```

The official `@mnee/ts-sdk` package version 1.2.0 is the source for the production 1Sat token ID. Both new deployment records remain classified as `identifier_recorded_unverified`; identifier recording does not prove current control configuration, independent runtime operation, or safety.

PR #498 preserves explicit unknowns for the latest listed attestation report body and archive, current reserve custodian and allocation, first public Ethereum issuance date, deployment controls, and complete direct-access and jurisdiction inventory. It does not infer unsupported values.

PR #498 changed no Market Access record, public route family, material UI/CSS contract, ranking, score, recommendation, or monitoring-publication boundary. The three additional detail routes are data-driven dossier routes for the new asset, issuer, and launch event.

PR #498 exits only to `REVIEW GATE`. No later work is authorized automatically.

## 11. YLDS scope boundary

YLDS is deferred and is not authorized for canonical implementation.

The issuer describes YLDS as a registered fixed-income security rather than a stablecoin. Its material semantics include:

- $0.01 face-amount certificate units;
- holder interest and yield;
- issuer-credit and asset-portfolio risk;
- securities-law eligibility and transfer requirements;
- registered-offering redemption terms;
- chain and third-party wrapper distinctions.

A future YLDS proposal requires a separate reviewed scope amendment. Ordinary stablecoin treatment is prohibited.

## 12. Canonical growth governance

Dossier deepening and new-asset growth are distinct operations.

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

## 13. Monitoring governance

Monitoring remains private, review-only, and read-only with respect to canonical data.

Monitoring may observe, compare, classify, identify stale review state, prepare private review material, and discover bounded leads.

Monitoring may not write canonical data, self-accept baselines, edit guides automatically, create canonical pull requests automatically, publish candidates, or deploy.

A registered source is not an accepted baseline. Monitoring observations are not canonical Evidence or canonical Market Access Records.

## 14. Product-surface governance

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

## 15. Material UI and Statistics governance

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

## 16. Official-domain governance

The only official origin is:

```text
https://www.stableorgone.com
```

Repository output must not reintroduce `sog.badjoke-lab.com` as a canonical origin, production base URL, sitemap host, machine-readable canonical origin, OGP URL, or documentation public site.

The legacy host redirect is external Cloudflare zone configuration. It must preserve path and query and must not redirect every old URL to the new homepage.

The current deployment token has Pages publication access but no visible `badjoke-lab.com` zone. No zone write may be attempted until suitable Zone Read and Redirect Edit permission exists.

A Pages Function workaround is not authorized because it would change static-serving, request-accounting, and header behavior for the official site. Issue #479 remains open for this externally blocked redirect.

## 17. Historical checkpoints

Do not rewrite historical checkpoints merely because current counts, UI, domain, or workstream changed.

Historical material includes release-integrity and reproducible-build baselines, audited asset checkpoints, monitoring snapshots, Statistics history, completed PR-specific handoffs, closed Maintenance Log periods, and completed UI and domain acceptance records.

Forward-only checkpoints may be added when current canonical state advances.

## 18. Deployment governance

Normal merged changes publish from `main` under `docs/deployment-policy.md`.

Production parity requires independent verification after merge. Issue #479 is the current deployment record.

Scheduled monitoring and candidate auditing remain artifact-only and do not authorize canonical writes, guide edits, automatic canonical pull requests, or deployment decisions outside the normal main workflow.

## 19. Review gate

PR #498 is complete. Stop and review:

```text
whether MNEE was added or withheld
canonical record completeness
source and archive completeness
reserve and redemption support
deployment identity support
known unknowns
maintenance burden
production parity
```

Only a separate reviewed decision may authorize later work.
