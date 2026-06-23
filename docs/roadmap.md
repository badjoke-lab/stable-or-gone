# Stable or Gone Roadmap

Updated: 2026-06-23

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
PR #100 — Resolve FEI reserve context
Merge: 39131d5c6dfdeecbf9a6e3359b21df6237fa7bd0
```

Recent merged quality work:

```text
PR #97 — Add MainStreet msUSD impaired incident
PR #98 — Resolve four Category B launch dates
PR #99 — Resolve Mountain USDM and USDN terminal dates
PR #100 — Resolve FEI reserve context
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

## Current canonical registry

```text
81 stable assets
70 organizations
83 stablecoin-organization relationships
81 classifications
81 reserve/redemption profiles
111 events
111 Event v2 detail records
339 evidence records
89 reserve-report or reserve-context records
195 known unknowns
9 regulatory notes
112 deployments
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
Missing canonical launch dates:            34
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
Total unresolved: 34
Category B:         4
Category C:        27
Category D:         3
```

Remaining Category B records:

```text
BRZ
Berachain HONEY
Anzen USDA
Anzen USDz
```

Policy:

- require day-level primary evidence
- do not coerce month or year into a canonical date
- do not use exchange listings as the default launch boundary
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

The ten `not_applicable_by_design` records are reviewed and retained with evidence-backed protocol-specific reasons.

Remaining source-status unresolved records:

```text
HUSD — original signed historical attestation not recovered
EURT — product-specific reserve scope not recovered from consolidated Tether reporting
```

FEI left the unresolved queue in PR #100 after recovery of the executed TIP-121c historical redemption and DAI-backing package. Current redemption availability, universal holder completion, and completion of every residual PCV distribution remain separate known unknowns.

## Immediate next work

```text
1. Do not deploy or change Cloudflare while access is unavailable.
2. Continue GitHub-only quality work against the 81-record baseline.
3. Re-audit the four remaining Category B launch-date records: BRZ, HONEY, USDA, and USDz.
4. Resolve only records supported by day-level primary evidence; retain the rest without forced dates.
5. Keep launch-date queue, generated outputs, integrity audit, Registry v2/v3 baselines, README checkpoint, and roadmap synchronized in every quality PR.
6. After Category B, decide whether to audit high-value Category C boundary conflicts or freeze the queue for a later source-led pass.
7. When Cloudflare access returns, publish the latest merged main checkpoint manually and verify production parity before controlled record growth resumes.
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

## Growth policy

Controlled record growth remains paused while the public site is behind the canonical GitHub baseline.

The emergency addition of MainStreet msUSD created the 81-record checkpoint after the earlier 80-record publication gate was already pending. No further routine growth batch begins until a manual publication and parity audit can be completed from the latest merged `main`.

Quality corrections, evidence improvements, date resolution, queue maintenance, schema validation, and generated-output synchronization may continue without Cloudflare access.

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
PR #95 — Recover Falcon USDf launch date
PR #96 — Record PR #95 merge checkpoint
PR #97 — Add MainStreet msUSD impaired incident
PR #98 — Resolve four Category B launch dates
PR #99 — Resolve Mountain USDM and USDN terminal dates
PR #100 — Resolve FEI reserve context
75-record production parity — PASS
Manual production publication activation — PASS
```
