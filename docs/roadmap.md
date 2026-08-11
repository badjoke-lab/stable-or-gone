# Stable or Gone Roadmap

Updated: 2026-08-12  
Status: Evidence Archive Payload Verification Batch 2 implementation complete; REVIEW_GATE restored

## Current canonical checkpoint

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
Archive recorded: 471
Archive not recorded: 114
Detail routes: 422
Metadata-checked routes: 422
Official origin: https://www.stableorgone.com
Current production commit: ada106dd3bf9899adc441c968fa36978ae515a5c
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
```

## Completed current-cycle work

```text
PR #493 — official-domain migration and production verification
PR #500 — bounded MNEE Evidence and Archive Maintenance checkpoint
PR #517 — Bison Bank EUB/USB complete-record growth checkpoint
PR #523 — JPYSC canonical Market Access implementation
PR #534 — REVIEW_GATE restoration
PR #535/#536 — Japan Market Access Expansion Review Batch 1 — no-go
PR #537/#538/#539 — Evidence Archive Payload Verification Batch 2 research/review lineage
PR #543 — clean Evidence Archive Batch 2 review result
PR #544/#545/#546/#547 — Compare discovery/navigation remediation / closeout
PR #548/#549 — Russia USDT Regulation Guide authority / implementation
PR #550 — Russia Guide closeout and Evidence Archive REVIEW_GATE restoration
PR #551 — Evidence Archive Batch 2 exact implementation authority
PR #552 — bounded eight-record Evidence Archive implementation
Production run 31514472928 — PR #552 main publication verified
```

## Current boundary — REVIEW_GATE

Evidence Archive Payload Verification Batch 2 is complete through implementation and production verification.

```text
stage: REVIEW_GATE
reviewed: 10
exact dated archive additions implemented: 8
reviewed no-safe-change: 2
canonical archive additions authorized now: 0
canonical Market Access promotion authorized: no
public Guide/UI change authorized: no
automatic continuation: false
next work requires separate reviewed authority: yes
```

Accepted Batch 2 result:

```text
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
```

PR #551's `IMPLEMENTATION_AUTHORIZED` authority was fully consumed by PR #552. The exact implementation merged as `ada106dd3bf9899adc441c968fa36978ae515a5c`; production run `31514472928` / job `93856057816` succeeded against the official origin.

No source URL replacement, Evidence identity/relation change, Market Access change, stable-asset change, schema/taxonomy change, route change, or material UI/CSS change occurred.

## Schedule

```text
2026-08-11  Russia USDT Regulation Guide update — complete
2026-08-12  PR #550 Russia Guide closeout — complete
2026-08-12  PR #551 Evidence Archive Batch 2 implementation authority — complete
2026-08-12  PR #552 bounded eight-record archived_url implementation — complete
2026-08-12  production run 31514472928 — success
current     REVIEW_GATE
next        select and separately authorize the next work item
```

Schedule windows are planning targets, not permission boundaries.

## Completed Russia Guide lane

PR #548/#549 completed the three-file Russia/global Guide update. PR #550 closed the lane and main commit `2825eb293f833061deb1ef8bdb628b32a93538cc` completed production run `31509169378` successfully. The Guide lineage authorizes no further material Guide work and created no canonical Market Access or Evidence identity/relation change.

## Market Access v1 boundary

`docs/market-access-record-spec.md` requires asset × jurisdiction × platform/service × function × access state × effective date. No Market Access change is currently authorized.

## Preserved exclusions

```text
additional archived_url promotion without separate reviewed authority
source URL replacement or normalization
modification of the two reviewed no-safe-change records without new authority
new Evidence identities or Evidence Relations
canonical Market Access additions or mutation
stable-asset change
schema/taxonomy change
new public route or unrelated UI/CSS change
ranking / scoring / recommendation
automatic Batch 3 or other continuation
```

## Required work-start protocol

Before substantive continuation, read `AGENTS.md`, `docs/spec-governance.md`, this file, `docs/deployment-policy.md`, the post-PR552 closeout amendment/spec/contract, `docs/market-access-record-spec.md`, and `docs/ui-v3-remediation-authority.md`.
