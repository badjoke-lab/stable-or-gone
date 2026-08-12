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
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
Current reviewed result spec: docs/quality/compare-logo-phase-d-review-result-spec.md
Current implementation result: config/compare-logo-phase-d-implementation-result.json
Preceding result: config/compare-phase-c-implementation-result.json
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current stage: MAINTENANCE_AUTHORITY_PHASE_E_NEXT
Canonical delta authorized by current lane: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Additional direct-logo promotions authorized: no
Automatic continuation beyond closeout: false
Phase D entry main: c24b9ea9f98573a949c91bd512ef1413311226c6
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

A repository merge is not itself proof of production parity. Phase E must verify the exact merged Phase D main commit at the official origin before closeout.

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

For material mark presentation changes, production verification is necessary but not sufficient. Direct desktop/mobile artifact review remains required by `docs/ui-v3-remediation-authority.md` and the current Phase E contract.

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

## Current Phase D logo display result

After the current Phase D merge, the required public state is:

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Promoted slugs: mnee, usdgo, usr
```

Binding Phase D package:

```text
config/compare-logo-phase-d-implementation-result.json
docs/quality/compare-logo-phase-d-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
```

No fourth logo promotion is authorized under this maintenance lane.

### USDGO correction

The Phase B Anchorage image was directly inspected during Phase D and rejected as a product illustration, not a compact mark. Production must use `/stablecoin-logos/usdgo.svg`, extracted without artwork changes from the current first-party USDGO homepage header. The allow-list remains exactly `mnee`, `usdgo`, `usr`.

## Permanent future record-growth deployment gate

Core `.github/workflows/ci.yml` runs:

```text
node scripts/audit-stablecoin-logo-coverage.mjs
```

on every pull request without data-path exclusions.

A future canonical Stablecoin PR must not be merge/deployment eligible unless:

```text
every canonical Stablecoin has exactly one reviewed logo disposition
logo decision count equals canonical Stablecoin count
direct-logo assets exist locally and resolve consistently
neutral fallbacks are explicit in display policy
resolver direct set equals reviewed direct-logo set
orphan logo assets are absent
```

A neutral fallback is valid. Missing disposition is not. This gate applies to data-only growth PRs.

## Phase E deployment acceptance requirements

Phase E is verification and closeout only. It must verify the exact merged Phase D state:

```text
MNEE direct mark on desktop and mobile
USDGO direct mark on desktop and mobile
USR direct mark on desktop and mobile
preserved neutral fallback on desktop and mobile
all-record Stablecoin mark catalog: 119 / 119
reviewed dispositions: 119 / 119
public partition: 101 direct / 18 fallback
no orphan logo assets
Compare interaction regression checks
no page-level overflow / clipping / footer overlap regression
exact-main production deployment at https://www.stableorgone.com
canonical hash/file count unchanged
legacy-host redirect contract unchanged
```

Changed visual states must be directly inspected. Green automation does not override a visible defect.

Phase E may not add a new logo, alter canonical records, reopen archive/Market Access/Guide work, or introduce unrelated UI changes under this authority.

## Maintenance schedule

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  exact 21-fallback reviewed result — complete in PR #555
Phase C  Compare matching-row feedback + Compare marks — complete in PR #556
Phase D  mnee/usdgo/usr import + permanent growth gate — complete after current merge
Phase E  direct artifact review + exact-main production verification + closeout — NEXT
closeout  restore repository REVIEW_GATE; no automatic continuation
```

Adjacent phases may not be collapsed merely because the same parent authority covers the overall lane.

## Completed Evidence Archive Payload Verification Batch 2 deployment lane

PR #551 authorized eight reviewed dated `archived_url` additions. PR #552 consumed that authority and production run `31514472928` succeeded. PR #553 restored `REVIEW_GATE`.

That lineage authorizes no further archive deployment.

## Historical public lanes

PR #544/#545/#546/#547 are the completed prior Compare discovery/navigation lineage.  
PR #548/#549/#550 are the completed Russia USDT Guide lineage.  
PR #551/#552/#553 are the completed Evidence Archive Batch 2 implementation/closeout lineage.  
PR #554 established the current Compare/logo maintenance authority.  
PR #555 completed Phase B.  
PR #556 completed Phase C.  
The current Phase D PR completes the exact three logo imports and permanent growth gate.

Historical lineage does not authorize new work merely because it remains in repository history.

## Official-origin contract

The only official public origin is `https://www.stableorgone.com`. Canonical/hreflang, OGP/Twitter, JSON-LD, version/manifest, llms/ai, robots, sitemap, and production verification must use the official origin. `config/public-origin.mjs` remains the repository source for origin consumers.

## Legacy-host migration

```text
https://sog.badjoke-lab.com/<path>?<query>
-> 301 https://www.stableorgone.com/<path>?<query>
```

Path/query preservation, no redirect loops, and no legacy-origin leakage remain mandatory.

## Review-to-production boundary

The current authority permits zero canonical delta. Phase E verifies and closes the merged Phase D presentation/validation result only.

A schedule window, research lead, image availability, chat instruction, prior Compare authority, or prior growth PR does not override the current merged specifications and reviewed phase results.

## Infrastructure boundary

Explicit reviewed authority remains required for DNS/domain changes, redirect implementation changes, Cloudflare secret/account changes, worker-contract replacement, destructive schema migrations, mass deletion, major route removal, or emergency rollback.
