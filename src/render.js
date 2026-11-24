/* Result renderer shared by the build (server HTML) and the browser runtime.
   Depends on H (helpers.js). Produces an HTML string.
   notes: optional { 'Row label': 'one-line explanation' } shown under each result row. */
var renderResult = function (r, H, notes) {
  if (!r || typeof r !== 'object') r = { error: 'Enter your numbers to see your results.' };
  if (r.error) {
    return '<div class="r-main is-error"><p class="r-label">Check your numbers</p><p class="r-value r-sm">' + H.esc(r.error) + '</p></div>';
  }
  notes = notes || {};
  var plain = function (s) { return String(s == null ? '' : s).replace(/<[^>]+>/g, ''); };
  var v = String(r.value == null ? '—' : r.value);
  var n = plain(v).length;
  var size = n > 16 ? ' r-sm' : (n > 10 ? ' r-md' : '');
  var out = '<div class="r-main">' +
    (r.label ? '<p class="r-label">' + r.label + '</p>' : '') +
    '<p class="r-value' + size + '">' + v + '</p>' +
    (r.expr ? '<p class="r-expr">' + r.expr + '</p>' : '') + '</div>';
  if (r.rows && r.rows.length) {
    out += '<dl class="r-rows">';
    for (var i = 0; i < r.rows.length; i++) {
      var row = r.rows[i]; if (!row) continue;
      var note = notes[plain(row[0])];
      out += '<div' + (row[2] ? ' class="hl"' : '') + '><dt>' + row[0] + (note ? '<small>' + note + '</small>' : '') + '</dt><dd>' + row[1] + '</dd></div>';
    }
    out += '</dl>';
  }
  if (r.table && r.table.rows && r.table.rows.length) {
    out += '<div class="twrap rtable"><table>';
    if (r.table.caption) out += '<caption>' + r.table.caption + '</caption>';
    if (r.table.head) out += '<thead><tr>' + r.table.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead>';
    out += '<tbody>' + r.table.rows.map(function (row) { return '<tr>' + row.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  return out;
};
if (typeof module !== 'undefined') module.exports = renderResult;
