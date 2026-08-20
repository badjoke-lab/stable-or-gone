# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-20

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
Current stage: REVIEW_GATE
Active implementation authority: none
Current closeout contract: config/ledger-series-phase9-closeout.json
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Additional direct-logo promotions authorized: false
New unrelated public route family authorized: false
New lifecycle/search/filter expansion authorized: false
New Compare expansion authorized: false
New Stats expansion authorized: false
New Series expansion / typed relationship promotion authorized: false
Ranking / scoring / recommendation authorized: false
DNS / Cloudflare account mutation authorized: false
New GA4 property / Measurement ID creation authorized: false
Automatic continuation: false
```

No substantive new implementation is authorized from REVIEW_GATE. A fresh reviewed authority is required before work begins.

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

## 4. Completed cross-registry Ledger Series Phase 9 adapter authority

The reviewed implementation authority and closeout are historical lineage:

```text
config/ledger-series-phase9-authority.json
docs/roadmap-amendments/2026-08-20-ledger-series-phase9-authority.md
config/ledger-series-phase9-closeout.json
```

Accepted sequence:

```text
fresh authority from REVIEW_GATE: complete
-> native machine contract confirmation: complete
-> Series descriptor/index/119 envelopes: complete
-> deterministic Series validation and existing regression gates: complete
-> exact-head merge: complete
-> exact-main production verification: complete
-> closeout to REVIEW_GATE: complete after closeout merge
```

Accepted exact-main evidence:

```text
Verified main: bd84caf11e2decd0250260bbfe2551e42b6a955f
Production run: 32325360838 — success
Production job: 96295386599 — success
Series records: 119
Series JSON production equality: 121 / 121
Global keys unique: 119 / 119
Representative human routes: success
Canonical delta: 0
Schema/taxonomy delta: 0
UI/Search/Compare/Stats behavior delta: 0
```

The accepted `/data/series/` layer is an additive canonical-only projection over the existing reviewed native dossiers. It does not replace the native SOG data model, does not authorize canonical mutation, and does not infer typed Series relationships during Stage 3. This behavior is an enduring regression contract, not standing authority for further Series expansion.

## 5. Completed Ledger Series Phase 3 authority

The reviewed implementation authority and closeout are historical lineage:

```text
config/ledger-series-phase3-authority.json
docs/roadmap-amendments/2026-08-17-ledger-series-phase3-authority.md
config/ledger-series-phase3-closeout.json
```

Accepted sequence:

```text
representative lifecycle + surface audit: complete
-> schema/canonical decision gate: pass without mutation
-> deterministic per-asset JSON: complete
-> structured-filter gap closure: complete
-> Compare lifecycle/outcome gap closure: complete
-> Stats lifecycle/quality gap closure: complete
-> exact-main production verification: complete
-> Phase 3 closeout to REVIEW_GATE: complete after closeout merge
```

Accepted exact-main evidence:

```text
Verified main: 6cac1ef858d35e2a8c015142f29011e4aff33fdc
Production run: 32153641423 — success
Production job: 95765437402 — success
Stablecoin dossiers verified: 119
Phase 3 cross-surface verification: success
Canonical delta: 0
Schema/taxonomy delta: 0
```

The accepted Phase 3 machine-readable, filter, Compare, Stats, and production-verification behavior is an enduring regression contract. It is not standing authority for additional product expansion.

## 6. Completed SEO / GA4 migration audit

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

## 7. Accepted Stablecoin mark state

```text
Canonical Stablecoins: 119
Reviewed dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: false
```

## 8. Permanent future-growth logo rule

`docs/quality/stablecoin-logo-disposition-operating-spec.md` remains binding. Core CI must continue to block canonical stablecoin growth that lacks an explicit reviewed logo disposition. A neutral fallback is valid; missing disposition is not.

## 9. Enduring Compare, Phase 3, and Series regression contracts

Accepted Compare behavior remains binding: matching-row feedback, 2–4 selection behavior, URL/history restoration, explicit unknown states, StablecoinMark reuse, and bounded mobile scrolling must not regress.

The reviewed Phase 3 per-asset JSON, Event lifecycle / Depeg recovery filters, lifecycle Compare fields, lifecycle-quality Stats, and production cross-surface verifier also remain binding regression contracts unless a future reviewed authority explicitly changes them.

The accepted Series descriptor, index, and 119 stablecoin envelopes must remain canonical-only, official-origin-only, lossless over the native dossier, and free of inferred typed Series relationships unless a future reviewed authority explicitly changes that contract.

## 10. Work-start rule from REVIEW_GATE

Before substantive new work:

1. Confirm current main, canonical counts/hash, open PRs, and production state.
2. Read `docs/ai-era-registry-spec.md`, `docs/ai-era-execution-schedule.md`, the permanent operating specifications, and enduring regression authorities relevant to the proposed work.
3. Audit the existing public/data surface before proposing a parallel implementation.
4. Create and merge a fresh reviewed authority defining scope, canonical/public boundaries, acceptance evidence, and closeout behavior.
5. Do not infer authority from historical Phase 3 or Phase 9 permissions, chat instructions, old PRs, or stale branches.

## 11. Canonical/public safety at REVIEW_GATE

```text
canonical_only = true
includes_unreviewed_candidates = false
canonical delta authorized = 0
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
additional logo promotions authorized = false
new unrelated public route families authorized = false
new lifecycle/search/filter/Compare/Stats expansion authorized = false
new Series expansion / typed relationship promotion authorized = false
ranking / scoring / recommendation authorized = false
DNS / Cloudflare account mutation authorized = false
new GA4 property / Measurement ID creation authorized = false
Automatic continuation = false
```

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Issue #479 remains the deployment-history authority.
