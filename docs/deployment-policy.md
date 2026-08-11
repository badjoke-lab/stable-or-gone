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
Current stage: REVIEW_GATE
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Public Guide/UI change authorized: no
Automatic continuation: false
Next work requires separate reviewed authority: yes
Current production commit: ada106dd3bf9899adc441c968fa36978ae515a5c
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

A repository merge is not itself proof of production parity. PR #552 is considered complete because its exact main commit was separately built, uploaded, and verified at the official origin.

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

## Current production baseline

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
Stable asset relationships: 5
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 471
Archive not recorded: 114
Archive recorded / not recorded: 471 / 114
Detail routes: 422
Metadata-checked routes: 422
Production commit: ada106dd3bf9899adc441c968fa36978ae515a5c
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

## Completed Evidence Archive Payload Verification Batch 2 deployment lane

PR #551 authorized one bounded implementation of exactly eight reviewed dated `archived_url` values. PR #552 consumed that authority and merged as `ada106dd3bf9899adc441c968fa36978ae515a5c`.

Production verification:

```text
Production run: 31514472928 — success
Production job: 93856057816 — success
Production issue: #479
Production report step: success
Cloudflare Pages upload: success
Deployed-production verification: success
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
```

Accepted bounded result:

```text
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
Exact archive additions: 8
Reviewed no-safe-change: 2
```

No source URL replacement, source normalization, new Evidence identity, relation change, Market Access change, schema/taxonomy change, public route change, material UI/CSS change, ranking, scoring, or recommendation deployed under this lane.

The PR #551 `IMPLEMENTATION_AUTHORIZED` boundary is consumed. It authorizes no further deployment.

## Completed Russia USDT Regulation Guide deployment lane

PR #548/#549 completed the Guide update. PR #550 closed the temporary lane and main `2825eb293f833061deb1ef8bdb628b32a93538cc` completed production run `31509169378` successfully. The Russia Guide lineage authorizes no further Guide work and produced no Market Access or Evidence identity/relation delta.

## Market Access deployment boundary

Market Access Record v1 requires named provider/service and function scope. No Market Access addition or mutation is currently authorized.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Review-to-production boundary

Current stage is `REVIEW_GATE`. Canonical archive additions authorized: `0`. PR #551 and PR #552 are completed historical lineage. No Batch 3, additional archive maintenance, canonical mutation, or public material change follows automatically.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
