#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════
   og.mjs — gera as imagens de compartilhamento (Open Graph) e os
   ícones do site.

   Cada página tem um cartão 1200×630 próprio, com o título dela — é o
   que aparece quando alguém cola a URL no Slack, no WhatsApp ou no
   LinkedIn. Sem isso o link vira um retângulo cinza.

   O cartão é uma página HTML renderizada pelo Chrome headless. O fundo
   é o mesmo campo ASCII do site, gerado aqui de forma determinística
   (mesma semente, mesmo desenho) para a imagem não mudar a cada
   execução e sujar o diff.

     node scripts/og.mjs

   Requer: google-chrome (ou defina CHROME=/caminho/do/chrome).
   ═══════════════════════════════════════════════════════════════════ */

import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME || 'google-chrome';
const TMP = join(tmpdir(), 'woss-og');

/* ───────── campo ASCII estático (mesma ideia de js/ascii.js) ───────── */

const RAMP = ' .,:;-=+*#%@';

function campoAscii(cols, rows, semente) {
  const t = semente * 0.7;
  const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
  const linhas = [];

  for (let r = 0; r < rows; r++) {
    const y = (r - cy) * 1.85;
    let linha = '';
    for (let c = 0; c < cols; c++) {
      const x = c - cx;
      const d = Math.sqrt(x * x + y * y);
      const v = 1.00 * Math.sin(x * 0.085 + t * 0.9)
              + 0.90 * Math.sin(y * 0.110 - t * 0.6)
              + 0.80 * Math.sin((x + y) * 0.055 + t * 0.4)
              + 1.10 * Math.sin(d * 0.130 - t * 1.5)
              + 0.60 * Math.sin(x * 0.26 - t * 1.7) * Math.sin(y * 0.22 + t * 1.15);
      const n = Math.pow(Math.min(1, Math.max(0, (v + 4.4) / 8.8)), 2.0);
      linha += RAMP[Math.round(n * (RAMP.length - 1))];
    }
    linhas.push(linha);
  }
  return linhas.join('\n');
}

/** A camada de acento: só os picos de densidade. */
function apenasPicos(campo, apartirDe = 8) {
  return campo.split('').map((ch) => {
    const i = RAMP.indexOf(ch);
    return ch === '\n' ? '\n' : (i >= apartirDe ? ch : ' ');
  }).join('');
}

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ───────────────────────── o cartão ───────────────────────── */

function cartao({ titulo, kicker, rodape, semente }) {
  const dim = campoAscii(150, 40, semente);
  const hot = apenasPicos(dim);

  return `<!doctype html>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: #0b0b0a;
    color: #f3f1ec;
    font-family: "JetBrains Mono", monospace;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 62px 68px;
  }
  .campo {
    position: absolute; inset: 0; z-index: 0;
    -webkit-mask-image: radial-gradient(115% 95% at 50% 45%,
        rgba(0,0,0,.10) 0%, rgba(0,0,0,.22) 30%, rgba(0,0,0,.85) 66%, #000 100%);
    mask-image: radial-gradient(115% 95% at 50% 45%,
        rgba(0,0,0,.10) 0%, rgba(0,0,0,.22) 30%, rgba(0,0,0,.85) 66%, #000 100%);
  }
  .campo pre {
    position: absolute; inset: 0;
    font: 400 13px/1.08 "JetBrains Mono", monospace;
    white-space: pre;
  }
  .dim { color: rgba(243,241,236,.26); }
  .hot { color: rgba(255,92,43,.80); font-weight: 500; }

  /* Véu entre o campo e o texto: sem ele a legibilidade da marca e do
     título depende de onde o padrão ASCII ficou denso, o que muda a
     cada semente. */
  .veu {
    position: absolute; inset: 0; z-index: 1;
    background:
      linear-gradient(100deg,
        rgba(11,11,10,.94) 0%, rgba(11,11,10,.80) 34%,
        rgba(11,11,10,.30) 62%, rgba(11,11,10,0) 82%),
      linear-gradient(to top, rgba(11,11,10,.75) 0%, rgba(11,11,10,0) 26%);
  }

  .conteudo { position: relative; z-index: 2; }

  .marca {
    font-size: 22px; font-weight: 500; letter-spacing: -.01em;
  }
  .marca b { color: #ff5c2b; font-weight: 500; }

  .kicker {
    display: inline-block;
    margin-top: 4px;
    font-size: 15px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(243,241,236,.50);
  }

  h1 {
    font-family: "Instrument Serif", Georgia, serif;
    font-weight: 400;
    font-size: 78px;
    line-height: 1.04;
    letter-spacing: -.022em;
    max-width: 21ch;
    text-wrap: balance;
  }
  h1 em { font-style: italic; color: #ff5c2b; }

  .rodape {
    position: relative; z-index: 2;
    display: flex; align-items: center; gap: 14px;
    font-size: 17px;
    color: rgba(243,241,236,.55);
    letter-spacing: .02em;
  }
  .rodape .barra {
    flex: 1; height: 1px;
    background: linear-gradient(to right, rgba(255,92,43,.9), rgba(243,241,236,.12));
  }
</style>
<div class="campo" aria-hidden="true">
  <pre class="dim">${esc(dim)}</pre>
  <pre class="hot">${esc(hot)}</pre>
</div>
<div class="veu" aria-hidden="true"></div>

<div class="conteudo">
  <div class="marca">woss<b>.</b>tech</div>
  ${kicker ? `<span class="kicker">${esc(kicker)}</span>` : ''}
</div>

<h1 class="conteudo">${titulo}</h1>

<div class="rodape">
  <span>${esc(rodape)}</span>
  <span class="barra"></span>
  <span>woss.tech</span>
</div>
`;
}

