# Stable or Gone Specification Governance

Status: canonical governance specification  
Updated: 2026-08-10

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

Current result authority:

```text
docs/roadmap-amendments/2026-08-10-evidence-archive-payload-verification-batch-2-review-result.md
docs/quality/evidence-archive-payload-verification-batch-2-review-result-spec.md
data/editorial-research/evidence-archive-payload-verification-batch-2-review-2026-08-09.json
```

Historical inputs remain:

```text
PR #537 — review-only authority
PR #538 — deterministic candidate set
PR #539 — manual network/payload research lineage
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
```

There is no active canonical-record implementation authority. The repository is at `REVIEW_GATE`.

## 3. Evidence Archive Payload Verification Batch 2 — review complete

The exact ten PR #538 candidates have completed manual payload review under the PR #537 contract.

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes authorized: 0
next boundary: REVIEW_GATE
```

Accepted proposal IDs:

```text
sog_src_susd_legacy_context_batch_a
sog_src_susd_rebuilding_2026
sog_src_susd_roadmap_2026
sog_src_susd_sip_status_2026
sog_src_susd_synthetix_docs
sog_src_susd_v3_faq_batch_a
sog_src_terra_docs
sog_src_tether_transparency
```

No-safe-change IDs:

```text
sog_src_susd_sip420_2024
sog_src_susd_sip423_2026
```

Review acceptance required exact canonical source URLs, dated Wayback captures, independent HTTP-200 archived-payload retrieval, payload inspection, and claim-scope/source-role preservation. CDX metadata alone, redirects, normalized replacement URLs, unrelated bodies, and unsupported snapshots are insufficient.

The review result cannot mutate canonical `archived_url`, source URLs, Evidence identities, Evidence Relations, Market Access, routes, schema, taxonomy, or public canonical output.

Any archive promotion requires a separate reviewed and merged implementation authority binding the exact eight IDs, exact eight archive URLs, maximum archive deltas `+8/-8`, unchanged Evidence/Evidence Relation counts, validators, and production verification.

## 4. Compare remediation — complete

PR #540/#541 completed the bounded Stablecoin Compare Matrix repair. Merge `539a27fd5854a1c2544f4653a2161be36860a002`; production run `31326135906` succeeded; exact-head visual run `31325811381` succeeded. Further Compare work requires separate authority.

## 5. Current sequence

```text
PR #523 — last canonical-changing implementation — complete
PR #534 — REVIEW_GATE restoration — complete
PR #535/#536 — Japan Market Access review — complete no-go
PR #537 — Evidence Archive Batch 2 review authority — complete
PR #538 — deterministic candidates — complete
PR #539 — manual payload research lineage — complete research, not safe to merge as stale branch
PR #540/#541 — Compare remediation — complete
PR #542 — Compare closeout / Evidence review restoration — complete
current — clean Evidence Archive Batch 2 review-result recording
next — REVIEW_GATE
later archive implementation — separate authority only
```

## 6. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
includes_internal_monitoring = false
canonical implementation authority = REVIEW_GATE
```

No review artifact is public canonical output.

## 7. Historical anchors

Preserve at minimum:

```text
PR #493
PR #500
PR #517
PR #522
PR #523
PR #537
PR #538
PR #540
PR #541
PR #542
```

## 8. Mandatory reading

Before further work, read `AGENTS.md`, this file, `docs/roadmap.md`, `docs/deployment-policy.md`, the Batch 2 review-result amendment/spec/artifact, PR #537/#538 authority/candidate material, and `docs/ui-v3-remediation-authority.md` for any material public UI work.

## 9. Exit

The completed review exits to `REVIEW_GATE`. No automatic continuation is authorized. Any canonical archive mutation must be separately reviewed and merged before implementation begins.
