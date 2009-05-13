function updateCalendar(id) {
	if(id == 0) return;
	
	url = "/register/get_registered_date/" + id;
	
	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			var data = transport.responseText.evalJSON();
			for (var date_id in data) {
				$(date_id).value = data[date_id].join(",\n");
			}
		}
	});
}

Event.onDOMReady(function() {
	updateCalendar(registration_id);
});