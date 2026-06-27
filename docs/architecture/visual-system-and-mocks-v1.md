# Stable or Gone Visual System and Mock Approval v1

Status: approved visual-system specification  
Phase: Phase 3  
Plan unit: PR 22 — approve visual system and representative image mocks  
Implementation boundary: specification, generated SVG mocks, and validation only. Production UI implementation begins in PR 23.

## 1. Visual direction

SOG uses a restrained research-registry visual language rather than an exchange, price dashboard, portfolio, or recommendation product.

The system prioritizes:

- historical record identity;
- independent state axes;
- visible evidence and known unknowns;
- organization and relationship context;
- readable dense information;
- clear correction and methodology access;
- desktop and mobile parity without hiding material fields.

The visual system must not imply that records are ranked, scored for safety, recommended, or presented for trading.

## 2. Color system

Core tokens:

```text
Background          #071018
Background subtle   #0A151F
Surface             #0D1924
Surface raised      #112332
Surface emphasis    #172C3B
Line                #284555
Line subtle         #1B3443
Text                #EAF3F6
Muted text          #9AB0BA
Link                #75D5FF
Focus               #F4C96B
Positive            #78D7A9
Warning             #E9C96F
Critical            #F08A8A
Unknown             #B7A9DD
Inactive            #A7B3B9
```

Contrast against the primary background is validated mechanically:

```text
Primary text: approximately 17:1
Muted text:   approximately 8.5:1
Link text:    approximately 11.6:1
Focus token:  approximately 12.2:1
```

Color never carries state by itself. State chips, warnings, reliability, lifecycle, and unknowns always retain a text label.

## 3. Typography and density

Typography uses system sans-serif and system monospace stacks. No external font dependency is required.

```text
XS       12px
Small    14px
Body     16px
Large    20px
XL       28px
Display  42px
```

Spacing scale:

```text
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px
```

Minimum control height is 44 CSS pixels. Registry table rows use a minimum 48px rhythm before responsive transformation. Reading pages and registry pages use separate maximum widths.

## 4. Component treatment

### Panels

Panels use a visible line, restrained radius, and limited shadow. Nested panels must remain distinguishable without excessive elevation.

### Evidence

Evidence is a first-class information surface. Expanded evidence displays:

```text
source identity
publisher
source category
provenance
primary or secondary state
publication date
archive state
reliability
claim scopes
relation count
connected records
```

### Known unknowns

Known unknowns use the dedicated unknown token, a text label, explicit value state, topic, unresolved question, priority, last-checked date, related section, reviewed evidence, and correction action.

Unknown is never represented as false, zero, blank, or worst.

### Contract and transaction values

Long identifiers use monospace text, preserve the full value, wrap safely, and provide a labelled copy action.

### Focus

The focus indicator uses a 3px focus token with a 2px offset. Focus is not indicated by color alone.

## 5. Approved mock set

The PR generates ten deterministic SVG mocks from `config/visual-system-contract.mjs`.

### 1. Stablecoin index — desktop

Shows:

```text
grouped navigation
search
active filters
result count
stablecoin rows
multi-organization indicator
comparison selection
```

Representative records include USDT, USDC, DAI, and UST to cover active, collapsed, fiat-backed, crypto-backed, algorithmic, multi-organization, evidence, and unknown states.

### 2. Stablecoin detail — desktop

Uses USDT as a representative complex dossier and keeps visible:

```text
record heading
current state
local dossier navigation
organizations and control
how the asset works
deployments and legal context
history
evidence
known unknowns
```

### 3. Stablecoin index — mobile

Uses record cards instead of hiding columns. Each card retains current state, reference/model, organization summary, evidence count, and known-unknown count.

### 4. Stablecoin detail — mobile

Preserves direct access to mandatory dossier sections and surfaces organization, evidence, and known-unknown summaries without relying only on horizontal scrolling.

### 5. Organization detail

Uses Tether as a representative multi-role organization. It shows category, jurisdiction, roles, connected assets, relationship history, events, and evidence.

### 6. Event detail

Uses the TerraUSD collapse as a representative historical event. It separates date, category, subtype, subjects, status effect, recovery, typed details, and evidence.

### 7. Home

The home page is registry-first. Search and registry families precede methodology, data access, and support. Meaningful changes are shown separately from review timestamps.

### 8. Open filter state

Shows compact multi-value filters, selected filters, matching-result preview, Clear all, and Apply filters.

### 9. Expanded evidence state

Shows one public source identity with all source metadata, claim scopes, relation count, and connected records.

### 10. Known-unknown warning state

Shows the dedicated unknown pattern with topic, value state, what remains unclear, priority, last checked, related section, evidence reviewed, and correction access.

## 6. Forbidden visual language

Generated mocks are checked for prohibited product language, including:

```text
buy or sell prompts
market-cap or trading-volume promotion
yield ranking
safety score
investment rank
recommended asset
best stablecoin
internal queue or overlay language
```

SOG may document price-related historical events where they are relevant evidence, but the product must not resemble a live market or recommendation interface.

## 7. Deterministic generation

Authoritative generator files:

```text
scripts/ui-mock-svg-lib.mjs
scripts/ui-mock-renderers-registry.mjs
scripts/ui-mock-renderers-dossier.mjs
scripts/ui-mock-renderers-mobile.mjs
scripts/ui-mock-renderers-states.mjs
scripts/generate-ui-mock-svgs.mjs
```

Generated output:

```text
data/generated/ui-mocks/*.svg
data/generated/ui-mocks/mock-index.json
```

Each generated SVG contains:

```text
fixed viewport dimensions
accessible title
authorized description
contract metadata
required-element inventory
SHA-256 entry in the generated index
```

## 8. Validation and approval

Authoritative contract:

```text
config/visual-system-contract.mjs
```

Validator:

```text
scripts/validate-visual-system-mocks.mjs
```

Validation requires:

```text
10 manifest entries
10 generated SVGs
7 desktop/large-state mocks
3 mobile mocks
exact dimensions
accessible title and description
required-element metadata
required visible markers
no prohibited visual language
valid color tokens
contrast thresholds
44px minimum controls
visible Evidence and Known unknown patterns
multi-organization context
mobile material-field preservation
zero route changes
zero production implementation
```

Approval state:

```text
approved_against_pr17_pr21_contracts
```

## 9. Gate D decision

Gate D passes only when all ten generated mocks and the visual contract validate in CI.

Passing PR 22 means:

- site architecture is approved;
- dossier hierarchy is approved;
- index interactions are approved;
- meaningful change history is approved;
- responsive/accessibility behavior is approved;
- visual tokens and representative desktop/mobile states are approved.

It does not mean the production UI has been implemented or published.

## 10. Implementation boundary

```text
PR 22: visual system and mock approval
PR 23: global shell implementation
PRs 24–34: page and feature implementation
PRs 35–36: responsive and accessibility completion
Routes changed: none
Records added: none
Production deployment: none
```

The next approved work after PR 22 is PR 23: implement the global shell and grouped navigation against the approved contracts.
