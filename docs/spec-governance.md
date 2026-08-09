# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-09

## 1. Purpose

This document defines repository authority, conflict resolution, change control, canonical-data preservation, public-surface governance, visual-quality gates, deployment governance, and bounded continuation rules.

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, stale roadmap text, and unmerged drafts do not override merged repository authority.

Historical PR-specific specifications and checkpoints remain historical records. Their completed semantic contracts remain useful, but old `current`, `active`, schedule, count, domain, or workstream wording does not override this document and the current roadmap.

## 2. Authority order

When active documents disagree, use this order:

1. `docs/deployment-policy.md` for publication, production verification, Cloudflare, domain, and production-visual gates.
2. `docs/spec-governance.md` for authority and change control.
3. `docs/roadmap.md` for current phase, immediate item, bounded sequence, and schedule.
4. the current merged roadmap result named below.
5. the current work-item result specification named below.
6. enduring regression authorities such as `docs/ui-v3-remediation-authority.md`.
7. named audits, inventories, baselines, fixtures, release notes, research checkpoints, queues, and reviewed prior outputs.
8. conversation history and unmerged drafts.

Current roadmap result:

```text
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-review-result.md
```

Current work-item result specification:

```text
docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md
```

Current private review result:

```text
data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json
```

Required review lineage:

```text
config/evidence-archive-payload-verification-batch-2-review-authority.json
data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json
config/evidence-archive-payload-verification-batch-1.json
docs/migration/evidence-archive-maintenance-queue-v7-pr403.json
```

## 3. Mandatory reading and update protocol

Before every substantive change to code, canonical data, UI, workflows, infrastructure, or documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read the current roadmap result;
6. read the current result specification and private review result;
7. read the authority, candidate, Batch 1, and Queue v7 lineage named above;
8. read every enduring regression authority and named input required by the next separately authorized work item.

A non-trivial PR is not ready for implementation until its exact roadmap item and governing specification are identified.

If merged repository state changes authority, canonical counts, schedule, deployment behavior, public route behavior, or a blocking visual conclusion, update the governing specification and roadmap before implementation continues.

## 4. Current reviewed execution state

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked detail routes: 422
Official public origin: https://www.stableorgone.com
Review authority entry commit: c9588b092277bd14d87ce9209ba087e4752b3346
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Legacy-host migration: complete
```

A fixed production commit in a work-item document is an immutable entry checkpoint. It must not be treated as a perpetually current production commit after later documentation-only merges.

Current `main` and production equality is verified dynamically by `.github/workflows/deploy-production.yml`, the strict domain-migration workflow, relevant production visual checks, provenance/output-parity checks, and Issue #479.

## 5. Current bounded sequence

```text
1. PR #523 bounded JPYSC implementation — complete
2. PR #534 closeout and REVIEW GATE restoration — complete
3. PRs #535–#536 Japan Market Access Expansion Review Batch 1 — complete no-go
4. PR #537 Evidence Archive Payload Verification Batch 2 review-only authority — complete and production-verified
5. PR #538 deterministic Batch 2 candidate selection — complete and production-verified
6. Batch 2 manual payload review — complete, 8 proposals / 2 no-safe-change
7. REVIEW GATE — current canonical implementation boundary
```

There is no active canonical implementation authority.

## 6. Evidence Archive Payload Verification Batch 2 result

The ten deterministic candidates were reviewed using exact canonical-source Wayback discovery, independent raw replay payload retrieval with redirects disabled, payload byte and SHA-256 recording, extracted-text inspection, and manual comparison against the existing canonical claim scope or source role.

Review result:

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical archive additions authorized: 0
```

Proposed Evidence IDs:

```text
sog_src_susd_legacy_context_batch_a
sog_src_susd_rebuilding_2026
sog_src_susd_roadmap_2026
sog_src_susd_sip_status_2026
sog_src_susd_synthetix_docs
sog_src_susd_v3_faq_batch_a
sog_src_terra_docs
sog_src_tether_transparency
```

No-safe-change Evidence IDs:

```text
sog_src_susd_sip420_2024
sog_src_susd_sip423_2026
```

For SIP-420, every reviewed replay of the exact canonical no-slash URL returned HTTP 302 to a trailing-slash archived target. The review contract does not permit redirect-only promotion or silent source-URL normalization.

For SIP-423, a dedicated retry found zero HTTP-200 capture rows across the exact canonical URL, exact-match canonical query, and trailing-slash discovery query. The live source is not a dated archived payload.

The eight proposal URLs, capture timestamps, HTTP-200 status, payload byte counts, SHA-256 digests, payload markers, review reasons, and Actions artifact lineage are fixed in the private review result.

The review itself changes no canonical Evidence row. A separate implementation authority is required before any proposed archive URL can be promoted.

## 7. Canonical and public safety boundary

