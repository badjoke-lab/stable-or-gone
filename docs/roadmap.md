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
UI v3 visual completion: withdrawn
Active workstream: UI rebuild v4
Tracking issue: #281
Current PR stage: A — design contract and failure gates
```

The Editorial Ledger implementation is an intermediate technical state, not the accepted finished product. Data integrity, route generation, machine-readable outputs, provenance, accessibility contracts, and production rendering remain protected.

## Why the UI was reopened

Run `28599680752` generated representative desktop screenshots but skipped the representative visual-audit step. The resulting pages also failed owner design review. A green capture workflow was incorrectly treated as visual completion.

The project now distinguishes:

```text
technical rendering success != visual design approval
screenshot capture != screenshot review
zero overflow != usable interface
complete data output != finished information design
```

## Binding authority

```text
DESIGN.md
docs/ui-redesign/rebuild-contract-v4.md
config/ui-v4-visual-acceptance.json
```

The former Editorial Ledger authority is superseded for new visual work.

## UI rebuild sequence

### PR A — design contract and failure gates — active

- withdraw UI v3 completion;
- document failed visual direction;
- establish the Modern Evidence Registry direction;
- add a machine-validated visual acceptance manifest;
- prohibit completion when required audit steps are skipped;
- require exact artifact and owner approval for closure.

### PR B — shared shell and navigation

- rebuild header, brand area, search, navigation, page frame, surfaces, buttons, links, states, and footer;
- remove giant decorative hierarchy;
- preserve routes, data, metadata, accessibility, and machine-readable outputs.

### PR C — Home and stablecoin register prototype

- make Home a registry entrypoint;
- implement prominent search and direct exploration paths;
- rebuild filters, active-filter state, clear action, sort, pagination, and compare behavior;
- produce desktop and mobile artifacts before expanding scope.

### PR D — stablecoin dossier prototype

- prioritize status, redemption, backing, issuer/control, material events, timeline, evidence, and unresolved questions;
- move raw schema fields below the decision-useful summary;
- produce active, failed/terminated, migrated, and incomplete-data examples.

### PR E — Events and Organizations

- replace unbounded data dumps with bounded browsing;
- add useful grouping, sticky context, event distinctions, relationship views, filters, and responsive layouts.

### PR F — Guides and secondary pages

- improve reading width, contents navigation, summaries, callouts, examples, tables, and source presentation.

### PR G — full visual closure

- capture all unique templates and required states on desktop and mobile;
- run every required audit without skips;
- manually review artifact contact sheets;
- record explicit owner approval for the exact commit and run;
- verify route, canonical data, provenance, accessibility, and machine-readable parity;
- only then set the acceptance manifest to complete.

## Acceptance gates

```text
Gate V4-A  rebuild authority and failure gates
Gate V4-B  shared shell approved
Gate V4-C  Home and register approved
Gate V4-D  dossier approved
Gate V4-E  Events and Organizations approved
Gate V4-F  Guides and secondary pages approved
Gate V4-G  desktop and mobile artifact review complete
Gate V4-H  exact production commit and owner approval complete
```

No agent may claim UI completion before Gate V4-H.

## Protected work

The UI rebuild must not regress:

- 100 canonical stable assets;
- 94 organizations;
- 172 events;
- 501 evidence records;
- canonical-only public data;
- 366 detail routes;
- machine-readable outputs;
- production provenance;
- keyboard and focus support;
- reduced motion and forced colors;
- 320px and 200 percent zoom behavior.

## Work after UI closure

After the UI is genuinely approved:

1. non-UI release documentation;
2. monitoring and record-growth resumption;
3. statistics surface improvements;
4. later machine-readable expansion.
