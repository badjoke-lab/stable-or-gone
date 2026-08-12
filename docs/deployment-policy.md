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
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
Current reviewed result spec: docs/quality/compare-phase-c-review-result-spec.md
Current implementation result: config/compare-phase-c-implementation-result.json
Phase B reviewed result: data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
Parent implementation spec: docs/quality/compare-logo-maintenance-spec.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current stage: MAINTENANCE_AUTHORITY_PHASE_D_NEXT
Canonical delta authorized by current lane: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Phase D direct-logo allow-list: mnee, usdgo, usr
Automatic continuation beyond closeout: false
Phase C entry main / current production baseline: dc1f2925f6dbd40c50267a2de2b4f85e2fe580b5
Phase B production run: 31566866583 — success
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

A repository merge is not itself proof of production parity. Phase C must merge to exact `main`, then be built, uploaded and verified at the official origin before its production state is accepted. Phase D does not inherit production acceptance merely because Phase C browser automation passed.

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

For material Compare/mark presentation changes, production verification is necessary but not sufficient. Direct desktop/mobile artifact review remains required by `docs/ui-v3-remediation-authority.md` and the maintenance schedule.

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
Production commit before Phase C: dc1f2925f6dbd40c50267a2de2b4f85e2fe580b5
Production run: 31566866583 — success
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

## Current logo display and reviewed result

Current public display remains:

```text
Canonical stablecoins: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
```

Phase B reviewed all 21 current fallbacks and accepted:

```text
direct_logo: 3
neutral_fallback: 18
Phase-D-approved direct-logo slugs: mnee, usdgo, usr
expected post-import partition: 101 direct / 18 fallback
```

The expected `101 / 18` partition is not current production state. Phase C changes no resolver/display-policy counts and imports no reviewed logo asset.

Binding reviewed packages:

```text
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
config/compare-phase-c-implementation-result.json
docs/quality/compare-phase-c-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
```

## Compare and logo maintenance deployment lane

The implementation sequence is fixed:

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  fresh reviewed result for exact 21 neutral fallbacks — complete in PR #555
Phase C  Compare matching-row feedback + Compare mark display — complete after PR #556 merge and exact-main verification
Phase D  import only mnee/usdgo/usr + permanent future growth logo gate — NEXT after Phase C merge/review
Phase E  direct artifact review + exact-main production verification + closeout — BLOCKED until Phase D
```

Adjacent phases may not be collapsed merely because the same parent authority covers the overall lane.

## Phase C deployment acceptance requirements

Phase C acceptance must cover:

```text
matching-row toggle removes rows for a deterministic matching selection
differing attribute count is visible
matching shown/hidden count is visible
all-different toggle reports: All displayed attributes already differ. Nothing to hide.
full rows return when the toggle is disabled
direct-logo Compare header on desktop
neutral-fallback Compare header on desktop
direct-logo Compare header on mobile
neutral-fallback Compare header on mobile
existing 2–4 selection behavior
existing fifth-selection rejection
existing URL restore/order and replacement
existing dock/footer non-overlap
bounded mobile matrix scrolling
no page-level horizontal overflow
```

Compare headers reuse the current audited `StablecoinMark` resolver/fallback output. Phase C introduces no Compare-only logo mapping and no remote runtime fetch.

The browser authority is `.github/workflows/stablecoin-compare-matrix-visual.yml`, including `scripts/audit-stablecoin-comparison-phase-c.mjs`. Green automation does not override a visible defect.

## Phase D logo import deployment requirements

Only these Phase-B-reviewed marks may be promoted under the current result:

```text
mnee
usdgo
usr
```

Before promotion, the reviewed source/provenance basis must still satisfy `docs/quality/stablecoin-logo-disposition-operating-spec.md`. The other 18 baseline fallbacks remain neutral unless separately reopened by reviewed evidence.

Every accepted direct mark must use a local asset, have recorded source/provenance/license handling, update the canonical-slug-first logo resolver/display policy and reviewed decision inventory, and synchronize public logo README/catalog expectations.

Remote runtime logo fetching, generated substitute brand artwork, and issuer/project/directory artwork presented as a token mark without reviewed product-specific attribution are prohibited.

## Permanent future record-growth deployment gate

Phase D must make the permanent operating requirement blocking in core validation. A PR that adds a canonical stablecoin must not be merge/deployment eligible unless:

```text
every new canonical slug has a reviewed logo disposition
logo decision count equals canonical stablecoin count
direct-logo assets exist locally and resolve consistently
neutral fallbacks are explicit in display policy
canonical stablecoin data changes trigger logo coverage validation
all-record mark catalog remains complete
```

A neutral fallback is valid. Missing disposition is not. This gate applies even when the growth PR contains no material UI work.

## Completed Evidence Archive Payload Verification Batch 2 deployment lane

PR #551 authorized one bounded implementation of exactly eight reviewed dated `archived_url` values. PR #552 consumed that authority and merged as `ada106dd3bf9899adc441c968fa36978ae515a5c`.

```text
Production run: 31514472928 — success
Production job: 93856057816 — success
Cloudflare Pages upload: success
Deployed-production verification: success
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
```

PR #551/#552/#553 are completed historical lineage and authorize no further archive deployment.

## Historical public lanes

PR #544/#545/#546/#547 are the completed prior Compare discovery/navigation lineage and authorize no later logo import.

PR #548/#549/#550 are the completed Russia USDT Guide authority/implementation/closeout lineage.

PR #554 established the current Compare/logo maintenance authority; PR #555 completed Phase B; PR #556 is the Phase C Compare implementation/review result.

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

After Phase C merge/review, the next deployment-eligible material implementation is Phase D only: the three reviewed logo dispositions plus the permanent future-growth gate. No other canonical or unrelated public change is authorized.

A schedule window, research lead, image availability, chat instruction, prior Compare authority, or prior growth PR does not override the current merged specifications and reviewed phase results.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.