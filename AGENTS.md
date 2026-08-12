# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: Compare feedback and Stablecoin logo maintenance authority active after merge
Current stage: MAINTENANCE_AUTHORITY
Current authority contract: config/compare-logo-maintenance-authority.json
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
Current quality spec: docs/quality/compare-logo-maintenance-spec.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current public maintenance boundary: Compare feedback / Compare marks / 21-fallback logo re-audit / future record-growth logo gate
Canonical delta authorized by this lane: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: no
Automatic continuation beyond closeout: false
Entry main commit: e28e60beeea07a0a6dfd7af217d2c3b9ac616bbd
Current canonical checkpoint: sog_evidence_archive_payload_verification_batch_2_canonical_119_checkpoint_pr552_2026_08_12
Current production commit: ada106dd3bf9899adc441c968fa36978ae515a5c
Current canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Official public origin: https://www.stableorgone.com
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

The repository entered this maintenance lane only after Evidence Archive Payload Verification Batch 2 was implemented by PR #552, production-verified by run `31514472928`, and closed by PR #553. The current maintenance authority therefore starts from the post-PR552 canonical state and must not reintroduce the older pre-archive `463 / 122` partition or old canonical hash.

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

## Current Stablecoin logo display baseline

```text
Canonical stablecoins: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
Baseline fallback population: frozen in config/compare-logo-maintenance-authority.json
```

The 21 fallback records must be re-audited before any display-count change. A direct-logo promotion requires reviewed Stablecoin/product-specific attribution plus local asset/provenance handling. Issuer/project/directory artwork must not be presented as a token logo without asset-specific attribution.

`mnee`, `bison-bank-eub`, and `bison-bank-usb` are priority rechecks because they were added after the original 116-record logo closure and all remain neutral fallbacks. Priority does not predetermine promotion.

## Current required sequence

```text
Phase A  authority/specification/schedule merge
Phase B  fresh reviewed result for all 21 neutral fallbacks
Phase C  Compare matching-row feedback + Compare mark display implementation
Phase D  reviewed eligible logo imports + permanent future growth logo gate
Phase E  direct desktop/mobile artifact review + production verification + closeout
closeout  restore repository REVIEW_GATE; no automatic continuation
```

Do not skip directly from Phase A to logo promotion. Phase D may use only Phase-B-reviewed direct-logo outcomes.

## Compare behavior required by the current spec

The matching-row control means only:

```text
hide a row when every selected record has the same normalized displayed value for that attribute
```

The implementation must make a no-op visible. If all displayed rows already differ, the UI must explicitly say there are no matching rows to hide. Blocking tests must include one deterministic selection where enabling the control reduces visible rows and another where all rows already differ and the explicit no-op feedback appears.

Compare record headers must render the same audited Stablecoin mark result used elsewhere: direct local Stablecoin/product logo or neutral monogram fallback. Reuse `StablecoinMark` / `stablecoinLogo` semantics; no independent Compare-only map and no remote runtime image fetch.

## Permanent future record-growth logo rule

Every future PR that authorizes or implements a new canonical stablecoin must cite `docs/quality/stablecoin-logo-disposition-operating-spec.md` and include logo disposition in its complete-record requirement.

A new canonical stablecoin may validly end as a neutral fallback. It may not merge with no reviewed disposition.

Blocking expectations include:

```text
logo decision count equals canonical stablecoin count
all new canonical slugs have reviewed dispositions
direct-logo assets exist locally and resolve consistently
fallbacks are explicit in display policy
canonical stablecoin additions trigger logo coverage validation
```

## Mandatory reading order

Before substantive continuation in this lane, read and cite:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md`
6. `docs/quality/compare-logo-maintenance-spec.md`
7. `docs/quality/stablecoin-logo-disposition-operating-spec.md`
8. `config/compare-logo-maintenance-authority.json`
9. `docs/ui-v3-remediation-authority.md`
10. `config/stablecoin-logo-display-policy.json`
11. `config/stablecoin-logo-decisions.json`
12. `config/stablecoin-logo-decisions-additions.json`
13. the immediately preceding reviewed result for the phase being started

The post-PR552 closeout remains the entry-state authority and must be consulted whenever canonical baseline questions arise:

```text
config/post-pr552-evidence-archive-batch2-closeout.json
docs/roadmap-amendments/2026-08-12-post-pr552-evidence-archive-batch2-closeout.md
docs/quality/post-pr552-evidence-archive-batch2-closeout-spec.md
```

## Completed Evidence Archive Payload Verification Batch 2 implementation

PR #551 authorized exactly eight reviewed dated `archived_url` additions. PR #552 implemented exactly those eight values and production run `31514472928` verified main commit `ada106dd3bf9899adc441c968fa36978ae515a5c`.

Accepted result:

```text
Evidence identities: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
```

The two reviewed no-safe-change Evidence identities remain unchanged. PR #551/#552 are completed lineage and authorize no further archive work.

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
```

PR #544–#547 are historical Compare lineage and do not authorize the new matching-row or mark-display work.

## Exit

This maintenance lane closes only after direct changed-state desktop/mobile artifact review, exact-main production verification, and a closeout that restores a fresh repository `REVIEW_GATE`.

No canonical archive, Market Access, record growth, Guide, ranking, scoring, recommendation, new route family, or unrelated UI work is automatically authorized after closeout.

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Automated success must not override a known visual defect. Issue #479 remains the deployment-history authority.
