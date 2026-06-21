# SOG 75-Record Quality Baseline

Recorded: 2026-06-21

## Scope

This document records the reviewed repository baseline at the 75-canonical-asset checkpoint reached by Batch L.

Machine-readable source of truth:

```text
docs/migration/registry-v3-baseline.json
```

## Canonical counts

| Layer | Count |
|---|---:|
| Stable assets | 75 |
| Organizations | 64 |
| Stablecoin-organization relationships | 77 |
| Classifications | 75 |
| Reserve/redemption profiles | 75 |
| Events | 102 |
| Event v2 details | 102 |
| Evidence | 306 |
| Reserve-report or reserve-context rows | 82 |
| Known unknowns | 173 |
| Regulatory notes | 9 |
| Deployments | 106 |
| Legal profiles | 75 |
| Stable-asset relationships | 4 |
| Reserve components | 107 |
| Income profiles | 75 |

## Coverage

```text
Required-layer coverage:        75 / 75
Event coverage:                 75 / 75
Deployment coverage:            75 / 75
Reserve-context coverage:       62 / 75 informational
Candidate promotions:           75 / 75
Pending candidates:              0
```

## Integrity

```text
Critical findings:               0
Warnings:                        0
Canonical name collisions:       0
Alias collision warnings:        0
Stale verification records:      0
All-unknown income profiles:      0
```

## Explicit unresolved queues

```text
Launch date:                    34
Terminal date:                   6
Reserve applicability:          13
  not applicable by design:     10
  source status unresolved:      3
  expected but missing:          0
```

Unknown and unresolved values remain valid only when they are explicit, evidence-bounded, and validator-enforced. They must not be replaced with guessed dates, legal claims, reserve percentages, deployment identities, or redemption rights.

## Production gate

The repository may merge at this baseline only after all GitHub workflows pass. Reaching 75 canonical assets then requires Cloudflare production parity before any 75-to-80 growth work begins.

Production parity must verify the deployed commit, canonical counts, machine-readable manifests, all five Batch L detail routes, sitemap entries, metadata, structured data, and absence of stale 70-record markers.