Public registry and machine-readable claims remain canonical-only.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
includes_private_notes = false
```

Candidate, monitoring, discovery, editorial-research, and private material remains outside canonical public data unless separately reviewed and promoted.

Unknown values remain unknown until reviewed evidence supports replacement.

Protected unresolved states include:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

Missing evidence, a candidate row, monitoring signal, guide statement, product-list omission, archive metadata hit, redirect-only replay, or planning gap is not proof of a canonical value.

Editorial context must not be converted automatically into asset-level availability, approval, legality, safety, ranking, or support claims.

## 8. Historical PR #523 semantic authority

The completed PR #523 result remains historical canonical truth:

```text
asset: sog_st_jpysc
jurisdiction: JP / Japan
provider: SBI VC Trade / VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Archive not recorded: 122 -> 122
Detail routes: 422 -> 422
Metadata-checked routes: 422 -> 422
```

Historical closeout artifacts remain historical evidence and are not rewritten merely to equal a later docs-only production commit.

## 9. Material UI governance

`docs/ui-v3-remediation-authority.md` remains the minimum regression contract for material public UI work.

For material UI changes:

- desktop and mobile screenshots are mandatory;
- direct inspection of changed route families is mandatory;
- initial-viewport and full-page review must be used where hierarchy or page length is relevant;
- horizontal overflow, clipping, overlapping text, unreadable density, essential-content loss, or broken composition are blocking;
- automated success cannot override a known visual defect.

The completed Evidence Archive review permits no material UI change.

## 10. Monitoring, editorial, and candidate governance

Monitoring remains private, review-only, and read-only with respect to canonical data. It may discover leads and prepare review material but may not write canonical data, self-accept baselines, auto-edit guides, auto-promote candidates, or deploy.

The regulation guide cluster remains maintenance-only. There is no automatic article cadence. A new editorial route requires a material regulatory change, material correction/source update, or observed search-demand/content-gap basis and its own reviewed scope when material.

Canonical growth, dossier deepening, archive verification, and Market Access expansion remain distinct operations. Schedule placement does not authorize implementation.

## 11. Official-domain and deployment governance

The only official origin is:

```text
https://www.stableorgone.com
```

The legacy host migration is complete. `public/_worker.js` in Cloudflare Pages Advanced Mode performs the exact path- and query-preserving HTTP 301 for the legacy hostname while canonical and `pages.dev` requests pass through to the static asset binding.

The strict domain-migration gate established by PR #530 is binding. Repository output must not reintroduce the legacy host as a canonical origin, sitemap host, machine-readable canonical origin, OGP URL, or production base URL.

Normal merged changes publish automatically from `main`. A merge is not production-parity evidence; deployment verification remains governed by `docs/deployment-policy.md` and Issue #479.

## 12. Change control

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- active workstream or approved PR sequence;
- roadmap schedule when execution order materially changes;
- canonical enum or record meaning;
- evidence interpretation or source identity handling;
- Evidence Archive selection, review, source normalization, or promotion semantics;
- unknown-state semantics;
- route families or machine-readable output shape;
- count or denominator semantics;
- build provenance or canonical-hash boundaries;
- monitoring source, baseline, schedule, permission, or retention semantics;
- candidate-audit or complete-record feasibility semantics;
- canonical Market Access Record semantics;
- material UI/readability or product-surface behavior;
- production publication gates;
- official public origin or legacy-host redirect behavior.

No implementation PR may introduce an undocumented alternative.

## 13. Pull-request traceability

Every non-trivial PR body must identify specification references, roadmap item, scope, explicit non-goals, named inputs and prior outputs, canonical-data preservation, public-output preservation, validation, visual inspection when applicable, deployment classification, and next review gate.

A PR that cannot cite an approved work item must pause until repository authority is corrected.

## 14. Schedule versus authority

Dates in `docs/roadmap.md` are targets, not implementation permission.

Evidence Archive Payload Verification Batch 2 review is complete. Its eight archive proposals remain non-canonical until a separate implementation authority is reviewed and merged. The roadmap's 2026-08-17 to 2026-08-23 implementation window remains a planning target, not implicit permission. Tier A Dossier Deepening Batch 4, Record Growth, cycle review, and later work also require their own authority.

## 15. Historical checkpoints

Do not rewrite historical checkpoint artifacts merely because current counts, UI, domain, or workstream changed. Forward authority documents describe current state while historical release-integrity baselines, completed PR specifications, archived audits, and prior production checkpoints remain immutable historical evidence unless a specific correction is required.

Required compatibility anchors include PR #493 official-domain migration, PR #500 bounded MNEE Evidence/Archive maintenance, PR #517 Bison Bank growth, and PR #522 semantic authority for PR #523.

## 16. Required exit

Current canonical implementation boundary:

```text
REVIEW GATE
```

The completed Batch 2 review authorizes no canonical mutation. Any archive promotion requires a new separately reviewed and merged implementation authority binding exact IDs, exact archive URLs, maximum deltas, validators, and production verification.
