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

Current repository boundary after the Phase C implementation/review merge:

```text
Current stage: MAINTENANCE_AUTHORITY_PHASE_D_NEXT
Parent authority: docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
Current roadmap amendment: docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
Current reviewed result spec: docs/quality/compare-phase-c-review-result-spec.md
Current implementation result: config/compare-phase-c-implementation-result.json
Phase B reviewed result: data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
Parent implementation spec: docs/quality/compare-logo-maintenance-spec.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current public maintenance boundary: Phase D reviewed logo imports + permanent future record-growth logo gate
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Phase D direct-logo allow-list: mnee, usdgo, usr
Automatic continuation beyond closeout: false
```

The maintenance authority starts from the post-PR552/PR553 canonical checkpoint and PR #554 authority. It does not revive or roll back an older canonical checkpoint.

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
Phase C entry main: dc1f2925f6dbd40c50267a2de2b4f85e2fe580b5
Phase B production run: 31566866583 — success
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
approved direct-logo slugs for Phase D: mnee, usdgo, usr
current public display partition changed by Phase B: no
expected partition after successful Phase D import: 101 direct / 18 fallback
```

Only `mnee`, `usdgo`, and `usr` may be promoted from this Phase B result. The other 18 reviewed records remain neutral fallbacks unless a separately reviewed evidence change reopens them.

## 5. Phase C Compare implementation — complete after current merge

Binding Phase C result:

```text
config/compare-phase-c-implementation-result.json
docs/quality/compare-phase-c-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
```

Accepted behavior:

```text
matching-row label: Hide matching rows
show differing attribute count
show matching attributes as shown when disabled
show matching-hidden count when enabled
all-different no-op: All displayed attributes already differ. Nothing to hide.
toggle off restores complete aligned rows
Compare mark source: existing pre-rendered StablecoinMark output
Compare-only logo map: none
remote runtime image fetch: none
Phase C logo imports: 0
Phase C canonical delta: 0
```

The browser authority remains `.github/workflows/stablecoin-compare-matrix-visual.yml`. It must preserve the existing 2–4 selection, zero-state, URL/discovery/navigation, replacement and matrix behavior while proving the Phase C row-reduction/no-op/restore and direct/fallback desktop/mobile mark cases.

Phase C does not change `98 direct / 21 fallback` and does not import the Phase-B-approved assets.

## 6. Phase D — current next implementation boundary

Phase D may act only on the exact Phase B direct-logo allow-list:

```text
mnee
usdgo
usr
```

Before promotion, the reviewed source/provenance basis must still satisfy the permanent operating specification. Phase D must vendor or reuse only acceptable local product-specific assets, record source/provenance/license handling, update the canonical-slug-first resolver/display policy and reviewed decisions, synchronize the public logo inventory, and preserve the other 18 reviewed fallbacks.

Phase D must also implement permanent blocking merge gates ensuring:

```text
logo decision count equals canonical stablecoin count
all new canonical slugs have reviewed dispositions
direct-logo assets exist locally and resolve consistently
fallbacks are explicit in display policy
canonical stablecoin data changes trigger logo coverage validation
```

A neutral fallback is a valid reviewed result. Omission of a reviewed disposition is not.

## 7. Required sequence for the maintenance lane

```text
Phase A  authority/specification/schedule merge — complete in PR #554
Phase B  fresh reviewed result for exact 21 neutral fallbacks — complete in PR #555
Phase C  Compare matching-row feedback + Compare mark display — complete after PR #556 merge
Phase D  import only mnee/usdgo/usr + permanent future growth logo gate — NEXT
Phase E  direct desktop/mobile artifact review + production verification + closeout — BLOCKED until Phase D
closeout  restore repository REVIEW_GATE; no automatic continuation
```

A later phase must cite the immediately preceding reviewed result. No phase may be inferred from chat instructions alone and no adjacent phases may be collapsed without a reviewed amendment.

## 8. Completed Evidence Archive Batch 2 implementation

PR #551 authorized eight reviewed dated archive additions. PR #552 consumed that authority and production run `31514472928` verified main commit `ada106dd3bf9899adc441c968fa36978ae515a5c`. PR #553 restored `REVIEW_GATE`.

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

No further archive addition is authorized from that lineage.

## 9. Historical completed lanes

PR #544/#545/#546/#547 completed the prior Stablecoin Compare discovery/navigation remediation and authorize no later logo import.

PR #548/#549/#550 completed the Russia USDT Regulation Guide update and authorize no further Guide work.

PR #551/#552/#553 completed Evidence Archive Payload Verification Batch 2 implementation and closeout.

PR #554 established the current Compare feedback / Stablecoin logo maintenance authority. PR #555 completed Phase B. PR #556 is the Phase C Compare implementation/review result.

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
current stage = MAINTENANCE_AUTHORITY_PHASE_D_NEXT
canonical delta authorized = 0
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
new public route families authorized = false
Phase D direct-logo allow-list = mnee, usdgo, usr
logo promotion outside that allow-list without reviewed evidence = false
ranking / scoring / recommendation authorized = false
automatic continuation = false
```

Logo display assets/configuration and Compare presentation are public-presentation maintenance, not canonical registry mutation.

## 12. Mandatory reading

Before substantive Phase D work, read:

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
docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
docs/quality/compare-phase-c-review-result-spec.md
config/compare-phase-c-implementation-result.json
docs/ui-v3-remediation-authority.md
config/stablecoin-logo-display-policy.json
config/stablecoin-logo-decisions.json
config/stablecoin-logo-decisions-additions.json
```

No implementation proceeds from chat memory alone.