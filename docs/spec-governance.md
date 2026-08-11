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
5. current work-item specification / machine-readable contract
6. enduring regression authorities
7. named audits, baselines, queues, and reviewed prior outputs
8. conversation history and unmerged drafts

Current repository boundary:

```text
Current stage: REVIEW_GATE
Current closeout: docs/roadmap-amendments/2026-08-12-post-pr549-russia-usdt-guide-closeout.md
Current quality spec: docs/quality/post-pr549-russia-usdt-guide-closeout-spec.md
Current machine-readable contract: config/post-pr549-russia-usdt-guide-closeout.json
Current canonical work boundary: Evidence Archive Payload Verification Batch 2
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
```

The completed Evidence Archive Batch 2 review result remains the operative canonical review package:

```text
docs/roadmap-amendments/2026-08-10-evidence-archive-payload-verification-batch-2-review-result.md
docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md
data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json
reviewed: 10
proposals: 8
no safe change: 2
stage: REVIEW_GATE
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
Reserve components: 153
Income profiles: 119
Market Access Records: 12
Archive recorded: 463
Archive not recorded: 122
Detail routes: 422
Metadata-checked routes: 422
Official public origin: https://www.stableorgone.com
Last canonical-changing commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
Canonical delta: 0
```

There is no active canonical-record implementation authority.

## 3. Russia USDT Regulation Guide — historical complete

PR #548 authorized a bounded three-file public Guide update. PR #549 implemented it and merged as `f99d9583105587625a409b959ac928de44248e7b`. Production run `31504346502` and job `93822011080` completed successfully, including build, Cloudflare Pages upload, deployed-production verification, and deployment-result reporting to Issue #479.

The completed Guide result preserves the reviewed source hierarchy:

```text
Bank of Russia primary source — enacted framework effective 2026-09-01
Bank of Russia primary source — July organised-trading implementation material
RBC direct-interview reporting — source-qualified BTC/ETH/USDT initial-three statement
Watcher.Guru — discovery only, not canonical Evidence and not a public legal source
```

The implementation did not create canonical Evidence, Market Access, lifecycle, schema, taxonomy, ranking, or recommendation changes. PR #548/#549 authorize no continued material Guide editing after this closeout.

## 4. Market Access Record v1 boundary

The canonical analytical unit remains:

```text
asset × jurisdiction × platform/service × function × access state × effective date
```

A country-level law or regulator framework does not establish provider-level support. Russian country-level material therefore cannot create `buy_sell`, `deposit`, `withdrawal`, `external_wallet_transfer`, `direct_issuer_mint`, or `direct_issuer_redemption` rows without named platform/service and function-scoped evidence.

```text
Market Access Records: 12 -> 12
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
```

## 5. Stablecoin Compare remediation — historical complete

PR #544 authorized the bounded discovery/navigation remediation, PR #545 supplied the primary implementation, PR #546 fixed the blocking dock/footer overlap discovered by direct artifact review, and PR #547 closed the lane and restored `REVIEW_GATE`.

```text
Final Compare main before closeout: f8ceedd55b0cc764a2bbc2747bd50f061f288b24
Final visual exact head: 02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7
Final visual acceptance run: 31498394285 — success
Final production run: 31498949423 — success
Canonical delta: 0
```

The Compare lineage authorizes no new work.

## 6. Evidence Archive Payload Verification Batch 2 — current REVIEW_GATE

The exact ten PR #538 candidates completed manual payload review and were cleanly recorded by PR #543.

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes authorized: 0
stage: REVIEW_GATE
```

Any archive promotion requires a separate reviewed and merged implementation authority binding the exact eight Evidence IDs, exact dated archive URLs, bounded maximum archive delta, canonical invariants, and rollback conditions.

`reviewed_no_safe_change` remains a valid terminal review outcome. Automatic promotion is prohibited.

## 7. Current sequence

```text
PR #523 — last canonical-changing implementation — complete
PR #534 — REVIEW_GATE restoration — complete
PR #535/#536 — Japan Market Access review — complete no-go
PR #537/#538/#539 — Evidence Archive Batch 2 research lineage — complete
PR #540/#541/#542 — first Compare remediation / closeout — complete
PR #543 — clean Evidence Archive Batch 2 review result — complete
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout — complete
PR #548 — Russia USDT Regulation Guide authority — complete
PR #549 — Russia USDT Regulation Guide implementation / production — complete
current — Evidence Archive Payload Verification Batch 2 REVIEW_GATE
next — no automatic continuation; separate implementation authority required before any archive mutation
```

## 8. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
canonical implementation authority = REVIEW_GATE
canonical Market Access promotion authorized = false
canonical archive additions authorized = 0
Russia Guide public update authorized = false
```

No review artifact is public canonical output.

## 9. Mandatory reading

Before substantive continuation, read `AGENTS.md`, this file, `docs/roadmap.md`, `docs/deployment-policy.md`, the post-PR #549 closeout amendment/spec/config, the completed Evidence Archive Batch 2 review-result package, `docs/market-access-record-spec.md`, and the enduring UI regression authority where material UI work is contemplated.

## 10. Exit

The repository is at `REVIEW_GATE`. No canonical archive promotion, Market Access promotion, material public Guide change, or automatic continuation is authorized. Any next implementation must first land its own reviewed authority package.
