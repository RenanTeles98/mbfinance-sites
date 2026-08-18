# Scripts do Projeto

## `maintenance/`

Scripts manuais de manutencao do site estatico. Eles nao fazem parte do runtime do Next.js nem do deploy automatico.

| Script | Finalidade |
| --- | --- |
| `bundle-js.mjs` | Gera o bundle JavaScript usado pelo site estatico quando necessario. |
| `fix_tailwind_layer.py` | Corrige ajustes especificos de camadas/utilitarios Tailwind em arquivos estaticos. |
| `sync_footer_padrao.py` | Sincroniza o rodape padrao entre paginas HTML estaticas. |
| `Sync-CpanelPackage.ps1` | Confere diferencas entre `public/` e o pacote CPanel; com `-Apply`, copia apenas arquivos ausentes ou diferentes e preserva arquivos exclusivos do CPanel. |

Execute scripts apenas apos revisar os arquivos-alvo e sempre valide as paginas antes de publicar o pacote CPanel.

Para conferir o pacote CPanel, execute `./scripts/maintenance/Sync-CpanelPackage.ps1`.
Use `./scripts/maintenance/Sync-CpanelPackage.ps1 -Apply` somente depois de revisar a lista de diferencas.
