# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-10

## 1. Purpose

This document defines repository authority, conflict resolution, canonical-data preservation, public-surface governance, visual-quality gates, deployment governance, and bounded continuation rules.

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts do not override merged repository authority.

## 2. Authority order

When active documents disagree, use this order:

1. `docs/deployment-policy.md` for production/publication and production visual gates.
2. `docs/spec-governance.md` for authority and change control.
3. `docs/roadmap.md` for current phase and bounded sequence.
4. the current merged roadmap amendment.
5. the current work-item specification and machine-readable authority contract.
6. enduring regression authorities such as `docs/ui-v3-remediation-authority.md`.
7. named audits, inventories, baselines, fixtures, queues, and reviewed prior outputs.
8. conversation history and unmerged drafts.

Current roadmap authority:

```text
docs/roadmap-amendments/2026-08-10-stablecoin-compare-matrix-remediation-authority.md
```

Current work-item specification and contract:

```text
docs/quality/stablecoin-compare-matrix-remediation-spec.md
config/stablecoin-compare-matrix-remediation-authority.json
```

Paused-but-preserved Evidence Archive authority remains recorded in:

```text
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-review-authority.md
docs/roadmap-amendments/2026-08-09-evidence-archive-payload-verification-batch-2-candidates.md
docs/quality/evidence-archive-payload-verification-batch-2-review-authority-spec.md
docs/quality/evidence-archive-payload-verification-batch-2-candidate-spec.md
config/evidence-archive-payload-verification-batch-2-review-authority.json
data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json
```

## 3. Mandatory reading and update protocol

Before every substantive change to code, canonical data, UI, workflows, infrastructure, or governing documentation:

1. read `AGENTS.md`;
2. read this file;
3. read `docs/roadmap.md`;
4. read `docs/deployment-policy.md`;
5. read the current roadmap amendment, work-item spec, and authority contract;
6. read `docs/ui-v3-remediation-authority.md` for material public UI work;
7. read paused Evidence Archive authority before modifying or resuming that lane.

A non-trivial PR is not ready for implementation until its exact roadmap item and governing specification are identified.

If merged repository state changes authority, canonical counts, schedule, deployment behavior, public route behavior, or a blocking visual conclusion, update governing specification and roadmap before implementation continues.

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
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Legacy-host migration: complete
```

Every canonical value above is frozen for the active Compare remediation.

## 5. Current bounded sequence

```text
1. PR #523 bounded JPYSC implementation — complete
2. PR #534 closeout and REVIEW GATE restoration — complete
3. PR #535/#536 Japan Market Access Expansion Review Batch 1 — complete no-go
4. PR #537 Evidence Archive Payload Verification Batch 2 review-only authority — complete
5. PR #538 deterministic Batch 2 candidate selection — complete
6. PR #539 manual payload review — draft and paused; must not merge during Compare remediation
7. Stablecoin Compare Matrix Remediation authority — current
8. Stablecoin Compare Matrix implementation and visual acceptance — next under current authority
9. Compare closeout / production parity — required
10. Evidence Archive Payload Verification Batch 2 MANUAL_PAYLOAD_REVIEW — resume only after closeout
```

There is no active canonical-record implementation authority. `REVIEW GATE` remains the canonical implementation boundary.

## 6. Active Stablecoin Compare Matrix Remediation

The existing Stablecoin Register comparison selection supports two to four stablecoins but renders selected records as independent stacked dossiers. The active bounded remediation exists only to make that existing feature an actual comparison matrix.

Authorized behavior:

```text
public route: /stablecoins/
minimum ready selections: 2
maximum selections: 4
fifth selection: rejected
matrix: attribute rows × selected record columns
Differences only: required
individual column removal: required
Unknown / Not recorded: remain explicit
URL compare state: selected order preserved
mobile: internal bounded horizontal scroll; no page-level horizontal overflow
```

Only already-exposed comparison facts may be displayed. No new canonical inference, ranking, scoring, recommendation, winner/loser framing, or safety assessment is permitted.

No canonical or schema delta is authorized.

## 7. Paused Evidence Archive Payload Verification Batch 2

The Evidence Archive review is not cancelled. It is paused at the already-created manual payload review checkpoint.

```text
stage: MANUAL_PAYLOAD_REVIEW
candidate count: 10
draft PR: #539
canonical archive additions authorized: 0
```

Its exact candidate set, Wayback review requirements, and Batch 1/Queue v7 semantic inputs remain unchanged. PR #539 may retain research artifacts but must not be merged while Compare remediation is active.

## 8. Canonical and public safety boundary

Public registry and machine-readable claims remain canonical-only.

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
canonical implementation authority = REVIEW GATE
```

UI work cannot change stablecoin identity, lifecycle/issuance taxonomy, organization relationships, reserve claims, evidence, archive URLs, Market Access, route identity, or machine-readable canonical outputs.

## 9. Material UI regression requirements

`docs/ui-v3-remediation-authority.md` remains binding. Material UI changes require:

- exact-head repository validation;
- existing exhaustive desktop/mobile route and readability/color/overflow gates;
- direct artifact review of the changed route family and relevant states;
- no known visual defect accepted because CI is green;
- no page-level horizontal overflow, clipping, overlap, or essential text loss;
- no contradictory empty/error/ready state;
- interactive targets preserving the shared accessibility floor.

For Compare specifically, direct acceptance must cover desktop 2/3/4 selections and mobile 2/4 selections, differences-only on/off, column removal, fifth-selection rejection, URL restoration, and explicit Unknown/Not recorded values.

## 10. Historical anchors

Historical PR-specific checkpoints remain immutable audit evidence, including:

```text
PR #493 — official-domain migration and production verification
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB/USB complete-record growth checkpoint
PR #522 — semantic authority for PR #523
PR #523 — last canonical-changing implementation
PR #537 — Evidence Archive Batch 2 review authority
PR #538 — Evidence Archive Batch 2 deterministic candidates
```

## 11. Exit rule

After the Compare implementation is merged, production-verified, and directly visually accepted, a separate closeout must restore Evidence Archive Payload Verification Batch 2 manual review as the active lane. The Compare authority ends at that closeout. Canonical implementation remains behind REVIEW GATE throughout.
