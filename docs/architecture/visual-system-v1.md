# Stable or Gone Visual System v1

Status: approved design contract  
Phase: Phase 3  
Plan unit: PR 22 — approve visual system and image mocks  
Implementation boundary: design artifacts and validation only. Production UI implementation begins in PR 23.

## 1. Product expression

SOG should look like a serious public research registry, not a trading terminal, portfolio, promotional crypto landing page, market ranking, or recommendation product.

The visual hierarchy prioritizes:

```text
registry identity
record state and context
organizations and relationships
mechanics and deployments
history
evidence
known unknowns
corrections and data access
secondary support
```

## 2. Color tokens

```text
background          #071018
background subtle   #0A151F
surface             #0D1924
surface raised      #112332
surface emphasis    #172C3B
line                #284555
line subtle         #1B3443
text                #EAF3F6
muted text          #9AB0BA
link                #75D5FF
focus               #F4C96B
positive            #78D7A9
warning             #E9C96F
critical            #F08A8A
unknown             #B7A9DD
inactive            #A7B3B9
```

All text and state colors pass the approved contrast checks against the background and primary surface. Status meaning always includes text; color is supplemental.

## 3. Typography

Primary interface and reading text use a system sans-serif stack. Identifiers, contract addresses, hashes, and technical values use a system monospace stack.

```text
xs       12 px
sm       14 px
md       16 px
lg       20 px
xl       28 px
display  42 px
```

Large display text is reserved for page or record identity. Data labels use smaller uppercase text, but canonical values remain readable body text.

## 4. Spacing and density

Spacing scale:

```text
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px
```

Minimum interactive control height is 44 CSS pixels. Registry rows target at least 48 CSS pixels. Cards use an 18-pixel content padding baseline.

The interface is information-dense but not cramped. Density comes from grouping and hierarchy, not from removing labels or values.

## 5. Shape and elevation

```text
compact radius     6 px
panel radius       10 px
prominent radius   14 px
border             1 px
focus ring         3 px with 2 px offset
```

Shadows are restrained. Borders, spacing, and surface changes carry most hierarchy. No glassmorphism, neon exchange styling, price ticker treatment, or animated market-dashboard decoration is approved.

## 6. Component treatments

### Panels

Panels use the primary surface, subtle line, panel radius, and restrained shadow. A raised surface is used only for state summaries, selected rows, or structural emphasis.

### Actions

Primary actions use the emphasized surface and focus-colored border. Secondary actions remain transparent with link-colored text. Neither treatment implies investment priority.

### State chips

Every chip includes a public text label. Color-only states are prohibited. Icons may reinforce meaning but never replace the label.

### Evidence

Evidence uses the link accent and the visible label `SOURCE`. Metadata order is:

```text
publisher
category
provenance
publication date
archive
reliability
claim scopes
```

One source identity may expose multiple evidence relations without rendering accidental duplicate source rows.

### Known unknowns

Known unknowns use the purple unknown accent, a visible `Known unknown` label, explicit value state, unresolved scope, priority where applicable, last-checked date, related section, evidence access, and correction access.

Unknown is not styled as failure, zero, blank, or lowest rank.

### Long identifiers

Contract addresses and transaction identifiers use monospace text, preserve the full value, wrap safely, and include a copy action. Ellipsis is not the only way to access the full value.

## 7. Content width

```text
reading content    760 px
registry content  1180 px
wide data content 1360 px
```

Long-form editorial pages use the reading width. Registry indexes and complex dossiers may use the wider limits while preserving readable line lengths inside panels.

## 8. Required mock set

The approved PR 22 package contains ten SVG mocks:

```text
stablecoin index desktop
stablecoin detail desktop
stablecoin index mobile
stablecoin detail mobile
organization detail
event detail
home
open filter state
evidence expanded state
known-unknown warning state
```

Location:

```text
docs/ui-redesign/mocks/pr22/
```

Each SVG is a versioned design artifact with an accessible title and fixed review viewport.

## 9. Representative records and states

The mock set deliberately includes:

```text
multi-organization stablecoin records
active and collapsed lifecycle states
stablecoin comparison selection
long dossier navigation
contract and verification context
organization role history
typed event details
evidence source identity and relation counts
known unknown value state and last checked
mobile filters and record cards
```

No mock introduces live price, market capitalization, trading volume, APY, safety score, investment rank, or asset recommendation.

## 10. Responsive mapping

Desktop tables may remain data-dense. Mobile mocks convert indexes into record cards and preserve material fields. Horizontal scrolling remains a fallback in later implementation but is not the sole mobile design.

The mobile detail mock preserves state summary, local section navigation, organization count, deployment context, evidence summary, and known-unknown summary.

## 11. Explicit review

Every mock has an explicit approval entry in:

```text
docs/ui-redesign/mocks/pr22/review.json
```

Approval basis:

```text
site architecture v1
stablecoin dossier hierarchy v1
index interaction contract v1
meaningful change history v1
responsive and accessibility contract v1
```

The approval record does not mean the current public site already implements the mocks. It means the artifacts are the approved target for PR 23 onward.

## 12. Machine validation

Authoritative configuration:

```text
config/visual-system-contract.mjs
```

Validator:

```text
scripts/validate-visual-system-mocks.mjs
```

Generated report:

```text
data/generated/visual-system-mocks-validation.json
```

Validation requires:

```text
10 mock manifest entries
10 committed SVG files
10 explicit approved review decisions
correct viewport dimensions
accessible SVG titles and image roles
required visible content per mock
approved background token
no prohibited promotional or internal language
contrast validation
44 px control baseline
3 px focus ring
visible evidence metadata
visible known-unknown state and last checked
full contract value and copy-action rules
0 route changes
0 production implementation
```

## 13. Gate D

Gate D passes after PR 22 merges with all visual-system and mock validations green.

After Gate D:

```text
PR 23  global shell and navigation
PR 24  stablecoin index
PR 25  organization index and detail
PR 26  event index and detail
PR 27+ stablecoin dossier implementation
```

## 14. Scope boundary

PR 22 does not:

```text
change public routes
change canonical records
add stable assets
select Batch 18
replace production components
publish production
```
