<<<<<<< HEAD
// Some global instances, this will be filled later
var tinyMCE = null, tinyMCELang = null;

function TinyMCE_Popup() {
};

TinyMCE_Popup.prototype = {
	findWin : function(w) {
		var c;

		// Check parents
		c = w;
		while (c && (c = c.parent) != null) {
			if (typeof(c.tinyMCE) != "undefined")
				return c;
		}

		// Check openers
		c = w;
		while (c && (c = c.opener) != null) {
			if (typeof(c.tinyMCE) != "undefined")
				return c;
		}

		// Try top
		if (typeof(top.tinyMCE) != "undefined")
			return top;

		return null;
	},

	init : function() {
		var win = window.opener ? window.opener : window.dialogArguments, c;
		var inst;

		if (!win)
			win = this.findWin(window);

		if (!win) {
			alert("tinyMCE object reference not found from popup.");
			return;
		}

		window.opener = win;
		this.windowOpener = win;
		this.onLoadEval = "";

		// Setup parent references
		tinyMCE = win.tinyMCE;
		tinyMCELang = win.tinyMCELang;

		inst = tinyMCE.selectedInstance;
		this.isWindow = tinyMCE.getWindowArg('mce_inside_iframe', false) == false;
		this.storeSelection = (tinyMCE.isRealIE) && !this.isWindow && tinyMCE.getWindowArg('mce_store_selection', true);

		if (this.isWindow)
			window.focus();

		// Store selection
		if (this.storeSelection)
			inst.selectionBookmark = inst.selection.getBookmark(true);

		// Setup dir
		if (tinyMCELang['lang_dir'])
			document.dir = tinyMCELang['lang_dir'];

		// Setup title
		var re = new RegExp('{|\\\$|}', 'g');
		var title = document.title.replace(re, "");
		if (typeof tinyMCELang[title] != "undefined") {
			var divElm = document.createElement("div");
			divElm.innerHTML = tinyMCELang[title];
			document.title = divElm.innerHTML;

			if (tinyMCE.setWindowTitle != null)
				tinyMCE.setWindowTitle(window, divElm.innerHTML);
		}

		// Output Popup CSS class
		document.write('<link href="' + tinyMCE.getParam("popups_css") + '" rel="stylesheet" type="text/css">');

		if (tinyMCE.getParam("popups_css_add")) {
			c = tinyMCE.getParam("popups_css_add");

			// Is relative
			if (c.indexOf('://') == -1 && c.charAt(0) != '/')
				c = tinyMCE.documentBasePath + "/" + c;

			document.write('<link href="' + c + '" rel="stylesheet" type="text/css">');
		}

		tinyMCE.addEvent(window, "load", this.onLoad);
	},

	onLoad : function() {
		var dir, i, elms, body = document.body;

		if (tinyMCE.getWindowArg('mce_replacevariables', true))
			body.innerHTML = tinyMCE.applyTemplate(body.innerHTML, tinyMCE.windowArgs);

		dir = tinyMCE.selectedInstance.settings['directionality'];
		if (dir == "rtl" && document.forms && document.forms.length > 0) {
			elms = document.forms[0].elements;
			for (i=0; i<elms.length; i++) {
				if ((elms[i].type == "text" || elms[i].type == "textarea") && elms[i].getAttribute("dir") != "ltr")
					elms[i].dir = dir;
			}
		}

		if (body.style.display == 'none')
			body.style.display = 'block';

		// Execute real onload (Opera fix)
		if (tinyMCEPopup.onLoadEval != "")
			eval(tinyMCEPopup.onLoadEval);
	},

	executeOnLoad : function(str) {
		if (tinyMCE.isOpera)
			this.onLoadEval = str;
		else
			eval(str);
	},

	resizeToInnerSize : function() {
		// Netscape 7.1 workaround
		if (this.isWindow && tinyMCE.isNS71) {
			window.resizeBy(0, 10);
			return;
		}

		if (this.isWindow) {
			var doc = document;
			var body = doc.body;
			var oldMargin, wrapper, iframe, nodes, dx, dy;

			if (body.style.display == 'none')
				body.style.display = 'block';

			// Remove margin
			oldMargin = body.style.margin;
			body.style.margin = '0';

			// Create wrapper
			wrapper = doc.createElement("div");
			wrapper.id = 'mcBodyWrapper';
			wrapper.style.display = 'none';
			wrapper.style.margin = '0';

			// Wrap body elements
			nodes = doc.body.childNodes;
			for (var i=nodes.length-1; i>=0; i--) {
				if (wrapper.hasChildNodes())
					wrapper.insertBefore(nodes[i].cloneNode(true), wrapper.firstChild);
				else
					wrapper.appendChild(nodes[i].cloneNode(true));

				nodes[i].parentNode.removeChild(nodes[i]);
			}

			// Add wrapper
			doc.body.appendChild(wrapper);

			// Create iframe
			iframe = document.createElement("iframe");
			iframe.id = "mcWinIframe";
			iframe.src = document.location.href.toLowerCase().indexOf('https') == -1 ? "about:blank" : tinyMCE.settings['default_document'];
			iframe.width = "100%";
			iframe.height = "100%";
			iframe.style.margin = '0';

			// Add iframe
			doc.body.appendChild(iframe);

			// Measure iframe
			iframe = document.getElementById('mcWinIframe');
			dx = tinyMCE.getWindowArg('mce_width') - iframe.clientWidth;
			dy = tinyMCE.getWindowArg('mce_height') - iframe.clientHeight;

			// Resize window
			// tinyMCE.debug(tinyMCE.getWindowArg('mce_width') + "," + tinyMCE.getWindowArg('mce_height') + " - " + dx + "," + dy);
			window.resizeBy(dx, dy);

			// Hide iframe and show wrapper
			body.style.margin = oldMargin;
			iframe.style.display = 'none';
			wrapper.style.display = 'block';
		}
	},

	resizeToContent : function() {
		var isMSIE = (navigator.appName == "Microsoft Internet Explorer");
		var isOpera = (navigator.userAgent.indexOf("Opera") != -1);

		if (isOpera)
			return;

		if (isMSIE) {
			try { window.resizeTo(10, 10); } catch (e) {}

			var elm = document.body;
			var width = elm.offsetWidth;
			var height = elm.offsetHeight;
			var dx = (elm.scrollWidth - width) + 4;
			var dy = elm.scrollHeight - height;

			try { window.resizeBy(dx, dy); } catch (e) {}
		} else {
			window.scrollBy(1000, 1000);
			if (window.scrollX > 0 || window.scrollY > 0) {
				window.resizeBy(window.innerWidth * 2, window.innerHeight * 2);
				window.sizeToContent();
				window.scrollTo(0, 0);
				var x = parseInt(screen.width / 2.0) - (window.outerWidth / 2.0);
				var y = parseInt(screen.height / 2.0) - (window.outerHeight / 2.0);
				window.moveTo(x, y);
			}
		}
	},

	getWindowArg : function(name, default_value) {
		return tinyMCE.getWindowArg(name, default_value);
	},

	restoreSelection : function() {
		if (this.storeSelection) {
			var inst = tinyMCE.selectedInstance;

			inst.getWin().focus();

			if (inst.selectionBookmark)
				inst.selection.moveToBookmark(inst.selectionBookmark);
		}
	},

	execCommand : function(command, user_interface, value) {
		var inst = tinyMCE.selectedInstance;

		this.restoreSelection();
		inst.execCommand(command, user_interface, value);

		// Store selection
		if (this.storeSelection)
			inst.selectionBookmark = inst.selection.getBookmark(true);
	},

	close : function() {
		tinyMCE.closeWindow(window);
	},

	pickColor : function(e, element_id) {
		tinyMCE.selectedInstance.execCommand('mceColorPicker', true, {
			element_id : element_id,
			document : document,
			window : window,
			store_selection : false
		});
	},

	openBrowser : function(element_id, type, option) {
		var cb = tinyMCE.getParam(option, tinyMCE.getParam("file_browser_callback"));
		var url = document.getElementById(element_id).value;

		tinyMCE.setWindowArg("window", window);
		tinyMCE.setWindowArg("document", document);

		// Call to external callback
		if (eval('typeof(tinyMCEPopup.windowOpener.' + cb + ')') == "undefined")
			alert("Callback function: " + cb + " could not be found.");
		else
			eval("tinyMCEPopup.windowOpener." + cb + "(element_id, url, type, window);");
	},

	importClass : function(c) {
		window[c] = function() {};

		for (var n in window.opener[c].prototype)
			window[c].prototype[n] = window.opener[c].prototype[n];

		window[c].constructor = window.opener[c].constructor;
	}

	};

