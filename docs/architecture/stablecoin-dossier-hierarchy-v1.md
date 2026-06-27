# Stable or Gone Stablecoin Dossier Hierarchy v1

Status: approved information-architecture specification  
Phase: Phase 3  
Plan unit: PR 18 — finalize stablecoin dossier hierarchy  
Implementation boundary: this document assigns fields and responsibilities. It does not implement the redesigned dossier UI.

## 1. Purpose

The stablecoin detail route is a historical dossier, not a marketing profile and not a trading dashboard. It must preserve current state, historical context, organization relationships, mechanics, deployments, evidence, and investigated unknowns without collapsing independent facts into one summary.

PR 18 converts the current rendering surfaces into one explicit field-to-section matrix. Every current field is assigned a destination. No current field is silently removed.

## 2. Approved section order

```text
1. Identity and current state
2. Organizations and control
3. How the asset works
4. Deployments and legal context
5. History
6. Evidence
7. Known unknowns and coverage
8. Corrections and further reading
```

All eight sections are required. The final implementation may use progressive disclosure inside a section, but it may not remove the section or hide its existence.

## 3. Inventory result

```text
Current dossier surface files:       7
Current section labels found:       13
Raw field-render occurrences:      118
Unique current field surfaces:     102
Synthetic required fields:          12
Total field-to-section rows:        114
Unassigned current fields:           0
Duplicate field IDs:                 0
Deprecated current fields:           0
Collector or validator failures:     0
```

Decision counts:

```text
Move:                  98
Consolidate:            7
Keep:                   4
Replace:                2
Add contextual link:    3
Deprecate:               0
```

The two `replace` decisions apply to the generic Record coverage table headers. The coverage information remains required but should be expressed as meaningful section-level completeness and unknown-state summaries rather than a generic two-column count table.

## 4. Section responsibilities

### 4.1 Identity and current state

Field rows: **15**

Purpose:

- identify the stable asset;
- show canonical name, symbol, summary, route identity, asset class, lifecycle, issuance, and review state;
- provide compact status summaries without treating hero metrics as replacement fields.

Current inputs include:

```text
Name
Summary
Record identity
Symbol
Asset class
Lifecycle status
Issuance status
Classification reference target
Redemption / exit model
Valuation source
Yield / rebase profile
Classification notes
Last reviewed
Lifecycle hero summary
Issuance hero summary
```

Lifecycle and issuance hero metrics are summaries only. Their canonical fields remain in the dossier.

### 4.2 Organizations and control

Field rows: **11**

Purpose:

- show every organization relationship rather than only the primary display relationship;
- preserve role, status, start, and end boundaries;
- explain governance and the reviewed primary-display selection;
- include issuer-control and intervention context without implying that one organization owns every function.

Required inputs include:

```text
Governance
Primary display organization
Primary display role
Display selection mode
Organization
Role
Display priority
From
Until
Relationship status
Relationship scope note
```

The primary display relationship is navigation and summary metadata. It does not replace additional current or historical relationships.

### 4.3 How the asset works

Field rows: **25**

Purpose:

- explain the reference target and comparison category;
- show backing and stabilization as separate concepts;
- expose reserve composition and profile confidence;
- show redemption access, settlement, fees, timing, and regional limits;
- preserve valuation, yield, and rebase behavior.

Required input families:

```text
Reference target, kind, comparison category, target value, methodology
Public backing model and canonical backing types
Reserve component categories and component detail
Primary stabilization mechanism and recorded model description
Reserve disclosure status, summary, as-of date, confidence
Redemption status, settlement asset, eligibility, retail and institutional access
Minimum amount, fee, settlement time, regional limits
```

Current and historical reserve information must remain distinguishable. Reserve composition is not the same thing as evidence reliability or attestation history.

### 4.4 Deployments and legal context

Field rows: **22**

Purpose:

- show each blockchain deployment as a distinct record;
- keep operational state separate from verification work state;
- preserve contract and network identity states;
- show regulatory and official notices without converting them into the current lifecycle state automatically.

Deployment axes that must remain separate:

```text
operational_state
canonical_status_raw
change_state
canonicality
canonicality_record_state
verification_state
contract_identity_state
network_identity_state
```

Current deployment fields include:

```text
Network
Standard
Version
Contract
Canonicality
Canonicality record
Verified
Verification state
Contract identity state
Network record state
Evidence coverage
Control events
Launch
End
Operational state
Recorded status
Change state
Note
```

Legal-context fields include date, title, authority or publisher, notice type, and summary.

### 4.5 History

Field rows: **14**

Purpose:

