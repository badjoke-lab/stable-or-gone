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
5. current work-item specification / machine-readable contract or reviewed phase result
6. permanent operating specifications
7. enduring regression authorities
8. named audits, baselines, queues, and reviewed prior outputs
9. conversation history and unmerged drafts

Current repository boundary after the Phase B review-result merge:

```text
Current stage: MAINTENANCE_AUTHORITY_PHASE_C_NEXT
Parent authority: docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
Current reviewed result spec: docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
Current reviewed result data: data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
Parent implementation spec: docs/quality/compare-logo-maintenance-spec.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current public maintenance boundary: Phase C Compare feedback / Compare marks
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Phase D logo imports authorized now: false
Automatic continuation beyond closeout: false
```

The maintenance authority starts from the post-PR552/PR553 canonical checkpoint and PR #554 authority. It does not revive or roll back the pre-archive canonical checkpoint.

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
Maintenance-authority production commit before Phase B result: e7d38ba55ce1a2a15a2316dac733f696b9742a17
Maintenance-authority production run: 31556728267 — success
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized by current lane: 0
```

There is no active canonical-record implementation authority.

## 3. Compare and logo maintenance authority

The parent maintenance lane remains governed by:

```text
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
docs/ui-v3-remediation-authority.md
```

It authorizes exactly four outcomes:

1. make the matching-row comparison control visibly explain its effect and no-op state;
2. show the existing audited Stablecoin mark system in Compare record headers;
3. re-audit exactly the current 21 neutral fallbacks before changing display counts;
4. make reviewed logo disposition a permanent blocking part of every future canonical stablecoin addition.

The public logo baseline remains:

```text
Canonical stablecoins: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
```

## 4. Phase B fallback re-audit — reviewed complete

The exact 21-record population frozen by the parent authority has completed fresh review.

Binding result:

```text
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
```

Accepted reviewed partition:

```text
reviewed: 21 / 21
direct_logo: 3
neutral_fallback: 18
approved direct-logo slugs for later Phase D: mnee, usdgo, usr
current public display partition changed by Phase B: no
expected partition after successful Phase D import: 101 direct / 18 fallback
```

Phase B is review-only. It does not vendor image files, mutate the display policy, change the public logo README, or modify canonical data.

Only `mnee`, `usdgo`, and `usr` may be promoted from this Phase B result. The other 18 reviewed records remain neutral fallbacks unless a separately reviewed evidence change reopens them.

Phase B closes the research gate for Phase C only. It does not open Phase D before Phase C has its own reviewed implementation result.

## 5. Phase C — current next implementation boundary

The matching-row control may hide a row only when every selected record has the same normalized displayed value for that attribute.

Required UI behavior:

```text
preferred label: Hide matching rows
report differing attribute count
report matching-hidden count when enabled
explicitly report when there are no matching rows to hide
disabling restores the complete comparison rows
```

Blocking coverage must include:

1. a deterministic row-removal case;
2. an all-different no-op case with explicit feedback;
3. restoration when disabled.

Compare must reuse the existing `StablecoinMark` / `stablecoinLogo` semantics. A selected record therefore receives the same audited direct Stablecoin/product logo or neutral monogram fallback as elsewhere in the product.

No independent Compare-only logo map, symbol guessing beyond the audited allow-list, generated substitute brand artwork, or remote runtime logo fetching is authorized.

Phase C must not import the three Phase-B-approved assets and must not alter display-policy direct/fallback counts. Those changes belong to Phase D.

## 6. Permanent future growth rule

`docs/quality/stablecoin-logo-disposition-operating-spec.md` is the permanent operating specification for future canonical Stablecoin additions.

Every future work item that can add a canonical Stablecoin must cite it and include a logo disposition in the complete-record requirement. A neutral fallback is a valid reviewed result; omission of a reviewed disposition is not.

Phase D must implement permanent merge gates ensuring:

```text
logo decision count equals canonical stablecoin count
all new canonical slugs have reviewed dispositions
direct-logo assets exist locally and resolve consistently
fallbacks are explicit in display policy
canonical stablecoin data changes trigger logo coverage validation
```

## 7. Required sequence for the maintenance lane

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  fresh reviewed result for exact 21 neutral fallbacks — complete after current review-result merge
Phase C  Compare matching-row feedback + Compare mark display — NEXT
Phase D  import only mnee/usdgo/usr + permanent future growth logo gate — BLOCKED until Phase C review
Phase E  direct desktop/mobile artifact review + production verification + closeout — BLOCKED until Phase D
closeout  restore repository REVIEW_GATE; no automatic continuation
```

A later phase must cite the immediately preceding reviewed result. No phase may be inferred from chat instructions alone and no adjacent phases may be collapsed without a reviewed amendment.

## 8. Completed Evidence Archive Batch 2 implementation

The completed Batch 2 review package recorded ten reviewed identities: eight exact dated archive proposals and two reviewed no-safe-change outcomes. PR #551 converted those eight exact URLs into a bounded implementation authority. PR #552 consumed that authority and production run `31514472928` verified main commit `ada106dd3bf9899adc441c968fa36978ae515a5c` at the official origin. PR #553 restored `REVIEW_GATE`.

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

No further archive addition is authorized from PR #551/#552/#553.

## 9. Historical completed lanes

PR #544/#545/#546/#547 completed the Stablecoin Compare discovery/navigation remediation and closeout. That lineage authorizes no new material Compare work.

PR #548/#549 completed the Russia USDT Regulation Guide update and PR #550 closed it. That lineage authorizes no further Guide work.

PR #551/#552/#553 completed Evidence Archive Payload Verification Batch 2 implementation and closeout. That lineage authorizes no further archive mutation.

PR #554 established the current Compare feedback / Stablecoin logo maintenance authority and schedule. Production run `31556728267` verified the merged authority state.

## 10. Market Access Record v1 boundary

The canonical analytical unit remains:

```text
asset × jurisdiction × platform/service × function × access state × effective date
```

No Market Access addition or mutation is authorized by the current maintenance lane.

## 11. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
current stage = MAINTENANCE_AUTHORITY_PHASE_C_NEXT
canonical delta authorized = 0
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
new public route families authorized = false
Phase-D logo imports authorized during Phase C = false
ranking / scoring / recommendation authorized = false
automatic continuation = false
```

Logo display assets/configuration and Compare presentation are public-presentation maintenance, not canonical registry mutation.

## 12. Mandatory reading

Before substantive Phase C work, read:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
docs/ui-v3-remediation-authority.md
config/stablecoin-logo-display-policy.json
config/stablecoin-logo-decisions.json
config/stablecoin-logo-decisions-additions.json
```

Then read the immediately preceding reviewed result for every later phase. The post-PR552 closeout remains the canonical entry-state reference.

## 13. Exit

The maintenance lane closes only after Phase C, Phase D, and Phase E complete in sequence, accepted changed-state artifacts are directly reviewed at desktop/mobile, exact-main production is verified, and a closeout restores a fresh repository `REVIEW_GATE`.
