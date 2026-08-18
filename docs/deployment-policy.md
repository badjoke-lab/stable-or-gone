# Stable or Gone Deployment Policy

Updated: 2026-08-19

## Status

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Official public origin: https://www.stableorgone.com
Legacy migration origin: https://sog.badjoke-lab.com
Automatic main publication: enabled
Deployment record: Issue #479
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/ledger-series-phase3-closeout.json
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Additional direct-logo promotions authorized: no
DNS / Cloudflare account mutation authorized: no
New GA4 property / Measurement ID creation authorized: no
Automatic continuation: false
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

A repository merge is not itself proof of production parity. Material public or deployment changes require exact-main production verification.

## Publication rule

```text
PR merged to main
-> validate exact main commit
-> build dist
-> upload to Cloudflare Pages
-> verify deployed commit and canonical hash/count contract
-> verify counts/routes/metadata/machine-readable output
-> verify stablecoin dossier output
-> verify Phase 3 public cross-surface contracts
-> verify legacy-host migration
-> verify analytics build output when configured
-> report result to Issue #479
```

## Current canonical production contract

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
Detail routes: 422
Metadata-checked routes: 422
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

## Completed Ledger Series Phase 3 deployment lane

Accepted exact-main production evidence:

```text
Verified main: 6cac1ef858d35e2a8c015142f29011e4aff33fdc
Production run: 32153641423 — success
Production job: 95765437402 — success
Cloudflare Pages upload: success
Stablecoin dossiers: 119 verified
Phase 3 cross-surface verification: success
Canonical delta: 0
Schema/taxonomy delta: 0
```

The Phase 3 verifier checks the same deployed commit across deterministic per-asset JSON, structured lifecycle/depeg-recovery filters, lifecycle Compare fields, and lifecycle-quality Stats. On the accepted run it reported 11 depeg events, 6 regulatory events, 6 redemption-change events, and 42 migration/termination events from reviewed canonical data.

The same main commit passed the strict domain migration production gate:

```text
Run: 32153782421
Strict mode: true
Legacy redirects: 15 / 15
Migration complete: true
Official-origin failures: 0
```

These checks are now enduring deployment regression contracts. They do not authorize new Phase 3 expansion from REVIEW_GATE.

## Completed SEO / GA4 deployment lane

Accepted exact-main deployment evidence:

```text
Verified main: 9277d04ca7e463e3a965473b82a7c15ef117a5fb
Production run: 32035190608 — success
Production job: 95403850881 — success
Official-origin validation: success
GA4 static-build verification: success
Cloudflare Pages upload: success
Deployed-production verification: success
Canonical delta: 0
```

The enduring deployment invariants remain:

```text
Official origin: https://www.stableorgone.com
Legacy host: https://sog.badjoke-lab.com
Legacy behavior: 301 path/query-preserving redirect
GA4 build variable: PUBLIC_GA_MEASUREMENT_ID
New GA4 identity creation: forbidden without separate authority
```

The workflow may consume an existing GitHub Actions environment variable or secret named `PUBLIC_GA_MEASUREMENT_ID`. It must not log the configured value. If no value is configured, deployment/audit must report the missing account-side configuration rather than inventing a Measurement ID.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Google account boundary

Search Console ownership, Change of Address, sitemap submission, and GA4 account administration outside the existing build variable are not proven by repository deployment. They require direct account evidence.

## Permanent future record-growth deployment gate

Core CI continues to run `node scripts/audit-stablecoin-logo-coverage.mjs` on every pull request. Canonical Stablecoin growth must continue to satisfy `docs/quality/stablecoin-logo-disposition-operating-spec.md`.

## Infrastructure boundary

Separate reviewed authority remains required for DNS/domain changes, redirect implementation replacement, Cloudflare account changes, destructive schema migrations, mass deletion, major route removal, emergency rollback, canonical/schema mutation, or new lifecycle/search/Compare/Stats expansion.

## REVIEW_GATE

No new implementation is authorized after the Ledger Series Phase 3 closeout. A fresh reviewed authority is required before canonical, archive, Market Access, route-family, UI, lifecycle, DNS, analytics-identity, or other substantive implementation work begins.
