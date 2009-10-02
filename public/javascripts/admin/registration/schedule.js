//global settings
var TIMEBAR_WIDTH = 10;
var UNIT_HEIGHT = 16; // single time block = 16 pixels high
var UNIT_TIME = 30 * 60; // unit_height = 30 minutes or 1800 seconds
var HEADER_SIZE = 0; // starting position of the tobody in pixels, actual initialization done in onDOMReady
var WEEK_BLOCK_SIZE = 0; //height of single week tr, see onDOMReady
var DATE_DISPLAY_SIZE = 0; // mm/yy height, see onDOMReady
var REGISTRATIONS;
var LEFT_MARGIN = 68;

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
  if (SESSION_TYPE == "date") {
    DATE_DISPLAY_SIZE = $$("div.date")[0].getHeight() + 2;
  } else {
    LEFT_MARGIN = 36;
  }

  // Set-up to use getMouseXY function onMouseMove
  Event.observe(document, 'mousemove', getMouseXY);

  Event.observe(window, 'resize', function() {
    maximized = false;
    adjust_lesson_width();
  });
  var widgets = $$('div.widget');
  widgets.each(function(widget) {
    widget.observe('mouseover', function() { show_time = false; });
    widget.observe('mouseout', function() { show_time = true; });
    if (widget.hasClassName('controls')) {
      widget.down('.min_max').observe('click', function() { toggle_widget(widget); });
      widget.down('.swap').observe('click', function() { swap_widgets(widgets); });
    }
  });


  var selectors = $$('input.bar_selector');
  selectors.each(function(selector) {
    selector.observe('change', function() {
      toggle_bars();
    });
  });

  $('check_all').observe('change', function() {
    if(this.value) {
      $$('input.bar_selector').each(function(img) { img.checked = "true"; });
    } else {
      $$('input.bar_selector').each(function(img) { img.checked = false; });
    }
    toggle_bars();
  });

  $('add_lesson').observe('submit', function(event) {
      Event.stop(event);
      add_lesson();
  });

  load_registrations();
  load_lessons();
});

function toggle_bars() {
  var selectors = $$('input.bar_selector');
  selectors.each(function(selector) {
    var r_id = selector.title;
    if(selector.value) {
      $$('img.bar_' + r_id).each(function(img) { img.show(); });
    } else {
      $$('img.bar_' + r_id).each(function(img) { img.hide(); });
    }
  });
}

function swap_widgets(widgets) {
  widgets.each(function(widget) {
    if (widget.hasClassName('left')) {
      widget.removeClassName('left');
      widget.addClassName('right');
    } else 
    if (widget.hasClassName('right')) {
      widget.removeClassName('right');
      widget.addClassName('left');
    }
  });  
}


/*
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
*/

/*
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
*/

/*
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
*/
/*
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

  //var img = '<img src="'+src+'" class="calendar_bar bar_' + registration_id + '" style="' + style + '" />';
  //var thin_img = '<img src="'+src+'" class="calendar_bar bar_' + registration_id + '" '" />';

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
*/

function time_bar_mouseover(data_id) {
  try {
    data = REGISTRATIONS[data_id];
    var d = $('xy');
    d.show();
    d.style.borderColor = "#" + data.color;
    $('mouseover_name').update("<div class=\"pname\">" + data.parent_name + "'s</div>" + data.student_name + " <small>" + data.user_input + "</small><div class=\"comment\">" + data.student_comment +"</div>");
    $('mouseover_name').show();
  } catch (err) {
    // no need to do anythingg
  }
}

function time_bar_mouseout() {
  var d = $('xy');
  if(!show_time) {
    d.hide();
  }
  $('mouseover_name').hide();
  d.style.borderColor = "orange";
}

function time_bar_click(data_id) {
  data = REGISTRATIONS[data_id];
  show_lesson_dialog(data);
}

