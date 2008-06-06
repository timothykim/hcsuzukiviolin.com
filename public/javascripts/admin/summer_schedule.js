var day_start = 7;
var day_end = 21;
var number_of_weeks = 12;

var width = 10;
var unit_height = 16;
var unit_time = 30 * 60; // in seconds

var students = [];

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
	Event.observe(window, 'scroll', function() {
		if (window.scrollY > 190) {
			$('side_list').style.top = (window.scrollY - 190) + "px";
		} else {
			$('side_list').style.top = 0;
		}
	});
});


var ser;

function add_lesson() {
	ser = $('add_lesson').serialize(true);
	
	/*
	$('add_lesson').request({
		onComplete: function(transport){ 
			//
		}
	});
	*/
}

function hide_dialog() {
	$('event_dialog').hide();
}

function show_lesson_dialog(name, color, str, schedule_id, duration) {
	var clicky = tempY;
	
	clicky -= 232; //header
	
	var t_count = Math.floor(((clicky % 467) - 20) / 16); //number of thirty minutes since 7 am
	var time = (day_start * 60) + (t_count * 30);
	time = time / 60;
	
	var p = "am";
	if (time >= 12) {
		if (time >= 13) {
			time -= 12;			
		}
		p = "pm";
	}
	
	if (time % 1 == 0) {
		time = time + ":00" + p;
	} else {
		time = Math.floor(time) + ":30" + p;		
	}


	$('mouseover_name').style.display = "none";
	
	var d = $('event_dialog');	
	
	d.style.left = (tempX - 150) + "px";
	d.style.top = (tempY + 30) + "px";
	d.style.borderColor = "#" + color;
	
	d.style.display = "block";
	
	$('dialog_time').value = time;
//	$('dialog_time_start').update(time);
	$('dialog_name').update(name);
	$('dialog_schedule_id').value = schedule_id;
	$('dialog_time').focus();
	$('dialog_duration_str').update(duration);
	$('dialog_duration').value = duration;
}

function highlight_div(div, color) {
	$(div).style.backgroundColor = color;
}


function update_calendar(id, checkbox) {
	if (checkbox.checked) {
		images = $$('img.bar_' + id);
		if (images.length == 0) {
			render_schedule(id);
		} else {
			images.each(function(i) {
				i.show();
			});
		}
	} else {
		images = $$('img.bar_' + id);
		images.each(function(i) {
			i.hide();
		});
	}
}

function hidename(name, color) {
	var d = $('mouseover_name');
	//Effect.Fade(d, { duration: 0.1 });

	d.style.display = "none";
}

function showname(name, color, str) {
	var d = $('mouseover_name');

	d.style.left = (tempX + 10) + "px";
	d.style.top = (tempY + 10) + "px";
	
	d.style.borderColor = "#" + color;
	d.update(name + "<br /><small>" + str + "</small>");

	d.style.display = "inline";//, { duration: 0.1 });
}

function render_schedule(student_id) {
	var url = "/admin/summer_student_json/" + student_id + "?day_start=" + day_start + "&day_end=" + day_end;

	var student;

	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			student = transport.responseText.evalJSON();
			
			if (student.events.length == 0) {
				alert("Uh oh!\n" + student.name + "'s schedule doesn't fits into your schedule at all!");
			}
			
			student.events.each(function(e) {
				var start = e.start;
				var end = e.finish;

				var block_start = (start - (start % 1800));

				var div = "t" + block_start;
				var es = start + "-" + end;
				var img = "http://kgfamily.com/scripts/calendarbar.php?w=" + width + "&amp;uh=" + unit_height + "&amp;ut=" + unit_time + "&amp;c=" + colors[student_id % 21] + "&amp;ds=" + block_start + "&amp;es=" + es;


				var html = '<img style="cursor: pointer;" onclick="show_lesson_dialog(\'' + student.name + '\', colors[' + student_id + ' % 21], \'' + e.string + '\', \'' + e.schedule_id + '\', \'' + student.duration + '\');" onmouseout="hidename();" onmouseover="showname(\'' + student.name + '\', colors[' + student_id + ' % 21], \'' + e.string + '\');" class="calendar_bar bar_' + student_id + '" src="' + img + '" />';

				$(div).insert(html);
			});
	  	}
	});

}


document.captureEvents(Event.MOUSEMOVE)

// Set-up to use getMouseXY function onMouseMove
document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0;
var tempY = 0;

var show_time = true;
// Main function to retrieve mouse x-y pos.s

function getMouseXY(e) {
  tempX = e.pageX;
  tempY = e.pageY;

  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0;}
  if (tempY < 0){tempY = 0;}  

	var clicky = tempY;
	
	clicky -= 232; //header
	
	var t_count = Math.floor(((clicky % 467) - 20) / 16); //number of thirty minutes since 7 am
	var time = (day_start * 60) + (t_count * 30);
	time = time / 60;
	
	var army_time = time;
	var p = "am";
	if (time >= 12) {
		if (time >= 13) {
			time -= 12;			
		}
		p = "pm";
	}
	
	if (time % 1 == 0) {
		time_str = time + ":00" + p;
	} else {
		time_str = Math.floor(time) + ":30" + p;		
	}
	
	
	if (army_time >= day_start && army_time < day_end && tempX > 308 && show_time) {
		$('xy').style.display = "block";
		$('xy').update(time_str);
		$('xy').style.top = tempY - 60 + "px";
		$('xy').style.left = tempX - 100 + "px";
	} else {
		$('xy').style.display = "none";
		
	}
	
  


  return true;
}


