# Stable or Gone Roadmap

Updated: 2026-06-27

## Purpose

This is the canonical execution schedule for SOG. Detailed audits belong in `docs/audits/`; approved information architecture and visual decisions belong in `docs/architecture/`.

Required authority:

```text
AGENTS.md
docs/spec-governance.md
docs/deployment-policy.md
docs/ui-redesign/master-spec.md
docs/ui-redesign/implementation-plan.md
docs/public-taxonomy-spec.md
docs/architecture/site-architecture-v1.md
docs/architecture/stablecoin-dossier-hierarchy-v1.md
docs/architecture/index-interaction-contract-v1.md
docs/architecture/meaningful-change-history-v1.md
docs/architecture/responsive-accessibility-v1.md
docs/architecture/visual-system-and-mocks-v1.md
```

Implementation work must cite these documents before changing public semantics, routes, record counts, navigation, dossier ownership, index behavior, change history, responsive behavior, accessibility behavior, or visual presentation.

## Registry checkpoint

```text
Stable assets:                 92
Organizations:                 86
Organization relationships:   101
Events:                       150
Canonical evidence records:   455
Public source identities:      410
Evidence relations:            455
Known unknowns:                253
Deployments:                   130
Reserve components:            125
```

Canonical count source:

```text
docs/migration/registry-v3-baseline.json
```

## Current position

```text
Repository: badjoke-lab/stable-or-gone
Public site: https://sog.badjoke-lab.com/
Current phase after PR #190 merges: Phase 4 — approved UI implementation
Latest completed work after PR #190 merges: PR 22
Next approved work: PR 23 — implement global shell and grouped navigation
Gate C: PASS
Gate D: PASS after PR #190
Routine record growth: paused at 92 assets
Batch 18 selection: prohibited during repair
Automatic production deployment: disabled
Production publication: paused except verified emergency repair
```

## Completed gates and PRs

### Gate A — documentation reset

Status: **PASS**

```text
PR #167  documentation reset
```

### Gate B — production-integrity repair

Status: **PASS**

```text
PR #168  repair baseline and defect inventory
PR #169  generated build provenance
PR #170  route, sitemap, canonical, JSON-LD, and output parity
PR #171  mobile information preservation
```

Gate B guarantees source-commit and canonical-data provenance, route and sitemap parity, stale-output rejection, and material mobile-information preservation.

### Gate C — taxonomy and data semantics

Status: **PASS after PR #183**

```text
PR #172  public-value registry
PR #173  lifecycle and issuance normalization
PR #174  reference-target and peg normalization
PR #175  backing and stabilization normalization
PR #176  event category and subtype normalization
PR #177  organization classification normalization
PR #178  evidence reliability, provenance, and type separation
PR #179  deployment status and verification-state separation
PR #180  value-state semantics
PR #181  explicit primary display relationships
PR #182  evidence-source identity deduplication with claim preservation
PR #183  record-specific public-copy migration and 92-record completion matrix
```

Gate C protections:

```text
Eight explicit value states
92 deterministic primary display relationships
455 canonical evidence records preserved
410 public source identities
455 evidence relations preserved
Zero public duplicate source URLs
Zero orphan evidence relations
92/92 records migration-ready
Zero unresolved component copy targets
```

### Gate D — information architecture and mocks

Status after PR #190 merges: **PASS**

```text
PR #185  site architecture and route roles
PR #186  stablecoin dossier hierarchy and field matrix
PR #187  index search, filter, sort, and comparison contract
PR #188  meaningful public change-history contract
PR #189  responsive and accessibility contract
PR #190  visual system and ten approved image mocks
```

Gate D means the design and interaction contracts are approved. It does not mean the production UI has been implemented or published.

## Gate D protected baselines

### Site architecture — PR 17

```text
Route patterns:                       27
Static routes:                        24
Dynamic route families:                3
HTML route patterns:                  22
Machine-readable route patterns:       5
Duplicate routes:                       0
Unassigned routes:                      0
Routes renamed or removed:              0
Redirects introduced:                  0
```

Approved groups:

```text
Registry: Stablecoins, Organizations, Events
Learn: Guides, Glossary, Models
Project: Methodology, Updates, About
Utilities: Corrections, Support
```

### Stablecoin dossier — PR 18

```text
Required dossier sections:           8
Current field surfaces:            102
Synthetic required fields:          12
Total field-to-section rows:        114
Unassigned fields:                    0
Deprecated fields:                    0
```

Required order:

```text
Identity and current state
Organizations and control
How the asset works
Deployments and legal context
History
Evidence
Known unknowns and coverage
Corrections and further reading
```

Evidence, known unknowns, all organization relationships, and independent deployment/evidence axes are mandatory.

### Index interactions — PR 19

```text
Index contracts:                    3
Explicit search fields:            18
Multi-value filters:               16
Sort modes:                        15
Material mobile-row fields:        26
Comparison-enabled indexes:         1
Comparison-disabled indexes:        2
```

Stablecoin comparison supports two to four records. Organization and event scorecards remain disabled because they would imply false equivalence. Price, market-cap, volume, TVL, APY, safety scores, and investment rankings are outside the comparison contract.