- show model changes and the complete event timeline;
- preserve issuer interventions as historical events;
- keep event category, subtype, status effect, and recovery state distinct.

Required input families:

```text
Historical model changes
Issuer-control date, action, network, address, amount, verification
Event date, event title, category, subtype, status effect, recovery
Event-count hero summary
```

A current status is not a substitute for event history. Recovery is not inferred from the current status unless the event data records it.

### 4.6 Evidence

Field rows: **15**

Purpose:

- show the reviewed public source identity once;
- preserve every canonical evidence relation and supported claim;
- keep source category, canonical type, provenance, primary state, publication date, archive state, and reliability separate;
- preserve reserve and attestation history as evidence rather than unsupported prose.

Evidence axes that must remain separate:

```text
public_category
canonical_source_type
provenance
primary_state
claim_scopes
published_at
archive_state
reliability
```

Required public columns and fields include:

```text
Source
Publisher
Source category
Provenance
Primary or secondary
Supported claims
Publication date
Archive
Reliability
Reserve-report date, publisher, type, assets covered, record confidence
Source-count summary
```

The Evidence section is mandatory and cannot be omitted by visual simplification.

### 4.7 Known unknowns and coverage

Field rows: **7**

Purpose:

- expose investigated unknowns instead of presenting blanks as certainty;
- show what remains unclear, its value state, priority, and last-check date;
- replace the generic Record coverage table with section-aware completeness and unresolved-state summaries.

Required inputs:

```text
Topic
What remains unclear
Value state
Priority
Last checked
Section coverage
Entry count or completeness result
```

The Known unknowns section is mandatory even when a record has no open item. An empty state must say that no separate known-unknown record is currently present; it must not imply that the record is complete in every respect.

### 4.8 Corrections and further reading

Field rows: **5**

Purpose:

- provide a contextual correction action for the current record;
- connect readers to related registry records and guides;
- expose methodology and machine-readable data access.

Required destinations:

```text
Related registry pages
Related guides
Submit a correction
Methodology
Machine-readable data
```

This section does not replace the global Corrections utility. It adds record-level context to it.

## 5. Field-decision policy

Allowed decisions:

```text
keep
move
consolidate
replace
add_contextual_link
deprecate
```

PR 18 contains no `deprecate` decisions. A current field may be deprecated only in a dedicated decision that names its replacement or explains why the information is no longer valid public data.

`Consolidate` means duplicate presentations may be combined while preserving the canonical field. Examples include hero metrics and duplicate reference-target presentation.

`Replace` means the information survives in a more meaningful representation. It does not mean deletion.

## 6. Local dossier navigation

Approved local labels:

```text
Overview
Organizations
How it works
Deployments
History
Evidence
Unknowns
More
```

The final mobile and desktop behavior is not implemented in PR 18. Local navigation must remain accessible without hiding mandatory sections behind pointer-only interactions.

## 7. Implementation boundary

```text
Specification-only PR:              true
Route changes allowed:              false
Dossier implementation starts:      PR 27
Evidence section required:          true
Known unknowns section required:    true
Corrections section required:       true
All relationships required:         true
```

The dossier implementation is deferred until the earlier Phase 3 specifications and approved mocks are complete. PR 18 does not reorder rendered sections, change routes, remove fields, add assets, select Batch 18, or publish production.

## 8. Machine validation

Authoritative configuration:

```text
config/stablecoin-dossier-hierarchy.mjs
```

Generated diagnostics:

```text
data/generated/stablecoin-dossier-hierarchy.json
data/generated/stablecoin-dossier-hierarchy-validation.json
```

Protected source surfaces:

```text
src/components/StablecoinDetailView.astro
src/components/StableAssetClassificationRows.astro
src/components/StablecoinValueStateSections.astro
src/components/DeploymentTable.astro
src/components/IssuerControlEvents.astro
src/components/StablecoinEventTimeline.astro
src/components/EvidenceSourceTable.astro
```

The validator requires:

- exactly eight ordered dossier sections;
- all sections required and non-empty;
- every current field surface assigned;
- unique field IDs;
- zero current-field deprecations;
- mandatory Evidence, Known unknowns, and Corrections sections;
- all organization relationships reachable;
- eight distinct deployment axes;
- eight distinct evidence axes including publication date;
- no route changes;
- implementation deferred to PR 27.

## 9. Completion decision

PR 18 is complete when the generated matrix and validator pass in standard CI, the approved hierarchy document matches the configuration, and every current field has a destination, consolidation, or replacement decision.

The next approved work is PR 19: finalize stablecoin-list, search, filter, sort, and comparison behavior.
