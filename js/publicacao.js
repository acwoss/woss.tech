/* ═══════════════════════════════════════════════════════════════════
   publicacao.js — comportamento de uma publicação.

   Responsabilidades:
     1. Mermaid tematizado com as cores do site, redesenhando quando o
        tema muda (é o único jeito: o SVG do Mermaid tem cor embutida,
        não herda custom property).
     2. Sumário gerado a partir dos <h2>/<h3> do artigo, com o item
        ativo acompanhando a rolagem.
     3. Barra de progresso de leitura.
     4. Botão de copiar em cada bloco de código.
     5. Âncora por título (link permanente para a seção).

   Carregue DEPOIS de site.js e do Mermaid:
     <script defer src=".../mermaid.min.js"></script>
     <script defer src="../js/site.js"></script>
     <script defer src="../js/post.js"></script>
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var $  = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return [].slice.call((ctx || document).querySelectorAll(s)); };

  var artigo = $('.article');

  /* ═══════════════════════════════════════════════════════════════
     1. MERMAID
     ═══════════════════════════════════════════════════════════════ */

  (function diagramas() {
    var blocos = $$('.mermaid');
    if (!blocos.length) return;

    // Mermaid fora do ar (offline, CDN bloqueada): mostra o fonte do
    // grafo em vez de deixar um buraco na página.
    if (typeof window.mermaid === 'undefined') {
      blocos.forEach(function (el) {
        var fig = el.closest('.diagram');
        if (fig) fig.classList.add('diagram--sem-js');
        el.setAttribute('data-processed', 'sem-js');
      });
      return;
    }

    // O Mermaid substitui o conteúdo do elemento pelo SVG, então o
    // fonte original tem que ser guardado ANTES do primeiro desenho.
    var fontes = blocos.map(function (el) {
      return { el: el, src: el.textContent };
    });

    var MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

    function cor(nome) {
      return window.Site.token(nome);
    }

    function config() {
      return {
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        // useMaxWidth: true encaixa o SVG na largura disponível pelo
        // viewBox — o diagrama sempre cabe e nunca aparece barra de
        // rolagem. O preço é que um diagrama largo é reduzido, então o
        // rótulo é definido GRANDE no themeCSS (15px) para sobreviver à
        // redução: mantenha o diagrama estreito e ele nem reduz.
        // htmlLabels: false deixa o rótulo como <text>/<tspan> em vez de
        // um foreignObject com HTML: o SVG fica autocontido (exportável) e
        // a quebra de linha longa vira tspan em wrappingWidth.
        // ATENÇÃO: <br/> em rótulo de nó NÃO funciona (o Mermaid 11.15 o
        // remove e engole o espaço em volta) — escreva o rótulo corrido.
        flowchart: { useMaxWidth: true, htmlLabels: false, curve: 'basis',
                     padding: 12, nodeSpacing: 34, rankSpacing: 42,
                     wrappingWidth: 170 },
        sequence: { useMaxWidth: true, mirrorActors: false, actorMargin: 30,
                    boxMargin: 10, noteMargin: 10, width: 140, height: 42 },
        state:    { useMaxWidth: true, padding: 12 },
        er:       { useMaxWidth: true },
        gantt:    { useMaxWidth: true },
        themeVariables: {
          darkMode: window.Site.tema() === 'dark',
          background:        cor('--surface'),
          fontFamily:        MONO,
          fontSize:          '13px',

          /* nós e texto */
          primaryColor:      cor('--mm-node'),
          primaryBorderColor: cor('--mm-node-border'),
          primaryTextColor:  cor('--mm-text'),
          secondaryColor:    cor('--mm-cluster'),
          tertiaryColor:     cor('--mm-alt'),
          mainBkg:           cor('--mm-node'),
          nodeBorder:        cor('--mm-node-border'),
          nodeTextColor:     cor('--mm-text'),
          textColor:         cor('--mm-text'),
          titleColor:        cor('--mm-text'),

          /* arestas */
          lineColor:         cor('--mm-line'),
          edgeLabelBackground: cor('--surface'),

          /* subgrafos */
          clusterBkg:        cor('--mm-cluster'),
          clusterBorder:     cor('--mm-cluster-border'),

          /* diagrama de sequência */
          actorBkg:          cor('--mm-node'),
          actorBorder:       cor('--mm-node-border'),
          actorTextColor:    cor('--mm-text'),
          actorLineColor:    cor('--mm-line'),
          signalColor:       cor('--mm-line'),
          signalTextColor:   cor('--mm-text'),
          labelBoxBkgColor:  cor('--mm-cluster'),
          labelBoxBorderColor: cor('--mm-cluster-border'),
          labelTextColor:    cor('--mm-text'),
          loopTextColor:     cor('--mm-text'),
          activationBkgColor: cor('--mm-note'),
          activationBorderColor: cor('--mm-note-border'),
          sequenceNumberColor: cor('--surface'),
          noteBkgColor:      cor('--mm-note'),
          noteBorderColor:   cor('--mm-note-border'),
          noteTextColor:     cor('--mm-text'),

          /* diagrama de estado */
          labelBackgroundColor: cor('--surface'),
          altBackground:     cor('--mm-alt'),

          /* o acento é a única cor do site: entra nos destaques */
          errorBkgColor:     cor('--mm-note'),
          errorTextColor:    cor('--mm-text')
        },
        // reforço em CSS do que themeVariables não alcança
        themeCSS: [
          '.edgeLabel .label rect, .edgeLabel rect { fill: ' + cor('--surface') + '; }',
          '.nodeLabel, .edgeLabel, .edgeLabel span, .nodeLabel p {',
          '  font-family: ' + MONO + ' !important;',
          '  font-size: 15px !important; line-height: 1.3 !important;',
          '}',
          // com htmlLabels: false o rótulo é <text>/<tspan>, não .nodeLabel
          // rótulo de transição (stateDiagram) mora num foreignObject e
          // escapa dos seletores de SVG: pega tudo lá dentro também
          '.edgeLabel, .edgeLabel *, foreignObject div, foreignObject span,',
          'foreignObject p, .transition-label {',
          '  font-family: ' + MONO + ' !important;',
          '  font-size: 15px !important; line-height: 1.3 !important;',
          '}',
          '.messageText, .loopText, .noteText, .actor, .stateLabel, text, tspan {',
          '  font-family: ' + MONO + ' !important;',
          '  font-size: 15px !important;',
          '}',
          '.messageText, .loopText, .noteText { font-size: 14px !important; }',
          '.actor { font-size: 15px !important; }',
          '.node rect, .node polygon, .node circle, .node path { stroke-width: 1px; }',
          '.flowchart-link { stroke-width: 1.2px; }',
          '.marker { fill: ' + cor('--mm-line') + '; stroke: ' + cor('--mm-line') + '; }',
          '.cluster rect { stroke-dasharray: 3 3; }'
        ].join('')
      };
    }

    var desenhando = false;

    function desenhar() {
      if (desenhando) return Promise.resolve();
      desenhando = true;

      window.mermaid.initialize(config());

      // devolve o fonte e limpa a marca do Mermaid, senão ele ignora
      // o elemento como "já processado"
      fontes.forEach(function (f) {
        f.el.removeAttribute('data-processed');
        f.el.innerHTML = '';
        f.el.textContent = f.src;
      });

      return window.mermaid
        .run({ nodes: fontes.map(function (f) { return f.el; }) })
        .catch(function (e) {
          // grafo inválido não deve derrubar a página
          console.error('[mermaid] falhou ao desenhar:', e);
          fontes.forEach(function (f) {
            var fig = f.el.closest('.diagram');
            if (fig) fig.classList.add('diagram--sem-js');
            f.el.setAttribute('data-processed', 'erro');
          });
        })
        .finally(function () { desenhando = false; });
    }

    /* Em tela larga o SVG cabe na coluna (o `useMaxWidth: true` cuida
       disso) e não há barra de rolagem nenhuma. Em tela estreita a mesma
       regra reduziria o desenho a ~42%, com rótulo de 6px: ilegível. Lá o
       diagrama volta ao tamanho natural e se arrasta com o dedo — gesto
       nativo do celular, que não desenha barra (o CSS esconde a barra do
       desktop-em-janela-estreita por precaução). */
    var ESTREITO = 900;

    function ajustarEscala() {
      $$('.mermaid svg').forEach(function (svg) {
        // a largura natural é o max-width que o Mermaid grava no SVG;
        // tem de ser lida ANTES de a gente sobrescrever
        if (!svg.dataset.natural) {
          var lido = parseFloat(svg.style.maxWidth);
          if (lido) svg.dataset.natural = lido;
        }
        var nat = parseFloat(svg.dataset.natural || 0);
        if (!nat) return;

        if (window.innerWidth < ESTREITO) {
          svg.style.width = nat + 'px';
          svg.style.maxWidth = 'none';
        } else {
          svg.style.width = '100%';
          svg.style.maxWidth = nat + 'px';
        }
      });
    }

    /* Esperar a fonte é obrigatório, não otimização: o Mermaid calcula o
       layout MEDINDO o texto renderizado. Desenhar antes de a JetBrains
       Mono carregar mede com a fonte de fallback, que é mais larga — o
       mesmo diagrama sai com 922px em vez de 777px e passa a ser reduzido
       para caber na coluna sem nenhum motivo. */
    var fontesProntas = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();

    fontesProntas.then(desenhar).then(ajustarEscala);

    var tRedim = 0;
    window.addEventListener('resize', function () {
      clearTimeout(tRedim);
      tRedim = setTimeout(ajustarEscala, 150);
    });

    // o SVG carrega cor embutida: trocar o tema exige redesenhar
    document.addEventListener('tema:mudou', function () {
      /* Esperar a fonte é obrigatório, não otimização: o Mermaid calcula o
       layout MEDINDO o texto renderizado. Desenhar antes de a JetBrains
       Mono carregar mede com a fonte de fallback, que é mais larga — o
       mesmo diagrama sai com 922px em vez de 777px e passa a ser reduzido
       para caber na coluna sem nenhum motivo. */
    var fontesProntas = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();

    fontesProntas.then(desenhar).then(ajustarEscala);
    });
  })();

  /* ═══════════════════════════════════════════════════════════════
     2. SUMÁRIO
     ═══════════════════════════════════════════════════════════════ */

  (function sumario() {
    var caixa = $('#toc');
    if (!caixa || !artigo) return;

    var titulos = $$('h2, h3', artigo);
    if (titulos.length < 2) { caixa.hidden = true; return; }

    function slug(texto) {
      return texto
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // tira acento
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
    }

    var usados = {};
    var itens = titulos.map(function (h) {
      var texto = h.textContent.trim();
      var base = h.id || slug(texto);
      var id = base;
      var n = 2;
      while (usados[id]) { id = base + '-' + n++; }
      usados[id] = true;
      h.id = id;

      // âncora permanente para a seção
      var a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = '#' + id;
      a.textContent = '#';
      a.setAttribute('aria-label', 'Link para esta seção');
      h.appendChild(a);

      return { id: id, texto: texto, nivel: h.tagName === 'H3' ? 3 : 2, el: h };
    });

    // <details> para o sumário poder ficar recolhido no celular, onde
    // 7 itens ocupam uma tela inteira antes do texto começar. No desktop
    // ele é a coluna fixa da lateral e nasce aberto.
    var largo = window.matchMedia && window.matchMedia('(min-width: 1200px)').matches;

    caixa.innerHTML =
      '<details class="toc__box"' + (largo ? ' open' : '') + '>' +
        '<summary class="toc__label mono">nesta página</summary>' +
        '<ul class="toc__list">' +
        itens.map(function (i) {
          return '<li data-nivel="' + i.nivel + '">' +
                 '<a href="#' + i.id + '">' + i.texto + '</a></li>';
        }).join('') +
        '</ul>' +
      '</details>';

    // ao tocar num item no celular, recolhe (o leitor já escolheu)
    if (!largo) {
      caixa.addEventListener('click', function (e) {
        if (e.target.closest('.toc__list a')) {
          var d = caixa.querySelector('.toc__box');
          if (d) d.open = false;
        }
      });
    }

    // item ativo acompanha a rolagem
    var links = {};
    $$('a', caixa).forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });

    // "o último título que passou do topo" — e não "o título que está
    // dentro de uma faixa da tela": com faixa, rolar para o meio de uma
    // seção longa deixa nenhum título dentro dela e o sumário apaga.
    var LIMIAR = 100;
    var pendente = false;

    function marcarAtivo() {
      pendente = false;

      var ativo = itens[0];
      for (var i = 0; i < itens.length; i++) {
        if (itens[i].el.getBoundingClientRect().top <= LIMIAR) ativo = itens[i];
        else break;
      }

      // no fim da página, o último título vence — é o que o leitor está lendo
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        ativo = itens[itens.length - 1];
      }

      Object.keys(links).forEach(function (id) {
        links[id].classList.toggle('is-active', id === ativo.id);
      });
    }

    window.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(marcarAtivo);
    }, { passive: true });

    window.addEventListener('resize', marcarAtivo);
    marcarAtivo();
  })();

  /* ═══════════════════════════════════════════════════════════════
     3. PROGRESSO DE LEITURA
     ═══════════════════════════════════════════════════════════════ */

  (function progresso() {
    var barra = $('#progress');
    if (!barra || !artigo) return;

    var pendente = false;

    function calcular() {
      var caixa = artigo.getBoundingClientRect();
      var total = caixa.height - window.innerHeight;
      var lido = total > 0 ? (-caixa.top) / total : 1;
      barra.style.transform = 'scaleX(' + Math.min(1, Math.max(0, lido)) + ')';
      pendente = false;
    }

    window.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(calcular);
    }, { passive: true });

    window.addEventListener('resize', calcular);
    calcular();
  })();

  /* ═══════════════════════════════════════════════════════════════
     4. COPIAR CÓDIGO
     ═══════════════════════════════════════════════════════════════ */

  (function copiar() {
    $$('.code').forEach(function (fig) {
      var botao = $('.code__copy', fig);
      var codigo = $('pre code', fig) || $('pre', fig);
      if (!botao || !codigo) return;

      botao.addEventListener('click', function () {
        var texto = codigo.textContent;

        var fim = function (ok) {
          botao.textContent = ok ? 'copiado' : 'falhou';
          botao.dataset.copiado = ok ? '1' : '0';
          setTimeout(function () {
            botao.textContent = 'copiar';
            delete botao.dataset.copiado;
          }, 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(texto).then(function () { fim(true); },
                                                    function () { fim(false); });
          return;
        }

        // fallback para contexto sem clipboard API
        try {
          var ta = document.createElement('textarea');
          ta.value = texto;
          ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
          document.body.appendChild(ta);
          ta.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(ta);
          fim(ok);
        } catch (e) { fim(false); }
      });
    });
  })();

  /* ═══════════════════════════════════════════════════════════════
     5. FAIXA ASCII DO CABEÇALHO
     ═══════════════════════════════════════════════════════════════ */

  (function faixa() {
    var stage = $('#ascii-stage');
    if (!stage || !window.AsciiField) return;

    var campo = new AsciiField(stage, $('#ascii-dim'), $('#ascii-hot'));
    campo.start();
  })();

})();
