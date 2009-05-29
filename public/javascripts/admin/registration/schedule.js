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
  document.onmousemove = getMouseXY;



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

  var block_start = (start - (start % 1800)); //case when their start time is not on the hour or the half

  var div = "t" + block_start;
  var es = start + "-" + end;
  var preferred = (range.preferred) ? "1" : "0";
  var src = get_calendar_bar_image_url(data.color, block_start, start, end, preferred);
  var style = "cursor: pointer;";
  var insert_div = $(div);

  var img = new Element("img", {
        'style': style,
        'class': "calendar_bar " + "bar_" + registration_id,
        'src'  : src
      });

  var d = $('xy');
  var old_color = d.style.borderColor;

  img.observe('mouseover', function(event) {
	d.style.borderColor = "#" + data.color;
	$('mouseover_name').update(data.student.first_name + " " + data.student.last_name + " <small>(" + range.string + ")</small>");
    $('mouseover_name').show();
    //Effect.Grow('mouseover_name', {'direction': 'top-left', 'duration': 0.2});
  });

  img.observe('mouseout', function(event) {
    $('mouseover_name').hide();
    //Effect.Shrink('mouseover_name', {'direction': 'top-left', 'duration': 0.2});
    d.style.borderColor = old_color;
  });

  insert_div.insert(img);
}


function get_calendar_bar_image_url(color, block_start, start, end, preferred) {
  return img = "http://kgfamily.com/scripts/calendarbar.php?w=" + TIMEBAR_WIDTH + "&uh=" + UNIT_HEIGHT + "&ut=" + UNIT_TIME + "&c=" + color + "&ds=" + block_start + "&es=" + start + "-" + end + "&sp=" + preferred;
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

  if (time < 10) {
    time_str = "0" + time_str;
  }

  var xy = $('xy');
  
  if (army_time >= DAY_START && army_time < DAY_END+1 && tempX > 256 && show_time) {
    $('time').update(time_str);
    xy.style.top = tempY + 15 + "px";
    xy.style.left = tempX + 15 + "px";

    if (xy.positionedOffset()[0] + xy.getWidth() + 12 > $$("body")[0].getWidth()) {
      xy.style.left = $$("body")[0].getWidth() - (xy.getWidth() + 12) + "px";
    }

    xy.show();
  } else {
    xy.hide();
  }

  return true;
}
