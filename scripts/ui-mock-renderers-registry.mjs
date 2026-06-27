import { chip, colors, footer, header, heading, line, panelTitle, rect, svgDocument, text } from './ui-mock-svg-lib.mjs';

export function renderStablecoinIndexDesktop(width, height, required) {
  const rows = [
    ['USDT', 'Tether USDt', 'Active', 'Issuance active', 'USD reference', 'Fiat-backed', 'Tether + 2 roles', '36 sources'],
    ['USDC', 'USD Coin', 'Active', 'Issuance active', 'USD reference', 'Fiat-backed', 'Circle', '28 sources'],
    ['DAI', 'Dai', 'Active', 'Issuance active', 'USD reference', 'Crypto-backed', 'Sky ecosystem + roles', '31 sources'],
    ['UST', 'TerraUSD', 'Collapsed', 'Issuance ended', 'USD reference', 'Algorithmic', 'Terraform Labs', '22 sources']
  ];
  let body = header(width, false, 'Stablecoins');
  body += heading(52, 132, 'Registry', 'Stablecoins', 'Browse lifecycle, mechanisms, organizations, evidence, and unknowns.');
  body += rect(52, 230, width - 104, 104, colors.surface, colors.line, 10);
  body += text(72, 255, 'Search', 11, colors.text_muted, 700);
  body += rect(72, 266, 330, 44, colors.background_subtle, colors.line, 8);
  body += text(88, 294, 'Search name, symbol, alias, organization…', 13, colors.text_muted);
  body += chip(430, 270, 'Lifecycle: Active', 'positive', 170);
  body += chip(620, 270, 'Backing: Fiat-backed', 'link', 170);
  body += chip(810, 270, 'Unknowns: Any', 'unknown', 170);
  body += rect(width - 250, 266, 178, 44, colors.surface_raised, colors.focus, 8);
  body += text(width - 161, 294, 'Compare 2 selected', 12, colors.focus, 700, 'middle');
  body += text(52, 372, '4 of 92 records', 13, colors.positive, 700);
  body += text(width - 52, 372, 'Sort: Name A–Z', 12, colors.text_muted, 400, 'end');
  const x = 52, y = 394, w = width - 104, rowHeight = 106;
  body += rect(x, y, w, 48 + rows.length * rowHeight, colors.surface, colors.line, 10);
  const headers = [['Compare', 72], ['Asset', 142], ['Current state', 380], ['Reference / model', 650], ['Organizations', 930], ['Evidence', 1210]];
  headers.forEach(([label, hx]) => { body += text(hx, y + 30, label, 10, colors.text_muted, 700); });
  rows.forEach((row, index) => {
    const rowY = y + 48 + index * rowHeight;
    if (index > 0) body += line(x, rowY, x + w, rowY);
    body += rect(72, rowY + 34, 18, 18, colors.background_subtle, index < 2 ? colors.focus : colors.line, 4);
    body += text(112, rowY + 36, row[0], 18, colors.text, 800);
    body += text(112, rowY + 62, row[1], 12, colors.text_muted);
    body += chip(380, rowY + 20, row[2], row[2] === 'Collapsed' ? 'critical' : 'positive', 100);
    body += text(380, rowY + 70, row[3], 11, colors.text_muted);
    body += text(650, rowY + 34, row[4], 13, colors.text);
    body += text(650, rowY + 60, row[5], 11, colors.text_muted);
    body += text(930, rowY + 34, row[6], 13, colors.text);
    body += text(930, rowY + 60, index === 0 ? 'Multiple current and historical roles' : 'Relationship summary', 11, colors.text_muted);
    body += text(1210, rowY + 34, row[7], 13, colors.link, 600);
    body += text(1210, rowY + 60, index === 3 ? '3 known unknowns' : '1 known unknown', 11, colors.unknown);
  });
  body += footer(width, height);
  return svgDocument(width, height, 'Stablecoin index desktop mock', required, body);
}

