#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   build.mjs — gera o que é derivado, a partir do que é escrito à mão.

   As páginas continuam sendo HTML escrito à mão. O que este script
   faz é eliminar as cópias que envelhecem em silêncio: a lista de
   publicações, os cartões de tópico, o feed RSS e o sitemap.

   FONTE ÚNICA DE VERDADE: os arquivos publicacoes/*.html. Os metadados
   saem das meta tags de cada um; o tempo de leitura é contado do texto.
   Nenhuma lista de posts existe em JSON, YAML ou banco.

     node scripts/build.mjs           grava os arquivos derivados
     node scripts/build.mjs --check   falha se algo estiver desatualizado
                                      (é o que a CI roda)

   Sem dependências: só a biblioteca padrão do Node.
   ═══════════════════════════════════════════════════════════════════ */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://woss.tech';
const AUTOR = 'Anderson Woss';
const CHECK = process.argv.includes('--check');

/* Tópicos conhecidos. Publicação com `article:section` fora desta lista
   quebra o build de propósito: tópico novo é decisão, não digitação. */
const TOPICOS = {
  'IA':              { marca: '>_', nome: 'IA aplicada',     desc: 'Agentes, LLM em produção, avaliação e o custo de tudo isso.' },
  'Arquitetura':     { marca: '<>', nome: 'Arquitetura',     desc: 'Contratos, limites de serviço e decisões que a gente paga depois.' },
  'Engenharia':      { marca: '{}', nome: 'Engenharia',      desc: 'Teste, revisão, entrega contínua e o ofício em si.' },
  'Observabilidade': { marca: '##', nome: 'Observabilidade', desc: 'Métrica, log e trace — como saber que ainda está de pé.' }
};

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun',
               'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MESES_RFC = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const problemas = [];
const desatualizados = [];

/* ───────────────────────── helpers ───────────────────────── */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function meta(html, ...nomes) {
  for (const nome of nomes) {
    const re = new RegExp(
      `<meta\\s+(?:name|property)=["']${nome}["']\\s+content=["']([^"']*)["']`, 'i');
    const m = html.match(re) || html.match(new RegExp(
      `<meta\\s+content=["']([^"']*)["']\\s+(?:name|property)=["']${nome}["']`, 'i'));
    if (m) return m[1].trim();
  }
  return null;
}

function dataLonga(iso) {
  const [a, m, d] = iso.split('-');
  return `${d} ${MESES[Number(m) - 1]} ${a}`;
}

function dataRFC(iso) {
  const d = new Date(`${iso}T09:00:00Z`);
  const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const p = (n) => String(n).padStart(2, '0');
  return `${dias[d.getUTCDay()]}, ${p(d.getUTCDate())} ` +
         `${MESES_RFC[d.getUTCMonth()]} ${d.getUTCFullYear()} 09:00:00 +0000`;
}

/** Mede o texto: tempo de leitura, palavras e quantidade de diagramas.
 *  A prosa exclui diagrama, código e legenda — ninguém lê um diagrama a
 *  200 palavras por minuto. Estes três números são DERIVADOS: o build os
 *  reescreve no arquivo, em vez de confiar que eu atualizei à mão. */
function medir(html) {
  const corpo = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (!corpo) return null;

  const prosa = corpo[1]
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<figcaption[\s\S]*?<\/figcaption>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ');

  const palavras = prosa.split(/\s+/).filter((p) => p.length > 1).length;
  const diagramas = (html.match(/class="mermaid"/g) || []).length;

  return {
    palavras,
    diagramas,
    minutos: Math.max(1, Math.round(palavras / 200))
  };
}

