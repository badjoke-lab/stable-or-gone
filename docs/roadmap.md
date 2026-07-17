# Stable or Gone Roadmap

Updated: 2026-07-17  
Status: canonical execution schedule — PR #414 active review gate

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
PR #414 Post-PR #413 Review Gate: active; complete on merge
PR #415 UI v3 Rebuild D — stablecoin dossier: approved next
PR E events and organizations: blocked
REVIEW GATE: mandatory after PR #415
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
```

## PR #413 reviewed outcome

```text
Source implementation merge: 8771de6ad5fc79310a638455f5be24b27af20eb3
Source implementation head: 6df1719295070d206e800a92e024284e4e6a6011
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Visual review run: 29573553479
Visual artifact: 8404110345
Required captures: 10
Completed captures: 10
Visual failures: 0
Horizontal-overflow failures: 0
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Owner approval records changed: 0
Automated rendering equals owner approval: false
```

The home is now a compact evidence-registry product entrypoint with canonical cross-registry search, truthful totals, lifecycle state, separate event/publication histories, known-unknown issue watch, exploration routes, recently reviewed records, and reviewed guides.

The stablecoin register now exposes six visible filter groups, selected-state counts, active chips, clear-all, result range/count, sorting, URL-backed state, bounded pagination at 20 records per page, desktop table and compact-card representations, comparison state, and explicit no-result behavior.

## PR #414 decision

PR #414 authorizes exactly:

```text
PR #415 — UI v3 Rebuild D: stablecoin dossier
REVIEW GATE
```

PR #415 may redesign only the existing `/stablecoin/[slug]/` template family. No route addition, removal, or rename is authorized.

The dossier hierarchy must prioritize:

```text
1. Current lifecycle and issuance
2. Redemption meaning and access
3. Backing and reserve structure
4. Issuer, operator, governance, and control relationships
5. Material lifecycle events and timeline
6. Deployment/network summary
7. Unresolved questions and known unknowns
8. Evidence identities and claim context
9. Progressively disclosed technical fields
```

Required representative visual states:

```text
Desktop + mobile: /stablecoin/usdc/ — deep active fiat-backed record
Desktop + mobile: /stablecoin/ust/ — failed algorithmic record
Desktop + mobile: /stablecoin/busd/ — discontinued wind-down record
```

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Home/register/event/organization/guide templates changed by PR #414: 0
Owner approval records changed: 0
UI completion declared: false
```

Automated screenshots remain non-approving. PR #415 may not redesign events, organizations, guides, or secondary pages, and may not change canonical data, public machine-readable outputs, routes, metadata contracts, or owner-approval records. After PR #415, stop at `REVIEW GATE` before PR E.