### Meaningful change history — PR 20

```text
Approved change types:               8
Required structured fields:         12
Legacy update entries preserved:    13
Legacy entries auto-migrated:         0
Date signals audited:             1,324
Invalid date shapes:                  0
```

Approved types:

```text
status_change
event_added
evidence_added
relationship_change
reserve_redemption_change
known_unknown_added
known_unknown_resolved
copy_only_correction
```

Review timestamps, source-publication dates, and generated build dates do not create meaningful change entries automatically.

### Responsive and accessibility — PR 21

```text
Responsive bands:                    3
Page-family contracts:               8
Protected table kinds:              25
Target mobile transformations:      25
Keyboard contracts:                 10
Announcement contracts:              5
```

Required foundations include 44px targets, 320px reflow, 200% zoom, text-spacing support, forced-colors support, reduced motion, non-color state labels, skip link, current-page state, and full long-identifier access.

### Visual system and mocks — PR 22

```text
Visual color tokens:                16
Generated SVG mocks:                10
Large/desktop-state mocks:           7
Mobile mocks:                         3
Required-element omissions:          0
Prohibited visual-language findings: 0
Route changes:                        0
Production UI implementation:        0
```

Approved mock set:

```text
stablecoin index desktop
stablecoin detail desktop
stablecoin index mobile
stablecoin detail mobile
organization detail
event detail
home
open filter state
expanded evidence state
known-unknown warning state
```

The mock package is generated deterministically from `config/visual-system-contract.mjs`. Evidence and known unknowns remain first-class. Multi-organization context remains visible. The design does not resemble a market, ranking, portfolio, or recommendation interface.

## Phase 4 implementation sequence

```text
PR 23  global shell, grouped navigation, skip link, current-page state
PR 24  stablecoin index and comparison
PR 25  organization index
PR 26  event index
PR 27  stablecoin dossier — identity and current state
PR 28  stablecoin dossier — organizations and control
PR 29  stablecoin dossier — mechanics, reserves, and redemption
PR 30  stablecoin dossier — deployments and legal context
PR 31  stablecoin dossier — history and events
PR 32  stablecoin dossier — evidence
PR 33  stablecoin dossier — known unknowns, corrections, further reading
PR 34  meaningful Updates implementation and reviewed legacy migration
PR 35  complete responsive transformations
PR 36  complete accessibility and interaction audit
```

No implementation PR may weaken the Gate C or Gate D contracts to make the page easier to build.

## Immediate next work — PR 23

1. Implement the global shell using the approved visual tokens.
2. Replace the flat navigation with Registry, Learn, and Project groups.
3. Keep Corrections as the primary utility and Support as secondary.
4. Add a skip link and labelled main-content target.
5. Add current-page navigation state.
6. Implement the compact disclosure navigation with Escape and focus return.
7. Add footer access to version, manifest, LLM, AI, methodology, corrections, and support.
8. Add forced-colors, reduced-motion, focus, long-value wrapping, and 44px target foundations.
9. Preserve all 27 routes and machine-readable endpoints.
10. Do not add stable assets, select Batch 18, or publish production.

PR 23 completion criteria:

```text
Grouped navigation matches the approved site architecture
Desktop and compact navigation are keyboard-operable
Skip link and main target work
Current-page state is programmatically exposed
Corrections remains visible
Support remains secondary
Data access remains available
Visual tokens are used without weakening contrast
All routes and canonical counts remain unchanged
No production deployment occurs
```

## Preserved quality queues

```text
Missing canonical launch dates:           20
Historical terminal dates unresolved:      4
Historical relationship end dates:         7
Reserve applicability queue:               12
Public duplicate evidence URL groups:       0
Evidence reliability values unknown:       36
Direct workflow placeholders retained:    112
Deployment canonicality not recorded:      67
Deployment verification not recorded:     130
Deployment source review needed:           15
```

Queues may be reduced only through source-backed review. UI work must not clear them by defaulting, guessing, hiding, or relabeling them as known.

## Growth policy

Routine growth remains paused at 92 assets. The final eight records remain blocked until implementation, responsive/accessibility hardening, and the complete 92-record repaired-UI audit are finished.

The 100 target never permits thin records, unsupported dates, placeholder sources, collapsed organization roles, hidden unknowns, erased evidence relations, duplicated public sources, or reduced evidence requirements.

## Publication policy

```text
Automatic production deployment: disabled
Preview branch deployments: disabled
Routine repair PR deployment: none
Verified emergency repair: manual emergency publication allowed
100-record repaired UI: one planned manual publication checkpoint
Publication path: manual GitHub Actions workflow only
Pages project: stable-or-gone
Production branch: main
```

Canonical publication rules remain in `docs/deployment-policy.md`.

## Completion definition

The repair program is complete only when:

- 100 canonical stable assets are present;
- all public taxonomy axes are consistent;
- every record and route passes the repaired-UI audit;
- no material mobile information is suppressed;
- evidence identities, evidence relations, and known unknowns remain visible and connected;
- production identifies one source commit and one canonical data hash;
- HTML, sitemap, metadata, machine-readable files, and canonical counts agree;
- the production publication report is recorded.
