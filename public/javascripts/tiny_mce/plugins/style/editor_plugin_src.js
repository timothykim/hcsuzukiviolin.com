/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('style');

var TinyMCE_StylePlugin = {
	getInfo : function() {
		return {
			longname : 'Style',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_style.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "styleprops":
				return tinyMCE.getButtonHTML(cn, 'lang_style_styleinfo_desc', '{$pluginurl}/images/styleprops.gif', 'mceStyleProps', true);
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		var e, inst;

		// Handle commands
		switch (command) {
			case "mceStyleProps":
				TinyMCE_StylePlugin._styleProps();
				return true;

			case "mceSetElementStyle":
				inst = tinyMCE.getInstanceById(editor_id);
				e = inst.selection.getFocusElement();

				if (e) {
					e.style.cssText = value;
					inst.repaint();
				}

				return true;
		}

		// Pass to next handler in chain
		return false;
	},

	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection) {
	},

	// Private plugin specific methods

	_styleProps : function() {
		var e = tinyMCE.selectedInstance.selection.getFocusElement();

		if (!e)
			return;

		tinyMCE.openWindow({
			file : '../../plugins/style/props.htm',
			width : 480 + tinyMCE.getLang('lang_style_props_delta_width', 0),
			height : 320 + tinyMCE.getLang('lang_style_props_delta_height', 0)
		}, {
			editor_id : tinyMCE.selectedInstance.editorId,
			inline : "yes",
			style_text : e.style.cssText
		});
	}
};

tinyMCE.addPlugin("style", TinyMCE_StylePlugin);
=======
 * $Id: editor_plugin_src.js 787 2008-04-10 11:40:57Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.StylePlugin', {
		init : function(ed, url) {
			// Register commands
			ed.addCommand('mceStyleProps', function() {
				ed.windowManager.open({
					file : url + '/props.htm',
					width : 480 + parseInt(ed.getLang('style.delta_width', 0)),
					height : 320 + parseInt(ed.getLang('style.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url,
					style_text : ed.selection.getNode().style.cssText
				});
			});

			ed.addCommand('mceSetElementStyle', function(ui, v) {
				if (e = ed.selection.getNode()) {
					ed.dom.setAttrib(e, 'style', v);
					ed.execCommand('mceRepaint');
				}
			});

			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setDisabled('styleprops', n.nodeName === 'BODY');
			});

			// Register buttons
			ed.addButton('styleprops', {title : 'style.desc', cmd : 'mceStyleProps'});
		},

		getInfo : function() {
			return {
				longname : 'Style',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/style',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('style', tinymce.plugins.StylePlugin);
})();
>>>>>>> deploy
