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
Current canonical work boundary: Evidence Archive Payload Verification Batch 2 REVIEW_GATE
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

## Russia USDT Regulation Guide deployment lane — complete

The bounded Guide-only implementation authorized by PR #548 was implemented by PR #549 and is production-verified.

```text
Authority PR: #548 — complete
Implementation PR: #549 — complete
Implementation/main commit: f99d9583105587625a409b959ac928de44248e7b
Production run: 31504346502 — success
Production job: 93822011080 — success
Issue #479 deployment report step: success
Material UI/CSS change: no
Visual acceptance lane required: no
Canonical delta: 0
```

The accepted implementation changed exactly:

```text
src/pages/guides/russia-stablecoin-rules-2026/index.astro
src/pages/guides/global-stablecoin-regulation-2026/index.astro
src/data/guideCatalog.ts
```

The production job completed locked dependency installation, Guide publication metadata validation, official-origin validation, publishable build, Cloudflare Pages upload, deployed-production verification, deployment summary, and deployment-result reporting successfully.

PR #548/#549 are historical lineage after closeout and do not authorize continued material Guide edits.

## Market Access deployment boundary

No canonical Market Access promotion was authorized or deployed by the Russia legal-framework review.

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

## Evidence Archive Payload Verification Batch 2 — current boundary

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical archive additions authorized: 0
current canonical boundary: REVIEW_GATE
separate implementation authority required: yes
automatic promotion: prohibited
```

The Russia Guide lane neither promoted nor rejected the archive proposals. With production closeout complete, Evidence Archive Payload Verification Batch 2 is again the current canonical work boundary.

Any later canonical archive implementation must first merge a separate authority binding the exact eight Evidence IDs and dated archive URLs, maximum archive delta `+8/-8`, expected canonical invariants, and rollback conditions. The review result alone is not deployment permission.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Review-to-production boundary

Current canonical implementation authority is `REVIEW_GATE`. No canonical archive, Market Access, asset, Evidence, Evidence Relation, schema, taxonomy, material Guide, or unrelated public change may deploy without its own reviewed and merged authority.

A schedule window, completed review artifact, completed Guide authority, or chat instruction does not itself authorize a canonical mutation.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