/** Reescreve no HTML da publicação os números que o build calcula. */
function sincronizarNumeros(html, m) {
  const plural = (n, s) => `${n} ${s}${n === 1 ? '' : 's'}`;

  return html
    .replace(/(<meta name="twitter:data1" content=")[^"]*(")/,
             `$1${m.minutos} min$2`)
    .replace(/("wordCount":\s*)\d+/, `$1${m.palavras}`)
    .replace(/(<span data-gerado="diagramas">)[^<]*(<\/span>)/,
             `$1${plural(m.diagramas, 'diagrama')}$2`);
}

/** Substitui o conteúdo entre <!-- gerado:x --> e <!-- /gerado:x -->. */
function injetar(html, chave, conteudo) {
  const ini = `<!-- gerado:${chave} -->`;
  const fim = `<!-- /gerado:${chave} -->`;
  const i = html.indexOf(ini);
  const f = html.indexOf(fim);
  if (i < 0 || f < 0) {
    problemas.push(`marcador "gerado:${chave}" não encontrado`);
    return html;
  }
  return html.slice(0, i + ini.length) + '\n' + conteudo + '\n' +
         ' '.repeat(Math.max(0, colunaDo(html, f))) + html.slice(f);
}

function colunaDo(html, indice) {
  const linha = html.lastIndexOf('\n', indice);
  return indice - linha - 1;
}

async function gravar(caminho, conteudo) {
  const abs = join(RAIZ, caminho);
  let atual = null;
  try { atual = await readFile(abs, 'utf8'); } catch { /* novo */ }

  if (atual === conteudo) return;

  if (CHECK) { desatualizados.push(caminho); return; }
  await writeFile(abs, conteudo, 'utf8');
  console.log('  escrito', caminho);
}

/* ───────────────────────── leitura das publicações ───────────────────────── */

async function lerPublicacoes() {
  const dir = join(RAIZ, 'publicacoes');
  const arquivos = (await readdir(dir))
    .filter((f) => f.endsWith('.html') && f !== 'index.html' && !f.startsWith('_'))
    .sort()
    .reverse();                                   // mais recente primeiro

  const posts = [];

  for (const arquivo of arquivos) {
    const html = await readFile(join(dir, arquivo), 'utf8');
    const onde = `publicacoes/${arquivo}`;

    const tituloBruto = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
    const titulo = tituloBruto ? tituloBruto.replace(/\s*—\s*woss\.tech\s*$/, '').trim() : null;
    const descricao = meta(html, 'description');
    const data = meta(html, 'article:published_time');
    const topico = meta(html, 'article:section');
    const medida = medir(html);

    if (!titulo)     problemas.push(`${onde}: falta <title> no formato "Assunto — woss.tech"`);
    if (!descricao)  problemas.push(`${onde}: falta <meta name="description">`);
    if (!data)       problemas.push(`${onde}: falta <meta property="article:published_time">`);
    if (!medida)     problemas.push(`${onde}: não achei <article> para medir o texto`);
    if (!topico)     problemas.push(`${onde}: falta <meta property="article:section">`);
    else if (!TOPICOS[topico]) {
      problemas.push(`${onde}: tópico "${topico}" não existe em TOPICOS (scripts/build.mjs)`);
    }

    if (data && !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      problemas.push(`${onde}: article:published_time deve ser AAAA-MM-DD, veio "${data}"`);
    }
    if (data && !arquivo.startsWith(data)) {
      problemas.push(`${onde}: o nome do arquivo devia começar com ${data}`);
    }
    if (descricao && descricao.length > 165) {
      problemas.push(`${onde}: description com ${descricao.length} caracteres (máximo 165, senão o Google corta)`);
    }
    if (titulo && tituloBruto && tituloBruto.length > 65) {
      problemas.push(`${onde}: <title> com ${tituloBruto.length} caracteres (máximo 65)`);
    }
    if (!html.includes(`${SITE}/publicacoes/${arquivo}`)) {
      problemas.push(`${onde}: canonical/og:url não aponta para ${SITE}/publicacoes/${arquivo}`);
    }
    if (!meta(html, 'og:image')) {
      problemas.push(`${onde}: falta <meta property="og:image"> (rode: npm run og)`);
    }

    // os números derivados voltam para o próprio arquivo
    if (medida) {
      const corrigido = sincronizarNumeros(html, medida);
      if (corrigido !== html) await gravar(onde, corrigido);
    }

    posts.push({ arquivo, url: `/publicacoes/${arquivo}`, titulo, descricao,
                 data, topico,
                 minutos: medida ? medida.minutos : 0,
                 palavras: medida ? medida.palavras : 0,
                 diagramas: medida ? medida.diagramas : 0 });
  }

  return posts;
}

/* ───────────────────────── blocos de HTML ───────────────────────── */

function blocoDestaque(p) {
  return `      <article class="featured__card">
        <p class="meta mono">
          <a class="tag" href="/publicacoes/?topico=${encodeURIComponent(p.topico)}">${esc(p.topico)}</a>
          <span class="sep">/</span><time datetime="${p.data}">${dataLonga(p.data)}</time>
          <span class="sep">/</span>${p.minutos} min de leitura
        </p>
        <h2 class="featured__title" id="destaque-titulo">
          <a href="${p.url}">${esc(p.titulo)}</a>
        </h2>
        <p class="featured__excerpt">${esc(p.descricao)}</p>
        <a class="link-arrow mono" href="${p.url}">
          ler o ensaio completo <span aria-hidden="true">→</span>
        </a>
      </article>`;
}

function itemDaLista(p, n) {
  return `        <li class="post" data-topico="${esc(p.topico)}">
          <a class="post__link" href="${p.url}">
            <span class="post__index" aria-hidden="true">${String(n).padStart(2, '0')}</span>
            <span>
              <h3 class="post__title">${esc(p.titulo)}</h3>
              <p class="post__excerpt">${esc(p.descricao)}</p>
            </span>
            <span class="post__side">
              <span class="post__tag">${esc(p.topico)}</span>
              <time datetime="${p.data}">${dataLonga(p.data)}</time> · ${p.minutos} min
            </span>
          </a>
        </li>`;
}

function secaoRecentes(posts) {
  if (!posts.length) return '  <!-- nenhuma outra publicação ainda -->';

  return `  <section class="archive reveal" aria-labelledby="recentes-titulo">
    <div class="shell">
      <div class="archive__head">
        <div>
          <p class="section-label mono">02 — mais publicações</p>
          <h2 class="section-title" id="recentes-titulo">O arquivo</h2>
        </div>
      </div>

      <ol class="posts">
${posts.map((p, i) => itemDaLista(p, i + 1)).join('\n')}
      </ol>

      <a class="link-arrow link-arrow--big mono" href="/publicacoes/">
        ver todas as publicações <span aria-hidden="true">→</span>
      </a>
    </div>
  </section>`;
}

function cartoesDeTopico(posts) {
  const usados = [...new Set(posts.map((p) => p.topico))]
    .filter((t) => TOPICOS[t])
    .sort((a, b) => {
      const d = posts.filter((p) => p.topico === b).length -
                posts.filter((p) => p.topico === a).length;
      return d !== 0 ? d : a.localeCompare(b, 'pt-BR');
    });

  return usados.map((chave) => {
    const t = TOPICOS[chave];
    const n = posts.filter((p) => p.topico === chave).length;
    return `        <a class="topic" href="/publicacoes/?topico=${encodeURIComponent(chave)}">
          <span class="topic__mark" aria-hidden="true">${esc(t.marca)}</span>
          <h3 class="topic__name">${esc(t.nome)}</h3>
          <p class="topic__desc">${esc(t.desc)}</p>
          <span class="topic__count">${n} ${n === 1 ? 'texto' : 'textos'}</span>
        </a>`;
  }).join('\n');
}

function chipsDeFiltro(posts) {
  const usados = [...new Set(posts.map((p) => p.topico))].sort();
  const todos = ['todos', ...usados];

  return todos.map((t) => {
    const rotulo = t === 'todos' ? 'todos' : t.toLowerCase();
    return `          <button class="chip" type="button" data-topico="${esc(t)}" ` +
           `aria-pressed="${t === 'todos'}">${esc(rotulo)}</button>`;
  }).join('\n');
}

/* ───────────────────────── feed e sitemap ───────────────────────── */

function feed(posts) {
  const itens = posts.map((p) => `    <item>
      <title>${esc(p.titulo)}</title>
      <link>${SITE}${p.url}</link>
      <guid isPermaLink="true">${SITE}${p.url}</guid>
      <pubDate>${dataRFC(p.data)}</pubDate>
      <category>${esc(p.topico)}</category>
      <dc:creator>${esc(AUTOR)}</dc:creator>
      <description>${esc(p.descricao)}</description>
    </item>`).join('\n');

  const atualizado = posts.length ? dataRFC(posts[0].data) : dataRFC('2026-09-04');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>woss.tech</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Ensaios sobre engenharia de software, arquitetura e inteligência artificial aplicada.</description>
    <language>pt-BR</language>
    <copyright>© 2026 ${esc(AUTOR)}</copyright>
    <managingEditor>anderson@woss.tech (${esc(AUTOR)})</managingEditor>
    <webMaster>anderson@woss.tech (${esc(AUTOR)})</webMaster>
    <lastBuildDate>${atualizado}</lastBuildDate>
    <generator>scripts/build.mjs</generator>
${itens}
  </channel>
</rss>
`;
}

function sitemap(posts) {
  // lastmod das páginas fixas = data da publicação mais recente. É
  // determinístico (não muda a cada execução) e é honesto: o conteúdo
  // do site muda quando entra publicação nova.
  const recente = posts.length ? posts[0].data : '2026-09-04';

  const urls = [
    { loc: '/',              lastmod: recente, prioridade: '1.0', freq: 'weekly' },
    { loc: '/publicacoes/',  lastmod: recente, prioridade: '0.9', freq: 'weekly' },
    { loc: '/sobre.html',    lastmod: recente, prioridade: '0.5', freq: 'yearly' },
    ...posts.map((p) => ({ loc: p.url, lastmod: p.data, prioridade: '0.8', freq: 'monthly' }))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prioridade}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

/* ───────────────────────── execução ───────────────────────── */

const posts = await lerPublicacoes();

if (!posts.length) {
  problemas.push('nenhuma publicação encontrada em publicacoes/');
}

if (problemas.length) {
  console.error('\n✗ o build parou por causa disto:\n');
  for (const p of problemas) console.error('  ·', p);
  console.error('');
  process.exit(1);
}

console.log(`${posts.length} publicação(ões):`);
for (const p of posts) {
  console.log(`  ${p.data}  ${String(p.minutos).padStart(2)} min  ` +
              `${String(p.palavras).padStart(5)} palavras  ` +
              `${p.diagramas} diagrama(s)  [${p.topico}]  ${p.titulo}`);
}

// index.html
let home = await readFile(join(RAIZ, 'index.html'), 'utf8');
home = injetar(home, 'destaque', blocoDestaque(posts[0]));
home = injetar(home, 'recentes', secaoRecentes(posts.slice(1)));
home = injetar(home, 'topicos', cartoesDeTopico(posts));
await gravar('index.html', home);

// publicacoes/index.html
let arquivo = await readFile(join(RAIZ, 'publicacoes/index.html'), 'utf8');
arquivo = injetar(arquivo, 'filtros', chipsDeFiltro(posts));
arquivo = injetar(arquivo, 'arquivo', posts.map((p, i) => itemDaLista(p, i + 1)).join('\n'));
await gravar('publicacoes/index.html', arquivo);

await gravar('feed.xml', feed(posts));
await gravar('sitemap.xml', sitemap(posts));

if (problemas.length) {
  console.error('\n✗ marcadores faltando:\n');
  for (const p of problemas) console.error('  ·', p);
  process.exit(1);
}

if (CHECK && desatualizados.length) {
  console.error('\n✗ arquivos derivados desatualizados:\n');
  for (const d of desatualizados) console.error('  ·', d);
  console.error('\nRode `npm run build` e comite o resultado.\n');
  process.exit(1);
}

console.log(CHECK ? '\n✓ tudo em dia' : '\n✓ build concluído');
