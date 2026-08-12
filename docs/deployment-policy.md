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
Current public maintenance authority: config/compare-logo-maintenance-authority.json
Current quality spec: docs/quality/compare-logo-maintenance-spec.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current stage: MAINTENANCE_AUTHORITY
Canonical delta authorized by current lane: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Automatic continuation beyond closeout: false
Current production commit: ada106dd3bf9899adc441c968fa36978ae515a5c
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

A repository merge is not itself proof of production parity. PR #552 remains the current canonical-production baseline because its exact main commit was separately built, uploaded, and verified at the official origin.

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

For material Compare/mark presentation changes, production verification is necessary but not sufficient. Direct desktop/mobile artifact review remains required by `docs/ui-v3-remediation-authority.md`.

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
Detail routes: 422
Metadata-checked routes: 422
Production commit: ada106dd3bf9899adc441c968fa36978ae515a5c
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

## Current logo display baseline

```text
Canonical stablecoins: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
```

The current authority may change the direct-logo/fallback display split only after the 21-record fallback re-audit produces reviewed dispositions. Such display changes do not authorize canonical registry changes.

## Compare and logo maintenance deployment lane

The current lane is governed by:

```text
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
docs/ui-v3-remediation-authority.md
```

The implementation sequence is fixed:

```text
Phase A  authority/specification/schedule merge
Phase B  fresh reviewed result for all 21 neutral fallbacks
Phase C  Compare matching-row feedback + Compare mark display
Phase D  reviewed eligible logo imports + permanent future growth logo gate
Phase E  direct artifact review + exact-main production verification + closeout
```

A Phase C or D implementation may not deploy before the required preceding reviewed result exists and is cited by the implementation PR.

## Compare production acceptance requirements

Before the material Compare implementation is accepted, verification must cover:

```text
matching-row toggle removes rows for a deterministic matching selection
all-different toggle reports explicit no-op feedback
full rows return when the toggle is disabled
direct-logo Compare header on desktop
neutral-fallback Compare header on desktop
direct-logo Compare header on mobile
neutral-fallback Compare header on mobile
existing fifth-selection rejection
existing URL restore/order
existing dock/footer non-overlap
bounded mobile matrix scrolling
no page-level horizontal overflow
```

Changed visual states must be directly inspected. Green automation does not override a visible defect.

## Logo import deployment requirements

Only marks accepted by the reviewed 21-fallback re-audit may be deployed as new direct logos.

Every accepted mark must be vendored locally and have recorded source/provenance/license information. Remote runtime logo fetching and generated substitute brand artwork are prohibited.

Issuer, project, directory, ambiguous-symbol, or unverifiable artwork remains a neutral fallback unless reviewed evidence establishes Stablecoin/product-specific attribution.

## Permanent future record-growth deployment gate

After activation of `docs/quality/stablecoin-logo-disposition-operating-spec.md`, a PR that adds a canonical stablecoin must not be merge/deployment eligible unless:

```text
every new canonical slug has a reviewed logo disposition
logo decision count equals canonical stablecoin count
direct-logo assets exist locally and resolve consistently
neutral fallbacks are explicit in display policy
canonical stablecoin data changes trigger logo coverage validation
all-record mark catalog remains complete
```

A neutral fallback is valid. Missing disposition is not.

This gate applies even when the growth PR contains no material UI work.

## Completed Evidence Archive Payload Verification Batch 2 deployment lane

PR #551 authorized one bounded implementation of exactly eight reviewed dated `archived_url` values. PR #552 consumed that authority and merged as `ada106dd3bf9899adc441c968fa36978ae515a5c`.

Production verification:

```text
Production run: 31514472928 — success
Production job: 93856057816 — success
Production issue: #479
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

PR #551/#552/#553 are completed historical lineage and authorize no further archive deployment.

## Historical public lanes

PR #544/#545/#546/#547 are the completed prior Compare discovery/navigation lineage and do not authorize the new matching-row or mark-display work.

PR #548/#549/#550 are the completed Russia USDT Guide authority/implementation/closeout lineage and do not authorize continued Guide work.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Review-to-production boundary

The current authority permits only the bounded public-maintenance work defined in `config/compare-logo-maintenance-authority.json` and authorizes zero canonical delta.

No canonical archive, Market Access, asset, Evidence, Evidence Relation, schema, taxonomy, unrelated Guide, new route family, ranking, scoring, recommendation, or unrelated public change may deploy under this authority.

A schedule window, research lead, image availability, chat instruction, prior Compare authority, or prior growth PR does not override the current merged specifications.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
