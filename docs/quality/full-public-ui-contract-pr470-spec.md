# PR #470 Full Public UI Contract specification

Status: active material UI remediation  
Deployment class: public UI replacement without route or canonical-data change

## Governing references

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/ui-v3-remediation-authority.md
docs/roadmap-amendments/2026-07-27-pr470-full-public-ui-contract.md
```

## Scope

PR #470 replaces the public styling architecture across every existing route family. The public HTML may change only where required to:

- replace schema-shaped dumps with readable fact groups;
- preserve human-facing labels instead of raw enums;
- expose semantic status as consistent badges;
- preserve source identity and technical values in explicit technical contexts;
- provide complete mobile representations for desktop tables;
- keep PR #472 Event classification and structured fields inside the closed `Record details` disclosure.

## CSS contract

```text
physical stylesheet: src/styles/public-ui.css
stylesheet imports: exactly one
import owner: src/components/BrandLockup.astro
Astro style blocks: zero
inline style attributes: zero
!important declarations: zero
legacy cascade files: zero
```

The stylesheet must define one documented token set for background, surfaces, ordinary copy, muted copy, rules, links, interaction states, semantic states, typography roles, content widths, radii, and responsive breakpoints.

## Page-family contract

All public pages share:

- the same sticky header, primary/reference navigation, mobile navigation, search, footer, focus treatment, and content width system;
- serif only for editorial hierarchy and numeric emphasis;
- sans-serif for ordinary copy, navigation, controls, and data;
- monospace only for explicit labels and technical values;
- common masthead, ledger, section-heading, table, disclosure, card, badge, and action patterns;
- the same mobile information-preservation rules.

Route-specific layouts remain allowed only where the information structure requires them, such as comparison matrices, statistical bars, timelines, Evidence tables, and long-form article contents.

## Validation

Required local and CI evidence:

```text
npm run validate:ui-v3-cleanup
npm run check
npm run build
npm run audit:ui-v3-cleanup
full desktop and mobile screenshot workflow
public UI runtime contract audit
site-wide text contrast audit
all repository workflows
```

The final PR description must identify:

- changed route families and states;
- preserved canonical and machine-readable boundaries;
- CSS file, byte, line, import, and `!important` before/after counts;
- visible errors;
- console errors;
- failed required requests;
- overflow, clipping, and overlap;
- keyboard and disclosure behavior;
- representative page-height changes;
- direct visual review results.

Automated success never overrides a known visual defect.

