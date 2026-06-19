# Launch-date Unresolved Queue Freeze

Updated: 2026-06-19

## Result

The seven category-A records identified in the original 38-record review were promoted through Launch-date Batches O and P. The remaining 31 records are intentionally unresolved and remain `launch_date: null`.

```text
Category B — partial date only:                 5
Category C — boundary, version, or lineage:    23
Category D — adequate primary source absent:    3
Total frozen unresolved queue:                 31
```

## Machine-readable source

`data/quality/launch-date-unresolved.json` is the canonical unresolved queue.

Each entry records:

- canonical stablecoin ID
- category B, C, or D
- strongest known range where available
- reason code
- review note

## Enforcement

`scripts/validate-launch-date-unresolved.mjs` loads the stablecoin files declared in the Registry v2 baseline and verifies:

- every queue ID exists
- every queued asset still has `launch_date: null`
- every canonical null launch date appears in the queue
- there are no duplicate IDs
- the total is 31
- category counts are B 5, C 23, D 3
- anti-fabrication policy flags remain enabled

The validator runs in both the normal CI workflow and the full `npm run build` chain as `npm run validate:launch-queue`.

## Validation result

The queue validator and full repository build completed successfully in GitHub Actions.

## Update rule

A future launch-date promotion must update the canonical record and remove the same ID from this queue in one PR. CI must fail when only one side changes.

## Deployment classification

No production deployment required. This quality freeze changes no canonical counts and does not wait for Cloudflare Pages.

## Next work

Historical terminal-date review for BAC, DSD, ESD, and USDN.
