Event.onDOMReady(function() {
	var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
	if(IE6) {
		$$('a.listimage_anchor').each(function (a){
			a.innerHTML = '<img src="/images/frame-photo-trans.gif" />';
		});
	}
});