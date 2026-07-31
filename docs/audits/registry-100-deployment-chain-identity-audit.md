# SOG Deployment and Chain Identity Audit

- Audit ID: `sog_registry_100_deployment_chain_identity_pr301`
- Deployments: **184**
- Stable assets with deployment rows: **117**
- Chain labels recorded: **49**
- Critical findings: **0**
- Review warnings: **1**

## Identity Integrity

- Duplicate identifier groups: 0
- Invalid origin refs: 0
- Origin cycles: 0
- Duplicate primary deployment assets: 0
- Stable assets without deployment rows: 0

## Verification and Taxonomy

- Canonicality not recorded: 0
- Unknown public categories: 0
- Verification review-needed: 0
- Verification not-recorded/unknown: 0
- Identifier not recorded: 79
- Contract review-needed: 0
- Network review-needed: 4
- Aggregate network context: 4

## Control Capability Coverage

- Freeze capability not recorded: 183
- Blacklist capability not recorded: 183

## Critical Findings

- None.

## Review Warnings

- 4 deployments retain network review-needed state

## Observations

- Audited 184 deployments across 117 stable assets and 49 recorded chain labels.
- Verification overlay covers 184 deployment ids with no unreviewed verification state.
- 79 deployments are source-linked without a recorded contract or deployment identifier.
- 183 deployments have no freeze-capability value and 183 have no blacklist-capability value.

## Result

PASS. Deployment identities, source references, verification overlay coverage, taxonomy mapping, and origin relationships are structurally valid. Missing identifiers and control-capability values remain explicit review queues.
