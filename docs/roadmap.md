# Stable or Gone Roadmap

Updated: 2026-06-24

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

Latest merged checkpoint before this change:

```text
PR #110 — Record Category C lineage checkpoint
Merge: a51e705a17dbd77f3075a52f2e65ebd496b1e463
```

Current quality change:

```text
PR #112 — Resolve SPOT launch and protocol versions
Canonical launch: 2022-12-08
v2 proposal: 2024-04-09
v2 signal passed: 2024-04-19
v2 production activation: unresolved
v5 on-chain execution: 2025-07-21
Next bounded record after merge: fxUSD
```

Recent lineage and incident work:

```text
PR #104 — Record sUSD severe depeg and SIP-423 proposal
PR #105 — Document EURA launch and rebrand
PR #107 — Resolve lisUSD and HAY lineage
PR #108 — Resolve sUSD launch lineage
PR #109 — Resolve Nuon v1 and v2 lineage
PR #110 — Record Category C lineage checkpoint
PR #112 — Resolve SPOT launch and protocol versions
```

Current blocker:

```text
81-record GitHub canonical baseline: complete
81-record production publication: pending
81-record production parity: pending
Cloudflare access: unavailable
Controlled record growth: paused until production parity can be restored
GitHub-only quality work: active
```

Latest verified production checkpoint:

```text
75-record production parity: PASS
Verification workflow run: 27905696588
Audit: docs/audits/registry-75-production-parity.md
```

## Current canonical registry after SPOT change

```text
81 stable assets
70 organizations
83 stablecoin-organization relationships
81 classifications
81 reserve/redemption profiles
122 events
122 Event v2 detail records
372 evidence records
89 reserve-report or reserve-context records
197 known unknowns
9 regulatory notes
115 deployments
81 legal profiles
4 stable-asset relationships
113 reserve components
81 income profiles
```

Machine-readable source of truth:

```text
docs/migration/registry-v3-baseline.json
```

## Current quality baseline

```text
Candidate promotions:                    81 / 81 controlled
Pending candidates:                       0
Critical findings:                        0
Warnings:                                 0
Stale verification records:               0
Required-layer coverage:              81 / 81
Event coverage:                        81 / 81
Deployment coverage:                   81 / 81
Reserve-report context coverage:       69 / 81 informational
Missing canonical launch dates:            27
Historical records missing terminal date:   4
Reserve applicability queue:                12
  not applicable by design:                 10
  source status unresolved:                  2
  expected but missing:                      0
All-unknown income profiles:                 0
```

## Queue state

### Launch-date queue

```text
Total unresolved: 27
Category B:         3
Category C:        21
Category D:         3
```

Remaining Category B records:

```text
BRZ
Berachain HONEY
Anzen USDz
```

Completed bounded lineage records:

```text
EURA   — agEUR launch separated from EURA rebrand
lisUSD — HAY launch separated from lisUSD rebrand
sUSD   — eUSD predecessor separated from nUSD launch and sUSD rebrand
Nuon   — Arbitrum v1 launch separated from Base v2 relaunch
SPOT   — original launch separated from v2 proposal and v5 execution
fxUSD  — public availability separated from announcement, seeding, and same-proxy V2 upgrade
```

Policy:

- require day-level primary evidence
- do not coerce month or year into a canonical date
- do not use exchange listings as the default launch boundary
- do not substitute a rebrand or later protocol version for the original launch
- preserve predecessor, legacy deployment, and unresolved migration boundaries explicitly
- keep `launch_date: null` when the exact public boundary remains unresolved

### Terminal-date queue

```text
Total unresolved: 4
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

GYEN remains in an active wind-down and is not assigned a final terminal date while the initial redemption period remains open through 2026-11-11.

### Reserve-report applicability queue

```text
Total uncovered:              12
Not applicable by design:     10
Source status unresolved:      2
Expected but missing:          0
```

Remaining source-status unresolved records:

```text
HUSD — original signed historical attestation not recovered
EURT — product-specific reserve scope not recovered from consolidated Tether reporting
```

## Immediate next work

```text
1. Do not deploy or change Cloudflare while access is unavailable.
2. Merge PR #112 only after all six normal pull-request workflows pass on the final user-authored head.
3. Audit MAI as the next bounded Category C rebrand and deployment-boundary record.
4. Separate miMATIC launch, MAI rename, current multi-chain deployments, and any canonical or bridged contract boundaries.
5. Assign no MAI launch or rebrand date without day-level first-party evidence.
6. Keep launch queue, generated outputs, integrity audit, Registry v3 baseline, README, and roadmap synchronized in every quality PR.
7. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.
```

## Production policy

Normal pull requests and normal `main` merges complete through GitHub CI and do not publish to Cloudflare.

The production path remains:

```text
latest main
→ manual GitHub Actions dispatch
→ npm run build
→ prebuilt dist upload with Wrangler
→ deployed commit verification
→ production consistency verification
```

At each publication checkpoint verify:

- deployed commit
- public counts
- machine-readable files
- canonical routes
- sitemap
- metadata and structured data
- stale count markers
- production consistency

## Manual publication configuration

```text
Pages project: stable-or-gone
Production branch: main
Automatic production deployment: disabled
Preview branch deployments: disabled
Publication path: manual GitHub Actions workflow only
Deployment workflow run: 27908380603
Manual production publication activation — PASS
```

Normal pull requests and normal merges must not invoke the production deployment workflow. Manual publication remains operational but is not executed while Cloudflare access is unavailable.

## Growth policy

Controlled record growth remains paused while the public site is behind the canonical GitHub baseline.

No further routine growth batch begins until a manual publication and parity audit can be completed from the latest merged `main`.

Quality corrections, evidence improvements, date resolution, queue maintenance, schema validation, and generated-output synchronization may continue without Cloudflare access.
