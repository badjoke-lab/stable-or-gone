# UI v3 production smoke pagination correction

Date: 2026-07-02
Follow-up to: PR #275
Status: implementation pending

## Diagnosis

Production successfully published commit:

```text
3353c8b4cf24c597452d0575945fc911a88ede19
```

The public version and manifest reported:

```text
branch: main
canonical stable assets: 98
organizations: 93
events: 166
evidence rows: 489
source identities: 444
canonical data hash: sha256:93c851f30a74774b2523eb949cdf64944f4a216b3cd0c831ec4177e895c96e18
```

The corrected Home assertions passed. The next stale assertion was:

```text
stablecoin index record count mismatch
```

The Stablecoin register is intentionally paginated at twenty records per page. Its initial public summary is:

```text
98 records
1–20 of 98 records
20 per page
```

The former smoke contract expected `Records 98` and `98 of 98 records`, which described the superseded unpaginated register rather than the approved Editorial Ledger register.

## Changes

- verify the total canonical record count independently from the current visible page range;
- verify the initial range as `1–min(20,total)`;
- verify the fixed `20 per page` public contract;
- prevent the former unpaginated count markers from returning;
- preserve all detail-link and sitemap-count checks, which must still cover all 98 canonical records.

## Preservation

- Canonical stable assets changed: 0.
- Canonical data groups changed: 0.
- Public routes changed: 0.
- Public UI source changed: 0.
- Pagination behavior changed: 0.
- Machine-readable schema changed: 0.

## Completion rule

The correction is complete only after normal pull-request workflows pass, the exact checked head is published by the standard deployment workflow, production smoke/provenance/all-detail parity pass, and the production representative audit records 24 desktop and 24 mobile captures with zero rendered failures.
