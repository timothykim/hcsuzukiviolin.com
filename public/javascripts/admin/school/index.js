function add_row() {
	var id = -($$('tr.new').length + 1)
	
	var td_name = new Element('td').insert(new Element('input',{ 'type': 'text', 'class': 'inline_text', 'size': 17, 'name': 'school['+id+'][name]', 'value': 'name'}));
	var td_address = new Element('td').insert(new Element('input',{ 'type': 'text', 'class': 'inline_text', 'size': 40, 'name': 'school['+id+'][address]', 'value': 'address'}));
	var td_zip = new Element('td').insert(new Element('input',{ 'type': 'text', 'class': 'inline_text', 'size': 6, 'name': 'school['+id+'][zip]', 'value': 'zip'}));
	var td_del = new Element('td');
	td_del.insert('<a href="#" onclick="$(\'new_'+id+'\').remove(); return false;"><img src="/images/icons/x_small.png" class="icon" /></a>');

	var row = $$('tr.even').length + $$('tr.odd').length;
	row = (row % 2) ? 'odd new' : 'even new';
	var tr = new Element('tr', { 'class': row, 'id': 'new_' + id });
	tr.insert(td_name);
	tr.insert(td_address);
	tr.insert(td_zip);
	tr.insert(td_del);
	$('school_body').insert(tr);

	return false;
}
