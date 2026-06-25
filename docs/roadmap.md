# Stable or Gone Roadmap

Updated: 2026-06-26

## Purpose

This is the canonical execution and recovery schedule for SOG. Roadmap-changing pull requests must update this file.

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Latest merged growth PR: #164 — Promote Batch 17 stable assets
Growth merge commit: be058152fe6f9c8b18357a36015a6b49c249624b
Latest merged quality PR: #165 — Align event source counts
Quality merge commit: db625e2f2b2268e3b5c2d8afadbe0f67452f7c63
Canonical stable assets: 92
Candidate total: 92
Promoted candidates: 92
Pending candidates: 0
Integrity audit: 0 critical findings / 0 warnings
Current phase: post-Batch 17 publication and quality work
```

## Batch 17 records

```text
USA₮ / USAT
EURAU
Noble Dollar / USDN
USDH
AE Coin / AEC
```

Fixed identity and lifecycle boundaries:

- USA₮ is separate from USD₮ / USDT; Anchorage Digital Bank is the legal issuer.
- EURAU is issued by AllUnity; shareholder, reserve-bank, custodian, liquidity, and distribution roles remain separate.
- Noble Dollar is separate from Neutrino USD, M0 M, vault positions, points programs, and bridged representations.
- USDH remains `limited` with Registry v2 lifecycle `restricted` while migration and final-support boundaries remain unresolved.
- AE Coin separates AED Stablecoin LLC's B2B issuer role from appointed customer-facing agents.
- Unsupported launch dates for USDH and AE Coin remain null.

## Canonical registry

```text
Stable assets:               92
Organizations:               86
Relationships:              101
Classifications:             92
Reserve/redemption profiles: 92
Events:                     150
Event v2 details:           150
Evidence:                   455
Evidence relations:         455
Reserve reports/context:    100
Known unknowns:             253
Regulatory notes:             9
Deployments:                130
Legal profiles:              92
Stable-asset relationships:   4
Reserve components:         125
Income profiles:             92
```

Source of truth:

```text
docs/migration/registry-v3-baseline.json
```

## Quality baseline

```text
Critical findings:                         0
Blocking warnings:                         0
Integrity audit warnings:                  0
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

PR #165 resolved the previous four source-count mismatches:

```text
sUSD predecessor lifecycle: 3 → 6
DOLA launch:                2 → 3
lisUSD rebrand:             5 → 6
fxUSD launch:               7 → 8
```

## Remaining research queues

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

Batch 17 additions:

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

USDH migration remains an explicit lifecycle unknown but is not in the terminal-date queue because its canonical status is `limited`, not terminal.

## Required operating sequence

```text
1. Candidate research
2. Non-canonical full-layer draft
3. Bounded canonical promotion
4. Six-workflow validation
5. Manual production publication
6. Production-parity verification
7. Two or three existing-record quality audits
8. Next growth batch selection
```

Rules:

- no more than five complete records per routine growth batch
- unsupported dates remain null
- private monitoring and unreviewed candidates stay out of public files
- normal pull requests and main merges do not deploy automatically
- production publication uses the approved manual GitHub Actions workflow
- production must not trail main by more than one growth batch
- urgent incident, depeg, regulatory, wind-down, or redemption updates may interrupt the routine queue

## Immediate next work

```text
1. Manually publish latest main.
2. Verify production commit db625e2f2b2268e3b5c2d8afadbe0f67452f7c63.
3. Verify the public count is 92 stable assets.
4. Verify all five Batch 17 routes and their evidence/profile sections.
5. Verify version.json, manifest.json, llms.txt, ai.txt, sitemap, and public consistency.
6. Record production parity.
7. Complete one or two more existing-record quality audits.
8. Select Batch 18 only after the publication checkpoint and quality work.
```

## Production policy

```text
Automatic production deployment: disabled
Preview branch deployments: disabled
Publication path: manual GitHub Actions workflow only
Manual publication workflow activation: PASS
Reference deployment workflow run: 27908380603
Pages project: stable-or-gone
Production branch: main
```
