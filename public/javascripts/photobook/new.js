function check(text, type) {
	switch(type) {
		case "name":
			var re = /.+/;
			return text.match(re);
		break;
		
		case "email":
			var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return text.match(re);
		break;
		
		case "password":
			var re = /.{5,}/;
			return text.match(re);
		break;
	}
	
	return false;
}

function check_form() {
	
	var fn = $('album_name');
	var sb = $('form_submit');

	if(!fn.up().hasClassName('fieldWithErrors') && check(fn.value, "name")){
		fn.up().removeClassName("nok");
		fn.up().addClassName("ok");
		sb.removeAttribute('disabled');
	} else {
		fn.up().removeClassName("fieldWithErrors");
		fn.up().removeClassName("ok");
		fn.up().addClassName("nok");
		sb.setAttribute('disabled', 'disabled');
	}

}


Event.onDOMReady(function() {
	var error_fields = $$('div.fieldWithErrors');
	if (error_fields.length > 0) error_fields[0].down().focus();

	check_form();

	$('album_name').observe('keyup', check_form );

	
});
