# Stable or Gone Roadmap

Updated: 2026-08-12  
Status: Compare feedback and Stablecoin logo maintenance lane active; Phase B fallback re-audit complete after review-result merge; Phase C is next

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
Current maintenance-authority production commit before Phase B result: e7d38ba55ce1a2a15a2316dac733f696b9742a17
Current maintenance-authority production run: 31556728267 — success
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized by current lane: 0
```

## Current Stablecoin logo checkpoint

Current public display remains unchanged by Phase B:

```text
Canonical stablecoins: 119
Current public direct Stablecoin/product logos: 98
Current public neutral fallbacks: 21
```

Phase B has now reviewed all 21 fallbacks:

```text
reviewed: 21 / 21
direct_logo: 3
neutral_fallback: 18
Phase-D-approved direct-logo slugs: mnee, usdgo, usr
expected display partition after successful Phase D import: 101 direct / 18 fallback
```

The reviewed `101 / 18` partition is not current public state. No logo files, mappings, display-policy counts, or README counts change in Phase B.

Binding Phase B result:

```text
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
```

## Current work item — Phase C Compare implementation

Parent authority remains:

```text
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
docs/ui-v3-remediation-authority.md
```

The immediately preceding reviewed result is the Phase B package above. Phase C must cite both parent authority and Phase B result.

Current Phase C outcomes:

```text
1. matching-row Compare control gives visible effect/no-op feedback
2. Compare record headers show the same audited Stablecoin mark system used elsewhere
3. deterministic blocking interaction tests cover row reduction, no-op, and restore
4. mobile/desktop behavior preserves existing Compare acceptance constraints
```

Phase C does not import the three newly approved logos and does not implement the permanent growth gate. Those are Phase D work.

## Schedule and phase gates

```text
2026-08-12  Phase A — authority/specification/schedule merge — complete in PR #554
2026-08-12  Phase B — re-audit exact 21 neutral fallbacks — complete after current review-result merge
next        Phase C — implement Compare matching-row feedback and Compare Stablecoin marks
then        Phase D — import only mnee/usdgo/usr and implement permanent future growth logo gate
then        Phase E — direct desktop/mobile artifact review, all-record mark validation, production verification, closeout
closeout    restore repository REVIEW_GATE; no automatic continuation
```

Schedule order is binding. Phase D cannot be collapsed into Phase C; each later phase must cite the immediately preceding reviewed result.

## Phase B — completed review result

The exact 21-record population was re-audited under the asset-specific mark and local provenance rules.

Accepted direct-logo outcomes:

```text
mnee   — official_product_mark
usdgo  — official_product_mark
usr    — token_logo
```

The following remain neutral fallbacks and must not be promoted by Phase D from this review:

```text
acala-ausd
avalon-usda
bison-bank-eub
bison-bank-usb
brz
chfau
coins-phpc
dynamic-set-dollar
eurau
gbpq
plnq
poundtoken
sekau
sofiusd
usdh
usdy
usk
vchf
```

Detailed source/provenance basis is stored in the machine-readable review result. Phase B itself changes no public rendering.

## Phase C — Compare implementation requirements

The comparison control must mean only:

```text
hide a row when all selected records have the same normalized displayed value for that attribute
```

Preferred control label:

```text
Hide matching rows
```

Required feedback:

```text
differing attribute count
matching rows hidden count
explicit “nothing to hide” state when all displayed rows already differ
```

Blocking test coverage must include:

1. one deterministic selection where enabling the control reduces visible rows;
2. one deterministic all-different selection where row count remains unchanged but explicit no-op feedback appears;
3. disabling the control restores the full row set.

Compare headers must render the same audited mark result as the register/dossiers. Reuse `StablecoinMark` / `stablecoinLogo` semantics; do not create a Compare-only logo table and do not fetch remote images at runtime.

Phase C must preserve:

```text
2–4 selected records
fifth-selection rejection
URL selection order and history restoration
explicit Unknown / Not recorded states
existing section/row alignment
fixed Compare dock/footer non-overlap
bounded mobile horizontal matrix scroll
no page-level horizontal overflow
```

## Phase D — logo import and permanent growth gate

Phase D remains blocked until Phase C has a reviewed implementation result.

The only direct-logo promotions authorized by the completed Phase B review are:

```text
mnee
usdgo
usr
```

When eligible, Phase D must:

```text
vendor accepted images locally
record source/provenance/license information
update canonical-slug-first logo mapping
update display policy and reviewed decisions
synchronize public stablecoin-logo README counts
preserve the other 18 baseline fallbacks
make new canonical stablecoin growth require logo disposition before merge
make canonical stablecoin data additions trigger logo coverage validation
make logo decision count equal canonical stablecoin count as a blocking invariant
```

Every future stablecoin growth PR must cite `docs/quality/stablecoin-logo-disposition-operating-spec.md` and include `logo disposition` in its complete-record requirement.

## Phase E — acceptance and closeout

Required before closure:

```text
Compare interaction validation
direct-logo Compare desktop artifact
neutral-fallback Compare desktop artifact
direct-logo Compare mobile artifact
neutral-fallback Compare mobile artifact
matching-row removal state
all-different explicit no-op state
all-record Stablecoin mark coverage/catalog validation
no page-level overflow / clipping / footer overlap regression
direct changed-state artifact inspection
exact-main production verification
```

Automated workflow success alone does not close a known visual defect.

## Completed Evidence Archive Payload Verification Batch 2

Evidence Archive Batch 2 is no longer a pending implementation lane. PR #551 authorized the eight exact dated archive additions, PR #552 implemented them, production run `31514472928` succeeded, and PR #553 restored `REVIEW_GATE`.

```text
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
```

No additional archive work is authorized by that completed lineage.

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
PR #548/#549/#550 — Russia USDT Regulation Guide authority / implementation / closeout
PR #551/#552/#553 — Evidence Archive Batch 2 implementation authority / implementation / closeout
PR #554 — Compare feedback / Stablecoin logo maintenance authority
Production run 31556728267 — PR #554 maintenance-authority publication verified
```

PR #544–#547 are historical Compare authority and do not authorize the current material Compare change.

## Preserved exclusions

```text
additional archived_url mutation
source URL replacement or normalization
canonical Market Access additions or mutation
new Evidence identities or Evidence Relations
stable-asset additions/deletions or other canonical mutation
schema/taxonomy change
new public route family
ranking / scoring / recommendation
generated substitute brand artwork
issuer/project mark presented as token logo without reviewed asset-specific attribution
remote runtime logo fetching
Phase-D logo imports during Phase C
unrelated sitewide redesign
automatic continuation beyond maintenance closeout
```

## Required work-start protocol

Before Phase C, read and cite:

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
```

Then read the immediately preceding reviewed result for any later phase. No implementation should proceed from chat memory alone.
