# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #419 active

## Current position

```text
Canonical stable assets: 112
Organizations: 107
Relationships: 124
Events: 187
Evidence: 559
Evidence Relations: 559
Deployments: 174
Market Access Records: 8
Archive recorded: 430
Archive not recorded: 129
Issue #281 UI v3 rebuild: reopened
PR #409 UI v3 Rebuild A — design contract and failure gates: complete
PR #410 Post-PR #409 Review Gate: complete
PR #411 UI v3 Rebuild B — global shell and navigation: complete
PR #412 Post-PR #411 Review Gate: complete
PR #413 UI v3 Rebuild C — home and stablecoin register: complete
PR #414 Post-PR #413 Review Gate: complete
PR #415 UI v3 Rebuild D — stablecoin dossier: complete
PR #416 Post-PR #415 Review Gate: complete
PR #417 UI v3 Rebuild E — events and organizations: complete
PR #418 Post-PR #417 Review Gate: complete
PR #419 UI v3 Rebuild F — guides and secondary pages: active; complete on merge
PR G full visual closure: blocked
REVIEW GATE: mandatory after PR #419
```

## Current authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/post-351-data-growth-operating-spec.md
docs/quality/ui-v3-rebuild-design-contract-pr409.md
config/ui-v3-rebuild-design-contract-pr409.json
docs/quality/post-pr411-review-gate-pr412-spec.md
docs/migration/post-pr411-review-gate-pr412.json
docs/quality/ui-v3-home-register-pr413.md
config/ui-v3-home-register-pr413.json
docs/migration/ui-v3-home-register-pr413-handoff.json
docs/quality/post-pr413-review-gate-pr414-spec.md
docs/migration/post-pr413-review-gate-pr414.json
docs/quality/ui-v3-stablecoin-dossier-pr415.md
config/ui-v3-stablecoin-dossier-pr415.json
docs/migration/ui-v3-stablecoin-dossier-pr415-handoff.json
docs/quality/post-pr415-review-gate-pr416-spec.md
docs/migration/post-pr415-review-gate-pr416.json
docs/quality/ui-v3-events-organizations-pr417.md
config/ui-v3-events-organizations-pr417.json
docs/migration/ui-v3-events-organizations-pr417-handoff.json
docs/quality/post-pr417-review-gate-pr418-spec.md
docs/migration/post-pr417-review-gate-pr418.json
docs/quality/ui-v3-guides-secondary-pages-pr419.md
config/ui-v3-guides-secondary-pages-pr419.json
docs/migration/ui-v3-guides-secondary-pages-pr419-handoff.json
```

## PR #417 reviewed outcome

```text
Source implementation merge: aa4e5b98ae25652c2aeb6327000ce6a7b8f14e51
Source implementation head: 8d9d9472e9458ac689b7edb624baf737e5119364
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Visual review run: 29596605158
Visual artifact: 8413318222
Required captures: 8
Completed captures: 8
Visual failures: 0
Horizontal-overflow failures: 0
Mobile vertical-density failures: 0
Events mobile body height: 8,886px
Organizations mobile body height: 8,514px
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Owner approval records changed: 0
```

## PR #418 decision

PR #418 authorizes exactly:

```text
PR #419 — UI v3 Rebuild F: guides and secondary pages
REVIEW GATE
```

Authorized existing route families:

```text
/guides/
/guides/[article]/
/methodology/
/about/
/glossary/
/models/
/updates/
/maintenance/
/contact/
/support/
/compare/
/access-regulation/
/timeline/
/stats/
```

## PR #419 implementation

### Guide index and guide articles

```text
Reviewed research-archive entry surface
Bounded reading width
Sticky or local table of contents
Publication, current-through, and update metadata kept separate
Summary/callout distinction
Responsive local table scrolling
Related records, revision history, sources, methodology, and correction paths preserved
Compact guide index records on mobile
```

### Methodology, about, reference, and utility pages

```text
Evidence-registry page headers
Clear section hierarchy
Canonical definitions separated from explanatory prose
Long-form table of contents retained
Responsive tables and long identifiers
Correction and support utility roles preserved
No marketing landing-page conversion
```

### Comparison, access/regulation, timeline, and statistics

```text
Visible inputs, selected state, clear actions, and result or empty state
Bounded matrices and tables
Comparison Readiness and freshness remain separate
Record absence and legal/access boundaries remain explicit
Timeline date semantics remain explicit
Statistics remain measured and registry-like
Machine-readable projections and shareable URL state preserved
No score or ranking added
```

Required representative visual states:

```text
Desktop + mobile: /guides/
Desktop + mobile: /guides/eu-stablecoin-access-after-mica/
Desktop + mobile: /methodology/
Desktop + mobile: /about/
Desktop + mobile: /compare/
Desktop + mobile: /access-regulation/
Desktop + mobile: /timeline/
Desktop + mobile: /stats/
```

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Home/stablecoin register/stablecoin dossier/event/organization templates changed: 0
Owner approval records changed: 0
UI completion declared: false
```

Automated screenshots remain non-approving. PR #419 may not change canonical data, public machine-readable outputs, routes, metadata contracts, or owner-approval records. After PR #419, stop at `REVIEW GATE` before PR G full visual closure.
