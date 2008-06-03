var day_start = 13;
var day_end = 21;

var width = 10;
var unit_height = 16;
var unit_time = 30 * 60; // in seconds


Event.onDOMReady(function() {
});

function update_calendar(id, checkbox) {
	if (checkbox.checked) {
		render_schedule(id);
	} else {
			images = $$('img.bar_' + id);
		images.each(function(i) {
			i.remove();
		});
	}
}

function render_schedule(student_id) {
	var url = "/admin/summer_student_json/" + student_id + "?day_start=" + day_start + "&day_end=" + day_end;

	var student;

	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			student = transport.responseText.evalJSON();
			
			student.events.each(function(e) {
				var start = e[0];
				var end = e[1];

				var block_start = (start - (start % 1800));

				var div = "t" + block_start;
				var es = start + "-" + end;
				var img = "http://kgfamily.com/scripts/calendarbar.php?w=" + width + "&amp;uh=" + unit_height + "&amp;ut=" + unit_time + "&amp;c=" + "ff6666" + "&amp;ds=" + block_start + "&amp;es=" + es;

				$(div).insert('<img class="calendar_bar bar_' + student_id + '" src="' + img + '" />');
			});
	  	}
	});

}