/* ───────────────────────── metadados das páginas ───────────────────────── */

function meta(html, nome) {
  const re = new RegExp(
    `<meta\\s+(?:name|property)=["']${nome}["']\\s+content=["']([^"']*)["']`, 'i');
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun',
               'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function dataLonga(iso) {
  const [a, m, d] = iso.split('-');
  return `${d} ${MESES[Number(m) - 1]} ${a}`;
}

/** Semente estável a partir do nome: mesmo arquivo, mesmo desenho. */
function semente(texto) {
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 9973;
  return 1 + (h % 40) * 0.37;
}

async function paginas() {
  const lista = [
    {
      nome: 'home',
      titulo: 'IA é a parte fácil.<br>O <em>resto</em> é engenharia.',
      kicker: 'engenharia de software · ia aplicada',
      rodape: 'ensaios de Anderson Woss'
    },
    {
      nome: 'publicacoes',
      titulo: 'O <em>arquivo</em>',
      kicker: 'todas as publicações',
      rodape: 'woss.tech/publicacoes'
    },
    {
      nome: 'sobre',
      titulo: 'Anderson <em>Woss</em>',
      kicker: 'engenheiro de software',
      rodape: 'sistemas distribuídos e modelos de linguagem'
    }
  ];

  const dir = join(RAIZ, 'publicacoes');
  const arquivos = (await readdir(dir))
    .filter((f) => f.endsWith('.html') && f !== 'index.html' && !f.startsWith('_'));

  for (const arquivo of arquivos) {
    const html = await readFile(join(dir, arquivo), 'utf8');
    const titulo = meta(html, 'og:title') ||
      (html.match(/<title>([^<]*)<\/title>/i) || [])[1].replace(/\s*—\s*woss\.tech\s*$/, '');
    const data = meta(html, 'article:published_time');
    const topico = meta(html, 'article:section');

    lista.push({
      nome: arquivo.replace(/\.html$/, ''),
      titulo: esc(titulo),
      kicker: topico || 'publicação',
      rodape: data ? dataLonga(data) : 'woss.tech'
    });
  }

  return lista;
}

/* ───────────────────────── ícones ───────────────────────── */

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="18" fill="#14130f"/>
  <path d="M18 32 L33 71 L50 46 L67 71 L82 32"
        fill="none" stroke="#f3f1ec" stroke-width="9"
        stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="88" cy="70" r="8" fill="#ff5c2b"/>
</svg>
`;

async function gerarIcone(tamanho, saida) {
  const arquivo = join(TMP, `icone-${tamanho}.html`);
  await writeFile(arquivo, `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;width:${tamanho}px;height:${tamanho}px;overflow:hidden}
svg{display:block;width:${tamanho}px;height:${tamanho}px}</style>${FAVICON}`);

  await exec(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
    '--hide-scrollbars', '--default-background-color=00000000',
    `--window-size=${tamanho},${tamanho}`, '--virtual-time-budget=1500',
    `--screenshot=${join(RAIZ, saida)}`, `file://${arquivo}`]);
  console.log('  ', saida);
}

/* ───────────────────────── execução ───────────────────────── */

await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });
await mkdir(join(RAIZ, 'assets/og'), { recursive: true });

console.log('ícones:');
await writeFile(join(RAIZ, 'assets/favicon.svg'), FAVICON);
console.log('   assets/favicon.svg');
await gerarIcone(32, 'assets/favicon-32.png');
await gerarIcone(180, 'assets/apple-touch-icon.png');

const lista = await paginas();
console.log(`\ncartões de compartilhamento (${lista.length}):`);

for (const p of lista) {
  const arquivo = join(TMP, `${p.nome}.html`);
  await writeFile(arquivo, cartao({ ...p, semente: semente(p.nome) }));

  const saida = `assets/og/${p.nome}.png`;
  await exec(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
    '--hide-scrollbars', '--window-size=1200,630', '--virtual-time-budget=4000',
    `--screenshot=${join(RAIZ, saida)}`, `file://${arquivo}`]);
  console.log('  ', saida);
}

await rm(TMP, { recursive: true, force: true });
console.log('\n✓ imagens geradas');
