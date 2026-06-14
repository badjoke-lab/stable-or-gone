# Batch E review

Status: implemented on `record-growth-batch-e-clean`

## Records

- EURS — active euro-backed STASIS stablecoin with onboarding-dependent direct redemption and multi-network coverage.
- EURT — terminated Tether euro stablecoin; direct redemption ended on 2025-11-27 while historical contracts may remain visible.
- Mento Dollar / USDm — active continuous identity from Celo Dollar / cUSD; official rebrand changed no contract or peg.
- alUSD — active Alchemix synthetic debt asset backed by yield-bearing stablecoin collateral.

## Identity boundaries

- EURS and EURT are separate euro stablecoins with different issuers and lifecycle states.
- cUSD and USDm are one canonical asset because the official transition was branding-only.
- alUSD is separate from deposited collateral, vault positions, yield receipts, and bridged representations.
- Residual EURT contract or market activity is not treated as restored issuer redemption.

## Protected post-Batch-E minimums

- stable assets: 40
- organizations: 32
- relationships: 40
- events and event details: 48
- evidence and evidence relations: 182
- known unknowns: 93
- deployments: 67
