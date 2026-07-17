# Stable or Gone Agent Instructions

Current mandatory authority: PR #415 UI v3 Rebuild D — stablecoin dossier.

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
PR #413 UI v3 Rebuild C — home and stablecoin register: complete
PR #414 Post-PR #413 Review Gate: complete
PR #415 UI v3 Rebuild D — stablecoin dossier: active; complete on merge
PR E events and organizations: blocked
REVIEW GATE: mandatory after PR #415
```

PR #414 binds PR #413 merge commit `8771de6ad5fc79310a638455f5be24b27af20eb3` and successful visual review run `29573553479`. All ten home/register desktop and mobile states passed with zero visual failures and zero horizontal-overflow failures. Automated rendering remains non-approving: owner-approved desktop templates remain 0, owner-approved mobile templates remain 0, and UI completion remains false.

PR #415 may redesign only the existing `/stablecoin/[slug]/` dossier family. The primary hierarchy is current lifecycle and issuance, redemption/exit, backing/reserves, issuer and control relationships, material events, deployments, unresolved questions, evidence, and progressively disclosed technical fields.

PR #415 must capture desktop and mobile states for `/stablecoin/usdc/`, `/stablecoin/ust/`, and `/stablecoin/busd/`. It may not redesign home, register, events, organizations, guides, or secondary pages. It may not change routes, canonical data, public machine-readable outputs, metadata contracts, or owner-approval records. Automated captures do not constitute owner approval. PR #415 must stop at `REVIEW GATE`; PR E and every later workstream remain unapproved.
