# Deployment taxonomy normalization audit

Date: 2026-06-26  
Scope: Phase 2 / PR 12  
Status: PASS after PR #179 merges

## Purpose

This audit separates deployment operational state, change or proposal state, deployment type, canonicality, canonicality-record state, verification state, contract-identity state, and network-record state.

The legacy `status` field is preserved as canonical raw data. It is no longer presented as though every value describes the same concept.

## Protected baseline

```text
Deployments:                     130
Unique deployment IDs:          130
Stable assets covered:           92
Networks or network contexts:    31
Deployment records with evidence: 130
Deployment records with control events: 18
```

No deployment record was added, deleted, or merged.

## Public deployment category

```text
Issuer- or institution-supported: 59
Protocol-native or supported:      34
Historical or legacy:              15
Canonical or native issuance:      10
Cross-chain representation:         8
Technical-standard record:          3
Related asset or wrapper:            1
Unknown current mappings:            0
```

The canonical `deployment_type` remains visible separately.

## Operational state

```text
Active:                 85
Unknown or unresolved:  23
Inactive or historical:  6
Restricted:              6
Collapsed or failed:     2
Winding down:            2
Terminated:              2
Limited:                 2
Impaired:                1
Migrated:                1
```

Raw values such as `explorer_reference_available`, `source_review_needed`, and `issuer_supported_source_review_needed` are not promoted to active or verified states.

## Change or proposal state

```text
No separate change state recorded: 124
Wind-down recorded:                  2
Retirement proposed:                 2
Migration recorded:                  1
Rebrand or transition recorded:      1
```

A proposed retirement is explicitly separated from an implemented retirement or suspension.

## Canonicality

```text
Issuer-native:        30
Native:               22
Legacy:                7
Canonical bridge:      2
Unknown:              69
```

Canonicality field origin:

```text
Explicitly recorded: 63
Not recorded:        67
```

Unknown includes two explicit `unknown` values and 67 records where canonicality is not recorded. The UI displays the canonicality value and its record state separately.

## Verification state

No canonical deployment record currently contains an explicit `verification_status` field.

The public verification state is therefore conservative:

```text
Source-linked record; identifier not recorded: 69
Identifier recorded; verification not recorded: 45
Source review needed:                           15
Unknown or unresolved:                           1
Explicitly verified:                             0
```

A recorded contract address, mint, property ID, or other identifier is not described as verified unless an explicit verification field is later reviewed and added.

## Contract identity state

```text
Identifier not recorded:                  69
Identifier recorded:                      45
Source review needed:                     15
Not applicable or review unresolved:       1
```

The literal placeholders `source_review_needed` and `not_applicable_or_source_review_needed` are no longer displayed as if they were contract identifiers.

## Network record state

```text
Specific network recorded:        124
Aggregate or multi-chain context:    4
Network source review needed:        2
```

Aggregate rows remain distinct from chain-specific deployments.

## UI changes

The deployment table now separates:

```text
network
network record state
token standard
public deployment category
canonical deployment type
operational state
recorded raw status
change or proposal state
canonicality
canonicality record state
verification state
contract identity state
contract or identifier
freeze capability
blacklist capability
control-event count
notes
```

All fields remain available on mobile through the information-preserving scroll strategy.

## Machine-readable and statistics changes

The public record-count breakdown and generated registry statistics now include:

```text
public_deployment_category
canonical_deployment_type
deployment_operational_state
deployment_status
deployment_change_state
deployment_canonicality
deployment_canonicality_record_state
deployment_verification_state
deployment_contract_identity_state
deployment_network_identity_state
deployment_chain
```

## Non-inference rules

- Do not infer canonicality from chain popularity, liquidity, or market use.
- Do not infer verification from a syntactically valid identifier.
- Do not infer an active deployment from an explorer reference.
- Do not treat a proposal as implemented.
- Do not collapse aggregate multi-chain context into a specific deployment.
- Do not replace missing, unknown, not applicable, and review-needed states with one generic blank.

## Remaining work

- PR 13 handles value-state semantics outside deployments.
- PR 15 may deduplicate evidence URLs while preserving deployment and claim relations.
- Contract verification may improve later through reviewed chain-specific evidence; it is not inferred in this PR.
