/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('advhr');

var TinyMCE_AdvancedHRPlugin = {
	getInfo : function() {
		return {
			longname : 'Advanced HR',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_advhr.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		}
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "advhr":
				return tinyMCE.getButtonHTML(cn, 'lang_insert_advhr_desc', '{$pluginurl}/images/advhr.gif', 'mceAdvancedHr');
		}

		return "";
	},

	/**
	 * Executes the mceAdvanceHr command.
	 */
	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle commands
		switch (command) {
			case "mceAdvancedHr":
				var template = new Array();

				template['file']   = '../../plugins/advhr/rule.htm'; // Relative to theme
				template['width']  = 250;
				template['height'] = 160;

				template['width']  += tinyMCE.getLang('lang_advhr_delta_width', 0);
				template['height'] += tinyMCE.getLang('lang_advhr_delta_height', 0);

				var size = "", width = "", noshade = "";
				if (tinyMCE.selectedElement != null && tinyMCE.selectedElement.nodeName.toLowerCase() == "hr") {
					tinyMCE.hrElement = tinyMCE.selectedElement;

					if (tinyMCE.hrElement) {
						size    = tinyMCE.hrElement.getAttribute('size') ? tinyMCE.hrElement.getAttribute('size') : "";
						width   = tinyMCE.hrElement.getAttribute('width') ? tinyMCE.hrElement.getAttribute('width') : "";
						noshade = tinyMCE.hrElement.getAttribute('noshade') ? tinyMCE.hrElement.getAttribute('noshade') : "";
					}

					tinyMCE.openWindow(template, {editor_id : editor_id, size : size, width : width, noshade : noshade, mceDo : 'update'});
				} else {
					if (tinyMCE.isMSIE) {
						tinyMCE.execInstanceCommand(editor_id, 'mceInsertContent', false,'<hr />');
					} else {
						tinyMCE.openWindow(template, {editor_id : editor_id, inline : "yes", size : size, width : width, noshade : noshade, mceDo : 'insert'});
					}
				}

				return true;
		}

		// Pass to next handler in chain
		return false;
	},

	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection) {
		if (node == null)
			return;

		do {
			if (node.nodeName == "HR") {
				tinyMCE.switchClass(editor_id + '_advhr', 'mceButtonSelected');
				return true;
			}
		} while ((node = node.parentNode));

		tinyMCE.switchClass(editor_id + '_advhr', 'mceButtonNormal');

		return true;
	}
};

tinyMCE.addPlugin("advhr", TinyMCE_AdvancedHRPlugin);
=======
 * $Id: editor_plugin_src.js 520 2008-01-07 16:30:32Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.AdvancedHRPlugin', {
		init : function(ed, url) {
			// Register commands
			ed.addCommand('mceAdvancedHr', function() {
				ed.windowManager.open({
					file : url + '/rule.htm',
					width : 250 + parseInt(ed.getLang('advhr.delta_width', 0)),
					height : 160 + parseInt(ed.getLang('advhr.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('advhr', {
				title : 'advhr.advhr_desc',
				cmd : 'mceAdvancedHr'
			});

			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('advhr', n.nodeName == 'HR');
			});

			ed.onClick.add(function(ed, e) {
				e = e.target;

				if (e.nodeName === 'HR')
					ed.selection.select(e);
			});
		},

		getInfo : function() {
			return {
				longname : 'Advanced HR',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/advhr',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('advhr', tinymce.plugins.AdvancedHRPlugin);
})();
>>>>>>> deploy
