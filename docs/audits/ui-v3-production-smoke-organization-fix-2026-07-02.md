# UI v3 production smoke organization-count correction

Date: 2026-07-02
Follow-up to: PR #276
Status: implementation

## Diagnosis

Production provenance and exact output parity pass for main commit `681172b08e2f901450a369f7b141b7a9ebd53b42`.

The remaining smoke failure is:

```text
stablecoin index organization count mismatch
```

The Editorial Ledger Stablecoin register intentionally presents the canonical stable-asset total, page range, page size, and per-record primary-organization fields. It does not present a register-wide `Organizations 93` summary. The canonical organization total is verified on the Organizations register instead.

## Correction

- remove the stale assertion that requires a register-wide organization total on `/stablecoins/`;
- retain the organization total assertion on `/issuers/`;
- retain the Home organization summary assertion;
- retain all stablecoin total, pagination, detail-link, sitemap, provenance, and exact output-parity checks;
- add a source guard preventing the stale Stablecoin-register organization assertion from returning.

## Preservation

- Canonical stable assets changed: 0.
- Organizations changed: 0.
- Events changed: 0.
- Evidence changed: 0.
- Public UI changed: 0.
- Public routes changed: 0.
- Machine-readable schema changed: 0.
