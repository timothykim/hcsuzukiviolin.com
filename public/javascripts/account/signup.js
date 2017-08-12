function check(text, type) {
	switch(type) {
		case "name":
			var re = /.{2,}/;
			return text.match(re);
		break;
		
		case "email":
<<<<<<< HEAD
			var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
=======
			var re = /@/;
>>>>>>> deploy
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
	
	var fn = $('user_firstname');
	if(!fn.up().hasClassName('fieldWithErrors') && check(fn.value, "name")){
		fn.up().removeClassName("nok");
		fn.up().addClassName("ok");
	} else {
		fn.up().removeClassName("fieldWithErrors");
		fn.up().removeClassName("ok");
		fn.up().addClassName("nok");
	}

	var ln = $('user_lastname');
	if(!ln.up().hasClassName('fieldWithErrors') && check(ln.value, "name")){
		ln.up().removeClassName("nok");
		ln.up().addClassName("ok");
	} else {
		ln.up().removeClassName("fieldWithErrors");
		ln.up().removeClassName("ok");
		ln.up().addClassName("nok");
	}

	var em = $('user_email');
	if(!em.up().hasClassName('fieldWithErrors') && check(em.value, "email")){
		em.up().removeClassName("nok");
		em.up().addClassName("ok");
	} else {
		em.up().removeClassName("fieldWithErrors");
		em.up().removeClassName("ok");
		em.up().addClassName("nok");
	}

	var emc = $('user_email_confirmation');
	if(!emc.up().hasClassName('fieldWithErrors') && em.up().hasClassName("ok") && check(emc.value, "email") && emc.value == $('user_email').value) {
		emc.up().removeClassName("nok");
		emc.up().addClassName("ok");
	} else {
<<<<<<< HEAD
		fn.up().removeClassName("fieldWithErrors");
=======
		emc.up().removeClassName("fieldWithErrors");
>>>>>>> deploy
		emc.up().removeClassName("ok");
		emc.up().addClassName("nok");
	}
	
	var ps = $('user_password');
	if(!ps.up().hasClassName('fieldWithErrors') && check(ps.value, "password")){
		ps.up().removeClassName("nok");
		ps.up().addClassName("ok");
	} else {
		ps.up().removeClassName("fieldWithErrors");
		ps.up().removeClassName("ok");
		ps.up().addClassName("nok");
	}

	var psc = $('user_password_confirmation');
	if(!psc.up().hasClassName('fieldWithErrors') && check(psc.value, "password") && psc.value == $('user_password').value) {
		psc.up().removeClassName("nok");
		psc.up().addClassName("ok");
	} else {
		psc.up().removeClassName("fieldWithErrors");
		psc.up().removeClassName("ok");
		psc.up().addClassName("nok");
	}

	var sb = $('form_submit');
	if ($$('.ok').length == 6) {
		sb.removeAttribute('disabled');
	} else {
		sb.setAttribute('disabled', 'disabled');
	}
}


Event.onDOMReady(function() {


	var error_fields = $$('div.fieldWithErrors');
	if (error_fields.length > 0) error_fields[0].down().focus();

	check_form();

	
	$('user_firstname').observe('keyup', check_form );

	$('user_lastname').observe('keyup', check_form);
	
	$('user_email').observe('keyup', check_form);

	$('user_email_confirmation').observe('keyup', check_form);
	
	$('user_password').observe('keyup', check_form);
	
	$('user_password_confirmation').observe('keyup', check_form);

});
