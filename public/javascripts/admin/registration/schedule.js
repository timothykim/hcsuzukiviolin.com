//global settings
var TIMEBAR_WIDTH = 10;
var UNIT_HEIGHT = 16; // single time block = 16 pixels high
var UNIT_TIME = 30 * 60; // unit_height = 30 minutes or 1800 seconds
var HEADER_SIZE = 0; // starting position of the tobody in pixels, actual initialization done in onDOMReady
var WEEK_BLOCK_SIZE = 0; //height of single week tr, see onDOMReady
var DATE_DISPLAY_SIZE = 0; // mm/yy height, see onDOMReady

// Set-up to use getMouseXY function onMouseMove
document.captureEvents(Event.MOUSEMOVE)
document.onmousemove = getMouseXY;

// Temporary variables to hold mouse x-y pos.s
var tempX = 0;
var tempY = 0;

//option variable
var show_time = true;

// Main function to retrieve mouse x-y pos.s
Event.onDOMReady(function() {
  //update options
  HEADER_SIZE = $("tbody_start").positionedOffset()[1];
  WEEK_BLOCK_SIZE = $("week1").getHeight();
  DATE_DISPLAY_SIZE = $$("div.date")[0].getHeight() + 2;

  Event.observe(window, 'scroll', function() {
    if (window.scrollY > 190) {
      $('side_list').style.top = (window.scrollY - 190) + "px";
    } else {
      $('side_list').style.top = 0;
    }
  });
});


function update_calendar(id, checkbox) {
	if (checkbox.checked) {
		images = $$('img.bar_' + id);
		if (images.length == 0) {
			render_registration(id);
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


function render_schedule(registration_id) {
	var url = "/admin/registration/schedule/" + registration_id +
              "?day_start=" + DAY_START + "&day_end=" + DAY_END;
	var student;
	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			registration = transport.responseText.evalJSON();
			if (registration.events.length == 0) {
				alert("Uh oh!\n" + registration.student.name + "'s schedule doesn't fits into your schedule at all!");
			}
			registration.timerange.each(function(e) {
				render_single_event(e, registration_id, registration.student.name, registration.lesson.duration, registration.color);
			});
	  	}
	});
}

function render_timerange_event(e, registration_id, student_name, duration, color) {
	var start = e.start;
	var end = e.finish;

	var block_start = (start - (start % 1800));

	var div = "t" + block_start;
	var es = start + "-" + end;
	var img = get_calendar_bar_image_url(color, block_start, start, end);
    //"http://kgfamily.com/scripts/calendarbar.php?w=" + width + "&amp;uh=" + unit_height + "&amp;ut=" + unit_time + "&amp;c=" + colors[student_id % 21] + "&amp;ds=" + block_start + "&amp;es=" + es;

	var style = "";
	var insert_div = $(div);
/*	
	if (insert_div.childElements().length == 1) {
		var top_div = insert_div.childElements()[0]
		var height = top_div.getHeight();
		style = "top: -" + (height + parseInt(top_div.style.marginTop))+ "px;";
	}
*/
	var html = '<img style="cursor: pointer; ' + style + '" onclick="show_lesson_dialog(\'' + student_name + '\', colors[' + student_id + ' % 21], \'' + e.string + '\', \'' + e.schedule_id + '\', \'' + duration + '\');" onmouseout="hidename();" onmouseover="showname(\'' + student_name + '\', colors[' + student_id + ' % 21], \'' + e.string + '\');" class="calendar_bar bar_' + student_id + '" src="' + img + '" />';
	insert_div.insert(html);
}


function get_calendar_bar_image_url(color, block_start, start, end) {
	return img = "http://kgfamily.com/scripts/calendarbar.php?w=" + TIMEBAR_WIDTH + "&amp;uh=" + UNIT_HEIGHT + "&amp;ut=" + UNIT_TIME + "&amp;c=" + colors[student_id % 21] + "&amp;ds=" + block_start + "&amp;es=" + start + "-" + end;
}


function getMouseXY(e) {
  tempX = e.pageX;
  tempY = e.pageY;

  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0;}
  if (tempY < 0){tempY = 0;}  

	var clicky = tempY;
	
	clicky -= HEADER_SIZE; //account for header
	
	var t_count = Math.floor(((clicky % WEEK_BLOCK_SIZE) - DATE_DISPLAY_SIZE) / UNIT_HEIGHT); //number of thirty minutes since 7 am
	var time = (DAY_START * 60) + (t_count * 30); //in minutes
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
	
	
	if (army_time >= DAY_START && army_time < DAY_END+1 && tempX > 256 && show_time) {
		$('xy').style.display = "block";
		$('xy').update(time_str);
		$('xy').style.top = tempY + 15 + "px";
		$('xy').style.left = tempX + 15 + "px";
	} else {
		$('xy').style.display = "none";
		
	}

  return true;
}
