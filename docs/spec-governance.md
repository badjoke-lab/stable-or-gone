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
Current stage: IMPLEMENTATION_AUTHORIZED
Current authority: docs/roadmap-amendments/2026-08-12-evidence-archive-batch2-implementation-authority.md
Current quality spec: docs/quality/evidence-archive-batch2-implementation-authority-spec.md
Current machine-readable contract: config/evidence-archive-payload-verification-batch-2-implementation-authority.json
Current canonical work boundary: Evidence Archive Payload Verification Batch 2
Canonical archive additions authorized: exactly 8
Canonical Market Access promotion authorized: false
Post-implementation boundary: REVIEW_GATE
```

The completed Batch 2 review package remains the source for the exact eight archive URLs:

```text
data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json
reviewed: 10
dated exact archive proposals: 8
reviewed no-safe-change: 2
```

## 2. Current canonical state before implementation

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
```

## 3. Exact Evidence Archive implementation authority

Only `archived_url` may be added, and only to the eight Evidence identities bound in `config/evidence-archive-payload-verification-batch-2-implementation-authority.json`.

Expected bounded result:

```text
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
Maximum archive delta: +8 / -8
```

The following two reviewed outcomes remain unchanged and outside implementation authority:

```text
sog_src_susd_sip420_2024
sog_src_susd_sip423_2026
```

No source URL replacement, source normalization, Evidence identity/relation change, asset change, Market Access change, schema/taxonomy change, public route change, material UI/CSS change, ranking, scoring, or recommendation is authorized.

Same-count checkpoint/statistics/release-integrity artifacts may change only as deterministic consequences of these eight exact archive additions and existing repository validation requirements.

## 4. Historical completed lanes

PR #548/#549 completed the Russia USDT Regulation Guide update. PR #550 closed the temporary Guide authority, restored the Evidence Archive boundary, and merged as `2825eb293f833061deb1ef8bdb628b32a93538cc`; production run `31509169378` succeeded. The Russia Guide lineage authorizes no further Guide work.

PR #544/#545/#546/#547 completed the Stablecoin Compare discovery/navigation remediation and closeout. That lineage authorizes no further material Compare work.

## 5. Market Access Record v1 boundary

The canonical analytical unit remains:

```text
asset × jurisdiction × platform/service × function × access state × effective date
```

This Evidence Archive implementation authorizes no Market Access additions or mutation.

## 6. Current sequence

```text
PR #537/#538/#539 — Evidence Archive Batch 2 review lineage — complete
PR #543 — clean Batch 2 review result — complete
PR #548/#549 — Russia Guide authority / implementation — complete
PR #550 — Russia Guide closeout / REVIEW_GATE restoration — complete
current — Evidence Archive Batch 2 exact implementation authority
next — one bounded 8-record archived_url implementation
then — production verification and REVIEW_GATE
```

## 7. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
canonical implementation authority = IMPLEMENTATION_AUTHORIZED
canonical archive additions authorized = 8
canonical Market Access promotion authorized = false
public Guide/UI change authorized = false
automatic continuation = false
```

## 8. Mandatory reading

Before implementation, read `AGENTS.md`, this file, `docs/roadmap.md`, `docs/deployment-policy.md`, the Batch 2 implementation authority amendment/spec/config, the completed Batch 2 review-result package, and `docs/market-access-record-spec.md`.

## 9. Exit

After the exact eight reviewed archive additions merge and production verification succeeds, return to `REVIEW_GATE`. No Batch 3 or further canonical mutation is automatically authorized.
