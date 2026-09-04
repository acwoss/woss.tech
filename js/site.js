/* ═══════════════════════════════════════════════════════════════════
   site.js — comportamento compartilhado por TODAS as páginas.

   Como o site é só HTML (uma publicação por arquivo), tudo que a home e
   as publicações têm em comum mora aqui: tema, nav ao rolar e o evento
   `tema:mudou`, que qualquer página pode ouvir para redesenhar o que
   depende de cor (é o que a página de publicação faz com o Mermaid).

   Carregue sempre ANTES dos scripts específicos da página.
   ═══════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var doc = global.document;
  var raiz = doc.documentElement;

  var prefereEscuro = global.matchMedia &&
                      global.matchMedia('(prefers-color-scheme: dark)').matches;

  /* ---------- tema ---------- */

  function tema() {
    var explicito = raiz.dataset.theme;
    if (explicito === 'light' || explicito === 'dark') return explicito;
    return prefereEscuro ? 'dark' : 'light';
  }

  function aplicar(novo) {
    raiz.dataset.theme = novo;
    try {
      global.localStorage.setItem('tema', novo === 'dark' ? 'escuro' : 'claro');
    } catch (e) { /* janela privada: só não persiste */ }

    pintarBotoes();
    doc.dispatchEvent(new CustomEvent('tema:mudou', { detail: { tema: novo } }));
  }

  function alternar() {
    aplicar(tema() === 'dark' ? 'light' : 'dark');
  }

  function pintarBotoes() {
    var proximo = tema() === 'dark' ? 'claro' : 'escuro';
    var botoes = doc.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < botoes.length; i++) {
      var rotulo = botoes[i].querySelector('[data-theme-label]');
      if (rotulo) rotulo.textContent = proximo;
      botoes[i].setAttribute('aria-label', 'Mudar para o tema ' + proximo);
    }
  }

  // um único listener na raiz atende qualquer botão de tema da página,
  // inclusive os que aparecerem depois
  doc.addEventListener('click', function (e) {
    var botao = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (botao) { e.preventDefault(); alternar(); }
  });

  // se o sistema mudar e a pessoa nunca escolheu à mão, acompanha
  if (global.matchMedia) {
    var mq = global.matchMedia('(prefers-color-scheme: dark)');
    var onMQ = function (e) {
      prefereEscuro = e.matches;
      if (raiz.dataset.theme) return;             // escolha explícita manda
      pintarBotoes();
      doc.dispatchEvent(new CustomEvent('tema:mudou', { detail: { tema: tema() } }));
    };
    if (mq.addEventListener) mq.addEventListener('change', onMQ);
    else if (mq.addListener) mq.addListener(onMQ);
  }

  pintarBotoes();

  /* ---------- nav que ganha fundo ao rolar ---------- */

  (function nav() {
    var barra = doc.querySelector('.nav');
    if (!barra) return;

    var pendente = false;
    function checar() {
      barra.classList.toggle('is-stuck', global.scrollY > 24);
      pendente = false;
    }

    global.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      global.requestAnimationFrame(checar);
    }, { passive: true });

    checar();
  })();

  /* ---------- revelar seções ao entrar em vista ---------- */

  (function reveal() {
    var alvos = [].slice.call(doc.querySelectorAll('.reveal'));
    if (!alvos.length) return;

    if (!('IntersectionObserver' in global)) {
      alvos.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    alvos.forEach(function (el) {
      [].slice.call(el.querySelectorAll(':scope > *')).forEach(function (filho, i) {
        filho.style.transitionDelay = (i * 70) + 'ms';
      });
    });

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach(function (el) { obs.observe(el); });
  })();

  /* ---------- API mínima para as páginas ---------- */

  global.Site = {
    tema: tema,
    alternar: alternar,
    /** Lê um custom property do :root já resolvido (para passar cor a libs). */
    token: function (nome) {
      return getComputedStyle(raiz).getPropertyValue(nome).trim();
    }
  };
})(window);
