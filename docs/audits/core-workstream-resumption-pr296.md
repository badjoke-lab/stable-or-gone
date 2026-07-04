# Core workstream resumption checkpoint — PR #296

## Baseline

```text
Base main: 8dfde0222b66e255d13285a5154d7508261dfc55
Stable assets: 100
Organizations: 94
Events: 172
Evidence: 501
Detail routes: 366
```

## Decision

The dedicated UI correction program is stopped. UI is maintenance-only and may be changed through narrow defect-fix PRs when concrete problems are found.

The active workstream resumes at the 100-record registry-wide audit.

## Next item

```text
PR #297 — identity uniqueness and lineage audit
```

The audit will cover canonical IDs, slugs, names, symbols, aliases, domains, historical names, rebrands, migrations, token upgrades, and chain-specific representations.

## Data preservation

This checkpoint changes repository authority and validation only. It changes no canonical data, routes, schemas, evidence, events, organizations, deployments, or machine-readable outputs.
