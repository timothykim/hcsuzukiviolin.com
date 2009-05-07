/* actual checking is done here */

function get_session_date(param) {
	return $("session_" + param + "_1i").value + "/" +
			$("session_" + param + "_2i").value + "/" +
			$("session_" + param + "_3i").value;

}

function updateCalendar() {
	/* get the date listings */
	var url = "/admin/session/get_date_interval?start=" + get_session_date("first") +
												"&end=" + get_session_date("last");

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
				for(var i = 0; i < data.dates.length; i++) {
					if (i % 7 == 0) {
						str += "<tr><td class=\"week_no\">" + ((i / 7) + 1) + "</td>";
					}
					var d = data.dates[i];
					clss = (d.in_session && d.dotw != 0) ? "in_session" : "off_day";
					var form = "";
					if (d.in_session && d.dotw != 0) {
						
						d_str = d.m + "/" + d.d + "/" + d.y;
						
						form = '<input type="checkbox" name="offdays[' + d_str + ']" id="offday' + i + '" class="off_box"> <label for="offday' + i + '">Off Day</label><br />';
						if (d.dotw == 5 || d.dotw == 6) {
							form += '<input type="checkbox" name="groups[' + d_str + ']" id="group' + i + '" class="group_box"> <label for="group' + i + '">Group</label>';
						}
					}
					
					str += "<td class=\"" + clss + "\"><div class=\"date\">" + d.m + "/" + d.d + "</div>" + form + "</td>";
					if (i % 7 == 6) {
						str += "</tr>";
					}
				}
				
				$("calendar").update("<table><thead><tr><th>W</th><th>Sunday</th><th>Monday</th>" + "<th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th></tr></thead><tbody>" + str + "</tbody></table><a href=\"#\" onclick=\"updateCalendar(); return false;\">Reset Calendar</a>");				
			}
		}
	});
}



Event.onDOMReady(function() {
	$$("div#dates select").each( function(select) {
		select.observe('change', function() {
			updateCalendar();
		});
	});
});