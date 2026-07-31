# Post-domain authority synchronization

Status: active roadmap amendment  
Updated: 2026-07-31

## Authoritative current position

```text
PR #467 reviewed 116-asset canonical-data checkpoint: complete
PR #492 Statistics panel flow and deployment-chain normalization: complete
PR #493 official-domain migration: complete and production-verified
PR #495 post-domain authority synchronization: active
```

Current reviewed state:

```text
Stable assets: 116
Organizations: 107
Relationships: 128
Events: 191
Evidence: 571
Evidence Relations: 571
Deployments: 182
Market Access Records: 8
Detail routes: 414
Metadata-checked routes: 414
Official origin: https://www.stableorgone.com
Main and production commit: bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221
```

This amendment supersedes stale current-position wording and obsolete active-workstream statements in earlier authority documents while preserving completed historical contracts and records.

## PR #495 purpose

PR #495 is repository authority synchronization only.

It must:

- align top-level repository instructions and governance with the actual 116-asset checkpoint;
- record PR #492 as the current Statistics and responsive-layout acceptance point;
- record PR #493 as the completed official-domain migration;
- establish `https://www.stableorgone.com` as the only repository official origin;
- record the legacy-host redirect as externally blocked rather than falsely complete;
- update active-workstream validation;
- preserve all canonical records, public routes, UI output, machine-readable schemas, and historical checkpoints.

It must not:

- change canonical data;
- add a candidate or stable asset;
- change public UI or CSS;
- change route families;
- change Statistics semantics;
- change deployment-chain normalization;
- introduce Pages Functions or a Worker;
- edit Cloudflare zone rules;
- close Issue #479 while the legacy redirect remains incomplete.

## Completed UI and Statistics boundary

The completed sequence is:

```text
PR #487 stablecoin logo coverage
PR #488 white background, status badges, and mobile density
PR #489 homepage information architecture
PR #490 broad desktop/mobile remediation
PR #491 Statistics redesign
PR #492 Statistics panel flow and deployment-chain normalization
```

PR #492 remains binding for:

- visible non-collapsible Statistics sections;
- independently packed desktop columns;
- source-ordered single-column mobile output;
- canonical BNB Chain and Gnosis Chain labels;
- distinct Arbitrum One and Arbitrum Nova identities;
- unresolved bare `Arbitrum` values;
- deployment-total reconciliation.

## Official-domain boundary

PR #493 completed repository and production migration to:

```text
https://www.stableorgone.com
```

The official origin governs canonical metadata, hreflang, OGP, JSON-LD, machine-readable outputs, sitemap, robots, production checks, deployment reporting, and repository documentation.

The legacy host `sog.badjoke-lab.com` remains a non-canonical alias until a Cloudflare zone redirect can be configured.

The current GitHub Cloudflare credential returned zero accessible zones. It therefore does not authorize a redirect write.

Required future redirect:

```text
hostname: sog.badjoke-lab.com
status: 301
target: concat("https://www.stableorgone.com", http.request.uri.path)
preserve query string: true
```

A Pages Function workaround is outside scope because it would change request accounting and the static-serving boundary.

## Bounded continuation

After PR #495 merges:

```text
STEP 1  reconcile obsolete production, deployment, and UI issues
STEP 2  keep Issue #479 open for the externally blocked legacy redirect
STEP 3  perform Record Growth Batch 4 candidate audit
STEP 4  REVIEW GATE before any canonical promotion
```

The candidate audit may:

- assemble a bounded candidate set;
- check scope, identity, lineage, issuer reuse, lifecycle, reserve, redemption, deployment identity, evidence, archives, and known unknowns;
- classify candidates as review-ready, incomplete, duplicate, lineage continuation, out of scope, or rejected;
- recommend a maximum of two candidates for a later review decision.

The candidate audit may not:

- promote candidates;
- change canonical counts;
- infer unsupported fields;
- authorize an indefinite sequence;
- create a public ranking or recommendation surface;
- treat monitoring output as canonical Evidence.

No candidate and no canonical promotion PR is authorized by this amendment.

## Issue reconciliation rules

Issue cleanup must preserve history.

Allowed actions:

- close completed UI issues with references to the completing PR and production verification;
- close obsolete deployment checkpoints that were superseded by Issue #479;
- correct titles or bodies that falsely describe an old active state;
- leave long-lived evidence or production records open when they still contain an unresolved external dependency.

Prohibited actions:

- delete history;
- close Issue #479 while the legacy redirect remains incomplete;
- describe the redirect as complete without status and `Location` verification;
- use issue closure as evidence of production parity.

## Validation requirements

PR #495 must prove:

1. top-level authority documents report 116 stable assets;
2. top-level authority documents report `https://www.stableorgone.com` as the official origin;
3. PR #492 and PR #493 are recorded as completed acceptance points;
4. the current main and production commit is recorded consistently;
5. the legacy redirect is recorded as externally blocked;
6. no candidate or promotion is authorized;
7. active-workstream validation imports the PR #467 canonical checkpoint validator;
8. canonical data remains unchanged;
9. public routes and machine-readable output remain unchanged apart from build provenance timestamps and commit identity;
10. ordinary repository validation, Astro check, and build remain green.

## Exit condition

After PR #495 merges and production verifies, the repository may proceed to issue reconciliation and then a bounded candidate audit.

Canonical promotion remains blocked until the audit has completed and a separate review decision explicitly authorizes it.
