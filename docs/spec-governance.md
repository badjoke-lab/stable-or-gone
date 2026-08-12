# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-12

## 1. Authority rule

Merged repository specifications are the source of truth. Chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts do not override merged repository authority.

Authority order:

1. `docs/deployment-policy.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. current merged roadmap amendment
5. current reviewed phase result / work-item contract
6. permanent operating specifications
7. enduring regression authorities
8. named audits, baselines, queues, and reviewed prior outputs
9. conversation history and unmerged drafts

Current repository boundary after the Phase D implementation/review merge:

```text
Current stage: MAINTENANCE_AUTHORITY_PHASE_E_NEXT
Parent authority: docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
Current reviewed result spec: docs/quality/compare-logo-phase-d-review-result-spec.md
Current implementation result: config/compare-logo-phase-d-implementation-result.json
Preceding result: config/compare-phase-c-implementation-result.json
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current public maintenance boundary: Phase E verification and closeout only
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Additional direct-logo promotions authorized: false
Automatic continuation beyond closeout: false
```

## 2. Current canonical state

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
Phase D entry main: c24b9ea9f98573a949c91bd512ef1413311226c6
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized by current lane: 0
```

There is no active canonical-record implementation authority.

## 3. Parent Compare / logo maintenance authority

The parent maintenance lane remains governed by:

```text
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
docs/ui-v3-remediation-authority.md
```

The parent package freezes the historical entry baseline of 119 canonical records, 98 direct logos, and 21 fallbacks. Child-phase validators own the later reviewed display state; the parent baseline must not be mistaken for the current display partition.

## 4. Phase B — reviewed fallback research complete

Binding result:

```text
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
```

Phase B reviewed exactly 21 fallbacks, approving `mnee`, `usdgo`, and `usr` for later direct-logo consideration and preserving 18 neutral outcomes. Phase B itself imported no asset and changed no public display policy.

## 5. Phase C — Compare implementation complete

Binding result:

```text
config/compare-phase-c-implementation-result.json
docs/quality/compare-phase-c-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
```

Accepted behavior:

```text
matching-row label: Hide matching rows
differing attribute count: visible
matching shown/hidden count: visible
all-different no-op: All displayed attributes already differ. Nothing to hide.
toggle off restores complete aligned rows
Compare mark source: existing pre-rendered StablecoinMark output
Compare-only logo map: none
remote runtime image fetch: none
Phase C logo imports: 0
Phase C canonical delta: 0
```

Phase C is now historical. Its validator must preserve the Phase C result itself without freezing the later Phase D display policy at 98 / 21.

## 6. Phase D — logo import and permanent growth gate complete after current merge

Binding result:

```text
config/compare-logo-phase-d-implementation-result.json
docs/quality/compare-logo-phase-d-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
```

Accepted current display partition:

```text
Canonical Stablecoins: 119
Reviewed dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Promoted slugs: mnee, usdgo, usr
```

No fourth promotion is authorized.

Imported asset identities are pinned by local path and SHA-256 in the Phase D machine-readable result. The old `usdgo.png` issuer mark and `usr.svg` generic project mark are removed after their product/token-specific replacements are accepted.

### USDGO source correction

The Anchorage image named in Phase B was directly inspected in Phase D and rejected as a product illustration rather than a compact mark. The imported `usdgo.svg` is the compact inline header logo from the current first-party USDGO homepage, corroborated by OSL official USDGO listing artwork. This correction stays within the already-approved `usdgo` slug and does not expand the allow-list.

### Permanent future-growth gate

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

A neutral fallback is a valid future growth result. Missing reviewed disposition is not. Data-only canonical Stablecoin growth cannot bypass this gate.

## 7. Phase E — current next boundary

Phase E is verification and closeout only.

It must directly inspect and verify:

```text
MNEE direct mark — desktop/mobile
USDGO direct mark — desktop/mobile
USR direct mark — desktop/mobile
preserved neutral fallback — desktop/mobile
all-record Stablecoin mark catalog — 119 / 119
public display partition — 101 direct / 18 fallback
reviewed disposition count — 119 / 119
no orphan logo files
no page-level overflow / clipping / footer-overlap regression
exact-main production deployment at https://www.stableorgone.com
canonical hash/file count unchanged
```

Phase E may not add a fourth logo, mutate canonical data, reopen archive/Market Access work, or introduce unrelated UI changes under this authority.

## 8. Required sequence

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  exact 21-fallback reviewed result — complete in PR #555
Phase C  Compare feedback + Compare mark display — complete in PR #556
Phase D  mnee/usdgo/usr import + permanent growth gate — complete after current merge
Phase E  direct artifact review + all-record validation + exact-main production verification + closeout — NEXT
closeout  restore repository REVIEW_GATE; no automatic continuation
```

A later stage must cite the immediately preceding merged reviewed result. No phase may be inferred from chat instructions alone.

## 9. Historical completed lanes

PR #544/#545/#546/#547 completed the prior Compare discovery/navigation remediation.  
PR #548/#549/#550 completed the Russia USDT Regulation Guide update.  
PR #551/#552/#553 completed Evidence Archive Payload Verification Batch 2 implementation and closeout.  
PR #554 established the current Compare/logo maintenance authority.  
PR #555 completed Phase B.  
PR #556 completed Phase C.  
The current Phase D PR completes the exact three logo imports and permanent growth gate.

Historical lineage does not authorize new work merely because it remains in repository history.

## 10. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
current stage = MAINTENANCE_AUTHORITY_PHASE_E_NEXT
canonical delta authorized = 0
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
new public route families authorized = false
additional logo promotions authorized = false
ranking / scoring / recommendation authorized = false
automatic continuation = false
```

Logo display assets/configuration are public-presentation maintenance, not canonical registry mutation.

## 11. Mandatory reading

Before substantive Phase E work, read:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
config/compare-logo-maintenance-authority.json
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
config/compare-phase-c-implementation-result.json
docs/quality/compare-phase-c-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
config/compare-logo-phase-d-implementation-result.json
docs/quality/compare-logo-phase-d-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
docs/ui-v3-remediation-authority.md
config/stablecoin-logo-display-policy.json
config/stablecoin-logo-decisions.json
config/stablecoin-logo-decisions-additions.json
public/stablecoin-logos/README.md
```

No continuation proceeds from chat memory alone.
