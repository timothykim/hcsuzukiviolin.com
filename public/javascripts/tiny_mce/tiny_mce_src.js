<<<<<<< HEAD

/* file:jscripts/tiny_mce/classes/TinyMCE_Engine.class.js */

function TinyMCE_Engine() {
	var ua;

	this.majorVersion = "2";
	this.minorVersion = "0.8";
	this.releaseDate = "2006-10-23";

	this.instances = new Array();
	this.switchClassCache = new Array();
	this.windowArgs = new Array();
	this.loadedFiles = new Array();
	this.pendingFiles = new Array();
	this.loadingIndex = 0;
	this.configs = new Array();
	this.currentConfig = 0;
	this.eventHandlers = new Array();
	this.log = new Array();
	this.undoLevels = [];
	this.undoIndex = 0;
	this.typingUndoIndex = -1;

	// Browser check
	ua = navigator.userAgent;
	this.isMSIE = (navigator.appName == "Microsoft Internet Explorer");
	this.isMSIE5 = this.isMSIE && (ua.indexOf('MSIE 5') != -1);
	this.isMSIE5_0 = this.isMSIE && (ua.indexOf('MSIE 5.0') != -1);
	this.isMSIE7 = this.isMSIE && (ua.indexOf('MSIE 7') != -1);
	this.isGecko = ua.indexOf('Gecko') != -1;
	this.isSafari = ua.indexOf('Safari') != -1;
	this.isOpera = ua.indexOf('Opera') != -1;
	this.isMac = ua.indexOf('Mac') != -1;
	this.isNS7 = ua.indexOf('Netscape/7') != -1;
	this.isNS71 = ua.indexOf('Netscape/7.1') != -1;
	this.dialogCounter = 0;
	this.plugins = new Array();
	this.themes = new Array();
	this.menus = new Array();
	this.loadedPlugins = new Array();
	this.buttonMap = new Array();
	this.isLoaded = false;

	// Fake MSIE on Opera and if Opera fakes IE, Gecko or Safari cancel those
	if (this.isOpera) {
		this.isMSIE = true;
		this.isGecko = false;
		this.isSafari =  false;
	}

	this.isIE = this.isMSIE;
	this.isRealIE = this.isMSIE && !this.isOpera;

	// TinyMCE editor id instance counter
	this.idCounter = 0;
};

TinyMCE_Engine.prototype = {
	init : function(settings) {
		var theme, nl, baseHREF = "", i;

		// IE 5.0x is no longer supported since 5.5, 6.0 and 7.0 now exists. We can't support old browsers forever, sorry.
		if (this.isMSIE5_0)
			return;

		this.settings = settings;

		// Check if valid browser has execcommand support
		if (typeof(document.execCommand) == 'undefined')
			return;

		// Get script base path
		if (!tinyMCE.baseURL) {
			var elements = document.getElementsByTagName('script');

			// If base element found, add that infront of baseURL
			nl = document.getElementsByTagName('base');
			for (i=0; i<nl.length; i++) {
				if (nl[i].href)
					baseHREF = nl[i].href;
			}

			for (var i=0; i<elements.length; i++) {
				if (elements[i].src && (elements[i].src.indexOf("tiny_mce.js") != -1 || elements[i].src.indexOf("tiny_mce_dev.js") != -1 || elements[i].src.indexOf("tiny_mce_src.js") != -1 || elements[i].src.indexOf("tiny_mce_gzip") != -1)) {
					var src = elements[i].src;

					tinyMCE.srcMode = (src.indexOf('_src') != -1 || src.indexOf('_dev') != -1) ? '_src' : '';
					tinyMCE.gzipMode = src.indexOf('_gzip') != -1;
					src = src.substring(0, src.lastIndexOf('/'));

					if (settings.exec_mode == "src" || settings.exec_mode == "normal")
						tinyMCE.srcMode = settings.exec_mode == "src" ? '_src' : '';

					// Force it absolute if page has a base href
					if (baseHREF != "" && src.indexOf('://') == -1)
						tinyMCE.baseURL = baseHREF + src;
					else
						tinyMCE.baseURL = src;

					break;
				}
			}
		}

		// Get document base path
		this.documentBasePath = document.location.href;
		if (this.documentBasePath.indexOf('?') != -1)
			this.documentBasePath = this.documentBasePath.substring(0, this.documentBasePath.indexOf('?'));
		this.documentURL = this.documentBasePath;
		this.documentBasePath = this.documentBasePath.substring(0, this.documentBasePath.lastIndexOf('/'));

		// If not HTTP absolute
		if (tinyMCE.baseURL.indexOf('://') == -1 && tinyMCE.baseURL.charAt(0) != '/') {
			// If site absolute
			tinyMCE.baseURL = this.documentBasePath + "/" + tinyMCE.baseURL;
		}

		// Set default values on settings
		this._def("mode", "none");
		this._def("theme", "advanced");
		this._def("plugins", "", true);
		this._def("language", "en");
		this._def("docs_language", this.settings['language']);
		this._def("elements", "");
		this._def("textarea_trigger", "mce_editable");
		this._def("editor_selector", "");
		this._def("editor_deselector", "mceNoEditor");
		this._def("valid_elements", "+a[id|style|rel|rev|charset|hreflang|dir|lang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup],-strong/-b[class|style],-em/-i[class|style],-strike[class|style],-u[class|style],#p[id|style|dir|class|align],-ol[class|style],-ul[class|style],-li[class|style],br,img[id|dir|lang|longdesc|usemap|style|class|src|onmouseover|onmouseout|border|alt=|title|hspace|vspace|width|height|align],-sub[style|class],-sup[style|class],-blockquote[dir|style],-table[border=0|cellspacing|cellpadding|width|height|class|align|summary|style|dir|id|lang|bgcolor|background|bordercolor],-tr[id|lang|dir|class|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor],tbody[id|class],thead[id|class],tfoot[id|class],#td[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor|scope],-th[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|scope],caption[id|lang|dir|class|style],-div[id|dir|class|align|style],-span[style|class|align],-pre[class|align|style],address[class|align|style],-h1[id|style|dir|class|align],-h2[id|style|dir|class|align],-h3[id|style|dir|class|align],-h4[id|style|dir|class|align],-h5[id|style|dir|class|align],-h6[id|style|dir|class|align],hr[class|style],-font[face|size|style|id|class|dir|color],dd[id|class|title|style|dir|lang],dl[id|class|title|style|dir|lang],dt[id|class|title|style|dir|lang],cite[title|id|class|style|dir|lang],abbr[title|id|class|style|dir|lang],acronym[title|id|class|style|dir|lang],del[title|id|class|style|dir|lang|datetime|cite],ins[title|id|class|style|dir|lang|datetime|cite]");
		this._def("extended_valid_elements", "");
		this._def("invalid_elements", "");
		this._def("encoding", "");
		this._def("urlconverter_callback", tinyMCE.getParam("urlconvertor_callback", "TinyMCE_Engine.prototype.convertURL"));
		this._def("save_callback", "");
		this._def("debug", false);
		this._def("force_br_newlines", false);
		this._def("force_p_newlines", true);
		this._def("add_form_submit_trigger", true);
		this._def("relative_urls", true);
		this._def("remove_script_host", true);
		this._def("focus_alert", true);
		this._def("document_base_url", this.documentURL);
		this._def("visual", true);
		this._def("visual_table_class", "mceVisualAid");
		this._def("setupcontent_callback", "");
		this._def("fix_content_duplication", true);
		this._def("custom_undo_redo", true);
		this._def("custom_undo_redo_levels", -1);
		this._def("custom_undo_redo_keyboard_shortcuts", true);
		this._def("custom_undo_redo_restore_selection", true);
		this._def("custom_undo_redo_global", false);
		this._def("verify_html", true);
		this._def("apply_source_formatting", false);
		this._def("directionality", "ltr");
		this._def("cleanup_on_startup", false);
		this._def("inline_styles", false);
		this._def("convert_newlines_to_brs", false);
		this._def("auto_reset_designmode", true);
		this._def("entities", "39,#39,160,nbsp,161,iexcl,162,cent,163,pound,164,curren,165,yen,166,brvbar,167,sect,168,uml,169,copy,170,ordf,171,laquo,172,not,173,shy,174,reg,175,macr,176,deg,177,plusmn,178,sup2,179,sup3,180,acute,181,micro,182,para,183,middot,184,cedil,185,sup1,186,ordm,187,raquo,188,frac14,189,frac12,190,frac34,191,iquest,192,Agrave,193,Aacute,194,Acirc,195,Atilde,196,Auml,197,Aring,198,AElig,199,Ccedil,200,Egrave,201,Eacute,202,Ecirc,203,Euml,204,Igrave,205,Iacute,206,Icirc,207,Iuml,208,ETH,209,Ntilde,210,Ograve,211,Oacute,212,Ocirc,213,Otilde,214,Ouml,215,times,216,Oslash,217,Ugrave,218,Uacute,219,Ucirc,220,Uuml,221,Yacute,222,THORN,223,szlig,224,agrave,225,aacute,226,acirc,227,atilde,228,auml,229,aring,230,aelig,231,ccedil,232,egrave,233,eacute,234,ecirc,235,euml,236,igrave,237,iacute,238,icirc,239,iuml,240,eth,241,ntilde,242,ograve,243,oacute,244,ocirc,245,otilde,246,ouml,247,divide,248,oslash,249,ugrave,250,uacute,251,ucirc,252,uuml,253,yacute,254,thorn,255,yuml,402,fnof,913,Alpha,914,Beta,915,Gamma,916,Delta,917,Epsilon,918,Zeta,919,Eta,920,Theta,921,Iota,922,Kappa,923,Lambda,924,Mu,925,Nu,926,Xi,927,Omicron,928,Pi,929,Rho,931,Sigma,932,Tau,933,Upsilon,934,Phi,935,Chi,936,Psi,937,Omega,945,alpha,946,beta,947,gamma,948,delta,949,epsilon,950,zeta,951,eta,952,theta,953,iota,954,kappa,955,lambda,956,mu,957,nu,958,xi,959,omicron,960,pi,961,rho,962,sigmaf,963,sigma,964,tau,965,upsilon,966,phi,967,chi,968,psi,969,omega,977,thetasym,978,upsih,982,piv,8226,bull,8230,hellip,8242,prime,8243,Prime,8254,oline,8260,frasl,8472,weierp,8465,image,8476,real,8482,trade,8501,alefsym,8592,larr,8593,uarr,8594,rarr,8595,darr,8596,harr,8629,crarr,8656,lArr,8657,uArr,8658,rArr,8659,dArr,8660,hArr,8704,forall,8706,part,8707,exist,8709,empty,8711,nabla,8712,isin,8713,notin,8715,ni,8719,prod,8721,sum,8722,minus,8727,lowast,8730,radic,8733,prop,8734,infin,8736,ang,8743,and,8744,or,8745,cap,8746,cup,8747,int,8756,there4,8764,sim,8773,cong,8776,asymp,8800,ne,8801,equiv,8804,le,8805,ge,8834,sub,8835,sup,8836,nsub,8838,sube,8839,supe,8853,oplus,8855,otimes,8869,perp,8901,sdot,8968,lceil,8969,rceil,8970,lfloor,8971,rfloor,9001,lang,9002,rang,9674,loz,9824,spades,9827,clubs,9829,hearts,9830,diams,34,quot,38,amp,60,lt,62,gt,338,OElig,339,oelig,352,Scaron,353,scaron,376,Yuml,710,circ,732,tilde,8194,ensp,8195,emsp,8201,thinsp,8204,zwnj,8205,zwj,8206,lrm,8207,rlm,8211,ndash,8212,mdash,8216,lsquo,8217,rsquo,8218,sbquo,8220,ldquo,8221,rdquo,8222,bdquo,8224,dagger,8225,Dagger,8240,permil,8249,lsaquo,8250,rsaquo,8364,euro", true);
		this._def("entity_encoding", "named");
		this._def("cleanup_callback", "");
		this._def("add_unload_trigger", true);
		this._def("ask", false);
		this._def("nowrap", false);
		this._def("auto_resize", false);
		this._def("auto_focus", false);
		this._def("cleanup", true);
		this._def("remove_linebreaks", true);
		this._def("button_tile_map", false);
		this._def("submit_patch", true);
		this._def("browsers", "msie,safari,gecko,opera", true);
		this._def("dialog_type", "window");
		this._def("accessibility_warnings", true);
		this._def("accessibility_focus", true);
		this._def("merge_styles_invalid_parents", "");
		this._def("force_hex_style_colors", true);
		this._def("trim_span_elements", true);
		this._def("convert_fonts_to_spans", false);
		this._def("doctype", '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">');
		this._def("font_size_classes", '');
		this._def("font_size_style_values", 'xx-small,x-small,small,medium,large,x-large,xx-large', true);
		this._def("event_elements", 'a,img', true);
		this._def("convert_urls", true);
		this._def("table_inline_editing", false);
		this._def("object_resizing", true);
		this._def("custom_shortcuts", true);
		this._def("convert_on_click", false);
		this._def("content_css", '');
		this._def("fix_list_elements", false);
		this._def("fix_table_elements", false);
		this._def("strict_loading_mode", document.contentType == 'application/xhtml+xml');
		this._def("hidden_tab_class", '');
		this._def("display_tab_class", '');
		this._def("gecko_spellcheck", false);

		// Force strict loading mode to false on non Gecko browsers
		if (this.isMSIE && !this.isOpera)
			this.settings.strict_loading_mode = false;

		// Browser check IE
		if (this.isMSIE && this.settings['browsers'].indexOf('msie') == -1)
			return;

		// Browser check Gecko
		if (this.isGecko && this.settings['browsers'].indexOf('gecko') == -1)
			return;

		// Browser check Safari
		if (this.isSafari && this.settings['browsers'].indexOf('safari') == -1)
			return;

		// Browser check Opera
		if (this.isOpera && this.settings['browsers'].indexOf('opera') == -1)
			return;

		// If not super absolute make it so
		baseHREF = tinyMCE.settings['document_base_url'];
		var h = document.location.href;
		var p = h.indexOf('://');
		if (p > 0 && document.location.protocol != "file:") {
			p = h.indexOf('/', p + 3);
			h = h.substring(0, p);

			if (baseHREF.indexOf('://') == -1)
				baseHREF = h + baseHREF;

			tinyMCE.settings['document_base_url'] = baseHREF;
			tinyMCE.settings['document_base_prefix'] = h;
		}

		// Trim away query part
		if (baseHREF.indexOf('?') != -1)
			baseHREF = baseHREF.substring(0, baseHREF.indexOf('?'));

		this.settings['base_href'] = baseHREF.substring(0, baseHREF.lastIndexOf('/')) + "/";

		theme = this.settings['theme'];
		this.inlineStrict = 'A|BR|SPAN|BDO|MAP|OBJECT|IMG|TT|I|B|BIG|SMALL|EM|STRONG|DFN|CODE|Q|SAMP|KBD|VAR|CITE|ABBR|ACRONYM|SUB|SUP|#text|#comment';
		this.inlineTransitional = 'A|BR|SPAN|BDO|OBJECT|APPLET|IMG|MAP|IFRAME|TT|I|B|U|S|STRIKE|BIG|SMALL|FONT|BASEFONT|EM|STRONG|DFN|CODE|Q|SAMP|KBD|VAR|CITE|ABBR|ACRONYM|SUB|SUP|INPUT|SELECT|TEXTAREA|LABEL|BUTTON|#text|#comment';
		this.blockElms = 'H[1-6]|P|DIV|ADDRESS|PRE|FORM|TABLE|LI|OL|UL|TD|BLOCKQUOTE|CENTER|DL|DT|DD|DIR|FIELDSET|FORM|NOSCRIPT|NOFRAMES|MENU|ISINDEX|SAMP';
		this.blockRegExp = new RegExp("^(" + this.blockElms + ")$", "i");
		this.posKeyCodes = new Array(13,45,36,35,33,34,37,38,39,40);
		this.uniqueURL = 'javascript:TINYMCE_UNIQUEURL();'; // Make unique URL non real URL
		this.uniqueTag = '<div id="mceTMPElement" style="display: none">TMP</div>';
		this.callbacks = new Array('onInit', 'getInfo', 'getEditorTemplate', 'setupContent', 'onChange', 'onPageLoad', 'handleNodeChange', 'initInstance', 'execCommand', 'getControlHTML', 'handleEvent', 'cleanup');

		// Theme url
		this.settings['theme_href'] = tinyMCE.baseURL + "/themes/" + theme;

		if (!tinyMCE.isIE || tinyMCE.isOpera)
			this.settings['force_br_newlines'] = false;

		if (tinyMCE.getParam("popups_css", false)) {
			var cssPath = tinyMCE.getParam("popups_css", "");

			// Is relative
			if (cssPath.indexOf('://') == -1 && cssPath.charAt(0) != '/')
				this.settings['popups_css'] = this.documentBasePath + "/" + cssPath;
			else
				this.settings['popups_css'] = cssPath;
		} else
			this.settings['popups_css'] = tinyMCE.baseURL + "/themes/" + theme + "/css/editor_popup.css";

		if (tinyMCE.getParam("editor_css", false)) {
			var cssPath = tinyMCE.getParam("editor_css", "");

			// Is relative
			if (cssPath.indexOf('://') == -1 && cssPath.charAt(0) != '/')
				this.settings['editor_css'] = this.documentBasePath + "/" + cssPath;
			else
				this.settings['editor_css'] = cssPath;
		} else {
			if (this.settings.editor_css != '')
				this.settings['editor_css'] = tinyMCE.baseURL + "/themes/" + theme + "/css/editor_ui.css";
		}

		if (tinyMCE.settings['debug']) {
			var msg = "Debug: \n";

			msg += "baseURL: " + this.baseURL + "\n";
			msg += "documentBasePath: " + this.documentBasePath + "\n";
			msg += "content_css: " + this.settings['content_css'] + "\n";
			msg += "popups_css: " + this.settings['popups_css'] + "\n";
			msg += "editor_css: " + this.settings['editor_css'] + "\n";

			alert(msg);
		}

		// Only do this once
		if (this.configs.length == 0) {
			if (typeof(TinyMCECompressed) == "undefined") {
				tinyMCE.addEvent(window, "DOMContentLoaded", TinyMCE_Engine.prototype.onLoad);

				if (tinyMCE.isRealIE) {
					if (document.body)
						tinyMCE.addEvent(document.body, "readystatechange", TinyMCE_Engine.prototype.onLoad);
					else
						tinyMCE.addEvent(document, "readystatechange", TinyMCE_Engine.prototype.onLoad);
				}

				tinyMCE.addEvent(window, "load", TinyMCE_Engine.prototype.onLoad);
				tinyMCE._addUnloadEvents();
			}
		}

		this.loadScript(tinyMCE.baseURL + '/themes/' + this.settings['theme'] + '/editor_template' + tinyMCE.srcMode + '.js');
		this.loadScript(tinyMCE.baseURL + '/langs/' + this.settings['language'] +  '.js');
		this.loadCSS(this.settings['editor_css']);

		// Add plugins
		var p = tinyMCE.getParam('plugins', '', true, ',');
		if (p.length > 0) {
			for (var i=0; i<p.length; i++) {
				if (p[i].charAt(0) != '-')
					this.loadScript(tinyMCE.baseURL + '/plugins/' + p[i] + '/editor_plugin' + tinyMCE.srcMode + '.js');
			}
		}

		// Setup entities
		if (tinyMCE.getParam('entity_encoding') == 'named') {
			settings['cleanup_entities'] = new Array();
			var entities = tinyMCE.getParam('entities', '', true, ',');
			for (var i=0; i<entities.length; i+=2)
				settings['cleanup_entities']['c' + entities[i]] = entities[i+1];
		}

		// Save away this config
		settings['index'] = this.configs.length;
		this.configs[this.configs.length] = settings;

		// Start loading first one in chain
		this.loadNextScript();

		// Force flicker free CSS backgrounds in IE
		if (this.isIE && !this.isOpera) {
			try {
				document.execCommand('BackgroundImageCache', false, true);
			} catch (e) {
			}
		}
	},

	_addUnloadEvents : function() {
		if (tinyMCE.isIE) {
			if (tinyMCE.settings['add_unload_trigger']) {
				tinyMCE.addEvent(window, "unload", TinyMCE_Engine.prototype.unloadHandler);
				tinyMCE.addEvent(window.document, "beforeunload", TinyMCE_Engine.prototype.unloadHandler);
			}
		} else {
			if (tinyMCE.settings['add_unload_trigger'])
				tinyMCE.addEvent(window, "unload", function () {tinyMCE.triggerSave(true, true);});
		}
	},

	_def : function(key, def_val, t) {
		var v = tinyMCE.getParam(key, def_val);

		v = t ? v.replace(/\s+/g, "") : v;

		this.settings[key] = v;
	},

	hasPlugin : function(n) {
		return typeof(this.plugins[n]) != "undefined" && this.plugins[n] != null;
	},

	addPlugin : function(n, p) {
		var op = this.plugins[n];

		// Use the previous plugin object base URL used when loading external plugins
		p.baseURL = op ? op.baseURL : tinyMCE.baseURL + "/plugins/" + n;
		this.plugins[n] = p;

		this.loadNextScript();
	},

	setPluginBaseURL : function(n, u) {
		var op = this.plugins[n];

		if (op)
			op.baseURL = u;
		else
			this.plugins[n] = {baseURL : u};
	},

	loadPlugin : function(n, u) {
		u = u.indexOf('.js') != -1 ? u.substring(0, u.lastIndexOf('/')) : u;
		u = u.charAt(u.length-1) == '/' ? u.substring(0, u.length-1) : u;
		this.plugins[n] = {baseURL : u};
		this.loadScript(u + "/editor_plugin" + (tinyMCE.srcMode ? '_src' : '') + ".js");
	},

	hasTheme : function(n) {
		return typeof(this.themes[n]) != "undefined" && this.themes[n] != null;
	},

	addTheme : function(n, t) {
		this.themes[n] = t;

		this.loadNextScript();
	},

	addMenu : function(n, m) {
		this.menus[n] = m;
	},

	hasMenu : function(n) {
		return typeof(this.plugins[n]) != "undefined" && this.plugins[n] != null;
	},

	loadScript : function(url) {
		var i;

		for (i=0; i<this.loadedFiles.length; i++) {
			if (this.loadedFiles[i] == url)
				return;
		}

		if (tinyMCE.settings.strict_loading_mode)
			this.pendingFiles[this.pendingFiles.length] = url;
		else
			document.write('<sc'+'ript language="javascript" type="text/javascript" src="' + url + '"></script>');

		this.loadedFiles[this.loadedFiles.length] = url;
	},

	loadNextScript : function() {
		var d = document, se;

		if (!tinyMCE.settings.strict_loading_mode)
			return;

		if (this.loadingIndex < this.pendingFiles.length) {
			se = d.createElementNS('http://www.w3.org/1999/xhtml', 'script');
			se.setAttribute('language', 'javascript');
			se.setAttribute('type', 'text/javascript');
			se.setAttribute('src', this.pendingFiles[this.loadingIndex++]);

			d.getElementsByTagName("head")[0].appendChild(se);
		} else
			this.loadingIndex = -1; // Done with loading
	},

	loadCSS : function(url) {
		var ar = url.replace(/\s+/, '').split(',');
		var lflen = 0, csslen = 0;
		var skip = false;
		var x = 0, i = 0, nl, le;

		for (x = 0,csslen = ar.length; x<csslen; x++) {
			if (ar[x] != null && ar[x] != 'null' && ar[x].length > 0) {
				/* Make sure it doesn't exist. */
				for (i=0, lflen=this.loadedFiles.length; i<lflen; i++) {
					if (this.loadedFiles[i] == ar[x]) {
						skip = true;
						break;
					}
				}

				if (!skip) {
					if (tinyMCE.settings.strict_loading_mode) {
						nl = document.getElementsByTagName("head");

						le = document.createElement('link');
						le.setAttribute('href', ar[x]);
						le.setAttribute('rel', 'stylesheet');
						le.setAttribute('type', 'text/css');

						nl[0].appendChild(le);			
					} else
						document.write('<link href="' + ar[x] + '" rel="stylesheet" type="text/css" />');

					this.loadedFiles[this.loadedFiles.length] = ar[x];
				}
			}
		}
	},

	importCSS : function(doc, css) {
		var css_ary = css.replace(/\s+/, '').split(',');
		var csslen, elm, headArr, x, css_file;

		for (x = 0, csslen = css_ary.length; x<csslen; x++) {
			css_file = css_ary[x];

			if (css_file != null && css_file != 'null' && css_file.length > 0) {
				// Is relative, make absolute
				if (css_file.indexOf('://') == -1 && css_file.charAt(0) != '/')
					css_file = this.documentBasePath + "/" + css_file;

				if (typeof(doc.createStyleSheet) == "undefined") {
					elm = doc.createElement("link");

					elm.rel = "stylesheet";
					elm.href = css_file;

					if ((headArr = doc.getElementsByTagName("head")) != null && headArr.length > 0)
						headArr[0].appendChild(elm);
				} else
					doc.createStyleSheet(css_file);
			}
		}
	},

	confirmAdd : function(e, settings) {
		var elm = tinyMCE.isIE ? event.srcElement : e.target;
		var elementId = elm.name ? elm.name : elm.id;

		tinyMCE.settings = settings;

		if (tinyMCE.settings['convert_on_click'] || (!elm.getAttribute('mce_noask') && confirm(tinyMCELang['lang_edit_confirm'])))
			tinyMCE.addMCEControl(elm, elementId);

		elm.setAttribute('mce_noask', 'true');
	},

	updateContent : function(form_element_name) {
		// Find MCE instance linked to given form element and copy it's value
		var formElement = document.getElementById(form_element_name);
		for (var n in tinyMCE.instances) {
			var inst = tinyMCE.instances[n];
			if (!tinyMCE.isInstance(inst))
				continue;

			inst.switchSettings();

			if (inst.formElement == formElement) {
				var doc = inst.getDoc();
		
				tinyMCE._setHTML(doc, inst.formElement.value);

				if (!tinyMCE.isIE)
					doc.body.innerHTML = tinyMCE._cleanupHTML(inst, doc, this.settings, doc.body, inst.visualAid);
			}
		}
	},

	addMCEControl : function(replace_element, form_element_name, target_document) {
		var id = "mce_editor_" + tinyMCE.idCounter++;
		var inst = new TinyMCE_Control(tinyMCE.settings);

		inst.editorId = id;
		this.instances[id] = inst;

		inst._onAdd(replace_element, form_element_name, target_document);
	},

	removeInstance : function(ti) {
		var t = [], n, i;

		// Remove from instances
		for (n in tinyMCE.instances) {
			i = tinyMCE.instances[n];

			if (tinyMCE.isInstance(i) && ti != i)
					t[n] = i;
		}

		tinyMCE.instances = t;

		// Remove from global undo/redo
		n = [];
		t = tinyMCE.undoLevels;

		for (i=0; i<t.length; i++) {
			if (t[i] != ti)
				n.push(t[i]);
		}

		tinyMCE.undoLevels = n;
		tinyMCE.undoIndex = n.length;

		return ti;
	},

	removeMCEControl : function(editor_id) {
		var inst = tinyMCE.getInstanceById(editor_id), h, re, ot, tn;

		if (inst) {
			inst.switchSettings();

			editor_id = inst.editorId;
			h = tinyMCE.getContent(editor_id);

			this.removeInstance(inst);

			tinyMCE.selectedElement = null;
			tinyMCE.selectedInstance = null;

			// Remove element
			re = document.getElementById(editor_id + "_parent");
			ot = inst.oldTargetElement;
			tn = ot.nodeName.toLowerCase();

			if (tn == "textarea" || tn == "input") {
				re.parentNode.removeChild(re);
				ot.style.display = "inline";
				ot.value = h;
			} else {
				ot.innerHTML = h;
				ot.style.display = 'block';
				re.parentNode.insertBefore(ot, re);
				re.parentNode.removeChild(re);
			}
		}
	},

	triggerSave : function(skip_cleanup, skip_callback) {
		var inst, n;

		// Default to false
		if (typeof(skip_cleanup) == "undefined")
			skip_cleanup = false;

		// Default to false
		if (typeof(skip_callback) == "undefined")
			skip_callback = false;

		// Cleanup and set all form fields
		for (n in tinyMCE.instances) {
			inst = tinyMCE.instances[n];

			if (!tinyMCE.isInstance(inst))
				continue;

			inst.triggerSave(skip_cleanup, skip_callback);
		}
	},

	resetForm : function(form_index) {
		var i, inst, n, formObj = document.forms[form_index];

		for (n in tinyMCE.instances) {
			inst = tinyMCE.instances[n];

			if (!tinyMCE.isInstance(inst))
				continue;

			inst.switchSettings();

			for (i=0; i<formObj.elements.length; i++) {
				if (inst.formTargetElementId == formObj.elements[i].name)
					inst.getBody().innerHTML = inst.startContent;
			}
		}
	},

	execInstanceCommand : function(editor_id, command, user_interface, value, focus) {
		var inst = tinyMCE.getInstanceById(editor_id), r;

		if (inst) {
			r = inst.selection.getRng();

			if (typeof(focus) == "undefined")
				focus = true;

			// IE bug lost focus on images in absolute divs Bug #1534575
			if (focus && (!r || !r.item))
				inst.contentWindow.focus();

			// Reset design mode if lost
			inst.autoResetDesignMode();

			this.selectedElement = inst.getFocusElement();
			inst.select();
			tinyMCE.execCommand(command, user_interface, value);

			// Cancel event so it doesn't call onbeforeonunlaod
			if (tinyMCE.isIE && window.event != null)
				tinyMCE.cancelEvent(window.event);
		}
	},

	execCommand : function(command, user_interface, value) {
		var inst = tinyMCE.selectedInstance;

		// Default input
		user_interface = user_interface ? user_interface : false;
		value = value ? value : null;

		if (inst)
			inst.switchSettings();

		switch (command) {
			case "Undo":
				if (this.getParam('custom_undo_redo_global')) {
					if (this.undoIndex > 0) {
						tinyMCE.nextUndoRedoAction = 'Undo';
						inst = this.undoLevels[--this.undoIndex];
						inst.select();

						if (!tinyMCE.nextUndoRedoInstanceId)
							inst.execCommand('Undo');
					}
				} else
					inst.execCommand('Undo');
				return true;

			case "Redo":
				if (this.getParam('custom_undo_redo_global')) {
					if (this.undoIndex <= this.undoLevels.length - 1) {
						tinyMCE.nextUndoRedoAction = 'Redo';
						inst = this.undoLevels[this.undoIndex++];
						inst.select();

						if (!tinyMCE.nextUndoRedoInstanceId)
							inst.execCommand('Redo');
					}
				} else
					inst.execCommand('Redo');

				return true;

			case 'mceFocus':
				var inst = tinyMCE.getInstanceById(value);
				if (inst)
					inst.getWin().focus();
			return;

			case "mceAddControl":
			case "mceAddEditor":
				tinyMCE.addMCEControl(tinyMCE._getElementById(value), value);
				return;

			case "mceAddFrameControl":
				tinyMCE.addMCEControl(tinyMCE._getElementById(value['element'], value['document']), value['element'], value['document']);
				return;

			case "mceRemoveControl":
			case "mceRemoveEditor":
				tinyMCE.removeMCEControl(value);
				return;

			case "mceResetDesignMode":
				// Resets the designmode state of the editors in Gecko
				if (!tinyMCE.isIE) {
					for (var n in tinyMCE.instances) {
						if (!tinyMCE.isInstance(tinyMCE.instances[n]))
							continue;

						try {
							tinyMCE.instances[n].getDoc().designMode = "on";
						} catch (e) {
							// Ignore any errors
						}
					}
				}

				return;
		}

		if (inst) {
			inst.execCommand(command, user_interface, value);
		} else if (tinyMCE.settings['focus_alert'])
			alert(tinyMCELang['lang_focus_alert']);
	},

	_createIFrame : function(replace_element, doc, win) {
		var iframe, id = replace_element.getAttribute("id");
		var aw, ah;

		if (typeof(doc) == "undefined")
			doc = document;

		if (typeof(win) == "undefined")
			win = window;

		iframe = doc.createElement("iframe");

		aw = "" + tinyMCE.settings['area_width'];
		ah = "" + tinyMCE.settings['area_height'];

		if (aw.indexOf('%') == -1) {
			aw = parseInt(aw);
			aw = (isNaN(aw) || aw < 0) ? 300 : aw;
			aw = aw + "px";
		}

		if (ah.indexOf('%') == -1) {
			ah = parseInt(ah);
			ah = (isNaN(ah) || ah < 0) ? 240 : ah;
			ah = ah + "px";
		}

		iframe.setAttribute("id", id);
		iframe.setAttribute("name", id);
		iframe.setAttribute("class", "mceEditorIframe");
		iframe.setAttribute("border", "0");
		iframe.setAttribute("frameBorder", "0");
		iframe.setAttribute("marginWidth", "0");
		iframe.setAttribute("marginHeight", "0");
		iframe.setAttribute("leftMargin", "0");
		iframe.setAttribute("topMargin", "0");
		iframe.setAttribute("width", aw);
		iframe.setAttribute("height", ah);
		iframe.setAttribute("allowtransparency", "true");
		iframe.className = 'mceEditorIframe';

		if (tinyMCE.settings["auto_resize"])
			iframe.setAttribute("scrolling", "no");

		// Must have a src element in MSIE HTTPs breaks aswell as absoute URLs
		if (tinyMCE.isRealIE)
			iframe.setAttribute("src", this.settings['default_document']);

		iframe.style.width = aw;
		iframe.style.height = ah;

		// Ugly hack for Gecko problem in strict mode
		if (tinyMCE.settings.strict_loading_mode)
			iframe.style.marginBottom = '-5px';

		// MSIE 5.0 issue
		if (tinyMCE.isRealIE)
			replace_element.outerHTML = iframe.outerHTML;
		else
			replace_element.parentNode.replaceChild(iframe, replace_element);

		if (tinyMCE.isRealIE)
			return win.frames[id];
		else
			return iframe;
	},

	setupContent : function(editor_id) {
		var inst = tinyMCE.instances[editor_id], i;
		var doc = inst.getDoc();
		var head = doc.getElementsByTagName('head').item(0);
		var content = inst.startContent;

		// HTML values get XML encoded in strict mode
		if (tinyMCE.settings.strict_loading_mode) {
			content = content.replace(/&lt;/g, '<');
			content = content.replace(/&gt;/g, '>');
			content = content.replace(/&quot;/g, '"');
			content = content.replace(/&amp;/g, '&');
		}

		inst.switchSettings();

		// Not loaded correctly hit it again, Mozilla bug #997860
		if (!tinyMCE.isIE && tinyMCE.getParam("setupcontent_reload", false) && doc.title != "blank_page") {
			// This part will remove the designMode status
			// Failes first time in Firefox 1.5b2 on Mac
			try {doc.location.href = tinyMCE.baseURL + "/blank.htm";} catch (ex) {}
			window.setTimeout("tinyMCE.setupContent('" + editor_id + "');", 1000);
			return;
		}

		if (!head) {
			window.setTimeout("tinyMCE.setupContent('" + editor_id + "');", 10);
			return;
		}

		// Import theme specific content CSS the user specific
		tinyMCE.importCSS(inst.getDoc(), tinyMCE.baseURL + "/themes/" + inst.settings['theme'] + "/css/editor_content.css");
		tinyMCE.importCSS(inst.getDoc(), inst.settings['content_css']);
		tinyMCE.dispatchCallback(inst, 'init_instance_callback', 'initInstance', inst);

		// Setup keyboard shortcuts
		if (tinyMCE.getParam('custom_undo_redo_keyboard_shortcuts')) {
			inst.addShortcut('ctrl', 'z', 'lang_undo_desc', 'Undo');
			inst.addShortcut('ctrl', 'y', 'lang_redo_desc', 'Redo');
		}

		// BlockFormat shortcuts keys
		for (i=1; i<=6; i++)
			inst.addShortcut('ctrl', '' + i, '', 'FormatBlock', false, '<h' + i + '>');

		inst.addShortcut('ctrl', '7', '', 'FormatBlock', false, '<p>');
		inst.addShortcut('ctrl', '8', '', 'FormatBlock', false, '<div>');
		inst.addShortcut('ctrl', '9', '', 'FormatBlock', false, '<address>');

		// Add default shortcuts for gecko
		if (tinyMCE.isGecko) {
			inst.addShortcut('ctrl', 'b', 'lang_bold_desc', 'Bold');
			inst.addShortcut('ctrl', 'i', 'lang_italic_desc', 'Italic');
			inst.addShortcut('ctrl', 'u', 'lang_underline_desc', 'Underline');
		}

		// Setup span styles
		if (tinyMCE.getParam("convert_fonts_to_spans"))
			inst.getBody().setAttribute('id', 'mceSpanFonts');

		if (tinyMCE.settings['nowrap'])
			doc.body.style.whiteSpace = "nowrap";

		doc.body.dir = this.settings['directionality'];
		doc.editorId = editor_id;

		// Add on document element in Mozilla
		if (!tinyMCE.isIE)
			doc.documentElement.editorId = editor_id;

		inst.setBaseHREF(tinyMCE.settings['base_href']);

		// Replace new line characters to BRs
		if (tinyMCE.settings['convert_newlines_to_brs']) {
			content = tinyMCE.regexpReplace(content, "\r\n", "<br />", "gi");
			content = tinyMCE.regexpReplace(content, "\r", "<br />", "gi");
			content = tinyMCE.regexpReplace(content, "\n", "<br />", "gi");
		}

		// Open closed anchors
	//	content = content.replace(new RegExp('<a(.*?)/>', 'gi'), '<a$1></a>');

		// Call custom cleanup code
		content = tinyMCE.storeAwayURLs(content);
		content = tinyMCE._customCleanup(inst, "insert_to_editor", content);

		if (tinyMCE.isIE) {
			// Ugly!!!
			window.setInterval('try{tinyMCE.getCSSClasses(tinyMCE.instances["' + editor_id + '"].getDoc(), "' + editor_id + '");}catch(e){}', 500);

			if (tinyMCE.settings["force_br_newlines"])
				doc.styleSheets[0].addRule("p", "margin: 0;");

			var body = inst.getBody();
			body.editorId = editor_id;
		}

		content = tinyMCE.cleanupHTMLCode(content);

		// Fix for bug #958637
		if (!tinyMCE.isIE) {
			var contentElement = inst.getDoc().createElement("body");
			var doc = inst.getDoc();

			contentElement.innerHTML = content;

			// Remove weridness!
			if (tinyMCE.isGecko && tinyMCE.settings['remove_lt_gt'])
				content = content.replace(new RegExp('&lt;&gt;', 'g'), "");

			if (tinyMCE.settings['cleanup_on_startup'])
				tinyMCE.setInnerHTML(inst.getBody(), tinyMCE._cleanupHTML(inst, doc, this.settings, contentElement));
			else
				tinyMCE.setInnerHTML(inst.getBody(), content);

			tinyMCE.convertAllRelativeURLs(inst.getBody());
		} else {
			if (tinyMCE.settings['cleanup_on_startup']) {
				tinyMCE._setHTML(inst.getDoc(), content);

				// Produces permission denied error in MSIE 5.5
				eval('try {tinyMCE.setInnerHTML(inst.getBody(), tinyMCE._cleanupHTML(inst, inst.contentDocument, this.settings, inst.getBody()));} catch(e) {}');
			} else
				tinyMCE._setHTML(inst.getDoc(), content);
		}

		// Fix for bug #957681
		//inst.getDoc().designMode = inst.getDoc().designMode;

		// Setup element references
		var parentElm = inst.targetDoc.getElementById(inst.editorId + '_parent');
		inst.formElement = tinyMCE.isGecko ? parentElm.previousSibling : parentElm.nextSibling;

		tinyMCE.handleVisualAid(inst.getBody(), true, tinyMCE.settings['visual'], inst);
		tinyMCE.dispatchCallback(inst, 'setupcontent_callback', 'setupContent', editor_id, inst.getBody(), inst.getDoc());

		// Re-add design mode on mozilla
		if (!tinyMCE.isIE)
			tinyMCE.addEventHandlers(inst);

		// Add blur handler
		if (tinyMCE.isIE) {
			tinyMCE.addEvent(inst.getBody(), "blur", TinyMCE_Engine.prototype._eventPatch);
			tinyMCE.addEvent(inst.getBody(), "beforedeactivate", TinyMCE_Engine.prototype._eventPatch); // Bug #1439953

			// Workaround for drag drop/copy paste base href bug
			if (!tinyMCE.isOpera) {
				tinyMCE.addEvent(doc.body, "mousemove", TinyMCE_Engine.prototype.onMouseMove);
				tinyMCE.addEvent(doc.body, "beforepaste", TinyMCE_Engine.prototype._eventPatch);
				tinyMCE.addEvent(doc.body, "drop", TinyMCE_Engine.prototype._eventPatch);
			}
		}

		// Trigger node change, this call locks buttons for tables and so forth
		inst.select();
		tinyMCE.selectedElement = inst.contentWindow.document.body;

		// Call custom DOM cleanup
		tinyMCE._customCleanup(inst, "insert_to_editor_dom", inst.getBody());
		tinyMCE._customCleanup(inst, "setup_content_dom", inst.getBody());
		tinyMCE._setEventsEnabled(inst.getBody(), false);
		tinyMCE.cleanupAnchors(inst.getDoc());

		if (tinyMCE.getParam("convert_fonts_to_spans"))
			tinyMCE.convertSpansToFonts(inst.getDoc());

		inst.startContent = tinyMCE.trim(inst.getBody().innerHTML);
		inst.undoRedo.add({ content : inst.startContent });

		// Cleanup any mess left from storyAwayURLs
		if (tinyMCE.isGecko) {
			// Remove mce_src from textnodes and comments
			tinyMCE.selectNodes(inst.getBody(), function(n) {
				if (n.nodeType == 3 || n.nodeType == 8)
					n.nodeValue = n.nodeValue.replace(new RegExp('\\s(mce_src|mce_href)=\"[^\"]*\"', 'gi'), "");

				return false;
			});
		}

		// Remove Gecko spellchecking
		if (tinyMCE.isGecko)
			inst.getBody().spellcheck = tinyMCE.getParam("gecko_spellcheck");

		// Cleanup any mess left from storyAwayURLs
		tinyMCE._removeInternal(inst.getBody());

		inst.select();
		tinyMCE.triggerNodeChange(false, true);
	},

	storeAwayURLs : function(s) {
		// Remove all mce_src, mce_href and replace them with new ones
	//	s = s.replace(new RegExp('mce_src\\s*=\\s*\"[^ >\"]*\"', 'gi'), '');
	//	s = s.replace(new RegExp('mce_href\\s*=\\s*\"[^ >\"]*\"', 'gi'), '');

		if (!s.match(/(mce_src|mce_href)/gi, s)) {
			s = s.replace(new RegExp('src\\s*=\\s*\"([^ >\"]*)\"', 'gi'), 'src="$1" mce_src="$1"');
			s = s.replace(new RegExp('href\\s*=\\s*\"([^ >\"]*)\"', 'gi'), 'href="$1" mce_href="$1"');
		}

		return s;
	},

	_removeInternal : function(n) {
		if (tinyMCE.isGecko) {
			// Remove mce_src from textnodes and comments
			tinyMCE.selectNodes(n, function(n) {
				if (n.nodeType == 3 || n.nodeType == 8)
					n.nodeValue = n.nodeValue.replace(new RegExp('\\s(mce_src|mce_href)=\"[^\"]*\"', 'gi'), "");

				return false;
			});
		}
	},

	handleEvent : function(e) {
		var inst = tinyMCE.selectedInstance;

		// Remove odd, error
		if (typeof(tinyMCE) == "undefined")
			return true;

		//tinyMCE.debug(e.type + " " + e.target.nodeName + " " + (e.relatedTarget ? e.relatedTarget.nodeName : ""));

		if (tinyMCE.executeCallback(tinyMCE.selectedInstance, 'handle_event_callback', 'handleEvent', e))
			return false;

		switch (e.type) {
			case "beforedeactivate": // Was added due to bug #1439953
			case "blur":
				if (tinyMCE.selectedInstance)
					tinyMCE.selectedInstance.execCommand('mceEndTyping');

				tinyMCE.hideMenus();

				return;

			// Workaround for drag drop/copy paste base href bug
			case "drop":
			case "beforepaste":
				if (tinyMCE.selectedInstance)
					tinyMCE.selectedInstance.setBaseHREF(null);

				// Fixes odd MSIE bug where drag/droping elements in a iframe with height 100% breaks
				// This logic forces the width/height to be in pixels while the user is drag/dropping
				if (tinyMCE.isRealIE) {
					var ife = tinyMCE.selectedInstance.iframeElement;

					/*if (ife.style.width.indexOf('%') != -1) {
						ife._oldWidth = ife.width.height;
						ife.style.width = ife.clientWidth;
					}*/

					if (ife.style.height.indexOf('%') != -1) {
						ife._oldHeight = ife.style.height;
						ife.style.height = ife.clientHeight;
					}
				}

				window.setTimeout("tinyMCE.selectedInstance.setBaseHREF(tinyMCE.settings['base_href']);tinyMCE._resetIframeHeight();", 1);
				return;

			case "submit":
				tinyMCE.triggerSave();
				tinyMCE.isNotDirty = true;
				return;

			case "reset":
				var formObj = tinyMCE.isIE ? window.event.srcElement : e.target;

				for (var i=0; i<document.forms.length; i++) {
					if (document.forms[i] == formObj)
						window.setTimeout('tinyMCE.resetForm(' + i + ');', 10);
				}

				return;

			case "keypress":
				if (inst && inst.handleShortcut(e))
					return false;

				if (e.target.editorId) {
					tinyMCE.instances[e.target.editorId].select();
				} else {
					if (e.target.ownerDocument.editorId)
						tinyMCE.instances[e.target.ownerDocument.editorId].select();
				}

				if (tinyMCE.selectedInstance)
					tinyMCE.selectedInstance.switchSettings();

				// Insert P element
				if ((tinyMCE.isGecko || tinyMCE.isOpera || tinyMCE.isSafari) && tinyMCE.settings['force_p_newlines'] && e.keyCode == 13 && !e.shiftKey) {
					// Insert P element instead of BR
					if (TinyMCE_ForceParagraphs._insertPara(tinyMCE.selectedInstance, e)) {
						// Cancel event
						tinyMCE.execCommand("mceAddUndoLevel");
						return tinyMCE.cancelEvent(e);
					}
				}

				// Handle backspace
				if ((tinyMCE.isGecko && !tinyMCE.isSafari) && tinyMCE.settings['force_p_newlines'] && (e.keyCode == 8 || e.keyCode == 46) && !e.shiftKey) {
					// Insert P element instead of BR
					if (TinyMCE_ForceParagraphs._handleBackSpace(tinyMCE.selectedInstance, e.type)) {
						// Cancel event
						tinyMCE.execCommand("mceAddUndoLevel");
						return tinyMCE.cancelEvent(e);
					}
				}

				// Return key pressed
				if (tinyMCE.isIE && tinyMCE.settings['force_br_newlines'] && e.keyCode == 13) {
					if (e.target.editorId)
						tinyMCE.instances[e.target.editorId].select();

					if (tinyMCE.selectedInstance) {
						var sel = tinyMCE.selectedInstance.getDoc().selection;
						var rng = sel.createRange();

						if (tinyMCE.getParentElement(rng.parentElement(), "li") != null)
							return false;

						// Cancel event
						e.returnValue = false;
						e.cancelBubble = true;

						// Insert BR element
						rng.pasteHTML("<br />");
						rng.collapse(false);
						rng.select();

						tinyMCE.execCommand("mceAddUndoLevel");
						tinyMCE.triggerNodeChange(false);
						return false;
					}
				}

				// Backspace or delete
				if (e.keyCode == 8 || e.keyCode == 46) {
					tinyMCE.selectedElement = e.target;
					tinyMCE.linkElement = tinyMCE.getParentElement(e.target, "a");
					tinyMCE.imgElement = tinyMCE.getParentElement(e.target, "img");
					tinyMCE.triggerNodeChange(false);
				}

				return false;
			break;

			case "keyup":
			case "keydown":
				tinyMCE.hideMenus();
				tinyMCE.hasMouseMoved = false;

				if (inst && inst.handleShortcut(e))
					return false;

				if (e.target.editorId)
					tinyMCE.instances[e.target.editorId].select();

				if (tinyMCE.selectedInstance)
					tinyMCE.selectedInstance.switchSettings();

				var inst = tinyMCE.selectedInstance;

				// Handle backspace
				if (tinyMCE.isGecko && tinyMCE.settings['force_p_newlines'] && (e.keyCode == 8 || e.keyCode == 46) && !e.shiftKey) {
					// Insert P element instead of BR
					if (TinyMCE_ForceParagraphs._handleBackSpace(tinyMCE.selectedInstance, e.type)) {
						// Cancel event
						tinyMCE.execCommand("mceAddUndoLevel");
						e.preventDefault();
						return false;
					}
				}

				tinyMCE.selectedElement = null;
				tinyMCE.selectedNode = null;
				var elm = tinyMCE.selectedInstance.getFocusElement();
				tinyMCE.linkElement = tinyMCE.getParentElement(elm, "a");
				tinyMCE.imgElement = tinyMCE.getParentElement(elm, "img");
				tinyMCE.selectedElement = elm;

				// Update visualaids on tabs
				if (tinyMCE.isGecko && e.type == "keyup" && e.keyCode == 9)
					tinyMCE.handleVisualAid(tinyMCE.selectedInstance.getBody(), true, tinyMCE.settings['visual'], tinyMCE.selectedInstance);

				// Fix empty elements on return/enter, check where enter occured
				if (tinyMCE.isIE && e.type == "keydown" && e.keyCode == 13)
					tinyMCE.enterKeyElement = tinyMCE.selectedInstance.getFocusElement();

				// Fix empty elements on return/enter
				if (tinyMCE.isIE && e.type == "keyup" && e.keyCode == 13) {
					var elm = tinyMCE.enterKeyElement;
					if (elm) {
						var re = new RegExp('^HR|IMG|BR$','g'); // Skip these
						var dre = new RegExp('^H[1-6]$','g'); // Add double on these

						if (!elm.hasChildNodes() && !re.test(elm.nodeName)) {
							if (dre.test(elm.nodeName))
								elm.innerHTML = "&nbsp;&nbsp;";
							else
								elm.innerHTML = "&nbsp;";
						}
					}
				}

				// Check if it's a position key
				var keys = tinyMCE.posKeyCodes;
				var posKey = false;
				for (var i=0; i<keys.length; i++) {
					if (keys[i] == e.keyCode) {
						posKey = true;
						break;
					}
				}

				// MSIE custom key handling
				if (tinyMCE.isIE && tinyMCE.settings['custom_undo_redo']) {
					var keys = new Array(8,46); // Backspace,Delete

					for (var i=0; i<keys.length; i++) {
						if (keys[i] == e.keyCode) {
							if (e.type == "keyup")
								tinyMCE.triggerNodeChange(false);
						}
					}
				}

				// If Ctrl key
				if (e.keyCode == 17)
					return true;

				// Handle Undo/Redo when typing content

				if (tinyMCE.isGecko) {
					// Start typing (not a position key or ctrl key, but ctrl+x and ctrl+p is ok)
					if (!posKey && e.type == "keyup" && !e.ctrlKey || (e.ctrlKey && (e.keyCode == 86 || e.keyCode == 88)))
						tinyMCE.execCommand("mceStartTyping");
				} else {
					// IE seems to be working better with this setting
					if (!posKey && e.type == "keyup")
						tinyMCE.execCommand("mceStartTyping");
				}

				// Store undo bookmark
				if (e.type == "keydown" && (posKey || e.ctrlKey) && inst)
					inst.undoBookmark = inst.selection.getBookmark();

				// End typing (position key) or some Ctrl event
				if (e.type == "keyup" && (posKey || e.ctrlKey))
					tinyMCE.execCommand("mceEndTyping");

				if (posKey && e.type == "keyup")
					tinyMCE.triggerNodeChange(false);

				if (tinyMCE.isIE && e.ctrlKey)
					window.setTimeout('tinyMCE.triggerNodeChange(false);', 1);
			break;

			case "mousedown":
			case "mouseup":
			case "click":
			case "dblclick":
			case "focus":
				tinyMCE.hideMenus();

				if (tinyMCE.selectedInstance) {
					tinyMCE.selectedInstance.switchSettings();
					tinyMCE.selectedInstance.isFocused = true;
				}

				// Check instance event trigged on
				var targetBody = tinyMCE.getParentElement(e.target, "html");
				for (var instanceName in tinyMCE.instances) {
					if (!tinyMCE.isInstance(tinyMCE.instances[instanceName]))
						continue;

					var inst = tinyMCE.instances[instanceName];

					// Reset design mode if lost (on everything just in case)
					inst.autoResetDesignMode();

					// Use HTML element since users might click outside of body element
					if (inst.getBody().parentNode == targetBody) {
						inst.select();
						tinyMCE.selectedElement = e.target;
						tinyMCE.linkElement = tinyMCE.getParentElement(tinyMCE.selectedElement, "a");
						tinyMCE.imgElement = tinyMCE.getParentElement(tinyMCE.selectedElement, "img");
						break;
					}
				}

				// Add first bookmark location
				if (!tinyMCE.selectedInstance.undoRedo.undoLevels[0].bookmark && (e.type == "mouseup" || e.type == "dblclick"))
					tinyMCE.selectedInstance.undoRedo.undoLevels[0].bookmark = tinyMCE.selectedInstance.selection.getBookmark();

				// Reset selected node
				if (e.type != "focus")
					tinyMCE.selectedNode = null;

				tinyMCE.triggerNodeChange(false);
				tinyMCE.execCommand("mceEndTyping");

				if (e.type == "mouseup")
					tinyMCE.execCommand("mceAddUndoLevel");

				// Just in case
				if (!tinyMCE.selectedInstance && e.target.editorId)
					tinyMCE.instances[e.target.editorId].select();

				return false;
			break;
		}
	},

	getButtonHTML : function(id, lang, img, cmd, ui, val) {
		var h = '', m, x, io = '';

		cmd = 'tinyMCE.execInstanceCommand(\'{$editor_id}\',\'' + cmd + '\'';

		if (typeof(ui) != "undefined" && ui != null)
			cmd += ',' + ui;

		if (typeof(val) != "undefined" && val != null)
			cmd += ",'" + val + "'";

		cmd += ');';

		// Patch for IE7 bug with hover out not restoring correctly
		if (tinyMCE.isRealIE)
			io = 'onmouseover="tinyMCE.lastHover = this;"';

		// Use tilemaps when enabled and found and never in MSIE since it loads the tile each time from cache if cahce is disabled
		if (tinyMCE.getParam('button_tile_map') && (!tinyMCE.isIE || tinyMCE.isOpera) && (m = this.buttonMap[id]) != null && (tinyMCE.getParam("language") == "en" || img.indexOf('$lang') == -1)) {
			// Tiled button
			x = 0 - (m * 20) == 0 ? '0' : 0 - (m * 20);
			h += '<a id="{$editor_id}_' + id + '" href="javascript:' + cmd + '" onclick="' + cmd + 'return false;" onmousedown="return false;" ' + io + ' class="mceTiledButton mceButtonNormal" target="_self">';
			h += '<img src="{$themeurl}/images/spacer.gif" style="background-position: ' + x + 'px 0" title="{$' + lang + '}" />';
			h += '</a>';
		} else {
			// Normal button
			h += '<a id="{$editor_id}_' + id + '" href="javascript:' + cmd + '" onclick="' + cmd + 'return false;" onmousedown="return false;" ' + io + ' class="mceButtonNormal" target="_self">';
			h += '<img src="' + img + '" title="{$' + lang + '}" />';
			h += '</a>';
		}

		return h;
	},

	getMenuButtonHTML : function(id, lang, img, mcmd, cmd, ui, val) {
		var h = '', m, x;

		mcmd = 'tinyMCE.execInstanceCommand(\'{$editor_id}\',\'' + mcmd + '\');';
		cmd = 'tinyMCE.execInstanceCommand(\'{$editor_id}\',\'' + cmd + '\'';

		if (typeof(ui) != "undefined" && ui != null)
			cmd += ',' + ui;

		if (typeof(val) != "undefined" && val != null)
			cmd += ",'" + val + "'";

		cmd += ');';

		// Use tilemaps when enabled and found and never in MSIE since it loads the tile each time from cache if cahce is disabled
		if (tinyMCE.getParam('button_tile_map') && (!tinyMCE.isIE || tinyMCE.isOpera) && (m = tinyMCE.buttonMap[id]) != null && (tinyMCE.getParam("language") == "en" || img.indexOf('$lang') == -1)) {
			x = 0 - (m * 20) == 0 ? '0' : 0 - (m * 20);

			if (tinyMCE.isRealIE)
				h += '<span id="{$editor_id}_' + id + '" class="mceMenuButton" onmouseover="tinyMCE._menuButtonEvent(\'over\',this);tinyMCE.lastHover = this;" onmouseout="tinyMCE._menuButtonEvent(\'out\',this);">';
			else
				h += '<span id="{$editor_id}_' + id + '" class="mceMenuButton">';

			h += '<a href="javascript:' + cmd + '" onclick="' + cmd + 'return false;" onmousedown="return false;" class="mceTiledButton mceMenuButtonNormal" target="_self">';
			h += '<img src="{$themeurl}/images/spacer.gif" style="width: 20px; height: 20px; background-position: ' + x + 'px 0" title="{$' + lang + '}" /></a>';
			h += '<a href="javascript:' + mcmd + '" onclick="' + mcmd + 'return false;" onmousedown="return false;"><img src="{$themeurl}/images/button_menu.gif" title="{$' + lang + '}" class="mceMenuButton" />';
			h += '</a></span>';
		} else {
			if (tinyMCE.isRealIE)
				h += '<span id="{$editor_id}_' + id + '" class="mceMenuButton" onmouseover="tinyMCE._menuButtonEvent(\'over\',this);tinyMCE.lastHover = this;" onmouseout="tinyMCE._menuButtonEvent(\'out\',this);">';
			else
				h += '<span id="{$editor_id}_' + id + '" class="mceMenuButton">';

			h += '<a href="javascript:' + cmd + '" onclick="' + cmd + 'return false;" onmousedown="return false;" class="mceMenuButtonNormal" target="_self">';
			h += '<img src="' + img + '" title="{$' + lang + '}" /></a>';
			h += '<a href="javascript:' + mcmd + '" onclick="' + mcmd + 'return false;" onmousedown="return false;"><img src="{$themeurl}/images/button_menu.gif" title="{$' + lang + '}" class="mceMenuButton" />';
			h += '</a></span>';
		}

		return h;
	},

	_menuButtonEvent : function(e, o) {
		if (o.className == 'mceMenuButtonFocus')
			return;

		if (e == 'over')
			o.className = o.className + ' mceMenuHover';
		else
			o.className = o.className.replace(/\s.*$/, '');
	},

	addButtonMap : function(m) {
		var i, a = m.replace(/\s+/, '').split(',');

		for (i=0; i<a.length; i++)
			this.buttonMap[a[i]] = i;
	},

	submitPatch : function() {
		tinyMCE.triggerSave();
		tinyMCE.isNotDirty = true;
		this.mceOldSubmit();
	},

	onLoad : function() {
		var r;

		// Wait for everything to be loaded first
		if (tinyMCE.settings.strict_loading_mode && this.loadingIndex != -1) {
			window.setTimeout('tinyMCE.onLoad();', 1);
			return;
		}

		if (tinyMCE.isRealIE && window.event.type == "readystatechange" && document.readyState != "complete")
			return true;

		if (tinyMCE.isLoaded)
			return true;

		tinyMCE.isLoaded = true;

		// IE produces JS error if TinyMCE is placed in a frame
		// It seems to have something to do with the selection not beeing
		// correctly initialized in IE so this hack solves the problem
		if (tinyMCE.isRealIE && document.body) {
			r = document.body.createTextRange();
			r.collapse(true);
			r.select();
		}

		tinyMCE.dispatchCallback(null, 'onpageload', 'onPageLoad');

		for (var c=0; c<tinyMCE.configs.length; c++) {
			tinyMCE.settings = tinyMCE.configs[c];

			var selector = tinyMCE.getParam("editor_selector");
			var deselector = tinyMCE.getParam("editor_deselector");
			var elementRefAr = new Array();

			// Add submit triggers
			if (document.forms && tinyMCE.settings['add_form_submit_trigger'] && !tinyMCE.submitTriggers) {
				for (var i=0; i<document.forms.length; i++) {
					var form = document.forms[i];

					tinyMCE.addEvent(form, "submit", TinyMCE_Engine.prototype.handleEvent);
					tinyMCE.addEvent(form, "reset", TinyMCE_Engine.prototype.handleEvent);
					tinyMCE.submitTriggers = true; // Do it only once

					// Patch the form.submit function
					if (tinyMCE.settings['submit_patch']) {
						try {
							form.mceOldSubmit = form.submit;
							form.submit = TinyMCE_Engine.prototype.submitPatch;
						} catch (e) {
							// Do nothing
						}
					}
				}
			}

			// Add editor instances based on mode
			var mode = tinyMCE.settings['mode'];
			switch (mode) {
				case "exact":
					var elements = tinyMCE.getParam('elements', '', true, ',');

					for (var i=0; i<elements.length; i++) {
						var element = tinyMCE._getElementById(elements[i]);
						var trigger = element ? element.getAttribute(tinyMCE.settings['textarea_trigger']) : "";

						if (new RegExp('\\b' + deselector + '\\b').test(tinyMCE.getAttrib(element, "class")))
							continue;

						if (trigger == "false")
							continue;

						if ((tinyMCE.settings['ask'] || tinyMCE.settings['convert_on_click']) && element) {
							elementRefAr[elementRefAr.length] = element;
							continue;
						}

						if (element)
							tinyMCE.addMCEControl(element, elements[i]);
						else if (tinyMCE.settings['debug'])
							alert("Error: Could not find element by id or name: " + elements[i]);
					}
				break;

				case "specific_textareas":
				case "textareas":
					var nodeList = document.getElementsByTagName("textarea");

					for (var i=0; i<nodeList.length; i++) {
						var elm = nodeList.item(i);
						var trigger = elm.getAttribute(tinyMCE.settings['textarea_trigger']);

						if (selector != '' && !new RegExp('\\b' + selector + '\\b').test(tinyMCE.getAttrib(elm, "class")))
							continue;

						if (selector != '')
							trigger = selector != "" ? "true" : "";

						if (new RegExp('\\b' + deselector + '\\b').test(tinyMCE.getAttrib(elm, "class")))
							continue;

						if ((mode == "specific_textareas" && trigger == "true") || (mode == "textareas" && trigger != "false"))
							elementRefAr[elementRefAr.length] = elm;
					}
				break;
			}

			for (var i=0; i<elementRefAr.length; i++) {
				var element = elementRefAr[i];
				var elementId = element.name ? element.name : element.id;

				if (tinyMCE.settings['ask'] || tinyMCE.settings['convert_on_click']) {
					// Focus breaks in Mozilla
					if (tinyMCE.isGecko) {
						var settings = tinyMCE.settings;

						tinyMCE.addEvent(element, "focus", function (e) {window.setTimeout(function() {TinyMCE_Engine.prototype.confirmAdd(e, settings);}, 10);});

						if (element.nodeName != "TEXTAREA" && element.nodeName != "INPUT")
							tinyMCE.addEvent(element, "click", function (e) {window.setTimeout(function() {TinyMCE_Engine.prototype.confirmAdd(e, settings);}, 10);});
						// tinyMCE.addEvent(element, "mouseover", function (e) {window.setTimeout(function() {TinyMCE_Engine.prototype.confirmAdd(e, settings);}, 10);});
					} else {
						var settings = tinyMCE.settings;

						tinyMCE.addEvent(element, "focus", function () { TinyMCE_Engine.prototype.confirmAdd(null, settings); });
						tinyMCE.addEvent(element, "click", function () { TinyMCE_Engine.prototype.confirmAdd(null, settings); });
						// tinyMCE.addEvent(element, "mouseenter", function () { TinyMCE_Engine.prototype.confirmAdd(null, settings); });
					}
				} else
					tinyMCE.addMCEControl(element, elementId);
			}

			// Handle auto focus
			if (tinyMCE.settings['auto_focus']) {
				window.setTimeout(function () {
					var inst = tinyMCE.getInstanceById(tinyMCE.settings['auto_focus']);
					inst.selection.selectNode(inst.getBody(), true, true);
					inst.contentWindow.focus();
				}, 100);
			}

			tinyMCE.dispatchCallback(null, 'oninit', 'onInit');
		}
	},

	isInstance : function(o) {
		return o != null && typeof(o) == "object" && o.isTinyMCE_Control;
	},

	getParam : function(name, default_value, strip_whitespace, split_chr) {
		var value = (typeof(this.settings[name]) == "undefined") ? default_value : this.settings[name];

		// Fix bool values
		if (value == "true" || value == "false")
			return (value == "true");

		if (strip_whitespace)
			value = tinyMCE.regexpReplace(value, "[ \t\r\n]", "");

		if (typeof(split_chr) != "undefined" && split_chr != null) {
			value = value.split(split_chr);
			var outArray = new Array();

			for (var i=0; i<value.length; i++) {
				if (value[i] && value[i] != "")
					outArray[outArray.length] = value[i];
			}

			value = outArray;
		}

		return value;
	},

	getLang : function(name, default_value, parse_entities, va) {
		var v = (typeof(tinyMCELang[name]) == "undefined") ? default_value : tinyMCELang[name], n;

		if (parse_entities)
			v = tinyMCE.entityDecode(v);

		if (va) {
			for (n in va)
				v = this.replaceVar(v, n, va[n]);
		}

		return v;
	},

	entityDecode : function(s) {
		var e = document.createElement("div");

		e.innerHTML = s;

		return e.firstChild.nodeValue;
	},

	addToLang : function(prefix, ar) {
		for (var key in ar) {
			if (typeof(ar[key]) == 'function')
				continue;

			tinyMCELang[(key.indexOf('lang_') == -1 ? 'lang_' : '') + (prefix != '' ? (prefix + "_") : '') + key] = ar[key];
		}

		this.loadNextScript();

	//	for (var key in ar)
	//		tinyMCELang[(key.indexOf('lang_') == -1 ? 'lang_' : '') + (prefix != '' ? (prefix + "_") : '') + key] = "|" + ar[key] + "|";
	},

	triggerNodeChange : function(focus, setup_content) {
		if (tinyMCE.selectedInstance) {
			var inst = tinyMCE.selectedInstance;
			var editorId = inst.editorId;
			var elm = (typeof(setup_content) != "undefined" && setup_content) ? tinyMCE.selectedElement : inst.getFocusElement();
			var undoIndex = -1, doc;
			var undoLevels = -1;
			var anySelection = false;
			var selectedText = inst.selection.getSelectedText();

			if (tinyMCE.settings.auto_resize)
				inst.resizeToContent();

			if (setup_content && tinyMCE.isGecko && inst.isHidden())
				elm = inst.getBody();

			inst.switchSettings();

			if (tinyMCE.selectedElement)
				anySelection = (tinyMCE.selectedElement.nodeName.toLowerCase() == "img") || (selectedText && selectedText.length > 0);

			if (tinyMCE.settings['custom_undo_redo']) {
				undoIndex = inst.undoRedo.undoIndex;
				undoLevels = inst.undoRedo.undoLevels.length;
			}

			tinyMCE.dispatchCallback(inst, 'handle_node_change_callback', 'handleNodeChange', editorId, elm, undoIndex, undoLevels, inst.visualAid, anySelection, setup_content);
		}

		if (this.selectedInstance && (typeof(focus) == "undefined" || focus))
			this.selectedInstance.contentWindow.focus();
	},

	_customCleanup : function(inst, type, content) {
		var pl, po, i;

		// Call custom cleanup
		var customCleanup = tinyMCE.settings['cleanup_callback'];
		if (customCleanup != "" && eval("typeof(" + customCleanup + ")") != "undefined")
			content = eval(customCleanup + "(type, content, inst);");

		// Trigger theme cleanup
		po = tinyMCE.themes[tinyMCE.settings['theme']];
		if (po && po.cleanup)
			content = po.cleanup(type, content, inst);

		// Trigger plugin cleanups
		pl = inst.plugins;
		for (i=0; i<pl.length; i++) {
			po = tinyMCE.plugins[pl[i]];

			if (po && po.cleanup)
				content = po.cleanup(type, content, inst);
		}

		return content;
	},

	setContent : function(h) {
		if (tinyMCE.selectedInstance) {
			tinyMCE.selectedInstance.execCommand('mceSetContent', false, h);
			tinyMCE.selectedInstance.repaint();
		}
	},

	importThemeLanguagePack : function(name) {
		if (typeof(name) == "undefined")
			name = tinyMCE.settings['theme'];

		tinyMCE.loadScript(tinyMCE.baseURL + '/themes/' + name + '/langs/' + tinyMCE.settings['language'] + '.js');
	},

	importPluginLanguagePack : function(name) {
		var b = tinyMCE.baseURL + '/plugins/' + name;

		if (this.plugins[name])
			b = this.plugins[name].baseURL;

		tinyMCE.loadScript(b + '/langs/' + tinyMCE.settings['language'] +  '.js');
	},

	applyTemplate : function(h, as) {
		return h.replace(new RegExp('\\{\\$([a-z0-9_]+)\\}', 'gi'), function(m, s) {
			if (s.indexOf('lang_') == 0 && tinyMCELang[s])
				return tinyMCELang[s];

			if (as && as[s])
				return as[s];

			if (tinyMCE.settings[s])
				return tinyMCE.settings[s];

			if (m == 'themeurl')
				return tinyMCE.themeURL;

			return m;
		});
	},

	replaceVar : function(h, r, v) {
		return h.replace(new RegExp('{\\\$' + r + '}', 'g'), v);
	},

	openWindow : function(template, args) {
		var html, width, height, x, y, resizable, scrollbars, url;

		args['mce_template_file'] = template['file'];
		args['mce_width'] = template['width'];
		args['mce_height'] = template['height'];
		tinyMCE.windowArgs = args;

		html = template['html'];
		if (!(width = parseInt(template['width'])))
			width = 320;

		if (!(height = parseInt(template['height'])))
			height = 200;

		// Add to height in M$ due to SP2 WHY DON'T YOU GUYS IMPLEMENT innerWidth of windows!!
		if (tinyMCE.isIE)
			height += 40;
		else
			height += 20;

		x = parseInt(screen.width / 2.0) - (width / 2.0);
		y = parseInt(screen.height / 2.0) - (height / 2.0);

		resizable = (args && args['resizable']) ? args['resizable'] : "no";
		scrollbars = (args && args['scrollbars']) ? args['scrollbars'] : "no";

		if (template['file'].charAt(0) != '/' && template['file'].indexOf('://') == -1)
			url = tinyMCE.baseURL + "/themes/" + tinyMCE.getParam("theme") + "/" + template['file'];
		else
			url = template['file'];

		// Replace all args as variables in URL
		for (var name in args) {
			if (typeof(args[name]) == 'function')
				continue;

			url = tinyMCE.replaceVar(url, name, escape(args[name]));
		}

		if (html) {
			html = tinyMCE.replaceVar(html, "css", this.settings['popups_css']);
			html = tinyMCE.applyTemplate(html, args);

			var win = window.open("", "mcePopup" + new Date().getTime(), "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=yes,minimizable=" + resizable + ",modal=yes,width=" + width + ",height=" + height + ",resizable=" + resizable);
			if (win == null) {
				alert(tinyMCELang['lang_popup_blocked']);
				return;
			}

			win.document.write(html);
			win.document.close();
			win.resizeTo(width, height);
			win.focus();
		} else {
			if ((tinyMCE.isRealIE) && resizable != 'yes' && tinyMCE.settings["dialog_type"] == "modal") {
				height += 10;

				var features = "resizable:" + resizable 
					+ ";scroll:"
					+ scrollbars + ";status:yes;center:yes;help:no;dialogWidth:"
					+ width + "px;dialogHeight:" + height + "px;";

				window.showModalDialog(url, window, features);
			} else {
				var modal = (resizable == "yes") ? "no" : "yes";

				if (tinyMCE.isGecko && tinyMCE.isMac)
					modal = "no";

				if (template['close_previous'] != "no")
					try {tinyMCE.lastWindow.close();} catch (ex) {}

				var win = window.open(url, "mcePopup" + new Date().getTime(), "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=" + modal + ",minimizable=" + resizable + ",modal=" + modal + ",width=" + width + ",height=" + height + ",resizable=" + resizable);
				if (win == null) {
					alert(tinyMCELang['lang_popup_blocked']);
					return;
				}

				if (template['close_previous'] != "no")
					tinyMCE.lastWindow = win;

				eval('try { win.resizeTo(width, height); } catch(e) { }');

				// Make it bigger if statusbar is forced
				if (tinyMCE.isGecko) {
					if (win.document.defaultView.statusbar.visible)
						win.resizeBy(0, tinyMCE.isMac ? 10 : 24);
				}

				win.focus();
			}
		}
	},

	closeWindow : function(win) {
		win.close();
	},

	getVisualAidClass : function(class_name, state) {
		var aidClass = tinyMCE.settings['visual_table_class'];

		if (typeof(state) == "undefined")
			state = tinyMCE.settings['visual'];

		// Split
		var classNames = new Array();
		var ar = class_name.split(' ');
		for (var i=0; i<ar.length; i++) {
			if (ar[i] == aidClass)
				ar[i] = "";

			if (ar[i] != "")
				classNames[classNames.length] = ar[i];
		}

		if (state)
			classNames[classNames.length] = aidClass;

		// Glue
		var className = "";
		for (var i=0; i<classNames.length; i++) {
			if (i > 0)
				className += " ";

			className += classNames[i];
		}

		return className;
	},

	handleVisualAid : function(el, deep, state, inst, skip_dispatch) {
		if (!el)
			return;

		if (!skip_dispatch)
			tinyMCE.dispatchCallback(inst, 'handle_visual_aid_callback', 'handleVisualAid', el, deep, state, inst);

		var tableElement = null;

		switch (el.nodeName) {
			case "TABLE":
				var oldW = el.style.width;
				var oldH = el.style.height;
				var bo = tinyMCE.getAttrib(el, "border");

				bo = bo == "" || bo == "0" ? true : false;

				tinyMCE.setAttrib(el, "class", tinyMCE.getVisualAidClass(tinyMCE.getAttrib(el, "class"), state && bo));

				el.style.width = oldW;
				el.style.height = oldH;

				for (var y=0; y<el.rows.length; y++) {
					for (var x=0; x<el.rows[y].cells.length; x++) {
						var cn = tinyMCE.getVisualAidClass(tinyMCE.getAttrib(el.rows[y].cells[x], "class"), state && bo);
						tinyMCE.setAttrib(el.rows[y].cells[x], "class", cn);
					}
				}

				break;

			case "A":
				var anchorName = tinyMCE.getAttrib(el, "name");

				if (anchorName != '' && state) {
					el.title = anchorName;
					tinyMCE.addCSSClass(el, 'mceItemAnchor');
				} else if (anchorName != '' && !state)
					el.className = '';

				break;
		}

		if (deep && el.hasChildNodes()) {
			for (var i=0; i<el.childNodes.length; i++)
				tinyMCE.handleVisualAid(el.childNodes[i], deep, state, inst, true);
		}
	},

	/*
	applyClassesToFonts : function(doc, size) {
		var f = doc.getElementsByTagName("font");
		for (var i=0; i<f.length; i++) {
			var s = tinyMCE.getAttrib(f[i], "size");

			if (s != "")
				tinyMCE.setAttrib(f[i], 'class', "mceItemFont" + s);
		}

		if (typeof(size) != "undefined") {
			var css = "";

			for (var x=0; x<doc.styleSheets.length; x++) {
				for (var i=0; i<doc.styleSheets[x].rules.length; i++) {
					if (doc.styleSheets[x].rules[i].selectorText == '#mceSpanFonts .mceItemFont' + size) {
						css = doc.styleSheets[x].rules[i].style.cssText;
						break;
					}
				}

				if (css != "")
					break;
			}

			if (doc.styleSheets[0].rules[0].selectorText == "FONT")
				doc.styleSheets[0].removeRule(0);

			doc.styleSheets[0].addRule("FONT", css, 0);
		}
	},
	*/

	fixGeckoBaseHREFBug : function(m, e, h) {
		var xsrc, xhref;

		if (tinyMCE.isGecko) {
			if (m == 1) {
				h = h.replace(/\ssrc=/gi, " mce_tsrc=");
				h = h.replace(/\shref=/gi, " mce_thref=");

				return h;
			} else {
				// Why bother if there is no src or href broken
				if (!new RegExp('(src|href)=', 'g').test(h))
					return h;

				// Restore src and href that gets messed up by Gecko
				tinyMCE.selectElements(e, 'A,IMG,SELECT,AREA,IFRAME,BASE,INPUT,SCRIPT,EMBED,OBJECT,LINK', function (n) {
					xsrc = tinyMCE.getAttrib(n, "mce_tsrc");
					xhref = tinyMCE.getAttrib(n, "mce_thref");

					if (xsrc != "") {
						try {
							n.src = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], xsrc);
						} catch (e) {
							// Ignore, Firefox cast exception if local file wasn't found
						}

						n.removeAttribute("mce_tsrc");
					}

					if (xhref != "") {
						try {
							n.href = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], xhref);
						} catch (e) {
							// Ignore, Firefox cast exception if local file wasn't found
						}

						n.removeAttribute("mce_thref");
					}

					return false;
				});

				// Restore text/comment nodes
				tinyMCE.selectNodes(e, function(n) {
					if (n.nodeType == 3 || n.nodeType == 8) {
						n.nodeValue = n.nodeValue.replace(/\smce_tsrc=/gi, " src=");
						n.nodeValue = n.nodeValue.replace(/\smce_thref=/gi, " href=");
					}

					return false;
				});
			}
		}

		return h;
	},

	_setHTML : function(doc, html_content) {
		// Force closed anchors open
		//html_content = html_content.replace(new RegExp('<a(.*?)/>', 'gi'), '<a$1></a>');

		html_content = tinyMCE.cleanupHTMLCode(html_content);

		// Try innerHTML if it fails use pasteHTML in MSIE
		try {
			tinyMCE.setInnerHTML(doc.body, html_content);
		} catch (e) {
			if (this.isMSIE)
				doc.body.createTextRange().pasteHTML(html_content);
		}

		// Content duplication bug fix
		if (tinyMCE.isIE && tinyMCE.settings['fix_content_duplication']) {
			// Remove P elements in P elements
			var paras = doc.getElementsByTagName("P");
			for (var i=0; i<paras.length; i++) {
				var node = paras[i];
				while ((node = node.parentNode) != null) {
					if (node.nodeName == "P")
						node.outerHTML = node.innerHTML;
				}
			}

			// Content duplication bug fix (Seems to be word crap)
			var html = doc.body.innerHTML;
/*
			if (html.indexOf('="mso') != -1) {
				for (var i=0; i<doc.body.all.length; i++) {
					var el = doc.body.all[i];
					el.removeAttribute("className","",0);
					el.removeAttribute("style","",0);
				}

				html = doc.body.innerHTML;
				html = tinyMCE.regexpReplace(html, "<o:p><\/o:p>", "<br />");
				html = tinyMCE.regexpReplace(html, "<o:p>&nbsp;<\/o:p>", "");
				html = tinyMCE.regexpReplace(html, "<st1:.*?>", "");
				html = tinyMCE.regexpReplace(html, "<p><\/p>", "");
				html = tinyMCE.regexpReplace(html, "<p><\/p>\r\n<p><\/p>", "");
				html = tinyMCE.regexpReplace(html, "<p>&nbsp;<\/p>", "<br />");
				html = tinyMCE.regexpReplace(html, "<p>\s*(<p>\s*)?", "<p>");
				html = tinyMCE.regexpReplace(html, "<\/p>\s*(<\/p>\s*)?", "</p>");
			}*/

			// Always set the htmlText output
			tinyMCE.setInnerHTML(doc.body, html);
		}

		tinyMCE.cleanupAnchors(doc);

		if (tinyMCE.getParam("convert_fonts_to_spans"))
			tinyMCE.convertSpansToFonts(doc);
	},

	getEditorId : function(form_element) {
		var inst = this.getInstanceById(form_element);
		if (!inst)
			return null;

		return inst.editorId;
	},

	getInstanceById : function(editor_id) {
		var inst = this.instances[editor_id];
		if (!inst) {
			for (var n in tinyMCE.instances) {
				var instance = tinyMCE.instances[n];
				if (!tinyMCE.isInstance(instance))
					continue;

				if (instance.formTargetElementId == editor_id) {
					inst = instance;
					break;
				}
			}
		}

		return inst;
	},

	queryInstanceCommandValue : function(editor_id, command) {
		var inst = tinyMCE.getInstanceById(editor_id);
		if (inst)
			return inst.queryCommandValue(command);

		return false;
	},

	queryInstanceCommandState : function(editor_id, command) {
		var inst = tinyMCE.getInstanceById(editor_id);
		if (inst)
			return inst.queryCommandState(command);

		return null;
	},

	setWindowArg : function(n, v) {
		this.windowArgs[n] = v;
	},

	getWindowArg : function(n, d) {
		return (typeof(this.windowArgs[n]) == "undefined") ? d : this.windowArgs[n];
	},

	getCSSClasses : function(editor_id, doc) {
		var output = new Array();

		// Is cached, use that
		if (typeof(tinyMCE.cssClasses) != "undefined")
			return tinyMCE.cssClasses;

		if (typeof(editor_id) == "undefined" && typeof(doc) == "undefined") {
			var instance;

			for (var instanceName in tinyMCE.instances) {
				instance = tinyMCE.instances[instanceName];
				if (!tinyMCE.isInstance(instance))
					continue;

				break;
			}

			doc = instance.getDoc();
		}

		if (typeof(doc) == "undefined") {
			var instance = tinyMCE.getInstanceById(editor_id);
			doc = instance.getDoc();
		}

		if (doc) {
			var styles = doc.styleSheets;

			if (styles && styles.length > 0) {
				for (var x=0; x<styles.length; x++) {
					var csses = null;

					// Just ignore any errors
					eval("try {var csses = tinyMCE.isIE ? doc.styleSheets(" + x + ").rules : styles[" + x + "].cssRules;} catch(e) {}");
					if (!csses)
						return new Array();

					for (var i=0; i<csses.length; i++) {
						var selectorText = csses[i].selectorText;

						// Can be multiple rules per selector
						if (selectorText) {
							var rules = selectorText.split(',');
							for (var c=0; c<rules.length; c++) {
								var rule = rules[c];

								// Strip spaces between selectors
								while (rule.indexOf(' ') == 0)
									rule = rule.substring(1);

								// Invalid rule
								if (rule.indexOf(' ') != -1 || rule.indexOf(':') != -1 || rule.indexOf('mceItem') != -1)
									continue;

								if (rule.indexOf(tinyMCE.settings['visual_table_class']) != -1 || rule.indexOf('mceEditable') != -1 || rule.indexOf('mceNonEditable') != -1)
									continue;

								// Is class rule
								if (rule.indexOf('.') != -1) {
									var cssClass = rule.substring(rule.indexOf('.') + 1);
									var addClass = true;

									for (var p=0; p<output.length && addClass; p++) {
										if (output[p] == cssClass)
											addClass = false;
									}

									if (addClass)
										output[output.length] = cssClass;
								}
							}
						}
					}
				}
			}
		}

		// Cache em
		if (output.length > 0)
			tinyMCE.cssClasses = output;

		return output;
	},

	regexpReplace : function(in_str, reg_exp, replace_str, opts) {
		if (in_str == null)
			return in_str;

		if (typeof(opts) == "undefined")
			opts = 'g';

		var re = new RegExp(reg_exp, opts);
		return in_str.replace(re, replace_str);
	},

	trim : function(s) {
		return s.replace(/^\s*|\s*$/g, "");
	},

	cleanupEventStr : function(s) {
		s = "" + s;
		s = s.replace('function anonymous()\n{\n', '');
		s = s.replace('\n}', '');
		s = s.replace(/^return true;/gi, ''); // Remove event blocker

		return s;
	},

	getControlHTML : function(c) {
		var i, l, n, o, v;

		l = tinyMCE.plugins;
		for (n in l) {
			o = l[n];

			if (o.getControlHTML && (v = o.getControlHTML(c)) != '')
				return tinyMCE.replaceVar(v, "pluginurl", o.baseURL);
		}

		o = tinyMCE.themes[tinyMCE.settings['theme']];
		if (o.getControlHTML && (v = o.getControlHTML(c)) != '')
			return v;

		return '';
	},

	evalFunc : function(f, idx, a, o) {
		var s = '(', i;

		for (i=idx; i<a.length; i++) {
			s += 'a[' + i + ']';

			if (i < a.length-1)
				s += ',';
		}

		s += ');';

		return o ? eval("o." + f + s) : eval("f" + s);
	},

	dispatchCallback : function(i, p, n) {
		return this.callFunc(i, p, n, 0, this.dispatchCallback.arguments);
	},

	executeCallback : function(i, p, n) {
		return this.callFunc(i, p, n, 1, this.executeCallback.arguments);
	},

	execCommandCallback : function(i, p, n) {
		return this.callFunc(i, p, n, 2, this.execCommandCallback.arguments);
	},

	callFunc : function(ins, p, n, m, a) {
		var l, i, on, o, s, v;

		s = m == 2;

		l = tinyMCE.getParam(p, '');

		if (l != '' && (v = tinyMCE.evalFunc(typeof(l) == "function" ? l : eval(l), 3, a)) == s && m > 0)
			return true;

		if (ins != null) {
			for (i=0, l = ins.plugins; i<l.length; i++) {
				o = tinyMCE.plugins[l[i]];

				if (o[n] && (v = tinyMCE.evalFunc(n, 3, a, o)) == s && m > 0)
					return true;
			}
		}

		l = tinyMCE.themes;
		for (on in l) {
			o = l[on];

			if (o[n] && (v = tinyMCE.evalFunc(n, 3, a, o)) == s && m > 0)
				return true;
		}

		return false;
	},

	xmlEncode : function(s) {
		return s ? ('' + s).replace(new RegExp('[<>&"\']', 'g'), function (c, b) {
			switch (c) {
				case '&':
					return '&amp;';

				case '"':
					return '&quot;';

				case '\'':
					return '&#39;'; // &apos; is not working in MSIE

				case '<':
					return '&lt;';

				case '>':
					return '&gt;';
			}

			return c;
		}) : s;
	},

	extend : function(p, np) {
		var o = {};

		o.parent = p;

		for (n in p)
			o[n] = p[n];

		for (n in np)
			o[n] = np[n];

		return o;
	},

	hideMenus : function() {
		var e = tinyMCE.lastSelectedMenuBtn;

		if (tinyMCE.lastMenu) {
			tinyMCE.lastMenu.hide();
			tinyMCE.lastMenu = null;
		}

		if (e) {
			tinyMCE.switchClass(e, tinyMCE.lastMenuBtnClass);
			tinyMCE.lastSelectedMenuBtn = null;
		}
	}

	};

// Global instances
var TinyMCE = TinyMCE_Engine; // Compatiblity with gzip compressors
var tinyMCE = new TinyMCE_Engine();
var tinyMCELang = {};

/* file:jscripts/tiny_mce/classes/TinyMCE_Control.class.js */

function TinyMCE_Control(settings) {
	var t, i, to, fu, p, x, fn, fu, pn, s = settings;

	this.undoRedoLevel = true;
	this.isTinyMCE_Control = true;

	// Default settings
	this.settings = s;
	this.settings['theme'] = tinyMCE.getParam("theme", "default");
	this.settings['width'] = tinyMCE.getParam("width", -1);
	this.settings['height'] = tinyMCE.getParam("height", -1);
	this.selection = new TinyMCE_Selection(this);
	this.undoRedo = new TinyMCE_UndoRedo(this);
	this.cleanup = new TinyMCE_Cleanup();
	this.shortcuts = new Array();
	this.hasMouseMoved = false;
	this.foreColor = this.backColor = "#999999";
	this.data = {};

	this.cleanup.init({
		valid_elements : s.valid_elements,
		extended_valid_elements : s.extended_valid_elements,
		valid_child_elements : s.valid_child_elements,
		entities : s.entities,
		entity_encoding : s.entity_encoding,
		debug : s.cleanup_debug,
		url_converter : 'TinyMCE_Cleanup.prototype._urlConverter',
		indent : s.apply_source_formatting,
		invalid_elements : s.invalid_elements,
		verify_html : s.verify_html,
		fix_content_duplication : s.fix_content_duplication
	});

	// Wrap old theme
	t = this.settings['theme'];
	if (!tinyMCE.hasTheme(t)) {
		fn = tinyMCE.callbacks;
		to = {};

		for (i=0; i<fn.length; i++) {
			if ((fu = window['TinyMCE_' + t + "_" + fn[i]]))
				to[fn[i]] = fu;
		}

		tinyMCE.addTheme(t, to);
	}

	// Wrap old plugins
	this.plugins = new Array();
	p = tinyMCE.getParam('plugins', '', true, ',');
	if (p.length > 0) {
		for (i=0; i<p.length; i++) {
			pn = p[i];

			if (pn.charAt(0) == '-')
				pn = pn.substring(1);

			if (!tinyMCE.hasPlugin(pn)) {
				fn = tinyMCE.callbacks;
				to = {};

				for (x=0; x<fn.length; x++) {
					if ((fu = window['TinyMCE_' + pn + "_" + fn[x]]))
						to[fn[x]] = fu;
				}

				tinyMCE.addPlugin(pn, to);
			}

			this.plugins[this.plugins.length] = pn; 
		}
	}
};

TinyMCE_Control.prototype = {
	selection : null,

	settings : null,

	cleanup : null,

	getData : function(na) {
		var o = this.data[na];

		if (!o)
			o = this.data[na] = {};

		return o;
	},

	hasPlugin : function(n) {
		var i;

		for (i=0; i<this.plugins.length; i++) {
			if (this.plugins[i] == n)
				return true;
		}

		return false;
	},

	addPlugin : function(n, p) {
		if (!this.hasPlugin(n)) {
			tinyMCE.addPlugin(n, p);
			this.plugins[this.plugins.length] = n;
		}
	},

	repaint : function() {
		var s, b, ex;

		if (tinyMCE.isRealIE)
			return;

		try {
			s = this.selection;
			b = s.getBookmark(true);
			this.getBody().style.display = 'none';
			this.getDoc().execCommand('selectall', false, null);
			this.getSel().collapseToStart();
			this.getBody().style.display = 'block';
			s.moveToBookmark(b);
		} catch (ex) {
			// Ignore
		}
	},

	switchSettings : function() {
		if (tinyMCE.configs.length > 1 && tinyMCE.currentConfig != this.settings['index']) {
			tinyMCE.settings = this.settings;
			tinyMCE.currentConfig = this.settings['index'];
		}
	},

	select : function() {
		var oldInst = tinyMCE.selectedInstance;

		if (oldInst != this) {
			if (oldInst)
				oldInst.execCommand('mceEndTyping');

			tinyMCE.dispatchCallback(this, 'select_instance_callback', 'selectInstance', this, oldInst);
			tinyMCE.selectedInstance = this;
		}
	},

	getBody : function() {
		return this.contentBody ? this.contentBody : this.getDoc().body;
	},

	getDoc : function() {
//		return this.contentDocument ? this.contentDocument : this.contentWindow.document; // Removed due to IE 5.5 ?
		return this.contentWindow.document;
	},

	getWin : function() {
		return this.contentWindow;
	},

	getContainerWin : function() {
		return this.containerWindow ? this.containerWindow : window;
	},

	getViewPort : function() {
		return tinyMCE.getViewPort(this.getWin());
	},

	getParentNode : function(n, f) {
		return tinyMCE.getParentNode(n, f, this.getBody());
	},

	getParentElement : function(n, na, f) {
		return tinyMCE.getParentElement(n, na, f, this.getBody());
	},

	getParentBlockElement : function(n) {
		return tinyMCE.getParentBlockElement(n, this.getBody());
	},

	resizeToContent : function() {
		var d = this.getDoc(), b = d.body, de = d.documentElement;

		this.iframeElement.style.height = (tinyMCE.isRealIE) ? b.scrollHeight : de.offsetHeight + 'px';
	},

	addShortcut : function(m, k, d, cmd, ui, va) {
		var n = typeof(k) == "number", ie = tinyMCE.isIE, c, sc, i, scl = this.shortcuts;

		if (!tinyMCE.getParam('custom_shortcuts'))
			return false;

		m = m.toLowerCase();
		k = ie && !n ? k.toUpperCase() : k;
		c = n ? null : k.charCodeAt(0);
		d = d && d.indexOf('lang_') == 0 ? tinyMCE.getLang(d) : d;

		sc = {
			alt : m.indexOf('alt') != -1,
			ctrl : m.indexOf('ctrl') != -1,
			shift : m.indexOf('shift') != -1,
			charCode : c,
			keyCode : n ? k : (ie ? c : null),
			desc : d,
			cmd : cmd,
			ui : ui,
			val : va
		};

		for (i=0; i<scl.length; i++) {
			if (sc.alt == scl[i].alt && sc.ctrl == scl[i].ctrl && sc.shift == scl[i].shift
				&& sc.charCode == scl[i].charCode && sc.keyCode == scl[i].keyCode) {
				return false;
			}
		}

		scl[scl.length] = sc;

		return true;
	},

	handleShortcut : function(e) {
		var i, s = this.shortcuts, o;

		for (i=0; i<s.length; i++) {
			o = s[i];

			if (o.alt == e.altKey && o.ctrl == e.ctrlKey && (o.keyCode == e.keyCode || o.charCode == e.charCode)) {
				if (o.cmd && (e.type == "keydown" || (e.type == "keypress" && !tinyMCE.isOpera)))
					tinyMCE.execCommand(o.cmd, o.ui, o.val);

				tinyMCE.cancelEvent(e);
				return true;
			}
		}

		return false;
	},

	autoResetDesignMode : function() {
		// Add fix for tab/style.display none/block problems in Gecko
		if (!tinyMCE.isIE && this.isHidden() && tinyMCE.getParam('auto_reset_designmode'))
			eval('try { this.getDoc().designMode = "On"; this.useCSS = false; } catch(e) {}');
	},

	isHidden : function() {
		var s;

		if (tinyMCE.isIE)
			return false;

		s = this.getSel();

		// Weird, wheres that cursor selection?
		return (!s || !s.rangeCount || s.rangeCount == 0);
	},

	isDirty : function() {
		// Is content modified and not in a submit procedure
		return tinyMCE.trim(this.startContent) != tinyMCE.trim(this.getBody().innerHTML) && !tinyMCE.isNotDirty;
	},

	_mergeElements : function(scmd, pa, ch, override) {
		if (scmd == "removeformat") {
			pa.className = "";
			pa.style.cssText = "";
			ch.className = "";
			ch.style.cssText = "";
			return;
		}

		var st = tinyMCE.parseStyle(tinyMCE.getAttrib(pa, "style"));
		var stc = tinyMCE.parseStyle(tinyMCE.getAttrib(ch, "style"));
		var className = tinyMCE.getAttrib(pa, "class");

		// Removed class adding due to bug #1478272
		className = tinyMCE.getAttrib(ch, "class");

		if (override) {
			for (var n in st) {
				if (typeof(st[n]) == 'function')
					continue;

				stc[n] = st[n];
			}
		} else {
			for (var n in stc) {
				if (typeof(stc[n]) == 'function')
					continue;

				st[n] = stc[n];
			}
		}

		tinyMCE.setAttrib(pa, "style", tinyMCE.serializeStyle(st));
		tinyMCE.setAttrib(pa, "class", tinyMCE.trim(className));
		ch.className = "";
		ch.style.cssText = "";
		ch.removeAttribute("class");
		ch.removeAttribute("style");
	},

	_setUseCSS : function(b) {
		var d = this.getDoc();

		try {d.execCommand("useCSS", false, !b);} catch (ex) {}
		try {d.execCommand("styleWithCSS", false, b);} catch (ex) {}

		if (!tinyMCE.getParam("table_inline_editing"))
			try {d.execCommand('enableInlineTableEditing', false, "false");} catch (ex) {}

		if (!tinyMCE.getParam("object_resizing"))
			try {d.execCommand('enableObjectResizing', false, "false");} catch (ex) {}
	},

	execCommand : function(command, user_interface, value) {
		var doc = this.getDoc(), win = this.getWin(), focusElm = this.getFocusElement();

		// Is not a undo specific command
		if (!new RegExp('mceStartTyping|mceEndTyping|mceBeginUndoLevel|mceEndUndoLevel|mceAddUndoLevel', 'gi').test(command))
			this.undoBookmark = null;

		// Mozilla issue
		if (!tinyMCE.isIE && !this.useCSS) {
			this._setUseCSS(false);
			this.useCSS = true;
		}

		//debug("command: " + command + ", user_interface: " + user_interface + ", value: " + value);
		this.contentDocument = doc; // <-- Strange, unless this is applied Mozilla 1.3 breaks

		if (tinyMCE.execCommandCallback(this, 'execcommand_callback', 'execCommand', this.editorId, this.getBody(), command, user_interface, value))
			return;

		// Fix align on images
		if (focusElm && focusElm.nodeName == "IMG") {
			var align = focusElm.getAttribute('align');
			var img = command == "JustifyCenter" ? focusElm.cloneNode(false) : focusElm;

			switch (command) {
				case "JustifyLeft":
					if (align == 'left')
						img.removeAttribute('align');
					else
						img.setAttribute('align', 'left');

					// Remove the div
					var div = focusElm.parentNode;
					if (div && div.nodeName == "DIV" && div.childNodes.length == 1 && div.parentNode)
						div.parentNode.replaceChild(img, div);

					this.selection.selectNode(img);
					this.repaint();
					tinyMCE.triggerNodeChange();
					return;

				case "JustifyCenter":
					img.removeAttribute('align');

					// Is centered
					var div = tinyMCE.getParentElement(focusElm, "div");
					if (div && div.style.textAlign == "center") {
						// Remove div
						if (div.nodeName == "DIV" && div.childNodes.length == 1 && div.parentNode)
							div.parentNode.replaceChild(img, div);
					} else {
						// Add div
						var div = this.getDoc().createElement("div");
						div.style.textAlign = 'center';
						div.appendChild(img);
						focusElm.parentNode.replaceChild(div, focusElm);
					}

					this.selection.selectNode(img);
					this.repaint();
					tinyMCE.triggerNodeChange();
					return;

				case "JustifyRight":
					if (align == 'right')
						img.removeAttribute('align');
					else
						img.setAttribute('align', 'right');

					// Remove the div
					var div = focusElm.parentNode;
					if (div && div.nodeName == "DIV" && div.childNodes.length == 1 && div.parentNode)
						div.parentNode.replaceChild(img, div);

					this.selection.selectNode(img);
					this.repaint();
					tinyMCE.triggerNodeChange();
					return;
			}
		}

		if (tinyMCE.settings['force_br_newlines']) {
			var alignValue = "";

			if (doc.selection.type != "Control") {
				switch (command) {
						case "JustifyLeft":
							alignValue = "left";
							break;

						case "JustifyCenter":
							alignValue = "center";
							break;

						case "JustifyFull":
							alignValue = "justify";
							break;

						case "JustifyRight":
							alignValue = "right";
							break;
				}

				if (alignValue != "") {
					var rng = doc.selection.createRange();

					if ((divElm = tinyMCE.getParentElement(rng.parentElement(), "div")) != null)
						divElm.setAttribute("align", alignValue);
					else if (rng.pasteHTML && rng.htmlText.length > 0)
						rng.pasteHTML('<div align="' + alignValue + '">' + rng.htmlText + "</div>");

					tinyMCE.triggerNodeChange();
					return;
				}
			}
		}

		switch (command) {
			case "mceRepaint":
				this.repaint();
				return true;

			case "unlink":
				// Unlink if caret is inside link
				if (tinyMCE.isGecko && this.getSel().isCollapsed) {
					focusElm = tinyMCE.getParentElement(focusElm, 'A');

					if (focusElm)
						this.selection.selectNode(focusElm, false);
				}

				this.getDoc().execCommand(command, user_interface, value);

				tinyMCE.isGecko && this.getSel().collapseToEnd();

				tinyMCE.triggerNodeChange();

				return true;

			case "FormatBlock":
				if (!this.cleanup.isValid(value))
					return true;

				this.getDoc().execCommand(command, user_interface, value);
				tinyMCE.triggerNodeChange();
				break;

			case "InsertUnorderedList":
			case "InsertOrderedList":
				this.getDoc().execCommand(command, user_interface, value);
				tinyMCE.triggerNodeChange();
				break;

			case "Strikethrough":
				this.getDoc().execCommand(command, user_interface, value);
				tinyMCE.triggerNodeChange();
				break;

			case "mceSelectNode":
				this.selection.selectNode(value);
				tinyMCE.triggerNodeChange();
				tinyMCE.selectedNode = value;
				break;

			case "FormatBlock":
				if (value == null || value == "") {
					var elm = tinyMCE.getParentElement(this.getFocusElement(), "p,div,h1,h2,h3,h4,h5,h6,pre,address,blockquote,dt,dl,dd,samp");

					if (elm)
						this.execCommand("mceRemoveNode", false, elm);
				} else {
					if (tinyMCE.isGecko && new RegExp('<(div|blockquote|code|dt|dd|dl|samp)>', 'gi').test(value))
						value = value.replace(/[^a-z]/gi, '');

					if (tinyMCE.isIE && new RegExp('blockquote|code|samp', 'gi').test(value)) {
						var b = this.selection.getBookmark();
						this.getDoc().execCommand("FormatBlock", false, '<p>');
						tinyMCE.renameElement(tinyMCE.getParentBlockElement(this.getFocusElement()), value);
						this.selection.moveToBookmark(b);
					} else
						this.getDoc().execCommand("FormatBlock", false, value);
				}

				tinyMCE.triggerNodeChange();

				break;

			case "mceRemoveNode":
				if (!value)
					value = tinyMCE.getParentElement(this.getFocusElement());

				if (tinyMCE.isIE) {
					value.outerHTML = value.innerHTML;
				} else {
					var rng = value.ownerDocument.createRange();
					rng.setStartBefore(value);
					rng.setEndAfter(value);
					rng.deleteContents();
					rng.insertNode(rng.createContextualFragment(value.innerHTML));
				}

				tinyMCE.triggerNodeChange();

				break;

			case "mceSelectNodeDepth":
				var parentNode = this.getFocusElement();
				for (var i=0; parentNode; i++) {
					if (parentNode.nodeName.toLowerCase() == "body")
						break;

					if (parentNode.nodeName.toLowerCase() == "#text") {
						i--;
						parentNode = parentNode.parentNode;
						continue;
					}

					if (i == value) {
						this.selection.selectNode(parentNode, false);
						tinyMCE.triggerNodeChange();
						tinyMCE.selectedNode = parentNode;
						return;
					}

					parentNode = parentNode.parentNode;
				}

				break;

			case "SetStyleInfo":
				var rng = this.getRng();
				var sel = this.getSel();
				var scmd = value['command'];
				var sname = value['name'];
				var svalue = value['value'] == null ? '' : value['value'];
				//var svalue = value['value'] == null ? '' : value['value'];
				var wrapper = value['wrapper'] ? value['wrapper'] : "span";
				var parentElm = null;
				var invalidRe = new RegExp("^BODY|HTML$", "g");
				var invalidParentsRe = tinyMCE.settings['merge_styles_invalid_parents'] != '' ? new RegExp(tinyMCE.settings['merge_styles_invalid_parents'], "gi") : null;

				// Whole element selected check
				if (tinyMCE.isIE) {
					// Control range
					if (rng.item)
						parentElm = rng.item(0);
					else {
						var pelm = rng.parentElement();
						var prng = doc.selection.createRange();
						prng.moveToElementText(pelm);

						if (rng.htmlText == prng.htmlText || rng.boundingWidth == 0) {
							if (invalidParentsRe == null || !invalidParentsRe.test(pelm.nodeName))
								parentElm = pelm;
						}
					}
				} else {
					var felm = this.getFocusElement();
					if (sel.isCollapsed || (new RegExp('td|tr|tbody|table', 'gi').test(felm.nodeName) && sel.anchorNode == felm.parentNode))
						parentElm = felm;
				}

				// Whole element selected
				if (parentElm && !invalidRe.test(parentElm.nodeName)) {
					if (scmd == "setstyle")
						tinyMCE.setStyleAttrib(parentElm, sname, svalue);

					if (scmd == "setattrib")
						tinyMCE.setAttrib(parentElm, sname, svalue);

					if (scmd == "removeformat") {
						parentElm.style.cssText = '';
						tinyMCE.setAttrib(parentElm, 'class', '');
					}

					// Remove style/attribs from all children
					var ch = tinyMCE.getNodeTree(parentElm, new Array(), 1);
					for (var z=0; z<ch.length; z++) {
						if (ch[z] == parentElm)
							continue;

						if (scmd == "setstyle")
							tinyMCE.setStyleAttrib(ch[z], sname, '');

						if (scmd == "setattrib")
							tinyMCE.setAttrib(ch[z], sname, '');

						if (scmd == "removeformat") {
							ch[z].style.cssText = '';
							tinyMCE.setAttrib(ch[z], 'class', '');
						}
					}
				} else {
					this._setUseCSS(false); // Bug in FF when running in fullscreen
					doc.execCommand("FontName", false, "#mce_temp_font#");
					var elementArray = tinyMCE.getElementsByAttributeValue(this.getBody(), "font", "face", "#mce_temp_font#");

					// Change them all
					for (var x=0; x<elementArray.length; x++) {
						elm = elementArray[x];
						if (elm) {
							var spanElm = doc.createElement(wrapper);

							if (scmd == "setstyle")
								tinyMCE.setStyleAttrib(spanElm, sname, svalue);

							if (scmd == "setattrib")
								tinyMCE.setAttrib(spanElm, sname, svalue);

							if (scmd == "removeformat") {
								spanElm.style.cssText = '';
								tinyMCE.setAttrib(spanElm, 'class', '');
							}

							if (elm.hasChildNodes()) {
								for (var i=0; i<elm.childNodes.length; i++)
									spanElm.appendChild(elm.childNodes[i].cloneNode(true));
							}

							spanElm.setAttribute("mce_new", "true");
							elm.parentNode.replaceChild(spanElm, elm);

							// Remove style/attribs from all children
							var ch = tinyMCE.getNodeTree(spanElm, new Array(), 1);
							for (var z=0; z<ch.length; z++) {
								if (ch[z] == spanElm)
									continue;

								if (scmd == "setstyle")
									tinyMCE.setStyleAttrib(ch[z], sname, '');

								if (scmd == "setattrib")
									tinyMCE.setAttrib(ch[z], sname, '');

								if (scmd == "removeformat") {
									ch[z].style.cssText = '';
									tinyMCE.setAttrib(ch[z], 'class', '');
								}
							}
						}
					}
				}

				// Cleaup wrappers
				var nodes = doc.getElementsByTagName(wrapper);
				for (var i=nodes.length-1; i>=0; i--) {
					var elm = nodes[i];
					var isNew = tinyMCE.getAttrib(elm, "mce_new") == "true";

					elm.removeAttribute("mce_new");

					// Is only child a element
					if (elm.childNodes && elm.childNodes.length == 1 && elm.childNodes[0].nodeType == 1) {
						//tinyMCE.debug("merge1" + isNew);
						this._mergeElements(scmd, elm, elm.childNodes[0], isNew);
						continue;
					}

					// Is I the only child
					if (elm.parentNode.childNodes.length == 1 && !invalidRe.test(elm.nodeName) && !invalidRe.test(elm.parentNode.nodeName)) {
						//tinyMCE.debug("merge2" + isNew + "," + elm.nodeName + "," + elm.parentNode.nodeName);
						if (invalidParentsRe == null || !invalidParentsRe.test(elm.parentNode.nodeName))
							this._mergeElements(scmd, elm.parentNode, elm, false);
					}
				}

				// Remove empty wrappers
				var nodes = doc.getElementsByTagName(wrapper);
				for (var i=nodes.length-1; i>=0; i--) {
					var elm = nodes[i];
					var isEmpty = true;

					// Check if it has any attribs
					var tmp = doc.createElement("body");
					tmp.appendChild(elm.cloneNode(false));

					// Is empty span, remove it
					tmp.innerHTML = tmp.innerHTML.replace(new RegExp('style=""|class=""', 'gi'), '');
					//tinyMCE.debug(tmp.innerHTML);
					if (new RegExp('<span>', 'gi').test(tmp.innerHTML)) {
						for (var x=0; x<elm.childNodes.length; x++) {
							if (elm.parentNode != null)
								elm.parentNode.insertBefore(elm.childNodes[x].cloneNode(true), elm);
						}

						elm.parentNode.removeChild(elm);
					}
				}

				// Re add the visual aids
				if (scmd == "removeformat")
					tinyMCE.handleVisualAid(this.getBody(), true, this.visualAid, this);

				tinyMCE.triggerNodeChange();

				break;

			case "FontName":
				if (value == null) {
					var s = this.getSel();

					// Find font and select it
					if (tinyMCE.isGecko && s.isCollapsed) {
						var f = tinyMCE.getParentElement(this.getFocusElement(), "font");

						if (f != null)
							this.selection.selectNode(f, false);
					}

					// Remove format
					this.getDoc().execCommand("RemoveFormat", false, null);

					// Collapse range if font was found
					if (f != null && tinyMCE.isGecko) {
						var r = this.getRng().cloneRange();
						r.collapse(true);
						s.removeAllRanges();
						s.addRange(r);
					}
				} else
					this.getDoc().execCommand('FontName', false, value);

				if (tinyMCE.isGecko)
					window.setTimeout('tinyMCE.triggerNodeChange(false);', 1);

				return;

			case "FontSize":
				this.getDoc().execCommand('FontSize', false, value);

				if (tinyMCE.isGecko)
					window.setTimeout('tinyMCE.triggerNodeChange(false);', 1);

				return;

			case "forecolor":
				value = value == null ? this.foreColor : value;
				value = tinyMCE.trim(value);
				value = value.charAt(0) != '#' ? (isNaN('0x' + value) ? value : '#' + value) : value;

				this.foreColor = value;
				this.getDoc().execCommand('forecolor', false, value);
				break;

			case "HiliteColor":
				value = value == null ? this.backColor : value;
				value = tinyMCE.trim(value);
				value = value.charAt(0) != '#' ? (isNaN('0x' + value) ? value : '#' + value) : value;
				this.backColor = value;

				if (tinyMCE.isGecko) {
					this._setUseCSS(true);
					this.getDoc().execCommand('hilitecolor', false, value);
					this._setUseCSS(false);
				} else
					this.getDoc().execCommand('BackColor', false, value);
				break;

			case "Cut":
			case "Copy":
			case "Paste":
				var cmdFailed = false;

				// Try executing command
				eval('try {this.getDoc().execCommand(command, user_interface, value);} catch (e) {cmdFailed = true;}');

				if (tinyMCE.isOpera && cmdFailed)
					alert('Currently not supported by your browser, use keyboard shortcuts instead.');

				// Alert error in gecko if command failed
				if (tinyMCE.isGecko && cmdFailed) {
					// Confirm more info
					if (confirm(tinyMCE.entityDecode(tinyMCE.getLang('lang_clipboard_msg'))))
						window.open('http://www.mozilla.org/editor/midasdemo/securityprefs.html', 'mceExternal');

					return;
				} else
					tinyMCE.triggerNodeChange();
			break;

			case "mceSetContent":
				if (!value)
					value = "";

				// Call custom cleanup code
				value = tinyMCE.storeAwayURLs(value);
				value = tinyMCE._customCleanup(this, "insert_to_editor", value);

				if (this.getBody().nodeName == 'BODY')
					tinyMCE._setHTML(doc, value);
				else
					this.getBody().innerHTML = value;

				tinyMCE.setInnerHTML(this.getBody(), tinyMCE._cleanupHTML(this, doc, this.settings, this.getBody(), false, false, false, true));
				tinyMCE.convertAllRelativeURLs(this.getBody());

				// Cleanup any mess left from storyAwayURLs
				tinyMCE._removeInternal(this.getBody());

				// When editing always use fonts internaly
				if (tinyMCE.getParam("convert_fonts_to_spans"))
					tinyMCE.convertSpansToFonts(doc);

				tinyMCE.handleVisualAid(this.getBody(), true, this.visualAid, this);
				tinyMCE._setEventsEnabled(this.getBody(), false);
				return true;

			case "mceCleanup":
				var b = this.selection.getBookmark();
				tinyMCE._setHTML(this.contentDocument, this.getBody().innerHTML);
				tinyMCE.setInnerHTML(this.getBody(), tinyMCE._cleanupHTML(this, this.contentDocument, this.settings, this.getBody(), this.visualAid));
				tinyMCE.convertAllRelativeURLs(doc.body);

				// When editing always use fonts internaly
				if (tinyMCE.getParam("convert_fonts_to_spans"))
					tinyMCE.convertSpansToFonts(doc);

				tinyMCE.handleVisualAid(this.getBody(), true, this.visualAid, this);
				tinyMCE._setEventsEnabled(this.getBody(), false);
				this.repaint();
				this.selection.moveToBookmark(b);
				tinyMCE.triggerNodeChange();
			break;

			case "mceReplaceContent":
				// Force empty string
				if (!value)
					value = '';

				this.getWin().focus();

				var selectedText = "";

				if (tinyMCE.isIE) {
					var rng = doc.selection.createRange();
					selectedText = rng.text;
				} else
					selectedText = this.getSel().toString();

				if (selectedText.length > 0) {
					value = tinyMCE.replaceVar(value, "selection", selectedText);
					tinyMCE.execCommand('mceInsertContent', false, value);
				}

				tinyMCE.triggerNodeChange();
			break;

			case "mceSetAttribute":
				if (typeof(value) == 'object') {
					var targetElms = (typeof(value['targets']) == "undefined") ? "p,img,span,div,td,h1,h2,h3,h4,h5,h6,pre,address" : value['targets'];
					var targetNode = tinyMCE.getParentElement(this.getFocusElement(), targetElms);

					if (targetNode) {
						targetNode.setAttribute(value['name'], value['value']);
						tinyMCE.triggerNodeChange();
					}
				}
			break;

			case "mceSetCSSClass":
				this.execCommand("SetStyleInfo", false, {command : "setattrib", name : "class", value : value});
			break;

			case "mceInsertRawHTML":
				var key = 'tiny_mce_marker';

				this.execCommand('mceBeginUndoLevel');

				// Insert marker key
				this.execCommand('mceInsertContent', false, key);

				// Store away scroll pos
				var scrollX = this.getBody().scrollLeft + this.getDoc().documentElement.scrollLeft;
				var scrollY = this.getBody().scrollTop + this.getDoc().documentElement.scrollTop;

				// Find marker and replace with RAW HTML
				var html = this.getBody().innerHTML;
				if ((pos = html.indexOf(key)) != -1)
					tinyMCE.setInnerHTML(this.getBody(), html.substring(0, pos) + value + html.substring(pos + key.length));

				// Restore scoll pos
				this.contentWindow.scrollTo(scrollX, scrollY);

				this.execCommand('mceEndUndoLevel');

				break;

			case "mceInsertContent":
				// Force empty string
				if (!value)
					value = '';

				var insertHTMLFailed = false;

				// Removed since it produced problems in IE
				// this.getWin().focus();

				if (tinyMCE.isGecko || tinyMCE.isOpera) {
					try {
						// Is plain text or HTML, &amp;, &nbsp; etc will be encoded wrong in FF
						if (value.indexOf('<') == -1 && !value.match(/(&#38;|&#160;|&#60;|&#62;)/g)) {
							var r = this.getRng();
							var n = this.getDoc().createTextNode(tinyMCE.entityDecode(value));
							var s = this.getSel();
							var r2 = r.cloneRange();

							// Insert text at cursor position
							s.removeAllRanges();
							r.deleteContents();
							r.insertNode(n);

							// Move the cursor to the end of text
							r2.selectNode(n);
							r2.collapse(false);
							s.removeAllRanges();
							s.addRange(r2);
						} else {
							value = tinyMCE.fixGeckoBaseHREFBug(1, this.getDoc(), value);
							this.getDoc().execCommand('inserthtml', false, value);
							tinyMCE.fixGeckoBaseHREFBug(2, this.getDoc(), value);
						}
					} catch (ex) {
						insertHTMLFailed = true;
					}

					if (!insertHTMLFailed) {
						tinyMCE.triggerNodeChange();
						return;
					}
				}

				if (!tinyMCE.isIE) {
					var isHTML = value.indexOf('<') != -1;
					var sel = this.getSel();
					var rng = this.getRng();

					if (isHTML) {
						if (tinyMCE.isSafari) {
							var tmpRng = this.getDoc().createRange();

							tmpRng.setStart(this.getBody(), 0);
							tmpRng.setEnd(this.getBody(), 0);

							value = tmpRng.createContextualFragment(value);
						} else
							value = rng.createContextualFragment(value);
					} else {
						// Setup text node
						var el = document.createElement("div");
						el.innerHTML = value;
						value = el.firstChild.nodeValue;
						value = doc.createTextNode(value);
					}

					// Insert plain text in Safari
					if (tinyMCE.isSafari && !isHTML) {
						this.execCommand('InsertText', false, value.nodeValue);
						tinyMCE.triggerNodeChange();
						return true;
					} else if (tinyMCE.isSafari && isHTML) {
						rng.deleteContents();
						rng.insertNode(value);
						tinyMCE.triggerNodeChange();
						return true;
					}

					rng.deleteContents();

					// If target node is text do special treatment, (Mozilla 1.3 fix)
					if (rng.startContainer.nodeType == 3) {
						var node = rng.startContainer.splitText(rng.startOffset);
						node.parentNode.insertBefore(value, node); 
					} else
						rng.insertNode(value);

					if (!isHTML) {
						// Removes weird selection trails
						sel.selectAllChildren(doc.body);
						sel.removeAllRanges();

						// Move cursor to end of content
						var rng = doc.createRange();

						rng.selectNode(value);
						rng.collapse(false);

						sel.addRange(rng);
					} else
						rng.collapse(false);

					tinyMCE.fixGeckoBaseHREFBug(2, this.getDoc(), value);
				} else {
					var rng = doc.selection.createRange(), tmpRng = null;
					var c = value.indexOf('<!--') != -1;

					// Fix comment bug, add tag before comments
					if (c)
						value = tinyMCE.uniqueTag + value;

					//	tmpRng = rng.duplicate(); // Store away range (Fixes Undo bookmark bug in IE)

					if (rng.item)
						rng.item(0).outerHTML = value;
					else
						rng.pasteHTML(value);

					//if (tmpRng)
					//	tmpRng.select(); // Restore range  (Fixes Undo bookmark bug in IE)

					// Remove unique tag
					if (c) {
						var e = this.getDoc().getElementById('mceTMPElement');
						e.parentNode.removeChild(e);
					}
				}

				tinyMCE.execCommand("mceAddUndoLevel");
				tinyMCE.triggerNodeChange();
			break;

			case "mceStartTyping":
				if (tinyMCE.settings['custom_undo_redo'] && this.undoRedo.typingUndoIndex == -1) {
					this.undoRedo.typingUndoIndex = this.undoRedo.undoIndex;
					tinyMCE.typingUndoIndex = tinyMCE.undoIndex;
					this.execCommand('mceAddUndoLevel');
				}
				break;

			case "mceEndTyping":
				if (tinyMCE.settings['custom_undo_redo'] && this.undoRedo.typingUndoIndex != -1) {
					this.execCommand('mceAddUndoLevel');
					this.undoRedo.typingUndoIndex = -1;
				}

				tinyMCE.typingUndoIndex = -1;
				break;

			case "mceBeginUndoLevel":
				this.undoRedoLevel = false;
				break;

			case "mceEndUndoLevel":
				this.undoRedoLevel = true;
				this.execCommand('mceAddUndoLevel');
				break;

			case "mceAddUndoLevel":
				if (tinyMCE.settings['custom_undo_redo'] && this.undoRedoLevel) {
					if (this.undoRedo.add())
						tinyMCE.triggerNodeChange(false);
				}
				break;

			case "Undo":
				if (tinyMCE.settings['custom_undo_redo']) {
					tinyMCE.execCommand("mceEndTyping");
					this.undoRedo.undo();
					tinyMCE.triggerNodeChange();
				} else
					this.getDoc().execCommand(command, user_interface, value);
				break;

			case "Redo":
				if (tinyMCE.settings['custom_undo_redo']) {
					tinyMCE.execCommand("mceEndTyping");
					this.undoRedo.redo();
					tinyMCE.triggerNodeChange();
				} else
					this.getDoc().execCommand(command, user_interface, value);
				break;

			case "mceToggleVisualAid":
				this.visualAid = !this.visualAid;
				tinyMCE.handleVisualAid(this.getBody(), true, this.visualAid, this);
				tinyMCE.triggerNodeChange();
				break;

			case "Indent":
				this.getDoc().execCommand(command, user_interface, value);
				tinyMCE.triggerNodeChange();

				if (tinyMCE.isIE) {
					var n = tinyMCE.getParentElement(this.getFocusElement(), "blockquote");
					do {
						if (n && n.nodeName == "BLOCKQUOTE") {
							n.removeAttribute("dir");
							n.removeAttribute("style");
						}
					} while (n != null && (n = n.parentNode) != null);
				}
				break;

			case "removeformat":
				var text = this.selection.getSelectedText();

				if (tinyMCE.isOpera) {
					this.getDoc().execCommand("RemoveFormat", false, null);
					return;
				}

				if (tinyMCE.isIE) {
					try {
						var rng = doc.selection.createRange();
						rng.execCommand("RemoveFormat", false, null);
					} catch (e) {
						// Do nothing
					}

					this.execCommand("SetStyleInfo", false, {command : "removeformat"});
				} else {
					this.getDoc().execCommand(command, user_interface, value);

					this.execCommand("SetStyleInfo", false, {command : "removeformat"});
				}

				// Remove class
				if (text.length == 0)
					this.execCommand("mceSetCSSClass", false, "");

				tinyMCE.triggerNodeChange();
				break;

			default:
				this.getDoc().execCommand(command, user_interface, value);

				if (tinyMCE.isGecko)
					window.setTimeout('tinyMCE.triggerNodeChange(false);', 1);
				else
					tinyMCE.triggerNodeChange();
		}

		// Add undo level after modification
		if (command != "mceAddUndoLevel" && command != "Undo" && command != "Redo" && command != "mceStartTyping" && command != "mceEndTyping")
			tinyMCE.execCommand("mceAddUndoLevel");
	},

	queryCommandValue : function(c) {
		try {
			return this.getDoc().queryCommandValue(c);
		} catch (e) {
			return null;
		}
	},

	queryCommandState : function(c) {
		return this.getDoc().queryCommandState(c);
	},

	_onAdd : function(replace_element, form_element_name, target_document) {
		var hc, th, to, editorTemplate;

		th = this.settings['theme'];
		to = tinyMCE.themes[th];

		var targetDoc = target_document ? target_document : document;

		this.targetDoc = targetDoc;

		tinyMCE.themeURL = tinyMCE.baseURL + "/themes/" + this.settings['theme'];
		this.settings['themeurl'] = tinyMCE.themeURL;

		if (!replace_element) {
			alert("Error: Could not find the target element.");
			return false;
		}

		if (to.getEditorTemplate)
			editorTemplate = to.getEditorTemplate(this.settings, this.editorId);

		var deltaWidth = editorTemplate['delta_width'] ? editorTemplate['delta_width'] : 0;
		var deltaHeight = editorTemplate['delta_height'] ? editorTemplate['delta_height'] : 0;
		var html = '<span id="' + this.editorId + '_parent" class="mceEditorContainer">' + editorTemplate['html'];

		html = tinyMCE.replaceVar(html, "editor_id", this.editorId);
		this.settings['default_document'] = tinyMCE.baseURL + "/blank.htm";

		this.settings['old_width'] = this.settings['width'];
		this.settings['old_height'] = this.settings['height'];

		// Set default width, height
		if (this.settings['width'] == -1)
			this.settings['width'] = replace_element.offsetWidth;

		if (this.settings['height'] == -1)
			this.settings['height'] = replace_element.offsetHeight;

		// Try the style width
		if (this.settings['width'] == 0)
			this.settings['width'] = replace_element.style.width;

		// Try the style height
		if (this.settings['height'] == 0)
			this.settings['height'] = replace_element.style.height; 

		// If no width/height then default to 320x240, better than nothing
		if (this.settings['width'] == 0)
			this.settings['width'] = 320;

		if (this.settings['height'] == 0)
			this.settings['height'] = 240;

		this.settings['area_width'] = parseInt(this.settings['width']);
		this.settings['area_height'] = parseInt(this.settings['height']);
		this.settings['area_width'] += deltaWidth;
		this.settings['area_height'] += deltaHeight;

		this.settings['width_style'] = "" + this.settings['width'];
		this.settings['height_style'] = "" + this.settings['height'];

		// Special % handling
		if (("" + this.settings['width']).indexOf('%') != -1)
			this.settings['area_width'] = "100%";
		else
			this.settings['width_style'] += 'px';

		if (("" + this.settings['height']).indexOf('%') != -1)
			this.settings['area_height'] = "100%";
		else
			this.settings['height_style'] += 'px';

		if (("" + replace_element.style.width).indexOf('%') != -1) {
			this.settings['width'] = replace_element.style.width;
			this.settings['area_width'] = "100%";
			this.settings['width_style'] = "100%";
		}

		if (("" + replace_element.style.height).indexOf('%') != -1) {
			this.settings['height'] = replace_element.style.height;
			this.settings['area_height'] = "100%";
			this.settings['height_style'] = "100%";
		}

		html = tinyMCE.applyTemplate(html);

		this.settings['width'] = this.settings['old_width'];
		this.settings['height'] = this.settings['old_height'];

		this.visualAid = this.settings['visual'];
		this.formTargetElementId = form_element_name;

		// Get replace_element contents
		if (replace_element.nodeName == "TEXTAREA" || replace_element.nodeName == "INPUT")
			this.startContent = replace_element.value;
		else
			this.startContent = replace_element.innerHTML;

		// If not text area or input
		if (replace_element.nodeName != "TEXTAREA" && replace_element.nodeName != "INPUT") {
			this.oldTargetElement = replace_element;

			// Debug mode
			if (tinyMCE.settings['debug']) {
				hc = '<textarea wrap="off" id="' + form_element_name + '" name="' + form_element_name + '" cols="100" rows="15"></textarea>';
			} else {
				hc = '<input type="hidden" id="' + form_element_name + '" name="' + form_element_name + '" />';
				this.oldTargetElement.style.display = "none";
			}

			html += '</span>';

			if (tinyMCE.isGecko)
				html = hc + html;
			else
				html += hc;

			// Output HTML and set editable
			if (tinyMCE.isGecko) {
				var rng = replace_element.ownerDocument.createRange();
				rng.setStartBefore(replace_element);

				var fragment = rng.createContextualFragment(html);
				tinyMCE.insertAfter(fragment, replace_element);
			} else
				replace_element.insertAdjacentHTML("beforeBegin", html);
		} else {
			html += '</span>';

			// Just hide the textarea element
			this.oldTargetElement = replace_element;

			if (!tinyMCE.settings['debug'])
				this.oldTargetElement.style.display = "none";

			// Output HTML and set editable
			if (tinyMCE.isGecko) {
				var rng = replace_element.ownerDocument.createRange();
				rng.setStartBefore(replace_element);

				var fragment = rng.createContextualFragment(html);
				tinyMCE.insertAfter(fragment, replace_element);
			} else
				replace_element.insertAdjacentHTML("beforeBegin", html);
		}

		// Setup iframe
		var dynamicIFrame = false;
		var tElm = targetDoc.getElementById(this.editorId);

		if (!tinyMCE.isIE) {
			// Node case is preserved in XML strict mode
			if (tElm && (tElm.nodeName == "SPAN" || tElm.nodeName == "span")) {
				tElm = tinyMCE._createIFrame(tElm, targetDoc);
				dynamicIFrame = true;
			}

			this.targetElement = tElm;
			this.iframeElement = tElm;
			this.contentDocument = tElm.contentDocument;
			this.contentWindow = tElm.contentWindow;

			//this.getDoc().designMode = "on";
		} else {
			if (tElm && tElm.nodeName == "SPAN")
				tElm = tinyMCE._createIFrame(tElm, targetDoc, targetDoc.parentWindow);
			else
				tElm = targetDoc.frames[this.editorId];

			this.targetElement = tElm;
			this.iframeElement = targetDoc.getElementById(this.editorId);

			if (tinyMCE.isOpera) {
				this.contentDocument = this.iframeElement.contentDocument;
				this.contentWindow = this.iframeElement.contentWindow;
				dynamicIFrame = true;
			} else {
				this.contentDocument = tElm.window.document;
				this.contentWindow = tElm.window;
			}

			this.getDoc().designMode = "on";
		}

		// Setup base HTML
		var doc = this.contentDocument;
		if (dynamicIFrame) {
			var html = tinyMCE.getParam('doctype') + '<html><head xmlns="http://www.w3.org/1999/xhtml"><base href="' + tinyMCE.settings['base_href'] + '" /><title>blank_page</title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body class="mceContentBody"></body></html>';

			try {
				if (!this.isHidden())
					this.getDoc().designMode = "on";

				doc.open();
				doc.write(html);
				doc.close();
			} catch (e) {
				// Failed Mozilla 1.3
				this.getDoc().location.href = tinyMCE.baseURL + "/blank.htm";
			}
		}

		// This timeout is needed in MSIE 5.5 for some odd reason
		// it seems that the document.frames isn't initialized yet?
		if (tinyMCE.isIE)
			window.setTimeout("tinyMCE.addEventHandlers(tinyMCE.instances[\"" + this.editorId + "\"]);", 1);

		tinyMCE.setupContent(this.editorId, true);

		return true;
	},

	setBaseHREF : function(u) {
		var h, b, d, nl;

		d = this.getDoc();
		nl = d.getElementsByTagName("base");
		b = nl.length > 0 ? nl[0] : null;

		if (!b) {
			nl = d.getElementsByTagName("head");
			h = nl.length > 0 ? nl[0] : null;

			b = d.createElement("base");
			b.setAttribute('href', u);
			h.appendChild(b);
		} else {
			if (u == "" || u == null)
				b.parentNode.removeChild(b);
			else
				b.setAttribute('href', u);
		}
	},

	getHTML : function(r) {
		var h, d = this.getDoc(), b = this.getBody();

		if (r)
			return b.innerHTML;

		h = tinyMCE._cleanupHTML(this, d, this.settings, b, false, true, false, true);

		if (tinyMCE.getParam("convert_fonts_to_spans"))
			tinyMCE.convertSpansToFonts(d);

		return h;
	},

	setHTML : function(h) {
		this.execCommand('mceSetContent', false, h);
		this.repaint();
	},

	getFocusElement : function() {
		return this.selection.getFocusElement();
	},

	getSel : function() {
		return this.selection.getSel();
	},

	getRng : function() {
		return this.selection.getRng();
	},

	triggerSave : function(skip_cleanup, skip_callback) {
		var e, nl = [], i, s;

		this.switchSettings();
		s = tinyMCE.settings;

		// Force hidden tabs visible while serializing
		if (tinyMCE.isRealIE) {
			e = this.iframeElement;

			do {
				if (e.style && e.style.display == 'none') {
					e.style.display = 'block';
					nl[nl.length] = {elm : e, type : 'style'};
				}

				if (e.style && s.hidden_tab_class.length > 0 && e.className.indexOf(s.hidden_tab_class) != -1) {
					e.className = s.display_tab_class;
					nl[nl.length] = {elm : e, type : 'class'};
				}
			} while ((e = e.parentNode) != null)
		}

		tinyMCE.settings['preformatted'] = false;

		// Default to false
		if (typeof(skip_cleanup) == "undefined")
			skip_cleanup = false;

		// Default to false
		if (typeof(skip_callback) == "undefined")
			skip_callback = false;

		tinyMCE._setHTML(this.getDoc(), this.getBody().innerHTML);

		// Remove visual aids when cleanup is disabled
		if (this.settings['cleanup'] == false) {
			tinyMCE.handleVisualAid(this.getBody(), true, false, this);
			tinyMCE._setEventsEnabled(this.getBody(), true);
		}

		tinyMCE._customCleanup(this, "submit_content_dom", this.contentWindow.document.body);
		var htm = skip_cleanup ? this.getBody().innerHTML : tinyMCE._cleanupHTML(this, this.getDoc(), this.settings, this.getBody(), tinyMCE.visualAid, true, true);
		htm = tinyMCE._customCleanup(this, "submit_content", htm);

		if (!skip_callback && tinyMCE.settings['save_callback'] != "")
			var content = eval(tinyMCE.settings['save_callback'] + "(this.formTargetElementId,htm,this.getBody());");

		// Use callback content if available
		if ((typeof(content) != "undefined") && content != null)
			htm = content;

		// Replace some weird entities (Bug: #1056343)
		htm = tinyMCE.regexpReplace(htm, "&#40;", "(", "gi");
		htm = tinyMCE.regexpReplace(htm, "&#41;", ")", "gi");
		htm = tinyMCE.regexpReplace(htm, "&#59;", ";", "gi");
		htm = tinyMCE.regexpReplace(htm, "&#34;", "&quot;", "gi");
		htm = tinyMCE.regexpReplace(htm, "&#94;", "^", "gi");

		if (this.formElement)
			this.formElement.value = htm;

		if (tinyMCE.isSafari && this.formElement)
			this.formElement.innerText = htm;

		// Hide them again (tabs in MSIE)
		for (i=0; i<nl.length; i++) {
			if (nl[i].type == 'style')
				nl[i].elm.style.display = 'none';
			else
				nl[i].elm.className = s.hidden_tab_class;
		}
	}

	};

/* file:jscripts/tiny_mce/classes/TinyMCE_Cleanup.class.js */

TinyMCE_Engine.prototype.cleanupHTMLCode = function(s) {
	s = s.replace(new RegExp('<p \\/>', 'gi'), '<p>&nbsp;</p>');
	s = s.replace(new RegExp('<p>\\s*<\\/p>', 'gi'), '<p>&nbsp;</p>');

	// Fix close BR elements
	s = s.replace(new RegExp('<br>\\s*<\\/br>', 'gi'), '<br />');

	// Open closed tags like <b/> to <b></b>
	s = s.replace(new RegExp('<(h[1-6]|p|div|address|pre|form|table|li|ol|ul|td|b|font|em|strong|i|strike|u|span|a|ul|ol|li|blockquote)([a-z]*)([^\\\\|>]*)\\/>', 'gi'), '<$1$2$3></$1$2>');

	// Remove trailing space <b > to <b>
	s = s.replace(new RegExp('\\s+></', 'gi'), '></');

	// Close tags <img></img> to <img/>
	s = s.replace(new RegExp('<(img|br|hr)([^>]*)><\\/(img|br|hr)>', 'gi'), '<$1$2 />');

	// Weird MSIE bug, <p><hr /></p> breaks runtime?
	if (tinyMCE.isIE)
		s = s.replace(new RegExp('<p><hr \\/><\\/p>', 'gi'), "<hr>");

	// Weird tags will make IE error #bug: 1538495
	if (tinyMCE.isIE)
		s = s.replace(/<!(\s*)\/>/g, '');

	// Convert relative anchors to absolute URLs ex: #something to file.htm#something
	// Removed: Since local document anchors should never be forced absolute example edit.php?id=something
	//if (tinyMCE.getParam('convert_urls'))
	//	s = s.replace(new RegExp('(href=\"{0,1})(\\s*#)', 'gi'), '$1' + tinyMCE.settings['document_base_url'] + "#");

	return s;
};

TinyMCE_Engine.prototype.parseStyle = function(str) {
	var ar = new Array();

	if (str == null)
		return ar;

	var st = str.split(';');

	tinyMCE.clearArray(ar);

	for (var i=0; i<st.length; i++) {
		if (st[i] == '')
			continue;

		var re = new RegExp('^\\s*([^:]*):\\s*(.*)\\s*$');
		var pa = st[i].replace(re, '$1||$2').split('||');
//tinyMCE.debug(str, pa[0] + "=" + pa[1], st[i].replace(re, '$1||$2'));
		if (pa.length == 2)
			ar[pa[0].toLowerCase()] = pa[1];
	}

	return ar;
};

TinyMCE_Engine.prototype.compressStyle = function(ar, pr, sf, res) {
	var box = new Array();

	box[0] = ar[pr + '-top' + sf];
	box[1] = ar[pr + '-left' + sf];
	box[2] = ar[pr + '-right' + sf];
	box[3] = ar[pr + '-bottom' + sf];

	for (var i=0; i<box.length; i++) {
		if (box[i] == null)
			return;

		for (var a=0; a<box.length; a++) {
			if (box[a] != box[i])
				return;
		}
	}

	// They are all the same
	ar[res] = box[0];
	ar[pr + '-top' + sf] = null;
	ar[pr + '-left' + sf] = null;
	ar[pr + '-right' + sf] = null;
	ar[pr + '-bottom' + sf] = null;
};

TinyMCE_Engine.prototype.serializeStyle = function(ar) {
	var str = "";

	// Compress box
	tinyMCE.compressStyle(ar, "border", "", "border");
	tinyMCE.compressStyle(ar, "border", "-width", "border-width");
	tinyMCE.compressStyle(ar, "border", "-color", "border-color");
	tinyMCE.compressStyle(ar, "border", "-style", "border-style");
	tinyMCE.compressStyle(ar, "padding", "", "padding");
	tinyMCE.compressStyle(ar, "margin", "", "margin");

	for (var key in ar) {
		var val = ar[key];

		if (typeof(val) == 'function')
			continue;

		if (key.indexOf('mso-') == 0)
			continue;

		if (val != null && val != '') {
			val = '' + val; // Force string

			// Fix style URL
			val = val.replace(new RegExp("url\\(\\'?([^\\']*)\\'?\\)", 'gi'), "url('$1')");

			// Convert URL
			if (val.indexOf('url(') != -1 && tinyMCE.getParam('convert_urls')) {
				var m = new RegExp("url\\('(.*?)'\\)").exec(val);

				if (m.length > 1)
					val = "url('" + eval(tinyMCE.getParam('urlconverter_callback') + "(m[1], null, true);") + "')";
			}

			// Force HEX colors
			if (tinyMCE.getParam("force_hex_style_colors"))
				val = tinyMCE.convertRGBToHex(val, true);

			if (val != "url('')")
				str += key.toLowerCase() + ": " + val + "; ";
		}
	}

	if (new RegExp('; $').test(str))
		str = str.substring(0, str.length - 2);

	return str;
};

TinyMCE_Engine.prototype.convertRGBToHex = function(s, k) {
	if (s.toLowerCase().indexOf('rgb') != -1) {
		var re = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi");
		var rgb = s.replace(re, "$1,$2,$3,$4,$5").split(',');
		if (rgb.length == 5) {
			r = parseInt(rgb[1]).toString(16);
			g = parseInt(rgb[2]).toString(16);
			b = parseInt(rgb[3]).toString(16);

			r = r.length == 1 ? '0' + r : r;
			g = g.length == 1 ? '0' + g : g;
			b = b.length == 1 ? '0' + b : b;

			s = "#" + r + g + b;

			if (k)
				s = rgb[0] + s + rgb[4];
		}
	}

	return s;
};

TinyMCE_Engine.prototype.convertHexToRGB = function(s) {
	if (s.indexOf('#') != -1) {
		s = s.replace(new RegExp('[^0-9A-F]', 'gi'), '');
		return "rgb(" + parseInt(s.substring(0, 2), 16) + "," + parseInt(s.substring(2, 4), 16) + "," + parseInt(s.substring(4, 6), 16) + ")";
	}

	return s;
};

TinyMCE_Engine.prototype.convertSpansToFonts = function(doc) {
	var sizes = tinyMCE.getParam('font_size_style_values').replace(/\s+/, '').split(',');

	var h = doc.body.innerHTML;
	h = h.replace(/<span/gi, '<font');
	h = h.replace(/<\/span/gi, '</font');
	tinyMCE.setInnerHTML(doc.body, h);

	var s = doc.getElementsByTagName("font");
	for (var i=0; i<s.length; i++) {
		var size = tinyMCE.trim(s[i].style.fontSize).toLowerCase();
		var fSize = 0;

		for (var x=0; x<sizes.length; x++) {
			if (sizes[x] == size) {
				fSize = x + 1;
				break;
			}
		}

		if (fSize > 0) {
			tinyMCE.setAttrib(s[i], 'size', fSize);
			s[i].style.fontSize = '';
		}

		var fFace = s[i].style.fontFamily;
		if (fFace != null && fFace != "") {
			tinyMCE.setAttrib(s[i], 'face', fFace);
			s[i].style.fontFamily = '';
		}

		var fColor = s[i].style.color;
		if (fColor != null && fColor != "") {
			tinyMCE.setAttrib(s[i], 'color', tinyMCE.convertRGBToHex(fColor));
			s[i].style.color = '';
		}
	}
};

TinyMCE_Engine.prototype.convertFontsToSpans = function(doc) {
	var sizes = tinyMCE.getParam('font_size_style_values').replace(/\s+/, '').split(',');

	var h = doc.body.innerHTML;
	h = h.replace(/<font/gi, '<span');
	h = h.replace(/<\/font/gi, '</span');
	tinyMCE.setInnerHTML(doc.body, h);

	var fsClasses = tinyMCE.getParam('font_size_classes');
	if (fsClasses != '')
		fsClasses = fsClasses.replace(/\s+/, '').split(',');
	else
		fsClasses = null;

	var s = doc.getElementsByTagName("span");
	for (var i=0; i<s.length; i++) {
		var fSize, fFace, fColor;

		fSize = tinyMCE.getAttrib(s[i], 'size');
		fFace = tinyMCE.getAttrib(s[i], 'face');
		fColor = tinyMCE.getAttrib(s[i], 'color');

		if (fSize != "") {
			fSize = parseInt(fSize);

			if (fSize > 0 && fSize < 8) {
				if (fsClasses != null)
					tinyMCE.setAttrib(s[i], 'class', fsClasses[fSize-1]);
				else
					s[i].style.fontSize = sizes[fSize-1];
			}

			s[i].removeAttribute('size');
		}

		if (fFace != "") {
			s[i].style.fontFamily = fFace;
			s[i].removeAttribute('face');
		}

		if (fColor != "") {
			s[i].style.color = fColor;
			s[i].removeAttribute('color');
		}
	}
};

TinyMCE_Engine.prototype.cleanupAnchors = function(doc) {
	var i, cn, x, an = doc.getElementsByTagName("a");

	// Loops backwards due to bug #1467987
	for (i=an.length-1; i>=0; i--) {
		if (tinyMCE.getAttrib(an[i], "name") != "" && tinyMCE.getAttrib(an[i], "href") == "") {
			cn = an[i].childNodes;

			for (x=cn.length-1; x>=0; x--)
				tinyMCE.insertAfter(cn[x], an[i]);
		}
	}
};

TinyMCE_Engine.prototype.getContent = function(editor_id) {
	if (typeof(editor_id) != "undefined")
		 tinyMCE.getInstanceById(editor_id).select();

	if (tinyMCE.selectedInstance)
		return tinyMCE.selectedInstance.getHTML();

	return null;
};

TinyMCE_Engine.prototype._fixListElements = function(d) {
	var nl, x, a = ['ol', 'ul'], i, n, p, r = new RegExp('^(OL|UL)$'), np;

	for (x=0; x<a.length; x++) {
		nl = d.getElementsByTagName(a[x]);

		for (i=0; i<nl.length; i++) {
			n = nl[i];
			p = n.parentNode;

			if (r.test(p.nodeName)) {
				np = tinyMCE.prevNode(n, 'LI');

				if (!np) {
					np = d.createElement('li');
					np.innerHTML = '&nbsp;';
					np.appendChild(n);
					p.insertBefore(np, p.firstChild);
				} else
					np.appendChild(n);
			}
		}
	}
};

TinyMCE_Engine.prototype._fixTables = function(d) {
	var nl, i, n, p, np, x, t;

	nl = d.getElementsByTagName('table');
	for (i=0; i<nl.length; i++) {
		n = nl[i];

		if ((p = tinyMCE.getParentElement(n, 'p,div,h1,h2,h3,h4,h5,h6')) != null) {
			np = p.cloneNode(false);
			np.removeAttribute('id');

			t = n;

			while ((n = n.nextSibling))
				np.appendChild(n);

			tinyMCE.insertAfter(np, p);
			tinyMCE.insertAfter(t, p);
		}
	}
};

TinyMCE_Engine.prototype._cleanupHTML = function(inst, doc, config, elm, visual, on_save, on_submit, inn) {
	var h, d, t1, t2, t3, t4, t5, c, s, nb;

	if (!tinyMCE.getParam('cleanup'))
		return elm.innerHTML;

	on_save = typeof(on_save) == 'undefined' ? false : on_save;

	c = inst.cleanup;
	s = inst.settings;
	d = c.settings.debug;

	if (d)
		t1 = new Date().getTime();

	if (tinyMCE.getParam("convert_fonts_to_spans"))
		tinyMCE.convertFontsToSpans(doc);

	if (tinyMCE.getParam("fix_list_elements"))
		tinyMCE._fixListElements(doc);

	if (tinyMCE.getParam("fix_table_elements"))
		tinyMCE._fixTables(doc);

	// Call custom cleanup code
	tinyMCE._customCleanup(inst, on_save ? "get_from_editor_dom" : "insert_to_editor_dom", doc.body);

	if (d)
		t2 = new Date().getTime();

	c.settings.on_save = on_save;
	//for (var i=0; i<100; i++)

	c.idCount = 0;
	c.serializationId++;
	c.serializedNodes = new Array();
	c.sourceIndex = -1;

	if (s.cleanup_serializer == "xml")
		h = c.serializeNodeAsXML(elm, inn);
	else
		h = c.serializeNodeAsHTML(elm, inn);

	if (d)
		t3 = new Date().getTime();

	// Post processing
	nb = tinyMCE.getParam('entity_encoding') == 'numeric' ? '&#160;' : '&nbsp;';
	h = h.replace(/<\/?(body|head|html)[^>]*>/gi, '');
	h = h.replace(new RegExp(' (rowspan="1"|colspan="1")', 'g'), '');
	h = h.replace(/<p><hr \/><\/p>/g, '<hr />');
	h = h.replace(/<p>(&nbsp;|&#160;)<\/p><hr \/><p>(&nbsp;|&#160;)<\/p>/g, '<hr />');
	h = h.replace(/<td>\s*<br \/>\s*<\/td>/g, '<td>' + nb + '</td>');
	h = h.replace(/<p>\s*<br \/>\s*<\/p>/g, '<p>' + nb + '</p>');
	h = h.replace(/<br \/>$/, ''); // Remove last BR for Gecko
	h = h.replace(/<br \/><\/p>/g, '</p>'); // Remove last BR in P tags for Gecko
	h = h.replace(/<p>\s*(&nbsp;|&#160;)\s*<br \/>\s*(&nbsp;|&#160;)\s*<\/p>/g, '<p>' + nb + '</p>');
	h = h.replace(/<p>\s*(&nbsp;|&#160;)\s*<br \/>\s*<\/p>/g, '<p>' + nb + '</p>');
	h = h.replace(/<p>\s*<br \/>\s*&nbsp;\s*<\/p>/g, '<p>' + nb + '</p>');
	h = h.replace(new RegExp('<a>(.*?)<\\/a>', 'g'), '$1');
	h = h.replace(/<p([^>]*)>\s*<\/p>/g, '<p$1>' + nb + '</p>');

	// Clean body
	if (/^\s*(<br \/>|<p>&nbsp;<\/p>|<p>&#160;<\/p>|<p><\/p>)\s*$/.test(h))
		h = '';

	// If preformatted
	if (s.preformatted) {
		h = h.replace(/^<pre>/, '');
		h = h.replace(/<\/pre>$/, '');
		h = '<pre>' + h + '</pre>';
	}

	// Gecko specific processing
	if (tinyMCE.isGecko) {
		h = h.replace(/<o:p _moz-userdefined="" \/>/g, '');
		h = h.replace(/<td([^>]*)>\s*<br \/>\s*<\/td>/g, '<td$1>' + nb + '</td>');
	}

	if (s.force_br_newlines)
		h = h.replace(/<p>(&nbsp;|&#160;)<\/p>/g, '<br />');

	// Call custom cleanup code
	h = tinyMCE._customCleanup(inst, on_save ? "get_from_editor" : "insert_to_editor", h);

	// Remove internal classes
	if (on_save) {
		h = h.replace(new RegExp(' ?(mceItem[a-zA-Z0-9]*|' + s.visual_table_class + ')', 'g'), '');
		h = h.replace(new RegExp(' ?class=""', 'g'), '');
	}

	if (s.remove_linebreaks && !c.settings.indent)
		h = h.replace(/\n|\r/g, ' ');

	if (d)
		t4 = new Date().getTime();

	if (on_save && c.settings.indent)
		h = c.formatHTML(h);

	// If encoding (not recommended option)
	if (on_submit && (s.encoding == "xml" || s.encoding == "html"))
		h = c.xmlEncode(h);

	if (d)
		t5 = new Date().getTime();

	if (c.settings.debug)
		tinyMCE.debug("Cleanup in ms: Pre=" + (t2-t1) + ", Serialize: " + (t3-t2) + ", Post: " + (t4-t3) + ", Format: " + (t5-t4) + ", Sum: " + (t5-t1) + ".");

	return h;
};

function TinyMCE_Cleanup() {
	this.isIE = (navigator.appName == "Microsoft Internet Explorer");
	this.rules = tinyMCE.clearArray(new Array());

	// Default config
	this.settings = {
		indent_elements : 'head,table,tbody,thead,tfoot,form,tr,ul,ol,blockquote,object',
		newline_before_elements : 'h1,h2,h3,h4,h5,h6,pre,address,div,ul,ol,li,meta,option,area,title,link,base,script,td',
		newline_after_elements : 'br,hr,p,pre,address,div,ul,ol,meta,option,area,link,base,script',
		newline_before_after_elements : 'html,head,body,table,thead,tbody,tfoot,tr,form,ul,ol,blockquote,p,object,param,hr,div',
		indent_char : '\t',
		indent_levels : 1,
		entity_encoding : 'raw',
		valid_elements : '*[*]',
		entities : '',
		url_converter : '',
		invalid_elements : '',
		verify_html : false
	};

	this.vElements = tinyMCE.clearArray(new Array());
	this.vElementsRe = '';
	this.closeElementsRe = /^(IMG|BR|HR|LINK|META|BASE|INPUT|AREA)$/;
	this.codeElementsRe = /^(SCRIPT|STYLE)$/;
	this.serializationId = 0;
	this.mceAttribs = {
		href : 'mce_href',
		src : 'mce_src',
		type : 'mce_type'
	};
}

TinyMCE_Cleanup.prototype = {
	init : function(s) {
		var n, a, i, ir, or, st;

		for (n in s)
			this.settings[n] = s[n];

		// Setup code formating
		s = this.settings;

		// Setup regexps
		this.inRe = this._arrayToRe(s.indent_elements.split(','), '', '^<(', ')[^>]*');
		this.ouRe = this._arrayToRe(s.indent_elements.split(','), '', '^<\\/(', ')[^>]*');
		this.nlBeforeRe = this._arrayToRe(s.newline_before_elements.split(','), 'gi', '<(',  ')([^>]*)>');
		this.nlAfterRe = this._arrayToRe(s.newline_after_elements.split(','), 'gi', '<(',  ')([^>]*)>');
		this.nlBeforeAfterRe = this._arrayToRe(s.newline_before_after_elements.split(','), 'gi', '<(\\/?)(', ')([^>]*)>');
		this.serializedNodes = [];

		if (s.invalid_elements != '')
			this.iveRe = this._arrayToRe(s.invalid_elements.toUpperCase().split(','), 'g', '^(', ')$');
		else
			this.iveRe = null;

		// Setup separator
		st = '';
		for (i=0; i<s.indent_levels; i++)
			st += s.indent_char;

		this.inStr = st;

		// If verify_html if false force *[*]
		if (!s.verify_html) {
			s.valid_elements = '*[*]';
			s.extended_valid_elements = '';
		}

		this.fillStr = s.entity_encoding == "named" ? "&nbsp;" : "&#160;";
		this.idCount = 0;
	},

	addRuleStr : function(s) {
		var r = this.parseRuleStr(s);
		var n;

		for (n in r) {
			if (r[n])
				this.rules[n] = r[n];
		}

		this.vElements = tinyMCE.clearArray(new Array());

		for (n in this.rules) {
			if (this.rules[n])
				this.vElements[this.vElements.length] = this.rules[n].tag;
		}

		this.vElementsRe = this._arrayToRe(this.vElements, '');
	},

	isValid : function(n) {
		this._setupRules(); // Will initialize cleanup rules

		// Clean the name up a bit
		n = n.replace(/[^a-z0-9]+/gi, '').toUpperCase();

		return !tinyMCE.getParam('cleanup') || this.vElementsRe.test(n);
	},

	addChildRemoveRuleStr : function(s) {
		var x, y, p, i, t, tn, ta, cl, r;

		if (!s)
			return;

		ta = s.split(',');
		for (x=0; x<ta.length; x++) {
			s = ta[x];

			// Split tag/children
			p = this.split(/\[|\]/, s);
			if (p == null || p.length < 1)
				t = s.toUpperCase();
			else
				t = p[0].toUpperCase();

			// Handle all tag names
			tn = this.split('/', t);
			for (y=0; y<tn.length; y++) {
				r = "^(";

				// Build regex
				cl = this.split(/\|/, p[1]);
				for (i=0; i<cl.length; i++) {
					if (cl[i] == '%istrict')
						r += tinyMCE.inlineStrict;
					else if (cl[i] == '%itrans')
						r += tinyMCE.inlineTransitional;
					else if (cl[i] == '%istrict_na')
						r += tinyMCE.inlineStrict.substring(2);
					else if (cl[i] == '%itrans_na')
						r += tinyMCE.inlineTransitional.substring(2);
					else if (cl[i] == '%btrans')
						r += tinyMCE.blockElms;
					else if (cl[i] == '%strict')
						r += tinyMCE.blockStrict;
					else
						r += (cl[i].charAt(0) != '#' ? cl[i].toUpperCase() : cl[i]);

					r += (i != cl.length - 1 ? '|' : '');
				}

				r += ')$';
//tinyMCE.debug(t + "=" + r);
				if (this.childRules == null)
					this.childRules = tinyMCE.clearArray(new Array());

				this.childRules[tn[y]] = new RegExp(r);

				if (p.length > 1)
					this.childRules[tn[y]].wrapTag = p[2];
			}
		}
	},

	parseRuleStr : function(s) {
		var ta, p, r, a, i, x, px, t, tn, y, av, or = tinyMCE.clearArray(new Array()), dv;

		if (s == null || s.length == 0)
			return or;

		ta = s.split(',');
		for (x=0; x<ta.length; x++) {
			s = ta[x];
			if (s.length == 0)
				continue;

			// Split tag/attrs
			p = this.split(/\[|\]/, s);
			if (p == null || p.length < 1)
				t = s.toUpperCase();
			else
				t = p[0].toUpperCase();

			// Handle all tag names
			tn = this.split('/', t);
			for (y=0; y<tn.length; y++) {
				r = {};

				r.tag = tn[y];
				r.forceAttribs = null;
				r.defaultAttribs = null;
				r.validAttribValues = null;

				// Handle prefixes
				px = r.tag.charAt(0);
				r.forceOpen = px == '+';
				r.removeEmpty = px == '-';
				r.fill = px == '#';
				r.tag = r.tag.replace(/\+|-|#/g, '');
				r.oTagName = tn[0].replace(/\+|-|#/g, '').toLowerCase();
				r.isWild = new RegExp('\\*|\\?|\\+', 'g').test(r.tag);
				r.validRe = new RegExp(this._wildcardToRe('^' + r.tag + '$'));

				// Setup valid attributes
				if (p.length > 1) {
					r.vAttribsRe = '^(';
					a = this.split(/\|/, p[1]);

					for (i=0; i<a.length; i++) {
						t = a[i];

						if (t.charAt(0) == '!') {
							a[i] = t = t.substring(1);

							if (!r.reqAttribsRe)
								r.reqAttribsRe = '\\s+(' + t;
							else
								r.reqAttribsRe += '|' + t;
						}

						av = new RegExp('(=|:|<)(.*?)$').exec(t);
						t = t.replace(new RegExp('(=|:|<).*?$'), '');
						if (av && av.length > 0) {
							if (av[0].charAt(0) == ':') {
								if (!r.forceAttribs)
									r.forceAttribs = tinyMCE.clearArray(new Array());

								r.forceAttribs[t.toLowerCase()] = av[0].substring(1);
							} else if (av[0].charAt(0) == '=') {
								if (!r.defaultAttribs)
									r.defaultAttribs = tinyMCE.clearArray(new Array());

								dv = av[0].substring(1);

								r.defaultAttribs[t.toLowerCase()] = dv == "" ? "mce_empty" : dv;
							} else if (av[0].charAt(0) == '<') {
								if (!r.validAttribValues)
									r.validAttribValues = tinyMCE.clearArray(new Array());

								r.validAttribValues[t.toLowerCase()] = this._arrayToRe(this.split('?', av[0].substring(1)), 'i');
							}
						}

						r.vAttribsRe += '' + t.toLowerCase() + (i != a.length - 1 ? '|' : '');

						a[i] = t.toLowerCase();
					}

					if (r.reqAttribsRe)
						r.reqAttribsRe = new RegExp(r.reqAttribsRe + ')=\"', 'g');

					r.vAttribsRe += ')$';
					r.vAttribsRe = this._wildcardToRe(r.vAttribsRe);
					r.vAttribsReIsWild = new RegExp('\\*|\\?|\\+', 'g').test(r.vAttribsRe);
					r.vAttribsRe = new RegExp(r.vAttribsRe);
					r.vAttribs = a.reverse();

					//tinyMCE.debug(r.tag, r.oTagName, r.vAttribsRe, r.vAttribsReWC);
				} else {
					r.vAttribsRe = '';
					r.vAttribs = tinyMCE.clearArray(new Array());
					r.vAttribsReIsWild = false;
				}

				or[r.tag] = r;
			}
		}

		return or;
	},

	serializeNodeAsXML : function(n) {
		var s, b;

		if (!this.xmlDoc) {
			if (this.isIE) {
				try {this.xmlDoc = new ActiveXObject('MSXML2.DOMDocument');} catch (e) {}

				if (!this.xmlDoc)
					try {this.xmlDoc = new ActiveXObject('Microsoft.XmlDom');} catch (e) {}
			} else
				this.xmlDoc = document.implementation.createDocument('', '', null);

			if (!this.xmlDoc)
				alert("Error XML Parser could not be found.");
		}

		if (this.xmlDoc.firstChild)
			this.xmlDoc.removeChild(this.xmlDoc.firstChild);

		b = this.xmlDoc.createElement("html");
		b = this.xmlDoc.appendChild(b);

		this._convertToXML(n, b);

		if (this.isIE)
			return this.xmlDoc.xml;
		else
			return new XMLSerializer().serializeToString(this.xmlDoc);
	},

	_convertToXML : function(n, xn) {
		var xd, el, i, l, cn, at, no, hc = false;

		if (this._isDuplicate(n))
			return;

		xd = this.xmlDoc;

		switch (n.nodeType) {
			case 1: // Element
				hc = n.hasChildNodes();

				el = xd.createElement(n.nodeName.toLowerCase());

				at = n.attributes;
				for (i=at.length-1; i>-1; i--) {
					no = at[i];

					if (no.specified && no.nodeValue)
						el.setAttribute(no.nodeName.toLowerCase(), no.nodeValue);
				}

				if (!hc && !this.closeElementsRe.test(n.nodeName))
					el.appendChild(xd.createTextNode(""));

				xn = xn.appendChild(el);
				break;

			case 3: // Text
				xn.appendChild(xd.createTextNode(n.nodeValue));
				return;

			case 8: // Comment
				xn.appendChild(xd.createComment(n.nodeValue));
				return;
		}

		if (hc) {
			cn = n.childNodes;

			for (i=0, l=cn.length; i<l; i++)
				this._convertToXML(cn[i], xn);
		}
	},

	serializeNodeAsHTML : function(n, inn) {
		var en, no, h = '', i, l, t, st, r, cn, va = false, f = false, at, hc, cr;

		this._setupRules(); // Will initialize cleanup rules

		if (this._isDuplicate(n))
			return '';

		// Skip non valid child elements
		if (n.parentNode && this.childRules != null) {
			cr = this.childRules[n.parentNode.nodeName];

			if (typeof(cr) != "undefined" && !cr.test(n.nodeName)) {
				st = true;
				t = null;
			}
		}

		switch (n.nodeType) {
			case 1: // Element
				hc = n.hasChildNodes();

				if (st)
					break;

				// MSIE sometimes produces <//tag>
				if ((tinyMCE.isRealIE) && n.nodeName.indexOf('/') != -1)
					break;

				if (this.vElementsRe.test(n.nodeName) && (!this.iveRe || !this.iveRe.test(n.nodeName)) && !inn) {
					va = true;

					r = this.rules[n.nodeName];
					if (!r) {
						at = this.rules;
						for (no in at) {
							if (at[no] && at[no].validRe.test(n.nodeName)) {
								r = at[no];
								break;
							}
						}
					}

					en = r.isWild ? n.nodeName.toLowerCase() : r.oTagName;
					f = r.fill;

					if (r.removeEmpty && !hc)
						return "";

					t = '<' + en;

					if (r.vAttribsReIsWild) {
						// Serialize wildcard attributes
						at = n.attributes;
						for (i=at.length-1; i>-1; i--) {
							no = at[i];
							if (no.specified && r.vAttribsRe.test(no.nodeName))
								t += this._serializeAttribute(n, r, no.nodeName);
						}
					} else {
						// Serialize specific attributes
						for (i=r.vAttribs.length-1; i>-1; i--)
							t += this._serializeAttribute(n, r, r.vAttribs[i]);
					}

					// Serialize mce_ atts
					if (!this.settings.on_save) {
						at = this.mceAttribs;

						for (no in at) {
							if (at[no])
								t += this._serializeAttribute(n, r, at[no]);
						}
					}

					// Check for required attribs
					if (r.reqAttribsRe && !t.match(r.reqAttribsRe))
						t = null;

					// Close these
					if (t != null && this.closeElementsRe.test(n.nodeName))
						return t + ' />';

					if (t != null)
						h += t + '>';

					if (this.isIE && this.codeElementsRe.test(n.nodeName))
						h += n.innerHTML;
				}
			break;

			case 3: // Text
				if (st)
					break;

				if (n.parentNode && this.codeElementsRe.test(n.parentNode.nodeName))
					return this.isIE ? '' : n.nodeValue;

				return this.xmlEncode(n.nodeValue);

			case 8: // Comment
				if (st)
					break;

				return "<!--" + this._trimComment(n.nodeValue) + "-->";
		}

		if (hc) {
			cn = n.childNodes;

			for (i=0, l=cn.length; i<l; i++)
				h += this.serializeNodeAsHTML(cn[i]);
		}

		// Fill empty nodes
		if (f && !hc)
			h += this.fillStr;

		// End element
		if (t != null && va)
			h += '</' + en + '>';

		return h;
	},

	_serializeAttribute : function(n, r, an) {
		var av = '', t, os = this.settings.on_save;

		if (os && (an.indexOf('mce_') == 0 || an.indexOf('_moz') == 0))
			return '';

		if (os && this.mceAttribs[an])
			av = this._getAttrib(n, this.mceAttribs[an]);

		if (av.length == 0)
			av = this._getAttrib(n, an);

		if (av.length == 0 && r.defaultAttribs && (t = r.defaultAttribs[an])) {
			av = t;

			if (av == "mce_empty")
				return " " + an + '=""';
		}

		if (r.forceAttribs && (t = r.forceAttribs[an]))
			av = t;

		if (os && av.length != 0 && this.settings.url_converter.length != 0 && /^(src|href|longdesc)$/.test(an))
			av = eval(this.settings.url_converter + '(this, n, av)');

		if (av.length != 0 && r.validAttribValues && r.validAttribValues[an] && !r.validAttribValues[an].test(av))
			return "";

		if (av.length != 0 && av == "{$uid}")
			av = "uid_" + (this.idCount++);

		if (av.length != 0) {
			if (an.indexOf('on') != 0)
				av = this.xmlEncode(av);

			return " " + an + "=" + '"' + av + '"';
		}

		return "";
	},

	formatHTML : function(h) {
		var s = this.settings, p = '', i = 0, li = 0, o = '', l;

		// Replace BR in pre elements to \n
		h = h.replace(/<pre([^>]*)>(.*?)<\/pre>/gi, function (a, b, c) {
			c = c.replace(/<br\s*\/>/gi, '\n');
			return '<pre' + b + '>' + c + '</pre>';
		});

		h = h.replace(/\r/g, ''); // Windows sux, isn't carriage return a thing of the past :)
		h = '\n' + h;
		h = h.replace(new RegExp('\\n\\s+', 'gi'), '\n'); // Remove previous formatting
		h = h.replace(this.nlBeforeRe, '\n<$1$2>');
		h = h.replace(this.nlAfterRe, '<$1$2>\n');
		h = h.replace(this.nlBeforeAfterRe, '\n<$1$2$3>\n');
		h += '\n';

		//tinyMCE.debug(h);

		while ((i = h.indexOf('\n', i + 1)) != -1) {
			if ((l = h.substring(li + 1, i)).length != 0) {
				if (this.ouRe.test(l) && p.length >= s.indent_levels)
					p = p.substring(s.indent_levels);

				o += p + l + '\n';
	
				if (this.inRe.test(l))
					p += this.inStr;
			}

			li = i;
		}

		//tinyMCE.debug(h);

		return o;
	},

	xmlEncode : function(s) {
		var cl = this;

		this._setupEntities(); // Will intialize lookup table

		switch (this.settings.entity_encoding) {
			case "raw":
				return tinyMCE.xmlEncode(s);

			case "named":
				return s.replace(new RegExp('[\u007F-\uFFFF<>&"\']', 'g'), function (c, b) {
					b = cl.entities[c.charCodeAt(0)];

					return b ? '&' + b + ';' : c;
				});

			case "numeric":
				return s.replace(new RegExp('[\u007F-\uFFFF<>&"\']', 'g'), function (c, b) {
					return b ? '&#' + c.charCodeAt(0) + ';' : c;
				});
		}

		return s;
	},

	split : function(re, s) {
		var c = s.split(re);
		var i, l, o = new Array();

		for (i=0, l=c.length; i<l; i++) {
			if (c[i] != '')
				o[i] = c[i];
		}

		return o;
	},

	_trimComment : function(s) {
		// Remove mce_src, mce_href
		s = s.replace(new RegExp('\\smce_src=\"[^\"]*\"', 'gi'), "");
		s = s.replace(new RegExp('\\smce_href=\"[^\"]*\"', 'gi'), "");

		return s;
	},

	_getAttrib : function(e, n, d) {
		if (typeof(d) == "undefined")
			d = "";

		if (!e || e.nodeType != 1)
			return d;

		var v = e.getAttribute(n, 0);

		if (n == "class" && !v)
			v = e.className;

		if (this.isIE && n == "http-equiv")
			v = e.httpEquiv;

		if (this.isIE && e.nodeName == "FORM" && n == "enctype" && v == "application/x-www-form-urlencoded")
			v = "";

		if (this.isIE && e.nodeName == "INPUT" && n == "size" && v == "20")
			v = "";

		if (this.isIE && e.nodeName == "INPUT" && n == "maxlength" && v == "2147483647")
			v = "";

		if (n == "style" && !tinyMCE.isOpera)
			v = e.style.cssText;

		if (n == 'style')
			v = tinyMCE.serializeStyle(tinyMCE.parseStyle(v));

		if (this.settings.on_save && n.indexOf('on') != -1 && this.settings.on_save && v && v != "")
			v = tinyMCE.cleanupEventStr(v);

		return (v && v != "") ? '' + v : d;
	},

	_urlConverter : function(c, n, v) {
		if (!c.settings.on_save)
			return tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings.base_href, v);
		else if (tinyMCE.getParam('convert_urls'))
			return eval(tinyMCE.settings.urlconverter_callback + "(v, n, true);");

		return v;
	},

	_arrayToRe : function(a, op, be, af) {
		var i, r;

		op = typeof(op) == "undefined" ? "gi" : op;
		be = typeof(be) == "undefined" ? "^(" : be;
		af = typeof(af) == "undefined" ? ")$" : af;

		r = be;

		for (i=0; i<a.length; i++)
			r += this._wildcardToRe(a[i]) + (i != a.length-1 ? "|" : "");

		r += af;

		return new RegExp(r, op);
	},

	_wildcardToRe : function(s) {
		s = s.replace(/\?/g, '(\\S?)');
		s = s.replace(/\+/g, '(\\S+)');
		s = s.replace(/\*/g, '(\\S*)');

		return s;
	},

	_setupEntities : function() {
		var n, a, i, s = this.settings;

		// Setup entities
		if (!this.entitiesDone) {
			if (s.entity_encoding == "named") {
				n = tinyMCE.clearArray(new Array());
				a = this.split(',', s.entities);
				for (i=0; i<a.length; i+=2)
					n[a[i]] = a[i+1];

				this.entities = n;
			}

			this.entitiesDone = true;
		}
	},

	_setupRules : function() {
		var s = this.settings;

		// Setup default rule
		if (!this.rulesDone) {
			this.addRuleStr(s.valid_elements);
			this.addRuleStr(s.extended_valid_elements);
			this.addChildRemoveRuleStr(s.valid_child_elements);

			this.rulesDone = true;
		}
	},

	_isDuplicate : function(n) {
		var i;

		if (!this.settings.fix_content_duplication)
			return false;

		if (tinyMCE.isRealIE && n.nodeType == 1) {
			// Mark elements
			if (n.mce_serialized == this.serializationId)
				return true;

			n.setAttribute('mce_serialized', this.serializationId);
		} else {
			// Search lookup table for text nodes  and comments
			for (i=0; i<this.serializedNodes.length; i++) {
				if (this.serializedNodes[i] == n)
					return true;
			}

			this.serializedNodes[this.serializedNodes.length] = n;
		}

		return false;
	}

	};

/* file:jscripts/tiny_mce/classes/TinyMCE_DOMUtils.class.js */

TinyMCE_Engine.prototype.createTagHTML = function(tn, a, h) {
	var o = '', f = tinyMCE.xmlEncode;

	o = '<' + tn;

	if (a) {
		for (n in a) {
			if (typeof(a[n]) != 'function' && a[n] != null)
				o += ' ' + f(n) + '="' + f('' + a[n]) + '"';
		}
	}

	o += !h ? ' />' : '>' + h + '</' + tn + '>';

	return o;
};

TinyMCE_Engine.prototype.createTag = function(d, tn, a, h) {
	var o = d.createElement(tn);

	if (a) {
		for (n in a) {
			if (typeof(a[n]) != 'function' && a[n] != null)
				tinyMCE.setAttrib(o, n, a[n]);
		}
	}

	if (h)
		o.innerHTML = h;

	return o;
};

TinyMCE_Engine.prototype.getElementByAttributeValue = function(n, e, a, v) {
	return (n = this.getElementsByAttributeValue(n, e, a, v)).length == 0 ? null : n[0];
};

TinyMCE_Engine.prototype.getElementsByAttributeValue = function(n, e, a, v) {
	var i, nl = n.getElementsByTagName(e), o = new Array();

	for (i=0; i<nl.length; i++) {
		if (tinyMCE.getAttrib(nl[i], a).indexOf(v) != -1)
			o[o.length] = nl[i];
	}

	return o;
};

TinyMCE_Engine.prototype.isBlockElement = function(n) {
	return n != null && n.nodeType == 1 && this.blockRegExp.test(n.nodeName);
};

TinyMCE_Engine.prototype.getParentBlockElement = function(n, r) {
	return this.getParentNode(n, function(n) {
		return tinyMCE.isBlockElement(n);
	}, r);

	return null;
};

TinyMCE_Engine.prototype.insertAfter = function(n, r){
	if (r.nextSibling)
		r.parentNode.insertBefore(n, r.nextSibling);
	else
		r.parentNode.appendChild(n);
};

TinyMCE_Engine.prototype.setInnerHTML = function(e, h) {
	var i, nl, n;

	// Convert all strong/em to b/i in Gecko
	if (tinyMCE.isGecko) {
		h = h.replace(/<strong/gi, '<b');
		h = h.replace(/<em(\/?)/gi, '<i');
		h = h.replace(/<em /gi, '<i');
		h = h.replace(/<\/strong>/gi, '</b>');
		h = h.replace(/<\/em>/gi, '</i>');
	}

	if (tinyMCE.isRealIE) {
		// Since MSIE handles invalid HTML better that valid XHTML we
		// need to make some things invalid. <hr /> gets converted to <hr>.
		h = h.replace(/\s\/>/g, '>');

		// Since MSIE auto generated emtpy P tags some times we must tell it to keep the real ones
		h = h.replace(/<p([^>]*)>\u00A0?<\/p>/gi, '<p$1 mce_keep="true">&nbsp;</p>'); // Keep empty paragraphs
		h = h.replace(/<p([^>]*)>\s*&nbsp;\s*<\/p>/gi, '<p$1 mce_keep="true">&nbsp;</p>'); // Keep empty paragraphs
		h = h.replace(/<p([^>]*)>\s+<\/p>/gi, '<p$1 mce_keep="true">&nbsp;</p>'); // Keep empty paragraphs

		// Remove first comment
		e.innerHTML = tinyMCE.uniqueTag + h;
		e.firstChild.removeNode(true);

		// Remove weird auto generated empty paragraphs unless it's supposed to be there
		nl = e.getElementsByTagName("p");
		for (i=nl.length-1; i>=0; i--) {
			n = nl[i];

			if (n.nodeName == 'P' && !n.hasChildNodes() && !n.mce_keep)
				n.parentNode.removeChild(n);
		}
	} else {
		h = this.fixGeckoBaseHREFBug(1, e, h);
		e.innerHTML = h;
		this.fixGeckoBaseHREFBug(2, e, h);
	}
};

TinyMCE_Engine.prototype.getOuterHTML = function(e) {
	if (tinyMCE.isIE)
		return e.outerHTML;

	var d = e.ownerDocument.createElement("body");
	d.appendChild(e.cloneNode(true));
	return d.innerHTML;
};

TinyMCE_Engine.prototype.setOuterHTML = function(e, h, d) {
	var d = typeof(d) == "undefined" ? e.ownerDocument : d, i, nl, t;

	if (tinyMCE.isIE && e.nodeType == 1)
		e.outerHTML = h;
	else {
		t = d.createElement("body");
		t.innerHTML = h;

		for (i=0, nl=t.childNodes; i<nl.length; i++)
			e.parentNode.insertBefore(nl[i].cloneNode(true), e);

		e.parentNode.removeChild(e);
	}
};

TinyMCE_Engine.prototype._getElementById = function(id, d) {
	var e, i, j, f;

	if (typeof(d) == "undefined")
		d = document;

	e = d.getElementById(id);
	if (!e) {
		f = d.forms;

		for (i=0; i<f.length; i++) {
			for (j=0; j<f[i].elements.length; j++) {
				if (f[i].elements[j].name == id) {
					e = f[i].elements[j];
					break;
				}
			}
		}
	}

	return e;
};

TinyMCE_Engine.prototype.getNodeTree = function(n, na, t, nn) {
	return this.selectNodes(n, function(n) {
		return (!t || n.nodeType == t) && (!nn || n.nodeName == nn);
	}, na ? na : new Array());
};

TinyMCE_Engine.prototype.getParentElement = function(n, na, f, r) {
	var re = na ? new RegExp('^(' + na.toUpperCase().replace(/,/g, '|') + ')$') : 0, v;

	// Compatiblity with old scripts where f param was a attribute string
	if (f && typeof(f) == 'string')
		return this.getParentElement(n, na, function(no) {return tinyMCE.getAttrib(no, f) != '';});

	return this.getParentNode(n, function(n) {
		return ((n.nodeType == 1 && !re) || (re && re.test(n.nodeName))) && (!f || f(n));
	}, r);
};

TinyMCE_Engine.prototype.getParentNode = function(n, f, r) {
	while (n) {
		if (n == r)
			return null;

		if (f(n))
			return n;

		n = n.parentNode;
	}

	return null;
};

TinyMCE_Engine.prototype.getAttrib = function(elm, name, dv) {
	var v;

	if (typeof(dv) == "undefined")
		dv = "";

	// Not a element
	if (!elm || elm.nodeType != 1)
		return dv;

	v = elm.getAttribute(name);

	// Try className for class attrib
	if (name == "class" && !v)
		v = elm.className;

	// Workaround for a issue with Firefox 1.5rc2+
	if (tinyMCE.isGecko && name == "src" && elm.src != null && elm.src != "")
		v = elm.src;

	// Workaround for a issue with Firefox 1.5rc2+
	if (tinyMCE.isGecko && name == "href" && elm.href != null && elm.href != "")
		v = elm.href;

	if (name == "http-equiv" && tinyMCE.isIE)
		v = elm.httpEquiv;

	if (name == "style" && !tinyMCE.isOpera)
		v = elm.style.cssText;

	return (v && v != "") ? v : dv;
};

TinyMCE_Engine.prototype.setAttrib = function(el, name, va, fix) {
	if (typeof(va) == "number" && va != null)
		va = "" + va;

	if (fix) {
		if (va == null)
			va = "";

		va = va.replace(/[^0-9%]/g, '');
	}

	if (name == "style")
		el.style.cssText = va;

	if (name == "class")
		el.className = va;

	if (va != null && va != "" && va != -1)
		el.setAttribute(name, va);
	else
		el.removeAttribute(name);
};

TinyMCE_Engine.prototype.setStyleAttrib = function(e, n, v) {
	e.style[n] = v;

	// Style attrib deleted in IE
	if (tinyMCE.isIE && v == null || v == '') {
		v = tinyMCE.serializeStyle(tinyMCE.parseStyle(e.style.cssText));
		e.style.cssText = v;
		e.setAttribute("style", v);
	}
};

TinyMCE_Engine.prototype.switchClass = function(ei, c) {
	var e;

	if (tinyMCE.switchClassCache[ei])
		e = tinyMCE.switchClassCache[ei];
	else
		e = tinyMCE.switchClassCache[ei] = document.getElementById(ei);

	if (e) {
		// Keep tile mode
		if (tinyMCE.settings.button_tile_map && e.className && e.className.indexOf('mceTiledButton') == 0)
			c = 'mceTiledButton ' + c;

		e.className = c;
	}
};

TinyMCE_Engine.prototype.getAbsPosition = function(n, cn) {
	var l = 0, t = 0;

	while (n && n != cn) {
		l += n.offsetLeft;
		t += n.offsetTop;
		n = n.offsetParent;
	}

	return {absLeft : l, absTop : t};
};

TinyMCE_Engine.prototype.prevNode = function(e, n) {
	var a = n.split(','), i;

	while ((e = e.previousSibling) != null) {
		for (i=0; i<a.length; i++) {
			if (e.nodeName == a[i])
				return e;
		}
	}

	return null;
};

TinyMCE_Engine.prototype.nextNode = function(e, n) {
	var a = n.split(','), i;

	while ((e = e.nextSibling) != null) {
		for (i=0; i<a.length; i++) {
			if (e.nodeName == a[i])
				return e;
		}
	}

	return null;
};

TinyMCE_Engine.prototype.selectElements = function(n, na, f) {
	var i, a = [], nl, x;

	for (x=0, na = na.split(','); x<na.length; x++)
		for (i=0, nl = n.getElementsByTagName(na[x]); i<nl.length; i++)
			(!f || f(nl[i])) && a.push(nl[i]);

	return a;
};

TinyMCE_Engine.prototype.selectNodes = function(n, f, a) {
	var i;

	if (!a)
		a = new Array();

	if (f(n))
		a[a.length] = n;

	if (n.hasChildNodes()) {
		for (i=0; i<n.childNodes.length; i++)
			tinyMCE.selectNodes(n.childNodes[i], f, a);
	}

	return a;
};

TinyMCE_Engine.prototype.addCSSClass = function(e, c, b) {
	var o = this.removeCSSClass(e, c);
	return e.className = b ? c + (o != '' ? (' ' + o) : '') : (o != '' ? (o + ' ') : '') + c;
};

TinyMCE_Engine.prototype.removeCSSClass = function(e, c) {
	c = e.className.replace(new RegExp("(^|\\s+)" + c + "(\\s+|$)"), ' ');
	return e.className = c != ' ' ? c : '';
};

TinyMCE_Engine.prototype.hasCSSClass = function(n, c) {
	return new RegExp('\\b' + c + '\\b', 'g').test(n.className);
};

TinyMCE_Engine.prototype.renameElement = function(e, n, d) {
	var ne, i, ar;

	d = typeof(d) == "undefined" ? tinyMCE.selectedInstance.getDoc() : d;

	if (e) {
		ne = d.createElement(n);

		ar = e.attributes;
		for (i=ar.length-1; i>-1; i--) {
			if (ar[i].specified && ar[i].nodeValue)
				ne.setAttribute(ar[i].nodeName.toLowerCase(), ar[i].nodeValue);
		}

		ar = e.childNodes;
		for (i=0; i<ar.length; i++)
			ne.appendChild(ar[i].cloneNode(true));

		e.parentNode.replaceChild(ne, e);
	}
};

TinyMCE_Engine.prototype.getViewPort = function(w) {
	var d = w.document, m = d.compatMode == 'CSS1Compat', b = d.body, de = d.documentElement;

	return {
		left : w.pageXOffset || (m ? de.scrollLeft : b.scrollLeft),
		top : w.pageYOffset || (m ? de.scrollTop : b.scrollTop),
		width : w.innerWidth || (m ? de.clientWidth : b.clientWidth),
		height : w.innerHeight || (m ? de.clientHeight : b.clientHeight)
	};
};

/* file:jscripts/tiny_mce/classes/TinyMCE_URL.class.js */

TinyMCE_Engine.prototype.parseURL = function(url_str) {
	var urlParts = new Array();

	if (url_str) {
		var pos, lastPos;

		// Parse protocol part
		pos = url_str.indexOf('://');
		if (pos != -1) {
			urlParts['protocol'] = url_str.substring(0, pos);
			lastPos = pos + 3;
		}

		// Find port or path start
		for (var i=lastPos; i<url_str.length; i++) {
			var chr = url_str.charAt(i);

			if (chr == ':')
				break;

			if (chr == '/')
				break;
		}
		pos = i;

		// Get host
		urlParts['host'] = url_str.substring(lastPos, pos);

		// Get port
		urlParts['port'] = "";
		lastPos = pos;
		if (url_str.charAt(pos) == ':') {
			pos = url_str.indexOf('/', lastPos);
			urlParts['port'] = url_str.substring(lastPos+1, pos);
		}

		// Get path
		lastPos = pos;
		pos = url_str.indexOf('?', lastPos);

		if (pos == -1)
			pos = url_str.indexOf('#', lastPos);

		if (pos == -1)
			pos = url_str.length;

		urlParts['path'] = url_str.substring(lastPos, pos);

		// Get query
		lastPos = pos;
		if (url_str.charAt(pos) == '?') {
			pos = url_str.indexOf('#');
			pos = (pos == -1) ? url_str.length : pos;
			urlParts['query'] = url_str.substring(lastPos+1, pos);
		}

		// Get anchor
		lastPos = pos;
		if (url_str.charAt(pos) == '#') {
			pos = url_str.length;
			urlParts['anchor'] = url_str.substring(lastPos+1, pos);
		}
	}

	return urlParts;
};

TinyMCE_Engine.prototype.serializeURL = function(up) {
	var o = "";

	if (up['protocol'])
		o += up['protocol'] + "://";

	if (up['host'])
		o += up['host'];

	if (up['port'])
		o += ":" + up['port'];

	if (up['path'])
		o += up['path'];

	if (up['query'])
		o += "?" + up['query'];

	if (up['anchor'])
		o += "#" + up['anchor'];

	return o;
};

TinyMCE_Engine.prototype.convertAbsoluteURLToRelativeURL = function(base_url, url_to_relative) {
	var baseURL = this.parseURL(base_url);
	var targetURL = this.parseURL(url_to_relative);
	var strTok1;
	var strTok2;
	var breakPoint = 0;
	var outPath = "";
	var forceSlash = false;

	if (targetURL.path == "")
		targetURL.path = "/";
	else
		forceSlash = true;

	// Crop away last path part
	base_url = baseURL.path.substring(0, baseURL.path.lastIndexOf('/'));
	strTok1 = base_url.split('/');
	strTok2 = targetURL.path.split('/');

	if (strTok1.length >= strTok2.length) {
		for (var i=0; i<strTok1.length; i++) {
			if (i >= strTok2.length || strTok1[i] != strTok2[i]) {
				breakPoint = i + 1;
				break;
			}
		}
	}

	if (strTok1.length < strTok2.length) {
		for (var i=0; i<strTok2.length; i++) {
			if (i >= strTok1.length || strTok1[i] != strTok2[i]) {
				breakPoint = i + 1;
				break;
			}
		}
	}

	if (breakPoint == 1)
		return targetURL.path;

	for (var i=0; i<(strTok1.length-(breakPoint-1)); i++)
		outPath += "../";

	for (var i=breakPoint-1; i<strTok2.length; i++) {
		if (i != (breakPoint-1))
			outPath += "/" + strTok2[i];
		else
			outPath += strTok2[i];
	}

	targetURL.protocol = null;
	targetURL.host = null;
	targetURL.port = null;
	targetURL.path = outPath == "" && forceSlash ? "/" : outPath;

	// Remove document prefix from local anchors
	var fileName = baseURL.path;
	var pos;

	if ((pos = fileName.lastIndexOf('/')) != -1)
		fileName = fileName.substring(pos + 1);

	// Is local anchor
	if (fileName == targetURL.path && targetURL.anchor != "")
		targetURL.path = "";

	// If empty and not local anchor force filename or slash
	if (targetURL.path == "" && !targetURL.anchor)
		targetURL.path = fileName != "" ? fileName : "/";

	return this.serializeURL(targetURL);
};

TinyMCE_Engine.prototype.convertRelativeToAbsoluteURL = function(base_url, relative_url) {
	var baseURL = this.parseURL(base_url), baseURLParts, relURLParts;
	var relURL = this.parseURL(relative_url);

	if (relative_url == "" || relative_url.indexOf('://') != -1 || /^(mailto:|javascript:|#|\/)/.test(relative_url))
		return relative_url;

	// Split parts
	baseURLParts = baseURL['path'].split('/');
	relURLParts = relURL['path'].split('/');

	// Remove empty chunks
	var newBaseURLParts = new Array();
	for (var i=baseURLParts.length-1; i>=0; i--) {
		if (baseURLParts[i].length == 0)
			continue;

		newBaseURLParts[newBaseURLParts.length] = baseURLParts[i];
	}
	baseURLParts = newBaseURLParts.reverse();

	// Merge relURLParts chunks
	var newRelURLParts = new Array();
	var numBack = 0;
	for (var i=relURLParts.length-1; i>=0; i--) {
		if (relURLParts[i].length == 0 || relURLParts[i] == ".")
			continue;

		if (relURLParts[i] == '..') {
			numBack++;
			continue;
		}

		if (numBack > 0) {
			numBack--;
			continue;
		}

		newRelURLParts[newRelURLParts.length] = relURLParts[i];
	}

	relURLParts = newRelURLParts.reverse();

	// Remove end from absolute path
	var len = baseURLParts.length-numBack;
	var absPath = (len <= 0 ? "" : "/") + baseURLParts.slice(0, len).join('/') + "/" + relURLParts.join('/');
	var start = "", end = "";

	// Build output URL
	relURL.protocol = baseURL.protocol;
	relURL.host = baseURL.host;
	relURL.port = baseURL.port;

	// Re-add trailing slash if it's removed
	if (relURL.path.charAt(relURL.path.length-1) == "/")
		absPath += "/";

	relURL.path = absPath;

	return this.serializeURL(relURL);
};

TinyMCE_Engine.prototype.convertURL = function(url, node, on_save) {
	var prot = document.location.protocol;
	var host = document.location.hostname;
	var port = document.location.port;

	// Pass through file protocol
	if (prot == "file:")
		return url;

	// Something is wrong, remove weirdness
	url = tinyMCE.regexpReplace(url, '(http|https):///', '/');

	// Mailto link or anchor (Pass through)
	if (url.indexOf('mailto:') != -1 || url.indexOf('javascript:') != -1 || tinyMCE.regexpReplace(url,'[ \t\r\n\+]|%20','').charAt(0) == "#")
		return url;

	// Fix relative/Mozilla
	if (!tinyMCE.isIE && !on_save && url.indexOf("://") == -1 && url.charAt(0) != '/')
		return tinyMCE.settings['base_href'] + url;

	// Handle relative URLs
	if (on_save && tinyMCE.getParam('relative_urls')) {
		var curl = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], url);
		if (curl.charAt(0) == '/')
			curl = tinyMCE.settings['document_base_prefix'] + curl;

		var urlParts = tinyMCE.parseURL(curl);
		var tmpUrlParts = tinyMCE.parseURL(tinyMCE.settings['document_base_url']);

		// Force relative
		if (urlParts['host'] == tmpUrlParts['host'] && (urlParts['port'] == tmpUrlParts['port']))
			return tinyMCE.convertAbsoluteURLToRelativeURL(tinyMCE.settings['document_base_url'], curl);
	}

	// Handle absolute URLs
	if (!tinyMCE.getParam('relative_urls')) {
		var urlParts = tinyMCE.parseURL(url);
		var baseUrlParts = tinyMCE.parseURL(tinyMCE.settings['base_href']);

		// Force absolute URLs from relative URLs
		url = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], url);

		// If anchor and path is the same page
		if (urlParts['anchor'] && urlParts['path'] == baseUrlParts['path'])
			return "#" + urlParts['anchor'];
	}

	// Remove current domain
	if (tinyMCE.getParam('remove_script_host')) {
		var start = "", portPart = "";

		if (port != "")
			portPart = ":" + port;

		start = prot + "//" + host + portPart + "/";

		if (url.indexOf(start) == 0)
			url = url.substring(start.length-1);
	}

	return url;
};

TinyMCE_Engine.prototype.convertAllRelativeURLs = function(body) {
	var i, elms, src, href, mhref, msrc;

	// Convert all image URL:s to absolute URL
	elms = body.getElementsByTagName("img");
	for (i=0; i<elms.length; i++) {
		src = tinyMCE.getAttrib(elms[i], 'src');

		msrc = tinyMCE.getAttrib(elms[i], 'mce_src');
		if (msrc != "")
			src = msrc;

		if (src != "") {
			src = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], src);
			elms[i].setAttribute("src", src);
		}
	}

	// Convert all link URL:s to absolute URL
	elms = body.getElementsByTagName("a");
	for (i=0; i<elms.length; i++) {
		href = tinyMCE.getAttrib(elms[i], 'href');

		mhref = tinyMCE.getAttrib(elms[i], 'mce_href');
		if (mhref != "")
			href = mhref;

		if (href && href != "") {
			href = tinyMCE.convertRelativeToAbsoluteURL(tinyMCE.settings['base_href'], href);
			elms[i].setAttribute("href", href);
		}
	}
};

/* file:jscripts/tiny_mce/classes/TinyMCE_Array.class.js */

TinyMCE_Engine.prototype.clearArray = function(a) {
	var n;

	for (n in a)
		a[n] = null;

	return a;
};

TinyMCE_Engine.prototype.explode = function(d, s) {
	var ar = s.split(d), oar = new Array(), i;

	for (i = 0; i<ar.length; i++) {
		if (ar[i] != "")
			oar[oar.length] = ar[i];
	}

	return oar;
};

/* file:jscripts/tiny_mce/classes/TinyMCE_Event.class.js */

TinyMCE_Engine.prototype._setEventsEnabled = function(node, state) {
	var evs, x, y, elms, i, event;
	var events = ['onfocus','onblur','onclick','ondblclick',
				'onmousedown','onmouseup','onmouseover','onmousemove',
				'onmouseout','onkeypress','onkeydown','onkeydown','onkeyup'];

	evs = tinyMCE.settings['event_elements'].split(',');
	for (y=0; y<evs.length; y++){
		elms = node.getElementsByTagName(evs[y]);
		for (i=0; i<elms.length; i++) {
			event = "";

			for (x=0; x<events.length; x++) {
				if ((event = tinyMCE.getAttrib(elms[i], events[x])) != '') {
					event = tinyMCE.cleanupEventStr("" + event);

					if (!state)
						event = "return true;" + event;
					else
						event = event.replace(/^return true;/gi, '');

					elms[i].removeAttribute(events[x]);
					elms[i].setAttribute(events[x], event);
				}
			}
		}
	}
};

TinyMCE_Engine.prototype._eventPatch = function(editor_id) {
	var n, inst, win, e;

	// Remove odd, error
	if (typeof(tinyMCE) == "undefined")
		return true;

	try {
		// Try selected instance first
		if (tinyMCE.selectedInstance) {
			win = tinyMCE.selectedInstance.getWin();

			if (win && win.event) {
				e = win.event;

				if (!e.target)
					e.target = e.srcElement;

				TinyMCE_Engine.prototype.handleEvent(e);
				return;
			}
		}

		// Search for it
		for (n in tinyMCE.instances) {
			inst = tinyMCE.instances[n];

			if (!tinyMCE.isInstance(inst))
				continue;

			inst.select();
			win = inst.getWin();

			if (win && win.event) {
				e = win.event;

				if (!e.target)
					e.target = e.srcElement;

				TinyMCE_Engine.prototype.handleEvent(e);
				return;
			}
		}
	} catch (ex) {
		// Ignore error if iframe is pointing to external URL
	}
};

TinyMCE_Engine.prototype.findEvent = function(e) {
	var n, inst;

	if (e)
		return e;

	for (n in tinyMCE.instances) {
		inst = tinyMCE.instances[n];

		if (tinyMCE.isInstance(inst) && inst.getWin().event)
			return inst.getWin().event;
	}

	return null;
};

TinyMCE_Engine.prototype.unloadHandler = function() {
	tinyMCE.triggerSave(true, true);
};

TinyMCE_Engine.prototype.addEventHandlers = function(inst) {
	this.setEventHandlers(inst, 1);
};

TinyMCE_Engine.prototype.setEventHandlers = function(inst, s) {
	var doc = inst.getDoc(), ie, ot, i, f = s ? tinyMCE.addEvent : tinyMCE.removeEvent;

	ie = ['keypress', 'keyup', 'keydown', 'click', 'mouseup', 'mousedown', 'controlselect', 'dblclick'];
	ot = ['keypress', 'keyup', 'keydown', 'click', 'mouseup', 'mousedown', 'focus', 'blur', 'dragdrop'];

	inst.switchSettings();

	if (tinyMCE.isIE) {
		for (i=0; i<ie.length; i++)
			f(doc, ie[i], TinyMCE_Engine.prototype._eventPatch);
	} else {
		for (i=0; i<ot.length; i++)
			f(doc, ot[i], tinyMCE.handleEvent);

		eval('try { doc.designMode = "On"; } catch(e) {}'); // Force designmode
	}
};

TinyMCE_Engine.prototype.onMouseMove = function() {
	var inst, lh;

	// Fix for IE7 bug where it's not restoring hover on anchors correctly
	if (tinyMCE.lastHover) {
		lh = tinyMCE.lastHover;

		// Call out on menus and refresh class on normal buttons
		if (lh.className.indexOf('mceMenu') != -1)
			tinyMCE._menuButtonEvent('out', lh);
		else
			lh.className = lh.className;

		tinyMCE.lastHover = null;
	}

	if (!tinyMCE.hasMouseMoved) {
		inst = tinyMCE.selectedInstance;

		// Workaround for bug #1437457 (Odd MSIE bug)
		if (inst.isFocused) {
			inst.undoBookmark = inst.selection.getBookmark();
			tinyMCE.hasMouseMoved = true;
		}
	}

//	tinyMCE.cancelEvent(inst.getWin().event);
//	return false;
};

TinyMCE_Engine.prototype.cancelEvent = function(e) {
	if (!e)
		return false;

	if (tinyMCE.isIE) {
		e.returnValue = false;
		e.cancelBubble = true;
	} else {
		e.preventDefault();
		e.stopPropagation && e.stopPropagation();
	}

	return false;
};

TinyMCE_Engine.prototype.addEvent = function(o, n, h) {
	// Add cleanup for all non unload events
	if (n != 'unload') {
		function clean() {
			var ex;

			try {
				tinyMCE.removeEvent(o, n, h);
				tinyMCE.removeEvent(window, 'unload', clean);
				o = n = h = null;
			} catch (ex) {
				// IE may produce access denied exception on unload
			}
		}

		// Add memory cleaner
		tinyMCE.addEvent(window, 'unload', clean);
	}

	if (o.attachEvent)
		o.attachEvent("on" + n, h);
	else
		o.addEventListener(n, h, false);
};

TinyMCE_Engine.prototype.removeEvent = function(o, n, h) {
	if (o.detachEvent)
		o.detachEvent("on" + n, h);
	else
		o.removeEventListener(n, h, false);
};

TinyMCE_Engine.prototype.addSelectAccessibility = function(e, s, w) {
	// Add event handlers 
	if (!s._isAccessible) {
		s.onkeydown = tinyMCE.accessibleEventHandler;
		s.onblur = tinyMCE.accessibleEventHandler;
		s._isAccessible = true;
		s._win = w;
	}

	return false;
};

TinyMCE_Engine.prototype.accessibleEventHandler = function(e) {
	var win = this._win;
	e = tinyMCE.isIE ? win.event : e;
	var elm = tinyMCE.isIE ? e.srcElement : e.target;

	// Unpiggyback onchange on blur
	if (e.type == "blur") {
		if (elm.oldonchange) {
			elm.onchange = elm.oldonchange;
			elm.oldonchange = null;
		}

		return true;
	}

	// Piggyback onchange
	if (elm.nodeName == "SELECT" && !elm.oldonchange) {
		elm.oldonchange = elm.onchange;
		elm.onchange = null;
	}

	// Execute onchange and remove piggyback
	if (e.keyCode == 13 || e.keyCode == 32) {
		elm.onchange = elm.oldonchange;
		elm.onchange();
		elm.oldonchange = null;

		tinyMCE.cancelEvent(e);
		return false;
	}

	return true;
};

TinyMCE_Engine.prototype._resetIframeHeight = function() {
	var ife;

	if (tinyMCE.isRealIE) {
		ife = tinyMCE.selectedInstance.iframeElement;

/*		if (ife._oldWidth) {
			ife.style.width = ife._oldWidth;
			ife.width = ife._oldWidth;
		}*/

		if (ife._oldHeight) {
			ife.style.height = ife._oldHeight;
			ife.height = ife._oldHeight;
		}
	}
};

/* file:jscripts/tiny_mce/classes/TinyMCE_Selection.class.js */

function TinyMCE_Selection(inst) {
	this.instance = inst;
};

TinyMCE_Selection.prototype = {
	getSelectedHTML : function() {
		var inst = this.instance;
		var e, r = this.getRng(), h;

		if (!r)
			return null;

		e = document.createElement("body");

		if (r.cloneContents)
			e.appendChild(r.cloneContents());
		else if (typeof(r.item) != 'undefined' || typeof(r.htmlText) != 'undefined')
			e.innerHTML = r.item ? r.item(0).outerHTML : r.htmlText;
		else
			e.innerHTML = r.toString(); // Failed, use text for now

		h = tinyMCE._cleanupHTML(inst, inst.contentDocument, inst.settings, e, e, false, true, false);

		// When editing always use fonts internaly
		if (tinyMCE.getParam("convert_fonts_to_spans"))
			tinyMCE.convertSpansToFonts(inst.getDoc());

		return h;
	},

	getSelectedText : function() {
		var inst = this.instance;
		var d, r, s, t;

		if (tinyMCE.isIE) {
			d = inst.getDoc();

			if (d.selection.type == "Text") {
				r = d.selection.createRange();
				t = r.text;
			} else
				t = '';
		} else {
			s = this.getSel();

			if (s && s.toString)
				t = s.toString();
			else
				t = '';
		}

		return t;
	},

	getBookmark : function(simple) {
		var inst = this.instance;
		var rng = this.getRng();
		var doc = inst.getDoc(), b = inst.getBody();
		var sp, le, s, e, nl, i, si, ei, w;
		var trng, sx, sy, xx = -999999999, vp = inst.getViewPort();

		sx = vp.left;
		sy = vp.top;

		if (tinyMCE.isSafari || tinyMCE.isOpera || simple)
			return {rng : rng, scrollX : sx, scrollY : sy};

		if (tinyMCE.isIE) {
			if (rng.item) {
				e = rng.item(0);

				nl = b.getElementsByTagName(e.nodeName);
				for (i=0; i<nl.length; i++) {
					if (e == nl[i]) {
						sp = i;
						break;
					}
				}

				return {
					tag : e.nodeName,
					index : sp,
					scrollX : sx,
					scrollY : sy
				};
			} else {
				trng = doc.body.createTextRange();
				trng.moveToElementText(inst.getBody());
				trng.collapse(true);
				bp = Math.abs(trng.move('character', xx));

				trng = rng.duplicate();
				trng.collapse(true);
				sp = Math.abs(trng.move('character', xx));

				trng = rng.duplicate();
				trng.collapse(false);
				le = Math.abs(trng.move('character', xx)) - sp;

				return {
					start : sp - bp,
					length : le,
					scrollX : sx,
					scrollY : sy
				};
			}
		}

		if (tinyMCE.isGecko) {
			s = this.getSel();
			e = this.getFocusElement();

			if (!s)
				return null;

			if (e && e.nodeName == 'IMG') {
				/*nl = b.getElementsByTagName('IMG');
				for (i=0; i<nl.length; i++) {
					if (e == nl[i]) {
						sp = i;
						break;
					}
				}*/

				return {
					start : -1,
					end : -1,
					index : sp,
					scrollX : sx,
					scrollY : sy
				};
			}

			// Caret or selection
			if (s.anchorNode == s.focusNode && s.anchorOffset == s.focusOffset) {
				e = this._getPosText(b, s.anchorNode, s.focusNode);

				if (!e)
					return {scrollX : sx, scrollY : sy};

				return {
					start : e.start + s.anchorOffset,
					end : e.end + s.focusOffset,
					scrollX : sx,
					scrollY : sy
				};
			} else {
				e = this._getPosText(b, rng.startContainer, rng.endContainer);

				if (!e)
					return {scrollX : sx, scrollY : sy};

				return {
					start : e.start + rng.startOffset,
					end : e.end + rng.endOffset,
					scrollX : sx,
					scrollY : sy
				};
			}
		}

		return null;
	},

	moveToBookmark : function(bookmark) {
		var inst = this.instance;
		var rng, nl, i, ex, b = inst.getBody(), sd;
		var doc = inst.getDoc();
		var win = inst.getWin();
		var sel = this.getSel();

		if (!bookmark)
			return false;

		if (tinyMCE.isSafari) {
			sel.setBaseAndExtent(bookmark.rng.startContainer, bookmark.rng.startOffset, bookmark.rng.endContainer, bookmark.rng.endOffset);
			return true;
		}

		if (tinyMCE.isRealIE) {
			if (bookmark.rng) {
				try {
					bookmark.rng.select();
				} catch (ex) {
					// Ignore
				}

				return true;
			}

			win.focus();

			if (bookmark.tag) {
				rng = b.createControlRange();

				nl = b.getElementsByTagName(bookmark.tag);

				if (nl.length > bookmark.index) {
					try {
						rng.addElement(nl[bookmark.index]);
					} catch (ex) {
						// Might be thrown if the node no longer exists
					}
				}
			} else {
				// Try/catch needed since this operation breaks when TinyMCE is placed in hidden divs/tabs
				try {
					// Incorrect bookmark
					if (bookmark.start < 0)
						return true;

					rng = inst.getSel().createRange();
					rng.moveToElementText(inst.getBody());
					rng.collapse(true);
					rng.moveStart('character', bookmark.start);
					rng.moveEnd('character', bookmark.length);
				} catch (ex) {
					return true;
				}
			}

			rng.select();

			win.scrollTo(bookmark.scrollX, bookmark.scrollY);
			return true;
		}

		if (tinyMCE.isGecko || tinyMCE.isOpera) {
			if (bookmark.rng) {
				sel.removeAllRanges();
				sel.addRange(bookmark.rng);
			}

			if (bookmark.start != -1 && bookmark.end != -1) {
				try {
					sd = this._getTextPos(b, bookmark.start, bookmark.end);
					rng = doc.createRange();
					rng.setStart(sd.startNode, sd.startOffset);
					rng.setEnd(sd.endNode, sd.endOffset);
					sel.removeAllRanges();
					sel.addRange(rng);
					win.focus();
				} catch (ex) {
					// Ignore
				}
			}

			/*
			if (typeof(bookmark.index) != 'undefined') {
				tinyMCE.selectElements(b, 'IMG', function (n) {
					if (bookmark.index-- == 0) {
						// Select image in Gecko here
					}

					return false;
				});
			}
			*/

			win.scrollTo(bookmark.scrollX, bookmark.scrollY);
			return true;
		}

		return false;
	},

	_getPosText : function(r, sn, en) {
		var w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT, null, false), n, p = 0, d = {};

		while ((n = w.nextNode()) != null) {
			if (n == sn)
				d.start = p;

			if (n == en) {
				d.end = p;
				return d;
			}

			p += n.nodeValue ? n.nodeValue.length : 0;
		}

		return null;
	},

	_getTextPos : function(r, sp, ep) {
		var w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT, null, false), n, p = 0, d = {};

		while ((n = w.nextNode()) != null) {
			p += n.nodeValue ? n.nodeValue.length : 0;

			if (p >= sp && !d.startNode) {
				d.startNode = n;
				d.startOffset = sp - (p - n.nodeValue.length);
			}

			if (p >= ep) {
				d.endNode = n;
				d.endOffset = ep - (p - n.nodeValue.length);

				return d;
			}
		}

		return null;
	},

	selectNode : function(node, collapse, select_text_node, to_start) {
		var inst = this.instance, sel, rng, nodes;

		if (!node)
			return;

		if (typeof(collapse) == "undefined")
			collapse = true;

		if (typeof(select_text_node) == "undefined")
			select_text_node = false;

		if (typeof(to_start) == "undefined")
			to_start = true;

		if (inst.settings.auto_resize)
			inst.resizeToContent();

		if (tinyMCE.isRealIE) {
			rng = inst.getDoc().body.createTextRange();

			try {
				rng.moveToElementText(node);

				if (collapse)
					rng.collapse(to_start);

				rng.select();
			} catch (e) {
				// Throws illigal agrument in MSIE some times
			}
		} else {
			sel = this.getSel();

			if (!sel)
				return;

			if (tinyMCE.isSafari) {
				sel.setBaseAndExtent(node, 0, node, node.innerText.length);

				if (collapse) {
					if (to_start)
						sel.collapseToStart();
					else
						sel.collapseToEnd();
				}

				this.scrollToNode(node);

				return;
			}

			rng = inst.getDoc().createRange();

			if (select_text_node) {
				// Find first textnode in tree
				nodes = tinyMCE.getNodeTree(node, new Array(), 3);
				if (nodes.length > 0)
					rng.selectNodeContents(nodes[0]);
				else
					rng.selectNodeContents(node);
			} else
				rng.selectNode(node);

			if (collapse) {
				// Special treatment of textnode collapse
				if (!to_start && node.nodeType == 3) {
					rng.setStart(node, node.nodeValue.length);
					rng.setEnd(node, node.nodeValue.length);
				} else
					rng.collapse(to_start);
			}

			sel.removeAllRanges();
			sel.addRange(rng);
		}

		this.scrollToNode(node);

		// Set selected element
		tinyMCE.selectedElement = null;
		if (node.nodeType == 1)
			tinyMCE.selectedElement = node;
	},

	scrollToNode : function(node) {
		var inst = this.instance, w = inst.getWin(), vp = inst.getViewPort(), pos = tinyMCE.getAbsPosition(node), cvp, p, cwin;

		// Only scroll if out of visible area
		if (pos.absLeft < vp.left || pos.absLeft > vp.left + vp.width || pos.absTop < vp.top || pos.absTop > vp.top + (vp.height-25))
			w.scrollTo(pos.absLeft, pos.absTop - vp.height + 25);

		// Scroll container window
		if (inst.settings.auto_resize) {
			cwin = inst.getContainerWin();
			cvp = tinyMCE.getViewPort(cwin);
			p = this.getAbsPosition(node);

			if (p.absLeft < cvp.left || p.absLeft > cvp.left + cvp.width || p.absTop < cvp.top || p.absTop > cvp.top + cvp.height)
				cwin.scrollTo(p.absLeft, p.absTop - cvp.height + 25);
		}
	},

	getAbsPosition : function(n) {
		var pos = tinyMCE.getAbsPosition(n), ipos = tinyMCE.getAbsPosition(this.instance.iframeElement);

		return {
			absLeft : ipos.absLeft + pos.absLeft,
			absTop : ipos.absTop + pos.absTop
		};
	},

	getSel : function() {
		var inst = this.instance;

		if (tinyMCE.isRealIE)
			return inst.getDoc().selection;

		return inst.contentWindow.getSelection();
	},

	getRng : function() {
		var s = this.getSel();

		if (s == null)
			return null;

		if (tinyMCE.isRealIE)
			return s.createRange();

		if (tinyMCE.isSafari && !s.getRangeAt)
			return '' + window.getSelection();

		return s.getRangeAt(0);
	},

	getFocusElement : function() {
		var inst = this.instance, doc, rng, sel, elm;

		if (tinyMCE.isRealIE) {
			doc = inst.getDoc();
			rng = doc.selection.createRange();

	//		if (rng.collapse)
	//			rng.collapse(true);

			elm = rng.item ? rng.item(0) : rng.parentElement();
		} else {
			if (!tinyMCE.isSafari && inst.isHidden())
				return inst.getBody();

			sel = this.getSel();
			rng = this.getRng();

			if (!sel || !rng)
				return null;

			elm = rng.commonAncestorContainer;
			//elm = (sel && sel.anchorNode) ? sel.anchorNode : null;

			// Handle selection a image or other control like element such as anchors
			if (!rng.collapsed) {
				// Is selection small
				if (rng.startContainer == rng.endContainer) {
					if (rng.startOffset - rng.endOffset < 2) {
						if (rng.startContainer.hasChildNodes())
							elm = rng.startContainer.childNodes[rng.startOffset];
					}
				}
			}

			// Get the element parent of the node
			elm = tinyMCE.getParentElement(elm);

			//if (tinyMCE.selectedElement != null && tinyMCE.selectedElement.nodeName.toLowerCase() == "img")
			//	elm = tinyMCE.selectedElement;
		}

		return elm;
	}

	};

/* file:jscripts/tiny_mce/classes/TinyMCE_UndoRedo.class.js */

function TinyMCE_UndoRedo(inst) {
	this.instance = inst;
	this.undoLevels = new Array();
	this.undoIndex = 0;
	this.typingUndoIndex = -1;
	this.undoRedo = true;
};

TinyMCE_UndoRedo.prototype = {
	add : function(l) {
		var b, customUndoLevels, newHTML, inst = this.instance, i, ul, ur;

		if (l) {
			this.undoLevels[this.undoLevels.length] = l;
			return true;
		}

		if (this.typingUndoIndex != -1) {
			this.undoIndex = this.typingUndoIndex;

			if (tinyMCE.typingUndoIndex != -1)
				tinyMCE.undoIndex = tinyMCE.typingUndoIndex;
		}

		newHTML = tinyMCE.trim(inst.getBody().innerHTML);
		if (this.undoLevels[this.undoIndex] && newHTML != this.undoLevels[this.undoIndex].content) {
			//tinyMCE.debug(newHTML, this.undoLevels[this.undoIndex].content);

			tinyMCE.dispatchCallback(inst, 'onchange_callback', 'onChange', inst);

			// Time to compress
			customUndoLevels = tinyMCE.settings['custom_undo_redo_levels'];
			if (customUndoLevels != -1 && this.undoLevels.length > customUndoLevels) {
				for (i=0; i<this.undoLevels.length-1; i++)
					this.undoLevels[i] = this.undoLevels[i+1];

				this.undoLevels.length--;
				this.undoIndex--;

				// Todo: Implement global undo/redo logic here
			}

			b = inst.undoBookmark;

			if (!b)
				b = inst.selection.getBookmark();

			this.undoIndex++;
			this.undoLevels[this.undoIndex] = {
				content : newHTML,
				bookmark : b
			};

			// Remove all above from global undo/redo
			ul = tinyMCE.undoLevels;
			for (i=tinyMCE.undoIndex + 1; i<ul.length; i++) {
				ur = ul[i].undoRedo;

				if (ur.undoIndex == ur.undoLevels.length -1)
					ur.undoIndex--;

				ur.undoLevels.length--;
			}

			// Add global undo level
			tinyMCE.undoLevels[tinyMCE.undoIndex++] = inst;
			tinyMCE.undoLevels.length = tinyMCE.undoIndex;

			this.undoLevels.length = this.undoIndex + 1;

			return true;
		}

		return false;
	},

	undo : function() {
		var inst = this.instance;

		// Do undo
		if (this.undoIndex > 0) {
			this.undoIndex--;

			tinyMCE.setInnerHTML(inst.getBody(), this.undoLevels[this.undoIndex].content);
			inst.repaint();

			if (inst.settings.custom_undo_redo_restore_selection)
				inst.selection.moveToBookmark(this.undoLevels[this.undoIndex].bookmark);
		}
	},

	redo : function() {
		var inst = this.instance;

		tinyMCE.execCommand("mceEndTyping");

		if (this.undoIndex < (this.undoLevels.length-1)) {
			this.undoIndex++;

			tinyMCE.setInnerHTML(inst.getBody(), this.undoLevels[this.undoIndex].content);
			inst.repaint();

			if (inst.settings.custom_undo_redo_restore_selection)
				inst.selection.moveToBookmark(this.undoLevels[this.undoIndex].bookmark);
		}

		tinyMCE.triggerNodeChange();
	}

	};

/* file:jscripts/tiny_mce/classes/TinyMCE_ForceParagraphs.class.js */

var TinyMCE_ForceParagraphs = {
	_insertPara : function(inst, e) {
		var doc = inst.getDoc(), sel = inst.getSel(), body = inst.getBody(), win = inst.contentWindow, rng = sel.getRangeAt(0);
		var rootElm = doc.documentElement, blockName = "P", startNode, endNode, startBlock, endBlock;
		var rngBefore, rngAfter, direct, startNode, startOffset, endNode, endOffset, b = tinyMCE.isOpera ? inst.selection.getBookmark() : null;
		var paraBefore, paraAfter, startChop, endChop, contents;

		function isEmpty(para) {
			function isEmptyHTML(html) {
				return html.replace(new RegExp('[ \t\r\n]+', 'g'), '').toLowerCase() == "";
			}

			// Check for images
			if (para.getElementsByTagName("img").length > 0)
				return false;

			// Check for tables
			if (para.getElementsByTagName("table").length > 0)
				return false;

			// Check for HRs
			if (para.getElementsByTagName("hr").length > 0)
				return false;

			// Check all textnodes
			var nodes = tinyMCE.getNodeTree(para, new Array(), 3);
			for (var i=0; i<nodes.length; i++) {
				if (!isEmptyHTML(nodes[i].nodeValue))
					return false;
			}

			// No images, no tables, no hrs, no text content then it's empty
			return true;
		}

	//	tinyMCE.debug(body.innerHTML);

	//	debug(e.target, sel.anchorNode.nodeName, sel.focusNode.nodeName, rng.startContainer, rng.endContainer, rng.commonAncestorContainer, sel.anchorOffset, sel.focusOffset, rng.toString());

		// Setup before range
		rngBefore = doc.createRange();
		rngBefore.setStart(sel.anchorNode, sel.anchorOffset);
		rngBefore.collapse(true);

		// Setup after range
		rngAfter = doc.createRange();
		rngAfter.setStart(sel.focusNode, sel.focusOffset);
		rngAfter.collapse(true);

		// Setup start/end points
		direct = rngBefore.compareBoundaryPoints(rngBefore.START_TO_END, rngAfter) < 0;
		startNode = direct ? sel.anchorNode : sel.focusNode;
		startOffset = direct ? sel.anchorOffset : sel.focusOffset;
		endNode = direct ? sel.focusNode : sel.anchorNode;
		endOffset = direct ? sel.focusOffset : sel.anchorOffset;

		startNode = startNode.nodeName == "BODY" ? startNode.firstChild : startNode;
		endNode = endNode.nodeName == "BODY" ? endNode.firstChild : endNode;

		// Get block elements
		startBlock = inst.getParentBlockElement(startNode);
		endBlock = inst.getParentBlockElement(endNode);

		// If absolute force paragraph generation within
		if (startBlock && new RegExp('absolute|relative|static', 'gi').test(startBlock.style.position))
			startBlock = null;

		if (endBlock && new RegExp('absolute|relative|static', 'gi').test(endBlock.style.position))
			endBlock = null;

		// Use current block name
		if (startBlock != null) {
			blockName = startBlock.nodeName;

			// Use P instead
			if (blockName == "TD" || blockName == "TABLE" || (blockName == "DIV" && new RegExp('left|right', 'gi').test(startBlock.style.cssFloat)))
				blockName = "P";
		}

		// Within a list use normal behaviour
		if (tinyMCE.getParentElement(startBlock, "OL,UL", null, body) != null)
			return false;

		// Within a table create new paragraphs
		if ((startBlock != null && startBlock.nodeName == "TABLE") || (endBlock != null && endBlock.nodeName == "TABLE"))
			startBlock = endBlock = null;

		// Setup new paragraphs
		paraBefore = (startBlock != null && startBlock.nodeName == blockName) ? startBlock.cloneNode(false) : doc.createElement(blockName);
		paraAfter = (endBlock != null && endBlock.nodeName == blockName) ? endBlock.cloneNode(false) : doc.createElement(blockName);

		// Is header, then force paragraph under
		if (/^(H[1-6])$/.test(blockName))
			paraAfter = doc.createElement("p");

		// Setup chop nodes
		startChop = startNode;
		endChop = endNode;

		// Get startChop node
		node = startChop;
		do {
			if (node == body || node.nodeType == 9 || tinyMCE.isBlockElement(node))
				break;

			startChop = node;
		} while ((node = node.previousSibling ? node.previousSibling : node.parentNode));

		// Get endChop node
		node = endChop;
		do {
			if (node == body || node.nodeType == 9 || tinyMCE.isBlockElement(node))
				break;

			endChop = node;
		} while ((node = node.nextSibling ? node.nextSibling : node.parentNode));

		// Fix when only a image is within the TD
		if (startChop.nodeName == "TD")
			startChop = startChop.firstChild;

		if (endChop.nodeName == "TD")
			endChop = endChop.lastChild;

		// If not in a block element
		if (startBlock == null) {
			// Delete selection
			rng.deleteContents();

			if (!tinyMCE.isSafari)
				sel.removeAllRanges();

			if (startChop != rootElm && endChop != rootElm) {
				// Insert paragraph before
				rngBefore = rng.cloneRange();

				if (startChop == body)
					rngBefore.setStart(startChop, 0);
				else
					rngBefore.setStartBefore(startChop);

				paraBefore.appendChild(rngBefore.cloneContents());

				// Insert paragraph after
				if (endChop.parentNode.nodeName == blockName)
					endChop = endChop.parentNode;

				// If not after image
				//if (rng.startContainer.nodeName != "BODY" && rng.endContainer.nodeName != "BODY")
					rng.setEndAfter(endChop);

				if (endChop.nodeName != "#text" && endChop.nodeName != "BODY")
					rngBefore.setEndAfter(endChop);

				contents = rng.cloneContents();
				if (contents.firstChild && (contents.firstChild.nodeName == blockName || contents.firstChild.nodeName == "BODY"))
					paraAfter.innerHTML = contents.firstChild.innerHTML;
				else
					paraAfter.appendChild(contents);

				// Check if it's a empty paragraph
				if (isEmpty(paraBefore))
					paraBefore.innerHTML = "&nbsp;";

				// Check if it's a empty paragraph
				if (isEmpty(paraAfter))
					paraAfter.innerHTML = "&nbsp;";

				// Delete old contents
				rng.deleteContents();
				rngAfter.deleteContents();
				rngBefore.deleteContents();

				// Insert new paragraphs
				if (tinyMCE.isOpera) {
					paraBefore.normalize();
					rngBefore.insertNode(paraBefore);
					paraAfter.normalize();
					rngBefore.insertNode(paraAfter);
				} else {
					paraAfter.normalize();
					rngBefore.insertNode(paraAfter);
					paraBefore.normalize();
					rngBefore.insertNode(paraBefore);
				}

				//tinyMCE.debug("1: ", paraBefore.innerHTML, paraAfter.innerHTML);
			} else {
				body.innerHTML = "<" + blockName + ">&nbsp;</" + blockName + "><" + blockName + ">&nbsp;</" + blockName + ">";
				paraAfter = body.childNodes[1];
			}

			inst.selection.moveToBookmark(b);
			inst.selection.selectNode(paraAfter, true, true);

			return true;
		}

		// Place first part within new paragraph
		if (startChop.nodeName == blockName)
			rngBefore.setStart(startChop, 0);
		else
			rngBefore.setStartBefore(startChop);

		rngBefore.setEnd(startNode, startOffset);
		paraBefore.appendChild(rngBefore.cloneContents());

		// Place secound part within new paragraph
		rngAfter.setEndAfter(endChop);
		rngAfter.setStart(endNode, endOffset);
		contents = rngAfter.cloneContents();

		if (contents.firstChild && contents.firstChild.nodeName == blockName) {
	/*		var nodes = contents.firstChild.childNodes;
			for (var i=0; i<nodes.length; i++) {
				//tinyMCE.debug(nodes[i].nodeName);
				if (nodes[i].nodeName != "BODY")
					paraAfter.appendChild(nodes[i]);
			}
	*/
			paraAfter.innerHTML = contents.firstChild.innerHTML;
		} else
			paraAfter.appendChild(contents);

		// Check if it's a empty paragraph
		if (isEmpty(paraBefore))
			paraBefore.innerHTML = "&nbsp;";

		// Check if it's a empty paragraph
		if (isEmpty(paraAfter))
			paraAfter.innerHTML = "&nbsp;";

		// Create a range around everything
		rng = doc.createRange();

		if (!startChop.previousSibling && startChop.parentNode.nodeName.toUpperCase() == blockName) {
			rng.setStartBefore(startChop.parentNode);
		} else {
			if (rngBefore.startContainer.nodeName.toUpperCase() == blockName && rngBefore.startOffset == 0)
				rng.setStartBefore(rngBefore.startContainer);
			else
				rng.setStart(rngBefore.startContainer, rngBefore.startOffset);
		}

		if (!endChop.nextSibling && endChop.parentNode.nodeName.toUpperCase() == blockName)
			rng.setEndAfter(endChop.parentNode);
		else
			rng.setEnd(rngAfter.endContainer, rngAfter.endOffset);

		// Delete all contents and insert new paragraphs
		rng.deleteContents();

		if (tinyMCE.isOpera) {
			rng.insertNode(paraBefore);
			rng.insertNode(paraAfter);
		} else {
			rng.insertNode(paraAfter);
			rng.insertNode(paraBefore);
		}

		//tinyMCE.debug("2", paraBefore.innerHTML, paraAfter.innerHTML);

		// Normalize
		paraAfter.normalize();
		paraBefore.normalize();

		inst.selection.moveToBookmark(b);
		inst.selection.selectNode(paraAfter, true, true);

		return true;
	},

	_handleBackSpace : function(inst) {
		var r = inst.getRng(), sn = r.startContainer, nv, s = false;

		// Added body check for bug #1527787
		if (sn && sn.nextSibling && sn.nextSibling.nodeName == "BR" && sn.parentNode.nodeName != "BODY") {
			nv = sn.nodeValue;

			// Handle if a backspace is pressed after a space character #bug 1466054 removed since fix for #1527787
			/*if (nv != null && nv.length >= r.startOffset && nv.charAt(r.startOffset - 1) == ' ')
				s = true;*/

			// Only remove BRs if we are at the end of line #bug 1464152
			if (nv != null && r.startOffset == nv.length)
				sn.nextSibling.parentNode.removeChild(sn.nextSibling);
		}

		if (inst.settings.auto_resize)
			inst.resizeToContent();

		return s;
	}

	};

/* file:jscripts/tiny_mce/classes/TinyMCE_Layer.class.js */

function TinyMCE_Layer(id, bm) {
	this.id = id;
	this.blockerElement = null;
	this.events = false;
	this.element = null;
	this.blockMode = typeof(bm) != 'undefined' ? bm : true;
	this.doc = document;
};

TinyMCE_Layer.prototype = {
	moveRelativeTo : function(re, p) {
		var rep = this.getAbsPosition(re);
		var w = parseInt(re.offsetWidth);
		var h = parseInt(re.offsetHeight);
		var e = this.getElement();
		var ew = parseInt(e.offsetWidth);
		var eh = parseInt(e.offsetHeight);
		var x, y;

		switch (p) {
			case "tl":
				x = rep.absLeft;
				y = rep.absTop;
				break;

			case "tr":
				x = rep.absLeft + w;
				y = rep.absTop;
				break;

			case "bl":
				x = rep.absLeft;
				y = rep.absTop + h;
				break;

			case "br":
				x = rep.absLeft + w;
				y = rep.absTop + h;
				break;

			case "cc":
				x = rep.absLeft + (w / 2) - (ew / 2);
				y = rep.absTop + (h / 2) - (eh / 2);
				break;
		}

		this.moveTo(x, y);
	},

	moveBy : function(x, y) {
		var e = this.getElement();
		this.moveTo(parseInt(e.style.left) + x, parseInt(e.style.top) + y);
	},

	moveTo : function(x, y) {
		var e = this.getElement();

		e.style.left = x + "px";
		e.style.top = y + "px";

		this.updateBlocker();
	},

	resizeBy : function(w, h) {
		var e = this.getElement();
		this.resizeTo(parseInt(e.style.width) + w, parseInt(e.style.height) + h);
	},

	resizeTo : function(w, h) {
		var e = this.getElement();

		if (w != null)
			e.style.width = w + "px";

		if (h != null)
			e.style.height = h + "px";

		this.updateBlocker();
	},

	show : function() {
		this.getElement().style.display = 'block';
		this.updateBlocker();
	},

	hide : function() {
		this.getElement().style.display = 'none';
		this.updateBlocker();
	},

	isVisible : function() {
		return this.getElement().style.display == 'block';
	},

	getElement : function() {
		if (!this.element)
			this.element = this.doc.getElementById(this.id);

		return this.element;
	},

	setBlockMode : function(s) {
		this.blockMode = s;
	},

	updateBlocker : function() {
		var e, b, x, y, w, h;

		b = this.getBlocker();
		if (b) {
			if (this.blockMode) {
				e = this.getElement();
				x = this.parseInt(e.style.left);
				y = this.parseInt(e.style.top);
				w = this.parseInt(e.offsetWidth);
				h = this.parseInt(e.offsetHeight);

				b.style.left = x + 'px';
				b.style.top = y + 'px';
				b.style.width = w + 'px';
				b.style.height = h + 'px';
				b.style.display = e.style.display;
			} else
				b.style.display = 'none';
		}
	},

	getBlocker : function() {
		var d, b;

		if (!this.blockerElement && this.blockMode) {
			d = this.doc;
			b = d.getElementById(this.id + "_blocker");

			if (!b) {
				b = d.createElement("iframe");

				b.setAttribute('id', this.id + "_blocker");
				b.style.cssText = 'display: none; position: absolute; left: 0; top: 0';
				b.src = 'javascript:false;';
				b.frameBorder = '0';
				b.scrolling = 'no';
	
				d.body.appendChild(b);
			}

			this.blockerElement = b;
		}

		return this.blockerElement;
	},

	getAbsPosition : function(n) {
		var p = {absLeft : 0, absTop : 0};

		while (n) {
			p.absLeft += n.offsetLeft;
			p.absTop += n.offsetTop;
			n = n.offsetParent;
		}

		return p;
	},

	create : function(n, c, p, h) {
		var d = this.doc, e = d.createElement(n);

		e.setAttribute('id', this.id);

		if (c)
			e.className = c;

		if (!p)
			p = d.body;

		if (h)
			e.innerHTML = h;

		p.appendChild(e);

		return this.element = e;
	},

	exists : function() {
		return this.doc.getElementById(this.id) != null;
	},

	parseInt : function(s) {
		if (s == null || s == '')
			return 0;

		return parseInt(s);
	}

	};

/* file:jscripts/tiny_mce/classes/TinyMCE_Menu.class.js */

function TinyMCE_Menu() {
	var id;

	if (typeof(tinyMCE.menuCounter) == "undefined")
		tinyMCE.menuCounter = 0;

	id = "mc_menu_" + tinyMCE.menuCounter++;

	TinyMCE_Layer.call(this, id, true);

	this.id = id;
	this.items = new Array();
	this.needsUpdate = true;
};

TinyMCE_Menu.prototype = tinyMCE.extend(TinyMCE_Layer.prototype, {
	init : function(s) {
		var n;

		// Default params
		this.settings = {
			separator_class : 'mceMenuSeparator',
			title_class : 'mceMenuTitle',
			disabled_class : 'mceMenuDisabled',
			menu_class : 'mceMenu',
			drop_menu : true
		};

		for (n in s)
			this.settings[n] = s[n];

		this.create('div', this.settings.menu_class);
	},

	clear : function() {
		this.items = new Array();
	},

	addTitle : function(t) {
		this.add({type : 'title', text : t});
	},

	addDisabled : function(t) {
		this.add({type : 'disabled', text : t});
	},

	addSeparator : function() {
		this.add({type : 'separator'});
	},

	addItem : function(t, js) {
		this.add({text : t, js : js});
	},

	add : function(mi) {
		this.items[this.items.length] = mi;
		this.needsUpdate = true;
	},

	update : function() {
		var e = this.getElement(), h = '', i, t, m = this.items, s = this.settings;

		if (this.settings.drop_menu)
			h += '<span class="mceMenuLine"></span>';

		h += '<table border="0" cellpadding="0" cellspacing="0">';

		for (i=0; i<m.length; i++) {
			t = tinyMCE.xmlEncode(m[i].text);
			c = m[i].class_name ? ' class="' + m[i].class_name + '"' : '';

			switch (m[i].type) {
				case 'separator':
					h += '<tr class="' + s.separator_class + '"><td>';
					break;

				case 'title':
					h += '<tr class="' + s.title_class + '"><td><span' + c +'>' + t + '</span>';
					break;

				case 'disabled':
					h += '<tr class="' + s.disabled_class + '"><td><span' + c +'>' + t + '</span>';
					break;

				default:
					h += '<tr><td><a href="#" onclick="return tinyMCE.cancelEvent(event);" onmousedown="return tinyMCE.cancelEvent(event);" onmouseup="' + tinyMCE.xmlEncode(m[i].js) + ';return tinyMCE.cancelEvent(event);"><span' + c +'>' + t + '</span></a>';
			}

			h += '</td></tr>';
		}

		h += '</table>';

		e.innerHTML = h;

		this.needsUpdate = false;
		this.updateBlocker();
	},

	show : function() {
		var nl, i;

		if (tinyMCE.lastMenu == this)
			return;

		if (this.needsUpdate)
			this.update();

		if (tinyMCE.lastMenu && tinyMCE.lastMenu != this)
			tinyMCE.lastMenu.hide();

		TinyMCE_Layer.prototype.show.call(this);

		if (!tinyMCE.isOpera) {
			// Accessibility stuff
/*			nl = this.getElement().getElementsByTagName("a");
			if (nl.length > 0)
				nl[0].focus();*/
		}

		tinyMCE.lastMenu = this;
	}

	});

/* file:jscripts/tiny_mce/classes/TinyMCE_Compatibility.class.js */

if (!Function.prototype.call) {
	Function.prototype.call = function() {
		var a = arguments, s = a[0], i, as = '', r, o;

		for (i=1; i<a.length; i++)
			as += (i > 1 ? ',' : '') + 'a[' + i + ']';

		o = s._fu;
		s._fu = this;
		r = eval('s._fu(' + as + ')');
		s._fu = o;

		return r;
	};
};

/* file:jscripts/tiny_mce/classes/TinyMCE_Debug.class.js */

TinyMCE_Engine.prototype.debug = function() {
	var m = "", a, i, l = tinyMCE.log.length;

	for (i=0, a = this.debug.arguments; i<a.length; i++) {
		m += a[i];

		if (i<a.length-1)
			m += ', ';
	}

	if (l < 1000)
		tinyMCE.log[l] = "[debug] " + m;
};

=======
var tinymce = {
	majorVersion : '3',
	minorVersion : '2.3.1',
	releaseDate : '2009-05-05',

	_init : function() {
		var t = this, d = document, w = window, na = navigator, ua = na.userAgent, i, nl, n, base, p, v;

		// Browser checks
		t.isOpera = w.opera && opera.buildNumber;
		t.isWebKit = /WebKit/.test(ua);
		t.isIE = !t.isWebKit && !t.isOpera && (/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);
		t.isIE6 = t.isIE && /MSIE [56]/.test(ua);
		t.isGecko = !t.isWebKit && /Gecko/.test(ua);
		t.isMac = ua.indexOf('Mac') != -1;
		t.isAir = /adobeair/i.test(ua);

		// TinyMCE .NET webcontrol might be setting the values for TinyMCE
		if (w.tinyMCEPreInit) {
			t.suffix = tinyMCEPreInit.suffix;
			t.baseURL = tinyMCEPreInit.base;
			t.query = tinyMCEPreInit.query;
			return;
		}

		// Get suffix and base
		t.suffix = '';

		// If base element found, add that infront of baseURL
		nl = d.getElementsByTagName('base');
		for (i=0; i<nl.length; i++) {
			if (v = nl[i].href) {
				// Host only value like http://site.com or http://site.com:8008
				if (/^https?:\/\/[^\/]+$/.test(v))
					v += '/';

				base = v ? v.match(/.*\//)[0] : ''; // Get only directory
			}
		}

		function getBase(n) {
			if (n.src && /tiny_mce(|_dev|_src|_gzip|_jquery|_prototype).js/.test(n.src)) {
				if (/_(src|dev)\.js/g.test(n.src))
					t.suffix = '_src';

				if ((p = n.src.indexOf('?')) != -1)
					t.query = n.src.substring(p + 1);

				t.baseURL = n.src.substring(0, n.src.lastIndexOf('/'));

				// If path to script is relative and a base href was found add that one infront
				if (base && t.baseURL.indexOf('://') == -1)
					t.baseURL = base + t.baseURL;

				return t.baseURL;
			}

			return null;
		};

		// Check document
		nl = d.getElementsByTagName('script');
		for (i=0; i<nl.length; i++) {
			if (getBase(nl[i]))
				return;
		}

		// Check head
		n = d.getElementsByTagName('head')[0];
		if (n) {
			nl = n.getElementsByTagName('script');
			for (i=0; i<nl.length; i++) {
				if (getBase(nl[i]))
					return;
			}
		}

		return;
	},

	is : function(o, t) {
		var n = typeof(o);

		if (!t)
			return n != 'undefined';

		if (t == 'array' && (o.hasOwnProperty && o instanceof Array))
			return true;

		return n == t;
	},


	each : function(o, cb, s) {
		var n, l;

		if (!o)
			return 0;

		s = s || o;

		if (typeof(o.length) != 'undefined') {
			// Indexed arrays, needed for Safari
			for (n=0, l = o.length; n<l; n++) {
				if (cb.call(s, o[n], n, o) === false)
					return 0;
			}
		} else {
			// Hashtables
			for (n in o) {
				if (o.hasOwnProperty(n)) {
					if (cb.call(s, o[n], n, o) === false)
						return 0;
				}
			}
		}

		return 1;
	},

	map : function(a, f) {
		var o = [];

		tinymce.each(a, function(v) {
			o.push(f(v));
		});

		return o;
	},

	grep : function(a, f) {
		var o = [];

		tinymce.each(a, function(v) {
			if (!f || f(v))
				o.push(v);
		});

		return o;
	},

	inArray : function(a, v) {
		var i, l;

		if (a) {
			for (i = 0, l = a.length; i < l; i++) {
				if (a[i] === v)
					return i;
			}
		}

		return -1;
	},

	extend : function(o, e) {
		var i, a = arguments;

		for (i=1; i<a.length; i++) {
			e = a[i];

			tinymce.each(e, function(v, n) {
				if (typeof(v) !== 'undefined')
					o[n] = v;
			});
		}

		return o;
	},

	trim : function(s) {
		return (s ? '' + s : '').replace(/^\s*|\s*$/g, '');
	},


	create : function(s, p) {
		var t = this, sp, ns, cn, scn, c, de = 0;

		// Parse : <prefix> <class>:<super class>
		s = /^((static) )?([\w.]+)(:([\w.]+))?/.exec(s);
		cn = s[3].match(/(^|\.)(\w+)$/i)[2]; // Class name

		// Create namespace for new class
		ns = t.createNS(s[3].replace(/\.\w+$/, ''));

		// Class already exists
		if (ns[cn])
			return;

		// Make pure static class
		if (s[2] == 'static') {
			ns[cn] = p;

			if (this.onCreate)
				this.onCreate(s[2], s[3], ns[cn]);

			return;
		}

		// Create default constructor
		if (!p[cn]) {
			p[cn] = function() {};
			de = 1;
		}

		// Add constructor and methods
		ns[cn] = p[cn];
		t.extend(ns[cn].prototype, p);

		// Extend
		if (s[5]) {
			sp = t.resolve(s[5]).prototype;
			scn = s[5].match(/\.(\w+)$/i)[1]; // Class name

			// Extend constructor
			c = ns[cn];
			if (de) {
				// Add passthrough constructor
				ns[cn] = function() {
					return sp[scn].apply(this, arguments);
				};
			} else {
				// Add inherit constructor
				ns[cn] = function() {
					this.parent = sp[scn];
					return c.apply(this, arguments);
				};
			}
			ns[cn].prototype[cn] = ns[cn];

			// Add super methods
			t.each(sp, function(f, n) {
				ns[cn].prototype[n] = sp[n];
			});

			// Add overridden methods
			t.each(p, function(f, n) {
				// Extend methods if needed
				if (sp[n]) {
					ns[cn].prototype[n] = function() {
						this.parent = sp[n];
						return f.apply(this, arguments);
					};
				} else {
					if (n != cn)
						ns[cn].prototype[n] = f;
				}
			});
		}

		// Add static methods
		t.each(p['static'], function(f, n) {
			ns[cn][n] = f;
		});

		if (this.onCreate)
			this.onCreate(s[2], s[3], ns[cn].prototype);
	},

	walk : function(o, f, n, s) {
		s = s || this;

		if (o) {
			if (n)
				o = o[n];

			tinymce.each(o, function(o, i) {
				if (f.call(s, o, i, n) === false)
					return false;

				tinymce.walk(o, f, n, s);
			});
		}
	},

	createNS : function(n, o) {
		var i, v;

		o = o || window;

		n = n.split('.');
		for (i=0; i<n.length; i++) {
			v = n[i];

			if (!o[v])
				o[v] = {};

			o = o[v];
		}

		return o;
	},

	resolve : function(n, o) {
		var i, l;

		o = o || window;

		n = n.split('.');
		for (i=0, l = n.length; i<l; i++) {
			o = o[n[i]];

			if (!o)
				break;
		}

		return o;
	},

	addUnload : function(f, s) {
		var t = this, w = window;

		f = {func : f, scope : s || this};

		if (!t.unloads) {
			function unload() {
				var li = t.unloads, o, n;

				if (li) {
					// Call unload handlers
					for (n in li) {
						o = li[n];

						if (o && o.func)
							o.func.call(o.scope, 1); // Send in one arg to distinct unload and user destroy
					}

					// Detach unload function
					if (w.detachEvent) {
						w.detachEvent('onbeforeunload', fakeUnload);
						w.detachEvent('onunload', unload);
					} else if (w.removeEventListener)
						w.removeEventListener('unload', unload, false);

					// Destroy references
					t.unloads = o = li = w = unload = 0;

					// Run garbarge collector on IE
					if (window.CollectGarbage)
						window.CollectGarbage();
				}
			};

			function fakeUnload() {
				var d = document;

				// Is there things still loading, then do some magic
				if (d.readyState == 'interactive') {
					function stop() {
						// Prevent memory leak
						d.detachEvent('onstop', stop);

						// Call unload handler
						if (unload)
							unload();

						d = 0;
					};

					// Fire unload when the currently loading page is stopped
					if (d)
						d.attachEvent('onstop', stop);

					// Remove onstop listener after a while to prevent the unload function
					// to execute if the user presses cancel in an onbeforeunload
					// confirm dialog and then presses the browser stop button
					window.setTimeout(function() {
						if (d)
							d.detachEvent('onstop', stop);
					}, 0);
				}
			};

			// Attach unload handler
			if (w.attachEvent) {
				w.attachEvent('onunload', unload);
				w.attachEvent('onbeforeunload', fakeUnload);
			} else if (w.addEventListener)
				w.addEventListener('unload', unload, false);

			// Setup initial unload handler array
			t.unloads = [f];
		} else
			t.unloads.push(f);

		return f;
	},

	removeUnload : function(f) {
		var u = this.unloads, r = null;

		tinymce.each(u, function(o, i) {
			if (o && o.func == f) {
				u.splice(i, 1);
				r = f;
				return false;
			}
		});

		return r;
	},

	explode : function(s, d) {
		return s ? tinymce.map(s.split(d || ','), tinymce.trim) : s;
	},

	_addVer : function(u) {
		var v;

		if (!this.query)
			return u;

		v = (u.indexOf('?') == -1 ? '?' : '&') + this.query;

		if (u.indexOf('#') == -1)
			return u + v;

		return u.replace('#', v + '#');
	}

	};

// Required for GZip AJAX loading
window.tinymce = tinymce;

// Initialize the API
tinymce._init();
tinymce.create('tinymce.util.Dispatcher', {
	scope : null,
	listeners : null,

	Dispatcher : function(s) {
		this.scope = s || this;
		this.listeners = [];
	},

	add : function(cb, s) {
		this.listeners.push({cb : cb, scope : s || this.scope});

		return cb;
	},

	addToTop : function(cb, s) {
		this.listeners.unshift({cb : cb, scope : s || this.scope});

		return cb;
	},

	remove : function(cb) {
		var l = this.listeners, o = null;

		tinymce.each(l, function(c, i) {
			if (cb == c.cb) {
				o = cb;
				l.splice(i, 1);
				return false;
			}
		});

		return o;
	},

	dispatch : function() {
		var s, a = arguments, i, li = this.listeners, c;

		// Needs to be a real loop since the listener count might change while looping
		// And this is also more efficient
		for (i = 0; i<li.length; i++) {
			c = li[i];
			s = c.cb.apply(c.scope, a);

			if (s === false)
				break;
		}

		return s;
	}

	});
(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.util.URI', {
		URI : function(u, s) {
			var t = this, o, a, b;

			// Default settings
			s = t.settings = s || {};

			// Strange app protocol or local anchor
			if (/^(mailto|tel|news|javascript|about):/i.test(u) || /^\s*#/.test(u)) {
				t.source = u;
				return;
			}

			// Absolute path with no host, fake host and protocol
			if (u.indexOf('/') === 0 && u.indexOf('//') !== 0)
				u = (s.base_uri ? s.base_uri.protocol || 'http' : 'http') + '://mce_host' + u;

			// Relative path
			if (u.indexOf(':/') === -1 && u.indexOf('//') !== 0)
				u = (s.base_uri.protocol || 'http') + '://mce_host' + t.toAbsPath(s.base_uri.path, u);

			// Parse URL (Credits goes to Steave, http://blog.stevenlevithan.com/archives/parseuri)
			u = u.replace(/@@/g, '(mce_at)'); // Zope 3 workaround, they use @@something
			u = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(u);
			each(["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"], function(v, i) {
				var s = u[i];

				// Zope 3 workaround, they use @@something
				if (s)
					s = s.replace(/\(mce_at\)/g, '@@');

				t[v] = s;
			});

			if (b = s.base_uri) {
				if (!t.protocol)
					t.protocol = b.protocol;

				if (!t.userInfo)
					t.userInfo = b.userInfo;

				if (!t.port && t.host == 'mce_host')
					t.port = b.port;

				if (!t.host || t.host == 'mce_host')
					t.host = b.host;

				t.source = '';
			}

			//t.path = t.path || '/';
		},

		setPath : function(p) {
			var t = this;

			p = /^(.*?)\/?(\w+)?$/.exec(p);

			// Update path parts
			t.path = p[0];
			t.directory = p[1];
			t.file = p[2];

			// Rebuild source
			t.source = '';
			t.getURI();
		},

		toRelative : function(u) {
			var t = this, o;

			if (u === "./")
				return u;

			u = new tinymce.util.URI(u, {base_uri : t});

			// Not on same domain/port or protocol
			if ((u.host != 'mce_host' && t.host != u.host && u.host) || t.port != u.port || t.protocol != u.protocol)
				return u.getURI();

			o = t.toRelPath(t.path, u.path);

			// Add query
			if (u.query)
				o += '?' + u.query;

			// Add anchor
			if (u.anchor)
				o += '#' + u.anchor;

			return o;
		},
	
		toAbsolute : function(u, nh) {
			var u = new tinymce.util.URI(u, {base_uri : this});

			return u.getURI(this.host == u.host ? nh : 0);
		},

		toRelPath : function(base, path) {
			var items, bp = 0, out = '', i, l;

			// Split the paths
			base = base.substring(0, base.lastIndexOf('/'));
			base = base.split('/');
			items = path.split('/');

			if (base.length >= items.length) {
				for (i = 0, l = base.length; i < l; i++) {
					if (i >= items.length || base[i] != items[i]) {
						bp = i + 1;
						break;
					}
				}
			}

			if (base.length < items.length) {
				for (i = 0, l = items.length; i < l; i++) {
					if (i >= base.length || base[i] != items[i]) {
						bp = i + 1;
						break;
					}
				}
			}

			if (bp == 1)
				return path;

			for (i = 0, l = base.length - (bp - 1); i < l; i++)
				out += "../";

			for (i = bp - 1, l = items.length; i < l; i++) {
				if (i != bp - 1)
					out += "/" + items[i];
				else
					out += items[i];
			}

			return out;
		},

		toAbsPath : function(base, path) {
			var i, nb = 0, o = [], tr;

			// Split paths
			tr = /\/$/.test(path) ? '/' : '';
			base = base.split('/');
			path = path.split('/');

			// Remove empty chunks
			each(base, function(k) {
				if (k)
					o.push(k);
			});

			base = o;

			// Merge relURLParts chunks
			for (i = path.length - 1, o = []; i >= 0; i--) {
				// Ignore empty or .
				if (path[i].length == 0 || path[i] == ".")
					continue;

				// Is parent
				if (path[i] == '..') {
					nb++;
					continue;
				}

				// Move up
				if (nb > 0) {
					nb--;
					continue;
				}

				o.push(path[i]);
			}

			i = base.length - nb;

			// If /a/b/c or /
			if (i <= 0)
				return '/' + o.reverse().join('/') + tr;

			return '/' + base.slice(0, i).join('/') + '/' + o.reverse().join('/') + tr;
		},

		getURI : function(nh) {
			var s, t = this;

			// Rebuild source
			if (!t.source || nh) {
				s = '';

				if (!nh) {
					if (t.protocol)
						s += t.protocol + '://';

					if (t.userInfo)
						s += t.userInfo + '@';

					if (t.host)
						s += t.host;

					if (t.port)
						s += ':' + t.port;
				}

				if (t.path)
					s += t.path;

				if (t.query)
					s += '?' + t.query;

				if (t.anchor)
					s += '#' + t.anchor;

				t.source = s;
			}

			return t.source;
		}

		});
})();
(function() {
	var each = tinymce.each;

	tinymce.create('static tinymce.util.Cookie', {
		getHash : function(n) {
			var v = this.get(n), h;

			if (v) {
				each(v.split('&'), function(v) {
					v = v.split('=');
					h = h || {};
					h[unescape(v[0])] = unescape(v[1]);
				});
			}

			return h;
		},

		setHash : function(n, v, e, p, d, s) {
			var o = '';

			each(v, function(v, k) {
				o += (!o ? '' : '&') + escape(k) + '=' + escape(v);
			});

			this.set(n, o, e, p, d, s);
		},

		get : function(n) {
			var c = document.cookie, e, p = n + "=", b;

			// Strict mode
			if (!c)
				return;

			b = c.indexOf("; " + p);

			if (b == -1) {
				b = c.indexOf(p);

				if (b != 0)
					return null;
			} else
				b += 2;

			e = c.indexOf(";", b);

			if (e == -1)
				e = c.length;

			return unescape(c.substring(b + p.length, e));
		},

		set : function(n, v, e, p, d, s) {
			document.cookie = n + "=" + escape(v) +
				((e) ? "; expires=" + e.toGMTString() : "") +
				((p) ? "; path=" + escape(p) : "") +
				((d) ? "; domain=" + d : "") +
				((s) ? "; secure" : "");
		},

		remove : function(n, p) {
			var d = new Date();

			d.setTime(d.getTime() - 1000);

			this.set(n, '', d, p, d);
		}

		});
})();
tinymce.create('static tinymce.util.JSON', {
	serialize : function(o) {
		var i, v, s = tinymce.util.JSON.serialize, t;

		if (o == null)
			return 'null';

		t = typeof o;

		if (t == 'string') {
			v = '\bb\tt\nn\ff\rr\""\'\'\\\\';

			return '"' + o.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g, function(a, b) {
				i = v.indexOf(b);

				if (i + 1)
					return '\\' + v.charAt(i + 1);

				a = b.charCodeAt().toString(16);

				return '\\u' + '0000'.substring(a.length) + a;
			}) + '"';
		}

		if (t == 'object') {
			if (o.hasOwnProperty && o instanceof Array) {
					for (i=0, v = '['; i<o.length; i++)
						v += (i > 0 ? ',' : '') + s(o[i]);

					return v + ']';
				}

				v = '{';

				for (i in o)
					v += typeof o[i] != 'function' ? (v.length > 1 ? ',"' : '"') + i + '":' + s(o[i]) : '';

				return v + '}';
		}

		return '' + o;
	},

	parse : function(s) {
		try {
			return eval('(' + s + ')');
		} catch (ex) {
			// Ignore
		}
	}

	});
tinymce.create('static tinymce.util.XHR', {
	send : function(o) {
		var x, t, w = window, c = 0;

		// Default settings
		o.scope = o.scope || this;
		o.success_scope = o.success_scope || o.scope;
		o.error_scope = o.error_scope || o.scope;
		o.async = o.async === false ? false : true;
		o.data = o.data || '';

		function get(s) {
			x = 0;

			try {
				x = new ActiveXObject(s);
			} catch (ex) {
			}

			return x;
		};

		x = w.XMLHttpRequest ? new XMLHttpRequest() : get('Microsoft.XMLHTTP') || get('Msxml2.XMLHTTP');

		if (x) {
			if (x.overrideMimeType)
				x.overrideMimeType(o.content_type);

			x.open(o.type || (o.data ? 'POST' : 'GET'), o.url, o.async);

			if (o.content_type)
				x.setRequestHeader('Content-Type', o.content_type);

			x.send(o.data);

			function ready() {
				if (!o.async || x.readyState == 4 || c++ > 10000) {
					if (o.success && c < 10000 && x.status == 200)
						o.success.call(o.success_scope, '' + x.responseText, x, o);
					else if (o.error)
						o.error.call(o.error_scope, c > 10000 ? 'TIMED_OUT' : 'GENERAL', x, o);

					x = null;
				} else
					w.setTimeout(ready, 10);
			};

			// Syncronous request
			if (!o.async)
				return ready();

			// Wait for response, onReadyStateChange can not be used since it leaks memory in IE
			t = w.setTimeout(ready, 10);
		}

		}
});
(function() {
	var extend = tinymce.extend, JSON = tinymce.util.JSON, XHR = tinymce.util.XHR;

	tinymce.create('tinymce.util.JSONRequest', {
		JSONRequest : function(s) {
			this.settings = extend({
			}, s);
			this.count = 0;
		},

		send : function(o) {
			var ecb = o.error, scb = o.success;

			o = extend(this.settings, o);

			o.success = function(c, x) {
				c = JSON.parse(c);

				if (typeof(c) == 'undefined') {
					c = {
						error : 'JSON Parse error.'
					};
				}

				if (c.error)
					ecb.call(o.error_scope || o.scope, c.error, x);
				else
					scb.call(o.success_scope || o.scope, c.result);
			};

			o.error = function(ty, x) {
				ecb.call(o.error_scope || o.scope, ty, x);
			};

			o.data = JSON.serialize({
				id : o.id || 'c' + (this.count++),
				method : o.method,
				params : o.params
			});

			// JSON content type for Ruby on rails. Bug: #1883287
			o.content_type = 'application/json';

			XHR.send(o);
		},

		'static' : {
			sendRPC : function(o) {
				return new tinymce.util.JSONRequest().send(o);
			}
		}

		});
}());(function(tinymce) {
	// Shorten names
	var each = tinymce.each, is = tinymce.is;
	var isWebKit = tinymce.isWebKit, isIE = tinymce.isIE;

	tinymce.create('tinymce.dom.DOMUtils', {
		doc : null,
		root : null,
		files : null,
		pixelStyles : /^(top|left|bottom|right|width|height|borderWidth)$/,
		props : {
			"for" : "htmlFor",
			"class" : "className",
			className : "className",
			checked : "checked",
			disabled : "disabled",
			maxlength : "maxLength",
			readonly : "readOnly",
			selected : "selected",
			value : "value",
			id : "id",
			name : "name",
			type : "type"
		},

		DOMUtils : function(d, s) {
			var t = this;

			t.doc = d;
			t.win = window;
			t.files = {};
			t.cssFlicker = false;
			t.counter = 0;
			t.boxModel = !tinymce.isIE || d.compatMode == "CSS1Compat"; 
			t.stdMode = d.documentMode === 8;

			this.settings = s = tinymce.extend({
				keep_values : false,
				hex_colors : 1,
				process_html : 1
			}, s);

			// Fix IE6SP2 flicker and check it failed for pre SP2
			if (tinymce.isIE6) {
				try {
					d.execCommand('BackgroundImageCache', false, true);
				} catch (e) {
					t.cssFlicker = true;
				}
			}

			tinymce.addUnload(t.destroy, t);
		},

		getRoot : function() {
			var t = this, s = t.settings;

			return (s && t.get(s.root_element)) || t.doc.body;
		},

		getViewPort : function(w) {
			var d, b;

			w = !w ? this.win : w;
			d = w.document;
			b = this.boxModel ? d.documentElement : d.body;

			// Returns viewport size excluding scrollbars
			return {
				x : w.pageXOffset || b.scrollLeft,
				y : w.pageYOffset || b.scrollTop,
				w : w.innerWidth || b.clientWidth,
				h : w.innerHeight || b.clientHeight
			};
		},

		getRect : function(e) {
			var p, t = this, sr;

			e = t.get(e);
			p = t.getPos(e);
			sr = t.getSize(e);

			return {
				x : p.x,
				y : p.y,
				w : sr.w,
				h : sr.h
			};
		},

		getSize : function(e) {
			var t = this, w, h;

			e = t.get(e);
			w = t.getStyle(e, 'width');
			h = t.getStyle(e, 'height');

			// Non pixel value, then force offset/clientWidth
			if (w.indexOf('px') === -1)
				w = 0;

			// Non pixel value, then force offset/clientWidth
			if (h.indexOf('px') === -1)
				h = 0;

			return {
				w : parseInt(w) || e.offsetWidth || e.clientWidth,
				h : parseInt(h) || e.offsetHeight || e.clientHeight
			};
		},

		is : function(n, patt) {
			return tinymce.dom.Sizzle.matches(patt, n.nodeType ? [n] : n).length > 0;
		},

		getParent : function(n, f, r) {
			return this.getParents(n, f, r, false);
		},

		getParents : function(n, f, r, c) {
			var t = this, na, se = t.settings, o = [];

			n = t.get(n);
			c = c === undefined;

			if (se.strict_root)
				r = r || t.getRoot();

			// Wrap node name as func
			if (is(f, 'string')) {
				na = f;

				if (f === '*') {
					f = function(n) {return n.nodeType == 1;};
				} else {
					f = function(n) {
						return t.is(n, na);
					};
				}
			}

			while (n) {
				if (n == r || !n.nodeType || n.nodeType === 9)
					break;

				if (!f || f(n)) {
					if (c)
						o.push(n);
					else
						return n;
				}

				n = n.parentNode;
			}

			return c ? o : null;
		},

		get : function(e) {
			var n;

			if (e && this.doc && typeof(e) == 'string') {
				n = e;
				e = this.doc.getElementById(e);

				// IE and Opera returns meta elements when they match the specified input ID, but getElementsByName seems to do the trick
				if (e && e.id !== n)
					return this.doc.getElementsByName(n)[1];
			}

			return e;
		},


		select : function(pa, s) {
			var t = this;

			return tinymce.dom.Sizzle(pa, t.get(s) || t.get(t.settings.root_element) || t.doc, []);
		},


		add : function(p, n, a, h, c) {
			var t = this;

			return this.run(p, function(p) {
				var e, k;

				e = is(n, 'string') ? t.doc.createElement(n) : n;
				t.setAttribs(e, a);

				if (h) {
					if (h.nodeType)
						e.appendChild(h);
					else
						t.setHTML(e, h);
				}

				return !c ? p.appendChild(e) : e;
			});
		},

		create : function(n, a, h) {
			return this.add(this.doc.createElement(n), n, a, h, 1);
		},

		createHTML : function(n, a, h) {
			var o = '', t = this, k;

			o += '<' + n;

			for (k in a) {
				if (a.hasOwnProperty(k))
					o += ' ' + k + '="' + t.encode(a[k]) + '"';
			}

			if (tinymce.is(h))
				return o + '>' + h + '</' + n + '>';

			return o + ' />';
		},

		remove : function(n, k) {
			var t = this;

			return this.run(n, function(n) {
				var p, g, i;

				p = n.parentNode;

				if (!p)
					return null;

				if (k) {
					for (i = n.childNodes.length - 1; i >= 0; i--)
						t.insertAfter(n.childNodes[i], n);

					//each(n.childNodes, function(c) {
					//	p.insertBefore(c.cloneNode(true), n);
					//});
				}

				// Fix IE psuedo leak
				if (t.fixPsuedoLeaks) {
					p = n.cloneNode(true);
					k = 'IELeakGarbageBin';
					g = t.get(k) || t.add(t.doc.body, 'div', {id : k, style : 'display:none'});
					g.appendChild(n);
					g.innerHTML = '';

					return p;
				}

				return p.removeChild(n);
			});
		},


		setStyle : function(n, na, v) {
			var t = this;

			return t.run(n, function(e) {
				var s, i;

				s = e.style;

				// Camelcase it, if needed
				na = na.replace(/-(\D)/g, function(a, b){
					return b.toUpperCase();
				});

				// Default px suffix on these
				if (t.pixelStyles.test(na) && (tinymce.is(v, 'number') || /^[\-0-9\.]+$/.test(v)))
					v += 'px';

				switch (na) {
					case 'opacity':
						// IE specific opacity
						if (isIE) {
							s.filter = v === '' ? '' : "alpha(opacity=" + (v * 100) + ")";

							if (!n.currentStyle || !n.currentStyle.hasLayout)
								s.display = 'inline-block';
						}

						// Fix for older browsers
						s[na] = s['-moz-opacity'] = s['-khtml-opacity'] = v || '';
						break;

					case 'float':
						isIE ? s.styleFloat = v : s.cssFloat = v;
						break;
					
					default:
						s[na] = v || '';
				}

				// Force update of the style data
				if (t.settings.update_styles)
					t.setAttrib(e, 'mce_style');
			});
		},

		getStyle : function(n, na, c) {
			n = this.get(n);

			if (!n)
				return false;

			// Gecko
			if (this.doc.defaultView && c) {
				// Remove camelcase
				na = na.replace(/[A-Z]/g, function(a){
					return '-' + a;
				});

				try {
					return this.doc.defaultView.getComputedStyle(n, null).getPropertyValue(na);
				} catch (ex) {
					// Old safari might fail
					return null;
				}
			}

			// Camelcase it, if needed
			na = na.replace(/-(\D)/g, function(a, b){
				return b.toUpperCase();
			});

			if (na == 'float')
				na = isIE ? 'styleFloat' : 'cssFloat';

			// IE & Opera
			if (n.currentStyle && c)
				return n.currentStyle[na];

			return n.style[na];
		},

		setStyles : function(e, o) {
			var t = this, s = t.settings, ol;

			ol = s.update_styles;
			s.update_styles = 0;

			each(o, function(v, n) {
				t.setStyle(e, n, v);
			});

			// Update style info
			s.update_styles = ol;
			if (s.update_styles)
				t.setAttrib(e, s.cssText);
		},

		setAttrib : function(e, n, v) {
			var t = this;

			// Whats the point
			if (!e || !n)
				return;

			// Strict XML mode
			if (t.settings.strict)
				n = n.toLowerCase();

			return this.run(e, function(e) {
				var s = t.settings;

				switch (n) {
					case "style":
						if (!is(v, 'string')) {
							each(v, function(v, n) {
								t.setStyle(e, n, v);
							});

							return;
						}

						// No mce_style for elements with these since they might get resized by the user
						if (s.keep_values) {
							if (v && !t._isRes(v))
								e.setAttribute('mce_style', v, 2);
							else
								e.removeAttribute('mce_style', 2);
						}

						e.style.cssText = v;
						break;

					case "class":
						e.className = v || ''; // Fix IE null bug
						break;

					case "src":
					case "href":
						if (s.keep_values) {
							if (s.url_converter)
								v = s.url_converter.call(s.url_converter_scope || t, v, n, e);

							t.setAttrib(e, 'mce_' + n, v, 2);
						}

						break;
					
					case "shape":
						e.setAttribute('mce_style', v);
						break;
				}

				if (is(v) && v !== null && v.length !== 0)
					e.setAttribute(n, '' + v, 2);
				else
					e.removeAttribute(n, 2);
			});
		},

		setAttribs : function(e, o) {
			var t = this;

			return this.run(e, function(e) {
				each(o, function(v, n) {
					t.setAttrib(e, n, v);
				});
			});
		},


		getAttrib : function(e, n, dv) {
			var v, t = this;

			e = t.get(e);

			if (!e || e.nodeType !== 1)
				return false;

			if (!is(dv))
				dv = '';

			// Try the mce variant for these
			if (/^(src|href|style|coords|shape)$/.test(n)) {
				v = e.getAttribute("mce_" + n);

				if (v)
					return v;
			}

			if (isIE && t.props[n]) {
				v = e[t.props[n]];
				v = v && v.nodeValue ? v.nodeValue : v;
			}

			if (!v)
				v = e.getAttribute(n, 2);

			if (n === 'style') {
				v = v || e.style.cssText;

				if (v) {
					v = t.serializeStyle(t.parseStyle(v));

					if (t.settings.keep_values && !t._isRes(v))
						e.setAttribute('mce_style', v);
				}
			}

			// Remove Apple and WebKit stuff
			if (isWebKit && n === "class" && v)
				v = v.replace(/(apple|webkit)\-[a-z\-]+/gi, '');

			// Handle IE issues
			if (isIE) {
				switch (n) {
					case 'rowspan':
					case 'colspan':
						// IE returns 1 as default value
						if (v === 1)
							v = '';

						break;

					case 'size':
						// IE returns +0 as default value for size
						if (v === '+0' || v === 20 || v === 0)
							v = '';

						break;

					case 'width':
					case 'height':
					case 'vspace':
					case 'checked':
					case 'disabled':
					case 'readonly':
						if (v === 0)
							v = '';

						break;

					case 'hspace':
						// IE returns -1 as default value
						if (v === -1)
							v = '';

						break;

					case 'maxlength':
					case 'tabindex':
						// IE returns default value
						if (v === 32768 || v === 2147483647 || v === '32768')
							v = '';

						break;

					case 'multiple':
					case 'compact':
					case 'noshade':
					case 'nowrap':
						if (v === 65535)
							return n;

						return dv;

					case 'shape':
						v = v.toLowerCase();
						break;

					default:
						// IE has odd anonymous function for event attributes
						if (n.indexOf('on') === 0 && v)
							v = ('' + v).replace(/^function\s+\w+\(\)\s+\{\s+(.*)\s+\}$/, '$1');
				}
			}

			return (v !== undefined && v !== null && v !== '') ? '' + v : dv;
		},

		getPos : function(n, ro) {
			var t = this, x = 0, y = 0, e, d = t.doc, r;

			n = t.get(n);
			ro = ro || d.body;

			if (n) {
				// Use getBoundingClientRect on IE, Opera has it but it's not perfect
				if (isIE && !t.stdMode) {
					n = n.getBoundingClientRect();
					e = t.boxModel ? d.documentElement : d.body;
					x = t.getStyle(t.select('html')[0], 'borderWidth'); // Remove border
					x = (x == 'medium' || t.boxModel && !t.isIE6) && 2 || x;
					n.top += t.win.self != t.win.top ? 2 : 0; // IE adds some strange extra cord if used in a frameset

					return {x : n.left + e.scrollLeft - x, y : n.top + e.scrollTop - x};
				}

				r = n;
				while (r && r != ro && r.nodeType) {
					x += r.offsetLeft || 0;
					y += r.offsetTop || 0;
					r = r.offsetParent;
				}

				r = n.parentNode;
				while (r && r != ro && r.nodeType) {
					x -= r.scrollLeft || 0;
					y -= r.scrollTop || 0;
					r = r.parentNode;
				}
			}

			return {x : x, y : y};
		},

		parseStyle : function(st) {
			var t = this, s = t.settings, o = {};

			if (!st)
				return o;

			function compress(p, s, ot) {
				var t, r, b, l;

				// Get values and check it it needs compressing
				t = o[p + '-top' + s];
				if (!t)
					return;

				r = o[p + '-right' + s];
				if (t != r)
					return;

				b = o[p + '-bottom' + s];
				if (r != b)
					return;

				l = o[p + '-left' + s];
				if (b != l)
					return;

				// Compress
				o[ot] = l;
				delete o[p + '-top' + s];
				delete o[p + '-right' + s];
				delete o[p + '-bottom' + s];
				delete o[p + '-left' + s];
			};

			function compress2(ta, a, b, c) {
				var t;

				t = o[a];
				if (!t)
					return;

				t = o[b];
				if (!t)
					return;

				t = o[c];
				if (!t)
					return;

				// Compress
				o[ta] = o[a] + ' ' + o[b] + ' ' + o[c];
				delete o[a];
				delete o[b];
				delete o[c];
			};

			st = st.replace(/&(#?[a-z0-9]+);/g, '&$1_MCE_SEMI_'); // Protect entities

			each(st.split(';'), function(v) {
				var sv, ur = [];

				if (v) {
					v = v.replace(/_MCE_SEMI_/g, ';'); // Restore entities
					v = v.replace(/url\([^\)]+\)/g, function(v) {ur.push(v);return 'url(' + ur.length + ')';});
					v = v.split(':');
					sv = tinymce.trim(v[1]);
					sv = sv.replace(/url\(([^\)]+)\)/g, function(a, b) {return ur[parseInt(b) - 1];});

					sv = sv.replace(/rgb\([^\)]+\)/g, function(v) {
						return t.toHex(v);
					});

					if (s.url_converter) {
						sv = sv.replace(/url\([\'\"]?([^\)\'\"]+)[\'\"]?\)/g, function(x, c) {
							return 'url(' + s.url_converter.call(s.url_converter_scope || t, t.decode(c), 'style', null) + ')';
						});
					}

					o[tinymce.trim(v[0]).toLowerCase()] = sv;
				}
			});

			compress("border", "", "border");
			compress("border", "-width", "border-width");
			compress("border", "-color", "border-color");
			compress("border", "-style", "border-style");
			compress("padding", "", "padding");
			compress("margin", "", "margin");
			compress2('border', 'border-width', 'border-style', 'border-color');

			if (isIE) {
				// Remove pointless border
				if (o.border == 'medium none')
					o.border = '';
			}

			return o;
		},

		serializeStyle : function(o) {
			var s = '';

			each(o, function(v, k) {
				if (k && v) {
					if (tinymce.isGecko && k.indexOf('-moz-') === 0)
						return;

					switch (k) {
						case 'color':
						case 'background-color':
							v = v.toLowerCase();
							break;
					}

					s += (s ? ' ' : '') + k + ': ' + v + ';';
				}
			});

			return s;
		},

		loadCSS : function(u) {
			var t = this, d = t.doc;

			if (!u)
				u = '';

			each(u.split(','), function(u) {
				if (t.files[u])
					return;

				t.files[u] = true;
				t.add(t.select('head')[0], 'link', {rel : 'stylesheet', href : tinymce._addVer(u)});
			});
		},


		addClass : function(e, c) {
			return this.run(e, function(e) {
				var o;

				if (!c)
					return 0;

				if (this.hasClass(e, c))
					return e.className;

				o = this.removeClass(e, c);

				return e.className = (o != '' ? (o + ' ') : '') + c;
			});
		},

		removeClass : function(e, c) {
			var t = this, re;

			return t.run(e, function(e) {
				var v;

				if (t.hasClass(e, c)) {
					if (!re)
						re = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");

					v = e.className.replace(re, ' ');

					return e.className = tinymce.trim(v != ' ' ? v : '');
				}

				return e.className;
			});
		},

		hasClass : function(n, c) {
			n = this.get(n);

			if (!n || !c)
				return false;

			return (' ' + n.className + ' ').indexOf(' ' + c + ' ') !== -1;
		},

		show : function(e) {
			return this.setStyle(e, 'display', 'block');
		},

		hide : function(e) {
			return this.setStyle(e, 'display', 'none');
		},

		isHidden : function(e) {
			e = this.get(e);

			return !e || e.style.display == 'none' || this.getStyle(e, 'display') == 'none';
		},


		uniqueId : function(p) {
			return (!p ? 'mce_' : p) + (this.counter++);
		},

		setHTML : function(e, h) {
			var t = this;

			return this.run(e, function(e) {
				var x, i, nl, n, p, x;

				h = t.processHTML(h);

				if (isIE) {
					function set() {
						try {
							// IE will remove comments from the beginning
							// unless you padd the contents with something
							e.innerHTML = '<br />' + h;
							e.removeChild(e.firstChild);
						} catch (ex) {
							// IE sometimes produces an unknown runtime error on innerHTML if it's an block element within a block element for example a div inside a p
							// This seems to fix this problem

							// Remove all child nodes
							while (e.firstChild)
								e.firstChild.removeNode();

							// Create new div with HTML contents and a BR infront to keep comments
							x = t.create('div');
							x.innerHTML = '<br />' + h;

							// Add all children from div to target
							each (x.childNodes, function(n, i) {
								// Skip br element
								if (i)
									e.appendChild(n);
							});
						}
					};

					// IE has a serious bug when it comes to paragraphs it can produce an invalid
					// DOM tree if contents like this <p><ul><li>Item 1</li></ul></p> is inserted
					// It seems to be that IE doesn't like a root block element placed inside another root block element
					if (t.settings.fix_ie_paragraphs)
						h = h.replace(/<p><\/p>|<p([^>]+)><\/p>|<p[^\/+]\/>/gi, '<p$1 mce_keep="true">&nbsp;</p>');

					set();

					if (t.settings.fix_ie_paragraphs) {
						// Check for odd paragraphs this is a sign of a broken DOM
						nl = e.getElementsByTagName("p");
						for (i = nl.length - 1, x = 0; i >= 0; i--) {
							n = nl[i];

							if (!n.hasChildNodes()) {
								if (!n.mce_keep) {
									x = 1; // Is broken
									break;
								}

								n.removeAttribute('mce_keep');
							}
						}
					}

					// Time to fix the madness IE left us
					if (x) {
						// So if we replace the p elements with divs and mark them and then replace them back to paragraphs
						// after we use innerHTML we can fix the DOM tree
						h = h.replace(/<p ([^>]+)>|<p>/g, '<div $1 mce_tmp="1">');
						h = h.replace(/<\/p>/g, '</div>');

						// Set the new HTML with DIVs
						set();

						// Replace all DIV elements with he mce_tmp attibute back to paragraphs
						// This is needed since IE has a annoying bug see above for details
						// This is a slow process but it has to be done. :(
						if (t.settings.fix_ie_paragraphs) {
							nl = e.getElementsByTagName("DIV");
							for (i = nl.length - 1; i >= 0; i--) {
								n = nl[i];

								// Is it a temp div
								if (n.mce_tmp) {
									// Create new paragraph
									p = t.doc.createElement('p');

									// Copy all attributes
									n.cloneNode(false).outerHTML.replace(/([a-z0-9\-_]+)=/gi, function(a, b) {
										var v;

										if (b !== 'mce_tmp') {
											v = n.getAttribute(b);

											if (!v && b === 'class')
												v = n.className;

											p.setAttribute(b, v);
										}
									});

									// Append all children to new paragraph
									for (x = 0; x<n.childNodes.length; x++)
										p.appendChild(n.childNodes[x].cloneNode(true));

									// Replace div with new paragraph
									n.swapNode(p);
								}
							}
						}
					}
				} else
					e.innerHTML = h;

				return h;
			});
		},

		processHTML : function(h) {
			var t = this, s = t.settings;

			if (!s.process_html)
				return h;

			// Convert strong and em to b and i in FF since it can't handle them
			if (tinymce.isGecko) {
				h = h.replace(/<(\/?)strong>|<strong( [^>]+)>/gi, '<$1b$2>');
				h = h.replace(/<(\/?)em>|<em( [^>]+)>/gi, '<$1i$2>');
			} else if (isIE) {
				h = h.replace(/&apos;/g, '&#39;'); // IE can't handle apos
				h = h.replace(/\s+(disabled|checked|readonly|selected)\s*=\s*[\"\']?(false|0)[\"\']?/gi, ''); // IE doesn't handle default values correct
			}

			// Fix some issues
			h = h.replace(/<a( )([^>]+)\/>|<a\/>/gi, '<a$1$2></a>'); // Force open

			// Store away src and href in mce_src and mce_href since browsers mess them up
			if (s.keep_values) {
				// Wrap scripts and styles in comments for serialization purposes
				if (/<script|style/.test(h)) {
					function trim(s) {
						// Remove prefix and suffix code for element
						s = s.replace(/(<!--\[CDATA\[|\]\]-->)/g, '\n');
						s = s.replace(/^[\r\n]*|[\r\n]*$/g, '');
						s = s.replace(/^\s*(\/\/\s*<!--|\/\/\s*<!\[CDATA\[|<!--|<!\[CDATA\[)[\r\n]*/g, '');
						s = s.replace(/\s*(\/\/\s*\]\]>|\/\/\s*-->|\]\]>|-->|\]\]-->)\s*$/g, '');

						return s;
					};

					// Preserve script elements
					h = h.replace(/<script([^>]+|)>([\s\S]*?)<\/script>/g, function(v, a, b) {
						// Remove prefix and suffix code for script element
						b = trim(b);

						// Force type attribute
						if (!a)
							a = ' type="text/javascript"';

						// Wrap contents in a comment
						if (b)
							b = '<!--\n' + b + '\n// -->';

						// Output fake element
						return '<mce:script' + a + '>' + b + '</mce:script>';
					});

					// Preserve style elements
					h = h.replace(/<style([^>]+|)>([\s\S]*?)<\/style>/g, function(v, a, b) {
						b = trim(b);
						return '<mce:style' + a + '><!--\n' + b + '\n--></mce:style><style' + a + ' mce_bogus="1">' + b + '</style>';
					});
				}

				h = h.replace(/<!\[CDATA\[([\s\S]+)\]\]>/g, '<!--[CDATA[$1]]-->');

				// Process all tags with src, href or style
				h = h.replace(/<([\w:]+) [^>]*(src|href|style|shape|coords)[^>]*>/gi, function(a, n) {
					function handle(m, b, c) {
						var u = c;

						// Tag already got a mce_ version
						if (a.indexOf('mce_' + b) != -1)
							return m;

						if (b == 'style') {
							// No mce_style for elements with these since they might get resized by the user
							if (t._isRes(c))
								return m;

							if (s.hex_colors) {
								u = u.replace(/rgb\([^\)]+\)/g, function(v) {
									return t.toHex(v);
								});
							}

							if (s.url_converter) {
								u = u.replace(/url\([\'\"]?([^\)\'\"]+)\)/g, function(x, c) {
									return 'url(' + t.encode(s.url_converter.call(s.url_converter_scope || t, t.decode(c), b, n)) + ')';
								});
							}
						} else if (b != 'coords' && b != 'shape') {
							if (s.url_converter)
								u = t.encode(s.url_converter.call(s.url_converter_scope || t, t.decode(c), b, n));
						}

						return ' ' + b + '="' + c + '" mce_' + b + '="' + u + '"';
					};

					a = a.replace(/ (src|href|style|coords|shape)=[\"]([^\"]+)[\"]/gi, handle); // W3C
					a = a.replace(/ (src|href|style|coords|shape)=[\']([^\']+)[\']/gi, handle); // W3C

					return a.replace(/ (src|href|style|coords|shape)=([^\s\"\'>]+)/gi, handle); // IE
				});
			}

			return h;
		},

		getOuterHTML : function(e) {
			var d;

			e = this.get(e);

			if (!e)
				return null;

			if (e.outerHTML !== undefined)
				return e.outerHTML;

			d = (e.ownerDocument || this.doc).createElement("body");
			d.appendChild(e.cloneNode(true));

			return d.innerHTML;
		},

		setOuterHTML : function(e, h, d) {
			var t = this;

			return this.run(e, function(e) {
				var n, tp;

				e = t.get(e);
				d = d || e.ownerDocument || t.doc;

				if (isIE && e.nodeType == 1)
					e.outerHTML = h;
				else {
					tp = d.createElement("body");
					tp.innerHTML = h;

					n = tp.lastChild;
					while (n) {
						t.insertAfter(n.cloneNode(true), e);
						n = n.previousSibling;
					}

					t.remove(e);
				}
			});
		},

		decode : function(s) {
			var e, n, v;

			// Look for entities to decode
			if (/&[^;]+;/.test(s)) {
				// Decode the entities using a div element not super efficient but less code
				e = this.doc.createElement("div");
				e.innerHTML = s;
				n = e.firstChild;
				v = '';

				if (n) {
					do {
						v += n.nodeValue;
					} while (n.nextSibling);
				}

				return v || s;
			}

			return s;
		},

		encode : function(s) {
			return s ? ('' + s).replace(/[<>&\"]/g, function (c, b) {
				switch (c) {
					case '&':
						return '&amp;';

					case '"':
						return '&quot;';

					case '<':
						return '&lt;';

					case '>':
						return '&gt;';
				}

				return c;
			}) : s;
		},


		insertAfter : function(n, r) {
			var t = this;

			r = t.get(r);

			return this.run(n, function(n) {
				var p, ns;

				p = r.parentNode;
				ns = r.nextSibling;

				if (ns)
					p.insertBefore(n, ns);
				else
					p.appendChild(n);

				return n;
			});
		},


		isBlock : function(n) {
			if (n.nodeType && n.nodeType !== 1)
				return false;

			n = n.nodeName || n;

			return /^(H[1-6]|HR|P|DIV|ADDRESS|PRE|FORM|TABLE|LI|OL|UL|TR|TD|CAPTION|BLOCKQUOTE|CENTER|DL|DT|DD|DIR|FIELDSET|NOSCRIPT|NOFRAMES|MENU|ISINDEX|SAMP)$/.test(n);
		},


		replace : function(n, o, k) {
			var t = this;

			if (is(o, 'array'))
				n = n.cloneNode(true);

			return t.run(o, function(o) {
				if (k) {
					each(o.childNodes, function(c) {
						n.appendChild(c.cloneNode(true));
					});
				}

				// Fix IE psuedo leak for elements since replacing elements if fairly common
				// Will break parentNode for some unknown reason
				if (t.fixPsuedoLeaks && o.nodeType === 1) {
					o.parentNode.insertBefore(n, o);
					t.remove(o);
					return n;
				}

				return o.parentNode.replaceChild(n, o);
			});
		},


		findCommonAncestor : function(a, b) {
			var ps = a, pe;

			while (ps) {
				pe = b;

				while (pe && ps != pe)
					pe = pe.parentNode;

				if (ps == pe)
					break;

				ps = ps.parentNode;
			}

			if (!ps && a.ownerDocument)
				return a.ownerDocument.documentElement;

			return ps;
		},

		toHex : function(s) {
			var c = /^\s*rgb\s*?\(\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?\)\s*$/i.exec(s);

			function hex(s) {
				s = parseInt(s).toString(16);

				return s.length > 1 ? s : '0' + s; // 0 -> 00
			};

			if (c) {
				s = '#' + hex(c[1]) + hex(c[2]) + hex(c[3]);

				return s;
			}

			return s;
		},

		getClasses : function() {
			var t = this, cl = [], i, lo = {}, f = t.settings.class_filter, ov;

			if (t.classes)
				return t.classes;

			function addClasses(s) {
				// IE style imports
				each(s.imports, function(r) {
					addClasses(r);
				});

				each(s.cssRules || s.rules, function(r) {
					// Real type or fake it on IE
					switch (r.type || 1) {
						// Rule
						case 1:
							if (r.selectorText) {
								each(r.selectorText.split(','), function(v) {
									v = v.replace(/^\s*|\s*$|^\s\./g, "");

									// Is internal or it doesn't contain a class
									if (/\.mce/.test(v) || !/\.[\w\-]+$/.test(v))
										return;

									// Remove everything but class name
									ov = v;
									v = v.replace(/.*\.([a-z0-9_\-]+).*/i, '$1');

									// Filter classes
									if (f && !(v = f(v, ov)))
										return;

									if (!lo[v]) {
										cl.push({'class' : v});
										lo[v] = 1;
									}
								});
							}
							break;

						// Import
						case 3:
							addClasses(r.styleSheet);
							break;
					}
				});
			};

			try {
				each(t.doc.styleSheets, addClasses);
			} catch (ex) {
				// Ignore
			}

			if (cl.length > 0)
				t.classes = cl;

			return cl;
		},

		run : function(e, f, s) {
			var t = this, o;

			if (t.doc && typeof(e) === 'string')
				e = t.get(e);

			if (!e)
				return false;

			s = s || this;
			if (!e.nodeType && (e.length || e.length === 0)) {
				o = [];

				each(e, function(e, i) {
					if (e) {
						if (typeof(e) == 'string')
							e = t.doc.getElementById(e);

						o.push(f.call(s, e, i));
					}
				});

				return o;
			}

			return f.call(s, e);
		},

		getAttribs : function(n) {
			var o;

			n = this.get(n);

			if (!n)
				return [];

			if (isIE) {
				o = [];

				// Object will throw exception in IE
				if (n.nodeName == 'OBJECT')
					return n.attributes;

				// It's crazy that this is faster in IE but it's because it returns all attributes all the time
				n.cloneNode(false).outerHTML.replace(/([a-z0-9\:\-_]+)=/gi, function(a, b) {
					o.push({specified : 1, nodeName : b});
				});

				return o;
			}

			return n.attributes;
		},

		destroy : function(s) {
			var t = this;

			t.win = t.doc = t.root = null;

			// Manual destroy then remove unload handler
			if (!s)
				tinymce.removeUnload(t.destroy);
		},

		createRng : function() {
			var d = this.doc;

			return d.createRange ? d.createRange() : new tinymce.dom.Range(this);
		},

		split : function(pe, e, re) {
			var t = this, r = t.createRng(), bef, aft, pa;

			// W3C valid browsers tend to leave empty nodes to the left/right side of the contents, this makes sence
			// but we don't want that in our code since it serves no purpose
			// For example if this is chopped:
			//   <p>text 1<span><b>CHOP</b></span>text 2</p>
			// would produce:
			//   <p>text 1<span></span></p><b>CHOP</b><p><span></span>text 2</p>
			// this function will then trim of empty edges and produce:
			//   <p>text 1</p><b>CHOP</b><p>text 2</p>
			function trimEdge(n, na) {
				n = n[na];

				if (n && n[na] && n[na].nodeType == 1 && isEmpty(n[na]))
					t.remove(n[na]);
			};

			function isEmpty(n) {
				n = t.getOuterHTML(n);
				n = n.replace(/<(img|hr|table)/gi, '-'); // Keep these convert them to - chars
				n = n.replace(/<[^>]+>/g, ''); // Remove all tags

				return n.replace(/[ \t\r\n]+|&nbsp;|&#160;/g, '') == '';
			};

			if (pe && e) {
				// Get before chunk
				r.setStartBefore(pe);
				r.setEndBefore(e);
				bef = r.extractContents();

				// Get after chunk
				r = t.createRng();
				r.setStartAfter(e);
				r.setEndAfter(pe);
				aft = r.extractContents();

				// Insert chunks and remove parent
				pa = pe.parentNode;

				// Remove right side edge of the before contents
				trimEdge(bef, 'lastChild');

				if (!isEmpty(bef))
					pa.insertBefore(bef, pe);

				if (re)
					pa.replaceChild(re, e);
				else
					pa.insertBefore(e, pe);

				// Remove left site edge of the after contents
				trimEdge(aft, 'firstChild');

				if (!isEmpty(aft))
					pa.insertBefore(aft, pe);

				t.remove(pe);

				return re || e;
			}
		},


		_isRes : function(c) {
			// Is live resizble element
			return /^(top|left|bottom|right|width|height)/i.test(c) || /;\s*(top|left|bottom|right|width|height)/i.test(c);
		}

		/*
		walk : function(n, f, s) {
			var d = this.doc, w;

			if (d.createTreeWalker) {
				w = d.createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false);

				while ((n = w.nextNode()) != null)
					f.call(s || this, n);
			} else
				tinymce.walk(n, f, 'childNodes', s);
		}
		*/

		/*
		toRGB : function(s) {
			var c = /^\s*?#([0-9A-F]{2})([0-9A-F]{1,2})([0-9A-F]{2})?\s*?$/.exec(s);

			if (c) {
				// #FFF -> #FFFFFF
				if (!is(c[3]))
					c[3] = c[2] = c[1];

				return "rgb(" + parseInt(c[1], 16) + "," + parseInt(c[2], 16) + "," + parseInt(c[3], 16) + ")";
			}

			return s;
		}
		*/

		});

	// Setup page DOM
	tinymce.DOM = new tinymce.dom.DOMUtils(document, {process_html : 0});
})(tinymce);
(function(ns) {
	// Traverse constants
	var EXTRACT = 0, CLONE = 1, DELETE = 2, extend = tinymce.extend;

	function indexOf(child, parent) {
		var i, node;

		if (child.parentNode != parent)
			return -1;

		for (node = parent.firstChild, i = 0; node != child; node = node.nextSibling)
			i++;

		return i;
	};

	function nodeIndex(n) {
		var i = 0;

		while (n.previousSibling) {
			i++;
			n = n.previousSibling;
		}

		return i;
	};

	function getSelectedNode(container, offset) {
		var child;

		if (container.nodeType == 3 /* TEXT_NODE */)
			return container;

		if (offset < 0)
			return container;

		child = container.firstChild;
		while (child != null && offset > 0) {
			--offset;
			child = child.nextSibling;
		}

		if (child != null)
			return child;

		return container;
	};

	// Range constructor
	function Range(dom) {
		var d = dom.doc;

		extend(this, {
			dom : dom,

			// Inital states
			startContainer : d,
			startOffset : 0,
			endContainer : d,
			endOffset : 0,
			collapsed : true,
			commonAncestorContainer : d,

			// Range constants
			START_TO_START : 0,
			START_TO_END : 1,
			END_TO_END : 2,
			END_TO_START : 3
		});
	};

	// Add range methods
	extend(Range.prototype, {
		setStart : function(n, o) {
			this._setEndPoint(true, n, o);
		},

		setEnd : function(n, o) {
			this._setEndPoint(false, n, o);
		},

		setStartBefore : function(n) {
			this.setStart(n.parentNode, nodeIndex(n));
		},

		setStartAfter : function(n) {
			this.setStart(n.parentNode, nodeIndex(n) + 1);
		},

		setEndBefore : function(n) {
			this.setEnd(n.parentNode, nodeIndex(n));
		},

		setEndAfter : function(n) {
			this.setEnd(n.parentNode, nodeIndex(n) + 1);
		},

		collapse : function(ts) {
			var t = this;

			if (ts) {
				t.endContainer = t.startContainer;
				t.endOffset = t.startOffset;
			} else {
				t.startContainer = t.endContainer;
				t.startOffset = t.endOffset;
			}

			t.collapsed = true;
		},

		selectNode : function(n) {
			this.setStartBefore(n);
			this.setEndAfter(n);
		},

		selectNodeContents : function(n) {
			this.setStart(n, 0);
			this.setEnd(n, n.nodeType === 1 ? n.childNodes.length : n.nodeValue.length);
		},

		compareBoundaryPoints : function(h, r) {
			var t = this, sc = t.startContainer, so = t.startOffset, ec = t.endContainer, eo = t.endOffset;

			// Check START_TO_START
			if (h === 0)
				return t._compareBoundaryPoints(sc, so, sc, so);

			// Check START_TO_END
			if (h === 1)
				return t._compareBoundaryPoints(sc, so, ec, eo);

			// Check END_TO_END
			if (h === 2)
				return t._compareBoundaryPoints(ec, eo, ec, eo);

			// Check END_TO_START
			if (h === 3)
				return t._compareBoundaryPoints(ec, eo, sc, so);
		},

		deleteContents : function() {
			this._traverse(DELETE);
		},

		extractContents : function() {
			return this._traverse(EXTRACT);
		},

		cloneContents : function() {
			return this._traverse(CLONE);
		},

		insertNode : function(n) {
			var t = this, nn, o;

			// Node is TEXT_NODE or CDATA
			if (n.nodeType === 3 || n.nodeType === 4) {
				nn = t.startContainer.splitText(t.startOffset);
				t.startContainer.parentNode.insertBefore(n, nn);
			} else {
				// Insert element node
				if (t.startContainer.childNodes.length > 0)
					o = t.startContainer.childNodes[t.startOffset];

				t.startContainer.insertBefore(n, o);
			}
		},

		surroundContents : function(n) {
			var t = this, f = t.extractContents();

			t.insertNode(n);
			n.appendChild(f);
			t.selectNode(n);
		},

		cloneRange : function() {
			var t = this;

			return extend(new Range(t.dom), {
				startContainer : t.startContainer,
				startOffset : t.startOffset,
				endContainer : t.endContainer,
				endOffset : t.endOffset,
				collapsed : t.collapsed,
				commonAncestorContainer : t.commonAncestorContainer
			});
		},

/*
		detach : function() {
			// Not implemented
		},
*/
		// Internal methods

		_isCollapsed : function() {
			return (this.startContainer == this.endContainer && this.startOffset == this.endOffset);
		},

		_compareBoundaryPoints : function (containerA, offsetA, containerB, offsetB) {
			var c, offsetC, n, cmnRoot, childA, childB;

			// In the first case the boundary-points have the same container. A is before B 
			// if its offset is less than the offset of B, A is equal to B if its offset is 
			// equal to the offset of B, and A is after B if its offset is greater than the 
			// offset of B.
			if (containerA == containerB) {
				if (offsetA == offsetB) {
					return 0; // equal
				} else if (offsetA < offsetB) {
					return -1; // before
				} else {
					return 1; // after
				}
			}

			// In the second case a child node C of the container of A is an ancestor 
			// container of B. In this case, A is before B if the offset of A is less than or 
			// equal to the index of the child node C and A is after B otherwise.
			c = containerB;
			while (c && c.parentNode != containerA) {
				c = c.parentNode;
			}
			if (c) {
				offsetC = 0;
				n = containerA.firstChild;

				while (n != c && offsetC < offsetA) {
					offsetC++;
					n = n.nextSibling;
				}

				if (offsetA <= offsetC) {
					return -1; // before
				} else {
					return 1; // after
				}
			}

			// In the third case a child node C of the container of B is an ancestor container 
			// of A. In this case, A is before B if the index of the child node C is less than 
			// the offset of B and A is after B otherwise.
			c = containerA;
			while (c && c.parentNode != containerB) {
				c = c.parentNode;
			}

			if (c) {
				offsetC = 0;
				n = containerB.firstChild;

				while (n != c && offsetC < offsetB) {
					offsetC++;
					n = n.nextSibling;
				}

				if (offsetC < offsetB) {
					return -1; // before
				} else {
					return 1; // after
				}
			}

			// In the fourth case, none of three other cases hold: the containers of A and B 
			// are siblings or descendants of sibling nodes. In this case, A is before B if 
			// the container of A is before the container of B in a pre-order traversal of the
			// Ranges' context tree and A is after B otherwise.
			cmnRoot = this.dom.findCommonAncestor(containerA, containerB);
			childA = containerA;

			while (childA && childA.parentNode != cmnRoot) {
				childA = childA.parentNode;  
			}

			if (!childA) {
				childA = cmnRoot;
			}

			childB = containerB;
			while (childB && childB.parentNode != cmnRoot) {
				childB = childB.parentNode;
			}

			if (!childB) {
				childB = cmnRoot;
			}

			if (childA == childB) {
				return 0; // equal
			}

			n = cmnRoot.firstChild;
			while (n) {
				if (n == childA) {
					return -1; // before
				}

				if (n == childB) {
					return 1; // after
				}

				n = n.nextSibling;
			}
		},

		_setEndPoint : function(st, n, o) {
			var t = this, ec, sc;

			if (st) {
				t.startContainer = n;
				t.startOffset = o;
			} else {
				t.endContainer = n;
				t.endOffset = o;
			}

			// If one boundary-point of a Range is set to have a root container 
			// other than the current one for the Range, the Range is collapsed to 
			// the new position. This enforces the restriction that both boundary-
			// points of a Range must have the same root container.
			ec = t.endContainer;
			while (ec.parentNode)
				ec = ec.parentNode;

			sc = t.startContainer;
			while (sc.parentNode)
				sc = sc.parentNode;

			if (sc != ec) {
				t.collapse(st);
			} else {
				// The start position of a Range is guaranteed to never be after the 
				// end position. To enforce this restriction, if the start is set to 
				// be at a position after the end, the Range is collapsed to that 
				// position.
				if (t._compareBoundaryPoints(t.startContainer, t.startOffset, t.endContainer, t.endOffset) > 0)
					t.collapse(st);
			}

			t.collapsed = t._isCollapsed();
			t.commonAncestorContainer = t.dom.findCommonAncestor(t.startContainer, t.endContainer);
		},

		// This code is heavily "inspired" by the Apache Xerces implementation. I hope they don't mind. :)

		_traverse : function(how) {
			var t = this, c, endContainerDepth = 0, startContainerDepth = 0, p, depthDiff, startNode, endNode, sp, ep;

			if (t.startContainer == t.endContainer)
				return t._traverseSameContainer(how);

			for (c = t.endContainer, p = c.parentNode; p != null; c = p, p = p.parentNode) {
				if (p == t.startContainer)
					return t._traverseCommonStartContainer(c, how);

				++endContainerDepth;
			}

			for (c = t.startContainer, p = c.parentNode; p != null; c = p, p = p.parentNode) {
				if (p == t.endContainer)
					return t._traverseCommonEndContainer(c, how);

				++startContainerDepth;
			}

			depthDiff = startContainerDepth - endContainerDepth;

			startNode = t.startContainer;
			while (depthDiff > 0) {
				startNode = startNode.parentNode;
				depthDiff--;
			}

			endNode = t.endContainer;
			while (depthDiff < 0) {
				endNode = endNode.parentNode;
				depthDiff++;
			}

			// ascend the ancestor hierarchy until we have a common parent.
			for (sp = startNode.parentNode, ep = endNode.parentNode; sp != ep; sp = sp.parentNode, ep = ep.parentNode) {
				startNode = sp;
				endNode = ep;
			}

			return t._traverseCommonAncestors(startNode, endNode, how);
		},

		_traverseSameContainer : function(how) {
			var t = this, frag, s, sub, n, cnt, sibling, xferNode;

			if (how != DELETE)
				frag = t.dom.doc.createDocumentFragment();

			// If selection is empty, just return the fragment
			if (t.startOffset == t.endOffset)
				return frag;

			// Text node needs special case handling
			if (t.startContainer.nodeType == 3 /* TEXT_NODE */) {
				// get the substring
				s = t.startContainer.nodeValue;
				sub = s.substring(t.startOffset, t.endOffset);

				// set the original text node to its new value
				if (how != CLONE) {
					t.startContainer.deleteData(t.startOffset, t.endOffset - t.startOffset);

					// Nothing is partially selected, so collapse to start point
					t.collapse(true);
				}

				if (how == DELETE)
					return null;

				frag.appendChild(t.dom.doc.createTextNode(sub));
				return frag;
			}

			// Copy nodes between the start/end offsets.
			n = getSelectedNode(t.startContainer, t.startOffset);
			cnt = t.endOffset - t.startOffset;

			while (cnt > 0) {
				sibling = n.nextSibling;
				xferNode = t._traverseFullySelected(n, how);

				if (frag)
					frag.appendChild( xferNode );

				--cnt;
				n = sibling;
			}

			// Nothing is partially selected, so collapse to start point
			if (how != CLONE)
				t.collapse(true);

			return frag;
		},

		_traverseCommonStartContainer : function(endAncestor, how) {
			var t = this, frag, n, endIdx, cnt, sibling, xferNode;

			if (how != DELETE)
				frag = t.dom.doc.createDocumentFragment();

			n = t._traverseRightBoundary(endAncestor, how);

			if (frag)
				frag.appendChild(n);

			endIdx = indexOf(endAncestor, t.startContainer);
			cnt = endIdx - t.startOffset;

			if (cnt <= 0) {
				// Collapse to just before the endAncestor, which 
				// is partially selected.
				if (how != CLONE) {
					t.setEndBefore(endAncestor);
					t.collapse(false);
				}

				return frag;
			}

			n = endAncestor.previousSibling;
			while (cnt > 0) {
				sibling = n.previousSibling;
				xferNode = t._traverseFullySelected(n, how);

				if (frag)
					frag.insertBefore(xferNode, frag.firstChild);

				--cnt;
				n = sibling;
			}

			// Collapse to just before the endAncestor, which 
			// is partially selected.
			if (how != CLONE) {
				t.setEndBefore(endAncestor);
				t.collapse(false);
			}

			return frag;
		},

		_traverseCommonEndContainer : function(startAncestor, how) {
			var t = this, frag, startIdx, n, cnt, sibling, xferNode;

			if (how != DELETE)
				frag = t.dom.doc.createDocumentFragment();

			n = t._traverseLeftBoundary(startAncestor, how);
			if (frag)
				frag.appendChild(n);

			startIdx = indexOf(startAncestor, t.endContainer);
			++startIdx;  // Because we already traversed it....

			cnt = t.endOffset - startIdx;
			n = startAncestor.nextSibling;
			while (cnt > 0) {
				sibling = n.nextSibling;
				xferNode = t._traverseFullySelected(n, how);

				if (frag)
					frag.appendChild(xferNode);

				--cnt;
				n = sibling;
			}

			if (how != CLONE) {
				t.setStartAfter(startAncestor);
				t.collapse(true);
			}

			return frag;
		},

		_traverseCommonAncestors : function(startAncestor, endAncestor, how) {
			var t = this, n, frag, commonParent, startOffset, endOffset, cnt, sibling, nextSibling;

			if (how != DELETE)
				frag = t.dom.doc.createDocumentFragment();

			n = t._traverseLeftBoundary(startAncestor, how);
			if (frag)
				frag.appendChild(n);

			commonParent = startAncestor.parentNode;
			startOffset = indexOf(startAncestor, commonParent);
			endOffset = indexOf(endAncestor, commonParent);
			++startOffset;

			cnt = endOffset - startOffset;
			sibling = startAncestor.nextSibling;

			while (cnt > 0) {
				nextSibling = sibling.nextSibling;
				n = t._traverseFullySelected(sibling, how);

				if (frag)
					frag.appendChild(n);

				sibling = nextSibling;
				--cnt;
			}

			n = t._traverseRightBoundary(endAncestor, how);

			if (frag)
				frag.appendChild(n);

			if (how != CLONE) {
				t.setStartAfter(startAncestor);
				t.collapse(true);
			}

			return frag;
		},

		_traverseRightBoundary : function(root, how) {
			var t = this, next = getSelectedNode(t.endContainer, t.endOffset - 1), parent, clonedParent, prevSibling, clonedChild, clonedGrandParent;
			var isFullySelected = next != t.endContainer;

			if (next == root)
				return t._traverseNode(next, isFullySelected, false, how);

			parent = next.parentNode;
			clonedParent = t._traverseNode(parent, false, false, how);

			while (parent != null) {
				while (next != null) {
					prevSibling = next.previousSibling;
					clonedChild = t._traverseNode(next, isFullySelected, false, how);

					if (how != DELETE)
						clonedParent.insertBefore(clonedChild, clonedParent.firstChild);

					isFullySelected = true;
					next = prevSibling;
				}

				if (parent == root)
					return clonedParent;

				next = parent.previousSibling;
				parent = parent.parentNode;

				clonedGrandParent = t._traverseNode(parent, false, false, how);

				if (how != DELETE)
					clonedGrandParent.appendChild(clonedParent);

				clonedParent = clonedGrandParent;
			}

			// should never occur
			return null;
		},

		_traverseLeftBoundary : function(root, how) {
			var t = this, next = getSelectedNode(t.startContainer, t.startOffset);
			var isFullySelected = next != t.startContainer, parent, clonedParent, nextSibling, clonedChild, clonedGrandParent;

			if (next == root)
				return t._traverseNode(next, isFullySelected, true, how);

			parent = next.parentNode;
			clonedParent = t._traverseNode(parent, false, true, how);

			while (parent != null) {
				while (next != null) {
					nextSibling = next.nextSibling;
					clonedChild = t._traverseNode(next, isFullySelected, true, how);

					if (how != DELETE)
						clonedParent.appendChild(clonedChild);

					isFullySelected = true;
					next = nextSibling;
				}

				if (parent == root)
					return clonedParent;

				next = parent.nextSibling;
				parent = parent.parentNode;

				clonedGrandParent = t._traverseNode(parent, false, true, how);

				if (how != DELETE)
					clonedGrandParent.appendChild(clonedParent);

				clonedParent = clonedGrandParent;
			}

			// should never occur
			return null;
		},

		_traverseNode : function(n, isFullySelected, isLeft, how) {
			var t = this, txtValue, newNodeValue, oldNodeValue, offset, newNode;

			if (isFullySelected)
				return t._traverseFullySelected(n, how);

			if (n.nodeType == 3 /* TEXT_NODE */) {
				txtValue = n.nodeValue;

				if (isLeft) {
					offset = t.startOffset;
					newNodeValue = txtValue.substring(offset);
					oldNodeValue = txtValue.substring(0, offset);
				} else {
					offset = t.endOffset;
					newNodeValue = txtValue.substring(0, offset);
					oldNodeValue = txtValue.substring(offset);
				}

				if (how != CLONE)
					n.nodeValue = oldNodeValue;

				if (how == DELETE)
					return null;

				newNode = n.cloneNode(false);
				newNode.nodeValue = newNodeValue;

				return newNode;
			}

			if (how == DELETE)
				return null;

			return n.cloneNode(false);
		},

		_traverseFullySelected : function(n, how) {
			var t = this;

			if (how != DELETE)
				return how == CLONE ? n.cloneNode(true) : n;

			n.parentNode.removeChild(n);
			return null;
		}
	});

	ns.Range = Range;
})(tinymce.dom);
(function() {
	function Selection(selection) {
		var t = this, invisibleChar = '\uFEFF', range, lastIERng;

		function compareRanges(rng1, rng2) {
			if (rng1 && rng2) {
				// Both are control ranges and the selected element matches
				if (rng1.item && rng2.item && rng1.item(0) === rng2.item(0))
					return 1;

				// Both are text ranges and the range matches
				if (rng1.isEqual && rng2.isEqual && rng2.isEqual(rng1))
					return 1;
			}

			return 0;
		};

		function getRange() {
			var dom = selection.dom, ieRange = selection.getRng(), domRange = dom.createRng(), startPos, endPos, element, sc, ec, collapsed;

			function findIndex(element) {
				var nl = element.parentNode.childNodes, i;

				for (i = nl.length - 1; i >= 0; i--) {
					if (nl[i] == element)
						return i;
				}

				return -1;
			};

			function findEndPoint(start) {
				var rng = ieRange.duplicate(), parent, i, nl, n, offset = 0, index = 0, pos, tmpRng;

				// Insert marker character
				rng.collapse(start);
				parent = rng.parentElement();
				rng.pasteHTML(invisibleChar); // Needs to be a pasteHTML instead of .text = since IE has a bug with nodeValue

				// Find marker character
				nl = parent.childNodes;
				for (i = 0; i < nl.length; i++) {
					n = nl[i];

					// Calculate node index excluding text node fragmentation
					if (i > 0 && (n.nodeType !== 3 || nl[i - 1].nodeType !== 3))
						index++;

					// If text node then calculate offset
					if (n.nodeType === 3) {
						// Look for marker
						pos = n.nodeValue.indexOf(invisibleChar);
						if (pos !== -1) {
							offset += pos;
							break;
						}

						offset += n.nodeValue.length;
					} else
						offset = 0;
				}

				// Remove marker character
				rng.moveStart('character', -1);
				rng.text = '';

				return {index : index, offset : offset, parent : parent};
			};

			// If selection is outside the current document just return an empty range
			element = ieRange.item ? ieRange.item(0) : ieRange.parentElement();
			if (element.ownerDocument != dom.doc)
				return domRange;

			// Handle control selection or text selection of a image
			if (ieRange.item || !element.hasChildNodes()) {
				domRange.setStart(element.parentNode, findIndex(element));
				domRange.setEnd(domRange.startContainer, domRange.startOffset + 1);

				return domRange;
			}

			// Check collapsed state
			collapsed = selection.isCollapsed();

			// Find start and end pos index and offset
			startPos = findEndPoint(true);
			endPos = findEndPoint(false);

			// Normalize the elements to avoid fragmented dom
			startPos.parent.normalize();
			endPos.parent.normalize();

			// Set start container and offset
			sc = startPos.parent.childNodes[Math.min(startPos.index, startPos.parent.childNodes.length - 1)];

			if (sc.nodeType != 3)
				domRange.setStart(startPos.parent, startPos.index);
			else
				domRange.setStart(startPos.parent.childNodes[startPos.index], startPos.offset);

			// Set end container and offset
			ec = endPos.parent.childNodes[Math.min(endPos.index, endPos.parent.childNodes.length - 1)];

			if (ec.nodeType != 3) {
				if (!collapsed)
					endPos.index++;

				domRange.setEnd(endPos.parent, endPos.index);
			} else
				domRange.setEnd(endPos.parent.childNodes[endPos.index], endPos.offset);

			// If not collapsed then make sure offsets are valid
			if (!collapsed) {
				sc = domRange.startContainer;
				if (sc.nodeType == 1)
					domRange.setStart(sc, Math.min(domRange.startOffset, sc.childNodes.length));

				ec = domRange.endContainer;
				if (ec.nodeType == 1)
					domRange.setEnd(ec, Math.min(domRange.endOffset, ec.childNodes.length));
			}

			// Restore selection to new range
			t.addRange(domRange);

			return domRange;
		};

		this.addRange = function(rng) {
			var ieRng, body = selection.dom.doc.body, startPos, endPos, sc, so, ec, eo;

			// Setup some shorter versions
			sc = rng.startContainer;
			so = rng.startOffset;
			ec = rng.endContainer;
			eo = rng.endOffset;
			ieRng = body.createTextRange();

			// Find element
			sc = sc.nodeType == 1 ? sc.childNodes[Math.min(so, sc.childNodes.length - 1)] : sc;
			ec = ec.nodeType == 1 ? ec.childNodes[Math.min(so == eo ? eo : eo - 1, ec.childNodes.length - 1)] : ec;

			// Single element selection
			if (sc == ec && sc.nodeType == 1) {
				// Make control selection for some elements
				if (/^(IMG|TABLE)$/.test(sc.nodeName) && so != eo) {
					ieRng = body.createControlRange();
					ieRng.addElement(sc);
				} else {
					ieRng = body.createTextRange();

					// Padd empty elements with invisible character
					if (!sc.hasChildNodes() && sc.canHaveHTML)
						sc.innerHTML = invisibleChar;

					// Select element contents
					ieRng.moveToElementText(sc);

					// If it's only containing a padding remove it so the caret remains
					if (sc.innerHTML == invisibleChar) {
						ieRng.collapse(true);
						sc.removeChild(sc.firstChild);
					}
				}

				if (so == eo)
					ieRng.collapse(eo <= rng.endContainer.childNodes.length - 1);

				ieRng.select();

				return;
			}

			function getCharPos(container, offset) {
				var nodeVal, rng, pos;

				if (container.nodeType != 3)
					return -1;

				nodeVal = container.nodeValue;
				rng = body.createTextRange();

				// Insert marker at offset position
				container.nodeValue = nodeVal.substring(0, offset) + invisibleChar + nodeVal.substring(offset);

				// Find char pos of marker and remove it
				rng.moveToElementText(container.parentNode);
				rng.findText(invisibleChar);
				pos = Math.abs(rng.moveStart('character', -0xFFFFF));
				container.nodeValue = nodeVal;

				return pos;
			};

			// Collapsed range
			if (rng.collapsed) {
				pos = getCharPos(sc, so);

				ieRng = body.createTextRange();
				ieRng.move('character', pos);
				ieRng.select();

				return;
			} else {
				// If same text container
				if (sc == ec && sc.nodeType == 3) {
					startPos = getCharPos(sc, so);

					ieRng.move('character', startPos);
					ieRng.moveEnd('character', eo - so);
					ieRng.select();

					return;
				}

				// Get caret positions
				startPos = getCharPos(sc, so);
				endPos = getCharPos(ec, eo);
				ieRng = body.createTextRange();

				// Move start of range to start character position or start element
				if (startPos == -1) {
					ieRng.moveToElementText(sc);
					startPos = 0;
				} else
					ieRng.move('character', startPos);

				// Move end of range to end character position or end element
				tmpRng = body.createTextRange();

				if (endPos == -1)
					tmpRng.moveToElementText(ec);
				else
					tmpRng.move('character', endPos);

				ieRng.setEndPoint('EndToEnd', tmpRng);
				ieRng.select();

				return;
			}
		};

		this.getRangeAt = function() {
			// Setup new range if the cache is empty
			if (!range || !compareRanges(lastIERng, selection.getRng())) {
				range = getRange();

				// Store away text range for next call
				lastIERng = selection.getRng();
			}

			// Return cached range
			return range;
		};

		this.destroy = function() {
			// Destroy cached range and last IE range to avoid memory leaks
			lastIERng = range = null;
		};
	};

	// Expose the selection object
	tinymce.dom.TridentSelection = Selection;
})();

/*
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false;

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, check, mode, extra, prune = true, contextXML = isXML(context);
	
	// Reset the position of the chunker regexp (start from head)
	chunker.lastIndex = 0;
	
	while ( (m = chunker.exec(selector)) !== null ) {
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = RegExp.rightContext;
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] )
					selector += parts.shift();

				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = false;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.match[ type ].exec( expr )) ) {
			var left = RegExp.leftContext;

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], found, item;
				anyFound = false;

				if ( curLoop == result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr == old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag && !isXML ) {
				part = part.toUpperCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = isXML ? part : part.toUpperCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context, isXML){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0) ) {
						if ( !inplace )
							result.push( elem );
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			for ( var i = 0; curLoop[i] === false; i++ ){}
			return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
		},
		CHILD: function(match){
			if ( match[1] == "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( match[3].match(chunker).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 == i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 == i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while (node = node.previousSibling)  {
						if ( node.nodeType === 1 ) return false;
					}
					if ( type == 'first') return true;
					node = elem;
				case 'last':
					while (node = node.nextSibling)  {
						if ( node.nodeType === 1 ) return false;
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first == 1 && last == 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first == 0 ) {
						return diff == 0;
					} else {
						return ( diff % first == 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value != check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
try {
	Array.prototype.slice.call( document.documentElement.childNodes );

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( !!document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}
})();

if ( document.querySelectorAll ) (function(){
	var oldSizzle = Sizzle, div = document.createElement("div");
	div.innerHTML = "<p class='TEST'></p>";

	// Safari can't handle uppercase or unicode characters when
	// in quirks mode.
	if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
		return;
	}
	
	Sizzle = function(query, context, extra, seed){
		context = context || document;

		// Only use querySelectorAll on non-XML documents
		// (ID selectors don't work in non-HTML documents)
		if ( !seed && context.nodeType === 9 && !isXML(context) ) {
			try {
				return makeArray( context.querySelectorAll(query), extra );
			} catch(e){}
		}
		
		return oldSizzle(query, context, extra, seed);
	};

	for ( var prop in oldSizzle ) {
		Sizzle[ prop ] = oldSizzle[ prop ];
	}
})();

if ( document.getElementsByClassName && document.documentElement.getElementsByClassName ) (function(){
	var div = document.createElement("div");
	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	if ( div.getElementsByClassName("e").length === 0 )
		return;

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 )
		return;

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ){
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ) {
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ?  function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
		!!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE

window.tinymce.dom.Sizzle = Sizzle;

})();

(function(tinymce) {
	// Shorten names
	var each = tinymce.each, DOM = tinymce.DOM, isIE = tinymce.isIE, isWebKit = tinymce.isWebKit, Event;

	tinymce.create('static tinymce.dom.Event', {
		inits : [],
		events : [],


		add : function(o, n, f, s) {
			var cb, t = this, el = t.events, r;

			// Handle array
			if (o && o.hasOwnProperty && o instanceof Array) {
				r = [];

				each(o, function(o) {
					o = DOM.get(o);
					r.push(t.add(o, n, f, s));
				});

				return r;
			}

			o = DOM.get(o);

			if (!o)
				return;

			// Setup event callback
			cb = function(e) {
				e = e || window.event;

				// Patch in target in IE it's W3C valid
				if (e && !e.target && isIE)
					e.target = e.srcElement;

				if (!s)
					return f(e);

				return f.call(s, e);
			};

			if (n == 'unload') {
				tinymce.unloads.unshift({func : cb});
				return cb;
			}

			if (n == 'init') {
				if (t.domLoaded)
					cb();
				else
					t.inits.push(cb);

				return cb;
			}

			// Store away listener reference
			el.push({
				obj : o,
				name : n,
				func : f,
				cfunc : cb,
				scope : s
			});

			t._add(o, n, cb);

			return f;
		},

		remove : function(o, n, f) {
			var t = this, a = t.events, s = false, r;

			// Handle array
			if (o && o.hasOwnProperty && o instanceof Array) {
				r = [];

				each(o, function(o) {
					o = DOM.get(o);
					r.push(t.remove(o, n, f));
				});

				return r;
			}

			o = DOM.get(o);

			each(a, function(e, i) {
				if (e.obj == o && e.name == n && (!f || (e.func == f || e.cfunc == f))) {
					a.splice(i, 1);
					t._remove(o, n, e.cfunc);
					s = true;
					return false;
				}
			});

			return s;
		},

		clear : function(o) {
			var t = this, a = t.events, i, e;

			if (o) {
				o = DOM.get(o);

				for (i = a.length - 1; i >= 0; i--) {
					e = a[i];

					if (e.obj === o) {
						t._remove(e.obj, e.name, e.cfunc);
						e.obj = e.cfunc = null;
						a.splice(i, 1);
					}
				}
			}
		},


		cancel : function(e) {
			if (!e)
				return false;

			this.stop(e);
			return this.prevent(e);
		},

		stop : function(e) {
			if (e.stopPropagation)
				e.stopPropagation();
			else
				e.cancelBubble = true;

			return false;
		},

		prevent : function(e) {
			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;

			return false;
		},

		_unload : function() {
			var t = Event;

			each(t.events, function(e, i) {
				t._remove(e.obj, e.name, e.cfunc);
				e.obj = e.cfunc = null;
			});

			t.events = [];
			t = null;
		},

		_add : function(o, n, f) {
			if (o.attachEvent)
				o.attachEvent('on' + n, f);
			else if (o.addEventListener)
				o.addEventListener(n, f, false);
			else
				o['on' + n] = f;
		},

		_remove : function(o, n, f) {
			if (o) {
				try {
					if (o.detachEvent)
						o.detachEvent('on' + n, f);
					else if (o.removeEventListener)
						o.removeEventListener(n, f, false);
					else
						o['on' + n] = null;
				} catch (ex) {
					// Might fail with permission denined on IE so we just ignore that
				}
			}
		},

		_pageInit : function() {
			var e = Event;

			// Keep it from running more than once
			if (e.domLoaded)
				return;

			e._remove(window, 'DOMContentLoaded', e._pageInit);
			e.domLoaded = true;

			each(e.inits, function(c) {
				c();
			});

			e.inits = [];
		},

		_wait : function() {
			// No need since the document is already loaded
			if (window.tinyMCE_GZ && tinyMCE_GZ.loaded) {
				Event.domLoaded = 1;
				return;
			}

			// Use IE method
			if (document.attachEvent) {
				document.attachEvent("onreadystatechange", function() {
					if (document.readyState === "complete") {
						document.detachEvent("onreadystatechange", arguments.callee);
						Event._pageInit();
					}
				});

				if (document.documentElement.doScroll && window == window.top) {
					(function() {
						if (Event.domLoaded)
							return;

						try {
							// If IE is used, use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							document.documentElement.doScroll("left");
						} catch (ex) {
							setTimeout(arguments.callee, 0);
							return;
						}

						Event._pageInit();
					})();
				}
			} else if (document.addEventListener)
				Event._add(window, 'DOMContentLoaded', Event._pageInit, Event);

			Event._add(window, 'load', Event._pageInit, Event);
		}

		});

	// Shorten name
	Event = tinymce.dom.Event;

	// Dispatch DOM content loaded event for IE and Safari
	Event._wait();
	tinymce.addUnload(Event._unload);
})(tinymce);
(function(tinymce) {
	var each = tinymce.each;

	tinymce.create('tinymce.dom.Element', {
		Element : function(id, s) {
			var t = this, dom, el;

			s = s || {};
			t.id = id;
			t.dom = dom = s.dom || tinymce.DOM;
			t.settings = s;

			// Only IE leaks DOM references, this is a lot faster
			if (!tinymce.isIE)
				el = t.dom.get(t.id);

			each([
				'getPos',
				'getRect',
				'getParent',
				'add',
				'setStyle',
				'getStyle',
				'setStyles',
				'setAttrib',
				'setAttribs',
				'getAttrib',
				'addClass',
				'removeClass',
				'hasClass',
				'getOuterHTML',
				'setOuterHTML',
				'remove',
				'show',
				'hide',
				'isHidden',
				'setHTML',
				'get'
			], function(k) {
				t[k] = function() {
					var a = [id], i;

					for (i = 0; i < arguments.length; i++)
						a.push(arguments[i]);

					a = dom[k].apply(dom, a);
					t.update(k);

					return a;
				};
			});
		},

		on : function(n, f, s) {
			return tinymce.dom.Event.add(this.id, n, f, s);
		},

		getXY : function() {
			return {
				x : parseInt(this.getStyle('left')),
				y : parseInt(this.getStyle('top'))
			};
		},

		getSize : function() {
			var n = this.dom.get(this.id);

			return {
				w : parseInt(this.getStyle('width') || n.clientWidth),
				h : parseInt(this.getStyle('height') || n.clientHeight)
			};
		},

		moveTo : function(x, y) {
			this.setStyles({left : x, top : y});
		},

		moveBy : function(x, y) {
			var p = this.getXY();

			this.moveTo(p.x + x, p.y + y);
		},

		resizeTo : function(w, h) {
			this.setStyles({width : w, height : h});
		},

		resizeBy : function(w, h) {
			var s = this.getSize();

			this.resizeTo(s.w + w, s.h + h);
		},

		update : function(k) {
			var t = this, b, dom = t.dom;

			if (tinymce.isIE6 && t.settings.blocker) {
				k = k || '';

				// Ignore getters
				if (k.indexOf('get') === 0 || k.indexOf('has') === 0 || k.indexOf('is') === 0)
					return;

				// Remove blocker on remove
				if (k == 'remove') {
					dom.remove(t.blocker);
					return;
				}

				if (!t.blocker) {
					t.blocker = dom.uniqueId();
					b = dom.add(t.settings.container || dom.getRoot(), 'iframe', {id : t.blocker, style : 'position:absolute;', frameBorder : 0, src : 'javascript:""'});
					dom.setStyle(b, 'opacity', 0);
				} else
					b = dom.get(t.blocker);

				dom.setStyle(b, 'left', t.getStyle('left', 1));
				dom.setStyle(b, 'top', t.getStyle('top', 1));
				dom.setStyle(b, 'width', t.getStyle('width', 1));
				dom.setStyle(b, 'height', t.getStyle('height', 1));
				dom.setStyle(b, 'display', t.getStyle('display', 1));
				dom.setStyle(b, 'zIndex', parseInt(t.getStyle('zIndex', 1) || 0) - 1);
			}
		}

		});
})(tinymce);
(function(tinymce) {
	function trimNl(s) {
		return s.replace(/[\n\r]+/g, '');
	};

	// Shorten names
	var is = tinymce.is, isIE = tinymce.isIE, each = tinymce.each;

	tinymce.create('tinymce.dom.Selection', {
		Selection : function(dom, win, serializer) {
			var t = this;

			t.dom = dom;
			t.win = win;
			t.serializer = serializer;

			// Add events
			each([
				'onBeforeSetContent',
				'onBeforeGetContent',
				'onSetContent',
				'onGetContent'
			], function(e) {
				t[e] = new tinymce.util.Dispatcher(t);
			});

			// No W3C Range support
			if (!t.win.getSelection)
				t.tridentSel = new tinymce.dom.TridentSelection(t);

			// Prevent leaks
			tinymce.addUnload(t.destroy, t);
		},

		getContent : function(s) {
			var t = this, r = t.getRng(), e = t.dom.create("body"), se = t.getSel(), wb, wa, n;

			s = s || {};
			wb = wa = '';
			s.get = true;
			s.format = s.format || 'html';
			t.onBeforeGetContent.dispatch(t, s);

			if (s.format == 'text')
				return t.isCollapsed() ? '' : (r.text || (se.toString ? se.toString() : ''));

			if (r.cloneContents) {
				n = r.cloneContents();

				if (n)
					e.appendChild(n);
			} else if (is(r.item) || is(r.htmlText))
				e.innerHTML = r.item ? r.item(0).outerHTML : r.htmlText;
			else
				e.innerHTML = r.toString();

			// Keep whitespace before and after
			if (/^\s/.test(e.innerHTML))
				wb = ' ';

			if (/\s+$/.test(e.innerHTML))
				wa = ' ';

			s.getInner = true;

			s.content = t.isCollapsed() ? '' : wb + t.serializer.serialize(e, s) + wa;
			t.onGetContent.dispatch(t, s);

			return s.content;
		},

		setContent : function(h, s) {
			var t = this, r = t.getRng(), c, d = t.win.document;

			s = s || {format : 'html'};
			s.set = true;
			h = s.content = t.dom.processHTML(h);

			// Dispatch before set content event
			t.onBeforeSetContent.dispatch(t, s);
			h = s.content;

			if (r.insertNode) {
				// Make caret marker since insertNode places the caret in the beginning of text after insert
				h += '<span id="__caret">_</span>';

				// Delete and insert new node
				r.deleteContents();
				r.insertNode(t.getRng().createContextualFragment(h));

				// Move to caret marker
				c = t.dom.get('__caret');

				// Make sure we wrap it compleatly, Opera fails with a simple select call
				r = d.createRange();
				r.setStartBefore(c);
				r.setEndAfter(c);
				t.setRng(r);

				// Delete the marker, and hopefully the caret gets placed in the right location
				// Removed this since it seems to remove &nbsp; in FF and simply deleting it
				// doesn't seem to affect the caret position in any browser
				//d.execCommand('Delete', false, null);

				// Remove the caret position
				t.dom.remove('__caret');
			} else {
				if (r.item) {
					// Delete content and get caret text selection
					d.execCommand('Delete', false, null);
					r = t.getRng();
				}

				r.pasteHTML(h);
			}

			// Dispatch set content event
			t.onSetContent.dispatch(t, s);
		},

		getStart : function() {
			var t = this, r = t.getRng(), e;

			if (isIE) {
				if (r.item)
					return r.item(0);

				r = r.duplicate();
				r.collapse(1);
				e = r.parentElement();

				if (e && e.nodeName == 'BODY')
					return e.firstChild;

				return e;
			} else {
				e = r.startContainer;

				if (e.nodeName == 'BODY')
					return e.firstChild;

				return t.dom.getParent(e, '*');
			}
		},

		getEnd : function() {
			var t = this, r = t.getRng(), e;

			if (isIE) {
				if (r.item)
					return r.item(0);

				r = r.duplicate();
				r.collapse(0);
				e = r.parentElement();

				if (e && e.nodeName == 'BODY')
					return e.lastChild;

				return e;
			} else {
				e = r.endContainer;

				if (e.nodeName == 'BODY')
					return e.lastChild;

				return t.dom.getParent(e, '*');
			}
		},

		getBookmark : function(si) {
			var t = this, r = t.getRng(), tr, sx, sy, vp = t.dom.getViewPort(t.win), e, sp, bp, le, c = -0xFFFFFF, s, ro = t.dom.getRoot(), wb = 0, wa = 0, nv;
			sx = vp.x;
			sy = vp.y;

			// Simple bookmark fast but not as persistent
			if (si == 'simple')
				return {rng : r, scrollX : sx, scrollY : sy};

			// Handle IE
			if (isIE) {
				// Control selection
				if (r.item) {
					e = r.item(0);

					each(t.dom.select(e.nodeName), function(n, i) {
						if (e == n) {
							sp = i;
							return false;
						}
					});

					return {
						tag : e.nodeName,
						index : sp,
						scrollX : sx,
						scrollY : sy
					};
				}

				// Text selection
				tr = t.dom.doc.body.createTextRange();
				tr.moveToElementText(ro);
				tr.collapse(true);
				bp = Math.abs(tr.move('character', c));

				tr = r.duplicate();
				tr.collapse(true);
				sp = Math.abs(tr.move('character', c));

				tr = r.duplicate();
				tr.collapse(false);
				le = Math.abs(tr.move('character', c)) - sp;

				return {
					start : sp - bp,
					length : le,
					scrollX : sx,
					scrollY : sy
				};
			}

			// Handle W3C
			e = t.getNode();
			s = t.getSel();

			if (!s)
				return null;

			// Image selection
			if (e && e.nodeName == 'IMG') {
				return {
					scrollX : sx,
					scrollY : sy
				};
			}

			// Text selection

			function getPos(r, sn, en) {
				var w = t.dom.doc.createTreeWalker(r, NodeFilter.SHOW_TEXT, null, false), n, p = 0, d = {};

				while ((n = w.nextNode()) != null) {
					if (n == sn)
						d.start = p;

					if (n == en) {
						d.end = p;
						return d;
					}

					p += trimNl(n.nodeValue || '').length;
				}

				return null;
			};

			// Caret or selection
			if (s.anchorNode == s.focusNode && s.anchorOffset == s.focusOffset) {
				e = getPos(ro, s.anchorNode, s.focusNode);

				if (!e)
					return {scrollX : sx, scrollY : sy};

				// Count whitespace before
				trimNl(s.anchorNode.nodeValue || '').replace(/^\s+/, function(a) {wb = a.length;});

				return {
					start : Math.max(e.start + s.anchorOffset - wb, 0),
					end : Math.max(e.end + s.focusOffset - wb, 0),
					scrollX : sx,
					scrollY : sy,
					beg : s.anchorOffset - wb == 0
				};
			} else {
				e = getPos(ro, r.startContainer, r.endContainer);

				// Count whitespace before start and end container
				//(r.startContainer.nodeValue || '').replace(/^\s+/, function(a) {wb = a.length;});
				//(r.endContainer.nodeValue || '').replace(/^\s+/, function(a) {wa = a.length;});

				if (!e)
					return {scrollX : sx, scrollY : sy};

				return {
					start : Math.max(e.start + r.startOffset - wb, 0),
					end : Math.max(e.end + r.endOffset - wa, 0),
					scrollX : sx,
					scrollY : sy,
					beg : r.startOffset - wb == 0
				};
			}
		},

		moveToBookmark : function(b) {
			var t = this, r = t.getRng(), s = t.getSel(), ro = t.dom.getRoot(), sd, nvl, nv;

			function getPos(r, sp, ep) {
				var w = t.dom.doc.createTreeWalker(r, NodeFilter.SHOW_TEXT, null, false), n, p = 0, d = {}, o, v, wa, wb;

				while ((n = w.nextNode()) != null) {
					wa = wb = 0;

					nv = n.nodeValue || '';
					//nv.replace(/^\s+[^\s]/, function(a) {wb = a.length - 1;});
					//nv.replace(/[^\s]\s+$/, function(a) {wa = a.length - 1;});

					nvl = trimNl(nv).length;
					p += nvl;

					if (p >= sp && !d.startNode) {
						o = sp - (p - nvl);

						// Fix for odd quirk in FF
						if (b.beg && o >= nvl)
							continue;

						d.startNode = n;
						d.startOffset = o + wb;
					}

					if (p >= ep) {
						d.endNode = n;
						d.endOffset = ep - (p - nvl) + wb;
						return d;
					}
				}

				return null;
			};

			if (!b)
				return false;

			t.win.scrollTo(b.scrollX, b.scrollY);

			// Handle explorer
			if (isIE) {
				// Handle simple
				if (r = b.rng) {
					try {
						r.select();
					} catch (ex) {
						// Ignore
					}

					return true;
				}

				t.win.focus();

				// Handle control bookmark
				if (b.tag) {
					r = ro.createControlRange();

					each(t.dom.select(b.tag), function(n, i) {
						if (i == b.index)
							r.addElement(n);
					});
				} else {
					// Try/catch needed since this operation breaks when TinyMCE is placed in hidden divs/tabs
					try {
						// Incorrect bookmark
						if (b.start < 0)
							return true;

						r = s.createRange();
						r.moveToElementText(ro);
						r.collapse(true);
						r.moveStart('character', b.start);
						r.moveEnd('character', b.length);
					} catch (ex2) {
						return true;
					}
				}

				try {
					r.select();
				} catch (ex) {
					// Needed for some odd IE bug #1843306
				}

				return true;
			}

			// Handle W3C
			if (!s)
				return false;

			// Handle simple
			if (b.rng) {
				s.removeAllRanges();
				s.addRange(b.rng);
			} else {
				if (is(b.start) && is(b.end)) {
					try {
						sd = getPos(ro, b.start, b.end);

						if (sd) {
							r = t.dom.doc.createRange();
							r.setStart(sd.startNode, sd.startOffset);
							r.setEnd(sd.endNode, sd.endOffset);
							s.removeAllRanges();
							s.addRange(r);
						}

						if (!tinymce.isOpera)
							t.win.focus();
					} catch (ex) {
						// Ignore
					}
				}
			}
		},

		select : function(n, c) {
			var t = this, r = t.getRng(), s = t.getSel(), b, fn, ln, d = t.win.document;

			function find(n, start) {
				var walker, o;

				if (n) {
					walker = d.createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false);

					// Find first/last non empty text node
					while (n = walker.nextNode()) {
						o = n;

						if (tinymce.trim(n.nodeValue).length != 0) {
							if (start)
								return n;
							else
								o = n;
						}
					}
				}

				return o;
			};

			if (isIE) {
				try {
					b = d.body;

					if (/^(IMG|TABLE)$/.test(n.nodeName)) {
						r = b.createControlRange();
						r.addElement(n);
					} else {
						r = b.createTextRange();
						r.moveToElementText(n);
					}

					r.select();
				} catch (ex) {
					// Throws illigal agrument in IE some times
				}
			} else {
				if (c) {
					fn = find(n, 1) || t.dom.select('br:first', n)[0];
					ln = find(n, 0) || t.dom.select('br:last', n)[0];

					if (fn && ln) {
						r = d.createRange();

						if (fn.nodeName == 'BR')
							r.setStartBefore(fn);
						else
							r.setStart(fn, 0);

						if (ln.nodeName == 'BR')
							r.setEndBefore(ln);
						else
							r.setEnd(ln, ln.nodeValue.length);
					} else
						r.selectNode(n);
				} else
					r.selectNode(n);

				t.setRng(r);
			}

			return n;
		},

		isCollapsed : function() {
			var t = this, r = t.getRng(), s = t.getSel();

			if (!r || r.item)
				return false;

			return !s || r.boundingWidth == 0 || r.collapsed;
		},

		collapse : function(b) {
			var t = this, r = t.getRng(), n;

			// Control range on IE
			if (r.item) {
				n = r.item(0);
				r = this.win.document.body.createTextRange();
				r.moveToElementText(n);
			}

			r.collapse(!!b);
			t.setRng(r);
		},

		getSel : function() {
			var t = this, w = this.win;

			return w.getSelection ? w.getSelection() : w.document.selection;
		},

		getRng : function(w3c) {
			var t = this, s, r;

			// Found tridentSel object then we need to use that one
			if (w3c && t.tridentSel)
				return t.tridentSel.getRangeAt(0);

			try {
				if (s = t.getSel())
					r = s.rangeCount > 0 ? s.getRangeAt(0) : (s.createRange ? s.createRange() : t.win.document.createRange());
			} catch (ex) {
				// IE throws unspecified error here if TinyMCE is placed in a frame/iframe
			}

			// No range found then create an empty one
			// This can occur when the editor is placed in a hidden container element on Gecko
			// Or on IE when there was an exception
			if (!r)
				r = isIE ? t.win.document.body.createTextRange() : t.win.document.createRange();

			return r;
		},

		setRng : function(r) {
			var s, t = this;

			if (!t.tridentSel) {
				s = t.getSel();

				if (s) {
					s.removeAllRanges();
					s.addRange(r);
				}
			} else {
				// Is W3C Range
				if (r.cloneRange) {
					t.tridentSel.addRange(r);
					return;
				}

				// Is IE specific range
				try {
					r.select();
				} catch (ex) {
					// Needed for some odd IE bug #1843306
				}
			}
		},

		setNode : function(n) {
			var t = this;

			t.setContent(t.dom.getOuterHTML(n));

			return n;
		},

		getNode : function() {
			var t = this, r = t.getRng(), s = t.getSel(), e;

			if (!isIE) {
				// Range maybe lost after the editor is made visible again
				if (!r)
					return t.dom.getRoot();

				e = r.commonAncestorContainer;

				// Handle selection a image or other control like element such as anchors
				if (!r.collapsed) {
					// If the anchor node is a element instead of a text node then return this element
					if (tinymce.isWebKit && s.anchorNode && s.anchorNode.nodeType == 1) 
						return s.anchorNode.childNodes[s.anchorOffset]; 

					if (r.startContainer == r.endContainer) {
						if (r.startOffset - r.endOffset < 2) {
							if (r.startContainer.hasChildNodes())
								e = r.startContainer.childNodes[r.startOffset];
						}
					}
				}

				return t.dom.getParent(e, '*');
			}

			return r.item ? r.item(0) : r.parentElement();
		},

		getSelectedBlocks : function(st, en) {
			var t = this, dom = t.dom, sb, eb, n, bl = [];

			sb = dom.getParent(st || t.getStart(), dom.isBlock);
			eb = dom.getParent(en || t.getEnd(), dom.isBlock);

			if (sb)
				bl.push(sb);

			if (sb && eb && sb != eb) {
				n = sb;

				while ((n = n.nextSibling) && n != eb) {
					if (dom.isBlock(n))
						bl.push(n);
				}
			}

			if (eb && sb != eb)
				bl.push(eb);

			return bl;
		},

		destroy : function(s) {
			var t = this;

			t.win = null;

			if (t.tridentSel)
				t.tridentSel.destroy();

			// Manual destroy then remove unload handler
			if (!s)
				tinymce.removeUnload(t.destroy);
		}

		});
})(tinymce);
(function(tinymce) {
	tinymce.create('tinymce.dom.XMLWriter', {
		node : null,

		XMLWriter : function(s) {
			// Get XML document
			function getXML() {
				var i = document.implementation;

				if (!i || !i.createDocument) {
					// Try IE objects
					try {return new ActiveXObject('MSXML2.DOMDocument');} catch (ex) {}
					try {return new ActiveXObject('Microsoft.XmlDom');} catch (ex) {}
				} else
					return i.createDocument('', '', null);
			};

			this.doc = getXML();
			
			// Since Opera and WebKit doesn't escape > into &gt; we need to do it our self to normalize the output for all browsers
			this.valid = tinymce.isOpera || tinymce.isWebKit;

			this.reset();
		},

		reset : function() {
			var t = this, d = t.doc;

			if (d.firstChild)
				d.removeChild(d.firstChild);

			t.node = d.appendChild(d.createElement("html"));
		},

		writeStartElement : function(n) {
			var t = this;

			t.node = t.node.appendChild(t.doc.createElement(n));
		},

		writeAttribute : function(n, v) {
			if (this.valid)
				v = v.replace(/>/g, '%MCGT%');

			this.node.setAttribute(n, v);
		},

		writeEndElement : function() {
			this.node = this.node.parentNode;
		},

		writeFullEndElement : function() {
			var t = this, n = t.node;

			n.appendChild(t.doc.createTextNode(""));
			t.node = n.parentNode;
		},

		writeText : function(v) {
			if (this.valid)
				v = v.replace(/>/g, '%MCGT%');

			this.node.appendChild(this.doc.createTextNode(v));
		},

		writeCDATA : function(v) {
			this.node.appendChild(this.doc.createCDATA(v));
		},

		writeComment : function(v) {
			// Fix for bug #2035694
			if (tinymce.isIE)
				v = v.replace(/^\-|\-$/g, ' ');

			this.node.appendChild(this.doc.createComment(v.replace(/\-\-/g, ' ')));
		},

		getContent : function() {
			var h;

			h = this.doc.xml || new XMLSerializer().serializeToString(this.doc);
			h = h.replace(/<\?[^?]+\?>|<html>|<\/html>|<html\/>|<!DOCTYPE[^>]+>/g, '');
			h = h.replace(/ ?\/>/g, ' />');

			if (this.valid)
				h = h.replace(/\%MCGT%/g, '&gt;');

			return h;
		}

		});
})(tinymce);
(function(tinymce) {
	tinymce.create('tinymce.dom.StringWriter', {
		str : null,
		tags : null,
		count : 0,
		settings : null,
		indent : null,

		StringWriter : function(s) {
			this.settings = tinymce.extend({
				indent_char : ' ',
				indentation : 1
			}, s);

			this.reset();
		},

		reset : function() {
			this.indent = '';
			this.str = "";
			this.tags = [];
			this.count = 0;
		},

		writeStartElement : function(n) {
			this._writeAttributesEnd();
			this.writeRaw('<' + n);
			this.tags.push(n);
			this.inAttr = true;
			this.count++;
			this.elementCount = this.count;
		},

		writeAttribute : function(n, v) {
			var t = this;

			t.writeRaw(" " + t.encode(n) + '="' + t.encode(v) + '"');
		},

		writeEndElement : function() {
			var n;

			if (this.tags.length > 0) {
				n = this.tags.pop();

				if (this._writeAttributesEnd(1))
					this.writeRaw('</' + n + '>');

				if (this.settings.indentation > 0)
					this.writeRaw('\n');
			}
		},

		writeFullEndElement : function() {
			if (this.tags.length > 0) {
				this._writeAttributesEnd();
				this.writeRaw('</' + this.tags.pop() + '>');

				if (this.settings.indentation > 0)
					this.writeRaw('\n');
			}
		},

		writeText : function(v) {
			this._writeAttributesEnd();
			this.writeRaw(this.encode(v));
			this.count++;
		},

		writeCDATA : function(v) {
			this._writeAttributesEnd();
			this.writeRaw('<![CDATA[' + v + ']]>');
			this.count++;
		},

		writeComment : function(v) {
			this._writeAttributesEnd();
			this.writeRaw('<!-- ' + v + '-->');
			this.count++;
		},

		writeRaw : function(v) {
			this.str += v;
		},

		encode : function(s) {
			return s.replace(/[<>&"]/g, function(v) {
				switch (v) {
					case '<':
						return '&lt;';

					case '>':
						return '&gt;';

					case '&':
						return '&amp;';

					case '"':
						return '&quot;';
				}

				return v;
			});
		},

		getContent : function() {
			return this.str;
		},

		_writeAttributesEnd : function(s) {
			if (!this.inAttr)
				return;

			this.inAttr = false;

			if (s && this.elementCount == this.count) {
				this.writeRaw(' />');
				return false;
			}

			this.writeRaw('>');

			return true;
		}

		});
})(tinymce);
(function(tinymce) {
	// Shorten names
	var extend = tinymce.extend, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher, isIE = tinymce.isIE, isGecko = tinymce.isGecko;

	function wildcardToRE(s) {
		return s.replace(/([?+*])/g, '.$1');
	};

	tinymce.create('tinymce.dom.Serializer', {
		Serializer : function(s) {
			var t = this;

			t.key = 0;
			t.onPreProcess = new Dispatcher(t);
			t.onPostProcess = new Dispatcher(t);

			try {
				t.writer = new tinymce.dom.XMLWriter();
			} catch (ex) {
				// IE might throw exception if ActiveX is disabled so we then switch to the slightly slower StringWriter
				t.writer = new tinymce.dom.StringWriter();
			}

			// Default settings
			t.settings = s = extend({
				dom : tinymce.DOM,
				valid_nodes : 0,
				node_filter : 0,
				attr_filter : 0,
				invalid_attrs : /^(mce_|_moz_)/,
				closed : /^(br|hr|input|meta|img|link|param|area)$/,
				entity_encoding : 'named',
				entities : '160,nbsp,161,iexcl,162,cent,163,pound,164,curren,165,yen,166,brvbar,167,sect,168,uml,169,copy,170,ordf,171,laquo,172,not,173,shy,174,reg,175,macr,176,deg,177,plusmn,178,sup2,179,sup3,180,acute,181,micro,182,para,183,middot,184,cedil,185,sup1,186,ordm,187,raquo,188,frac14,189,frac12,190,frac34,191,iquest,192,Agrave,193,Aacute,194,Acirc,195,Atilde,196,Auml,197,Aring,198,AElig,199,Ccedil,200,Egrave,201,Eacute,202,Ecirc,203,Euml,204,Igrave,205,Iacute,206,Icirc,207,Iuml,208,ETH,209,Ntilde,210,Ograve,211,Oacute,212,Ocirc,213,Otilde,214,Ouml,215,times,216,Oslash,217,Ugrave,218,Uacute,219,Ucirc,220,Uuml,221,Yacute,222,THORN,223,szlig,224,agrave,225,aacute,226,acirc,227,atilde,228,auml,229,aring,230,aelig,231,ccedil,232,egrave,233,eacute,234,ecirc,235,euml,236,igrave,237,iacute,238,icirc,239,iuml,240,eth,241,ntilde,242,ograve,243,oacute,244,ocirc,245,otilde,246,ouml,247,divide,248,oslash,249,ugrave,250,uacute,251,ucirc,252,uuml,253,yacute,254,thorn,255,yuml,402,fnof,913,Alpha,914,Beta,915,Gamma,916,Delta,917,Epsilon,918,Zeta,919,Eta,920,Theta,921,Iota,922,Kappa,923,Lambda,924,Mu,925,Nu,926,Xi,927,Omicron,928,Pi,929,Rho,931,Sigma,932,Tau,933,Upsilon,934,Phi,935,Chi,936,Psi,937,Omega,945,alpha,946,beta,947,gamma,948,delta,949,epsilon,950,zeta,951,eta,952,theta,953,iota,954,kappa,955,lambda,956,mu,957,nu,958,xi,959,omicron,960,pi,961,rho,962,sigmaf,963,sigma,964,tau,965,upsilon,966,phi,967,chi,968,psi,969,omega,977,thetasym,978,upsih,982,piv,8226,bull,8230,hellip,8242,prime,8243,Prime,8254,oline,8260,frasl,8472,weierp,8465,image,8476,real,8482,trade,8501,alefsym,8592,larr,8593,uarr,8594,rarr,8595,darr,8596,harr,8629,crarr,8656,lArr,8657,uArr,8658,rArr,8659,dArr,8660,hArr,8704,forall,8706,part,8707,exist,8709,empty,8711,nabla,8712,isin,8713,notin,8715,ni,8719,prod,8721,sum,8722,minus,8727,lowast,8730,radic,8733,prop,8734,infin,8736,ang,8743,and,8744,or,8745,cap,8746,cup,8747,int,8756,there4,8764,sim,8773,cong,8776,asymp,8800,ne,8801,equiv,8804,le,8805,ge,8834,sub,8835,sup,8836,nsub,8838,sube,8839,supe,8853,oplus,8855,otimes,8869,perp,8901,sdot,8968,lceil,8969,rceil,8970,lfloor,8971,rfloor,9001,lang,9002,rang,9674,loz,9824,spades,9827,clubs,9829,hearts,9830,diams,338,OElig,339,oelig,352,Scaron,353,scaron,376,Yuml,710,circ,732,tilde,8194,ensp,8195,emsp,8201,thinsp,8204,zwnj,8205,zwj,8206,lrm,8207,rlm,8211,ndash,8212,mdash,8216,lsquo,8217,rsquo,8218,sbquo,8220,ldquo,8221,rdquo,8222,bdquo,8224,dagger,8225,Dagger,8240,permil,8249,lsaquo,8250,rsaquo,8364,euro',
				bool_attrs : /(checked|disabled|readonly|selected|nowrap)/,
				valid_elements : '*[*]',
				extended_valid_elements : 0,
				valid_child_elements : 0,
				invalid_elements : 0,
				fix_table_elements : 1,
				fix_list_elements : true,
				fix_content_duplication : true,
				convert_fonts_to_spans : false,
				font_size_classes : 0,
				font_size_style_values : 0,
				apply_source_formatting : 0,
				indent_mode : 'simple',
				indent_char : '\t',
				indent_levels : 1,
				remove_linebreaks : 1,
				remove_redundant_brs : 1,
				element_format : 'xhtml'
			}, s);

			t.dom = s.dom;

			if (s.remove_redundant_brs) {
				t.onPostProcess.add(function(se, o) {
					// Remove single BR at end of block elements since they get rendered
					o.content = o.content.replace(/(<br \/>\s*)+<\/(p|h[1-6]|div|li)>/gi, function(a, b, c) {
						// Check if it's a single element
						if (/^<br \/>\s*<\//.test(a))
							return '</' + c + '>';

						return a;
					});
				});
			}

			// Remove XHTML element endings i.e. produce crap :) XHTML is better
			if (s.element_format == 'html') {
				t.onPostProcess.add(function(se, o) {
					o.content = o.content.replace(/<([^>]+) \/>/g, '<$1>');
				});
			}

			if (s.fix_list_elements) {
				t.onPreProcess.add(function(se, o) {
					var nl, x, a = ['ol', 'ul'], i, n, p, r = /^(OL|UL)$/, np;

					function prevNode(e, n) {
						var a = n.split(','), i;

						while ((e = e.previousSibling) != null) {
							for (i=0; i<a.length; i++) {
								if (e.nodeName == a[i])
									return e;
							}
						}

						return null;
					};

					for (x=0; x<a.length; x++) {
						nl = t.dom.select(a[x], o.node);

						for (i=0; i<nl.length; i++) {
							n = nl[i];
							p = n.parentNode;

							if (r.test(p.nodeName)) {
								np = prevNode(n, 'LI');

								if (!np) {
									np = t.dom.create('li');
									np.innerHTML = '&nbsp;';
									np.appendChild(n);
									p.insertBefore(np, p.firstChild);
								} else
									np.appendChild(n);
							}
						}
					}
				});
			}

			if (s.fix_table_elements) {
				t.onPreProcess.add(function(se, o) {
					each(t.dom.select('p table', o.node), function(n) {
						t.dom.split(t.dom.getParent(n, 'p'), n);
					});
				});
			}
		},

		setEntities : function(s) {
			var t = this, a, i, l = {}, re = '', v;

			// No need to setup more than once
			if (t.entityLookup)
				return;

			// Build regex and lookup array
			a = s.split(',');
			for (i = 0; i < a.length; i += 2) {
				v = a[i];

				// Don't add default &amp; &quot; etc.
				if (v == 34 || v == 38 || v == 60 || v == 62)
					continue;

				l[String.fromCharCode(a[i])] = a[i + 1];

				v = parseInt(a[i]).toString(16);
				re += '\\u' + '0000'.substring(v.length) + v;
			}

			if (!re) {
				t.settings.entity_encoding = 'raw';
				return;
			}

			t.entitiesRE = new RegExp('[' + re + ']', 'g');
			t.entityLookup = l;
		},

		setValidChildRules : function(s) {
			this.childRules = null;
			this.addValidChildRules(s);
		},

		addValidChildRules : function(s) {
			var t = this, inst, intr, bloc;

			if (!s)
				return;

			inst = 'A|BR|SPAN|BDO|MAP|OBJECT|IMG|TT|I|B|BIG|SMALL|EM|STRONG|DFN|CODE|Q|SAMP|KBD|VAR|CITE|ABBR|ACRONYM|SUB|SUP|#text|#comment';
			intr = 'A|BR|SPAN|BDO|OBJECT|APPLET|IMG|MAP|IFRAME|TT|I|B|U|S|STRIKE|BIG|SMALL|FONT|BASEFONT|EM|STRONG|DFN|CODE|Q|SAMP|KBD|VAR|CITE|ABBR|ACRONYM|SUB|SUP|INPUT|SELECT|TEXTAREA|LABEL|BUTTON|#text|#comment';
			bloc = 'H[1-6]|P|DIV|ADDRESS|PRE|FORM|TABLE|LI|OL|UL|TD|CAPTION|BLOCKQUOTE|CENTER|DL|DT|DD|DIR|FIELDSET|FORM|NOSCRIPT|NOFRAMES|MENU|ISINDEX|SAMP';

			each(s.split(','), function(s) {
				var p = s.split(/\[|\]/), re;

				s = '';
				each(p[1].split('|'), function(v) {
					if (s)
						s += '|';

					switch (v) {
						case '%itrans':
							v = intr;
							break;

						case '%itrans_na':
							v = intr.substring(2);
							break;

						case '%istrict':
							v = inst;
							break;

						case '%istrict_na':
							v = inst.substring(2);
							break;

						case '%btrans':
							v = bloc;
							break;

						case '%bstrict':
							v = bloc;
							break;
					}

					s += v;
				});
				re = new RegExp('^(' + s.toLowerCase() + ')$', 'i');

				each(p[0].split('/'), function(s) {
					t.childRules = t.childRules || {};
					t.childRules[s] = re;
				});
			});

			// Build regex
			s = '';
			each(t.childRules, function(v, k) {
				if (s)
					s += '|';

				s += k;
			});

			t.parentElementsRE = new RegExp('^(' + s.toLowerCase() + ')$', 'i');

			/*console.debug(t.parentElementsRE.toString());
			each(t.childRules, function(v) {
				console.debug(v.toString());
			});*/
		},

		setRules : function(s) {
			var t = this;

			t._setup();
			t.rules = {};
			t.wildRules = [];
			t.validElements = {};

			return t.addRules(s);
		},

		addRules : function(s) {
			var t = this, dr;

			if (!s)
				return;

			t._setup();

			each(s.split(','), function(s) {
				var p = s.split(/\[|\]/), tn = p[0].split('/'), ra, at, wat, va = [];

				// Extend with default rules
				if (dr)
					at = tinymce.extend([], dr.attribs);

				// Parse attributes
				if (p.length > 1) {
					each(p[1].split('|'), function(s) {
						var ar = {}, i;

						at = at || [];

						// Parse attribute rule
						s = s.replace(/::/g, '~');
						s = /^([!\-])?([\w*.?~_\-]+|)([=:<])?(.+)?$/.exec(s);
						s[2] = s[2].replace(/~/g, ':');

						// Add required attributes
						if (s[1] == '!') {
							ra = ra || [];
							ra.push(s[2]);
						}

						// Remove inherited attributes
						if (s[1] == '-') {
							for (i = 0; i <at.length; i++) {
								if (at[i].name == s[2]) {
									at.splice(i, 1);
									return;
								}
							}
						}

						switch (s[3]) {
							// Add default attrib values
							case '=':
								ar.defaultVal = s[4] || '';
								break;

							// Add forced attrib values
							case ':':
								ar.forcedVal = s[4];
								break;

							// Add validation values
							case '<':
								ar.validVals = s[4].split('?');
								break;
						}

						if (/[*.?]/.test(s[2])) {
							wat = wat || [];
							ar.nameRE = new RegExp('^' + wildcardToRE(s[2]) + '$');
							wat.push(ar);
						} else {
							ar.name = s[2];
							at.push(ar);
						}

						va.push(s[2]);
					});
				}

				// Handle element names
				each(tn, function(s, i) {
					var pr = s.charAt(0), x = 1, ru = {};

					// Extend with default rule data
					if (dr) {
						if (dr.noEmpty)
							ru.noEmpty = dr.noEmpty;

						if (dr.fullEnd)
							ru.fullEnd = dr.fullEnd;

						if (dr.padd)
							ru.padd = dr.padd;
					}

					// Handle prefixes
					switch (pr) {
						case '-':
							ru.noEmpty = true;
							break;

						case '+':
							ru.fullEnd = true;
							break;

						case '#':
							ru.padd = true;
							break;

						default:
							x = 0;
					}

					tn[i] = s = s.substring(x);
					t.validElements[s] = 1;

					// Add element name or element regex
					if (/[*.?]/.test(tn[0])) {
						ru.nameRE = new RegExp('^' + wildcardToRE(tn[0]) + '$');
						t.wildRules = t.wildRules || {};
						t.wildRules.push(ru);
					} else {
						ru.name = tn[0];

						// Store away default rule
						if (tn[0] == '@')
							dr = ru;

						t.rules[s] = ru;
					}

					ru.attribs = at;

					if (ra)
						ru.requiredAttribs = ra;

					if (wat) {
						// Build valid attributes regexp
						s = '';
						each(va, function(v) {
							if (s)
								s += '|';

							s += '(' + wildcardToRE(v) + ')';
						});
						ru.validAttribsRE = new RegExp('^' + s.toLowerCase() + '$');
						ru.wildAttribs = wat;
					}
				});
			});

			// Build valid elements regexp
			s = '';
			each(t.validElements, function(v, k) {
				if (s)
					s += '|';

				if (k != '@')
					s += k;
			});
			t.validElementsRE = new RegExp('^(' + wildcardToRE(s.toLowerCase()) + ')$');

			//console.debug(t.validElementsRE.toString());
			//console.dir(t.rules);
			//console.dir(t.wildRules);
		},

		findRule : function(n) {
			var t = this, rl = t.rules, i, r;

			t._setup();

			// Exact match
			r = rl[n];
			if (r)
				return r;

			// Try wildcards
			rl = t.wildRules;
			for (i = 0; i < rl.length; i++) {
				if (rl[i].nameRE.test(n))
					return rl[i];
			}

			return null;
		},

		findAttribRule : function(ru, n) {
			var i, wa = ru.wildAttribs;

			for (i = 0; i < wa.length; i++) {
				if (wa[i].nameRE.test(n))
					return wa[i];
			}

			return null;
		},

		serialize : function(n, o) {
			var h, t = this;

			t._setup();
			o = o || {};
			o.format = o.format || 'html';
			t.processObj = o;
			n = n.cloneNode(true);
			t.key = '' + (parseInt(t.key) + 1);

			// Pre process
			if (!o.no_events) {
				o.node = n;
				t.onPreProcess.dispatch(t, o);
			}

			// Serialize HTML DOM into a string
			t.writer.reset();
			t._serializeNode(n, o.getInner);

			// Post process
			o.content = t.writer.getContent();

			if (!o.no_events)
				t.onPostProcess.dispatch(t, o);

			t._postProcess(o);
			o.node = null;

			return tinymce.trim(o.content);
		},

		// Internal functions

		_postProcess : function(o) {
			var t = this, s = t.settings, h = o.content, sc = [], p;

			if (o.format == 'html') {
				// Protect some elements
				p = t._protect({
					content : h,
					patterns : [
						{pattern : /(<script[^>]*>)(.*?)(<\/script>)/g},
						{pattern : /(<style[^>]*>)(.*?)(<\/style>)/g},
						{pattern : /(<pre[^>]*>)(.*?)(<\/pre>)/g, encode : 1},
						{pattern : /(<!--\[CDATA\[)(.*?)(\]\]-->)/g}
					]
				});

				h = p.content;

				// Entity encode
				if (s.entity_encoding !== 'raw')
					h = t._encode(h);

				// Use BR instead of &nbsp; padded P elements inside editor and use <p>&nbsp;</p> outside editor
/*				if (o.set)
					h = h.replace(/<p>\s+(&nbsp;|&#160;|\u00a0|<br \/>)\s+<\/p>/g, '<p><br /></p>');
				else
					h = h.replace(/<p>\s+(&nbsp;|&#160;|\u00a0|<br \/>)\s+<\/p>/g, '<p>$1</p>');*/

				// Since Gecko and Safari keeps whitespace in the DOM we need to
				// remove it inorder to match other browsers. But I think Gecko and Safari is right.
				// This process is only done when getting contents out from the editor.
				if (!o.set) {
					// We need to replace paragraph whitespace with an nbsp before indentation to keep the \u00a0 char
					h = h.replace(/<p>\s+<\/p>|<p([^>]+)>\s+<\/p>/g, s.entity_encoding == 'numeric' ? '<p$1>&#160;</p>' : '<p$1>&nbsp;</p>');

					if (s.remove_linebreaks) {
						h = h.replace(/\r?\n|\r/g, ' ');
						h = h.replace(/(<[^>]+>)\s+/g, '$1 ');
						h = h.replace(/\s+(<\/[^>]+>)/g, ' $1');
						h = h.replace(/<(p|h[1-6]|blockquote|hr|div|table|tbody|tr|td|body|head|html|title|meta|style|pre|script|link|object) ([^>]+)>\s+/g, '<$1 $2>'); // Trim block start
						h = h.replace(/<(p|h[1-6]|blockquote|hr|div|table|tbody|tr|td|body|head|html|title|meta|style|pre|script|link|object)>\s+/g, '<$1>'); // Trim block start
						h = h.replace(/\s+<\/(p|h[1-6]|blockquote|hr|div|table|tbody|tr|td|body|head|html|title|meta|style|pre|script|link|object)>/g, '</$1>'); // Trim block end
					}

					// Simple indentation
					if (s.apply_source_formatting && s.indent_mode == 'simple') {
						// Add line breaks before and after block elements
						h = h.replace(/<(\/?)(ul|hr|table|meta|link|tbody|tr|object|body|head|html|map)(|[^>]+)>\s*/g, '\n<$1$2$3>\n');
						h = h.replace(/\s*<(p|h[1-6]|blockquote|div|title|style|pre|script|td|li|area)(|[^>]+)>/g, '\n<$1$2>');
						h = h.replace(/<\/(p|h[1-6]|blockquote|div|title|style|pre|script|td|li)>\s*/g, '</$1>\n');
						h = h.replace(/\n\n/g, '\n');
					}
				}

				h = t._unprotect(h, p);

				// Restore CDATA sections
				h = h.replace(/<!--\[CDATA\[([\s\S]+)\]\]-->/g, '<![CDATA[$1]]>');

				// Restore the \u00a0 character if raw mode is enabled
				if (s.entity_encoding == 'raw')
					h = h.replace(/<p>&nbsp;<\/p>|<p([^>]+)>&nbsp;<\/p>/g, '<p$1>\u00a0</p>');
			}

			o.content = h;
		},

		_serializeNode : function(n, inn) {
			var t = this, s = t.settings, w = t.writer, hc, el, cn, i, l, a, at, no, v, nn, ru, ar, iv;

			if (!s.node_filter || s.node_filter(n)) {
				switch (n.nodeType) {
					case 1: // Element
						if (n.hasAttribute ? n.hasAttribute('mce_bogus') : n.getAttribute('mce_bogus'))
							return;

						iv = false;
						hc = n.hasChildNodes();
						nn = n.getAttribute('mce_name') || n.nodeName.toLowerCase();

						// Add correct prefix on IE
						if (isIE) {
							if (n.scopeName !== 'HTML' && n.scopeName !== 'html')
								nn = n.scopeName + ':' + nn;
						}

						// Remove mce prefix on IE needed for the abbr element
						if (nn.indexOf('mce:') === 0)
							nn = nn.substring(4);

						// Check if valid
						if (!t.validElementsRE.test(nn) || (t.invalidElementsRE && t.invalidElementsRE.test(nn)) || inn) {
							iv = true;
							break;
						}

						if (isIE) {
							// Fix IE content duplication (DOM can have multiple copies of the same node)
							if (s.fix_content_duplication) {
								if (n.mce_serialized == t.key)
									return;

								n.mce_serialized = t.key;
							}

							// IE sometimes adds a / infront of the node name
							if (nn.charAt(0) == '/')
								nn = nn.substring(1);
						} else if (isGecko) {
							// Ignore br elements
							if (n.nodeName === 'BR' && n.getAttribute('type') == '_moz')
								return;
						}

						// Check if valid child
						if (t.childRules) {
							if (t.parentElementsRE.test(t.elementName)) {
								if (!t.childRules[t.elementName].test(nn)) {
									iv = true;
									break;
								}
							}

							t.elementName = nn;
						}

						ru = t.findRule(nn);
						nn = ru.name || nn;

						// Skip empty nodes or empty node name in IE
						if ((!hc && ru.noEmpty) || (isIE && !nn)) {
							iv = true;
							break;
						}

						// Check required
						if (ru.requiredAttribs) {
							a = ru.requiredAttribs;

							for (i = a.length - 1; i >= 0; i--) {
								if (this.dom.getAttrib(n, a[i]) !== '')
									break;
							}

							// None of the required was there
							if (i == -1) {
								iv = true;
								break;
							}
						}

						w.writeStartElement(nn);

						// Add ordered attributes
						if (ru.attribs) {
							for (i=0, at = ru.attribs, l = at.length; i<l; i++) {
								a = at[i];
								v = t._getAttrib(n, a);

								if (v !== null)
									w.writeAttribute(a.name, v);
							}
						}

						// Add wild attributes
						if (ru.validAttribsRE) {
							at = t.dom.getAttribs(n);
							for (i=at.length-1; i>-1; i--) {
								no = at[i];

								if (no.specified) {
									a = no.nodeName.toLowerCase();

									if (s.invalid_attrs.test(a) || !ru.validAttribsRE.test(a))
										continue;

									ar = t.findAttribRule(ru, a);
									v = t._getAttrib(n, ar, a);

									if (v !== null)
										w.writeAttribute(a, v);
								}
							}
						}

						// Padd empty nodes with a &nbsp;
						if (ru.padd) {
							// If it has only one bogus child, padd it anyway workaround for <td><br /></td> bug
							if (hc && (cn = n.firstChild) && cn.nodeType === 1 && n.childNodes.length === 1) {
								if (cn.hasAttribute ? cn.hasAttribute('mce_bogus') : cn.getAttribute('mce_bogus'))
									w.writeText('\u00a0');
							} else if (!hc)
								w.writeText('\u00a0'); // No children then padd it
						}

						break;

					case 3: // Text
						// Check if valid child
						if (t.childRules && t.parentElementsRE.test(t.elementName)) {
							if (!t.childRules[t.elementName].test(n.nodeName))
								return;
						}

						return w.writeText(n.nodeValue);

					case 4: // CDATA
						return w.writeCDATA(n.nodeValue);

					case 8: // Comment
						return w.writeComment(n.nodeValue);
				}
			} else if (n.nodeType == 1)
				hc = n.hasChildNodes();

			if (hc) {
				cn = n.firstChild;

				while (cn) {
					t._serializeNode(cn);
					t.elementName = nn;
					cn = cn.nextSibling;
				}
			}

			// Write element end
			if (!iv) {
				if (hc || !s.closed.test(nn))
					w.writeFullEndElement();
				else
					w.writeEndElement();
			}
		},

		_protect : function(o) {
			var t = this;

			o.items = o.items || [];

			function enc(s) {
				return s.replace(/[\r\n\\]/g, function(c) {
					if (c === '\n')
						return '\\n';
					else if (c === '\\')
						return '\\\\';

					return '\\r';
				});
			};

			function dec(s) {
				return s.replace(/\\[\\rn]/g, function(c) {
					if (c === '\\n')
						return '\n';
					else if (c === '\\\\')
						return '\\';

					return '\r';
				});
			};

			each(o.patterns, function(p) {
				o.content = dec(enc(o.content).replace(p.pattern, function(x, a, b, c) {
					b = dec(b);

					if (p.encode)
						b = t._encode(b);

					o.items.push(b);
					return a + '<!--mce:' + (o.items.length - 1) + '-->' + c;
				}));
			});

			return o;
		},

		_unprotect : function(h, o) {
			h = h.replace(/\<!--mce:([0-9]+)--\>/g, function(a, b) {
				return o.items[parseInt(b)];
			});

			o.items = [];

			return h;
		},

		_encode : function(h) {
			var t = this, s = t.settings, l;

			// Entity encode
			if (s.entity_encoding !== 'raw') {
				if (s.entity_encoding.indexOf('named') != -1) {
					t.setEntities(s.entities);
					l = t.entityLookup;

					h = h.replace(t.entitiesRE, function(a) {
						var v;

						if (v = l[a])
							a = '&' + v + ';';

						return a;
					});
				}

				if (s.entity_encoding.indexOf('numeric') != -1) {
					h = h.replace(/[\u007E-\uFFFF]/g, function(a) {
						return '&#' + a.charCodeAt(0) + ';';
					});
				}
			}

			return h;
		},

		_setup : function() {
			var t = this, s = this.settings;

			if (t.done)
				return;

			t.done = 1;

			t.setRules(s.valid_elements);
			t.addRules(s.extended_valid_elements);
			t.addValidChildRules(s.valid_child_elements);

			if (s.invalid_elements)
				t.invalidElementsRE = new RegExp('^(' + wildcardToRE(s.invalid_elements.replace(/,/g, '|').toLowerCase()) + ')$');

			if (s.attrib_value_filter)
				t.attribValueFilter = s.attribValueFilter;
		},

		_getAttrib : function(n, a, na) {
			var i, v;

			na = na || a.name;

			if (a.forcedVal && (v = a.forcedVal)) {
				if (v === '{$uid}')
					return this.dom.uniqueId();

				return v;
			}

			v = this.dom.getAttrib(n, na);

			// Bool attr
			if (this.settings.bool_attrs.test(na) && v) {
				v = ('' + v).toLowerCase();

				if (v === 'false' || v === '0')
					return null;

				v = na;
			}

			switch (na) {
				case 'rowspan':
				case 'colspan':
					// Whats the point? Remove usless attribute value
					if (v == '1')
						v = '';

					break;
			}

			if (this.attribValueFilter)
				v = this.attribValueFilter(na, v, n);

			if (a.validVals) {
				for (i = a.validVals.length - 1; i >= 0; i--) {
					if (v == a.validVals[i])
						break;
				}

				if (i == -1)
					return null;
			}

			if (v === '' && typeof(a.defaultVal) != 'undefined') {
				v = a.defaultVal;

				if (v === '{$uid}')
					return this.dom.uniqueId();

				return v;
			} else {
				// Remove internal mceItemXX classes when content is extracted from editor
				if (na == 'class' && this.processObj.get)
					v = v.replace(/\s?mceItem\w+\s?/g, '');
			}

			if (v === '')
				return null;


			return v;
		}

		});
})(tinymce);
(function(tinymce) {
	var each = tinymce.each, Event = tinymce.dom.Event;

	tinymce.create('tinymce.dom.ScriptLoader', {
		ScriptLoader : function(s) {
			this.settings = s || {};
			this.queue = [];
			this.lookup = {};
		},

		isDone : function(u) {
			return this.lookup[u] ? this.lookup[u].state == 2 : 0;
		},

		markDone : function(u) {
			this.lookup[u] = {state : 2, url : u};
		},

		add : function(u, cb, s, pr) {
			var t = this, lo = t.lookup, o;

			if (o = lo[u]) {
				// Is loaded fire callback
				if (cb && o.state == 2)
					cb.call(s || this);

				return o;
			}

			o = {state : 0, url : u, func : cb, scope : s || this};

			if (pr)
				t.queue.unshift(o);
			else
				t.queue.push(o);

			lo[u] = o;

			return o;
		},

		load : function(u, cb, s) {
			var t = this, o;

			if (o = t.lookup[u]) {
				// Is loaded fire callback
				if (cb && o.state == 2)
					cb.call(s || t);

				return o;
			}

			function loadScript(u) {
				if (Event.domLoaded || t.settings.strict_mode) {
					tinymce.util.XHR.send({
						url : tinymce._addVer(u),
						error : t.settings.error,
						async : false,
						success : function(co) {
							t.eval(co);
						}
					});
				} else
					document.write('<script type="text/javascript" src="' + tinymce._addVer(u) + '"></script>');
			};

			if (!tinymce.is(u, 'string')) {
				each(u, function(u) {
					loadScript(u);
				});

				if (cb)
					cb.call(s || t);
			} else {
				loadScript(u);

				if (cb)
					cb.call(s || t);
			}
		},

		loadQueue : function(cb, s) {
			var t = this;

			if (!t.queueLoading) {
				t.queueLoading = 1;
				t.queueCallbacks = [];

				t.loadScripts(t.queue, function() {
					t.queueLoading = 0;

					if (cb)
						cb.call(s || t);

					each(t.queueCallbacks, function(o) {
						o.func.call(o.scope);
					});
				});
			} else if (cb)
				t.queueCallbacks.push({func : cb, scope : s || t});
		},

		eval : function(co) {
			var w = window;

			// Evaluate script
			if (!w.execScript) {
				try {
					eval.call(w, co);
				} catch (ex) {
					eval(co, w); // Firefox 3.0a8
				}
			} else
				w.execScript(co); // IE
		},

		loadScripts : function(sc, cb, s) {
			var t = this, lo = t.lookup;

			function done(o) {
				o.state = 2; // Has been loaded

				// Run callback
				if (o.func)
					o.func.call(o.scope || t);
			};

			function allDone() {
				var l;

				// Check if all files are loaded
				l = sc.length;
				each(sc, function(o) {
					o = lo[o.url];

					if (o.state === 2) {// It has finished loading
						done(o);
						l--;
					} else
						load(o);
				});

				// They are all loaded
				if (l === 0 && cb) {
					cb.call(s || t);
					cb = 0;
				}
			};

			function load(o) {
				if (o.state > 0)
					return;

				o.state = 1; // Is loading

				tinymce.dom.ScriptLoader.loadScript(o.url, function() {
					done(o);
					allDone();
				});

				/*
				tinymce.util.XHR.send({
					url : o.url,
					error : t.settings.error,
					success : function(co) {
						t.eval(co);
						done(o);
						allDone();
					}
				});
				*/
			};

			each(sc, function(o) {
				var u = o.url;

				// Add to queue if needed
				if (!lo[u]) {
					lo[u] = o;
					t.queue.push(o);
				} else
					o = lo[u];

				// Is already loading or has been loaded
				if (o.state > 0)
					return;

				if (!Event.domLoaded && !t.settings.strict_mode) {
					var ix, ol = '';

					// Add onload events
					if (cb || o.func) {
						o.state = 1; // Is loading

						ix = tinymce.dom.ScriptLoader._addOnLoad(function() {
							done(o);
							allDone();
						});

						if (tinymce.isIE)
							ol = ' onreadystatechange="';
						else
							ol = ' onload="';

						ol += 'tinymce.dom.ScriptLoader._onLoad(this,\'' + u + '\',' + ix + ');"';
					}

					document.write('<script type="text/javascript" src="' + tinymce._addVer(u) + '"' + ol + '></script>');

					if (!o.func)
						done(o);
				} else
					load(o);
			});

			allDone();
		},

		// Static methods
		'static' : {
			_addOnLoad : function(f) {
				var t = this;

				t._funcs = t._funcs || [];
				t._funcs.push(f);

				return t._funcs.length - 1;
			},

			_onLoad : function(e, u, ix) {
				if (!tinymce.isIE || e.readyState == 'complete')
					this._funcs[ix].call(this);
			},

			loadScript : function(u, cb) {
				var id = tinymce.DOM.uniqueId(), e;

				function done() {
					Event.clear(id);
					tinymce.DOM.remove(id);

					if (cb) {
						cb.call(document, u);
						cb = 0;
					}
				};

				if (tinymce.isIE) {
/*					Event.add(e, 'readystatechange', function(e) {
						if (e.target && e.target.readyState == 'complete')
							done();
					});*/

					tinymce.util.XHR.send({
						url : tinymce._addVer(u),
						async : false,
						success : function(co) {
							window.execScript(co);
							done();
						}
					});
				} else {
					e = tinymce.DOM.create('script', {id : id, type : 'text/javascript', src : tinymce._addVer(u)});
					Event.add(e, 'load', done);

					// Check for head or body
					(document.getElementsByTagName('head')[0] || document.body).appendChild(e);
				}
			}
		}

		});

	// Global script loader
	tinymce.ScriptLoader = new tinymce.dom.ScriptLoader();
})(tinymce);
(function(tinymce) {
	// Shorten class names
	var DOM = tinymce.DOM, is = tinymce.is;

	tinymce.create('tinymce.ui.Control', {
		Control : function(id, s) {
			this.id = id;
			this.settings = s = s || {};
			this.rendered = false;
			this.onRender = new tinymce.util.Dispatcher(this);
			this.classPrefix = '';
			this.scope = s.scope || this;
			this.disabled = 0;
			this.active = 0;
		},

		setDisabled : function(s) {
			var e;

			if (s != this.disabled) {
				e = DOM.get(this.id);

				// Add accessibility title for unavailable actions
				if (e && this.settings.unavailable_prefix) {
					if (s) {
						this.prevTitle = e.title;
						e.title = this.settings.unavailable_prefix + ": " + e.title;
					} else
						e.title = this.prevTitle;
				}

				this.setState('Disabled', s);
				this.setState('Enabled', !s);
				this.disabled = s;
			}
		},

		isDisabled : function() {
			return this.disabled;
		},

		setActive : function(s) {
			if (s != this.active) {
				this.setState('Active', s);
				this.active = s;
			}
		},

		isActive : function() {
			return this.active;
		},

		setState : function(c, s) {
			var n = DOM.get(this.id);

			c = this.classPrefix + c;

			if (s)
				DOM.addClass(n, c);
			else
				DOM.removeClass(n, c);
		},

		isRendered : function() {
			return this.rendered;
		},

		renderHTML : function() {
		},

		renderTo : function(n) {
			DOM.setHTML(n, this.renderHTML());
		},

		postRender : function() {
			var t = this, b;

			// Set pending states
			if (is(t.disabled)) {
				b = t.disabled;
				t.disabled = -1;
				t.setDisabled(b);
			}

			if (is(t.active)) {
				b = t.active;
				t.active = -1;
				t.setActive(b);
			}
		},

		remove : function() {
			DOM.remove(this.id);
			this.destroy();
		},

		destroy : function() {
			tinymce.dom.Event.clear(this.id);
		}

		});
})(tinymce);tinymce.create('tinymce.ui.Container:tinymce.ui.Control', {
	Container : function(id, s) {
		this.parent(id, s);
		this.controls = [];
		this.lookup = {};
	},

	add : function(c) {
		this.lookup[c.id] = c;
		this.controls.push(c);

		return c;
	},

	get : function(n) {
		return this.lookup[n];
	}

	});

tinymce.create('tinymce.ui.Separator:tinymce.ui.Control', {
	Separator : function(id, s) {
		this.parent(id, s);
		this.classPrefix = 'mceSeparator';
	},

	renderHTML : function() {
		return tinymce.DOM.createHTML('span', {'class' : this.classPrefix});
	}

	});
(function(tinymce) {
	var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, walk = tinymce.walk;

	tinymce.create('tinymce.ui.MenuItem:tinymce.ui.Control', {
		MenuItem : function(id, s) {
			this.parent(id, s);
			this.classPrefix = 'mceMenuItem';
		},

		setSelected : function(s) {
			this.setState('Selected', s);
			this.selected = s;
		},

		isSelected : function() {
			return this.selected;
		},

		postRender : function() {
			var t = this;
			
			t.parent();

			// Set pending state
			if (is(t.selected))
				t.setSelected(t.selected);
		}

		});
})(tinymce);
(function(tinymce) {
	var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, walk = tinymce.walk;

	tinymce.create('tinymce.ui.Menu:tinymce.ui.MenuItem', {
		Menu : function(id, s) {
			var t = this;

			t.parent(id, s);
			t.items = {};
			t.collapsed = false;
			t.menuCount = 0;
			t.onAddItem = new tinymce.util.Dispatcher(this);
		},

		expand : function(d) {
			var t = this;

			if (d) {
				walk(t, function(o) {
					if (o.expand)
						o.expand();
				}, 'items', t);
			}

			t.collapsed = false;
		},

		collapse : function(d) {
			var t = this;

			if (d) {
				walk(t, function(o) {
					if (o.collapse)
						o.collapse();
				}, 'items', t);
			}

			t.collapsed = true;
		},

		isCollapsed : function() {
			return this.collapsed;
		},

		add : function(o) {
			if (!o.settings)
				o = new tinymce.ui.MenuItem(o.id || DOM.uniqueId(), o);

			this.onAddItem.dispatch(this, o);

			return this.items[o.id] = o;
		},

		addSeparator : function() {
			return this.add({separator : true});
		},

		addMenu : function(o) {
			if (!o.collapse)
				o = this.createMenu(o);

			this.menuCount++;

			return this.add(o);
		},

		hasMenus : function() {
			return this.menuCount !== 0;
		},

		remove : function(o) {
			delete this.items[o.id];
		},

		removeAll : function() {
			var t = this;

			walk(t, function(o) {
				if (o.removeAll)
					o.removeAll();
				else
					o.remove();

				o.destroy();
			}, 'items', t);

			t.items = {};
		},

		createMenu : function(o) {
			var m = new tinymce.ui.Menu(o.id || DOM.uniqueId(), o);

			m.onAddItem.add(this.onAddItem.dispatch, this.onAddItem);

			return m;
		}

		});
})(tinymce);(function(tinymce) {
	var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event, Element = tinymce.dom.Element;

	tinymce.create('tinymce.ui.DropMenu:tinymce.ui.Menu', {
		DropMenu : function(id, s) {
			s = s || {};
			s.container = s.container || DOM.doc.body;
			s.offset_x = s.offset_x || 0;
			s.offset_y = s.offset_y || 0;
			s.vp_offset_x = s.vp_offset_x || 0;
			s.vp_offset_y = s.vp_offset_y || 0;

			if (is(s.icons) && !s.icons)
				s['class'] += ' mceNoIcons';

			this.parent(id, s);
			this.onShowMenu = new tinymce.util.Dispatcher(this);
			this.onHideMenu = new tinymce.util.Dispatcher(this);
			this.classPrefix = 'mceMenu';
		},

		createMenu : function(s) {
			var t = this, cs = t.settings, m;

			s.container = s.container || cs.container;
			s.parent = t;
			s.constrain = s.constrain || cs.constrain;
			s['class'] = s['class'] || cs['class'];
			s.vp_offset_x = s.vp_offset_x || cs.vp_offset_x;
			s.vp_offset_y = s.vp_offset_y || cs.vp_offset_y;
			m = new tinymce.ui.DropMenu(s.id || DOM.uniqueId(), s);

			m.onAddItem.add(t.onAddItem.dispatch, t.onAddItem);

			return m;
		},

		update : function() {
			var t = this, s = t.settings, tb = DOM.get('menu_' + t.id + '_tbl'), co = DOM.get('menu_' + t.id + '_co'), tw, th;

			tw = s.max_width ? Math.min(tb.clientWidth, s.max_width) : tb.clientWidth;
			th = s.max_height ? Math.min(tb.clientHeight, s.max_height) : tb.clientHeight;

			if (!DOM.boxModel)
				t.element.setStyles({width : tw + 2, height : th + 2});
			else
				t.element.setStyles({width : tw, height : th});

			if (s.max_width)
				DOM.setStyle(co, 'width', tw);

			if (s.max_height) {
				DOM.setStyle(co, 'height', th);

				if (tb.clientHeight < s.max_height)
					DOM.setStyle(co, 'overflow', 'hidden');
			}
		},

		showMenu : function(x, y, px) {
			var t = this, s = t.settings, co, vp = DOM.getViewPort(), w, h, mx, my, ot = 2, dm, tb, cp = t.classPrefix;

			t.collapse(1);

			if (t.isMenuVisible)
				return;

			if (!t.rendered) {
				co = DOM.add(t.settings.container, t.renderNode());

				each(t.items, function(o) {
					o.postRender();
				});

				t.element = new Element('menu_' + t.id, {blocker : 1, container : s.container});
			} else
				co = DOM.get('menu_' + t.id);

			// Move layer out of sight unless it's Opera since it scrolls to top of page due to an bug
			if (!tinymce.isOpera)
				DOM.setStyles(co, {left : -0xFFFF , top : -0xFFFF});

			DOM.show(co);
			t.update();

			x += s.offset_x || 0;
			y += s.offset_y || 0;
			vp.w -= 4;
			vp.h -= 4;

			// Move inside viewport if not submenu
			if (s.constrain) {
				w = co.clientWidth - ot;
				h = co.clientHeight - ot;
				mx = vp.x + vp.w;
				my = vp.y + vp.h;

				if ((x + s.vp_offset_x + w) > mx)
					x = px ? px - w : Math.max(0, (mx - s.vp_offset_x) - w);

				if ((y + s.vp_offset_y + h) > my)
					y = Math.max(0, (my - s.vp_offset_y) - h);
			}

			DOM.setStyles(co, {left : x , top : y});
			t.element.update();

			t.isMenuVisible = 1;
			t.mouseClickFunc = Event.add(co, 'click', function(e) {
				var m;

				e = e.target;

				if (e && (e = DOM.getParent(e, 'tr')) && !DOM.hasClass(e, cp + 'ItemSub')) {
					m = t.items[e.id];

					if (m.isDisabled())
						return;

					dm = t;

					while (dm) {
						if (dm.hideMenu)
							dm.hideMenu();

						dm = dm.settings.parent;
					}

					if (m.settings.onclick)
						m.settings.onclick(e);

					return Event.cancel(e); // Cancel to fix onbeforeunload problem
				}
			});

			if (t.hasMenus()) {
				t.mouseOverFunc = Event.add(co, 'mouseover', function(e) {
					var m, r, mi;

					e = e.target;
					if (e && (e = DOM.getParent(e, 'tr'))) {
						m = t.items[e.id];

						if (t.lastMenu)
							t.lastMenu.collapse(1);

						if (m.isDisabled())
							return;

						if (e && DOM.hasClass(e, cp + 'ItemSub')) {
							//p = DOM.getPos(s.container);
							r = DOM.getRect(e);
							m.showMenu((r.x + r.w - ot), r.y - ot, r.x);
							t.lastMenu = m;
							DOM.addClass(DOM.get(m.id).firstChild, cp + 'ItemActive');
						}
					}
				});
			}

			t.onShowMenu.dispatch(t);

			if (s.keyboard_focus) {
				Event.add(co, 'keydown', t._keyHandler, t);
				DOM.select('a', 'menu_' + t.id)[0].focus(); // Select first link
				t._focusIdx = 0;
			}
		},

		hideMenu : function(c) {
			var t = this, co = DOM.get('menu_' + t.id), e;

			if (!t.isMenuVisible)
				return;

			Event.remove(co, 'mouseover', t.mouseOverFunc);
			Event.remove(co, 'click', t.mouseClickFunc);
			Event.remove(co, 'keydown', t._keyHandler);
			DOM.hide(co);
			t.isMenuVisible = 0;

			if (!c)
				t.collapse(1);

			if (t.element)
				t.element.hide();

			if (e = DOM.get(t.id))
				DOM.removeClass(e.firstChild, t.classPrefix + 'ItemActive');

			t.onHideMenu.dispatch(t);
		},

		add : function(o) {
			var t = this, co;

			o = t.parent(o);

			if (t.isRendered && (co = DOM.get('menu_' + t.id)))
				t._add(DOM.select('tbody', co)[0], o);

			return o;
		},

		collapse : function(d) {
			this.parent(d);
			this.hideMenu(1);
		},

		remove : function(o) {
			DOM.remove(o.id);
			this.destroy();

			return this.parent(o);
		},

		destroy : function() {
			var t = this, co = DOM.get('menu_' + t.id);

			Event.remove(co, 'mouseover', t.mouseOverFunc);
			Event.remove(co, 'click', t.mouseClickFunc);

			if (t.element)
				t.element.remove();

			DOM.remove(co);
		},

		renderNode : function() {
			var t = this, s = t.settings, n, tb, co, w;

			w = DOM.create('div', {id : 'menu_' + t.id, 'class' : s['class'], 'style' : 'position:absolute;left:0;top:0;z-index:200000'});
			co = DOM.add(w, 'div', {id : 'menu_' + t.id + '_co', 'class' : t.classPrefix + (s['class'] ? ' ' + s['class'] : '')});
			t.element = new Element('menu_' + t.id, {blocker : 1, container : s.container});

			if (s.menu_line)
				DOM.add(co, 'span', {'class' : t.classPrefix + 'Line'});

//			n = DOM.add(co, 'div', {id : 'menu_' + t.id + '_co', 'class' : 'mceMenuContainer'});
			n = DOM.add(co, 'table', {id : 'menu_' + t.id + '_tbl', border : 0, cellPadding : 0, cellSpacing : 0});
			tb = DOM.add(n, 'tbody');

			each(t.items, function(o) {
				t._add(tb, o);
			});

			t.rendered = true;

			return w;
		},

		// Internal functions

		_keyHandler : function(e) {
			var t = this, kc = e.keyCode;

			function focus(d) {
				var i = t._focusIdx + d, e = DOM.select('a', 'menu_' + t.id)[i];

				if (e) {
					t._focusIdx = i;
					e.focus();
				}
			};

			switch (kc) {
				case 38:
					focus(-1); // Select first link
					return;

				case 40:
					focus(1);
					return;

				case 13:
					return;

				case 27:
					return this.hideMenu();
			}
		},

		_add : function(tb, o) {
			var n, s = o.settings, a, ro, it, cp = this.classPrefix, ic;

			if (s.separator) {
				ro = DOM.add(tb, 'tr', {id : o.id, 'class' : cp + 'ItemSeparator'});
				DOM.add(ro, 'td', {'class' : cp + 'ItemSeparator'});

				if (n = ro.previousSibling)
					DOM.addClass(n, 'mceLast');

				return;
			}

			n = ro = DOM.add(tb, 'tr', {id : o.id, 'class' : cp + 'Item ' + cp + 'ItemEnabled'});
			n = it = DOM.add(n, 'td');
			n = a = DOM.add(n, 'a', {href : 'javascript:;', onclick : "return false;", onmousedown : 'return false;'});

			DOM.addClass(it, s['class']);
//			n = DOM.add(n, 'span', {'class' : 'item'});

			ic = DOM.add(n, 'span', {'class' : 'mceIcon' + (s.icon ? ' mce_' + s.icon : '')});

			if (s.icon_src)
				DOM.add(ic, 'img', {src : s.icon_src});

			n = DOM.add(n, s.element || 'span', {'class' : 'mceText', title : o.settings.title}, o.settings.title);

			if (o.settings.style)
				DOM.setAttrib(n, 'style', o.settings.style);

			if (tb.childNodes.length == 1)
				DOM.addClass(ro, 'mceFirst');

			if ((n = ro.previousSibling) && DOM.hasClass(n, cp + 'ItemSeparator'))
				DOM.addClass(ro, 'mceFirst');

			if (o.collapse)
				DOM.addClass(ro, cp + 'ItemSub');

			if (n = ro.previousSibling)
				DOM.removeClass(n, 'mceLast');

			DOM.addClass(ro, 'mceLast');
		}

		});
})(tinymce);(function(tinymce) {
	var DOM = tinymce.DOM;

	tinymce.create('tinymce.ui.Button:tinymce.ui.Control', {
		Button : function(id, s) {
			this.parent(id, s);
			this.classPrefix = 'mceButton';
		},

		renderHTML : function() {
			var cp = this.classPrefix, s = this.settings, h, l;

			l = DOM.encode(s.label || '');
			h = '<a id="' + this.id + '" href="javascript:;" class="' + cp + ' ' + cp + 'Enabled ' + s['class'] + (l ? ' ' + cp + 'Labeled' : '') +'" onmousedown="return false;" onclick="return false;" title="' + DOM.encode(s.title) + '">';

			if (s.image)
				h += '<img class="mceIcon" src="' + s.image + '" />' + l + '</a>';
			else
				h += '<span class="mceIcon ' + s['class'] + '"></span>' + (l ? '<span class="' + cp + 'Label">' + l + '</span>' : '') + '</a>';

			return h;
		},

		postRender : function() {
			var t = this, s = t.settings;

			tinymce.dom.Event.add(t.id, 'click', function(e) {
				if (!t.isDisabled())
					return s.onclick.call(s.scope, e);
			});
		}

		});
})(tinymce);
(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher;

	tinymce.create('tinymce.ui.ListBox:tinymce.ui.Control', {
		ListBox : function(id, s) {
			var t = this;

			t.parent(id, s);
			t.items = [];
			t.onChange = new Dispatcher(t);
			t.onPostRender = new Dispatcher(t);
			t.onAdd = new Dispatcher(t);
			t.onRenderMenu = new tinymce.util.Dispatcher(this);
			t.classPrefix = 'mceListBox';
		},

		select : function(va) {
			var t = this, fv, f;

			if (va == undefined)
				return t.selectByIndex(-1);

			// Is string or number make function selector
			if (va && va.call)
				f = va;
			else {
				f = function(v) {
					return v == va;
				};
			}

			// Do we need to do something?
			if (va != t.selectedValue) {
				// Find item
				each(t.items, function(o, i) {
					if (f(o.value)) {
						fv = 1;
						t.selectByIndex(i);
						return false;
					}
				});

				if (!fv)
					t.selectByIndex(-1);
			}
		},

		selectByIndex : function(idx) {
			var t = this, e, o;

			if (idx != t.selectedIndex) {
				e = DOM.get(t.id + '_text');
				o = t.items[idx];

				if (o) {
					t.selectedValue = o.value;
					t.selectedIndex = idx;
					DOM.setHTML(e, DOM.encode(o.title));
					DOM.removeClass(e, 'mceTitle');
				} else {
					DOM.setHTML(e, DOM.encode(t.settings.title));
					DOM.addClass(e, 'mceTitle');
					t.selectedValue = t.selectedIndex = null;
				}

				e = 0;
			}
		},

		add : function(n, v, o) {
			var t = this;

			o = o || {};
			o = tinymce.extend(o, {
				title : n,
				value : v
			});

			t.items.push(o);
			t.onAdd.dispatch(t, o);
		},

		getLength : function() {
			return this.items.length;
		},

		renderHTML : function() {
			var h = '', t = this, s = t.settings, cp = t.classPrefix;

			h = '<table id="' + t.id + '" cellpadding="0" cellspacing="0" class="' + cp + ' ' + cp + 'Enabled' + (s['class'] ? (' ' + s['class']) : '') + '"><tbody><tr>';
			h += '<td>' + DOM.createHTML('a', {id : t.id + '_text', href : 'javascript:;', 'class' : 'mceText', onclick : "return false;", onmousedown : 'return false;'}, DOM.encode(t.settings.title)) + '</td>';
			h += '<td>' + DOM.createHTML('a', {id : t.id + '_open', tabindex : -1, href : 'javascript:;', 'class' : 'mceOpen', onclick : "return false;", onmousedown : 'return false;'}, '<span></span>') + '</td>';
			h += '</tr></tbody></table>';

			return h;
		},

		showMenu : function() {
			var t = this, p1, p2, e = DOM.get(this.id), m;

			if (t.isDisabled() || t.items.length == 0)
				return;

			if (t.menu && t.menu.isMenuVisible)
				return t.hideMenu();

			if (!t.isMenuRendered) {
				t.renderMenu();
				t.isMenuRendered = true;
			}

			p1 = DOM.getPos(this.settings.menu_container);
			p2 = DOM.getPos(e);

			m = t.menu;
			m.settings.offset_x = p2.x;
			m.settings.offset_y = p2.y;
			m.settings.keyboard_focus = !tinymce.isOpera; // Opera is buggy when it comes to auto focus

			// Select in menu
			if (t.oldID)
				m.items[t.oldID].setSelected(0);

			each(t.items, function(o) {
				if (o.value === t.selectedValue) {
					m.items[o.id].setSelected(1);
					t.oldID = o.id;
				}
			});

			m.showMenu(0, e.clientHeight);

			Event.add(DOM.doc, 'mousedown', t.hideMenu, t);
			DOM.addClass(t.id, t.classPrefix + 'Selected');

			//DOM.get(t.id + '_text').focus();
		},

		hideMenu : function(e) {
			var t = this;

			// Prevent double toogles by canceling the mouse click event to the button
			if (e && e.type == "mousedown" && (e.target.id == t.id + '_text' || e.target.id == t.id + '_open'))
				return;

			if (!e || !DOM.getParent(e.target, '.mceMenu')) {
				DOM.removeClass(t.id, t.classPrefix + 'Selected');
				Event.remove(DOM.doc, 'mousedown', t.hideMenu, t);

				if (t.menu)
					t.menu.hideMenu();
			}
		},

		renderMenu : function() {
			var t = this, m;

			m = t.settings.control_manager.createDropMenu(t.id + '_menu', {
				menu_line : 1,
				'class' : t.classPrefix + 'Menu mceNoIcons',
				max_width : 150,
				max_height : 150
			});

			m.onHideMenu.add(t.hideMenu, t);

			m.add({
				title : t.settings.title,
				'class' : 'mceMenuItemTitle',
				onclick : function() {
					if (t.settings.onselect('') !== false)
						t.select(''); // Must be runned after
				}
			});

			each(t.items, function(o) {
				o.id = DOM.uniqueId();
				o.onclick = function() {
					if (t.settings.onselect(o.value) !== false)
						t.select(o.value); // Must be runned after
				};

				m.add(o);
			});

			t.onRenderMenu.dispatch(t, m);
			t.menu = m;
		},

		postRender : function() {
			var t = this, cp = t.classPrefix;

			Event.add(t.id, 'click', t.showMenu, t);
			Event.add(t.id + '_text', 'focus', function(e) {
				if (!t._focused) {
					t.keyDownHandler = Event.add(t.id + '_text', 'keydown', function(e) {
						var idx = -1, v, kc = e.keyCode;

						// Find current index
						each(t.items, function(v, i) {
							if (t.selectedValue == v.value)
								idx = i;
						});

						// Move up/down
						if (kc == 38)
							v = t.items[idx - 1];
						else if (kc == 40)
							v = t.items[idx + 1];
						else if (kc == 13) {
							// Fake select on enter
							v = t.selectedValue;
							t.selectedValue = null; // Needs to be null to fake change
							t.settings.onselect(v);
							return Event.cancel(e);
						}

						if (v) {
							t.hideMenu();
							t.select(v.value);
						}
					});
				}

				t._focused = 1;
			});
			Event.add(t.id + '_text', 'blur', function() {Event.remove(t.id + '_text', 'keydown', t.keyDownHandler); t._focused = 0;});

			// Old IE doesn't have hover on all elements
			if (tinymce.isIE6 || !DOM.boxModel) {
				Event.add(t.id, 'mouseover', function() {
					if (!DOM.hasClass(t.id, cp + 'Disabled'))
						DOM.addClass(t.id, cp + 'Hover');
				});

				Event.add(t.id, 'mouseout', function() {
					if (!DOM.hasClass(t.id, cp + 'Disabled'))
						DOM.removeClass(t.id, cp + 'Hover');
				});
			}

			t.onPostRender.dispatch(t, DOM.get(t.id));
		},

		destroy : function() {
			this.parent();

			Event.clear(this.id + '_text');
		}

		});
})(tinymce);(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher;

	tinymce.create('tinymce.ui.NativeListBox:tinymce.ui.ListBox', {
		NativeListBox : function(id, s) {
			this.parent(id, s);
			this.classPrefix = 'mceNativeListBox';
		},

		setDisabled : function(s) {
			DOM.get(this.id).disabled = s;
		},

		isDisabled : function() {
			return DOM.get(this.id).disabled;
		},

		select : function(va) {
			var t = this, fv, f;

			if (va == undefined)
				return t.selectByIndex(-1);

			// Is string or number make function selector
			if (va && va.call)
				f = va;
			else {
				f = function(v) {
					return v == va;
				};
			}

			// Do we need to do something?
			if (va != t.selectedValue) {
				// Find item
				each(t.items, function(o, i) {
					if (f(o.value)) {
						fv = 1;
						t.selectByIndex(i);
						return false;
					}
				});

				if (!fv)
					t.selectByIndex(-1);
			}
		},

		selectByIndex : function(idx) {
			DOM.get(this.id).selectedIndex = idx + 1;
			this.selectedValue = this.items[idx] ? this.items[idx].value : null;
		},

		add : function(n, v, a) {
			var o, t = this;

			a = a || {};
			a.value = v;

			if (t.isRendered())
				DOM.add(DOM.get(this.id), 'option', a, n);

			o = {
				title : n,
				value : v,
				attribs : a
			};

			t.items.push(o);
			t.onAdd.dispatch(t, o);
		},

		getLength : function() {
			return DOM.get(this.id).options.length - 1;
		},

		renderHTML : function() {
			var h, t = this;

			h = DOM.createHTML('option', {value : ''}, '-- ' + t.settings.title + ' --');

			each(t.items, function(it) {
				h += DOM.createHTML('option', {value : it.value}, it.title);
			});

			h = DOM.createHTML('select', {id : t.id, 'class' : 'mceNativeListBox'}, h);

			return h;
		},

		postRender : function() {
			var t = this, ch;

			t.rendered = true;

			function onChange(e) {
				var v = t.items[e.target.selectedIndex - 1];

				if (v && (v = v.value)) {
					t.onChange.dispatch(t, v);

					if (t.settings.onselect)
						t.settings.onselect(v);
				}
			};

			Event.add(t.id, 'change', onChange);

			// Accessibility keyhandler
			Event.add(t.id, 'keydown', function(e) {
				var bf;

				Event.remove(t.id, 'change', ch);

				bf = Event.add(t.id, 'blur', function() {
					Event.add(t.id, 'change', onChange);
					Event.remove(t.id, 'blur', bf);
				});

				if (e.keyCode == 13 || e.keyCode == 32) {
					onChange(e);
					return Event.cancel(e);
				}
			});

			t.onPostRender.dispatch(t, DOM.get(t.id));
		}

		});
})(tinymce);(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each;

	tinymce.create('tinymce.ui.MenuButton:tinymce.ui.Button', {
		MenuButton : function(id, s) {
			this.parent(id, s);
			this.onRenderMenu = new tinymce.util.Dispatcher(this);
			s.menu_container = s.menu_container || DOM.doc.body;
		},

		showMenu : function() {
			var t = this, p1, p2, e = DOM.get(t.id), m;

			if (t.isDisabled())
				return;

			if (!t.isMenuRendered) {
				t.renderMenu();
				t.isMenuRendered = true;
			}

			if (t.isMenuVisible)
				return t.hideMenu();

			p1 = DOM.getPos(t.settings.menu_container);
			p2 = DOM.getPos(e);

			m = t.menu;
			m.settings.offset_x = p2.x;
			m.settings.offset_y = p2.y;
			m.settings.vp_offset_x = p2.x;
			m.settings.vp_offset_y = p2.y;
			m.settings.keyboard_focus = t._focused;
			m.showMenu(0, e.clientHeight);

			Event.add(DOM.doc, 'mousedown', t.hideMenu, t);
			t.setState('Selected', 1);

			t.isMenuVisible = 1;
		},

		renderMenu : function() {
			var t = this, m;

			m = t.settings.control_manager.createDropMenu(t.id + '_menu', {
				menu_line : 1,
				'class' : this.classPrefix + 'Menu',
				icons : t.settings.icons
			});

			m.onHideMenu.add(t.hideMenu, t);

			t.onRenderMenu.dispatch(t, m);
			t.menu = m;
		},

		hideMenu : function(e) {
			var t = this;

			// Prevent double toogles by canceling the mouse click event to the button
			if (e && e.type == "mousedown" && DOM.getParent(e.target, function(e) {return e.id === t.id || e.id === t.id + '_open';}))
				return;

			if (!e || !DOM.getParent(e.target, '.mceMenu')) {
				t.setState('Selected', 0);
				Event.remove(DOM.doc, 'mousedown', t.hideMenu, t);
				if (t.menu)
					t.menu.hideMenu();
			}

			t.isMenuVisible = 0;
		},

		postRender : function() {
			var t = this, s = t.settings;

			Event.add(t.id, 'click', function() {
				if (!t.isDisabled()) {
					if (s.onclick)
						s.onclick(t.value);

					t.showMenu();
				}
			});
		}

		});
})(tinymce);
(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each;

	tinymce.create('tinymce.ui.SplitButton:tinymce.ui.MenuButton', {
		SplitButton : function(id, s) {
			this.parent(id, s);
			this.classPrefix = 'mceSplitButton';
		},

		renderHTML : function() {
			var h, t = this, s = t.settings, h1;

			h = '<tbody><tr>';

			if (s.image)
				h1 = DOM.createHTML('img ', {src : s.image, 'class' : 'mceAction ' + s['class']});
			else
				h1 = DOM.createHTML('span', {'class' : 'mceAction ' + s['class']}, '');

			h += '<td>' + DOM.createHTML('a', {id : t.id + '_action', href : 'javascript:;', 'class' : 'mceAction ' + s['class'], onclick : "return false;", onmousedown : 'return false;', title : s.title}, h1) + '</td>';
	
			h1 = DOM.createHTML('span', {'class' : 'mceOpen ' + s['class']});
			h += '<td>' + DOM.createHTML('a', {id : t.id + '_open', href : 'javascript:;', 'class' : 'mceOpen ' + s['class'], onclick : "return false;", onmousedown : 'return false;', title : s.title}, h1) + '</td>';

			h += '</tr></tbody>';

			return DOM.createHTML('table', {id : t.id, 'class' : 'mceSplitButton mceSplitButtonEnabled ' + s['class'], cellpadding : '0', cellspacing : '0', onmousedown : 'return false;', title : s.title}, h);
		},

		postRender : function() {
			var t = this, s = t.settings;

			if (s.onclick) {
				Event.add(t.id + '_action', 'click', function() {
					if (!t.isDisabled())
						s.onclick(t.value);
				});
			}

			Event.add(t.id + '_open', 'click', t.showMenu, t);
			Event.add(t.id + '_open', 'focus', function() {t._focused = 1;});
			Event.add(t.id + '_open', 'blur', function() {t._focused = 0;});

			// Old IE doesn't have hover on all elements
			if (tinymce.isIE6 || !DOM.boxModel) {
				Event.add(t.id, 'mouseover', function() {
					if (!DOM.hasClass(t.id, 'mceSplitButtonDisabled'))
						DOM.addClass(t.id, 'mceSplitButtonHover');
				});

				Event.add(t.id, 'mouseout', function() {
					if (!DOM.hasClass(t.id, 'mceSplitButtonDisabled'))
						DOM.removeClass(t.id, 'mceSplitButtonHover');
				});
			}
		},

		destroy : function() {
			this.parent();

			Event.clear(this.id + '_action');
			Event.clear(this.id + '_open');
		}

		});
})(tinymce);
(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, is = tinymce.is, each = tinymce.each;

	tinymce.create('tinymce.ui.ColorSplitButton:tinymce.ui.SplitButton', {
		ColorSplitButton : function(id, s) {
			var t = this;

			t.parent(id, s);

			t.settings = s = tinymce.extend({
				colors : '000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,008000,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,C0C0C0,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF,FFFFFF',
				grid_width : 8,
				default_color : '#888888'
			}, t.settings);

			t.onShowMenu = new tinymce.util.Dispatcher(t);
			t.onHideMenu = new tinymce.util.Dispatcher(t);

			t.value = s.default_color;
		},

		showMenu : function() {
			var t = this, r, p, e, p2;

			if (t.isDisabled())
				return;

			if (!t.isMenuRendered) {
				t.renderMenu();
				t.isMenuRendered = true;
			}

			if (t.isMenuVisible)
				return t.hideMenu();

			e = DOM.get(t.id);
			DOM.show(t.id + '_menu');
			DOM.addClass(e, 'mceSplitButtonSelected');
			p2 = DOM.getPos(e);
			DOM.setStyles(t.id + '_menu', {
				left : p2.x,
				top : p2.y + e.clientHeight,
				zIndex : 200000
			});
			e = 0;

			Event.add(DOM.doc, 'mousedown', t.hideMenu, t);

			if (t._focused) {
				t._keyHandler = Event.add(t.id + '_menu', 'keydown', function(e) {
					if (e.keyCode == 27)
						t.hideMenu();
				});

				DOM.select('a', t.id + '_menu')[0].focus(); // Select first link
			}

			t.onShowMenu.dispatch(t);

			t.isMenuVisible = 1;
		},

		hideMenu : function(e) {
			var t = this;

			// Prevent double toogles by canceling the mouse click event to the button
			if (e && e.type == "mousedown" && DOM.getParent(e.target, function(e) {return e.id === t.id + '_open';}))
				return;

			if (!e || !DOM.getParent(e.target, '.mceSplitButtonMenu')) {
				DOM.removeClass(t.id, 'mceSplitButtonSelected');
				Event.remove(DOM.doc, 'mousedown', t.hideMenu, t);
				Event.remove(t.id + '_menu', 'keydown', t._keyHandler);
				DOM.hide(t.id + '_menu');
			}

			t.onHideMenu.dispatch(t);

			t.isMenuVisible = 0;
		},

		renderMenu : function() {
			var t = this, m, i = 0, s = t.settings, n, tb, tr, w;

			w = DOM.add(s.menu_container, 'div', {id : t.id + '_menu', 'class' : s['menu_class'] + ' ' + s['class'], style : 'position:absolute;left:0;top:-1000px;'});
			m = DOM.add(w, 'div', {'class' : s['class'] + ' mceSplitButtonMenu'});
			DOM.add(m, 'span', {'class' : 'mceMenuLine'});

			n = DOM.add(m, 'table', {'class' : 'mceColorSplitMenu'});
			tb = DOM.add(n, 'tbody');

			// Generate color grid
			i = 0;
			each(is(s.colors, 'array') ? s.colors : s.colors.split(','), function(c) {
				c = c.replace(/^#/, '');

				if (!i--) {
					tr = DOM.add(tb, 'tr');
					i = s.grid_width - 1;
				}

				n = DOM.add(tr, 'td');

				n = DOM.add(n, 'a', {
					href : 'javascript:;',
					style : {
						backgroundColor : '#' + c
					},
					mce_color : '#' + c
				});
			});

			if (s.more_colors_func) {
				n = DOM.add(tb, 'tr');
				n = DOM.add(n, 'td', {colspan : s.grid_width, 'class' : 'mceMoreColors'});
				n = DOM.add(n, 'a', {id : t.id + '_more', href : 'javascript:;', onclick : 'return false;', 'class' : 'mceMoreColors'}, s.more_colors_title);

				Event.add(n, 'click', function(e) {
					s.more_colors_func.call(s.more_colors_scope || this);
					return Event.cancel(e); // Cancel to fix onbeforeunload problem
				});
			}

			DOM.addClass(m, 'mceColorSplitMenu');

			Event.add(t.id + '_menu', 'click', function(e) {
				var c;

				e = e.target;

				if (e.nodeName == 'A' && (c = e.getAttribute('mce_color')))
					t.setColor(c);

				return Event.cancel(e); // Prevent IE auto save warning
			});

			return w;
		},

		setColor : function(c) {
			var t = this;

			DOM.setStyle(t.id + '_preview', 'backgroundColor', c);

			t.value = c;
			t.hideMenu();
			t.settings.onselect(c);
		},

		postRender : function() {
			var t = this, id = t.id;

			t.parent();
			DOM.add(id + '_action', 'div', {id : id + '_preview', 'class' : 'mceColorPreview'});
			DOM.setStyle(t.id + '_preview', 'backgroundColor', t.value);
		},

		destroy : function() {
			this.parent();

			Event.clear(this.id + '_menu');
			Event.clear(this.id + '_more');
			DOM.remove(this.id + '_menu');
		}

		});
})(tinymce);
tinymce.create('tinymce.ui.Toolbar:tinymce.ui.Container', {
	renderHTML : function() {
		var t = this, h = '', c, co, dom = tinymce.DOM, s = t.settings, i, pr, nx, cl;

		cl = t.controls;
		for (i=0; i<cl.length; i++) {
			// Get current control, prev control, next control and if the control is a list box or not
			co = cl[i];
			pr = cl[i - 1];
			nx = cl[i + 1];

			// Add toolbar start
			if (i === 0) {
				c = 'mceToolbarStart';

				if (co.Button)
					c += ' mceToolbarStartButton';
				else if (co.SplitButton)
					c += ' mceToolbarStartSplitButton';
				else if (co.ListBox)
					c += ' mceToolbarStartListBox';

				h += dom.createHTML('td', {'class' : c}, dom.createHTML('span', null, '<!-- IE -->'));
			}

			// Add toolbar end before list box and after the previous button
			// This is to fix the o2k7 editor skins
			if (pr && co.ListBox) {
				if (pr.Button || pr.SplitButton)
					h += dom.createHTML('td', {'class' : 'mceToolbarEnd'}, dom.createHTML('span', null, '<!-- IE -->'));
			}

			// Render control HTML

			// IE 8 quick fix, needed to propertly generate a hit area for anchors
			if (dom.stdMode)
				h += '<td style="position: relative">' + co.renderHTML() + '</td>';
			else
				h += '<td>' + co.renderHTML() + '</td>';

			// Add toolbar start after list box and before the next button
			// This is to fix the o2k7 editor skins
			if (nx && co.ListBox) {
				if (nx.Button || nx.SplitButton)
					h += dom.createHTML('td', {'class' : 'mceToolbarStart'}, dom.createHTML('span', null, '<!-- IE -->'));
			}
		}

		c = 'mceToolbarEnd';

		if (co.Button)
			c += ' mceToolbarEndButton';
		else if (co.SplitButton)
			c += ' mceToolbarEndSplitButton';
		else if (co.ListBox)
			c += ' mceToolbarEndListBox';

		h += dom.createHTML('td', {'class' : c}, dom.createHTML('span', null, '<!-- IE -->'));

		return dom.createHTML('table', {id : t.id, 'class' : 'mceToolbar' + (s['class'] ? ' ' + s['class'] : ''), cellpadding : '0', cellspacing : '0', align : t.settings.align || ''}, '<tbody><tr>' + h + '</tr></tbody>');
	}

	});
(function(tinymce) {
	var Dispatcher = tinymce.util.Dispatcher, each = tinymce.each;

	tinymce.create('tinymce.AddOnManager', {
		items : [],
		urls : {},
		lookup : {},
		onAdd : new Dispatcher(this),

		get : function(n) {
			return this.lookup[n];
		},

		requireLangPack : function(n) {
			var u, s = tinymce.EditorManager.settings;

			if (s && s.language) {
				u = this.urls[n] + '/langs/' + s.language + '.js';

				if (!tinymce.dom.Event.domLoaded && !s.strict_mode)
					tinymce.ScriptLoader.load(u);
				else
					tinymce.ScriptLoader.add(u);
			}
		},

		add : function(id, o) {
			this.items.push(o);
			this.lookup[id] = o;
			this.onAdd.dispatch(this, id, o);

			return o;
		},

		load : function(n, u, cb, s) {
			var t = this;

			if (t.urls[n])
				return;

			if (u.indexOf('/') != 0 && u.indexOf('://') == -1)
				u = tinymce.baseURL + '/' +  u;

			t.urls[n] = u.substring(0, u.lastIndexOf('/'));
			tinymce.ScriptLoader.add(u, cb, s);
		}

		});

	// Create plugin and theme managers
	tinymce.PluginManager = new tinymce.AddOnManager();
	tinymce.ThemeManager = new tinymce.AddOnManager();
}(tinymce));(function(tinymce) {
	// Shorten names
	var each = tinymce.each, extend = tinymce.extend, DOM = tinymce.DOM, Event = tinymce.dom.Event, ThemeManager = tinymce.ThemeManager, PluginManager = tinymce.PluginManager, explode = tinymce.explode;

	tinymce.create('static tinymce.EditorManager', {
		editors : {},
		i18n : {},
		activeEditor : null,

		preInit : function() {
			var t = this, lo = window.location;

			// Setup some URLs where the editor API is located and where the document is
			tinymce.documentBaseURL = lo.href.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, '');
			if (!/[\/\\]$/.test(tinymce.documentBaseURL))
				tinymce.documentBaseURL += '/';

			tinymce.baseURL = new tinymce.util.URI(tinymce.documentBaseURL).toAbsolute(tinymce.baseURL);
			tinymce.EditorManager.baseURI = new tinymce.util.URI(tinymce.baseURL);

			// User specified a document.domain value
			if (document.domain && lo.hostname != document.domain)
				tinymce.relaxedDomain = document.domain;

			// Add before unload listener
			// This was required since IE was leaking memory if you added and removed beforeunload listeners
			// with attachEvent/detatchEvent so this only adds one listener and instances can the attach to the onBeforeUnload event
			t.onBeforeUnload = new tinymce.util.Dispatcher(t);

			// Must be on window or IE will leak if the editor is placed in frame or iframe
			Event.add(window, 'beforeunload', function(e) {
				t.onBeforeUnload.dispatch(t, e);
			});
		},

		init : function(s) {
			var t = this, pl, sl = tinymce.ScriptLoader, c, e, el = [], ed;

			function execCallback(se, n, s) {
				var f = se[n];

				if (!f)
					return;

				if (tinymce.is(f, 'string')) {
					s = f.replace(/\.\w+$/, '');
					s = s ? tinymce.resolve(s) : 0;
					f = tinymce.resolve(f);
				}

				return f.apply(s || this, Array.prototype.slice.call(arguments, 2));
			};

			s = extend({
				theme : "simple",
				language : "en",
				strict_loading_mode : document.contentType == 'application/xhtml+xml'
			}, s);

			t.settings = s;

			// If page not loaded and strict mode isn't enabled then load them
			if (!Event.domLoaded && !s.strict_loading_mode) {
				// Load language
				if (s.language)
					sl.add(tinymce.baseURL + '/langs/' + s.language + '.js');

				// Load theme
				if (s.theme && s.theme.charAt(0) != '-' && !ThemeManager.urls[s.theme])
					ThemeManager.load(s.theme, 'themes/' + s.theme + '/editor_template' + tinymce.suffix + '.js');

				// Load plugins
				if (s.plugins) {
					pl = explode(s.plugins);

					// Load compat2x first
					if (tinymce.inArray(pl, 'compat2x') != -1)
						PluginManager.load('compat2x', 'plugins/compat2x/editor_plugin' + tinymce.suffix + '.js');

					// Load rest if plugins
					each(pl, function(v) {
						if (v && v.charAt(0) != '-' && !PluginManager.urls[v]) {
							// Skip safari plugin for other browsers
							if (!tinymce.isWebKit && v == 'safari')
								return;

							PluginManager.load(v, 'plugins/' + v + '/editor_plugin' + tinymce.suffix + '.js');
						}
					});
				}

				sl.loadQueue();
			}

			// Legacy call
			Event.add(document, 'init', function() {
				var l, co;

				execCallback(s, 'onpageload');

				// Verify that it's a valid browser
				if (s.browsers) {
					l = false;

					each(explode(s.browsers), function(v) {
						switch (v) {
							case 'ie':
							case 'msie':
								if (tinymce.isIE)
									l = true;
								break;

							case 'gecko':
								if (tinymce.isGecko)
									l = true;
								break;

							case 'safari':
							case 'webkit':
								if (tinymce.isWebKit)
									l = true;
								break;

							case 'opera':
								if (tinymce.isOpera)
									l = true;

								break;
						}
					});

					// Not a valid one
					if (!l)
						return;
				}

				switch (s.mode) {
					case "exact":
						l = s.elements || '';

						if(l.length > 0) {
							each(explode(l), function(v) {
								if (DOM.get(v)) {
									ed = new tinymce.Editor(v, s);
									el.push(ed);
									ed.render(1);
								} else {
									c = 0;

									each(document.forms, function(f) {
										each(f.elements, function(e) {
											if (e.name === v) {
												v = 'mce_editor_' + c;
												DOM.setAttrib(e, 'id', v);

												ed = new tinymce.Editor(v, s);
												el.push(ed);
												ed.render(1);
											}
										});
									});
								}
							});
						}
						break;

					case "textareas":
					case "specific_textareas":
						function hasClass(n, c) {
							return c.constructor === RegExp ? c.test(n.className) : DOM.hasClass(n, c);
						};

						each(DOM.select('textarea'), function(v) {
							if (s.editor_deselector && hasClass(v, s.editor_deselector))
								return;

							if (!s.editor_selector || hasClass(v, s.editor_selector)) {
								// Can we use the name
								e = DOM.get(v.name);
								if (!v.id && !e)
									v.id = v.name;

								// Generate unique name if missing or already exists
								if (!v.id || t.get(v.id))
									v.id = DOM.uniqueId();

								ed = new tinymce.Editor(v.id, s);
								el.push(ed);
								ed.render(1);
							}
						});
						break;
				}

				// Call onInit when all editors are initialized
				if (s.oninit) {
					l = co = 0;

					each (el, function(ed) {
						co++;

						if (!ed.initialized) {
							// Wait for it
							ed.onInit.add(function() {
								l++;

								// All done
								if (l == co)
									execCallback(s, 'oninit');
							});
						} else
							l++;

						// All done
						if (l == co)
							execCallback(s, 'oninit');					
					});
				}
			});
		},

		get : function(id) {
			return this.editors[id];
		},

		getInstanceById : function(id) {
			return this.get(id);
		},

		add : function(e) {
			this.editors[e.id] = e;
			this._setActive(e);

			return e;
		},

		remove : function(e) {
			var t = this;

			// Not in the collection
			if (!t.editors[e.id])
				return null;

			delete t.editors[e.id];

			// Select another editor since the active one was removed
			if (t.activeEditor == e) {
				each(t.editors, function(e) {
					t._setActive(e);
					return false; // Break
				});
			}

			e.destroy();

			return e;
		},

		execCommand : function(c, u, v) {
			var t = this, ed = t.get(v), w;

			// Manager commands
			switch (c) {
				case "mceFocus":
					ed.focus();
					return true;

				case "mceAddEditor":
				case "mceAddControl":
					if (!t.get(v))
						new tinymce.Editor(v, t.settings).render();

					return true;

				case "mceAddFrameControl":
					w = v.window;

					// Add tinyMCE global instance and tinymce namespace to specified window
					w.tinyMCE = tinyMCE;
					w.tinymce = tinymce;

					tinymce.DOM.doc = w.document;
					tinymce.DOM.win = w;

					ed = new tinymce.Editor(v.element_id, v);
					ed.render();

					// Fix IE memory leaks
					if (tinymce.isIE) {
						function clr() {
							ed.destroy();
							w.detachEvent('onunload', clr);
							w = w.tinyMCE = w.tinymce = null; // IE leak
						};

						w.attachEvent('onunload', clr);
					}

					v.page_window = null;

					return true;

				case "mceRemoveEditor":
				case "mceRemoveControl":
					if (ed)
						ed.remove();

					return true;

				case 'mceToggleEditor':
					if (!ed) {
						t.execCommand('mceAddControl', 0, v);
						return true;
					}

					if (ed.isHidden())
						ed.show();
					else
						ed.hide();

					return true;
			}

			// Run command on active editor
			if (t.activeEditor)
				return t.activeEditor.execCommand(c, u, v);

			return false;
		},

		execInstanceCommand : function(id, c, u, v) {
			var ed = this.get(id);

			if (ed)
				return ed.execCommand(c, u, v);

			return false;
		},

		triggerSave : function() {
			each(this.editors, function(e) {
				e.save();
			});
		},

		addI18n : function(p, o) {
			var lo, i18n = this.i18n;

			if (!tinymce.is(p, 'string')) {
				each(p, function(o, lc) {
					each(o, function(o, g) {
						each(o, function(o, k) {
							if (g === 'common')
								i18n[lc + '.' + k] = o;
							else
								i18n[lc + '.' + g + '.' + k] = o;
						});
					});
				});
			} else {
				each(o, function(o, k) {
					i18n[p + '.' + k] = o;
				});
			}
		},

		// Private methods

		_setActive : function(e) {
			this.selectedInstance = this.activeEditor = e;
		}

		});

	tinymce.EditorManager.preInit();
})(tinymce);

// Short for editor manager window.tinyMCE is needed when TinyMCE gets loaded though a XHR call
var tinyMCE = window.tinyMCE = tinymce.EditorManager;
(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, extend = tinymce.extend, Dispatcher = tinymce.util.Dispatcher;
	var each = tinymce.each, isGecko = tinymce.isGecko, isIE = tinymce.isIE, isWebKit = tinymce.isWebKit;
	var is = tinymce.is, ThemeManager = tinymce.ThemeManager, PluginManager = tinymce.PluginManager, EditorManager = tinymce.EditorManager;
	var inArray = tinymce.inArray, grep = tinymce.grep, explode = tinymce.explode;

	tinymce.create('tinymce.Editor', {
		Editor : function(id, s) {
			var t = this;

			t.id = t.editorId = id;
			t.execCommands = {};
			t.queryStateCommands = {};
			t.queryValueCommands = {};
			t.plugins = {};

			// Add events to the editor
			each([
				'onPreInit',
				'onBeforeRenderUI',
				'onPostRender',
				'onInit',
				'onRemove',
				'onActivate',
				'onDeactivate',
				'onClick',
				'onEvent',
				'onMouseUp',
				'onMouseDown',
				'onDblClick',
				'onKeyDown',
				'onKeyUp',
				'onKeyPress',
				'onContextMenu',
				'onSubmit',
				'onReset',
				'onPaste',
				'onPreProcess',
				'onPostProcess',
				'onBeforeSetContent',
				'onBeforeGetContent',
				'onSetContent',
				'onGetContent',
				'onLoadContent',
				'onSaveContent',
				'onNodeChange',
				'onChange',
				'onBeforeExecCommand',
				'onExecCommand',
				'onUndo',
				'onRedo',
				'onVisualAid',
				'onSetProgressState'
			], function(e) {
				t[e] = new Dispatcher(t);
			});

			// Default editor config
			t.settings = s = extend({
				id : id,
				language : 'en',
				docs_language : 'en',
				theme : 'simple',
				skin : 'default',
				delta_width : 0,
				delta_height : 0,
				popup_css : '',
				plugins : '',
				document_base_url : tinymce.documentBaseURL,
				add_form_submit_trigger : 1,
				submit_patch : 1,
				add_unload_trigger : 1,
				convert_urls : 1,
				relative_urls : 1,
				remove_script_host : 1,
				table_inline_editing : 0,
				object_resizing : 1,
				cleanup : 1,
				accessibility_focus : 1,
				custom_shortcuts : 1,
				custom_undo_redo_keyboard_shortcuts : 1,
				custom_undo_redo_restore_selection : 1,
				custom_undo_redo : 1,
				doctype : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
				visual_table_class : 'mceItemTable',
				visual : 1,
				inline_styles : true,
				convert_fonts_to_spans : true,
				font_size_style_values : 'xx-small,x-small,small,medium,large,x-large,xx-large',
				apply_source_formatting : 1,
				directionality : 'ltr',
				forced_root_block : 'p',
				valid_elements : '@[id|class|style|title|dir<ltr?rtl|lang|xml::lang|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup],a[rel|rev|charset|hreflang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur],strong/b,em/i,strike,u,#p[align],-ol[type|compact],-ul[type|compact],-li,br,img[longdesc|usemap|src|border|alt=|title|hspace|vspace|width|height|align],-sub,-sup,-blockquote[cite],-table[border=0|cellspacing|cellpadding|width|frame|rules|height|align|summary|bgcolor|background|bordercolor],-tr[rowspan|width|height|align|valign|bgcolor|background|bordercolor],tbody,thead,tfoot,#td[colspan|rowspan|width|height|align|valign|bgcolor|background|bordercolor|scope],#th[colspan|rowspan|width|height|align|valign|scope],caption,-div,-span,-code,-pre,address,-h1,-h2,-h3,-h4,-h5,-h6,hr[size|noshade],-font[face|size|color],dd,dl,dt,cite,abbr,acronym,del[datetime|cite],ins[datetime|cite],object[classid|width|height|codebase|*],param[name|value],embed[type|width|height|src|*],script[src|type],map[name],area[shape|coords|href|alt|target],bdo,button,col[align|char|charoff|span|valign|width],colgroup[align|char|charoff|span|valign|width],dfn,fieldset,form[action|accept|accept-charset|enctype|method],input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value|tabindex|accesskey],kbd,label[for],legend,noscript,optgroup[label|disabled],option[disabled|label|selected|value],q[cite],samp,select[disabled|multiple|name|size],small,textarea[cols|rows|disabled|name|readonly],tt,var,big',
				hidden_input : 1,
				padd_empty_editor : 1,
				render_ui : 1,
				init_theme : 1,
				force_p_newlines : 1,
				indentation : '30px',
				keep_styles : 1,
				fix_table_elements : 1,
				removeformat_selector : 'span,b,strong,em,i,font,u,strike'
			}, s);

			// Setup URIs
			t.documentBaseURI = new tinymce.util.URI(s.document_base_url || tinymce.documentBaseURL, {
				base_uri : tinyMCE.baseURI
			});
			t.baseURI = EditorManager.baseURI;

			// Call setup
			t.execCallback('setup', t);
		},

		render : function(nst) {
			var t = this, s = t.settings, id = t.id, sl = tinymce.ScriptLoader;

			// Page is not loaded yet, wait for it
			if (!Event.domLoaded) {
				Event.add(document, 'init', function() {
					t.render();
				});
				return;
			}

			// Force strict loading mode if render us called by user and not internally
			if (!nst) {
				s.strict_loading_mode = 1;
				tinyMCE.settings = s;
			}

			// Element not found, then skip initialization
			if (!t.getElement())
				return;

			if (s.strict_loading_mode) {
				sl.settings.strict_mode = s.strict_loading_mode;
				tinymce.DOM.settings.strict = 1;
			}

			// Add hidden input for non input elements inside form elements
			if (!/TEXTAREA|INPUT/i.test(t.getElement().nodeName) && s.hidden_input && DOM.getParent(id, 'form'))
				DOM.insertAfter(DOM.create('input', {type : 'hidden', name : id}), id);

			if (tinymce.WindowManager)
				t.windowManager = new tinymce.WindowManager(t);

			if (s.encoding == 'xml') {
				t.onGetContent.add(function(ed, o) {
					if (o.save)
						o.content = DOM.encode(o.content);
				});
			}

			if (s.add_form_submit_trigger) {
				t.onSubmit.addToTop(function() {
					if (t.initialized) {
						t.save();
						t.isNotDirty = 1;
					}
				});
			}

			if (s.add_unload_trigger) {
				t._beforeUnload = tinyMCE.onBeforeUnload.add(function() {
					if (t.initialized && !t.destroyed && !t.isHidden())
						t.save({format : 'raw', no_events : true});
				});
			}

			tinymce.addUnload(t.destroy, t);

			if (s.submit_patch) {
				t.onBeforeRenderUI.add(function() {
					var n = t.getElement().form;

					if (!n)
						return;

					// Already patched
					if (n._mceOldSubmit)
						return;

					// Check page uses id="submit" or name="submit" for it's submit button
					if (!n.submit.nodeType && !n.submit.length) {
						t.formElement = n;
						n._mceOldSubmit = n.submit;
						n.submit = function() {
							// Save all instances
							EditorManager.triggerSave();
							t.isNotDirty = 1;

							return t.formElement._mceOldSubmit(t.formElement);
						};
					}

					n = null;
				});
			}

			// Load scripts
			function loadScripts() {
				if (s.language)
					sl.add(tinymce.baseURL + '/langs/' + s.language + '.js');

				if (s.theme && s.theme.charAt(0) != '-' && !ThemeManager.urls[s.theme])
					ThemeManager.load(s.theme, 'themes/' + s.theme + '/editor_template' + tinymce.suffix + '.js');

				each(explode(s.plugins), function(p) {
					if (p && p.charAt(0) != '-' && !PluginManager.urls[p]) {
						// Skip safari plugin for other browsers
						if (!isWebKit && p == 'safari')
							return;

						PluginManager.load(p, 'plugins/' + p + '/editor_plugin' + tinymce.suffix + '.js');
					}
				});

				// Init when que is loaded
				sl.loadQueue(function() {
					if (!t.removed)
						t.init();
				});
			};

			// Load compat2x first
			if (s.plugins.indexOf('compat2x') != -1) {
				PluginManager.load('compat2x', 'plugins/compat2x/editor_plugin' + tinymce.suffix + '.js');
				sl.loadQueue(loadScripts);
			} else
				loadScripts();
		},

		init : function() {
			var n, t = this, s = t.settings, w, h, e = t.getElement(), o, ti, u, bi, bc, re;

			EditorManager.add(t);

			// Create theme
			if (s.theme) {
				s.theme = s.theme.replace(/-/, '');
				o = ThemeManager.get(s.theme);
				t.theme = new o();

				if (t.theme.init && s.init_theme)
					t.theme.init(t, ThemeManager.urls[s.theme] || tinymce.documentBaseURL.replace(/\/$/, ''));
			}

			// Create all plugins
			each(explode(s.plugins.replace(/\-/g, '')), function(p) {
				var c = PluginManager.get(p), u = PluginManager.urls[p] || tinymce.documentBaseURL.replace(/\/$/, ''), po;

				if (c) {
					po = new c(t, u);

					t.plugins[p] = po;

					if (po.init)
						po.init(t, u);
				}
			});

			// Setup popup CSS path(s)
			if (s.popup_css !== false) {
				if (s.popup_css)
					s.popup_css = t.documentBaseURI.toAbsolute(s.popup_css);
				else
					s.popup_css = t.baseURI.toAbsolute("themes/" + s.theme + "/skins/" + s.skin + "/dialog.css");
			}

			if (s.popup_css_add)
				s.popup_css += ',' + t.documentBaseURI.toAbsolute(s.popup_css_add);

			// Setup control factory
			t.controlManager = new tinymce.ControlManager(t);
			t.undoManager = new tinymce.UndoManager(t);

			// Pass through
			t.undoManager.onAdd.add(function(um, l) {
				if (!l.initial)
					return t.onChange.dispatch(t, l, um);
			});

			t.undoManager.onUndo.add(function(um, l) {
				return t.onUndo.dispatch(t, l, um);
			});

			t.undoManager.onRedo.add(function(um, l) {
				return t.onRedo.dispatch(t, l, um);
			});

			if (s.custom_undo_redo) {
				t.onExecCommand.add(function(ed, cmd, ui, val, a) {
					if (cmd != 'Undo' && cmd != 'Redo' && cmd != 'mceRepaint' && (!a || !a.skip_undo))
						t.undoManager.add();
				});
			}

			t.onExecCommand.add(function(ed, c) {
				// Don't refresh the select lists until caret move
				if (!/^(FontName|FontSize)$/.test(c))
					t.nodeChanged();
			});

			// Remove ghost selections on images and tables in Gecko
			if (isGecko) {
				function repaint(a, o) {
					if (!o || !o.initial)
						t.execCommand('mceRepaint');
				};

				t.onUndo.add(repaint);
				t.onRedo.add(repaint);
				t.onSetContent.add(repaint);
			}

			// Enables users to override the control factory
			t.onBeforeRenderUI.dispatch(t, t.controlManager);

			// Measure box
			if (s.render_ui) {
				w = s.width || e.style.width || e.offsetWidth;
				h = s.height || e.style.height || e.offsetHeight;
				t.orgDisplay = e.style.display;
				re = /^[0-9\.]+(|px)$/i;

				if (re.test('' + w))
					w = Math.max(parseInt(w) + (o.deltaWidth || 0), 100);

				if (re.test('' + h))
					h = Math.max(parseInt(h) + (o.deltaHeight || 0), 100);

				// Render UI
				o = t.theme.renderUI({
					targetNode : e,
					width : w,
					height : h,
					deltaWidth : s.delta_width,
					deltaHeight : s.delta_height
				});

				t.editorContainer = o.editorContainer;
			}


			// Resize editor
			DOM.setStyles(o.sizeContainer || o.editorContainer, {
				width : w,
				height : h
			});

			h = (o.iframeHeight || h) + (typeof(h) == 'number' ? (o.deltaHeight || 0) : '');
			if (h < 100)
				h = 100;

			t.iframeHTML = s.doctype + '<html><head xmlns="http://www.w3.org/1999/xhtml"><base href="' + t.documentBaseURI.getURI() + '" />';
			t.iframeHTML += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';

			if (tinymce.relaxedDomain)
				t.iframeHTML += '<script type="text/javascript">document.domain = "' + tinymce.relaxedDomain + '";</script>';

			bi = s.body_id || 'tinymce';
			if (bi.indexOf('=') != -1) {
				bi = t.getParam('body_id', '', 'hash');
				bi = bi[t.id] || bi;
			}

			bc = s.body_class || '';
			if (bc.indexOf('=') != -1) {
				bc = t.getParam('body_class', '', 'hash');
				bc = bc[t.id] || '';
			}

			t.iframeHTML += '</head><body id="' + bi + '" class="mceContentBody ' + bc + '"></body></html>';

			// Domain relaxing enabled, then set document domain
			if (tinymce.relaxedDomain) {
				// We need to write the contents here in IE since multiple writes messes up refresh button and back button
				if (isIE || (tinymce.isOpera && parseFloat(opera.version()) >= 9.5))
					u = 'javascript:(function(){document.open();document.domain="' + document.domain + '";var ed = window.parent.tinyMCE.get("' + t.id + '");document.write(ed.iframeHTML);document.close();ed.setupIframe();})()';
				else if (tinymce.isOpera)
					u = 'javascript:(function(){document.open();document.domain="' + document.domain + '";document.close();ed.setupIframe();})()';					
			}

			// Create iframe
			n = DOM.add(o.iframeContainer, 'iframe', {
				id : t.id + "_ifr",
				src : u || 'javascript:""', // Workaround for HTTPS warning in IE6/7
				frameBorder : '0',
				style : {
					width : '100%',
					height : h
				}
			});

			t.contentAreaContainer = o.iframeContainer;
			DOM.get(o.editorContainer).style.display = t.orgDisplay;
			DOM.get(t.id).style.display = 'none';

			if (!isIE || !tinymce.relaxedDomain)
				t.setupIframe();

			e = n = o = null; // Cleanup
		},

		setupIframe : function() {
			var t = this, s = t.settings, e = DOM.get(t.id), d = t.getDoc(), h, b;

			// Setup iframe body
			if (!isIE || !tinymce.relaxedDomain) {
				d.open();
				d.write(t.iframeHTML);
				d.close();
			}

			// Design mode needs to be added here Ctrl+A will fail otherwise
			if (!isIE) {
				try {
					if (!s.readonly)
						d.designMode = 'On';
				} catch (ex) {
					// Will fail on Gecko if the editor is placed in an hidden container element
					// The design mode will be set ones the editor is focused
				}
			}

			// IE needs to use contentEditable or it will display non secure items for HTTPS
			if (isIE) {
				// It will not steal focus if we hide it while setting contentEditable
				b = t.getBody();
				DOM.hide(b);

				if (!s.readonly)
					b.contentEditable = true;

				DOM.show(b);
			}

			// Setup objects
			t.dom = new tinymce.DOM.DOMUtils(t.getDoc(), {
				keep_values : true,
				url_converter : t.convertURL,
				url_converter_scope : t,
				hex_colors : s.force_hex_style_colors,
				class_filter : s.class_filter,
				update_styles : 1,
				fix_ie_paragraphs : 1
			});

			t.serializer = new tinymce.dom.Serializer({
				entity_encoding : s.entity_encoding,
				entities : s.entities,
				valid_elements : s.verify_html === false ? '*[*]' : s.valid_elements,
				extended_valid_elements : s.extended_valid_elements,
				valid_child_elements : s.valid_child_elements,
				invalid_elements : s.invalid_elements,
				fix_table_elements : s.fix_table_elements,
				fix_list_elements : s.fix_list_elements,
				fix_content_duplication : s.fix_content_duplication,
				convert_fonts_to_spans : s.convert_fonts_to_spans,
				font_size_classes  : s.font_size_classes,
				font_size_style_values : s.font_size_style_values,
				apply_source_formatting : s.apply_source_formatting,
				remove_linebreaks : s.remove_linebreaks,
				element_format : s.element_format,
				dom : t.dom
			});

			t.selection = new tinymce.dom.Selection(t.dom, t.getWin(), t.serializer);
			t.forceBlocks = new tinymce.ForceBlocks(t, {
				forced_root_block : s.forced_root_block
			});
			t.editorCommands = new tinymce.EditorCommands(t);

			// Pass through
			t.serializer.onPreProcess.add(function(se, o) {
				return t.onPreProcess.dispatch(t, o, se);
			});

			t.serializer.onPostProcess.add(function(se, o) {
				return t.onPostProcess.dispatch(t, o, se);
			});

			t.onPreInit.dispatch(t);

			if (!s.gecko_spellcheck)
				t.getBody().spellcheck = 0;

			if (!s.readonly)
				t._addEvents();

			t.controlManager.onPostRender.dispatch(t, t.controlManager);
			t.onPostRender.dispatch(t);

			if (s.directionality)
				t.getBody().dir = s.directionality;

			if (s.nowrap)
				t.getBody().style.whiteSpace = "nowrap";

			if (s.auto_resize)
				t.onNodeChange.add(t.resizeToContent, t);

			if (s.custom_elements) {
				function handleCustom(ed, o) {
					each(explode(s.custom_elements), function(v) {
						var n;

						if (v.indexOf('~') === 0) {
							v = v.substring(1);
							n = 'span';
						} else
							n = 'div';

						o.content = o.content.replace(new RegExp('<(' + v + ')([^>]*)>', 'g'), '<' + n + ' mce_name="$1"$2>');
						o.content = o.content.replace(new RegExp('</(' + v + ')>', 'g'), '</' + n + '>');
					});
				};

				t.onBeforeSetContent.add(handleCustom);
				t.onPostProcess.add(function(ed, o) {
					if (o.set)
						handleCustom(ed, o)
				});
			}

			if (s.handle_node_change_callback) {
				t.onNodeChange.add(function(ed, cm, n) {
					t.execCallback('handle_node_change_callback', t.id, n, -1, -1, true, t.selection.isCollapsed());
				});
			}

			if (s.save_callback) {
				t.onSaveContent.add(function(ed, o) {
					var h = t.execCallback('save_callback', t.id, o.content, t.getBody());

					if (h)
						o.content = h;
				});
			}

			if (s.onchange_callback) {
				t.onChange.add(function(ed, l) {
					t.execCallback('onchange_callback', t, l);
				});
			}

			if (s.convert_newlines_to_brs) {
				t.onBeforeSetContent.add(function(ed, o) {
					if (o.initial)
						o.content = o.content.replace(/\r?\n/g, '<br />');
				});
			}

			if (s.fix_nesting && isIE) {
				t.onBeforeSetContent.add(function(ed, o) {
					o.content = t._fixNesting(o.content);
				});
			}

			if (s.preformatted) {
				t.onPostProcess.add(function(ed, o) {
					o.content = o.content.replace(/^\s*<pre.*?>/, '');
					o.content = o.content.replace(/<\/pre>\s*$/, '');

					if (o.set)
						o.content = '<pre class="mceItemHidden">' + o.content + '</pre>';
				});
			}

			if (s.verify_css_classes) {
				t.serializer.attribValueFilter = function(n, v) {
					var s, cl;

					if (n == 'class') {
						// Build regexp for classes
						if (!t.classesRE) {
							cl = t.dom.getClasses();

							if (cl.length > 0) {
								s = '';

								each (cl, function(o) {
									s += (s ? '|' : '') + o['class'];
								});

								t.classesRE = new RegExp('(' + s + ')', 'gi');
							}
						}

						return !t.classesRE || /(\bmceItem\w+\b|\bmceTemp\w+\b)/g.test(v) || t.classesRE.test(v) ? v : '';
					}

					return v;
				};
			}

			if (s.convert_fonts_to_spans)
				t._convertFonts();

			if (s.inline_styles)
				t._convertInlineElements();

			if (s.cleanup_callback) {
				t.onBeforeSetContent.add(function(ed, o) {
					o.content = t.execCallback('cleanup_callback', 'insert_to_editor', o.content, o);
				});

				t.onPreProcess.add(function(ed, o) {
					if (o.set)
						t.execCallback('cleanup_callback', 'insert_to_editor_dom', o.node, o);

					if (o.get)
						t.execCallback('cleanup_callback', 'get_from_editor_dom', o.node, o);
				});

				t.onPostProcess.add(function(ed, o) {
					if (o.set)
						o.content = t.execCallback('cleanup_callback', 'insert_to_editor', o.content, o);

					if (o.get)						
						o.content = t.execCallback('cleanup_callback', 'get_from_editor', o.content, o);
				});
			}

			if (s.save_callback) {
				t.onGetContent.add(function(ed, o) {
					if (o.save)
						o.content = t.execCallback('save_callback', t.id, o.content, t.getBody());
				});
			}

			if (s.handle_event_callback) {
				t.onEvent.add(function(ed, e, o) {
					if (t.execCallback('handle_event_callback', e, ed, o) === false)
						Event.cancel(e);
				});
			}

			// Add visual aids when new contents is added
			t.onSetContent.add(function() {
				t.addVisual(t.getBody());
			});

			// Remove empty contents
			if (s.padd_empty_editor) {
				t.onPostProcess.add(function(ed, o) {
					o.content = o.content.replace(/^(<p[^>]*>(&nbsp;|&#160;|\s|\u00a0|)<\/p>[\r\n]*|<br \/>[\r\n]*)$/, '');
				});
			}

			if (isGecko) {
				// Fix gecko link bug, when a link is placed at the end of block elements there is
				// no way to move the caret behind the link. This fix adds a bogus br element after the link
				function fixLinks(ed, o) {
					each(ed.dom.select('a'), function(n) {
						var pn = n.parentNode;

						if (ed.dom.isBlock(pn) && pn.lastChild === n)
							ed.dom.add(pn, 'br', {'mce_bogus' : 1});
					});
				};

				t.onExecCommand.add(function(ed, cmd) {
					if (cmd === 'CreateLink')
						fixLinks(ed);
				});

				t.onSetContent.add(t.selection.onSetContent.add(fixLinks));

				if (!s.readonly) {
					try {
						// Design mode must be set here once again to fix a bug where
						// Ctrl+A/Delete/Backspace didn't work if the editor was added using mceAddControl then removed then added again
						d.designMode = 'Off';
						d.designMode = 'On';
					} catch (ex) {
						// Will fail on Gecko if the editor is placed in an hidden container element
						// The design mode will be set ones the editor is focused
					}
				}
			}

			// A small timeout was needed since firefox will remove. Bug: #1838304
			setTimeout(function () {
				if (t.removed)
					return;

				t.load({initial : true, format : (s.cleanup_on_startup ? 'html' : 'raw')});
				t.startContent = t.getContent({format : 'raw'});
				t.undoManager.add({initial : true});
				t.initialized = true;

				t.onInit.dispatch(t);
				t.execCallback('setupcontent_callback', t.id, t.getBody(), t.getDoc());
				t.execCallback('init_instance_callback', t);
				t.focus(true);
				t.nodeChanged({initial : 1});

				// Load specified content CSS last
				if (s.content_css) {
					tinymce.each(explode(s.content_css), function(u) {
						t.dom.loadCSS(t.documentBaseURI.toAbsolute(u));
					});
				}

				// Handle auto focus
				if (s.auto_focus) {
					setTimeout(function () {
						var ed = EditorManager.get(s.auto_focus);

						ed.selection.select(ed.getBody(), 1);
						ed.selection.collapse(1);
						ed.getWin().focus();
					}, 100);
				}
			}, 1);
	
			e = null;
		},


		focus : function(sf) {
			var oed, t = this, ce = t.settings.content_editable;

			if (!sf) {
				// Is not content editable or the selection is outside the area in IE
				// the IE statement is needed to avoid bluring if element selections inside layers since
				// the layer is like it's own document in IE
				if (!ce && (!isIE || t.selection.getNode().ownerDocument != t.getDoc()))
					t.getWin().focus();

			}

			if (EditorManager.activeEditor != t) {
				if ((oed = EditorManager.activeEditor) != null)
					oed.onDeactivate.dispatch(oed, t);

				t.onActivate.dispatch(t, oed);
			}

			EditorManager._setActive(t);
		},

		execCallback : function(n) {
			var t = this, f = t.settings[n], s;

			if (!f)
				return;

			// Look through lookup
			if (t.callbackLookup && (s = t.callbackLookup[n])) {
				f = s.func;
				s = s.scope;
			}

			if (is(f, 'string')) {
				s = f.replace(/\.\w+$/, '');
				s = s ? tinymce.resolve(s) : 0;
				f = tinymce.resolve(f);
				t.callbackLookup = t.callbackLookup || {};
				t.callbackLookup[n] = {func : f, scope : s};
			}

			return f.apply(s || t, Array.prototype.slice.call(arguments, 1));
		},

		translate : function(s) {
			var c = this.settings.language || 'en', i18n = EditorManager.i18n;

			if (!s)
				return '';

			return i18n[c + '.' + s] || s.replace(/{\#([^}]+)\}/g, function(a, b) {
				return i18n[c + '.' + b] || '{#' + b + '}';
			});
		},

		getLang : function(n, dv) {
			return EditorManager.i18n[(this.settings.language || 'en') + '.' + n] || (is(dv) ? dv : '{#' + n + '}');
		},

		getParam : function(n, dv, ty) {
			var tr = tinymce.trim, v = is(this.settings[n]) ? this.settings[n] : dv, o;

			if (ty === 'hash') {
				o = {};

				if (is(v, 'string')) {
					each(v.indexOf('=') > 0 ? v.split(/[;,](?![^=;,]*(?:[;,]|$))/) : v.split(','), function(v) {
						v = v.split('=');

						if (v.length > 1)
							o[tr(v[0])] = tr(v[1]);
						else
							o[tr(v[0])] = tr(v);
					});
				} else
					o = v;

				return o;
			}

			return v;
		},

		nodeChanged : function(o) {
			var t = this, s = t.selection, n = s.getNode() || t.getBody();

			// Fix for bug #1896577 it seems that this can not be fired while the editor is loading
			if (t.initialized) {
				t.onNodeChange.dispatch(
					t,
					o ? o.controlManager || t.controlManager : t.controlManager,
					isIE && n.ownerDocument != t.getDoc() ? t.getBody() : n, // Fix for IE initial state
					s.isCollapsed(),
					o
				);
			}
		},

		addButton : function(n, s) {
			var t = this;

			t.buttons = t.buttons || {};
			t.buttons[n] = s;
		},

		addCommand : function(n, f, s) {
			this.execCommands[n] = {func : f, scope : s || this};
		},

		addQueryStateHandler : function(n, f, s) {
			this.queryStateCommands[n] = {func : f, scope : s || this};
		},

		addQueryValueHandler : function(n, f, s) {
			this.queryValueCommands[n] = {func : f, scope : s || this};
		},

		addShortcut : function(pa, desc, cmd_func, sc) {
			var t = this, c;

			if (!t.settings.custom_shortcuts)
				return false;

			t.shortcuts = t.shortcuts || {};

			if (is(cmd_func, 'string')) {
				c = cmd_func;

				cmd_func = function() {
					t.execCommand(c, false, null);
				};
			}

			if (is(cmd_func, 'object')) {
				c = cmd_func;

				cmd_func = function() {
					t.execCommand(c[0], c[1], c[2]);
				};
			}

			each(explode(pa), function(pa) {
				var o = {
					func : cmd_func,
					scope : sc || this,
					desc : desc,
					alt : false,
					ctrl : false,
					shift : false
				};

				each(explode(pa, '+'), function(v) {
					switch (v) {
						case 'alt':
						case 'ctrl':
						case 'shift':
							o[v] = true;
							break;

						default:
							o.charCode = v.charCodeAt(0);
							o.keyCode = v.toUpperCase().charCodeAt(0);
					}
				});

				t.shortcuts[(o.ctrl ? 'ctrl' : '') + ',' + (o.alt ? 'alt' : '') + ',' + (o.shift ? 'shift' : '') + ',' + o.keyCode] = o;
			});

			return true;
		},

		execCommand : function(cmd, ui, val, a) {
			var t = this, s = 0, o, st;

			if (!/^(mceAddUndoLevel|mceEndUndoLevel|mceBeginUndoLevel|mceRepaint|SelectAll)$/.test(cmd) && (!a || !a.skip_focus))
				t.focus();

			o = {};
			t.onBeforeExecCommand.dispatch(t, cmd, ui, val, o);
			if (o.terminate)
				return false;

			// Command callback
			if (t.execCallback('execcommand_callback', t.id, t.selection.getNode(), cmd, ui, val)) {
				t.onExecCommand.dispatch(t, cmd, ui, val, a);
				return true;
			}

			// Registred commands
			if (o = t.execCommands[cmd]) {
				st = o.func.call(o.scope, ui, val);

				// Fall through on true
				if (st !== true) {
					t.onExecCommand.dispatch(t, cmd, ui, val, a);
					return st;
				}
			}

			// Plugin commands
			each(t.plugins, function(p) {
				if (p.execCommand && p.execCommand(cmd, ui, val)) {
					t.onExecCommand.dispatch(t, cmd, ui, val, a);
					s = 1;
					return false;
				}
			});

			if (s)
				return true;

			// Theme commands
			if (t.theme && t.theme.execCommand && t.theme.execCommand(cmd, ui, val)) {
				t.onExecCommand.dispatch(t, cmd, ui, val, a);
				return true;
			}

			// Execute global commands
			if (tinymce.GlobalCommands.execCommand(t, cmd, ui, val)) {
				t.onExecCommand.dispatch(t, cmd, ui, val, a);
				return true;
			}

			// Editor commands
			if (t.editorCommands.execCommand(cmd, ui, val)) {
				t.onExecCommand.dispatch(t, cmd, ui, val, a);
				return true;
			}

			// Browser commands
			t.getDoc().execCommand(cmd, ui, val);
			t.onExecCommand.dispatch(t, cmd, ui, val, a);
		},

		queryCommandState : function(c) {
			var t = this, o, s;

			// Is hidden then return undefined
			if (t._isHidden())
				return;

			// Registred commands
			if (o = t.queryStateCommands[c]) {
				s = o.func.call(o.scope);

				// Fall though on true
				if (s !== true)
					return s;
			}

			// Registred commands
			o = t.editorCommands.queryCommandState(c);
			if (o !== -1)
				return o;

			// Browser commands
			try {
				return this.getDoc().queryCommandState(c);
			} catch (ex) {
				// Fails sometimes see bug: 1896577
			}
		},

		queryCommandValue : function(c) {
			var t = this, o, s;

			// Is hidden then return undefined
			if (t._isHidden())
				return;

			// Registred commands
			if (o = t.queryValueCommands[c]) {
				s = o.func.call(o.scope);

				// Fall though on true
				if (s !== true)
					return s;
			}

			// Registred commands
			o = t.editorCommands.queryCommandValue(c);
			if (is(o))
				return o;

			// Browser commands
			try {
				return this.getDoc().queryCommandValue(c);
			} catch (ex) {
				// Fails sometimes see bug: 1896577
			}
		},

		show : function() {
			var t = this;

			DOM.show(t.getContainer());
			DOM.hide(t.id);
			t.load();
		},

		hide : function() {
			var t = this, d = t.getDoc();

			// Fixed bug where IE has a blinking cursor left from the editor
			if (isIE && d)
				d.execCommand('SelectAll');

			// We must save before we hide so Safari doesn't crash
			t.save();
			DOM.hide(t.getContainer());
			DOM.setStyle(t.id, 'display', t.orgDisplay);
		},

		isHidden : function() {
			return !DOM.isHidden(this.id);
		},

		setProgressState : function(b, ti, o) {
			this.onSetProgressState.dispatch(this, b, ti, o);

			return b;
		},

		resizeToContent : function() {
			var t = this;

			DOM.setStyle(t.id + "_ifr", 'height', t.getBody().scrollHeight);
		},

		load : function(o) {
			var t = this, e = t.getElement(), h;

			if (e) {
				o = o || {};
				o.load = true;

				// Double encode existing entities in the value
				h = t.setContent(is(e.value) ? e.value : e.innerHTML, o);
				o.element = e;

				if (!o.no_events)
					t.onLoadContent.dispatch(t, o);

				o.element = e = null;

				return h;
			}
		},

		save : function(o) {
			var t = this, e = t.getElement(), h, f;

			if (!e || !t.initialized)
				return;

			o = o || {};
			o.save = true;

			// Add undo level will trigger onchange event
			if (!o.no_events) {
				t.undoManager.typing = 0;
				t.undoManager.add();
			}

			o.element = e;
			h = o.content = t.getContent(o);

			if (!o.no_events)
				t.onSaveContent.dispatch(t, o);

			h = o.content;

			if (!/TEXTAREA|INPUT/i.test(e.nodeName)) {
				e.innerHTML = h;

				// Update hidden form element
				if (f = DOM.getParent(t.id, 'form')) {
					each(f.elements, function(e) {
						if (e.name == t.id) {
							e.value = h;
							return false;
						}
					});
				}
			} else
				e.value = h;

			o.element = e = null;

			return h;
		},

		setContent : function(h, o) {
			var t = this;

			o = o || {};
			o.format = o.format || 'html';
			o.set = true;
			o.content = h;

			if (!o.no_events)
				t.onBeforeSetContent.dispatch(t, o);

			// Padd empty content in Gecko and Safari. Commands will otherwise fail on the content
			// It will also be impossible to place the caret in the editor unless there is a BR element present
			if (!tinymce.isIE && (h.length === 0 || /^\s+$/.test(h))) {
				o.content = t.dom.setHTML(t.getBody(), '<br mce_bogus="1" />');
				o.format = 'raw';
			}

			o.content = t.dom.setHTML(t.getBody(), tinymce.trim(o.content));

			if (o.format != 'raw' && t.settings.cleanup) {
				o.getInner = true;
				o.content = t.dom.setHTML(t.getBody(), t.serializer.serialize(t.getBody(), o));
			}

			if (!o.no_events)
				t.onSetContent.dispatch(t, o);

			return o.content;
		},

		getContent : function(o) {
			var t = this, h;

			o = o || {};
			o.format = o.format || 'html';
			o.get = true;

			if (!o.no_events)
				t.onBeforeGetContent.dispatch(t, o);

			if (o.format != 'raw' && t.settings.cleanup) {
				o.getInner = true;
				h = t.serializer.serialize(t.getBody(), o);
			} else
				h = t.getBody().innerHTML;

			h = h.replace(/^\s*|\s*$/g, '');
			o.content = h;

			if (!o.no_events)
				t.onGetContent.dispatch(t, o);

			return o.content;
		},

		isDirty : function() {
			var t = this;

			return tinymce.trim(t.startContent) != tinymce.trim(t.getContent({format : 'raw', no_events : 1})) && !t.isNotDirty;
		},

		getContainer : function() {
			var t = this;

			if (!t.container)
				t.container = DOM.get(t.editorContainer || t.id + '_parent');

			return t.container;
		},

		getContentAreaContainer : function() {
			return this.contentAreaContainer;
		},

		getElement : function() {
			return DOM.get(this.settings.content_element || this.id);
		},

		getWin : function() {
			var t = this, e;

			if (!t.contentWindow) {
				e = DOM.get(t.id + "_ifr");

				if (e)
					t.contentWindow = e.contentWindow;
			}

			return t.contentWindow;
		},

		getDoc : function() {
			var t = this, w;

			if (!t.contentDocument) {
				w = t.getWin();

				if (w)
					t.contentDocument = w.document;
			}

			return t.contentDocument;
		},

		getBody : function() {
			return this.bodyElement || this.getDoc().body;
		},

		convertURL : function(u, n, e) {
			var t = this, s = t.settings;

			// Use callback instead
			if (s.urlconverter_callback)
				return t.execCallback('urlconverter_callback', u, e, true, n);

			// Don't convert link href since thats the CSS files that gets loaded into the editor also skip local file URLs
			if (!s.convert_urls || (e && e.nodeName == 'LINK') || u.indexOf('file:') === 0)
				return u;

			// Convert to relative
			if (s.relative_urls)
				return t.documentBaseURI.toRelative(u);

			// Convert to absolute
			u = t.documentBaseURI.toAbsolute(u, s.remove_script_host);

			return u;
		},

		addVisual : function(e) {
			var t = this, s = t.settings;

			e = e || t.getBody();

			if (!is(t.hasVisual))
				t.hasVisual = s.visual;

			each(t.dom.select('table,a', e), function(e) {
				var v;

				switch (e.nodeName) {
					case 'TABLE':
						v = t.dom.getAttrib(e, 'border');

						if (!v || v == '0') {
							if (t.hasVisual)
								t.dom.addClass(e, s.visual_table_class);
							else
								t.dom.removeClass(e, s.visual_table_class);
						}

						return;

					case 'A':
						v = t.dom.getAttrib(e, 'name');

						if (v) {
							if (t.hasVisual)
								t.dom.addClass(e, 'mceItemAnchor');
							else
								t.dom.removeClass(e, 'mceItemAnchor');
						}

						return;
				}
			});

			t.onVisualAid.dispatch(t, e, t.hasVisual);
		},

		remove : function() {
			var t = this, e = t.getContainer();

			t.removed = 1; // Cancels post remove event execution
			t.hide();

			t.execCallback('remove_instance_callback', t);
			t.onRemove.dispatch(t);

			// Clear all execCommand listeners this is required to avoid errors if the editor was removed inside another command
			t.onExecCommand.listeners = [];

			EditorManager.remove(t);
			DOM.remove(e);
		},

		destroy : function(s) {
			var t = this;

			// One time is enough
			if (t.destroyed)
				return;

			if (!s) {
				tinymce.removeUnload(t.destroy);
				tinyMCE.onBeforeUnload.remove(t._beforeUnload);

				// Manual destroy
				if (t.theme && t.theme.destroy)
					t.theme.destroy();

				// Destroy controls, selection and dom
				t.controlManager.destroy();
				t.selection.destroy();
				t.dom.destroy();

				// Remove all events

				// Don't clear the window or document if content editable
				// is enabled since other instances might still be present
				if (!t.settings.content_editable) {
					Event.clear(t.getWin());
					Event.clear(t.getDoc());
				}

				Event.clear(t.getBody());
				Event.clear(t.formElement);
			}

			if (t.formElement) {
				t.formElement.submit = t.formElement._mceOldSubmit;
				t.formElement._mceOldSubmit = null;
			}

			t.contentAreaContainer = t.formElement = t.container = t.settings.content_element = t.bodyElement = t.contentDocument = t.contentWindow = null;

			if (t.selection)
				t.selection = t.selection.win = t.selection.dom = t.selection.dom.doc = null;

			t.destroyed = 1;
		},

		// Internal functions

		_addEvents : function() {
			// 'focus', 'blur', 'dblclick', 'beforedeactivate', submit, reset
			var t = this, i, s = t.settings, lo = {
				mouseup : 'onMouseUp',
				mousedown : 'onMouseDown',
				click : 'onClick',
				keyup : 'onKeyUp',
				keydown : 'onKeyDown',
				keypress : 'onKeyPress',
				submit : 'onSubmit',
				reset : 'onReset',
				contextmenu : 'onContextMenu',
				dblclick : 'onDblClick',
				paste : 'onPaste' // Doesn't work in all browsers yet
			};

			function eventHandler(e, o) {
				var ty = e.type;

				// Don't fire events when it's removed
				if (t.removed)
					return;

				// Generic event handler
				if (t.onEvent.dispatch(t, e, o) !== false) {
					// Specific event handler
					t[lo[e.fakeType || e.type]].dispatch(t, e, o);
				}
			};

			// Add DOM events
			each(lo, function(v, k) {
				switch (k) {
					case 'contextmenu':
						if (tinymce.isOpera) {
							// Fake contextmenu on Opera
							Event.add(t.getBody(), 'mousedown', function(e) {
								if (e.ctrlKey) {
									e.fakeType = 'contextmenu';
									eventHandler(e);
								}
							});
						} else
							Event.add(t.getBody(), k, eventHandler);
						break;

					case 'paste':
						Event.add(t.getBody(), k, function(e) {
							eventHandler(e);
						});
						break;

					case 'submit':
					case 'reset':
						Event.add(t.getElement().form || DOM.getParent(t.id, 'form'), k, eventHandler);
						break;

					default:
						Event.add(s.content_editable ? t.getBody() : t.getDoc(), k, eventHandler);
				}
			});

			Event.add(s.content_editable ? t.getBody() : (isGecko ? t.getDoc() : t.getWin()), 'focus', function(e) {
				t.focus(true);
			});


			// Fixes bug where a specified document_base_uri could result in broken images
			// This will also fix drag drop of images in Gecko
			if (tinymce.isGecko) {
				// Convert all images to absolute URLs
/*				t.onSetContent.add(function(ed, o) {
					each(ed.dom.select('img'), function(e) {
						var v;

						if (v = e.getAttribute('mce_src'))
							e.src = t.documentBaseURI.toAbsolute(v);
					})
				});*/

				Event.add(t.getDoc(), 'DOMNodeInserted', function(e) {
					var v;

					e = e.target;

					if (e.nodeType === 1 && e.nodeName === 'IMG' && (v = e.getAttribute('mce_src')))
						e.src = t.documentBaseURI.toAbsolute(v);
				});
			}

			// Set various midas options in Gecko
			if (isGecko) {
				function setOpts() {
					var t = this, d = t.getDoc(), s = t.settings;

					if (isGecko && !s.readonly) {
						if (t._isHidden()) {
							try {
								if (!s.content_editable)
									d.designMode = 'On';
							} catch (ex) {
								// Fails if it's hidden
							}
						}

						try {
							// Try new Gecko method
							d.execCommand("styleWithCSS", 0, false);
						} catch (ex) {
							// Use old method
							if (!t._isHidden())
								try {d.execCommand("useCSS", 0, true);} catch (ex) {}
						}

						if (!s.table_inline_editing)
							try {d.execCommand('enableInlineTableEditing', false, false);} catch (ex) {}

						if (!s.object_resizing)
							try {d.execCommand('enableObjectResizing', false, false);} catch (ex) {}
					}
				};

				t.onBeforeExecCommand.add(setOpts);
				t.onMouseDown.add(setOpts);
			}

			// Add node change handlers
			t.onMouseUp.add(t.nodeChanged);
			t.onClick.add(t.nodeChanged);
			t.onKeyUp.add(function(ed, e) {
				var c = e.keyCode;

				if ((c >= 33 && c <= 36) || (c >= 37 && c <= 40) || c == 13 || c == 45 || c == 46 || c == 8 || (tinymce.isMac && (c == 91 || c == 93)) || e.ctrlKey)
					t.nodeChanged();
			});

			// Add reset handler
			t.onReset.add(function() {
				t.setContent(t.startContent, {format : 'raw'});
			});

			// Add shortcuts
			if (s.custom_shortcuts) {
				if (s.custom_undo_redo_keyboard_shortcuts) {
					t.addShortcut('ctrl+z', t.getLang('undo_desc'), 'Undo');
					t.addShortcut('ctrl+y', t.getLang('redo_desc'), 'Redo');
				}

				// Add default shortcuts for gecko
				if (isGecko) {
					t.addShortcut('ctrl+b', t.getLang('bold_desc'), 'Bold');
					t.addShortcut('ctrl+i', t.getLang('italic_desc'), 'Italic');
					t.addShortcut('ctrl+u', t.getLang('underline_desc'), 'Underline');
				}

				// BlockFormat shortcuts keys
				for (i=1; i<=6; i++)
					t.addShortcut('ctrl+' + i, '', ['FormatBlock', false, '<h' + i + '>']);

				t.addShortcut('ctrl+7', '', ['FormatBlock', false, '<p>']);
				t.addShortcut('ctrl+8', '', ['FormatBlock', false, '<div>']);
				t.addShortcut('ctrl+9', '', ['FormatBlock', false, '<address>']);

				function find(e) {
					var v = null;

					if (!e.altKey && !e.ctrlKey && !e.metaKey)
						return v;

					each(t.shortcuts, function(o) {
						if (tinymce.isMac && o.ctrl != e.metaKey)
							return;
						else if (!tinymce.isMac && o.ctrl != e.ctrlKey)
							return;

						if (o.alt != e.altKey)
							return;

						if (o.shift != e.shiftKey)
							return;

						if (e.keyCode == o.keyCode || (e.charCode && e.charCode == o.charCode)) {
							v = o;
							return false;
						}
					});

					return v;
				};

				t.onKeyUp.add(function(ed, e) {
					var o = find(e);

					if (o)
						return Event.cancel(e);
				});

				t.onKeyPress.add(function(ed, e) {
					var o = find(e);

					if (o)
						return Event.cancel(e);
				});

				t.onKeyDown.add(function(ed, e) {
					var o = find(e);

					if (o) {
						o.func.call(o.scope);
						return Event.cancel(e);
					}
				});
			}

			if (tinymce.isIE) {
				// Fix so resize will only update the width and height attributes not the styles of an image
				// It will also block mceItemNoResize items
				Event.add(t.getDoc(), 'controlselect', function(e) {
					var re = t.resizeInfo, cb;

					e = e.target;

					// Don't do this action for non image elements
					if (e.nodeName !== 'IMG')
						return;

					if (re)
						Event.remove(re.node, re.ev, re.cb);

					if (!t.dom.hasClass(e, 'mceItemNoResize')) {
						ev = 'resizeend';
						cb = Event.add(e, ev, function(e) {
							var v;

							e = e.target;

							if (v = t.dom.getStyle(e, 'width')) {
								t.dom.setAttrib(e, 'width', v.replace(/[^0-9%]+/g, ''));
								t.dom.setStyle(e, 'width', '');
							}

							if (v = t.dom.getStyle(e, 'height')) {
								t.dom.setAttrib(e, 'height', v.replace(/[^0-9%]+/g, ''));
								t.dom.setStyle(e, 'height', '');
							}
						});
					} else {
						ev = 'resizestart';
						cb = Event.add(e, 'resizestart', Event.cancel, Event);
					}

					re = t.resizeInfo = {
						node : e,
						ev : ev,
						cb : cb
					};
				});

				t.onKeyDown.add(function(ed, e) {
					switch (e.keyCode) {
						case 8:
							// Fix IE control + backspace browser bug
							if (t.selection.getRng().item) {
								t.selection.getRng().item(0).removeNode();
								return Event.cancel(e);
							}
					}
				});

				/*if (t.dom.boxModel) {
					t.getBody().style.height = '100%';

					Event.add(t.getWin(), 'resize', function(e) {
						var docElm = t.getDoc().documentElement;

						docElm.style.height = (docElm.offsetHeight - 10) + 'px';
					});
				}*/
			}

			if (tinymce.isOpera) {
				t.onClick.add(function(ed, e) {
					Event.prevent(e);
				});
			}

			// Add custom undo/redo handlers
			if (s.custom_undo_redo) {
				function addUndo() {
					t.undoManager.typing = 0;
					t.undoManager.add();
				};

				// Add undo level on editor blur
				if (tinymce.isIE) {
					Event.add(t.getWin(), 'blur', function(e) {
						var n;

						// Check added for fullscreen bug
						if (t.selection) {
							n = t.selection.getNode();

							// Add undo level is selection was lost to another document
							if (!t.removed && n.ownerDocument && n.ownerDocument != t.getDoc())
								addUndo();
						}
					});
				} else {
					Event.add(t.getDoc(), 'blur', function() {
						if (t.selection && !t.removed)
							addUndo();
					});
				}

				t.onMouseDown.add(addUndo);

				t.onKeyUp.add(function(ed, e) {
					if ((e.keyCode >= 33 && e.keyCode <= 36) || (e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 13 || e.keyCode == 45 || e.ctrlKey) {
						t.undoManager.typing = 0;
						t.undoManager.add();
					}
				});

				t.onKeyDown.add(function(ed, e) {
					// Is caracter positon keys
					if ((e.keyCode >= 33 && e.keyCode <= 36) || (e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 13 || e.keyCode == 45) {
						if (t.undoManager.typing) {
							t.undoManager.add();
							t.undoManager.typing = 0;
						}

						return;
					}

					if (!t.undoManager.typing) {
						t.undoManager.add();
						t.undoManager.typing = 1;
					}
				});
			}
		},

		_convertInlineElements : function() {
			var t = this, s = t.settings, dom = t.dom, v, e, na, st, sp;

			function convert(ed, o) {
				if (!s.inline_styles)
					return;

				if (o.get) {
					each(t.dom.select('table,u,strike', o.node), function(n) {
						switch (n.nodeName) {
							case 'TABLE':
								if (v = dom.getAttrib(n, 'height')) {
									dom.setStyle(n, 'height', v);
									dom.setAttrib(n, 'height', '');
								}
								break;

							case 'U':
							case 'STRIKE':
								//sp = dom.create('span', {style : dom.getAttrib(n, 'style')});
								n.style.textDecoration = n.nodeName == 'U' ? 'underline' : 'line-through';
								dom.setAttrib(n, 'mce_style', '');
								dom.setAttrib(n, 'mce_name', 'span');
								break;
						}
					});
				} else if (o.set) {
					each(t.dom.select('table,span', o.node).reverse(), function(n) {
						if (n.nodeName == 'TABLE') {
							if (v = dom.getStyle(n, 'height'))
								dom.setAttrib(n, 'height', v.replace(/[^0-9%]+/g, ''));
						} else {
							// Convert spans to elements
							if (n.style.textDecoration == 'underline')
								na = 'u';
							else if (n.style.textDecoration == 'line-through')
								na = 'strike';
							else
								na = '';

							if (na) {
								n.style.textDecoration = '';
								dom.setAttrib(n, 'mce_style', '');

								e = dom.create(na, {
									style : dom.getAttrib(n, 'style')
								});

								dom.replace(e, n, 1);
							}
						}
					});
				}
			};

			t.onPreProcess.add(convert);

			if (!s.cleanup_on_startup) {
				t.onSetContent.add(function(ed, o) {
					if (o.initial)
						convert(t, {node : t.getBody(), set : 1});
				});
			}
		},

		_convertFonts : function() {
			var t = this, s = t.settings, dom = t.dom, fz, fzn, sl, cl;

			// No need
			if (!s.inline_styles)
				return;

			// Font pt values and font size names
			fz = [8, 10, 12, 14, 18, 24, 36];
			fzn = ['xx-small', 'x-small','small','medium','large','x-large', 'xx-large'];

			if (sl = s.font_size_style_values)
				sl = explode(sl);

			if (cl = s.font_size_classes)
				cl = explode(cl);

			function process(no) {
				var n, sp, nl, x;

				// Keep unit tests happy
				if (!s.inline_styles)
					return;

				nl = t.dom.select('font', no);
				for (x = nl.length - 1; x >= 0; x--) {
					n = nl[x];

					sp = dom.create('span', {
						style : dom.getAttrib(n, 'style'),
						'class' : dom.getAttrib(n, 'class')
					});

					dom.setStyles(sp, {
						fontFamily : dom.getAttrib(n, 'face'),
						color : dom.getAttrib(n, 'color'),
						backgroundColor : n.style.backgroundColor
					});

					if (n.size) {
						if (sl)
							dom.setStyle(sp, 'fontSize', sl[parseInt(n.size) - 1]);
						else
							dom.setAttrib(sp, 'class', cl[parseInt(n.size) - 1]);
					}

					dom.setAttrib(sp, 'mce_style', '');
					dom.replace(sp, n, 1);
				}
			};

			// Run on cleanup
			t.onPreProcess.add(function(ed, o) {
				if (o.get)
					process(o.node);
			});

			t.onSetContent.add(function(ed, o) {
				if (o.initial)
					process(o.node);
			});
		},

		_isHidden : function() {
			var s;

			if (!isGecko)
				return 0;

			// Weird, wheres that cursor selection?
			s = this.selection.getSel();
			return (!s || !s.rangeCount || s.rangeCount == 0);
		},

		// Fix for bug #1867292
		_fixNesting : function(s) {
			var d = [], i;

			s = s.replace(/<(\/)?([^\s>]+)[^>]*?>/g, function(a, b, c) {
				var e;

				// Handle end element
				if (b === '/') {
					if (!d.length)
						return '';

					if (c !== d[d.length - 1].tag) {
						for (i=d.length - 1; i>=0; i--) {
							if (d[i].tag === c) {
								d[i].close = 1;
								break;
							}
						}

						return '';
					} else {
						d.pop();

						if (d.length && d[d.length - 1].close) {
							a = a + '</' + d[d.length - 1].tag + '>';
							d.pop();
						}
					}
				} else {
					// Ignore these
					if (/^(br|hr|input|meta|img|link|param)$/i.test(c))
						return a;

					// Ignore closed ones
					if (/\/>$/.test(a))
						return a;

					d.push({tag : c}); // Push start element
				}

				return a;
			});

			// End all open tags
			for (i=d.length - 1; i>=0; i--)
				s += '</' + d[i].tag + '>';

			return s;
		}

		});
})(tinymce);
(function(tinymce) {
	var each = tinymce.each, isIE = tinymce.isIE, isGecko = tinymce.isGecko, isOpera = tinymce.isOpera, isWebKit = tinymce.isWebKit;

	tinymce.create('tinymce.EditorCommands', {
		EditorCommands : function(ed) {
			this.editor = ed;
		},

		execCommand : function(cmd, ui, val) {
			var t = this, ed = t.editor, f;

			switch (cmd) {
				// Ignore these
				case 'mceResetDesignMode':
				case 'mceBeginUndoLevel':
					return true;

				// Ignore these
				case 'unlink':
					t.UnLink();
					return true;

				// Bundle these together
				case 'JustifyLeft':
				case 'JustifyCenter':
				case 'JustifyRight':
				case 'JustifyFull':
					t.mceJustify(cmd, cmd.substring(7).toLowerCase());
					return true;

				default:
					f = this[cmd];

					if (f) {
						f.call(this, ui, val);
						return true;
					}
			}

			return false;
		},

		Indent : function() {
			var ed = this.editor, d = ed.dom, s = ed.selection, e, iv, iu;

			// Setup indent level
			iv = ed.settings.indentation;
			iu = /[a-z%]+$/i.exec(iv);
			iv = parseInt(iv);

			if (ed.settings.inline_styles && (!this.queryStateInsertUnorderedList() && !this.queryStateInsertOrderedList())) {
				each(s.getSelectedBlocks(), function(e) {
					d.setStyle(e, 'paddingLeft', (parseInt(e.style.paddingLeft || 0) + iv) + iu);
				});

				return;
			}

			ed.getDoc().execCommand('Indent', false, null);

			if (isIE) {
				d.getParent(s.getNode(), function(n) {
					if (n.nodeName == 'BLOCKQUOTE') {
						n.dir = n.style.cssText = '';
					}
				});
			}
		},

		Outdent : function() {
			var ed = this.editor, d = ed.dom, s = ed.selection, e, v, iv, iu;

			// Setup indent level
			iv = ed.settings.indentation;
			iu = /[a-z%]+$/i.exec(iv);
			iv = parseInt(iv);

			if (ed.settings.inline_styles && (!this.queryStateInsertUnorderedList() && !this.queryStateInsertOrderedList())) {
				each(s.getSelectedBlocks(), function(e) {
					v = Math.max(0, parseInt(e.style.paddingLeft || 0) - iv);
					d.setStyle(e, 'paddingLeft', v ? v + iu : '');
				});

				return;
			}

			ed.getDoc().execCommand('Outdent', false, null);
		},

/*
		mceSetAttribute : function(u, v) {
			var ed = this.editor, d = ed.dom, e;

			if (e = d.getParent(ed.selection.getNode(), d.isBlock))
				d.setAttrib(e, v.name, v.value);
		},
*/
		mceSetContent : function(u, v) {
			this.editor.setContent(v);
		},

		mceToggleVisualAid : function() {
			var ed = this.editor;

			ed.hasVisual = !ed.hasVisual;
			ed.addVisual();
		},

		mceReplaceContent : function(u, v) {
			var s = this.editor.selection;

			s.setContent(v.replace(/\{\$selection\}/g, s.getContent({format : 'text'})));
		},

		mceInsertLink : function(u, v) {
			var ed = this.editor, s = ed.selection, e = ed.dom.getParent(s.getNode(), 'a');

			if (tinymce.is(v, 'string'))
				v = {href : v};

			function set(e) {
				each(v, function(v, k) {
					ed.dom.setAttrib(e, k, v);
				});
			};

			if (!e) {
				ed.execCommand('CreateLink', false, 'javascript:mctmp(0);');
				each(ed.dom.select('a[href=javascript:mctmp(0);]'), function(e) {
					set(e);
				});
			} else {
				if (v.href)
					set(e);
				else
					ed.dom.remove(e, 1);
			}
		},

		UnLink : function() {
			var ed = this.editor, s = ed.selection;

			if (s.isCollapsed())
				s.select(s.getNode());

			ed.getDoc().execCommand('unlink', false, null);
			s.collapse(0);
		},

		FontName : function(u, v) {
			var t = this, ed = t.editor, s = ed.selection, e;

			if (!v) {
				if (s.isCollapsed())
					s.select(s.getNode());
			} else {
				if (ed.settings.convert_fonts_to_spans)
					t._applyInlineStyle('span', {style : {fontFamily : v}});
				else
					ed.getDoc().execCommand('FontName', false, v);
			}
		},

		FontSize : function(u, v) {
			var ed = this.editor, s = ed.settings, fc, fs;

			// Use style options instead
			if (s.convert_fonts_to_spans && v >= 1 && v <= 7) {
				fs = tinymce.explode(s.font_size_style_values);
				fc = tinymce.explode(s.font_size_classes);

				if (fc)
					v = fc[v - 1] || v;
				else
					v = fs[v - 1] || v;
			}

			if (v >= 1 && v <= 7)
				ed.getDoc().execCommand('FontSize', false, v);
			else
				this._applyInlineStyle('span', {style : {fontSize : v}});
		},

		queryCommandValue : function(c) {
			var f = this['queryValue' + c];

			if (f)
				return f.call(this, c);

			return false;
		},

		queryCommandState : function(cmd) {
			var f;

			switch (cmd) {
				// Bundle these together
				case 'JustifyLeft':
				case 'JustifyCenter':
				case 'JustifyRight':
				case 'JustifyFull':
					return this.queryStateJustify(cmd, cmd.substring(7).toLowerCase());

				default:
					if (f = this['queryState' + cmd])
						return f.call(this, cmd);
			}

			return -1;
		},

		_queryState : function(c) {
			try {
				return this.editor.getDoc().queryCommandState(c);
			} catch (ex) {
				// Ignore exception
			}
		},

		_queryVal : function(c) {
			try {
				return this.editor.getDoc().queryCommandValue(c);
			} catch (ex) {
				// Ignore exception
			}
		},

		queryValueFontSize : function() {
			var ed = this.editor, v = 0, p;

			if (p = ed.dom.getParent(ed.selection.getNode(), 'span'))
				v = p.style.fontSize;

			if (!v && (isOpera || isWebKit)) {
				if (p = ed.dom.getParent(ed.selection.getNode(), 'font'))
					v = p.size;

				return v;
			}

			return v || this._queryVal('FontSize');
		},

		queryValueFontName : function() {
			var ed = this.editor, v = 0, p;

			if (p = ed.dom.getParent(ed.selection.getNode(), 'font'))
				v = p.face;

			if (p = ed.dom.getParent(ed.selection.getNode(), 'span'))
				v = p.style.fontFamily.replace(/, /g, ',').replace(/[\'\"]/g, '').toLowerCase();

			if (!v)
				v = this._queryVal('FontName');

			return v;
		},

		mceJustify : function(c, v) {
			var ed = this.editor, se = ed.selection, n = se.getNode(), nn = n.nodeName, bl, nb, dom = ed.dom, rm;

			if (ed.settings.inline_styles && this.queryStateJustify(c, v))
				rm = 1;

			bl = dom.getParent(n, ed.dom.isBlock);

			if (nn == 'IMG') {
				if (v == 'full')
					return;

				if (rm) {
					if (v == 'center')
						dom.setStyle(bl || n.parentNode, 'textAlign', '');

					dom.setStyle(n, 'float', '');
					this.mceRepaint();
					return;
				}

				if (v == 'center') {
					// Do not change table elements
					if (bl && /^(TD|TH)$/.test(bl.nodeName))
						bl = 0;

					if (!bl || bl.childNodes.length > 1) {
						nb = dom.create('p');
						nb.appendChild(n.cloneNode(false));

						if (bl)
							dom.insertAfter(nb, bl);
						else
							dom.insertAfter(nb, n);

						dom.remove(n);
						n = nb.firstChild;
						bl = nb;
					}

					dom.setStyle(bl, 'textAlign', v);
					dom.setStyle(n, 'float', '');
				} else {
					dom.setStyle(n, 'float', v);
					dom.setStyle(bl || n.parentNode, 'textAlign', '');
				}

				this.mceRepaint();
				return;
			}

			// Handle the alignment outselfs, less quirks in all browsers
			if (ed.settings.inline_styles && ed.settings.forced_root_block) {
				if (rm)
					v = '';

				each(se.getSelectedBlocks(dom.getParent(se.getStart(), dom.isBlock), dom.getParent(se.getEnd(), dom.isBlock)), function(e) {
					dom.setAttrib(e, 'align', '');
					dom.setStyle(e, 'textAlign', v == 'full' ? 'justify' : v);
				});

				return;
			} else if (!rm)
				ed.getDoc().execCommand(c, false, null);

			if (ed.settings.inline_styles) {
				if (rm) {
					dom.getParent(ed.selection.getNode(), function(n) {
						if (n.style && n.style.textAlign)
							dom.setStyle(n, 'textAlign', '');
					});

					return;
				}

				each(dom.select('*'), function(n) {
					var v = n.align;

					if (v) {
						if (v == 'full')
							v = 'justify';

						dom.setStyle(n, 'textAlign', v);
						dom.setAttrib(n, 'align', '');
					}
				});
			}
		},

		mceSetCSSClass : function(u, v) {
			this.mceSetStyleInfo(0, {command : 'setattrib', name : 'class', value : v});
		},

		getSelectedElement : function() {
			var t = this, ed = t.editor, dom = ed.dom, se = ed.selection, r = se.getRng(), r1, r2, sc, ec, so, eo, e, sp, ep, re;

			if (se.isCollapsed() || r.item)
				return se.getNode();

			// Setup regexp
			re = ed.settings.merge_styles_invalid_parents;
			if (tinymce.is(re, 'string'))
				re = new RegExp(re, 'i');

			if (isIE) {
				r1 = r.duplicate();
				r1.collapse(true);
				sc = r1.parentElement();

				r2 = r.duplicate();
				r2.collapse(false);
				ec = r2.parentElement();

				if (sc != ec) {
					r1.move('character', 1);
					sc = r1.parentElement();
				}

				if (sc == ec) {
					r1 = r.duplicate();
					r1.moveToElementText(sc);

					if (r1.compareEndPoints('StartToStart', r) == 0 && r1.compareEndPoints('EndToEnd', r) == 0)
						return re && re.test(sc.nodeName) ? null : sc;
				}
			} else {
				function getParent(n) {
					return dom.getParent(n, '*');
				};

				sc = r.startContainer;
				ec = r.endContainer;
				so = r.startOffset;
				eo = r.endOffset;

				if (!r.collapsed) {
					if (sc == ec) {
						if (so - eo < 2) {
							if (sc.hasChildNodes()) {
								sp = sc.childNodes[so];
								return re && re.test(sp.nodeName) ? null : sp;
							}
						}
					}
				}

				if (sc.nodeType != 3 || ec.nodeType != 3)
					return null;

				if (so == 0) {
					sp = getParent(sc);

					if (sp && sp.firstChild != sc)
						sp = null;
				}

				if (so == sc.nodeValue.length) {
					e = sc.nextSibling;

					if (e && e.nodeType == 1)
						sp = sc.nextSibling;
				}

				if (eo == 0) {
					e = ec.previousSibling;

					if (e && e.nodeType == 1)
						ep = e;
				}

				if (eo == ec.nodeValue.length) {
					ep = getParent(ec);

					if (ep && ep.lastChild != ec)
						ep = null;
				}

				// Same element
				if (sp == ep)
					return re && sp && re.test(sp.nodeName) ? null : sp;
			}

			return null;
		},

		mceSetStyleInfo : function(u, v) {
			var t = this, ed = t.editor, d = ed.getDoc(), dom = ed.dom, e, b, s = ed.selection, nn = v.wrapper || 'span', b = s.getBookmark(), re;

			function set(n, e) {
				if (n.nodeType == 1) {
					switch (v.command) {
						case 'setattrib':
							return dom.setAttrib(n, v.name, v.value);

						case 'setstyle':
							return dom.setStyle(n, v.name, v.value);

						case 'removeformat':
							return dom.setAttrib(n, 'class', '');
					}
				}
			};

			// Setup regexp
			re = ed.settings.merge_styles_invalid_parents;
			if (tinymce.is(re, 'string'))
				re = new RegExp(re, 'i');

			// Set style info on selected element
			if ((e = t.getSelectedElement()) && !ed.settings.force_span_wrappers)
				set(e, 1);
			else {
				// Generate wrappers and set styles on them
				d.execCommand('FontName', false, '__');
				each(dom.select('span,font'), function(n) {
					var sp, e;

					if (dom.getAttrib(n, 'face') == '__' || n.style.fontFamily === '__') {
						sp = dom.create(nn, {mce_new : '1'});

						set(sp);

						each (n.childNodes, function(n) {
							sp.appendChild(n.cloneNode(true));
						});

						dom.replace(sp, n);
					}
				});
			}

			// Remove wrappers inside new ones
			each(dom.select(nn).reverse(), function(n) {
				var p = n.parentNode;

				// Check if it's an old span in a new wrapper
				if (!dom.getAttrib(n, 'mce_new')) {
					// Find new wrapper
					p = dom.getParent(n, '*[mce_new]');

					if (p)
						dom.remove(n, 1);
				}
			});

			// Merge wrappers with parent wrappers
			each(dom.select(nn).reverse(), function(n) {
				var p = n.parentNode;

				if (!p || !dom.getAttrib(n, 'mce_new'))
					return;

				if (ed.settings.force_span_wrappers && p.nodeName != 'SPAN')
					return;

				// Has parent of the same type and only child
				if (p.nodeName == nn.toUpperCase() && p.childNodes.length == 1)
					return dom.remove(p, 1);

				// Has parent that is more suitable to have the class and only child
				if (n.nodeType == 1 && (!re || !re.test(p.nodeName)) && p.childNodes.length == 1) {
					set(p); // Set style info on parent instead
					dom.setAttrib(n, 'class', '');
				}
			});

			// Remove empty wrappers
			each(dom.select(nn).reverse(), function(n) {
				if (dom.getAttrib(n, 'mce_new') || (dom.getAttribs(n).length <= 1 && n.className === '')) {
					if (!dom.getAttrib(n, 'class') && !dom.getAttrib(n, 'style'))
						return dom.remove(n, 1);

					dom.setAttrib(n, 'mce_new', ''); // Remove mce_new marker
				}
			});

			s.moveToBookmark(b);
		},

		queryStateJustify : function(c, v) {
			var ed = this.editor, n = ed.selection.getNode(), dom = ed.dom;

			if (n && n.nodeName == 'IMG') {
				if (dom.getStyle(n, 'float') == v)
					return 1;

				return n.parentNode.style.textAlign == v;
			}

			n = dom.getParent(ed.selection.getStart(), function(n) {
				return n.nodeType == 1 && n.style.textAlign;
			});

			if (v == 'full')
				v = 'justify';

			if (ed.settings.inline_styles)
				return (n && n.style.textAlign == v);

			return this._queryState(c);
		},

		ForeColor : function(ui, v) {
			var ed = this.editor;

			if (ed.settings.convert_fonts_to_spans) {
				this._applyInlineStyle('span', {style : {color : v}});
				return;
			} else
				ed.getDoc().execCommand('ForeColor', false, v);
		},

		HiliteColor : function(ui, val) {
			var t = this, ed = t.editor, d = ed.getDoc();

			if (ed.settings.convert_fonts_to_spans) {
				this._applyInlineStyle('span', {style : {backgroundColor : val}});
				return;
			}

			function set(s) {
				if (!isGecko)
					return;

				try {
					// Try new Gecko method
					d.execCommand("styleWithCSS", 0, s);
				} catch (ex) {
					// Use old
					d.execCommand("useCSS", 0, !s);
				}
			};

			if (isGecko || isOpera) {
				set(true);
				d.execCommand('hilitecolor', false, val);
				set(false);
			} else
				d.execCommand('BackColor', false, val);
		},

		FormatBlock : function(ui, val) {
			var t = this, ed = t.editor, s = ed.selection, dom = ed.dom, bl, nb, b;

			function isBlock(n) {
				return /^(P|DIV|H[1-6]|ADDRESS|BLOCKQUOTE|PRE)$/.test(n.nodeName);
			};

			bl = dom.getParent(s.getNode(), function(n) {
				return isBlock(n);
			});

			// IE has an issue where it removes the parent div if you change format on the paragrah in <div><p>Content</p></div>
			// FF and Opera doesn't change parent DIV elements if you switch format
			if (bl) {
				if ((isIE && isBlock(bl.parentNode)) || bl.nodeName == 'DIV') {
					// Rename block element
					nb = ed.dom.create(val);

					each(dom.getAttribs(bl), function(v) {
						dom.setAttrib(nb, v.nodeName, dom.getAttrib(bl, v.nodeName));
					});

					b = s.getBookmark();
					dom.replace(nb, bl, 1);
					s.moveToBookmark(b);
					ed.nodeChanged();
					return;
				}
			}

			val = ed.settings.forced_root_block ? (val || '<p>') : val;

			if (val.indexOf('<') == -1)
				val = '<' + val + '>';

			if (tinymce.isGecko)
				val = val.replace(/<(div|blockquote|code|dt|dd|dl|samp)>/gi, '$1');

			ed.getDoc().execCommand('FormatBlock', false, val);
		},

		mceCleanup : function() {
			var ed = this.editor, s = ed.selection, b = s.getBookmark();
			ed.setContent(ed.getContent());
			s.moveToBookmark(b);
		},

		mceRemoveNode : function(ui, val) {
			var ed = this.editor, s = ed.selection, b, n = val || s.getNode();

			// Make sure that the body node isn't removed
			if (n == ed.getBody())
				return;

			b = s.getBookmark();
			ed.dom.remove(n, 1);
			s.moveToBookmark(b);
			ed.nodeChanged();
		},

		mceSelectNodeDepth : function(ui, val) {
			var ed = this.editor, s = ed.selection, c = 0;

			ed.dom.getParent(s.getNode(), function(n) {
				if (n.nodeType == 1 && c++ == val) {
					s.select(n);
					ed.nodeChanged();
					return false;
				}
			}, ed.getBody());
		},

		mceSelectNode : function(u, v) {
			this.editor.selection.select(v);
		},

		mceInsertContent : function(ui, val) {
			this.editor.selection.setContent(val);
		},

		mceInsertRawHTML : function(ui, val) {
			var ed = this.editor;

			ed.selection.setContent('tiny_mce_marker');
			ed.setContent(ed.getContent().replace(/tiny_mce_marker/g, val));
		},

		mceRepaint : function() {
			var s, b, e = this.editor;

			if (tinymce.isGecko) {
				try {
					s = e.selection;
					b = s.getBookmark(true);

					if (s.getSel())
						s.getSel().selectAllChildren(e.getBody());

					s.collapse(true);
					s.moveToBookmark(b);
				} catch (ex) {
					// Ignore
				}
			}
		},

		queryStateUnderline : function() {
			var ed = this.editor, n = ed.selection.getNode();

			if (n && n.nodeName == 'A')
				return false;

			return this._queryState('Underline');
		},

		queryStateOutdent : function() {
			var ed = this.editor, n;

			if (ed.settings.inline_styles) {
				if ((n = ed.dom.getParent(ed.selection.getStart(), ed.dom.isBlock)) && parseInt(n.style.paddingLeft) > 0)
					return true;

				if ((n = ed.dom.getParent(ed.selection.getEnd(), ed.dom.isBlock)) && parseInt(n.style.paddingLeft) > 0)
					return true;
			}

			return this.queryStateInsertUnorderedList() || this.queryStateInsertOrderedList() || (!ed.settings.inline_styles && !!ed.dom.getParent(ed.selection.getNode(), 'BLOCKQUOTE'));
		},

		queryStateInsertUnorderedList : function() {
			return this.editor.dom.getParent(this.editor.selection.getNode(), 'UL');
		},

		queryStateInsertOrderedList : function() {
			return this.editor.dom.getParent(this.editor.selection.getNode(), 'OL');
		},

		queryStatemceBlockQuote : function() {
			return !!this.editor.dom.getParent(this.editor.selection.getStart(), function(n) {return n.nodeName === 'BLOCKQUOTE';});
		},

		_applyInlineStyle : function(na, at, op) {
			var t = this, ed = t.editor, dom = ed.dom, bm, lo = {}, kh, found;

			na = na.toUpperCase();

			if (op && op.check_classes && at['class'])
				op.check_classes.push(at['class']);

			function removeEmpty() {
				each(dom.select(na).reverse(), function(n) {
					var c = 0;

					// Check if there is any attributes
					each(dom.getAttribs(n), function(an) {
						if (an.nodeName.substring(0, 1) != '_' && dom.getAttrib(n, an.nodeName) != '') {
							//console.log(dom.getOuterHTML(n), dom.getAttrib(n, an.nodeName));
							c++;
						}
					});

					// No attributes then remove the element and keep the children
					if (c == 0)
						dom.remove(n, 1);
				});
			};

			function replaceFonts() {
				var bm;

				each(dom.select('span,font'), function(n) {
					if (n.style.fontFamily == 'mceinline' || n.face == 'mceinline') {
						if (!bm)
							bm = ed.selection.getBookmark();

						at._mce_new = '1';
						dom.replace(dom.create(na, at), n, 1);
					}
				});

				// Remove redundant elements
				each(dom.select(na + '[_mce_new]'), function(n) {
					function removeStyle(n) {
						if (n.nodeType == 1) {
							each(at.style, function(v, k) {
								dom.setStyle(n, k, '');
							});

							// Remove spans with the same class or marked classes
							if (at['class'] && n.className && op) {
								each(op.check_classes, function(c) {
									if (dom.hasClass(n, c))
										dom.removeClass(n, c);
								});
							}
						}
					};

					// Remove specified style information from child elements
					each(dom.select(na, n), removeStyle);

					// Remove the specified style information on parent if current node is only child (IE)
					if (n.parentNode && n.parentNode.nodeType == 1 && n.parentNode.childNodes.length == 1)
						removeStyle(n.parentNode);

					// Remove the child elements style info if a parent already has it
					dom.getParent(n.parentNode, function(pn) {
						if (pn.nodeType == 1) {
							if (at.style) {
								each(at.style, function(v, k) {
									var sv;

									if (!lo[k] && (sv = dom.getStyle(pn, k))) {
										if (sv === v)
											dom.setStyle(n, k, '');

										lo[k] = 1;
									}
								});
							}

							// Remove spans with the same class or marked classes
							if (at['class'] && pn.className && op) {
								each(op.check_classes, function(c) {
									if (dom.hasClass(pn, c))
										dom.removeClass(n, c);
								});
							}
						}

						return false;
					});

					n.removeAttribute('_mce_new');
				});

				removeEmpty();
				ed.selection.moveToBookmark(bm);

				return !!bm;
			};

			// Create inline elements
			ed.focus();
			ed.getDoc().execCommand('FontName', false, 'mceinline');
			replaceFonts();

			if (kh = t._applyInlineStyle.keyhandler) {
				ed.onKeyUp.remove(kh);
				ed.onKeyPress.remove(kh);
				ed.onKeyDown.remove(kh);
				ed.onSetContent.remove(t._applyInlineStyle.chandler);
			}

			if (ed.selection.isCollapsed()) {
				// IE will format the current word so this code can't be executed on that browser
				if (!isIE) {
					each(dom.getParents(ed.selection.getNode(), 'span'), function(n) {
						each(at.style, function(v, k) {
							var kv;

							if (kv = dom.getStyle(n, k)) {
								if (kv == v) {
									dom.setStyle(n, k, '');
									found = 2;
									return false;
								}

								found = 1;
								return false;
							}
						});

						if (found)
							return false;
					});

					if (found == 2) {
						bm = ed.selection.getBookmark();

						removeEmpty();

						ed.selection.moveToBookmark(bm);

						// Node change needs to be detached since the onselect event
						// for the select box will run the onclick handler after onselect call. Todo: Add a nicer fix!
						window.setTimeout(function() {
							ed.nodeChanged();
						}, 1);

						return;
					}
				}

				// Start collecting styles
				t._pendingStyles = tinymce.extend(t._pendingStyles || {}, at.style);

				t._applyInlineStyle.chandler = ed.onSetContent.add(function() {
					delete t._pendingStyles;
				});

				t._applyInlineStyle.keyhandler = kh = function(e) {
					// Use pending styles
					if (t._pendingStyles) {
						at.style = t._pendingStyles;
						delete t._pendingStyles;
					}

					if (replaceFonts()) {
						ed.onKeyDown.remove(t._applyInlineStyle.keyhandler);
						ed.onKeyPress.remove(t._applyInlineStyle.keyhandler);
					}

					if (e.type == 'keyup')
						ed.onKeyUp.remove(t._applyInlineStyle.keyhandler);
				};

				ed.onKeyDown.add(kh);
				ed.onKeyPress.add(kh);
				ed.onKeyUp.add(kh);
			} else
				t._pendingStyles = 0;
		}
	});
})(tinymce);(function(tinymce) {
	tinymce.create('tinymce.UndoManager', {
		index : 0,
		data : null,
		typing : 0,

		UndoManager : function(ed) {
			var t = this, Dispatcher = tinymce.util.Dispatcher;

			t.editor = ed;
			t.data = [];
			t.onAdd = new Dispatcher(this);
			t.onUndo = new Dispatcher(this);
			t.onRedo = new Dispatcher(this);
		},

		add : function(l) {
			var t = this, i, ed = t.editor, b, s = ed.settings, la;

			l = l || {};
			l.content = l.content || ed.getContent({format : 'raw', no_events : 1});

			// Add undo level if needed
			l.content = l.content.replace(/^\s*|\s*$/g, '');
			la = t.data[t.index > 0 && (t.index == 0 || t.index == t.data.length) ? t.index - 1 : t.index];
			if (!l.initial && la && l.content == la.content)
				return null;

			// Time to compress
			if (s.custom_undo_redo_levels) {
				if (t.data.length > s.custom_undo_redo_levels) {
					for (i = 0; i < t.data.length - 1; i++)
						t.data[i] = t.data[i + 1];

					t.data.length--;
					t.index = t.data.length;
				}
			}

			if (s.custom_undo_redo_restore_selection && !l.initial)
				l.bookmark = b = l.bookmark || ed.selection.getBookmark();

			if (t.index < t.data.length)
				t.index++;

			// Only initial marked undo levels should be allowed as first item
			// This to workaround a bug with Firefox and the blur event
			if (t.data.length === 0 && !l.initial)
				return null;

			// Add level
			t.data.length = t.index + 1;
			t.data[t.index++] = l;

			if (l.initial)
				t.index = 0;

			// Set initial bookmark use first real undo level
			if (t.data.length == 2 && t.data[0].initial)
				t.data[0].bookmark = b;

			t.onAdd.dispatch(t, l);
			ed.isNotDirty = 0;

			//console.dir(t.data);

			return l;
		},

		undo : function() {
			var t = this, ed = t.editor, l = l, i;

			if (t.typing) {
				t.add();
				t.typing = 0;
			}

			if (t.index > 0) {
				// If undo on last index then take snapshot
				if (t.index == t.data.length && t.index > 1) {
					i = t.index;
					t.typing = 0;

					if (!t.add())
						t.index = i;

					--t.index;
				}

				l = t.data[--t.index];
				ed.setContent(l.content, {format : 'raw'});
				ed.selection.moveToBookmark(l.bookmark);

				t.onUndo.dispatch(t, l);
			}

			return l;
		},

		redo : function() {
			var t = this, ed = t.editor, l = null;

			if (t.index < t.data.length - 1) {
				l = t.data[++t.index];
				ed.setContent(l.content, {format : 'raw'});
				ed.selection.moveToBookmark(l.bookmark);

				t.onRedo.dispatch(t, l);
			}

			return l;
		},

		clear : function() {
			var t = this;

			t.data = [];
			t.index = 0;
			t.typing = 0;
			t.add({initial : true});
		},

		hasUndo : function() {
			return this.index != 0 || this.typing;
		},

		hasRedo : function() {
			return this.index < this.data.length - 1;
		}

		});
})(tinymce);
(function(tinymce) {
	// Shorten names
	var Event, isIE, isGecko, isOpera, each, extend;

	Event = tinymce.dom.Event;
	isIE = tinymce.isIE;
	isGecko = tinymce.isGecko;
	isOpera = tinymce.isOpera;
	each = tinymce.each;
	extend = tinymce.extend;

	function isEmpty(n) {
		n = n.innerHTML;
		n = n.replace(/<\w+ .*?mce_\w+\"?=.*?>/gi, '-'); // Keep tags with mce_ attribs
		n = n.replace(/<(img|hr|table|input|select|textarea)[ \>]/gi, '-'); // Keep these convert them to - chars
		n = n.replace(/<[^>]+>/g, ''); // Remove all tags

		return n.replace(/[ \t\r\n]+/g, '') == '';
	};

	tinymce.create('tinymce.ForceBlocks', {
		ForceBlocks : function(ed) {
			var t = this, s = ed.settings, elm;

			t.editor = ed;
			t.dom = ed.dom;
			elm = (s.forced_root_block || 'p').toLowerCase();
			s.element = elm.toUpperCase();

			ed.onPreInit.add(t.setup, t);

			t.reOpera = new RegExp('(\\u00a0|&#160;|&nbsp;)<\/' + elm + '>', 'gi');
			t.rePadd = new RegExp('<p( )([^>]+)><\\\/p>|<p( )([^>]+)\\\/>|<p( )([^>]+)>\\s+<\\\/p>|<p><\\\/p>|<p\\\/>|<p>\\s+<\\\/p>'.replace(/p/g, elm), 'gi');
			t.reNbsp2BR1 = new RegExp('<p( )([^>]+)>[\\s\\u00a0]+<\\\/p>|<p>[\\s\\u00a0]+<\\\/p>'.replace(/p/g, elm), 'gi');
			t.reNbsp2BR2 = new RegExp('<%p()([^>]+)>(&nbsp;|&#160;)<\\\/%p>|<%p>(&nbsp;|&#160;)<\\\/%p>'.replace(/%p/g, elm), 'gi');
			t.reBR2Nbsp = new RegExp('<p( )([^>]+)>\\s*<br \\\/>\\s*<\\\/p>|<p>\\s*<br \\\/>\\s*<\\\/p>'.replace(/p/g, elm), 'gi');

			function padd(ed, o) {
				if (isOpera)
					o.content = o.content.replace(t.reOpera, '</' + elm + '>');

				o.content = o.content.replace(t.rePadd, '<' + elm + '$1$2$3$4$5$6>\u00a0</' + elm + '>');

				if (!isIE && !isOpera && o.set) {
					// Use &nbsp; instead of BR in padded paragraphs
					o.content = o.content.replace(t.reNbsp2BR1, '<' + elm + '$1$2><br /></' + elm + '>');
					o.content = o.content.replace(t.reNbsp2BR2, '<' + elm + '$1$2><br /></' + elm + '>');
				} else
					o.content = o.content.replace(t.reBR2Nbsp, '<' + elm + '$1$2>\u00a0</' + elm + '>');
			};

			ed.onBeforeSetContent.add(padd);
			ed.onPostProcess.add(padd);

			if (s.forced_root_block) {
				ed.onInit.add(t.forceRoots, t);
				ed.onSetContent.add(t.forceRoots, t);
				ed.onBeforeGetContent.add(t.forceRoots, t);
			}
		},

		setup : function() {
			var t = this, ed = t.editor, s = ed.settings;

			// Force root blocks when typing and when getting output
			if (s.forced_root_block) {
				ed.onKeyUp.add(t.forceRoots, t);
				ed.onPreProcess.add(t.forceRoots, t);
			}

			if (s.force_br_newlines) {
				// Force IE to produce BRs on enter
				if (isIE) {
					ed.onKeyPress.add(function(ed, e) {
						var n, s = ed.selection;

						if (e.keyCode == 13 && s.getNode().nodeName != 'LI') {
							s.setContent('<br id="__" /> ', {format : 'raw'});
							n = ed.dom.get('__');
							n.removeAttribute('id');
							s.select(n);
							s.collapse();
							return Event.cancel(e);
						}
					});
				}

				return;
			}

			if (!isIE && s.force_p_newlines) {
/*				ed.onPreProcess.add(function(ed, o) {
					each(ed.dom.select('br', o.node), function(n) {
						var p = n.parentNode;

						// Replace <p><br /></p> with <p>&nbsp;</p>
						if (p && p.nodeName == 'p' && (p.childNodes.length == 1 || p.lastChild == n)) {
							p.replaceChild(ed.getDoc().createTextNode('\u00a0'), n);
						}
					});
				});*/

				ed.onKeyPress.add(function(ed, e) {
					if (e.keyCode == 13 && !e.shiftKey) {
						if (!t.insertPara(e))
							Event.cancel(e);
					}
				});

				if (isGecko) {
					ed.onKeyDown.add(function(ed, e) {
						if ((e.keyCode == 8 || e.keyCode == 46) && !e.shiftKey)
							t.backspaceDelete(e, e.keyCode == 8);
					});
				}
			}

			function ren(rn, na) {
				var ne = ed.dom.create(na);

				each(rn.attributes, function(a) {
					if (a.specified && a.nodeValue)
						ne.setAttribute(a.nodeName.toLowerCase(), a.nodeValue);
				});

				each(rn.childNodes, function(n) {
					ne.appendChild(n.cloneNode(true));
				});

				rn.parentNode.replaceChild(ne, rn);

				return ne;
			};

			// IE specific fixes
			if (isIE) {
				// Remove empty inline elements within block elements
				// For example: <p><strong><em></em></strong></p>
				ed.onPreProcess.add(function(ed, o) {
					each(ed.dom.select('p,h1,h2,h3,h4,h5,h6,div', o.node), function(p) {
						if (isEmpty(p))
							p.innerHTML = '';
					});
				});

				// Replaces IE:s auto generated paragraphs with the specified element name
				if (s.element != 'P') {
					ed.onKeyPress.add(function(ed, e) {
						t.lastElm = ed.selection.getNode().nodeName;
					});

					ed.onKeyUp.add(function(ed, e) {
						var bl, sel = ed.selection, n = sel.getNode(), b = ed.getBody();

						if (b.childNodes.length === 1 && n.nodeName == 'P') {
							n = ren(n, s.element);
							sel.select(n);
							sel.collapse();
							ed.nodeChanged();
						} else if (e.keyCode == 13 && !e.shiftKey && t.lastElm != 'P') {
							bl = ed.dom.getParent(n, 'p');

							if (bl) {
								ren(bl, s.element);
								ed.nodeChanged();
							}
						}
					});
				}
			}
		},

		find : function(n, t, s) {
			var ed = this.editor, w = ed.getDoc().createTreeWalker(n, 4, null, false), c = -1;

			while (n = w.nextNode()) {
				c++;

				// Index by node
				if (t == 0 && n == s)
					return c;

				// Node by index
				if (t == 1 && c == s)
					return n;
			}

			return -1;
		},

		forceRoots : function(ed, e) {
			var t = this, ed = t.editor, b = ed.getBody(), d = ed.getDoc(), se = ed.selection, s = se.getSel(), r = se.getRng(), si = -2, ei, so, eo, tr, c = -0xFFFFFF;
			var nx, bl, bp, sp, le, nl = b.childNodes, i, n, eid;

			// Fix for bug #1863847
			//if (e && e.keyCode == 13)
			//	return true;

			// Wrap non blocks into blocks
			for (i = nl.length - 1; i >= 0; i--) {
				nx = nl[i];

				// Is text or non block element
				if (nx.nodeType == 3 || (!t.dom.isBlock(nx) && nx.nodeType != 8)) {
					if (!bl) {
						// Create new block but ignore whitespace
						if (nx.nodeType != 3 || /[^\s]/g.test(nx.nodeValue)) {
							// Store selection
							if (si == -2 && r) {
								if (!isIE) {
									// If selection is element then mark it
									if (r.startContainer.nodeType == 1 && (n = r.startContainer.childNodes[r.startOffset]) && n.nodeType == 1) {
										// Save the id of the selected element
										eid = n.getAttribute("id");
										n.setAttribute("id", "__mce");
									} else {
										// If element is inside body, might not be the case in contentEdiable mode
										if (ed.dom.getParent(r.startContainer, function(e) {return e === b;})) {
											so = r.startOffset;
											eo = r.endOffset;
											si = t.find(b, 0, r.startContainer);
											ei = t.find(b, 0, r.endContainer);
										}
									}
								} else {
									tr = d.body.createTextRange();
									tr.moveToElementText(b);
									tr.collapse(1);
									bp = tr.move('character', c) * -1;

									tr = r.duplicate();
									tr.collapse(1);
									sp = tr.move('character', c) * -1;

									tr = r.duplicate();
									tr.collapse(0);
									le = (tr.move('character', c) * -1) - sp;

									si = sp - bp;
									ei = le;
								}
							}

							bl = ed.dom.create(ed.settings.forced_root_block);
							bl.appendChild(nx.cloneNode(1));
							nx.parentNode.replaceChild(bl, nx);
						}
					} else {
						if (bl.hasChildNodes())
							bl.insertBefore(nx, bl.firstChild);
						else
							bl.appendChild(nx);
					}
				} else
					bl = null; // Time to create new block
			}

			// Restore selection
			if (si != -2) {
				if (!isIE) {
					bl = b.getElementsByTagName(ed.settings.element)[0];
					r = d.createRange();

					// Select last location or generated block
					if (si != -1)
						r.setStart(t.find(b, 1, si), so);
					else
						r.setStart(bl, 0);

					// Select last location or generated block
					if (ei != -1)
						r.setEnd(t.find(b, 1, ei), eo);
					else
						r.setEnd(bl, 0);

					if (s) {
						s.removeAllRanges();
						s.addRange(r);
					}
				} else {
					try {
						r = s.createRange();
						r.moveToElementText(b);
						r.collapse(1);
						r.moveStart('character', si);
						r.moveEnd('character', ei);
						r.select();
					} catch (ex) {
						// Ignore
					}
				}
			} else if (!isIE && (n = ed.dom.get('__mce'))) {
				// Restore the id of the selected element
				if (eid)
					n.setAttribute('id', eid);
				else
					n.removeAttribute('id');

				// Move caret before selected element
				r = d.createRange();
				r.setStartBefore(n);
				r.setEndBefore(n);
				se.setRng(r);
			}
		},

		getParentBlock : function(n) {
			var d = this.dom;

			return d.getParent(n, d.isBlock);
		},

		insertPara : function(e) {
			var t = this, ed = t.editor, dom = ed.dom, d = ed.getDoc(), se = ed.settings, s = ed.selection.getSel(), r = s.getRangeAt(0), b = d.body;
			var rb, ra, dir, sn, so, en, eo, sb, eb, bn, bef, aft, sc, ec, n, vp = dom.getViewPort(ed.getWin()), y, ch, car;

			// If root blocks are forced then use Operas default behavior since it's really good
// Removed due to bug: #1853816
//			if (se.forced_root_block && isOpera)
//				return true;

			// Setup before range
			rb = d.createRange();

			// If is before the first block element and in body, then move it into first block element
			rb.setStart(s.anchorNode, s.anchorOffset);
			rb.collapse(true);

			// Setup after range
			ra = d.createRange();

			// If is before the first block element and in body, then move it into first block element
			ra.setStart(s.focusNode, s.focusOffset);
			ra.collapse(true);

			// Setup start/end points
			dir = rb.compareBoundaryPoints(rb.START_TO_END, ra) < 0;
			sn = dir ? s.anchorNode : s.focusNode;
			so = dir ? s.anchorOffset : s.focusOffset;
			en = dir ? s.focusNode : s.anchorNode;
			eo = dir ? s.focusOffset : s.anchorOffset;

			// If selection is in empty table cell
			if (sn === en && /^(TD|TH)$/.test(sn.nodeName)) {
				if (sn.firstChild.nodeName == 'BR')
					dom.remove(sn.firstChild); // Remove BR

				// Create two new block elements
				if (sn.childNodes.length == 0) {
					ed.dom.add(sn, se.element, null, '<br />');
					aft = ed.dom.add(sn, se.element, null, '<br />');
				} else {
					n = sn.innerHTML;
					sn.innerHTML = '';
					ed.dom.add(sn, se.element, null, n);
					aft = ed.dom.add(sn, se.element, null, '<br />');
				}

				// Move caret into the last one
				r = d.createRange();
				r.selectNodeContents(aft);
				r.collapse(1);
				ed.selection.setRng(r);

				return false;
			}

			// If the caret is in an invalid location in FF we need to move it into the first block
			if (sn == b && en == b && b.firstChild && ed.dom.isBlock(b.firstChild)) {
				sn = en = sn.firstChild;
				so = eo = 0;
				rb = d.createRange();
				rb.setStart(sn, 0);
				ra = d.createRange();
				ra.setStart(en, 0);
			}

			// Never use body as start or end node
			sn = sn.nodeName == "HTML" ? d.body : sn; // Fix for Opera bug: https://bugs.opera.com/show_bug.cgi?id=273224&comments=yes
			sn = sn.nodeName == "BODY" ? sn.firstChild : sn;
			en = en.nodeName == "HTML" ? d.body : en; // Fix for Opera bug: https://bugs.opera.com/show_bug.cgi?id=273224&comments=yes
			en = en.nodeName == "BODY" ? en.firstChild : en;

			// Get start and end blocks
			sb = t.getParentBlock(sn);
			eb = t.getParentBlock(en);
			bn = sb ? sb.nodeName : se.element; // Get block name to create

			// Return inside list use default browser behavior
			if (t.dom.getParent(sb, 'ol,ul,pre'))
				return true;

			// If caption or absolute layers then always generate new blocks within
			if (sb && (sb.nodeName == 'CAPTION' || /absolute|relative|fixed/gi.test(dom.getStyle(sb, 'position', 1)))) {
				bn = se.element;
				sb = null;
			}

			// If caption or absolute layers then always generate new blocks within
			if (eb && (eb.nodeName == 'CAPTION' || /absolute|relative|fixed/gi.test(dom.getStyle(sb, 'position', 1)))) {
				bn = se.element;
				eb = null;
			}

			// Use P instead
			if (/(TD|TABLE|TH|CAPTION)/.test(bn) || (sb && bn == "DIV" && /left|right/gi.test(dom.getStyle(sb, 'float', 1)))) {
				bn = se.element;
				sb = eb = null;
			}

			// Setup new before and after blocks
			bef = (sb && sb.nodeName == bn) ? sb.cloneNode(0) : ed.dom.create(bn);
			aft = (eb && eb.nodeName == bn) ? eb.cloneNode(0) : ed.dom.create(bn);

			// Remove id from after clone
			aft.removeAttribute('id');

			// Is header and cursor is at the end, then force paragraph under
			if (/^(H[1-6])$/.test(bn) && sn.nodeValue && so == sn.nodeValue.length)
				aft = ed.dom.create(se.element);

			// Find start chop node
			n = sc = sn;
			do {
				if (n == b || n.nodeType == 9 || t.dom.isBlock(n) || /(TD|TABLE|TH|CAPTION)/.test(n.nodeName))
					break;

				sc = n;
			} while ((n = n.previousSibling ? n.previousSibling : n.parentNode));

			// Find end chop node
			n = ec = en;
			do {
				if (n == b || n.nodeType == 9 || t.dom.isBlock(n) || /(TD|TABLE|TH|CAPTION)/.test(n.nodeName))
					break;

				ec = n;
			} while ((n = n.nextSibling ? n.nextSibling : n.parentNode));

			// Place first chop part into before block element
			if (sc.nodeName == bn)
				rb.setStart(sc, 0);
			else
				rb.setStartBefore(sc);

			rb.setEnd(sn, so);
			bef.appendChild(rb.cloneContents() || d.createTextNode('')); // Empty text node needed for Safari

			// Place secnd chop part within new block element
			try {
				ra.setEndAfter(ec);
			} catch(ex) {
				//console.debug(s.focusNode, s.focusOffset);
			}

			ra.setStart(en, eo);
			aft.appendChild(ra.cloneContents() || d.createTextNode('')); // Empty text node needed for Safari

			// Create range around everything
			r = d.createRange();
			if (!sc.previousSibling && sc.parentNode.nodeName == bn) {
				r.setStartBefore(sc.parentNode);
			} else {
				if (rb.startContainer.nodeName == bn && rb.startOffset == 0)
					r.setStartBefore(rb.startContainer);
				else
					r.setStart(rb.startContainer, rb.startOffset);
			}

			if (!ec.nextSibling && ec.parentNode.nodeName == bn)
				r.setEndAfter(ec.parentNode);
			else
				r.setEnd(ra.endContainer, ra.endOffset);

			// Delete and replace it with new block elements
			r.deleteContents();

			if (isOpera)
				ed.getWin().scrollTo(0, vp.y);

			// Never wrap blocks in blocks
			if (bef.firstChild && bef.firstChild.nodeName == bn)
				bef.innerHTML = bef.firstChild.innerHTML;

			if (aft.firstChild && aft.firstChild.nodeName == bn)
				aft.innerHTML = aft.firstChild.innerHTML;

			// Padd empty blocks
			if (isEmpty(bef))
				bef.innerHTML = '<br />';

			function appendStyles(e, en) {
				var nl = [], nn, n, i;

				e.innerHTML = '';

				// Make clones of style elements
				if (se.keep_styles) {
					n = en;
					do {
						// We only want style specific elements
						if (/^(SPAN|STRONG|B|EM|I|FONT|STRIKE|U)$/.test(n.nodeName)) {
							nn = n.cloneNode(false);
							dom.setAttrib(nn, 'id', ''); // Remove ID since it needs to be unique
							nl.push(nn);
						}
					} while (n = n.parentNode);
				}

				// Append style elements to aft
				if (nl.length > 0) {
					for (i = nl.length - 1, nn = e; i >= 0; i--)
						nn = nn.appendChild(nl[i]);

					// Padd most inner style element
					nl[0].innerHTML = isOpera ? '&nbsp;' : '<br />'; // Extra space for Opera so that the caret can move there
					return nl[0]; // Move caret to most inner element
				} else
					e.innerHTML = isOpera ? '&nbsp;' : '<br />'; // Extra space for Opera so that the caret can move there
			};

			// Fill empty afterblook with current style
			if (isEmpty(aft))
				car = appendStyles(aft, en);

			// Opera needs this one backwards for older versions
			if (isOpera && parseFloat(opera.version()) < 9.5) {
				r.insertNode(bef);
				r.insertNode(aft);
			} else {
				r.insertNode(aft);
				r.insertNode(bef);
			}

			// Normalize
			aft.normalize();
			bef.normalize();

			function first(n) {
				return d.createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false).nextNode() || n;
			};

			// Move cursor and scroll into view
			r = d.createRange();
			r.selectNodeContents(isGecko ? first(car || aft) : car || aft);
			r.collapse(1);
			s.removeAllRanges();
			s.addRange(r);

			// scrollIntoView seems to scroll the parent window in most browsers now including FF 3.0b4 so it's time to stop using it and do it our selfs
			y = ed.dom.getPos(aft).y;
			ch = aft.clientHeight;

			// Is element within viewport
			if (y < vp.y || y + ch > vp.y + vp.h) {
				ed.getWin().scrollTo(0, y < vp.y ? y : y - vp.h + 25); // Needs to be hardcoded to roughly one line of text if a huge text block is broken into two blocks
				//console.debug('SCROLL!', 'vp.y: ' + vp.y, 'y' + y, 'vp.h' + vp.h, 'clientHeight' + aft.clientHeight, 'yyy: ' + (y < vp.y ? y : y - vp.h + aft.clientHeight));
			}

			return false;
		},

		backspaceDelete : function(e, bs) {
			var t = this, ed = t.editor, b = ed.getBody(), n, se = ed.selection, r = se.getRng(), sc = r.startContainer, n, w, tn;

			// The caret sometimes gets stuck in Gecko if you delete empty paragraphs
			// This workaround removes the element by hand and moves the caret to the previous element
			if (sc && ed.dom.isBlock(sc) && !/^(TD|TH)$/.test(sc.nodeName) && bs) {
				if (sc.childNodes.length == 0 || (sc.childNodes.length == 1 && sc.firstChild.nodeName == 'BR')) {
					// Find previous block element
					n = sc;
					while ((n = n.previousSibling) && !ed.dom.isBlock(n)) ;

					if (n) {
						if (sc != b.firstChild) {
							// Find last text node
							w = ed.dom.doc.createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false);
							while (tn = w.nextNode())
								n = tn;

							// Place caret at the end of last text node
							r = ed.getDoc().createRange();
							r.setStart(n, n.nodeValue ? n.nodeValue.length : 0);
							r.setEnd(n, n.nodeValue ? n.nodeValue.length : 0);
							se.setRng(r);

							// Remove the target container
							ed.dom.remove(sc);
						}

						return Event.cancel(e);
					}
				}
			}

			// Gecko generates BR elements here and there, we don't like those so lets remove them
			function handler(e) {
				var pr;

				e = e.target;

				// A new BR was created in a block element, remove it
				if (e && e.parentNode && e.nodeName == 'BR' && (n = t.getParentBlock(e))) {
					pr = e.previousSibling;

					Event.remove(b, 'DOMNodeInserted', handler);

					// Is there whitespace at the end of the node before then we might need the pesky BR
					// to place the caret at a correct location see bug: #2013943
					if (pr && pr.nodeType == 3 && /\s+$/.test(pr.nodeValue))
						return;

					// Only remove BR elements that got inserted in the middle of the text
					if (e.previousSibling || e.nextSibling)
						ed.dom.remove(e);
				}
			};

			// Listen for new nodes
			Event._add(b, 'DOMNodeInserted', handler);

			// Remove listener
			window.setTimeout(function() {
				Event._remove(b, 'DOMNodeInserted', handler);
			}, 1);
		}
	});
})(tinymce);
(function(tinymce) {
	// Shorten names
	var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, extend = tinymce.extend;

	tinymce.create('tinymce.ControlManager', {
		ControlManager : function(ed, s) {
			var t = this, i;

			s = s || {};
			t.editor = ed;
			t.controls = {};
			t.onAdd = new tinymce.util.Dispatcher(t);
			t.onPostRender = new tinymce.util.Dispatcher(t);
			t.prefix = s.prefix || ed.id + '_';
			t._cls = {};

			t.onPostRender.add(function() {
				each(t.controls, function(c) {
					c.postRender();
				});
			});
		},

		get : function(id) {
			return this.controls[this.prefix + id] || this.controls[id];
		},

		setActive : function(id, s) {
			var c = null;

			if (c = this.get(id))
				c.setActive(s);

			return c;
		},

		setDisabled : function(id, s) {
			var c = null;

			if (c = this.get(id))
				c.setDisabled(s);

			return c;
		},

		add : function(c) {
			var t = this;

			if (c) {
				t.controls[c.id] = c;
				t.onAdd.dispatch(c, t);
			}

			return c;
		},

		createControl : function(n) {
			var c, t = this, ed = t.editor;

			each(ed.plugins, function(p) {
				if (p.createControl) {
					c = p.createControl(n, t);

					if (c)
						return false;
				}
			});

			switch (n) {
				case "|":
				case "separator":
					return t.createSeparator();
			}

			if (!c && ed.buttons && (c = ed.buttons[n]))
				return t.createButton(n, c);

			return t.add(c);
		},

		createDropMenu : function(id, s, cc) {
			var t = this, ed = t.editor, c, bm, v, cls;

			s = extend({
				'class' : 'mceDropDown',
				constrain : ed.settings.constrain_menus
			}, s);

			s['class'] = s['class'] + ' ' + ed.getParam('skin') + 'Skin';
			if (v = ed.getParam('skin_variant'))
				s['class'] += ' ' + ed.getParam('skin') + 'Skin' + v.substring(0, 1).toUpperCase() + v.substring(1);

			id = t.prefix + id;
			cls = cc || t._cls.dropmenu || tinymce.ui.DropMenu;
			c = t.controls[id] = new cls(id, s);
			c.onAddItem.add(function(c, o) {
				var s = o.settings;

				s.title = ed.getLang(s.title, s.title);

				if (!s.onclick) {
					s.onclick = function(v) {
						ed.execCommand(s.cmd, s.ui || false, s.value);
					};
				}
			});

			ed.onRemove.add(function() {
				c.destroy();
			});

			// Fix for bug #1897785, #1898007
			if (tinymce.isIE) {
				c.onShowMenu.add(function() {
					// IE 8 needs focus in order to store away a range with the current collapsed caret location
					ed.focus();

					bm = ed.selection.getBookmark(1);
				});

				c.onHideMenu.add(function() {
					if (bm) {
						ed.selection.moveToBookmark(bm);
						bm = 0;
					}
				});
			}

			return t.add(c);
		},

		createListBox : function(id, s, cc) {
			var t = this, ed = t.editor, cmd, c, cls;

			if (t.get(id))
				return null;

			s.title = ed.translate(s.title);
			s.scope = s.scope || ed;

			if (!s.onselect) {
				s.onselect = function(v) {
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			s = extend({
				title : s.title,
				'class' : 'mce_' + id,
				scope : s.scope,
				control_manager : t
			}, s);

			id = t.prefix + id;

			if (ed.settings.use_native_selects)
				c = new tinymce.ui.NativeListBox(id, s);
			else {
				cls = cc || t._cls.listbox || tinymce.ui.ListBox;
				c = new cls(id, s);
			}

			t.controls[id] = c;

			// Fix focus problem in Safari
			if (tinymce.isWebKit) {
				c.onPostRender.add(function(c, n) {
					// Store bookmark on mousedown
					Event.add(n, 'mousedown', function() {
						ed.bookmark = ed.selection.getBookmark('simple');
					});

					// Restore on focus, since it might be lost
					Event.add(n, 'focus', function() {
						ed.selection.moveToBookmark(ed.bookmark);
						ed.bookmark = null;
					});
				});
			}

			if (c.hideMenu)
				ed.onMouseDown.add(c.hideMenu, c);

			return t.add(c);
		},

		createButton : function(id, s, cc) {
			var t = this, ed = t.editor, o, c, cls;

			if (t.get(id))
				return null;

			s.title = ed.translate(s.title);
			s.label = ed.translate(s.label);
			s.scope = s.scope || ed;

			if (!s.onclick && !s.menu_button) {
				s.onclick = function() {
					ed.execCommand(s.cmd, s.ui || false, s.value);
				};
			}

			s = extend({
				title : s.title,
				'class' : 'mce_' + id,
				unavailable_prefix : ed.getLang('unavailable', ''),
				scope : s.scope,
				control_manager : t
			}, s);

			id = t.prefix + id;

			if (s.menu_button) {
				cls = cc || t._cls.menubutton || tinymce.ui.MenuButton;
				c = new cls(id, s);
				ed.onMouseDown.add(c.hideMenu, c);
			} else {
				cls = t._cls.button || tinymce.ui.Button;
				c = new cls(id, s);
			}

			return t.add(c);
		},

		createMenuButton : function(id, s, cc) {
			s = s || {};
			s.menu_button = 1;

			return this.createButton(id, s, cc);
		},

		createSplitButton : function(id, s, cc) {
			var t = this, ed = t.editor, cmd, c, cls;

			if (t.get(id))
				return null;

			s.title = ed.translate(s.title);
			s.scope = s.scope || ed;

			if (!s.onclick) {
				s.onclick = function(v) {
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			if (!s.onselect) {
				s.onselect = function(v) {
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			s = extend({
				title : s.title,
				'class' : 'mce_' + id,
				scope : s.scope,
				control_manager : t
			}, s);

			id = t.prefix + id;
			cls = cc || t._cls.splitbutton || tinymce.ui.SplitButton;
			c = t.add(new cls(id, s));
			ed.onMouseDown.add(c.hideMenu, c);

			return c;
		},

		createColorSplitButton : function(id, s, cc) {
			var t = this, ed = t.editor, cmd, c, cls, bm;

			if (t.get(id))
				return null;

			s.title = ed.translate(s.title);
			s.scope = s.scope || ed;

			if (!s.onclick) {
				s.onclick = function(v) {
					if (tinymce.isIE)
						bm = ed.selection.getBookmark(1);
	
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			if (!s.onselect) {
				s.onselect = function(v) {
					ed.execCommand(s.cmd, s.ui || false, v || s.value);
				};
			}

			s = extend({
				title : s.title,
				'class' : 'mce_' + id,
				'menu_class' : ed.getParam('skin') + 'Skin',
				scope : s.scope,
				more_colors_title : ed.getLang('more_colors')
			}, s);

			id = t.prefix + id;
			cls = cc || t._cls.colorsplitbutton || tinymce.ui.ColorSplitButton;
			c = new cls(id, s);
			ed.onMouseDown.add(c.hideMenu, c);

			// Remove the menu element when the editor is removed
			ed.onRemove.add(function() {
				c.destroy();
			});

			// Fix for bug #1897785, #1898007
			if (tinymce.isIE) {
				c.onHideMenu.add(function() {
					if (bm) {
						ed.selection.moveToBookmark(bm);
						bm = 0;
					}
				});
			}

			return t.add(c);
		},

		createToolbar : function(id, s, cc) {
			var c, t = this, cls;

			id = t.prefix + id;
			cls = cc || t._cls.toolbar || tinymce.ui.Toolbar;
			c = new cls(id, s);

			if (t.get(id))
				return null;

			return t.add(c);
		},

		createSeparator : function(cc) {
			var cls = cc || this._cls.separator || tinymce.ui.Separator;

			return new cls();
		},

		setControlType : function(n, c) {
			return this._cls[n.toLowerCase()] = c;
		},

		destroy : function() {
			each(this.controls, function(c) {
				c.destroy();
			});

			this.controls = null;
		}

		});
})(tinymce);
(function(tinymce) {
	var Dispatcher = tinymce.util.Dispatcher, each = tinymce.each, isIE = tinymce.isIE, isOpera = tinymce.isOpera;

	tinymce.create('tinymce.WindowManager', {
		WindowManager : function(ed) {
			var t = this;

			t.editor = ed;
			t.onOpen = new Dispatcher(t);
			t.onClose = new Dispatcher(t);
			t.params = {};
			t.features = {};
		},

		open : function(s, p) {
			var t = this, f = '', x, y, mo = t.editor.settings.dialog_type == 'modal', w, sw, sh, vp = tinymce.DOM.getViewPort(), u;

			// Default some options
			s = s || {};
			p = p || {};
			sw = isOpera ? vp.w : screen.width; // Opera uses windows inside the Opera window
			sh = isOpera ? vp.h : screen.height;
			s.name = s.name || 'mc_' + new Date().getTime();
			s.width = parseInt(s.width || 320);
			s.height = parseInt(s.height || 240);
			s.resizable = true;
			s.left = s.left || parseInt(sw / 2.0) - (s.width / 2.0);
			s.top = s.top || parseInt(sh / 2.0) - (s.height / 2.0);
			p.inline = false;
			p.mce_width = s.width;
			p.mce_height = s.height;
			p.mce_auto_focus = s.auto_focus;

			if (mo) {
				if (isIE) {
					s.center = true;
					s.help = false;
					s.dialogWidth = s.width + 'px';
					s.dialogHeight = s.height + 'px';
					s.scroll = s.scrollbars || false;
				}
			}

			// Build features string
			each(s, function(v, k) {
				if (tinymce.is(v, 'boolean'))
					v = v ? 'yes' : 'no';

				if (!/^(name|url)$/.test(k)) {
					if (isIE && mo)
						f += (f ? ';' : '') + k + ':' + v;
					else
						f += (f ? ',' : '') + k + '=' + v;
				}
			});

			t.features = s;
			t.params = p;
			t.onOpen.dispatch(t, s, p);

			u = s.url || s.file;
			u = tinymce._addVer(u);

			try {
				if (isIE && mo) {
					w = 1;
					window.showModalDialog(u, window, f);
				} else
					w = window.open(u, s.name, f);
			} catch (ex) {
				// Ignore
			}

			if (!w)
				alert(t.editor.getLang('popup_blocked'));
		},

		close : function(w) {
			w.close();
			this.onClose.dispatch(this);
		},

		createInstance : function(cl, a, b, c, d, e) {
			var f = tinymce.resolve(cl);

			return new f(a, b, c, d, e);
		},

		confirm : function(t, cb, s, w) {
			w = w || window;

			cb.call(s || this, w.confirm(this._decode(this.editor.getLang(t, t))));
		},

		alert : function(tx, cb, s, w) {
			var t = this;

			w = w || window;
			w.alert(t._decode(t.editor.getLang(tx, tx)));

			if (cb)
				cb.call(s || t);
		},

		// Internal functions

		_decode : function(s) {
			return tinymce.DOM.decode(s).replace(/\\n/g, '\n');
		}

		});
}(tinymce));(function(tinymce) {
	tinymce.CommandManager = function() {
		var execCommands = {}, queryStateCommands = {}, queryValueCommands = {};

		function add(collection, cmd, func, scope) {
			if (typeof(cmd) == 'string')
				cmd = [cmd];

			tinymce.each(cmd, function(cmd) {
				collection[cmd.toLowerCase()] = {func : func, scope : scope};
			});
		};

		tinymce.extend(this, {
			add : function(cmd, func, scope) {
				add(execCommands, cmd, func, scope);
			},

			addQueryStateHandler : function(cmd, func, scope) {
				add(queryStateCommands, cmd, func, scope);
			},

			addQueryValueHandler : function(cmd, func, scope) {
				add(queryValueCommands, cmd, func, scope);
			},

			execCommand : function(scope, cmd, ui, value, args) {
				if (cmd = execCommands[cmd.toLowerCase()]) {
					if (cmd.func.call(scope || cmd.scope, ui, value, args) !== false)
						return true;
				}
			},

			queryCommandValue : function() {
				if (cmd = queryValueCommands[cmd.toLowerCase()])
					return cmd.func.call(scope || cmd.scope, ui, value, args);
			},

			queryCommandState : function() {
				if (cmd = queryStateCommands[cmd.toLowerCase()])
					return cmd.func.call(scope || cmd.scope, ui, value, args);
			}
		});
	};

	tinymce.GlobalCommands = new tinymce.CommandManager();
})(tinymce);(function(tinymce) {
	function processRange(dom, start, end, callback) {
		var ancestor, n, startPoint, endPoint, sib;

		function findEndPoint(n, c) {
			do {
				if (n.parentNode == c)
					return n;

				n = n.parentNode;
			} while(n);
		};

		function process(n) {
			callback(n);
			tinymce.walk(n, callback, 'childNodes');
		};

		// Find common ancestor and end points
		ancestor = dom.findCommonAncestor(start, end);
		startPoint = findEndPoint(start, ancestor) || start;
		endPoint = findEndPoint(end, ancestor) || end;

		// Process left leaf
		for (n = start; n && n != startPoint; n = n.parentNode) {
			for (sib = n.nextSibling; sib; sib = sib.nextSibling)
				process(sib);
		}

		// Process middle from start to end point
		if (startPoint != endPoint) {
			for (n = startPoint.nextSibling; n && n != endPoint; n = n.nextSibling)
				process(n);
		} else
			process(startPoint);

		// Process right leaf
		for (n = end; n && n != endPoint; n = n.parentNode) {
			for (sib = n.previousSibling; sib; sib = sib.previousSibling)
				process(sib);
		}
	};

	tinymce.GlobalCommands.add('RemoveFormat', function() {
		var ed = this, dom = ed.dom, s = ed.selection, r = s.getRng(1), nodes = [], bm, start, end, sc, so, ec, eo, n;

		function findFormatRoot(n) {
			var sp;

			dom.getParent(n, function(n) {
				if (dom.is(n, ed.getParam('removeformat_selector')))
					sp = n;

				return dom.isBlock(n);
			}, ed.getBody());

			return sp;
		};

		function collect(n) {
			if (dom.is(n, ed.getParam('removeformat_selector')))
				nodes.push(n);
		};

		function walk(n) {
			collect(n);
			tinymce.walk(n, collect, 'childNodes');
		};

		bm = s.getBookmark();
		sc = r.startContainer;
		ec = r.endContainer;
		so = r.startOffset;
		eo = r.endOffset;
		sc = sc.nodeType == 1 ? sc.childNodes[Math.min(so, sc.childNodes.length - 1)] : sc;
		ec = ec.nodeType == 1 ? ec.childNodes[Math.min(so == eo ? eo : eo - 1, ec.childNodes.length - 1)] : ec;

		// Same container
		if (sc == ec) { // TEXT_NODE
			start = findFormatRoot(sc);

			// Handle single text node
			if (sc.nodeType == 3) {
				if (start && start.nodeType == 1) { // ELEMENT
					n = sc.splitText(so);
					n.splitText(eo - so);
					dom.split(start, n);

					s.moveToBookmark(bm);
				}

				return;
			}

			// Handle single element
			walk(dom.split(start, sc) || sc);
		} else {
			// Find start/end format root
			start = findFormatRoot(sc);
			end = findFormatRoot(ec);

			// Split start text node
			if (start) {
				if (sc.nodeType == 3) { // TEXT
					// Since IE doesn't support white space nodes in the DOM we need to
					// add this invisible character so that the splitText function can split the contents
					if (so == sc.nodeValue.length)
						sc.nodeValue += '\uFEFF'; // Yet another pesky IE fix

					sc = sc.splitText(so);
				}
			}

			// Split end text node
			if (end) {
				if (ec.nodeType == 3) // TEXT
					ec.splitText(eo);
			}

			// If the start and end format root is the same then we need to wrap
			// the end node in a span since the split calls might change the reference
			// Example: <p><b><em>x[yz<span>---</span>12]3</em></b></p>
			if (start && start == end)
				dom.replace(dom.create('span', {id : '__end'}, ec.cloneNode(true)), ec);

			// Split all start containers down to the format root
			if (start)
				start = dom.split(start, sc);
			else
				start = sc;

			// If there is a span wrapper use that one instead
			if (n = dom.get('__end')) {
				ec = n;
				end = findFormatRoot(ec);
			}

			// Split all end containers down to the format root
			if (end)
				end = dom.split(end, ec);
			else
				end = ec;

			// Collect nodes in between
			processRange(dom, start, end, collect);

			// Remove invisible character for IE workaround if we find it
			if (sc.nodeValue == '\uFEFF')
				sc.nodeValue = '';

			// Process start/end container elements
			walk(ec);
			walk(sc);
		}

		// Remove all collected nodes
		tinymce.each(nodes, function(n) {
			dom.remove(n, 1);
		});

		// Remove leftover wrapper
		dom.remove('__end', 1);

		s.moveToBookmark(bm);
	});
})(tinymce);
(function(tinymce) {
	tinymce.GlobalCommands.add('mceBlockQuote', function() {
		var ed = this, s = ed.selection, dom = ed.dom, sb, eb, n, bm, bq, r, bq2, i, nl;

		function getBQ(e) {
			return dom.getParent(e, function(n) {return n.nodeName === 'BLOCKQUOTE';});
		};

		// Get start/end block
		sb = dom.getParent(s.getStart(), dom.isBlock);
		eb = dom.getParent(s.getEnd(), dom.isBlock);

		// Remove blockquote(s)
		if (bq = getBQ(sb)) {
			if (sb != eb || sb.childNodes.length > 1 || (sb.childNodes.length == 1 && sb.firstChild.nodeName != 'BR'))
				bm = s.getBookmark();

			// Move all elements after the end block into new bq
			if (getBQ(eb)) {
				bq2 = bq.cloneNode(false);

				while (n = eb.nextSibling)
					bq2.appendChild(n.parentNode.removeChild(n));
			}

			// Add new bq after
			if (bq2)
				dom.insertAfter(bq2, bq);

			// Move all selected blocks after the current bq
			nl = s.getSelectedBlocks(sb, eb);
			for (i = nl.length - 1; i >= 0; i--) {
				dom.insertAfter(nl[i], bq);
			}

			// Empty bq, then remove it
			if (/^\s*$/.test(bq.innerHTML))
				dom.remove(bq, 1); // Keep children so boomark restoration works correctly

			// Empty bq, then remote it
			if (bq2 && /^\s*$/.test(bq2.innerHTML))
				dom.remove(bq2, 1); // Keep children so boomark restoration works correctly

			if (!bm) {
				// Move caret inside empty block element
				if (!tinymce.isIE) {
					r = ed.getDoc().createRange();
					r.setStart(sb, 0);
					r.setEnd(sb, 0);
					s.setRng(r);
				} else {
					s.select(sb);
					s.collapse(0);

					// IE misses the empty block some times element so we must move back the caret
					if (dom.getParent(s.getStart(), dom.isBlock) != sb) {
						r = s.getRng();
						r.move('character', -1);
						r.select();
					}
				}
			} else
				ed.selection.moveToBookmark(bm);

			return;
		}

		// Since IE can start with a totally empty document we need to add the first bq and paragraph
		if (tinymce.isIE && !sb && !eb) {
			ed.getDoc().execCommand('Indent');
			n = getBQ(s.getNode());
			n.style.margin = n.dir = ''; // IE adds margin and dir to bq
			return;
		}

		if (!sb || !eb)
			return;

		// If empty paragraph node then do not use bookmark
		if (sb != eb || sb.childNodes.length > 1 || (sb.childNodes.length == 1 && sb.firstChild.nodeName != 'BR'))
			bm = s.getBookmark();

		// Move selected block elements into a bq
		tinymce.each(s.getSelectedBlocks(getBQ(s.getStart()), getBQ(s.getEnd())), function(e) {
			// Found existing BQ add to this one
			if (e.nodeName == 'BLOCKQUOTE' && !bq) {
				bq = e;
				return;
			}

			// No BQ found, create one
			if (!bq) {
				bq = dom.create('blockquote');
				e.parentNode.insertBefore(bq, e);
			}

			// Add children from existing BQ
			if (e.nodeName == 'BLOCKQUOTE' && bq) {
				n = e.firstChild;

				while (n) {
					bq.appendChild(n.cloneNode(true));
					n = n.nextSibling;
				}

				dom.remove(e);
				return;
			}

			// Add non BQ element to BQ
			bq.appendChild(dom.remove(e));
		});

		if (!bm) {
			// Move caret inside empty block element
			if (!tinymce.isIE) {
				r = ed.getDoc().createRange();
				r.setStart(sb, 0);
				r.setEnd(sb, 0);
				s.setRng(r);
			} else {
				s.select(sb);
				s.collapse(1);
			}
		} else
			s.moveToBookmark(bm);
	});
})(tinymce);
(function(tinymce) {
	tinymce.each(['Cut', 'Copy', 'Paste'], function(cmd) {
		tinymce.GlobalCommands.add(cmd, function() {
			var ed = this, doc = ed.getDoc();

			try {
				doc.execCommand(cmd, false, null);

				// On WebKit the command will just be ignored if it's not enabled
				if (!doc.queryCommandSupported(cmd))
					throw 'Error';
			} catch (ex) {
				ed.windowManager.alert(ed.getLang('clipboard_no_support'));
			}
		});
	});
})(tinymce);
(function(tinymce) {
	tinymce.GlobalCommands.add('InsertHorizontalRule', function() {
		if (tinymce.isOpera)
			return this.getDoc().execCommand('InsertHorizontalRule', false, '');

		this.selection.setContent('<hr />');
	});
})(tinymce);
(function() {
	var cmds = tinymce.GlobalCommands;

	cmds.add(['mceEndUndoLevel', 'mceAddUndoLevel'], function() {
		this.undoManager.add();
	});

	cmds.add('Undo', function() {
		var ed = this;

		if (ed.settings.custom_undo_redo) {
			ed.undoManager.undo();
			ed.nodeChanged();
			return true;
		}

		return false; // Run browser command
	});

	cmds.add('Redo', function() {
		var ed = this;

		if (ed.settings.custom_undo_redo) {
			ed.undoManager.redo();
			ed.nodeChanged();
			return true;
		}

		return false; // Run browser command
	});
})();
>>>>>>> deploy
