# Stable or Gone Roadmap

Updated: 2026-06-22

## Purpose

This file is the canonical execution and recovery schedule for SOG.

Resume interrupted work in this order:

1. Confirm the latest merged PR and current `main`.
2. Read **Current position** and **Immediate next work**.
3. Validate `docs/migration/registry-v3-baseline.json`.
4. Check for an existing branch or PR for the named next work item.
5. Resume from the first incomplete item.

Every roadmap-changing PR must update this file. Every merge report must state the merge SHA, data changes, CI result, remaining queues, production status, and next work item.

## Current position

Repository:

```text
badjoke-lab/stable-or-gone
```

Public site:

```text
https://sog.badjoke-lab.com/
```

Latest merged checkpoint:

```text
PR #89 — Record 75-record production parity
Commit: 1aa87b0ca8251eea651af74f2af80f30c791e39c
```

Latest production checkpoints:

```text
75-record production parity: PASS
Verification workflow run: 27905696588
Audit: docs/audits/registry-75-production-parity.md

Manual publication activation: PASS
Deployment workflow run: 27908380603
Source commit: 1aa87b0ca8251eea651af74f2af80f30c791e39c
Audit: docs/audits/manual-production-activation-2026-06-22.md
```

Current canonical registry:

```text
75 stable assets
64 organizations
77 stablecoin-organization relationships
75 classifications
75 reserve/redemption profiles
102 events
102 Event v2 detail records
306 evidence records
82 reserve-report or reserve-context records
173 known unknowns
9 regulatory notes
106 deployments
75 legal profiles
4 stable-asset relationships
107 reserve components
75 income profiles
```

Current quality baseline:

```text
Candidate promotions:                    75 / 75
Pending candidates:                       0
Critical findings:                        0
Warnings:                                 0
Stale verification records:               0
Required-layer coverage:              75 / 75
Event coverage:                        75 / 75
Deployment coverage:                   75 / 75
Reserve-report context coverage:       62 / 75 informational
Missing canonical launch dates:            34
Historical records missing terminal date:   6
Reserve applicability queue:                13
All-unknown income profiles:                 0
```

Machine-readable baseline:

```text
docs/migration/registry-v3-baseline.json
scripts/validate-registry-v3-baseline.mjs
```

## Manual publication result

The repository now uses the intended free-plan publication architecture:

```text
latest main
→ manual GitHub Actions dispatch
→ npm run build
→ prebuilt dist upload with Wrangler
→ deployed commit verification
→ production consistency verification
```

The first controlled manual deployment completed successfully in workflow run `27908380603`. The workflow enforced `main`, required exact `DEPLOY` confirmation, built the full repository, uploaded the prebuilt site to Cloudflare Pages, verified production, and wrote a deployment summary.

## Immediate next work

```text
1. Merge the manual-publication finalization PR after all CI checks pass.
2. Prepare the 75 → 80 candidate intake.
3. Select five candidates that are not wrappers, bridged copies, duplicate deployments, or announcement-only projects.
4. Complete identity, issuer, lifecycle, event, evidence, deployment, legal, reserve, income, and known-unknown review.
5. Promote only complete reviewed records.
6. Update generated outputs and the Registry v3 baseline in the same promotion PR.
7. After the 80-record merge, run one manual publication-checkpoint deployment and full production parity.
```

## Cloudflare production configuration

```text
Production branch: main
Automatic production deployment: disabled
Preview branch deployments: disabled
Build cache: enabled
Build command: npm run build
Output directory: dist
Build watch paths: *
Publication path: manual GitHub Actions workflow only
Pages project: stable-or-gone
```

GitHub production controls:

```text
Repository secrets:
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

Environment:
- production
- allowed deployment branch: main
- required reviewers: none
- wait timer: none
```

Normal pull requests and normal `main` merges do not publish to Cloudflare. Publication occurs only through `.github/workflows/deploy-production.yml` with an explicit deployment classification and exact `DEPLOY` confirmation.

## Production-parity gates

| Canonical count | Required gate |
|---:|---|
| 75 | complete — parity and manual publication activation passed |
| 80 | manual publication and production parity after merge |
| 85 | manual publication and production parity after merge |
| 90 | manual publication and production parity after merge |
| 95 | manual publication and production parity after merge |
| 100 | final manual publication, full parity, and Issue #66 resolution |

At every gate verify the deployed commit, public counts, machine-readable files, canonical routes, sitemap, metadata, structured data, stale count markers, and production errors.

## Completed checkpoints

```text
PR #74 — Freeze unresolved launch-date queue
PR #75 — Audit historical terminal-date boundaries
PR #77 — Freeze historical terminal-date queue
PR #78 — Resolve fiat-backed income profiles
PR #79 — Resolve protocol stable-asset mechanics
PR #80 — Complete income-profile classification
PR #81 — Classify reserve-report applicability
PR #82 — Add Phase 4 reserve context records
PR #83 — Freeze reviewed reserve source status
PR #84 — Establish the 70-record quality baseline
PR #85 — Prepare Batch 12 candidate intake
PR #86 — Review Batch 12 promotion boundaries
PR #87 — Promote Batch L current stable assets
PR #89 — Record 75-record production parity
75-record production parity — PASS
Manual production publication activation — PASS
```

## Phase status

```text
Phase 1 — Launch-date quality work: complete
Phase 2 — Historical terminal-date work: complete
Phase 3 — Income-profile completion: complete
Phase 4 — Reserve-report applicability and evidence: complete
Phase 5 — 70-record quality audit and baseline: complete
Phase 6A — Controlled growth from 70 to 75: complete
Phase 6B — 75-record production parity: complete
Phase 6C — Manual Cloudflare publication activation: complete
Phase 6D — Controlled growth from 75 to 80: next
```

## Explicit unresolved queues

### Launch dates

```text
34 unresolved records
```

Source: `data/quality/launch-date-unresolved.json`

Unsupported day-level precision remains forbidden.

### Terminal dates

```text
6 unresolved records
BAC
DSD
ESD
GYEN
Mountain USDM
USDN
```

Source: `data/quality/terminal-date-unresolved.json`

A depeg, migration start, last commit, or retrospective source date is not automatically a terminal date.

### Reserve-report applicability

```text
Reserve-context rows:                82
Context coverage:                 62/75 informational
Expected but missing:                0
Not applicable by design:           10
Reviewed source-status unresolved:   3
Placeholder reserve rows:            0
```

The reviewed unresolved records remain FEI, HUSD, and EURT.

Sources:

```text
data/quality/reserve-report-applicability.json
docs/audits/reserve-report-applicability-review.md
docs/audits/reserve-source-status-review.md
```

## Controlled-growth rules

Default batch size is five canonical assets.

Every promoted asset must include the applicable:

- canonical stable-asset record
- organization and relationship
- classification
- reserve and redemption profile
- event and Event v2 detail
- primary evidence
- explicit known unknowns
- deployment identity
- legal profile
- reserve component
- income profile
- candidate promotion record

Do not promote simple wrappers, bridged copies, LP tokens, vault shares, test tokens, duplicate deployments, or announcement-only projects as separate canonical assets by default.

Any intentional count or queue change must update canonical data, generated outputs, integrity audit, and Registry v3 baseline in one reviewed PR.

## Publication cadence

```text
Normal PR or normal main merge: no deployment
Several quality PRs: bundle into one later deployment
Count-growth checkpoint: one manual deployment
Verified emergency: one immediate manual deployment
```

Do not create no-op commits or repeated short-interval deployments merely to trigger Cloudflare.
