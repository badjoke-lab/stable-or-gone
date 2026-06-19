# Historical Terminal-date Freeze

Updated: 2026-06-19

## Result

The validator found six canonical terminal-status records with `discontinued_date: null`:

```text
BAC
DSD
ESD
GYEN
Mountain USDM
USDN
```

The earlier four-record planning count omitted GYEN and Mountain USDM. No canonical terminal date changes in this freeze.

## Maintained data

```text
data/quality/terminal-date-unresolved.json
```

Each entry records the canonical status, strongest supported boundary, unresolved definition, rejected shortcut dates, and future review target.

## Additional records

GYEN entered an orderly wind-down on 2026-05-15. New purchases stopped, but issuer redemption remained available. The wind-down start is not the final termination date.

Mountain USDM is in Phase 3. The former issuer redemption platform is closed, while an on-chain reserve and exit process remains documented. Platform closure is not the final token termination date.

## Validation

`scripts/validate-terminal-date-unresolved.mjs` verifies that:

- every queued ID exists
- canonical status matches the queue
- each queued terminal date remains null
- every canonical terminal-status record with a null terminal date appears in the queue
- no unrelated record appears in the queue
- the total remains six
- the date-boundary policy flags remain enabled

The validator runs as `npm run validate:terminal-queue` in normal CI and in the full build.

## Update rule

A future date promotion must update the canonical record and remove the same ID from this queue in one PR. A new terminal-status record with a null terminal date must join the queue in the same PR.

## Phase result

```text
Historical null terminal dates: 6
Unexplained terminal gaps:      0
Invented shutdown dates:        0
Explained records:          6 / 6
```

## Deployment classification

No production deployment required. This change does not require Cloudflare access.

## Next work

Begin Phase 3 with fiat-backed income-profile completion.
