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

function close_lesson_list(id) {
	Effect.Fade($('lesson_list_' + id), { duration: 0.5 });
}

function show_lesson_list(id) {
	var url = "/admin/get_lesson_list_json/" + id;
	
	$$('div.lesson_list').each(function(e) {
		if(e.visible()) {
			Effect.Fade(e, { duration: 0.5 });			
		}
	});
	
	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			var data = transport.responseText.evalJSON();
			
			var lesson_div = $('lesson_list_' + id);
			lesson_div.style.display = "block";

			lesson_div.down('ul').remove();
			lesson_div.insert('<ul></ul>');

			var list = lesson_div.down('ul');
			
			data.lessons.each(function(lesson) {
				list.insert("<li>" + lesson + "</li>");
			});
		}
	});
}

function get_color(id) {
	return colors[id % 21];
}

function get_calendar_bar_image_url(color, block_start, start, end) {
	return img = "http://kgfamily.com/scripts/calendarbar.php?w=" + width + "&amp;uh=" + unit_height + "&amp;ut=" + unit_time + "&amp;c=" + colors[student_id % 21] + "&amp;ds=" + block_start + "&amp;es=" + start + "-" + end;
}


function add_lesson() {	
	$('add_lesson').request({
		onComplete: function(transport){
			var data = transport.responseText.evalJSON();
			hide_dialog();
			var div = '<div class="lesson_bar" style="margin-top: ' + data.offset + 'px; height: ' + (data.duration - 3 - 1) + 'px; background-color: #' + get_color(data.student_id) + '"><span class="lesson_text" style="position: absolute;">' + data.string + '</span></div>';

			if (data.update) {
				$(data.prev_block).down('div').remove();
			} else {
				var count = $('lesson_count_' + data.student_id).down('a');				
				count.update(parseInt(count.innerHTML) + 1);
			}
			
			$(data.block).insert(div);
			
			data.image_blocks.each(function(b) {
				Effect.Fade($(b).down('img'), { duration: 0.5, afterFinish: function() { $(b).down('img').remove() } });
			});
		}
	});
	return false;
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

function render_single_event(e, student_id, student_name, duration) {
	var start = e.start;
	var end = e.finish;

	var block_start = (start - (start % 1800));

	var div = "t" + block_start;
	var es = start + "-" + end;
	var img = "http://kgfamily.com/scripts/calendarbar.php?w=" + width + "&amp;uh=" + unit_height + "&amp;ut=" + unit_time + "&amp;c=" + colors[student_id % 21] + "&amp;ds=" + block_start + "&amp;es=" + es;


	var style = "";
	
	var insert_div = $(div);
	
	if (insert_div.childElements().length == 1) {
		var top_div = insert_div.childElements()[0]
		var height = top_div.getHeight();
		style = "top: -" + (height + parseInt(top_div.style.marginTop))+ "px;";
	}

	var html = '<img style="cursor: pointer; ' + style + '" onclick="show_lesson_dialog(\'' + student_name + '\', colors[' + student_id + ' % 21], \'' + e.string + '\', \'' + e.schedule_id + '\', \'' + duration + '\');" onmouseout="hidename();" onmouseover="showname(\'' + student_name + '\', colors[' + student_id + ' % 21], \'' + e.string + '\');" class="calendar_bar bar_' + student_id + '" src="' + img + '" />';

	insert_div.insert(html);
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
				render_single_event(e, student_id, student.name, student.duration);
			});
	  	}
	});

}

function render_schedule_day(student_id, day) {
	if (!$('st_check_' + student_id).checked) {
		return;
	}
	
	var url = "/admin/summer_student_json/" + student_id + "?day_start=" + day_start + "&day_end=" + day_end + "&day=" + day;
	
	var student;

	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			student = transport.responseText.evalJSON();
			
			if (student.events.length == 0) {
				alert("Uh oh!\n" + student.name + "'s schedule doesn't fits into your schedule at all!");
			}
			
			student.events.each(function(e) {
				render_single_event(e, student_id, student.name, student.duration);
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


