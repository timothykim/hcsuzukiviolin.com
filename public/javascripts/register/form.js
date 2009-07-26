function updateCalendar(id) {
	if(id == 0) return;
	
	url = "/register/get_registered_date/" + id;
	
	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			var data = transport.responseText.evalJSON();
			for (var date_id in data) {
				$(date_id).value = data[date_id].join(",\n");
			}
		}
	});
}


var clicked = false;
var clicked_day;
function click_start(div, day) {
    clicked = true;
    clicked_day = day;
    $(div).addClassName("selected");
}

function high_light(div, day) {
    if (clicked) {
        if (clicked_day == day) {
            $(div).addClassName("selected");
        } else {
            clicked = false;
        }
    }
}

function dehighlight(div) {
    var d = $(div);
    if (d.hasClassName("selected")) {
        //go up first
        var up = d;
        do {
            up = up.previous();
            if (up == null) break;
            if (up.hasClassName("selected")) {
                up.removeClassName("selected");
            } else {
                break;
            }
        } while (true)

        // now down
        var down = d;
        do {
            down = down.next();
            if (down == null) break;
            if (down.hasClassName("selected")) {
                down.removeClassName("selected");
            } else {
                break;
            }
        } while (true)

        d.removeClassName("selected");
    }
}

function click_end(div) {
    clicked = false;
}




function show_tuition() {
    var sid = $('registration_school_id').value;
    $$('div.tuition').each(function (t) { t.hide(); });
    var t = $('tuition_' + sid);
    if (t != null) {
        t.show();
    }
}

Event.onDOMReady(function() {
    if ($('calendar') != null) {
        updateCalendar(registration_id);
    }

    show_tuition();

    $('registration_school_id').observe('change', show_tuition);
});
