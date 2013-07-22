function add_row() {
	var id = -($$('tr.new').length + 1)
	
    var td_schools = new Element('td').insert(new Element('select', {'name': 'location['+id+'][school_id]'}).update(OPTIONS));

	var td_room = new Element('td').insert(new Element('input',{ 'type': 'text', 'class': 'inline_text', 'size': 17, 'name': 'location['+id+'][room]', 'value': 'room'}));
	var td_del = new Element('td');
	td_del.insert('<a href="#" onclick="$(\'new_'+id+'\').remove(); return false;"><img src="/images/icons/x_small.png" class="icon" /></a>');

	var row = $$('tr.even').length + $$('tr.odd').length;
	row = (row % 2) ? 'odd new' : 'even new';
	var tr = new Element('tr', { 'class': row, 'id': 'new_' + id });
    tr.insert(td_schools);
	tr.insert(td_room);
	tr.insert(td_del);
	$('location_body').insert(tr);

	return false;
}