export function renderOrganizationDetail(width, height, required) {
  let body = header(width, false, 'Organizations');
  body += heading(48, 126, 'Organization record', 'Tether Holdings', 'Representative organization with multiple legal and functional relationships');
  body += chip(48, 210, 'Legal entity', 'link', 100);
  body += chip(158, 210, 'Multi-jurisdiction', 'neutral', 130);
  body += chip(298, 210, '4 relationships', 'positive', 112);
  body += rect(48, 270, 360, 210, colors.surface, colors.line, 10);
  body += panelTitle(70, 302, 'Organization overview', 'Category, legal form, jurisdiction, confidence');
  const overview = [['Category', 'Issuer / operator'], ['Jurisdiction', 'Multiple scopes'], ['Regulatory character', 'Recorded by context'], ['Evidence', '24 source identities']];
  overview.forEach((row, index) => {
    body += text(70, 350 + index * 30, row[0], 11, colors.text_muted);
    body += text(205, 350 + index * 30, row[1], 12, colors.text, 600);
  });
  body += rect(430, 270, 802, 210, colors.surface, colors.line, 10);
  body += panelTitle(452, 302, 'Roles and connected assets', 'All material roles remain visible');
  const assets = [['USDT', 'Legal issuer · active', 'Primary display'], ['EURT', 'Legal issuer · limited', 'Additional'], ['XAUT', 'Brand and operating relationship', 'Additional']];
  assets.forEach((row, index) => {
    const ay = 350 + index * 42;
    body += text(452, ay, row[0], 14, colors.link, 700);
    body += text(560, ay, row[1], 12, colors.text);
    body += chip(1000, ay - 20, row[2], index === 0 ? 'positive' : 'neutral', 110);
  });
  const lower = [
    ['Relationship history', 'Current and historical dates, roles, and states'],
    ['Connected events', 'Regulatory, reserve, control, and lifecycle events'],
    ['Evidence', 'Source identities, relations, provenance, and claims']
  ];
  lower.forEach((row, index) => {
    const px = 48 + index * 400;
    body += rect(px, 510, 380, 300, colors.surface, colors.line, 10);
    body += panelTitle(px + 22, 544, row[0], row[1]);
    body += text(px + 22, 610, '• Canonical records', 12, colors.text);
    body += text(px + 22, 644, '• Value states remain explicit', 12, colors.text_muted);
    body += text(px + 22, 678, '• Open record →', 12, colors.link, 650);
  });
  body += footer(width, height);
  return svgDocument(width, height, 'Organization detail mock', required, body);
}

export function renderEventDetail(width, height, required) {
  let body = header(width, false, 'Events');
  body += heading(48, 126, 'Event record', 'TerraUSD collapse', 'Representative historical event · May 2022');
  body += chip(48, 210, 'Collapse', 'critical', 92);
  body += chip(150, 210, 'Lifecycle effect', 'warning', 118);
  body += chip(278, 210, 'No recovery', 'critical', 100);
  body += rect(48, 268, 530, 230, colors.surface, colors.line, 10);
  body += panelTitle(70, 300, 'Event identity and taxonomy', 'Category and subtype remain distinct');
  const taxonomy = [['Event date', '2022-05-09'], ['Public category', 'Collapse'], ['Canonical subtype', 'Algorithmic failure'], ['Status effect', 'Lifecycle changed'], ['Recovery', 'Not recovered']];
  taxonomy.forEach((row, index) => {
    body += text(70, 348 + index * 30, row[0], 11, colors.text_muted);
    body += text(228, 348 + index * 30, row[1], 12, colors.text, 600);
  });
  body += rect(600, 268, 632, 230, colors.surface, colors.line, 10);
  body += panelTitle(622, 300, 'Affected records', 'Stablecoin and organization links');
  body += text(622, 352, 'TerraUSD (UST)', 15, colors.link, 700);
  body += text(622, 382, 'Terraform Labs', 13, colors.link, 600);
  body += text(622, 426, 'Status changed from Active to Collapsed', 12, colors.critical);
  body += text(622, 460, 'Effective date and recorded date shown separately', 11, colors.text_muted);
  body += rect(48, 526, 580, 280, colors.surface, colors.line, 10);
  body += panelTitle(70, 558, 'Typed details', 'Mechanism, sequence, impact, and recovery context');
  ['Loss of reference stability', 'Redemption mechanism failed', 'Network and ecosystem effects', 'Recovery state recorded explicitly'].forEach((item, index) => {
    body += text(72, 612 + index * 38, `• ${item}`, 12, index === 3 ? colors.text_muted : colors.text);
  });
  body += rect(650, 526, 582, 280, '#10252D', colors.link, 10);
  body += panelTitle(672, 558, 'Evidence', '22 source identities · 29 relations');
  const sources = [['Research paper', 'Primary analysis · archived'], ['Official postmortem', 'Official · primary'], ['Regulatory filing', 'Regulatory · high reliability']];
  sources.forEach((row, index) => {
    const sy = 616 + index * 54;
    body += text(672, sy, row[0], 13, colors.text, 650);
    body += text(866, sy, row[1], 11, colors.text_muted);
  });
  body += footer(width, height);
  return svgDocument(width, height, 'Event detail mock', required, body);
}
