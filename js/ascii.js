/* ═══════════════════════════════════════════════════════════════════
   ascii.js — campo ASCII animado (hero da home e faixa da publicação).

   Como funciona
   -------------
   O fundo não é canvas: é uma grade de caracteres em dois <pre>
   sobrepostos. Para cada célula (coluna, linha) calculamos um valor
   escalar `v` somando quatro ondas (duas lineares, uma diagonal e uma
   radial) e, opcionalmente, uma ondulação centrada no cursor. Esse `v`
   é mapeado numa rampa de densidade (' ' → '@').

   - camada "dim": desenha todos os caracteres, na cor da tinta;
   - camada "hot": desenha só os picos de densidade, na cor de acento.

   Sobrepostas com a mesma métrica de fonte, dão cor seletiva ao campo
   sem custo de canvas nem de um elemento por caractere.

   Otimizações que importam aqui:
   - LUT de seno (2048 posições) em vez de Math.sin por célula;
   - os três primeiros termos são separáveis: pré-calculados por
     coluna/linha e combinados por soma (sin(a+b) = sa·cb + ca·sb);
   - rampa pré-quantizada em Uint8Array de 256 posições;
   - laço travado em ~26 fps, que ainda "lê" como terminal.
   ═══════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var RAMP = ' .,:;-=+*#%@';
  var HOT_FROM = 8;            // índice a partir do qual o caractere é "quente"
  var FPS = 26;
  var FRAME_MS = 1000 / FPS;
  var GAMMA = 2.00;            // > 1 deixa o campo mais esparso

  /* Cinco ondas somadas. Os pesos existem para normalizar o resultado em
     [-SOMA, SOMA] sem clipar, e as frequências foram calibradas para a
     grade real (~200 colunas em tela cheia): mais baixas que isso o campo
     vira um degradê gigante; mais altas, vira chuvisco. */
  var W = { x: 1.00, y: 0.90, diag: 0.80, radial: 1.10, fina: 0.60 };
  var SOMA = W.x + W.y + W.diag + W.radial + W.fina;   // 4.4
  var NORM = 255 / (SOMA * 2);

  /* ---------- tabela de senos ---------- */
  var LUT_N = 2048;
  var LUT_MASK = LUT_N - 1;
  var LUT = new Float32Array(LUT_N);
  for (var i = 0; i < LUT_N; i++) {
    LUT[i] = Math.sin((i / LUT_N) * Math.PI * 2);
  }
  var LUT_K = LUT_N / (Math.PI * 2);
  var QUARTER = LUT_N >> 2;

  function fsin(x) { return LUT[((x * LUT_K) | 0) & LUT_MASK]; }
  function fcos(x) { return LUT[(((x * LUT_K) | 0) + QUARTER) & LUT_MASK]; }

  /* ---------- rampa quantizada: 0..255 -> índice em RAMP ---------- */
  var LEVELS = new Uint8Array(256);
  for (var q = 0; q < 256; q++) {
    var n = Math.pow(q / 255, GAMMA);
    var idx = Math.round(n * (RAMP.length - 1));
    LEVELS[q] = idx < 0 ? 0 : (idx > RAMP.length - 1 ? RAMP.length - 1 : idx);
  }

  function AsciiField(stage, layerDim, layerHot) {
    this.stage = stage;
    this.dim = layerDim;
    this.hot = layerHot;

    this.cols = 0;
    this.rows = 0;
    this.cellW = 8;
    this.cellH = 14;
    this.aspect = 1.8;         // altura/largura da célula

    // buffers redimensionados junto com a grade
    this.fx = null;            // coord. x centrada, por coluna
    this.fy = null;            // coord. y centrada e corrigida, por linha
    this.dist = null;          // distância ao centro, por célula
    this.colA = null; this.rowB = null;
    this.sinA = null; this.cosA = null;
    this.sinB = null; this.cosB = null;
    this.outDim = null; this.outHot = null;

    this.time = 0;
    this.last = 0;
    this.acc = 0;
    this.running = false;
    this.raf = 0;

    this.ptr = { x: 0, y: 0, strength: 0, target: 0 };
    this.reduced = global.matchMedia
      ? global.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    this.onStats = null;

    this._tick = this._tick.bind(this);
    this._bind();
    this.resize();
  }

  AsciiField.prototype._bind = function () {
    var self = this;

    // remede a grade quando a viewport muda (com debounce)
    var t = 0;
    var onResize = function () {
      clearTimeout(t);
      t = setTimeout(function () { self.resize(); }, 120);
    };
    global.addEventListener('resize', onResize);
    global.addEventListener('orientationchange', onResize);

    // as fontes chegam depois do primeiro paint: remedir é obrigatório
    if (global.document.fonts && global.document.fonts.ready) {
      global.document.fonts.ready.then(function () { self.resize(); });
    }

    // ondulação seguindo o ponteiro
    global.addEventListener('pointermove', function (e) {
      var r = self.stage.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) {
        self.ptr.target = 0;
        return;
      }
      self.ptr.x = (e.clientX - r.left) / self.cellW;
      self.ptr.y = (e.clientY - r.top) / self.cellH;
      self.ptr.target = 1;
    }, { passive: true });

    global.addEventListener('pointerleave', function () { self.ptr.target = 0; });

    // não gastar CPU com a hero fora de vista nem com a aba em background
    if ('IntersectionObserver' in global) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) self.start(); else self.stop();
      }, { threshold: 0 }).observe(this.stage);
    }

    global.document.addEventListener('visibilitychange', function () {
      if (global.document.hidden) self.stop();
      else if (self._visible !== false) self.start();
    });
  };

  /* ---------- métrica real da célula de caractere ---------- */
  AsciiField.prototype._measure = function () {
    var probe = global.document.createElement('pre');
    probe.className = this.dim.className;
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:absolute;inset:auto;left:-9999px;top:0;visibility:hidden;' +
      'width:max-content;height:auto;white-space:pre;pointer-events:none;';

    var line = new Array(51).join('M');           // 50 caracteres
    var lines = [];
    for (var k = 0; k < 10; k++) lines.push(line);
    probe.textContent = lines.join('\n');

    this.stage.appendChild(probe);
    var box = probe.getBoundingClientRect();
    this.stage.removeChild(probe);

    if (box.width > 0 && box.height > 0) {
      this.cellW = box.width / 50;
      this.cellH = box.height / 10;
      this.aspect = this.cellH / this.cellW;
    }
  };

  AsciiField.prototype.resize = function () {
    this._measure();

    var box = this.stage.getBoundingClientRect();
    var w = box.width || global.innerWidth;
    var h = box.height || global.innerHeight;

    var cols = Math.max(8, Math.ceil(w / this.cellW) + 1);
    var rows = Math.max(6, Math.ceil(h / this.cellH) + 1);

    this.cols = cols;
    this.rows = rows;

    var cx = (cols - 1) / 2;
    var cy = (rows - 1) / 2;
    var asp = this.aspect;

    this.fx = new Float32Array(cols);
    this.colA = new Float32Array(cols);
    this.sinA = new Float32Array(cols);
    this.cosA = new Float32Array(cols);
    this.txA = new Float32Array(cols);
    for (var c = 0; c < cols; c++) this.fx[c] = c - cx;

    this.fy = new Float32Array(rows);
    this.rowB = new Float32Array(rows);
    this.sinB = new Float32Array(rows);
    this.cosB = new Float32Array(rows);
    this.tyB = new Float32Array(rows);
    for (var r = 0; r < rows; r++) {
      this.fy[r] = (r - cy) * asp;
      // parte da diagonal que não depende do tempo: sin(a+b) = sa·cb + ca·sb
      this.sinB[r] = fsin(this.fy[r] * 0.055);
      this.cosB[r] = fcos(this.fy[r] * 0.055);
    }

    this.dist = new Float32Array(cols * rows);
    for (var rr = 0, p = 0; rr < rows; rr++) {
      var yy = this.fy[rr];
      for (var cc = 0; cc < cols; cc++, p++) {
        var xx = this.fx[cc];
        this.dist[p] = Math.sqrt(xx * xx + yy * yy);
      }
    }

    // buffer de saída: cols caracteres + '\n' por linha
    var len = rows * (cols + 1);
    this.outDim = new Array(len);
    this.outHot = new Array(len);
    for (var rz = 0; rz < rows; rz++) {
      var nl = rz * (cols + 1) + cols;
      this.outDim[nl] = '\n';
      this.outHot[nl] = '\n';
    }

    if (this.onStats) this.onStats(cols, rows, this.reduced ? 0 : FPS);

    this.render(this.time);
  };

  /* ---------- um quadro ---------- */
  AsciiField.prototype.render = function (t) {
    var cols = this.cols, rows = this.rows;
    var fx = this.fx, dist = this.dist;
    var colA = this.colA, rowB = this.rowB;
    var sinA = this.sinA, cosA = this.cosA, txA = this.txA;
    var sinB = this.sinB, cosB = this.cosB, tyB = this.tyB;
    var outDim = this.outDim, outHot = this.outHot;
    var ramp = RAMP, levels = LEVELS;
    var wDiag = W.diag;

    // termos separáveis: uma passada por coluna e uma por linha,
    // em vez de cinco senos por célula
    var pDiag = t * 0.40;
    for (var c = 0; c < cols; c++) {
      var x = fx[c];
      colA[c] = W.x * fsin(x * 0.085 + t * 0.90);
      var a = x * 0.055 + pDiag;
      sinA[c] = fsin(a);
      cosA[c] = fcos(a);
      txA[c] = W.fina * fsin(x * 0.26 - t * 1.70);
    }
    for (var r = 0; r < rows; r++) {
      var y = this.fy[r];
      rowB[r] = W.y * fsin(y * 0.110 - t * 0.60);
      tyB[r] = fsin(y * 0.220 + t * 1.15);
    }

    var ptr = this.ptr;
    var pOn = ptr.strength > 0.01;
    var px = ptr.x, py = ptr.y * this.aspect, pS = ptr.strength * 2.4;
    var pPhase = t * 3.2;
    var asp = this.aspect;

    for (var row = 0, i = 0, o = 0; row < rows; row++, o++) {
      var sb = sinB[row], cb = cosB[row], rb = rowB[row], ty = tyB[row];
      var pdy = pOn ? (row * asp - py) : 0;
      var pdy2 = pdy * pdy;

      for (var col = 0; col < cols; col++, i++, o++) {
        var v = colA[col] + rb
              + wDiag * (sinA[col] * cb + cosA[col] * sb)
              + W.radial * fsin(dist[i] * 0.130 - t * 1.50)
              + txA[col] * ty;

        if (pOn) {
          var pdx = col - px;
          var d2 = pdx * pdx + pdy2;
          if (d2 < 4900) {                       // ~70 células de raio
            var pd = Math.sqrt(d2);
            v += pS * fcos(pd * 0.16 - pPhase) * (1 - pd / 70);
          }
        }

        // v ∈ [-SOMA, SOMA]  ->  0..255  ->  índice na rampa
        var q = (v + SOMA) * NORM;
        var idx = levels[q < 0 ? 0 : (q > 255 ? 255 : (q | 0))];

        outDim[o] = ramp[idx];
        outHot[o] = idx >= HOT_FROM ? ramp[idx] : ' ';
      }
    }

    this.dim.textContent = outDim.join('');
    this.hot.textContent = outHot.join('');
  };

  AsciiField.prototype._tick = function (now) {
    if (!this.running) return;
    this.raf = global.requestAnimationFrame(this._tick);

    var dt = now - this.last;
    this.last = now;
    if (dt > 250) dt = FRAME_MS;                 // volta de background

    this.acc += dt;
    if (this.acc < FRAME_MS) return;
    this.acc = this.acc % FRAME_MS;

    // suaviza a entrada/saída da ondulação do ponteiro
    var p = this.ptr;
    p.strength += (p.target - p.strength) * 0.08;

    this.time += FRAME_MS / 1000;
    this.render(this.time);
  };

  AsciiField.prototype.start = function () {
    this._visible = true;
    if (this.running || this.reduced) return;
    this.running = true;
    this.last = global.performance ? global.performance.now() : Date.now();
    this.acc = 0;
    this.raf = global.requestAnimationFrame(this._tick);
  };

  AsciiField.prototype.stop = function () {
    this._visible = false;
    this.running = false;
    if (this.raf) global.cancelAnimationFrame(this.raf);
    this.raf = 0;
  };

  /* ---------- gerador de "selo" ASCII estático (cards) ---------- */
  function asciiGlyph(cols, rows, seed) {
    var out = [];
    var s = seed * 0.618;
    for (var r = 0; r < rows; r++) {
      var line = '';
      var y = (r - rows / 2) * 1.8;
      for (var c = 0; c < cols; c++) {
        var x = c - cols / 2;
        var v = Math.sin(x * 0.30 + s)
              + Math.sin(y * 0.16 - s * 1.3)
              + Math.sin(Math.sqrt(x * x + y * y) * 0.34 - s);
        var q = Math.pow((v + 3) / 6, 1.9);
        var idx = Math.round(q * (RAMP.length - 1));
        line += RAMP[idx < 0 ? 0 : (idx > RAMP.length - 1 ? RAMP.length - 1 : idx)];
      }
      out.push(line);
    }
    return out.join('\n');
  }

  global.AsciiField = AsciiField;
  global.asciiGlyph = asciiGlyph;
})(window);
