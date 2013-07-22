/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('directionality');

var TinyMCE_DirectionalityPlugin = {
	getInfo : function() {
		return {
			longname : 'Directionality',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_directionality.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "ltr":
				return tinyMCE.getButtonHTML(cn, 'lang_directionality_ltr_desc', '{$pluginurl}/images/ltr.gif', 'mceDirectionLTR');

			case "rtl":
				return tinyMCE.getButtonHTML(cn, 'lang_directionality_rtl_desc', '{$pluginurl}/images/rtl.gif', 'mceDirectionRTL');
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle commands
		switch (command) {
			case "mceDirectionLTR":
				var inst = tinyMCE.getInstanceById(editor_id);
				var elm = tinyMCE.getParentElement(inst.getFocusElement(), "p,div,td,h1,h2,h3,h4,h5,h6,pre,address");

				if (elm)
					elm.setAttribute("dir", "ltr");

				tinyMCE.triggerNodeChange(false);
				return true;

			case "mceDirectionRTL":
				var inst = tinyMCE.getInstanceById(editor_id);
				var elm = tinyMCE.getParentElement(inst.getFocusElement(), "p,div,td,h1,h2,h3,h4,h5,h6,pre,address");

				if (elm)
					elm.setAttribute("dir", "rtl");

				tinyMCE.triggerNodeChange(false);
				return true;
		}

		// Pass to next handler in chain
		return false;
	},

	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection) {
		function getAttrib(elm, name) {
			return elm.getAttribute(name) ? elm.getAttribute(name) : "";
		}

		if (node == null)
			return;

		var elm = tinyMCE.getParentElement(node, "p,div,td,h1,h2,h3,h4,h5,h6,pre,address");
		if (!elm) {
			tinyMCE.switchClass(editor_id + '_ltr', 'mceButtonDisabled');
			tinyMCE.switchClass(editor_id + '_rtl', 'mceButtonDisabled');
			return true;
		}

		tinyMCE.switchClass(editor_id + '_ltr', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_rtl', 'mceButtonNormal');

		var dir = getAttrib(elm, "dir");
		if (dir == "ltr" || dir == "")
			tinyMCE.switchClass(editor_id + '_ltr', 'mceButtonSelected');
		else
			tinyMCE.switchClass(editor_id + '_rtl', 'mceButtonSelected');

		return true;
	}
};

tinyMCE.addPlugin("directionality", TinyMCE_DirectionalityPlugin);
=======
 * $Id: editor_plugin_src.js 520 2008-01-07 16:30:32Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.Directionality', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			ed.addCommand('mceDirectionLTR', function() {
				var e = ed.dom.getParent(ed.selection.getNode(), ed.dom.isBlock);

				if (e) {
					if (ed.dom.getAttrib(e, "dir") != "ltr")
						ed.dom.setAttrib(e, "dir", "ltr");
					else
						ed.dom.setAttrib(e, "dir", "");
				}

				ed.nodeChanged();
			});

			ed.addCommand('mceDirectionRTL', function() {
				var e = ed.dom.getParent(ed.selection.getNode(), ed.dom.isBlock);

				if (e) {
					if (ed.dom.getAttrib(e, "dir") != "rtl")
						ed.dom.setAttrib(e, "dir", "rtl");
					else
						ed.dom.setAttrib(e, "dir", "");
				}

				ed.nodeChanged();
			});

			ed.addButton('ltr', {title : 'directionality.ltr_desc', cmd : 'mceDirectionLTR'});
			ed.addButton('rtl', {title : 'directionality.rtl_desc', cmd : 'mceDirectionRTL'});

			ed.onNodeChange.add(t._nodeChange, t);
		},

		getInfo : function() {
			return {
				longname : 'Directionality',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/directionality',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private methods

		_nodeChange : function(ed, cm, n) {
			var dom = ed.dom, dir;

			n = dom.getParent(n, dom.isBlock);
			if (!n) {
				cm.setDisabled('ltr', 1);
				cm.setDisabled('rtl', 1);
				return;
			}

			dir = dom.getAttrib(n, 'dir');
			cm.setActive('ltr', dir == "ltr");
			cm.setDisabled('ltr', 0);
			cm.setActive('rtl', dir == "rtl");
			cm.setDisabled('rtl', 0);
		}
	});

	// Register plugin
	tinymce.PluginManager.add('directionality', tinymce.plugins.Directionality);
})();
>>>>>>> deploy
