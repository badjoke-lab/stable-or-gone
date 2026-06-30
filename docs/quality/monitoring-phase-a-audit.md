# Stable or Gone monitoring Phase A audit

Status: canonical supporting audit  
Updated: 2026-06-29  
Roadmap item: PR #239

## Result

Phase A is complete for the current four-source, review-only monitoring scope.

```text
Source count: 4
Workflow trigger: manual only
Workflow repository permission: contents: read
Accepted baselines: 0
Pending baselines: 4
Normalization version: sog_official_source_normalization_v2
Automatic canonical writes: prohibited
Automatic baseline writes: prohibited
Automatic commits: prohibited
Automatic pull requests: prohibited
Public monitoring output: prohibited
Production publication: prohibited
```

This result does not mean monitoring findings are canonical facts. It means the repository can create private, reviewable observations and proposals without granting the monitoring path publication authority.

## Audited implementation sequence

```text
PR #230 monitoring skeleton and canonical guard
PR #231 official-source observations and private candidates
PR #232 review reports, evidence drafts, and draft PR material
PR #234 human-reviewed baseline contract
PR #235 baseline-aware change detection
PR #236 review-driven baseline update proposals
PR #237 metadata/content/failure classification
PR #238 versioned normalization and noise suppression
PR #239 end-to-end audit and safety closure
```

PR #233 is the roadmap authorization for this sequence.

## End-to-end boundary

```text
manual workflow dispatch
-> allowlisted official HTTPS fetch
-> exact-byte digest
-> versioned normalized-content digest
-> accepted-baseline comparison
-> operational classification
-> private candidate when allowed
-> private review/evidence/PR draft material
-> optional local baseline proposal after complete human decisions
-> separate human-reviewed repository PR
```

The automated path stops before the final arrow. It cannot apply a proposal, update canonical data, open a pull request, publish a file, or deploy the site.

## Classification audit

| Input condition | Classification | Candidate | Canonical action |
|---|---|---:|---|
| No accepted baseline | `new_source` | Only with configured visible signal | none |
| Normalized content and metadata match | `unchanged` | 0 | none |
| Normalized content matches; tracked metadata differs | `metadata_changed` | 0 | none |
| Normalized content differs; configured signal matches | `content_changed` | Private review candidate | none |
| Normalized content differs; no configured signal | `content_changed` | 0 | none |
| Fetch, redirect, size, or HTTP failure | `fetch_failed` | 0 | none |

All counts are written only to private run artifacts. The five classification counts must sum to the observation count.

## Normalization audit

Active version:

```text
sog_official_source_normalization_v2
```

Reviewed noise suppression covers HTML comments, script/style/template/svg contents, markup, whitespace, approved entity representation, zero-width formatting characters, Unicode composition, and JSON object-key order.

Fixtures prove that these remain material:

```text
dates and reporting periods
quantities and currency amounts
percentages and ratios
reserve and collateral composition
redemption, minting, eligibility, and fee language
issuer, custodian, auditor, and regulator identity
contract and account addresses
migration, suspension, shutdown, and lifecycle language
JSON values and array order
```

No source-specific exception exists. Future exceptions require a normalization version change and reviewed baseline migration.

## Baseline audit

Every enabled source has exactly one baseline record. Current state:

```text
tether-transparency: pending_initial_acceptance
circle-transparency: pending_initial_acceptance
paxos-pyusd-transparency: pending_initial_acceptance
ethena-custodian-attestations: pending_initial_acceptance
```

No live digest has been invented or silently accepted.

A baseline proposal requires:

```text
official-sources monitoring manifest
passing canonical guard
matching baseline set
one observation per enabled source
one accept / hold / reject decision per source
human reviewer identity
exact review timestamp
PR review reference
non-empty rationale
```

The proposal writes three ignored private files. It does not write the repository baseline and does not apply itself.

## Artifact audit

`health-only` writes exactly:

```text
manifest.json
health.json
summary.md
```

`official-sources` without review material writes exactly:

```text
manifest.json
health.json
official-source-observations.json
monitoring-candidates.json
summary.md
```

`official-sources` with review material writes exactly:

```text
manifest.json
health.json
official-source-observations.json
monitoring-candidates.json
review-material.json
evidence-drafts.json
review-report.md
pr-material.md
summary.md
```

A baseline proposal writes exactly:

```text
proposed-official-source-baselines.json
baseline-update-manifest.json
baseline-update-report.md
```

Monitoring and proposal directories are ignored by Git. Raw response bodies and normalized page text are prohibited.

## Permission and trigger audit

The monitoring workflow contains only:

```text
workflow_dispatch
permissions:
  contents: read
```

It contains no schedule, push, pull-request, workflow-run, repository write, pull-request write, Cloudflare credential, Wrangler command, or production command.

The baseline proposal command is not called by the workflow. It is a separate local review operation.

## Canonical and public isolation audit

The canonical guard snapshots the complete protected canonical path set before and after every monitoring run. A run fails if any protected path changes.

Monitoring artifacts and baseline proposals are excluded from:

```text
canonical data groups
public pages
public JSON
version.json
data/manifest.json
llms.txt
ai.txt
sitemap output
registry counts
build provenance
production deployment inputs
```

Phase A validation runs during the normal repository build. Publication remains a separate manual process governed by `docs/deployment-policy.md`.

## Residual limitations

Phase A does not claim:

- that four sources provide meaningful coverage of all 92 stable assets;
- that a content digest difference identifies the exact changed sentence;
- that an official page statement is independently true;
- that a source outage is a stablecoin failure;
- that a candidate should become canonical evidence or an event;
- that the current UI passed Gate V2-F;
- that the repository is approved for production publication.

Source coverage is the separate Phase B workstream beginning with PR #240.

## Closure decision

Phase A is closed only for the bounded review-only architecture above. The safety invariants become permanent CI requirements and remain active during Phase B and later growth work.

```text
Phase A: complete
Next: PR #240 monitoring feasibility audit for all 92 assets
Gate V2-F: not passed
Production publication: automatic on main for ordinary merged changes
```

## Deployment classification

```text
No production deployment required
```