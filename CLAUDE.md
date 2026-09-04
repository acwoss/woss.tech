# woss.tech

Blog pessoal de Anderson Woss. **HTML, CSS e JavaScript escritos à mão, sem
framework, sem dependência de runtime e sem CMS.** Publicado pelo GitHub Pages
a partir da branch `main`.

> [!important] Este repositório é pessoal, não é trabalho da MadeiraMadeira.
> A regra global de vincular todo trabalho a um card do projeto **GEXP** no
> Jira **não se aplica aqui**. Não crie card, não use chave `GEXP-` em branch
> nem em commit, e não registre nada no `memory-mcp` com `session_id` de card.
> Se algum dia este site precisar de rastreabilidade, ela nasce aqui — em
> issue do próprio repositório.

## As cinco regras que não se negociam

1. **Zero dependência de runtime.** Nada de framework, nada de `node_modules`
   no que é servido. As duas bibliotecas do site (Mermaid e highlight.js) vêm
   por CDN, com **versão fixa**, apenas nas páginas que as usam, e a página
   tem de continuar funcionando se elas não carregarem.
2. **Uma publicação é um arquivo `.html`.** Sem template obrigatório: cada
   texto pode ter a forma que o assunto pedir. Quem faz o papel de revisor é
   `scripts/build.mjs`, que **falha** quando falta metadado.
3. **Conteúdo é HTML estático, não injetado por JS.** A lista de publicações
   vive no `index.html` e no `publicacoes/index.html` como marcação real. O
   JavaScript só filtra o que já está lá. Sem JS, o site continua completo e
   indexável.
4. **Uma cor de acento, e só uma.** A paleta é quase-branco / quase-preto mais
   o vermilion. Toda cor sai de um *custom property* — nunca escreva um hex
   direto numa regra de componente.
5. **pt-BR em tudo que o leitor vê**, e também em commits, comentários e nomes
   de classe CSS. Só o que é técnico-universal fica em inglês (`flowchart`,
   `og:image`, nomes de arquivo em kebab-case).

## Mapa do repositório

| Caminho | O que é |
| --- | --- |
| `index.html` | Home. Tem **regiões geradas** — ver abaixo. |
| `publicacoes/*.html` | Uma publicação por arquivo. É a **fonte única de verdade** do site. |
| `publicacoes/index.html` | O arquivo completo. Tem regiões geradas. |
| `sobre.html`, `404.html` | Páginas fixas. |
| `css/base.css` | Tokens, reset, utilitários, nav, rodapé, grade ASCII. **Carregue sempre primeiro.** |
| `css/lista.css` | Lista de publicações e filtros (home + arquivo). |
| `css/home.css` | Só a home (hero, destaque, tópicos, sobre). |
| `css/pagina.css` | Páginas simples (arquivo, sobre, 404). |
| `css/publicacao.css` | Tipografia e componentes de artigo. |
| `js/site.js` | Tema, nav, reveal. **Compartilhado por todas as páginas, carregado primeiro.** |
| `js/ascii.js` | Campo ASCII animado. |
| `js/home.js`, `js/lista.js`, `js/publicacao.js` | Um por tipo de página. |
| `scripts/build.mjs` | Valida as publicações e gera o que é derivado. |
| `scripts/og.mjs` | Gera os cartões de compartilhamento e os ícones. |
| `docs/modelo-publicacao.html` | Esqueleto comentado para copiar. |
| `feed.xml`, `sitemap.xml` | **Gerados.** Não edite. |
| `assets/og/*.png` | **Gerados.** Não edite. |

## O que é gerado (nunca edite à mão)

`scripts/build.mjs` escreve dentro de marcadores de comentário. **Tudo entre
`<!-- gerado:x -->` e `<!-- /gerado:x -->` é sobrescrito:**

| Marcador | Onde | Conteúdo |
| --- | --- | --- |
| `gerado:destaque` | `index.html` | Bloco da publicação mais recente |
| `gerado:recentes` | `index.html` | Seção com as demais publicações |
| `gerado:topicos` | `index.html` | Cartões de tópico, com a contagem real |
| `gerado:filtros` | `publicacoes/index.html` | Botões de filtro |
| `gerado:arquivo` | `publicacoes/index.html` | A lista completa |

Além disso, o build **reescreve três números dentro de cada publicação**,
porque são derivados do texto e desatualizariam em silêncio:

- `<meta name="twitter:data1">` → tempo de leitura;
- `"wordCount"` no JSON-LD → palavras de prosa;
- `<span data-gerado="diagramas">` → quantidade de diagramas.

Não calcule nenhum dos três à mão. Escreva qualquer valor e rode o build.

## Publicar um texto novo

```bash
cp docs/modelo-publicacao.html publicacoes/2026-09-20-o-slug.html
# escreve o texto, troca tudo que está em MAIÚSCULA
npm run build     # valida + gera lista, feed e sitemap
npm run og        # gera o cartão de compartilhamento
npm run dev       # http://localhost:8000 — confira no navegador
```

Depois: branch, commit, PR. **Merge na `main` publica** — o Pages não tem
ambiente de homologação, então o PR é a revisão.

O build para e diz o que falta. Ele confere, entre outras coisas: `<title>` de
até 65 caracteres, `description` de até 165, `article:published_time` em
`AAAA-MM-DD` casando com o nome do arquivo, tópico existente em `TOPICOS`,
`canonical` apontando para o arquivo certo e `og:image` presente.

