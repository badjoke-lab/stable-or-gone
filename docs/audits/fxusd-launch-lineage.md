# fxUSD launch and V1/V2 lineage audit

Recorded: 2026-06-24

## Decision

- Product announcement: 2024-01-11
- Seeding phase begins: 2024-02-23
- Canonical public-availability launch: 2024-02-27
- Ethereum fxUSD proxy: 0x085780639CC2cACd35E474e71f4d000e2405d8f6
- Reviewed V2 proxy upgrade: 2025-01-02
- Asset continuity: one fxUSD token identity through the reviewed same-proxy upgrade

## Launch boundary

The January article introduced fxUSD but did not establish public production availability. The February 23 seeding announcement explicitly made full mint and redeem access conditional on reaching a 500 ETH seed threshold. On February 27, an Ethereum Curve pool containing fxUSD was created on-chain after the seeding phase began. SOG uses that day as a conservative public-availability boundary. This does not assert that the pool creation transaction was the first-ever token mint.

## V1/V2 boundary

Official documentation distinguishes f(x) Protocol V1 and V2 and publishes one continuous fxUSD proxy. The proxy emitted an upgrade event on January 2, 2025. SOG records this as a protocol-version upgrade rather than a second stablecoin launch. V1 and V2 component contracts and position products remain distinct even though the base token proxy is continuous.

## Registry treatment

The fxUSD launch date is 2024-02-27. The January announcement and February 23 seeding start remain evidence and context, not launch substitutes. fxSAVE, position products, stability-pool shares, and CreditNotes remain separate from base fxUSD.

## Remaining unknowns

The complete V1-to-V2 component replacement graph, staged rollout chronology, pool migration, and treatment of every V1 position product remain unresolved. The separate base-token income-accrual question also remains open.

## Validation

The one-time update pipeline passed baseline, launch queue, terminal queue, candidate, data, compatibility, classification, profile, Event v2, evidence relation, deployment, Registry v3, final-state, finalization, Astro, site-build, deployment verification, and public verification checks before committing the canonical result. Temporary scripts and workflow files were removed from the final branch.
