# SOG batch finalization guard

Status: active

## Purpose

The batch finalization guard prevents a record-growth pull request from appearing complete while leaving canonical data, loaders, counts, or temporary generation artifacts out of sync.

Run it with:

```bash
npm run validate:finalization
```

It is also part of `npm run build` and the main CI workflow.

## Protected invariants

The guard requires:

- every baseline data-group file to exist and contain a JSON array
- protected baseline counts to match the loaded canonical records
- every canonical stablecoin to have one classification and one reserve/redemption profile
- every canonical stablecoin to have a promoted Candidate Master entry
- every event to have a matching Event v2 detail, with no orphan event details
- organization relationships, events, evidence, and deployments to reference existing records
- protected stablecoin and organization IDs and slugs to remain present
- every batch JSON file to be listed in the correct baseline data group
- every baseline data file to be connected to its runtime loader
- every legacy issuer batch to be connected to both legacy compatibility validators
- required route source files to remain present

## Forbidden temporary artifacts

The canonical branch must not retain:

- temporary `apply-batch-*` workflows
- batch bootstrap, preview, source-artifact, or generation workflows
- temporary batch generator scripts
- split batch source directories
- PR sync diagnostics
- branch probe files
- batch validation-error files
- partial batch JSON files

## Required workflow for future batches

A record-growth PR must update all affected layers together:

1. canonical records and supporting records
2. Candidate Master promotion state
3. Registry v2 classification and profiles
4. events, Event v2 details, evidence, known unknowns, and deployments
5. runtime loaders
6. legacy issuer compatibility loaders when applicable
7. `docs/migration/registry-v2-baseline.json`
8. review and growth-plan documentation

The PR is not final until all existing validators, the finalization guard, Astro check, site build, deployment verification, and public-layer verification pass.

## Count policy

The values under `minimum_counts` in the baseline file are treated as the protected canonical checkpoint by this guard. When reviewed records are added or removed, the data groups, Candidate Master, and baseline counts must be updated in the same PR.
