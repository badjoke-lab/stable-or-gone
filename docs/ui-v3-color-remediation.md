# UI V3 color-system remediation

Status: in progress

The previous exhaustive review validated capture completeness, overflow, and pre-v2 font leakage, but did not validate color-role consistency across page families.

Closure requires:

- inspect every desktop and mobile route for computed text colors;
- remove legacy gold/yellow treatments from ordinary metadata and body copy;
- keep semantic colors limited to explicit status, warning, archive, and chart roles;
- use one neutral text hierarchy and one interactive accent across every page family;
- add an automated computed-color inventory with route and selector evidence;
- rerun all public routes on desktop and mobile;
- manually inspect final screenshot artifacts before merge.
