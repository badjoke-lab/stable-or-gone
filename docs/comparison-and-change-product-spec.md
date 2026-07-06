# Stable or Gone comparison and change product specification

Status: canonical specification  
Updated: 2026-07-06  
Activation: after Phase E completes at the reviewed 110-asset checkpoint

## 1. Purpose

This specification defines the approved product and data sequence after the current release-hardening, monitoring, statistics, and controlled-growth program completes.

The post-110 product direction is:

```text
reviewed canonical registry
-> comparison readiness
-> comparison projection and Compare UI
-> canonical market-access layer
-> access and regulation exploration
-> change timeline
-> reviewed public update surfaces
-> optional natural-language filter translation
```

The current PR #310-#328 sequence remains unchanged. This specification does not authorize skipping, compressing, or reordering that sequence.

SOG remains a reviewed historical and current-state registry. It must not become a live price terminal, market-cap ranking, yield leaderboard, risk score, safety score, or automatic news publisher.

## 2. Core product thesis

SOG creates value by preserving stable-asset history and by making materially different stable assets comparable under stable definitions.

Record growth alone is not sufficient. Comparison and change research must be grounded in reviewed canonical data, explicit unknown states, evidence scope, jurisdiction scope, function scope, and date scope.

The principal product layers are:

```text
Registry
  stable asset identity
  organization and relationship structure
  lifecycle
  reserve and backing
  issuance and redemption
  legal and regulatory records
  deployments
  events
  evidence
  known unknowns
  market-access records

Research tools
  Stats
  Compare
  Compare presets
  Access & Regulation Explorer
  Change Timeline

Reviewed update surfaces
  SOG Registry Update
  Monthly Stablecoin Change Log
```

Articles and guides remain editorial entry points into the registry and research tools. They do not replace canonical records.

## 3. Four analytical layers

SOG must preserve four separate analytical layers.

### 3.1 Asset lifecycle

Asset lifecycle remains governed by the canonical stable-asset model and lifecycle specifications.

Lifecycle status must not be overloaded with redemption, regulation, or platform-access state.

Examples of distinct lifecycle concepts include:

```text
active
restricted
suspended
winding_down
inactive
terminated
migrated
rebranded
collapsed
announced
unknown
```

The exact implemented enum remains governed by the canonical data model. This specification does not rename or replace existing lifecycle values.

### 3.2 Issuance and redemption

Issuance and redemption remain distinct from lifecycle.

Comparison must preserve at least the following concepts when supported by canonical data:

```text
issuance state
redemption state
direct public redemption eligibility
eligible-customer-only redemption
institutional-only redemption
protocol-based exit
minimum redemption knowledge state
jurisdiction restrictions
suspension or termination state
```

An active asset may have constrained redemption. A redemption restriction does not by itself establish asset failure or termination.

### 3.3 Legal and regulatory state

Legal and regulatory state must remain jurisdiction-scoped and evidence-backed.

SOG must not publish a single universal value such as:

```text
regulatory_status = compliant
```

The registry must preserve distinctions among:

```text
issuer legal status
asset legal classification
regulatory action
regulatory register state
service-provider authorization context
jurisdiction
regulator or authority
announcement date
effective date
scope
```

Legal profiles are factual evidence-backed descriptions, not legal opinions.

### 3.4 Market access

Market access is the approved fourth analytical layer.

Market access is not equivalent to lifecycle, legal status, regulatory action, or platform authorization.

A canonical market-access record must describe a reviewed bounded claim such as:

```text
asset
platform
platform legal entity
region or jurisdiction
customer scope
function or access route
state
supported network when material
announcement date
effective date
last reviewed date
source identity
evidence relationship
notes
```

A trading restriction must not be inferred to mean a deposit, withdrawal, custody, conversion, mint, redemption, payment-rail, Earn, or margin restriction.

## 4. Monitoring observation versus canonical market-access record

Monitoring observation and canonical market-access publication are separate systems.

The approved flow is:

```text
allowlisted source observation
-> normalized source comparison
-> private candidate
-> review material
-> source confirmation
-> canonical record decision
-> reviewed repository PR
-> merge to main
-> public canonical output
```

