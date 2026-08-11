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
Current closeout: docs/roadmap-amendments/2026-08-12-post-pr552-evidence-archive-batch2-closeout.md
Current quality spec: docs/quality/post-pr552-evidence-archive-batch2-closeout-spec.md
Current machine-readable contract: config/post-pr552-evidence-archive-batch2-closeout.json
Current canonical work boundary: Evidence Archive Payload Verification Batch 2
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Public Guide/UI change authorized: false
Automatic continuation: false
Next work requires separate reviewed authority: true
```

PR #551's `IMPLEMENTATION_AUTHORIZED` contract and PR #552's implementation are completed historical lineage. They do not remain continuing authority.

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
Current production commit: ada106dd3bf9899adc441c968fa36978ae515a5c
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

## 3. Completed Evidence Archive Batch 2 implementation

The completed Batch 2 review package recorded ten reviewed identities: eight exact dated archive proposals and two reviewed no-safe-change outcomes. PR #551 converted those eight exact URLs into a bounded implementation authority. PR #552 consumed that authority and production run `31514472928` verified main commit `ada106dd3bf9899adc441c968fa36978ae515a5c` at the official origin.

Accepted bounded result:

```text
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
Exact archived_url additions: 8
Reviewed no-safe-change outcomes preserved: 2
```

No source URL replacement, source normalization, Evidence identity/relation change, asset change, Market Access change, schema/taxonomy change, public route change, material UI/CSS change, ranking, scoring, or recommendation occurred under that implementation.

No further archive addition is authorized from PR #551 or PR #552.

## 4. Historical completed lanes

PR #551 authorized and PR #552 implemented the exact Evidence Archive Payload Verification Batch 2 archive maintenance. PR #552 merged as `ada106dd3bf9899adc441c968fa36978ae515a5c`; production run `31514472928` / job `93856057816` succeeded. This lineage is complete.

PR #548/#549 completed the Russia USDT Regulation Guide update. PR #550 closed the temporary Guide authority, restored the Evidence Archive boundary, and merged as `2825eb293f833061deb1ef8bdb628b32a93538cc`; production run `31509169378` succeeded. The Russia Guide lineage authorizes no further Guide work.

PR #544/#545/#546/#547 completed the Stablecoin Compare discovery/navigation remediation and closeout. That lineage authorizes no further material Compare work.

## 5. Market Access Record v1 boundary

The canonical analytical unit remains:

```text
asset × jurisdiction × platform/service × function × access state × effective date
```

No Market Access addition or mutation is currently authorized.

## 6. Current sequence

```text
PR #537/#538/#539 — Evidence Archive Batch 2 review lineage — complete
PR #543 — clean Batch 2 review result — complete
PR #548/#549 — Russia Guide authority / implementation — complete
PR #550 — Russia Guide closeout / REVIEW_GATE restoration — complete
PR #551 — Evidence Archive Batch 2 exact implementation authority — complete
PR #552 — bounded eight-record archived_url implementation — complete
production run 31514472928 — success
current — REVIEW_GATE
next — separate reviewed authority required before any new material work
```

## 7. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
current stage = REVIEW_GATE
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
public Guide/UI change authorized = false
automatic continuation = false
```

## 8. Mandatory reading

Before substantive continuation, read `AGENTS.md`, this file, `docs/roadmap.md`, `docs/deployment-policy.md`, the post-PR552 closeout amendment/spec/contract, `docs/market-access-record-spec.md`, and `docs/ui-v3-remediation-authority.md`.

## 9. Exit

Current exit is `REVIEW_GATE`. No Batch 3 or further canonical/public mutation is automatically authorized. A future work item requires a separate reviewed authority.
