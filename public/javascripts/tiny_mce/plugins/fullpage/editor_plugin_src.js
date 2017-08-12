/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('fullpage');

var TinyMCE_FullPagePlugin = {
	getInfo : function() {
		return {
			longname : 'Fullpage',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_fullpage.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "fullpage":
				return tinyMCE.getButtonHTML(cn, 'lang_fullpage_desc', '{$pluginurl}/images/fullpage.gif', 'mceFullPageProperties');
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle commands
		switch (command) {
			case "mceFullPageProperties":
				var template = new Array();

				template['file']   = '../../plugins/fullpage/fullpage.htm';
				template['width']  = 430;
				template['height'] = 485 + (tinyMCE.isOpera ? 5 : 0);

				template['width'] += tinyMCE.getLang('lang_fullpage_delta_width', 0);
				template['height'] += tinyMCE.getLang('lang_fullpage_delta_height', 0);

				tinyMCE.openWindow(template, {editor_id : editor_id, inline : "yes"});
			return true;

			case "mceFullPageUpdate":
				TinyMCE_FullPagePlugin._addToHead(tinyMCE.getInstanceById(editor_id));
				return true;
	   }

	   // Pass to next handler in chain
	   return false;
	},

	cleanup : function(type, content, inst) {
		switch (type) {
			case "insert_to_editor":
				var tmp = content.toLowerCase();
				var pos = tmp.indexOf('<body'), pos2;

				// Split page in header and body chunks
				if (pos != -1) {
					pos = tmp.indexOf('>', pos);
					pos2 = tmp.lastIndexOf('</body>');
					inst.fullpageTopContent = content.substring(0, pos + 1);
					content = content.substring(pos + 1, pos2);
					// tinyMCE.debug(inst.fullpageTopContent, content);
				} else {
					if (!inst.fullpageTopContent) {
						var docType = tinyMCE.getParam("fullpage_default_doctype", '<!DOCTYPE html PUBLIC "-/'+'/W3C//DTD XHTML 1.0 Transitional/'+'/EN" "http:/'+'/www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
						var enc = tinyMCE.getParam("fullpage_default_encoding", 'utf-8');
						var title = tinyMCE.getParam("fullpage_default_title", 'Untitled document');
						var lang = tinyMCE.getParam("fullpage_default_langcode", 'en');
						var pi = tinyMCE.getParam("fullpage_default_xml_pi", true);
						var ff = tinyMCE.getParam("fullpage_default_font_family", "");
						var fz = tinyMCE.getParam("fullpage_default_font_size", "");
						var ds = tinyMCE.getParam("fullpage_default_style", "");
						var dtc = tinyMCE.getParam("fullpage_default_text_color", "");

						// Xml encode it
						title = title.replace(/&/g, '&amp;');
						title = title.replace(/\"/g, '&quot;');
						title = title.replace(/</g, '&lt;');
						title = title.replace(/>/g, '&gt;');

						tmp = '';

						// Make default chunk
						if (pi)
							tmp += '<?xml version="1.0" encoding="' + enc + '"?>\n';

						tmp += docType + '\n';
						tmp += '<html xmlns="http:/'+'/www.w3.org/1999/xhtml" lang="' + lang + '" xml:lang="' + lang + '">\n';
						tmp += '<head>\n';
						tmp += '\t<title>' + title + '</title>\n';
						tmp += '\t<meta http-equiv="Content-Type" content="text/html; charset=' + enc + '" />\n';
						tmp += '</head>\n';
						tmp += '<body';

						if (ff != '' || fz != '') {
							tmp += ' style="';

							if (ds != '')
								tmp += ds + ";";

							if (ff != '')
								tmp += 'font-family: ' + ff + ";";

							if (fz != '')
								tmp += 'font-size: ' + fz + ";";

							tmp += '"';
						}

						if (dtc != '')
							tmp += ' text="' + dtc + '"';

						tmp += '>\n';

						inst.fullpageTopContent = tmp;
					}
				}

				this._addToHead(inst);

				break;

			case "get_from_editor":
				if (inst.fullpageTopContent)
					content = inst.fullpageTopContent + content + "\n</body>\n</html>";

				break;
		}

		// Pass through to next handler in chain
		return content;
	},

	// Private plugin internal methods

	_addToHead : function(inst) {
		var doc = inst.getDoc();
		var head = doc.getElementsByTagName("head")[0];
		var body = doc.body;
		var h = inst.fullpageTopContent;
		var e = doc.createElement("body");
		var nl, i, le, tmp;

		// Remove stuff we don't want
		h = h.replace(/(\r|\n)/gi, '');
		h = h.replace(/<\?[^\>]*\>/gi, '');
		h = h.replace(/<\/?(!DOCTYPE|head|html)[^\>]*\>/gi, '');
		h = h.replace(/<script(.*?)<\/script>/gi, '');
		h = h.replace(/<title(.*?)<\/title>/gi, '');
		h = h.replace(/<(meta|base)[^>]*>/gi, '');

		// Make link and style elements into pre
		h = h.replace(/<link([^>]*)\/>/gi, '<pre mce_type="link" $1></pre>');
		//h = h.replace(/<style([^>]*)>(.*?)<\/style>/gi, '<pre mce_type="style" $1>$2</pre>');

		// Make body a div
		h = h.replace(/<body/gi, '<div mce_type="body"');
		h += '</div>';

		// Now crapy MSIE can parse it
		e.innerHTML = h;

		// Reset all body attributes
		body.vLink = body.aLink = body.link = body.text = '';
		body.style.cssText = '';

		// Delete all old links
		nl = head.getElementsByTagName('link');
		for (i=0; i<nl.length; i++) {
			if (tinyMCE.getAttrib(nl[i], 'mce_head') == "true")
				nl[i].parentNode.removeChild(nl[i]);
		}

		// Add link elements
		nl = e.getElementsByTagName('pre');
		for (i=0; i<nl.length; i++) {
			tmp = tinyMCE.getAttrib(nl[i], 'media');
			if (tinyMCE.getAttrib(nl[i], 'mce_type') == "link" && (tmp == "" || tmp == "screen" || tmp == "all") && tinyMCE.getAttrib(nl[i], 'rel') == "stylesheet") {
				le = doc.createElement("link");

				le.rel = "stylesheet";
				le.href = tinyMCE.getAttrib(nl[i], 'href');
				le.setAttribute("mce_head", "true");

				head.appendChild(le);
			}
		}

		// Add body attributes
		nl = e.getElementsByTagName('div');
		if (nl.length > 0) {
			body.style.cssText = tinyMCE.getAttrib(nl[0], 'style');

			if ((tmp = tinyMCE.getAttrib(nl[0], 'leftmargin')) != '' && body.style.marginLeft == '')
				body.style.marginLeft = tmp + "px";

			if ((tmp = tinyMCE.getAttrib(nl[0], 'rightmargin')) != '' && body.style.marginRight == '')
				body.style.marginRight = tmp + "px";

			if ((tmp = tinyMCE.getAttrib(nl[0], 'topmargin')) != '' && body.style.marginTop == '')
				body.style.marginTop = tmp + "px";

			if ((tmp = tinyMCE.getAttrib(nl[0], 'bottommargin')) != '' && body.style.marginBottom == '')
				body.style.marginBottom = tmp + "px";

			body.dir = tinyMCE.getAttrib(nl[0], 'dir');
			body.vLink = tinyMCE.getAttrib(nl[0], 'vlink');
			body.aLink = tinyMCE.getAttrib(nl[0], 'alink');
			body.link = tinyMCE.getAttrib(nl[0], 'link');
			body.text = tinyMCE.getAttrib(nl[0], 'text');

			if ((tmp = tinyMCE.getAttrib(nl[0], 'background')) != '')
				body.style.backgroundImage = "url('" + tmp + "')";

			if ((tmp = tinyMCE.getAttrib(nl[0], 'bgcolor')) != '')
				body.style.backgroundColor = tmp;
		}
	}
};

tinyMCE.addPlugin("fullpage", TinyMCE_FullPagePlugin);
=======
 * $Id: editor_plugin_src.js 1029 2009-02-24 22:32:21Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.FullPagePlugin', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			// Register commands
			ed.addCommand('mceFullPageProperties', function() {
				ed.windowManager.open({
					file : url + '/fullpage.htm',
					width : 430 + parseInt(ed.getLang('fullpage.delta_width', 0)),
					height : 495 + parseInt(ed.getLang('fullpage.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url,
					head_html : t.head
				});
			});

			// Register buttons
			ed.addButton('fullpage', {title : 'fullpage.desc', cmd : 'mceFullPageProperties'});

			ed.onBeforeSetContent.add(t._setContent, t);
			ed.onSetContent.add(t._setBodyAttribs, t);
			ed.onGetContent.add(t._getContent, t);
		},

		getInfo : function() {
			return {
				longname : 'Fullpage',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullpage',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private plugin internal methods

		_setBodyAttribs : function(ed, o) {
			var bdattr, i, len, kv, k, v, t, attr = this.head.match(/body(.*?)>/i);

			if (attr && attr[1]) {
				bdattr = attr[1].match(/\s*(\w+\s*=\s*".*?"|\w+\s*=\s*'.*?'|\w+\s*=\s*\w+|\w+)\s*/g);

				if (bdattr) {
					for(i = 0, len = bdattr.length; i < len; i++) {
						kv = bdattr[i].split('=');
						k = kv[0].replace(/\s/,'');
						v = kv[1];

						if (v) {
							v = v.replace(/^\s+/,'').replace(/\s+$/,'');
							t = v.match(/^["'](.*)["']$/);

							if (t)
								v = t[1];
						} else
							v = k;

						ed.dom.setAttrib(ed.getBody(), 'style', v);
					}
				}
			}
		},

		_createSerializer : function() {
			return new tinymce.dom.Serializer({
				dom : this.editor.dom,
				apply_source_formatting : true
			});
		},

		_setContent : function(ed, o) {
			var t = this, sp, ep, c = o.content, v, st = '';

			if (o.source_view && ed.getParam('fullpage_hide_in_source_view'))
				return;

			// Parse out head, body and footer
			c = c.replace(/<(\/?)BODY/gi, '<$1body');
			sp = c.indexOf('<body');

			if (sp != -1) {
				sp = c.indexOf('>', sp);
				t.head = c.substring(0, sp + 1);

				ep = c.indexOf('</body', sp);
				if (ep == -1)
					ep = c.indexOf('</body', ep);

				o.content = c.substring(sp + 1, ep);
				t.foot = c.substring(ep);

				function low(s) {
					return s.replace(/<\/?[A-Z]+/g, function(a) {
						return a.toLowerCase();
					})
				};

				t.head = low(t.head);
				t.foot = low(t.foot);
			} else {
				t.head = '';
				if (ed.getParam('fullpage_default_xml_pi'))
					t.head += '<?xml version="1.0" encoding="' + ed.getParam('fullpage_default_encoding', 'ISO-8859-1') + '" ?>\n';

				t.head += ed.getParam('fullpage_default_doctype', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
				t.head += '\n<html>\n<head>\n<title>' + ed.getParam('fullpage_default_title', 'Untitled document') + '</title>\n';

				if (v = ed.getParam('fullpage_default_encoding'))
					t.head += '<meta http-equiv="Content-Type" content="' + v + '" />\n';

				if (v = ed.getParam('fullpage_default_font_family'))
					st += 'font-family: ' + v + ';';

				if (v = ed.getParam('fullpage_default_font_size'))
					st += 'font-size: ' + v + ';';

				if (v = ed.getParam('fullpage_default_text_color'))
					st += 'color: ' + v + ';';

				t.head += '</head>\n<body' + (st ? ' style="' + st + '"' : '') + '>\n';
				t.foot = '\n</body>\n</html>';
			}
		},

		_getContent : function(ed, o) {
			var t = this;

			if (!o.source_view || !ed.getParam('fullpage_hide_in_source_view'))
				o.content = tinymce.trim(t.head) + '\n' + tinymce.trim(o.content) + '\n' + tinymce.trim(t.foot);
		}
	});

	// Register plugin
	tinymce.PluginManager.add('fullpage', tinymce.plugins.FullPagePlugin);
})();
>>>>>>> deploy
