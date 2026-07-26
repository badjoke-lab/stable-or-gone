#!/usr/bin/env node
import fs from 'node:fs';

const auditPath = 'scripts/audit-public-typography-enums-direct.mjs';
const cssPath = 'src/styles/site-ui.css';
const updateArticlePath = 'src/pages/updates/visa-stablecoin-platform-open-usd/index.astro';

let audit = fs.readFileSync(auditPath, 'utf8');

const serifLine = "          const editorialSerifSelector = 'main h1, main h2, main [data-editorial-serif], main [data-editorial-number]';";
const monoLine = "          const explicitMonoSelector = '.bar, .kicker, .eyebrow, [class*=\"overline\"], [class*=\"-label\"], dt, th, .home-masthead__edition, .home-section-kicker, .home-material-list__meta, .home-guide-list__meta, .v3-masthead-meta, .record-kicker, .record-symbol, [data-ui-mono]';";
if (!audit.includes(monoLine)) {
  if (!audit.includes(serifLine)) throw new Error('editorial serif selector marker missing');
  audit = audit.replace(serifLine, `${serifLine}\n${monoLine}`);
}

const oldRoleBlock = `            const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
            const forbidden = families.find((family) => monospaceFamilies.has(family) || (!allowsSerif && serifFamilies.has(family)));
            if (forbidden) unexpectedFonts.push({ element: key, text: displayText(element).slice(0, 160), font_family: fontFamily, forbidden_family: forbidden, expected_role: allowsSerif ? 'editorial-serif' : 'ordinary-sans' });`;
const newRoleBlock = `            const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
            const allowsMono = element.matches(explicitMonoSelector) || Boolean(element.closest(explicitMonoSelector));
            const forbidden = families.find((family) => (!allowsMono && monospaceFamilies.has(family)) || (!allowsSerif && serifFamilies.has(family)));
            if (forbidden) unexpectedFonts.push({ element: key, text: displayText(element).slice(0, 160), font_family: fontFamily, forbidden_family: forbidden, expected_role: allowsSerif ? 'editorial-serif' : allowsMono ? 'label-mono' : 'ordinary-sans' });`;
if (audit.includes(oldRoleBlock)) audit = audit.replace(oldRoleBlock, newRoleBlock);
else if (!audit.includes('const allowsMono = element.matches(explicitMonoSelector)')) throw new Error('font role block marker missing');

const oldHoverBlock = `        const invalidLinkHover = [];
        for (const target of result.link_targets) {
          const locator = page.locator(\`[data-ui-audit-link="\${target.id}"]\`);
          await locator.hover({ timeout: 5000 });
          const hoverColor = await locator.evaluate((element) => getComputedStyle(element).color);
          const allowed = target.zone === 'main'
            ? [result.allowed_hover_colors.link]
            : [result.allowed_hover_colors.link, result.allowed_hover_colors.text];
          if (!allowed.includes(hoverColor)) invalidLinkHover.push({ ...target, hover_color: hoverColor, allowed });
        }`;
const newHoverBlock = `        const invalidLinkHover = [];
        if (!device.hasTouch) {
          for (const target of result.link_targets) {
            const locator = page.locator(\`[data-ui-audit-link="\${target.id}"]\`);
            await locator.hover({ timeout: 5000 });
            const hoverColor = await locator.evaluate((element) => getComputedStyle(element).color);
            const allowed = target.zone === 'main'
              ? [result.allowed_hover_colors.link]
              : [result.allowed_hover_colors.link, result.allowed_hover_colors.text];
            if (!allowed.includes(hoverColor)) invalidLinkHover.push({ ...target, hover_color: hoverColor, allowed });
          }
        }`;
if (audit.includes(oldHoverBlock)) audit = audit.replace(oldHoverBlock, newHoverBlock);
else if (!audit.includes('if (!device.hasTouch)')) throw new Error('hover audit block marker missing');

fs.writeFileSync(auditPath, audit);

let article = fs.readFileSync(updateArticlePath, 'utf8');
const withoutInlineStyle = article.replace(/\n\s*<style>[^]*?<\/style>\s*(?=\n<\/BaseLayout>)/, '');
if (withoutInlineStyle === article && /<style(?:\s|>)/i.test(article)) throw new Error('update article inline style could not be removed');
if (withoutInlineStyle !== article) fs.writeFileSync(updateArticlePath, withoutInlineStyle);

