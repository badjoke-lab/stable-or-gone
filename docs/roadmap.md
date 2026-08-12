# Stable or Gone Roadmap

Updated: 2026-08-12  
Status: Compare feedback and Stablecoin logo maintenance lane active; Phase C Compare remediation completes with the current implementation/review merge; Phase D is next after merge

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
Phase C entry main: dc1f2925f6dbd40c50267a2de2b4f85e2fe580b5
Phase B production run: 31566866583 — success
Canonical hash: sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798
Canonical file count: 466
Canonical delta authorized by current lane: 0
```

## Current Stablecoin logo checkpoint

Phase B and Phase C preserve the current public partition:

```text
Canonical stablecoins: 119
Current public direct Stablecoin/product logos: 98
Current public neutral fallbacks: 21
```

Phase B reviewed all 21 fallbacks:

```text
reviewed: 21 / 21
direct_logo: 3
neutral_fallback: 18
Phase-D-approved direct-logo slugs: mnee, usdgo, usr
expected display partition after successful Phase D import: 101 direct / 18 fallback
```

The reviewed `101 / 18` partition is not current public state. Phase C imports no new logo asset and does not change display policy.

Binding reviewed packages:

```text
config/compare-logo-maintenance-authority.json
data/editorial-research/compare-logo-fallback-reaudit-2026-08-12.json
docs/quality/compare-logo-fallback-reaudit-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-logo-fallback-reaudit-review-result.md
config/compare-phase-c-implementation-result.json
docs/quality/compare-phase-c-review-result-spec.md
docs/roadmap-amendments/2026-08-12-compare-phase-c-review-result.md
```

## Completed Phase C — Compare implementation

Phase C addresses only the bounded Compare defects authorized by PR #554 and the Phase B gate.

Accepted result after the current implementation/review merge:

```text
control label: Hide matching rows
differing attribute count: visible
matching attribute count: visible as shown/hidden
all-different no-op: All displayed attributes already differ. Nothing to hide.
Compare marks: cloned pre-rendered StablecoinMark output
Compare-only logo mapping: none
remote runtime logo fetch: none
new logo asset import: 0
canonical delta: 0
```

Browser authority remains `.github/workflows/stablecoin-compare-matrix-visual.yml`. It must retain the existing 2–4 selection, zero-state, discovery/navigation and replacement audits and additionally prove:

1. a deterministic matching-row selection reduces visible rows when the control is enabled;
2. disabling the control restores the full aligned row set;
3. a deterministic all-different selection produces explicit no-op feedback without changing row count;
4. direct and neutral-fallback Stablecoin marks render in Compare on desktop and mobile;
5. mobile comparison remains bounded and horizontally scrollable.

Phase C evidence is emitted under `artifacts/screenshots/compare-phase-c/`.

## Current work item — Phase D logo import and permanent growth gate

Phase D may begin only after Phase C merges with exact-head CI and Compare visual acceptance successful.

The only direct-logo promotions authorized by Phase B are:

```text
mnee
usdgo
usr
```

Phase D must:

```text
reconfirm the reviewed source/provenance basis before import
vendor only the accepted local image assets
record applicable source/provenance/license metadata
update canonical-slug-first logo mapping and display policy
synchronize reviewed logo decisions and public stablecoin-logo README counts
preserve the other 18 baseline fallbacks
make every future canonical stablecoin require a reviewed logo disposition before merge
make canonical stablecoin additions trigger blocking logo coverage validation
make logo decision count equal canonical stablecoin count as a blocking invariant
```

Every future stablecoin growth PR must cite `docs/quality/stablecoin-logo-disposition-operating-spec.md`. A neutral fallback is a valid reviewed outcome; omitted logo review is not.

## Schedule and phase gates

```text
2026-08-12  Phase A — authority/specification/schedule merge — complete in PR #554
2026-08-12  Phase B — exact 21-fallback re-audit — complete in PR #555
2026-08-12  Phase C — Compare feedback + Compare Stablecoin marks — complete after PR #556 merge
next        Phase D — import only mnee/usdgo/usr + permanent future record-growth logo gate
then        Phase E — direct desktop/mobile artifact review, all-record mark validation, production verification, closeout
closeout    restore repository REVIEW_GATE; no automatic continuation
```

Schedule order is binding. Phase D cannot be collapsed into Phase E and no later stage may skip its immediately preceding reviewed result.

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
permanent new-record logo gate validation
no page-level overflow / clipping / footer overlap regression
direct changed-state artifact inspection
exact-main production verification
```

Automated workflow success alone does not close a known visual defect.

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
PR #555 — Phase B 21-fallback reviewed result
PR #556 — Phase C Compare feedback / Stablecoin mark implementation and review result
```

PR #544–#547 are historical Compare authority and do not authorize Phase D logo import or record-growth work.

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
logo promotion outside mnee/usdgo/usr without separately reviewed evidence
unrelated sitewide redesign
automatic continuation beyond maintenance closeout
```

## Required work-start protocol

Before Phase D, read and cite:

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
```

No implementation proceeds from chat memory alone. The immediately preceding merged reviewed result controls the next phase.