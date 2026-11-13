/* Result renderer shared by the build (server HTML) and the browser runtime.
   Depends on H (helpers.js). Produces an HTML string. */
var renderResult = function (r, H) {
  if (!r || typeof r !== 'object') r = { error: 'Enter your numbers to see the answer.' };
  if (r.error) {
    return '<div class="display is-error"><span class="led"></span><div class="dv"><div class="expr">hmm</div><div class="value value-sm">' + H.esc(r.error) + '</div></div></div>';
  }
  var v = String(r.value == null ? '—' : r.value);
  var size = v.replace(/<[^>]+>/g, '').length > 14 ? ' value-sm' : (v.replace(/<[^>]+>/g, '').length > 9 ? ' value-md' : '');
  var out = '<div class="display"><span class="led"></span><div class="dv">' +
    (r.expr ? '<div class="expr">' + r.expr + '</div>' : '') +
    '<div class="value' + size + '">' + v + '</div></div></div>';
  if (r.label) out += '<div class="rlabel">' + r.label + '</div>';
  if (r.rows && r.rows.length) {
    out += '<dl class="rrows">';
    for (var i = 0; i < r.rows.length; i++) {
      var row = r.rows[i]; if (!row) continue;
      out += '<div' + (row[2] ? ' class="hl"' : '') + '><dt>' + row[0] + '</dt><dd>' + row[1] + '</dd></div>';
    }
    out += '</dl>';
  }
  if (r.sub) out += '<p class="rsub">' + r.sub + '</p>';
  if (r.table && r.table.rows && r.table.rows.length) {
    out += '<div class="twrap rtable"><table>';
    if (r.table.caption) out += '<caption>' + r.table.caption + '</caption>';
    if (r.table.head) out += '<thead><tr>' + r.table.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead>';
    out += '<tbody>' + r.table.rows.map(function (row) { return '<tr>' + row.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  return out;
};
if (typeof module !== 'undefined') module.exports = renderResult;
