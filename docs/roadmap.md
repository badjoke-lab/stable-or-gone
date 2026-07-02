# Stable or Gone Roadmap

Updated: 2026-07-03
Status: canonical execution schedule

## Current position

```text
Canonical stable assets: 100
Organizations: 94
Events: 172
Evidence: 501
Production data and routes: healthy
UI completion: withdrawn
Active workstream: Terminal UI restoration
Tracking issue: #281
Rejected directions: Modern Data Product, Editorial Ledger, Modern Evidence Registry
Active PR: #288 — restore terminal visual baseline over current structure
Restoration source: 3df568eab0a179d7690a88efb599156b0d659ab7
```

The current semantic structure, interactions, data, routes, accessibility work, and machine-readable outputs remain protected. The visual system returns to the original dark terminal family.

## Why the UI was reopened

Run `28599680752` generated representative screenshots but skipped the representative visual-audit step. The pages then failed owner design review. Subsequent unrelated redesign directions also failed owner review.

The project now distinguishes:

```text
technical rendering success != visual design approval
screenshot capture != screenshot review
new visual concept != improvement
restore the accepted direction before adding another direction
```

## Binding authority

```text
DESIGN.md
docs/ui-redesign/rebuild-contract-v4.md
config/ui-v4-visual-acceptance.json
docs/roadmap.md
```

## Completed recovery work

### PR #284 — completion withdrawal and visual gates

- withdrew the prior UI completion claim;
- added machine-readable visual acceptance state;
- prohibited completion without exact artifact and owner approval.

### PR #285 — rejected shared shell

- merged and subsequently rejected in owner review.

### PR #286 — rejected Home/Register direction

- closed without merge.

### PR #287 — remove rejected shared shell

- removed the PR #285 Modern Evidence Registry shell from main.

## Active work

### PR #288 — restore the original terminal visual family

- retain current 100-record data and all current routes;
- retain current Home information, search, and editorial data selection;
- retain register pagination, filters, sort, URL state, comparison, desktop table, and mobile cards;
- retain current dossier hierarchy and field ownership;
- restore deep navy/near-black backgrounds;
- restore cyan links and actions;
- restore monospace interface typography;
- restore square panels and controls;
- restore compact research-terminal density;
- preserve current responsive and accessibility behavior;
- run full desktop/mobile screenshot capture and visual audit;
- do not call the UI complete after this restoration PR.

## Next sequence after PR #288

### Terminal pass 2 — page-specific correction

Review the exact restored screenshots and correct only concrete defects:

- Home spacing, search, and material-change hierarchy;
- Register filter readability, pagination, table density, and mobile cards;
- Dossier current-state hierarchy, reserve/redemption visibility, long values, and mobile presentation;
- Events and Organizations density, grouping, and responsive behavior;
- Guides and long-form reading comfort.

No new palette, typography family, card system, or unrelated visual concept may be introduced.

### Terminal pass 3 — exact-state artifact review

Capture and review:

- Home desktop/mobile;
- Register default/search/filter/compare desktop/mobile;
- active, failed/terminated, migrated, and incomplete-data dossiers;
- Events desktop/mobile;
- Organizations desktop/mobile;
- Guides and long-form desktop/mobile.

### Terminal pass 4 — production closure

- merge only after normal checks pass;
- verify exact production commit provenance;
- verify all public route and output parity;
- verify production screenshots;
- record owner approval for the exact commit and artifact run;
- only then set the visual acceptance manifest to complete.

## Acceptance gates

```text
Gate T-A  rejected shell removed — passed in PR #287
Gate T-B  terminal baseline restored over current structure — active in PR #288
Gate T-C  Home/Register/Dossier concrete defects corrected
Gate T-D  Events/Organizations/Guides concrete defects corrected
Gate T-E  full desktop/mobile artifact review complete
Gate T-F  exact production commit and owner approval complete
```

No agent may claim UI completion before Gate T-F.

## Protected work

The restoration must not regress:

- 100 canonical stable assets;
- 94 organizations;
- 172 events;
- 501 evidence records;
- canonical-only public data;
- 366 detail routes;
- machine-readable outputs;
- production provenance;
- current record hierarchy;
- current register interactions;
- keyboard and focus support;
- reduced motion and forced colors;
- 320px and 200 percent zoom behavior.

## Work after genuine UI closure

1. non-UI release documentation;
2. monitoring and record-growth resumption;
3. statistics surface improvements;
4. later machine-readable expansion.
