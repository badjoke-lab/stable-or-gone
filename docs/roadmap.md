# Stable or Gone Roadmap

Updated: 2026-08-12  
Status: Compare feedback and Stablecoin logo maintenance authority is the current public-maintenance lane; canonical state remains post-PR552 and canonical delta is zero

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
Canonical delta authorized by current lane: 0
```

## Current Stablecoin logo display checkpoint

```text
Canonical stablecoins: 119
Direct Stablecoin/product logos: 98
Neutral fallbacks: 21
Fallback population: frozen by config/compare-logo-maintenance-authority.json
```

The current counts are a review baseline, not a target. The next logo review may increase direct-logo coverage only where current Stablecoin/product-specific attribution is sufficient.

## Current work item — Compare feedback and logo maintenance

Binding authority:

```text
config/compare-logo-maintenance-authority.json
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
docs/ui-v3-remediation-authority.md
```

Required outcomes:

```text
1. matching-row Compare control gives visible feedback, including explicit no-op feedback
2. Compare record headers show the same audited Stablecoin mark system used elsewhere
3. all 21 current neutral fallbacks receive a fresh reviewed direct-logo/fallback disposition
4. future new canonical stablecoins cannot merge without a reviewed logo disposition
5. canonical stablecoin additions trigger blocking logo coverage validation
```

The current maintenance authority does not authorize canonical registry mutation.

## Schedule and phase gates

```text
2026-08-12  Phase A — authority/specification/schedule merge only
next        Phase B — re-audit all 21 current neutral fallbacks and record a reviewed result
then        Phase C — implement Compare matching-row feedback and Compare Stablecoin marks
then        Phase D — import only Phase-B-approved logos and implement the permanent future growth logo gate
then        Phase E — direct desktop/mobile artifact review, all-record mark validation, production verification, closeout
closeout    restore repository REVIEW_GATE; no automatic continuation
```

Schedule entries do not authorize skipping phase boundaries. Each later phase must cite the immediately preceding reviewed result.

## Phase B — 21-fallback re-audit requirements

The re-audit population is exactly the baseline set in the authority contract.

Every record must end in one of:

```text
direct_logo
neutral_fallback
```

Required recorded basis:

```text
source page
source asset URL or explicit null
mark type
source class
identity basis
evidence / reason for fallback
local asset path or explicit null
```

`mnee`, `bison-bank-eub`, and `bison-bank-usb` are priority rechecks because they were added after the original 116-record logo closure and all currently fall back. This priority does not imply promotion.

Issuer, project, directory, ambiguous-symbol, or unverifiable artwork remains fallback unless reviewed evidence binds the mark specifically to the canonical Stablecoin/product.

## Phase C — Compare implementation requirements

The comparison control must mean only:

```text
hide a row when all selected records have the same normalized displayed value for that attribute
```

Required feedback:

```text
differing attribute count
matching rows hidden count
explicit “nothing to hide” state when all displayed rows already differ
```

Blocking test coverage must include one selection where enabling the control actually reduces visible rows and one selection where it does not reduce rows but does produce the explicit no-op message.

Compare headers must render the same audited mark result as the register/dossiers. Reuse `StablecoinMark` / `stablecoinLogo` semantics; do not create a Compare-only logo table and do not fetch remote images at runtime.

## Phase D — logo import and permanent growth gate

Only Phase-B-reviewed direct-logo outcomes may be imported.

Required implementation effects:

```text
vendor accepted images locally
record provenance and license/source information
update canonical-slug-first logo mapping
update display policy and reviewed decisions
synchronize public stablecoin-logo README counts
keep unresolved records on neutral fallback
make new canonical stablecoin growth require logo disposition before merge
make stablecoin data additions trigger logo coverage validation
make logo decision count equal canonical stablecoin count as a blocking invariant
```

A future stablecoin growth PR must cite `docs/quality/stablecoin-logo-disposition-operating-spec.md` and include `logo disposition` in its complete-record requirement.

## Phase E — acceptance and closeout

Required before merge/closure of the accepted implementation:

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
Production run 31514472928 — PR #552 main publication verified
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
unrelated sitewide redesign
automatic continuation beyond maintenance closeout
```

## Required work-start protocol

Before each phase, read and cite:

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
```

Then read the immediately preceding reviewed result for the phase being started. No implementation should proceed from chat memory alone.
