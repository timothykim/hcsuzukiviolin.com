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

function hidename(name, color) {
	var d = $('mouseover_name');
	Effect.Fade(d, { duration: 0.2 });

}

function showname(name, color, str) {
	var d = $('mouseover_name');

	d.style.left = (tempX + 10) + "px";
	d.style.top = (tempY + 10) + "px";
	
	d.style.borderColor = "#" + color;
	d.update(name + "<br /><small>" + str + "</small>");

	Effect.Appear(d, { duration: 0.2 });
}

function render_schedule(student_id) {
	var url = "/admin/summer_student_json/" + student_id + "?day_start=" + day_start + "&day_end=" + day_end;

	var student;

	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			student = transport.responseText.evalJSON();
			
			if (student.events.length == 0) {
				alert("The Student you selected has no time that fits into your schedule.");
			}
			
			student.events.each(function(e) {
				var start = e[0];
				var end = e[1];

				var block_start = (start - (start % 1800));

				var div = "t" + block_start;
				var es = start + "-" + end;
				var img = "http://kgfamily.com/scripts/calendarbar.php?w=" + width + "&amp;uh=" + unit_height + "&amp;ut=" + unit_time + "&amp;c=" + colors[student_id % 21] + "&amp;ds=" + block_start + "&amp;es=" + es;

				$(div).insert('<img onmouseout="hidename();" onmouseover="showname(\'' + student.name + '\', colors[' + student_id + ' % 21], \'' + student.display_str + '\');" class="calendar_bar bar_' + student_id + '" src="' + img + '" />');
			});
	  	}
	});

}


document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0
var tempY = 0

// Main function to retrieve mouse x-y pos.s

function getMouseXY(e) {
  tempX = e.pageX
  tempY = e.pageY

  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0}
  if (tempY < 0){tempY = 0}  

  return true
}