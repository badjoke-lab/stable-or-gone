# Stable or Gone Roadmap

Updated: 2026-08-05  
Status: PR #517 and PR #518 complete and production-verified; REVIEW GATE

## Current production checkpoint

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 584
Evidence Relations: 584
Reserve reports: 127
Known unknowns: 352
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 8
Archive recorded: 462
Archive not recorded: 122
Detail routes: 422
Metadata-checked detail routes: 422
Official public origin: https://www.stableorgone.com
Canonical growth commit: 6fa514f95c86ebd44c216ef2927aa0e48d52d51d
Current production commit: e51f7440c7761d0a70cb36807a8ca452aa2622da
Production canonical hash: sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650
Convergence attempt: 1
```

Current `main` and production equality is established by the production workflow and Issue #479.

## Completed current-cycle work

```text
PR #514 — six-week cycle and Batch 5 audit authority
PR #515 — eight-candidate private audit
PR #516 — EUB/USB complete-record authority
PR #517 — EUB/USB complete canonical implementation
PR #518 — sibling-registry footer links
post-PR #518 production closeout — active in this PR
```

PR #517 added two stable assets and one issuer organization. PR #518 changed footer navigation only. Production verified the combined result at the current production commit above.

## Current boundary

```text
REVIEW GATE
```

No later lane is implementation-authorized. A separate authority decision is required.

## Six-week operating cycle

The reviewed cycle remains 2026-08-03 through 2026-09-13. The original dates are planning windows, not automatic authorization.

```text
2026-08-03 to 2026-08-09  Record Growth Batch 5 audit, implementation, navigation insertion, and closeout
2026-08-10 to 2026-08-16  Japan Market Access Pilot 3 review and, only if authorized, implementation
2026-08-17 to 2026-08-23  Evidence Archive Payload Verification Batch 2
2026-08-24 to 2026-08-30  Tier A Dossier Deepening Batch 4
2026-08-31 to 2026-09-06  cycle review, quality assessment, and backlog reconciliation
2026-09-07 to 2026-09-13  next operating authority and contingency window
```

## Next decision candidate

The next planned lane is Japan Market Access Pilot 3, but it is not authorized by this closeout.

A later review-gate PR must determine:

```text
exact assets
exact providers and services
jurisdictions
functions
effective and observed dates
canonical Evidence
duplicate and scope boundaries
maximum new Market Access records
public projection impact
validation and production exit
```

No candidate may be substituted after authority is fixed.

## Deferred Batch 5 candidates

```text
SoFiUSD / SOFID — exact deployments and current assurance evidence unresolved
USA₮ — exact deployments and product-specific holder terms unresolved
XREUR — announced circulation date is 2026-09-03
JPYSC — limited account-only issue without public-chain identity and complete terms
Swiss CHF sandbox — no final asset identity or market-launch decision
Hazel Network token design — infrastructure/testing without a final independent production asset
```

No automatic recheck or promotion is authorized.

## Preserved exclusions

```text
replacement candidate
unreviewed canonical promotion
Terminal Date Boundary Review Batch 3
GYEN terminal-date review before 2026-11-12
Figure YLDS ordinary-stablecoin promotion
new dashboard, ranking, score, or recommendation
large navigation or UI redesign
legacy host redirect work
automatic monitoring promotion
```

## Deployment boundary

The only official public origin is `https://www.stableorgone.com`.

The legacy host remains an external Cloudflare configuration task. This closeout changes no deployment behavior, route family, canonical data, or public machine-readable schema.
