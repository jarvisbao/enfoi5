define('ace/mode/toml_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(e, t, n) { 'use strict'; var r = e('../lib/oop'); var i = e('./text_highlight_rules').TextHighlightRules; var s = function() { var e = this.createKeywordMapper({ 'constant.language.boolean': 'true|false' }, 'identifier'); var t = '[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b'; this.$rules = { start: [{ token: 'comment.toml', regex: /#.*$/ }, { token: 'string', regex: '"(?=.)', next: 'qqstring' }, { token: ['variable.keygroup.toml'], regex: '(?:^\\s*)(\\[\\[([^\\]]+)\\]\\])' }, { token: ['variable.keygroup.toml'], regex: '(?:^\\s*)(\\[([^\\]]+)\\])' }, { token: e, regex: t }, { token: 'support.date.toml', regex: '\\d{4}-\\d{2}-\\d{2}(T)\\d{2}:\\d{2}:\\d{2}(Z)' }, { token: 'constant.numeric.toml', regex: '-?\\d+(\\.?\\d+)?' }], qqstring: [{ token: 'string', regex: '\\\\$', next: 'qqstring' }, { token: 'constant.language.escape', regex: '\\\\[0tnr"\\\\]' }, { token: 'string', regex: '"|$', next: 'start' }, { defaultToken: 'string' }] } }; r.inherits(s, i), t.TomlHighlightRules = s }), define('ace/mode/folding/ini', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], function(e, t, n) { 'use strict'; var r = e('../../lib/oop'); var i = e('../../range').Range; var s = e('./fold_mode').FoldMode; var o = t.FoldMode = function() {}; r.inherits(o, s), function() { this.foldingStartMarker = /^\s*\[([^\])]*)]\s*(?:$|[;#])/, this.getFoldWidgetRange = function(e, t, n) { var r = this.foldingStartMarker; var s = e.getLine(n); var o = s.match(r); if (!o) return; var u = o[1] + '.'; var a = s.length; var f = e.getLength(); var l = n; var c = n; while (++n < f) { s = e.getLine(n); if (/^\s*$/.test(s)) continue; o = s.match(r); if (o && o[1].lastIndexOf(u, 0) !== 0) break; c = n } if (c > l) { var h = e.getLine(c).length; return new i(l, a, c, h) } } }.call(o.prototype) }), define('ace/mode/toml', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/toml_highlight_rules', 'ace/mode/folding/ini'], function(e, t, n) { 'use strict'; var r = e('../lib/oop'); var i = e('./text').Mode; var s = e('./toml_highlight_rules').TomlHighlightRules; var o = e('./folding/ini').FoldMode; var u = function() { this.HighlightRules = s, this.foldingRules = new o(), this.$behaviour = this.$defaultBehaviour }; r.inherits(u, i), function() { this.lineCommentStart = '#', this.$id = 'ace/mode/toml' }.call(u.prototype), t.Mode = u });
(function() {
  window.require(['ace/mode/toml'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()