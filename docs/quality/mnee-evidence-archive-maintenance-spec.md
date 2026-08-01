# MNEE Evidence and Archive Maintenance — Batch 1

Status: authorized after merge of the post-PR #498 review-gate amendment  
Updated: 2026-08-01

## Purpose

Deepen and maintain the existing MNEE canonical dossier without adding another asset or expanding the public product surface.

The work must resolve a known unknown only when reviewed primary evidence supports the resolution. A documented unresolved result is valid.

## Authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md
config/mnee-evidence-archive-maintenance.json
docs/quality/record-growth-batch-4-mnee-pr498-spec.md
data/editorial-research/record-growth-batch-4-mnee-pr498-source-review.json
```

## Canonical baseline

```text
Stable assets: 117
Organizations: 108
Relationships: 129
Events: 192
Evidence: 579
Evidence Relations: 579
Reserve reports: 125
Known unknowns: 342
Deployments: 184
Detail routes: 417
Metadata-checked detail routes: 417
```

The MNEE identities are fixed:

```text
Stablecoin: sog_st_mnee
Issuer: sog_issuer_mnee_limited
Launch event: sog_ev_mnee_launch_pr498
1Sat production token ID: ae59f3b898ec61acbdb6cc7a245fabeded0c094bf046f35206a3aec60ef88127_0
Ethereum contract: 0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf
```

No identity, symbol, lineage, or issuer substitution is authorized.

## Scope

Review exactly five existing unknown areas:

1. latest listed attestation report body and archive;
2. current reserve custodian and allocation;
3. first public Ethereum issuance date;
4. current deployment control configuration;
5. complete direct-access and jurisdiction inventory.

The work may add primary-source-backed canonical Evidence and Evidence relations, supplement one existing reserve-report context, update existing deployment verification fields, and resolve or reaffirm existing known unknowns.

## Source rules

Use primary official, regulatory, filing, package, repository, contract, or archive sources.

A current product page alone does not prove:

```text
historical first issuance
current reserve custody or allocation
independent runtime operation
contract control state
complete jurisdiction coverage
complete direct-access availability
```

Search results, third-party summaries, token directories, exchange listings, and generic chain explorers may be leads but are not sufficient canonical Evidence unless the repository's existing Evidence policy explicitly permits the exact source role.

Archive identity and current-source identity must remain distinct. Missing archives must be recorded as missing rather than inferred.

## Allowed canonical changes

```text
new canonical Evidence records: 0 to 8
new Evidence Relations: only for supported MNEE or MNEE issuer claims
reserve reports: at most 1 new record or one reviewed correction to the existing MNEE context
known unknowns: resolve, narrow, split, or reaffirm only the five authorized targets
deployments: no new deployment; existing verification or control fields may change only with direct support
legal profile: correction only when directly supported
income profile: correction only when directly supported
```

## Prohibited changes

The implementation must not:

- add a canonical stable asset;
- add an organization;
- add a lifecycle event;
- add a deployment;
- add or change a Market Access Record;
- work on Figure YLDS;
- promote another candidate;
- add a public route family;
- change navigation, ranking, scoring, recommendation, CSS, or material UI behavior;
- infer a known value from silence, marketing language, or a third-party directory;
- treat identifier recording as runtime or control verification;
- close an unknown merely because a source could not be found.

## Required research output

Create a bounded source-review artifact that records for every target:

```text
target identifier
reviewed claim
source identity
source type
source date or version
current or archived availability
supported / unsupported / partially supported disposition
canonical action
remaining unknown
review notes
```

The artifact remains editorial research and is not itself canonical Evidence.

## Required validation

The implementation PR must verify:

```text
all five targets have an explicit disposition
all new Evidence IDs are unique
all Evidence Relations resolve
archive fields follow Evidence policy
no unauthorized entity, event, deployment, or Market Access change
stable asset count remains 117
organization count remains 108
event count remains 192
deployment count remains 184
detail route count remains 417
metadata-checked detail routes remain 417
v2/v3 parity passes
release integrity passes
reproducible build passes
site build passes
production parity is verified after merge
```

Evidence and known-unknown counts may change within the authorized scope.

## Exit condition

The implementation exits only to:

```text
REVIEW GATE
```

No later work is automatically authorized.
