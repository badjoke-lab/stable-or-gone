# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-17

## 1. Authority rule

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts do not override merged repository authority.

Authority order:

1. `docs/deployment-policy.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. current reviewed authority / roadmap amendment, when one exists
5. current reviewed work-item result / closeout contract
6. permanent operating specifications
7. enduring regression authorities
8. named audits, baselines, queues, and reviewed prior outputs
9. conversation history and unmerged drafts

## 2. Current repository boundary

```text
Current stage: LEDGER_SERIES_PHASE3
Active implementation authority: config/ledger-series-phase3-authority.json
Previous closeout contract: config/seo-ga4-migration-closeout.json
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Additional direct-logo promotions authorized: false
New unrelated public route family authorized: false
Deterministic per-asset machine-readable JSON authorized: true
Existing search/filter extension authorized: true
Existing Compare extension authorized: true
Existing Stats extension authorized: true
Ranking / scoring / recommendation authorized: false
DNS / Cloudflare account mutation authorized: false
New GA4 property / Measurement ID creation authorized: false
Automatic continuation beyond closeout: false
```

All Phase 3 implementation must remain inside `config/ledger-series-phase3-authority.json`. Any required schema or canonical mutation requires a separate reviewed authority.

## 3. Current canonical state

```text
Stable assets: 119
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
Official public origin: https://www.stableorgone.com
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized: 0
```

## 4. Active Ledger Series Phase 3 authority

The current reviewed implementation authority is:

```text
config/ledger-series-phase3-authority.json
docs/roadmap-amendments/2026-08-17-ledger-series-phase3-authority.md
```

Required sequence:

```text
representative lifecycle + surface audit
-> schema/canonical decision gate
-> deterministic per-asset JSON if missing
-> structured-filter gap closure
-> Compare lifecycle/outcome gap closure
-> Stats lifecycle/quality gap closure
-> exact-main production verification
-> Phase 3 closeout to REVIEW_GATE
```

Existing surfaces must be audited before implementation. If a requirement is already satisfied, record it as implemented rather than creating a duplicate feature.

## 5. Completed SEO / GA4 migration audit

The bounded authority package is historical lineage:

```text
config/seo-ga4-migration-authority.json
docs/quality/seo-ga4-migration-audit-spec.md
docs/roadmap-amendments/2026-08-14-seo-ga4-migration-audit-authority.md
config/seo-ga4-migration-closeout.json
```

Accepted exact-main evidence:

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

The official public origin remains `https://www.stableorgone.com`. The legacy host remains migration-only and must preserve path/query through a 301 redirect. GA4 must reuse the existing SOG analytics identity through `PUBLIC_GA_MEASUREMENT_ID`; creating, guessing, or hardcoding a new Measurement ID remains forbidden without separate authority.

Google Search Console ownership, Change of Address, sitemap submission, and GA4 account administration outside the existing build variable are account-side state and are not proven by repository evidence alone.

## 6. Accepted Stablecoin mark state

```text
Canonical Stablecoins: 119
Reviewed dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: false
```

## 7. Permanent future-growth logo rule

`docs/quality/stablecoin-logo-disposition-operating-spec.md` remains binding. Core CI must continue to block canonical stablecoin growth that lacks an explicit reviewed logo disposition. A neutral fallback is valid; missing disposition is not.

## 8. Enduring Compare regression contract

Accepted Compare behavior remains binding: matching-row feedback, 2–4 selection behavior, URL/history restoration, explicit unknown states, StablecoinMark reuse, and bounded mobile scrolling must not regress.

## 9. Work-start rule during LEDGER_SERIES_PHASE3

Before each substantive work item:

1. Confirm current main, canonical counts/hash, open PRs, and production state.
2. Read the Phase 3 authority and relevant permanent operating specifications / regression authorities.
3. Audit the existing public/data surface before implementation.
4. Stop for separate reviewed authority if schema or canonical mutation is required.
5. For material public changes, require PR CI green, merge, and exact-main production verification.

## 10. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
canonical delta authorized = 0
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
additional logo promotions authorized = false
new unrelated public route families authorized = false
ranking / scoring / recommendation authorized = false
DNS / Cloudflare account mutation authorized = false
new GA4 property / Measurement ID creation authorized = false
Automatic continuation beyond Phase 3 closeout = false
```

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Issue #479 remains the deployment-history authority.
