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
            click_end();
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
    click_end();
}

function click_end() {
    clicked = false;
    $('schedule_selection').value = get_selection();
}

function get_selection() {
    var str = "";
    var range = "";
    var started = false;
    for (var i = 0; i < 5; i++) {
        var selections = $$('div.selection_'+i);
        for (var j = 0; j < selections.length; j++) {
            if (started) {
                if (!selections[j+1].hasClassName('selected')) {
                    started = false;
                    range += "-" + selections[j+1].id;
                    str += range + ","
                }
            } else {
                if (selections[j].hasClassName('selected')) {
                    started = true;
                    range = selections[j].id;
                    //single box selection case
                    if (!selections[j+1].hasClassName('selected')) {
                      started = false;
                      range += "-" + selections[j+1].id;
                      str += range + ","
                    }
                }
            }
        }
    }
    return str;
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
    } else {
        $('schedule_selection').value = get_selection();
    }

    var address = $('parent_address');
    address.observe('focus', function(e) {
        address.select();
    });
    if (address.value == '') {
        address.value = "Street Address\nCity, State ZIP";
    }

    //show_tuition();
    //$('registration_school_id').observe('change', show_tuition);


    $$('textarea.msg').each(function (ta) {
        ta.observe('focus', function (e) {
            messageBox(ta,true);
        });
        ta.observe('blur', function (e) {
            messageBox(ta,false);
        });
    });
});


function messageBox(ta,show) {
    if (show) {
        var pos = ta.cumulativeOffset();


        $("msg").setStyle({
            top: (pos[1]+ta.getHeight()-10) + "px",
            left: (pos[0]-20) + "px"
        });

        $("msg").show();
    } else {
        $("msg").hide();
    }
}
