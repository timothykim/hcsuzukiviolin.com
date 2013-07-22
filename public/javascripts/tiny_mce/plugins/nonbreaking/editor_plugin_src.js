/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 42 2006-08-08 14:32:24Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('nonbreaking');

var TinyMCE_NonBreakingPlugin = {
	getInfo : function() {
		return {
			longname : 'Nonbreaking space',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_nonbreaking.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "nonbreaking":
				return tinyMCE.getButtonHTML(cn, 'lang_nonbreaking_desc', '{$pluginurl}/images/nonbreaking.gif', 'mceNonBreaking', false);
		}

		return "";
	},


	execCommand : function(editor_id, element, command, user_interface, value) {
		var inst = tinyMCE.getInstanceById(editor_id), h;

		switch (command) {
			case "mceNonBreaking":
				h = (inst.visualChars && inst.visualChars.state) ? '<span class="mceItemHiddenVisualChar">&middot;</span>' : '&nbsp;';
				tinyMCE.execInstanceCommand(editor_id, 'mceInsertContent', false, h);
				return true;
		}

		return false;
	},

	handleEvent : function(e) {
		var inst, h;

		if (!tinyMCE.isOpera && e.type == 'keydown' && e.keyCode == 9 && tinyMCE.getParam('nonbreaking_force_tab', false)) {
			inst = tinyMCE.selectedInstance;

			h = (inst.visualChars && inst.visualChars.state) ? '<span class="mceItemHiddenVisualChar">&middot;&middot;&middot;</span>' : '&nbsp;&nbsp;&nbsp;';
			tinyMCE.execInstanceCommand(inst.editorId, 'mceInsertContent', false, h);

			tinyMCE.cancelEvent(e);
			return false;
		}

		return true;
	}
};

tinyMCE.addPlugin("nonbreaking", TinyMCE_NonBreakingPlugin);
=======
 * $Id: editor_plugin_src.js 201 2007-02-12 15:56:56Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.Nonbreaking', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			// Register commands
			ed.addCommand('mceNonBreaking', function() {
				ed.execCommand('mceInsertContent', false, (ed.plugins.visualchars && ed.plugins.visualchars.state) ? '<span class="mceItemHidden mceVisualNbsp">&middot;</span>' : '&nbsp;');
			});

			// Register buttons
			ed.addButton('nonbreaking', {title : 'nonbreaking.nonbreaking_desc', cmd : 'mceNonBreaking'});

			if (ed.getParam('nonbreaking_force_tab')) {
				ed.onKeyDown.add(function(ed, e) {
					if (tinymce.isIE && e.keyCode == 9) {
						ed.execCommand('mceNonBreaking');
						ed.execCommand('mceNonBreaking');
						ed.execCommand('mceNonBreaking');
						tinymce.dom.Event.cancel(e);
					}
				});
			}
		},

		getInfo : function() {
			return {
				longname : 'Nonbreaking space',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/nonbreaking',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}

		// Private methods
	});

	// Register plugin
	tinymce.PluginManager.add('nonbreaking', tinymce.plugins.Nonbreaking);
})();
>>>>>>> deploy
