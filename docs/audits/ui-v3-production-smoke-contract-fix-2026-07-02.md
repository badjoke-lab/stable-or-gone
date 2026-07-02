# UI v3 production smoke contract correction

Date: 2026-07-02
Follow-up to: PR #273
Status: implementation pending

## Diagnosis

The PR #273 release candidate was successfully published to production:

```text
source commit: 8f5235f75bfa15c42ab833dcac948b59f6571ffd
main commit: 8f5235f75bfa15c42ab833dcac948b59f6571ffd
production commit: 8f5235f75bfa15c42ab833dcac948b59f6571ffd
production branch: main
canonical stable assets: 98
canonical data hash: sha256:93c851f30a74774b2523eb949cdf64944f4a216b3cd0c831ec4177e895c96e18
version/manifest provenance equal: true
```

Production provenance diagnostic:

```text
PR: #274
workflow run: 28554612236
artifact: 8025128561
artifact digest: sha256:a839672b7a1bdf0b589704d2ca050f66bd32298b8db29ebdf75c6b5046c2124c
```

The diagnostic also ran production smoke, provenance, and exact-output parity separately. Provenance and all 357 detail-route canonical/JSON-LD checks passed. The failing assertion was:

```text
home stablecoin count mismatch
```

The public site was correct. `scripts/check-production.mjs` still expected the superseded UI wording `Stablecoins 98` and `Sources 489`.

## Correct Editorial Ledger contract

The Home register strip currently renders:

```text
98 stable assets
93 organizations
166 events
444 Source identities
```

The stablecoin dossier currently uses these reviewed section markers:

```text
Identity and current state
Organizations and control
How the asset works
Reserve and redemption
Deployments and legal context
History
Evidence
Known unknowns and coverage
```

The production smoke test must verify those public labels rather than the former v2 wording.

## Changes

- update Home count assertions to the Editorial Ledger register strip;
- distinguish raw evidence records from deduplicated public source identities;
- update stablecoin detail assertions to the current dossier hierarchy;
- add `scripts/check-production.mjs` to the production-closure workflow path contract;
- extend the closure validator to block reintroduction of superseded v2 smoke markers.

## Preservation

- Canonical stable assets changed: 0.
- Canonical data groups changed: 0.
- Public routes changed: 0.
- Public UI source changed: 0.
- Logo assets changed: 0.
- Contact, support, and wallet values changed: 0.
- Machine-readable schema changed: 0.

## Completion rule

The correction is complete only after normal pull-request workflows pass, the exact checked head is published by the standard main deployment workflow, production smoke/provenance/output parity pass, and the 48-image production representative audit records Gate V3-H for that same commit.
