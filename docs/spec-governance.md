# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-14

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
Current stage: SEO_GA4_MIGRATION_AUDIT_AUTHORITY
Active implementation authority: config/seo-ga4-migration-authority.json
Current quality spec: docs/quality/seo-ga4-migration-audit-spec.md
Current roadmap amendment: docs/roadmap-amendments/2026-08-14-seo-ga4-migration-audit-authority.md
Entry main commit: 3c715fa77d9e92d52d7646f6e6e944a43d7f5ea9
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Additional direct-logo promotions authorized: false
New public route family authorized: false
Ranking / scoring / recommendation authorized: false
DNS / Cloudflare account mutation authorized: false
New GA4 property / Measurement ID creation authorized: false
Automatic continuation: false
```

This is a bounded maintenance authority. It permits only official-origin/redirect/SEO artifact verification plus repair of existing GA4 build-time wiring and validation. It does not reopen canonical data, archive, Market Access, logo, route-family, DNS, or unrelated UI work.

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

## 4. Current SEO / analytics authority

Binding package:

```text
config/seo-ga4-migration-authority.json
docs/quality/seo-ga4-migration-audit-spec.md
docs/roadmap-amendments/2026-08-14-seo-ga4-migration-audit-authority.md
```

Required sequence:

```text
Phase A — authority/specification/schedule merge
Phase B — repository + live origin/redirect/analytics audit
Phase C — bounded GA4 production-build wiring/validation if required
Phase D — exact-main production verification
Closeout — restore REVIEW_GATE; no automatic continuation
```

The official public origin remains `https://www.stableorgone.com`. The legacy host remains migration-only and must preserve path/query through a 301 redirect. The GA4 lane must reuse the existing SOG analytics identity through `PUBLIC_GA_MEASUREMENT_ID`; creating, guessing, or hardcoding a new Measurement ID is forbidden.

Google Search Console ownership, Change of Address, and sitemap submission are account-side state. Repository evidence can establish public prerequisites but must not be represented as proof that those Google-account operations are complete.

## 5. Accepted Stablecoin mark state

```text
Canonical Stablecoins: 119
Reviewed dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: false
```

No additional promotion is authorized by the SEO/GA4 lane.

## 6. Permanent future-growth logo rule

`docs/quality/stablecoin-logo-disposition-operating-spec.md` remains binding. Core CI must continue to block canonical stablecoin growth that lacks an explicit reviewed logo disposition. A neutral fallback is valid; missing disposition is not.

## 7. Enduring Compare regression contract

Accepted Compare behavior remains binding: matching-row feedback, 2–4 selection behavior, URL/history restoration, explicit unknown states, StablecoinMark reuse, and bounded mobile scrolling must not regress. This lane does not authorize Compare changes.

## 8. Current work-start and closeout rule

Continuation must read the current authority package and remain inside its explicit boundaries. Any work outside that package requires a separate reviewed authority.

The current lane must close by restoring:

```text
Current stage: REVIEW_GATE
Active implementation authority: none
Automatic continuation: false
```

## 9. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
canonical delta authorized = 0
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
additional logo promotions authorized = false
new public route families authorized = false
ranking / scoring / recommendation authorized = false
DNS / Cloudflare account mutation authorized = false
new GA4 property / Measurement ID creation authorized = false
Automatic continuation = false
```

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Issue #479 remains the deployment-history authority.
