/* Browser runtime. Concatenated after helpers.js and render.js into /assets/app.js */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };

  function num(s) {
    if (typeof s !== 'string') return NaN;
    s = s.replace(/[,\s$%£€₹]/g, '');
    if (s === '' || s === '-' || s === '.') return NaN;
    var n = Number(s);
    return isFinite(n) ? n : NaN;
  }
  function readField(el, cfg) {
    if (!el) return undefined;
    switch (cfg.type) {
      case 'number': return num(el.value);
      case 'checkbox': return !!el.checked;
      default: return el.value;
    }
  }

  /* ---------- calculator pages ---------- */
  var form = $('form[data-calc]');
  if (form && window.CALC) initCalc(form, window.CALC);

  function initCalc(form, C) {
    var out = $('#result');
    var inputs = C.inputs || [];
    var byId = {}; inputs.forEach(function (c) { byId[c.id] = c; });

    // prefill from URL (?id=value)
    try {
      var qs = new URLSearchParams(location.search);
      inputs.forEach(function (c) {
        if (c.type === 'rows' || !qs.has(c.id)) return;
        var el = form.elements[c.id]; if (!el) return;
        if (c.type === 'checkbox') el.checked = qs.get(c.id) === '1'; else el.value = qs.get(c.id);
      });
    } catch (e) { }

    function values() {
      var v = {};
      inputs.forEach(function (c) {
        if (c.type === 'rows') {
          v[c.id] = $$('.row', $('[data-rows="' + c.id + '"]', form)).map(function (row) {
            var o = {};
            c.fields.forEach(function (f) { o[f.id] = readField($('[data-k="' + f.id + '"]', row), f); });
            return o;
          });
        } else {
          v[c.id] = readField(form.elements[c.id], c);
        }
      });
      return v;
    }
    function visibility(v) {
      inputs.forEach(function (c) {
        if (!c.showIf) return;
        var ok = Object.keys(c.showIf).every(function (k) { return c.showIf[k].indexOf(String(v[k])) !== -1; });
        var w = $('[data-field="' + c.id + '"]', form); if (w) w.hidden = !ok;
      });
    }
    var lastSaved = '', saveTimer;
    function run() {
      var v = values(), r;
      visibility(v);
      try { r = C.compute(v, H, C.data); } catch (e) { r = { error: 'Check your inputs and try again.' }; }
      out.innerHTML = renderResult(r, H);
      clearTimeout(saveTimer);
      if (r && !r.error) saveTimer = setTimeout(function () { save(v, r); }, 1800);
    }
    function save(v, r) {
      var plain = function (s) { return String(s || '').replace(/<[^>]+>/g, ''); };
      var key = C.slug + plain(r.value);
      if (key === lastSaved) return; lastSaved = key;
      var params = new URLSearchParams();
      inputs.forEach(function (c) { if (c.type !== 'rows' && v[c.id] !== undefined && v[c.id] === v[c.id]) params.set(c.id, c.type === 'checkbox' ? (v[c.id] ? '1' : '0') : v[c.id]); });
      var url = location.pathname + (params.toString() ? '?' + params : '');
      try { history.replaceState(null, '', url); } catch (e) { }
      var h = store.get('dot-history', []).filter(function (x) { return x.k !== key; });
      h.unshift({ k: key, n: C.name, e: plain(r.expr), v: plain(r.value), l: plain(r.label), u: url, t: Date.now() });
      store.set('dot-history', h.slice(0, 20));
    }

    form.addEventListener('input', run);
    form.addEventListener('change', run);
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    form.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) {
        var box = $('[data-rows="' + add.getAttribute('data-add') + '"]', form);
        var cfg = byId[add.getAttribute('data-add')];
        var rows = $$('.row', box);
        if (cfg.max && rows.length >= cfg.max) return;
        var tpl = rows[rows.length - 1] || $('template', box).content.firstElementChild;
        var clone = tpl.cloneNode(true);
        $$('[data-k]', clone).forEach(function (el) {
          var f = cfg.fields.filter(function (x) { return x.id === el.getAttribute('data-k'); })[0];
          if (!f) return;
          if (el.tagName === 'SELECT') el.value = f.value != null ? String(f.value) : el.options[0].value;
          else if (el.type === 'checkbox') el.checked = !!f.value;
          else el.value = f.blank ? '' : (f.value != null ? f.value : '');
        });
        box.appendChild(clone); run();
        var first = $('input,select', clone); if (first) first.focus();
      }
      var rm = e.target.closest('.rm');
      if (rm) {
        var row = rm.closest('.row'), box2 = row.parentNode;
        if ($$('.row', box2).length > 1) { row.remove(); run(); }
      }
    });
    var reset = $('[data-reset]');
    if (reset) reset.addEventListener('click', function () { location.href = location.pathname; });
    var copy = $('[data-copy]');
    if (copy) copy.addEventListener('click', function () {
      var t = $('.value', out), l = $('.rlabel', out), ex = $('.expr', out);
      var text = (l ? l.textContent + ': ' : '') + (t ? t.textContent : '') + (ex ? ' (' + ex.textContent + ')' : '') + ' — ' + location.href;
      var done = function () { copy.textContent = 'copied ✓'; setTimeout(function () { copy.textContent = 'copy result'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
    });
    var share = $('[data-share]');
    if (share) {
      if (!navigator.share) share.hidden = true;
      else share.addEventListener('click', function () { navigator.share({ title: document.title, url: location.href }).catch(function () { }); });
    }
    if (location.search) run();
  }

  /* ---------- homepage keypad calculator ---------- */
  var pad = $('#keypad');
  if (pad) {
    var exprEl = $('#kp-expr'), valEl = $('#kp-val');
    var expr = '', justEq = false;
    var show = function (v) { valEl.textContent = v; valEl.classList.toggle('value-md', v.length > 9); valEl.classList.toggle('value-sm', v.length > 14); };
    var evaluate = function (s) {
      var t = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      // percent: "a op b%" → relative for + and -, otherwise /100
      t = t.replace(/(\d+(?:\.\d+)?)\s*([+\-])\s*(\d+(?:\.\d+)?)%/g, function (m, a, op, b) { return a + op + '(' + a + '*' + b + '/100)'; });
      t = t.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
      if (!/^[\d+\-*/().\s]+$/.test(t)) return NaN;
      try { return Function('"use strict";return (' + t + ')')(); } catch (e) { return NaN; }
    };
    var fmt = function (n) { if (!isFinite(n)) return 'nope'; var r = Math.round(n * 1e10) / 1e10; return Math.abs(r) >= 1e15 ? r.toExponential(6) : r.toLocaleString('en-US', { maximumFractionDigits: 10 }); };
    var press = function (k) {
      if (k === 'AC') { expr = ''; exprEl.textContent = ' '; show('0'); return; }
      if (k === '⌫') { expr = expr.slice(0, -1); show(expr || '0'); return; }
      if (k === '=') {
        if (!expr) return;
        var r = evaluate(expr);
        exprEl.textContent = expr; show(fmt(r)); justEq = true;
        if (isFinite(r)) {
          var h = store.get('dot-history', []);
          h.unshift({ k: 'kp' + Date.now(), n: 'Calculator', e: expr, v: fmt(r), l: '', u: '/', t: Date.now() });
          store.set('dot-history', h.slice(0, 20)); renderHistory();
          expr = String(Math.round(r * 1e10) / 1e10);
        }
        return;
      }
      if (k === '±') { if (/^-?[\d.]+$/.test(expr)) expr = expr[0] === '-' ? expr.slice(1) : '-' + expr; show(expr || '0'); return; }
      if (justEq && /[\d.]/.test(k)) expr = '';
      justEq = false;
      expr += k; show(expr);
    };
    pad.addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (b) press(b.getAttribute('data-k')); });
    document.addEventListener('keydown', function (e) {
      if (e.target.closest('input,textarea,select')) return;
      var map = { '*': '×', '/': '÷', '-': '−', 'Enter': '=', 'Backspace': '⌫', 'Escape': 'AC', 'c': 'AC' };
      var k = map[e.key] || e.key;
      if (/^[\d.+%]$/.test(k) || ['×', '÷', '−', '=', '⌫', 'AC'].indexOf(k) !== -1) { e.preventDefault(); press(k); }
    });
  }

  /* ---------- homepage search + history ---------- */
  var search = $('#calc-search');
  if (search) {
    var items = $$('[data-search]');
    var groups = $$('[data-group]');
    var empty = $('#search-empty');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      var shown = 0;
      items.forEach(function (li) {
        var t = li.getAttribute('data-search');
        var ok = q.every(function (w) { return t.indexOf(w) !== -1; });
        li.hidden = !ok; if (ok) shown++;
      });
      groups.forEach(function (g) { g.hidden = !$$('[data-search]', g).some(function (li) { return !li.hidden; }); });
      if (empty) empty.hidden = shown > 0;
    });
  }
  function renderHistory() {
    var box = $('#history'); if (!box) return;
    var h = store.get('dot-history', []);
    var wrap = $('#history-wrap'); if (wrap) wrap.hidden = !h.length;
    box.innerHTML = h.map(function (x) {
      return '<li><a href="' + H.esc(x.u) + '"><span class="hn">' + H.esc(x.n) + '</span><span class="he">' + H.esc(x.e || x.l) + '</span><b>' + H.esc(x.v) + '</b></a></li>';
    }).join('');
  }
  renderHistory();
  var clear = $('#history-clear');
  if (clear) clear.addEventListener('click', function () { store.set('dot-history', []); renderHistory(); });
})();
