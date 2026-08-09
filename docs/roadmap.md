# Stable or Gone Roadmap

Updated: 2026-08-10  
Status: Evidence Archive Payload Verification Batch 2 review complete; current boundary REVIEW_GATE

## Current reviewed checkpoint

```text
Canonical stable assets: 119
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
Official origin: https://www.stableorgone.com
Last canonical-changing commit: 77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da
Canonical hash: sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa
Canonical file count: 466
```

## Completed current-cycle work

```text
PR #523 — JPYSC canonical Market Access implementation
PR #534 — REVIEW_GATE restoration
PR #535/#536 — Japan Market Access Expansion Review Batch 1 — no-go
PR #537 — Evidence Archive Payload Verification Batch 2 review authority
PR #538 — deterministic Batch 2 candidate selection
PR #539 — manual Wayback payload research lineage
PR #540/#541 — Stablecoin Compare Matrix remediation — production verified
PR #542 — Compare closeout / Evidence review restoration — production verified
```

## Evidence Archive Payload Verification Batch 2 — review complete

The exact ten PR #538 candidates have completed manual payload review.

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes: 0
public-output changes: 0
next boundary: REVIEW_GATE
```

Proposals:

```text
sog_src_susd_legacy_context_batch_a -> 20250720161454
sog_src_susd_rebuilding_2026        -> 20260514190950
sog_src_susd_roadmap_2026           -> 20260427180444
sog_src_susd_sip_status_2026        -> 20251117181931
sog_src_susd_synthetix_docs         -> 20251014024417
sog_src_susd_v3_faq_batch_a         -> 20250430131854
sog_src_terra_docs                   -> 20210903073902
sog_src_tether_transparency          -> 20220712233033
```

No-safe-change:

```text
sog_src_susd_sip420_2024 — exact canonical replay remains redirect-only
sog_src_susd_sip423_2026 — no reviewed HTTP-200 dated capture
```

The durable review artifact records exact archive proposals, payload bytes, SHA-256 values, text markers, and probe artifact lineage.

## Current boundary

```text
Current review stage: complete
Canonical implementation authority: REVIEW_GATE
Canonical archive additions authorized: 0
Automatic continuation: prohibited
```

No proposed archive URL may be written into canonical Evidence under the review result alone.

A later implementation authority must separately bind:

- the exact eight Evidence IDs;
- the exact eight dated archive URLs;
- maximum archive-recorded delta `+8`;
- maximum archive-not-recorded delta `-8`;
- Evidence count unchanged at 585;
- Evidence Relations unchanged at 585;
- validators and production verification.

## Compare remediation — complete

PR #541 remains production-complete at merge `539a27fd5854a1c2544f4653a2161be36860a002`; production run `31326135906` and visual run `31325811381` succeeded. Compare is not the current workstream.

## Schedule

```text
2026-08-09  Evidence Archive Batch 2 authority/candidate selection — complete
2026-08-09  network/payload research — complete
2026-08-10  Compare interruption / remediation — complete
2026-08-10  clean Evidence Archive Batch 2 review result — current
2026-08-17 to 2026-08-23  possible canonical implementation window — separate authority required
2026-08-24 onward  later dossier/data-growth lanes — separate authority required
```

Schedule windows are planning targets, not permission boundaries.

## Preserved exclusions

```text
canonical archived_url mutation without implementation authority
new Evidence / Evidence Relation from review result
source URL normalization or replacement
candidate-set mutation
automatic archive promotion
Market Access changes
schema/taxonomy changes
new public routes
unreviewed public output
silent continuation from REVIEW_GATE
```

## Required work-start protocol

Before further work, read `AGENTS.md`, `docs/spec-governance.md`, this file, `docs/deployment-policy.md`, the Batch 2 review-result amendment/spec/artifact, PR #537/#538 authority/candidate material, and Batch 1 / Queue v7 history when relevant.

Any canonical archive implementation requires a separate reviewed and merged authority.
