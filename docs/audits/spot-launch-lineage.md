# SPOT launch and protocol-version audit

Recorded: 2026-06-24

## Decision

- Canonical asset launch: 2022-12-08
- Launch network: Ethereum mainnet
- Continuous SPOT proxy: 0xC1f33e0cf7e40a67375007104B929E49a581bafE
- v2 proposal: 2024-04-09
- v2 signal vote passed: 2024-04-19
- v2 production activation day: unresolved
- v5.0 on-chain execution: 2025-07-21
- Base bridged representation: 0x8f2E6758C4D6570344bd5007DEc6301cd57590A0

## Launch boundary

Ampleforth's official December 8, 2022 launch article states that SPOT was live and deployed on Ethereum mainnet, provides the SPOT ERC-20 address, and describes the initial capped launch configuration. Independent contemporary reporting corroborates public launch and mint availability on the same day. This is the canonical asset launch boundary.

## v2 boundary

The April 9, 2024 governance proposal describes v2 as an in-place upgrade. Existing SPOT and stAMPL holders did not need to migrate, and the underlying ButtonTranche contracts were unchanged. The signal vote passed on April 19. Because the official thread only states that execution would occur no earlier than the following Monday, the proposal and vote dates are not substituted for the exact production activation day.

## Current contracts and v5

Current official technical documentation publishes the Ethereum SPOT, stAMPL, BondIssuer, FeePolicy, and Router addresses plus a Base Superbridge representation. The July 21, 2025 governance update reports that v5.0 executed on-chain. SPOT therefore remains one continuous asset and token identity across versioned protocol upgrades.

## Remaining unknowns

The exact v2 activation transaction, August 2023 Rotation Vault launch day, intermediate v3/v4 sequence, and complete historical implementation and collateral-rotation graph remain unresolved.
