# Stable or Gone Deployment Policy

Updated: 2026-08-12

## Status

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Official public origin: https://www.stableorgone.com
Automatic main publication: enabled
Deployment record: Issue #479
Current canonical work boundary: Evidence Archive Payload Verification Batch 2
Current stage: IMPLEMENTATION_AUTHORIZED
Canonical archive additions authorized: exactly 8
Post-implementation boundary: REVIEW_GATE
Canonical Market Access promotion authorized: no
Last canonical-changing implementation commit before this lane: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash before implementation: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
```

A repository merge is not itself proof of production parity.

## Publication rule

```text
PR merged to main
-> validate exact main commit
-> build dist
-> upload to Cloudflare Pages
-> verify deployed commit and canonical hash/count contract
-> verify counts/routes/metadata/machine-readable output
-> verify legacy-host migration
-> report result to Issue #479
```

## Current canonical baseline before Evidence Archive implementation

```text
Stablecoins: 119
Organizations: 109
Relationships: 131
Events: 194
Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded / not recorded: 463 / 122
Detail routes: 422
Metadata-checked routes: 422
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
```

## Evidence Archive Payload Verification Batch 2 — authorized deployment boundary

One bounded implementation may add `archived_url` only to the eight existing Evidence IDs bound in `config/evidence-archive-payload-verification-batch-2-implementation-authority.json`.

Expected post-implementation canonical boundary:

```text
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
Maximum archive delta: +8 / -8
```

The exact dated URLs must match the completed manual payload-review artifact. No substitute Wayback timestamp, source normalization, source replacement, new Evidence identity, relation change, Market Access change, schema/taxonomy change, public route change, material UI/CSS change, ranking, scoring, or recommendation may deploy under this authority.

The two reviewed no-safe-change records remain byte-equivalent except for unrelated deterministic metadata that the existing repository pipeline may require; no `archived_url` may be added to them.

Same-count checkpoint, statistics, archive-coverage, and release-integrity artifacts may be refreshed only when the existing deterministic pipeline requires them and only to reflect these eight exact archive additions.

## Completed Russia USDT Regulation Guide deployment lane

PR #548/#549 completed the Guide update. PR #550 closed the temporary lane and main `2825eb293f833061deb1ef8bdb628b32a93538cc` completed production run `31509169378` successfully. The Russia Guide lineage authorizes no further Guide work and produced no Market Access or Evidence identity/relation delta.

## Market Access deployment boundary

Market Access Record v1 requires named provider/service and function scope. This Evidence Archive lane authorizes no Market Access addition or mutation.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Review-to-production boundary

Current implementation authority is `IMPLEMENTATION_AUTHORIZED` for exactly eight archived URLs. After that implementation is merged and production-verified, authority returns to `REVIEW_GATE`. No further canonical or public work automatically follows.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
