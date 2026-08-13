# Stable or Gone Deployment Policy

Updated: 2026-08-14

## Status

```text
Source of truth: main
Production workflow: .github/workflows/deploy-production.yml
Pages project: stable-or-gone
Official public origin: https://www.stableorgone.com
Legacy migration origin: https://sog.badjoke-lab.com
Automatic main publication: enabled
Deployment record: Issue #479
Current stage: SEO_GA4_MIGRATION_AUDIT_AUTHORITY
Active implementation authority: config/seo-ga4-migration-authority.json
Current quality spec: docs/quality/seo-ga4-migration-audit-spec.md
Current roadmap amendment: docs/roadmap-amendments/2026-08-14-seo-ga4-migration-audit-authority.md
Entry main commit: 3c715fa77d9e92d52d7646f6e6e944a43d7f5ea9
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

## Current SEO / GA4 deployment lane

This authority verifies the already-completed domain move and may repair only the production build wiring needed for the existing SOG GA4 identity.

Required deployment invariants:

```text
Official origin: https://www.stableorgone.com
Legacy host: https://sog.badjoke-lab.com
Legacy behavior: 301 path/query-preserving redirect
GA4 build variable: PUBLIC_GA_MEASUREMENT_ID
New GA4 identity creation: forbidden
Canonical delta: 0
DNS / Cloudflare account mutation: forbidden
```

The workflow may consume an existing GitHub Actions environment variable or secret named `PUBLIC_GA_MEASUREMENT_ID`. It must not log the configured value. If no value is configured, the deployment/audit must report the missing account-side configuration rather than inventing a Measurement ID.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory. Live checks must distinguish an audit-environment network failure from a verified production redirect failure.

## Google account boundary

Search Console ownership, Change of Address, and sitemap submission are not proven by a successful repository deployment. They require direct Google-account evidence. The target state is the `stableorgone.com` Domain property with the legacy property retained during migration observation.

GA4 must reuse the existing SOG property / web stream. This repository authority does not create or authorize a new Measurement ID.

## Permanent future record-growth deployment gate

Core CI continues to run `node scripts/audit-stablecoin-logo-coverage.mjs` on every pull request. Canonical Stablecoin growth must continue to satisfy `docs/quality/stablecoin-logo-disposition-operating-spec.md`; this SEO/GA4 lane does not weaken that gate.

## Infrastructure boundary

Separate reviewed authority remains required for DNS/domain changes, redirect implementation replacement, Cloudflare account changes, destructive schema migrations, mass deletion, major route removal, or emergency rollback.

## Closeout

After exact-main production verification, the repository must return to:

```text
Current stage: REVIEW_GATE
Active implementation authority: none
Automatic continuation: false
```

Any unresolved GSC/GA4 account-side action must remain explicitly unresolved at closeout.
