# Stable or Gone Deployment Policy

Updated: 2026-08-11

## Status

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Official public origin: https://www.stableorgone.com
Automatic main publication: enabled
Deployment record: Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
```

A repository merge is not itself proof of production parity.

## Publication rule

```text
PR merged to main
-> validate exact main commit
-> build dist
-> upload to Cloudflare Pages
-> verify deployed commit and canonical hash
-> verify counts/routes/metadata/machine-readable output
-> verify legacy-host migration
-> report result to Issue #479
```

## Current canonical baseline

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
Canonical delta: 0
```

## Active public deployment lane — Russia USDT Regulation Guide

A bounded Guide-only implementation is authorized after the Russia USDT Regulation Guide authority merges.

Authorized implementation files:

```text
src/pages/guides/russia-stablecoin-rules-2026/index.astro
src/pages/guides/global-stablecoin-regulation-2026/index.astro
src/data/guideCatalog.ts
```

The implementation must preserve every canonical count and hash. It must not add Market Access or Evidence records. The BTC/ETH/USDT point must be source-qualified as the initial three currently meeting the principles according to Bank of Russia First Deputy Governor Vladimir Chistyukhin, not as a permanent statutory whitelist.

After merge, deployment is not complete until the exact implementation merge commit is built and uploaded to Cloudflare Pages, the public Russia and global Guide routes are verified, canonical hash/counts remain unchanged, and the result is reported to Issue #479.

No screenshot/visual acceptance lane is automatically required because this is content-only and introduces no material UI/CSS change. Existing public-route/build/metadata/Guide regression checks remain binding. If the implementation causes a material presentation change or a direct production defect is found, the normal UI authority/visual-review rules apply.

## Market Access deployment boundary

No canonical Market Access promotion is authorized by the Russia legal-framework review.

```text
Market Access Records: 12 -> 12
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
```

Market Access Record v1 requires named platform/service and function scope. A Russia-wide law or regulator statement must not be deployed as a provider-specific access row.

## Stablecoin Compare remediation — complete

PR #544/#545/#546 completed the Compare discovery/navigation repair and blocking dock/footer fix. PR #547 closed the lane and restored `REVIEW_GATE`.

```text
Final visual exact head: 02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7
Final visual acceptance run: 31498394285 — success
Final production run: 31498949423 — success
Canonical delta: 0
```

The Compare lineage authorizes no further material change.

## Evidence Archive Payload Verification Batch 2 — preserved

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical archive additions authorized: 0
current canonical boundary: REVIEW_GATE
```

The Guide lane neither promotes nor rejects the archive proposals. After the Guide implementation is production-verified and closed out, Evidence Archive Payload Verification Batch 2 returns as the current canonical work boundary at `REVIEW_GATE`.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Review-to-production boundary

The Russia USDT Regulation Guide is a public content lane with Canonical delta: 0. Canonical implementation authority remains `REVIEW_GATE`. Any archive, Market Access, asset, Evidence, schema, taxonomy, or unrelated public change requires a separate reviewed and merged authority.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
