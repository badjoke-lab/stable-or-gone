# JPYSC Launch and RLUSD Japan Handling Review

Recorded: 2026-06-24

## Scope

This review documents two separate Japan-facing stablecoin changes:

- JPYSC began a restricted account-internal launch through SBI VC Trade.
- SBI VC Trade began handling the already-active global RLUSD asset in Japan.

## JPYSC decision

- canonical asset: `sog_st_jpysc`
- peg reference: JPY
- entity status: `limited`
- Registry v2 lifecycle: `restricted`
- launch date: 2026-06-24
- legal issuer: SBI Shinsei Trust & Banking
- initial distribution partner: SBI VC Trade
- technology partner: Startale Group

The launch does not establish external-wallet transfer, unrestricted public-chain circulation, a public contract address, or a recurring reserve-attestation cadence. Those boundaries remain explicit known unknowns.

## RLUSD decision

- retain the existing global launch date of 2024-12-17
- retain active status
- add a regional distribution and handling event dated 2026-06-24
- record the Japanese Type 4 electronic payment instrument context

The Japan event is not treated as a second global launch and does not change the asset's USD peg reference.

## Identity boundaries

JPYSC remains separate from:

- JPYC
- JPYC Prepaid
- GYEN
- tokenized deposits
- later cross-chain or wrapped representations

## Production

No Cloudflare deployment is included. Publication remains subject to the existing manual production and parity process.
