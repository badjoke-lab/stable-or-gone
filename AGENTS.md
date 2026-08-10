# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: Stablecoin Compare Discovery and Navigation Remediation authorized
Current stage: AUTHORIZED_UI_REMEDIATION
Current authority: Stablecoin Compare Discovery and Navigation Remediation
Authority config: config/stablecoin-compare-discovery-navigation-authority.json
Public route: /stablecoins/
Canonical implementation authority: REVIEW_GATE
Canonical archive additions authorized: 0
Preserved Evidence Archive review: 10 reviewed / 8 proposals / 2 no-safe-change
Current canonical checkpoint: sog_jpysc_market_access_pilot_3_canonical_119_checkpoint_pr523_2026_08_05
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Official public origin: https://www.stableorgone.com
```

The Stablecoin Compare Discovery and Navigation Remediation is a bounded public-UI repair triggered by direct production review. The current comparison matrix works, but its placement after the full register/pagination and lack of persistent navigation make comparison hard to discover and force repeated scrolling when candidates change.

The authorized implementation must move the comparison panel ahead of the register results, add a persistent Compare dock after the first selection, add an explicit `View comparison` action, and allow `Add / replace record` directly inside the comparison area. It must preserve the existing two-to-four-column matrix, `Differences only`, URL restoration, explicit unknown/not-recorded values, fifth-selection rejection, and bounded mobile horizontal scrolling.

The Evidence Archive Payload Verification Batch 2 review result is preserved unchanged at `REVIEW_GATE`: ten reviewed, eight dated proposals, two no-safe-change, and zero canonical archive promotions authorized. No proposed archive URL may be implemented by this UI authority.

## Current reviewed canonical counts

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
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked routes: 422
```

## Historical authority anchors

```text
PR #493 — official-domain migration and production verification
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB/USB complete-record growth checkpoint
PR #522 — semantic authority for PR #523
PR #523 — last canonical-changing implementation
PR #534 — REVIEW_GATE restoration
PR #535/#536 — Japan Market Access Expansion Review Batch 1
PR #537 — Evidence Archive Payload Verification Batch 2 review authority
PR #538 — deterministic Batch 2 candidate set
PR #539 — manual network/payload research lineage
PR #540 — Stablecoin Compare Matrix Remediation authority
PR #541 — Stablecoin Compare Matrix implementation
PR #542 — Compare closeout and Evidence review restoration
PR #543 — clean Evidence Archive Batch 2 review-result landing
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

## Mandatory reading order

Before substantive continuation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-10-stablecoin-compare-discovery-navigation-remediation.md`
6. `docs/quality/stablecoin-compare-discovery-navigation-remediation-spec.md`
7. `config/stablecoin-compare-discovery-navigation-authority.json`
8. `docs/ui-v3-remediation-authority.md`
9. the completed Evidence Archive Batch 2 review-result amendment/spec/artifact when preserving the paused data lane

## Stablecoin Compare Discovery and Navigation Remediation

```text
route: /stablecoins/
selection ready: 2
selection maximum: 4
dock visible from: 1 selected
canonical delta: 0
archive implementation authority: 0
exit after production verification: REVIEW_GATE
```

Required product outcome:

```text
comparison panel before register results
persistent Compare dock after first selection
selected identities visible in dock
explicit View comparison action
in-panel Add / replace record control
remove then replace without register scroll
2 / 3 / 4 matrix preserved
Differences only preserved
shared compare URL restore preserved
Unknown / Not recorded preserved
mobile matrix overflow bounded to matrix shell
```

## Current boundary

Do not write any proposed archive URL into canonical Evidence. Do not alter canonical records, schema, taxonomy, routes, ranking/scoring/recommendation semantics, or unrelated sitewide UI. After the Compare discovery/navigation implementation is production-verified, this temporary UI authority must close and control returns to the preserved Evidence Archive `REVIEW_GATE`.

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority.

Issue #479 remains the deployment-history authority.
