# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository state: PR #534 merged and production-verified; Market Access review-only authority active
Current canonical checkpoint: sog_jpysc_market_access_pilot_3_canonical_119_checkpoint_pr523_2026_08_05
Current production commit: 8ba1ed2b4aff36aaa9545c6f3e3cdd113dbb5ed2
Last canonical-changing implementation commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Production canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Production canonical file count: 466
Current production parity convergence attempt: 1
Current production provenance convergence attempt: 3
Official public origin: https://www.stableorgone.com
Legacy-host 301: complete via Pages Advanced Mode worker and strict migration gate
Current implementation authority: REVIEW GATE
Current review authority: Japan Market Access Expansion Review Batch 1
Later canonical implementation lanes authorized: no
```

PR #523 completed the bounded JPYSC Japan Market Access implementation. PR #534 then closed the production checkpoint without changing canonical data and returned implementation authority to `REVIEW GATE`. The current `8ba1ed2b...` production commit therefore has the same canonical hash and counts as the historical canonical-changing PR #523 commit `77e80dd3...`.

A new separately bounded review-only authority is now active for Japan Market Access Expansion Review Batch 1. It permits source review and candidate selection only. It does not permit canonical Market Access promotion, new Evidence, or public product changes.

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

## Completed current-cycle work recognized by authority

The current reviewed state includes and must preserve:

```text
PR #517 — Bison Bank EUB and USB complete-record growth checkpoint
PRs #518–#519 — sibling-registry footer insertion and production closeout
PRs #520–#522 — JPYSC review and bounded implementation authority
PR #523 — bounded JPYSC Japan Market Access implementation, merged and production-verified
PR #524 — fixed desktop/mobile support visual audit
PR #525 — support-option consolidation and duplicate-call cleanup
PR #526 — complete Ledger Series project network navigation
PR #527 — official-domain migration audit hardening
PR #528 — Cloudflare legacy-host redirect application path
PR #529 — Pages Advanced Mode legacy-host redirect worker
PR #530 — strict legacy-domain migration gate finalization
PR #531 — 2026 regulation guide cluster and 119-record mark-audit repair
PR #532 — post-PR #531 authority and schedule reconciliation
PR #533 — shared Guide readability and research-layout remediation
PR #534 — post-PR #523 production closeout and REVIEW GATE restoration
```

Required historical authority anchors retained for compatibility and audit traceability:

```text
PR #493 — official-domain migration and production verification
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB and USB complete-record growth checkpoint
PR #522 — semantic authority for the completed PR #523 JPYSC implementation
```

Historical PR-specific checkpoints remain immutable audit evidence. Forward authority documents must describe the current production and authority state rather than re-label historical artifacts.

Merged repository authority outranks chat memory, handoff prose, issue discussion, stale branch state, generated reports, and unmerged drafts.

## Mandatory reading order

Before every substantive continuation, read the merged current versions of:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-09-post-pr534-market-access-review-authority.md`
6. `docs/quality/market-access-expansion-review-authority-2026-08-09-spec.md`
7. `docs/market-access-record-spec.md`
8. `config/market-access-governance-v1.json`
9. every named validator, source review, fixture, baseline, queue, handoff, and prior output required by the active review item
10. `docs/ui-v3-remediation-authority.md` before any material public UI work

The completed PR #523 lineage remains historical input:

```text
docs/roadmap-amendments/2026-08-09-post-pr523-production-closeout.md
docs/quality/post-pr523-production-closeout-spec.md
config/jpysc-market-access-pilot-3-implementation-authority-pr522.json
config/japan-market-access-pilot-3-jpysc-review-pr521.json
data/editorial-research/japan-market-access-pilot-3-jpysc-review-pr521.json
data/market-access-records-v1.json
```

If merged repository state changes authority, production checkpoint, counts, schedule, deployment behavior, or a blocking visual conclusion, update the governing specification and roadmap before implementation continues.

## Active review boundary

The active lane is:

```text
Japan Market Access Expansion Review Batch 1
jurisdiction: JP / Japan
maximum asset x platform/service candidate pairs: 3
assets: existing canonical identities only
provider/service selection: source-led, not predetermined
functions:
- buy_sell
- deposit
- withdrawal
- external_wallet_transfer
```

Allowed work is limited to primary-source discovery/review, private or editorial review artifacts, function-scoped source dispositions, effective/observed date review, Evidence-identity reuse review, duplicate-URL review, and a bounded implementation proposal or no-go result.

The following remain prohibited in the active review lane:

```text
canonical Market Access additions
new Evidence identities or Evidence Relations
new assets, organizations, events, or deployments
public product or material UI changes
direct issuer mint/redemption claims
lending, staking, or yield as Market Access v1
country-wide availability inference
automatic promotion
ranking, score, recommendation, or implied safety
```

## Completed PR #523 boundary

The historical production-verified bounded JPYSC result remains:

```text
asset: sog_st_jpysc
jurisdiction: JP / Japan
provider: SBI VC Trade / VCTRADE
effective from: 2026-06-24
observed at: 2026-08-05
buy_sell: account_internal_only
deposit: unavailable
withdrawal: unavailable
external_wallet_transfer: unavailable
Evidence: 585
Evidence Relations: 585
Market Access Records: 12
Archive recorded: 463
Detail routes: 422
```

No country-wide availability inference, future-capability backfill, lending-as-access evidence, ranking, scoring, recommendation, replacement asset, or unrelated product/UI expansion was authorized by PR #523 or PR #534.

## Validation and next boundary

The active review authority must preserve all current canonical counts and public output. Its exit is `REVIEW GATE`.

If source review identifies promotable Market Access rows, a new separately reviewed and merged implementation authority must bind exact asset/platform/service pairs, functions, states, dates, Evidence identities, maximum deltas, and validation before canonical data may change.

Evidence Archive Payload Verification Batch 2, Tier A dossier deepening, record growth, new UI, and every other later lane remain planning items only.

Issue #479 remains the deployment-history authority.