Monitoring may detect and classify potential access changes. It may not automatically create or mutate canonical market-access records.

The implementation introduced in the current monitoring phase may provide observation fields and private review material. The later canonical market-access layer must be added through a separately reviewed specification and implementation PR under this post-110 sequence.

A reviewed editorial research matrix is not automatically canonical registry data.

## 5. Comparison Readiness phase

Comparison implementation must not begin with UI work.

The first post-110 phase is a registry-wide comparison-readiness program against all 110 canonical assets.

### 5.1 Readiness dimensions

Audit at minimum:

```text
identity consistency
issuer versus asset boundary
lifecycle semantics
reference target and reference currency
asset class
backing model representation
stabilization mechanism representation
reserve disclosure comparability
reserve-report date semantics
issuance comparability
redemption comparability
legal-classification comparability
regulatory-action scope
market-access applicability
launch-date semantics
verification-date semantics
unknown versus null versus not-recorded semantics
evidence scope and relation depth
known-unknown visibility
```

### 5.2 Unknown-state preservation

Comparison work must preserve the repository's protected unresolved states.

At minimum:

```text
null
unknown
not_recorded
not_applicable
source_review_needed
```

A missing value must not be converted to `false`, `no`, `available`, `unavailable`, or any other factual claim merely to fill a comparison cell.

### 5.3 Normalization boundary

Normalization may:

```text
align equivalent field semantics
add validators
add explicit applicability states
add derived comparison projections
add reviewed schema extensions when required
```

Normalization may not:

```text
invent values
collapse issuer and asset identities
replace evidence-backed unknowns with defaults
rewrite lifecycle history for display convenience
convert editorial research directly into canonical data
```

## 6. Facet freshness derivation

SOG must support facet-level freshness without duplicating timestamps into the stable-asset root record merely for display.

The approved rule is derivation from authoritative records.

Examples:

```text
asset identity freshness
  <- canonical verification metadata

reserve freshness
  <- latest reviewed reserve report as-of date and review metadata

redemption freshness
  <- reviewed redemption profile or observation review metadata

legal/regulatory freshness
  <- reviewed classification/action dates and review metadata

market-access freshness
  <- canonical access record last-reviewed metadata and effective-date context
```

A future implementation must define a deterministic Facet Freshness Derivation Contract and validator before Compare presents freshness indicators.

The UI must distinguish source period dates, effective dates, and review dates. They are not interchangeable.

## 7. Compare v1

Compare is an approved major SOG product surface and is scheduled before the access explorer.

### 7.1 Comparison scope

Compare v1 should support a bounded side-by-side set of assets. The initial target is two to six assets per comparison.

### 7.2 Comparison families

The initial comparison projection should support, when canonically available:

```text
Identity
  name
  symbol
  issuer or governing organization
  launch date

Lifecycle
  canonical status
  derived lifecycle group

Reference and mechanism
  reference target
  reference currency
  asset class
  backing types
  stabilization mechanism
  governance model

Reserve
  disclosure availability
  latest reviewed report
  report as-of date
  structured reserve-component availability

Redemption
  issuance state
  redemption state
  direct public redemption
  eligibility scope
  minimum requirement knowledge state
  jurisdiction restriction knowledge state

Legal and regulatory
  jurisdiction-scoped classifications
  material regulatory actions
  legal-profile coverage

Market access
  reviewed known access changes
  region or jurisdiction
  platform
  function or access route
  state
  effective date

History
  material depeg events
  migrations
  wind-downs
  collapses
  major incidents

Data quality and freshness
  evidence depth
  known-unknown count
  relevant facet freshness
```

### 7.3 Comparison output rules

Compare must:

```text
use deterministic projections from reviewed canonical data
show unknown and not-applicable states explicitly
link material cells to evidence or underlying records where practical
show relevant as-of, effective, or review dates
preserve multi-select dimensions as multi-select
```

Compare must not:

```text
score safety
score risk
rank assets
recommend assets
infer unsupported availability
convert missing data to negative claims
present current APY or market-cap ranking
```

