# Stable or Gone Roadmap

Updated: 2026-06-26

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #160 — Promote Batch 16 stable assets
Latest merged commit: b176bc1b57ca17578cbc7e4ef4ec757e065a1d68
Canonical stable assets: 87
Candidate total: 92
Promoted candidates: 87
Pending accepted candidates: 5
Current work: Batch 17 candidate research
Next operation after merge: build a reviewed full-layer Batch 17 draft
Publication requirement: manual publication and production-parity verification after canonical promotion
```

## Batch 17 candidate checkpoint

```text
Accepted candidates: 5
Canonical promotions in research PR: 0
Canonical stable assets: 87
Target batch: batch_017
```

Selected candidates:

```text
USA₮ / USAT
EURAU
Noble Dollar / USDN
USDH
AE Coin / AEC
```

Identity and lifecycle boundaries:

- USA₮ is separate from USD₮ / USDT; Anchorage Digital Bank, N.A. is the legal issuer.
- EURAU is issued by AllUnity; shareholders, reserve banks, custodians, market makers, and distributors remain separate roles.
- Noble Dollar is separate from Neutrino USD and therefore uses `sog_st_nobleusdn` and `noble-usdn`.
- USDH is proposed as `limited` while migration, treasury-deployer transition, and final support boundaries remain under review.
- AE Coin separates AED Stablecoin LLC's B2B issuer role from appointed custody, transfer, conversion, and end-customer agents.
- Unsupported launch dates for USDH and AE Coin remain null.

Research files:

```text
data/candidate-stable-assets-growth-90.json
data/candidate-research-batch-17.json
docs/growth/batch-17-research-checkpoint.md
scripts/validate-batch17-research.mjs
```

## Batch 16 completion checkpoint

PR #160 promoted the following five assets with complete Registry v2/v3 layers:

```text
United Stables U
USDGO
SoFiUSD / SOFID
Solstice USX
Origin Dollar / OUSD
```

Final Batch 16 state:

```text
Canonical stable assets: 87
Candidate total: 87
Promoted candidates: 87
Pending candidates: 0
All six GitHub workflows: PASS
Cloudflare publication: not performed by the canonical promotion PR
```

Key Batch 16 identity boundaries remain fixed:

- Anchorage Digital Bank is the USDGO legal issuer; OSL branding and distribution are separate.
- SoFiUSD and SOFID are one stablecoin identity; tokenized deposits remain separate products.
- Solstice USX is separate from dForce USX, eUSX, and YieldVault positions.
- Base OUSD is separate from wrapped OUSD and other Origin products.
- Base United Stables U is separate from rewards, staking, and wrapped representations.

## Current canonical registry

```text
87 stable assets
79 organizations
92 stablecoin-organization relationships
87 classifications
87 reserve/redemption profiles
145 events
145 Event v2 detail records
434 evidence records
434 evidence relation projections
95 reserve-report or reserve-context records
228 known unknowns
9 regulatory notes
124 deployments
87 legal profiles
4 stable-asset relationships
120 reserve components
87 income profiles
```

Machine-readable source of truth:

```text
docs/migration/registry-v3-baseline.json
```

## Current quality baseline

```text
Critical findings:                         0
Blocking warnings:                         0
Integrity audit warnings:                  4 non-blocking source-count mismatches
Required-layer coverage:               87 / 87
Event coverage:                         87 / 87
Deployment coverage:                    87 / 87
Missing canonical launch dates:             18
Historical records missing terminal date:    4
Reserve applicability queue:                 12
  not applicable by design:                  10
  source status unresolved:                   2
  report expected but missing:                0
```

## Remaining quality queues

### Launch dates

```text
Total unresolved: 18
Category B:         3
Category C:        12
Category D:         3
```

Category B:

```text
BRZ
Berachain HONEY
Anzen USDz
```

### Reserve sources

```text
HUSD
EURT
```

### Terminal dates

```text
Basis Cash
Dynamic Set Dollar
Empty Set Dollar
GYEN
```

These queues remain explicit research backlogs. They do not block bounded record growth.

## Controlled growth sequence

```text
Phase 1 — Candidate research
1. Select no more than five candidates.
2. Verify identity, issuer, backing, redemption, income, deployment, and lifecycle boundaries.
3. Preserve unsupported dates as null.
4. Record blocking unknowns and primary source leads.
5. Change no canonical registry data.

Phase 2 — Full-layer draft
6. Draft stable-asset, organization, relationship, classification, reserve/redemption, event, evidence, deployment, legal, reserve-component, and income layers.
7. Add no placeholder reserve-report rows.
8. Keep private monitoring and unreviewed candidates out of public files.

Phase 3 — Canonical promotion
9. Promote all five only after the complete draft passes review.
10. Run all six workflows and merge only after every check passes.

Phase 4 — Publication checkpoint
11. Manually publish latest main through the approved GitHub Actions workflow.
12. Verify deployed commit, public counts, canonical routes, machine-readable files, sitemap, and consistency.
13. Record production parity before beginning the following canonical growth promotion.

Phase 5 — Normal operating cycle
14. Alternate one growth batch with two or three existing-record quality audits.
15. Insert urgent incident, depeg, regulatory, wind-down, or redemption changes ahead of the routine queue.
16. Never allow production to trail main by more than one growth batch.
```

## Immediate next work

```text
1. Complete CI and merge the Batch 17 candidate-research PR.
2. Build the complete non-canonical full-layer draft for all five accepted candidates.
3. Resolve issuer, reserve, redemption, deployment, income, and lifecycle boundaries.
4. Promote Batch 17 in one bounded five-record canonical PR.
5. Manually publish and verify production parity after canonical merge.
6. Resume existing-record quality audits before selecting Batch 18.
```

## Production policy

Normal pull requests and normal `main` merges complete through GitHub CI and do not publish to Cloudflare.

```text
Automatic production deployment: disabled
Preview branch deployments: disabled
Publication path: manual GitHub Actions workflow only
Pages project: stable-or-gone
Production branch: main
```

## Growth policy

- unresolved quality queues remain explicit but do not block bounded growth
- promote no more than five complete records per growth batch
- research, full-layer drafting, and canonical promotion remain separate review boundaries
- run full CI for every batch
- publish and verify after every canonical growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates and internal monitoring out of public files
