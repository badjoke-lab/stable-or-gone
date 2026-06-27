import { chip, colors, footer, header, heading, panelTitle, rect, svgDocument, text } from './ui-mock-svg-lib.mjs';

export function renderStablecoinDetailDesktop(width, height, required) {
  let body = header(width, false, 'Stablecoins');
  body += heading(52, 128, 'Stablecoin record', 'Tether USDt (USDT)', 'Representative complex dossier · reviewed public data, evidence, and unknowns');
  body += chip(52, 214, 'Active', 'positive', 86);
  body += chip(148, 214, 'Issuance active', 'positive', 128);
  body += chip(286, 214, 'USD reference', 'link', 118);
  body += chip(414, 214, '1 known unknown', 'unknown', 132);
  body += rect(52, 272, width - 104, 54, colors.surface, colors.line, 10);
  const localNav = ['Overview', 'Organizations', 'How it works', 'Deployments', 'History', 'Evidence', 'Unknowns', 'More'];
  body += localNav.map((item, index) => text(76 + index * 155, 305, item, 12, index === 0 ? colors.focus : colors.text_muted, index === 0 ? 700 : 500)).join('');
  body += rect(52, 348, 820, 236, colors.surface, colors.line, 10);
  body += panelTitle(74, 379, 'Identity and current state', 'Canonical identity and independent lifecycle / issuance axes');
  const identityRows = [['Symbol', 'USDT'], ['Lifecycle', 'Active'], ['Issuance', 'Active'], ['Reference', 'USD · known'], ['Backing model', 'Fiat-backed'], ['Last reviewed', '2026-06-25']];
  identityRows.forEach((row, index) => {
    const y = 426 + index * 25;
    body += text(74, y, row[0], 11, colors.text_muted);
    body += text(270, y, row[1], 12, colors.text, 600);
  });
  body += rect(894, 348, 494, 110, '#201C2B', colors.unknown, 10);
  body += panelTitle(916, 379, 'Known unknown', 'Verification state remains explicit');
  body += text(916, 423, 'One deployment contract identity is not publicly verified.', 12, colors.text);
  body += rect(894, 476, 494, 108, '#10252D', colors.link, 10);
  body += panelTitle(916, 507, 'Evidence summary', '36 public source identities · 41 relations');
  body += text(916, 552, 'Official, regulatory, reserve, and historical sources', 12, colors.text);
  const cards = [
    [52, 610, 420, 210, 'Organizations and control', 'Tether Holdings · Legal issuer', ['4 relationships', '2 current roles', 'Historical role dates preserved']],
    [492, 610, 420, 210, 'How the asset works', 'USD reference · Fiat-backed', ['Reserve components', 'Redemption access', 'Stabilization mechanism']],
    [932, 610, 456, 210, 'Deployments and legal context', 'Chain and verification axes stay separate', ['Ethereum · active', 'Tron · active', 'Contract identity and verification separate']],
    [52, 842, 646, 220, 'History', 'Events remain typed and chronological', ['Issuer-control events', 'Model and reserve changes', 'Status effects and recovery']],
    [720, 842, 668, 220, 'Evidence', 'Source identity is shown once', ['Publisher and provenance', 'Primary state and publication date', 'Archive, reliability, claim scopes']]
  ];
  cards.forEach(([x, y, w, h, title, meta, bullets]) => {
    body += rect(x, y, w, h, colors.surface, colors.line, 10);
    body += panelTitle(x + 22, y + 32, title, meta);
    bullets.forEach((bullet, index) => {
      body += text(x + 24, y + 88 + index * 34, `• ${bullet}`, 12, index === bullets.length - 1 ? colors.text_muted : colors.text);
    });
  });
  body += footer(width, height);
  return svgDocument(width, height, 'Stablecoin detail desktop mock', required, body);
}

export function renderHome(width, height, required) {
  let body = header(width, false, 'Registry');
  body += heading(52, 136, 'Historical registry', 'What is this stable asset — and what happened to it?', 'Explore stablecoins, connected organizations, historical events, public evidence, and known unknowns.');
  body += rect(52, 250, width - 104, 64, colors.background_subtle, colors.focus, 10);
  body += text(76, 289, 'Search stablecoin, symbol, organization, role, event, reference, or contract…', 14, colors.text_muted);
  const families = [
    ['Stablecoins', '92 records', 'Lifecycle, mechanisms, deployments, evidence'],
    ['Organizations', '86 records', 'Roles, legal context, connected assets'],
    ['Events', '150 records', 'Typed history, effects, recovery, sources']
  ];
  families.forEach((row, index) => {
    const x = 52 + index * 446;
    body += rect(x, 346, 420, 190, colors.surface, colors.line, 10);
    body += text(x + 24, 386, row[0], 20, colors.text, 750);
    body += text(x + 24, 420, row[1], 13, colors.positive, 700);
    body += text(x + 24, 462, row[2], 12, colors.text_muted);
    body += text(x + 24, 502, 'Open registry →', 12, colors.link, 650);
  });
  body += rect(52, 568, 838, 250, colors.surface, colors.line, 10);
  body += panelTitle(76, 604, 'Meaningful recent changes', 'What changed — not merely when a record was checked');
  const changes = [['Status change', 'One lifecycle transition documented'], ['Evidence added', 'Reserve disclosure source linked'], ['Known unknown resolved', 'Contract identity verified']];
  changes.forEach((row, index) => {
    const y = 660 + index * 48;
    body += chip(76, y - 22, row[0], index === 2 ? 'positive' : 'link', 146);
    body += text(246, y, row[1], 12, colors.text);
  });
  body += rect(914, 568, 474, 118, colors.surface, colors.line, 10);
  body += panelTitle(938, 602, 'Methodology', 'Public taxonomy, evidence, corrections');
  body += text(938, 652, 'Read how records are reviewed →', 12, colors.link, 650);
  body += rect(914, 704, 474, 114, colors.surface, colors.line, 10);
  body += panelTitle(938, 738, 'Data access', 'Version, manifest, LLM and AI entrypoints');
  body += text(938, 785, 'Open machine-readable data →', 12, colors.link, 650);
  body += text(52, 856, 'Support is secondary to registry access, methodology, and corrections.', 12, colors.text_muted);
  body += footer(width, height);
  return svgDocument(width, height, 'Home page mock', required, body);
}