let css = fs.readFileSync(cssPath, 'utf8');
const interactionBlock = `
/* Final interaction enforcement: later component rules may not preserve legacy hover colors. */
main a:hover,
footer a:hover { color: var(--ui-link-hover); text-decoration-color: currentColor; }
main a:focus-visible,
footer a:focus-visible { color: var(--ui-link-hover); }
`;
const updateArticleBlock = `
/* Update analysis article */
.update-analysis { max-width: 960px; margin: 0 auto; padding: 1rem 0 4rem; color: var(--ui-copy); line-height: 1.8; overflow-wrap: anywhere; }
.update-analysis__masthead { margin-bottom: 1.75rem; padding: .8rem 0 2rem; border-top: 2px solid var(--ui-text); border-bottom: 1px solid var(--ui-line); }
.update-analysis__overline { min-height: 42px; display: flex; justify-content: space-between; gap: 1rem; align-items: center; color: var(--ui-muted); font: 700 .75rem/1.35 var(--ui-mono); letter-spacing: .055em; text-transform: uppercase; }
.update-analysis__overline a { font-family: var(--ui-sans); font-size: .8125rem; letter-spacing: 0; text-transform: none; }
.update-analysis h1 { max-width: 19ch; margin: 1.25rem 0; font-size: clamp(2.4rem, 5vw, 4.75rem); line-height: 1.06; }
.update-analysis__deck { max-width: 55rem; color: var(--ui-copy); font-family: var(--ui-serif); font-size: clamp(1.125rem, 2vw, 1.4rem); line-height: 1.7; }
.update-analysis__meta { margin: 1.5rem 0 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--ui-line); border-left: 1px solid var(--ui-line); }
.update-analysis__meta > div { min-height: 82px; padding: .8rem 1rem; display: grid; align-content: space-between; border-right: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line); }
.update-analysis__meta dd { margin: .25rem 0 0; color: var(--ui-text); font-size: .9375rem; font-variant-numeric: tabular-nums; }
.update-analysis > section { margin: 0; padding: 2.5rem 0; border-bottom: 1px solid var(--ui-line); }
.update-analysis > section > h2 { margin-bottom: 1.1rem; }
.update-analysis > section p,
.update-analysis > section li { font-size: 1.025rem; line-height: 1.8; }
.update-analysis > section ul,
.update-analysis > section ol { padding-left: 1.35rem; }
.update-analysis > section li + li { margin-top: .65rem; }
.update-analysis__notice,
.update-analysis__summary,
.update-analysis__callout { margin: 1.5rem 0; padding: 1.25rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); color: var(--ui-copy); }
.update-analysis__notice strong { display: block; margin-bottom: .45rem; }
.update-analysis__flow { margin: 1.5rem 0; padding: 1.25rem; display: grid; gap: .45rem; border-block: 1px solid var(--ui-line); text-align: center; }
.update-analysis__flow span { color: var(--ui-text); font-weight: 700; }
.update-analysis__flow b { color: var(--ui-muted); font-weight: 400; }
.update-analysis__comparison { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.update-analysis__comparison article { padding: 1.15rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.update-analysis__comparison h3 { margin-bottom: .55rem; }
.update-analysis table { margin: 1.25rem 0; }
.update-analysis__callout { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: center; }
.update-analysis__callout span { padding: .3rem .65rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius-pill); background: var(--ui-surface-strong); color: var(--ui-text); }
.update-analysis__notes,
.update-analysis__sources { border-top: 2px solid var(--ui-text); }
.update-analysis :target { scroll-margin-top: 8rem; background: color-mix(in srgb, var(--ui-link) 8%, transparent); }

@media (max-width: 700px) {
  .update-analysis__meta,
  .update-analysis__comparison { grid-template-columns: 1fr; }
  .update-analysis__overline { align-items: flex-start; flex-direction: column; }
  .update-analysis h1 { font-size: clamp(2.2rem, 11vw, 3.4rem); }
}
`;
const marker = '@media (prefers-reduced-motion: reduce) {';
if (!css.includes(marker)) throw new Error('reduced-motion insertion marker missing');
if (!css.includes('/* Update analysis article */')) css = css.replace(marker, `${updateArticleBlock}\n${marker}`);
if (!css.includes('/* Final interaction enforcement:')) css = css.replace(marker, `${interactionBlock}\n${marker}`);
fs.writeFileSync(cssPath, css);
