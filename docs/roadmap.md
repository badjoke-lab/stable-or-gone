# Stable or Gone Roadmap

Updated: 2026-08-11  
Status: Compare discovery/navigation remediation complete after PR #546; Evidence Archive Payload Verification Batch 2 restored to REVIEW_GATE

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
PR #540/#541 — first Stablecoin Compare matrix remediation — production verified
PR #542 — first Compare closeout / Evidence review restoration — production verified
PR #543 — clean Evidence Archive Batch 2 review result — production verified
PR #544 — Compare discovery/navigation remediation authority — complete
PR #545 — Compare discovery/navigation primary implementation — complete
PR #546 — blocking dock/footer overlap fix — production verified
```

## Stablecoin Compare discovery/navigation — complete

The placement/discovery/candidate-switching repair is closed only after the PR #546 footer-overlap correction.

```text
final main merge: f8ceedd55b0cc764a2bbc2747bd50f061f288b24
final visual exact head: 02774d7e9f35abf7c11bbbcb2e39cb6b62172cd7
final visual acceptance run: 31498394285 — success
final production run: 31498949423 — success
canonical delta: 0
```

Production behavior now includes:

```text
comparison panel before public-register results
fixed Compare dock while browsing register after selection
dock hidden while matrix is in view
dock hidden outside register browsing scope
dock hidden when footer enters viewport
desktop/mobile footer non-overlap explicitly verified
selected record count and identities visible in dock
immediate View comparison navigation + focus
in-panel Add / replace record
remove then replace without register scroll round trip
2 / 3 / 4 record matrix preserved
Differences only preserved
shared compare URL restore preserved
Unknown / Not recorded preserved
fifth selection rejected
mobile comparison overflow bounded to matrix shell
```

Direct review of the PR #545 artifact exposed the footer overlap even though the old visual workflow was green. PR #546 added the missing runtime guard and deterministic desktop/mobile footer regression states; direct review of the new changed-state artifact passed. PR #544/#545/#546 are historical completed authority/implementation/fix lineage and authorize no further material Compare change.

## Current lane — Evidence Archive Payload Verification Batch 2 review complete

The exact ten candidates completed manual payload review and the clean result was recorded by PR #543.

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes: 0
public-output changes: 0
current boundary: REVIEW_GATE
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

No proposed archive URL may be written into canonical Evidence under the review result alone. Any canonical implementation requires a separate reviewed and merged implementation authority binding the exact eight IDs/URLs, maximum archive deltas `+8/-8`, unchanged Evidence/Evidence Relation counts, validators, and production verification.

## Schedule

```text
2026-08-09  Evidence Archive Batch 2 authority/candidate selection — complete
2026-08-09  network/payload research — complete
2026-08-10  first Compare matrix remediation — complete
2026-08-10  Evidence Archive Batch 2 clean review result — complete
2026-08-10 to 2026-08-11  Compare discovery/navigation remediation — complete / production verified
2026-08-17 to 2026-08-23  possible canonical archive implementation window — separate authority required
2026-08-24 onward  later dossier/data-growth lanes — separate authority required
```

Schedule windows are planning targets, not permission boundaries.

## Preserved exclusions

```text
canonical archived_url mutation without implementation authority
new Evidence / Evidence Relation from review result
source URL normalization or replacement
automatic archive promotion
Market Access changes
schema/taxonomy changes
new public routes
unreviewed public output
ranking / scoring / recommendation
material Compare changes without new authority
```

## Required work-start protocol

Before further work, read `AGENTS.md`, `docs/spec-governance.md`, this file, `docs/deployment-policy.md`, the post-PR #546 Compare closeout amendment/spec/config, the Evidence Archive Batch 2 review-result amendment/spec/artifact, and `docs/ui-v3-remediation-authority.md`. The current data boundary is `REVIEW_GATE`; no automatic canonical continuation is authorized.
