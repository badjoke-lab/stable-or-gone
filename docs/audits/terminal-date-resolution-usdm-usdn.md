# Terminal-Date Resolution: Mountain USDM and USDN

Recorded: 2026-06-23

## Resolved boundaries

- Mountain Protocol USDM — `2025-08-22`: Phase 3 terms took effect and Mountain Protocol ended issuance, direct redemption, and platform operation. Remaining on-chain pools and exit routes are retained as post-discontinuation context rather than treated as continuing issuer service.
- Neutrino USD / USDN — `2023-01-31`: Neutrino began the approved Waves on-chain asset rename to XTN through Update Asset Info. SOG uses this executed identity change as the end of the original hard-USD stablecoin classification; external interfaces could continue showing USDN during the staged rollout.

## Records kept unresolved

- Basis Cash — no first-party shutdown, mint-stop, redemption-stop, or governance-termination boundary recovered.
- Dynamic Set Dollar — April 2021 design activity does not establish final shutdown or migration execution.
- Empty Set Dollar — the 2021-08-02 successor migration opening does not prove final cessation of all original contracts or claims.
- GYEN — orderly wind-down began 2026-05-15, but the initial redemption period remains open until 2026-11-11 and final termination has not occurred.

## Queue effect

- Terminal-date unresolved: `6 → 4`
- Canonical stable assets: unchanged at `81`
- Events and Event v2 details: unchanged at `111` each
- Evidence: `337 → 338`

## Boundary policy

A canonical discontinued date may mark the end of the issuer service or the old stablecoin identity even when residual contracts, balances, pools, or migration routes remain. Those residual states must remain separately documented and must not be described as restored issuance or redemption.

## Validation

- Cross-layer integrity audit passed with zero critical findings and zero warnings.
- The complete `npm run build` validation chain passed.
- Temporary transformation and workflow files were removed from the final pull-request diff.

## Production status

No Cloudflare action, production deployment, or public parity assertion is performed.
