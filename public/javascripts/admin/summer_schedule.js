var day_start = 13;
var day_end = 21;

var width = 10;
var unit_height = 16;
var unit_time = 30 * 60; // in seconds

var colors = [
				"CC3333",
				"DD4477",
				"994499",
				"6633CC",
				"336699",
				"3366CC",
				"22AA99",
				"329262",
				"0F9618",
				"66AA00",
				"AAAA11",
				"D6AE00",
				"EE8800",
				"DD5511",
				"A87070",
				"8C6D8C",
				"627487",
				"7083A8",
				"5C8D87",
				"898951",
				"B08B59" 
			];

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
				var img = "http://kgfamily.com/scripts/calendarbar.php?w=" + width + "&amp;uh=" + unit_height + "&amp;ut=" + unit_time + "&amp;c=" + colors[student_id % 21] + "&amp;ds=" + block_start + "&amp;es=" + es;

				$(div).insert('<img class="calendar_bar bar_' + student_id + '" src="' + img + '" />');
			});
	  	}
	});

}