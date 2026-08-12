# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: Compare feedback and Stablecoin logo maintenance authority active; Phase C Compare remediation complete after current implementation merge
Current stage: MAINTENANCE_AUTHORITY_PHASE_D_NEXT
Current authority contract: config/compare-logo-maintenance-authority.json
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
Current quality spec: docs/quality/compare-phase-c-review-result-spec.md
Current implementation result: config/compare-phase-c-implementation-result.json
Phase B review source: data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
Parent implementation spec: docs/quality/compare-logo-maintenance-spec.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current public maintenance boundary: Phase D reviewed logo imports + permanent future record-growth logo gate
Canonical delta authorized by this lane: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Automatic continuation beyond closeout: false
Entry main commit for Phase C: dc1f2925f6dbd40c50267a2de2b4f85e2fe580b5
Current canonical checkpoint: sog_evidence_archive_payload_verification_batch_2_canonical_119_checkpoint_pr552_2026_08_12
Current production commit before Phase C: dc1f2925f6dbd40c50267a2de2b4f85e2fe580b5
Phase B production run: 31566866583 — success
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Official public origin: https://www.stableorgone.com
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

The maintenance lane starts from the post-PR552 canonical state. PR #554 merged the governing Compare/logo authority. PR #555 then re-audited exactly the 21 neutral fallbacks without changing public mappings, assets, or canonical data. Phase C implements the bounded Compare feedback/mark repair and establishes Phase D as the next permitted maintenance stage only after the Phase C implementation/review merge.

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

## Phase B reviewed logo result

```text
Baseline canonical stablecoins: 119
Current public direct Stablecoin/product logos: 98
Current public neutral fallbacks: 21
Phase B reviewed: 21 / 21
Reviewed direct-logo outcomes: 3
Reviewed neutral-fallback outcomes: 18
Phase-D-approved direct-logo slugs: mnee, usdgo, usr
Expected display partition only after successful Phase D import: 101 direct / 18 fallback
Public display partition changed by Phase B or Phase C: no
```

The Phase B machine-readable source of truth is:

`data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json`

Only `mnee`, `usdgo`, and `usr` may be promoted by Phase D from this review. The other 18 baseline fallbacks must remain neutral unless a separately reviewed evidence change reopens them.

## Phase C accepted Compare result

Phase C is governed by:

```text
config/compare-phase-c-implementation-result.json
docs/quality/compare-phase-c-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
```

Accepted behavior after the implementation/review merge:

```text
matching-row control: Hide matching rows
differing attribute count: visible
matching shown/hidden count: visible
all-different no-op: All displayed attributes already differ. Nothing to hide.
Compare marks: cloned pre-rendered StablecoinMark output
Compare-only logo map: none
remote runtime image fetch: none
new logo assets imported in Phase C: 0
public logo partition: 98 direct / 21 fallback
```

The existing `Stablecoin compare matrix visual acceptance` workflow remains the browser authority. Its Phase C audit must prove deterministic row reduction, all-different no-op feedback, toggle-off restoration, direct/fallback marks on desktop/mobile, and bounded mobile horizontal scrolling while the older 2–4 selection, zero-state, discovery/navigation and replacement audits continue to pass.

