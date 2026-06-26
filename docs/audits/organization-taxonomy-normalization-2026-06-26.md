# SOG organization taxonomy normalization audit

Status: supporting audit  
Recorded: 2026-06-26  
Phase: 2 / PR 10  
Record checkpoint: 86 organizations and 101 relationships

## 1. Purpose

This audit records the separation of organization identity from relationship-specific function.

The older public layer mixed several concepts inside `organization_type` and legacy issuer labels:

```text
organization category
legal form
functional role
jurisdiction
regulatory character
relationship state
```

The normalized layer keeps these concepts separate. A broad public organization category is used for browsing, while the canonical organization type remains available as record detail. Functional roles remain relationship records rather than permanent labels attached to the organization itself.

## 2. Canonical coverage

```text
Organizations:                       86
Organization relationships:        101
Missing organization IDs:            0
Duplicate organization IDs:          0
Duplicate organization slugs:        0
Relationships without IDs:           0
Relationships with missing org:      0
Organizations without relationships: 0
Canonical organization types:       39
Unmapped organization types:         0
Unmapped functional roles:           0
Unmapped relationship states:        0
```

Generated diagnostics:

```text
data/generated/organization-taxonomy-migration.json
data/generated/organization-taxonomy-validation.json
```

Validation command:

```text
npm run validate:organization-taxonomy
```

## 3. Approved public organization categories

| Public organization category | Count |
|---|---:|
| Protocol or software system | 31 |
| Company or corporate group | 27 |
| Bank, trust, or credit institution | 7 |
| Digital-asset service or infrastructure provider | 6 |
| DAO or governance body | 5 |
| Payment or e-money institution | 5 |
| Network or ecosystem | 2 |
| Fund or investment vehicle | 1 |
| Product or brand organization | 1 |
| Reserve or special-purpose body | 1 |
| Unknown or not yet classified | 0 |
| **Total** | **86** |

The public category is a browsing category. It does not replace legal form, regulatory status, or functional role.

## 4. Canonical organization types

Thirty-nine canonical organization types remain preserved. Examples include:

```text
company
stablecoin_company
financial_technology_company
regulated_bank
limited_purpose_trust_company
electronic_money_institution
decentralized_protocol
dao_and_protocol_ecosystem
mutual_fund
reserve_organization
```

These values are retained under `canonical_organization_type` for compatibility and record detail. They are no longer the unnamed public comparison axis.

## 5. Legal-form state

No canonical organization record currently has a dedicated `legal_form` field.

```text
recorded:       0
not_recorded:  86
unknown:        0
```

The public UI therefore displays `Not recorded in canonical data`. It does not infer legal form from an organization name, jurisdiction, license, or the older organization-type value.

## 6. Regulatory character

| Regulatory character | Count |
|---|---:|
| Protocol or decentralized system | 37 |
| Not recorded in canonical data | 31 |
| Regulated bank, trust, or credit institution | 7 |
| Regulated digital-asset service provider | 5 |
| Regulated payment or e-money institution | 5 |
| Regulated fund or investment vehicle | 1 |
| Unknown or unresolved | 0 |
| **Total** | **86** |

Regulatory character is displayed separately from public organization category and jurisdiction.

## 7. Jurisdiction scope

The recorded jurisdiction text is preserved. A separate scope groups it for browsing.

| Jurisdiction scope | Count |
|---|---:|
| Country or territory | 34 |
| Unknown or not publicly resolved | 24 |
| Decentralized or protocol-based | 21 |
| Multiple jurisdictions | 7 |
| **Total** | **86** |

This grouping does not replace the recorded jurisdiction text and does not infer a legal domicile for decentralized protocols.

## 8. Functional roles

Functional roles remain non-exclusive relationship data.

| Functional role | Relationship count |
|---|---:|
| Protocol operator | 53 |
| Legal issuer | 37 |
| Brand owner | 5 |
| Reserve manager | 2 |
| Technology provider | 2 |
| Custodian | 1 |
| Other recorded role | 1 |
| Governance body | 0 |
| Redemption agent | 0 |
| **Total** | **101** |

M0 Protocol is the current organization with more than one recorded functional role. The normalized UI preserves both roles rather than selecting one as its permanent identity.

## 9. Relationship state

| Relationship state | Count |
|---|---:|
| Active relationship | 86 |
| Ended relationship | 13 |
| Unknown relationship state | 2 |
| Planned relationship | 0 |
| **Total** | **101** |

Relationship state remains separate from the stablecoin lifecycle status and the organization category.

## 10. Public presentation changes

The normalized organization taxonomy is now used by:

```text
organization index search
organization index filters
organization index rows
organization detail overview
organization relationship tables
organization JSON-LD keywords
stablecoin relationship role labels
machine-readable public breakdowns
registry statistics
mobile information-preservation checks
```

The organization index filters by:

```text
public organization category
regulatory character
jurisdiction scope
functional role
relationship state
```

The organization detail page separately displays:

```text
Organization category
Canonical organization type
Legal form
Legal-form state
Regulatory character
Jurisdiction
Jurisdiction scope
Functional roles
Relationship states
```

## 11. Machine-readable and statistics changes

The public machine-readable breakdown exposes:

```text
public_organization_category
canonical_organization_type
organization_legal_form_state
organization_regulatory_character
organization_jurisdiction_scope
functional_role
relationship_status
```

Registry statistics expose:

```text
composition.public_organization_categories
composition.canonical_organization_types
composition.organization_legal_form_states
composition.organization_regulatory_characters
composition.organization_jurisdiction_scopes
composition.functional_roles
composition.relationship_statuses
```

Quality statistics expose:

```text
quality.organization_jurisdiction_unknown
quality.organization_legal_form_not_recorded
quality.organizations_without_relationships
quality.relationships_unknown_status
```

## 12. Mapping source

The reviewed taxonomy and mappings are governed by:

```text
config/organization-taxonomy.mjs
src/utils/organizationTaxonomy.ts
```

## 13. Validation guarantees

The validator rejects:

- missing or duplicate organization and relationship identities;
- relationships pointing to missing organizations;
- canonical organization types without a public category;
- canonical organization types without a regulatory-character mapping;
- unknown functional roles or relationship states;
- public categories, labels, or sort-order collisions;
- restoration of a generic public `Type` field as the organization category;
- organization pages that omit legal-form state, regulatory character, jurisdiction scope, functional roles, or relationship states;
- machine-readable and statistics output that omit the normalized axes;
- mobile presentation that silently removes the normalized organization fields.

## 14. Non-scope

This work does not change:

- canonical organization names, slugs, or URLs;
- canonical organization-type values;
- relationship role, status, or date values;
- evidence reliability and provenance taxonomy;
- deployment status;
- stablecoin lifecycle or issuance status;
- canonical record counts;
- production deployment state.
