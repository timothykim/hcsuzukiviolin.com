function submit_ok() {
	var re = /.+/;
	
	var name_field = $('album_name').value;

	if (!name_field.match(re)) {
		alert('Photobook name cannot be blank!');
		return false;
	}
	
	var del = false;
	
	var cbs = $$('input.checkbox');
	
	for (var i = 0; i < cbs.length; i++) {
		if (cbs[i].checked) {
			return confirm('Are you sure you want to delete the selected photo(s)?\nThis cannot be undone.');
		}
	}
	
	return true;
}