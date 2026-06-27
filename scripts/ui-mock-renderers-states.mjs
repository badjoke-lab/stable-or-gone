import { chip, colors, footer, header, heading, line, panelTitle, rect, svgDocument, text } from './ui-mock-svg-lib.mjs';

export function renderEvidenceExpandedState(width, height, required) {
  let body = header(width, false, 'Stablecoins');
  body += heading(48, 126, 'Evidence', 'One source identity, multiple supported claims', 'Expanded source card with source-level metadata and relation-level claim scopes');
  body += rect(48, 238, width - 96, 610, '#10252D', colors.link, 12);
  body += text(76, 278, 'SOURCE IDENTITY', 11, colors.link, 800);
  body += text(76, 318, 'Tether reserves report — Q1 2026', 24, colors.text, 750);
  body += text(76, 348, 'Publisher: Tether Holdings', 13, colors.text_muted);
  const metadata = [
    ['Source category', 'Reserve disclosure'],
    ['Provenance', 'Official issuer publication'],
    ['Primary state', 'Primary for reserve disclosure'],
    ['Publication date', '2026-04-30'],
    ['Archive', 'Archived copy available'],
    ['Reliability', 'High — reviewed source identity'],
    ['Relation count', '4 evidence relations']
  ];
  metadata.forEach((row, index) => {
    const x = index < 4 ? 76 : 650;
    const y = index < 4 ? 410 + index * 48 : 410 + (index - 4) * 48;
    body += text(x, y, row[0], 11, colors.text_muted);
    body += text(x + 180, y, row[1], 12, colors.text, 600);
  });
  body += line(76, 620, width - 76, 620, colors.line);
  body += text(76, 658, 'Supported claim scopes', 16, colors.text, 700);
  ['reserve composition', 'report date', 'publisher identity', 'attestation history'].forEach((label, index) => {
    body += chip(76 + index * 210, 680, label, 'link', 190);
  });
  body += text(76, 750, 'Connected records', 13, colors.text_muted, 700);
  body += text(76, 784, 'USDT · Reserve profile · Q1 2026 reserve report · Regulatory context', 13, colors.link, 600);
  body += footer(width, height);
  return svgDocument(width, height, 'Expanded evidence state mock', required, body);
}

export function renderKnownUnknownWarningState(width, height, required) {
  let body = header(width, false, 'Stablecoins');
  body += heading(48, 126, 'Known unknown', 'Deployment contract identity is not publicly verified', 'Investigated uncertainty is explicit and linked to the affected dossier section.');
  body += rect(48, 244, width - 96, 490, '#211C2D', colors.unknown, 12);
  body += chip(76, 274, '? Known unknown', 'unknown', 140);
  body += chip(230, 274, 'Priority: High', 'warning', 116);
  body += chip(360, 274, 'Value state: Unverified', 'unknown', 164);
  body += text(76, 344, 'Topic', 11, colors.text_muted, 700);
  body += text(240, 344, 'Ethereum deployment contract identity', 14, colors.text, 650);
  body += text(76, 400, 'What remains unclear', 11, colors.text_muted, 700);
  body += text(240, 400, 'The official public record does not establish whether the recorded address', 13, colors.text);
  body += text(240, 425, 'is the current canonical deployment or a legacy contract.', 13, colors.text);
  body += text(76, 488, 'Last checked', 11, colors.text_muted, 700);
  body += text(240, 488, '2026-06-25', 13, colors.text, 650);
  body += text(76, 536, 'Related section', 11, colors.text_muted, 700);
  body += text(240, 536, 'Deployments and legal context →', 13, colors.link, 650);
  body += text(76, 584, 'Evidence reviewed', 11, colors.text_muted, 700);
  body += text(240, 584, 'Official documentation · explorer record · archived deployment note', 13, colors.text);
  body += rect(76, 640, 190, 48, colors.surface_emphasis, colors.focus, 8);
  body += text(171, 670, 'Submit a correction', 12, colors.focus, 700, 'middle');
  body += text(292, 670, 'Unknown is not treated as false, zero, or worst.', 12, colors.text_muted);
  body += footer(width, height);
  return svgDocument(width, height, 'Known unknown warning state mock', required, body);
}
