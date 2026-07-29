#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const runtimePath = 'src/components/SemanticToneRuntime.astro';
const outputPath = process.env.CONTRAST_AUDIT_OUTPUT ?? 'artifacts/sitewide-text-contrast-audit.json';
const css = fs.readFileSync(cssPath, 'utf8');
const runtime = fs.readFileSync(runtimePath, 'utf8');

const parseHex = (hex) => {
  const value = hex.replace('#', '');
  const expanded = value.length === 3 ? value.split('').map((character) => character.repeat(2)).join('') : value;
  return [0, 2, 4].map((offset) => Number.parseInt(expanded.slice(offset, offset + 2), 16));
};

const channel = (value) => {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const [red, green, blue] = parseHex(hex).map(channel);
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
};

const contrast = (foreground, background) => {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

const readCssToken = (name) => {
  const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Missing ${name}`);
  return match[1].toLowerCase();
};

const readEffectiveToken = (name) => {
  const runtimeMatch = runtime.match(new RegExp(`setProperty\\(['\"]${name}['\"],\\s*['\"](#[0-9a-fA-F]{6})['\"]\\)`));
  return runtimeMatch ? runtimeMatch[1].toLowerCase() : readCssToken(name);
};

const tokens = {
  background: readEffectiveToken('--ui-bg'),
  background_soft: readEffectiveToken('--ui-bg-soft'),
  text: readEffectiveToken('--ui-text'),
  copy: readEffectiveToken('--ui-copy'),
  muted: readEffectiveToken('--ui-muted'),
  quiet: readEffectiveToken('--ui-quiet'),
  link: readEffectiveToken('--ui-link'),
  hover: readEffectiveToken('--ui-hover'),
  focus: readEffectiveToken('--ui-focus'),
  positive: readEffectiveToken('--ui-positive'),
  warning: readEffectiveToken('--ui-warning'),
  danger: readEffectiveToken('--ui-danger')
};

const thresholds = {
  body: 4.5,
  muted: 4.5,
  quiet: 4.5,
  link: 4.5,
  semantic: 4.5
};

const checks = [
  ['copy_on_background', tokens.copy, tokens.background, thresholds.body],
  ['copy_on_background_soft', tokens.copy, tokens.background_soft, thresholds.body],
  ['muted_on_background', tokens.muted, tokens.background, thresholds.muted],
  ['muted_on_background_soft', tokens.muted, tokens.background_soft, thresholds.muted],
  ['quiet_on_background', tokens.quiet, tokens.background, thresholds.quiet],
  ['link_on_background', tokens.link, tokens.background, thresholds.link],
  ['hover_on_background', tokens.hover, tokens.background, thresholds.link],
  ['positive_on_background', tokens.positive, tokens.background, thresholds.semantic],
  ['warning_on_background', tokens.warning, tokens.background, thresholds.semantic],
  ['danger_on_background', tokens.danger, tokens.background, thresholds.semantic]
].map(([name, foreground, background, required]) => {
  const ratio = contrast(foreground, background);
  return {
    name,
    foreground,
    background,
    ratio: Number(ratio.toFixed(2)),
    required,
    pass: ratio >= required
  };
});

const failures = checks.filter((check) => !check.pass);
const output = {
  schema_version: '1.3',
  generated_at: new Date().toISOString(),
  standard: 'WCAG 2.x AA for normal text',
  css_path: cssPath,
  runtime_path: runtimePath,
  token_source: 'effective public tokens after SemanticToneRuntime',
  tokens,
  thresholds,
  checks,
  failure_count: failures.length,
  failures
};

fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
if (failures.length > 0) process.exit(1);
