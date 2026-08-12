# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-12

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
Current closeout contract: config/compare-logo-phase-e-closeout.json
Current closeout spec: docs/quality/compare-logo-phase-e-closeout-spec.md
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-logo-phase-e-closeout.md
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Additional direct-logo promotions authorized: false
New public route family authorized: false
Ranking / scoring / recommendation authorized: false
Automatic continuation: false
```

No substantive implementation may begin from `REVIEW_GATE` without a fresh reviewed authority.

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

## 4. Completed Compare / Stablecoin logo maintenance lane

The lane established by PR #554 is closed after Phase E:

```text
PR #554 — Phase A authority/specification/schedule
PR #555 — Phase B exact 21-fallback reviewed result
PR #556 — Phase C Compare matching-row feedback + Compare marks
PR #557 — Phase D mnee/usdgo/usr import + permanent future-growth gate
Phase E closeout — exact-main verification + targeted visual regression + REVIEW_GATE restoration
```

Binding historical packages remain available for audit:

```text
config/compare-logo-maintenance-authority.json
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
config/compare-phase-c-implementation-result.json
config/compare-logo-phase-d-implementation-result.json
config/compare-logo-phase-e-closeout.json
```

Historical lineage does not authorize new work merely because it remains in repository history.

## 5. Accepted Stablecoin mark state

```text
Canonical Stablecoins: 119
Reviewed dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Last reviewed promotions: mnee, usdgo, usr
Remote runtime image fetching: false
```

No additional promotion is authorized at the current gate.

Imported asset identities remain pinned by the Phase D result. The USDGO Phase B Anchorage illustration was rejected during Phase D; the accepted `usdgo.svg` is the compact first-party homepage mark.

## 6. Phase E verification record

Exact Phase D merged main:

```text
bb72108ea53d96a69db42d5c8e97df47033be44e
```

Verified production:

```text
Deploy production run: 31585897410
Job: 94079531335
Conclusion: success
Official origin: https://www.stableorgone.com
```

Verified exact-main visual/all-record run:

```text
Capture representative public page screenshots: 31585897478
Job: 94079532861
Conclusion: success
Catalog: 119 cards / 101 direct / 18 fallback
Broken images: 0
Empty frames: 0
```

The Phase E closeout additionally strengthens browser regression coverage so `mnee`, `usdgo`, `usr`, and a preserved `acala-ausd` fallback are each checked on desktop and mobile. This is audit tooling, not a product-display change.

## 7. Permanent future-growth logo rule

The permanent operating specification remains:

```text
docs/quality/stablecoin-logo-disposition-operating-spec.md
```

Core CI runs:

```text
node scripts/audit-stablecoin-logo-coverage.mjs
```

on every pull request without data-path exclusions.

Required invariants:

```text
reviewed decision count equals canonical Stablecoin count
every canonical slug has exactly one reviewed disposition
direct-logo assets exist locally and resolve consistently
fallbacks are explicit in display policy
resolver direct set equals reviewed direct set
orphan logo assets are rejected
```

A neutral fallback is a valid result. Missing reviewed disposition is not.

## 8. Enduring Compare regression contract

Accepted Phase C behavior remains binding as a regression contract:

```text
Hide matching rows
differing attribute count visible
matching shown/hidden count visible
All displayed attributes already differ. Nothing to hide.
toggle off restores complete aligned rows
Compare mark source is existing pre-rendered StablecoinMark output
Compare-only logo map: none
remote runtime image fetch: none
```

The existing Compare visual workflow remains the enforcement path for 2–4 selection, zero state, discovery/navigation/replacement, matching-row feedback, direct/fallback marks, and bounded mobile scrolling.

## 9. Work-start rule from REVIEW_GATE

A fresh authority must explicitly define:

- scope and exclusions;
- canonical/public boundary;
- entry main and relevant baselines;
- required evidence/research inputs;
- implementation sequence;
- automated and direct visual acceptance artifacts where applicable;
- production verification requirements;
- closeout behavior and whether continuation is allowed.

A schedule window, chat instruction, historical PR, prior research output, or available asset does not itself create authority.

## 10. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
Current stage: REVIEW_GATE
canonical delta authorized = 0
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
additional logo promotions authorized = false
new public route families authorized = false
ranking / scoring / recommendation authorized = false
Automatic continuation: false
```

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Issue #479 remains the deployment-history authority.
