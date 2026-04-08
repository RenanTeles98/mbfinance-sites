const fs = require('fs');
const targetFile = 'c:\\Users\\MB NEGOCIOS\\Mb finance- Sites\\mb-finance-completo.html';
const content = fs.readFileSync(targetFile, 'utf8');
const faqSectionSplitter = '<section id="faq"';
const parts = content.split(faqSectionSplitter);
console.log('Parts length: ' + parts.length);
if (parts.length > 0) {
    console.log('First 50 chars of Part 1: ' + parts[1].substring(0, 50));
}
