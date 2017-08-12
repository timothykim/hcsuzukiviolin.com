<<<<<<< HEAD
 /**
 * $Id: editor_plugin_src.js 42 2006-08-08 14:32:24Z spocke $
 *
 * @author Moxiecode - based on work by Andrew Tetlaw
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('xhtmlxtras');

var TinyMCE_XHTMLXtrasPlugin = {
	getInfo : function() {
		return {
			longname : 'XHTML Xtras Plugin',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_xhtmlxtras.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	initInstance : function(inst) {
		tinyMCE.importCSS(inst.getDoc(), tinyMCE.baseURL + "/plugins/xhtmlxtras/css/xhtmlxtras.css");
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "cite":
				return tinyMCE.getButtonHTML(cn, 'lang_xhtmlxtras_cite_desc', '{$pluginurl}/images/cite.gif', 'mceCite', true);

			case "acronym":
				return tinyMCE.getButtonHTML(cn, 'lang_xhtmlxtras_acronym_desc', '{$pluginurl}/images/acronym.gif', 'mceAcronym', true);

			case "abbr":
				return tinyMCE.getButtonHTML(cn, 'lang_xhtmlxtras_abbr_desc', '{$pluginurl}/images/abbr.gif', 'mceAbbr', true);

			case "del":
				return tinyMCE.getButtonHTML(cn, 'lang_xhtmlxtras_del_desc', '{$pluginurl}/images/del.gif', 'mceDel', true);

			case "ins":
				return tinyMCE.getButtonHTML(cn, 'lang_xhtmlxtras_ins_desc', '{$pluginurl}/images/ins.gif', 'mceIns', true);
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		var template;

		switch (command) {
			case "mceCite":
				if (!this._anySel(editor_id))
					return true;

				template = new Array();
				template['file'] = '../../plugins/xhtmlxtras/cite.htm';
				template['width'] = 350;
				template['height'] = 250;
				tinyMCE.openWindow(template, {editor_id : editor_id});
				return true;

			case "mceAcronym":
				if (!this._anySel(editor_id))
					return true;

				template = new Array();
				template['file'] = '../../plugins/xhtmlxtras/acronym.htm';
				template['width'] = 350;
				template['height'] = 250;
				tinyMCE.openWindow(template, {editor_id : editor_id});
				return true;

			case "mceAbbr":
				if (!this._anySel(editor_id))
					return true;

				template = new Array();
				template['file'] = '../../plugins/xhtmlxtras/abbr.htm';
				template['width'] = 350;
				template['height'] = 250;
				tinyMCE.openWindow(template, {editor_id : editor_id});
				return true;

			case "mceIns":
				if (!this._anySel(editor_id))
					return true;

				template = new Array();
				template['file'] = '../../plugins/xhtmlxtras/ins.htm';
				template['width'] = 350;
				template['height'] = 310;
				tinyMCE.openWindow(template, {editor_id : editor_id});
				return true;

			case "mceDel":
				if (!this._anySel(editor_id))
					return true;

				template = new Array();
				template['file'] = '../../plugins/xhtmlxtras/del.htm';
				template['width'] = 350;
				template['height'] = 310;
				tinyMCE.openWindow(template, {editor_id : editor_id});
				return true;
		}

		return false;
	},

	cleanup : function(type, content, inst) {
		if (type == 'insert_to_editor' && tinyMCE.isIE && !tinyMCE.isOpera) {
			content = content.replace(/<abbr([^>]+)>/gi, '<html:ABBR $1>');
			content = content.replace(/<\/abbr>/gi, '</html:ABBR>');
		}

		return content;
	},

	handleNodeChange : function(editor_id, node, undo_index,undo_levels, visual_aid, any_selection) {
		if (node == null)
			return;

		if (!any_selection) {
			// Disable the buttons
			tinyMCE.switchClass(editor_id + '_cite', 'mceButtonDisabled');
			tinyMCE.switchClass(editor_id + '_acronym', 'mceButtonDisabled');
			tinyMCE.switchClass(editor_id + '_abbr', 'mceButtonDisabled');
			tinyMCE.switchClass(editor_id + '_del', 'mceButtonDisabled');
			tinyMCE.switchClass(editor_id + '_ins', 'mceButtonDisabled');
		} else {
			// A selection means the buttons should be active.
			tinyMCE.switchClass(editor_id + '_cite', 'mceButtonNormal');
			tinyMCE.switchClass(editor_id + '_acronym', 'mceButtonNormal');
			tinyMCE.switchClass(editor_id + '_abbr', 'mceButtonNormal');
			tinyMCE.switchClass(editor_id + '_del', 'mceButtonNormal');
			tinyMCE.switchClass(editor_id + '_ins', 'mceButtonNormal');
		}

		switch (node.nodeName) {
			case "CITE":
				tinyMCE.switchClass(editor_id + '_cite', 'mceButtonSelected');
				return true;

			case "ACRONYM":
				tinyMCE.switchClass(editor_id + '_acronym', 'mceButtonSelected');
				return true;

			case "abbr": // IE
			case "HTML:ABBR": // FF
			case "ABBR":
				tinyMCE.switchClass(editor_id + '_abbr', 'mceButtonSelected');
				return true;

			case "DEL":
				tinyMCE.switchClass(editor_id + '_del', 'mceButtonSelected');
				return true;

			case "INS":
				tinyMCE.switchClass(editor_id + '_ins', 'mceButtonSelected');
				return true;
		}

		return true;
	},

	_anySel : function(editor_id) {
		var inst = tinyMCE.getInstanceById(editor_id), t = inst.selection.getSelectedText(), pe;

		pe = tinyMCE.getParentElement(inst.getFocusElement(), 'CITE,ACRONYM,ABBR,HTML:ABBR,DEL,INS');

		return pe || inst.getFocusElement().nodeName == "IMG" || (t && t.length > 0);
	}
};

tinyMCE.addPlugin("xhtmlxtras", TinyMCE_XHTMLXtrasPlugin);
=======
/**
 * $Id: editor_plugin_src.js 201 2007-02-12 15:56:56Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.XHTMLXtrasPlugin', {
		init : function(ed, url) {
			// Register commands
			ed.addCommand('mceCite', function() {
				ed.windowManager.open({
					file : url + '/cite.htm',
					width : 350 + parseInt(ed.getLang('xhtmlxtras.cite_delta_width', 0)),
					height : 250 + parseInt(ed.getLang('xhtmlxtras.cite_delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			ed.addCommand('mceAcronym', function() {
				ed.windowManager.open({
					file : url + '/acronym.htm',
					width : 350 + parseInt(ed.getLang('xhtmlxtras.acronym_delta_width', 0)),
					height : 250 + parseInt(ed.getLang('xhtmlxtras.acronym_delta_width', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			ed.addCommand('mceAbbr', function() {
				ed.windowManager.open({
					file : url + '/abbr.htm',
					width : 350 + parseInt(ed.getLang('xhtmlxtras.abbr_delta_width', 0)),
					height : 250 + parseInt(ed.getLang('xhtmlxtras.abbr_delta_width', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			ed.addCommand('mceDel', function() {
				ed.windowManager.open({
					file : url + '/del.htm',
					width : 340 + parseInt(ed.getLang('xhtmlxtras.del_delta_width', 0)),
					height : 310 + parseInt(ed.getLang('xhtmlxtras.del_delta_width', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			ed.addCommand('mceIns', function() {
				ed.windowManager.open({
					file : url + '/ins.htm',
					width : 340 + parseInt(ed.getLang('xhtmlxtras.ins_delta_width', 0)),
					height : 310 + parseInt(ed.getLang('xhtmlxtras.ins_delta_width', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			ed.addCommand('mceAttributes', function() {
				ed.windowManager.open({
					file : url + '/attributes.htm',
					width : 380,
					height : 370,
					inline : 1
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('cite', {title : 'xhtmlxtras.cite_desc', cmd : 'mceCite'});
			ed.addButton('acronym', {title : 'xhtmlxtras.acronym_desc', cmd : 'mceAcronym'});
			ed.addButton('abbr', {title : 'xhtmlxtras.abbr_desc', cmd : 'mceAbbr'});
			ed.addButton('del', {title : 'xhtmlxtras.del_desc', cmd : 'mceDel'});
			ed.addButton('ins', {title : 'xhtmlxtras.ins_desc', cmd : 'mceIns'});
			ed.addButton('attribs', {title : 'xhtmlxtras.attribs_desc', cmd : 'mceAttributes'});

			if (tinymce.isIE) {
				function fix(ed, o) {
					if (o.set) {
						o.content = o.content.replace(/<abbr([^>]+)>/gi, '<html:abbr $1>');
						o.content = o.content.replace(/<\/abbr>/gi, '</html:abbr>');
					}
				};

				ed.onBeforeSetContent.add(fix);
				ed.onPostProcess.add(fix);
			}

			ed.onNodeChange.add(function(ed, cm, n, co) {
				n = ed.dom.getParent(n, 'CITE,ACRONYM,ABBR,DEL,INS');

				cm.setDisabled('cite', co);
				cm.setDisabled('acronym', co);
				cm.setDisabled('abbr', co);
				cm.setDisabled('del', co);
				cm.setDisabled('ins', co);
				cm.setDisabled('attribs', n && n.nodeName == 'BODY');
				cm.setActive('cite', 0);
				cm.setActive('acronym', 0);
				cm.setActive('abbr', 0);
				cm.setActive('del', 0);
				cm.setActive('ins', 0);

				// Activate all
				if (n) {
					do {
						cm.setDisabled(n.nodeName.toLowerCase(), 0);
						cm.setActive(n.nodeName.toLowerCase(), 1);
					} while (n = n.parentNode);
				}
			});
		},

		getInfo : function() {
			return {
				longname : 'XHTML Xtras Plugin',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/xhtmlxtras',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('xhtmlxtras', tinymce.plugins.XHTMLXtrasPlugin);
})();
>>>>>>> deploy
