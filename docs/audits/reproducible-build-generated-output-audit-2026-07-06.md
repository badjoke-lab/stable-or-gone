# Reproducible build and generated-output audit

Status: supporting audit — PR #317  
Date: 2026-07-06  
Source checkpoint: `47c110b69ec7fd61121cbeee247f4ef12d466117`

## Scope

This audit reviews whether the reviewed 100-asset SOG source checkpoint can produce stable audited output under a fixed build context without silently mutating protected historical source inputs.

Reviewed surfaces:

```text
package dependency resolution
Node runtime selection
CI install path
production install path
build timestamp sources
production source context
build provenance generation
deployment taxonomy generation
tracked generated files
historical quality-baseline inputs
dist output inventory
byte-level two-pass output comparison
protected source mutation checks
```

## Finding 1 — dependency resolution was not locked

Before PR #317:

```text
package-lock.json: absent
CI install: npm install
production install: npm install --no-package-lock
package.json dependency ranges: latest
```

This allowed the same source commit to resolve a different dependency graph at a later execution date.

PR #317 adds a reviewed `package-lock.json` and changes the release-hardening CI and production install path to:

```text
npm ci --no-audit --no-fund
```

The reproducible-build baseline records the lockfile digest, lockfile version, Node version, and resolved direct dependency versions.

## Finding 2 — runtime selection was broader than the reproducibility contract

The release-hardening workflows previously selected Node 22 by major version.

PR #317 pins:

```text
Node 22.22.0
```

for:

```text
general CI
reproducible-build audit
production deployment
```

This does not claim cross-platform reproducibility. The current contract is scoped to the pinned GitHub Actions Linux runtime class, pinned Node runtime, reviewed lockfile, and fixed build context.

## Finding 3 — timestamped generators did not share one deterministic contract

The build provenance generator and deployment taxonomy generator both emit timestamps.

PR #317 adds:

```text
scripts/lib/build-timestamp.mjs
```

Timestamp precedence is:

```text
1. SOG_BUILD_TIMESTAMP
2. SOURCE_DATE_EPOCH
3. current-time fallback for local exploratory builds
```

Reproducibility audit and production deployment supply deterministic values and therefore do not use the current-time fallback.

## Finding 4 — production build timestamp depended on execution time

The production workflow now records source context directly from the deployed commit:

```text
source SHA = git rev-parse HEAD
build timestamp = commit timestamp
SOURCE_DATE_EPOCH = commit epoch
branch = main
```

These values are passed into the publishable build.

The intended result is that a later rebuild of the same source checkpoint can reproduce the same public build metadata context rather than embedding the later rebuild wall-clock time.

## Finding 5 — provenance generation mutated a protected historical stats input

Before PR #317, the provenance generator called the current stats builder and wrote the result into:

```text
data/generated/registry-stats.json
```

That same tracked file is referenced by the Registry v3 quality baseline as a historical generated baseline input.

This created a role collision:

```text
historical quality-baseline input
and
current build-time mutable output
```

PR #317 removes that writeback.

The provenance generator still computes current stats in memory and uses those values for canonical count validation and provenance output, but normal site build no longer overwrites the tracked historical stats baseline.

## Finding 6 — generated files needed explicit role separation

PR #317 records distinct generated-file roles.

### Sentinel template

```text
data/generated/build-provenance.json
```

The checked-in source file is an explicit sentinel template. Build replaces it with actual build provenance. The generated version is part of the reproducibility hash scope.

### Protected historical input

```text
data/generated/registry-stats.json
```

This tracked file is a historical quality-baseline input and must not be mutated by normal build.

### Ephemeral generated diagnostic

```text
data/generated/deployment-taxonomy-migration.json
```

This file is generated during build and included in the reproducibility hash scope.

## Finding 7 — no dedicated two-pass byte comparison existed

PR #317 adds:

```text
.github/workflows/reproducible-build.yml
scripts/capture-build-output-hashes.mjs
scripts/compare-build-output-hashes.mjs
```

The audit sequence is:

```text
locked install
-> source-level reproducibility contract validation
-> release-integrity validation
-> fixed-context build 1
-> file hash capture 1
-> protected historical input diff guard
-> remove ephemeral build output
-> fixed-context build 2
-> file hash capture 2
-> byte-level comparison
-> protected historical input diff guard
-> audit artifact upload
```

## Audited output roots

The current two-pass audit hashes exact bytes for:

```text
dist/**
data/generated/build-provenance.json
data/generated/deployment-taxonomy-migration.json
```

Each capture records:

```text
relative file path
byte length
SHA-256
```

It also records:

```text
file count
total byte count
tree SHA-256 over sorted path/hash pairs
```

The comparison fails on:

```text
tree digest mismatch
file count mismatch
total byte count mismatch
missing file in either build
per-file byte length mismatch
per-file SHA-256 mismatch
```

## Protected historical inputs

The reproducibility workflow verifies that these files remain unchanged through both builds:

```text
data/generated/registry-stats.json
docs/migration/registry-v2-baseline.json
docs/migration/registry-v3-foundation.json
docs/migration/registry-v3-income-profiles.json
```

## Source-level validation

PR #317 adds:

```text
npm run validate:reproducible-build
```

The source-level validator checks:

```text
reviewed lockfile digest
lockfile version
resolved direct dependency versions
shared timestamp helper support
required generator helper use
absence of historical stats writeback
required hash output roots
SHA-256 capture contract
tree digest capture contract
per-file comparison contract
```

The existing PR #316 release-integrity validator remains active. PR #317 preserves its explicit `SOG_BUILD_TIMESTAMP` contract while routing timestamp parsing through the shared helper.

## Data preservation

PR #317 does not change canonical record contents or counts.

Protected checkpoint remains:

```text
stable assets: 100
organizations: 94
relationships: 110
events: 172
evidence: 502
evidence relations: 502
reserve reports: 108
known unknowns: 289
regulatory notes: 9
deployments: 140
detail routes: 366
```

Additive Registry v3 checkpoint remains:

```text
legal profiles: 100
stable-asset relationships: 4
reserve components: 133
income profiles: 100
deployment view rows: 140
```

## Explicit non-goals

PR #317 does not:

- add or remove canonical stable assets;
- change lifecycle, reserve, redemption, or market-access semantics;
- change the public Registry v2-compatible machine-readable schema identity;
- expand monitoring sources;
- accept monitoring baselines;
- schedule monitoring;
- implement public statistics;
- create canonical Market Access Records;
- edit guide content;
- redesign the UI;
- claim byte identity across different operating systems or CPU architectures;
- replace production provenance and output-parity verification.

## Final acceptance gate

PR #317 is ready to merge only when the latest PR head satisfies:

```text
source-level reproducibility validator: pass
PR #316 release-integrity validator: pass
first fixed-context build: pass
first hash capture: pass
protected-input guard after build 1: pass
second fixed-context build: pass
second hash capture: pass
byte-level comparison: pass
protected-input guard after build 2: pass
general CI: pass
Registry v2/v3 parity suite: pass
all relevant independent audit workflows: pass
```

## Conclusion

The main reproducibility defects identified by PR #317 were dependency-resolution drift risk, runtime-version drift risk, wall-clock timestamp dependence, lack of a dedicated two-pass byte comparison, and a generated-file role collision in which normal provenance generation rewrote a tracked historical stats baseline input.

PR #317 separates these responsibilities and adds explicit source-state and two-pass build-time contracts. The final acceptance decision depends on the latest-head workflow results recorded before merge.
