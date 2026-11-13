/* Shared math + formatting helpers. Runs at build time (Node) and in the browser.
   Plain script: defines a single global-ish `H`. No imports, no DOM. */
var H = (function () {
  var H = {};
  var isNum = function (x) { return typeof x === 'number' && isFinite(x); };
  H.isNum = isNum;

  /* ---------- formatting ---------- */
  H.num = function (x, dp) {
    if (!isNum(x)) return '—';
    if (dp === undefined) dp = 2;
    if (Math.abs(x) < 1e-12) x = 0;
    return x.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: 0 });
  };
  H.fix = function (x, dp) {
    if (!isNum(x)) return '—';
    if (dp === undefined) dp = 2;
    if (Math.abs(x) < 1e-12) x = 0;
    return x.toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
  };
  H.int = function (x) { return isNum(x) ? Math.round(x).toLocaleString('en-US') : '—'; };
  H.cur = function (x, sym, dp) {
    if (!isNum(x)) return '—';
    if (dp === undefined) dp = 2;
    var s = H.fix(Math.abs(x), dp);
    return (x < 0 && Math.abs(x) >= 0.5 * Math.pow(10, -dp) ? '−' : '') + sym + s;
  };
  H.money = function (x, dp) { return H.cur(x, '$', dp === undefined ? 2 : dp); };
  H.money0 = function (x) { return H.cur(x, '$', 0); };
  H.pct = function (x, dp) { return isNum(x) ? H.num(x, dp === undefined ? 2 : dp) + '%' : '—'; };
  H.sig = function (x, n) {
    if (!isNum(x)) return '—';
    if (x === 0) return '0';
    n = n || 4;
    var a = Math.abs(x);
    if (a >= 1e15 || a < 1e-6) return x.toExponential(n - 1).replace('e+', ' × 10^').replace('e-', ' × 10^-');
    var d = Math.max(0, n - 1 - Math.floor(Math.log10(a)));
    return H.num(Number(x.toFixed(Math.min(d, 12))), Math.min(d, 12));
  };
  H.round = function (x, dp) { var p = Math.pow(10, dp || 0); return Math.round(x * p) / p; };
  H.clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
  H.plural = function (n, word, plural) { return H.num(n, 2) + ' ' + (Math.abs(n) === 1 ? word : (plural || word + 's')); };
  H.dur = function (minutes) {
    if (!isNum(minutes)) return '—';
    var neg = minutes < 0; minutes = Math.round(Math.abs(minutes));
    var h = Math.floor(minutes / 60), m = minutes % 60;
    return (neg ? '−' : '') + (h ? h + ' h ' : '') + m + ' min';
  };
  H.ym = function (months) {
    if (!isNum(months)) return '—';
    months = Math.round(months);
    var y = Math.floor(months / 12), m = months % 12;
    var out = [];
    if (y) out.push(y + (y === 1 ? ' year' : ' years'));
    if (m || !y) out.push(m + (m === 1 ? ' month' : ' months'));
    return out.join(' ');
  };
  H.ord = function (n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  H.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- parsing ---------- */
  H.list = function (s) {
    if (Array.isArray(s)) return s.filter(isNum);
    return String(s || '').split(/[\s,;\t\n]+/).map(function (t) { return parseFloat(t.replace(/[$%]/g, '')); }).filter(isNum);
  };

  /* ---------- basic math ---------- */
  H.sum = function (a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; };
  H.mean = function (a) { return a.length ? H.sum(a) / a.length : NaN; };
  H.sorted = function (a) { return a.slice().sort(function (x, y) { return x - y; }); };
  H.median = function (a) {
    if (!a.length) return NaN;
    var s = H.sorted(a), m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  H.mode = function (a) {
    var c = {}, best = 0, out = [];
    a.forEach(function (x) { c[x] = (c[x] || 0) + 1; if (c[x] > best) best = c[x]; });
    if (best < 2) return [];
    Object.keys(c).forEach(function (k) { if (c[k] === best) out.push(Number(k)); });
    return out.sort(function (x, y) { return x - y; });
  };
  H.variance = function (a, sample) {
    if (sample === undefined) sample = true;
    var n = a.length; if (n < (sample ? 2 : 1)) return NaN;
    var m = H.mean(a), s = 0;
    for (var i = 0; i < n; i++) s += (a[i] - m) * (a[i] - m);
    return s / (sample ? n - 1 : n);
  };
  H.sd = function (a, sample) { return Math.sqrt(H.variance(a, sample)); };
  /* quantile, linear interpolation (Excel QUARTILE.INC / R type 7) */
  H.quantile = function (a, p) {
    var s = H.sorted(a); if (!s.length) return NaN;
    var h = (s.length - 1) * p, lo = Math.floor(h), hi = Math.ceil(h);
    return s[lo] + (h - lo) * (s[hi] - s[lo]);
  };
  H.gcd = function (a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { var t = b; b = a % b; a = t; } return a; };
  H.lcm = function (a, b) { return a && b ? Math.abs(a * b) / H.gcd(a, b) : 0; };
  H.solve = function (f, lo, hi, iter) {
    var flo = f(lo), fhi = f(hi);
    if (!isNum(flo) || !isNum(fhi) || flo * fhi > 0) return NaN;
    for (var i = 0; i < (iter || 200); i++) {
      var mid = (lo + hi) / 2, fm = f(mid);
      if (fm === 0 || (hi - lo) / 2 < 1e-12) return mid;
      if (fm * flo < 0) { hi = mid; } else { lo = mid; flo = fm; }
    }
    return (lo + hi) / 2;
  };

  /* ---------- finance (positive-value conventions) ---------- */
  H.pmt = function (r, n, pv, fv) {
    fv = fv || 0;
    if (n <= 0) return NaN;
    if (Math.abs(r) < 1e-12) return (pv - fv) / n;
    var g = Math.pow(1 + r, n);
    return (pv * g - fv) * r / (g - 1);
  };
  H.fv = function (r, n, pmt, pv) {
    pv = pv || 0;
    if (Math.abs(r) < 1e-12) return pv + pmt * n;
    var g = Math.pow(1 + r, n);
    return pv * g + pmt * (g - 1) / r;
  };
  H.pvAnn = function (r, n, pmt) {
    if (Math.abs(r) < 1e-12) return pmt * n;
    return pmt * (1 - Math.pow(1 + r, -n)) / r;
  };
  H.nper = function (r, pmt, pv) {
    if (pmt <= 0) return Infinity;
    if (Math.abs(r) < 1e-12) return pv / pmt;
    if (pmt <= pv * r) return Infinity;
    return -Math.log(1 - pv * r / pmt) / Math.log(1 + r);
  };
  H.npv = function (r, cfs) {
    var s = 0;
    for (var i = 0; i < cfs.length; i++) s += cfs[i] / Math.pow(1 + r, i);
    return s;
  };
  H.irr = function (cfs) {
    var f = function (r) { return H.npv(r, cfs); };
    var r = 0.1;
    for (var i = 0; i < 100; i++) {
      var v = f(r), d = (f(r + 1e-6) - v) / 1e-6;
      if (!isNum(d) || d === 0) break;
      var nr = r - v / d;
      if (!isNum(nr) || nr <= -0.9999) break;
      if (Math.abs(nr - r) < 1e-10) return nr;
      r = nr;
    }
    return H.solve(f, -0.9999, 10);
  };
  /* amortization: annual rate in %, months; returns payment, schedule, totals */
  H.amort = function (pv, ratePct, months, extra, pmtOverride) {
    var r = ratePct / 100 / 12;
    var pay = pmtOverride || H.pmt(r, months, pv);
    extra = extra || 0;
    var bal = pv, sched = [], totInt = 0, m = 0;
    while (bal > 0.005 && m < 1200) {
      m++;
      var int = bal * r;
      var prin = Math.min(bal, pay + extra - int);
      if (prin <= 0) { return { payment: pay, months: Infinity, totalInterest: Infinity, schedule: sched }; }
      bal -= prin; totInt += int;
      sched.push({ m: m, payment: int + prin, interest: int, principal: prin, balance: Math.max(0, bal) });
    }
    return { payment: pay, months: m, totalInterest: totInt, schedule: sched };
  };

  /* ---------- dates (UTC-midnight Date objects) ---------- */
  H.today = function () {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  H.parseDate = function (s) {
    if (s instanceof Date) return s;
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(s || ''));
    if (!m) return null;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return isNaN(d) ? null : d;
  };
  H.iso = function (d) { return d.toISOString().slice(0, 10); };
  H.fmtDate = function (d, long) {
    d = H.parseDate(d) || d;
    if (!(d instanceof Date) || isNaN(d)) return '—';
    return d.toLocaleDateString('en-US', long ? { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } : { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
  };
  H.addDays = function (d, n) { return new Date(d.getTime() + Math.round(n) * 864e5); };
  H.addMonths = function (d, n) {
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + n, day = d.getUTCDate();
    var last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    return new Date(Date.UTC(y, m, Math.min(day, last)));
  };
  H.daysBetween = function (a, b) { return Math.round((b.getTime() - a.getTime()) / 864e5); };
  H.ymdDiff = function (a, b) {
    var sign = 1; if (b < a) { var t = a; a = b; b = t; sign = -1; }
    var y = b.getUTCFullYear() - a.getUTCFullYear(), m = b.getUTCMonth() - a.getUTCMonth(), d = b.getUTCDate() - a.getUTCDate();
    if (d < 0) { m--; d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate(); }
    if (m < 0) { y--; m += 12; }
    return { y: y * sign, m: m * sign, d: d * sign };
  };
  H.weekday = function (d) { return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getUTCDay()]; };
  H.isLeap = function (y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; };

  /* ---------- distributions ---------- */
  H.erfc = function (x) {
    var z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  };
  H.normCdf = function (z) { return 0.5 * H.erfc(-z / Math.SQRT2); };
  H.normInv = function (p) {
    if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    var pl = 0.02425, q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  };
  H.gammaln = function (x) {
    var g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x, tmp = x + 5.5; tmp -= (x + 0.5) * Math.log(tmp);
    var ser = 1.000000000190015;
    for (var j = 0; j < 6; j++) ser += g[j] / ++y;
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  };
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; var h = d;
    for (var m = 1; m <= 300; m++) {
      var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d;
      var del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break;
    }
    return h;
  }
  H.betainc = function (x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    var bt = Math.exp(H.gammaln(a + b) - H.gammaln(a) - H.gammaln(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  };
  H.gammainc = function (a, x) { /* regularized lower P(a,x) */
    if (x <= 0) return 0;
    var gln = H.gammaln(a);
    if (x < a + 1) {
      var ap = a, sum = 1 / a, del = sum;
      for (var n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 3e-15) break; }
      return sum * Math.exp(-x + a * Math.log(x) - gln);
    }
    var b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
    for (var i = 1; i < 500; i++) {
      var an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; var dl = d * c; h *= dl; if (Math.abs(dl - 1) < 3e-15) break;
    }
    return 1 - Math.exp(-x + a * Math.log(x) - gln) * h;
  };
  H.tCdf = function (t, df) {
    var x = df / (df + t * t), p = 0.5 * H.betainc(x, df / 2, 0.5);
    return t >= 0 ? 1 - p : p;
  };
  H.tInv = function (p, df) { return H.solve(function (t) { return H.tCdf(t, df) - p; }, -1e4, 1e4); };
  H.chi2Cdf = function (x, k) { return H.gammainc(k / 2, x / 2); };
  H.chi2Inv = function (p, k) { return H.solve(function (x) { return H.chi2Cdf(x, k) - p; }, 0, 1e5); };
  H.fCdf = function (x, d1, d2) { return x <= 0 ? 0 : H.betainc(d1 * x / (d1 * x + d2), d1 / 2, d2 / 2); };
  H.pearson = function (xs, ys) {
    var n = Math.min(xs.length, ys.length); if (n < 2) return NaN;
    var mx = H.mean(xs.slice(0, n)), my = H.mean(ys.slice(0, n)), sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); syy += (ys[i] - my) * (ys[i] - my); }
    return sxy / Math.sqrt(sxx * syy);
  };
  H.linreg = function (xs, ys) {
    var n = Math.min(xs.length, ys.length);
    var mx = H.mean(xs.slice(0, n)), my = H.mean(ys.slice(0, n)), sxy = 0, sxx = 0;
    for (var i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
    var m = sxy / sxx; return { slope: m, intercept: my - m * mx, n: n };
  };
  return H;
})();
if (typeof module !== 'undefined') module.exports = H;