## 8. Compare presets

After Compare v1, SOG may provide reviewed presets that help users begin with factual groupings.

Approved preset families may include:

```text
major USD stablecoins
major EUR stablecoins
JPY stablecoins
fiat-reserve models
crypto-collateralized assets
yield-bearing stable assets
protocol-issued models
historical failures
migrated assets
discontinued major assets
```

Preset membership must be deterministic and documented.

Prohibited preset framing includes:

```text
safest
best
lowest risk
most reliable
highest quality
```

## 9. Canonical Market Access Record

The post-110 program must define and implement a canonical market-access record family before the Access & Regulation Explorer depends on it.

The schema design must preserve at minimum:

```text
record identity
asset identity
platform identity
platform legal entity when supported
region or jurisdiction scope
customer scope when supported
function or access route
access state
supported network when material
announcement date
effective date
reviewed-at date
source identity
evidence relation
review state or canonical publication state
notes
```

Allowed function families must remain compatible with the EU/EEA market-access research and monitoring specification and may expand only through a reviewed specification change.

The canonical access layer must support historical records. A current-state record must not erase the prior effective state when the historical change is material and evidenced.

## 10. Access & Regulation Explorer

The approved research surface is an Access & Regulation Explorer backed by separate canonical access and regulatory record families.

The UI may present combined exploration, but the underlying records remain distinct.

### 10.1 Access filters

Initial filters may include:

```text
asset
platform
platform legal entity
region or jurisdiction
customer scope
function or access route
access state
announcement date range
effective date range
supported network
```

### 10.2 Regulation filters

Initial filters may include:

```text
asset
issuer or organization
jurisdiction
authority
action type
announcement date range
effective date range
current or historical scope
```

### 10.3 Geography rule

SOG must not publish a universal green/red availability map that implies complete country-level availability.

Access can differ by platform, platform legal entity, customer cohort, function, network, and date. Geography must remain one dimension among those dimensions.

## 11. Change Timeline

The Change Timeline is a derived projection across reviewed canonical record families.

It must not replace those record families with one lossy generic event object.

Eligible timeline families may include:

```text
launches
lifecycle transitions
reserve framework changes
reserve report changes
redemption changes
legal classifications
regulatory actions
market-access changes
migrations
wind-downs
terminations
depeg events
collateral, oracle, security, governance, insolvency, or bridge incidents
```

The timeline generator must preserve:

```text
source record family
source record ID
asset ID
organization or platform context when relevant
jurisdiction or region when relevant
announcement date when relevant
effective date when relevant
reviewed evidence relation
```

Initial filters may include:

```text
asset
date range
change family
jurisdiction
platform
lifecycle effect
```

## 12. Public update surfaces

Public update surfaces are derived from reviewed merged canonical changes. They are not raw monitoring feeds.

### 12.1 SOG Registry Update

The first update surface should report reviewed registry changes such as:

```text
new assets
issuer or organization updates
new reserve reports
new redemption records
new legal classifications or regulatory actions
new canonical market-access records
lifecycle status changes
material corrections
```

### 12.2 Monthly Stablecoin Change Log

After the registry update surface is stable, SOG may publish a monthly reviewed change log covering:

```text
launches
migrations
discontinuations
regulatory actions
market-access changes
redemption changes
major depeg events
material reserve-framework changes
```

The monthly change log must link back to canonical records and evidence. It must not become a general weekly-news digest.

## 13. Editorial relationship

Articles and guides remain useful for explanation, search discovery, and context.

The approved direction is:

```text
article or guide
-> canonical asset or organization records
-> Compare
-> Access & Regulation Explorer
-> Change Timeline
```

Editorial text is not the canonical endpoint for structured facts that belong in registry record families.

Monitoring output does not automatically edit articles or guides.

## 14. Natural-language filtering

Natural-language filtering is optional and comes only after structured Compare, access/regulation exploration, and timeline surfaces are stable.

Its role is query translation, not unsourced answer generation.

Example:

