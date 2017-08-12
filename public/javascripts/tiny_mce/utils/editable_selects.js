/**
<<<<<<< HEAD
 * $Id: editable_selects.js 18 2006-06-29 14:11:23Z spocke $
=======
 * $Id: editable_selects.js 867 2008-06-09 20:33:40Z spocke $
>>>>>>> deploy
 *
 * Makes select boxes editable.
 *
 * @author Moxiecode
<<<<<<< HEAD
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
=======
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
>>>>>>> deploy
 */

var TinyMCE_EditableSelects = {
	editSelectElm : null,

	init : function() {
		var nl = document.getElementsByTagName("select"), i, d = document, o;

		for (i=0; i<nl.length; i++) {
			if (nl[i].className.indexOf('mceEditableSelect') != -1) {
				o = new Option('(value)', '__mce_add_custom__');

				o.className = 'mceAddSelectValue';

				nl[i].options[nl[i].options.length] = o;
<<<<<<< HEAD
				nl[i].setAttribute('onchange', 'TinyMCE_EditableSelects.onChangeEditableSelect(this);');
=======
				nl[i].onchange = TinyMCE_EditableSelects.onChangeEditableSelect;
>>>>>>> deploy
			}
		}
	},

<<<<<<< HEAD
	onChangeEditableSelect : function(se) {
		var d = document, ne;
=======
	onChangeEditableSelect : function(e) {
		var d = document, ne, se = window.event ? window.event.srcElement : e.target;
>>>>>>> deploy

		if (se.options[se.selectedIndex].value == '__mce_add_custom__') {
			ne = d.createElement("input");
			ne.id = se.id + "_custom";
			ne.name = se.name + "_custom";
			ne.type = "text";

<<<<<<< HEAD
			ne.style.width = se.clientWidth;
=======
			ne.style.width = se.offsetWidth + 'px';
>>>>>>> deploy
			se.parentNode.insertBefore(ne, se);
			se.style.display = 'none';
			ne.focus();
			ne.onblur = TinyMCE_EditableSelects.onBlurEditableSelectInput;
<<<<<<< HEAD
=======
			ne.onkeydown = TinyMCE_EditableSelects.onKeyDown;
>>>>>>> deploy
			TinyMCE_EditableSelects.editSelectElm = se;
		}
	},

	onBlurEditableSelectInput : function() {
		var se = TinyMCE_EditableSelects.editSelectElm;

		if (se) {
			if (se.previousSibling.value != '') {
				addSelectValue(document.forms[0], se.id, se.previousSibling.value, se.previousSibling.value);
				selectByValue(document.forms[0], se.id, se.previousSibling.value);
			} else
				selectByValue(document.forms[0], se.id, '');

			se.style.display = 'inline';
			se.parentNode.removeChild(se.previousSibling);
			TinyMCE_EditableSelects.editSelectElm = null;
		}
<<<<<<< HEAD
=======
	},

	onKeyDown : function(e) {
		e = e || window.event;

		if (e.keyCode == 13)
			TinyMCE_EditableSelects.onBlurEditableSelectInput();
>>>>>>> deploy
	}
};
