Event.onDOMReady(function() {
	if(!window.XMLHttpRequest) {
		$$('a.listimage_anchor').each(function (a){
			a.innerHTML = '<img src="/images/frame-photobook-trans.gif" />';
		});
	}
});