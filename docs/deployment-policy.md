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
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/compare-logo-phase-e-closeout.json
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Additional direct-logo promotions authorized: no
Automatic continuation: false
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

A repository merge is not itself proof of production parity. Material public changes require exact-main production verification and, where visual, direct artifact review.

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

## Completed Compare / Stablecoin logo maintenance deployment result

Accepted display state:

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime logo fetching: no
```

Verified Phase D merged main:

```text
Commit: bb72108ea53d96a69db42d5c8e97df47033be44e
Deploy production run: 31585897410
Production job: 94079531335
Conclusion: success
Official origin: https://www.stableorgone.com
```

Verified exact-main visual run:

```text
Capture representative public page screenshots: 31585897478
Job: 94079532861
Conclusion: success
Catalog: 119 cards / 101 direct / 18 fallback
Broken images: 0
Empty frames: 0
```

The Phase E closeout additionally pins `mnee`, `usdgo`, `usr`, and a preserved `acala-ausd` fallback in desktop/mobile browser regression. This is verification tooling only.

## Permanent future record-growth deployment gate

Core `.github/workflows/ci.yml` continues to run:

```text
node scripts/audit-stablecoin-logo-coverage.mjs
```

on every pull request without data-path exclusions.

A future canonical Stablecoin PR is not merge/deployment eligible unless:

```text
every canonical Stablecoin has exactly one reviewed logo disposition
logo decision count equals canonical Stablecoin count
direct-logo assets exist locally and resolve consistently
neutral fallbacks are explicit in display policy
resolver direct set equals reviewed direct-logo set
orphan logo assets are absent
```

A neutral fallback is valid. Missing disposition is not.

## REVIEW_GATE deployment boundary

```text
Current stage: REVIEW_GATE
canonical work authorized: no
archive work authorized: no
Market Access work authorized: no
additional direct-logo promotion authorized: no
new public route family authorized: no
ranking/scoring/recommendation authorized: no
Automatic continuation: false
```

A schedule window, research lead, image availability, chat instruction, or historical PR does not override this gate. New material work requires a fresh reviewed authority.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
