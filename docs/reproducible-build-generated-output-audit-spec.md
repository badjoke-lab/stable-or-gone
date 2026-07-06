# Stable or Gone reproducible build and generated-output audit specification

Status: canonical implementation specification — PR #317  
Updated: 2026-07-06

## 1. Purpose

This specification defines the reproducible-build and generated-output boundary for the reviewed 100-asset release-hardening program.

PR #316 established source-state integrity for counts, machine-readable count paths, routes, and provenance semantics. PR #317 establishes that the same source and build context produce byte-identical audited output, and that build-time generators do not silently mutate protected historical baseline inputs.

The audited chain is:

```text
locked dependency graph
+ pinned Node runtime
+ fixed source commit
+ fixed source branch
+ fixed build timestamp
+ fixed SOURCE_DATE_EPOCH
-> build generators
-> Astro build
-> hashed output inventory
-> second identical build
-> byte-level hash comparison
```

## 2. Binding baseline

The binding baseline is:

```text
docs/migration/reproducible-build-output-baseline.json
```

It records:

- Node runtime version;
- package-manager and lockfile contract;
- package-lock digest;
- resolved direct dependency versions;
- deterministic build-context variables;
- hashed output roots;
- protected historical inputs;
- tracked and ephemeral generated-file roles;
- audit scripts and workflow.

## 3. Dependency reproducibility

The repository must contain:

```text
package-lock.json
```

CI, reproducibility audit, and production deployment use:

```text
npm ci --no-audit --no-fund
```

The lockfile digest and resolved direct dependency versions are protected by the reproducible-build baseline.

The package manifest may continue to express its public dependency intent, but executable CI and production resolution is controlled by the reviewed lockfile.

## 4. Runtime reproducibility

The release-hardening workflows use:

```text
Node 22.22.0
```

The same exact Node version is used by:

- general CI;
- reproducible-build audit;
- production deployment.

A future Node change requires a reviewed lock/build compatibility change and baseline update.

## 5. Build timestamp contract

Build generators use:

```text
scripts/lib/build-timestamp.mjs
```

Timestamp precedence is:

```text
1. SOG_BUILD_TIMESTAMP
2. SOURCE_DATE_EPOCH
3. current time fallback
```

The current-time fallback is permitted for local exploratory builds. Reproducibility audit and production deployment must supply deterministic context.

The shared helper is used by:

- build provenance generation;
- deployment taxonomy migration generation.

Registry stats already derives deterministic time from `SOURCE_DATE_EPOCH` or the historical baseline capture date.

## 6. Production build context

Production deployment derives build context from the deployed commit itself.

Required production values:

```text
SOG_BUILD_COMMIT = deployed commit SHA
SOG_BUILD_BRANCH = main
SOG_BUILD_TIMESTAMP = deployed commit timestamp
SOURCE_DATE_EPOCH = deployed commit epoch
```

This means the same source commit can be rebuilt with the same public build metadata context.

## 7. Generated-output roles

Generated files are not all the same kind of artifact.

### 7.1 Sentinel template

```text
data/generated/build-provenance.json
```

Role:

- checked-in explicit source sentinel;
- replaced during build with real build provenance;
- included in reproducible output hashing after generation.

### 7.2 Protected historical baseline input

```text
data/generated/registry-stats.json
```

Role:

- historical quality-baseline input referenced by the Registry v3 quality baseline;
- must not be overwritten as a side effect of normal site build;
- excluded from current output hashing because it is protected source input, not current runtime output.

Before PR #317, provenance generation computed current stats and wrote them into this historical tracked file before continuing. PR #317 removes that side effect. Current stats remain available in memory for provenance count calculation without mutating the historical baseline artifact.

### 7.3 Ephemeral build diagnostic

```text
data/generated/deployment-taxonomy-migration.json
```

Role:

- generated during build;
- not required as checked-in source state;
- included in reproducibility hashing and diagnostic artifacts.

## 8. Hashed output roots

The two-pass audit hashes exact bytes for:

```text
dist/**
data/generated/build-provenance.json
data/generated/deployment-taxonomy-migration.json
```

For each file it records:

```text
relative path
byte length
sha256
```

It then creates a sorted tree digest over path and file digest pairs.

The second build must match:

- tree digest;
- file count;
- total byte count;
- every file byte length;
- every file SHA-256.

## 9. Protected source mutation boundary

The reproducible-build workflow verifies that the following files remain byte-identical through both builds:

```text
data/generated/registry-stats.json
docs/migration/registry-v2-baseline.json
docs/migration/registry-v3-foundation.json
docs/migration/registry-v3-income-profiles.json
```

Temporary in-memory or try/finally compatibility composition may remain, but build completion must restore protected source files exactly.

## 10. Two-pass audit workflow

Binding workflow:

```text
.github/workflows/reproducible-build.yml
```

Sequence:

```text
checkout
-> setup pinned Node
-> npm ci
-> validate release integrity
-> build 1 with fixed context
-> capture output hashes
-> verify protected inputs unchanged
-> remove ephemeral build output
-> build 2 with identical context
-> capture output hashes
-> compare all audited outputs
-> verify protected inputs unchanged
-> upload audit artifacts
```

## 11. Source-level contract validation

PR #317 adds:

```text
npm run validate:reproducible-build
```

The validator checks:

- lockfile existence and SHA-256;
- lockfile version;
- resolved direct dependency versions;
- pinned Node version in CI, reproducibility audit, and production workflow;
- `npm ci` use in those workflows;
- deterministic production source context;
- reproducibility workflow fixed context;
- shared timestamp helper use by required generators;
- absence of historical stats writeback in provenance generation;
- output roots and protected input lists;
- presence of capture/compare scripts and workflow.

## 12. Relationship to PR #316

PR #316 answers:

```text
Are source counts, machine-readable count surfaces, routes, and provenance semantics internally consistent?
```

PR #317 answers:

```text
Given the same reviewed dependency graph and build context, do the generators and site build produce the same audited bytes without mutating protected source baselines?
```

Both layers are required before the audited 100-record canonical checkpoint in PR #318.

## 13. Explicit non-goals

PR #317 does not:

- add canonical stable assets;
- change canonical data semantics;
- expand monitoring sources;
- accept monitoring baselines;
- schedule monitoring;
- implement `/stats/`;
- create canonical Market Access Records;
- edit guide content;
- redesign the UI;
- guarantee identical bytes across different operating systems or CPU architectures;
- replace production provenance verification.

The current reproducibility contract is scoped to the pinned GitHub Actions Linux runtime, pinned Node runtime, reviewed lockfile, and fixed build context.

## 14. Completion condition

PR #317 is complete when:

```text
package-lock.json is reviewed and committed
CI uses npm ci
production deployment uses npm ci
Node runtime is pinned
build timestamp helper is shared by build-time timestamped generators
historical registry stats are not mutated by normal build
reproducibility baseline exists
source-level reproducibility validator exists
fixed-context two-pass audit workflow exists
both builds produce identical audited bytes
protected historical inputs remain unchanged
roadmap and workstream markers show PR #317 active / PR #318 next
full CI and reproducibility workflow are green
```
