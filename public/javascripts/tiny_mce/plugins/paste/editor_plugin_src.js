/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */ 
tinyMCE.importPluginLanguagePack('paste');

var TinyMCE_PastePlugin = {
	getInfo : function() {
		return {
			longname : 'Paste text/word',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_paste.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	initInstance : function(inst) {
		if (tinyMCE.isMSIE && tinyMCE.getParam("paste_auto_cleanup_on_paste", false))
			tinyMCE.addEvent(inst.getBody(), "paste", TinyMCE_PastePlugin._handlePasteEvent);
	},

	getControlHTML : function(cn) { 
		switch (cn) { 
			case "pastetext":
				return tinyMCE.getButtonHTML(cn, 'lang_paste_text_desc', '{$pluginurl}/images/pastetext.gif', 'mcePasteText', true);

			case "pasteword":
				return tinyMCE.getButtonHTML(cn, 'lang_paste_word_desc', '{$pluginurl}/images/pasteword.gif', 'mcePasteWord', true);

			case "selectall":
				return tinyMCE.getButtonHTML(cn, 'lang_selectall_desc', '{$pluginurl}/images/selectall.gif', 'mceSelectAll', true);
		} 

		return ''; 
	},

	execCommand : function(editor_id, element, command, user_interface, value) { 
		switch (command) { 
			case "mcePasteText": 
				if (user_interface) {
					if ((tinyMCE.isMSIE && !tinyMCE.isOpera) && !tinyMCE.getParam('paste_use_dialog', false))
						TinyMCE_PastePlugin._insertText(clipboardData.getData("Text"), true); 
					else { 
						var template = new Array(); 
						template['file']	= '../../plugins/paste/pastetext.htm'; // Relative to theme 
						template['width']  = 450; 
						template['height'] = 400; 
						var plain_text = ""; 
						tinyMCE.openWindow(template, {editor_id : editor_id, plain_text: plain_text, resizable : "yes", scrollbars : "no", inline : "yes", mceDo : 'insert'}); 
					}
				} else
					TinyMCE_PastePlugin._insertText(value['html'], value['linebreaks']);

				return true;

			case "mcePasteWord": 
				if (user_interface) {
					if ((tinyMCE.isMSIE && !tinyMCE.isOpera) && !tinyMCE.getParam('paste_use_dialog', false)) {
						TinyMCE_PastePlugin._insertWordContent(TinyMCE_PastePlugin._clipboardHTML());
					} else { 
						var template = new Array(); 
						template['file']	= '../../plugins/paste/pasteword.htm'; // Relative to theme 
						template['width']  = 450; 
						template['height'] = 400; 
						var plain_text = ""; 
						tinyMCE.openWindow(template, {editor_id : editor_id, plain_text: plain_text, resizable : "yes", scrollbars : "no", inline : "yes", mceDo : 'insert'});
					}
				} else
					TinyMCE_PastePlugin._insertWordContent(value);

				return true;

			case "mceSelectAll":
				tinyMCE.execInstanceCommand(editor_id, 'selectall'); 
				return true; 

		} 

		// Pass to next handler in chain 
		return false; 
	},

	// Private plugin internal methods

	_handlePasteEvent : function(e) {
		switch (e.type) {
			case "paste":
				var html = TinyMCE_PastePlugin._clipboardHTML();
				var r, inst = tinyMCE.selectedInstance;

				// Removes italic, strong etc, the if was needed due to bug #1437114
				if (inst && (r = inst.getRng()) && r.text.length > 0)
					tinyMCE.execCommand('delete');

				if (html && html.length > 0)
					tinyMCE.execCommand('mcePasteWord', false, html);

				tinyMCE.cancelEvent(e);
				return false;
		}

		return true;
	},

	_insertText : function(content, bLinebreaks) { 
		if (content && content.length > 0) {
			if (bLinebreaks) { 
				// Special paragraph treatment 
				if (tinyMCE.getParam("paste_create_paragraphs", true)) {
					var rl = tinyMCE.getParam("paste_replace_list", '\u2122,<sup>TM</sup>,\u2026,...,\u201c|\u201d,",\u2019,\',\u2013|\u2014|\u2015|\u2212,-').split(',');
					for (var i=0; i<rl.length; i+=2)
						content = content.replace(new RegExp(rl[i], 'gi'), rl[i+1]);

					content = tinyMCE.regexpReplace(content, "\r\n\r\n", "</p><p>", "gi"); 
					content = tinyMCE.regexpReplace(content, "\r\r", "</p><p>", "gi"); 
					content = tinyMCE.regexpReplace(content, "\n\n", "</p><p>", "gi"); 

					// Has paragraphs 
					if ((pos = content.indexOf('</p><p>')) != -1) { 
						tinyMCE.execCommand("Delete"); 

						var node = tinyMCE.selectedInstance.getFocusElement(); 

						// Get list of elements to break 
						var breakElms = new Array(); 

						do { 
							if (node.nodeType == 1) { 
								// Don't break tables and break at body 
								if (node.nodeName == "TD" || node.nodeName == "BODY") 
									break; 
		
								breakElms[breakElms.length] = node; 
							} 
						} while(node = node.parentNode); 

						var before = "", after = "</p>"; 
						before += content.substring(0, pos); 

						for (var i=0; i<breakElms.length; i++) { 
							before += "</" + breakElms[i].nodeName + ">"; 
							after += "<" + breakElms[(breakElms.length-1)-i].nodeName + ">"; 
						} 

						before += "<p>"; 
						content = before + content.substring(pos+7) + after; 
					} 
				} 

				if (tinyMCE.getParam("paste_create_linebreaks", true)) {
					content = tinyMCE.regexpReplace(content, "\r\n", "<br />", "gi"); 
					content = tinyMCE.regexpReplace(content, "\r", "<br />", "gi"); 
					content = tinyMCE.regexpReplace(content, "\n", "<br />", "gi"); 
				}
			} 
		
			tinyMCE.execCommand("mceInsertRawHTML", false, content); 
		}
	},

	_insertWordContent : function(content) { 
		if (content && content.length > 0) {
			// Cleanup Word content
			var bull = String.fromCharCode(8226);
			var middot = String.fromCharCode(183);
			var cb;

			if ((cb = tinyMCE.getParam("paste_insert_word_content_callback", "")) != "")
				content = eval(cb + "('before', content)");

			var rl = tinyMCE.getParam("paste_replace_list", '\u2122,<sup>TM</sup>,\u2026,...,\u201c|\u201d,",\u2019,\',\u2013|\u2014|\u2015|\u2212,-').split(',');
			for (var i=0; i<rl.length; i+=2)
				content = content.replace(new RegExp(rl[i], 'gi'), rl[i+1]);

			if (tinyMCE.getParam("paste_convert_headers_to_strong", false)) {
				content = content.replace(new RegExp('<p class=MsoHeading.*?>(.*?)<\/p>', 'gi'), '<p><b>$1</b></p>');
			}

			content = content.replace(new RegExp('tab-stops: list [0-9]+.0pt">', 'gi'), '">' + "--list--");
			content = content.replace(new RegExp(bull + "(.*?)<BR>", "gi"), "<p>" + middot + "$1</p>");
			content = content.replace(new RegExp('<SPAN style="mso-list: Ignore">', 'gi'), "<span>" + bull); // Covert to bull list
			content = content.replace(/<o:p><\/o:p>/gi, "");
			content = content.replace(new RegExp('<br style="page-break-before: always;.*>', 'gi'), '-- page break --'); // Replace pagebreaks
			content = content.replace(new RegExp('<(!--)([^>]*)(--)>', 'g'), "");  // Word comments

			if (tinyMCE.getParam("paste_remove_spans", true))
				content = content.replace(/<\/?span[^>]*>/gi, "");

			if (tinyMCE.getParam("paste_remove_styles", true))
				content = content.replace(new RegExp('<(\\w[^>]*) style="([^"]*)"([^>]*)', 'gi'), "<$1$3");

			content = content.replace(/<\/?font[^>]*>/gi, "");

			// Strips class attributes.
			switch (tinyMCE.getParam("paste_strip_class_attributes", "all")) {
				case "all":
					content = content.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3");
					break;

				case "mso":
					content = content.replace(new RegExp('<(\\w[^>]*) class="?mso([^ |>]*)([^>]*)', 'gi'), "<$1$3");
					break;
			}

			content = content.replace(new RegExp('href="?' + TinyMCE_PastePlugin._reEscape("" + document.location) + '', 'gi'), 'href="' + tinyMCE.settings['document_base_url']);
			content = content.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");
			content = content.replace(/<\\?\?xml[^>]*>/gi, "");
			content = content.replace(/<\/?\w+:[^>]*>/gi, "");
			content = content.replace(/-- page break --\s*<p>&nbsp;<\/p>/gi, ""); // Remove pagebreaks
			content = content.replace(/-- page break --/gi, ""); // Remove pagebreaks

	//		content = content.replace(/\/?&nbsp;*/gi, ""); &nbsp;
	//		content = content.replace(/<p>&nbsp;<\/p>/gi, '');

			if (!tinyMCE.settings['force_p_newlines']) {
				content = content.replace('', '' ,'gi');
				content = content.replace('</p>', '<br /><br />' ,'gi');
			}

			if (!tinyMCE.isMSIE && !tinyMCE.settings['force_p_newlines']) {
				content = content.replace(/<\/?p[^>]*>/gi, "");
			}

			content = content.replace(/<\/?div[^>]*>/gi, "");

			// Convert all middlot lists to UL lists
			if (tinyMCE.getParam("paste_convert_middot_lists", true)) {
				var div = document.createElement("div");
				div.innerHTML = content;

				// Convert all middot paragraphs to li elements
				var className = tinyMCE.getParam("paste_unindented_list_class", "unIndentedList");

				while (TinyMCE_PastePlugin._convertMiddots(div, "--list--")) ; // bull
				while (TinyMCE_PastePlugin._convertMiddots(div, middot, className)) ; // Middot
				while (TinyMCE_PastePlugin._convertMiddots(div, bull)) ; // bull

				content = div.innerHTML;
			}

			// Replace all headers with strong and fix some other issues
			if (tinyMCE.getParam("paste_convert_headers_to_strong", false)) {
				content = content.replace(/<h[1-6]>&nbsp;<\/h[1-6]>/gi, '<p>&nbsp;&nbsp;</p>');
				content = content.replace(/<h[1-6]>/gi, '<p><b>');
				content = content.replace(/<\/h[1-6]>/gi, '</b></p>');
				content = content.replace(/<b>&nbsp;<\/b>/gi, '<b>&nbsp;&nbsp;</b>');
				content = content.replace(/^(&nbsp;)*/gi, '');
			}

			content = content.replace(/--list--/gi, ""); // Remove --list--

			if ((cb = tinyMCE.getParam("paste_insert_word_content_callback", "")) != "")
				content = eval(cb + "('after', content)");

			// Insert cleaned content
			tinyMCE.execCommand("mceInsertContent", false, content);

			if (tinyMCE.getParam('paste_force_cleanup_wordpaste', true))
				window.setTimeout('tinyMCE.execCommand("mceCleanup");', 1); // Do normal cleanup detached from this thread
		}
	},

	_reEscape : function(s) {
		var l = "?.\\*[](){}+^$:";
		var o = "";

		for (var i=0; i<s.length; i++) {
			var c = s.charAt(i);

			if (l.indexOf(c) != -1)
				o += '\\' + c;
			else
				o += c;
		}

		return o;
	},

	_convertMiddots : function(div, search, class_name) {
		var mdot = String.fromCharCode(183);
		var bull = String.fromCharCode(8226);

		var nodes = div.getElementsByTagName("p");
		var prevul;
		for (var i=0; i<nodes.length; i++) {
			var p = nodes[i];

			// Is middot
			if (p.innerHTML.indexOf(search) == 0) {
				var ul = document.createElement("ul");

				if (class_name)
					ul.className = class_name;

				// Add the first one
				var li = document.createElement("li");
				li.innerHTML = p.innerHTML.replace(new RegExp('' + mdot + '|' + bull + '|--list--|&nbsp;', "gi"), '');
				ul.appendChild(li);

				// Add the rest
				var np = p.nextSibling;
				while (np) {
			        // If the node is whitespace, then
			        // ignore it and continue on.
			        if (np.nodeType == 3 && new RegExp('^\\s$', 'm').test(np.nodeValue)) {
			                np = np.nextSibling;
			                continue;
			        }

					if (search == mdot) {
					        if (np.nodeType == 1 && new RegExp('^o(\\s+|&nbsp;)').test(np.innerHTML)) {
					                // Second level of nesting
					                if (!prevul) {
					                        prevul = ul;
					                        ul = document.createElement("ul");
					                        prevul.appendChild(ul);
					                }
					                np.innerHTML = np.innerHTML.replace(/^o/, '');
					        } else {
					                // Pop the stack if we're going back up to the first level
					                if (prevul) {
					                        ul = prevul;
					                        prevul = null;
					                }
					                // Not element or middot paragraph
					                if (np.nodeType != 1 || np.innerHTML.indexOf(search) != 0)
					                        break;
					        }
					} else {
					        // Not element or middot paragraph
					        if (np.nodeType != 1 || np.innerHTML.indexOf(search) != 0)
					                break;
				        }

					var cp = np.nextSibling;
					var li = document.createElement("li");
					li.innerHTML = np.innerHTML.replace(new RegExp('' + mdot + '|' + bull + '|--list--|&nbsp;', "gi"), '');
					np.parentNode.removeChild(np);
					ul.appendChild(li);
					np = cp;
				}

				p.parentNode.replaceChild(ul, p);

				return true;
			}
		}

		return false;
	},

	_clipboardHTML : function() {
		var div = document.getElementById('_TinyMCE_clipboardHTML');

		if (!div) {
			var div = document.createElement('DIV');
			div.id = '_TinyMCE_clipboardHTML';

			with (div.style) {
				visibility = 'hidden';
				overflow = 'hidden';
				position = 'absolute';
				width = 1;
				height = 1;
			}

			document.body.appendChild(div);
		}

		div.innerHTML = '';
		var rng = document.body.createTextRange();
		rng.moveToElementText(div);
		rng.execCommand('Paste');
		var html = div.innerHTML;
		div.innerHTML = '';
		return html;
	}
};

tinyMCE.addPlugin("paste", TinyMCE_PastePlugin);
=======
 * $Id: editor_plugin_src.js 1112 2009-04-30 20:03:51Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.plugins.PastePlugin', {
		init : function(ed, url) {
			var t = this, cb;

			t.editor = ed;
			t.url = url;

			// Setup plugin events
			t.onPreProcess = new tinymce.util.Dispatcher(t);
			t.onPostProcess = new tinymce.util.Dispatcher(t);

			// Register default handlers
			t.onPreProcess.add(t._preProcess);
			t.onPostProcess.add(t._postProcess);

			// Register optional preprocess handler
			t.onPreProcess.add(function(pl, o) {
				ed.execCallback('paste_preprocess', pl, o);
			});

			// Register optional postprocess
			t.onPostProcess.add(function(pl, o) {
				ed.execCallback('paste_postprocess', pl, o);
			});

			// This function executes the process handlers and inserts the contents
			function process(h) {
				var dom = ed.dom, o = {content : h};

				// Execute pre process handlers
				t.onPreProcess.dispatch(t, o);

				// Create DOM structure
				o.node = dom.create('div', 0, o.content);

				// Execute post process handlers
				t.onPostProcess.dispatch(t, o);

				// Serialize content
				o.content = ed.serializer.serialize(o.node, {getInner : 1});

				// Insert cleaned content. We need to handle insertion of contents containing block elements separatly
				if (/<(p|h[1-6]|ul|ol)/.test(o.content))
					t._insertBlockContent(ed, dom, o.content);
				else
					t._insert(o.content);
			};

			// Add command for external usage
			ed.addCommand('mceInsertClipboardContent', function(u, v) {
				process(v);
			});

			// This function grabs the contents from the clipboard by adding a
			// hidden div and placing the caret inside it and after the browser paste
			// is done it grabs that contents and processes that
			function grabContent(e) {
				var n, or, rng, sel = ed.selection, dom = ed.dom, body = ed.getBody(), posY;

				if (dom.get('_mcePaste'))
					return;

				// Create container to paste into
				n = dom.add(body, 'div', {id : '_mcePaste'}, '&nbsp;');

				// If contentEditable mode we need to find out the position of the closest element
				if (body != ed.getDoc().body)
					posY = dom.getPos(ed.selection.getStart(), body).y;
				else
					posY = body.scrollTop;

				// Styles needs to be applied after the element is added to the document since WebKit will otherwise remove all styles
				dom.setStyles(n, {
					position : 'absolute',
					left : -10000,
					top : posY,
					width : 1,
					height : 1,
					overflow : 'hidden'
				});

				if (tinymce.isIE) {
					// Select the container
					rng = dom.doc.body.createTextRange();
					rng.moveToElementText(n);
					rng.execCommand('Paste');

					// Remove container
					dom.remove(n);

					// Process contents
					process(n.innerHTML);

					return tinymce.dom.Event.cancel(e);
				} else {
					or = ed.selection.getRng();

					// Move caret into hidden div
					n = n.firstChild;
					rng = ed.getDoc().createRange();
					rng.setStart(n, 0);
					rng.setEnd(n, 1);
					sel.setRng(rng);

					// Wait a while and grab the pasted contents
					window.setTimeout(function() {
						var n = dom.get('_mcePaste'), h;

						// Webkit clones the _mcePaste div for some odd reason so this will ensure that we get the real new div not the old empty one
						n.id = '_mceRemoved';
						dom.remove(n);
						n = dom.get('_mcePaste') || n;

						// Grab the HTML contents
						// We need to look for a apple style wrapper on webkit it also adds a div wrapper if you copy/paste the body of the editor
						// It's amazing how strange the contentEditable mode works in WebKit
						h = (dom.select('> span.Apple-style-span div', n)[0] || dom.select('> span.Apple-style-span', n)[0] || n).innerHTML;

						// Remove hidden div and restore selection
						dom.remove(n);

						// Restore the old selection
						if (or)
							sel.setRng(or);

						process(h);
					}, 0);
				}
			};

			// Check if we should use the new auto process method			
			if (ed.getParam('paste_auto_cleanup_on_paste', true)) {
				// Is it's Opera or older FF use key handler
				if (tinymce.isOpera || /Firefox\/2/.test(navigator.userAgent)) {
					ed.onKeyDown.add(function(ed, e) {
						if (((tinymce.isMac ? e.metaKey : e.ctrlKey) && e.keyCode == 86) || (e.shiftKey && e.keyCode == 45))
							grabContent(e);
					});
				} else {
					// Grab contents on paste event on Gecko and WebKit
					ed.onPaste.addToTop(function(ed, e) {
						return grabContent(e);
					});
				}
			}

			// Add legacy support
			t._legacySupport();
		},

		getInfo : function() {
			return {
				longname : 'Paste text/word',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/paste',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		_preProcess : function(pl, o) {
			var h = o.content, process;

			//console.log('Before preprocess:' + o.content);

			function process(items) {
				each(items, function(v) {
					// Remove or replace
					if (v.constructor == RegExp)
						h = h.replace(v, '');
					else
						h = h.replace(v[0], v[1]);
				});
			};

			// Process away some basic content
			process([
				/^\s*(&nbsp;)+/g,											// nbsp entities at the start of contents
				/(&nbsp;|<br[^>]*>)+\s*$/g									// nbsp entities at the end of contents
			]);

			// Detect Word content and process it more agressive
			if (/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(h)) {
				o.wordContent = true; // Mark the pasted contents as word specific content
				//console.log('Word contents detected.');

				process([
					/<!--[\s\S]+?-->/gi,												// Word comments
					/<\/?(img|font|meta|link|style|span|div|v:\w+)[^>]*>/gi,			// Remove some tags including VML content
					/<\\?\?xml[^>]*>/gi,												// XML namespace declarations
					/<\/?o:[^>]*>/gi,													// MS namespaced elements <o:tag>
					/ (id|name|class|language|type|on\w+|v:\w+)=\"([^\"]*)\"/gi,	// on.., class, style and language attributes with quotes
					/ (id|name|class|language|type|on\w+|v:\w+)=(\w+)/gi,			// on.., class, style and language attributes without quotes (IE)
					[/<(\/?)s>/gi, '<$1strike>'],										// Convert <s> into <strike> for line-though
					/<script[^>]+>[\s\S]*?<\/script>/gi,								// All scripts elements for msoShowComment for example
					[/&nbsp;/g, '\u00a0']												// Replace nsbp entites to char since it's easier to handle
				]);
			}

			//console.log('After preprocess:' + h);

			o.content = h;
		},

		/**
		 * Various post process items.
		 */
		_postProcess : function(pl, o) {
			var t = this, dom = t.editor.dom;

			if (o.wordContent) {
				// Remove named anchors or TOC links
				each(dom.select('a', o.node), function(a) {
					if (!a.href || a.href.indexOf('#_Toc') != -1)
						dom.remove(a, 1);
				});

				if (t.editor.getParam('paste_convert_middot_lists', true))
					t._convertLists(pl, o);

				// Remove all styles
				each(dom.select('*', o.node), function(el) {
					dom.setAttrib(el, 'style', '');
				});
			}

			if (tinymce.isWebKit) {
				// We need to compress the styles on WebKit since if you paste <img border="0" /> it will become <img border="0" style="... lots of junk ..." />
				// Removing the mce_style that contains the real value will force the Serializer engine to compress the styles
				each(dom.select('*', o.node), function(el) {
					el.removeAttribute('mce_style');
				});
			}
		},

		/**
		 * Converts the most common bullet and number formats in Office into a real semantic UL/LI list.
		 */
		_convertLists : function(pl, o) {
			var dom = pl.editor.dom, listElm, li, lastMargin = -1, margin, levels = [], lastType;

			// Convert middot lists into real scemantic lists
			each(dom.select('p', o.node), function(p) {
				var sib, val = '', type, html, idx, parents;

				// Get text node value at beginning of paragraph
				for (sib = p.firstChild; sib && sib.nodeType == 3; sib = sib.nextSibling)
					val += sib.nodeValue;

				// Detect unordered lists look for bullets
				if (/^[\u2022\u00b7\u00a7\u00d8o]\s*\u00a0\u00a0*/.test(val))
					type = 'ul';

				// Detect ordered lists 1., a. or ixv.
				if (/^[\s\S]*\w+\.[\s\S]*\u00a0{2,}/.test(val))
					type = 'ol';

				// Check if node value matches the list pattern: o&nbsp;&nbsp;
				if (type) {
					margin = parseFloat(p.style.marginLeft || 0);

					if (margin > lastMargin)
						levels.push(margin);

					if (!listElm || type != lastType) {
						listElm = dom.create(type);
						dom.insertAfter(listElm, p);
					} else {
						// Nested list element
						if (margin > lastMargin) {
							listElm = li.appendChild(dom.create(type));
						} else if (margin < lastMargin) {
							// Find parent level based on margin value
							idx = tinymce.inArray(levels, margin);
							parents = dom.getParents(listElm.parentNode, type);
							listElm = parents[parents.length - 1 - idx] || listElm;
						}
					}

					if (type == 'ul')
						html = p.innerHTML.replace(/^[\u2022\u00b7\u00a7\u00d8o]\s*(&nbsp;|\u00a0)+\s*/, '');
					else
						html = p.innerHTML.replace(/^[\s\S]*\w+\.(&nbsp;|\u00a0)+\s*/, '');

					li = listElm.appendChild(dom.create('li', 0, html));
					dom.remove(p);

					lastMargin = margin;
					lastType = type;
				} else
					listElm = lastMargin = 0; // End list element
			});
		},

		/**
		 * This method will split the current block parent and insert the contents inside the split position.
		 * This logic can be improved so text nodes at the start/end remain in the start/end block elements
		 */
		_insertBlockContent : function(ed, dom, content) {
			var parentBlock, marker, sel = ed.selection, last, elm, vp, y, elmHeight;

			function select(n) {
				var r;

				if (tinymce.isIE) {
					r = ed.getDoc().body.createTextRange();
					r.moveToElementText(n);
					r.collapse(false);
					r.select();
				} else {
					sel.select(n, 1);
					sel.collapse(false);
				}
			};

			// Insert a marker for the caret position
			this._insert('<span id="_marker">&nbsp;</span>', 1);
			marker = dom.get('_marker');
			parentBlock = dom.getParent(marker, 'p,h1,h2,h3,h4,h5,h6,ul,ol');

			if (parentBlock) {
				// Split parent block
				marker = dom.split(parentBlock, marker);

				// Insert nodes before the marker
				each(dom.create('div', 0, content).childNodes, function(n) {
					last = marker.parentNode.insertBefore(n.cloneNode(true), marker);
				});

				// Move caret after marker
				select(last);
			} else {
				dom.setOuterHTML(marker, content);
				sel.select(ed.getBody(), 1);
				sel.collapse(0);
			}

			dom.remove('_marker'); // Remove marker if it's left

			// Get element, position and height
			elm = sel.getStart();
			vp = dom.getViewPort(ed.getWin());
			y = ed.dom.getPos(elm).y;
			elmHeight = elm.clientHeight;

			// Is element within viewport if not then scroll it into view
			if (y < vp.y || y + elmHeight > vp.y + vp.h)
				ed.getDoc().body.scrollTop = y < vp.y ? y : y - vp.h + 25;
		},

		/**
		 * Inserts the specified contents at the caret position.
		 */
		_insert : function(h, skip_undo) {
			var ed = this.editor;

			// First delete the contents seems to work better on WebKit
			if (!ed.selection.isCollapsed())
				ed.execCommand('Delete');

			// It's better to use the insertHTML method on Gecko since it will combine paragraphs correctly before inserting the contents
			ed.execCommand(tinymce.isGecko ? 'insertHTML' : 'mceInsertContent', false, h, {skip_undo : skip_undo});
		},

		/**
		 * This method will open the old style paste dialogs. Some users might want the old behavior but still use the new cleanup engine.
		 */
		_legacySupport : function() {
			var t = this, ed = t.editor;

			// Register commands for backwards compatibility
			each(['mcePasteText', 'mcePasteWord'], function(cmd) {
				ed.addCommand(cmd, function() {
					ed.windowManager.open({
						file : t.url + (cmd == 'mcePasteText' ? '/pastetext.htm' : '/pasteword.htm'),
						width : 450,
						height : 400,
						inline : 1
					});
				});
			});

			// Register buttons for backwards compatibility
			ed.addButton('pastetext', {title : 'paste.paste_text_desc', cmd : 'mcePasteText'});
			ed.addButton('pasteword', {title : 'paste.paste_word_desc', cmd : 'mcePasteWord'});
			ed.addButton('selectall', {title : 'paste.selectall_desc', cmd : 'selectall'});
		}
	});

	// Register plugin
	tinymce.PluginManager.add('paste', tinymce.plugins.PastePlugin);
})();
>>>>>>> deploy
