# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-08

## 1. Purpose

This document defines repository authority, conflict resolution, change control, canonical-data preservation, public-surface governance, visual-quality gates, deployment governance, and bounded continuation rules.

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, stale roadmap text, and unmerged drafts do not override merged repository authority.

Historical PR-specific specifications and checkpoints remain historical records. Their completed semantic contracts remain useful, but their old `current`, `active`, schedule, count, domain, or workstream wording does not override this document and the current roadmap.

## 2. Authority order

When active documents disagree, use this order:

1. `docs/deployment-policy.md` for publication, production verification, Cloudflare, domain, and production-visual gates.
2. `docs/spec-governance.md` for authority and change control.
3. `docs/roadmap.md` for current phase, immediate item, bounded sequence, and schedule.
4. the active merged roadmap amendment named below.
5. the active authority/reconciliation specification named below.
6. the current work-item specification.
7. enduring regression authorities such as `docs/ui-v3-remediation-authority.md`.
8. named audits, inventories, baselines, fixtures, release notes, research checkpoints, queues, and reviewed prior outputs.
9. conversation history and unmerged drafts.

Current active roadmap amendment:

```text
docs/roadmap-amendments/2026-08-08-post-pr531-authority-reconciliation.md
```

Current authority/reconciliation specification:

```text
docs/quality/post-pr531-authority-reconciliation-spec.md
```

Current work-item specification:

```text
docs/quality/guide-readability-remediation-2026-08-08-spec.md
```

## 3. Mandatory reading and update protocol

Before every substantive change to code, canonical data, UI, workflows, infrastructure, or documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read the active roadmap amendment;
6. read the active authority/reconciliation specification;
7. read the current work-item specification;
8. read every enduring regression authority and named input required by that work item.

A non-trivial PR is not ready for implementation until its exact roadmap item and governing specification are identified.

If merged repository state changes authority, production checkpoint, canonical counts, schedule, deployment behavior, public route behavior, or a blocking visual conclusion, update the governing specification and roadmap before implementation continues.

## 4. Current verified execution state

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 584
Evidence Relations: 584
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 8
Archive recorded: 462
Archive not recorded: 122
Detail routes: 422
Metadata-checked detail routes: 422
Official public origin: https://www.stableorgone.com
Production commit: 210d68001fbd2560ffadf538fdb7cc9302b400a7
Production canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 1
Legacy-host migration: complete
```

Current `main` and production equality is verified dynamically by `.github/workflows/deploy-production.yml`, the strict domain-migration workflow, production visual capture, and Issue #479.

## 5. Current bounded sequence

The current sequence is:

```text
1. post-PR #531 authority/specification/schedule reconciliation
2. Guide & Research Surface Readability Remediation
3. production verification of the Guide remediation
4. PR #523 current-main reconciliation and bounded JPYSC implementation
5. production verification and separate REVIEW GATE closeout
6. later planned lanes only after their own merged authority
```

PR #523 is paused during the Guide remediation. The old PR #523 head must not be merged as-is because it predates PRs #524–#531 and the required shared Guide repair.

The Guide remediation changes presentation only. It authorizes no canonical mutation.

## 6. Material UI governance and the 2026-08-08 blocking defect

`docs/ui-v3-remediation-authority.md` remains the minimum regression contract for public UI work.

Direct production review on 2026-08-08 found a blocking Guide-system defect on both the new global regulation guide and a pre-existing UK guide. The defect includes narrow desktop reading width caused by a persistent left TOC rail, weak primary section hierarchy, audit-sheet-like repeated box treatment, duplicated/mispositioned support UI, and an unbalanced home Research & Guides composition.

The governing repair specification is:

```text
docs/quality/guide-readability-remediation-2026-08-08-spec.md
```

For material UI changes:

- desktop and mobile screenshots are mandatory;
- direct human inspection of changed route families is mandatory;
- initial-viewport and full-page review must be used where page length or hierarchy is part of the defect;
- horizontal overflow, clipping, overlapping text, unreadable density, essential-content loss, or visibly broken composition are blocking;
- automated build, contrast, geometry, screenshot, or workflow success cannot override a known visual defect;
- a newly discovered material defect blocks merge until fixed and, where practical, covered by a regression check.

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

Missing evidence, a candidate row, a monitoring signal, a guide statement, or a planning gap is not proof of a canonical value.

Editorial context must not be converted automatically into asset-level availability, approval, legality, safety, ranking, or support claims.

## 8. PR #523 preserved semantic authority

After the Guide remediation is production-verified, PR #523 may resume only under the bounded PR #522 JPYSC authority.

Exact later target:

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
```

Expected transition:

```text
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Archive not recorded: 122 -> 122
Detail routes: 422 -> 422
Metadata-checked routes: 422 -> 422
```

No new asset, organization, event, deployment, route family, schema, unrelated UI work, future-capability backfill, lending-as-access inference, country-wide availability claim, ranking, score, recommendation, or replacement asset is authorized by PR #523.

## 9. Monitoring, editorial, and candidate governance

Monitoring remains private, review-only, and read-only with respect to canonical data. It may discover leads and prepare review material but may not write canonical data, self-accept baselines, auto-edit guides, auto-promote candidates, or deploy.

The current regulation guide cluster enters maintenance-only mode after the Guide/readability repair. There is no automatic article cadence. A new editorial route requires a material regulatory change, material correction/source update, or observed search-demand/content-gap basis and its own reviewed scope when the change is material.

Canonical growth, dossier deepening, archive verification, and Market Access expansion remain distinct operations. Schedule placement does not authorize implementation.

## 10. Official-domain and deployment governance

The only official origin is:

```text
https://www.stableorgone.com
```

The legacy host migration is complete. `public/_worker.js` in Cloudflare Pages Advanced Mode performs the exact path- and query-preserving HTTP 301 for the legacy hostname while canonical and `pages.dev` requests pass through to the static asset binding.

The strict domain-migration gate established by PR #530 is binding. Repository output must not reintroduce the legacy host as a canonical origin, sitemap host, machine-readable canonical origin, OGP URL, or production base URL.

Normal merged changes publish automatically from `main`. A merge is not production-parity evidence; deployment verification remains governed by `docs/deployment-policy.md` and Issue #479.

## 11. Change control

A change to any of the following requires a specification update in the same PR or an earlier dependency PR:

- active workstream or approved PR sequence;
- roadmap schedule when execution order materially changes;
- canonical enum or record meaning;
- evidence interpretation or source identity handling;
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

## 12. Pull-request traceability

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
Visual inspection when applicable
Deployment classification
Next review gate
```

A PR that cannot cite an approved work item must pause until repository authority is corrected.

## 13. Schedule versus authority

The current planning windows live in `docs/roadmap.md` and the active amendment. Dates are targets, not implementation permission.

A delayed item does not silently unlock the next lane. Evidence Archive Payload Verification Batch 2, Tier A Dossier Deepening Batch 4, cycle review, and the next operating cycle require the authority specified by the roadmap.

## 14. Historical checkpoints

Do not rewrite historical checkpoint artifacts merely because current counts, UI, domain, or workstream changed. Forward authority documents must point to current state while historical release-integrity baselines, completed PR specifications, archived audits, and prior production checkpoints remain immutable historical evidence unless a specific correction is required.

## 15. Required exit

After the Guide/readability remediation is production-verified, PR #523 may resume against current `main`. After PR #523 is merged and production-verified, a separate closeout must return repository authority to:

```text
REVIEW GATE
```

No later archive, dossier, record-growth, Market Access, editorial, or material UI lane is pre-authorized by that exit.
