# Roadmap Publication State

Updated: 2026-06-30

This file records the current publication path while `docs/roadmap.md` tracks the execution sequence.

```text
Automatic production deployment: enabled
Preview branch deployments: not part of the production path
Publication path: main push -> GitHub Actions -> Wrangler upload -> production verification
Manual workflow dispatch: fallback only
Pages project: stable-or-gone
Public origin: https://sog.badjoke-lab.com/
```

Ordinary guide, copy, UI, workflow, validation, and reviewed data changes publish after merge through the automatic `main` workflow. Manual approval is reserved for DNS, secret, Cloudflare account, destructive schema migration, mass deletion, major route removal, or emergency rollback work.
