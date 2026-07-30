#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = process.env.TRUSTWALLET_ASSETS_DIR ?? '/tmp/trustwallet-assets';
const pinnedCommit = '34d808acb2a71e55c41505cd8f15c827db21b0fc';
// The importer is intentionally bounded to the address-verified audit result.
const logoDir = path.join(root, 'public/stablecoin-logos');

const batch = [
  ['agora-ausd', 'agora-ausd.png', 'blockchains/ethereum/assets/0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a/logo.png'],
  ['basis-cash', 'basis-cash.png', 'blockchains/ethereum/assets/0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a/logo.png'],
  ['busd', 'busd.png', 'blockchains/ethereum/assets/0x4Fabb145d64652a948d72533023f6E7A623C7C53/logo.png'],
  ['falcon-usdf', 'falcon-usdf.png', 'blockchains/ethereum/assets/0xFa2B947eEc368f42195f24F36d2aF29f7c24CeC2/logo.png'],
  ['lisusd', 'lisusd.png', 'blockchains/smartchain/assets/0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5/logo.png'],
  ['mento-dollar', 'mento-dollar.png', 'blockchains/celo/assets/0x765DE816845861e75A25fCA122bb6898B8B1282a/logo.png'],
  ['qidao-mai', 'qidao-mai.png', 'blockchains/polygon/assets/0xa3Fa99A148fA48D14Ed51d610c367C61876997F1/logo.png'],
  ['sdai', 'sdai.png', 'blockchains/ethereum/assets/0x83F20F44975D03b1b09e64809B757c47f942BEeA/logo.png'],
  ['usd0', 'usd0.png', 'blockchains/ethereum/assets/0x73A15FeD60Bf67631dC6cd7Bc5B6e8da8190aCF5/logo.png'],
  ['usd1', 'usd1.png', 'blockchains/smartchain/assets/0x8d0D000Ee44948FC98c9B98A4FA4921476f08B0d/logo.png'],
  ['ust', 'ust.png', 'blockchains/terra/assets/uusd/logo.png']
];

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label}: marker missing`);
  return source.replace(before, after);
};

fs.mkdirSync(logoDir, { recursive: true });
for (const [slug, filename, sourcePath] of batch) {
  const input = path.join(sourceRoot, sourcePath);
  if (!fs.existsSync(input)) throw new Error(`missing pinned source for ${slug}: ${sourcePath}`);
  const bytes = fs.readFileSync(input);
  if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`invalid PNG for ${slug}`);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== height || width < 32) throw new Error(`invalid logo geometry for ${slug}: ${width}x${height}`);
  fs.writeFileSync(path.join(logoDir, filename), bytes);
}

const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
let resolver = fs.readFileSync(resolverPath, 'utf8');
const resolverEntries = batch.map(([slug, filename]) => `  '${slug}': '/stablecoin-logos/${filename}',`).join('\n');
resolver = replaceRequired(
  resolver,
  "const LOGOS_BY_SLUG: Readonly<Record<string, string>> = {\n  'agoric-ist': '/stablecoin-logos/ist.svg',",
  `const LOGOS_BY_SLUG: Readonly<Record<string, string>> = {\n${resolverEntries}\n  'agoric-ist': '/stablecoin-logos/ist.svg',`,
  'resolver mappings'
);
fs.writeFileSync(resolverPath, resolver);

const coveragePath = path.join(root, 'scripts/audit-stablecoin-logo-coverage.mjs');
let coverage = fs.readFileSync(coveragePath, 'utf8');
coverage = replaceRequired(coverage, ".filter((name) => name.endsWith('.svg')).sort();", ".filter((name) => /\\.(?:svg|png)$/.test(name)).sort();", 'coverage asset extensions');
coverage = coverage.replaceAll('expected 39 canonical logo mappings', 'expected 50 canonical logo mappings').replaceAll('mappings.length !== 39', 'mappings.length !== 50');
coverage = replaceRequired(
  coverage,
  "for (const requiredSlug of ['beanstalk-bean', 'berachain-honey', 'crvusd', 'djed', 'eurs', 'musd', 'near-usn', 'united-stables-u']) {",
  "for (const requiredSlug of ['agora-ausd', 'basis-cash', 'busd', 'falcon-usdf', 'lisusd', 'mento-dollar', 'qidao-mai', 'sdai', 'usd0', 'usd1', 'ust', 'beanstalk-bean', 'berachain-honey', 'crvusd', 'djed', 'eurs', 'musd', 'near-usn', 'united-stables-u']) {",
  'coverage required slugs'
);
coverage = coverage.replaceAll('local_svg_assets', 'local_logo_assets');
fs.writeFileSync(coveragePath, coverage);

const validatorPath = path.join(root, 'scripts/validate-ui-v3-stablecoin-index.mjs');
let validator = fs.readFileSync(validatorPath, 'utf8');
validator = replaceRequired(
  validator,
  "  logoLicense: 'public/stablecoin-logos/LICENSE-web3icons.txt',",
  "  logoLicense: 'public/stablecoin-logos/LICENSE-web3icons.txt',\n  trustWalletLicense: 'public/stablecoin-logos/LICENSE-trustwallet-assets.txt',",
  'validator license input'
);
const validatorEntries = batch.map(([slug, filename]) => `  '${slug}': '${filename}',`).join('\n');
validator = replaceRequired(
  validator,
  "const logoMappings = {\n  'agoric-ist': 'ist.svg',",
  `const logoMappings = {\n${validatorEntries}\n  'agoric-ist': 'ist.svg',`,
  'validator mappings'
);
validator = validator.replaceAll("Object.keys(logoMappings).length === 39", "Object.keys(logoMappings).length === 50")
  .replaceAll('coverage must be 39 records', 'coverage must be 50 records')
  .replaceAll('effectiveLogoRecordCount === 39', 'effectiveLogoRecordCount === 50');
validator = replaceRequired(
  validator,
  "check(source.logoReadme?.includes('113249b982b3ec5e597feee1ad03d15961e6598b'), 'pinned Web3 Icons provenance missing');",
  "check(source.logoReadme?.includes('113249b982b3ec5e597feee1ad03d15961e6598b'), 'pinned Web3 Icons provenance missing');\ncheck(source.logoReadme?.includes('34d808acb2a71e55c41505cd8f15c827db21b0fc'), 'pinned Trust Wallet Assets provenance missing');\ncheck(source.trustWalletLicense?.startsWith('MIT License'), 'Trust Wallet Assets MIT notice missing');",
  'validator Trust Wallet provenance'
);
fs.writeFileSync(validatorPath, validator);

const readmePath = path.join(logoDir, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace('Current audited coverage: **39 of 116 canonical Stable or Gone stablecoin records**.', 'Current audited coverage: **50 of 116 canonical Stable or Gone stablecoin records**.');
const trustWalletSection = `### Address-verified Trust Wallet Assets set\n\nSource: \`trustwallet/assets\`, distributed under the MIT License and pinned to commit:\n\n\`\`\`text\n${pinnedCommit}\n\`\`\`\n\nLicense notice: \`LICENSE-trustwallet-assets.txt\`. Each logo below was matched by an exact canonical deployment identifier recorded in SOG, not by symbol alone.\n\n\`\`\`text\nagora-ausd.png\nbasis-cash.png\nbusd.png\nfalcon-usdf.png\nlisusd.png\nmento-dollar.png\nqidao-mai.png\nsdai.png\nusd0.png\nusd1.png\nust.png\n\`\`\`\n\n`;
readme = replaceRequired(readme, '## Resolution rules\n', `${trustWalletSection}## Resolution rules\n`, 'README Trust Wallet section');
fs.writeFileSync(readmePath, readme);

fs.writeFileSync(path.join(logoDir, 'LICENSE-trustwallet-assets.txt'), `MIT License\n\nCopyright (c) 2019-2023 Trust Wallet\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n`);

console.log(JSON.stringify({ pinnedCommit, imported: batch.map(([slug, filename]) => ({ slug, filename })), projectedCoverage: 50 }, null, 2));