// Setup global instance
var tinyMCEPopup = new TinyMCE_Popup();

tinyMCEPopup.init();
=======

// Uncomment and change this document.domain value if you are loading the script cross subdomains
// document.domain = 'moxiecode.com';

var tinymce=null,tinyMCEPopup,tinyMCE;tinyMCEPopup={init:function(){var b=this,a,c;a=b.getWin();tinymce=a.tinymce;tinyMCE=a.tinyMCE;b.editor=tinymce.EditorManager.activeEditor;b.params=b.editor.windowManager.params;b.features=b.editor.windowManager.features;b.dom=b.editor.windowManager.createInstance("tinymce.dom.DOMUtils",document);if(b.features.popup_css!==false){b.dom.loadCSS(b.features.popup_css||b.editor.settings.popup_css)}b.listeners=[];b.onInit={add:function(e,d){b.listeners.push({func:e,scope:d})}};b.isWindow=!b.getWindowArg("mce_inline");b.id=b.getWindowArg("mce_window_id");b.editor.windowManager.onOpen.dispatch(b.editor.windowManager,window)},getWin:function(){return window.dialogArguments||opener||parent||top},getWindowArg:function(c,b){var a=this.params[c];return tinymce.is(a)?a:b},getParam:function(b,a){return this.editor.getParam(b,a)},getLang:function(b,a){return this.editor.getLang(b,a)},execCommand:function(d,c,e,b){b=b||{};b.skip_focus=1;this.restoreSelection();return this.editor.execCommand(d,c,e,b)},resizeToInnerSize:function(){var e=this,g,a=document.body,c=e.dom.getViewPort(window),d,f;d=e.getWindowArg("mce_width")-c.w;f=e.getWindowArg("mce_height")-c.h;if(e.isWindow){window.resizeBy(d,f)}else{e.editor.windowManager.resizeBy(d,f,e.id)}},executeOnLoad:function(s){this.onInit.add(function(){eval(s)})},storeSelection:function(){this.editor.windowManager.bookmark=tinyMCEPopup.editor.selection.getBookmark("simple")},restoreSelection:function(){var a=tinyMCEPopup;if(!a.isWindow&&tinymce.isIE){a.editor.selection.moveToBookmark(a.editor.windowManager.bookmark)}},requireLangPack:function(){var b=this,a=b.getWindowArg("plugin_url")||b.getWindowArg("theme_url");if(a&&b.editor.settings.language&&b.features.translate_i18n!==false){a+="/langs/"+b.editor.settings.language+"_dlg.js";if(!tinymce.ScriptLoader.isDone(a)){document.write('<script type="text/javascript" src="'+tinymce._addVer(a)+'"><\/script>');tinymce.ScriptLoader.markDone(a)}}},pickColor:function(b,a){this.execCommand("mceColorPicker",true,{color:document.getElementById(a).value,func:function(e){document.getElementById(a).value=e;try{document.getElementById(a).onchange()}catch(d){}}})},openBrowser:function(a,c,b){tinyMCEPopup.restoreSelection();this.editor.execCallback("file_browser_callback",a,document.getElementById(a).value,c,window)},confirm:function(b,a,c){this.editor.windowManager.confirm(b,a,c,window)},alert:function(b,a,c){this.editor.windowManager.alert(b,a,c,window)},close:function(){var a=this;function b(){a.editor.windowManager.close(window);tinymce=tinyMCE=a.editor=a.params=a.dom=a.dom.doc=null}if(tinymce.isOpera){a.getWin().setTimeout(b,0)}else{b()}},_restoreSelection:function(){var a=window.event.srcElement;if(a.nodeName=="INPUT"&&(a.type=="submit"||a.type=="button")){tinyMCEPopup.restoreSelection()}},_onDOMLoaded:function(){var b=tinyMCEPopup,d=document.title,e,c,a;if(b.domLoaded){return}b.domLoaded=1;if(b.features.translate_i18n!==false){c=document.body.innerHTML;if(tinymce.isIE){c=c.replace(/ (value|title|alt)=([^"][^\s>]+)/gi,' $1="$2"')}document.dir=b.editor.getParam("directionality","");if((a=b.editor.translate(c))&&a!=c){document.body.innerHTML=a}if((a=b.editor.translate(d))&&a!=d){document.title=d=a}}document.body.style.display="";if(tinymce.isIE){document.attachEvent("onmouseup",tinyMCEPopup._restoreSelection);b.dom.add(b.dom.select("head")[0],"base",{target:"_self"})}b.restoreSelection();b.resizeToInnerSize();if(!b.isWindow){b.editor.windowManager.setTitle(window,d)}else{window.focus()}if(!tinymce.isIE&&!b.isWindow){tinymce.dom.Event._add(document,"focus",function(){b.editor.windowManager.focus(b.id)})}tinymce.each(b.dom.select("select"),function(f){f.onkeydown=tinyMCEPopup._accessHandler});tinymce.each(b.listeners,function(f){f.func.call(f.scope,b.editor)});if(b.getWindowArg("mce_auto_focus",true)){window.focus();tinymce.each(document.forms,function(g){tinymce.each(g.elements,function(f){if(b.dom.hasClass(f,"mceFocus")&&!f.disabled){f.focus();return false}})})}document.onkeyup=tinyMCEPopup._closeWinKeyHandler},_accessHandler:function(a){a=a||window.event;if(a.keyCode==13||a.keyCode==32){a=a.target||a.srcElement;if(a.onchange){a.onchange()}return tinymce.dom.Event.cancel(a)}},_closeWinKeyHandler:function(a){a=a||window.event;if(a.keyCode==27){tinyMCEPopup.close()}},_wait:function(){if(document.attachEvent){document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",arguments.callee);tinyMCEPopup._onDOMLoaded()}});if(document.documentElement.doScroll&&window==window.top){(function(){if(tinyMCEPopup.domLoaded){return}try{document.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}tinyMCEPopup._onDOMLoaded()})()}document.attachEvent("onload",tinyMCEPopup._onDOMLoaded)}else{if(document.addEventListener){window.addEventListener("DOMContentLoaded",tinyMCEPopup._onDOMLoaded,false);window.addEventListener("load",tinyMCEPopup._onDOMLoaded,false)}}}};tinyMCEPopup.init();tinyMCEPopup._wait();
>>>>>>> deploy
