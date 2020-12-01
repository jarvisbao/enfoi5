define('ace/occur', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/range', 'ace/search', 'ace/edit_session', 'ace/search_highlight', 'ace/lib/dom'], function(e, t, n) { 'use strict'; function a() {} var r = e('./lib/oop'); var i = e('./range').Range; var s = e('./search').Search; var o = e('./edit_session').EditSession; var u = e('./search_highlight').SearchHighlight; r.inherits(a, s), function() { this.enter = function(e, t) { if (!t.needle) return !1; var n = e.getCursorPosition(); this.displayOccurContent(e, t); var r = this.originalToOccurPosition(e.session, n); return e.moveCursorToPosition(r), !0 }, this.exit = function(e, t) { var n = t.translatePosition && e.getCursorPosition(); var r = n && this.occurToOriginalPosition(e.session, n); return this.displayOriginalContent(e), r && e.moveCursorToPosition(r), !0 }, this.highlight = function(e, t) { var n = e.$occurHighlight = e.$occurHighlight || e.addDynamicMarker(new u(null, 'ace_occur-highlight', 'text')); n.setRegexp(t), e._emit('changeBackMarker') }, this.displayOccurContent = function(e, t) { this.$originalSession = e.session; var n = this.matchingLines(e.session, t); var r = n.map(function(e) { return e.content }); var i = new o(r.join('\n')); i.$occur = this, i.$occurMatchingLines = n, e.setSession(i), this.$useEmacsStyleLineStart = this.$originalSession.$useEmacsStyleLineStart, i.$useEmacsStyleLineStart = this.$useEmacsStyleLineStart, this.highlight(i, t.re), i._emit('changeBackMarker') }, this.displayOriginalContent = function(e) { e.setSession(this.$originalSession), this.$originalSession.$useEmacsStyleLineStart = this.$useEmacsStyleLineStart }, this.originalToOccurPosition = function(e, t) { var n = e.$occurMatchingLines; var r = { row: 0, column: 0 }; if (!n) return r; for (var i = 0; i < n.length; i++) if (n[i].row === t.row) return { row: i, column: t.column }; return r }, this.occurToOriginalPosition = function(e, t) { var n = e.$occurMatchingLines; return !n || !n[t.row] ? t : { row: n[t.row].row, column: t.column } }, this.matchingLines = function(e, t) { t = r.mixin({}, t); if (!e || !t.needle) return []; var n = new s(); return n.set(t), n.findAll(e).reduce(function(t, n) { var r = n.start.row; var i = t[t.length - 1]; return i && i.row === r ? t : t.concat({ row: r, content: e.getLine(r) }) }, []) } }.call(a.prototype); var f = e('./lib/dom'); f.importCssString('.ace_occur-highlight {\n    border-radius: 4px;\n    background-color: rgba(87, 255, 8, 0.25);\n    position: absolute;\n    z-index: 4;\n    box-sizing: border-box;\n    box-shadow: 0 0 4px rgb(91, 255, 50);\n}\n.ace_dark .ace_occur-highlight {\n    background-color: rgb(80, 140, 85);\n    box-shadow: 0 0 4px rgb(60, 120, 70);\n}\n', 'incremental-occur-highlighting'), t.Occur = a }), define('ace/commands/occur_commands', ['require', 'exports', 'module', 'ace/config', 'ace/occur', 'ace/keyboard/hash_handler', 'ace/lib/oop'], function(e, t, n) { function f() {} var r = e('../config'); var i = e('../occur').Occur; var s = { name: 'occur', exec: function(e, t) { var n = !!e.session.$occur; var r = (new i()).enter(e, t); r && !n && f.installIn(e) }, readOnly: !0 }; var o = [{ name: 'occurexit', bindKey: 'esc|Ctrl-G', exec: function(e) { var t = e.session.$occur; if (!t) return; t.exit(e, {}), e.session.$occur || f.uninstallFrom(e) }, readOnly: !0 }, { name: 'occuraccept', bindKey: 'enter', exec: function(e) { var t = e.session.$occur; if (!t) return; t.exit(e, { translatePosition: !0 }), e.session.$occur || f.uninstallFrom(e) }, readOnly: !0 }]; var u = e('../keyboard/hash_handler').HashHandler; var a = e('../lib/oop'); a.inherits(f, u), function() { this.isOccurHandler = !0, this.attach = function(e) { u.call(this, o, e.commands.platform), this.$editor = e }; var e = this.handleKeyboard; this.handleKeyboard = function(t, n, r, i) { var s = e.call(this, t, n, r, i); return s && s.command ? s : undefined } }.call(f.prototype), f.installIn = function(e) { var t = new this(); e.keyBinding.addKeyboardHandler(t), e.commands.addCommands(o) }, f.uninstallFrom = function(e) { e.commands.removeCommands(o); var t = e.getKeyboardHandler(); t.isOccurHandler && e.keyBinding.removeKeyboardHandler(t) }, t.occurStartCommand = s }), define('ace/commands/incremental_search_commands', ['require', 'exports', 'module', 'ace/config', 'ace/lib/oop', 'ace/keyboard/hash_handler', 'ace/commands/occur_commands'], function(e, t, n) { function u(e) { this.$iSearch = e } var r = e('../config'); var i = e('../lib/oop'); var s = e('../keyboard/hash_handler').HashHandler; var o = e('./occur_commands').occurStartCommand; t.iSearchStartCommands = [{ name: 'iSearch', bindKey: { win: 'Ctrl-F', mac: 'Command-F' }, exec: function(e, t) { r.loadModule(['core', 'ace/incremental_search'], function(n) { var r = n.iSearch = n.iSearch || new n.IncrementalSearch(); r.activate(e, t.backwards), t.jumpToFirstMatch && r.next(t) }) }, readOnly: !0 }, { name: 'iSearchBackwards', exec: function(e, t) { e.execCommand('iSearch', { backwards: !0 }) }, readOnly: !0 }, { name: 'iSearchAndGo', bindKey: { win: 'Ctrl-K', mac: 'Command-G' }, exec: function(e, t) { e.execCommand('iSearch', { jumpToFirstMatch: !0, useCurrentOrPrevSearch: !0 }) }, readOnly: !0 }, { name: 'iSearchBackwardsAndGo', bindKey: { win: 'Ctrl-Shift-K', mac: 'Command-Shift-G' }, exec: function(e) { e.execCommand('iSearch', { jumpToFirstMatch: !0, backwards: !0, useCurrentOrPrevSearch: !0 }) }, readOnly: !0 }], t.iSearchCommands = [{ name: 'restartSearch', bindKey: { win: 'Ctrl-F', mac: 'Command-F' }, exec: function(e) { e.cancelSearch(!0) } }, { name: 'searchForward', bindKey: { win: 'Ctrl-S|Ctrl-K', mac: 'Ctrl-S|Command-G' }, exec: function(e, t) { t.useCurrentOrPrevSearch = !0, e.next(t) } }, { name: 'searchBackward', bindKey: { win: 'Ctrl-R|Ctrl-Shift-K', mac: 'Ctrl-R|Command-Shift-G' }, exec: function(e, t) { t.useCurrentOrPrevSearch = !0, t.backwards = !0, e.next(t) } }, { name: 'extendSearchTerm', exec: function(e, t) { e.addString(t) } }, { name: 'extendSearchTermSpace', bindKey: 'space', exec: function(e) { e.addString(' ') } }, { name: 'shrinkSearchTerm', bindKey: 'backspace', exec: function(e) { e.removeChar() } }, { name: 'confirmSearch', bindKey: 'return', exec: function(e) { e.deactivate() } }, { name: 'cancelSearch', bindKey: 'esc|Ctrl-G', exec: function(e) { e.deactivate(!0) } }, { name: 'occurisearch', bindKey: 'Ctrl-O', exec: function(e) { var t = i.mixin({}, e.$options); e.deactivate(), o.exec(e.$editor, t) } }, { name: 'yankNextWord', bindKey: 'Ctrl-w', exec: function(e) { var t = e.$editor; var n = t.selection.getRangeOfMovements(function(e) { e.moveCursorWordRight() }); var r = t.session.getTextRange(n); e.addString(r) } }, { name: 'yankNextChar', bindKey: 'Ctrl-Alt-y', exec: function(e) { var t = e.$editor; var n = t.selection.getRangeOfMovements(function(e) { e.moveCursorRight() }); var r = t.session.getTextRange(n); e.addString(r) } }, { name: 'recenterTopBottom', bindKey: 'Ctrl-l', exec: function(e) { e.$editor.execCommand('recenterTopBottom') } }, { name: 'selectAllMatches', bindKey: 'Ctrl-space', exec: function(e) { var t = e.$editor; var n = t.session.$isearchHighlight; var r = n && n.cache ? n.cache.reduce(function(e, t) { return e.concat(t || []) }, []) : []; e.deactivate(!1), r.forEach(t.selection.addRange.bind(t.selection)) } }, { name: 'searchAsRegExp', bindKey: 'Alt-r', exec: function(e) { e.convertNeedleToRegExp() } }].map(function(e) { return e.readOnly = !0, e.isIncrementalSearchCommand = !0, e.scrollIntoView = 'animate-cursor', e }), i.inherits(u, s), function() { this.attach = function(e) { var n = this.$iSearch; s.call(this, t.iSearchCommands, e.commands.platform), this.$commandExecHandler = e.commands.addEventListener('exec', function(t) { if (!t.command.isIncrementalSearchCommand) return n.deactivate(); t.stopPropagation(), t.preventDefault(); var r = e.session.getScrollTop(); var i = t.command.exec(n, t.args || {}); return e.renderer.scrollCursorIntoView(null, 0.5), e.renderer.animateScrolling(r), i }) }, this.detach = function(e) { if (!this.$commandExecHandler) return; e.commands.removeEventListener('exec', this.$commandExecHandler), delete this.$commandExecHandler }; var e = this.handleKeyboard; this.handleKeyboard = function(t, n, r, i) { if ((n === 1 || n === 8) && r === 'v' || n === 1 && r === 'y') return null; var s = e.call(this, t, n, r, i); if (s.command) return s; if (n == -1) { var o = this.commands.extendSearchTerm; if (o) return { command: o, args: r } } return !1 } }.call(u.prototype), t.IncrementalSearchKeyboardHandler = u }), define('ace/incremental_search', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/range', 'ace/search', 'ace/search_highlight', 'ace/commands/incremental_search_commands', 'ace/lib/dom', 'ace/commands/command_manager', 'ace/editor', 'ace/config'], function(e, t, n) { 'use strict'; function f() { this.$options = { wrap: !1, skipCurrent: !1 }, this.$keyboardHandler = new a(this) } function l(e) { return e instanceof RegExp } function c(e) { var t = String(e); var n = t.indexOf('/'); var r = t.lastIndexOf('/'); return { expression: t.slice(n + 1, r), flags: t.slice(r + 1) } } function h(e, t) { try { return new RegExp(e, t) } catch (n) { return e } } function p(e) { return h(e.expression, e.flags) } var r = e('./lib/oop'); var i = e('./range').Range; var s = e('./search').Search; var o = e('./search_highlight').SearchHighlight; var u = e('./commands/incremental_search_commands'); var a = u.IncrementalSearchKeyboardHandler; r.inherits(f, s), function() { this.activate = function(e, t) { this.$editor = e, this.$startPos = this.$currentPos = e.getCursorPosition(), this.$options.needle = '', this.$options.backwards = t, e.keyBinding.addKeyboardHandler(this.$keyboardHandler), this.$originalEditorOnPaste = e.onPaste, e.onPaste = this.onPaste.bind(this), this.$mousedownHandler = e.addEventListener('mousedown', this.onMouseDown.bind(this)), this.selectionFix(e), this.statusMessage(!0) }, this.deactivate = function(e) { this.cancelSearch(e); var t = this.$editor; t.keyBinding.removeKeyboardHandler(this.$keyboardHandler), this.$mousedownHandler && (t.removeEventListener('mousedown', this.$mousedownHandler), delete this.$mousedownHandler), t.onPaste = this.$originalEditorOnPaste, this.message('') }, this.selectionFix = function(e) { e.selection.isEmpty() && !e.session.$emacsMark && e.clearSelection() }, this.highlight = function(e) { var t = this.$editor.session; var n = t.$isearchHighlight = t.$isearchHighlight || t.addDynamicMarker(new o(null, 'ace_isearch-result', 'text')); n.setRegexp(e), t._emit('changeBackMarker') }, this.cancelSearch = function(e) { var t = this.$editor; return this.$prevNeedle = this.$options.needle, this.$options.needle = '', e ? (t.moveCursorToPosition(this.$startPos), this.$currentPos = this.$startPos) : t.pushEmacsMark && t.pushEmacsMark(this.$startPos, !1), this.highlight(null), i.fromPoints(this.$currentPos, this.$currentPos) }, this.highlightAndFindWithNeedle = function(e, t) { if (!this.$editor) return null; var n = this.$options; t && (n.needle = t.call(this, n.needle || '') || ''); if (n.needle.length === 0) return this.statusMessage(!0), this.cancelSearch(!0); n.start = this.$currentPos; var r = this.$editor.session; var s = this.find(r); var o = this.$editor.emacsMark ? !!this.$editor.emacsMark() : !this.$editor.selection.isEmpty(); return s && (n.backwards && (s = i.fromPoints(s.end, s.start)), this.$editor.selection.setRange(i.fromPoints(o ? this.$startPos : s.end, s.end)), e && (this.$currentPos = s.end), this.highlight(n.re)), this.statusMessage(s), s }, this.addString = function(e) { return this.highlightAndFindWithNeedle(!1, function(t) { if (!l(t)) return t + e; var n = c(t); return n.expression += e, p(n) }) }, this.removeChar = function(e) { return this.highlightAndFindWithNeedle(!1, function(e) { if (!l(e)) return e.substring(0, e.length - 1); var t = c(e); return t.expression = t.expression.substring(0, t.expression.length - 1), p(t) }) }, this.next = function(e) { return e = e || {}, this.$options.backwards = !!e.backwards, this.$currentPos = this.$editor.getCursorPosition(), this.highlightAndFindWithNeedle(!0, function(t) { return e.useCurrentOrPrevSearch && t.length === 0 ? this.$prevNeedle || '' : t }) }, this.onMouseDown = function(e) { return this.deactivate(), !0 }, this.onPaste = function(e) { this.addString(e) }, this.convertNeedleToRegExp = function() { return this.highlightAndFindWithNeedle(!1, function(e) { return l(e) ? e : h(e, 'ig') }) }, this.convertNeedleToString = function() { return this.highlightAndFindWithNeedle(!1, function(e) { return l(e) ? c(e).expression : e }) }, this.statusMessage = function(e) { var t = this.$options; var n = ''; n += t.backwards ? 'reverse-' : '', n += 'isearch: ' + t.needle, n += e ? '' : ' (not found)', this.message(n) }, this.message = function(e) { this.$editor.showCommandLine ? (this.$editor.showCommandLine(e), this.$editor.focus()) : console.log(e) } }.call(f.prototype), t.IncrementalSearch = f; var d = e('./lib/dom'); d.importCssString && d.importCssString('.ace_marker-layer .ace_isearch-result {  position: absolute;  z-index: 6;  box-sizing: border-box;}div.ace_isearch-result {  border-radius: 4px;  background-color: rgba(255, 200, 0, 0.5);  box-shadow: 0 0 4px rgb(255, 200, 0);}.ace_dark div.ace_isearch-result {  background-color: rgb(100, 110, 160);  box-shadow: 0 0 4px rgb(80, 90, 140);}', 'incremental-search-highlighting'); var v = e('./commands/command_manager'); (function() { this.setupIncrementalSearch = function(e, t) { if (this.usesIncrementalSearch == t) return; this.usesIncrementalSearch = t; var n = u.iSearchStartCommands; var r = t ? 'addCommands' : 'removeCommands'; this[r](n) } }).call(v.CommandManager.prototype); var m = e('./editor').Editor; e('./config').defineOptions(m.prototype, 'editor', { useIncrementalSearch: { set: function(e) { this.keyBinding.$handlers.forEach(function(t) { t.setupIncrementalSearch && t.setupIncrementalSearch(this, e) }), this._emit('incrementalSearchSettingChanged', { isEnabled: e }) } }}) }), define('ace/keyboard/emacs', ['require', 'exports', 'module', 'ace/lib/dom', 'ace/incremental_search', 'ace/commands/incremental_search_commands', 'ace/keyboard/hash_handler', 'ace/lib/keys'], function(e, t, n) { 'use strict'; var r = e('../lib/dom'); e('../incremental_search'); var i = e('../commands/incremental_search_commands'); var s = e('./hash_handler').HashHandler; t.handler = new s(), t.handler.isEmacs = !0, t.handler.$id = 'ace/keyboard/emacs'; var o = !1; var u; var a; t.handler.attach = function(e) { o || (o = !0, r.importCssString('            .emacs-mode .ace_cursor{                border: 1px rgba(50,250,50,0.8) solid!important;                box-sizing: border-box!important;                background-color: rgba(0,250,0,0.9);                opacity: 0.5;            }            .emacs-mode .ace_hidden-cursors .ace_cursor{                opacity: 1;                background-color: transparent;            }            .emacs-mode .ace_overwrite-cursors .ace_cursor {                opacity: 1;                background-color: transparent;                border-width: 0 0 2px 2px !important;            }            .emacs-mode .ace_text-layer {                z-index: 4            }            .emacs-mode .ace_cursor-layer {                z-index: 2            }', 'emacsMode')), u = e.session.$selectLongWords, e.session.$selectLongWords = !0, a = e.session.$useEmacsStyleLineStart, e.session.$useEmacsStyleLineStart = !0, e.session.$emacsMark = null, e.session.$emacsMarkRing = e.session.$emacsMarkRing || [], e.emacsMark = function() { return this.session.$emacsMark }, e.setEmacsMark = function(e) { this.session.$emacsMark = e }, e.pushEmacsMark = function(e, t) { var n = this.session.$emacsMark; n && this.session.$emacsMarkRing.push(n), !e || t ? this.setEmacsMark(e) : this.session.$emacsMarkRing.push(e) }, e.popEmacsMark = function() { var e = this.emacsMark(); return e ? (this.setEmacsMark(null), e) : this.session.$emacsMarkRing.pop() }, e.getLastEmacsMark = function(e) { return this.session.$emacsMark || this.session.$emacsMarkRing.slice(-1)[0] }, e.emacsMarkForSelection = function(e) { var t = this.selection; var n = this.multiSelect ? this.multiSelect.getAllRanges().length : 1; var r = t.index || 0; var i = this.session.$emacsMarkRing; var s = i.length - (n - r); var o = i[s] || t.anchor; return e && i.splice(s, 1, 'row' in e && 'column' in e ? e : undefined), o }, e.on('click', l), e.on('changeSession', f), e.renderer.$blockCursor = !0, e.setStyle('emacs-mode'), e.commands.addCommands(d), t.handler.platform = e.commands.platform, e.$emacsModeHandler = this, e.addEventListener('copy', this.onCopy), e.addEventListener('paste', this.onPaste) }, t.handler.detach = function(e) { e.renderer.$blockCursor = !1, e.session.$selectLongWords = u, e.session.$useEmacsStyleLineStart = a, e.removeEventListener('click', l), e.removeEventListener('changeSession', f), e.unsetStyle('emacs-mode'), e.commands.removeCommands(d), e.removeEventListener('copy', this.onCopy), e.removeEventListener('paste', this.onPaste), e.$emacsModeHandler = null }; var f = function(e) { e.oldSession && (e.oldSession.$selectLongWords = u, e.oldSession.$useEmacsStyleLineStart = a), u = e.session.$selectLongWords, e.session.$selectLongWords = !0, a = e.session.$useEmacsStyleLineStart, e.session.$useEmacsStyleLineStart = !0, e.session.hasOwnProperty('$emacsMark') || (e.session.$emacsMark = null), e.session.hasOwnProperty('$emacsMarkRing') || (e.session.$emacsMarkRing = []) }; var l = function(e) { e.editor.session.$emacsMark = null }; var c = e('../lib/keys').KEY_MODS; var h = { C: 'ctrl', S: 'shift', M: 'alt', CMD: 'command' }; var p = ['C-S-M-CMD', 'S-M-CMD', 'C-M-CMD', 'C-S-CMD', 'C-S-M', 'M-CMD', 'S-CMD', 'S-M', 'C-CMD', 'C-M', 'C-S', 'CMD', 'M', 'S', 'C']; p.forEach(function(e) { var t = 0; e.split('-').forEach(function(e) { t |= c[h[e]] }), h[t] = e.toLowerCase() + '-' }), t.handler.onCopy = function(e, n) { if (n.$handlesEmacsOnCopy) return; n.$handlesEmacsOnCopy = !0, t.handler.commands.killRingSave.exec(n), n.$handlesEmacsOnCopy = !1 }, t.handler.onPaste = function(e, t) { t.pushEmacsMark(t.getCursorPosition()) }, t.handler.bindKey = function(e, t) { typeof e === 'object' && (e = e[this.platform]); if (!e) return; var n = this.commandKeyBinding; e.split('|').forEach(function(e) { e = e.toLowerCase(), n[e] = t; var r = e.split(' ').slice(0, -1); r.reduce(function(e, t, n) { var r = e[n - 1] ? e[n - 1] + ' ' : ''; return e.concat([r + t]) }, []).forEach(function(e) { n[e] || (n[e] = 'null') }) }, this) }, t.handler.getStatusText = function(e, t) { var n = ''; return t.count && (n += t.count), t.keyChain && (n += ' ' + t.keyChain), n }, t.handler.handleKeyboard = function(e, t, n, r) { if (r === -1) return undefined; var i = e.editor; i._signal('changeStatus'); if (t == -1) { i.pushEmacsMark(); if (e.count) { var s = (new Array(e.count + 1)).join(n); return e.count = null, { command: 'insertstring', args: s } } } var o = h[t]; if (o == 'c-' || e.count) { var u = parseInt(n[n.length - 1]); if (typeof u === 'number' && !isNaN(u)) return e.count = Math.max(e.count, 0) || 0, e.count = 10 * e.count + u, { command: 'null' } }o && (n = o + n), e.keyChain && (n = e.keyChain += ' ' + n); var a = this.commandKeyBinding[n]; e.keyChain = a == 'null' ? n : ''; if (!a) return undefined; if (a === 'null') return { command: 'null' }; if (a === 'universalArgument') return e.count = -4, { command: 'null' }; var f; typeof a !== 'string' && (f = a.args, a.command && (a = a.command), a === 'goorselect' && (a = i.emacsMark() ? f[1] : f[0], f = null)); if (typeof a === 'string') { (a === 'insertstring' || a === 'splitline' || a === 'togglecomment') && i.pushEmacsMark(), a = this.commands[a] || i.commands.commands[a]; if (!a) return undefined }!a.readOnly && !a.isYank && (e.lastCommand = null), !a.readOnly && i.emacsMark() && i.setEmacsMark(null); if (e.count) { var u = e.count; e.count = 0; if (!a || !a.handlesCount) return { args: f, command: { exec: function(e, t) { for (var n = 0; n < u; n++)a.exec(e, t) }, multiSelectAction: a.multiSelectAction }}; f || (f = {}), typeof f === 'object' && (f.count = u) } return { command: a, args: f } }, t.emacsKeys = { 'Up|C-p': { command: 'goorselect', args: ['golineup', 'selectup'] }, 'Down|C-n': { command: 'goorselect', args: ['golinedown', 'selectdown'] }, 'Left|C-b': { command: 'goorselect', args: ['gotoleft', 'selectleft'] }, 'Right|C-f': { command: 'goorselect', args: ['gotoright', 'selectright'] }, 'C-Left|M-b': { command: 'goorselect', args: ['gotowordleft', 'selectwordleft'] }, 'C-Right|M-f': { command: 'goorselect', args: ['gotowordright', 'selectwordright'] }, 'Home|C-a': { command: 'goorselect', args: ['gotolinestart', 'selecttolinestart'] }, 'End|C-e': { command: 'goorselect', args: ['gotolineend', 'selecttolineend'] }, 'C-Home|S-M-,': { command: 'goorselect', args: ['gotostart', 'selecttostart'] }, 'C-End|S-M-.': { command: 'goorselect', args: ['gotoend', 'selecttoend'] }, 'S-Up|S-C-p': 'selectup', 'S-Down|S-C-n': 'selectdown', 'S-Left|S-C-b': 'selectleft', 'S-Right|S-C-f': 'selectright', 'S-C-Left|S-M-b': 'selectwordleft', 'S-C-Right|S-M-f': 'selectwordright', 'S-Home|S-C-a': 'selecttolinestart', 'S-End|S-C-e': 'selecttolineend', 'S-C-Home': 'selecttostart', 'S-C-End': 'selecttoend', 'C-l': 'recenterTopBottom', 'M-s': 'centerselection', 'M-g': 'gotoline', 'C-x C-p': 'selectall', 'C-Down': { command: 'goorselect', args: ['gotopagedown', 'selectpagedown'] }, 'C-Up': { command: 'goorselect', args: ['gotopageup', 'selectpageup'] }, 'PageDown|C-v': { command: 'goorselect', args: ['gotopagedown', 'selectpagedown'] }, 'PageUp|M-v': { command: 'goorselect', args: ['gotopageup', 'selectpageup'] }, 'S-C-Down': 'selectpagedown', 'S-C-Up': 'selectpageup', 'C-s': 'iSearch', 'C-r': 'iSearchBackwards', 'M-C-s': 'findnext', 'M-C-r': 'findprevious', 'S-M-5': 'replace', Backspace: 'backspace', 'Delete|C-d': 'del', 'Return|C-m': { command: 'insertstring', args: '\n' }, 'C-o': 'splitline', 'M-d|C-Delete': { command: 'killWord', args: 'right' }, 'C-Backspace|M-Backspace|M-Delete': { command: 'killWord', args: 'left' }, 'C-k': 'killLine', 'C-y|S-Delete': 'yank', 'M-y': 'yankRotate', 'C-g': 'keyboardQuit', 'C-w|C-S-W': 'killRegion', 'M-w': 'killRingSave', 'C-Space': 'setMark', 'C-x C-x': 'exchangePointAndMark', 'C-t': 'transposeletters', 'M-u': 'touppercase', 'M-l': 'tolowercase', 'M-/': 'autocomplete', 'C-u': 'universalArgument', 'M-;': 'togglecomment', 'C-/|C-x u|S-C--|C-z': 'undo', 'S-C-/|S-C-x u|C--|S-C-z': 'redo', 'C-x r': 'selectRectangularRegion', 'M-x': { command: 'focusCommandLine', args: 'M-x ' }}, t.handler.bindKeys(t.emacsKeys), t.handler.addCommands({ recenterTopBottom: function(e) { var t = e.renderer; var n = t.$cursorLayer.getPixelPosition(); var r = t.$size.scrollerHeight - t.lineHeight; var i = t.scrollTop; Math.abs(n.top - i) < 2 ? i = n.top - r : Math.abs(n.top - i - r * 0.5) < 2 ? i = n.top : i = n.top - r * 0.5, e.session.setScrollTop(i) }, selectRectangularRegion: function(e) { e.multiSelect.toggleBlockSelection() }, setMark: { exec: function(e, t) { function u() { var t = e.popEmacsMark(); t && e.moveCursorToPosition(t) } if (t && t.count) { e.inMultiSelectMode ? e.forEachSelection(u) : u(), u(); return } var n = e.emacsMark(); var r = e.selection.getAllRanges(); var i = r.map(function(e) { return { row: e.start.row, column: e.start.column } }); var s = !0; var o = r.every(function(e) { return e.isEmpty() }); if (s && (n || !o)) { e.inMultiSelectMode ? e.forEachSelection({ exec: e.clearSelection.bind(e) }) : e.clearSelection(), n && e.pushEmacsMark(null); return } if (!n) { i.forEach(function(t) { e.pushEmacsMark(t) }), e.setEmacsMark(i[i.length - 1]); return } }, readOnly: !0, handlesCount: !0 }, exchangePointAndMark: { exec: function(t, n) { var r = t.selection; if (!n.count && !r.isEmpty()) { r.setSelectionRange(r.getRange(), !r.isBackwards()); return } if (n.count) { var i = { row: r.lead.row, column: r.lead.column }; r.clearSelection(), r.moveCursorToPosition(t.emacsMarkForSelection(i)) } else r.selectToPosition(t.emacsMarkForSelection()) }, readOnly: !0, handlesCount: !0, multiSelectAction: 'forEach' }, killWord: { exec: function(e, n) { e.clearSelection(), n == 'left' ? e.selection.selectWordLeft() : e.selection.selectWordRight(); var r = e.getSelectionRange(); var i = e.session.getTextRange(r); t.killRing.add(i), e.session.remove(r), e.clearSelection() }, multiSelectAction: 'forEach' }, killLine: function(e) { e.pushEmacsMark(null), e.clearSelection(); var n = e.getSelectionRange(); var r = e.session.getLine(n.start.row); n.end.column = r.length, r = r.substr(n.start.column); var i = e.session.getFoldLine(n.start.row); i && n.end.row != i.end.row && (n.end.row = i.end.row, r = 'x'), /^\s*$/.test(r) && (n.end.row++, r = e.session.getLine(n.end.row), n.end.column = /^\s*$/.test(r) ? r.length : 0); var s = e.session.getTextRange(n); e.prevOp.command == this ? t.killRing.append(s) : t.killRing.add(s), e.session.remove(n), e.clearSelection() }, yank: function(e) { e.onPaste(t.killRing.get() || ''), e.keyBinding.$data.lastCommand = 'yank' }, yankRotate: function(e) { if (e.keyBinding.$data.lastCommand != 'yank') return; e.undo(), e.session.$emacsMarkRing.pop(), e.onPaste(t.killRing.rotate()), e.keyBinding.$data.lastCommand = 'yank' }, killRegion: { exec: function(e) { t.killRing.add(e.getCopyText()), e.commands.byName.cut.exec(e), e.setEmacsMark(null) }, readOnly: !0, multiSelectAction: 'forEach' }, killRingSave: { exec: function(e) { e.$handlesEmacsOnCopy = !0; var n = e.session.$emacsMarkRing.slice(); var r = []; t.killRing.add(e.getCopyText()), setTimeout(function() { function t() { var t = e.selection; var n = t.getRange(); var i = t.isBackwards() ? n.end : n.start; r.push({ row: i.row, column: i.column }), t.clearSelection() }e.$handlesEmacsOnCopy = !1, e.inMultiSelectMode ? e.forEachSelection({ exec: t }) : t(), e.session.$emacsMarkRing = n.concat(r.reverse()) }, 0) }, readOnly: !0 }, keyboardQuit: function(e) { e.selection.clearSelection(), e.setEmacsMark(null), e.keyBinding.$data.count = null }, focusCommandLine: function(e, t) { e.showCommandLine && e.showCommandLine(t) } }), t.handler.addCommands(i.iSearchStartCommands); var d = t.handler.commands; d.yank.isYank = !0, d.yankRotate.isYank = !0, t.killRing = { $data: [], add: function(e) { e && this.$data.push(e), this.$data.length > 30 && this.$data.shift() }, append: function(e) { var t = this.$data.length - 1; var n = this.$data[t] || ''; e && (n += e), n && (this.$data[t] = n) }, get: function(e) { return e = e || 1, this.$data.slice(this.$data.length - e, this.$data.length).reverse().join('\n') }, pop: function() { return this.$data.length > 1 && this.$data.pop(), this.get() }, rotate: function() { return this.$data.unshift(this.$data.pop()), this.get() } } });
(function() {
  window.require(['ace/keyboard/emacs'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()
