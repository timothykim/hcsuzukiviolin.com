function close_lesson_list(id) {
	Effect.Fade($('lesson_list_' + id), { duration: 0.5 });
}

function show_lesson_list(id) {
	Effect.Appear($('lesson_list_' + id), { duration: 0.5 });	
}

Event.onDOMReady(function() {
	Event.observe(window, 'scroll', function() {
		if (window.scrollY > 190) {
			$('side_list').style.top = (window.scrollY - 190) + "px";
		} else {
			$('side_list').style.top = 0;
		}
	});
});