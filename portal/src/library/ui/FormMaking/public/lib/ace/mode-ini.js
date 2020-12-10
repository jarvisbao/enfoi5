define('ace/mode/ini_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(e, t, n) { 'use strict'; var r = e('../lib/oop'); var i = e('./text_highlight_rules').TextHighlightRules; var s = '\\\\(?:[\\\\0abtrn;#=:]|x[a-fA-F\\d]{4})'; var o = function() { this.$rules = { start: [{ token: 'punctuation.definition.comment.ini', regex: '#.*', push_: [{ token: 'comment.line.number-sign.ini', regex: '$|^', next: 'pop' }, { defaultToken: 'comment.line.number-sign.ini' }] }, { token: 'punctuation.definition.comment.ini', regex: ';.*', push_: [{ token: 'comment.line.semicolon.ini', regex: '$|^', next: 'pop' }, { defaultToken: 'comment.line.semicolon.ini' }] }, { token: ['keyword.other.definition.ini', 'text', 'punctuation.separator.key-value.ini'], regex: '\\b([a-zA-Z0-9_.-]+)\\b(\\s*)(=)' }, { token: ['punctuation.definition.entity.ini', 'constant.section.group-title.ini', 'punctuation.definition.entity.ini'], regex: '^(\\[)(.*?)(\\])' }, { token: 'punctuation.definition.string.begin.ini', regex: "'", push: [{ token: 'punctuation.definition.string.end.ini', regex: "'", next: 'pop' }, { token: 'constant.language.escape', regex: s }, { defaultToken: 'string.quoted.single.ini' }] }, { token: 'punctuation.definition.string.begin.ini', regex: '"', push: [{ token: 'constant.language.escape', regex: s }, { token: 'punctuation.definition.string.end.ini', regex: '"', next: 'pop' }, { defaultToken: 'string.quoted.double.ini' }] }] }, this.normalizeRules() }; o.metaData = { fileTypes: ['ini', 'conf'], keyEquivalent: '^~I', name: 'Ini', scopeName: 'source.ini' }, r.inherits(o, i), t.IniHighlightRules = o }), define('ace/mode/folding/ini', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], function(e, t, n) { 'use strict'; var r = e('../../lib/oop'); var i = e('../../range').Range; var s = e('./fold_mode').FoldMode; var o = t.FoldMode = function() {}; r.inherits(o, s), function() { this.foldingStartMarker = /^\s*\[([^\])]*)]\s*(?:$|[;#])/, this.getFoldWidgetRange = function(e, t, n) { var r = this.foldingStartMarker; var s = e.getLine(n); var o = s.match(r); if (!o) return; var u = o[1] + '.'; var a = s.length; var f = e.getLength(); var l = n; var c = n; while (++n < f) { s = e.getLine(n); if (/^\s*$/.test(s)) continue; o = s.match(r); if (o && o[1].lastIndexOf(u, 0) !== 0) break; c = n } if (c > l) { var h = e.getLine(c).length; return new i(l, a, c, h) } } }.call(o.prototype) }), define('ace/mode/ini', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/ini_highlight_rules', 'ace/mode/folding/ini'], function(e, t, n) { 'use strict'; var r = e('../lib/oop'); var i = e('./text').Mode; var s = e('./ini_highlight_rules').IniHighlightRules; var o = e('./folding/ini').FoldMode; var u = function() { this.HighlightRules = s, this.foldingRules = new o(), this.$behaviour = this.$defaultBehaviour }; r.inherits(u, i), function() { this.lineCommentStart = ';', this.blockComment = null, this.$id = 'ace/mode/ini' }.call(u.prototype), t.Mode = u });
(function() {
  window.require(['ace/mode/ini'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()