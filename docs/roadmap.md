# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #243
Active: PR #244
Next: PR #245
Stable assets: 92
Gate V2-F: not passed
Record growth: authorized after PR #246 candidate audit
Production publication: deferred
```

## Fixed boundary while UI review is unavailable

The owner cannot currently perform the required all-route desktop and mobile visual review. UI work remains paused and Gate V2-F remains not passed.

The non-UI continuation program may advance monitoring, reviewed record growth, registry-wide quality, machine-readable parity, build reproducibility, and release-candidate documentation. It must not:

- approve the current UI;
- pass Gate V2-F;
- select or execute a production deployment;
- publish monitored candidates automatically;
- write monitoring output directly to canonical data;
- claim public parity before an explicitly approved deployment.

## Completed UI sequence

```text
PR #207 approved v2 contract and governance
PR #208 shared visual foundation
PR #209 Home
PR #210 Stablecoins index
PR #211 Stablecoin detail
PR #212 Organizations index and detail
PR #213 Events index and detail
PR #214 Editorial and project pages
PR #215 Mobile and accessibility hardening
PR #216 Visual-mark correction
```

## Completed quality sequence

```text
PR #217-#225 date, reserve, and evidence quality
PR #226-#229 deployment quality
PR #230 monitoring skeleton and canonical guard
PR #231 official-source observations and private candidates
PR #232 review reports, evidence drafts, and draft PR material
PR #233 non-UI continuation roadmap and safety boundary
PR #234 monitoring baseline specification and pending source records
PR #235 baseline-aware material-change detection
PR #236 review-driven baseline update proposal flow
PR #237 observation change classification and comparison traceability
PR #238 versioned content normalization and noise suppression
PR #239 deterministic monitoring audit and safety closure
PR #240 monitoring feasibility audit for all 92 assets
PR #241 reserve and assurance source expansion
PR #242 redemption and terms source expansion
PR #243 issuer, migration, and shutdown source expansion
```

## Phase A closure

```text
Protected Phase A sources: 4
Normalization version: sog_official_source_normalization_v2
Workflow trigger: manual only
Workflow repository permission: contents: read
Automatic baseline write: false
Automatic canonical write: false
Automatic commit: false
Automatic pull request: false
Public monitoring output: false
Production publication: false
```

Phase A safety remains a permanent CI requirement. The original four source definitions remain protected while later Phase B sources may be added with matching pending baselines.

Audit: `docs/quality/monitoring-phase-a-audit.md`

## PR #240 result

```text
Canonical stable assets audited: 92
Classification vocabulary: 4 states
Network access during audit: false
Live source registration: 0
Accepted baseline changes: 0
Canonical record changes: 0
Public output: false
Production publication: false
```

PR #240 classifies every current stable asset as `automatically_monitorable`, `partially_monitorable`, `manual_review_only`, or `no_reliable_official_source` from checked-in Registry v2 metadata. Detailed output remains private staging material.

Specification: `docs/quality/monitoring-feasibility-audit-spec.md`

## PR #241 result

```text
Enabled official sources: 9
Reserve and assurance sources added: 5
Pending baselines: 9
Accepted baselines: 0
Stable assets changed: 0
Canonical evidence created: 0
Workflow permissions changed: false
Public output: false
Production publication: false
```

PR #241 adds reviewed official pages for FDUSD, RLUSD, GUSD, USDP, and USDG. Each configured URL, final host, content type, stablecoin target, organization target, canonical relationship, and visible reserve or assurance signal was reviewed before registration. All five new baselines remain `pending_initial_acceptance` with no committed response digest.

Specifications and review record:

- `docs/quality/monitoring-reserve-assurance-expansion-spec.md`
- `scripts/monitoring/sources/reserve-assurance-source-review-pr241.json`

## PR #242 result

```text
Enabled official sources: 14
Redemption and terms sources added: 5
Pending baselines: 14
Accepted baselines: 0
Stable assets changed: 0
Canonical evidence created: 0
Workflow permissions changed: false
Public output: false
Production publication: false
```

PR #242 adds reviewed official pages for Tether redemption instructions, Tether fees and minimums, Circle Mint, Paxos stablecoin terms, and Gemini GUSD sale/redemption support. Every source targets existing canonical stablecoin and organization IDs through an existing relationship and uses the existing `issuance_redemption_update` signal only.

The review boundary explicitly prevents SOG from treating every holder as directly eligible for issuer redemption. Eligibility, jurisdiction, account verification, fees, minimums, suspension, termination, and secondary-market exits remain separate review questions. All five new baselines remain `pending_initial_acceptance` with no committed response digest.

Specifications and review record:

- `docs/quality/monitoring-redemption-terms-expansion-spec.md`
- `scripts/monitoring/sources/redemption-terms-source-review-pr242.json`

## PR #243 result

```text
Enabled official sources: 19
Issuer lifecycle sources added: 5
Pending baselines: 19
Accepted baselines: 0
Stable assets changed: 0
Canonical lifecycle fields changed: 0
Canonical evidence created: 0
Workflow permissions changed: false
Public output: false
Production publication: false
```

PR #243 adds reviewed official lifecycle pages for the BUSD minting halt and wind-down, the optional DAI-to-USDS upgrade, the aUSD-to-aSEED migration, the continued coexistence of Liquity V1/LUSD with Liquity V2/BOLD, and the PAX-to-USDP rebrand.

The new `lifecycle_update` signal creates only private review prompts after baseline comparison. It does not change asset status, dates, identity, migration, predecessor/successor relationships, or implementation state. Optional upgrade, migration, parallel successor, rebrand, and wind-down remain separate classifications. All five new baselines remain `pending_initial_acceptance` with no committed response digest.

Specifications and review record:

- `docs/quality/monitoring-issuer-lifecycle-expansion-spec.md`
- `scripts/monitoring/sources/issuer-lifecycle-source-review-pr243.json`

## Approved continuation sequence

### Phase A — material-change monitoring — complete

```text
PR #234 monitoring baseline specification
PR #235 baseline-aware material-change detection
PR #236 human-approved baseline update flow
PR #237 observation change classification
PR #238 content normalization and noise suppression
PR #239 deterministic monitoring audit and safety closure
```

Permanent behavior:

```text
unchanged source                       -> no monitoring candidate
material content change + signal       -> private candidate
material content change without signal -> observation only
metadata-only change                   -> classified separately, no candidate
fetch failure                          -> operational finding, no content candidate
new source without accepted baseline   -> explicit new_source state
baseline update                        -> separate human-reviewed PR
canonical/public write                 -> prohibited
```

### Phase B — monitored-source coverage — active

```text
PR #240 monitoring feasibility audit for all 92 assets
PR #241 reserve and assurance source expansion
PR #242 redemption and terms source expansion
PR #243 issuer, migration, and shutdown source expansion
PR #244 regulatory-source monitoring boundary
PR #245 monitoring coverage report and validator
```

Source-count growth alone is not completion. Every monitored source requires official ownership, an allowlisted HTTPS host, canonical target IDs, signal scope, a reviewable baseline state, version-compatible normalization, and no automatic canonical action.

PR #244 must define which regulator and government sources may be monitored, how jurisdiction and issuer scope are recorded, how notices differ from final orders, and why a regulatory mention cannot automatically change stablecoin status. It may register only sources with explicit canonical targets and matching pending baselines.

### Phase C — reviewed growth from 92 to 100

```text
PR #246 final-eight candidate audit and selection
PR #247 Growth A: 92 -> 94
PR #248 Growth B: 94 -> 96
PR #249 Growth C: 96 -> 98
PR #250 Growth D: 98 -> 100
```

PR #246 must complete duplicate, alias, issuer/protocol, launch boundary, lifecycle, stabilization, redemption, reserve-applicability, deployment, event, evidence, and historical-significance review before promotion.

Each growth PR is limited to two stable assets and all required supporting records. Unknown values remain unknown. Non-applicable record groups are documented instead of filled with invented placeholders.

### Phase D — 100-record registry audit

```text
PR #251 ID, slug, alias, and symbol uniqueness
PR #252 organization, issuer, and relationship integrity
PR #253 evidence URL, source identity, and duplication integrity
PR #254 reserve, redemption, and backing applicability
PR #255 deployment, contract, and chain identity
PR #256 launch, terminal, migration, and relationship boundaries
PR #257 known-unknown and placeholder integrity
PR #258 monitoring coverage recalculation for 100 assets
```

The goal is not to eliminate unknown values. Each value must be supported, explicitly unresolved, unavailable from an official source, or correctly non-applicable.

### Phase E — non-UI release preparation

```text
PR #259 Registry v2/v3 and machine-readable parity
PR #260 counts, manifest, version, and provenance integrity
PR #261 reproducible build and generated-output audit
PR #262 100-record canonical data freeze
PR #263 non-UI release-candidate material
```

PR #263 may prepare release notes, known-unknown inventories, monitoring coverage, deployment and rollback checklists, and a candidate commit. It does not authorize production publication.

## UI resumption and publication gate

After PR #263, non-UI continuation stops at a prepared repository candidate.

```text
owner all-route visual review
-> Gate V2-F correction PRs
-> Gate V2-F pass decision
-> explicit publication checkpoint approval
-> manual production deployment
-> deployed-commit and public-parity verification
```

Normal quality work does not publish the site.
