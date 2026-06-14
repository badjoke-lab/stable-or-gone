# Registry v3 foundation review

This branch adds the additive Registry v3 foundation without migrating the existing forty canonical assets.

## Included

- Registry v3 schema types and enums
- legal-profile, stable-asset-relationship, and reserve-component data groups
- canonical Registry v3 loaders
- Registry v3 foundation manifest
- Registry v3 validator
- Registry v3-compatible classification, reserve, yield, deployment, and event-detail enums
- build and CI integration
- batch-finalization protection for Registry v3 files, loader wiring, validator wiring, and manifest counts

## Explicitly deferred

- populating legal profiles for the forty existing assets
- populating stable-asset relationships
- adding structured reserve components
- classifying all existing deployments
- public page presentation
- statistics generation and `/stats/`

## Compatibility

- existing IDs, slugs, routes, and Registry v2 data remain unchanged
- the new data groups start as empty canonical arrays
- Registry v3 validation is additive
