/* ───────────────────────────────────────────────────────────────
   Auditor de Legibilidade — AcessAI WikiDoc
   Baseado em WCAG 2.1 (1.4.3 / 1.4.4 / 1.4.12), NN/g e
   "The Elements of Typographic Style" (Bringhurst).

   Uso:
     • abra o Console do navegador e rode  auditLegibility()
     • ou acesse a página com  ?audit  (ex.: index.html?audit)

   Critérios avaliados (corpo de texto <p> e <li>):
     1. Fonte         ≥ 16px
     2. Line-height   ≥ 1.5 (line-height / font-size)
     3. Medida        50–75 caracteres/linha (ideal ~66)
     4. Espaço ¶      margem inferior ≥ 2× a fonte (informativo)
     5. Contraste     ≥ 4.5:1 (texto normal) · ≥ 3:1 (texto grande)
   ─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  function srgb(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(o) { return 0.2126 * srgb(o.r) + 0.7152 * srgb(o.g) + 0.0722 * srgb(o.b); }
  function ratio(a, b) { const la = lum(a), lb = lum(b), hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); }
  function parseColor(str) {
    const m = (str || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function blend(fg, bg) {
    const a = fg.a;
    return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
  }
  function effectiveBg(el) {
    let node = el, gradient = false;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') gradient = true;
      const bg = parseColor(cs.backgroundColor);
      if (bg && bg.a > 0) return { color: bg, gradient };
      node = node.parentElement;
    }
    return { color: { r: 255, g: 255, b: 255, a: 1 }, gradient };
  }

  const ctx = document.createElement('canvas').getContext('2d');
  function charsPerLine(el, cs) {
    const txt = (el.textContent || '').trim();
    if (!txt) return 0;
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`;
    const avg = ctx.measureText(txt).width / txt.length;
    const content = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    return avg > 0 ? content / avg : 0;
  }

  function isLargeText(px, weight) { return px >= 24 || (px >= 18.66 && weight >= 700); }

  function audit() {
    const pages = [...document.querySelectorAll('.page')];
    const saved = pages.map(p => p.style.display);
    pages.forEach(p => { p.style.display = 'block'; });

    const EXCLUDE = '.mod-card, .foot-nav, .breadcrumb, .nav-item, .hero-pill, .ph-tag, .nav-label, .sr-item, .sr-empty';
    const els = [...document.querySelectorAll('.main-inner p, .main-inner li, .main-inner h1, .main-inner h2, .main-inner h3')];

    const rows = [];
    let fail = 0, warn = 0, ok = 0;

    els.forEach(el => {
      if (el.closest(EXCLUDE)) return;
      const txt = (el.textContent || '').trim();
      if (txt.length < 2) return;

      const cs = getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      const heading = /^h[1-6]$/.test(tag);
      const fs = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight) || 400;
      const lh = cs.lineHeight === 'normal' ? 1.2 * fs : parseFloat(cs.lineHeight);
      const lhR = lh / fs;
      const cpl = Math.round(charsPerLine(el, cs));
      const mbR = (parseFloat(cs.marginBottom) || 0) / fs;

      let fg = parseColor(cs.color) || { r: 0, g: 0, b: 0, a: 1 };
      const bg = effectiveBg(el);
      if (fg.a < 1) fg = blend(fg, bg.color);
      const cr = ratio(fg, bg.color);
      const crMin = isLargeText(fs, weight) ? 3 : 4.5;

      const flags = [];
      if (!heading && fs < 16) flags.push('FAIL fonte ' + fs + 'px');
      if (!heading && lhR < 1.5) flags.push('FAIL line-height ' + lhR.toFixed(2));
      if (!heading) {
        if (cpl > 90 || cpl < 35) flags.push('FAIL medida ' + cpl + 'ch');
        else if (cpl > 75 || cpl < 45) flags.push('WARN medida ' + cpl + 'ch');
      }
      if (bg.gradient) flags.push('WARN contraste sobre gradiente (checar manual)');
      else if (cr < crMin) flags.push((cr < 3 ? 'FAIL' : 'WARN') + ' contraste ' + cr.toFixed(2) + ':1');

      const status = flags.some(f => f.startsWith('FAIL')) ? '❌ FAIL'
                   : flags.some(f => f.startsWith('WARN')) ? '⚠️ WARN' : '✅ OK';
      if (status[0] === '❌') fail++; else if (status[0] === '⚠️') warn++; else ok++;

      rows.push({
        seção: (el.closest('.page') || {}).id || '',
        el: tag,
        texto: txt.slice(0, 38) + (txt.length > 38 ? '…' : ''),
        fonte: fs + 'px',
        'lh×': lhR.toFixed(2),
        'ch/linha': heading ? '—' : cpl,
        'margem×': mbR.toFixed(2),
        contraste: bg.gradient ? 'gradiente' : cr.toFixed(2) + ':1',
        status,
        notas: flags.join(' · ')
      });
    });

    pages.forEach((p, i) => { p.style.display = saved[i]; });

    console.group('%c📐 Auditoria de Legibilidade — AcessAI WikiDoc', 'font-weight:bold;font-size:14px;color:#1D4ED8');
    console.table(rows);
    console.log(`%cResumo: ${rows.length} elementos · ✅ ${ok} ok · ⚠️ ${warn} avisos · ❌ ${fail} falhas`, 'font-weight:bold');
    console.log('Critérios: fonte ≥16px · line-height ≥1.5 · 50–75 ch/linha · contraste ≥4.5:1 (≥3:1 grande).');
    console.log('Ref.: WCAG 2.1 (1.4.3/1.4.4/1.4.12), NN/g, Bringhurst. Títulos: line-height/medida não pontuam.');
    console.groupEnd();
    return { total: rows.length, ok, warn, fail, rows };
  }

  window.auditLegibility = audit;
  console.info('%c📐 Legibilidade pronta — rode auditLegibility() no console para auditar a página.', 'color:#2563EB');

  if (/[?&#]audit\b/.test(location.search + location.hash)) {
    if (document.readyState === 'loading') addEventListener('DOMContentLoaded', audit);
    else audit();
  }
})();
