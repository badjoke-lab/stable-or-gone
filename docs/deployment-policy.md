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
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
Current reviewed result spec: docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
Parent implementation spec: docs/quality/compare-logo-maintenance-spec.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current stage: MAINTENANCE_AUTHORITY_PHASE_C_NEXT
Canonical delta authorized by current lane: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Phase D logo imports authorized now: no
Automatic continuation beyond closeout: false
Current maintenance-authority production commit before Phase B result: e7d38ba55ce1a2a15a2316dac733f696b9742a17
Current maintenance-authority production run: 31556728267 — success
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

A repository merge is not itself proof of production parity. PR #554's authority state was separately built, uploaded, and verified at the official origin by run `31556728267`. Phase B is review-only and introduces no public logo-display change.

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
Maintenance-authority production commit: e7d38ba55ce1a2a15a2316dac733f696b9742a17
Maintenance-authority production run: 31556728267 — success
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

## Current logo display and Phase B reviewed result

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

The expected `101 / 18` partition is not deployable during Phase C and is not current production state. Phase B changes no local logo assets, resolver mappings, display-policy counts, or public README counts.

Binding Phase B result:

```text
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
```

## Compare and logo maintenance deployment lane

Parent authority:

```text
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
docs/ui-v3-remediation-authority.md
```

The implementation sequence is fixed:

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  fresh reviewed result for exact 21 neutral fallbacks — complete after current review-result merge
Phase C  Compare matching-row feedback + Compare mark display — NEXT
Phase D  import only mnee/usdgo/usr + permanent future growth logo gate — BLOCKED until Phase C review
Phase E  direct artifact review + exact-main production verification + closeout — BLOCKED until Phase D
```

A Phase D implementation may not deploy before a Phase C reviewed implementation result exists and is cited. The adjacent phases may not be collapsed merely because the same parent authority covers the overall lane.

## Phase C deployment acceptance requirements

Before the material Compare implementation can be accepted, verification must cover:

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

Compare headers must reuse the current audited resolver/fallback result. Phase C must not introduce the three Phase-B-approved new logo files.

Changed visual states must be directly inspected. Green automation does not override a visible defect.

## Phase D logo import deployment requirements

Only these Phase-B-reviewed marks may be deployed as new direct logos in Phase D:

```text
mnee
usdgo
usr
```

The other 18 baseline fallbacks remain neutral under the current review result.

Every accepted mark must be vendored locally and have recorded source/provenance/license information. Remote runtime logo fetching and generated substitute brand artwork are prohibited.

Issuer, project, directory, ambiguous-symbol, or unverifiable artwork remains a neutral fallback unless a later reviewed evidence change establishes Stablecoin/product-specific attribution.

Phase D must synchronize the logo resolver/display policy, reviewed decisions, public logo README counts, and all-record catalog/audit expectations to the accepted result.

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

PR #554 established the current Compare/logo maintenance authority and was production-verified by run `31556728267`.

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

Current next deployment-eligible material implementation is Phase C only. Phase D logo imports are explicitly blocked until Phase C has a reviewed implementation result.

No canonical archive, Market Access, asset, Evidence, Evidence Relation, schema, taxonomy, unrelated Guide, new route family, ranking, scoring, recommendation, or unrelated public change may deploy under this authority.

A schedule window, research lead, image availability, chat instruction, prior Compare authority, or prior growth PR does not override the current merged specifications and reviewed phase result.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
