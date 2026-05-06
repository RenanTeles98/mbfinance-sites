import fs from 'fs';
import path from 'path';

const base = './public/assets/js';
const order = [
    'infra/sheets.js',
    'infra/storage.js',
    'ui/scroll.js',
    'ui/navbar.js',
    'ui/accordion.js',
    'use-cases/lead.js',
    'use-cases/partnership.js',
    'ui/animations.js',
    'ui/video-loop.js',
    'ui/cookie-banner.js',
    'infra/google-ads-tag.js',
];

let bundle = '/* mb finance — bundle.js */\n';
for (const file of order) {
    const src = fs.readFileSync(path.join(base, file), 'utf8');
    bundle += `\n/* ── ${file} ── */\n${src}\n`;
    console.log(`+ ${file} (${Math.round(fs.statSync(path.join(base, file)).size / 1024 * 10) / 10}KB)`);
}

fs.writeFileSync('./public/assets/js/bundle.js', bundle, 'utf8');
const total = Math.round(fs.statSync('./public/assets/js/bundle.js').size / 1024 * 10) / 10;
console.log(`\nBundle: ${total}KB → public/assets/js/bundle.js`);
