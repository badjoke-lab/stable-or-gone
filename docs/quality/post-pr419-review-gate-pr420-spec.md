# PR #420 Post-PR #419 Review Gate Specification

Status: active mandatory review gate  
Review PR: 420  
Source implementation PR: 419  
Public output: false

## Objective

Review the guides and secondary-pages rebuild, bind its successful contract/build and sixteen-state desktop/mobile visual audit, preserve every route, canonical, public-projection, metadata, and owner-approval boundary, and authorize exactly one final phase: PR #421, UI v3 full visual closure.

PR #421 is a non-production visual-closure and owner-review package. It may generate final screenshots, manifests, contact sheets, and approval worksheets. It may not redesign production UI or convert automated captures into owner approval.

## Binding findings

```text
UI v3 state: reopened
Completed phase: PR F — guides and secondary pages
Source implementation merge: 5e5857f2e0bd39b24dfc9afaef62cc9e9fa27eb7
Source implementation head: 87fd5d9539b87c8cee46870b60eb745644129467
Visual review run: 29599351044
Visual artifact ID: 8414428588
Visual artifact digest: sha256:9b844bdd46b37b577d1c33f725a166f0682972ffc458f903066a567bef27216f
Contract/build validation: success
Mandatory desktop/mobile visual audit: success
Required captures: 16
Completed captures: 16
Visual failures: 0
Horizontal-overflow failures: 0
Automated rendering equals owner approval: false
Owner-approved desktop templates: 0
Owner-approved mobile templates: 0
Routes changed: 0
Canonical changes: 0
Public machine-readable changes: 0
Metadata-contract changes: 0
```

The guide archive, representative MiCA guide, methodology, about, comparison, access/regulation, timeline, and statistics pages passed desktop and mobile review. All sixteen states contained the shared shell and required guide, long-form, tool, or statistics hierarchy. Every state rendered at exact viewport width without horizontal page overflow.

The artifact establishes render, hierarchy, local overflow containment, responsive behavior, and tool-state integrity. It does not accept owner visual approval and does not declare UI v3 complete.

## Authorized next work

PR #421 may perform only full visual closure and owner-review preparation.

Authorized work:

```text
final cross-template screenshot capture
final machine visual audit
final contact sheet
final approval worksheet
final merge-lineage verification
final responsive matrix verification
final route and canonical boundary verification
owner-review instructions
```

Production UI changes are prohibited unless a captured state fails a hard gate. Any repair must be isolated, justified by the failed state, recaptured, and recorded. No discretionary redesign is authorized.

## Final owner-review matrix

PR #421 must capture all owner-required states from the design contract:

```text
Desktop / — home default
Mobile  / — home default
Desktop /stablecoins/ — register default
Desktop /stablecoins/ — register filtered
Mobile  /stablecoins/ — register filtered
Desktop /stablecoins/ — register empty state at 1280×900
Desktop /stablecoin/usdc/ — representative dossier
Mobile  /stablecoin/usdc/ — representative dossier
Desktop /events/ — event register
Mobile  /events/ — event register
Desktop /issuers/ — organization register
Mobile  /issuers/ — organization register
Desktop /guides/eu-stablecoin-access-after-mica/ — representative guide
Mobile  /guides/eu-stablecoin-access-after-mica/ — representative guide
```

Required count: 14.

The filtered and empty register states must be produced by deterministic URL state or scripted interaction and must verify selected filters, active chips, result count, clear action, and empty-state messaging.

## PR #421 outputs

```text
artifacts/pr421-full-visual-closure/manifest.json
artifacts/pr421-full-visual-closure/contact-sheet.html
artifacts/pr421-full-visual-closure/contact-sheet.json
artifacts/pr421-full-visual-closure/owner-review.html
artifacts/pr421-full-visual-closure/owner-review.json
docs/migration/ui-v3-full-visual-closure-pr421.json
```

The owner-review worksheet must show every required state, current approval status, artifact filename, viewport, route, and a field for accepted/rejected/notes. Generated values remain `pending` until an explicit owner decision is recorded.

## Hard gates

- all fourteen required captures exist;
- zero horizontal page overflow;
- shared shell and correct template marker present;
- minimum body, metadata, table, and control sizes remain compliant;
- 44px touch targets remain compliant where required;
- filtered/empty register states are real and reversible;
- event and organization first-page rendering remains bounded;
- guide and dossier long-form tables remain locally contained;
- canonical, public projection, route, metadata, and approval-register hashes remain unchanged;
- every completed implementation merge remains an ancestor of PR #421;
- automated capture remains non-approving.

Missing capture, skipped visual audit, horizontal overflow, protected-file change, or automatic approval is a hard failure.

## Owner decision boundary

PR #421 may reach `AWAITING OWNER REVIEW` after all automated gates pass. It may not set any template to `accepted`, may not declare UI completion, and may not close Issue #281 without explicit owner approval for every required desktop and mobile template state.

## Prohibited work

- discretionary production UI redesign;
- route or metadata-contract changes;
- canonical data or public projection changes;
- owner-approval changes without explicit owner decision;
- automatic acceptance based on CI or screenshots;
- UI completion declaration before all required approvals;
- any phase after PR G.

## Exit condition

PR #420 confirms PR #419 is complete, preserves all approvals as pending, and authorizes exactly PR #421 full visual closure. PR #421 must stop at `AWAITING OWNER REVIEW` unless the owner explicitly records acceptance or rejection.
