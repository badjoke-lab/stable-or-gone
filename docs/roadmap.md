# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #420 active review gate

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
PR #419 UI v3 Rebuild F — guides and secondary pages: complete
PR #420 Post-PR #419 Review Gate: active; complete on merge
PR #421 UI v3 Rebuild G — full visual closure: approved next
Owner review: mandatory after PR #421
UI completion: false
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
docs/quality/post-pr419-review-gate-pr420-spec.md
docs/migration/post-pr419-review-gate-pr420.json
```

## PR #419 reviewed outcome

```text
Source implementation merge: 5e5857f2e0bd39b24dfc9afaef62cc9e9fa27eb7
Source implementation head: 87fd5d9539b87c8cee46870b60eb745644129467
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Visual review run: 29599351044
Visual artifact: 8414428588
Visual artifact digest: sha256:9b844bdd46b37b577d1c33f725a166f0682972ffc458f903066a567bef27216f
Required captures: 16
Completed captures: 16
Visual failures: 0
Horizontal-overflow failures: 0
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Owner approval records changed: 0
Automated rendering equals owner approval: false
```

The guide archive, representative long-form guide, methodology, about, comparison, access/regulation, timeline, and statistics pages now share the evidence-registry hierarchy. Reading width, generated contents navigation, publication metadata, local table containment, visible tool state, absence/freshness semantics, and no-score boundaries remain explicit.

## PR #420 decision

PR #420 authorizes exactly:

```text
PR #421 — UI v3 Rebuild G: full visual closure
AWAITING OWNER REVIEW
```

PR #421 is not another broad redesign. It prepares the final cross-template visual review package and verifies that every completed phase remains intact.

Required owner-review states:

```text
Desktop + mobile: home
Desktop default + filtered: stablecoin register
Mobile filtered: stablecoin register
Desktop empty: stablecoin register
Desktop + mobile: USDC dossier
Desktop + mobile: event register
Desktop + mobile: organization register
Desktop + mobile: representative MiCA guide
```

Total required captures: 14.

## PR #421 requirements

```text
Final screenshot manifest
Final contact sheet
Owner-review worksheet
All implementation merge commits verified as ancestors
All route/canonical/public-projection/metadata boundaries unchanged
Zero horizontal page overflow
Real filtered and empty register states
Responsive typography and 44px controls verified
Automated capture remains non-approving
```

## Owner approval boundary

The visual approval register currently remains:

```text
Required templates: 6
Accepted desktop: 0
Accepted mobile: 0
Pending desktop: 6
Pending mobile: 6
UI completion: false
```

PR #421 may reach `AWAITING OWNER REVIEW`. It may not mark any template accepted or declare UI completion until the owner explicitly accepts every required desktop and mobile template state.

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Owner approval records changed by PR #420: 0
Production UI changed by PR #420: 0
UI completion declared: false
```

After PR #421, stop at `AWAITING OWNER REVIEW` unless an explicit owner decision is recorded.
