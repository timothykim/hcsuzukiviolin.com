//global settings
var TIMEBAR_WIDTH = 10;
var UNIT_HEIGHT = 16; // single time block = 16 pixels high
var UNIT_TIME = 30 * 60; // unit_height = 30 minutes or 1800 seconds
var HEADER_SIZE = 0; // starting position of the tobody in pixels, actual initialization done in onDOMReady
var WEEK_BLOCK_SIZE = 0; //height of single week tr, see onDOMReady
var DATE_DISPLAY_SIZE = 0; // mm/yy height, see onDOMReady

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

  // Set-up to use getMouseXY function onMouseMove
  Event.observe(document, 'mousemove', getMouseXY);

//  Event.observe(window, 'scroll', adjust_side_control_position_height);
  Event.observe(window, 'resize', function() {
    maximized = false;
//    adjust_side_control_position_height();
    adjust_lesson_width();
  });

//  adjust_side_control_position_height();
  
  load_lessons();

  $('summary_calendar_button').observe('click', toggle_summary_calendar);
});

var maximized = false;
function adjust_side_control_position_height() {
  if(window.scrollY > HEADER_SIZE - 30) {
    $('side_list').style.top = (window.scrollY - (HEADER_SIZE - 30)) + "px";

    if(!maximized) {
      $('side_list').style.height = document.viewport.getHeight() - 15 + 'px';
      $('student_list').style.height = $('side_list').getHeight() - $('other_stuff').getHeight() - 50 + 'px';
      maximized = true;
    }
  } else {
    maximized = false;
    $('side_list').style.top = 0;

    var offset = $('side_list').viewportOffset()[1] + 12;

    $('side_list').style.height = document.viewport.getHeight() - offset + 'px';
    $('student_list').style.height = $('side_list').getHeight() - $('other_stuff').getHeight() - 50 + 'px';
  }
}


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


function render_registration(registration_id) {
  var url = "/admin/registration/get_json/" + registration_id +
              "?day_start=" + DAY_START + "&day_end=" + DAY_END;
  var student;
  new Ajax.Request(url, {
    method: 'get',
    onSuccess: function(transport) {
      data = transport.responseText.evalJSON();

      if (data.timeranges.length == 0) {
        //("Uh oh!\n" + data.student.first_name + " " + data.student.last_name + "'s registration is empty!");
      }

      data.timeranges.each(function(range) {
        render_timerange(range, registration_id, data);
      });
    }
  });
}

function render_timerange(range, registration_id, data) {
  var start = range.start;
  var end = range.finish;

  //crop start and end time
  var temp = new Date();
  temp.setTime(start * 1000);
  if (temp.getHours() < DAY_START) {
    start = Math.floor(temp.setHours(DAY_START) / 1000);
  }
  temp.setTime(end * 1000);
  if (temp.getHours() > DAY_END+1) {
    end = Math.floor(temp.setHours(DAY_END+1) / 1000);
  }

  var block_start = (start - (start % UNIT_TIME)); //case when their start time is not on the hour or the half

  var div = "t" + block_start;
  var es = start + "-" + end;
  var preferred = (range.preferred) ? "1" : "0";
  var src = get_calendar_bar_image_url(data.color, block_start, start, end, preferred);
  var thin_src = get_thin_calendar_bar_image_url(data.color, block_start, start, end);
  var style = "cursor: pointer;";
  var insert_div = $(div);
  var thin_insert_div = $('sum' + (block_start - (block_start % (2 * UNIT_TIME))));

  var img = new Element("img", {
        'style': style,
        'class': "calendar_bar " + "bar_" + registration_id,
        'src'  : src
      });

  var thin_img = new Element("img", {
        'class': "thin_calendar_bar " + "bar_" + registration_id,
        'src'  : thin_src
      });

  /*
  var img = '<img src="'+src+'" class="calendar_bar bar_' + registration_id + '" style="' + style + '" />';
  var thin_img = '<img src="'+src+'" class="calendar_bar bar_' + registration_id + '" '" />';
  */

  var d = $('xy');
  var old_color = d.style.borderColor;

  img.observe('mouseover', function(event) {
    d.show();
	d.style.borderColor = "#" + data.color;
	$('mouseover_name').update(data.student.first_name + " " + data.student.last_name + " <small>(" + range.string + ")</small>");
    $('mouseover_name').show();
    //Effect.Grow('mouseover_name', {'direction': 'top-left', 'duration': 0.2});
  });

  img.observe('mouseout', function(event) {
    if(!show_time) {
      $('xy').hide();
    }
    $('mouseover_name').hide();
    //Effect.Shrink('mouseover_name', {'direction': 'top-left', 'duration': 0.2});
    d.style.borderColor = old_color;
  });

  img.observe('click', function(event) {
      show_lesson_dialog(data, start, img);
  });

  insert_div.insert(img);
  thin_insert_div.insert(thin_img);
}

