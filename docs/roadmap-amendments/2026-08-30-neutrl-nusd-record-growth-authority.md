# Neutrl / NUSD bounded record-growth authority — 2026-08-30

## Purpose

Authorize one bounded canonical record-growth lane for Neutrl's NUSD stable asset and the material reserve-liquidity / redemption-suspension incident disclosed in August 2026.

This authority exists because `AGENTS.md` requires a fresh reviewed authority before substantive canonical work from `REVIEW_GATE`.

## Scope

The implementation PR may add only the records needed to represent:

- Neutrl / Caverna Auctus Inc. as the relevant organization / issuer identity where the existing SOG model requires it.
- NUSD as a stable asset.
- The 2026-08-13 suspension of minting / redemptions / related protocol functions following a reserve issue.
- The 2026-08-28/29 follow-up disclosure that approximately USD 27 million was liquid while additional strategy positions remained illiquid and their timing, amount and recovery value were not yet confirmed.
- The announced plan for an early-redemption mechanism for NUSD and sNUSD holders, with timing and recovery explicitly left unresolved until final terms and deployment are published.
- Primary and corroborating evidence necessary to support those bounded claims.
- Explicit known-unknowns for unrecovered / illiquid position value, recovery percentage, redemption timing, counterparty identity where not established, and final holder outcome.

## Classification boundary

The implementation must not classify NUSD or Neutrl as `failed`, `bankrupt`, `insolvent`, `scam`, `rug`, or hacked unless separately supported by later reviewed evidence.

The August 2026 incident is to be represented as a reserve / strategy liquidity impairment with minting or redemption suspension and a recovery process in progress. The protocol's statement that this was not a smart-contract exploit, hack or code vulnerability must be preserved as a claim from the operator, not generalized into a broader safety conclusion.

Historical reserve snapshots must remain date-bounded. In particular, an earlier dashboard / reserve figure and the later approximately USD 27 million liquid-asset figure must not be subtracted to infer a loss amount. Illiquid positions and associated PnL remain unresolved until evidence establishes recoverable value.

## Canonical and public boundary

Authorized:

- One NUSD stable-asset dossier and the minimum complete organization, relationship, event, evidence, reserve/redemption, legal, deployment and known-unknown layers required by the current SOG validators.
- Public rendering that follows existing SOG dossier, event, evidence, search, compare and machine-readable projection contracts without introducing a new route family or schema.
- A neutral/fallback Stablecoin mark if no reviewed direct mark is available, in accordance with the permanent logo-disposition gate.

Not authorized:

- Schema or enum expansion unless the implementation demonstrably cannot fit the existing taxonomy; any such need must stop and return to review rather than silently expanding taxonomy.
- Ranking, scoring or recommendation.
- Any unrelated stable-asset additions or edits.
- Market Access promotion unrelated to the incident.
- DNS, Cloudflare, GA4, deployment-account or other infrastructure mutation.
- Automated inference of final loss, haircut, insolvency, recovery percentage, counterparty identity or holder outcome.

## Evidence requirements

At minimum, the implementation must preserve source separation between:

1. Neutrl's own reserve / status statements.
2. The August 2026 suspension announcement or first-party equivalent.
3. The later August 2026 liquidity / early-redemption update.
4. Any secondary coverage used only for corroboration or context.

Every material claim must be linked to a source whose claim scope supports it. Allegations about team-wallet withdrawals, insider behavior, insolvency or misconduct must not enter canonical facts without separate reviewed evidence.

## Acceptance

The implementation PR is acceptable only if:

- all existing canonical/data validators pass;
- canonical identity and relationship uniqueness checks pass;
- the permanent Stablecoin mark / fallback disposition gate passes;
- machine-readable Series projections remain valid and lossless over the native dossier;
- no existing SOG record changes meaning except where strictly required to connect the new Neutrl/NUSD identity;
- the public copy states unresolved recovery value and timing as unknown rather than guessing;
- the implementation PR documents exact files and canonical-count deltas.

## Closeout

After the bounded Neutrl/NUSD implementation is accepted, this authority is exhausted. Further Neutrl updates may be added only through the repository's then-current operating authority / incident-maintenance process; this document does not authorize unrelated record growth.
