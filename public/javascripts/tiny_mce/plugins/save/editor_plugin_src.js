/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('save');

var TinyMCE_SavePlugin = {
	getInfo : function() {
		return {
			longname : 'Save',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_save.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	initInstance : function(inst) {
		inst.addShortcut('ctrl', 's', 'lang_save_desc', 'mceSave');
	},

	/**
	 * Returns the HTML contents of the save control.
	 */
	getControlHTML : function(cn) {
		switch (cn) {
			case "save":
				return tinyMCE.getButtonHTML(cn, 'lang_save_desc', '{$pluginurl}/images/save.gif', 'mceSave');
		}

		return "";
	},

	/**
	 * Executes the save command.
	 */
	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle commands
		switch (command) {
			case "mceSave":
				if (tinyMCE.getParam("fullscreen_is_enabled"))
					return true;

				var inst = tinyMCE.selectedInstance;
				var formObj = inst.formElement.form;

				if (tinyMCE.getParam("save_enablewhendirty") && !inst.isDirty())
					return true;

				if (formObj) {
					tinyMCE.triggerSave();

					// Use callback instead
					var os;
					if ((os = tinyMCE.getParam("save_onsavecallback"))) {
						if (eval(os + '(inst);')) {
							inst.startContent = tinyMCE.trim(inst.getBody().innerHTML);
							/*inst.undoLevels = new Array();
							inst.undoIndex = 0;
							inst.typingUndoIndex = -1;
							inst.undoRedo = true;
							inst.undoLevels[inst.undoLevels.length] = inst.startContent;*/
							tinyMCE.triggerNodeChange(false, true);
						}

						return true;
					}

					// Disable all UI form elements that TinyMCE created
					for (var i=0; i<formObj.elements.length; i++) {
						var elementId = formObj.elements[i].name ? formObj.elements[i].name : formObj.elements[i].id;

						if (elementId.indexOf('mce_editor_') == 0)
							formObj.elements[i].disabled = true;
					}

					tinyMCE.isNotDirty = true;

					if (formObj.onsubmit == null || formObj.onsubmit() != false)
						inst.formElement.form.submit();
				} else
					alert("Error: No form element found.");

				return true;
		}
		// Pass to next handler in chain
		return false;
	},

	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection) {
		if (tinyMCE.getParam("fullscreen_is_enabled")) {
			tinyMCE.switchClass(editor_id + '_save', 'mceButtonDisabled');
			return true;
		}

		if (tinyMCE.getParam("save_enablewhendirty")) {
			var inst = tinyMCE.getInstanceById(editor_id);

			if (inst.isDirty()) {
				tinyMCE.switchClass(editor_id + '_save', 'mceButtonNormal');
				return true;
			}

			tinyMCE.switchClass(editor_id + '_save', 'mceButtonDisabled');
		}

		return true;
	}
};

tinyMCE.addPlugin("save", TinyMCE_SavePlugin);
=======
 * $Id: editor_plugin_src.js 851 2008-05-26 15:38:49Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.Save', {
		init : function(ed, url) {
			var t = this;

			t.editor = ed;

			// Register commands
			ed.addCommand('mceSave', t._save, t);
			ed.addCommand('mceCancel', t._cancel, t);

			// Register buttons
			ed.addButton('save', {title : 'save.save_desc', cmd : 'mceSave'});
			ed.addButton('cancel', {title : 'save.cancel_desc', cmd : 'mceCancel'});

			ed.onNodeChange.add(t._nodeChange, t);
			ed.addShortcut('ctrl+s', ed.getLang('save.save_desc'), 'mceSave');
		},

		getInfo : function() {
			return {
				longname : 'Save',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/save',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private methods

		_nodeChange : function(ed, cm, n) {
			var ed = this.editor;

			if (ed.getParam('save_enablewhendirty')) {
				cm.setDisabled('save', !ed.isDirty());
				cm.setDisabled('cancel', !ed.isDirty());
			}
		},

		// Private methods

		_save : function() {
			var ed = this.editor, formObj, os, i, elementId;

			formObj = tinymce.DOM.get(ed.id).form || tinymce.DOM.getParent(ed.id, 'form');

			if (ed.getParam("save_enablewhendirty") && !ed.isDirty())
				return;

			tinyMCE.triggerSave();

			// Use callback instead
			if (os = ed.getParam("save_onsavecallback")) {
				if (ed.execCallback('save_onsavecallback', ed)) {
					ed.startContent = tinymce.trim(ed.getContent({format : 'raw'}));
					ed.nodeChanged();
				}

				return;
			}

			if (formObj) {
				ed.isNotDirty = true;

				if (formObj.onsubmit == null || formObj.onsubmit() != false)
					formObj.submit();

				ed.nodeChanged();
			} else
				ed.windowManager.alert("Error: No form element found.");
		},

		_cancel : function() {
			var ed = this.editor, os, h = tinymce.trim(ed.startContent);

			// Use callback instead
			if (os = ed.getParam("save_oncancelcallback")) {
				ed.execCallback('save_oncancelcallback', ed);
				return;
			}

			ed.setContent(h);
			ed.undoManager.clear();
			ed.nodeChanged();
		}
	});

	// Register plugin
	tinymce.PluginManager.add('save', tinymce.plugins.Save);
})();
>>>>>>> deploy
