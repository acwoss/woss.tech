/* ═══════════════════════════════════════════════════════════════════
   home.js — só a página inicial.

   Diferença importante em relação a um blog "com JS":
   **a lista de publicações é HTML estático no index.html.** Este
   arquivo não a renderiza — ele só filtra o que já está lá. Se o JS
   não carregar, a página continua completa e indexável; o que se
   perde é o filtro e a animação.

   Tema, nav e reveal moram em js/site.js.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return [].slice.call((ctx || document).querySelectorAll(s)); };

  /* ───────────────────────── campo ASCII da hero ───────────────────────── */

  (function campo() {
    var stage = $('#ascii-stage');
    if (!stage || !window.AsciiField) return;

    var f = new AsciiField(stage, $('#ascii-dim'), $('#ascii-hot'));
    f.onStats = function (cols, rows, fps) {
      var nota = $('#ascii-nota');
      if (!nota) return;
      nota.textContent = fps ? 'ascii ' + cols + '×' + rows + ' · ' + fps + ' fps'
                             : 'animação reduzida por preferência do sistema';
    };
    f.onStats(f.cols, f.rows, f.reduced ? 0 : 26);
    f.start();
  })();

  /* ───────────────────────── selo ASCII do destaque ───────────────────────── */

  (function selo() {
    var el = $('#destaque-selo');
    if (el && window.asciiGlyph) el.textContent = asciiGlyph(44, 26, 3);
  })();

  /* ───────────────────────── linha de terminal ─────────────────────────
     As frases ficam em data-frases no HTML, para o texto do site não
     morar dentro do JavaScript. */

  (function typewriter() {
    var alvo = $('#typer');
    if (!alvo) return;

    var frases;
    try { frases = JSON.parse(alvo.dataset.frases || '[]'); }
    catch (e) { frases = []; }
    if (!frases.length) return;

    var reduzido = window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduzido) { alvo.textContent = frases[0]; return; }

    var f = 0, i = 0, apagando = false;

    (function passo() {
      var frase = frases[f];

      if (!apagando) {
        alvo.textContent = frase.slice(0, ++i);
        if (i === frase.length) { apagando = true; return setTimeout(passo, 2200); }
        return setTimeout(passo, 34 + Math.random() * 46);
      }

      alvo.textContent = frase.slice(0, --i);
      if (i === 0) {
        apagando = false;
        f = (f + 1) % frases.length;
        return setTimeout(passo, 420);
      }
      return setTimeout(passo, 16);
    })();
  })();

  /* ───────────────────────── filtro por tópico ─────────────────────────
     Opera sobre os <li data-topico="..."> que já vieram no HTML.
     Renumera os índices para a lista não ficar com furo. */

  (function filtro() {
    var caixa = $('#filtros');
    var lista = $('#publicacoes');
    if (!caixa || !lista) return;

    var itens = $$('.post', lista);
    var vazio = $('#sem-resultado');

    function aplicar(topico) {
      var visiveis = 0;

      itens.forEach(function (li) {
        var mostra = topico === 'todos' || li.dataset.topico === topico;
        li.hidden = !mostra;
        if (mostra) {
          visiveis++;
          var idx = $('.post__index', li);
          if (idx) idx.textContent = String(visiveis).padStart(2, '0');
        }
      });

      if (vazio) vazio.hidden = visiveis > 0;
    }

    caixa.addEventListener('click', function (e) {
      var botao = e.target.closest('.chip');
      if (!botao) return;

      $$('.chip', caixa).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === botao));
      });
      aplicar(botao.dataset.topico);
    });
  })();

})();