## Current required sequence

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  21-fallback fresh reviewed result — complete in PR #555
Phase C  Compare matching-row feedback + Compare mark display — complete after current implementation/review merge
Phase D  import only mnee/usdgo/usr + permanent future growth logo gate — NEXT after Phase C merge
Phase E  direct desktop/mobile artifact review + production verification + closeout — BLOCKED until Phase D
closeout  restore repository REVIEW_GATE; no automatic continuation
```

Do not collapse Phase D and Phase E. Phase D must cite both the Phase B reviewed result and the merged Phase C result before changing any logo asset, display policy, or record-growth validation.

## Completed Phase C Compare behavior contract

The matching-row control means only:

```text
hide a row when every selected record has the same normalized displayed value for that attribute
```

Accepted behavior:

```text
label: Hide matching rows
show differing attribute count
show matching shown count when disabled
show matching-hidden count when enabled
show explicit no-op feedback when all displayed rows already differ
disabling the control restores the full comparison
```

Compare record headers render the same audited Stablecoin mark result used elsewhere: direct local Stablecoin/product logo or neutral monogram fallback. The implementation reuses `StablecoinMark` / `stablecoinLogo` semantics; it must not grow a separate Compare-only map or remote runtime fetch.

Preserve 2–4 selected records, fifth-selection rejection, URL order/history restoration, explicit `Unknown` / `Not recorded`, bounded mobile matrix scrolling, and the accepted Compare dock/footer non-overlap behavior.

## Permanent future record-growth logo rule

Every future PR that authorizes or implements a new canonical stablecoin must cite `docs/quality/stablecoin-logo-disposition-operating-spec.md` and include logo disposition in its complete-record requirement.

A new canonical stablecoin may validly end as a neutral fallback. It may not merge with no reviewed disposition.

Phase D must make these blocking expectations permanent in core validation:

```text
logo decision count equals canonical stablecoin count
all new canonical slugs have reviewed dispositions
direct-logo assets exist locally and resolve consistently
fallbacks are explicit in display policy
canonical stablecoin additions trigger logo coverage validation
```

## Mandatory reading order

Before substantive continuation in Phase D, read and cite:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md`
6. `docs/quality/compare-logo-maintenance-spec.md`
7. `docs/quality/stablecoin-logo-disposition-operating-spec.md`
8. `config/compare-logo-maintenance-authority.json`
9. `docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md`
10. `docs/quality/compare-logo-fallback-reaudit-review-result-spec.md`
11. `data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json`
12. `docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md`
13. `docs/quality/compare-phase-c-review-result-spec.md`
14. `config/compare-phase-c-implementation-result.json`
15. `docs/ui-v3-remediation-authority.md`
16. `config/stablecoin-logo-display-policy.json`
17. `config/stablecoin-logo-decisions.json`
18. `config/stablecoin-logo-decisions-additions.json`

Then read the immediately preceding reviewed result for any later phase. No implementation should proceed from chat memory alone.

The post-PR552 closeout remains the canonical entry-state reference whenever canonical-baseline questions arise:

```text
config/post-pr552-evidence-archive-batch2-closeout.json
docs/roadmap-amendments/2026-08-12-post-pr552-evidence-archive-batch2-closeout.md
docs/quality/post-pr552-evidence-archive-batch2-closeout-spec.md
```

## Completed Evidence Archive Payload Verification Batch 2 implementation

PR #551 authorized exactly eight reviewed dated `archived_url` additions. PR #552 implemented exactly those eight values and production run `31514472928` verified main commit `ada106dd3bf9899adc441c968fa36978ae515a5c`. PR #553 restored `REVIEW_GATE` before the current maintenance lane started.

Accepted result:

```text
Evidence identities: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
```

PR #551/#552/#553 are completed lineage and authorize no further archive work.

## Historical authority anchors

```text
PR #493 — official-domain migration and production verification
PR #498 — MNEE complete-record addition
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB/USB complete-record growth checkpoint
PR #523 — JPYSC Market Access implementation
PR #534 — REVIEW_GATE restoration
PR #537/#538/#539 — Evidence Archive Payload Verification Batch 2 research lineage
PR #543 — clean Evidence Archive Batch 2 review-result landing
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout
PR #548/#549/#550 — Russia USDT Guide authority / implementation / closeout
PR #551/#552/#553 — Evidence Archive Batch 2 implementation authority / implementation / closeout
PR #554 — Compare feedback / logo maintenance authority and schedule
PR #555 — Phase B 21-fallback reviewed result
PR #556 — Phase C Compare feedback / mark implementation and review result
```

PR #544–#547 are historical Compare lineage and do not authorize later logo imports or record-growth work. Current Phase D authority derives only from PR #554 plus the merged Phase B and Phase C reviewed results.

## Exit

This maintenance lane closes only after Phase D and Phase E complete in order, changed-state desktop/mobile artifacts are directly inspected, exact-main production verification succeeds, and a closeout restores a fresh repository `REVIEW_GATE`.

No canonical archive, Market Access, record growth, Guide, ranking, scoring, recommendation, new route family, or unrelated UI work is automatically authorized after closeout.

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Automated success must not override a known visual defect. Issue #479 remains the deployment-history authority.