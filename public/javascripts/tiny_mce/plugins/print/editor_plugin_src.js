/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import theme	specific language pack */
tinyMCE.importPluginLanguagePack('print');

var TinyMCE_PrintPlugin = {
	getInfo : function() {
		return {
			longname : 'Print',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_print.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	getControlHTML : function(cn)	{
		switch (cn) {
			case "print":
				return tinyMCE.getButtonHTML(cn, 'lang_print_desc', '{$pluginurl}/images/print.gif', 'mcePrint');
		}

		return "";
	},

	/**
	 * Executes	the	search/replace commands.
	 */
	execCommand : function(editor_id, element, command,	user_interface,	value) {
		// Handle commands
		switch (command) {
			case "mcePrint":
				tinyMCE.getInstanceById(editor_id).contentWindow.print();
				return true;
		}

		// Pass to next handler in chain
		return false;
	}
};

tinyMCE.addPlugin("print", TinyMCE_PrintPlugin);
=======
 * $Id: editor_plugin_src.js 520 2008-01-07 16:30:32Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.Print', {
		init : function(ed, url) {
			ed.addCommand('mcePrint', function() {
				ed.getWin().print();
			});

			ed.addButton('print', {title : 'print.print_desc', cmd : 'mcePrint'});
		},

		getInfo : function() {
			return {
				longname : 'Print',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/print',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('print', tinymce.plugins.Print);
})();
>>>>>>> deploy