function load_registrations() {
  start_loading("load_registrations", "Retreiving parent's registrations...");

  new Ajax.Request("/admin/registration/get_all/" + SESSION_ID, {
    method: 'get',
    onSuccess: function(transport) {
      REGISTRATIONS = transport.responseText.evalJSON();
      done_loading("load_registrations");
    }
  });
}
  /*
function activate_time_bars() {
  var d = $('xy');
  var old_color = d.style.borderColor;
  var l = $('loading_wrapper');
  l.show();

  new Ajax.Request("/admin/registration/get_all/" + SESSION_ID, {
    method: 'get',
    onSuccess: function(transport) {
      registrations = transport.responseText.evalJSON();

      $$('img.calendar_bar').each( function (bar) {
        var id = bar.readAttribute('alt');
        var data = registrations[id];

        bar.observe('mouseover', function(event) {
          d.show();
          d.style.borderColor = "#" + data.color;
          $('mouseover_name').update(data.student_name + " <small>(" + data.user_input + ")</small>");
          $('mouseover_name').show();
        });

        bar.observe('mouseout', function(event) {
          if(!show_time) {
            $('xy').hide();
          }
          $('mouseover_name').hide();
          d.style.borderColor = old_color;
        });

        bar.observe('click', function(event) {
          show_lesson_dialog(data);
        });
      });
      l.hide();
    }
  });
}

  */
function add_lesson() {
  $('add_lesson').request({
    onComplete: function(transport) { 
      var lesson = transport.responseText.evalJSON();
      if (lesson.error) {
        Effect.Shake('event_dialog', {duration: 0.2, distance: 5})
      } else {
        show_lesson(lesson);
        hide_lesson_dialog();

        update_count(lesson.r_id);
        show_lesson_list(lesson.r_id, lesson.full_name);
      }
    }
  });
}

function update_count(r_id) {
  var count = $('count_' + r_id);
  var lessons = $$('div.r_id_' + r_id);
  count.update(lessons.length);

  var lesson_numbers = $$('div.numbering_' + r_id);
  for(var i = 0; i < lesson_numbers.length; i++) {
    bar = lesson_numbers[i];
    bar.update((i+1) + "/" + lesson_numbers.length);
  }
}

function pad_zero(num) {
  if (num < 10) {
    return "0" + num;
  }
  return "" + num;
}

