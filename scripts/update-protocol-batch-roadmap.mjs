import fs from 'node:fs';
const p='docs/roadmap.md';
let s=fs.readFileSync(p,'utf8');
const pairs=[
['All-unknown income profiles:                31','All-unknown income profiles:                21'],
['PR #77 — Freeze historical terminal-date queue','PR #77 — Freeze historical terminal-date queue\nPR #78 — Resolve fiat-backed income profiles'],
['1. Complete fiat-backed income-profile batch in this change\n2. Begin protocol stablecoin income-profile completion','1. Complete protocol mechanics batch in this change\n2. Begin remaining profile completion'],
['Current queue: **31 all-unknown income profiles after this change**','Current queue: **21 all-unknown income profiles after this change**'],
['Status: **complete in this change**\n\nDecision record:','Status: **complete in PR #78**\n\nDecision record:'],
['Current: Fiat-backed income profiles — complete in this change\nNext:    Protocol stablecoin income profiles','Current: Protocol mechanics batch — complete in this change\nNext:    Synthetic and historical profile completion']
];
for(const [a,b] of pairs){if(!s.includes(a))throw new Error('missing roadmap anchor');s=s.replace(a,b)}
fs.writeFileSync(p,s);
