/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 128 2006-10-22 19:55:28Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('fullscreen');

var TinyMCE_FullScreenPlugin = {
	getInfo : function() {
		return {
			longname : 'Fullscreen',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_fullscreen.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	initInstance : function(inst) {
		if (!tinyMCE.settings['fullscreen_skip_plugin_css'])
			tinyMCE.importCSS(inst.getDoc(), tinyMCE.baseURL + "/plugins/fullscreen/css/content.css");
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "fullscreen":
				return tinyMCE.getButtonHTML(cn, 'lang_fullscreen_desc', '{$pluginurl}/images/fullscreen.gif', 'mceFullScreen');
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle commands
		switch (command) {
			case "mceFullScreen":
				this._toggleFullscreen(tinyMCE.getInstanceById(editor_id));
				return true;
		}

		// Pass to next handler in chain
		return false;
	},

	_toggleFullscreen : function(inst) {
		var ds = inst.getData('fullscreen'), editorContainer, tableElm, iframe, vp, cw, cd, re, w, h, si;

		cw = inst.getContainerWin();
		cd = cw.document;
		editorContainer = cd.getElementById(inst.editorId + '_parent');
		tableElm = editorContainer.firstChild;
		iframe = inst.iframeElement;
		re = cd.getElementById(inst.editorId + '_resize');

		if (!ds.enabled) {
			ds.parents = [];

			tinyMCE.getParentNode(tableElm.parentNode, function (n) {
				var st = n.style;

				if (n.nodeType == 1 && st) {
					if (n.nodeName == 'BODY')
						return true;

					ds.parents.push({
						el : n,
						position : st.position,
						left : st.left,
						top : st.top,
						right : st.right,
						bottom : st.bottom,
						width : st.width,
						height : st.height,
						margin : st.margin,
						padding : st.padding,
						border : st.border
					});

					st.position = 'static';
					st.left = st.top = st.margin = st.padding = st.border = '0';
					st.width = st.height = st.right = st.bottom = 'auto';
				}

				return false;
			});

			ds.oldOverflow = cd.body.style.overflow;
			cd.body.style.overflow = 'hidden';

			if (re)
				re.style.display = 'none';

			vp = tinyMCE.getViewPort(cw);

			ds.oldWidth = iframe.style.width ? iframe.style.width : iframe.offsetWidth;
			ds.oldHeight = iframe.style.height ? iframe.style.height : iframe.offsetHeight;
			ds.oldTWidth = tableElm.style.width ? tableElm.style.width : tableElm.offsetWidth;
			ds.oldTHeight = tableElm.style.height ? tableElm.style.height : tableElm.offsetHeight;

			// Handle % width
			if (ds.oldWidth && ds.oldWidth.indexOf)
				ds.oldTWidth = ds.oldWidth.indexOf('%') != -1 ? ds.oldWidth : ds.oldTWidth;

			tableElm.style.position = 'absolute';
			tableElm.style.zIndex = 1000;
			tableElm.style.left = tableElm.style.top = '0';

			tableElm.style.width = vp.width + 'px';
			tableElm.style.height = vp.height + 'px';

			if (tinyMCE.isRealIE) {
				iframe.style.width = vp.width + 'px';
				iframe.style.height = vp.height + 'px';

				// Calc new width/height based on overflow
				w = iframe.parentNode.clientWidth - (tableElm.offsetWidth - vp.width);
				h = iframe.parentNode.clientHeight - (tableElm.offsetHeight - vp.height);
			} else {
				w = iframe.parentNode.clientWidth;
				h = iframe.parentNode.clientHeight;
			}

			iframe.style.width = w + "px";
			iframe.style.height = h + "px";

			tinyMCE.selectElements(cd, 'SELECT,INPUT,BUTTON,TEXTAREA', function (n) {
				tinyMCE.addCSSClass(n, 'mceItemFullScreenHidden');

				return false;
			});

			tinyMCE.switchClass(inst.editorId + '_fullscreen', 'mceButtonSelected');
			ds.enabled = true;
		} else {
			si = 0;
			tinyMCE.getParentNode(tableElm.parentNode, function (n) {
				var st = n.style, s = ds.parents[si++];

				if (n.nodeName == 'BODY')
					return true;

				if (st) {
					st.position = s.position;
					st.left = s.left;
					st.top = s.top;
					st.bottom = s.bottom;
					st.right = s.right;
					st.width = s.width;
					st.height = s.height;
					st.margin = s.margin;
					st.padding = s.padding;
					st.border = s.border;
				}
			});

			ds.parents = [];

			cd.body.style.overflow = ds.oldOverflow ? ds.oldOverflow : '';

			if (re && tinyMCE.getParam("theme_advanced_resizing", false))
				re.style.display = 'block';

			tableElm.style.position = 'static';
			tableElm.style.zIndex = '';
			tableElm.style.width = '';
			tableElm.style.height = '';

			tableElm.style.width = ds.oldTWidth ? ds.oldTWidth : '';
			tableElm.style.height = ds.oldTHeight ? ds.oldTHeight : '';

			iframe.style.width = ds.oldWidth ? ds.oldWidth : '';
			iframe.style.height = ds.oldHeight ? ds.oldHeight : '';

			tinyMCE.selectElements(cd, 'SELECT,INPUT,BUTTON,TEXTAREA', function (n) {
				tinyMCE.removeCSSClass(n, 'mceItemFullScreenHidden');

				return false;
			});

			tinyMCE.switchClass(inst.editorId + '_fullscreen', 'mceButtonNormal');
			ds.enabled = false;
		}
	}
};

tinyMCE.addPlugin("fullscreen", TinyMCE_FullScreenPlugin);
=======
 * $Id: editor_plugin_src.js 923 2008-09-09 16:45:29Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	var DOM = tinymce.DOM;

	tinymce.create('tinymce.plugins.FullScreenPlugin', {
		init : function(ed, url) {
			var t = this, s = {}, vp;

			t.editor = ed;

			// Register commands
			ed.addCommand('mceFullScreen', function() {
				var win, de = DOM.doc.documentElement;

				if (ed.getParam('fullscreen_is_enabled')) {
					if (ed.getParam('fullscreen_new_window'))
						closeFullscreen(); // Call to close in new window
					else {
						DOM.win.setTimeout(function() {
							tinymce.dom.Event.remove(DOM.win, 'resize', t.resizeFunc);
							tinyMCE.get(ed.getParam('fullscreen_editor_id')).setContent(ed.getContent({format : 'raw'}), {format : 'raw'});
							tinyMCE.remove(ed);
							DOM.remove('mce_fullscreen_container');
							de.style.overflow = ed.getParam('fullscreen_html_overflow');
							DOM.setStyle(DOM.doc.body, 'overflow', ed.getParam('fullscreen_overflow'));
							DOM.win.scrollTo(ed.getParam('fullscreen_scrollx'), ed.getParam('fullscreen_scrolly'));
							tinyMCE.settings = tinyMCE.oldSettings; // Restore old settings
						}, 10);
					}

					return;
				}

				if (ed.getParam('fullscreen_new_window')) {
					win = DOM.win.open(url + "/fullscreen.htm", "mceFullScreenPopup", "fullscreen=yes,menubar=no,toolbar=no,scrollbars=no,resizable=yes,left=0,top=0,width=" + screen.availWidth + ",height=" + screen.availHeight);
					try {
						win.resizeTo(screen.availWidth, screen.availHeight);
					} catch (e) {
						// Ignore
					}
				} else {
					tinyMCE.oldSettings = tinyMCE.settings; // Store old settings
					s.fullscreen_overflow = DOM.getStyle(DOM.doc.body, 'overflow', 1) || 'auto';
					s.fullscreen_html_overflow = DOM.getStyle(de, 'overflow', 1);
					vp = DOM.getViewPort();
					s.fullscreen_scrollx = vp.x;
					s.fullscreen_scrolly = vp.y;

					// Fixes an Opera bug where the scrollbars doesn't reappear
					if (tinymce.isOpera && s.fullscreen_overflow == 'visible')
						s.fullscreen_overflow = 'auto';

					// Fixes an IE bug where horizontal scrollbars would appear
					if (tinymce.isIE && s.fullscreen_overflow == 'scroll')
						s.fullscreen_overflow = 'auto';

					// Fixes an IE bug where the scrollbars doesn't reappear
					if (tinymce.isIE && (s.fullscreen_html_overflow == 'visible' || s.fullscreen_html_overflow == 'scroll'))
						s.fullscreen_html_overflow = 'auto'; 

					if (s.fullscreen_overflow == '0px')
						s.fullscreen_overflow = '';

					DOM.setStyle(DOM.doc.body, 'overflow', 'hidden');
					de.style.overflow = 'hidden'; //Fix for IE6/7
					vp = DOM.getViewPort();
					DOM.win.scrollTo(0, 0);

					if (tinymce.isIE)
						vp.h -= 1;

					n = DOM.add(DOM.doc.body, 'div', {id : 'mce_fullscreen_container', style : 'position:' + (tinymce.isIE6 || (tinymce.isIE && !DOM.boxModel) ? 'absolute' : 'fixed') + ';top:0;left:0;width:' + vp.w + 'px;height:' + vp.h + 'px;z-index:200000;'});
					DOM.add(n, 'div', {id : 'mce_fullscreen'});

					tinymce.each(ed.settings, function(v, n) {
						s[n] = v;
					});

					s.id = 'mce_fullscreen';
					s.width = n.clientWidth;
					s.height = n.clientHeight - 15;
					s.fullscreen_is_enabled = true;
					s.fullscreen_editor_id = ed.id;
					s.theme_advanced_resizing = false;
					s.save_onsavecallback = function() {
						ed.setContent(tinyMCE.get(s.id).getContent({format : 'raw'}), {format : 'raw'});
						ed.execCommand('mceSave');
					};

					tinymce.each(ed.getParam('fullscreen_settings'), function(v, k) {
						s[k] = v;
					});

					if (s.theme_advanced_toolbar_location === 'external')
						s.theme_advanced_toolbar_location = 'top';

					t.fullscreenEditor = new tinymce.Editor('mce_fullscreen', s);
					t.fullscreenEditor.onInit.add(function() {
						t.fullscreenEditor.setContent(ed.getContent());
						t.fullscreenEditor.focus();
					});

					t.fullscreenEditor.render();
					tinyMCE.add(t.fullscreenEditor);

					t.fullscreenElement = new tinymce.dom.Element('mce_fullscreen_container');
					t.fullscreenElement.update();
					//document.body.overflow = 'hidden';

					t.resizeFunc = tinymce.dom.Event.add(DOM.win, 'resize', function() {
						var vp = tinymce.DOM.getViewPort();

						t.fullscreenEditor.theme.resizeTo(vp.w, vp.h);
					});
				}
			});

			// Register buttons
			ed.addButton('fullscreen', {title : 'fullscreen.desc', cmd : 'mceFullScreen'});

			ed.onNodeChange.add(function(ed, cm) {
				cm.setActive('fullscreen', ed.getParam('fullscreen_is_enabled'));
			});
		},

		getInfo : function() {
			return {
				longname : 'Fullscreen',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullscreen',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('fullscreen', tinymce.plugins.FullScreenPlugin);
})();
>>>>>>> deploy
