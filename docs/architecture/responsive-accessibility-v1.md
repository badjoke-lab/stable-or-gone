# Stable or Gone Responsive and Accessibility Contract v1

Status: approved information-architecture specification  
Phase: Phase 3  
Plan unit: PR 21 — finalize responsive and accessibility specification  
Implementation boundary: specification and validation only. Implementation begins with PR 23 and is completed by the later page and hardening PRs.

## 1. Purpose

SOG contains dense registry tables, long historical dossiers, evidence metadata, unknown-state records, relationships, contracts, and filters. Responsive design must preserve this information rather than hide columns or convert unknown states into simplified summaries.

Accessibility is part of the information contract. Focus order, keyboard behavior, announcements, state labels, contrast, reduced motion, and long identifiers are specified before visual implementation.

## 2. Current baseline

```text
Protected table source files: 15
Protected table kinds:        25
Current protected tables:     25
Current scroll-only tables:   25
Generic column hiding:         0
Current CSS breakpoints:       980 / 820 / 620 / 560
Current focus-visible rules:    1
```

Current document foundations already present:

```text
language declaration
viewport metadata
main landmark
labelled primary navigation
horizontal fallback for wide tables
no generic nth-child column hiding
```

Current implementation gaps:

```text
25 page-specific table transformations
skip link
main-content focus target
current-page navigation state
reduced-motion rules
forced-colors rules
long-value overflow wrapping
44px target-size rule
```

The gaps are implementation work, not permission to remove fields.

## 3. Responsive bands

### Wide

```text
Minimum width: 1024 CSS px
Layout: multi-column
Navigation: grouped desktop
```

### Medium

```text
Width: 720–1023 CSS px
Layout: reduced columns
Navigation: grouped compact
```

### Compact

```text
Width: 0–719 CSS px
Layout: single column
Navigation: disclosure menu
```

Breakpoints are content-reflow boundaries, not device names. The site must also support 320 CSS px reflow and browser zoom to 200%.

## 4. Page-family contracts

### Home

Focus order:

```text
skip link
brand
primary navigation
main heading
registry entry actions
content sections
footer
```

On compact screens, registry access remains before editorial content and support.

### Stablecoin index

Focus order:

```text
skip link
brand
primary navigation
main heading
search
filters
sort
active filters
result summary
comparison selection
results
footer
```

Controls stack without changing their logical order. Stablecoin rows become compact record summaries and preserve all 10 material mobile fields from the PR 19 contract.

### Organization index

Focus order mirrors the stablecoin index without comparison selection. Multi-role and relationship summaries remain visible.

### Event index

Chronological cards preserve date, category, subtype, subjects, status effect, recovery, and source count.

### Stablecoin dossier

Focus order follows the eight required PR 18 sections:

```text
record heading
record summary
local dossier navigation
identity and current state
organizations and control
how the asset works
deployments and legal context
history
evidence
known unknowns and coverage
corrections and further reading
```

Local navigation uses anchors, does not trap focus, and does not make any section pointer-only.

### Organization detail

Overview, relationships, events, evidence, and correction access remain ordered. Primary display information does not replace current or historical roles.

### Event detail

Event summary, structured details, affected records, evidence, and corrections remain visible and ordered.

### Guides and project pages

Reading width stays bounded. Tables and code-like values receive explicit responsive representations. Contextual actions follow article or project content.

## 5. Table transformation contract

Horizontal scrolling remains a fallback for access to the original table, but it may not be the only compact-screen representation.

### Registry indexes

```text
stablecoin-index       → record cards
organization-index     → record cards
event-index            → timeline cards
```

### Stablecoin dossier

```text
stablecoin-overview             → definition list
stablecoin-organizations        → relationship cards
stablecoin-reserve-profile      → definition list
stablecoin-redemption-profile   → definition list
stablecoin-record-coverage      → coverage summary
issuer-control-events           → timeline cards
stablecoin-event-timeline       → timeline cards
stablecoin-reserve-history      → record cards
stablecoin-regulatory-notices   → record cards
stablecoin-deployments          → deployment cards
stablecoin-sources              → source cards
stablecoin-open-questions       → unknown cards
```

### Organization and event detail

```text
organization-overview       → definition list
organization-relationships  → relationship cards
organization-events         → timeline cards
organization-sources        → source cards
event-details               → definition list
event-detail-overlay        → definition list
event-sources               → source cards
```

