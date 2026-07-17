# PR #421 UI v3 Full Visual Closure Specification

Status: active owner-review preparation  
Implementation PR: 421  
Source review PR: 420  
Issue: 281  
Phase: PR G  
Production UI change: false

## Objective

Produce the final cross-template visual evidence package required by the UI v3 design contract. Verify that every completed implementation phase remains present, responsive, bounded, and protected. Prepare an owner-review worksheet without converting automated screenshots into approval.

PR #421 is not a redesign phase. A production UI repair is allowed only when a required closure state fails a hard gate. Any repair must be isolated, justified by the failing state, and recaptured before review.

## Required states

The fourteen states are copied from `config/ui-v3-rebuild-design-contract-pr409.json`:

```text
home-desktop
home-mobile
register-desktop-default
register-desktop-filtered
register-mobile-filtered
register-empty
dossier-desktop
dossier-mobile
events-desktop
events-mobile
organizations-desktop
organizations-mobile
guide-desktop
guide-mobile
```

## Deterministic register states

```text
Default: /stablecoins/
Filtered: /stablecoins/?lifecycle=active&sort=evidence_most
Empty: /stablecoins/?q=__sog_no_matching_record__
```

Filtered states must show selected-state feedback and at least one active filter chip. The empty state must show zero results, clear action, and explicit no-result content.

## Required outputs

```text
artifacts/pr421-full-visual-closure/manifest.json
artifacts/pr421-full-visual-closure/contact-sheet.html
artifacts/pr421-full-visual-closure/contact-sheet.json
artifacts/pr421-full-visual-closure/owner-review.html
artifacts/pr421-full-visual-closure/owner-review.json
docs/migration/ui-v3-full-visual-closure-pr421.json
```

## Machine audit

For every state:

- HTTP response succeeds;
- shared shell marker is present;
- correct template marker is present;
- H1 exists and remains at least 28px;
- no horizontal page overflow;
- full-page screenshot is produced;
- viewport and route match the design contract;
- automated approval remains false.

Additional checks:

- home search and exploration surfaces remain present;
- register default is bounded to 20 visible records;
- filtered register has active filter chips and a reversible clear action;
- empty register has explicit no-result state;
- dossier has decision summary, redemption/reserve, organizations, history, unknowns, and evidence;
- event and organization registers remain bounded to 20 visible records;
- representative guide has contents navigation, publication metadata, at least five article sections, a table, source/revision footer links, and local horizontal containment;
- completed implementation merge commits remain ancestors of HEAD;
- route architecture, canonical data, public projections, metadata checkpoints, and owner-approval register remain unchanged.

## Owner-review worksheet

The worksheet groups the fourteen states into six required templates:

```text
home
stablecoin_register
stablecoin_dossier
events
organizations
guides
```

Each state must show:

- state ID;
- route;
- viewport;
- screenshot filename;
- automated gate result;
- current owner status;
- owner decision field;
- owner notes field.

Generated owner decisions remain `pending`. The worksheet is evidence for review, not the review decision itself.

## Merge lineage

The final closure must verify these implementation merges as ancestors:

```text
PR #411: a9a37b79ca6b7313d310d206ad82dc19a273598f
PR #413: 8771de6ad5fc79310a638455f5be24b27af20eb3
PR #415: e4af173ff3560e0474b8282de0ad8da4532d0f4a
PR #417: aa4e5b98ae25652c2aeb6327000ce6a7b8f14e51
PR #419: 5e5857f2e0bd39b24dfc9afaef62cc9e9fa27eb7
PR #420: 1dbe3cded3701700a59608e409b79c2030f79aa2
```

## Protected boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Owner approval register changed: 0
Production UI changed: 0 unless a hard-gate repair is recorded
Automated owner approvals: 0
UI completion declared: false
```

## Exit condition

After all automated gates pass, PR #421 status becomes `AWAITING OWNER REVIEW`. It may not mark a template accepted, declare UI completion, or close Issue #281 without explicit owner approval for every required desktop and mobile template state.
