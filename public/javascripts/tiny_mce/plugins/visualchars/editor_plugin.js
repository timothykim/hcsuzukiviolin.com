<<<<<<< HEAD
tinyMCE.importPluginLanguagePack('visualchars');var TinyMCE_VisualCharsPlugin={getInfo:function(){return{longname:'Visual characters',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://tinymce.moxiecode.com/tinymce/docs/plugin_visualchars.html',version:tinyMCE.majorVersion+"."+tinyMCE.minorVersion}},initInstance:function(inst){inst.visualChars={state:false}},getControlHTML:function(cn){switch(cn){case"visualchars":return tinyMCE.getButtonHTML(cn,'lang_visualchars_desc','{$pluginurl}/images/visualchars.gif','mceVisualChars',false)}return""},execCommand:function(editor_id,element,command,user_interface,value){var inst=tinyMCE.getInstanceById(editor_id);switch(command){case"mceVisualChars":this._toggleVisualChars(editor_id,inst);return true}return false},cleanup:function(type,content,inst){if(type=="insert_to_editor_dom"||type=="get_from_editor_dom"){inst.visualChars.state=true;this._toggleVisualChars(inst.editorId,inst)}return content},_toggleVisualChars:function(editor_id,inst){var nl,i,h,d=inst.getDoc(),b=inst.getBody(),nv,s=inst.selection,bo;inst.visualChars.state=!inst.visualChars.state;bo=s.getBookmark(true);tinyMCE.switchClass(editor_id+'_visualchars',inst.visualChars.state?'mceButtonSelected':'mceButtonNormal');if(inst.visualChars.state){nl=tinyMCE.selectNodes(b,function(n){return n.nodeType==3&&n.nodeValue&&n.nodeValue.indexOf('\u00a0')!=-1});for(i=0;i<nl.length;i++){nv=nl[i].nodeValue;nv=nv.replace(/(\u00a0+)/g,'<span class="mceItemHiddenVisualChar">$1</span>');nv=nv.replace(/\u00a0/g,'\u00b7');tinyMCE.setOuterHTML(nl[i],nv,d)}}else{nl=tinyMCE.selectNodes(b,function(n){return n.nodeType==1&&n.nodeName=='SPAN'&&n.className=='mceItemHiddenVisualChar'});for(i=0;i<nl.length;i++)tinyMCE.setOuterHTML(nl[i],nl[i].innerHTML.replace(/(&middot;|\u00b7)/g,'&nbsp;'),d)}}};tinyMCE.addPlugin("visualchars",TinyMCE_VisualCharsPlugin);
=======
(function(){tinymce.create("tinymce.plugins.VisualChars",{init:function(a,b){var c=this;c.editor=a;a.addCommand("mceVisualChars",c._toggleVisualChars,c);a.addButton("visualchars",{title:"visualchars.desc",cmd:"mceVisualChars"});a.onBeforeGetContent.add(function(d,e){if(c.state){c.state=true;c._toggleVisualChars()}})},getInfo:function(){return{longname:"Visual characters",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/visualchars",version:tinymce.majorVersion+"."+tinymce.minorVersion}},_toggleVisualChars:function(){var m=this,g=m.editor,a,e,f,k=g.getDoc(),l=g.getBody(),j,n=g.selection,c;m.state=!m.state;g.controlManager.setActive("visualchars",m.state);if(m.state){a=[];tinymce.walk(l,function(b){if(b.nodeType==3&&b.nodeValue&&b.nodeValue.indexOf("\u00a0")!=-1){a.push(b)}},"childNodes");for(e=0;e<a.length;e++){j=a[e].nodeValue;j=j.replace(/(\u00a0+)/g,'<span class="mceItemHidden mceVisualNbsp">$1</span>');j=j.replace(/\u00a0/g,"\u00b7");g.dom.setOuterHTML(a[e],j,k)}}else{a=tinymce.grep(g.dom.select("span",l),function(b){return g.dom.hasClass(b,"mceVisualNbsp")});for(e=0;e<a.length;e++){g.dom.setOuterHTML(a[e],a[e].innerHTML.replace(/(&middot;|\u00b7)/g,"&nbsp;"),k)}}}});tinymce.PluginManager.add("visualchars",tinymce.plugins.VisualChars)})();
>>>>>>> deploy
