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

function minifyJS(src) {
    // Remove only block comments /* */ — safe, never inside strings
    // Do NOT remove line comments // — they break https:// URLs in strings
    return src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+/gm, '')
        .trim();
}

let bundle = '';
for (const file of order) {
    const src = fs.readFileSync(path.join(base, file), 'utf8');
    bundle += minifyJS(src) + '\n';
    console.log(`+ ${file} (${Math.round(fs.statSync(path.join(base, file)).size / 1024 * 10) / 10}KB)`);
}

fs.writeFileSync('./public/assets/js/bundle.js', bundle.trim(), 'utf8');
const total = Math.round(fs.statSync('./public/assets/js/bundle.js').size / 1024 * 10) / 10;
console.log(`\nBundle: ${total}KB → public/assets/js/bundle.js`);
