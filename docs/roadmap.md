# Stable or Gone Roadmap

Updated: 2026-06-25

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #145 — Audit mStable USD launch history
Latest merged commit: e750081fc183aa2c44932f5e077c36f52d9257bd
Current work: mUSD canonical quality implementation
Canonical conclusion: launch_date remains null
Implementation result: deployment-readiness, candidate mainnet availability, and production-security boundaries normalized
Next bounded review after merge: USK
```

## mUSD audit checkpoint

```text
2020-05-28 — Ethereum mUSD contract source verified
2020-05-29 — contemporaneous mainnet-live record; original outbound statement not recovered
2020-06-01 — secondary confirmation that the first protocol version was on mainnet
2020-06-05 — official production-security program covers MINT, SWAP, REDEEM, and SAVE
July 2020   — Save / imUSD is a later product boundary
```

Decision:

```text
mUSD launch_date remains null.
2020-05-29 is the strongest recovered candidate.
The primary-source threshold for a canonical day-level date is not met.
```

Audit:

```text
docs/audits/musd-launch-boundary-review.md
```

Canonical implementation result:

- official Ethereum mUSD address preserved
- 2020-05-28 deployment-readiness boundary recorded
- 2020-05-29 candidate mainnet-availability event added at medium confidence
- 2020-06-05 production-security boundary added
- Save and imUSD remain separate from the base mUSD launch
- launch-specific known unknown added
- mUSD remains in the unresolved queue

## Completed quality checkpoints

```text
DOLA — public launch 2021-02-25; implementation PR #140
USD1 — launch null; deployment/introduction/testing normalized; PR #142
MIM — launch null; introduction/deployment/liquidity/live-operation normalized; PR #144
```

## Production checkpoint

```text
Result: PASS
Canonical records in production: 82
Production commit: 835a00d5cd2db48c0a0ede3394cf265dec919813
Verification workflow run: 27908380603
Successful verification job: 83360065881
```

Quality-only work after the checkpoint does not trigger automatic production publication.

## Current canonical registry

```text
82 stable assets
73 organizations
86 stablecoin-organization relationships
82 classifications
82 reserve/redemption profiles
134 events
134 Event v2 detail records
401 evidence records
401 evidence relation projections
90 reserve-report or reserve-context records
202 known unknowns
9 regulatory notes
116 deployments
82 legal profiles
4 stable-asset relationships
115 reserve components
82 income profiles
```

Machine-readable source of truth:

```text
docs/migration/registry-v3-baseline.json
```

## Current quality baseline

```text
Candidate promotions:                    82 / 82 controlled
Pending candidates:                       0
Critical findings:                        0
Blocking warnings:                        0
Integrity audit warnings:                  3 non-blocking source-count mismatches
Stale verification records:               0
Required-layer coverage:              82 / 82
Event coverage:                        82 / 82
Deployment coverage:                   82 / 82
Reserve-report context coverage:       70 / 82 informational
Missing canonical launch dates:            22
Historical records missing terminal date:   4
Reserve applicability queue:                12
  not applicable by design:                 10
  source status unresolved:                  2
  expected but missing:                      0
```

## Queue state

### Launch-date queue

```text
Total unresolved: 22
Category B:         3
Category C:        16
Category D:         3
```

mUSD remains in Category C. Contract verification and later confirmed operation do not establish a primary-source public-launch day.

Remaining Category B records:

```text
BRZ
Berachain HONEY
Anzen USDz
```

Next bounded review:

```text
USK
```

Following quality wave:

```text
VAI
VCHF
IRON
```

### Terminal-date queue

```text
Total unresolved: 4
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

### Reserve-report applicability queue

```text
Total uncovered:              12
Not applicable by design:     10
Source status unresolved:      2
Expected but missing:          0
```

Source-status unresolved:

```text
HUSD
EURT
```

## Full execution sequence

```text
Phase 1 — mUSD bounded review
1. Complete final CI and merge the mUSD implementation PR.
2. Preserve launch_date as null and retain the 2020-05-29 candidate as non-canonical.
3. Confirm that all temporary synchronization code is removed.

Phase 3 — Continue launch-date quality wave
9. Audit USK.
10. Audit VAI.
11. Audit VCHF.
12. Audit IRON.

Phase 4 — Cross-queue maintenance
13. Recheck HUSD and EURT only when durable product-specific evidence appears.
14. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching evidence exists.

Phase 5 — Controlled growth
15. Promote no more than five complete records per batch.
16. Publish and verify after each growth batch.
17. Do not allow production to trail main by more than one growth batch.
```

## Immediate next work

```text
1. Complete final CI and merge the mUSD implementation PR.
2. Report that launch_date remains null and queue counts remain 22 / C16.
3. Start the bounded USK launch-boundary audit.
4. Separate deployment, first issuance, interface availability, chain state, and successor-network boundaries.
5. Do not mark USK migrated or terminated without authoritative evidence.
```

## Production policy

Normal pull requests and normal `main` merges complete through GitHub CI and do not publish to Cloudflare.

```text
Automatic production deployment: disabled
Preview branch deployments: disabled
Publication path: manual GitHub Actions workflow only
Manual production publication activation — PASS
Deployment workflow run: 27908380603
Pages project: stable-or-gone
Production branch: main
Latest successful job: 83360065881
```

The production path remains:

```text
latest main
→ approved manual GitHub Actions job
→ latest main checkout
→ npm run build
→ prebuilt dist upload with Wrangler
→ deployed commit verification
→ production consistency verification
```

## Growth policy

- finish the first bounded quality wave
- promote no more than five complete records per growth batch
- run full CI for every batch
- publish and verify after every growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates, internal monitoring, and private notes out of public files
