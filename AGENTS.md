# Stable or Gone Agent Instructions

Current mandatory authority: PR #418 Post-PR #417 Review Gate.

Current authority:

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

## Current workstream

```text
Canonical stable assets: 112
Canonical Evidence: 559
Evidence Relations: 559
Archive recorded: 430
Archive not recorded: 129
Deployments: 174
Market Access Records: 8
Issue #281 UI v3 rebuild: reopened
PR #417 UI v3 Rebuild E — events and organizations: complete
PR #418 Post-PR #417 Review Gate: active; complete on merge
PR #419 UI v3 Rebuild F — guides and secondary pages: approved next
PR G full visual closure: blocked
REVIEW GATE: mandatory after PR #419
```

PR #418 binds PR #417 merge commit `aa4e5b98ae25652c2aeb6327000ce6a7b8f14e51`, implementation head `8d9d9472e9458ac689b7edb624baf737e5119364`, and successful visual review run `29596605158`. All eight event and organization desktop/mobile states passed with zero visual failures, zero horizontal-overflow failures, and zero mobile vertical-density failures. The event register rendered at 8,886px and the organization register at 8,514px against the 9,000px mobile ceiling. Automated rendering remains non-approving: owner-approved desktop templates remain 0, owner-approved mobile templates remain 0, and UI completion remains false.

PR #419 may redesign only the existing guide and secondary HTML route families: `/guides/`, `/guides/[article]/`, `/methodology/`, `/about/`, `/glossary/`, `/models/`, `/updates/`, `/maintenance/`, `/contact/`, `/support/`, `/compare/`, `/access-regulation/`, `/timeline/`, and `/stats/`. Guides must prioritize reading width, table of contents, callouts, examples, section navigation, tables, and source presentation. Secondary tools must preserve visible inputs/state, bounded results, freshness/readiness/absence semantics, shareable state, and responsive tables.

PR #419 must capture desktop and mobile states for `/guides/`, `/guides/eu-stablecoin-access-after-mica/`, `/methodology/`, `/about/`, `/compare/`, `/access-regulation/`, `/timeline/`, and `/stats/`. It may not redesign home, stablecoin register, stablecoin dossier, events, or organizations. It may not change routes, canonical data, public machine-readable outputs, metadata contracts, or owner-approval records. Automated captures do not constitute owner approval. PR #419 must stop at `REVIEW GATE`; PR G and every later workstream remain unapproved.
