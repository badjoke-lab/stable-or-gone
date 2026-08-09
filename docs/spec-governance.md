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
4. the active merged roadmap amendment named below.
5. the active work-item specification named below.
6. enduring regression authorities such as `docs/ui-v3-remediation-authority.md`.
7. named audits, inventories, baselines, fixtures, release notes, research checkpoints, queues, and reviewed prior outputs.
8. conversation history and unmerged drafts.

Current active roadmap amendment:

```text
docs/roadmap-amendments/2026-08-09-post-pr534-market-access-review-authority.md
```

Current authority/work-item specification:

```text
docs/quality/market-access-expansion-review-authority-2026-08-09-spec.md
```

Enduring Market Access contract:

```text
docs/market-access-record-spec.md
config/market-access-governance-v1.json
```

## 3. Mandatory reading and update protocol

Before every substantive change to code, canonical data, UI, workflows, infrastructure, or documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read the active roadmap amendment;
6. read the active work-item specification;
7. read every enduring regression authority and named input required by that work item.

A non-trivial PR is not ready for implementation until its exact roadmap item and governing specification are identified.

If merged repository state changes authority, production checkpoint, canonical counts, schedule, deployment behavior, public route behavior, or a blocking visual conclusion, update the governing specification and roadmap before implementation continues.

## 4. Current verified execution state

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
Current production commit: 8ba1ed2b4aff36aaa9545c6f3e3cdd113dbb5ed2
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Production canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Production canonical file count: 466
Current production parity convergence attempt: 1
Current production provenance convergence attempt: 3
Legacy-host migration: complete
```

PR #534 changed closeout/authority material only. Its production-verified commit therefore has the same canonical hash and reviewed counts as the historical PR #523 canonical-changing commit.

Current `main` and production equality is verified dynamically by `.github/workflows/deploy-production.yml`, the strict domain-migration workflow, relevant production visual checks, and Issue #479.

## 5. Current bounded sequence

The current sequence is:

```text
1. PR #523 bounded JPYSC implementation — complete
2. PR #523 production verification — complete
3. PR #534 closeout and REVIEW GATE restoration — complete
4. forward-governance reconciliation to current production — current authority dependency
5. Japan Market Access Expansion Review Batch 1 — review only
6. REVIEW GATE
7. any canonical promotion only after a separate reviewed and merged implementation authority
```

The active review lane is not implementation authority.

## 6. Current Market Access review authority

The active work item is:

```text
Japan Market Access Expansion Review Batch 1
jurisdiction: JP / Japan
maximum candidate asset x platform/service pairs: 3
existing canonical assets only: yes
provider/service preselected: no
functions: buy_sell, deposit, withdrawal, external_wallet_transfer
```

The review may inspect current platform/provider primary sources, regulator or official-register sources, issuer/protocol supporting sources, and reputable secondary context. It may prepare private/editorial review artifacts and a bounded implementation proposal or no-go result.

It may not add canonical Market Access Records, Evidence identities, Evidence Relations, assets, organizations, events, deployments, public routes, or material UI.

Country-wide availability inference from a single provider observation is prohibited. Unsupported values remain unknown or out of scope. Direct issuer mint/redemption, lending, staking, and yield are outside this review.

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
```

Its reviewed transition was:

```text
Evidence: 584 -> 585
Evidence Relations: 584 -> 585
Market Access Records: 8 -> 12
Archive recorded: 462 -> 463
Archive not recorded: 122 -> 122
Detail routes: 422 -> 422
Metadata-checked routes: 422 -> 422
```

Historical closeout artifacts for PR #523/#534 must not be rewritten merely to make their old checkpoint commit equal to a later docs-only production commit.

## 9. Material UI governance

`docs/ui-v3-remediation-authority.md` remains the minimum regression contract for material public UI work.

For material UI changes:

- desktop and mobile screenshots are mandatory;
- direct inspection of changed route families is mandatory;
- initial-viewport and full-page review must be used where hierarchy or page length is relevant;
- horizontal overflow, clipping, overlapping text, unreadable density, essential-content loss, or broken composition are blocking;
- automated success cannot override a known visual defect.

The active Market Access review authority permits no material UI change.

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

## 14. Schedule versus authority

The current planning windows live in `docs/roadmap.md` and the active amendment. Dates are targets, not implementation permission.

A delayed item does not silently unlock the next lane. Evidence Archive Payload Verification Batch 2, Tier A Dossier Deepening Batch 4, record growth, cycle review, and the next operating cycle require their own authority.

## 15. Historical checkpoints

Do not rewrite historical checkpoint artifacts merely because current counts, UI, domain, or workstream changed. Forward authority documents must point to current state while historical release-integrity baselines, completed PR specifications, archived audits, and prior production checkpoints remain immutable historical evidence unless a specific correction is required.

## 16. Required exit

The active review lane exits to:

```text
REVIEW GATE
```

A source-reviewed implementation proposal is not permission to mutate canonical data. Any Market Access promotion requires a new separately reviewed and merged implementation authority that binds exact rows, sources, Evidence identities, deltas, and validators.
