# Fontes

Arquivos `.woff2` auto-hospedados, carregados via `next/font/local` em
`src/app/layout.tsx`. Nada é buscado em servidor de terceiros em runtime
nem em build.

| Arquivo | Família | Origem | Licença |
|---|---|---|---|
| `InterTight-Variable.woff2` | Inter Tight (variável, 100–900) | `@fontsource-variable/inter-tight` | SIL OFL 1.1 |
| `Geist-Variable.woff2` | Geist (variável, 100–900) | `@fontsource-variable/geist` | SIL OFL 1.1 |
| `GeistMono-Variable.woff2` | Geist Mono (variável, 100–900) | `@fontsource-variable/geist-mono` | SIL OFL 1.1 |
| `InstrumentSerif-Regular.woff2` | Instrument Serif 400 | `@fontsource/instrument-serif` | SIL OFL 1.1 |
| `InstrumentSerif-Italic.woff2` | Instrument Serif 400 itálico | `@fontsource/instrument-serif` | SIL OFL 1.1 |

Subconjunto `latin` (cobre toda a acentuação do português). Total: ~140 KB.

Para atualizar:

```bash
npm i -D @fontsource-variable/inter-tight @fontsource-variable/geist \
         @fontsource-variable/geist-mono @fontsource/instrument-serif
cp node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2 src/fonts/InterTight-Variable.woff2
# ...e assim por diante; depois remova os pacotes.
```
