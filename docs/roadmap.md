# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #418 active review gate

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
PR #418 Post-PR #417 Review Gate: active; complete on merge
PR #419 UI v3 Rebuild F — guides and secondary pages: approved next
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
```

## PR #417 reviewed outcome

```text
Source implementation merge: aa4e5b98ae25652c2aeb6327000ce6a7b8f14e51
Source implementation head: 8d9d9472e9458ac689b7edb624baf737e5119364
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Visual review run: 29596605158
Visual artifact: 8413318222
Visual artifact digest: sha256:fe5529682a0bf1cfe8ef9a62ff4e642b60ae5a8157835f87232f11a7a620c735
Required captures: 8
Completed captures: 8
Visual failures: 0
Horizontal-overflow failures: 0
Mobile vertical-density failures: 0
Events mobile body height: 8,886px
Organizations mobile body height: 8,514px
Mobile register height ceiling: 9,000px
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Owner approval records changed: 0
Automated rendering equals owner approval: false
```

The event and organization registers now show 20 records per page with bounded initial server rendering. Search, five visible filter groups, selected-state counts, active chips, sort, clear-all, result range/count, pagination, and explicit empty state remain available. Event impact and historical lifecycle effect are separate. Organization type, jurisdiction, roles, connected assets, relationship state/count, evidence, and confidence are separate.

The desktop and mobile event index, TerraUSD collapse event, organization index, and Circle organization record all passed. The two mobile registers also passed the explicit vertical-density gate rather than being accepted only because horizontal overflow was absent.

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

### Guides and long-form pages

```text
Bounded reading width
Table of contents or local section navigation
Clear heading rhythm
Callouts and examples
Responsive table strategy
Source presentation
Correction path
No uninterrupted wall-of-text presentation
```

### Secondary registry tools

```text
Visible inputs and selected state
Visible result and absence state
Clear action
Bounded, responsive results
Freshness/readiness/absence semantics preserved
Shareable URL state preserved where present
No derived-data or machine-readable contract changes
```

### Project and reference pages

```text
Clear heading hierarchy
Local navigation where needed
Canonical definitions distinguished from explanatory prose
Correction and support roles preserved
Long labels and URLs remain usable
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
Home/stablecoin register/stablecoin dossier/event/organization templates changed by PR #418: 0
Owner approval records changed: 0
UI completion declared: false
```

Automated screenshots remain non-approving. PR #419 may not redesign the already completed primary templates and may not change canonical data, public machine-readable outputs, routes, metadata contracts, or owner-approval records. After PR #419, stop at `REVIEW GATE` before PR G full visual closure.
