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
6. permanent operating specifications
7. enduring regression authorities
8. named audits, baselines, queues, and reviewed prior outputs
9. conversation history and unmerged drafts

Current repository boundary after this authority is merged:

```text
Current stage: MAINTENANCE_AUTHORITY
Current authority: docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
Current quality spec: docs/quality/compare-logo-maintenance-spec.md
Permanent logo operating spec: docs/quality/stablecoin-logo-disposition-operating-spec.md
Current machine-readable contract: config/compare-logo-maintenance-authority.json
Current public maintenance boundary: Compare feedback / Compare marks / 21-fallback logo re-audit / future record-growth logo gate
Canonical delta authorized: 0
Canonical archive additions authorized: 0
Canonical Market Access promotion authorized: false
Automatic continuation beyond closeout: false
```

The maintenance authority starts from the post-PR552/PR553 `REVIEW_GATE`. It does not revive or roll back the pre-archive canonical checkpoint.

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
Canonical delta authorized by current lane: 0
```

There is no active canonical-record implementation authority.

## 3. Current Compare and logo maintenance authority

The current maintenance lane is governed together by:

```text
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
docs/ui-v3-remediation-authority.md
```

It authorizes exactly four workstreams:

1. make the matching-row comparison control visibly explain its effect and no-op state;
2. show the existing audited Stablecoin mark system in Compare record headers;
3. re-audit exactly the current 21 neutral fallbacks before changing display counts;
4. make reviewed logo disposition a permanent blocking part of every future canonical stablecoin addition.

The logo baseline is:

```text
Canonical stablecoins: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
```

The 21-record fallback population is frozen by `config/compare-logo-maintenance-authority.json`. No record outside that set may be pulled into the re-audit without a reviewed amendment.

### Compare matching-row semantics

The comparison control may hide a row only when every selected record has the same normalized displayed value for that attribute.

The UI must report differing-row and matching-hidden counts. If the control causes no row-count change because all displayed rows already differ, it must state that there are no matching rows to hide. Blocking coverage must include both an actual row-removal case and an all-different explicit no-op case.

### Compare mark rule

Compare must reuse the existing `StablecoinMark` / `stablecoinLogo` semantics. A selected record therefore receives the same audited direct Stablecoin/product logo or neutral monogram fallback as elsewhere in the product.

No independent Compare-only logo map, symbol guessing beyond the existing audited allow-list, generated substitute brand artwork, or remote runtime logo fetching is authorized.

### 21-fallback re-audit rule

Each of the 21 baseline fallbacks receives a fresh reviewed disposition:

```text
direct_logo
or
neutral_fallback
```

A direct-logo result requires Stablecoin/product-specific attribution. Issuer, protocol/project, generic directory, ambiguous symbol, or unverifiable artwork remains fallback unless asset-specific attribution is independently established.

`mnee`, `bison-bank-eub`, and `bison-bank-usb` are priority rechecks, not predetermined promotions.

### Permanent future growth rule

`docs/quality/stablecoin-logo-disposition-operating-spec.md` becomes a permanent operating specification after merge.

Every future work item that can add a canonical stablecoin must cite it and include a logo disposition in the complete-record requirement. A neutral fallback is a valid reviewed result; omission of a reviewed disposition is not.

Core merge gates must ensure:

```text
logo decision count equals canonical stablecoin count
all new canonical slugs have reviewed dispositions
direct-logo assets exist locally and resolve consistently
fallbacks are explicit in display policy
canonical stablecoin data changes trigger logo coverage validation
```

## 4. Required sequence for the maintenance lane

```text
Phase A  authority/specification/schedule merge
Phase B  fresh reviewed result for all 21 neutral fallbacks
Phase C  Compare matching-row feedback + Compare mark display implementation
Phase D  reviewed eligible logo imports + permanent future growth logo gate
Phase E  direct desktop/mobile artifact review + production verification + closeout
closeout  restore repository REVIEW_GATE; no automatic continuation
```

A later phase must cite the immediately preceding reviewed result. No phase may be inferred from chat instructions alone.

## 5. Completed Evidence Archive Batch 2 implementation

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

## 6. Historical completed lanes

PR #544/#545/#546/#547 completed the Stablecoin Compare discovery/navigation remediation and closeout. That lineage authorizes no new material Compare work.

PR #548/#549 completed the Russia USDT Regulation Guide update and PR #550 closed it. That lineage authorizes no further Guide work.

PR #551/#552/#553 completed Evidence Archive Payload Verification Batch 2 implementation and closeout. That lineage authorizes no further archive mutation.

## 7. Market Access Record v1 boundary

The canonical analytical unit remains:

```text
asset × jurisdiction × platform/service × function × access state × effective date
```

No Market Access addition or mutation is authorized by the current maintenance lane.

## 8. Canonical/public safety

```text
canonical_only = true
includes_unreviewed_candidates = false
current stage = MAINTENANCE_AUTHORITY
canonical delta authorized = 0
canonical archive additions authorized = 0
canonical Market Access promotion authorized = false
new public route families authorized = false
ranking / scoring / recommendation authorized = false
automatic continuation = false
```

Logo display assets/configuration and Compare presentation are public-presentation maintenance, not canonical registry mutation.

## 9. Mandatory reading

Before substantive continuation in the current maintenance lane, read:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
config/compare-logo-maintenance-authority.json
docs/ui-v3-remediation-authority.md
config/stablecoin-logo-display-policy.json
config/stablecoin-logo-decisions.json
config/stablecoin-logo-decisions-additions.json
```

Then read the immediately preceding reviewed result for the phase being started. The post-PR552 closeout remains the canonical entry-state reference.

## 10. Exit

The maintenance lane closes only after the accepted implementation is directly artifact-reviewed at desktop/mobile, production-verified, and recorded by a closeout that restores a fresh repository `REVIEW_GATE`.
