/**
<<<<<<< HEAD
 * $Id: editor_template_src.js 129 2006-10-23 09:45:17Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import theme specific language pack */
tinyMCE.importThemeLanguagePack('advanced');

var TinyMCE_AdvancedTheme = {
	// Private theme fields
	_defColors : "000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,008000,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,C0C0C0,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF,FFFFFF",
	_autoImportCSSClasses : true,
	_resizer : {},
	_buttons : [
		// Control id, button img, button title, command, user_interface, value
		['bold', '{$lang_bold_img}', 'lang_bold_desc', 'Bold'],
		['italic', '{$lang_italic_img}', 'lang_italic_desc', 'Italic'],
		['underline', '{$lang_underline_img}', 'lang_underline_desc', 'Underline'],
		['strikethrough', 'strikethrough.gif', 'lang_striketrough_desc', 'Strikethrough'],
		['justifyleft', 'justifyleft.gif', 'lang_justifyleft_desc', 'JustifyLeft'],
		['justifycenter', 'justifycenter.gif', 'lang_justifycenter_desc', 'JustifyCenter'],
		['justifyright', 'justifyright.gif', 'lang_justifyright_desc', 'JustifyRight'],
		['justifyfull', 'justifyfull.gif', 'lang_justifyfull_desc', 'JustifyFull'],
		['bullist', 'bullist.gif', 'lang_bullist_desc', 'InsertUnorderedList'],
		['numlist', 'numlist.gif', 'lang_numlist_desc', 'InsertOrderedList'],
		['outdent', 'outdent.gif', 'lang_outdent_desc', 'Outdent'],
		['indent', 'indent.gif', 'lang_indent_desc', 'Indent'],
		['cut', 'cut.gif', 'lang_cut_desc', 'Cut'],
		['copy', 'copy.gif', 'lang_copy_desc', 'Copy'],
		['paste', 'paste.gif', 'lang_paste_desc', 'Paste'],
		['undo', 'undo.gif', 'lang_undo_desc', 'Undo'],
		['redo', 'redo.gif', 'lang_redo_desc', 'Redo'],
		['link', 'link.gif', 'lang_link_desc', 'mceLink', true],
		['unlink', 'unlink.gif', 'lang_unlink_desc', 'unlink'],
		['image', 'image.gif', 'lang_image_desc', 'mceImage', true],
		['cleanup', 'cleanup.gif', 'lang_cleanup_desc', 'mceCleanup'],
		['help', 'help.gif', 'lang_help_desc', 'mceHelp'],
		['code', 'code.gif', 'lang_theme_code_desc', 'mceCodeEditor'],
		['hr', 'hr.gif', 'lang_theme_hr_desc', 'inserthorizontalrule'],
		['removeformat', 'removeformat.gif', 'lang_theme_removeformat_desc', 'removeformat'],
		['sub', 'sub.gif', 'lang_theme_sub_desc', 'subscript'],
		['sup', 'sup.gif', 'lang_theme_sup_desc', 'superscript'],
		['forecolor', 'forecolor.gif', 'lang_theme_forecolor_desc', 'forecolor', true],
		['backcolor', 'backcolor.gif', 'lang_theme_backcolor_desc', 'HiliteColor', true],
		['charmap', 'charmap.gif', 'lang_theme_charmap_desc', 'mceCharMap'],
		['visualaid', 'visualaid.gif', 'lang_theme_visualaid_desc', 'mceToggleVisualAid'],
		['anchor', 'anchor.gif', 'lang_theme_anchor_desc', 'mceInsertAnchor'],
		['newdocument', 'newdocument.gif', 'lang_newdocument_desc', 'mceNewDocument']
	],

	_buttonMap : 'anchor,backcolor,bold,bullist,charmap,cleanup,code,copy,cut,forecolor,help,hr,image,indent,italic,justifycenter,justifyfull,justifyleft,justifyright,link,newdocument,numlist,outdent,paste,redo,removeformat,strikethrough,sub,sup,underline,undo,unlink,visualaid,advhr,ltr,rtl,emotions,flash,fullpage,fullscreen,iespell,insertdate,inserttime,pastetext,pasteword,selectall,preview,print,save,replace,search,table,cell_props,delete_col,delete_row,col_after,col_before,row_after,row_before,merge_cells,row_props,split_cells,delete_table',

	/**
	 * Returns HTML code for the specificed control.
	 */
	getControlHTML : function(button_name) {
		var i, x, but;

		// Lookup button in button list
		for (i=0; i<TinyMCE_AdvancedTheme._buttons.length; i++) {
			but = TinyMCE_AdvancedTheme._buttons[i];

			if (but[0] == button_name && (button_name == "forecolor" || button_name == "backcolor"))
				return tinyMCE.getMenuButtonHTML(but[0], but[2], '{$themeurl}/images/' + but[1], but[3] + "Menu", but[3], (but.length > 4 ? but[4] : false), (but.length > 5 ? but[5] : null));

			if (but[0] == button_name)
				return tinyMCE.getButtonHTML(but[0], but[2], '{$themeurl}/images/' + but[1], but[3], (but.length > 4 ? but[4] : false), (but.length > 5 ? but[5] : null));
		}

		// Custom controlls other than buttons
		switch (button_name) {
			case "formatselect":
				var html = '<select id="{$editor_id}_formatSelect" name="{$editor_id}_formatSelect" onfocus="tinyMCE.addSelectAccessibility(event, this, window);" onchange="tinyMCE.execInstanceCommand(\'{$editor_id}\',\'FormatBlock\',false,this.options[this.selectedIndex].value);" class="mceSelectList">';
				var formats = tinyMCE.getParam("theme_advanced_blockformats", "p,address,pre,h1,h2,h3,h4,h5,h6", true).split(',');
				var lookup = [
					['p', '{$lang_theme_paragraph}'],
					['address', '{$lang_theme_address}'],
					['pre', '{$lang_theme_pre}'],
					['h1', '{$lang_theme_h1}'],
					['h2', '{$lang_theme_h2}'],
					['h3', '{$lang_theme_h3}'],
					['h4', '{$lang_theme_h4}'],
					['h5', '{$lang_theme_h5}'],
					['h6', '{$lang_theme_h6}'],
					['div', '{$lang_theme_div}'],
					['blockquote', '{$lang_theme_blockquote}'],
					['code', '{$lang_theme_code}'],
					['dt', '{$lang_theme_dt}'],
					['dd', '{$lang_theme_dd}'],
					['samp', '{$lang_theme_samp}']
				];

				html += '<option value="">{$lang_theme_block}</option>';

				// Build format select
				for (var i=0; i<formats.length; i++) {
					for (var x=0; x<lookup.length; x++) {
						if (formats[i] == lookup[x][0])
							html += '<option value="&lt;' + lookup[x][0] + '&gt;">' + lookup[x][1] + '</option>';
					}
				}

				html += '</select>';

				return html;

			case "styleselect":
				return '<select id="{$editor_id}_styleSelect" onmousedown="tinyMCE.themes.advanced._setupCSSClasses(\'{$editor_id}\');" name="{$editor_id}_styleSelect" onfocus="tinyMCE.addSelectAccessibility(event,this,window);" onchange="tinyMCE.execInstanceCommand(\'{$editor_id}\',\'mceSetCSSClass\',false,this.options[this.selectedIndex].value);" class="mceSelectList">{$style_select_options}</select>';

			case "fontselect":
				var fontHTML = '<select id="{$editor_id}_fontNameSelect" name="{$editor_id}_fontNameSelect" onfocus="tinyMCE.addSelectAccessibility(event, this, window);" onchange="tinyMCE.execInstanceCommand(\'{$editor_id}\',\'FontName\',false,this.options[this.selectedIndex].value);" class="mceSelectList"><option value="">{$lang_theme_fontdefault}</option>';
				var iFonts = 'Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,times new roman,times,serif;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times,serif;Verdana=verdana,arial,helvetica,sans-serif;Impact=impact;WingDings=wingdings';
				var nFonts = 'Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sand;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats';
				var fonts = tinyMCE.getParam("theme_advanced_fonts", nFonts).split(';');
				for (i=0; i<fonts.length; i++) {
					if (fonts[i] != '') {
						var parts = fonts[i].split('=');
						fontHTML += '<option value="' + parts[1] + '">' + parts[0] + '</option>';
					}
				}

				fontHTML += '</select>';
				return fontHTML;

			case "fontsizeselect":
				return '<select id="{$editor_id}_fontSizeSelect" name="{$editor_id}_fontSizeSelect" onfocus="tinyMCE.addSelectAccessibility(event, this, window);" onchange="tinyMCE.execInstanceCommand(\'{$editor_id}\',\'FontSize\',false,this.options[this.selectedIndex].value);" class="mceSelectList">'+
						'<option value="0">{$lang_theme_font_size}</option>'+
						'<option value="1">1 (8 pt)</option>'+
						'<option value="2">2 (10 pt)</option>'+
						'<option value="3">3 (12 pt)</option>'+
						'<option value="4">4 (14 pt)</option>'+
						'<option value="5">5 (18 pt)</option>'+
						'<option value="6">6 (24 pt)</option>'+
						'<option value="7">7 (36 pt)</option>'+
						'</select>';

			case "|":
			case "separator":
				return '<img src="{$themeurl}/images/separator.gif" width="2" height="20" class="mceSeparatorLine" />';

			case "spacer":
				return '<img src="{$themeurl}/images/separator.gif" width="2" height="15" border="0" class="mceSeparatorLine" style="vertical-align: middle" />';

			case "rowseparator":
				return '<br />';
		}

		return "";
	},

	/**
	 * Theme specific execcommand handling.
	 */
	execCommand : function(editor_id, element, command, user_interface, value) {
		switch (command) {
			case 'mceHelp':
				tinyMCE.openWindow({
					file : 'about.htm',
					width : 480,
					height : 380
				}, {
					tinymce_version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion,
					tinymce_releasedate : tinyMCE.releaseDate,
					inline : "yes"
				});
			return true;

			case "mceLink":
				var inst = tinyMCE.getInstanceById(editor_id);
				var doc = inst.getDoc();
				var selectedText = "";

				if (tinyMCE.isMSIE) {
					var rng = doc.selection.createRange();
					selectedText = rng.text;
				} else
					selectedText = inst.getSel().toString();

				if (!tinyMCE.linkElement) {
					if ((tinyMCE.selectedElement.nodeName.toLowerCase() != "img") && (selectedText.length <= 0))
						return true;
				}

				var href = "", target = "", title = "", onclick = "", action = "insert", style_class = "";

				if (tinyMCE.selectedElement.nodeName.toLowerCase() == "a")
					tinyMCE.linkElement = tinyMCE.selectedElement;

				// Is anchor not a link
				if (tinyMCE.linkElement != null && tinyMCE.getAttrib(tinyMCE.linkElement, 'href') == "")
					tinyMCE.linkElement = null;

				if (tinyMCE.linkElement) {
					href = tinyMCE.getAttrib(tinyMCE.linkElement, 'href');
					target = tinyMCE.getAttrib(tinyMCE.linkElement, 'target');
					title = tinyMCE.getAttrib(tinyMCE.linkElement, 'title');
					onclick = tinyMCE.getAttrib(tinyMCE.linkElement, 'onclick');
					style_class = tinyMCE.getAttrib(tinyMCE.linkElement, 'class');

					// Try old onclick to if copy/pasted content
					if (onclick == "")
						onclick = tinyMCE.getAttrib(tinyMCE.linkElement, 'onclick');

					onclick = tinyMCE.cleanupEventStr(onclick);

					href = eval(tinyMCE.settings['urlconverter_callback'] + "(href, tinyMCE.linkElement, true);");

					// Use mce_href if defined
					mceRealHref = tinyMCE.getAttrib(tinyMCE.linkElement, 'mce_href');
					if (mceRealHref != "") {
						href = mceRealHref;

						if (tinyMCE.getParam('convert_urls'))
							href = eval(tinyMCE.settings['urlconverter_callback'] + "(href, tinyMCE.linkElement, true);");
					}

					action = "update";
				}

				var template = new Array();

				template['file'] = 'link.htm';
				template['width'] = 310;
				template['height'] = 200;

				// Language specific width and height addons
				template['width'] += tinyMCE.getLang('lang_insert_link_delta_width', 0);
				template['height'] += tinyMCE.getLang('lang_insert_link_delta_height', 0);

				if (inst.settings['insertlink_callback']) {
					var returnVal = eval(inst.settings['insertlink_callback'] + "(href, target, title, onclick, action, style_class);");
					if (returnVal && returnVal['href'])
						TinyMCE_AdvancedTheme._insertLink(returnVal['href'], returnVal['target'], returnVal['title'], returnVal['onclick'], returnVal['style_class']);
				} else {
					tinyMCE.openWindow(template, {href : href, target : target, title : title, onclick : onclick, action : action, className : style_class, inline : "yes"});
				}

				return true;

			case "mceImage":
				var src = "", alt = "", border = "", hspace = "", vspace = "", width = "", height = "", align = "";
				var title = "", onmouseover = "", onmouseout = "", action = "insert";
				var img = tinyMCE.imgElement;
				var inst = tinyMCE.getInstanceById(editor_id);

				if (tinyMCE.selectedElement != null && tinyMCE.selectedElement.nodeName.toLowerCase() == "img") {
					img = tinyMCE.selectedElement;
					tinyMCE.imgElement = img;
				}

				if (img) {
					// Is it a internal MCE visual aid image, then skip this one.
					if (tinyMCE.getAttrib(img, 'name').indexOf('mce_') == 0)
						return true;

					src = tinyMCE.getAttrib(img, 'src');
					alt = tinyMCE.getAttrib(img, 'alt');

					// Try polling out the title
					if (alt == "")
						alt = tinyMCE.getAttrib(img, 'title');

					// Fix width/height attributes if the styles is specified
					if (tinyMCE.isGecko) {
						var w = img.style.width;
						if (w != null && w != "")
							img.setAttribute("width", w);

						var h = img.style.height;
						if (h != null && h != "")
							img.setAttribute("height", h);
					}

					border = tinyMCE.getAttrib(img, 'border');
					hspace = tinyMCE.getAttrib(img, 'hspace');
					vspace = tinyMCE.getAttrib(img, 'vspace');
					width = tinyMCE.getAttrib(img, 'width');
					height = tinyMCE.getAttrib(img, 'height');
					align = tinyMCE.getAttrib(img, 'align');
					onmouseover = tinyMCE.getAttrib(img, 'onmouseover');
					onmouseout = tinyMCE.getAttrib(img, 'onmouseout');
					title = tinyMCE.getAttrib(img, 'title');

					// Is realy specified?
					if (tinyMCE.isMSIE) {
						width = img.attributes['width'].specified ? width : "";
						height = img.attributes['height'].specified ? height : "";
					}

					//onmouseover = tinyMCE.getImageSrc(tinyMCE.cleanupEventStr(onmouseover));
					//onmouseout = tinyMCE.getImageSrc(tinyMCE.cleanupEventStr(onmouseout));

					src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, img, true);");

					// Use mce_src if defined
					mceRealSrc = tinyMCE.getAttrib(img, 'mce_src');
					if (mceRealSrc != "") {
						src = mceRealSrc;

						if (tinyMCE.getParam('convert_urls'))
							src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, img, true);");
					}

					//if (onmouseover != "")
					//	onmouseover = eval(tinyMCE.settings['urlconverter_callback'] + "(onmouseover, img, true);");

					//if (onmouseout != "")
					//	onmouseout = eval(tinyMCE.settings['urlconverter_callback'] + "(onmouseout, img, true);");

					action = "update";
				}

				var template = new Array();

				template['file'] = 'image.htm?src={$src}';
				template['width'] = 355;
				template['height'] = 265 + (tinyMCE.isMSIE ? 25 : 0);

				// Language specific width and height addons
				template['width'] += tinyMCE.getLang('lang_insert_image_delta_width', 0);
				template['height'] += tinyMCE.getLang('lang_insert_image_delta_height', 0);

				if (inst.settings['insertimage_callback']) {
					var returnVal = eval(inst.settings['insertimage_callback'] + "(src, alt, border, hspace, vspace, width, height, align, title, onmouseover, onmouseout, action);");
					if (returnVal && returnVal['src'])
						TinyMCE_AdvancedTheme._insertImage(returnVal['src'], returnVal['alt'], returnVal['border'], returnVal['hspace'], returnVal['vspace'], returnVal['width'], returnVal['height'], returnVal['align'], returnVal['title'], returnVal['onmouseover'], returnVal['onmouseout']);
				} else
					tinyMCE.openWindow(template, {src : src, alt : alt, border : border, hspace : hspace, vspace : vspace, width : width, height : height, align : align, title : title, onmouseover : onmouseover, onmouseout : onmouseout, action : action, inline : "yes"});

				return true;

			case "forecolor":
				var fcp = new TinyMCE_Layer(editor_id + '_fcPreview', false), p, img, elm;

				TinyMCE_AdvancedTheme._hideMenus(editor_id);

				if (!fcp.exists()) {
					fcp.create('div', 'mceColorPreview', document.getElementById(editor_id + '_toolbar'));
					elm = fcp.getElement();
					elm._editor_id = editor_id;
					elm._command = "forecolor";
					elm._switchId = editor_id + "_forecolor";
					tinyMCE.addEvent(elm, 'click', TinyMCE_AdvancedTheme._handleMenuEvent);
					tinyMCE.addEvent(elm, 'mouseover', TinyMCE_AdvancedTheme._handleMenuEvent);
					tinyMCE.addEvent(elm, 'mouseout', TinyMCE_AdvancedTheme._handleMenuEvent);
				}

				img = tinyMCE.selectNodes(document.getElementById(editor_id + "_forecolor"), function(n) {return n.nodeName == "IMG";})[0];
				p = tinyMCE.getAbsPosition(img, document.getElementById(editor_id + '_toolbar'));

				fcp.moveTo(p.absLeft, p.absTop);
				fcp.getElement().style.backgroundColor = value != null ? value : tinyMCE.getInstanceById(editor_id).foreColor;
				fcp.show();

				return false;

			case "forecolorMenu":
				TinyMCE_AdvancedTheme._hideMenus(editor_id);

				// Create color layer
				var ml = new TinyMCE_Layer(editor_id + '_fcMenu');

				if (!ml.exists())
					ml.create('div', 'mceMenu', document.body, TinyMCE_AdvancedTheme._getColorHTML(editor_id, 'theme_advanced_text_colors', 'forecolor'));

				tinyMCE.switchClass(editor_id + '_forecolor', 'mceMenuButtonFocus');
				ml.moveRelativeTo(document.getElementById(editor_id + "_forecolor"), 'bl');

				ml.moveBy(tinyMCE.isMSIE && !tinyMCE.isOpera ? -1 : 1, -1);

				if (tinyMCE.isOpera)
					ml.moveBy(0, -2);

				ml.show();
			return true;

			case "HiliteColor":
				var bcp = new TinyMCE_Layer(editor_id + '_bcPreview', false), p, img;

				TinyMCE_AdvancedTheme._hideMenus(editor_id);

				if (!bcp.exists()) {
					bcp.create('div', 'mceColorPreview', document.getElementById(editor_id + '_toolbar'));
					elm = bcp.getElement();
					elm._editor_id = editor_id;
					elm._command = "HiliteColor";
					elm._switchId = editor_id + "_backcolor";
					tinyMCE.addEvent(elm, 'click', TinyMCE_AdvancedTheme._handleMenuEvent);
					tinyMCE.addEvent(elm, 'mouseover', TinyMCE_AdvancedTheme._handleMenuEvent);
					tinyMCE.addEvent(elm, 'mouseout', TinyMCE_AdvancedTheme._handleMenuEvent);
				}

				img = tinyMCE.selectNodes(document.getElementById(editor_id + "_backcolor"), function(n) {return n.nodeName == "IMG";})[0];
				p = tinyMCE.getAbsPosition(img, document.getElementById(editor_id + '_toolbar'));

				bcp.moveTo(p.absLeft, p.absTop);
				bcp.getElement().style.backgroundColor = value != null ? value : tinyMCE.getInstanceById(editor_id).backColor;
				bcp.show();

				return false;

			case "HiliteColorMenu":
				TinyMCE_AdvancedTheme._hideMenus(editor_id);

				// Create color layer
				var ml = new TinyMCE_Layer(editor_id + '_bcMenu');

				if (!ml.exists())
					ml.create('div', 'mceMenu', document.body, TinyMCE_AdvancedTheme._getColorHTML(editor_id, 'theme_advanced_background_colors', 'HiliteColor'));

				tinyMCE.switchClass(editor_id + '_backcolor', 'mceMenuButtonFocus');
				ml.moveRelativeTo(document.getElementById(editor_id + "_backcolor"), 'bl');

				ml.moveBy(tinyMCE.isMSIE && !tinyMCE.isOpera ? -1 : 1, -1);

				if (tinyMCE.isOpera)
					ml.moveBy(0, -2);

				ml.show();
			return true;

			case "mceColorPicker":
				if (user_interface) {
					var template = new Array();
					var inputColor = value['document'].getElementById(value['element_id']).value;

					template['file'] = 'color_picker.htm';
					template['width'] = 220;
					template['height'] = 190;
					template['close_previous'] = "no";

					template['width'] += tinyMCE.getLang('lang_theme_advanced_colorpicker_delta_width', 0);
					template['height'] += tinyMCE.getLang('lang_theme_advanced_colorpicker_delta_height', 0);

					if (typeof(value['store_selection']) == "undefined")
						value['store_selection'] = true;

					tinyMCE.lastColorPickerValue = value;
					tinyMCE.openWindow(template, {editor_id : editor_id, mce_store_selection : value['store_selection'], inline : "yes", command : "mceColorPicker", input_color : inputColor});
				} else {
					var savedVal = tinyMCE.lastColorPickerValue;
					var elm = savedVal['document'].getElementById(savedVal['element_id']);
					elm.value = value;

					if (elm.onchange != null && elm.onchange != '')
						eval('elm.onchange();');
				}
			return true;

			case "mceCodeEditor":
				var template = new Array();

				template['file'] = 'source_editor.htm';
				template['width'] = parseInt(tinyMCE.getParam("theme_advanced_source_editor_width", 720));
				template['height'] = parseInt(tinyMCE.getParam("theme_advanced_source_editor_height", 580));

				tinyMCE.openWindow(template, {editor_id : editor_id, resizable : "yes", scrollbars : "no", inline : "yes"});
				return true;

			case "mceCharMap":
				var template = new Array();

				template['file'] = 'charmap.htm';
				template['width'] = 550 + (tinyMCE.isOpera ? 40 : 0);
				template['height'] = 250;

				template['width'] += tinyMCE.getLang('lang_theme_advanced_charmap_delta_width', 0);
				template['height'] += tinyMCE.getLang('lang_theme_advanced_charmap_delta_height', 0);

				tinyMCE.openWindow(template, {editor_id : editor_id, inline : "yes"});
				return true;

			case "mceInsertAnchor":
				var template = new Array();

				template['file'] = 'anchor.htm';
				template['width'] = 320;
				template['height'] = 90 + (tinyMCE.isNS7 ? 30 : 0);

				template['width'] += tinyMCE.getLang('lang_theme_advanced_anchor_delta_width', 0);
				template['height'] += tinyMCE.getLang('lang_theme_advanced_anchor_delta_height', 0);

				tinyMCE.openWindow(template, {editor_id : editor_id, inline : "yes"});
				return true;

			case "mceNewDocument":
				if (confirm(tinyMCE.getLang('lang_newdocument')))
					tinyMCE.execInstanceCommand(editor_id, 'mceSetContent', false, ' ');

				return true;
		}

		return false;
	},

	/**
	 * Editor instance template function.
	 */
	getEditorTemplate : function(settings, editorId) {
		function removeFromArray(in_array, remove_array) {
			var outArray = new Array(), skip;
			
			for (var i=0; i<in_array.length; i++) {
				skip = false;

				for (var j=0; j<remove_array.length; j++) {
					if (in_array[i] == remove_array[j]) {
						skip = true;
					}
				}

				if (!skip) {
					outArray[outArray.length] = in_array[i];
				}
			}

			return outArray;
		}

		function addToArray(in_array, add_array) {
			for (var i=0; i<add_array.length; i++) {
				in_array[in_array.length] = add_array[i];
			}

			return in_array;
		}

		var template = new Array();
		var deltaHeight = 0;
		var resizing = tinyMCE.getParam("theme_advanced_resizing", false);
		var path = tinyMCE.getParam("theme_advanced_path", true);
		var statusbarHTML = '<div id="{$editor_id}_path" class="mceStatusbarPathText" style="display: ' + (path ? "block" : "none") + '">&#160;</div><div id="{$editor_id}_resize" class="mceStatusbarResize" style="display: ' + (resizing ? "block" : "none") + '" onmousedown="tinyMCE.themes.advanced._setResizing(event,\'{$editor_id}\',true);"></div><br style="clear: both" />';
		var layoutManager = tinyMCE.getParam("theme_advanced_layout_manager", "SimpleLayout");

		// Setup style select options -- MOVED UP FOR EXTERNAL TOOLBAR COMPATABILITY!
		var styleSelectHTML = '<option value="">{$lang_theme_style_select}</option>';
		if (settings['theme_advanced_styles']) {
			var stylesAr = settings['theme_advanced_styles'].split(';');
			
			for (var i=0; i<stylesAr.length; i++) {
				var key, value;

				key = stylesAr[i].split('=')[0];
				value = stylesAr[i].split('=')[1];

				styleSelectHTML += '<option value="' + value + '">' + key + '</option>';
			}

			TinyMCE_AdvancedTheme._autoImportCSSClasses = false;
		}

		switch(layoutManager) {
			case "SimpleLayout" : //the default TinyMCE Layout (for backwards compatibility)...
				var toolbarHTML = "";
				var toolbarLocation = tinyMCE.getParam("theme_advanced_toolbar_location", "bottom");
				var toolbarAlign = tinyMCE.getParam("theme_advanced_toolbar_align", "center");
				var pathLocation = tinyMCE.getParam("theme_advanced_path_location", "none"); // Compatiblity
				var statusbarLocation = tinyMCE.getParam("theme_advanced_statusbar_location", pathLocation);
				var defVals = {
					theme_advanced_buttons1 : "bold,italic,underline,strikethrough,separator,justifyleft,justifycenter,justifyright,justifyfull,separator,styleselect,formatselect",
					theme_advanced_buttons2 : "bullist,numlist,separator,outdent,indent,separator,undo,redo,separator,link,unlink,anchor,image,cleanup,help,code",
					theme_advanced_buttons3 : "hr,removeformat,visualaid,separator,sub,sup,separator,charmap"
				};

				// Add accessibility control
				toolbarHTML += '<a href="#" accesskey="q" title="' + tinyMCE.getLang("lang_toolbar_focus") + '"';

				if (!tinyMCE.getParam("accessibility_focus"))
					toolbarHTML += ' onfocus="tinyMCE.getInstanceById(\'' + editorId + '\').getWin().focus();"';

				toolbarHTML += '></a>';

				// Render rows
				for (var i=1; i<100; i++) {
					var def = defVals["theme_advanced_buttons" + i];

					var buttons = tinyMCE.getParam("theme_advanced_buttons" + i, def == null ? '' : def, true, ',');
					if (buttons.length == 0)
						break;

					buttons = removeFromArray(buttons, tinyMCE.getParam("theme_advanced_disable", "", true, ','));
					buttons = addToArray(buttons, tinyMCE.getParam("theme_advanced_buttons" + i + "_add", "", true, ','));
					buttons = addToArray(tinyMCE.getParam("theme_advanced_buttons" + i + "_add_before", "", true, ','), buttons);

					for (var b=0; b<buttons.length; b++)
						toolbarHTML += tinyMCE.getControlHTML(buttons[b]);

					if (buttons.length > 0) {
						toolbarHTML += "<br />";
						deltaHeight -= 23;
					}
				}

				// Add accessibility control
				toolbarHTML += '<a href="#" accesskey="z" onfocus="tinyMCE.getInstanceById(\'' + editorId + '\').getWin().focus();"></a>';

				// Setup template html
				template['html'] = '<table class="mceEditor" border="0" cellpadding="0" cellspacing="0" width="{$width}" height="{$height}" style="width:{$width_style};height:{$height_style}"><tbody>';

				if (toolbarLocation == "top") {
					template['html'] += '<tr><td class="mceToolbarTop" align="' + toolbarAlign + '" height="1" nowrap="nowrap"><span id="' + editorId + '_toolbar" class="mceToolbarContainer">' + toolbarHTML + '</span></td></tr>';
				}

				if (statusbarLocation == "top") {
					template['html'] += '<tr><td class="mceStatusbarTop" height="1">' + statusbarHTML + '</td></tr>';
					deltaHeight -= 23;
				}

				template['html'] += '<tr><td align="center"><span id="{$editor_id}"></span></td></tr>';

				if (toolbarLocation == "bottom") {
					template['html'] += '<tr><td class="mceToolbarBottom" align="' + toolbarAlign + '" height="1"><span id="' + editorId + '_toolbar" class="mceToolbarContainer">' + toolbarHTML + '</span></td></tr>';
				}

				// External toolbar changes
				if (toolbarLocation == "external") {
					var bod = document.body;
					var elm = document.createElement ("div");

					toolbarHTML = tinyMCE.replaceVar(toolbarHTML, 'style_select_options', styleSelectHTML);
					toolbarHTML = tinyMCE.applyTemplate(toolbarHTML, {editor_id : editorId});

					elm.className = "mceToolbarExternal";
					elm.id = editorId+"_toolbar";
					elm.innerHTML = '<table width="100%" border="0" align="center"><tr><td align="center">'+toolbarHTML+'</td></tr></table>';
					bod.appendChild (elm);
					// bod.style.marginTop = elm.offsetHeight + "px";

					deltaHeight = 0;
					tinyMCE.getInstanceById(editorId).toolbarElement = elm;

					//template['html'] = '<div id="mceExternalToolbar" align="center" class="mceToolbarExternal"><table width="100%" border="0" align="center"><tr><td align="center">'+toolbarHTML+'</td></tr></table></div>' + template["html"];
				} else {
					tinyMCE.getInstanceById(editorId).toolbarElement = null;
				}

				if (statusbarLocation == "bottom") {
					template['html'] += '<tr><td class="mceStatusbarBottom" height="1">' + statusbarHTML + '</td></tr>';
					deltaHeight -= 23;
				}

				template['html'] += '</tbody></table>';
				//"SimpleLayout"
			break;

			case "RowLayout" : //Container Layout - containers defined in "theme_advanced_containers" are rendered from top to bottom.
				template['html'] = '<table class="mceEditor" border="0" cellpadding="0" cellspacing="0" width="{$width}" height="{$height}" style="width:{$width}px;height:{$height}px"><tbody>';

				var containers = tinyMCE.getParam("theme_advanced_containers", "", true, ",");
				var defaultContainerCSS = tinyMCE.getParam("theme_advanced_containers_default_class", "container");
				var defaultContainerAlign = tinyMCE.getParam("theme_advanced_containers_default_align", "center");

				//Render Containers:
				for (var i = 0; i < containers.length; i++)
				{
					if (containers[i] == "mceEditor") //Exceptions for mceEditor and ...
						template['html'] += '<tr><td align="center" class="mceEditor_border"><span id="{$editor_id}"></span></td></tr>';
					else if (containers[i] == "mceElementpath" || containers[i] == "mceStatusbar") // ... mceElementpath:
					{
						var pathClass = "mceStatusbar";

						if (i == containers.length-1)
						{
							pathClass = "mceStatusbarBottom";
						}
						else if (i == 0)
						{
							pathClass = "mceStatusbar";
						}
						else
						{
							deltaHeight-=2;
						}

						template['html'] += '<tr><td class="' + pathClass + '" height="1">' + statusbarHTML + '</td></tr>';
						deltaHeight -= 22;
					} else { // Render normal Container
						var curContainer = tinyMCE.getParam("theme_advanced_container_"+containers[i], "", true, ',');
						var curContainerHTML = "";
						var curAlign = tinyMCE.getParam("theme_advanced_container_"+containers[i]+"_align", defaultContainerAlign);
						var curCSS = tinyMCE.getParam("theme_advanced_container_"+containers[i]+"_class", defaultContainerCSS);

						curContainer = removeFromArray(curContainer, tinyMCE.getParam("theme_advanced_disable", "", true, ','));

						for (var j=0; j<curContainer.length; j++)
							curContainerHTML += tinyMCE.getControlHTML(curContainer[j]);

						if (curContainer.length > 0) {
							curContainerHTML += "<br />";
							deltaHeight -= 23;
						}

						template['html'] += '<tr><td class="' + curCSS + '" align="' + curAlign + '" height="1">' + curContainerHTML + '</td></tr>';
					}
				}

				template['html'] += '</tbody></table>';
				//RowLayout
			break;

			case "CustomLayout" : //User defined layout callback...
				var customLayout = tinyMCE.getParam("theme_advanced_custom_layout","");

				if (customLayout != "" && eval("typeof(" + customLayout + ")") != "undefined") {
					template = eval(customLayout + "(template);");
				}
			break;
		}

		if (resizing)
			template['html'] += '<span id="{$editor_id}_resize_box" class="mceResizeBox"></span>';

		template['html'] = tinyMCE.replaceVar(template['html'], 'style_select_options', styleSelectHTML);
		template['delta_width'] = 0;
		template['delta_height'] = deltaHeight;

		return template;
	},

	initInstance : function(inst) {
		if (tinyMCE.getParam("theme_advanced_resizing", false)) {
			if (tinyMCE.getParam("theme_advanced_resizing_use_cookie", true)) {
				var w = TinyMCE_AdvancedTheme._getCookie("TinyMCE_" + inst.editorId + "_width");
				var h = TinyMCE_AdvancedTheme._getCookie("TinyMCE_" + inst.editorId + "_height");

				TinyMCE_AdvancedTheme._resizeTo(inst, w, h, tinyMCE.getParam("theme_advanced_resize_horizontal", true));
			}
		}

		inst.addShortcut('ctrl', 'k', 'lang_link_desc', 'mceLink');
	},

	_handleMenuEvent : function(e) {
		var te = tinyMCE.isMSIE ? window.event.srcElement : e.target;
		tinyMCE._menuButtonEvent(e.type == "mouseover" ? "over" : "out", document.getElementById(te._switchId));

		if (e.type == "click")
			tinyMCE.execInstanceCommand(te._editor_id, te._command);
	},

	_hideMenus : function(id) {
		var fcml = new TinyMCE_Layer(id + '_fcMenu'), bcml = new TinyMCE_Layer(id + '_bcMenu');

		if (fcml.exists() && fcml.isVisible()) {
			tinyMCE.switchClass(id + '_forecolor', 'mceMenuButton');
			fcml.hide();
		}

		if (bcml.exists() && bcml.isVisible()) {
			tinyMCE.switchClass(id + '_backcolor', 'mceMenuButton');
			bcml.hide();
		}
	},

	/**
	 * Node change handler.
	 */
	handleNodeChange : function(editor_id, node, undo_index, undo_levels, visual_aid, any_selection, setup_content) {
		var alignNode, breakOut, classNode;

		function selectByValue(select_elm, value, first_index) {
			first_index = typeof(first_index) == "undefined" ? false : true;

			if (select_elm) {
				for (var i=0; i<select_elm.options.length; i++) {
					var ov = "" + select_elm.options[i].value;

					if (first_index && ov.toLowerCase().indexOf(value.toLowerCase()) == 0) {
						select_elm.selectedIndex = i;
						return true;
					}

					if (ov == value) {
						select_elm.selectedIndex = i;
						return true;
					}
				}
			}

			return false;
		};

		function getAttrib(elm, name) {
			return elm.getAttribute(name) ? elm.getAttribute(name) : "";
		};

		// No node provided
		if (node == null)
			return;

		// Update path
		var pathElm = document.getElementById(editor_id + "_path");
		var inst = tinyMCE.getInstanceById(editor_id);
		var doc = inst.getDoc();
		TinyMCE_AdvancedTheme._hideMenus(editor_id);

		if (pathElm) {
			// Get node path
			var parentNode = node;
			var path = new Array();
			
			while (parentNode != null) {
				if (parentNode.nodeName.toUpperCase() == "BODY") {
					break;
				}

				// Only append element nodes to path
				if (parentNode.nodeType == 1 && tinyMCE.getAttrib(parentNode, "class").indexOf('mceItemHidden') == -1) {
					path[path.length] = parentNode;
				}

				parentNode = parentNode.parentNode;
			}

			// Setup HTML
			var html = "";
			for (var i=path.length-1; i>=0; i--) {
				var nodeName = path[i].nodeName.toLowerCase();
				var nodeData = "";

				if (nodeName.indexOf("html:") == 0)
					nodeName = nodeName.substring(5);

				if (nodeName == "b") {
					nodeName = "strong";
				}

				if (nodeName == "i") {
					nodeName = "em";
				}

				if (nodeName == "span") {
					var cn = tinyMCE.getAttrib(path[i], "class");
					if (cn != "" && cn.indexOf('mceItem') == -1)
						nodeData += "class: " + cn + " ";

					var st = tinyMCE.getAttrib(path[i], "style");
					if (st != "") {
						st = tinyMCE.serializeStyle(tinyMCE.parseStyle(st));
						nodeData += "style: " + st + " ";
					}
				}

				if (nodeName == "font") {
					if (tinyMCE.getParam("convert_fonts_to_spans"))
						nodeName = "span";

					var face = tinyMCE.getAttrib(path[i], "face");
					if (face != "")
						nodeData += "font: " + face + " ";

					var size = tinyMCE.getAttrib(path[i], "size");
					if (size != "")
						nodeData += "size: " + size + " ";

					var color = tinyMCE.getAttrib(path[i], "color");
					if (color != "")
						nodeData += "color: " + color + " ";
				}

				if (getAttrib(path[i], 'id') != "") {
					nodeData += "id: " + path[i].getAttribute('id') + " ";
				}

				var className = tinyMCE.getVisualAidClass(tinyMCE.getAttrib(path[i], "class"), false);
				if (className != "" && className.indexOf('mceItem') == -1)
					nodeData += "class: " + className + " ";

				if (getAttrib(path[i], 'src') != "") {
					var src = tinyMCE.getAttrib(path[i], "mce_src");

					if (src == "")
						 src = tinyMCE.getAttrib(path[i], "src");

					nodeData += "src: " + src + " ";
				}

				if (path[i].nodeName == 'A' && getAttrib(path[i], 'href') != "") {
					var href = tinyMCE.getAttrib(path[i], "mce_href");

					if (href == "")
						 href = tinyMCE.getAttrib(path[i], "href");

					nodeData += "href: " + href + " ";
				}

				className = tinyMCE.getAttrib(path[i], "class");
				if ((nodeName == "img" || nodeName == "span") && className.indexOf('mceItem') != -1) {
					nodeName = className.replace(/mceItem([a-z]+)/gi, '$1').toLowerCase();
					nodeData = path[i].getAttribute('title');
				}

				if (nodeName == "a" && (anchor = tinyMCE.getAttrib(path[i], "name")) != "") {
					nodeName = "a";
					nodeName += "#" + anchor;
					nodeData = "";
				}

				if (getAttrib(path[i], 'name').indexOf("mce_") != 0) {
					var className = tinyMCE.getVisualAidClass(tinyMCE.getAttrib(path[i], "class"), false);
					if (className != "" && className.indexOf('mceItem') == -1) {
						nodeName += "." + className;
					}
				}

				var cmd = 'tinyMCE.execInstanceCommand(\'' + editor_id + '\',\'mceSelectNodeDepth\',false,\'' + i + '\');';
				html += '<a title="' + nodeData + '" href="javascript:' + cmd + '" onclick="' + cmd + 'return false;" onmousedown="return false;" target="_self" class="mcePathItem">' + nodeName + '</a>';

				if (i > 0) {
					html += " &raquo; ";
				}
			}

			pathElm.innerHTML = '<a href="#" accesskey="x"></a>' + tinyMCE.getLang('lang_theme_path') + ": " + html + '&#160;';
		}

		// Reset old states
		tinyMCE.switchClass(editor_id + '_justifyleft', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_justifyright', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_justifycenter', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_justifyfull', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_bold', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_italic', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_underline', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_strikethrough', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_bullist', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_numlist', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_sub', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_sup', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_anchor', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_link', 'mceButtonDisabled');
		tinyMCE.switchClass(editor_id + '_unlink', 'mceButtonDisabled');
		tinyMCE.switchClass(editor_id + '_outdent', 'mceButtonDisabled');
		tinyMCE.switchClass(editor_id + '_image', 'mceButtonNormal');
		tinyMCE.switchClass(editor_id + '_hr', 'mceButtonNormal');

		if (node.nodeName == "A" && tinyMCE.getAttrib(node, "class").indexOf('mceItemAnchor') != -1)
			tinyMCE.switchClass(editor_id + '_anchor', 'mceButtonSelected');

		// Get link
		var anchorLink = tinyMCE.getParentElement(node, "a", "href");

		if (anchorLink || any_selection) {
			tinyMCE.switchClass(editor_id + '_link', anchorLink ? 'mceButtonSelected' : 'mceButtonNormal');
			tinyMCE.switchClass(editor_id + '_unlink', anchorLink ? 'mceButtonSelected' : 'mceButtonNormal');
		}

		// Handle visual aid
		tinyMCE.switchClass(editor_id + '_visualaid', visual_aid ? 'mceButtonSelected' : 'mceButtonNormal');

		if (undo_levels != -1) {
			tinyMCE.switchClass(editor_id + '_undo', 'mceButtonDisabled');
			tinyMCE.switchClass(editor_id + '_redo', 'mceButtonDisabled');
		}

		// Within li, blockquote
		if (tinyMCE.getParentElement(node, "li,blockquote"))
			tinyMCE.switchClass(editor_id + '_outdent', 'mceButtonNormal');

		// Has redo levels
		if (undo_index != -1 && (undo_index < undo_levels-1 && undo_levels > 0))
			tinyMCE.switchClass(editor_id + '_redo', 'mceButtonNormal');

		// Has undo levels
		if (undo_index != -1 && (undo_index > 0 && undo_levels > 0))
			tinyMCE.switchClass(editor_id + '_undo', 'mceButtonNormal');

		// Select class in select box
		var selectElm = document.getElementById(editor_id + "_styleSelect");
		
		if (selectElm) {
			TinyMCE_AdvancedTheme._setupCSSClasses(editor_id);

			classNode = node;
			breakOut = false;
			var index = 0;

			do {
				if (classNode && classNode.className) {
					for (var i=0; i<selectElm.options.length; i++) {
						if (selectElm.options[i].value == classNode.className) {
							index = i;
							breakOut = true;
							break;
						}
					}
				}
			} while (!breakOut && classNode != null && (classNode = classNode.parentNode) != null);

			selectElm.selectedIndex = index;
		}

		// Select formatblock
		var selectElm = document.getElementById(editor_id + "_formatSelect");
		if (selectElm) {
			var elm = tinyMCE.getParentElement(node, "p,div,h1,h2,h3,h4,h5,h6,pre,address");

			if (elm)
				selectByValue(selectElm, "<" + elm.nodeName.toLowerCase() + ">");
			else
				selectByValue(selectElm, "");
		}

		// Select fontselect
		var selectElm = document.getElementById(editor_id + "_fontNameSelect");
		if (selectElm) {
			if (!tinyMCE.isSafari && !(tinyMCE.isMSIE && !tinyMCE.isOpera)) {
				var face = inst.queryCommandValue('FontName');

				face = face == null || face == "" ? "" : face;

				selectByValue(selectElm, face, face != "");
			} else {
				var elm = tinyMCE.getParentElement(node, "font", "face");

				if (elm) {
					var family = tinyMCE.getAttrib(elm, "face");

					if (family == '')
						family = '' + elm.style.fontFamily;

					if (!selectByValue(selectElm, family, family != ""))
						selectByValue(selectElm, "");
				} else
					selectByValue(selectElm, "");
			}
		}

		// Select fontsize
		var selectElm = document.getElementById(editor_id + "_fontSizeSelect");
		if (selectElm) {
			if (!tinyMCE.isSafari && !tinyMCE.isOpera) {
				var size = inst.queryCommandValue('FontSize');
				selectByValue(selectElm, size == null || size == "" ? "0" : size);
			} else {
				var elm = tinyMCE.getParentElement(node, "font", "size");
				if (elm) {
					var size = tinyMCE.getAttrib(elm, "size");

					if (size == '') {
						var sizes = new Array('', '8px', '10px', '12px', '14px', '18px', '24px', '36px');

						size = '' + elm.style.fontSize;

						for (var i=0; i<sizes.length; i++) {
							if (('' + sizes[i]) == size) {
								size = i;
								break;
							}
						}
					}

					if (!selectByValue(selectElm, size))
						selectByValue(selectElm, "");
				} else
					selectByValue(selectElm, "0");
			}
		}

		// Handle align attributes
		alignNode = node;
		breakOut = false;
		do {
			if (!alignNode.getAttribute || !alignNode.getAttribute('align'))
				continue;

			switch (alignNode.getAttribute('align').toLowerCase()) {
				case "left":
					tinyMCE.switchClass(editor_id + '_justifyleft', 'mceButtonSelected');
					breakOut = true;
				break;

				case "right":
					tinyMCE.switchClass(editor_id + '_justifyright', 'mceButtonSelected');
					breakOut = true;
				break;

				case "middle":
				case "center":
					tinyMCE.switchClass(editor_id + '_justifycenter', 'mceButtonSelected');
					breakOut = true;
				break;

				case "justify":
					tinyMCE.switchClass(editor_id + '_justifyfull', 'mceButtonSelected');
					breakOut = true;
				break;
			}
		} while (!breakOut && (alignNode = alignNode.parentNode) != null);

		// Div justification
		var div = tinyMCE.getParentElement(node, "div");
		if (div && div.style.textAlign == "center")
			tinyMCE.switchClass(editor_id + '_justifycenter', 'mceButtonSelected');

		// Do special text
		if (!setup_content) {
			// , "JustifyLeft", "_justifyleft", "JustifyCenter", "justifycenter", "JustifyRight", "justifyright", "JustifyFull", "justifyfull", "InsertUnorderedList", "bullist", "InsertOrderedList", "numlist", "InsertUnorderedList", "bullist", "Outdent", "outdent", "Indent", "indent", "subscript", "sub"
			var ar = new Array("Bold", "_bold", "Italic", "_italic", "Strikethrough", "_strikethrough", "superscript", "_sup", "subscript", "_sub");
			for (var i=0; i<ar.length; i+=2) {
				if (inst.queryCommandState(ar[i]))
					tinyMCE.switchClass(editor_id + ar[i+1], 'mceButtonSelected');
			}

			if (inst.queryCommandState("Underline") && (node.parentNode == null || node.parentNode.nodeName != "A"))
				tinyMCE.switchClass(editor_id + '_underline', 'mceButtonSelected');
		}

		// Handle elements
		do {
			switch (node.nodeName) {
				case "UL":
					tinyMCE.switchClass(editor_id + '_bullist', 'mceButtonSelected');
				break;

				case "OL":
					tinyMCE.switchClass(editor_id + '_numlist', 'mceButtonSelected');
				break;

				case "HR":
					 tinyMCE.switchClass(editor_id + '_hr', 'mceButtonSelected');
				break;

				case "IMG":
				if (getAttrib(node, 'name').indexOf('mce_') != 0 && tinyMCE.getAttrib(node, 'class').indexOf('mceItem') == -1) {
					tinyMCE.switchClass(editor_id + '_image', 'mceButtonSelected');
				}
				break;
			}
		} while ((node = node.parentNode) != null);
	},

	// Private theme internal functions

	// This function auto imports CSS classes into the class selection droplist
	_setupCSSClasses : function(editor_id) {
		var i, selectElm;

		if (!TinyMCE_AdvancedTheme._autoImportCSSClasses)
			return;

		selectElm = document.getElementById(editor_id + '_styleSelect');

		if (selectElm && selectElm.getAttribute('cssImported') != 'true') {
			var csses = tinyMCE.getCSSClasses(editor_id);
			if (csses && selectElm)	{
				for (i=0; i<csses.length; i++)
					selectElm.options[selectElm.options.length] = new Option(csses[i], csses[i]);
			}

			// Only do this once
			if (csses != null && csses.length > 0)
				selectElm.setAttribute('cssImported', 'true');
		}
	},

	_setCookie : function(name, value, expires, path, domain, secure) {
		var curCookie = name + "=" + escape(value) +
			((expires) ? "; expires=" + expires.toGMTString() : "") +
			((path) ? "; path=" + escape(path) : "") +
			((domain) ? "; domain=" + domain : "") +
			((secure) ? "; secure" : "");

		document.cookie = curCookie;
	},

	_getCookie : function(name) {
		var dc = document.cookie;
		var prefix = name + "=";
		var begin = dc.indexOf("; " + prefix);

		if (begin == -1) {
			begin = dc.indexOf(prefix);

			if (begin != 0)
				return null;
		} else
			begin += 2;

		var end = document.cookie.indexOf(";", begin);

		if (end == -1)
			end = dc.length;

		return unescape(dc.substring(begin + prefix.length, end));
	},

	_resizeTo : function(inst, w, h, set_w) {
		var editorContainer = document.getElementById(inst.editorId + '_parent');
		var tableElm = editorContainer.firstChild;
		var iframe = inst.iframeElement;

		if (w == null || w == "null") {
			set_w = false;
			w = 0;
		}

		if (h == null || h == "null")
			return;

		w = parseInt(w);
		h = parseInt(h);

		if (tinyMCE.isGecko) {
			w += 2;
			h += 2;
		}

		var dx = w - tableElm.clientWidth;
		var dy = h - tableElm.clientHeight;

		w = w < 1 ? 30 : w;
		h = h < 1 ? 30 : h;

		if (set_w)
			tableElm.style.width = w + "px";

		tableElm.style.height = h + "px";

		iw = iframe.clientWidth + dx;
		ih = iframe.clientHeight + dy;

		iw = iw < 1 ? 30 : iw;
		ih = ih < 1 ? 30 : ih;

		if (tinyMCE.isGecko) {
			iw -= 2;
			ih -= 2;
		}

		if (set_w)
			iframe.style.width = iw + "px";

		iframe.style.height = ih + "px";

		// Is it to small, make it bigger again
		if (set_w) {
			var tableBodyElm = tableElm.firstChild;
			var minIframeWidth = tableBodyElm.scrollWidth;
			if (inst.iframeElement.clientWidth < minIframeWidth) {
				dx = minIframeWidth - inst.iframeElement.clientWidth;

				inst.iframeElement.style.width = (iw + dx) + "px";
			}
		}

		// Remove pesky table controls
		inst.useCSS = false;
	},

	/**
	 * Handles resizing events.
	 */
	_resizeEventHandler : function(e) {
		var resizer = TinyMCE_AdvancedTheme._resizer;

		// Do nothing
		if (!resizer.resizing)
			return;

		e = typeof(e) == "undefined" ? window.event : e;

		var dx = e.screenX - resizer.downX;
		var dy = e.screenY - resizer.downY;
		var resizeBox = resizer.resizeBox;
		var editorId = resizer.editorId;

		switch (e.type) {
			case "mousemove":
				var w, h;

				w = resizer.width + dx;
				h = resizer.height + dy;

				w = w < 1 ? 1 : w;
				h = h < 1 ? 1 : h;

				if (resizer.horizontal)
					resizeBox.style.width = w + "px";

				resizeBox.style.height = h + "px";
				break;

			case "mouseup":
				TinyMCE_AdvancedTheme._setResizing(e, editorId, false);
				TinyMCE_AdvancedTheme._resizeTo(tinyMCE.getInstanceById(editorId), resizer.width + dx, resizer.height + dy, resizer.horizontal);

				// Expire in a month
				if (tinyMCE.getParam("theme_advanced_resizing_use_cookie", true)) {
					var expires = new Date();
					expires.setTime(expires.getTime() + 3600000 * 24 * 30);

					// Set the cookies
					TinyMCE_AdvancedTheme._setCookie("TinyMCE_" + editorId + "_width", "" + (resizer.horizontal ? resizer.width + dx : ""), expires);
					TinyMCE_AdvancedTheme._setCookie("TinyMCE_" + editorId + "_height", "" + (resizer.height + dy), expires);
				}
				break;
		}
	},

	/**
	 * Starts/stops the editor resizing.
	 */
	_setResizing : function(e, editor_id, state) {
		e = typeof(e) == "undefined" ? window.event : e;

		var resizer = TinyMCE_AdvancedTheme._resizer;
		var editorContainer = document.getElementById(editor_id + '_parent');
		var editorArea = document.getElementById(editor_id + '_parent').firstChild;
		var resizeBox = document.getElementById(editor_id + '_resize_box');
		var inst = tinyMCE.getInstanceById(editor_id);

		if (state) {
			// Place box over editor area
			var width = editorArea.clientWidth;
			var height = editorArea.clientHeight;

			resizeBox.style.width = width + "px";
			resizeBox.style.height = height + "px";

			resizer.iframeWidth = inst.iframeElement.clientWidth;
			resizer.iframeHeight = inst.iframeElement.clientHeight;

			// Hide editor and show resize box
			editorArea.style.display = "none";
			resizeBox.style.display = "block";

			// Add event handlers, only once
			if (!resizer.eventHandlers) {
				if (tinyMCE.isMSIE)
					tinyMCE.addEvent(document, "mousemove", TinyMCE_AdvancedTheme._resizeEventHandler);
				else
					tinyMCE.addEvent(window, "mousemove", TinyMCE_AdvancedTheme._resizeEventHandler);

				tinyMCE.addEvent(document, "mouseup", TinyMCE_AdvancedTheme._resizeEventHandler);

				resizer.eventHandlers = true;
			}

			resizer.resizing = true;
			resizer.downX = e.screenX;
			resizer.downY = e.screenY;
			resizer.width = parseInt(resizeBox.style.width);
			resizer.height = parseInt(resizeBox.style.height);
			resizer.editorId = editor_id;
			resizer.resizeBox = resizeBox;
			resizer.horizontal = tinyMCE.getParam("theme_advanced_resize_horizontal", true);
		} else {
			resizer.resizing = false;
			resizeBox.style.display = "none";
			editorArea.style.display = tinyMCE.isMSIE && !tinyMCE.isOpera ? "block" : "table";
			tinyMCE.execCommand('mceResetDesignMode');
		}
	},

	_getColorHTML : function(id, n, cm) {
		var i, h, cl;

		h = '<span class="mceMenuLine"></span>';
		cl = tinyMCE.getParam(n, TinyMCE_AdvancedTheme._defColors).split(',');

		h += '<table class="mceColors"><tr>';
		for (i=0; i<cl.length; i++) {
			c = 'tinyMCE.execInstanceCommand(\'' + id + '\', \'' + cm + '\', false, \'#' + cl[i] + '\');';
			h += '<td><a href="javascript:' + c + '" style="background-color: #' + cl[i] + '" onclick="' + c + ';return false;"></a></td>';

			if ((i+1) % 8 == 0)
				h += '</tr><tr>';
		}

		h += '</tr></table>';
		/*
		h += '<a href="" class="mceMoreColors">More colors</a>';
		*/

		return h;
	},

	_insertImage : function(src, alt, border, hspace, vspace, width, height, align, title, onmouseover, onmouseout) {
		tinyMCE.execCommand('mceBeginUndoLevel');

		if (src == "")
			return;

		if (!tinyMCE.imgElement && tinyMCE.isSafari) {
			var html = "";

			html += '<img src="' + src + '" alt="' + alt + '"';
			html += ' border="' + border + '" hspace="' + hspace + '"';
			html += ' vspace="' + vspace + '" width="' + width + '"';
			html += ' height="' + height + '" align="' + align + '" title="' + title + '" onmouseover="' + onmouseover + '" onmouseout="' + onmouseout + '" />';

			tinyMCE.execCommand("mceInsertContent", false, html);
		} else {
			if (!tinyMCE.imgElement && tinyMCE.selectedInstance) {
				if (tinyMCE.isSafari)
					tinyMCE.execCommand("mceInsertContent", false, '<img src="' + tinyMCE.uniqueURL + '" />');
				else
					tinyMCE.selectedInstance.contentDocument.execCommand("insertimage", false, tinyMCE.uniqueURL);

				tinyMCE.imgElement = tinyMCE.getElementByAttributeValue(tinyMCE.selectedInstance.contentDocument.body, "img", "src", tinyMCE.uniqueURL);
			}
		}

		if (tinyMCE.imgElement) {
			var needsRepaint = false;
			var msrc = src;

			src = eval(tinyMCE.settings['urlconverter_callback'] + "(src, tinyMCE.imgElement);");

			if (tinyMCE.getParam('convert_urls'))
				msrc = src;

			if (onmouseover && onmouseover != "")
				onmouseover = "this.src='" + eval(tinyMCE.settings['urlconverter_callback'] + "(onmouseover, tinyMCE.imgElement);") + "';";

			if (onmouseout && onmouseout != "")
				onmouseout = "this.src='" + eval(tinyMCE.settings['urlconverter_callback'] + "(onmouseout, tinyMCE.imgElement);") + "';";

			// Use alt as title if it's undefined
			if (typeof(title) == "undefined")
				title = alt;

			if (width != tinyMCE.imgElement.getAttribute("width") || height != tinyMCE.imgElement.getAttribute("height") || align != tinyMCE.imgElement.getAttribute("align"))
				needsRepaint = true;

			tinyMCE.setAttrib(tinyMCE.imgElement, 'src', src);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'mce_src', msrc);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'alt', alt);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'title', title);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'align', align);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'border', border, true);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'hspace', hspace, true);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'vspace', vspace, true);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'width', width, true);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'height', height, true);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'onmouseover', onmouseover);
			tinyMCE.setAttrib(tinyMCE.imgElement, 'onmouseout', onmouseout);

			// Fix for bug #989846 - Image resize bug
			if (width && width != "")
				tinyMCE.imgElement.style.pixelWidth = width;

			if (height && height != "")
				tinyMCE.imgElement.style.pixelHeight = height;

			if (needsRepaint)
				tinyMCE.selectedInstance.repaint();
		}

		tinyMCE.execCommand('mceEndUndoLevel');
	},

	_insertLink : function(href, target, title, onclick, style_class) {
		tinyMCE.execCommand('mceBeginUndoLevel');

		if (tinyMCE.selectedInstance && tinyMCE.selectedElement && tinyMCE.selectedElement.nodeName.toLowerCase() == "img") {
			var doc = tinyMCE.selectedInstance.getDoc();
			var linkElement = tinyMCE.getParentElement(tinyMCE.selectedElement, "a");
			var newLink = false;

			if (!linkElement) {
				linkElement = doc.createElement("a");
				newLink = true;
			}

			var mhref = href;
			var thref = eval(tinyMCE.settings['urlconverter_callback'] + "(href, linkElement);");
			mhref = tinyMCE.getParam('convert_urls') ? href : mhref;

			tinyMCE.setAttrib(linkElement, 'href', thref);
			tinyMCE.setAttrib(linkElement, 'mce_href', mhref);
			tinyMCE.setAttrib(linkElement, 'target', target);
			tinyMCE.setAttrib(linkElement, 'title', title);
			tinyMCE.setAttrib(linkElement, 'onclick', onclick);
			tinyMCE.setAttrib(linkElement, 'class', style_class);

			if (newLink) {
				linkElement.appendChild(tinyMCE.selectedElement.cloneNode(true));
				tinyMCE.selectedElement.parentNode.replaceChild(linkElement, tinyMCE.selectedElement);
			}

			return;
		}

		if (!tinyMCE.linkElement && tinyMCE.selectedInstance) {
			if (tinyMCE.isSafari) {
				tinyMCE.execCommand("mceInsertContent", false, '<a href="' + tinyMCE.uniqueURL + '">' + tinyMCE.selectedInstance.selection.getSelectedHTML() + '</a>');
			} else
				tinyMCE.selectedInstance.contentDocument.execCommand("createlink", false, tinyMCE.uniqueURL);

			tinyMCE.linkElement = tinyMCE.getElementByAttributeValue(tinyMCE.selectedInstance.contentDocument.body, "a", "href", tinyMCE.uniqueURL);

			var elementArray = tinyMCE.getElementsByAttributeValue(tinyMCE.selectedInstance.contentDocument.body, "a", "href", tinyMCE.uniqueURL);

			for (var i=0; i<elementArray.length; i++) {
				var mhref = href;
				var thref = eval(tinyMCE.settings['urlconverter_callback'] + "(href, elementArray[i]);");
				mhref = tinyMCE.getParam('convert_urls') ? href : mhref;

				tinyMCE.setAttrib(elementArray[i], 'href', thref);
				tinyMCE.setAttrib(elementArray[i], 'mce_href', mhref);
				tinyMCE.setAttrib(elementArray[i], 'target', target);
				tinyMCE.setAttrib(elementArray[i], 'title', title);
				tinyMCE.setAttrib(elementArray[i], 'onclick', onclick);
				tinyMCE.setAttrib(elementArray[i], 'class', style_class);
			}

			tinyMCE.linkElement = elementArray[0];
		}

		if (tinyMCE.linkElement) {
			var mhref = href;
			href = eval(tinyMCE.settings['urlconverter_callback'] + "(href, tinyMCE.linkElement);");
			mhref = tinyMCE.getParam('convert_urls') ? href : mhref;

			tinyMCE.setAttrib(tinyMCE.linkElement, 'href', href);
			tinyMCE.setAttrib(tinyMCE.linkElement, 'mce_href', mhref);
			tinyMCE.setAttrib(tinyMCE.linkElement, 'target', target);
			tinyMCE.setAttrib(tinyMCE.linkElement, 'title', title);
			tinyMCE.setAttrib(tinyMCE.linkElement, 'onclick', onclick);
			tinyMCE.setAttrib(tinyMCE.linkElement, 'class', style_class);
		}

		tinyMCE.execCommand('mceEndUndoLevel');
	}
};