### Methodology

```text
methodology-value-states                  → matrix cards
methodology-primary-display-relationships → matrix cards
methodology-evidence-source-identities     → matrix cards
```

Every transformation preserves:

```text
material fields
row identity
header context
record links
value states
source identity and relation distinctions
current and historical distinctions
```

## 6. Keyboard behavior

Ten interaction contracts are required.

### Skip link

The first focusable control moves focus to a labelled main-content target.

### Global navigation

Tab order follows DOM order. Compact disclosure navigation supports Enter or Space, closes with Escape, and returns focus to its trigger.

### Search and filters

Typing never steals focus. Native controls are preferred. Active-filter removal and Clear all are keyboard operable and announce the new result count.

### Stablecoin comparison

Selection state is programmatically exposed. Attempting to select a fifth record leaves the selection unchanged and announces the four-record maximum.

Opening and closing a comparison panel preserves a predictable focus return.

### Local dossier navigation

Section links move to labelled headings and do not trap focus.

### Disclosures

`aria-expanded` and `aria-controls` stay synchronized. Enter and Space toggle; Escape closes where appropriate.

### Copy identifier

Contract and transaction identifiers have keyboard-operable copy actions. Success or failure is announced without replacing the visible value.

## 7. Announcements

Five live-region contracts are required.

```text
result_count      polite
active_filters    polite
zero_results      polite
comparison_limit  assertive
copy_result       polite
```

Result announcements include visible and total counts. Zero-result announcements state that a clear action is available. Filter announcements identify the added or removed filter.

## 8. Long values

Protected long-value families:

```text
contract address
transaction hash
source URL
archive URL
record ID
```

Requirements:

- the full value remains in the DOM;
- visual text uses `overflow-wrap:anywhere` or an equivalent readable rule;
- ellipsis is not the only access to the full value;
- contract and transaction identifiers have copy actions;
- copy controls name the specific value;
- copy feedback is announced.

## 9. Visual accessibility

Minimum contrast:

```text
normal text: 4.5:1
large text:  3:1
UI and non-text indicators: 3:1
```

Additional requirements:

```text
minimum pointer target: 44 CSS px
visible focus indicator
focus not conveyed by color alone
state label text always present
color-only status prohibited
200% zoom support
320 CSS px reflow support
text-spacing override support
forced-colors support
dark theme not treated as the only readable mode
```

Lifecycle, evidence, reliability, warning, and unknown states retain text labels even when color or icons are used.

## 10. Motion

The final CSS requires `prefers-reduced-motion` handling.

Under reduced motion:

```text
non-essential animation disabled
parallax prohibited
automatic animation prohibited
focus scrolling uses non-animated behavior
```

No core information may depend on animation completion.

## 11. Structural accessibility

Required across the site:

```text
one h1 per page
semantic heading order
unique labelled landmarks
skip link
labelled main target
current-page navigation state
native controls where practical
errors linked to controls
```

The compact header must not become an uncontrolled multi-row list of links.

## 12. Current implementation gaps

The generated audit intentionally records these current gaps:

```text
25 table transformations pending
skip link missing
main target missing
aria-current missing
reduced-motion CSS missing
forced-colors CSS missing
overflow-wrap:anywhere missing
44px target-size rule missing
```

These gaps are addressed progressively from PR 23 onward and are fully re-audited in PRs 35–36.

## 13. Machine validation

Authoritative configuration:

```text
config/responsive-accessibility-contract.mjs
```

Generated diagnostics:

```text
data/generated/responsive-accessibility-audit.json
data/generated/responsive-accessibility-validation.json
```

The validator requires:

```text
3 responsive bands
8 page-family contracts
25 table transformation contracts
10 keyboard contracts
5 announcement contracts
15 protected table source files
25 current protected table kinds
0 target table omissions
0 duplicate table identities
0 generic column hiding
0 route changes
```

It also protects current server output while recording implementation gaps.

## 14. Implementation boundary

```text
PR 21: specification and validation only
PR 23: global shell, navigation, skip link, current-page state
PRs 24–34: page and interaction implementations
PR 35: complete responsive transformation
PR 36: complete accessibility and interaction audit
Routes changed: none
Records added: none
Production deployment: none
```

The next approved work after PR 21 is PR 22: approve the visual system and representative desktop/mobile image mocks.
