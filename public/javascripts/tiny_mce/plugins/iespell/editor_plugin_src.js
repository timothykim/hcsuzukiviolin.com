/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('iespell');

var TinyMCE_IESpellPlugin = {
	getInfo : function() {
		return {
			longname : 'IESpell (MSIE Only)',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_iespell.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	/**
	 * Returns the HTML contents of the iespell control.
	 */
	getControlHTML : function(cn) {
		// Is it the iespell control and is the brower MSIE.
		if (cn == "iespell" && (tinyMCE.isMSIE && !tinyMCE.isOpera))
			return tinyMCE.getButtonHTML(cn, 'lang_iespell_desc', '{$pluginurl}/images/iespell.gif', 'mceIESpell');

		return "";
	},

	/**
	 * Executes the mceIESpell command.
	 */
	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle ieSpellCommand
		if (command == "mceIESpell") {
			try {
				var ieSpell = new ActiveXObject("ieSpell.ieSpellExtension");
				ieSpell.CheckDocumentNode(tinyMCE.getInstanceById(editor_id).contentDocument.documentElement);
			} catch (e) {
				if (e.number == -2146827859) {
					if (confirm(tinyMCE.getLang("lang_iespell_download", "", true)))
						window.open('http://www.iespell.com/download.php', 'ieSpellDownload', '');
				} else
					alert("Error Loading ieSpell: Exception " + e.number);
			}

			return true;
		}

		// Pass to next handler in chain
		return false;
	}
};

tinyMCE.addPlugin("iespell", TinyMCE_IESpellPlugin);
=======
 * $Id: editor_plugin_src.js 520 2008-01-07 16:30:32Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.IESpell', {
		init : function(ed, url) {
			var t = this, sp;

			if (!tinymce.isIE)
				return;

			t.editor = ed;

			// Register commands
			ed.addCommand('mceIESpell', function() {
				try {
					sp = new ActiveXObject("ieSpell.ieSpellExtension");
					sp.CheckDocumentNode(ed.getDoc().documentElement);
				} catch (e) {
					if (e.number == -2146827859) {
						ed.windowManager.confirm(ed.getLang("iespell.download"), function(s) {
							if (s)
								window.open('http://www.iespell.com/download.php', 'ieSpellDownload', '');
						});
					} else
						ed.windowManager.alert("Error Loading ieSpell: Exception " + e.number);
				}
			});

			// Register buttons
			ed.addButton('iespell', {title : 'iespell.iespell_desc', cmd : 'mceIESpell'});
		},

		getInfo : function() {
			return {
				longname : 'IESpell (IE Only)',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/iespell',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('iespell', tinymce.plugins.IESpell);
})();
>>>>>>> deploy
