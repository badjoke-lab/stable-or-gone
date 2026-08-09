# Stable or Gone Roadmap

Updated: 2026-08-10  
Status: Stablecoin Compare Matrix Remediation active; Evidence Archive Payload Verification Batch 2 manual review paused; canonical implementation authority remains REVIEW GATE

## Current reviewed checkpoint

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
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Legacy-host 301: complete
```

## Completed current-cycle work

```text
PR #514 — six-week cycle and Batch 5 authority
PR #515 — candidate audit
PRs #516–#519 — EUB/USB implementation, navigation insertion, and closeout
PRs #520–#523 — JPYSC review, implementation authority, and canonical Market Access implementation
PR #524 — fixed support visual audit
PR #525 — support cleanup
PR #526 — complete Ledger Series footer network
PRs #527–#530 — official-domain migration and completed legacy-host 301
PR #531 — 2026 stablecoin regulation guide cluster
PR #532 — authority/schedule reconciliation
PR #533 — shared Guide readability remediation
PR #534 — post-PR #523 closeout and REVIEW GATE restoration
PR #535/#536 — Japan Market Access Expansion Review Batch 1, completed no-go
PR #537 — Evidence Archive Payload Verification Batch 2 review authority
PR #538 — deterministic Batch 2 candidate selection
```

## Current priority — Stablecoin Compare Matrix Remediation

The Stablecoin Register already allows two to four comparison selections. The current public rendering is defective because it clones a full vertical dossier for each selected record rather than aligning common attributes.

The active bounded remediation must convert that presentation into a single matrix:

```text
Attribute | selected record 1 | selected record 2 | selected record 3 | selected record 4
```

Only selected record columns are rendered.

Required behavior:

- two, three, and four selections use the same matrix model;
- fifth selection remains rejected;
- individual selected columns can be removed;
- `Differences only` hides rows whose normalized displayed values match across every selected record;
- Unknown and Not recorded remain explicit values;
- shared `compare` URL state preserves selected order;
- mobile keeps the matrix and uses bounded horizontal scrolling inside the comparison region;
- page-level horizontal overflow, clipping, overlap, and essential ellipsis remain blocking defects;
- no ranking, scoring, recommendation, winner/loser, or safety framing is introduced.

No canonical data or schema changes are authorized.

Authority:

```text
docs/roadmap-amendments/2026-08-10-stablecoin-compare-matrix-remediation-authority.md
docs/quality/stablecoin-compare-matrix-remediation-spec.md
config/stablecoin-compare-matrix-remediation-authority.json
```

## Evidence Archive Payload Verification Batch 2 — paused, not cancelled

The exact ten Batch 2 candidates remain fixed from PR #538. Manual Wayback payload review began in draft PR #539 and is paused while the public Compare defect is remediated.

```text
stage: MANUAL_PAYLOAD_REVIEW
candidate count: 10
draft PR: #539
canonical archive additions authorized: 0
```

PR #539 and its probe artifacts remain review-only and must not merge during the Compare lane. After Compare closeout, this lane resumes from the same review state; no candidate is silently promoted or dropped.

## Current boundary

```text
Current public implementation authority: Stablecoin Compare Matrix Remediation
Authorized public route: /stablecoins/
Canonical implementation authority: REVIEW GATE
Canonical promotion authorized: no
Evidence Archive review: paused at MANUAL_PAYLOAD_REVIEW
```

## Schedule

```text
2026-08-09  Evidence Archive Payload Verification Batch 2 authority/candidate selection — complete
2026-08-09  initial manual Wayback payload probe — draft review evidence in PR #539
2026-08-10  Stablecoin Compare Matrix defect remediation — immediate priority
2026-08-10  Compare exact-head CI + visual acceptance + main merge + production verification — required before closeout
2026-08-10 onward  restore Evidence Archive Payload Verification Batch 2 MANUAL_PAYLOAD_REVIEW after Compare closeout
2026-08-17 to 2026-08-23  Evidence Archive Batch 2 canonical implementation window — only if separately authorized after review
2026-08-24 onward  later dossier/data-growth lanes — separate authority required
```

Schedule windows are planning targets, not permission boundaries.

## Compare visual acceptance

Exact-head acceptance must preserve or strengthen the enduring UI V3 regression contract and directly inspect at least:

```text
desktop 2 selected
desktop 3 selected
desktop 4 selected
mobile 2 selected
mobile 4 selected
Differences only OFF and ON
individual column removal
fifth-selection rejection
shared compare URL restoration
Unknown / Not recorded visibility
```

Automated success does not override a known visual defect.

## Preserved exclusions

```text
canonical changes during Compare remediation
schema/taxonomy changes
new public routes
ranking / score / recommendation / winner / safety grading
more than four selected records
unreviewed data promoted into comparison
unrelated sitewide redesign
merging paused PR #539 during Compare remediation
unsupported archive promotion
silent continuation from a planning window
known visual defect accepted because CI is green
```

## Required work-start protocol

Every substantive continuation must begin by reading:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-10-stablecoin-compare-matrix-remediation-authority.md
docs/quality/stablecoin-compare-matrix-remediation-spec.md
config/stablecoin-compare-matrix-remediation-authority.json
docs/ui-v3-remediation-authority.md
```

Before resuming Evidence Archive work, also reread the PR #537/#538 authority, candidate contracts, Queue v7 inputs, Batch 1 review history, and PR #539 review artifacts.

If authority, counts, schedule, deployment behavior, or a blocking visual conclusion changes, update governing documents before implementation continues.