function show_lesson(lesson) {

  var lesson_bar = new Element('div', { 'id': lesson.id, 'class': 'r_id_' + lesson.r_id + ' lesson_bar', 'title': lesson.full_name });
  var lesson_number = new Element('div', { 'class' : 'numbering numbering_' + lesson.r_id});
  var lesson_text = new Element('span', { 'class' : 'lesson_text' });
  var name = new Element('span', { 'id' : 'lesson' + lesson.start, 'class' : 'n', 'style' : 'font-weight: bold;' });
  var time = new Element('span');
  var del = new Element('a', {'class': 'no_print', 'href' : '#', 'style' : 'color: #900;'});
//  var prev = new Element('a', {'class': 'prev no_print', 'href' : '#', 'style' : 'color: #fff;'});
//  var next = new Element('a', {'class': 'next no_print', 'href' : '#', 'style' : 'color: #fff;'});
  var toggle_bar = new Element('a', {'class': 'toggle_bar no_print', 'href' : '#', 'style' : 'color: #fff;'});

  var t_floor = lesson.start - (lesson.start % (30 * 60));
  var id = "";

  if (lesson.recurring) {
    var d = new Date(t_floor * 1000);
    id = "" + lesson.day + pad_zero(d.getHours()) + pad_zero(d.getMinutes());
  } else {
    id = t_floor;
  }

  var outer_div = $('t' + id);


  //the lesson doesn't belong in this calendar, get it out of here
  if (outer_div == null) return;

  lesson_bar.setStyle({
    'width' : outer_div.getWidth() - 2 + 'px',
    'height' : sec2pixel(lesson.duration * 60) - 4 + 'px', // -4 is for borders
    'margin-top' : sec2pixel(lesson.start - t_floor) + 'px',
    'position' : 'absolute',
    'display' : 'none'
  });
  lesson_bar.style.backgroundColor = '#' + lesson.color,

  name.update(lesson.student_name);
  time.update(" (" + lesson.start_time + ") ");
  del.update("x");
  del.observe("click", function(event) {
    if(confirm('Are you sure you want to delete this lesson?')) {
      new Ajax.Request("/admin/registration/delete_lesson/" + lesson.id, {
        method: 'get', //this is bad.. but oh well
        onSuccess: function(transport) {
          Effect.Fade(lesson_bar, {
            afterFinish: function() {
              lesson_bar.remove();
              update_count(lesson.r_id);
              var list = $$('div.numbering_' + lesson.r_id);
              if (list.length > 0) {
                list[0].next('.prev').style.color = "transparent";
                list[list.length-1].next('.next').style.color = "transparent";
              }
              show_lesson_list(lesson.r_id, lesson.full_name);
            }
          });
        }
      });
    }
    Event.stop(event);
  });

  /*
  prev.update("&#9664;");
  prev.observe("click", function(event) {
    Event.stop(event);
    var n = this.previous('.numbering');
    var numbering = n.getInnerText();
    numbering = numbering.slice(0, numbering.indexOf('/'));
    var lesson_numbers = $$('div.numbering_' + lesson.r_id);
    if(numbering > 1) {
      Effect.ScrollTo(lesson_numbers[numbering-2].up('.week_anchor'));
      Effect.Pulsate(lesson_numbers[numbering-2].up('.lesson_bar'), {duration: 2.5});
    }
  });
  next.update("&#9654;");
  next.observe("click", function(event) {
    Event.stop(event);
    var n = this.previous('.numbering');
    var numbering = n.getInnerText();
    numbering = numbering.slice(0, numbering.indexOf('/'));
    var lesson_numbers = $$('div.numbering_' + lesson.r_id);
    if(numbering < lesson_numbers.length) {
      Effect.ScrollTo(lesson_numbers[numbering].up('.week_anchor'));
      Effect.Pulsate(lesson_numbers[numbering].up('.lesson_bar'), {duration: 2.5});
    }
  });
  */

  var list = $$('div.numbering_' + lesson.r_id);
  /*
  if (lesson.numbering == 1) {
    prev.style.color = "transparent";
    if((list.length > 0) && page_loaded()) {
      list[0].next('.prev').style.color = "white";
    }
  }
  if (lesson.numbering == lesson.out_of) {
    next.style.color = "transparent";
    if((list.length > 0) && page_loaded()) {
      list[list.length-1].next('.next').style.color = "white";
    }
  }
  */

  lesson_number.style.color = '#' + lesson.color;
  lesson_number.update(lesson.numbering + "/" + lesson.out_of);

  toggle_bar.update("BAR");
  toggle_bar.observe('click', function(event) {
    Event.stop(event);
    $('checkbox_' + lesson.r_id).click();
  });

  lesson_text.insert(lesson_number);
  lesson_text.insert(name);
  lesson_text.insert(time);
//  lesson_text.insert(prev);
//  lesson_text.insert(next);
  lesson_text.insert(toggle_bar);
  lesson_text.insert(del);
  lesson_bar.update(lesson_text);
  outer_div.insert(lesson_bar);
  Effect.Appear(lesson_bar);

  //console.log(lesson_bar);
}

function page_loaded() {
  return ($('loading_wrapper').style.display == "none")
}

function start_loading(key, str) {
  var l = $('loading_wrapper');
  if (l.style.display == 'none') {
//    Effect.Grow('loading_wrapper');
    l.show();
  }
  $('message_list').insert("<li id=\"" + key + "\">" + str + "</li>");
}

function done_loading(key) {
  $(key).remove();

  if ($('message_list').childElements().length == 0) {
    $('header').update("Done!");
    Effect.Fade('loading_wrapper', { afterFinish: function() { $('header').update("Loading..."); }});
  }
}


function load_lessons() {
  start_loading("load_lessons", "Loading already scheduled lessons..."); 

  var url = "/admin/session/lessons_json/" + SESSION_ID;
  new Ajax.Request(url, {
    method: 'get',
    onSuccess: function(transport) {
      lessons = transport.responseText.evalJSON();
      lessons.each(function(lesson) {
        show_lesson(lesson);
      });
      done_loading("load_lessons");
    }
  });
}

function make_draggable() {
    $$('div.lesson_bar').each(function(lesson_bar) {
      var dragger = new Effect.Draggable(lesson_bar);
    });
}