**Tópico novo** exige editar o mapa `TOPICOS` em `scripts/build.mjs`. É
proposital: tópico é decisão editorial, não digitação.

## Mermaid — o que dói se ignorado

Diagrama é cidadão de primeira classe aqui, e essas quatro coisas custaram
tempo para descobrir:

- **`<br/>` em rótulo de nó não funciona.** O Mermaid 11.15 remove a tag *e*
  engole o espaço em volta: `"cabe na<br/>janela?"` renderiza como
  `cabe najanela?`. Não muda com `htmlLabels` ligado nem desligado. Escreva o
  rótulo corrido e deixe a quebra automática agir (`wrappingWidth: 170`).
- **Em bloco `note`, quebra de linha no fonte funciona** — é o jeito de ter
  nota em várias linhas.
- **Diagrama não pode passar de ~840px de largura natural.** Acima disso ele é
  reduzido para caber na coluna e o rótulo encolhe na mesma proporção.
  Vertical costuma caber; `direction LR` costuma não.
- **O `fontSize` de `themeVariables` não chega ao rótulo do nó.** Quem manda é
  o `themeCSS` injetado em `js/publicacao.js`.
- **Desenhar antes de a fonte carregar dá layout errado.** O Mermaid calcula o
  tamanho do desenho *medindo o texto renderizado*. Se ele roda antes de a
  JetBrains Mono chegar, mede com a fonte de fallback, que é mais larga: o
  mesmo diagrama de sequência sai com **922px em vez de 777px** e passa a ser
  reduzido para caber sem nenhum motivo. É por isso que `js/publicacao.js`
  espera `document.fonts.ready` antes do primeiro `desenhar()`. Se você mexer
  nessa parte, não remova a espera.

As cores do diagrama saem dos tokens `--mm-*` de `css/base.css`, que são
**hex sólidos de propósito**: o Mermaid faz conta com eles para derivar tons, e
derivar a partir de `rgba()` com alfa dá resultado errado.

E o mais importante: **o SVG do Mermaid carrega cor embutida e não herda
custom property.** Trocar o tema exige redesenhar — é o que o evento
`tema:mudou` (emitido por `js/site.js`) dispara.

## Código no texto

- Sempre em `<figure class="code bleed">` com a barra e o botão de copiar.
- Cada linguagem é um `<script>` a mais no `<head>`: carregue só as que
  aparecem.
- **Ligaduras estão desligadas** em `pre` e `code`. A JetBrains Mono desenha
  `!=` como `≠` e `->` como `→`; num bloco de código isso mostra um caractere
  que não está lá e que não vem no copiar.

## SEO e compartilhamento

Toda página precisa de: `<title>` único, `description`, `canonical`, o conjunto
`og:*` com imagem de 1200×630, `twitter:card`, e JSON-LD do tipo certo
(`WebSite`/`Person` na home, `BlogPosting` + `BreadcrumbList` em publicação,
`CollectionPage` no arquivo, `ProfilePage` no sobre).

Rode `npm run og` sempre que criar página ou mudar título — sem o PNG, o link
compartilhado vira um retângulo cinza.

## Acessibilidade

Não é opcional e o custo é baixo:

- `skip-link` no topo de toda página;
- o campo ASCII é `aria-hidden` e `user-select: none` — é decoração;
- foco visível via `:focus-visible` (nunca `outline: none` sem substituto);
- `aria-pressed` nos filtros, `aria-current` no item de nav da página atual;
- `prefers-reduced-motion` desliga a animação do campo, o typewriter e as
  transições;
- contraste: texto de corpo usa `--ink-70`; `--ink-45` só em metadado.

## Convenções de Git

- Branch: `feature/descricao-curta` ou `fix/descricao-curta`. **Sem chave de
  Jira** (ver o aviso no topo).
- Commit: Conventional Commits em pt-BR, escopo pelo diretório —
  `feat(publicacoes):`, `fix(css):`, `chore(scripts):`, `docs(claude):`.
- Um commit por assunto. Publicação nova e mudança de estilo são commits
  separados.
- Os arquivos gerados vão **no mesmo commit** que a mudança que os gerou.
- Nunca comite segredo. Este site não tem nenhum, e é bom que continue assim:
  não há formulário, backend, cookie nem analytics.

## Publicação (deploy)

GitHub Pages, `build_type: legacy`, servindo `main:/` no domínio `woss.tech`.

- `CNAME` fixa o domínio. **Não apague.**
- `.nojekyll` desliga o Jekyll. **Não apague**: sem ele, arquivos com `_` no
  nome desaparecem e `{{ }}` (nó hexagonal do Mermaid) é interpretado como
  Liquid e quebra o build do Pages.
- Não há workflow de deploy: o Pages publica direto da branch. A CI só valida.

## O que NÃO fazer

- Não adicione dependência de runtime, bundler ou framework.
- Não edite região gerada, `feed.xml`, `sitemap.xml` nem `assets/og/*`.
- Não escreva hex de cor fora dos tokens de `css/base.css`.
- Não invente número. Todo dado citado numa publicação tem de ser verificável;
  se veio de uma medição, diga qual foi a janela e a consulta.
- Não apague publicação que envelheceu: **corrija no próprio texto, com a
  data**. É o estado `Corrigida` do ciclo de vida, e é o que mantém o arquivo
  honesto.
