# Stable or Gone Roadmap

Updated: 2026-06-26

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged PR: #162 — Add Batch 17 candidate research
Latest merged commit: eaf2daecdbe799a5ac5deaa7ea915bc295425d7d
Canonical stable assets: 87
Candidate total: 92
Promoted candidates: 87
Pending accepted candidates: 5
Current work: Batch 17 full-layer draft
Next operation after merge: open the bounded Batch 17 canonical promotion PR
Publication requirement: manual publication and production-parity verification after canonical promotion
```

## Batch 17 full-layer checkpoint

```text
Accepted candidates: 5
Full-layer drafts: 5
Canonical promotions in draft PR: 0
Canonical stable assets: 87
Target after canonical promotion: 92
```

Drafted candidates:

```text
USA₮ / USAT
EURAU
Noble Dollar / USDN
USDH
AE Coin / AEC
```

The non-canonical draft covers identity, organizations, classifications, reserve and redemption context, events, evidence, deployments, legal profiles, reserve components, income profiles, and five explicit known unknowns for every candidate.

Important boundaries:

- USA₮ is separate from USD₮ / USDT; Anchorage Digital Bank, N.A. remains the legal issuer.
- EURAU is issued by AllUnity; shareholders, reserve banks, custodians, market makers, and distributors remain separate roles.
- Noble Dollar is separate from Neutrino USD and uses `sog_st_nobleusdn` / `noble-usdn`.
- USDH remains proposed as limited / winding down while migration and final support boundaries remain under review.
- AE Coin separates AED Stablecoin LLC's B2B issuer role from appointed agent roles.
- Unsupported launch dates for USDH and AE Coin remain null.

Draft files:

```text
data/batch-17-full-layer-draft.json
docs/growth/batch-17-full-layer-draft.md
scripts/validate-batch17-full-layer-draft.mjs
```

## Batch 16 completion checkpoint

PR #160 promoted:

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

These queues remain explicit research backlogs and do not block bounded growth.

## Controlled growth sequence

```text
Phase 1 — Candidate research
1. Select no more than five candidates.
2. Verify identity, issuer, backing, redemption, income, deployment, and lifecycle boundaries.
3. Preserve unsupported dates as null.
4. Change no canonical registry data.

Phase 2 — Full-layer draft
5. Draft all required Registry v2/v3 layers.
6. Add no placeholder reserve-report rows.
7. Keep private monitoring and unreviewed candidates out of public files.
8. Preserve every blocking unknown explicitly.

Phase 3 — Canonical promotion
9. Split reviewed drafts into production files.
10. Promote all five only after the complete draft passes review.
11. Run all six workflows and merge only after every check passes.

Phase 4 — Publication checkpoint
12. Manually publish latest main through the approved GitHub Actions workflow.
13. Verify deployed commit, public counts, canonical routes, machine-readable files, sitemap, and consistency.
14. Record production parity before beginning the following canonical growth promotion.

Phase 5 — Normal operating cycle
15. Alternate one growth batch with two or three existing-record quality audits.
16. Insert urgent incident, depeg, regulatory, wind-down, or redemption changes ahead of the routine queue.
17. Never allow production to trail main by more than one growth batch.
```

## Immediate next work

```text
1. Complete CI and merge the Batch 17 full-layer draft PR.
2. Split the draft into canonical production-layer files.
3. Add candidate promotion controls and Batch 17 promotion validation.
4. Update Registry v2/v3 baselines, loaders, generated stats, and integrity outputs.
5. Merge only after all six workflows pass.
6. Manually publish and verify production parity.
7. Resume existing-record quality audits before selecting Batch 18.
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
```

## Growth policy

- unresolved quality queues remain explicit but do not block bounded growth
- promote no more than five complete records per growth batch
- research, full-layer drafting, and canonical promotion remain separate review boundaries
- run full CI for every batch
- publish and verify after every canonical growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates and internal monitoring out of public files