function adjust_lesson_width() {
	$$('div.lesson_bar').each(function(bar) {
		bar.style.width = (bar.up('div').getWidth() - 2) + "px";
	});	
}


function show_lesson_list(r_id, name) {
  var url = "/admin/registration/lessons_json/" + r_id;
  new Ajax.Request(url, {
    method: 'get',
    onSuccess: function(transport) {
      lessons = transport.responseText.evalJSON();
      $$('td.summary_cell').each(function(cell) {
        if (!cell.hasClassName('offday_cell')) {
          cell.style.backgroundColor = 'white';
        }
      });

      $('lesson_list_name').update(name);
      $('lesson_list').update('');
      lessons.each(function(lesson) {
        $('d-' + lesson.date_id).style.backgroundColor = '#' + lesson.color; 
        $('lesson_list').insert("<li>" + lesson.date + ": " + lesson.start_time + "~" + lesson.end_time);
      });

      Effect.Appear('schedule_overview', {duration: 0.3});
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


function show_lesson_dialog(data) {
  //time is the start timestamp of the img, it is used to figure out the date of this lesson
  var d = $('event_dialog');


  var t = getTimeUnderCursor(15);
  $('dialog_time').value = formatTime(t);
  $('dialog_name').update(data.student_name);
  $('dialog_duration').value = data.duration;
  $('dialog_date').value = data.date

  if ((tempX - d.getWidth() - 20) < 0) {
    d.style.left = "0px";
    d.style.top = (tempY + 30) + "px";
  } else {
    d.style.left = (tempX - d.getWidth() - 20) + "px";
    d.style.top = (tempY - 30) + "px";
  }
  d.style.borderColor = "#" + data.color;


  Effect.Appear(d, {duration: 0.2, afterFinish: function() { $('dialog_time').focus(); }});
  $('registration_id').value = data.registration_id;
}

function toggle_widget(widget) {
  var uparrow = "&#9650;";
  var downarrow = "&#9660;";

  var content = widget.down('.body');
  Effect.toggle(content, 'blind', {duration: 0.3});
  var s = widget.down('.min_max');
  if (content.style.display == "none") {
    s.update(downarrow);
  } else {
    s.update(uparrow);
  }
}

/*
function get_thin_calendar_bar_image_url(color, block_start, start, end) {
  return img = "http://kgfamily.com/scripts/calendarbar.php?w=" + 2 + "&uh=" + 1 + "&ut=" + (2*UNIT_TIME) + "&c=" + color + "&ds=" + block_start + "&es=" + start + "-" + end + "&sp=0";
}

function get_calendar_bar_image_url(color, block_start, start, end, preferred) {
  return img = "http://kgfamily.com/scripts/calendarbar.php?w=" + TIMEBAR_WIDTH + "&uh=" + UNIT_HEIGHT + "&ut=" + UNIT_TIME + "&c=" + color + "&ds=" + block_start + "&es=" + start + "-" + end + "&sp=" + preferred;
}
*/

function getTimeUnderCursor(interval) {
  var click_y = tempY;
  
  click_y -= HEADER_SIZE; //account for header
  
  var t_count = Math.floor(((click_y % WEEK_BLOCK_SIZE) - DATE_DISPLAY_SIZE) / (UNIT_HEIGHT/(UNIT_TIME/(interval*60)))); //number of thirty minutes since 7 am
  var time = (DAY_START * 60) + (t_count * interval); //in minutes
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

  var hour = Math.floor(time);
  if (hour < 10) { hour = "0" + hour; }
  var min = (time - Math.floor(time)) * 60;
  if (min < 10) { min = "0" + min; }
  return hour + ":" + min + p;
}

function getMouseXY(e) {
  tempX = e.pageX;
  tempY = e.pageY;

  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0;}
  if (tempY < 0){tempY = 0;}  

  var army_time = getTimeUnderCursor(15);
  var time_str = formatTime(army_time);

  var xy = $('xy');
  var totalwidth = document.viewport.getWidth();
  
  if (army_time >= DAY_START && army_time < DAY_END+1 && tempX > LEFT_MARGIN && show_time) {
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
