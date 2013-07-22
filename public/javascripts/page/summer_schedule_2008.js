function close_lesson_list(id) {
	Effect.Fade($('lesson_list_' + id), { duration: 0.3 });
}

function show_lesson_list(id) {
	Effect.Appear($('lesson_list_' + id), { duration: 0.3 });	
}

Event.onDOMReady(function() {
	if(!window.XMLHttpRequest) {
		$('calendar_table').update('<img src="/images/icons/face-surprise.png" width="64" height="64" align="left" style="margin: 5px 20px 20px 20px;"><h4>Unfortunately your broswer <small>(Internet Explorer 6)</small> does not support the calendar view.</h4>Please  upgrade to <a href="http://www.microsoft.com/windows/downloads/ie/getitnow.mspx">Internet Explorer 7</a> or use <a href="http://www.getfirefox.com">Mozilla Firefox</a> to view the calendar.<br />You can still view your child\'s lesson schedule by clicking on "View as List" above.');
		if (window.location.hash != "#list" && window.location.hash != "#cal" )
			window.location.hash = "#list";
	} else {
		if (window.location.hash != "#list" && window.location.hash != "#cal" )
			window.location.hash = "#cal";		
	}

	toggleView(window.location.hash.substr(1));
	
	Event.observe(window, 'scroll', function() {
		if(window.scrollY) {
			if (window.scrollY > 190) {
				$('side_list').style.top = (window.scrollY - 190) + "px";
			} else {
				$('side_list').style.top = 0;
			}
		} else {
			if (document.documentElement.scrollTop > 220) {
				$('side_list').style.top = (document.documentElement.scrollTop - 220) + "px";
			} else {
				$('side_list').style.top = 0;
			}
		}
	});
	
	Event.observe(document, 'mousemove', getMouseXY);
});

function toggleView(str) {
	if (str == 'cal') {
		Effect.Fade($('calendar_list'), {duration: 0.4, afterFinish: function() { Effect.Appear($('calendar_table'), {duration: 0.4}); } });		
	} else {
		Effect.Fade($('calendar_table'), {duration: 0.4, afterFinish: function() { Effect.Appear($('calendar_list'), {duration: 0.4}); } });		
	}
}


function showTimeBubble(name, color, str) {
	var d = $('timebubble');

	
	d.style.borderColor = "#" + color;
	d.update(name + "<br /><small>" + str + "</small>");

	d.style.display = "inline";//, { duration: 0.1 });
}

function hideTimeBubble() {
	$('timebubble').style.display = "none";
}


// Temporary variables to hold mouse x-y pos.s
var tempX = 0;
var tempY = 0;


function getMouseXY(e) {
  tempX = e.pageX;
  tempY = e.pageY;

  // catch possible negative values in NS4
  if (tempX < 0){tempX = 0;}
  if (tempY < 0){tempY = 0;}


  var d = $('timebubble');


  if (d.style.display == "inline") {
	d.style.left = (tempX + 10) + "px";
	d.style.top = (tempY + 10) + "px";
  }

  return true;
}