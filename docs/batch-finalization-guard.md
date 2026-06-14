# SOG batch finalization guard

Status: active

## Purpose

The batch finalization guard prevents a record-growth pull request from appearing complete while leaving canonical data, loaders, minimum counts, or temporary generation artifacts out of sync.

Run it with:

```bash
npm run validate:finalization
```

It is part of `npm run build` and the main CI workflow.

## Protected invariants

The guard requires:

- every baseline data-group file to exist and contain a JSON array
- every protected baseline minimum count to remain satisfied
- every canonical stablecoin to have classification, reserve/redemption profile, organization relationship, and promoted Candidate Master coverage
- every event to have a matching Event v2 detail, with no orphan details
- relationships, events, evidence, and deployments to reference existing canonical records
- protected IDs, slugs, and route sources to remain present
- every baseline data file to be connected to its runtime loader
- matching legacy issuer files to be connected to both compatibility validators when an organization batch requires them
- temporary workflows, generators, source chunks, diagnostics, probe files, validation logs, and partial JSON files to be absent

## Required workflow for future batches

A record-growth PR must update all affected layers together:

1. canonical and supporting records
2. Candidate Master promotion state
3. classification and reserve/redemption profiles
4. events, Event details, evidence, known unknowns, and deployments
5. runtime and compatibility loaders
6. `docs/migration/registry-v2-baseline.json`
7. review and growth-plan documentation

The PR is not final until the existing validators, this guard, Astro check, site build, deployment verification, and public-layer verification pass.

## Count policy

`minimum_counts` are protected lower bounds. Later growth may exceed them, but the registry must not fall below them. A formally completed growth checkpoint should update the baseline in the same reviewed PR.
