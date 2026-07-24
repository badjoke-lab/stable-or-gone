# UI v3 exhaustive remediation

Status: in progress

The CYA-dark rollout was merged before the exhaustive desktop/mobile screenshot workflow was inspected. PR #458 also removed that workflow and retained six pre-v2 compatibility stylesheets in the global BrandLockup import chain.

Required closure conditions:

- restore exhaustive desktop and mobile capture on every UI change;
- inspect the complete screenshot artifacts rather than relying on route counts;
- remove active pre-v2 stylesheet imports from the production shell;
- audit computed font families and legacy visual markers for every public route;
- correct every affected page family;
- pass CI and exhaustive capture on the final remediation head;
- do not mark UI completion from automated success alone.
