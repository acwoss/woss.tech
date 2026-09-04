# woss.tech

Blog pessoal de [Anderson Woss](https://woss.tech/sobre.html) sobre engenharia
de software, arquitetura e inteligência artificial aplicada.

**HTML, CSS e JavaScript escritos à mão.** Sem framework, sem dependência de
runtime, sem CMS e sem build para as páginas. Cada publicação é um arquivo
`.html`, o que deixa cada texto livre para ter a forma que o assunto pedir.

→ **[woss.tech](https://woss.tech)** · [feed RSS](https://woss.tech/feed.xml)

Tem um ensaio explicando as decisões de arquitetura e o que elas custam:
[Um blog sem framework: o que ganhei e o que perdi](https://woss.tech/publicacoes/2026-09-04-um-blog-sem-framework.html).

## Rodar local

Não há instalação: o site é estático.

```bash
npm run dev        # python3 -m http.server 8000 → http://localhost:8000
```

Precisa servir por HTTP (não `file://`), porque os caminhos são absolutos a
partir da raiz do domínio.

## Publicar um texto

```bash
cp docs/modelo-publicacao.html publicacoes/2026-09-20-o-slug.html
# escreve
npm run build      # valida os metadados e gera lista, feed e sitemap
npm run og         # gera o cartão de compartilhamento (precisa do Chrome)
```

O `build` **falha** se faltar metadado, se o `<title>` passar de 65 caracteres,
se a `description` passar de 165, se a data não casar com o nome do arquivo ou
se o tópico não existir. É ele que faz o papel de revisor.

`npm run publicar` roda os dois.

## Estrutura

```
index.html              home (com regiões geradas)
publicacoes/            uma publicação por arquivo — a fonte de verdade
sobre.html  404.html    páginas fixas
css/                    base → lista/home/pagina/publicacao
js/                     site.js (compartilhado) + um por tipo de página
scripts/build.mjs       valida e gera lista, tópicos, feed.xml, sitemap.xml
scripts/og.mjs          gera assets/og/*.png e os ícones
docs/                   modelo de publicação comentado
```

**Nada em `feed.xml`, `sitemap.xml`, `assets/og/` ou entre marcadores
`<!-- gerado:x -->` deve ser editado à mão** — o build sobrescreve.

## Como funciona

- **Fonte única de verdade**: os metadados saem das `meta` tags de cada
  publicação. Não existe `posts.json`. O tempo de leitura, a contagem de
  palavras e o número de diagramas são medidos do texto e reescritos no
  arquivo pelo build.
- **Conteúdo em HTML estático**: a lista de publicações é marcação real, não
  injetada por JS. Sem JavaScript, o site continua completo e indexável — o
  que se perde é o filtro por tópico e as animações.
- **Tema claro/escuro** por `prefers-color-scheme`, com botão que sobrescreve e
  persiste. Um script inline aplica o tema antes do primeiro paint.
- **Diagramas** em [Mermaid](https://mermaid.js.org), tematizados com as cores
  do site e redesenhados na troca de tema (o SVG do Mermaid carrega cor
  embutida e não herda *custom property*).
- **Degradação**: se o Mermaid não carregar, a figura mostra o fonte do grafo;
  se o highlight.js não carregar, o código fica sem realce; se as fontes não
  carregarem, cai na pilha do sistema.

Detalhes, convenções e as pegadinhas descobertas no caminho estão no
[`CLAUDE.md`](CLAUDE.md).

## Publicação

GitHub Pages a partir de `main:/`, domínio próprio via `CNAME`. Não há
workflow de deploy — o Pages publica direto da branch; a CI só valida. Merge
na `main` vai para o ar.

`.nojekyll` e `CNAME` não podem ser apagados: sem o primeiro o Pages roda o
Jekyll (que come arquivos com `_` no nome e interpreta `{{ }}` como Liquid),
e sem o segundo o domínio cai.

## Licença

Duas, porque tem duas coisas aqui — ver [`LICENSE`](LICENSE):

- **código** (`css/`, `js/`, `scripts/`): MIT, use como quiser;
- **texto das publicações**: © 2026 Anderson Carlos Woss. Citação com
  atribuição e link é bem-vinda; republicação integral, não.
