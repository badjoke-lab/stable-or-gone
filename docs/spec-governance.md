# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-11

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

Current public implementation authority:

```text
docs/roadmap-amendments/2026-08-11-russia-usdt-regulation-guide-authority.md
docs/quality/russia-usdt-regulation-guide-authority-2026-08-11-spec.md
config/russia-usdt-regulation-guide-authority-2026-08-11.json
stage: PUBLIC_GUIDE_IMPLEMENTATION_AUTHORIZED
canonical delta: 0
```

Preserved canonical work boundary:

```text
Evidence Archive Payload Verification Batch 2
docs/roadmap-amendments/2026-08-10-evidence-archive-payload-verification-batch-2-review-result.md
docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md
data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json
stage: REVIEW_GATE
canonical archive additions authorized: 0
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

There is no active canonical-record implementation authority. Canonical work remains at `REVIEW_GATE`.

## 3. Russia USDT Regulation Guide authority

The active authority is public Guide content only. It exists because the July 2026 Russian crypto-market law and Bank of Russia implementation work supersede the consultation-only framing in the existing Russia Guide.

Reviewed source levels must remain distinct:

```text
Bank of Russia primary source — enacted framework effective 2026-09-01
Bank of Russia primary source — July organised-trading draft regulations
RBC direct-interview reporting — First Deputy Governor identifies BTC, ETH and USDT as the initial three currently meeting the principles
Watcher.Guru — discovery only, not canonical Evidence and not a public legal source
```

The implementation may state that non-qualified investors can buy the most liquid cryptocurrencies after testing and within RUB 300,000 per year through one intermediary; that qualified investors have broader purchase/sale access after testing; that the requirements apply to foreign stablecoins; and that domestic cryptocurrency payments remain prohibited.

The BTC/ETH/USDT statement must be attributed to First Deputy Governor Vladimir Chistyukhin and framed as the initial three currently meeting the principles. It must not be presented as a permanent statutory whitelist.

Authorized public files:

```text
src/pages/guides/russia-stablecoin-rules-2026/index.astro
src/pages/guides/global-stablecoin-regulation-2026/index.astro
src/data/guideCatalog.ts
```

No unrelated public file is authorized.

## 4. Market Access Record v1 boundary

No canonical Market Access promotion is authorized.

The canonical analytical unit remains:

```text
asset × jurisdiction × platform/service × function × access state × effective date
```

A country-level law or regulator framework does not establish provider-level support. The reviewed Russia source set therefore cannot create `buy_sell`, `deposit`, `withdrawal`, `external_wallet_transfer`, `direct_issuer_mint`, or `direct_issuer_redemption` rows without a named platform/service and function-scoped evidence.

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

## 6. Evidence Archive Payload Verification Batch 2 — preserved

The exact ten PR #538 candidates completed manual payload review and were cleanly recorded by PR #543.

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes authorized: 0
stage: REVIEW_GATE
```

Any archive promotion requires a separate reviewed and merged implementation authority binding the exact eight IDs/URLs and canonical boundaries.

## 7. Current sequence

```text
PR #523 — last canonical-changing implementation — complete
PR #534 — REVIEW_GATE restoration — complete
PR #535/#536 — Japan Market Access review — complete no-go
PR #537/#538/#539 — Evidence Archive Batch 2 research lineage — complete
PR #540/#541/#542 — first Compare remediation / closeout — complete
PR #543 — clean Evidence Archive Batch 2 review result — complete
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout — complete
current — Russia USDT Regulation Guide public implementation authority
next — bounded Guide implementation, production verification, closeout
then — restore Evidence Archive Payload Verification Batch 2 REVIEW_GATE
```

## 8. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
canonical implementation authority = REVIEW_GATE
canonical Market Access promotion authorized = false
canonical archive additions authorized = 0
Russia Guide public update authorized = true
```

No review artifact is public canonical output.

## 9. Mandatory reading

Before implementation, read `AGENTS.md`, this file, `docs/roadmap.md`, `docs/deployment-policy.md`, the Russia USDT authority amendment/spec/config, `docs/market-access-record-spec.md`, the post-PR #546 Compare closeout, `docs/ui-v3-remediation-authority.md`, and the completed Batch 2 review-result package.

## 10. Exit

After the bounded Guide implementation is reviewed, merged, production-verified, and closed out, the public Guide authority ends and Evidence Archive Payload Verification Batch 2 is restored as the current canonical work boundary at `REVIEW_GATE`. No automatic archive or Market Access continuation is authorized.
