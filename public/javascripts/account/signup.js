function check(text, type) {
	switch(type) {
		case "name":
			var re = /.{2,}/;
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
	if ($$('p.ok').length == 6) {
		$('form_submit').enable();
	} else {
		$('form_submit').disable();
	}
}


Event.onDOMReady(function() {
	$$('p.check').each(function(p) {
		p.addClassName("nok");
	});
	
	$('user_firstname').observe('keyup', function(event) {
		if(check(this.value, "name")){
			this.up().removeClassName("nok");
			this.up().addClassName("ok");
		} else {
			this.up().removeClassName("ok");
			this.up().addClassName("nok");
		}
		
		check_form();
	});


	$('user_lastname').observe('keyup', function(event) {
		if(check(this.value, "name")){
			this.up().removeClassName("nok");
			this.up().addClassName("ok");
		} else {
			this.up().removeClassName("ok");
			this.up().addClassName("nok");
		}
		
		check_form();
	});
	
	$('user_email').observe('keyup', function(event) {
		if(check(this.value, "email")){
			this.up().removeClassName("nok");
			this.up().addClassName("ok");
		} else {
			this.up().removeClassName("ok");
			this.up().addClassName("nok");
		}
		
		check_form();
	});

	$('user_email_confirmation').observe('keyup', function(event) {
		if(check(this.value, "email") && this.value == $('user_email').value) {
			this.up().removeClassName("nok");
			this.up().addClassName("ok");
		} else {
			this.up().removeClassName("ok");
			this.up().addClassName("nok");
		}
		
		check_form();
	});
	
	
	$('user_password').observe('keyup', function(event) {
		if(check(this.value, "password")){
			this.up().removeClassName("nok");
			this.up().addClassName("ok");
		} else {
			this.up().removeClassName("ok");
			this.up().addClassName("nok");
		}
		
		check_form();
	});


	$('user_password_confirmation').observe('keyup', function(event) {
		if(check(this.value, "password") && this.value == $('user_password').value) {
			this.up().removeClassName("nok");
			this.up().addClassName("ok");
		} else {
			this.up().removeClassName("ok");
			this.up().addClassName("nok");
		}

		check_form();
	});

});
