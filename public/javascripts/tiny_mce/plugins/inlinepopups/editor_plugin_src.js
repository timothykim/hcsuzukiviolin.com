/**
<<<<<<< HEAD
 * $Id: editor_plugin_src.js 126 2006-10-22 16:19:55Z spocke $
 *
 * Moxiecode DHTML Windows script.
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

// Patch openWindow, closeWindow TinyMCE functions

var TinyMCE_InlinePopupsPlugin = {
	getInfo : function() {
		return {
			longname : 'Inline Popups',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_inlinepopups.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	}
};

tinyMCE.addPlugin("inlinepopups", TinyMCE_InlinePopupsPlugin);

// Patch openWindow, closeWindow TinyMCE functions

TinyMCE_Engine.prototype.orgOpenWindow = TinyMCE_Engine.prototype.openWindow;

TinyMCE_Engine.prototype.openWindow = function(template, args) {
	// Does the caller support inline
	if (args['inline'] != "yes" || tinyMCE.isOpera || tinyMCE.getParam("plugins").indexOf('inlinepopups') == -1) {
		mcWindows.selectedWindow = null;
		args['mce_inside_iframe'] = false;
		this.orgOpenWindow(template, args);
		return;
	}

	var url, resizable, scrollbars;

	args['mce_inside_iframe'] = true;
	tinyMCE.windowArgs = args;

	if (template['file'].charAt(0) != '/' && template['file'].indexOf('://') == -1)
		url = tinyMCE.baseURL + "/themes/" + tinyMCE.getParam("theme") + "/" + template['file'];
	else
		url = template['file'];

	if (!(width = parseInt(template['width'])))
		width = 320;

	if (!(height = parseInt(template['height'])))
		height = 200;

	resizable = (args && args['resizable']) ? args['resizable'] : "no";
	scrollbars = (args && args['scrollbars']) ? args['scrollbars'] : "no";

	height += 18;

	// Replace all args as variables in URL
	for (var name in args) {
		if (typeof(args[name]) == 'function')
			continue;

		url = tinyMCE.replaceVar(url, name, escape(args[name]));
	}

	var elm = document.getElementById(this.selectedInstance.editorId + '_parent');
	var pos = tinyMCE.getAbsPosition(elm);

	// Center div in editor area
	pos.absLeft += Math.round((elm.firstChild.clientWidth / 2) - (width / 2));
	pos.absTop += Math.round((elm.firstChild.clientHeight / 2) - (height / 2));

	mcWindows.open(url, mcWindows.idCounter++, "modal=yes,width=" + width+ ",height=" + height + ",resizable=" + resizable + ",scrollbars=" + scrollbars + ",statusbar=" + resizable + ",left=" + pos.absLeft + ",top=" + pos.absTop);
};

TinyMCE_Engine.prototype.orgCloseWindow = TinyMCE_Engine.prototype.closeWindow;

TinyMCE_Engine.prototype.closeWindow = function(win) {
	if (mcWindows.selectedWindow != null)
		mcWindows.selectedWindow.close();
	else
		this.orgCloseWindow(win);
};

TinyMCE_Engine.prototype.setWindowTitle = function(win_ref, title) {
	for (var n in mcWindows.windows) {
		var win = mcWindows.windows[n];
		if (typeof(win) == 'function')
			continue;

		if (win_ref.name == win.id + "_iframe")
			window.frames[win.id + "_iframe"].document.getElementById(win.id + '_title').innerHTML = title;
	}
};

// * * * * * TinyMCE_Windows classes below

// Windows handler
function TinyMCE_Windows() {
	this.settings = new Array();
	this.windows = new Array();
	this.isMSIE = (navigator.appName == "Microsoft Internet Explorer");
	this.isGecko = navigator.userAgent.indexOf('Gecko') != -1;
	this.isSafari = navigator.userAgent.indexOf('Safari') != -1;
	this.isMac = navigator.userAgent.indexOf('Mac') != -1;
	this.isMSIE5_0 = this.isMSIE && (navigator.userAgent.indexOf('MSIE 5.0') != -1);
	this.action = "none";
	this.selectedWindow = null;
	this.lastSelectedWindow = null;
	this.zindex = 100;
	this.mouseDownScreenX = 0;
	this.mouseDownScreenY = 0;
	this.mouseDownLayerX = 0;
	this.mouseDownLayerY = 0;
	this.mouseDownWidth = 0;
	this.mouseDownHeight = 0;
	this.idCounter = 0;
};

TinyMCE_Windows.prototype.init = function(settings) {
	this.settings = settings;

	if (this.isMSIE)
		this.addEvent(document, "mousemove", mcWindows.eventDispatcher);
	else
		this.addEvent(window, "mousemove", mcWindows.eventDispatcher);

	this.addEvent(document, "mouseup", mcWindows.eventDispatcher);

	this.doc = document;
};

TinyMCE_Windows.prototype.getParam = function(name, default_value) {
	var value = null;

	value = (typeof(this.settings[name]) == "undefined") ? default_value : this.settings[name];

	// Fix bool values
	if (value == "true" || value == "false")
		return (value == "true");

	return value;
};

TinyMCE_Windows.prototype.eventDispatcher = function(e) {
	e = typeof(e) == "undefined" ? window.event : e;

	if (mcWindows.selectedWindow == null)
		return;

	// Switch focus
	if (mcWindows.isGecko && e.type == "mousedown") {
		var elm = e.currentTarget;

		for (var n in mcWindows.windows) {
			var win = mcWindows.windows[n];

			if (win.headElement == elm || win.resizeElement == elm) {
				win.focus();
				break;
			}
		}
	}

	switch (e.type) {
		case "mousemove":
			mcWindows.selectedWindow.onMouseMove(e);
			break;

		case "mouseup":
			mcWindows.selectedWindow.onMouseUp(e);
			break;

		case "mousedown":
			mcWindows.selectedWindow.onMouseDown(e);
			break;

		case "focus":
			mcWindows.selectedWindow.onFocus(e);
			break;
	}
};

TinyMCE_Windows.prototype.addEvent = function(obj, name, handler) {
	if (this.isMSIE)
		obj.attachEvent("on" + name, handler);
	else
		obj.addEventListener(name, handler, true);
};

TinyMCE_Windows.prototype.cancelEvent = function(e) {
	if (this.isMSIE) {
		e.returnValue = false;
		e.cancelBubble = true;
	} else
		e.preventDefault();
};

TinyMCE_Windows.prototype.parseFeatures = function(opts) {
	// Cleanup the options
	opts = opts.toLowerCase();
	opts = opts.replace(/;/g, ",");
	opts = opts.replace(/[^0-9a-z=,]/g, "");

	var optionChunks = opts.split(',');
	var options = new Array();

	options['left'] = "10";
	options['top'] = "10";
	options['width'] = "300";
	options['height'] = "300";
	options['resizable'] = "yes";
	options['minimizable'] = "yes";
	options['maximizable'] = "yes";
	options['close'] = "yes";
	options['movable'] = "yes";
	options['statusbar'] = "yes";
	options['scrollbars'] = "auto";
	options['modal'] = "no";

	if (opts == "")
		return options;

	for (var i=0; i<optionChunks.length; i++) {
		var parts = optionChunks[i].split('=');

		if (parts.length == 2)
			options[parts[0]] = parts[1];
	}

	options['left'] = parseInt(options['left']);
	options['top'] = parseInt(options['top']);
	options['width'] = parseInt(options['width']);
	options['height'] = parseInt(options['height']);

	return options;
};

TinyMCE_Windows.prototype.open = function(url, name, features) {
	this.lastSelectedWindow = this.selectedWindow;

	var win = new TinyMCE_Window();
	var winDiv, html = "", id;
	var imgPath = this.getParam("images_path");

	features = this.parseFeatures(features);

	// Create div
	id = "mcWindow_" + name;
	win.deltaHeight = 18;

	if (features['statusbar'] == "yes") {
		win.deltaHeight += 13;

		if (this.isMSIE)
			win.deltaHeight += 1;
	}

	width = parseInt(features['width']);
	height = parseInt(features['height'])-win.deltaHeight;

	if (this.isMSIE)
		width -= 2;

	// Setup first part of window
	win.id = id;
	win.url = url;
	win.name = name;
	win.features = features;
	this.windows[name] = win;

	iframeWidth = width;
	iframeHeight = height;

	// Create inner content
	html += '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">';
	html += '<html>';
	html += '<head>';
	html += '<title>Wrapper iframe</title>';
	html += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
	html += '<link href="' + this.getParam("css_file") + '" rel="stylesheet" type="text/css" />';
	html += '</head>';
	html += '<body onload="parent.mcWindows.onLoad(\'' + name + '\');">';

	html += '<div id="' + id + '_container" class="mceWindow">';
	html += '<div id="' + id + '_head" class="mceWindowHead" onmousedown="parent.mcWindows.windows[\'' + name + '\'].focus();">';
	html += '  <div id="' + id + '_title" class="mceWindowTitle"';
	html += '  onselectstart="return false;" unselectable="on" style="-moz-user-select: none !important;"></div>';
	html += '    <div class="mceWindowHeadTools">';
	html += '      <a href="javascript:parent.mcWindows.windows[\'' + name + '\'].close();" target="_self" onmousedown="return false;" class="mceWindowClose"><img border="0" src="' + imgPath + '/window_close.gif" /></a>';
//	html += '      <a href="javascript:mcWindows.windows[\'' + name + '\'].maximize();" target="_self" onmousedown="return false;" class="mceWindowMaximize"></a>';
//	html += '      <a href="javascript:mcWindows.windows[\'' + name + '\'].minimize();" target="_self" onmousedown="return false;" class="mceWindowMinimize"></a>';
	html += '    </div>';
	html += '</div><div id="' + id + '_body" class="mceWindowBody" style="width: ' + width + 'px; height: ' + height + 'px;">';
	html += '<iframe id="' + id + '_iframe" name="' + id + '_iframe" frameborder="0" width="' + iframeWidth + '" height="' + iframeHeight + '" src="' + url + '" class="mceWindowBodyIframe" scrolling="' + features['scrollbars'] + '"></iframe></div>';

	if (features['statusbar'] == "yes") {
		html += '<div id="' + id + '_statusbar" class="mceWindowStatusbar" onmousedown="parent.mcWindows.windows[\'' + name + '\'].focus();">';

		if (features['resizable'] == "yes") {
			if (this.isGecko)
				html += '<div id="' + id + '_resize" class="mceWindowResize"><div style="background-image: url(\'' + imgPath + '/window_resize.gif\'); width: 12px; height: 12px;"></div></div>';
			else
				html += '<div id="' + id + '_resize" class="mceWindowResize"><img onmousedown="parent.mcWindows.windows[\'' + name + '\'].focus();" border="0" src="' + imgPath + '/window_resize.gif" /></div>';
		}

		html += '</div>';
	}

	html += '</div>';

	html += '</body>';
	html += '</html>';

	// Create iframe
	this.createFloatingIFrame(id, features['left'], features['top'], features['width'], features['height'], html);
};

// Blocks the document events by placing a image over the whole document
TinyMCE_Windows.prototype.setDocumentLock = function(state) {
	if (state) {
		var elm = document.getElementById('mcWindowEventBlocker');
		if (elm == null) {
			elm = document.createElement("div");

			elm.id = "mcWindowEventBlocker";
			elm.style.position = "absolute";
			elm.style.left = "0";
			elm.style.top = "0";

			document.body.appendChild(elm);
		}

		elm.style.display = "none";

		var imgPath = this.getParam("images_path");
		var width = document.body.clientWidth;
		var height = document.body.clientHeight;

		elm.style.width = width;
		elm.style.height = height;
		elm.innerHTML = '<img src="' + imgPath + '/spacer.gif" width="' + width + '" height="' + height + '" />';

		elm.style.zIndex = mcWindows.zindex-1;
		elm.style.display = "block";
	} else {
		var elm = document.getElementById('mcWindowEventBlocker');

		if (mcWindows.windows.length == 0)
			elm.parentNode.removeChild(elm);
		else
			elm.style.zIndex = mcWindows.zindex-1;
	}
};

// Gets called when wrapper iframe is initialized
TinyMCE_Windows.prototype.onLoad = function(name) {
	var win = mcWindows.windows[name];
	var id = "mcWindow_" + name;
	var wrapperIframe = window.frames[id + "_iframe"].frames[0];
	var wrapperDoc = window.frames[id + "_iframe"].document;
	var doc = window.frames[id + "_iframe"].document;
	var winDiv = document.getElementById("mcWindow_" + name + "_div");
	var realIframe = window.frames[id + "_iframe"].frames[0];

	// Set window data
	win.id = "mcWindow_" + name;
	win.winElement = winDiv;
	win.bodyElement = doc.getElementById(id + '_body');
	win.iframeElement = doc.getElementById(id + '_iframe');
	win.headElement = doc.getElementById(id + '_head');
	win.titleElement = doc.getElementById(id + '_title');
	win.resizeElement = doc.getElementById(id + '_resize');
	win.containerElement = doc.getElementById(id + '_container');
	win.left = win.features['left'];
	win.top = win.features['top'];
	win.frame = window.frames[id + '_iframe'].frames[0];
	win.wrapperFrame = window.frames[id + '_iframe'];
	win.wrapperIFrameElement = document.getElementById(id + "_iframe");

	// Add event handlers
	mcWindows.addEvent(win.headElement, "mousedown", mcWindows.eventDispatcher);

	if (win.resizeElement != null)
		mcWindows.addEvent(win.resizeElement, "mousedown", mcWindows.eventDispatcher);

	if (mcWindows.isMSIE) {
		mcWindows.addEvent(realIframe.document, "mousemove", mcWindows.eventDispatcher);
		mcWindows.addEvent(realIframe.document, "mouseup", mcWindows.eventDispatcher);
	} else {
		mcWindows.addEvent(realIframe, "mousemove", mcWindows.eventDispatcher);
		mcWindows.addEvent(realIframe, "mouseup", mcWindows.eventDispatcher);
		mcWindows.addEvent(realIframe, "focus", mcWindows.eventDispatcher);
	}

	for (var i=0; i<window.frames.length; i++) {
		if (!window.frames[i]._hasMouseHandlers) {
			if (mcWindows.isMSIE) {
				mcWindows.addEvent(window.frames[i].document, "mousemove", mcWindows.eventDispatcher);
				mcWindows.addEvent(window.frames[i].document, "mouseup", mcWindows.eventDispatcher);
			} else {
				mcWindows.addEvent(window.frames[i], "mousemove", mcWindows.eventDispatcher);
				mcWindows.addEvent(window.frames[i], "mouseup", mcWindows.eventDispatcher);
			}

			window.frames[i]._hasMouseHandlers = true;
		}
	}

	if (mcWindows.isMSIE) {
		mcWindows.addEvent(win.frame.document, "mousemove", mcWindows.eventDispatcher);
		mcWindows.addEvent(win.frame.document, "mouseup", mcWindows.eventDispatcher);
	} else {
		mcWindows.addEvent(win.frame, "mousemove", mcWindows.eventDispatcher);
		mcWindows.addEvent(win.frame, "mouseup", mcWindows.eventDispatcher);
		mcWindows.addEvent(win.frame, "focus", mcWindows.eventDispatcher);
	}

	// Dispatch open window event
	var func = this.getParam("on_open_window", "");
	if (func != "")
		eval(func + "(win);");

	win.focus();

	if (win.features['modal'] == "yes")
		mcWindows.setDocumentLock(true);
};

TinyMCE_Windows.prototype.createFloatingIFrame = function(id_prefix, left, top, width, height, html) {
	var iframe = document.createElement("iframe");
	var div = document.createElement("div"), doc;

	width = parseInt(width);
	height = parseInt(height)+1;

	// Create wrapper div
	div.setAttribute("id", id_prefix + "_div");
	div.setAttribute("width", width);
	div.setAttribute("height", (height));
	div.style.position = "absolute";
	div.style.left = left + "px";
	div.style.top = top + "px";
	div.style.width = width + "px";
	div.style.height = (height) + "px";
	div.style.backgroundColor = "white";
	div.style.display = "none";

	if (this.isGecko) {
		iframeWidth = width + 2;
		iframeHeight = height + 2;
	} else {
		iframeWidth = width;
		iframeHeight = height + 1;
	}

	// Create iframe
	iframe.setAttribute("id", id_prefix + "_iframe");
	iframe.setAttribute("name", id_prefix + "_iframe");
	iframe.setAttribute("border", "0");
	iframe.setAttribute("frameBorder", "0");
	iframe.setAttribute("marginWidth", "0");
	iframe.setAttribute("marginHeight", "0");
	iframe.setAttribute("leftMargin", "0");
	iframe.setAttribute("topMargin", "0");
	iframe.setAttribute("width", iframeWidth);
	iframe.setAttribute("height", iframeHeight);
//	iframe.setAttribute("src", "../jscripts/tiny_mce/blank.htm");
	// iframe.setAttribute("allowtransparency", "false");
	iframe.setAttribute("scrolling", "no");
	iframe.style.width = iframeWidth + "px";
	iframe.style.height = iframeHeight + "px";
	iframe.style.backgroundColor = "white";
	div.appendChild(iframe);

	document.body.appendChild(div);

	// Fixed MSIE 5.0 issue
	div.innerHTML = div.innerHTML;

	if (this.isSafari) {
		// Give Safari some time to setup
		window.setTimeout(function() {
			var doc = window.frames[id_prefix + '_iframe'].document;
			doc.open();
			doc.write(html);
			doc.close();
		}, 10);
	} else {
		doc = window.frames[id_prefix + '_iframe'].window.document;
		doc.open();
		doc.write(html);
		doc.close();
	}

	div.style.display = "block";

	return div;
};

// Window instance
function TinyMCE_Window() {
};

TinyMCE_Window.prototype.focus = function() {
	if (this != mcWindows.selectedWindow) {
		this.winElement.style.zIndex = ++mcWindows.zindex;
		mcWindows.lastSelectedWindow = mcWindows.selectedWindow;
		mcWindows.selectedWindow = this;
	}
};

TinyMCE_Window.prototype.minimize = function() {
};

TinyMCE_Window.prototype.maximize = function() {
	
};

TinyMCE_Window.prototype.startResize = function() {
	mcWindows.action = "resize";
};

TinyMCE_Window.prototype.startMove = function(e) {
	mcWindows.action = "move";
};

TinyMCE_Window.prototype.close = function() {
	if (this.frame && this.frame['tinyMCEPopup'])
		this.frame['tinyMCEPopup'].restoreSelection();

	if (mcWindows.lastSelectedWindow != null)
		mcWindows.lastSelectedWindow.focus();

	var mcWindowsNew = new Array();
	for (var n in mcWindows.windows) {
		var win = mcWindows.windows[n];
		if (typeof(win) == 'function')
			continue;

		if (win.name != this.name)
			mcWindowsNew[n] = win;
	}

	mcWindows.windows = mcWindowsNew;

//	alert(mcWindows.doc.getElementById(this.id + "_iframe"));

	var e = mcWindows.doc.getElementById(this.id + "_iframe");
	e.parentNode.removeChild(e);

	var e = mcWindows.doc.getElementById(this.id + "_div");
	e.parentNode.removeChild(e);

	mcWindows.setDocumentLock(false);
};

TinyMCE_Window.prototype.onMouseMove = function(e) {
	var scrollX = 0;//this.doc.body.scrollLeft;
	var scrollY = 0;//this.doc.body.scrollTop;

	// Calculate real X, Y
	var dx = e.screenX - mcWindows.mouseDownScreenX;
	var dy = e.screenY - mcWindows.mouseDownScreenY;

	switch (mcWindows.action) {
		case "resize":
			width = mcWindows.mouseDownWidth + (e.screenX - mcWindows.mouseDownScreenX);
			height = mcWindows.mouseDownHeight + (e.screenY - mcWindows.mouseDownScreenY);

			width = width < 100 ? 100 : width;
			height = height < 100 ? 100 : height;

			this.wrapperIFrameElement.style.width = width+2;
			this.wrapperIFrameElement.style.height = height+2;
			this.wrapperIFrameElement.width = width+2;
			this.wrapperIFrameElement.height = height+2;
			this.winElement.style.width = width;
			this.winElement.style.height = height;

			height = height - this.deltaHeight;

			this.containerElement.style.width = width;

			this.iframeElement.style.width = width;
			this.iframeElement.style.height = height;
			this.bodyElement.style.width = width;
			this.bodyElement.style.height = height;
			this.headElement.style.width = width;
			//this.statusElement.style.width = width;

			mcWindows.cancelEvent(e);
			break;

		case "move":
			this.left = mcWindows.mouseDownLayerX + (e.screenX - mcWindows.mouseDownScreenX);
			this.top = mcWindows.mouseDownLayerY + (e.screenY - mcWindows.mouseDownScreenY);
			this.winElement.style.left = this.left + "px";
			this.winElement.style.top = this.top + "px";

			mcWindows.cancelEvent(e);
			break;
	}
};

function debug(msg) {
	document.getElementById('debug').value += msg + "\n";
}

TinyMCE_Window.prototype.onMouseUp = function(e) {
	mcWindows.action = "none";
};

TinyMCE_Window.prototype.onFocus = function(e) {
	// Gecko only handler
	var winRef = e.currentTarget;

	for (var n in mcWindows.windows) {
		var win = mcWindows.windows[n];
		if (typeof(win) == 'function')
			continue;

		if (winRef.name == win.id + "_iframe") {
			win.focus();
			return;
		}
	}
};

TinyMCE_Window.prototype.onMouseDown = function(e) {
	var elm = mcWindows.isMSIE ? this.wrapperFrame.event.srcElement : e.target;

	var scrollX = 0;//this.doc.body.scrollLeft;
	var scrollY = 0;//this.doc.body.scrollTop;

	mcWindows.mouseDownScreenX = e.screenX;
	mcWindows.mouseDownScreenY = e.screenY;
	mcWindows.mouseDownLayerX = this.left;
	mcWindows.mouseDownLayerY = this.top;
	mcWindows.mouseDownWidth = parseInt(this.winElement.style.width);
	mcWindows.mouseDownHeight = parseInt(this.winElement.style.height);

	if (this.resizeElement != null && elm == this.resizeElement.firstChild)
		this.startResize(e);
	else
		this.startMove(e);

	mcWindows.cancelEvent(e);
};

// Global instance
var mcWindows = new TinyMCE_Windows();

// Initialize windows
mcWindows.init({
	images_path : tinyMCE.baseURL + "/plugins/inlinepopups/images",
	css_file : tinyMCE.baseURL + "/plugins/inlinepopups/css/inlinepopup.css"
});
=======
 * $Id: editor_plugin_src.js 999 2009-02-10 17:42:58Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	var DOM = tinymce.DOM, Element = tinymce.dom.Element, Event = tinymce.dom.Event, each = tinymce.each, is = tinymce.is;

	tinymce.create('tinymce.plugins.InlinePopups', {
		init : function(ed, url) {
			// Replace window manager
			ed.onBeforeRenderUI.add(function() {
				ed.windowManager = new tinymce.InlineWindowManager(ed);
				DOM.loadCSS(url + '/skins/' + (ed.settings.inlinepopups_skin || 'clearlooks2') + "/window.css");
			});
		},

		getInfo : function() {
			return {
				longname : 'InlinePopups',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/inlinepopups',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	tinymce.create('tinymce.InlineWindowManager:tinymce.WindowManager', {
		InlineWindowManager : function(ed) {
			var t = this;

			t.parent(ed);
			t.zIndex = 300000;
			t.count = 0;
			t.windows = {};
		},

		open : function(f, p) {
			var t = this, id, opt = '', ed = t.editor, dw = 0, dh = 0, vp, po, mdf, clf, we, w, u;

			f = f || {};
			p = p || {};

			// Run native windows
			if (!f.inline)
				return t.parent(f, p);

			// Only store selection if the type is a normal window
			if (!f.type)
				t.bookmark = ed.selection.getBookmark('simple');

			id = DOM.uniqueId();
			vp = DOM.getViewPort();
			f.width = parseInt(f.width || 320);
			f.height = parseInt(f.height || 240) + (tinymce.isIE ? 8 : 0);
			f.min_width = parseInt(f.min_width || 150);
			f.min_height = parseInt(f.min_height || 100);
			f.max_width = parseInt(f.max_width || 2000);
			f.max_height = parseInt(f.max_height || 2000);
			f.left = f.left || Math.round(Math.max(vp.x, vp.x + (vp.w / 2.0) - (f.width / 2.0)));
			f.top = f.top || Math.round(Math.max(vp.y, vp.y + (vp.h / 2.0) - (f.height / 2.0)));
			f.movable = f.resizable = true;
			p.mce_width = f.width;
			p.mce_height = f.height;
			p.mce_inline = true;
			p.mce_window_id = id;
			p.mce_auto_focus = f.auto_focus;

			// Transpose
//			po = DOM.getPos(ed.getContainer());
//			f.left -= po.x;
//			f.top -= po.y;

			t.features = f;
			t.params = p;
			t.onOpen.dispatch(t, f, p);

			if (f.type) {
				opt += ' mceModal';

				if (f.type)
					opt += ' mce' + f.type.substring(0, 1).toUpperCase() + f.type.substring(1);

				f.resizable = false;
			}

			if (f.statusbar)
				opt += ' mceStatusbar';

			if (f.resizable)
				opt += ' mceResizable';

			if (f.minimizable)
				opt += ' mceMinimizable';

			if (f.maximizable)
				opt += ' mceMaximizable';

			if (f.movable)
				opt += ' mceMovable';

			// Create DOM objects
			t._addAll(DOM.doc.body, 
				['div', {id : id, 'class' : ed.settings.inlinepopups_skin || 'clearlooks2', style : 'width:100px;height:100px'}, 
					['div', {id : id + '_wrapper', 'class' : 'mceWrapper' + opt},
						['div', {id : id + '_top', 'class' : 'mceTop'}, 
							['div', {'class' : 'mceLeft'}],
							['div', {'class' : 'mceCenter'}],
							['div', {'class' : 'mceRight'}],
							['span', {id : id + '_title'}, f.title || '']
						],

						['div', {id : id + '_middle', 'class' : 'mceMiddle'}, 
							['div', {id : id + '_left', 'class' : 'mceLeft'}],
							['span', {id : id + '_content'}],
							['div', {id : id + '_right', 'class' : 'mceRight'}]
						],

						['div', {id : id + '_bottom', 'class' : 'mceBottom'},
							['div', {'class' : 'mceLeft'}],
							['div', {'class' : 'mceCenter'}],
							['div', {'class' : 'mceRight'}],
							['span', {id : id + '_status'}, 'Content']
						],

						['a', {'class' : 'mceMove', tabindex : '-1', href : 'javascript:;'}],
						['a', {'class' : 'mceMin', tabindex : '-1', href : 'javascript:;', onmousedown : 'return false;'}],
						['a', {'class' : 'mceMax', tabindex : '-1', href : 'javascript:;', onmousedown : 'return false;'}],
						['a', {'class' : 'mceMed', tabindex : '-1', href : 'javascript:;', onmousedown : 'return false;'}],
						['a', {'class' : 'mceClose', tabindex : '-1', href : 'javascript:;', onmousedown : 'return false;'}],
						['a', {id : id + '_resize_n', 'class' : 'mceResize mceResizeN', tabindex : '-1', href : 'javascript:;'}],
						['a', {id : id + '_resize_s', 'class' : 'mceResize mceResizeS', tabindex : '-1', href : 'javascript:;'}],
						['a', {id : id + '_resize_w', 'class' : 'mceResize mceResizeW', tabindex : '-1', href : 'javascript:;'}],
						['a', {id : id + '_resize_e', 'class' : 'mceResize mceResizeE', tabindex : '-1', href : 'javascript:;'}],
						['a', {id : id + '_resize_nw', 'class' : 'mceResize mceResizeNW', tabindex : '-1', href : 'javascript:;'}],
						['a', {id : id + '_resize_ne', 'class' : 'mceResize mceResizeNE', tabindex : '-1', href : 'javascript:;'}],
						['a', {id : id + '_resize_sw', 'class' : 'mceResize mceResizeSW', tabindex : '-1', href : 'javascript:;'}],
						['a', {id : id + '_resize_se', 'class' : 'mceResize mceResizeSE', tabindex : '-1', href : 'javascript:;'}]
					]
				]
			);

			DOM.setStyles(id, {top : -10000, left : -10000});

			// Fix gecko rendering bug, where the editors iframe messed with window contents
			if (tinymce.isGecko)
				DOM.setStyle(id, 'overflow', 'auto');

			// Measure borders
			if (!f.type) {
				dw += DOM.get(id + '_left').clientWidth;
				dw += DOM.get(id + '_right').clientWidth;
				dh += DOM.get(id + '_top').clientHeight;
				dh += DOM.get(id + '_bottom').clientHeight;
			}

			// Resize window
			DOM.setStyles(id, {top : f.top, left : f.left, width : f.width + dw, height : f.height + dh});

			u = f.url || f.file;
			if (u) {
				if (tinymce.relaxedDomain)
					u += (u.indexOf('?') == -1 ? '?' : '&') + 'mce_rdomain=' + tinymce.relaxedDomain;

				u = tinymce._addVer(u);
			}

			if (!f.type) {
				DOM.add(id + '_content', 'iframe', {id : id + '_ifr', src : 'javascript:""', frameBorder : 0, style : 'border:0;width:10px;height:10px'});
				DOM.setStyles(id + '_ifr', {width : f.width, height : f.height});
				DOM.setAttrib(id + '_ifr', 'src', u);
			} else {
				DOM.add(id + '_wrapper', 'a', {id : id + '_ok', 'class' : 'mceButton mceOk', href : 'javascript:;', onmousedown : 'return false;'}, 'Ok');

				if (f.type == 'confirm')
					DOM.add(id + '_wrapper', 'a', {'class' : 'mceButton mceCancel', href : 'javascript:;', onmousedown : 'return false;'}, 'Cancel');

				DOM.add(id + '_middle', 'div', {'class' : 'mceIcon'});
				DOM.setHTML(id + '_content', f.content.replace('\n', '<br />'));
			}

			// Register events
			mdf = Event.add(id, 'mousedown', function(e) {
				var n = e.target, w, vp;

				w = t.windows[id];
				t.focus(id);

				if (n.nodeName == 'A' || n.nodeName == 'a') {
					if (n.className == 'mceMax') {
						w.oldPos = w.element.getXY();
						w.oldSize = w.element.getSize();

						vp = DOM.getViewPort();

						// Reduce viewport size to avoid scrollbars
						vp.w -= 2;
						vp.h -= 2;

						w.element.moveTo(vp.x, vp.y);
						w.element.resizeTo(vp.w, vp.h);
						DOM.setStyles(id + '_ifr', {width : vp.w - w.deltaWidth, height : vp.h - w.deltaHeight});
						DOM.addClass(id + '_wrapper', 'mceMaximized');
					} else if (n.className == 'mceMed') {
						// Reset to old size
						w.element.moveTo(w.oldPos.x, w.oldPos.y);
						w.element.resizeTo(w.oldSize.w, w.oldSize.h);
						w.iframeElement.resizeTo(w.oldSize.w - w.deltaWidth, w.oldSize.h - w.deltaHeight);

						DOM.removeClass(id + '_wrapper', 'mceMaximized');
					} else if (n.className == 'mceMove')
						return t._startDrag(id, e, n.className);
					else if (DOM.hasClass(n, 'mceResize'))
						return t._startDrag(id, e, n.className.substring(13));
				}
			});

			clf = Event.add(id, 'click', function(e) {
				var n = e.target;

				t.focus(id);

				if (n.nodeName == 'A' || n.nodeName == 'a') {
					switch (n.className) {
						case 'mceClose':
							t.close(null, id);
							return Event.cancel(e);

						case 'mceButton mceOk':
						case 'mceButton mceCancel':
							f.button_func(n.className == 'mceButton mceOk');
							return Event.cancel(e);
					}
				}
			});

			// Add window
			w = t.windows[id] = {
				id : id,
				mousedown_func : mdf,
				click_func : clf,
				element : new Element(id, {blocker : 1, container : ed.getContainer()}),
				iframeElement : new Element(id + '_ifr'),
				features : f,
				deltaWidth : dw,
				deltaHeight : dh
			};

			w.iframeElement.on('focus', function() {
				t.focus(id);
			});

			// Setup blocker
			if (t.count == 0 && t.editor.getParam('dialog_type', 'modal') == 'modal') {
				DOM.add(DOM.doc.body, 'div', {
					id : 'mceModalBlocker',
					'class' : (t.editor.settings.inlinepopups_skin || 'clearlooks2') + '_modalBlocker',
					style : {zIndex : t.zIndex - 1}
				});

				DOM.show('mceModalBlocker'); // Reduces flicker in IE
			} else
				DOM.setStyle('mceModalBlocker', 'z-index', t.zIndex - 1);

			if (tinymce.isIE6 || /Firefox\/2\./.test(navigator.userAgent) || (tinymce.isIE && !DOM.boxModel))
				DOM.setStyles('mceModalBlocker', {position : 'absolute', left : vp.x, top : vp.y, width : vp.w - 2, height : vp.h - 2});

			t.focus(id);
			t._fixIELayout(id, 1);

			// Focus ok button
			if (DOM.get(id + '_ok'))
				DOM.get(id + '_ok').focus();

			t.count++;

			return w;
		},

		focus : function(id) {
			var t = this, w;

			if (w = t.windows[id]) {
				w.zIndex = this.zIndex++;
				w.element.setStyle('zIndex', w.zIndex);
				w.element.update();

				id = id + '_wrapper';
				DOM.removeClass(t.lastId, 'mceFocus');
				DOM.addClass(id, 'mceFocus');
				t.lastId = id;
			}
		},

		_addAll : function(te, ne) {
			var i, n, t = this, dom = tinymce.DOM;

			if (is(ne, 'string'))
				te.appendChild(dom.doc.createTextNode(ne));
			else if (ne.length) {
				te = te.appendChild(dom.create(ne[0], ne[1]));

				for (i=2; i<ne.length; i++)
					t._addAll(te, ne[i]);
			}
		},

		_startDrag : function(id, se, ac) {
			var t = this, mu, mm, d = DOM.doc, eb, w = t.windows[id], we = w.element, sp = we.getXY(), p, sz, ph, cp, vp, sx, sy, sex, sey, dx, dy, dw, dh;

			// Get positons and sizes
//			cp = DOM.getPos(t.editor.getContainer());
			cp = {x : 0, y : 0};
			vp = DOM.getViewPort();

			// Reduce viewport size to avoid scrollbars while dragging
			vp.w -= 2;
			vp.h -= 2;

			sex = se.screenX;
			sey = se.screenY;
			dx = dy = dw = dh = 0;

			// Handle mouse up
			mu = Event.add(d, 'mouseup', function(e) {
				Event.remove(d, 'mouseup', mu);
				Event.remove(d, 'mousemove', mm);

				if (eb)
					eb.remove();

				we.moveBy(dx, dy);
				we.resizeBy(dw, dh);
				sz = we.getSize();
				DOM.setStyles(id + '_ifr', {width : sz.w - w.deltaWidth, height : sz.h - w.deltaHeight});
				t._fixIELayout(id, 1);

				return Event.cancel(e);
			});

			if (ac != 'Move')
				startMove();

			function startMove() {
				if (eb)
					return;

				t._fixIELayout(id, 0);

				// Setup event blocker
				DOM.add(d.body, 'div', {
					id : 'mceEventBlocker',
					'class' : 'mceEventBlocker ' + (t.editor.settings.inlinepopups_skin || 'clearlooks2'),
					style : {zIndex : t.zIndex + 1}
				});

				if (tinymce.isIE6 || (tinymce.isIE && !DOM.boxModel))
					DOM.setStyles('mceEventBlocker', {position : 'absolute', left : vp.x, top : vp.y, width : vp.w - 2, height : vp.h - 2});

				eb = new Element('mceEventBlocker');
				eb.update();

				// Setup placeholder
				p = we.getXY();
				sz = we.getSize();
				sx = cp.x + p.x - vp.x;
				sy = cp.y + p.y - vp.y;
				DOM.add(eb.get(), 'div', {id : 'mcePlaceHolder', 'class' : 'mcePlaceHolder', style : {left : sx, top : sy, width : sz.w, height : sz.h}});
				ph = new Element('mcePlaceHolder');
			};

			// Handle mouse move/drag
			mm = Event.add(d, 'mousemove', function(e) {
				var x, y, v;

				startMove();

				x = e.screenX - sex;
				y = e.screenY - sey;

				switch (ac) {
					case 'ResizeW':
						dx = x;
						dw = 0 - x;
						break;

					case 'ResizeE':
						dw = x;
						break;

					case 'ResizeN':
					case 'ResizeNW':
					case 'ResizeNE':
						if (ac == "ResizeNW") {
							dx = x;
							dw = 0 - x;
						} else if (ac == "ResizeNE")
							dw = x;

						dy = y;
						dh = 0 - y;
						break;

					case 'ResizeS':
					case 'ResizeSW':
					case 'ResizeSE':
						if (ac == "ResizeSW") {
							dx = x;
							dw = 0 - x;
						} else if (ac == "ResizeSE")
							dw = x;

						dh = y;
						break;

					case 'mceMove':
						dx = x;
						dy = y;
						break;
				}

				// Boundary check
				if (dw < (v = w.features.min_width - sz.w)) {
					if (dx !== 0)
						dx += dw - v;

					dw = v;
				}
	
				if (dh < (v = w.features.min_height - sz.h)) {
					if (dy !== 0)
						dy += dh - v;

					dh = v;
				}

				dw = Math.min(dw, w.features.max_width - sz.w);
				dh = Math.min(dh, w.features.max_height - sz.h);
				dx = Math.max(dx, vp.x - (sx + vp.x));
				dy = Math.max(dy, vp.y - (sy + vp.y));
				dx = Math.min(dx, (vp.w + vp.x) - (sx + sz.w + vp.x));
				dy = Math.min(dy, (vp.h + vp.y) - (sy + sz.h + vp.y));

				// Move if needed
				if (dx + dy !== 0) {
					if (sx + dx < 0)
						dx = 0;
	
					if (sy + dy < 0)
						dy = 0;

					ph.moveTo(sx + dx, sy + dy);
				}

				// Resize if needed
				if (dw + dh !== 0)
					ph.resizeTo(sz.w + dw, sz.h + dh);

				return Event.cancel(e);
			});

			return Event.cancel(se);
		},

		resizeBy : function(dw, dh, id) {
			var w = this.windows[id];

			if (w) {
				w.element.resizeBy(dw, dh);
				w.iframeElement.resizeBy(dw, dh);
			}
		},

		close : function(win, id) {
			var t = this, w, d = DOM.doc, ix = 0, fw, id;

			id = t._findId(id || win);

			// Probably not inline
			if (!t.windows[id]) {
				t.parent(win);
				return;
			}

			t.count--;

			if (t.count == 0)
				DOM.remove('mceModalBlocker');

			if (w = t.windows[id]) {
				t.onClose.dispatch(t);
				Event.remove(d, 'mousedown', w.mousedownFunc);
				Event.remove(d, 'click', w.clickFunc);
				Event.clear(id);
				Event.clear(id + '_ifr');

				DOM.setAttrib(id + '_ifr', 'src', 'javascript:""'); // Prevent leak
				w.element.remove();
				delete t.windows[id];

				// Find front most window and focus that
				each (t.windows, function(w) {
					if (w.zIndex > ix) {
						fw = w;
						ix = w.zIndex;
					}
				});

				if (fw)
					t.focus(fw.id);
			}
		},

		setTitle : function(w, ti) {
			var e;

			w = this._findId(w);

			if (e = DOM.get(w + '_title'))
				e.innerHTML = DOM.encode(ti);
		},

		alert : function(txt, cb, s) {
			var t = this, w;

			w = t.open({
				title : t,
				type : 'alert',
				button_func : function(s) {
					if (cb)
						cb.call(s || t, s);

					t.close(null, w.id);
				},
				content : DOM.encode(t.editor.getLang(txt, txt)),
				inline : 1,
				width : 400,
				height : 130
			});
		},

		confirm : function(txt, cb, s) {
			var t = this, w;

			w = t.open({
				title : t,
				type : 'confirm',
				button_func : function(s) {
					if (cb)
						cb.call(s || t, s);

					t.close(null, w.id);
				},
				content : DOM.encode(t.editor.getLang(txt, txt)),
				inline : 1,
				width : 400,
				height : 130
			});
		},

		// Internal functions

		_findId : function(w) {
			var t = this;

			if (typeof(w) == 'string')
				return w;

			each(t.windows, function(wo) {
				var ifr = DOM.get(wo.id + '_ifr');

				if (ifr && w == ifr.contentWindow) {
					w = wo.id;
					return false;
				}
			});

			return w;
		},

		_fixIELayout : function(id, s) {
			var w, img;

			if (!tinymce.isIE6)
				return;

			// Fixes the bug where hover flickers and does odd things in IE6
			each(['n','s','w','e','nw','ne','sw','se'], function(v) {
				var e = DOM.get(id + '_resize_' + v);

				DOM.setStyles(e, {
					width : s ? e.clientWidth : '',
					height : s ? e.clientHeight : '',
					cursor : DOM.getStyle(e, 'cursor', 1)
				});

				DOM.setStyle(id + "_bottom", 'bottom', '-1px');

				e = 0;
			});

			// Fixes graphics glitch
			if (w = this.windows[id]) {
				// Fixes rendering bug after resize
				w.element.hide();
				w.element.show();

				// Forced a repaint of the window
				//DOM.get(id).style.filter = '';

				// IE has a bug where images used in CSS won't get loaded
				// sometimes when the cache in the browser is disabled
				// This fix tries to solve it by loading the images using the image object
				each(DOM.select('div,a', id), function(e, i) {
					if (e.currentStyle.backgroundImage != 'none') {
						img = new Image();
						img.src = e.currentStyle.backgroundImage.replace(/url\(\"(.+)\"\)/, '$1');
					}
				});

				DOM.get(id).style.filter = '';
			}
		}
	});

	// Register plugin
	tinymce.PluginManager.add('inlinepopups', tinymce.plugins.InlinePopups);
})();

>>>>>>> deploy
