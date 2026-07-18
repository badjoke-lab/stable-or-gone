# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #421 active full visual closure

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
PR #420 Post-PR #419 Review Gate: complete
PR #421 UI v3 Rebuild G — full visual closure: active
Exit state: AWAITING OWNER REVIEW
Owner-approved desktop templates: 0
Owner-approved mobile templates: 0
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
docs/quality/ui-v3-full-visual-closure-pr421.md
config/ui-v3-full-visual-closure-pr421.json
docs/migration/ui-v3-full-visual-closure-pr421.json
```

## Completed implementation lineage

```text
PR #411 global shell: a9a37b79ca6b7313d310d206ad82dc19a273598f
PR #413 home/register: 8771de6ad5fc79310a638455f5be24b27af20eb3
PR #415 dossier: e4af173ff3560e0474b8282de0ad8da4532d0f4a
PR #417 events/organizations: aa4e5b98ae25652c2aeb6327000ce6a7b8f14e51
PR #419 guides/secondary pages: 5e5857f2e0bd39b24dfc9afaef62cc9e9fa27eb7
PR #420 final review authority: 1dbe3cded3701700a59608e409b79c2030f79aa2
```

## PR #421 full visual closure

PR #421 captures the final design-contract matrix:

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

Required outputs:

```text
Final machine manifest
Final contact sheet
Final owner-review worksheet
Merge-lineage verification
Protected-boundary verification
```

Hard gates:

```text
All fourteen captures exist
Shared shell and correct template markers present
H1 remains at least 28px
Zero horizontal page overflow
Register filtered and empty states are genuine
Register/event/organization lists remain bounded
Dossier and guide hierarchy remain complete
No production UI, route, canonical, public projection, metadata, or approval-register changes
Automated capture remains non-approving
```

## Owner approval boundary

The visual approval register remains:

```text
Required templates: 6
Accepted desktop: 0
Accepted mobile: 0
Pending desktop: 6
Pending mobile: 6
UI completion: false
```

PR #421 may reach `AWAITING OWNER REVIEW`. The generated contact sheet and worksheet are review evidence only. They do not mark any template accepted.

Explicit owner acceptance or rejection is required for:

```text
home desktop/mobile
stablecoin register desktop/mobile
stablecoin dossier desktop/mobile
events desktop/mobile
organizations desktop/mobile
guides desktop/mobile
```

## Preserved boundaries

```text
Production UI changed: 0
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Owner approval register changed: 0
Automated owner approvals: 0
UI completion declared: false
Later implementation phase: none
```

Exit state: `AWAITING OWNER REVIEW`.
