# Nuon v1 / v2 launch and lineage audit

Recorded: 2026-06-23

## Decision

- Canonical branded-asset launch: 2023-02-02
- v1 deployment: Arbitrum One
- v1 contract: 0xfb9Fed8cB962548A11fE7F6F282949061395c7F5
- v2 guarded community phase: 2025-02-28
- v2 public opening: 2025-03-03
- v2 deployment: Base
- v2 contract: 0x843AFb8f37f897b4F9c7967674f76e3EECFCE100

## Version boundary

Nuon v1 was the first public Nuon mainnet release and used a CDP-style model on Arbitrum. Nuon v2 is a substantial redesign on Base using a new contract, USDC treasury minting, positive rebasing, vaults, and MaxCap governance. The project presents both as Nuon versions, so SOG preserves one branded asset lineage while recording separate version and deployment events.

## Unresolved continuity

No first-party source recovered in this review establishes an automatic v1-to-v2 token swap, holder migration, legacy redemption route, or definitive v1 shutdown date. The registry therefore does not describe the Base contract as a bridge or direct continuation of the Arbitrum contract.

## Registry treatment

The asset launch date is 2023-02-02. The 2025 Base opening is a v2 public relaunch, not a replacement launch date. Arbitrum v1 is stored as a legacy deployment with unresolved current status; Base v2 is the current primary deployment.

## Validation

The one-time update pipeline passed baseline, launch queue, terminal queue, candidate, data, compatibility, classification, profile, Event v2, evidence relation, deployment, Registry v3, final-state, finalization, Astro, site-build, deployment verification, and public verification checks before committing the canonical result. Temporary scripts and workflow files were removed from the final branch.
