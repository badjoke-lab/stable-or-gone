# Stable or Gone Deployment Policy

Updated: 2026-08-10

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
```

## Stablecoin Compare Discovery and Navigation Remediation — complete

Compare remediation is complete. PR #544 supplied bounded authority and PR #545 supplied the production implementation.

```text
Implementation merge: cd18c899cebb49a0cc6c99670709cdee0b7b7256
Visual acceptance run: 31405900687 — success
Production run: 31406474357 — success
Canonical delta: 0
```

Production-visible behavior now includes:

```text
comparison panel before public-register results
fixed Compare dock while browsing register after selection
dock hidden while matrix is in view or register browsing scope is left
selected identities visible in dock
immediate View comparison navigation + focus
in-panel Add / replace record control
remove then replace without register scroll round trip
2 / 3 / 4 aligned matrix preserved
Differences only and shared URL restore preserved
fifth selection rejected
no page-level horizontal overflow
```

The temporary PR #544 authority is closed. Any further material Compare change requires separate reviewed authority under `docs/ui-v3-remediation-authority.md`.

## Evidence Archive Payload Verification Batch 2 — review complete / restored

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical archive additions authorized: 0
current boundary: REVIEW_GATE
```

No archive proposal may be published from the review result alone. The eight archive proposals require a separate reviewed and merged implementation authority before any `archived_url` can change.

## Previous Compare matrix remediation

PR #541 merged as `539a27fd5854a1c2544f4653a2161be36860a002`; production run `31326135906` and visual run `31325811381` succeeded. PR #544/#545 completed the later placement/discovery/candidate-switching repair with production run `31406474357` and visual run `31405900687`.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Review-to-production boundary

Canonical work is at Evidence Archive Payload Verification Batch 2 `REVIEW_GATE`. No UI authority changes canonical data. Any next canonical implementation requires a separate reviewed and merged authority.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
