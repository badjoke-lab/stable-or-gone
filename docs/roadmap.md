# Stable or Gone Roadmap

Updated: 2026-08-10  
Status: Stablecoin Compare Discovery and Navigation Remediation authorized; Evidence Archive Batch 2 review preserved at REVIEW_GATE

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
PR #543 — clean Evidence Archive Batch 2 review result — production verified
```

## Current lane — Stablecoin Compare Discovery and Navigation Remediation

Direct production review found a material interaction defect not covered by the first Compare matrix repair: the matrix is positioned after the full twenty-row register and pagination, so users can select records without seeing a persistent comparison affordance and must repeatedly scroll between candidate selection and comparison.

The current bounded UI authority requires:

```text
comparison panel before public-register results
persistent Compare dock after first selection
selected record identities visible in dock
explicit View comparison action
in-panel Add / replace record control
remove then replace without register scroll
2 / 3 / 4 record matrix preserved
Differences only preserved
shared compare URL restore preserved
Unknown / Not recorded preserved
canonical changes: 0
```

This lane is limited to `/stablecoins/` Compare interaction and dedicated validation/visual acceptance. No ranking, scoring, recommendation, new routes, schema/taxonomy changes, canonical data changes, or Evidence archive promotion is authorized.

## Evidence Archive Payload Verification Batch 2 — preserved review result

```text
reviewed: 10
dated exact archive proposals: 8
reviewed no safe change: 2
canonical changes: 0
public-output changes: 0
preserved boundary: REVIEW_GATE
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

The eight archive proposals still require a separate reviewed and merged implementation authority.

## Compare acceptance sequence

```text
1. merge Compare discovery/navigation authority
2. implement only /stablecoins/ interaction changes
3. validate zero / one / two / four selected states
4. verify persistent dock and dock-to-matrix navigation
5. verify remove-and-replace without register scroll
6. verify fifth-selection rejection and URL restore
7. verify desktop/mobile no page overflow and bounded matrix overflow
8. direct screenshot review of changed states
9. merge implementation
10. verify production via deploy-production and Issue #479
11. close temporary UI authority
12. return to Evidence Archive REVIEW_GATE
```

## Schedule

```text
2026-08-09  Evidence Archive Batch 2 authority/candidate selection — complete
2026-08-09  network/payload research — complete
2026-08-10  first Compare matrix remediation — complete
2026-08-10  Evidence Archive Batch 2 clean review result — complete
2026-08-10  Compare discovery/navigation remediation — current
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
unrelated sitewide redesign
```

## Required work-start protocol

Before further work, read `AGENTS.md`, `docs/spec-governance.md`, this file, `docs/deployment-policy.md`, the current Compare discovery/navigation amendment/spec/config, and `docs/ui-v3-remediation-authority.md`. Preserve the completed Evidence Archive Batch 2 review result unchanged while the UI interruption is active.
