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
PR #91 — Prepare Batch 13 candidate intake
Merge: f423b82f27f5e1751da24b7c3f018e22c0310a32
```

Active work:

```text
PR #92 — Review Batch 13 promotion boundaries
Branch: review-batch-13-promotion-boundaries
Canonical target: 75 → 80
Current step: boundary review
Canonical writes: forbidden in this PR
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

## Current canonical registry

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

## Candidate controls during PR #92

```text
Total controlled candidates: 80
Promoted candidates:         75
Pending candidates:           5
Canonical assets:             75 unchanged
Boundary-reviewed candidates: 5
```

Batch 13 candidates:

```text
sog_cand_000076 — Gyroscope GYD
sog_cand_000077 — f(x) Protocol fxUSD
sog_cand_000078 — Berachain HONEY
sog_cand_000079 — QiDAO MAI
sog_cand_000080 — Stables Labs USDX
```

Sources:

```text
data/candidate-stable-assets-growth-80.json
data/candidate-research-batch-13.json
docs/audits/batch-13-candidate-intake.md
docs/audits/batch-13-promotion-boundary-review.md
scripts/validate-batch13-research.mjs
```

## Boundary-review result

```text
GYD:
- base GYD only
- sGYD remains separate
- reviewed Ethereum launch date: 2023-12-07
- Polygon Gyro Proto remains historical lineage
- readiness: needs_layer_draft

fxUSD:
- base fxUSD only
- fxSAVE and position products remain separate
- V1/V2 continuity and base-token income remain explicit unknowns
- readiness: needs_identity_and_income_resolution

HONEY:
- native Berachain HONEY only
- receipts and bridged forms require explicit relationships
- Basket Mode, collateral-vault, custody, and fee boundaries recorded
- readiness: needs_layer_draft

MAI:
- official miMATIC-to-MAI identity continuity accepted
- chain deployments and current lifecycle require normalization
- readiness: needs_lifecycle_and_deployment_resolution

Stables Labs USDX:
- identity restricted to Stables Labs and usdx.money
- unrelated USDX assets remain separate
- sUSDX remains separate
- approved-party direct redemption boundary recorded
- readiness: needs_legal_and_counterparty_resolution
```

Only GYD has a reviewed day-level launch date. No other launch date, legal issuer, contract, reserve percentage, redemption right, or lifecycle conclusion may be inferred beyond the reviewed sources.

## Current quality baseline

```text
Candidate promotions:                    75 / 80 controlled
Pending candidates:                       5
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

Machine-readable baseline remains:

```text
docs/migration/registry-v3-baseline.json
scripts/validate-registry-v3-baseline.mjs
```

The canonical baseline remains 75 until a later reviewed promotion PR changes every required layer and generated output together.

## Immediate next work

```text
1. Complete and merge PR #92 after all GitHub CI checks pass.
2. Open the Batch M canonical-promotion PR from the merged main branch.
3. Build complete reviewed layer drafts for GYD, fxUSD, HONEY, MAI, and Stables Labs USDX.
4. Keep unresolved legal, income, lifecycle, deployment, counterparty, and date fields explicit rather than guessed.
5. Defer any candidate whose required layers cannot be represented safely.
6. In the same promotion PR, update canonical data, candidate promotion manifests, generated outputs, integrity audit, Registry v3 baseline, and roadmap.
7. After the 80-record promotion merge, execute one manual publication-checkpoint deployment and full production parity.
8. Do not begin 80 → 85 work until the 80-record parity gate passes.
```

## Batch M promotion requirements

Every promoted candidate must include the applicable:

- canonical stable-asset record
- organization and relationship
- classification and lifecycle
- reserve and redemption profile
- event and Event v2 detail
- reviewed evidence
- explicit known unknowns
- deployment identity
- legal profile
- reserve components
- income profile
- candidate promotion record

Candidate-specific constraints:

```text
GYD:
- preserve sGYD separation
- represent Gyro Proto only through explicit lineage
- use 2023-12-07 as the reviewed launch date

fxUSD:
- do not merge fxSAVE or position products
- represent V1/V2 and base-income uncertainty explicitly

HONEY:
- exclude testnet as a production deployment
- keep receipts and bridges separate
- separate custody from token identity

MAI:
- preserve miMATIC continuity as a rebrand, not a second asset
- normalize chain-specific contracts and current lifecycle

Stables Labs USDX:
- use disambiguated identity `sog_st_stablesusdx`
- do not merge unrelated USDX assets
- keep sUSDX separate
- preserve approved-party redemption limits
```

## Manual publication result

The repository uses the intended free-plan publication architecture:

```text
latest main
→ manual GitHub Actions dispatch
→ npm run build
→ prebuilt dist upload with Wrangler
→ deployed commit verification
→ production consistency verification
```

The first controlled manual deployment completed successfully in workflow run `27908380603`.

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

Normal pull requests and normal `main` merges do not publish to Cloudflare.

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
PR #90 — Finalize manual Cloudflare publication controls
PR #91 — Prepare Batch 13 candidate intake
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
Phase 6D-1 — Batch 13 candidate intake: complete
Phase 6D-2 — Batch 13 boundary review: active in PR #92
Phase 6D-3 — Batch M canonical promotion to 80: next after PR #92
Phase 6D-4 — 80-record manual publication and parity: blocked pending promotion
```

## Explicit unresolved queues

### Launch dates

```text
34 unresolved canonical records
```

Source: `data/quality/launch-date-unresolved.json`

Unsupported day-level precision remains forbidden.

### Terminal dates

```text
6 unresolved canonical records
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

## Controlled-growth rules

Default batch size is five canonical assets.

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
