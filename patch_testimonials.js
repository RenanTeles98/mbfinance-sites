const fs = require('fs');
const path = 'c:\\Users\\MB NEGOCIOS\\Mb finance- Sites\\mb-finance-completo.html';
let content = fs.readFileSync(path, 'utf8');

// Replace Column 3 Monica Avatar
content = content.replace(
  /<div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary\/10 flex-shrink-0">\s*<img src="brazilian_entrepreneurs_set_2_1774452759827\.png" class="w-\[200%\] h-\[200%\] max-w-none" style="object-position: 100% 100%; object-fit: cover;">\s*<\/div>/g,
  '<div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url(\'brazilian_entrepreneurs_set_2_1774452759827.png\'); background-position: 100% 100%;"></div>'
);

// Replace Column 3 Victor Avatar
content = content.replace(
  /<div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary\/10 flex-shrink-0">\s*<img src="brazilian_entrepreneurs_set_1_1774452713699\.png" class="w-\[200%\] h-\[200%\] max-w-none" style="object-position: 100% 0; object-fit: cover;">\s*<\/div>/g,
  '<div class="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-secondary/10 flex-shrink-0 avatar-sprite" style="background-image: url(\'brazilian_entrepreneurs_set_1_1774452713699.png\'); background-position: 100% 0%;"></div>'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully patched avatars in Column 3.');
