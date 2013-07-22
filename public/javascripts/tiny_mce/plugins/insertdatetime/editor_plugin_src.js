/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('insertdatetime');

var TinyMCE_InsertDateTimePlugin = {
	getInfo : function() {
		return {
			longname : 'Insert date/time',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_insertdatetime.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	/**
	 * Returns the HTML contents of the insertdate, inserttime controls.
	 */
	getControlHTML : function(cn) {
		switch (cn) {
			case "insertdate":
				return tinyMCE.getButtonHTML(cn, 'lang_insertdate_desc', '{$pluginurl}/images/insertdate.gif', 'mceInsertDate');

			case "inserttime":
				return tinyMCE.getButtonHTML(cn, 'lang_inserttime_desc', '{$pluginurl}/images/inserttime.gif', 'mceInsertTime');
		}

		return "";
	},

	/**
	 * Executes the mceInsertDate command.
	 */
	execCommand : function(editor_id, element, command, user_interface, value) {
		/* Adds zeros infront of value */
		function addZeros(value, len) {
			value = "" + value;

			if (value.length < len) {
				for (var i=0; i<(len-value.length); i++)
					value = "0" + value;
			}

			return value;
		}

		function getDateTime(d, fmt) {
=======
 * $Id: editor_plugin_src.js 520 2008-01-07 16:30:32Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.InsertDateTime', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			ed.addCommand('mceInsertDate', function() {
				var str = t._getDateTime(new Date(), ed.getParam("plugin_insertdate_dateFormat", ed.getLang('insertdatetime.date_fmt')));

				ed.execCommand('mceInsertContent', false, str);
			});

			ed.addCommand('mceInsertTime', function() {
				var str = t._getDateTime(new Date(), ed.getParam("plugin_insertdate_timeFormat", ed.getLang('insertdatetime.time_fmt')));

				ed.execCommand('mceInsertContent', false, str);
			});

			ed.addButton('insertdate', {title : 'insertdatetime.insertdate_desc', cmd : 'mceInsertDate'});
			ed.addButton('inserttime', {title : 'insertdatetime.inserttime_desc', cmd : 'mceInsertTime'});
		},

		getInfo : function() {
			return {
				longname : 'Insert date/time',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/insertdatetime',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private methods

		_getDateTime : function(d, fmt) {
			var ed = this.editor;

			function addZeros(value, len) {
				value = "" + value;

				if (value.length < len) {
					for (var i=0; i<(len-value.length); i++)
						value = "0" + value;
				}

				return value;
			};

>>>>>>> deploy
			fmt = fmt.replace("%D", "%m/%d/%y");
			fmt = fmt.replace("%r", "%I:%M:%S %p");
			fmt = fmt.replace("%Y", "" + d.getFullYear());
			fmt = fmt.replace("%y", "" + d.getYear());
			fmt = fmt.replace("%m", addZeros(d.getMonth()+1, 2));
			fmt = fmt.replace("%d", addZeros(d.getDate(), 2));
			fmt = fmt.replace("%H", "" + addZeros(d.getHours(), 2));
			fmt = fmt.replace("%M", "" + addZeros(d.getMinutes(), 2));
			fmt = fmt.replace("%S", "" + addZeros(d.getSeconds(), 2));
			fmt = fmt.replace("%I", "" + ((d.getHours() + 11) % 12 + 1));
			fmt = fmt.replace("%p", "" + (d.getHours() < 12 ? "AM" : "PM"));
<<<<<<< HEAD
			fmt = fmt.replace("%B", "" + tinyMCE.getLang("lang_inserttime_months_long")[d.getMonth()]);
			fmt = fmt.replace("%b", "" + tinyMCE.getLang("lang_inserttime_months_short")[d.getMonth()]);
			fmt = fmt.replace("%A", "" + tinyMCE.getLang("lang_inserttime_day_long")[d.getDay()]);
			fmt = fmt.replace("%a", "" + tinyMCE.getLang("lang_inserttime_day_short")[d.getDay()]);
=======
			fmt = fmt.replace("%B", "" + ed.getLang("insertdatetime.months_long").split(',')[d.getMonth()]);
			fmt = fmt.replace("%b", "" + ed.getLang("insertdatetime.months_short").split(',')[d.getMonth()]);
			fmt = fmt.replace("%A", "" + ed.getLang("insertdatetime.day_long").split(',')[d.getDay()]);
			fmt = fmt.replace("%a", "" + ed.getLang("insertdatetime.day_short").split(',')[d.getDay()]);
>>>>>>> deploy
			fmt = fmt.replace("%%", "%");

			return fmt;
		}
<<<<<<< HEAD

		// Handle commands
		switch (command) {
			case "mceInsertDate":
				tinyMCE.execInstanceCommand(editor_id, 'mceInsertContent', false, getDateTime(new Date(), tinyMCE.getParam("plugin_insertdate_dateFormat", tinyMCE.getLang('lang_insertdate_def_fmt'))));
				return true;

			case "mceInsertTime":
				tinyMCE.execInstanceCommand(editor_id, 'mceInsertContent', false, getDateTime(new Date(), tinyMCE.getParam("plugin_insertdate_timeFormat", tinyMCE.getLang('lang_inserttime_def_fmt'))));
				return true;
		}

		// Pass to next handler in chain
		return false;
	}
};

tinyMCE.addPlugin("insertdatetime", TinyMCE_InsertDateTimePlugin);
=======
	});

	// Register plugin
	tinymce.PluginManager.add('insertdatetime', tinymce.plugins.InsertDateTime);
})();
>>>>>>> deploy
