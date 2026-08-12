# Stable or Gone Roadmap

Updated: 2026-08-12  
Status: Compare feedback and Stablecoin logo maintenance lane active; Phase D completes with the current merge; Phase E is next

## Current canonical checkpoint

```text
Current stage: MAINTENANCE_AUTHORITY_PHASE_E_NEXT
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
Phase D entry main: c24b9ea9f98573a949c91bd512ef1413311226c6
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized by current lane: 0
Additional logo promotions authorized: 0
Automatic continuation beyond closeout: false
```

## Current Stablecoin logo checkpoint

Accepted Phase D display state after the current merge:

```text
Canonical stablecoins: 119
Reviewed logo dispositions: 119 / 119
Direct Stablecoin/product logos: 101
Neutral fallbacks: 18
Phase D promotions: mnee, usdgo, usr
Other Phase B fallbacks preserved: 18
```

Binding current package:

```text
config/compare-logo-maintenance-authority.json
docs/quality/stablecoin-logo-disposition-operating-spec.md
config/compare-phase-c-implementation-result.json
config/compare-logo-phase-d-implementation-result.json
docs/quality/compare-logo-phase-d-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
```

## Completed Phase C — Compare implementation

Accepted behavior remains:

```text
control label: Hide matching rows
differing attribute count: visible
matching attribute count: visible as shown/hidden
all-different no-op: All displayed attributes already differ. Nothing to hide.
Compare marks: cloned pre-rendered StablecoinMark output
Compare-only logo mapping: none
remote runtime logo fetch: none
canonical delta: 0
```

The existing Compare visual-acceptance workflow continues to guard 2–4 selection, zero-state, discovery/navigation/replacement, matching-row behavior, direct/fallback marks, mobile feedback readability, and bounded horizontal scrolling.

## Completed Phase D — reviewed logo import and permanent growth gate

Phase D promotes exactly:

```text
mnee
usdgo
usr
```

Imported mark provenance:

```text
mnee   /stablecoin-logos/mnee.svg   SHA-256 ddee8994d9b3ac38835ed5f99d01a6f029cc8a997c9096d2b9ee4f9e49808911
usdgo  /stablecoin-logos/usdgo.svg  SHA-256 e75fc78d2b70dd3da4725aed2b1ed3e4f6201c7299a22f737154557b92ce4a84
usr    /stablecoin-logos/usr.png    SHA-256 56279ebd60697a49d0c8fa62179a40eb7ba07b26d756729645d331de2addbf16
```

The old `usdgo.png` issuer mark and `usr.svg` generic Resolv project mark are removed after product/token-specific replacements are accepted.

### USDGO source correction

Phase B identified an Anchorage Digital USDGO image. Phase D directly inspected that asset and rejected it as a product illustration, not a compact mark. The imported asset is the compact inline SVG used in the current first-party `usdgo.com` homepage header, corroborated by the same identity in OSL official USDGO listing artwork.

This is a source-artifact correction within the already-approved `usdgo` slug. It does not add a fourth promotion.

### Permanent record-growth gate

Core CI now runs:

```text
node scripts/audit-stablecoin-logo-coverage.mjs
```

on every pull request without data-path exclusions.

Blocking invariants:

```text
reviewed logo decision count == canonical Stablecoin count
every canonical Stablecoin has exactly one reviewed disposition
direct-logo assets exist locally and resolve consistently
neutral fallbacks are explicit in display policy
resolver direct set matches reviewed direct set
orphan logo assets are rejected
```

A neutral fallback remains valid. Missing review is not. A data-only Stablecoin growth PR cannot bypass this gate.

## Schedule and phase gates

```text
2026-08-12  Phase A — authority/specification/schedule merge — complete in PR #554
2026-08-12  Phase B — exact 21-fallback re-audit — complete in PR #555
2026-08-12  Phase C — Compare feedback + Compare Stablecoin marks — complete in PR #556
2026-08-12  Phase D — import mnee/usdgo/usr + permanent growth gate — complete after current merge
next        Phase E — changed-state desktop/mobile artifact review + all-record mark validation + exact-main production verification + closeout
closeout    restore repository REVIEW_GATE; no automatic continuation
```

Schedule order is binding. Phase E is verification/closeout only; it does not reopen logo discovery, canonical growth, archive work, Market Access, or unrelated UI work.

## Phase E — acceptance and closeout

Required before closure:

```text
MNEE direct mark desktop + mobile artifact
USDGO direct mark desktop + mobile artifact
USR direct mark desktop + mobile artifact
preserved neutral fallback desktop + mobile artifact
all-record Stablecoin mark catalog: 119 / 119
reviewed disposition count: 119 / 119
public display partition: 101 direct / 18 fallback
no orphan logo assets
Compare interaction regression checks
no page-level overflow / clipping / footer overlap regression
direct changed-state artifact inspection
exact-main production deployment and official-origin verification
canonical hash/file count unchanged
```

Automated workflow success alone does not close a visible defect. Phase E closes by restoring a fresh repository `REVIEW_GATE` after merged-state and production verification.

## Completed Evidence Archive Payload Verification Batch 2

PR #551 authorized eight reviewed dated archive additions, PR #552 implemented them, production run `31514472928` succeeded, and PR #553 restored `REVIEW_GATE` before the current maintenance lane.

```text
Archive recorded: 463 -> 471
Archive not recorded: 122 -> 114
Evidence: 585 -> 585
Evidence Relations: 585 -> 585
Stable assets: 119 -> 119
Market Access Records: 12 -> 12
```

No additional archive work is authorized by that lineage.

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
PR #555 — Phase B 21-fallback reviewed result
PR #556 — Phase C Compare feedback / Stablecoin mark implementation and review result
current Phase D PR — exact three logo imports + permanent growth gate
```

Historical lineage does not authorize new work merely because it remains in repository history.

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
logo promotion outside mnee/usdgo/usr
unrelated sitewide redesign
automatic continuation beyond maintenance closeout
```

## Required work-start protocol

Before Phase E, read and cite:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/roadmap-amendments/2026-08-12-compare-logo-maintenance-authority.md
docs/quality/compare-logo-maintenance-spec.md
docs/quality/stablecoin-logo-disposition-operating-spec.md
config/compare-logo-maintenance-authority.json
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
config/compare-phase-c-implementation-result.json
docs/quality/compare-phase-c-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
config/compare-logo-phase-d-implementation-result.json
docs/quality/compare-logo-phase-d-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-phase-d-review-result.md
docs/ui-v3-remediation-authority.md
config/stablecoin-logo-display-policy.json
config/stablecoin-logo-decisions.json
config/stablecoin-logo-decisions-additions.json
public/stablecoin-logos/README.md
```

No continuation proceeds from chat memory alone. The immediately preceding merged reviewed result controls the next phase.
