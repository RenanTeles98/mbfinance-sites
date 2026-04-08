const fs = require('fs');

let html = fs.readFileSync('mb-finance-completo.html', 'utf8');

// The hero section must remain dark, but other sections get reverted

// 1. Mega menu borders and backgrounds
html = html.replace(/<div class="bg-\[#040f1a\] rounded-xl shadow-2xl border border-gray-100/g, '<div class="bg-white rounded-xl shadow-2xl border border-gray-100');
html = html.replace(/hover:bg-\[#040f1a\]/g, 'hover:bg-slate-50');
html = html.replace(/bg-\[#040f1a\] flex items-center/g, 'bg-slate-50 flex items-center');
html = html.replace(/bg-\[#040f1a\]\/50/g, 'bg-slate-50');

// 2. Text colors inside the menu
html = html.replace(/text-white\/60/g, 'text-slate-500');
html = html.replace(/text-white\/50/g, 'text-slate-400');
html = html.replace(/text-white\/40/g, 'text-slate-400');
html = html.replace(/class="text-\[15px\] font-light text-white"/g, 'class="text-[15px] font-light text-brand-primary"');
html = html.replace(/class="text-\[10px\] font-light text-white\/40/g, 'class="text-[10px] font-light text-slate-400');

// 3. Sections
html = html.replace(/<section class="py-16 sm:py-32 bg-\[#040f1a\] relative overflow-hidden\">/g, '<section class="py-16 sm:py-32 bg-white relative overflow-hidden">');
html = html.replace(/<section id="produtos" class="py-16 sm:py-32 bg-\[#040f1a\] relative\">/g, '<section id="produtos" class="py-16 sm:py-32 bg-slate-50 relative">');

// Write back
fs.writeFileSync('mb-finance-completo.html', html);
console.log('Revert applied!');
