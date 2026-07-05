# SOG Deployment and Chain Identity Audit

- Audit ID: `sog_registry_100_deployment_chain_identity_pr301`
- Stable assets: **100**
- Deployments: **140**
- Stable assets with deployment rows: **100**
- Recorded chain labels: **35**
- Critical findings: **0**
- Review warnings: **1**

## Identity Integrity

```text
duplicate deployment identifier groups: 0
invalid origin deployment references: 0
self-referential origins: 0
origin cycles: 0
duplicate primary deployments: 0
stable assets without deployment rows: 0
```

The audit compares deployment identifiers by chain, identifier type, and normalized identifier value. EVM contract addresses are compared case-insensitively.

## Correction Applied

The first audit run detected a real cross-asset Ethereum identifier collision between USDf and XAUT.

The USDf row contained an incorrect reused address. PR #301 corrects `sog_dep_usdf_ethereum_batch_l` to the issuer-published Ethereum USDf contract address and adds a dedicated reviewed official-contract evidence record:

```text
sog_src_usdf_contracts_pr301
```

The corrected USDf deployment is classified as `verified` because the contract identity is directly supported by the Falcon Finance smart-contract registry.

## Verification Overlay Synchronization

The previous deployment verification overlay covered 130 deployment rows. The current canonical registry contains 140.

PR #301 expands the overlay to full current coverage:

```text
verified:                         19
identifier_recorded_unverified:   45
source_linked_no_identifier:      76
review_needed:                     0
unknown:                           0
not_recorded:                      0
total:                           140
```

The ten newly covered deployment rows are classified individually rather than assigned a bulk status.

## Taxonomy and Network Identity

```text
canonicality not recorded: 0
unknown public deployment category: 0
verification review-needed: 0
verification not-recorded/unknown: 0
identifier not recorded: 76
contract review-needed: 0
network review-needed: 2
aggregate network context: 4
```

The bounded network review-needed queue is:

```text
sog_dep_aecoin_unresolved_batch_p
sog_dep_usdg_chain_seed
```

These rows remain unresolved rather than being assigned a guessed network identity.

Four rows intentionally use aggregate network context and are not treated as single-chain deployment identities.

## Operational-State Review Visibility

The audit preserves operational states that do not yet map cleanly into the public status taxonomy. This includes source-review-needed rows, historical retirement proposals, related-asset context, and unresolved legacy/current-state boundaries.

These remain review-visible and are not silently coerced into `active`, `inactive`, or `terminated`.

## Control Capability Coverage

```text
freeze capability not recorded: 139
blacklist capability not recorded: 139
rows with recorded control events: 18
```

Absence of a recorded freeze or blacklist capability is treated as a knowledge-state gap, not evidence that the capability does not exist.

## Evidence Integrity

```text
deployment rows missing evidence ids: 0
broken evidence references: 0
```

The new USDf contract evidence raises the current canonical Evidence baseline from 501 to 502 records, public source identities from 455 to 456, and Evidence relations from 501 to 502. The reviewed source is isolated in `data/evidence-pr301.json`; historical Batch L evidence files remain unchanged.

## Result

PASS. Deployment identities, source references, verification overlay coverage, taxonomy mapping, and origin relationships are structurally valid.

PR #301 closes with:

```text
deployments: 140
stable assets covered: 100
recorded chain labels: 35
critical findings: 0
duplicate identifiers: 0
origin cycles: 0
verification overlay gaps: 0
identifier-not-recorded queue: 76
network-review-needed queue: 2
freeze capability not recorded: 139
blacklist capability not recorded: 139
```

The next registry-wide audit item is PR #302: lifecycle and relationship boundary integrity.