```text
"Show USD-referenced assets with reviewed EU/EEA trading restrictions since 2025"
```

may translate into structured filters such as:

```text
reference_currency = USD
jurisdiction = EU_OR_EEA
change_family = market_access
function = spot_trading
state = restricted_or_unavailable
effective_from >= 2025-01-01
```

The natural-language layer must not invent conclusions, safety judgments, or missing data.

## 15. Approved implementation schedule after Phase E

The current PR #310-#328 sequence remains binding. The following sequence activates only after Phase E reaches the reviewed 110-asset checkpoint.

### Phase F — Comparison Foundation

```text
PR #329  define Comparison Readiness contract and audit method
PR #330  audit all 110 assets for comparison readiness
PR #331  normalize comparison-critical gaps and validators
PR #332  define canonical Market Access Record schema and governance
PR #333  define facet-freshness derivation contract and validators
```

### Phase G — Compare

```text
PR #334  deterministic comparison projection generator and machine-readable output
PR #335  /compare/ v1
PR #336  Compare presets
```

### Phase H — Change Research Tools

```text
PR #337  access and regulation index generator
PR #338  Access & Regulation Explorer
PR #339  change-timeline projection generator
PR #340  Change Timeline UI
```

### Phase I — Reviewed Public Update Layer

```text
PR #341  SOG Registry Update feed/page
PR #342  Monthly Stablecoin Change Log
```

### Optional Phase J — Query Translation

```text
PR #343+  natural-language filter translation, only if structured surfaces are stable and separately approved
```

PR numbers after #342 are intentionally not preallocated beyond the optional marker. Roadmap amendments remain required for any sequence change or inserted urgent work.

## 16. Relationship to the existing statistics phase

The current statistics phase remains before controlled growth and before the comparison program.

`docs/stats-spec.md` remains binding for PR #319-#322.

Post-110 work may extend statistics only through a reviewed specification change. Expected future extension areas include:

```text
canonical market-access record coverage
access-change counts over time
jurisdiction coverage
facet-freshness bands derived from authoritative records
comparison-readiness coverage
```

These extensions must not delay or redefine the already approved PR #319-#322 implementation.

## 17. Relationship to monitoring

Monitoring is a principal update engine for SOG, but remains review-only.

The current monitoring phase remains:

```text
PR #315 100-asset monitoring baseline synchronization
PR #316 reserve and redemption source expansion
PR #317 lifecycle, regulatory, and EU market-access source/schema expansion
PR #318 bounded scheduled read-only monitoring
```

The post-110 program consumes reviewed canonical outputs created through the existing review boundary. It does not authorize monitoring to write canonical data, accept its own baselines, create branches, open pull requests, publish candidates, edit guides, or deploy.

## 18. Validation and release gates

Each post-110 implementation PR must identify:

```text
Specification references
Roadmap item
Source record groups
Derived output contracts
Unknown-state handling
Evidence and provenance handling
Count preservation or explicit count change
Validation commands
Deployment classification
```

UI implementation PRs must also verify:

```text
keyboard navigation
responsive behavior
screen-reader labels where controls require them
empty and unknown states
long labels and multi-value cells
stable deep links or query serialization when provided
```

Machine-readable outputs must contain reviewed canonical data only. Candidate, monitoring, private research, and unpublished review material remain excluded.

## 19. Explicit non-goals

This program does not approve:

```text
live price tracking
market-cap ranking
current APY ranking
safety scores
risk scores
best-stablecoin rankings
automatic legal conclusions
universal country-level availability claims
automatic canonical writes from monitoring
automatic article revision
automatic publishing from source changes
free-answer AI that bypasses structured filters and evidence
```

## 20. Required reading for post-110 work

Before any Phase F-I implementation, read:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/deployment-policy.md
docs/quality/non-ui-quality-program.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/comparison-and-change-product-spec.md
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-review-material-spec.md
docs/quality/eu-stablecoin-market-access-research-and-monitoring-spec.md
```

The active roadmap item determines the additional exact queues, audits, schemas, fixtures, baselines, validators, and research checkpoints that must also be read.