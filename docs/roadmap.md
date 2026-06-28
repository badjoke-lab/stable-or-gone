# Stable or Gone Roadmap

Updated: 2026-06-28  
Status: canonical execution schedule

## Registry checkpoint

```text
Stable assets: 92
Organizations: 86
Organization relationships: 101
Events: 150
Canonical evidence records: 455
Public source identities: 410
Evidence relations: 455
Known unknowns: 253
Deployments: 130
Reserve components: 125
```

## Current position

```text
Completed through: PR #215
Current work: PR #216 visual mark correction
Next work: PR #217 all-route audit
Gate V2-F: pending
Gate V2-G: pending
Gate V2-H: pending
Record growth: paused at 92
Automatic production deployment: disabled
```

## Completed sequence

PRs #207 through #215 completed the approved v2 contract, shared foundation, Home, Stablecoins, Organizations, Events, editorial pages, and mobile/accessibility hardening.

## PR #216

Owner review found excessive circular letter marks. This correction keeps the stablecoin ticker fallback where no reviewed local official logo is available. It removes visible letter marks from summary cards, Home destinations, organization pages, event pages, and decorative hero areas. Functional filter counts use compact rounded rectangles. Canonical data, routes, counts, filters, sorts, evidence, known unknowns, deployments, and production state remain unchanged.

## PR #217

The formal audit covers all 92 stablecoin routes, 86 organization routes, 150 event routes, editorial routes, and machine-readable endpoints. It verifies desktop and compact layouts, 320px, 200 percent zoom, keyboard operation, reduced motion, forced colors, protected information, counts, evidence relations, deployments, and route/output parity.

Gate V2-F passes after this audit. Gate V2-G requires explicit owner approval of one exact candidate.

## Publication

After Gate V2-G, PR #218 or a publication report may publish the exact candidate through the manual production workflow. Gate V2-H passes after production parity verification.