function add_lesson() {
  $('add_lesson').request({
    onComplete: function(transport) { 
      var lesson = transport.responseText.evalJSON();
      show_lesson(lesson);
      hide_lesson_dialog();

      update_count(lesson.r_id);
    }
  });
}

function update_count(r_id) {
  var count = $('lesson_count_' + r_id);
  var lessons = $$('div.r_id_' + r_id);
  count.update(lessons.length);
  /*
  for (var i = 0; i < lessons.length; i++) {
    var name = lessons[i].down('span.n');
    name.update('[' + (i+1) + '] ' + name.text);
  }
  */
}


function show_lesson(lesson) {
  var lesson_bar = new Element('div', { 'id': lesson.id, 'class': 'r_id_' + lesson.r_id + ' lesson_bar', 'title': lesson.full_name });
  var lesson_text = new Element('span', { 'class' : 'lesson_text' });
  var name = new Element('span', { 'id' : 'lesson' + lesson.start, 'class' : 'n', 'style' : 'font-weight: bold;' });
  var time = new Element('span');
  var del = new Element('a', {'href' : '#', 'style' : 'color: #900;'});

  var id = lesson.start - (lesson.start % (30 * 60));
  var outer_div = $('t' + id);

  //the lesson doesn't belong in this calendar, get it out of here
  if (outer_div == null) return;

  lesson_bar.setStyle({
    'width' : outer_div.getWidth() - 2 + 'px',
    'height' : sec2pixel(lesson.duration * 60) - 4 + 'px', // -4 is for borders
    'margin-top' : sec2pixel(lesson.start - id) + 'px',
    'position' : 'absolute',
    'display' : 'none'
  });
  lesson_bar.style.backgroundColor = '#' + lesson.color,

  name.update(lesson.student_name);
  time.update(": " + lesson.time + " | ");
  del.update("x");
  del.observe("click", function(event) {
    if(confirm('Are you sure you want to delete this lesson?')) {
      new Ajax.Request("/admin/registration/delete_lesson/" + lesson.id, {
        method: 'get', //this is bad.. but oh well
        onSuccess: function(transport) {
          Effect.Fade(lesson_bar, {
            afterFinish: function() { update_count(lesson.r_id); }
          });
        }
      });
    }
    Event.stop(event);
  });

  lesson_text.insert(name);
  lesson_text.insert(time);
  lesson_text.insert(del);
  lesson_bar.update(lesson_text);
  outer_div.update(lesson_bar);
  Effect.Appear(lesson_bar);
}

/*
var static_load_counter = 0;
var static_load_message_stack = [];
function add_loading_message(str) {
  var l = $('loading_wrapper');
  if (l.style.display == 'none') {
//    Effect.Grow('loading_wrapper');
    l.show();
  }
  $('loading_message').update(str);
  static_load_message_stack.push(str);
  static_load_counter++;
}

function done_loading() {
  static_load_message_stack.pop(str);
  static_load_counter--;

  if (static_load_counter == 0) {
//    Effect.Shrink('loading_wrapper');
    l.hide();
  } else {
    $('loading_message').update(static_load_message_stack[static_load_message_stack.length-1]);
  }
}
*/


function load_lessons() {
  var url = "/admin/session/lessons_json/" + SESSION_ID;
  new Ajax.Request(url, {
    method: 'get',
    onSuccess: function(transport) {
      lessons = transport.responseText.evalJSON();
      lessons.each(function(lesson) {
        show_lesson(lesson);
      });
    }
  });
}

function adjust_lesson_width() {
	$$('div.lesson_bar').each(function(bar) {
		bar.style.width = (bar.up('div').getWidth() - 2) + "px";
	});	
}