tinyMCE.addTheme("advanced", TinyMCE_AdvancedTheme);

// Add default buttons maps for advanced theme and all internal plugins
tinyMCE.addButtonMap(TinyMCE_AdvancedTheme._buttonMap);
=======
 * $Id: editor_template_src.js 1045 2009-03-04 20:03:18Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, extend = tinymce.extend, each = tinymce.each, Cookie = tinymce.util.Cookie, lastExtID, explode = tinymce.explode;

	// Tell it to load theme specific language pack(s)
	tinymce.ThemeManager.requireLangPack('advanced');

	tinymce.create('tinymce.themes.AdvancedTheme', {
		sizes : [8, 10, 12, 14, 18, 24, 36],

		// Control name lookup, format: title, command
		controls : {
			bold : ['bold_desc', 'Bold'],
			italic : ['italic_desc', 'Italic'],
			underline : ['underline_desc', 'Underline'],
			strikethrough : ['striketrough_desc', 'Strikethrough'],
			justifyleft : ['justifyleft_desc', 'JustifyLeft'],
			justifycenter : ['justifycenter_desc', 'JustifyCenter'],
			justifyright : ['justifyright_desc', 'JustifyRight'],
			justifyfull : ['justifyfull_desc', 'JustifyFull'],
			bullist : ['bullist_desc', 'InsertUnorderedList'],
			numlist : ['numlist_desc', 'InsertOrderedList'],
			outdent : ['outdent_desc', 'Outdent'],
			indent : ['indent_desc', 'Indent'],
			cut : ['cut_desc', 'Cut'],
			copy : ['copy_desc', 'Copy'],
			paste : ['paste_desc', 'Paste'],
			undo : ['undo_desc', 'Undo'],
			redo : ['redo_desc', 'Redo'],
			link : ['link_desc', 'mceLink'],
			unlink : ['unlink_desc', 'unlink'],
			image : ['image_desc', 'mceImage'],
			cleanup : ['cleanup_desc', 'mceCleanup'],
			help : ['help_desc', 'mceHelp'],
			code : ['code_desc', 'mceCodeEditor'],
			hr : ['hr_desc', 'InsertHorizontalRule'],
			removeformat : ['removeformat_desc', 'RemoveFormat'],
			sub : ['sub_desc', 'subscript'],
			sup : ['sup_desc', 'superscript'],
			forecolor : ['forecolor_desc', 'ForeColor'],
			forecolorpicker : ['forecolor_desc', 'mceForeColor'],
			backcolor : ['backcolor_desc', 'HiliteColor'],
			backcolorpicker : ['backcolor_desc', 'mceBackColor'],
			charmap : ['charmap_desc', 'mceCharMap'],
			visualaid : ['visualaid_desc', 'mceToggleVisualAid'],
			anchor : ['anchor_desc', 'mceInsertAnchor'],
			newdocument : ['newdocument_desc', 'mceNewDocument'],
			blockquote : ['blockquote_desc', 'mceBlockQuote']
		},

		stateControls : ['bold', 'italic', 'underline', 'strikethrough', 'bullist', 'numlist', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'sub', 'sup', 'blockquote'],

		init : function(ed, url) {
			var t = this, s, v, o;
	
			t.editor = ed;
			t.url = url;
			t.onResolveName = new tinymce.util.Dispatcher(this);

			// Default settings
			t.settings = s = extend({
				theme_advanced_path : true,
				theme_advanced_toolbar_location : 'bottom',
				theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect",
				theme_advanced_buttons2 : "bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code",
				theme_advanced_buttons3 : "hr,removeformat,visualaid,|,sub,sup,|,charmap",
				theme_advanced_blockformats : "p,address,pre,h1,h2,h3,h4,h5,h6",
				theme_advanced_toolbar_align : "center",
				theme_advanced_fonts : "Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
				theme_advanced_more_colors : 1,
				theme_advanced_row_height : 23,
				theme_advanced_resize_horizontal : 1,
				theme_advanced_resizing_use_cookie : 1,
				theme_advanced_font_sizes : "1,2,3,4,5,6,7",
				readonly : ed.settings.readonly
			}, ed.settings);

			// Setup default font_size_style_values
			if (!s.font_size_style_values)
				s.font_size_style_values = "8pt,10pt,12pt,14pt,18pt,24pt,36pt";

			if (tinymce.is(s.theme_advanced_font_sizes, 'string')) {
				s.font_size_style_values = tinymce.explode(s.font_size_style_values);
				s.font_size_classes = tinymce.explode(s.font_size_classes || '');

				// Parse string value
				o = {};
				ed.settings.theme_advanced_font_sizes = s.theme_advanced_font_sizes;
				each(ed.getParam('theme_advanced_font_sizes', '', 'hash'), function(v, k) {
					var cl;

					if (k == v && v >= 1 && v <= 7) {
						k = v + ' (' + t.sizes[v - 1] + 'pt)';

						if (ed.settings.convert_fonts_to_spans) {
							cl = s.font_size_classes[v - 1];
							v = s.font_size_style_values[v - 1] || (t.sizes[v - 1] + 'pt');
						}
					}

					if (/^\s*\./.test(v))
						cl = v.replace(/\./g, '');

					o[k] = cl ? {'class' : cl} : {fontSize : v};
				});

				s.theme_advanced_font_sizes = o;
			}

			if ((v = s.theme_advanced_path_location) && v != 'none')
				s.theme_advanced_statusbar_location = s.theme_advanced_path_location;

			if (s.theme_advanced_statusbar_location == 'none')
				s.theme_advanced_statusbar_location = 0;

			// Init editor
			ed.onInit.add(function() {
				ed.onNodeChange.add(t._nodeChanged, t);

				if (ed.settings.content_css !== false)
					ed.dom.loadCSS(ed.baseURI.toAbsolute("themes/advanced/skins/" + ed.settings.skin + "/content.css"));
			});

			ed.onSetProgressState.add(function(ed, b, ti) {
				var co, id = ed.id, tb;

				if (b) {
					t.progressTimer = setTimeout(function() {
						co = ed.getContainer();
						co = co.insertBefore(DOM.create('DIV', {style : 'position:relative'}), co.firstChild);
						tb = DOM.get(ed.id + '_tbl');

						DOM.add(co, 'div', {id : id + '_blocker', 'class' : 'mceBlocker', style : {width : tb.clientWidth + 2, height : tb.clientHeight + 2}});
						DOM.add(co, 'div', {id : id + '_progress', 'class' : 'mceProgress', style : {left : tb.clientWidth / 2, top : tb.clientHeight / 2}});
					}, ti || 0);
				} else {
					DOM.remove(id + '_blocker');
					DOM.remove(id + '_progress');
					clearTimeout(t.progressTimer);
				}
			});

			DOM.loadCSS(s.editor_css ? ed.documentBaseURI.toAbsolute(s.editor_css) : url + "/skins/" + ed.settings.skin + "/ui.css");

			if (s.skin_variant)
				DOM.loadCSS(url + "/skins/" + ed.settings.skin + "/ui_" + s.skin_variant + ".css");
		},

		createControl : function(n, cf) {
			var cd, c;

			if (c = cf.createControl(n))
				return c;

			switch (n) {
				case "styleselect":
					return this._createStyleSelect();

				case "formatselect":
					return this._createBlockFormats();

				case "fontselect":
					return this._createFontSelect();

				case "fontsizeselect":
					return this._createFontSizeSelect();

				case "forecolor":
					return this._createForeColorMenu();

				case "backcolor":
					return this._createBackColorMenu();
			}

			if ((cd = this.controls[n]))
				return cf.createButton(n, {title : "advanced." + cd[0], cmd : cd[1], ui : cd[2], value : cd[3]});
		},

		execCommand : function(cmd, ui, val) {
			var f = this['_' + cmd];

			if (f) {
				f.call(this, ui, val);
				return true;
			}

			return false;
		},

		_importClasses : function(e) {
			var ed = this.editor, c = ed.controlManager.get('styleselect');

			if (c.getLength() == 0) {
				each(ed.dom.getClasses(), function(o) {
					c.add(o['class'], o['class']);
				});
			}
		},

		_createStyleSelect : function(n) {
			var t = this, ed = t.editor, cf = ed.controlManager, c = cf.createListBox('styleselect', {
				title : 'advanced.style_select',
				onselect : function(v) {
					if (c.selectedValue === v) {
						ed.execCommand('mceSetStyleInfo', 0, {command : 'removeformat'});
						c.select();
						return false;
					} else
						ed.execCommand('mceSetCSSClass', 0, v);
				}
			});

			if (c) {
				each(ed.getParam('theme_advanced_styles', '', 'hash'), function(v, k) {
					if (v)
						c.add(t.editor.translate(k), v);
				});

				c.onPostRender.add(function(ed, n) {
					if (!c.NativeListBox) {
						Event.add(n.id + '_text', 'focus', t._importClasses, t);
						Event.add(n.id + '_text', 'mousedown', t._importClasses, t);
						Event.add(n.id + '_open', 'focus', t._importClasses, t);
						Event.add(n.id + '_open', 'mousedown', t._importClasses, t);
					} else
						Event.add(n.id, 'focus', t._importClasses, t);
				});
			}

			return c;
		},

		_createFontSelect : function() {
			var c, t = this, ed = t.editor;

			c = ed.controlManager.createListBox('fontselect', {title : 'advanced.fontdefault', cmd : 'FontName'});
			if (c) {
				each(ed.getParam('theme_advanced_fonts', t.settings.theme_advanced_fonts, 'hash'), function(v, k) {
					c.add(ed.translate(k), v, {style : v.indexOf('dings') == -1 ? 'font-family:' + v : ''});
				});
			}

			return c;
		},

		_createFontSizeSelect : function() {
			var t = this, ed = t.editor, c, i = 0, cl = [];

			c = ed.controlManager.createListBox('fontsizeselect', {title : 'advanced.font_size', onselect : function(v) {
				if (v.fontSize)
					ed.execCommand('FontSize', false, v.fontSize);
				else {
					each(t.settings.theme_advanced_font_sizes, function(v, k) {
						if (v['class'])
							cl.push(v['class']);
					});

					ed.editorCommands._applyInlineStyle('span', {'class' : v['class']}, {check_classes : cl});
				}
			}});

			if (c) {
				each(t.settings.theme_advanced_font_sizes, function(v, k) {
					var fz = v.fontSize;

					if (fz >= 1 && fz <= 7)
						fz = t.sizes[parseInt(fz) - 1] + 'pt';

					c.add(k, v, {'style' : 'font-size:' + fz, 'class' : 'mceFontSize' + (i++) + (' ' + (v['class'] || ''))});
				});
			}

			return c;
		},

		_createBlockFormats : function() {
			var c, fmts = {
				p : 'advanced.paragraph',
				address : 'advanced.address',
				pre : 'advanced.pre',
				h1 : 'advanced.h1',
				h2 : 'advanced.h2',
				h3 : 'advanced.h3',
				h4 : 'advanced.h4',
				h5 : 'advanced.h5',
				h6 : 'advanced.h6',
				div : 'advanced.div',
				blockquote : 'advanced.blockquote',
				code : 'advanced.code',
				dt : 'advanced.dt',
				dd : 'advanced.dd',
				samp : 'advanced.samp'
			}, t = this;

			c = t.editor.controlManager.createListBox('formatselect', {title : 'advanced.block', cmd : 'FormatBlock'});
			if (c) {
				each(t.editor.getParam('theme_advanced_blockformats', t.settings.theme_advanced_blockformats, 'hash'), function(v, k) {
					c.add(t.editor.translate(k != v ? k : fmts[v]), v, {'class' : 'mce_formatPreview mce_' + v});
				});
			}

			return c;
		},

		_createForeColorMenu : function() {
			var c, t = this, s = t.settings, o = {}, v;

			if (s.theme_advanced_more_colors) {
				o.more_colors_func = function() {
					t._mceColorPicker(0, {
						color : c.value,
						func : function(co) {
							c.setColor(co);
						}
					});
				};
			}

			if (v = s.theme_advanced_text_colors)
				o.colors = v;

			if (s.theme_advanced_default_foreground_color)
				o.default_color = s.theme_advanced_default_foreground_color;

			o.title = 'advanced.forecolor_desc';
			o.cmd = 'ForeColor';
			o.scope = this;

			c = t.editor.controlManager.createColorSplitButton('forecolor', o);

			return c;
		},

		_createBackColorMenu : function() {
			var c, t = this, s = t.settings, o = {}, v;

			if (s.theme_advanced_more_colors) {
				o.more_colors_func = function() {
					t._mceColorPicker(0, {
						color : c.value,
						func : function(co) {
							c.setColor(co);
						}
					});
				};
			}

			if (v = s.theme_advanced_background_colors)
				o.colors = v;

			if (s.theme_advanced_default_background_color)
				o.default_color = s.theme_advanced_default_background_color;

			o.title = 'advanced.backcolor_desc';
			o.cmd = 'HiliteColor';
			o.scope = this;

			c = t.editor.controlManager.createColorSplitButton('backcolor', o);

			return c;
		},

		renderUI : function(o) {
			var n, ic, tb, t = this, ed = t.editor, s = t.settings, sc, p, nl;

			n = p = DOM.create('span', {id : ed.id + '_parent', 'class' : 'mceEditor ' + ed.settings.skin + 'Skin' + (s.skin_variant ? ' ' + ed.settings.skin + 'Skin' + t._ufirst(s.skin_variant) : '')});

			if (!DOM.boxModel)
				n = DOM.add(n, 'div', {'class' : 'mceOldBoxModel'});

			n = sc = DOM.add(n, 'table', {id : ed.id + '_tbl', 'class' : 'mceLayout', cellSpacing : 0, cellPadding : 0});
			n = tb = DOM.add(n, 'tbody');

			switch ((s.theme_advanced_layout_manager || '').toLowerCase()) {
				case "rowlayout":
					ic = t._rowLayout(s, tb, o);
					break;

				case "customlayout":
					ic = ed.execCallback("theme_advanced_custom_layout", s, tb, o, p);
					break;

				default:
					ic = t._simpleLayout(s, tb, o, p);
			}

			n = o.targetNode;

			// Add classes to first and last TRs
			nl = DOM.stdMode ? sc.getElementsByTagName('tr') : sc.rows; // Quick fix for IE 8
			DOM.addClass(nl[0], 'mceFirst');
			DOM.addClass(nl[nl.length - 1], 'mceLast');

			// Add classes to first and last TDs
			each(DOM.select('tr', tb), function(n) {
				DOM.addClass(n.firstChild, 'mceFirst');
				DOM.addClass(n.childNodes[n.childNodes.length - 1], 'mceLast');
			});

			if (DOM.get(s.theme_advanced_toolbar_container))
				DOM.get(s.theme_advanced_toolbar_container).appendChild(p);
			else
				DOM.insertAfter(p, n);

			Event.add(ed.id + '_path_row', 'click', function(e) {
				e = e.target;

				if (e.nodeName == 'A') {
					t._sel(e.className.replace(/^.*mcePath_([0-9]+).*$/, '$1'));

					return Event.cancel(e);
				}
			});
/*
			if (DOM.get(ed.id + '_path_row')) {
				Event.add(ed.id + '_tbl', 'mouseover', function(e) {
					var re;
	
					e = e.target;

					if (e.nodeName == 'SPAN' && DOM.hasClass(e.parentNode, 'mceButton')) {
						re = DOM.get(ed.id + '_path_row');
						t.lastPath = re.innerHTML;
						DOM.setHTML(re, e.parentNode.title);
					}
				});

				Event.add(ed.id + '_tbl', 'mouseout', function(e) {
					if (t.lastPath) {
						DOM.setHTML(ed.id + '_path_row', t.lastPath);
						t.lastPath = 0;
					}
				});
			}
*/

			if (!ed.getParam('accessibility_focus'))
				Event.add(DOM.add(p, 'a', {href : '#'}, '<!-- IE -->'), 'focus', function() {tinyMCE.get(ed.id).focus();});

			if (s.theme_advanced_toolbar_location == 'external')
				o.deltaHeight = 0;

			t.deltaHeight = o.deltaHeight;
			o.targetNode = null;

			return {
				iframeContainer : ic,
				editorContainer : ed.id + '_parent',
				sizeContainer : sc,
				deltaHeight : o.deltaHeight
			};
		},

		getInfo : function() {
			return {
				longname : 'Advanced theme',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			}
		},

		resizeBy : function(dw, dh) {
			var e = DOM.get(this.editor.id + '_tbl');

			this.resizeTo(e.clientWidth + dw, e.clientHeight + dh);
		},

		resizeTo : function(w, h) {
			var ed = this.editor, s = ed.settings, e = DOM.get(ed.id + '_tbl'), ifr = DOM.get(ed.id + '_ifr'), dh;

			// Boundery fix box
			w = Math.max(s.theme_advanced_resizing_min_width || 100, w);
			h = Math.max(s.theme_advanced_resizing_min_height || 100, h);
			w = Math.min(s.theme_advanced_resizing_max_width || 0xFFFF, w);
			h = Math.min(s.theme_advanced_resizing_max_height || 0xFFFF, h);

			// Calc difference between iframe and container
			dh = e.clientHeight - ifr.clientHeight;

			// Resize iframe and container
			DOM.setStyle(ifr, 'height', h - dh);
			DOM.setStyles(e, {width : w, height : h});
		},

		destroy : function() {
			var id = this.editor.id;

			Event.clear(id + '_resize');
			Event.clear(id + '_path_row');
			Event.clear(id + '_external_close');
		},

		// Internal functions

		_simpleLayout : function(s, tb, o, p) {
			var t = this, ed = t.editor, lo = s.theme_advanced_toolbar_location, sl = s.theme_advanced_statusbar_location, n, ic, etb, c;

			if (s.readonly) {
				n = DOM.add(tb, 'tr');
				n = ic = DOM.add(n, 'td', {'class' : 'mceIframeContainer'});
				return ic;
			}

			// Create toolbar container at top
			if (lo == 'top')
				t._addToolbars(tb, o);

			// Create external toolbar
			if (lo == 'external') {
				n = c = DOM.create('div', {style : 'position:relative'});
				n = DOM.add(n, 'div', {id : ed.id + '_external', 'class' : 'mceExternalToolbar'});
				DOM.add(n, 'a', {id : ed.id + '_external_close', href : 'javascript:;', 'class' : 'mceExternalClose'});
				n = DOM.add(n, 'table', {id : ed.id + '_tblext', cellSpacing : 0, cellPadding : 0});
				etb = DOM.add(n, 'tbody');

				if (p.firstChild.className == 'mceOldBoxModel')
					p.firstChild.appendChild(c);
				else
					p.insertBefore(c, p.firstChild);

				t._addToolbars(etb, o);

				ed.onMouseUp.add(function() {
					var e = DOM.get(ed.id + '_external');
					DOM.show(e);

					DOM.hide(lastExtID);

					var f = Event.add(ed.id + '_external_close', 'click', function() {
						DOM.hide(ed.id + '_external');
						Event.remove(ed.id + '_external_close', 'click', f);
					});

					DOM.show(e);
					DOM.setStyle(e, 'top', 0 - DOM.getRect(ed.id + '_tblext').h - 1);

					// Fixes IE rendering bug
					DOM.hide(e);
					DOM.show(e);
					e.style.filter = '';

					lastExtID = ed.id + '_external';

					e = null;
				});
			}

			if (sl == 'top')
				t._addStatusBar(tb, o);

			// Create iframe container
			if (!s.theme_advanced_toolbar_container) {
				n = DOM.add(tb, 'tr');
				n = ic = DOM.add(n, 'td', {'class' : 'mceIframeContainer'});
			}

			// Create toolbar container at bottom
			if (lo == 'bottom')
				t._addToolbars(tb, o);

			if (sl == 'bottom')
				t._addStatusBar(tb, o);

			return ic;
		},

		_rowLayout : function(s, tb, o) {
			var t = this, ed = t.editor, dc, da, cf = ed.controlManager, n, ic, to, a;

			dc = s.theme_advanced_containers_default_class || '';
			da = s.theme_advanced_containers_default_align || 'center';

			each(explode(s.theme_advanced_containers || ''), function(c, i) {
				var v = s['theme_advanced_container_' + c] || '';

				switch (v.toLowerCase()) {
					case 'mceeditor':
						n = DOM.add(tb, 'tr');
						n = ic = DOM.add(n, 'td', {'class' : 'mceIframeContainer'});
						break;

					case 'mceelementpath':
						t._addStatusBar(tb, o);
						break;

					default:
						a = (s['theme_advanced_container_' + c + '_align'] || da).toLowerCase();
						a = 'mce' + t._ufirst(a);

						n = DOM.add(DOM.add(tb, 'tr'), 'td', {
							'class' : 'mceToolbar ' + (s['theme_advanced_container_' + c + '_class'] || dc) + ' ' + a || da
						});

						to = cf.createToolbar("toolbar" + i);
						t._addControls(v, to);
						DOM.setHTML(n, to.renderHTML());
						o.deltaHeight -= s.theme_advanced_row_height;
				}
			});

			return ic;
		},

		_addControls : function(v, tb) {
			var t = this, s = t.settings, di, cf = t.editor.controlManager;

			if (s.theme_advanced_disable && !t._disabled) {
				di = {};

				each(explode(s.theme_advanced_disable), function(v) {
					di[v] = 1;
				});

				t._disabled = di;
			} else
				di = t._disabled;

			each(explode(v), function(n) {
				var c;

				if (di && di[n])
					return;

				// Compatiblity with 2.x
				if (n == 'tablecontrols') {
					each(["table","|","row_props","cell_props","|","row_before","row_after","delete_row","|","col_before","col_after","delete_col","|","split_cells","merge_cells"], function(n) {
						n = t.createControl(n, cf);

						if (n)
							tb.add(n);
					});

					return;
				}

				c = t.createControl(n, cf);

				if (c)
					tb.add(c);
			});
		},

		_addToolbars : function(c, o) {
			var t = this, i, tb, ed = t.editor, s = t.settings, v, cf = ed.controlManager, di, n, h = [], a;

			a = s.theme_advanced_toolbar_align.toLowerCase();
			a = 'mce' + t._ufirst(a);

			n = DOM.add(DOM.add(c, 'tr'), 'td', {'class' : 'mceToolbar ' + a});

			if (!ed.getParam('accessibility_focus'))
				h.push(DOM.createHTML('a', {href : '#', onfocus : 'tinyMCE.get(\'' + ed.id + '\').focus();'}, '<!-- IE -->'));

			h.push(DOM.createHTML('a', {href : '#', accesskey : 'q', title : ed.getLang("advanced.toolbar_focus")}, '<!-- IE -->'));

			// Create toolbar and add the controls
			for (i=1; (v = s['theme_advanced_buttons' + i]); i++) {
				tb = cf.createToolbar("toolbar" + i, {'class' : 'mceToolbarRow' + i});

				if (s['theme_advanced_buttons' + i + '_add'])
					v += ',' + s['theme_advanced_buttons' + i + '_add'];

				if (s['theme_advanced_buttons' + i + '_add_before'])
					v = s['theme_advanced_buttons' + i + '_add_before'] + ',' + v;

				t._addControls(v, tb);

				//n.appendChild(n = tb.render());
				h.push(tb.renderHTML());

				o.deltaHeight -= s.theme_advanced_row_height;
			}

			h.push(DOM.createHTML('a', {href : '#', accesskey : 'z', title : ed.getLang("advanced.toolbar_focus"), onfocus : 'tinyMCE.getInstanceById(\'' + ed.id + '\').focus();'}, '<!-- IE -->'));
			DOM.setHTML(n, h.join(''));
		},

		_addStatusBar : function(tb, o) {
			var n, t = this, ed = t.editor, s = t.settings, r, mf, me, td;

			n = DOM.add(tb, 'tr');
			n = td = DOM.add(n, 'td', {'class' : 'mceStatusbar'});
			n = DOM.add(n, 'div', {id : ed.id + '_path_row'}, s.theme_advanced_path ? ed.translate('advanced.path') + ': ' : '&#160;');
			DOM.add(n, 'a', {href : '#', accesskey : 'x'});

			if (s.theme_advanced_resizing) {
				DOM.add(td, 'a', {id : ed.id + '_resize', href : 'javascript:;', onclick : "return false;", 'class' : 'mceResize'});

				if (s.theme_advanced_resizing_use_cookie) {
					ed.onPostRender.add(function() {
						var o = Cookie.getHash("TinyMCE_" + ed.id + "_size"), c = DOM.get(ed.id + '_tbl');

						if (!o)
							return;

						if (s.theme_advanced_resize_horizontal)
							c.style.width = Math.max(10, o.cw) + 'px';

						c.style.height = Math.max(10, o.ch) + 'px';
						DOM.get(ed.id + '_ifr').style.height = Math.max(10, parseInt(o.ch) + t.deltaHeight) + 'px';
					});
				}

				ed.onPostRender.add(function() {
					Event.add(ed.id + '_resize', 'mousedown', function(e) {
						var c, p, w, h, n, pa;

						// Measure container
						c = DOM.get(ed.id + '_tbl');
						w = c.clientWidth;
						h = c.clientHeight;

						miw = s.theme_advanced_resizing_min_width || 100;
						mih = s.theme_advanced_resizing_min_height || 100;
						maw = s.theme_advanced_resizing_max_width || 0xFFFF;
						mah = s.theme_advanced_resizing_max_height || 0xFFFF;

						// Setup placeholder
						p = DOM.add(DOM.get(ed.id + '_parent'), 'div', {'class' : 'mcePlaceHolder'});
						DOM.setStyles(p, {width : w, height : h});

						// Replace with placeholder
						DOM.hide(c);
						DOM.show(p);

						// Create internal resize obj
						r = {
							x : e.screenX,
							y : e.screenY,
							w : w,
							h : h,
							dx : null,
							dy : null
						};

						// Start listening
						mf = Event.add(DOM.doc, 'mousemove', function(e) {
							var w, h;

							// Calc delta values
							r.dx = e.screenX - r.x;
							r.dy = e.screenY - r.y;

							// Boundery fix box
							w = Math.max(miw, r.w + r.dx);
							h = Math.max(mih, r.h + r.dy);
							w = Math.min(maw, w);
							h = Math.min(mah, h);

							// Resize placeholder
							if (s.theme_advanced_resize_horizontal)
								p.style.width = w + 'px';

							p.style.height = h + 'px';

							return Event.cancel(e);
						});

						me = Event.add(DOM.doc, 'mouseup', function(e) {
							var ifr;

							// Stop listening
							Event.remove(DOM.doc, 'mousemove', mf);
							Event.remove(DOM.doc, 'mouseup', me);

							c.style.display = '';
							DOM.remove(p);

							if (r.dx === null)
								return;

							ifr = DOM.get(ed.id + '_ifr');

							if (s.theme_advanced_resize_horizontal)
								c.style.width = Math.max(10, r.w + r.dx) + 'px';

							c.style.height = Math.max(10, r.h + r.dy) + 'px';
							ifr.style.height = Math.max(10, ifr.clientHeight + r.dy) + 'px';

							if (s.theme_advanced_resizing_use_cookie) {
								Cookie.setHash("TinyMCE_" + ed.id + "_size", {
									cw : r.w + r.dx,
									ch : r.h + r.dy
								});
							}
						});

						return Event.cancel(e);
					});
				});
			}

			o.deltaHeight -= 21;
			n = tb = null;
		},

		_nodeChanged : function(ed, cm, n, co) {
			var t = this, p, de = 0, v, c, s = t.settings, cl, fz, fn;

			if (s.readonly)
				return;

			tinymce.each(t.stateControls, function(c) {
				cm.setActive(c, ed.queryCommandState(t.controls[c][1]));
			});

			cm.setActive('visualaid', ed.hasVisual);
			cm.setDisabled('undo', !ed.undoManager.hasUndo() && !ed.typing);
			cm.setDisabled('redo', !ed.undoManager.hasRedo());
			cm.setDisabled('outdent', !ed.queryCommandState('Outdent'));

			p = DOM.getParent(n, 'A');
			if (c = cm.get('link')) {
				if (!p || !p.name) {
					c.setDisabled(!p && co);
					c.setActive(!!p);
				}
			}

			if (c = cm.get('unlink')) {
				c.setDisabled(!p && co);
				c.setActive(!!p && !p.name);
			}

			if (c = cm.get('anchor')) {
				c.setActive(!!p && p.name);

				if (tinymce.isWebKit) {
					p = DOM.getParent(n, 'IMG');
					c.setActive(!!p && DOM.getAttrib(p, 'mce_name') == 'a');
				}
			}

			p = DOM.getParent(n, 'IMG');
			if (c = cm.get('image'))
				c.setActive(!!p && n.className.indexOf('mceItem') == -1);

			if (c = cm.get('styleselect')) {
				if (n.className) {
					t._importClasses();
					c.select(n.className);
				} else
					c.select();
			}

			if (c = cm.get('formatselect')) {
				p = DOM.getParent(n, DOM.isBlock);

				if (p)
					c.select(p.nodeName.toLowerCase());
			}

			if (ed.settings.convert_fonts_to_spans) {
				ed.dom.getParent(n, function(n) {
					if (n.nodeName === 'SPAN') {
						if (!cl && n.className)
							cl = n.className;

						if (!fz && n.style.fontSize)
							fz = n.style.fontSize;

						if (!fn && n.style.fontFamily)
							fn = n.style.fontFamily.replace(/[\"\']+/g, '').replace(/^([^,]+).*/, '$1').toLowerCase();
					}

					return false;
				});

				if (c = cm.get('fontselect')) {
					c.select(function(v) {
						return v.replace(/^([^,]+).*/, '$1').toLowerCase() == fn;
					});
				}

				if (c = cm.get('fontsizeselect')) {
					c.select(function(v) {
						if (v.fontSize && v.fontSize === fz)
							return true;

						if (v['class'] && v['class'] === cl)
							return true;
					});
				}
			} else {
				if (c = cm.get('fontselect'))
					c.select(ed.queryCommandValue('FontName'));

				if (c = cm.get('fontsizeselect')) {
					v = ed.queryCommandValue('FontSize');
					c.select(function(iv) {
						return iv.fontSize == v;
					});
				}
			}

			if (s.theme_advanced_path && s.theme_advanced_statusbar_location) {
				p = DOM.get(ed.id + '_path') || DOM.add(ed.id + '_path_row', 'span', {id : ed.id + '_path'});
				DOM.setHTML(p, '');

				ed.dom.getParent(n, function(n) {
					var na = n.nodeName.toLowerCase(), u, pi, ti = '';

					// Ignore non element and hidden elements
					if (n.nodeType != 1 || n.nodeName === 'BR' || (DOM.hasClass(n, 'mceItemHidden') || DOM.hasClass(n, 'mceItemRemoved')))
						return;

					// Fake name
					if (v = DOM.getAttrib(n, 'mce_name'))
						na = v;

					// Handle prefix
					if (tinymce.isIE && n.scopeName !== 'HTML')
						na = n.scopeName + ':' + na;

					// Remove internal prefix
					na = na.replace(/mce\:/g, '');

					// Handle node name
					switch (na) {
						case 'b':
							na = 'strong';
							break;

						case 'i':
							na = 'em';
							break;

						case 'img':
							if (v = DOM.getAttrib(n, 'src'))
								ti += 'src: ' + v + ' ';

							break;

						case 'a':
							if (v = DOM.getAttrib(n, 'name')) {
								ti += 'name: ' + v + ' ';
								na += '#' + v;
							}

							if (v = DOM.getAttrib(n, 'href'))
								ti += 'href: ' + v + ' ';

							break;

						case 'font':
							if (s.convert_fonts_to_spans)
								na = 'span';

							if (v = DOM.getAttrib(n, 'face'))
								ti += 'font: ' + v + ' ';

							if (v = DOM.getAttrib(n, 'size'))
								ti += 'size: ' + v + ' ';

							if (v = DOM.getAttrib(n, 'color'))
								ti += 'color: ' + v + ' ';

							break;

						case 'span':
							if (v = DOM.getAttrib(n, 'style'))
								ti += 'style: ' + v + ' ';

							break;
					}

					if (v = DOM.getAttrib(n, 'id'))
						ti += 'id: ' + v + ' ';

					if (v = n.className) {
						v = v.replace(/(webkit-[\w\-]+|Apple-[\w\-]+|mceItem\w+|mceVisualAid)/g, '');

						if (v && v.indexOf('mceItem') == -1) {
							ti += 'class: ' + v + ' ';

							if (DOM.isBlock(n) || na == 'img' || na == 'span')
								na += '.' + v;
						}
					}

					na = na.replace(/(html:)/g, '');
					na = {name : na, node : n, title : ti};
					t.onResolveName.dispatch(t, na);
					ti = na.title;
					na = na.name;

					//u = "javascript:tinymce.EditorManager.get('" + ed.id + "').theme._sel('" + (de++) + "');";
					pi = DOM.create('a', {'href' : "javascript:;", onmousedown : "return false;", title : ti, 'class' : 'mcePath_' + (de++)}, na);

					if (p.hasChildNodes()) {
						p.insertBefore(DOM.doc.createTextNode(' \u00bb '), p.firstChild);
						p.insertBefore(pi, p.firstChild);
					} else
						p.appendChild(pi);
				}, ed.getBody());
			}
		},

		// Commands gets called by execCommand

		_sel : function(v) {
			this.editor.execCommand('mceSelectNodeDepth', false, v);
		},

		_mceInsertAnchor : function(ui, v) {
			var ed = this.editor;

			ed.windowManager.open({
				url : tinymce.baseURL + '/themes/advanced/anchor.htm',
				width : 320 + parseInt(ed.getLang('advanced.anchor_delta_width', 0)),
				height : 90 + parseInt(ed.getLang('advanced.anchor_delta_height', 0)),
				inline : true
			}, {
				theme_url : this.url
			});
		},

		_mceCharMap : function() {
			var ed = this.editor;

			ed.windowManager.open({
				url : tinymce.baseURL + '/themes/advanced/charmap.htm',
				width : 550 + parseInt(ed.getLang('advanced.charmap_delta_width', 0)),
				height : 250 + parseInt(ed.getLang('advanced.charmap_delta_height', 0)),
				inline : true
			}, {
				theme_url : this.url
			});
		},

		_mceHelp : function() {
			var ed = this.editor;

			ed.windowManager.open({
				url : tinymce.baseURL + '/themes/advanced/about.htm',
				width : 480,
				height : 380,
				inline : true
			}, {
				theme_url : this.url
			});
		},

		_mceColorPicker : function(u, v) {
			var ed = this.editor;

			v = v || {};

			ed.windowManager.open({
				url : tinymce.baseURL + '/themes/advanced/color_picker.htm',
				width : 375 + parseInt(ed.getLang('advanced.colorpicker_delta_width', 0)),
				height : 250 + parseInt(ed.getLang('advanced.colorpicker_delta_height', 0)),
				close_previous : false,
				inline : true
			}, {
				input_color : v.color,
				func : v.func,
				theme_url : this.url
			});
		},

		_mceCodeEditor : function(ui, val) {
			var ed = this.editor;

			ed.windowManager.open({
				url : tinymce.baseURL + '/themes/advanced/source_editor.htm',
				width : parseInt(ed.getParam("theme_advanced_source_editor_width", 720)),
				height : parseInt(ed.getParam("theme_advanced_source_editor_height", 580)),
				inline : true,
				resizable : true,
				maximizable : true
			}, {
				theme_url : this.url
			});
		},

		_mceImage : function(ui, val) {
			var ed = this.editor;

			// Internal image object like a flash placeholder
			if (ed.dom.getAttrib(ed.selection.getNode(), 'class').indexOf('mceItem') != -1)
				return;

			ed.windowManager.open({
				url : tinymce.baseURL + '/themes/advanced/image.htm',
				width : 355 + parseInt(ed.getLang('advanced.image_delta_width', 0)),
				height : 275 + parseInt(ed.getLang('advanced.image_delta_height', 0)),
				inline : true
			}, {
				theme_url : this.url
			});
		},

		_mceLink : function(ui, val) {
			var ed = this.editor;

			ed.windowManager.open({
				url : tinymce.baseURL + '/themes/advanced/link.htm',
				width : 310 + parseInt(ed.getLang('advanced.link_delta_width', 0)),
				height : 200 + parseInt(ed.getLang('advanced.link_delta_height', 0)),
				inline : true
			}, {
				theme_url : this.url
			});
		},

		_mceNewDocument : function() {
			var ed = this.editor;

			ed.windowManager.confirm('advanced.newdocument', function(s) {
				if (s)
					ed.execCommand('mceSetContent', false, '');
			});
		},

		_mceForeColor : function() {
			var t = this;

			this._mceColorPicker(0, {
				color: t.fgColor,
				func : function(co) {
					t.fgColor = co;
					t.editor.execCommand('ForeColor', false, co);
				}
			});
		},

		_mceBackColor : function() {
			var t = this;

			this._mceColorPicker(0, {
				color: t.bgColor,
				func : function(co) {
					t.bgColor = co;
					t.editor.execCommand('HiliteColor', false, co);
				}
			});
		},

		_ufirst : function(s) {
			return s.substring(0, 1).toUpperCase() + s.substring(1);
		}
	});

	tinymce.ThemeManager.add('advanced', tinymce.themes.AdvancedTheme);
}(tinymce));
>>>>>>> deploy
