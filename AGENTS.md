# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: Compare feedback and Stablecoin logo maintenance authority active; Phase D logo import/growth gate complete after current merge
Current stage: MAINTENANCE_AUTHORITY_PHASE_E_NEXT
Current authority contract: config/compare-logo-maintenance-authority.json
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
Current quality spec: docs/quality/compare-logo-phase-d-review-result-spec.md
Current implementation result: config/compare-logo-phase-d-implementation-result.json
Preceding implementation result: config/compare-phase-c-implementation-result.json
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current public maintenance boundary: Phase E verification and closeout only
Canonical delta authorized by this lane: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Additional logo promotions authorized: no
Automatic continuation beyond closeout: false
Entry main commit for Phase D: c24b9ea9f98573a949c91bd512ef1413311226c6
Current canonical checkpoint: sog_evidence_archive_payload_verification_batch_2_canonical_119_checkpoint_pr552_2026_08_12
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Official public origin: https://www.stableorgone.com
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

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

## Current Stablecoin mark state after Phase D

```text
Canonical Stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral monogram fallbacks: 18
Phase D promotions: mnee, usdgo, usr
Other Phase B fallbacks preserved: 18
Remote runtime image fetching: no
Canonical delta: 0
```

Binding Phase D package:

```text
config/compare-logo-phase-d-implementation-result.json
docs/quality/compare-logo-phase-d-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
```

Phase D imported only the three slugs authorized by Phase B and Phase C. No fourth logo promotion is authorized under this maintenance lane.

### Phase D source correction

The Phase B USDGO candidate image from Anchorage was directly inspected in Phase D and rejected as a product illustration rather than a compact mark. The imported `usdgo.svg` is instead the compact inline header logo from the current first-party `usdgo.com` homepage, corroborated by OSL official USDGO listing artwork. This correction stays inside the already-authorized `usdgo` slug and does not expand the allow-list.

## Permanent future record-growth logo gate

Core `.github/workflows/ci.yml` now runs:

```text
node scripts/audit-stablecoin-logo-coverage.mjs
```

on every pull request without data-path exclusions.

Every future canonical Stablecoin addition must therefore satisfy the permanent operating specification:

```text
docs/quality/stablecoin-logo-disposition-operating-spec.md
```

Blocking invariants include:

```text
reviewed logo decision count == canonical Stablecoin count
every canonical Stablecoin slug has exactly one reviewed disposition
direct-logo assets exist locally and resolve consistently
neutral fallbacks are explicit in display policy
resolver direct set equals reviewed direct-logo set
orphan logo assets are rejected
```

A neutral fallback is valid. Missing disposition is not. Data-only record growth cannot bypass this gate.

## Completed Phase C Compare behavior

Phase C remains a historical accepted result:

```text
control: Hide matching rows
differing attribute count: visible
matching shown/hidden count: visible
no-op copy: All displayed attributes already differ. Nothing to hide.
Compare marks: same pre-rendered StablecoinMark result used elsewhere
Compare-only logo map: none
remote runtime fetch: none
```

Do not regress 2–4 selection, fifth-selection rejection, URL order/history restoration, explicit `Unknown` / `Not recorded`, bounded mobile matrix scrolling, or the accepted Compare dock/footer behavior.

## Current required sequence

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  exact 21-fallback fresh reviewed result — complete in PR #555
Phase C  Compare matching-row feedback + Compare marks — complete in PR #556
Phase D  import mnee/usdgo/usr + permanent growth gate — complete after current Phase D merge
Phase E  changed-state artifact review + all-record mark validation + exact-main production verification + closeout — NEXT
closeout  restore repository REVIEW_GATE; no automatic continuation
```

Do not collapse Phase E into new implementation work. Phase E verifies and closes the merged Phase D state; it does not create a fourth logo promotion or reopen canonical work.

## Phase E acceptance contract

Phase E must directly inspect and verify:

```text
MNEE direct mark — desktop and mobile
USDGO direct mark — desktop and mobile
USR direct mark — desktop and mobile
preserved neutral fallback — desktop and mobile
all-record Stablecoin mark catalog — 119 / 119
public display partition — 101 direct / 18 fallback
reviewed dispositions — 119 / 119
no orphan logo assets
no page-level overflow / clipping / footer-overlap regression
exact-main production deployment at https://www.stableorgone.com
canonical hash/file count unchanged
```

Automated green checks do not override a visible defect. If direct artifact inspection finds a wrong, clipped, misleading, or unreadable mark, Phase E must not close until it is corrected under reviewed authority.

## Mandatory reading order

Before substantive continuation in Phase E, read and cite:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md`
6. `docs/quality/compare-logo-maintenance-spec.md`
7. `docs/quality/stablecoin-logo-disposition-operating-spec.md`
8. `config/compare-logo-maintenance-authority.json`
9. `data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json`
10. `config/compare-phase-c-implementation-result.json`
11. `docs/quality/compare-phase-c-review-result-spec.md`
12. `docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md`
13. `config/compare-logo-phase-d-implementation-result.json`
14. `docs/quality/compare-logo-phase-d-review-result-spec.md`
15. `docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md`
16. `docs/ui-v3-remediation-authority.md`
17. `config/stablecoin-logo-display-policy.json`
18. `config/stablecoin-logo-decisions.json`
19. `config/stablecoin-logo-decisions-additions.json`
20. `public/stablecoin-logos/README.md`

No implementation or closeout should proceed from chat memory alone.

## Historical anchors

```text
PR #493 — official-domain migration and production verification
PR #498 — MNEE complete-record addition
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB/USB complete-record growth checkpoint
PR #523 — JPYSC Market Access implementation
PR #534 — REVIEW_GATE restoration
PR #537/#538/#539 — Evidence Archive Payload Verification Batch 2 research lineage
PR #543 — clean Evidence Archive Batch 2 review result
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout
PR #548/#549/#550 — Russia USDT Guide authority / implementation / closeout
PR #551/#552/#553 — Evidence Archive Batch 2 implementation / closeout
PR #554 — Compare feedback / logo maintenance authority
PR #555 — Phase B 21-fallback reviewed result
PR #556 — Phase C Compare feedback / mark implementation
current Phase D PR — approved logo import + permanent growth gate
```

Old lineage does not authorize new work merely because it is still present in repository history.

## Exit

This maintenance lane closes only after Phase E directly verifies the changed-state artifacts and all-record mark catalog, exact-main production verification succeeds, and closeout restores a fresh repository `REVIEW_GATE`.

No canonical archive, Market Access, record growth, Guide, ranking, scoring, recommendation, new route family, additional logo promotion, or unrelated UI work is automatically authorized after closeout.

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Issue #479 remains the deployment-history authority.