function show_lesson_list(r_id) {
  var url = "/admin/registration/lessons_json/" + r_id;
  new Ajax.Request(url, {
    method: 'get',
    onSuccess: function(transport) {
      lessons = transport.responseText.evalJSON();

      var lesson_div = $('lesson_list_' + r_id);
      Effect.Appear(lesson_div, {duration: 0.3});

      var list = lesson_div.down('ol');
      list.replace('<ol></ol>');
      list = lesson_div.down('ol');

      lessons.each(function(lesson) {
        list.insert('<li onclick="Effect.ScrollTo(\'lesson' + lesson.start + '\', {duration: 0.5});" style="cursor:pointer;">' + lesson.date + " " + lesson.time + "</li>"); 
      });
    }
  });
}


function sec2pixel(sec) {
  return Math.round((sec / UNIT_TIME) * UNIT_HEIGHT);
}

function hide_lesson_dialog() {
  Effect.Fade('event_dialog',{duration: 0.3});
  return false;
}


function show_lesson_dialog(data, time, bar) {
  //time is the start timestamp of the img, it is used to figure out the date of this lesson
  var d = $('event_dialog');

  var t = getTimeUnderCursor();
  $('dialog_time').value = formatTime(t);
  $('dialog_name').update(data.student.first_name + " " + data.student.last_name);
  $('dialog_duration').value = data.registration.lesson_duration;
  var today = new Date(time * 1000);
  $('dialog_date').value = today.toLocaleDateString();


  d.style.left = (tempX - d.getWidth() - 20) + "px";
  d.style.top = (tempY - 30) + "px";
  d.style.borderColor = "#" + data.color;

  Effect.Appear(d, {duration: 0.3});
  $('registration_id').value = data.registration.id;
  $('add_lesson').observe('submit', function(event) {
      add_lesson();
      Event.stop(event);
  });
}

function toggle_summary_calendar() {
  var uparrow = "&#8685;";
  var downarrow = "&#8686;";

  Effect.toggle('summary_calendar_table', 'blind', {duration: 0.3});
  var s = $('summary_calendar_button');
  if ($('summary_calendar_table').style.display == "none") {
    s.update(downarrow);
  } else {
    s.update(uparrow);
  }
}

function get_thin_calendar_bar_image_url(color, block_start, start, end) {
  return img = "http://kgfamily.com/scripts/calendarbar.php?w=" + 2 + "&uh=" + 1 + "&ut=" + (2*UNIT_TIME) + "&c=" + color + "&ds=" + block_start + "&es=" + start + "-" + end + "&sp=0";
}

function get_calendar_bar_image_url(color, block_start, start, end, preferred) {
  return img = "http://kgfamily.com/scripts/calendarbar.php?w=" + TIMEBAR_WIDTH + "&uh=" + UNIT_HEIGHT + "&ut=" + UNIT_TIME + "&c=" + color + "&ds=" + block_start + "&es=" + start + "-" + end + "&sp=" + preferred;
}

function getTimeUnderCursor() {
  var click_y = tempY;
  
  click_y -= HEADER_SIZE; //account for header
  
  var t_count = Math.floor(((click_y % WEEK_BLOCK_SIZE) - DATE_DISPLAY_SIZE) / UNIT_HEIGHT); //number of thirty minutes since 7 am
  var time = (DAY_START * 60) + (t_count * 30); //in minutes
  time = time / 60;
  return time;
}
  
function formatTime(time) {
  var p = "AM";
  if (time >= 12) {
    if (time >= 13) {
      time -= 12;      
    }
    p = "PM";
  }

  var time_str;
  if (time % 1 == 0) {
    time_str = time + ":00" + p;
  } else {
    time_str = Math.floor(time) + ":30" + p;    
  }

  if (time < 10) {
    time_str = "0" + time_str;
  }
  return time_str;
}

function getMouseXY(e) {
  tempX = e.pageX;
  tempY = e.pageY;

  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0;}
  if (tempY < 0){tempY = 0;}  

  var army_time = getTimeUnderCursor();
  var time_str = formatTime(army_time);

  var xy = $('xy');
  var totalwidth = document.viewport.getWidth();
  
  if (army_time >= DAY_START && army_time < DAY_END+1 && tempX > 256 && show_time) {
    $('time').update(time_str);
    xy.style.top = tempY + 20 + "px";

    if (tempX + 15 + xy.getWidth() + 12 > totalwidth) {
      xy.style.left = totalwidth - (xy.getWidth() + 12) + "px";
    } else {
      xy.style.left = tempX + 15 + "px";
    }
    xy.show();
  } else {
    xy.hide();
  }

  return true;
}
