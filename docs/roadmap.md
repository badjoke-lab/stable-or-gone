# Stable or Gone Roadmap

Updated: 2026-06-26

## Purpose

This is the canonical execution and recovery schedule for SOG. Every roadmap-changing PR must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged prerequisite PR: #163 — Add Batch 17 full-layer drafts
Latest merged prerequisite commit: a5ad0174263b29d26d6df0237ea41f80620dc654
Current promotion PR: #164 — Promote Batch 17 stable assets
Canonical stable assets after merge: 92
Candidate total: 92
Promoted candidates after merge: 92
Pending accepted candidates after merge: 0
Current work: Batch 17 canonical promotion validation and merge
Next operation after merge: manual production publication and production-parity verification
```

## Batch 17 canonical promotion checkpoint

Promoted assets:

```text
USA₮ / USAT
EURAU
Noble Dollar / USDN
USDH
AE Coin / AEC
```

Canonical boundaries:

- USA₮ is separate from USD₮ / USDT; Anchorage Digital Bank, N.A. is the legal issuer.
- EURAU is issued by AllUnity; shareholders, reserve banks, custodians, market makers, and distributors remain separate roles.
- Noble Dollar is separate from Neutrino USD and uses `sog_st_nobleusdn` / `noble-usdn`.
- USDH remains `limited` with Registry v2 lifecycle `restricted` while migration and final support boundaries remain unresolved.
- AE Coin separates AED Stablecoin LLC's B2B issuer role from appointed custody, transfer, conversion, and end-customer agents.
- Unsupported launch dates for USDH and AE Coin remain null.
- Base Noble Dollar income is separated from vault boosts, points programs, and integrator incentives.
- USDH reserve income allocated to ecosystem programs is not treated as intrinsic holder yield.

Promotion files include complete Registry v2/v3 coverage for identities, organizations, relationships, classifications, reserve/redemption profiles, events, evidence, reserve context, known unknowns, deployments, legal profiles, reserve components, and income profiles.

## Current canonical registry after Batch 17

```text
92 stable assets
86 organizations
101 stablecoin-organization relationships
92 classifications
92 reserve/redemption profiles
150 events
150 Event v2 detail records
455 evidence records
455 evidence relation projections
100 reserve-report or reserve-context records
253 known unknowns
9 regulatory notes
130 deployments
92 legal profiles
4 stable-asset relationships
125 reserve components
92 income profiles
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
Required-layer coverage:               92 / 92
Event coverage:                         92 / 92
Deployment coverage:                    92 / 92
Missing canonical launch dates:             20
Historical records missing terminal date:    4
Reserve applicability queue:                 12
  not applicable by design:                  10
  source status unresolved:                   2
  report expected but missing:                0
```

## Remaining quality queues

### Launch dates

```text
Total unresolved: 20
Category B:         3
Category C:        13
Category D:         4
```

Category B:

```text
BRZ
Berachain HONEY
Anzen USDz
```

New Batch 17 unresolved launch boundaries:

```text
USDH — Category C, launch-boundary conflict
AE Coin — Category D, primary launch source not recovered
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

USDH migration remains an explicit lifecycle unknown but is not added to the terminal-date queue because its canonical legacy status is `limited`, not terminal.

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
1. Complete final CI for PR #164 and merge the Batch 17 canonical promotion.
2. Manually publish latest main through the approved GitHub Actions workflow.
3. Verify the production commit and 92-record public registry.
4. Verify all five new canonical routes and their evidence/profile sections.
5. Verify version.json, manifest.json, llms.txt, ai.txt, sitemap, and public consistency.
6. Record production parity in the roadmap or deployment checkpoint.
7. Resume two or three existing-record quality audits before selecting Batch 18.
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
- run all six workflows for every canonical promotion
- publish and verify after every canonical growth batch
- alternate growth with existing-record quality work
- keep unreviewed candidates and internal monitoring out of public files
