# PR #413 UI v3 Rebuild C — Home and Stablecoin Register

Status: active bounded implementation  
Issue: 281  
Phase: PR C  
Authorized routes: `/`, `/stablecoins/`

## Objective

Turn the home page into a direct evidence-registry entrypoint and the stablecoin index into a usable, bounded exploration tool without changing routes, canonical records, public machine-readable outputs, or later page templates.

## Home implementation

- replace the oversized editorial masthead with a compact product-introduction panel;
- preserve a prominent canonical search across stablecoins, organizations, and events;
- display canonical registry totals and lifecycle state without inventing metrics;
- separate material event dates from publication/update dates;
- provide a visible issue-watch entrypoint based on canonical known-unknown records;
- provide direct exploration paths to the register, comparison, timeline, organizations, events, guides, access/regulation, and methodology;
- preserve recently reviewed records and reviewed guides in bounded sections.

## Stablecoin register implementation

- preserve URL-backed search, filters, sorting, pagination, and comparison state;
- expose filter groups as visible evidence-registry panels by default;
- show option totals, selected counts, active-filter chips, result range, total match count, and clear-all;
- preserve a 20-record page size, below the authorized maximum of 50;
- render only the current page in the primary table/card surfaces;
- preserve bounded pagination because the canonical dataset contains more than 100 records;
- provide explicit default, filtered, no-result, comparison-selection, long-label, and narrow-screen states;
- use the desktop table above the compact breakpoint and record cards below it;
- keep lifecycle, issuance, reference target, backing, organization, evidence, events, deployments, and unresolved questions distinct.

## Visual acceptance

Required capture states:

```text
home_desktop
home_mobile
register_default_desktop
register_default_mobile
register_filtered_desktop
register_filtered_mobile
register_no_results_desktop
register_no_results_mobile
register_compare_desktop
register_compare_mobile
```

The workflow must produce desktop/mobile screenshots, a machine visual audit, and a contact sheet. A skipped audit or missing state is a hard failure. Automated capture remains non-approving and does not change `ui-v3-visual-approval-register.json`.

## Preserved boundaries

```text
Routes changed: 0
Canonical data changed: 0
Public machine-readable data changed: 0
Metadata contract changed: 0
Dossier templates changed: 0
Event templates changed: 0
Organization templates changed: 0
Guide or secondary templates changed: 0
Owner approval records changed: 0
UI completion declared: false
```

## Exit condition

The two authorized templates are implemented and validated, required visual artifacts are produced, owner approval remains pending, and the repository stops at `REVIEW GATE` before PR D.
