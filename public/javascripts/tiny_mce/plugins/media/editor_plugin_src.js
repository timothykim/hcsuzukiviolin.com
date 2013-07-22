/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('media');

var TinyMCE_MediaPlugin = {
	getInfo : function() {
		return {
			longname : 'Media',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_media.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	initInstance : function(inst) {
		if (!tinyMCE.settings['media_skip_plugin_css'])
			tinyMCE.importCSS(inst.getDoc(), tinyMCE.baseURL + "/plugins/media/css/content.css");
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "media":
				return tinyMCE.getButtonHTML(cn, 'lang_media_desc', '{$pluginurl}/images/media.gif', 'mceMedia');
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle commands
		switch (command) {
			case "mceMedia":
				tinyMCE.openWindow({
						file : '../../plugins/media/media.htm',
						width : 430 + tinyMCE.getLang('lang_media_delta_width', 0),
						height : 470 + tinyMCE.getLang('lang_media_delta_height', 0)
					}, {
						editor_id : editor_id,
						inline : "yes"
				});

				return true;
	   }

	   // Pass to next handler in chain
	   return false;
	},

	cleanup : function(type, content, inst) {
		var nl, img, i, ne, d, s, ci;

		switch (type) {
			case "insert_to_editor":
				img = tinyMCE.getParam("theme_href") + '/images/spacer.gif';
				content = content.replace(/<script[^>]*>\s*write(Flash|ShockWave|WindowsMedia|QuickTime|RealMedia)\(\{([^\)]*)\}\);\s*<\/script>/gi, '<img class="mceItem$1" title="$2" src="' + img + '" />');
				content = content.replace(/<object([^>]*)>/gi, '<div class="mceItemObject" $1>');
				content = content.replace(/<embed([^>]*)>/gi, '<div class="mceItemObjectEmbed" $1>');
				content = content.replace(/<\/(object|embed)([^>]*)>/gi, '</div>');
				content = content.replace(/<param([^>]*)>/gi, '<div $1 class="mceItemParam"></div>');
				content = content.replace(new RegExp('\\/ class="mceItemParam"><\\/div>', 'gi'), 'class="mceItemParam"></div>');
				break;

			case "insert_to_editor_dom":
				d = inst.getDoc();
				nl = content.getElementsByTagName("img");
				for (i=0; i<nl.length; i++) {
					if (/mceItem(Flash|ShockWave|WindowsMedia|QuickTime|RealMedia)/.test(nl[i].className)) {
						nl[i].width = nl[i].title.replace(/.*width:[^0-9]?([0-9]+)%?.*/g, '$1');
						nl[i].height = nl[i].title.replace(/.*height:[^0-9]?([0-9]+)%?.*/g, '$1');
						//nl[i].align = nl[i].title.replace(/.*align:([a-z]+).*/gi, '$1');
					}
				}

				nl = tinyMCE.selectElements(content, 'DIV', function (n) {return tinyMCE.hasCSSClass(n, 'mceItemObject');});
				for (i=0; i<nl.length; i++) {
					ci = tinyMCE.getAttrib(nl[i], "classid").toLowerCase().replace(/\s+/g, '');

					switch (ci) {
						case 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000':
							nl[i].parentNode.replaceChild(TinyMCE_MediaPlugin._createImg('mceItemFlash', d, nl[i]), nl[i]);
							break;

						case 'clsid:166b1bca-3f9c-11cf-8075-444553540000':
							nl[i].parentNode.replaceChild(TinyMCE_MediaPlugin._createImg('mceItemShockWave', d, nl[i]), nl[i]);
							break;

						case 'clsid:6bf52a52-394a-11d3-b153-00c04f79faa6':
							nl[i].parentNode.replaceChild(TinyMCE_MediaPlugin._createImg('mceItemWindowsMedia', d, nl[i]), nl[i]);
							break;

						case 'clsid:02bf25d5-8c17-4b23-bc80-d3488abddc6b':
							nl[i].parentNode.replaceChild(TinyMCE_MediaPlugin._createImg('mceItemQuickTime', d, nl[i]), nl[i]);
							break;

						case 'clsid:cfcdaa03-8be4-11cf-b84b-0020afbbccfa':
						case 'clsid:22d6f312-b0f6-11d0-94ab-0080c74c7e95':
						case 'clsid:05589fa1-c356-11ce-bf01-00aa0055595a':
							nl[i].parentNode.replaceChild(TinyMCE_MediaPlugin._createImg('mceItemRealMedia', d, nl[i]), nl[i]);
							break;
					}
				}

				// Handle embed (if any)
				nl = tinyMCE.selectNodes(content, function (n) {return n.className == 'mceItemObjectEmbed';});
				for (i=0; i<nl.length; i++) {
					switch (tinyMCE.getAttrib(nl[i], 'type')) {
						case 'application/x-shockwave-flash':
							TinyMCE_MediaPlugin._createImgFromEmbed(nl[i], d, 'mceItemFlash');
							break;

						case 'application/x-director':
							TinyMCE_MediaPlugin._createImgFromEmbed(nl[i], d, 'mceItemShockWave');
							break;

						case 'application/x-mplayer2':
							TinyMCE_MediaPlugin._createImgFromEmbed(nl[i], d, 'mceItemWindowsMedia');
							break;

						case 'video/quicktime':
							TinyMCE_MediaPlugin._createImgFromEmbed(nl[i], d, 'mceItemQuickTime');
							break;

						case 'audio/x-pn-realaudio-plugin':
							TinyMCE_MediaPlugin._createImgFromEmbed(nl[i], d, 'mceItemRealMedia');
							break;
					}
				}
				break;

			case "get_from_editor":
				var startPos = -1, endPos, attribs, chunkBefore, chunkAfter, embedHTML, at, pl, cb, mt, ex;

				while ((startPos = content.indexOf('<img', startPos+1)) != -1) {
					endPos = content.indexOf('/>', startPos);
					attribs = TinyMCE_MediaPlugin._parseAttributes(content.substring(startPos + 4, endPos));

					// Is not flash, skip it
					if (!/mceItem(Flash|ShockWave|WindowsMedia|QuickTime|RealMedia)/.test(attribs['class']))
						continue;

					endPos += 2;

					// Parse attributes
					at = attribs['title'];
					if (at) {
						at = at.replace(/&#39;/g, "'");
						at = at.replace(/&#quot;/g, '"');

						try {
							pl = eval('x={' + at + '};');
						} catch (ex) {
							pl = {};
						}
					}

					// Use object/embed
					if (!tinyMCE.getParam('media_use_script', false)) {
						switch (attribs['class']) {
=======
 * $Id: editor_plugin_src.js 1037 2009-03-02 16:41:15Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.plugins.MediaPlugin', {
		init : function(ed, url) {
			var t = this;
			
			t.editor = ed;
			t.url = url;

			function isMediaElm(n) {
				return /^(mceItemFlash|mceItemShockWave|mceItemWindowsMedia|mceItemQuickTime|mceItemRealMedia)$/.test(n.className);
			};

			ed.onPreInit.add(function() {
				// Force in _value parameter this extra parameter is required for older Opera versions
				ed.serializer.addRules('param[name|value|_mce_value]');
			});

			// Register commands
			ed.addCommand('mceMedia', function() {
				ed.windowManager.open({
					file : url + '/media.htm',
					width : 430 + parseInt(ed.getLang('media.delta_width', 0)),
					height : 470 + parseInt(ed.getLang('media.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('media', {title : 'media.desc', cmd : 'mceMedia'});

			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('media', n.nodeName == 'IMG' && isMediaElm(n));
			});

			ed.onInit.add(function() {
				var lo = {
					mceItemFlash : 'flash',
					mceItemShockWave : 'shockwave',
					mceItemWindowsMedia : 'windowsmedia',
					mceItemQuickTime : 'quicktime',
					mceItemRealMedia : 'realmedia'
				};

				ed.selection.onSetContent.add(function() {
					t._spansToImgs(ed.getBody());
				});

				ed.selection.onBeforeSetContent.add(t._objectsToSpans, t);

				if (ed.settings.content_css !== false)
					ed.dom.loadCSS(url + "/css/content.css");

				if (ed.theme.onResolveName) {
					ed.theme.onResolveName.add(function(th, o) {
						if (o.name == 'img') {
							each(lo, function(v, k) {
								if (ed.dom.hasClass(o.node, k)) {
									o.name = v;
									o.title = ed.dom.getAttrib(o.node, 'title');
									return false;
								}
							});
						}
					});
				}

				if (ed && ed.plugins.contextmenu) {
					ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
						if (e.nodeName == 'IMG' && /mceItem(Flash|ShockWave|WindowsMedia|QuickTime|RealMedia)/.test(e.className)) {
							m.add({title : 'media.edit', icon : 'media', cmd : 'mceMedia'});
						}
					});
				}
			});

			ed.onBeforeSetContent.add(t._objectsToSpans, t);

			ed.onSetContent.add(function() {
				t._spansToImgs(ed.getBody());
			});

			ed.onPreProcess.add(function(ed, o) {
				var dom = ed.dom;

				if (o.set) {
					t._spansToImgs(o.node);

					each(dom.select('IMG', o.node), function(n) {
						var p;

						if (isMediaElm(n)) {
							p = t._parse(n.title);
							dom.setAttrib(n, 'width', dom.getAttrib(n, 'width', p.width || 100));
							dom.setAttrib(n, 'height', dom.getAttrib(n, 'height', p.height || 100));
						}
					});
				}

				if (o.get) {
					each(dom.select('IMG', o.node), function(n) {
						var ci, cb, mt;

						if (ed.getParam('media_use_script')) {
							if (isMediaElm(n))
								n.className = n.className.replace(/mceItem/g, 'mceTemp');

							return;
						}

						switch (n.className) {
>>>>>>> deploy
							case 'mceItemFlash':
								ci = 'd27cdb6e-ae6d-11cf-96b8-444553540000';
								cb = 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0';
								mt = 'application/x-shockwave-flash';
								break;

							case 'mceItemShockWave':
<<<<<<< HEAD
								ci = '166B1BCA-3F9C-11CF-8075-444553540000';
=======
								ci = '166b1bca-3f9c-11cf-8075-444553540000';
>>>>>>> deploy
								cb = 'http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=8,5,1,0';
								mt = 'application/x-director';
								break;

							case 'mceItemWindowsMedia':
<<<<<<< HEAD
								ci = tinyMCE.getParam('media_wmp6_compatible') ? '05589FA1-C356-11CE-BF01-00AA0055595A' : '6BF52A52-394A-11D3-B153-00C04F79FAA6';
=======
								ci = ed.getParam('media_wmp6_compatible') ? '05589fa1-c356-11ce-bf01-00aa0055595a' : '6bf52a52-394a-11d3-b153-00c04f79faa6';
>>>>>>> deploy
								cb = 'http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701';
								mt = 'application/x-mplayer2';
								break;

							case 'mceItemQuickTime':
<<<<<<< HEAD
								ci = '02BF25D5-8C17-4B23-BC80-D3488ABDDC6B';
=======
								ci = '02bf25d5-8c17-4b23-bc80-d3488abddc6b';
>>>>>>> deploy
								cb = 'http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0';
								mt = 'video/quicktime';
								break;

							case 'mceItemRealMedia':
<<<<<<< HEAD
								ci = 'CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA';
=======
								ci = 'cfcdaa03-8be4-11cf-b84b-0020afbbccfa';
>>>>>>> deploy
								cb = 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0';
								mt = 'audio/x-pn-realaudio-plugin';
								break;
						}

<<<<<<< HEAD
						// Force absolute URL
						if (!tinyMCE.getParam("relative_urls"))
							pl.src = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], pl.src);

						embedHTML = TinyMCE_MediaPlugin._getEmbed(ci, cb, mt, pl, attribs);
					} else {
						// Use script version
						switch (attribs['class']) {
							case 'mceItemFlash':
								s = 'writeFlash';
								break;

							case 'mceItemShockWave':
								s = 'writeShockWave';
								break;

							case 'mceItemWindowsMedia':
								s = 'writeWindowsMedia';
								break;

							case 'mceItemQuickTime':
								s = 'writeQuickTime';
								break;

							case 'mceItemRealMedia':
								s = 'writeRealMedia';
								break;
						}

						if (attribs.width)
							at = at.replace(/width:[^0-9]?[0-9]+%?[^0-9]?/g, "width:'" + attribs.width + "'");

						if (attribs.height)
							at = at.replace(/height:[^0-9]?[0-9]+%?[^0-9]?/g, "height:'" + attribs.height + "'");

						// Force absolute URL
						if (!tinyMCE.getParam("relative_urls")) {
							pl.src = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], pl.src);
							at = at.replace(new RegExp("src:'[^']*'", "g"), "src:'" + pl.src + "'");
						}

						embedHTML = '<script type="text/javascript">' + s + '({' + at + '});</script>';
					}

					// Insert embed/object chunk
					chunkBefore = content.substring(0, startPos);
					chunkAfter = content.substring(endPos);
					content = chunkBefore + embedHTML + chunkAfter;
				}
				break;
		}

		return content;
	},

	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection) {
		if (node == null)
			return;

		do {
			if (node.nodeName == "IMG" && /mceItem(Flash|ShockWave|WindowsMedia|QuickTime|RealMedia)/.test(tinyMCE.getAttrib(node, 'class'))) {
				tinyMCE.switchClass(editor_id + '_media', 'mceButtonSelected');
				return true;
			}
		} while ((node = node.parentNode));

		tinyMCE.switchClass(editor_id + '_media', 'mceButtonNormal');

		return true;
	},

	_createImgFromEmbed : function(n, d, cl) {
		var ne, at, i, ti = '', an;

		ne = d.createElement('img');
		ne.src = tinyMCE.getParam("theme_href") + '/images/spacer.gif';
		ne.width = tinyMCE.getAttrib(n, 'width');
		ne.height = tinyMCE.getAttrib(n, 'height');
		ne.className = cl;

		at = n.attributes;
		for (i=0; i<at.length; i++) {
			if (at[i].specified && at[i].nodeValue) {
				an = at[i].nodeName.toLowerCase();

				if (an == 'src')
					continue;

				if (an == 'mce_src')
					an = 'src';

				if (an.indexOf('mce_') == -1 && !new RegExp('^(class|type)$').test(an))
					ti += an.toLowerCase() + ':\'' + at[i].nodeValue + "',";
			}
		}

		ti = ti.length > 0 ? ti.substring(0, ti.length - 1) : ti;
		ne.title = ti;

		n.parentNode.replaceChild(ne, n);
	},

	_createImg : function(cl, d, n) {
		var i, nl, ti = "", an, av, al = new Array();

		ne = d.createElement('img');
		ne.src = tinyMCE.getParam("theme_href") + '/images/spacer.gif';
		ne.width = tinyMCE.getAttrib(n, 'width');
		ne.height = tinyMCE.getAttrib(n, 'height');
		ne.className = cl;

		al.id = tinyMCE.getAttrib(n, 'id');
		al.name = tinyMCE.getAttrib(n, 'name');
		al.width = tinyMCE.getAttrib(n, 'width');
		al.height = tinyMCE.getAttrib(n, 'height');
		al.bgcolor = tinyMCE.getAttrib(n, 'bgcolor');
		al.align = tinyMCE.getAttrib(n, 'align');
		al.class_name = tinyMCE.getAttrib(n, 'mce_class');

		nl = n.getElementsByTagName('div');
		for (i=0; i<nl.length; i++) {
			av = tinyMCE.getAttrib(nl[i], 'value');
			av = av.replace(new RegExp('\\\\', 'g'), '\\\\');
			av = av.replace(new RegExp('"', 'g'), '\\"');
			av = av.replace(new RegExp("'", 'g'), "\\'");
			an = tinyMCE.getAttrib(nl[i], 'name');
			al[an] = av;
		}

		if (al.movie) {
			al.src = al.movie;
			al.movie = null;
		}

		for (an in al) {
			if (al[an] != null && typeof(al[an]) != "function" && al[an] != '')
				ti += an.toLowerCase() + ':\'' + al[an] + "',";
		}

		ti = ti.length > 0 ? ti.substring(0, ti.length - 1) : ti;
		ne.title = ti;

		return ne;
	},

	_getEmbed : function(cls, cb, mt, p, at) {
		var h = '', n;

		p.width = at.width ? at.width : p.width;
		p.height = at.height ? at.height : p.height;

		h += '<object classid="clsid:' + cls + '" codebase="' + cb + '"';
		h += typeof(p.id) != "undefined" ? ' id="' + p.id + '"' : '';
		h += typeof(p.name) != "undefined" ? ' name="' + p.name + '"' : '';
		h += typeof(p.width) != "undefined" ? ' width="' + p.width + '"' : '';
		h += typeof(p.height) != "undefined" ? ' height="' + p.height + '"' : '';
		h += typeof(p.align) != "undefined" ? ' align="' + p.align + '"' : '';
		h += '>';

		for (n in p) {
			if (p[n] && typeof(p[n]) != "function") {
				h += '<param name="' + n + '" value="' + p[n] + '" />';

				// Add extra url parameter if it's an absolute URL on WMP
				if (n == 'src' && p[n].indexOf('://') != -1 && mt == 'application/x-mplayer2')
					h += '<param name="url" value="' + p[n] + '" />';
			}
		}

		h += '<embed type="' + mt + '"';

		for (n in p) {
			if (typeof(p[n]) == "function")
				continue;

			// Skip url parameter for embed tag on WMP
			if (!(n == 'url' && mt == 'application/x-mplayer2'))
				h += ' ' + n + '="' + p[n] + '"';
		}

		h += '></embed></object>';

		return h;
	},

	_parseAttributes : function(attribute_string) {
		var attributeName = "";
		var attributeValue = "";
		var withInName;
		var withInValue;
		var attributes = new Array();
		var whiteSpaceRegExp = new RegExp('^[ \n\r\t]+', 'g');

		if (attribute_string == null || attribute_string.length < 2)
			return null;

		withInName = withInValue = false;

		for (var i=0; i<attribute_string.length; i++) {
			var chr = attribute_string.charAt(i);

			if ((chr == '"' || chr == "'") && !withInValue)
				withInValue = true;
			else if ((chr == '"' || chr == "'") && withInValue) {
				withInValue = false;

				var pos = attributeName.lastIndexOf(' ');
				if (pos != -1)
					attributeName = attributeName.substring(pos+1);

				attributes[attributeName.toLowerCase()] = attributeValue.substring(1);

				attributeName = "";
				attributeValue = "";
			} else if (!whiteSpaceRegExp.test(chr) && !withInName && !withInValue)
				withInName = true;

			if (chr == '=' && withInName)
				withInName = false;

			if (withInName)
				attributeName += chr;

			if (withInValue)
				attributeValue += chr;
		}

		return attributes;
	}
};

tinyMCE.addPlugin("media", TinyMCE_MediaPlugin);
=======
						if (ci) {
							dom.replace(t._buildObj({
								classid : ci,
								codebase : cb,
								type : mt
							}, n), n);
						}
					});
				}
			});

			ed.onPostProcess.add(function(ed, o) {
				o.content = o.content.replace(/_mce_value=/g, 'value=');
			});

			function getAttr(s, n) {
				n = new RegExp(n + '=\"([^\"]+)\"', 'g').exec(s);

				return n ? ed.dom.decode(n[1]) : '';
			};

			ed.onPostProcess.add(function(ed, o) {
				if (ed.getParam('media_use_script')) {
					o.content = o.content.replace(/<img[^>]+>/g, function(im) {
						var cl = getAttr(im, 'class');

						if (/^(mceTempFlash|mceTempShockWave|mceTempWindowsMedia|mceTempQuickTime|mceTempRealMedia)$/.test(cl)) {
							at = t._parse(getAttr(im, 'title'));
							at.width = getAttr(im, 'width');
							at.height = getAttr(im, 'height');
							im = '<script type="text/javascript">write' + cl.substring(7) + '({' + t._serialize(at) + '});</script>';
						}

						return im;
					});
				}
			});
		},

		getInfo : function() {
			return {
				longname : 'Media',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/media',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private methods
		_objectsToSpans : function(ed, o) {
			var t = this, h = o.content;

			h = h.replace(/<script[^>]*>\s*write(Flash|ShockWave|WindowsMedia|QuickTime|RealMedia)\(\{([^\)]*)\}\);\s*<\/script>/gi, function(a, b, c) {
				var o = t._parse(c);

				return '<img class="mceItem' + b + '" title="' + ed.dom.encode(c) + '" src="' + t.url + '/img/trans.gif" width="' + o.width + '" height="' + o.height + '" />'
			});

			h = h.replace(/<object([^>]*)>/gi, '<span class="mceItemObject" $1>');
			h = h.replace(/<embed([^>]*)\/?>/gi, '<span class="mceItemEmbed" $1></span>');
			h = h.replace(/<embed([^>]*)>/gi, '<span class="mceItemEmbed" $1>');
			h = h.replace(/<\/(object)([^>]*)>/gi, '</span>');
			h = h.replace(/<\/embed>/gi, '');
			h = h.replace(/<param([^>]*)>/gi, function(a, b) {return '<span ' + b.replace(/value=/gi, '_mce_value=') + ' class="mceItemParam"></span>'});
			h = h.replace(/\/ class=\"mceItemParam\"><\/span>/gi, 'class="mceItemParam"></span>');

			o.content = h;
		},

		_buildObj : function(o, n) {
			var ob, ed = this.editor, dom = ed.dom, p = this._parse(n.title), stc;
			
			stc = ed.getParam('media_strict', true) && o.type == 'application/x-shockwave-flash';

			p.width = o.width = dom.getAttrib(n, 'width') || 100;
			p.height = o.height = dom.getAttrib(n, 'height') || 100;

			if (p.src)
				p.src = ed.convertURL(p.src, 'src', n);

			if (stc) {
				ob = dom.create('span', {
					id : p.id,
					mce_name : 'object',
					type : 'application/x-shockwave-flash',
					data : p.src,
					style : dom.getAttrib(n, 'style'),
					width : o.width,
					height : o.height
				});
			} else {
				ob = dom.create('span', {
					id : p.id,
					mce_name : 'object',
					classid : "clsid:" + o.classid,
					style : dom.getAttrib(n, 'style'),
					codebase : o.codebase,
					width : o.width,
					height : o.height
				});
			}

			each (p, function(v, k) {
				if (!/^(width|height|codebase|classid|id|_cx|_cy)$/.test(k)) {
					// Use url instead of src in IE for Windows media
					if (o.type == 'application/x-mplayer2' && k == 'src' && !p.url)
						k = 'url';

					if (v)
						dom.add(ob, 'span', {mce_name : 'param', name : k, '_mce_value' : v});
				}
			});

			if (!stc)
				dom.add(ob, 'span', tinymce.extend({mce_name : 'embed', type : o.type, style : dom.getAttrib(n, 'style')}, p));

			return ob;
		},

		_spansToImgs : function(p) {
			var t = this, dom = t.editor.dom, im, ci;

			each(dom.select('span', p), function(n) {
				// Convert object into image
				if (dom.getAttrib(n, 'class') == 'mceItemObject') {
					ci = dom.getAttrib(n, "classid").toLowerCase().replace(/\s+/g, '');

					switch (ci) {
						case 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000':
							dom.replace(t._createImg('mceItemFlash', n), n);
							break;

						case 'clsid:166b1bca-3f9c-11cf-8075-444553540000':
							dom.replace(t._createImg('mceItemShockWave', n), n);
							break;

						case 'clsid:6bf52a52-394a-11d3-b153-00c04f79faa6':
						case 'clsid:22d6f312-b0f6-11d0-94ab-0080c74c7e95':
						case 'clsid:05589fa1-c356-11ce-bf01-00aa0055595a':
							dom.replace(t._createImg('mceItemWindowsMedia', n), n);
							break;

						case 'clsid:02bf25d5-8c17-4b23-bc80-d3488abddc6b':
							dom.replace(t._createImg('mceItemQuickTime', n), n);
							break;

						case 'clsid:cfcdaa03-8be4-11cf-b84b-0020afbbccfa':
							dom.replace(t._createImg('mceItemRealMedia', n), n);
							break;

						default:
							dom.replace(t._createImg('mceItemFlash', n), n);
					}
					
					return;
				}

				// Convert embed into image
				if (dom.getAttrib(n, 'class') == 'mceItemEmbed') {
					switch (dom.getAttrib(n, 'type')) {
						case 'application/x-shockwave-flash':
							dom.replace(t._createImg('mceItemFlash', n), n);
							break;

						case 'application/x-director':
							dom.replace(t._createImg('mceItemShockWave', n), n);
							break;

						case 'application/x-mplayer2':
							dom.replace(t._createImg('mceItemWindowsMedia', n), n);
							break;

						case 'video/quicktime':
							dom.replace(t._createImg('mceItemQuickTime', n), n);
							break;

						case 'audio/x-pn-realaudio-plugin':
							dom.replace(t._createImg('mceItemRealMedia', n), n);
							break;

						default:
							dom.replace(t._createImg('mceItemFlash', n), n);
					}
				}			
			});
		},

		_createImg : function(cl, n) {
			var im, dom = this.editor.dom, pa = {}, ti = '', args;

			args = ['id', 'name', 'width', 'height', 'bgcolor', 'align', 'flashvars', 'src', 'wmode', 'allowfullscreen', 'quality'];	

			// Create image
			im = dom.create('img', {
				src : this.url + '/img/trans.gif',
				width : dom.getAttrib(n, 'width') || 100,
				height : dom.getAttrib(n, 'height') || 100,
				style : dom.getAttrib(n, 'style'),
				'class' : cl
			});

			// Setup base parameters
			each(args, function(na) {
				var v = dom.getAttrib(n, na);

				if (v)
					pa[na] = v;
			});

			// Add optional parameters
			each(dom.select('span', n), function(n) {
				if (dom.hasClass(n, 'mceItemParam'))
					pa[dom.getAttrib(n, 'name')] = dom.getAttrib(n, '_mce_value');
			});

			// Use src not movie
			if (pa.movie) {
				pa.src = pa.movie;
				delete pa.movie;
			}

			// Merge with embed args
			n = dom.select('.mceItemEmbed', n)[0];
			if (n) {
				each(args, function(na) {
					var v = dom.getAttrib(n, na);

					if (v && !pa[na])
						pa[na] = v;
				});
			}

			delete pa.width;
			delete pa.height;

			im.title = this._serialize(pa);

			return im;
		},

		_parse : function(s) {
			return tinymce.util.JSON.parse('{' + s + '}');
		},

		_serialize : function(o) {
			return tinymce.util.JSON.serialize(o).replace(/[{}]/g, '');
		}
	});

	// Register plugin
	tinymce.PluginManager.add('media', tinymce.plugins.MediaPlugin);
})();
>>>>>>> deploy
