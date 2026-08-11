# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: Russia USDT Regulation Guide authority active
Current stage: PUBLIC_GUIDE_IMPLEMENTATION_AUTHORIZED
Current authority contract: config/russia-usdt-regulation-guide-authority-2026-08-11.json
Current roadmap amendment: docs/roadmap-amendments/2026-08-11-russia-usdt-regulation-guide-authority.md
Current quality spec: docs/quality/russia-usdt-regulation-guide-authority-2026-08-11-spec.md
Canonical implementation authority: REVIEW_GATE
Canonical Market Access promotion authorized: no
Canonical Evidence additions authorized: no
Authorized public Guide files: 3
Current canonical work boundary preserved: Evidence Archive Payload Verification Batch 2
Evidence Archive stage while Guide lane is active: REVIEW_GATE / preserved
Evidence Archive review: 10 reviewed / 8 proposals / 2 no-safe-change
Canonical archive additions authorized: 0
Current canonical checkpoint: sog_jpysc_market_access_pilot_3_canonical_119_checkpoint_pr523_2026_08_05
Current production commit: dynamic; verify via deploy-production workflow and Issue #479
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Canonical delta: 0
Official public origin: https://www.stableorgone.com
```

The current bounded lane exists to update SOG's Russia 2026 stablecoin-regulation Guide material after the July Russian crypto-market law and Bank of Russia implementation work. It does not authorize a canonical Market Access row or any stable-asset lifecycle change.

The source boundary distinguishes three levels. Bank of Russia's 21 July 2026 summary establishes a law effective 1 September 2026, non-qualified-investor access to the most liquid cryptocurrencies after testing and within RUB 300,000 per year via one intermediary, broader qualified-investor access, application of the requirements to foreign stablecoins, and continued prohibition on cryptocurrency payments within Russia. Bank of Russia's 27 July material establishes draft regulations for organised trading. A 4 June RBC report quoting First Deputy Governor Vladimir Chistyukhin identifies Bitcoin, Ethereum, and USDT as the initial three currencies currently meeting the principles. That interview-level statement must not be rewritten as a permanent statutory three-asset whitelist.

Watcher.Guru is discovery only. Its 2026-08-11 X post is not canonical Evidence and is not sufficient legal authority for public wording.

The only authorized public implementation targets are:

```text
src/pages/guides/russia-stablecoin-rules-2026/index.astro
src/pages/guides/global-stablecoin-regulation-2026/index.astro
src/data/guideCatalog.ts
```

`docs/market-access-record-spec.md` remains binding. Market Access Record v1 requires asset × jurisdiction × platform/service × function × access state × effective date. The Russia-wide legal framework does not itself establish a named provider/service function observation. Do not infer `buy_sell`, `deposit`, `withdrawal`, or `external_wallet_transfer` records from country-level law.

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
PR #540/#541 — first Stablecoin Compare matrix remediation
PR #542 — first Compare closeout and Evidence review restoration
PR #543 — clean Evidence Archive Batch 2 review-result landing
PR #544 — Compare discovery/navigation remediation authority
PR #545 — Compare discovery/navigation primary implementation
PR #546 — blocking Compare dock/footer overlap fix and final visual closure
PR #547 — Compare discovery/navigation closeout and REVIEW_GATE restoration
```

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

## Mandatory reading order

Before substantive continuation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-11-russia-usdt-regulation-guide-authority.md`
6. `docs/quality/russia-usdt-regulation-guide-authority-2026-08-11-spec.md`
7. `config/russia-usdt-regulation-guide-authority-2026-08-11.json`
8. `docs/market-access-record-spec.md`
9. `docs/roadmap-amendments/2026-08-11-post-pr546-compare-discovery-closeout.md`
10. `docs/roadmap-amendments/2026-08-10-evidence-archive-payload-verification-batch-2-review-result.md`
11. `docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md`
12. `data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json`
13. `docs/ui-v3-remediation-authority.md`

## Russia USDT Regulation Guide implementation boundary

Required outcomes:

```text
Russia guide information current through: 2026-08-11
enacted framework and current-token commentary kept distinct
USDT wording source-qualified
no permanent three-asset whitelist claim
global regulation comparison synchronized
revision history updated
Watcher.Guru excluded from public source list
Canonical delta: 0
Market Access Records: 12 -> 12
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
```

Explicitly prohibited:

```text
USDT lifecycle/status change
canonical Market Access addition or mutation
canonical Evidence / Evidence Relation addition
universal Russia-wide USDT availability claim
provider-level function inference
permanent BTC/ETH/USDT whitelist claim
ranking / scoring / recommendation / safety framing
unrelated UI, CSS, schema, taxonomy, or route changes
```

## Preserved Evidence Archive boundary

```text
Evidence Archive Payload Verification Batch 2
reviewed: 10
proposals: 8
no safe change: 2
stage: REVIEW_GATE
canonical archive additions authorized: 0
```

The Evidence Archive lane is preserved, not superseded. After the bounded Guide implementation is reviewed, merged, and production-verified, restore it as the current canonical work boundary at `REVIEW_GATE`.

Do not write any proposed archive URL into canonical Evidence from the review result alone. Any archive implementation requires its own reviewed and merged implementation authority.

`docs/ui-v3-remediation-authority.md` remains the enduring material-public-UI regression authority. Issue #479 remains the deployment-history authority.
