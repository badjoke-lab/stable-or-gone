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
docs/roadmap-amendments/2026-08-01-evidence-archive-payload-verification-batch-1.md
```

Current operating specification:

```text
docs/post-351-data-growth-operating-spec.md
```

Current work-item specification:

```text
docs/quality/evidence-archive-payload-verification-batch-1-spec.md
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
Metadata-checked detail routes: 417
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
REVIEW GATE — PR #506 complete and production-verified
```

Reviewed decision:

```text
PR #506 Evidence Archive Payload Verification — Batch 1 complete and production-verified
production commit: 2a6bfac25538388dd7ea6dc12de96c2c2dc2dad0
production canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb
convergence attempt: 2
exact target count: 10
dated exact archives added: 7
reviewed no safe change: 3
archive coverage after: 457 of 579
source replacement: 0
new Evidence identities or Relations: 0
non-Evidence canonical changes: 0
current boundary: REVIEW GATE
```

No later work is pre-authorized.

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

## 10A. PR #502 Launch Date Boundary Review — Batch 1

PR #502 closes the post-PR #500 review gate only for a six-target launch-date evidence review. It changes no canonical data itself.

The target set is fixed to `sog_st_msusd`, `sog_st_stablesusdx`, `sog_st_susde`, `sog_st_usd1`, `sog_st_usdm`, and `sog_st_usdh`. PR #503 must review every target and may not substitute another record.

A canonical date requires exact day-level primary evidence matching the same identity and launch boundary. Announcement, contract deployment, first mint, exchange listing, network activation, migration, and rebrand dates remain distinct unless primary evidence explicitly establishes equivalence. Unresolved outcomes remain null.

PR #503 reviewed every named target. All six remain null because the reviewed primary sources establish only operating-product, month/range, deployment, testing, terms-effective, underlying-asset, rebrand, or later-availability boundaries. The queue records the reviewed range, reason, date, and source list for each target. No canonical Evidence identity or Evidence Relation was added. It may not add assets, organizations, relationships, deployments, Market Access records, route families, rankings, recommendations, or material UI changes. It exits to REVIEW GATE.

## 10B. PR #505 Evidence Archive Payload Verification — Batch 1

PR #505 closes the current review gate only for one ten-identity archived-payload verification pass. PR #506 is the only authorized implementation.

The target set is fixed by `config/evidence-archive-payload-verification-batch-1.json` and consists of the ten PR #405 identities that had exact-source CDX metadata but no independently reviewed archive payload.

An archive may be accepted only when the exact canonical URL returns an HTTP-200 dated Wayback snapshot and the fetched archived body visibly preserves the existing canonical claim scope. CDX metadata, redirect status, root-domain capture, or automated keyword matching without manual payload review cannot authorize a canonical `archived_url`.

PR #506 changed only seven accepted target `archived_url` fields and forward archive-quality checkpoints. It replaced no source URL, added no Evidence identity or Relation, changed no non-Evidence canonical record, public route, or material UI. Production commit `2a6bfac25538388dd7ea6dc12de96c2c2dc2dad0` verified canonical hash `sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb`, the 117/108/129/192/579/579/184/8 canonical counts, 417 detail routes, 417 metadata-checked routes, and archive partition 457/122. The repository is at REVIEW GATE. No work beyond this checkpoint is pre-authorized.

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

PR #506 is complete and production-verified. The repository is at:

```text
REVIEW GATE
```

No later archive batch, launch-date batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material UI work is authorized automatically. Only a later separate reviewed decision may authorize another work item.
