import os

pages_dir = r'c:/Users/MB NEGOCIOS/Mb finance- Sites/public/pages'

# Map exact strings to wrap in @layer base
patterns = [
    # politica / termos format
    (
        '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
        '@layer base { *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } }'
    ),
    # artigos / blog format
    (
        '* { margin: 0; padding: 0; box-sizing: border-box; }',
        '@layer base { * { margin: 0; padding: 0; box-sizing: border-box; } }'
    ),
]

files = [
    'blog.html',
    'politica-de-privacidade.html',
    'termos-de-uso.html',
    'artigo-antecipacao-de-recebiveis-quando-vale-a-pena.html',
    'artigo-capital-de-giro-melhores-taxas.html',
    'artigo-conta-pj-o-que-sua-empresa-precisa-saber.html',
    'artigo-fluxo-de-caixa-como-evitar-surpresas.html',
    'artigo-reforma-tributaria-o-que-muda-para-sua-empresa.html',
]

for fname in files:
    path = os.path.join(pages_dir, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    changed = False
    for old, new in patterns:
        if old in content:
            content = content.replace(old, new)
            changed = True
    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'OK: {fname}')
    else:
        print(f'SEM MATCH: {fname}')
