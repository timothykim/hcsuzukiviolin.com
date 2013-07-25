/* actual checking is done here */

function get_session_date(param) {
	return $("csession_" + param + "_1i").value + "/" +
			$("csession_" + param + "_2i").value + "/" +
			$("csession_" + param + "_3i").value;

}



function processClick(inp, type, day) {
	if (type == "offday") {
		if (inp.checked) {
			//check off the group box
//			if (day >= 5) $(inp).next('input').checked = false;
			//change the highlight
//			$(inp).up().removeClassName("in_session");
//			$(inp).up().removeClassName("group_day");
			$(inp).up().addClassName("off_day");
		} else {
			$(inp).up().removeClassName("off_day");
//			$(inp).up().addClassName("in_session");
		}		
	}
	
	if (type == "groups") {
		if (inp.checked) {
//			$(inp).previous('input').checked = false;
//			$(inp).up().removeClassName("off_day");
			$(inp).up().addClassName("group_day");
		} else {
			$(inp).up().removeClassName("group_day");
		}
	}
	updateCounters();
}

function updateCounters() {
	//update the counter
	var count;
	for (var day = 0; day < 7; day++) {
		count = 0;
		$$('input.off_box_' + day).each(function (input) {
			if (!input.checked)
				count++;
		});
d
		$('d_count_' + day).update(count);		
	}
	
	//group
	count = 0;
	$$('input.group_box').each(function (input) {
		if (input.checked)
			count++;
	});
	
	$('g_count').update(count);
}



function addOption() {
	var i = $$('input.opt').length;
	
	var id = "li_" + i;
	var str = '<li id="' + id + '" style="display: none;"><input type="text" class="opt" name="opt_name[' + i + ']" /> <select name="opt_type[' + i + ']"><option value="checkbox">Yes/No</option><option value="text">Text</option><option value="big_text">Big Text</option></select>';
	str += ' <a href="#" onclick="Effect.BlindUp(\'' + id + '\', {duration:0.3}); $(this).previous(\'input\').value=\'\'; return false;"><img src="/images/icons/x_small.png" class="icon" /></a></li>';
	

	$("option_list").insert(str);
	Effect.BlindDown(id, { duration: 0.3 });
}

function addPricing() {
  var i = 0;
  var rows = $$('tr.pricing');
  if (rows.length > 0) {
    var last_row = rows.last();
    i = parseInt(last_row.identify().match(/pricing_(\d+)/)[1]) + 1;
  }
  var type = $("pricing_type").value;
  var str = '<tr class="pricing" id="pricing_'+i+'">' +
            '<td><button type="button" onClick="removePricing(\'pricing_'+i+'\');">Remove</button></td>'+
    '<td>'+ type+ '<input type="hidden" name="pricing_types['+i+']" value="'+type+'" /> </td> <td>' +
    (type == "Individual" ? '<input type="number" size="3" name="pricing_durations[' + i + ']" value="" /> Minutes':'N/A<input type="hidden" name="pricing_durations['+i+']" value="0" />') + '</td><td>$<input type="number" size="5" name="pricing_amounts['+i+']" value="0" /></td> </tr>';
  $("pricing_table").insert(str);
}

function removePricing(id) {
  $(id).remove();
}

function resetCalednar() {
	updateCalendar();
}

function updateCalendar() {
	/* are we editing? */
	var id = ($("session_id")) ? "&id=" + $("session_id").value : "";
	
	/* get the date listings */
	var url = "/admin/session/get_date_interval?start=" + get_session_date("first") +
												"&end=" + get_session_date("last") + id;

	new Ajax.Request(url, {
		method: 'get',
		onSuccess: function(transport) {
			var data = transport.responseText.evalJSON();
			if(data.error) {
				$("error").show();
				$("calendar").update("");
			} else {
				$("error").hide();
				
				/* for each week, create a row */
				var str = "";
				var count = [0,0,0,0,0,0,0];
				for(var i = 0; i < data.dates.length; i++) {
					if (i % 7 == 0) {
						str += "<tr><td class=\"week_no\">" + ((i / 7) + 1) + "</td>";
					}
					var d = data.dates[i];
					odd_even = (d.m % 2) ? "even_month " : "odd_month ";
					clss = (d.in_session && d.dotw != 0 && !d.off_day) ? "in_session" : "off_day";
					clss += (d.group) ? " group_day" : "";
					var form = "";
					var note = "";
					if (d.in_session) {
						count[d.dotw]++;
						
						var d_str = d.m + "/" + d.d + "/" + d.y;
						
						var off_checked = (d.off_day) ? 'checked="checked"' : "";
						var group_checked = (d.group) ? 'checked="checked"' : "";
						
                        if (d.dotw == 0) { //let's not skip sundays
                            form = '';
                        } else {
                          form = '<input ' + off_checked + ' type="checkbox" onclick="processClick(this, \'offday\' , ' + d.dotw + ');" name="offdays[' + d_str + ']" id="offday' + i + '" class="off_box_' + d.dotw + '">' +
						       '<label for="offday' + i + '"> Off Day</label><br />';
                        }
						
						/* groups are on fridays and saturdays only */
						if (d.dotw == 1 || d.dotw == 5 || d.dotw == 6) {
							form += '<input ' + group_checked + ' type="checkbox" onclick="processClick(this, \'groups\' , ' + d.dotw + ');" name="groups[' + d_str + ']" id="group' + i + '" class="group_box">' +
							        ' <label for="group' + i + '">Group</label>';
						}
						
						note = '<input type="text" name="notes[' + d_str + ']" class="notes" value="' + d.note + '"/>';
					}					

					str += "<td class=\"cells " + odd_even + clss + "\"><div class=\"date\">" + d.m + "/" + d.d + "</div>" + note + form + "</td>";
					if (i % 7 == 6) {
						str += "</tr>";
					}
				}
				
				//today day count
				str += "<tr><td class=\"counters\">T</td>"
				for(var i = 0; i < 7; i++) {
					str += "<td class=\"counters\" id=\"d_count_" + i + "\">" + count[i] + "</td>";
				}
				str += "</tr>"
				
				$("calendar").update("<table><thead><tr><th>W</th>" + 
										"<th>Sunday</th>" +
										"<th>Monday</th>" + 	
										"<th>Tuesday</th>" +
										"<th>Wednesday</th>" +
										"<th>Thursday</th>" +
										"<th>Friday</th>" +
										"<th>Saturday</th>" + 
									"</tr></thead><tbody>" + str +
									"</tbody></table>" +
									"<div style=\"text-align: right; margin-top: 5px;\">" +
										"Group Lessons: <span id=\"g_count\">0</span><br /><br />" +
									"</div>" +
									"<button class=\"iconbutton\" onclick=\"if(confirm('Are you sure?')) resetCalednar(); return false;\" type=\"button\">Reset Calendar</button>" +
									"");
				
				updateCounters();
			}
		}
	});
	
}


var editor;
Event.onDOMReady(function() {
	$$("div#dates select").each( function(select) {
		select.observe('change', function() {
			updateCalendar();
		});
	});
	
	updateCalendar();
	//editor = new widgEditor("notice");
});
