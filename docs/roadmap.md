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
Current main: e81a2052023a1b23a0fd05080ae4ca37d6f0cf4f
Current stage: exact-main production and artifact verification
Restoration source: 3df568eab0a179d7690a88efb599156b0d659ab7
```

The current semantic structure, interactions, data, routes, accessibility work, and machine-readable outputs remain protected. The visual system uses the restored dark terminal family.

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

### PR #288 — restore the original terminal visual family

- restored the deep navy/near-black terminal foundation;
- restored cyan actions, monospace interface typography, square panels, and terminal density;
- retained current data, routes, page semantics, interactions, responsive behavior, and accessibility behavior;
- passed all normal workflows and exact-head desktop/mobile screenshot audit;
- merged as `884351842fc01c028eeceb32bcd9fcc1ef7ffa09`.

### PR #289 — bound Events and Organizations indexes

- replaced 94-record and 172-record unbounded mobile dumps with 20-record pagination;
- added URL page state, visible ranges, Previous/Next controls, and truthful inactive-filter totals;
- fixed mobile heading overflow;
- reduced representative mobile page heights from approximately 57,190px and 98,029px to approximately 13,813px and 13,593px;
- passed all workflows and desktop/mobile screenshot audit;
- merged as `409c7ea6b9d3e2aa5376ee7f500cecfe9306f9ca`.

### PR #290 — repair Stablecoin register filters

- replaced the clipped horizontal mobile filter strip with a three/two/one-column terminal grid;
- replaced inactive `0 selected` states with option totals and `All`;
- preserved pagination, URL state, comparison, desktop table, and mobile cards;
- passed all workflows and desktop/mobile screenshot audit;
- merged as `dd71d75c8256a54f5e4e0b28444af336dff98b7a`.

### PR #291 — repair footer and long-form readability

- separated Registry, Reference, Project, and Data access footer groups;
- converted mobile footer destinations into distinct rows;
- improved long-form reading width, wrapping, and reference navigation;
- preserved terminal palette and content;
- passed all workflows and desktop/mobile screenshot audit;
- merged as `e81a2052023a1b23a0fd05080ae4ca37d6f0cf4f`.

## Current verified implementation state

```text
Terminal visual family restored: yes
Canonical data changes from UI work: 0
Route changes from UI work: 0
Home desktop/mobile representative audit: passed technically
Stablecoin Register desktop/mobile representative audit: passed technically
Stablecoin dossier active/failed/migrated representatives: passed technically
Events desktop/mobile representative audit: passed technically
Organizations desktop/mobile representative audit: passed technically
Guides/long-form desktop/mobile representative audit: passed technically
Required screenshot audit step skipped: no
Owner completion approval: not recorded
UI completion: not claimed
```

Technical artifact review is not owner approval. The visual acceptance manifest remains incomplete until the exact production commit and screenshots receive explicit approval.

## Active work

### Terminal pass 3 — exact-main artifact and production verification

1. publish or confirm publication of exact main `e81a2052023a1b23a0fd05080ae4ca37d6f0cf4f` or the later documentation-only checkpoint commit;
2. verify `/version.json` and `/data/manifest.json` production provenance;
3. verify all public output and detail-route parity;
4. capture production Home, Register, representative dossiers, Events, Organizations, Guides, and long-form pages on desktop and mobile;
5. compare production output with the merged artifact state;
6. record the exact run and commit used for owner review;
7. do not mark the UI complete without explicit owner approval.

### Terminal pass 4 — closure or concrete correction

After exact production screenshots are available:

- if rejected, correct only named defects within the terminal visual family;
- if approved, update `config/ui-v4-visual-acceptance.json` with the exact commit, artifact run, template approvals, and owner reference;
- run production closure checks;
- only then declare UI restoration complete.

No new palette, typography family, card system, or unrelated visual concept may be introduced.

## Acceptance gates

```text
Gate T-A  rejected shell removed — passed in PR #287
Gate T-B  terminal baseline restored over current structure — passed in PR #288
Gate T-C  primary register defects technically corrected — passed in PRs #289 and #290
Gate T-D  footer and long-form defects technically corrected — passed in PR #291
Gate T-E  merged representative desktop/mobile artifact audit — passed technically
Gate T-F  exact production commit and owner approval — active
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
