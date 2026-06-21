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
PR #93 — Promote Batch M stable assets
Merge: cd745f315d2b0f935fc2288c2e118f6905e087b6
```

Current blocker:

```text
80-record GitHub canonical baseline: complete
80-record production publication: pending
80-record production parity: pending
Cloudflare access: unavailable
80 → 85 controlled growth: blocked until parity passes
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
80 stable assets
69 organizations
82 stablecoin-organization relationships
80 classifications
80 reserve/redemption profiles
107 events
107 Event v2 detail records
327 evidence records
87 reserve-report or reserve-context records
188 known unknowns
9 regulatory notes
111 deployments
80 legal profiles
4 stable-asset relationships
112 reserve components
80 income profiles
```

## Candidate controls

```text
Total controlled candidates: 80
Promoted candidates:         80
Pending candidates:           0
Canonical assets:             80
Batch M promotions:            5
```

Batch M promotions:

```text
sog_cand_000076 — Gyroscope GYD
sog_cand_000077 — f(x) Protocol fxUSD
sog_cand_000078 — Berachain HONEY
sog_cand_000079 — QiDAO MAI
sog_cand_000080 — Stables Labs USDX
```

Sources and audits:

```text
data/candidate-stable-assets-growth-80.json
data/candidate-research-batch-13.json
data/candidate-promotions-batch-m.json
docs/audits/batch-13-candidate-intake.md
docs/audits/batch-13-promotion-boundary-review.md
docs/audits/batch-m-promotion.md
docs/audits/registry-80-quality-baseline.md
scripts/validate-batch13-research.mjs
```

## Batch M result

```text
GYD:
- base GYD promoted
- sGYD remains separate
- reviewed Ethereum launch date: 2023-12-07
- Polygon Gyro Proto remains historical lineage
- unresolved reserve, contract, and governance details remain explicit

fxUSD:
- base fxUSD promoted
- fxSAVE, position products, pool shares, and CreditNotes remain separate
- V1/V2 continuity remains explicit
- base-token income uncertainty is preserved through the wrapper boundary

HONEY:
- native Berachain HONEY promoted
- receipts, liquidity positions, bridged forms, and testnet assets remain separate
- Basket Mode, collateral-vault, custody, and fee boundaries are recorded
- exact launch day remains unresolved

MAI:
- official miMATIC-to-MAI identity continuity retained as one asset
- chain-specific deployment canonicality remains explicit
- launch, rebrand, current peg, and incident chronology remain known unknowns

Stables Labs USDX:
- disambiguated Stables Labs identity promoted as sog_st_stablesusdx
- unrelated USDX assets remain separate
- sUSDX remains separate
- approved-party direct redemption limits and seven-day route are preserved
```

Only GYD has a reviewed day-level launch date. No other launch date, legal issuer, contract, reserve percentage, redemption right, or lifecycle conclusion is inferred beyond reviewed sources.

## Current quality baseline

```text
Candidate promotions:                    80 / 80 controlled
Pending candidates:                       0
Critical findings:                        0
Warnings:                                 0
Stale verification records:               0
Required-layer coverage:              80 / 80
Event coverage:                        80 / 80
Deployment coverage:                   80 / 80
Reserve-report context coverage:       67 / 80 informational
Missing canonical launch dates:            38
Historical records missing terminal date:   6
Reserve applicability queue:                13
All-unknown income profiles:                 0
```

Machine-readable baseline:

```text
docs/migration/registry-v3-baseline.json
scripts/validate-registry-v3-baseline.mjs
```

The reviewed GitHub baseline is 80 after PR #93. Production remains at the previous published checkpoint until a separate manual publication action is completed.

## Immediate next work

```text
1. Do not deploy or change Cloudflare while access is unavailable.
2. Continue GitHub-only quality work against the 80-record baseline.
3. Prioritize the 38-record launch-date queue, 6-record terminal-date queue, and 13-record reserve applicability queue.
4. Keep generated outputs, integrity audit, Registry v3 baseline, and roadmap synchronized in every quality PR.
5. When Cloudflare access is available again, run one manual 80-record publication checkpoint from the merged main branch.
6. Verify deployed commit, public counts, machine-readable files, canonical routes, sitemap, metadata, structured data, and production consistency.
7. Record the 80-record parity result in a separate audit PR.
8. Do not begin 80 → 85 controlled growth until the 80-record production-parity gate passes.
```

## Batch M promotion requirements

Every promoted candidate includes the applicable:

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

Candidate-specific constraints remain active:

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
- keep chain-specific canonicality and lifecycle uncertainty explicit

Stables Labs USDX:
- use disambiguated identity sog_st_stablesusdx
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
| 80 | pending — manual publication and production parity after Cloudflare access recovery |
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
PR #92 — Review Batch 13 promotion boundaries
PR #93 — Promote Batch M stable assets
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
Phase 6D-2 — Batch 13 boundary review: complete
Phase 6D-3 — Batch M canonical promotion to 80: complete
Phase 6D-4 — 80-record manual publication and parity: blocked pending Cloudflare access
```

## Explicit unresolved queues

### Launch dates

```text
38 unresolved canonical records
```

Source: `data/quality/launch-date-unresolved.json`

Unsupported day-level precision remains forbidden.

Batch M additions to the queue:

```text
fxUSD — unresolved day-level launch boundary
HONEY — 2025 known, exact day unresolved
MAI — original launch and rebrand dates unresolved
Stables Labs USDX — unresolved day-level launch boundary
```

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
Reserve-context rows:                87
Context coverage:                 67/80 informational
Expected but missing:                0
Not applicable by design:           10
Reviewed source-status unresolved:   3
Placeholder reserve rows:            0
```

The reviewed unresolved records remain FEI, HUSD, and EURT.

## Controlled-growth rules

Default batch size is five canonical assets.

Every promoted asset must include the applicable required layers and reviewed evidence. Unknown values remain explicit and must not be replaced with inferred dates, legal entities, contracts, percentages, or redemption rights.

Do not promote simple wrappers, bridged copies, LP tokens, vault shares, test tokens, duplicate deployments, or announcement-only projects as separate canonical assets by default.

Any intentional count or queue change must update canonical data, generated outputs, integrity audit, Registry v3 baseline, and roadmap in one reviewed PR.

## Publication cadence

```text
Normal PR or normal main merge: no deployment
Several quality PRs: bundle into one later deployment
Count-growth checkpoint: one manual deployment when access is available
Verified emergency: one immediate manual deployment
```

Manual production publication activation — PASS
Deployment workflow run: 27908380603

Do not create no-op commits or repeated short-interval deployments merely to trigger Cloudflare.
