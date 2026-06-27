import { chip, colors, mobileShell, rect, svgDocument, text } from './ui-mock-svg-lib.mjs';

export function renderStablecoinIndexMobile(width, height, required) {
  let content = rect(16, 170, width - 32, 48, colors.background_subtle, colors.line, 8);
  content += text(32, 200, 'Search name, symbol, alias…', 12, colors.text_muted);
  content += rect(16, 232, 170, 44, colors.surface_raised, colors.line, 8);
  content += text(101, 260, 'Filters · 2 active', 12, colors.text, 650, 'middle');
  content += rect(204, 232, 170, 44, colors.surface, colors.line, 8);
  content += text(289, 260, 'Sort · Name A–Z', 12, colors.text_muted, 600, 'middle');
  content += text(18, 306, '4 of 92 records', 12, colors.positive, 700);
  content += chip(236, 288, 'Compare 2', 'link', 116);
  const cards = [
    ['USDT', 'Tether USDt', 'Active', 'USD · Fiat-backed', 'Tether + 2 roles', '36 sources · 1 unknown'],
    ['USDC', 'USD Coin', 'Active', 'USD · Fiat-backed', 'Circle', '28 sources · 1 unknown'],
    ['DAI', 'Dai', 'Active', 'USD · Crypto-backed', 'Sky ecosystem + roles', '31 sources · 2 unknowns']
  ];
  cards.forEach((row, index) => {
    const y = 328 + index * 148;
    content += rect(16, y, width - 32, 132, colors.surface, index === 0 ? colors.focus : colors.line, 10);
    content += text(32, y + 30, row[0], 18, colors.text, 800);
    content += text(102, y + 30, row[1], 12, colors.text_muted);
    content += chip(278, y + 14, row[2], 'positive', 78);
    content += text(32, y + 62, row[3], 12, colors.text);
    content += text(32, y + 86, row[4], 11, colors.text_muted);
    content += text(32, y + 110, row[5], 11, colors.unknown);
  });
  return svgDocument(width, height, 'Stablecoin index mobile mock', required, mobileShell(width, height, 'Stablecoins', 'Material fields remain visible in compact record cards.', content));
}

export function renderStablecoinDetailMobile(width, height, required) {
  let content = chip(20, 164, 'Active', 'positive', 82);
  content += chip(112, 164, 'Issuance active', 'positive', 126);
  content += chip(248, 164, '1 unknown', 'unknown', 110);
  content += text(20, 220, 'Tether USDt', 24, colors.text, 750);
  content += text(20, 246, 'USDT · USD reference · Fiat-backed', 12, colors.text_muted);
  content += rect(16, 270, width - 32, 58, colors.surface, colors.line, 10);
  ['Overview', 'Orgs', 'Works', 'More'].forEach((item, index) => {
    content += chip(26 + index * 88, 284, item, index === 0 ? 'link' : 'neutral', 78);
  });
  const cards = [
    ['Current state', 'Lifecycle Active · Issuance Active', colors.positive],
    ['Organizations and control', '4 relationships · primary + additional roles', colors.link],
    ['How it works', 'Reserve, redemption, and stabilization stay separate', colors.text],
    ['Evidence', '36 source identities · claim scopes visible', colors.link],
    ['Known unknown', 'Deployment verification remains unresolved', colors.unknown]
  ];
  cards.forEach((row, index) => {
    const y = 346 + index * 112;
    content += rect(16, y, width - 32, 94, index === 4 ? '#201C2B' : colors.surface, row[2], 10);
    content += text(32, y + 31, row[0], 15, colors.text, 700);
    content += text(32, y + 59, row[1], 11, colors.text_muted);
    content += text(width - 34, y + 59, 'Open →', 11, colors.link, 600, 'end');
  });
  return svgDocument(width, height, 'Stablecoin detail mobile mock', required, mobileShell(width, height, 'USDT dossier', 'Eight mandatory sections remain directly addressable.', content));
}

export function renderOpenFilterState(width, height, required) {
  let content = rect(10, 150, width - 20, 642, colors.surface, colors.line, 14);
  content += text(28, 188, 'Filter stablecoins', 20, colors.text, 750);
  content += text(width - 30, 188, 'Close ×', 12, colors.link, 600, 'end');
  content += text(28, 224, 'Selected filters', 11, colors.text_muted, 700);
  content += chip(28, 240, 'Active', 'positive', 86);
  content += chip(124, 240, 'Fiat-backed', 'link', 108);
  const sections = [
    ['Lifecycle', ['Active', 'Limited', 'Collapsed']],
    ['Backing', ['Fiat-backed', 'Crypto-backed', 'Algorithmic']],
    ['Reference', ['USD', 'EUR', 'Other']]
  ];
  sections.forEach((section, index) => {
    const y = 304 + index * 132;
    content += text(28, y, section[0], 13, colors.text, 700);
    section[1].forEach((item, itemIndex) => {
      const cy = y + 32 + itemIndex * 30;
      content += rect(30, cy - 16, 18, 18, colors.background_subtle, itemIndex === 0 ? colors.focus : colors.line, 4);
      content += text(60, cy, item, 12, colors.text_muted);
    });
  });
  content += text(28, 704, '42 matching records', 12, colors.positive, 700);
  content += rect(28, 726, 142, 44, 'transparent', colors.line, 8);
  content += text(99, 754, 'Clear all', 12, colors.link, 650, 'middle');
  content += rect(186, 726, 176, 44, colors.surface_emphasis, colors.focus, 8);
  content += text(274, 754, 'Apply filters', 12, colors.focus, 700, 'middle');
  return svgDocument(width, height, 'Open filter state mobile mock', required, mobileShell(width, height, 'Stablecoins', 'Filters preserve multi-value state in a shareable URL.', content));
}
