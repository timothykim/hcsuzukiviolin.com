<<<<<<< HEAD
tinyMCE.importPluginLanguagePack('fullpage');var TinyMCE_FullPagePlugin={getInfo:function(){return{longname:'Fullpage',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://tinymce.moxiecode.com/tinymce/docs/plugin_fullpage.html',version:tinyMCE.majorVersion+"."+tinyMCE.minorVersion}},getControlHTML:function(cn){switch(cn){case"fullpage":return tinyMCE.getButtonHTML(cn,'lang_fullpage_desc','{$pluginurl}/images/fullpage.gif','mceFullPageProperties')}return""},execCommand:function(editor_id,element,command,user_interface,value){switch(command){case"mceFullPageProperties":var template=new Array();template['file']='../../plugins/fullpage/fullpage.htm';template['width']=430;template['height']=485+(tinyMCE.isOpera?5:0);template['width']+=tinyMCE.getLang('lang_fullpage_delta_width',0);template['height']+=tinyMCE.getLang('lang_fullpage_delta_height',0);tinyMCE.openWindow(template,{editor_id:editor_id,inline:"yes"});return true;case"mceFullPageUpdate":TinyMCE_FullPagePlugin._addToHead(tinyMCE.getInstanceById(editor_id));return true}return false},cleanup:function(type,content,inst){switch(type){case"insert_to_editor":var tmp=content.toLowerCase();var pos=tmp.indexOf('<body'),pos2;if(pos!=-1){pos=tmp.indexOf('>',pos);pos2=tmp.lastIndexOf('</body>');inst.fullpageTopContent=content.substring(0,pos+1);content=content.substring(pos+1,pos2);}else{if(!inst.fullpageTopContent){var docType=tinyMCE.getParam("fullpage_default_doctype",'<!DOCTYPE html PUBLIC "-/'+'/W3C//DTD XHTML 1.0 Transitional/'+'/EN" "http:/'+'/www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');var enc=tinyMCE.getParam("fullpage_default_encoding",'utf-8');var title=tinyMCE.getParam("fullpage_default_title",'Untitled document');var lang=tinyMCE.getParam("fullpage_default_langcode",'en');var pi=tinyMCE.getParam("fullpage_default_xml_pi",true);var ff=tinyMCE.getParam("fullpage_default_font_family","");var fz=tinyMCE.getParam("fullpage_default_font_size","");var ds=tinyMCE.getParam("fullpage_default_style","");var dtc=tinyMCE.getParam("fullpage_default_text_color","");title=title.replace(/&/g,'&amp;');title=title.replace(/\"/g,'&quot;');title=title.replace(/</g,'&lt;');title=title.replace(/>/g,'&gt;');tmp='';if(pi)tmp+='<?xml version="1.0" encoding="'+enc+'"?>\n';tmp+=docType+'\n';tmp+='<html xmlns="http:/'+'/www.w3.org/1999/xhtml" lang="'+lang+'" xml:lang="'+lang+'">\n';tmp+='<head>\n';tmp+='\t<title>'+title+'</title>\n';tmp+='\t<meta http-equiv="Content-Type" content="text/html; charset='+enc+'" />\n';tmp+='</head>\n';tmp+='<body';if(ff!=''||fz!=''){tmp+=' style="';if(ds!='')tmp+=ds+";";if(ff!='')tmp+='font-family: '+ff+";";if(fz!='')tmp+='font-size: '+fz+";";tmp+='"'}if(dtc!='')tmp+=' text="'+dtc+'"';tmp+='>\n';inst.fullpageTopContent=tmp}}this._addToHead(inst);break;case"get_from_editor":if(inst.fullpageTopContent)content=inst.fullpageTopContent+content+"\n</body>\n</html>";break}return content},_addToHead:function(inst){var doc=inst.getDoc();var head=doc.getElementsByTagName("head")[0];var body=doc.body;var h=inst.fullpageTopContent;var e=doc.createElement("body");var nl,i,le,tmp;h=h.replace(/(\r|\n)/gi,'');h=h.replace(/<\?[^\>]*\>/gi,'');h=h.replace(/<\/?(!DOCTYPE|head|html)[^\>]*\>/gi,'');h=h.replace(/<script(.*?)<\/script>/gi,'');h=h.replace(/<title(.*?)<\/title>/gi,'');h=h.replace(/<(meta|base)[^>]*>/gi,'');h=h.replace(/<link([^>]*)\/>/gi,'<pre mce_type="link" $1></pre>');h=h.replace(/<body/gi,'<div mce_type="body"');h+='</div>';e.innerHTML=h;body.vLink=body.aLink=body.link=body.text='';body.style.cssText='';nl=head.getElementsByTagName('link');for(i=0;i<nl.length;i++){if(tinyMCE.getAttrib(nl[i],'mce_head')=="true")nl[i].parentNode.removeChild(nl[i])}nl=e.getElementsByTagName('pre');for(i=0;i<nl.length;i++){tmp=tinyMCE.getAttrib(nl[i],'media');if(tinyMCE.getAttrib(nl[i],'mce_type')=="link"&&(tmp==""||tmp=="screen"||tmp=="all")&&tinyMCE.getAttrib(nl[i],'rel')=="stylesheet"){le=doc.createElement("link");le.rel="stylesheet";le.href=tinyMCE.getAttrib(nl[i],'href');le.setAttribute("mce_head","true");head.appendChild(le)}}nl=e.getElementsByTagName('div');if(nl.length>0){body.style.cssText=tinyMCE.getAttrib(nl[0],'style');if((tmp=tinyMCE.getAttrib(nl[0],'leftmargin'))!=''&&body.style.marginLeft=='')body.style.marginLeft=tmp+"px";if((tmp=tinyMCE.getAttrib(nl[0],'rightmargin'))!=''&&body.style.marginRight=='')body.style.marginRight=tmp+"px";if((tmp=tinyMCE.getAttrib(nl[0],'topmargin'))!=''&&body.style.marginTop=='')body.style.marginTop=tmp+"px";if((tmp=tinyMCE.getAttrib(nl[0],'bottommargin'))!=''&&body.style.marginBottom=='')body.style.marginBottom=tmp+"px";body.dir=tinyMCE.getAttrib(nl[0],'dir');body.vLink=tinyMCE.getAttrib(nl[0],'vlink');body.aLink=tinyMCE.getAttrib(nl[0],'alink');body.link=tinyMCE.getAttrib(nl[0],'link');body.text=tinyMCE.getAttrib(nl[0],'text');if((tmp=tinyMCE.getAttrib(nl[0],'background'))!='')body.style.backgroundImage="url('"+tmp+"')";if((tmp=tinyMCE.getAttrib(nl[0],'bgcolor'))!='')body.style.backgroundColor=tmp}}};tinyMCE.addPlugin("fullpage",TinyMCE_FullPagePlugin);
=======
(function(){tinymce.create("tinymce.plugins.FullPagePlugin",{init:function(a,b){var c=this;c.editor=a;a.addCommand("mceFullPageProperties",function(){a.windowManager.open({file:b+"/fullpage.htm",width:430+parseInt(a.getLang("fullpage.delta_width",0)),height:495+parseInt(a.getLang("fullpage.delta_height",0)),inline:1},{plugin_url:b,head_html:c.head})});a.addButton("fullpage",{title:"fullpage.desc",cmd:"mceFullPageProperties"});a.onBeforeSetContent.add(c._setContent,c);a.onSetContent.add(c._setBodyAttribs,c);a.onGetContent.add(c._getContent,c)},getInfo:function(){return{longname:"Fullpage",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullpage",version:tinymce.majorVersion+"."+tinymce.minorVersion}},_setBodyAttribs:function(d,a){var l,c,e,g,b,h,j,f=this.head.match(/body(.*?)>/i);if(f&&f[1]){l=f[1].match(/\s*(\w+\s*=\s*".*?"|\w+\s*=\s*'.*?'|\w+\s*=\s*\w+|\w+)\s*/g);if(l){for(c=0,e=l.length;c<e;c++){g=l[c].split("=");b=g[0].replace(/\s/,"");h=g[1];if(h){h=h.replace(/^\s+/,"").replace(/\s+$/,"");j=h.match(/^["'](.*)["']$/);if(j){h=j[1]}}else{h=b}d.dom.setAttrib(d.getBody(),"style",h)}}}},_createSerializer:function(){return new tinymce.dom.Serializer({dom:this.editor.dom,apply_source_formatting:true})},_setContent:function(d,b){var h=this,a,j,f=b.content,g,i="";if(b.source_view&&d.getParam("fullpage_hide_in_source_view")){return}f=f.replace(/<(\/?)BODY/gi,"<$1body");a=f.indexOf("<body");if(a!=-1){a=f.indexOf(">",a);h.head=f.substring(0,a+1);j=f.indexOf("</body",a);if(j==-1){j=f.indexOf("</body",j)}b.content=f.substring(a+1,j);h.foot=f.substring(j);function e(c){return c.replace(/<\/?[A-Z]+/g,function(k){return k.toLowerCase()})}h.head=e(h.head);h.foot=e(h.foot)}else{h.head="";if(d.getParam("fullpage_default_xml_pi")){h.head+='<?xml version="1.0" encoding="'+d.getParam("fullpage_default_encoding","ISO-8859-1")+'" ?>\n'}h.head+=d.getParam("fullpage_default_doctype",'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');h.head+="\n<html>\n<head>\n<title>"+d.getParam("fullpage_default_title","Untitled document")+"</title>\n";if(g=d.getParam("fullpage_default_encoding")){h.head+='<meta http-equiv="Content-Type" content="'+g+'" />\n'}if(g=d.getParam("fullpage_default_font_family")){i+="font-family: "+g+";"}if(g=d.getParam("fullpage_default_font_size")){i+="font-size: "+g+";"}if(g=d.getParam("fullpage_default_text_color")){i+="color: "+g+";"}h.head+="</head>\n<body"+(i?' style="'+i+'"':"")+">\n";h.foot="\n</body>\n</html>"}},_getContent:function(a,c){var b=this;if(!c.source_view||!a.getParam("fullpage_hide_in_source_view")){c.content=tinymce.trim(b.head)+"\n"+tinymce.trim(c.content)+"\n"+tinymce.trim(b.foot)}}});tinymce.PluginManager.add("fullpage",tinymce.plugins.FullPagePlugin)})();
>>>>>>> deploy
