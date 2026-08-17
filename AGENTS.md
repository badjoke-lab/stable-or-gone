# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: LEDGER_SERIES_PHASE3
Current stage: LEDGER_SERIES_PHASE3
Active implementation authority: config/ledger-series-phase3-authority.json
Previous closeout contract: config/seo-ga4-migration-closeout.json
Automatic continuation: false
Official public origin: https://www.stableorgone.com
Legacy migration origin: https://sog.badjoke-lab.com
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Additional logo promotions authorized: no
New unrelated public route family authorized: no
Deterministic per-asset machine-readable JSON authorized: yes
Existing search/filter extension authorized: yes
Existing Compare extension authorized: yes
Existing Stats extension authorized: yes
Ranking / scoring / recommendation authorized: no
DNS / Cloudflare account mutation authorized: no
New GA4 property / Measurement ID creation authorized: no
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

Substantive work in this stage must stay within `config/ledger-series-phase3-authority.json`. Schema or canonical mutation requires a separate reviewed authority.

## Current canonical counts

```text
Canonical stable assets: 119
Organizations: 109
Relationships: 131
Events: 194
Canonical Evidence: 585
Evidence Relations: 585
Reserve reports: 127
Known unknowns: 352
Regulatory notes: 9
Deployments: 186
Legal profiles: 119
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 471
Archive not recorded: 114
Detail routes: 422
Metadata-checked routes: 422
```

## Active Ledger Series Phase 3 lane

The reviewed Phase 3 authority is:

```text
config/ledger-series-phase3-authority.json
docs/roadmap-amendments/2026-08-17-ledger-series-phase3-authority.md
```

Required implementation order:

```text
authority/specification activation
-> representative lifecycle + public-surface audit
-> schema/canonical decision gate
-> deterministic per-asset JSON if missing
-> structured-filter gap closure
-> Compare lifecycle/outcome gap closure
-> Stats lifecycle/quality gap closure
-> exact-main production verification
-> Phase 3 closeout and REVIEW_GATE restoration
```

Do not rebuild existing surfaces that already satisfy the requirement. Preserve explicit `Unknown` / `Not recorded` states. Do not infer recovery, compensation, redemption, migration, regulatory or final-outcome values that canonical data does not support.

## Completed SEO / GA4 migration audit

The bounded SEO / GA4 migration audit is closed. Accepted repository-side evidence:

```text
Closeout contract: config/seo-ga4-migration-closeout.json
Verified main: 9277d04ca7e463e3a965473b82a7c15ef117a5fb
Production run: 32035190608 — success
Production job: 95403850881 — success
Official-origin validation: success
GA4 static-build verification: success
Cloudflare Pages upload: success
Deployed-production verification: success
Canonical delta: 0
```

Binding migration rules remain:

```text
Official public origin: https://www.stableorgone.com
Legacy redirect: https://sog.badjoke-lab.com/<path>?<query> -> 301 https://www.stableorgone.com/<path>?<query>
GA4 variable: PUBLIC_GA_MEASUREMENT_ID
Reuse existing SOG GA4 identity: yes
Create / guess / hardcode a Measurement ID: no
```

Google Search Console ownership, Change of Address, sitemap submission, and GA4 account administration outside the existing build variable remain account-side state and are not proven by repository evidence alone.

## Historical non-UI acceptance checkpoints

These remain baseline lineage, not standing authority outside their accepted regression contracts:

```text
PR #493 — migrated SOG to https://www.stableorgone.com as the single official production origin
PR #500 — deepened the bounded MNEE Evidence/archive/control review without forcing unsupported unknowns closed
PR #517 — added complete canonical Bison Bank EUB/USB records and established the 119-asset / 186-deployment checkpoint lineage
PR #565 — recorded SEO / GA4 migration exact-main acceptance evidence
PR #567 — authorized Ledger Series Phase 3 lifecycle strengthening
```

## Current Stablecoin mark contract

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral monogram fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: no
Canonical delta: 0
```

## Permanent future record-growth logo gate

Core `.github/workflows/ci.yml` runs:

```text
node scripts/audit-stablecoin-logo-coverage.mjs
```

on every pull request without data-path exclusions. Every future canonical Stablecoin addition must satisfy `docs/quality/stablecoin-logo-disposition-operating-spec.md`.

A neutral fallback is valid. Missing disposition is not.

## Enduring Compare behavior

The accepted Compare behavior remains a regression contract:

```text
control: Hide matching rows
differing attribute count: visible
matching shown/hidden count: visible
no-op copy: All displayed attributes already differ. Nothing to hide.
Compare marks: same pre-rendered StablecoinMark result used elsewhere
Compare-only logo map: none
remote runtime fetch: none
```

Do not regress 2–4 selection, fifth-selection rejection, URL order/history restoration, explicit `Unknown` / `Not recorded`, bounded mobile matrix scrolling, or accepted Compare dock/footer behavior.

## Required work-start protocol during LEDGER_SERIES_PHASE3

Before each substantive Phase 3 work item:

1. Read `AGENTS.md`, `docs/spec-governance.md`, `docs/roadmap.md`, `docs/deployment-policy.md`, and `config/ledger-series-phase3-authority.json`.
2. Confirm current main, canonical counts/hash, open PRs, and current production state.
3. Audit the existing implementation before adding a parallel surface.
4. Keep canonical/schema changes out of this authority. If they become necessary, stop and create a separate reviewed authority.
5. For material public changes, require PR CI green, merge, and exact-main production verification.

## Preserved exclusions during LEDGER_SERIES_PHASE3

No current authority exists for:

```text
canonical archive mutation
canonical Market Access mutation
new Evidence identities or Evidence Relations
stable-asset additions/deletions
schema/taxonomy change
additional logo promotion
new unrelated public route family
ranking / scoring / recommendation
unrelated sitewide redesign
DNS / Cloudflare account mutation
new GA4 property or Measurement ID creation
measurement ID guessing or hardcoding
automatic continuation beyond Phase 3 closeout
```

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Issue #479 remains the deployment-history authority.
