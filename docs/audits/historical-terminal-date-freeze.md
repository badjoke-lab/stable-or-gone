# Historical Terminal-date Freeze

Updated: 2026-06-19

## Result

The four historical records without a day-level terminal date are now maintained in an explicit queue:

```text
BAC
DSD
ESD
USDN
```

No canonical `discontinued_date` is changed.

## Maintained data

```text
data/quality/terminal-date-unresolved.json
```

Each entry records the canonical status, strongest supported boundary, unresolved definition, rejected shortcut dates, and future review target.

## Validation

`scripts/validate-terminal-date-unresolved.mjs` verifies that:

- every queued ID exists
- canonical status matches the queue
- each queued terminal date remains null
- every historical canonical record with a null terminal date appears in the queue
- no unrelated record appears in the queue
- the total remains four
- the date-boundary policy flags remain enabled

The validator runs as `npm run validate:terminal-queue` in normal CI and in the full build.

## Update rule

A future date promotion must update the canonical record and remove the same ID from this queue in one PR. A new historical record with a null terminal date must join the queue in the same PR.

## Phase result

```text
Historical null terminal dates: 4
Unexplained terminal gaps:      0
Invented shutdown dates:        0
Explained records:          4 / 4
```

## Deployment classification

No production deployment required. This change does not require Cloudflare access.

## Next work

Begin Phase 3 with fiat-backed income-profile completion.
