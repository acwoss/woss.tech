/* ═══════════════════════════════════════════════════════════════════
   lista.js — filtro por tópico da página /publicacoes/.

   Como na home, a lista é HTML estático: este arquivo só esconde e
   mostra os <li> que já vieram no documento. Sem JS, a página segue
   completa (só não filtra).
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var caixa = document.getElementById('filtros');
  var lista = document.getElementById('publicacoes');
  if (!caixa || !lista) return;

  var itens = [].slice.call(lista.querySelectorAll('.post'));
  var vazio = document.getElementById('sem-resultado');

  function aplicar(topico) {
    var visiveis = 0;

    itens.forEach(function (li) {
      var mostra = topico === 'todos' || li.dataset.topico === topico;
      li.hidden = !mostra;
      if (mostra) {
        visiveis++;
        var idx = li.querySelector('.post__index');
        if (idx) idx.textContent = String(visiveis).padStart(2, '0');
      }
    });

    if (vazio) vazio.hidden = visiveis > 0;

    // reflete o filtro na URL, para o estado ser compartilhável
    try {
      var url = new URL(window.location.href);
      if (topico === 'todos') url.searchParams.delete('topico');
      else url.searchParams.set('topico', topico);
      history.replaceState(null, '', url);
    } catch (e) { /* sem history: só não reflete */ }
  }

  caixa.addEventListener('click', function (e) {
    var botao = e.target.closest('.chip');
    if (!botao) return;
    [].slice.call(caixa.querySelectorAll('.chip')).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b === botao));
    });
    aplicar(botao.dataset.topico);
  });

  // ?topico=IA na URL já entra filtrado
  try {
    var pedido = new URL(window.location.href).searchParams.get('topico');
    if (pedido) {
      var alvo = caixa.querySelector('.chip[data-topico="' + CSS.escape(pedido) + '"]');
      if (alvo) alvo.click();
    }
  } catch (e) { /* ignora */ }
})();
