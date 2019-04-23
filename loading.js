var is_initial_load = true;

var global_min_width = 0;
var global_min_height = 0;

var global_x = 0;
var global_y = 0;


var element_width = 0;
var grid_x = 3;

var grid_y = 3;
var h_margin = 0


var max_elem_width_working = 350;


var open_elements = [];

var content_wrapper = null;

function highest_freq(arr) {
	var al = arr.length;
	var row_sizes = [];
	for (var i = 0; i < al; i++) {
		row_sizes.push(0);
	}
	var cols = [];
	for (var i = 0; i < al; i++) {
		cols.push(row_sizes[arr[i]]);
		row_sizes[arr[i]] += 1;
	}
	row_sizes.sort();
	//console.log(cols);
	return [Math.max(1, row_sizes[row_sizes.length-1]), cols];

}

function get_page_size() {
	var v = document.getElementById('v-test');
	var h = document.getElementById('h-test');

	var y = v.clientHeight;
	var x = h.clientWidth;

	document.getElementById('page-data').innerHTML = x + ' x ' + y;
	//set_elem_size(x,y);
	content_wrapper = document.getElementById('h-center');
	if (order == 'c-assign' && c_assignment.length == element_count) {
		var cal = c_assignment.length;
		grid_x_max = 1;
		for (var i = 0; i < cal; i++) {
			grid_x_max = Math.max(grid_x_max, c_assignment[i]+1);
		}
	} else if (order == 'r-assign' && r_assignment.length == element_count) {
		temp = highest_freq(r_assignment);
		grid_x_max = Math.max(1, temp[0]);
		c_assignment = temp[1];
		//order = 'c-assign';

	} else if (order != 'horiz') {
		order = 'vert';
	}

	headers = document.getElementsByClassName('elem_header');
	head_length = headers.length;
	for (var i = 0; i < head_length; i++) {
		if (hide_able.indexOf(parseInt(headers[i].parentNode.id.split('_')[1])) != -1) {
			headers[i].className += ' link';
			if (is_initial_load) {
				elem_toggle(headers[i].parentNode.id.split('_')[1]);
			}
			headers[i].onclick = function () {
						elem_toggle(this.parentNode.id.split('_')[1]);
					};
			var old_inner_html = headers[i].innerHTML;
			headers[i].innerHTML = '<a class="one" href="javascript:void(0);">' + old_inner_html + '</a>';
		}
	}

	var abstracts = document.getElementsByClassName('abstract');
	if (is_initial_load) {
		for (var i = 0; i < abstracts.length; i++) {
			toggle_hide_item(abstracts[i]);
		}
	}
	is_initial_load = false;
	//set_hash_line();
	set_grid(x,y);
}

function set_hash_line() {
	location.hash = 'elems=' + open_elements.join('_');
}

function set_grid(x,y) {
	global_x = x;
	global_y = y;
	grid_x = Math.max(1, Math.min(grid_x_max, Math.floor(global_x/(Math.max(min_column_width, min_elem_width)))));
	grid_y = Math.ceil(element_count/grid_x);
	max_elem_width_working = max_elem_width + max_elem_width/(3*grid_x);
	document.getElementById('page-data').innerHTML = x + ' x ' + y + '<br/>COLUMN COUNT: ' + grid_x;

	element_width = Math.min(max_elem_width_working, (global_x/grid_x) - 4);
	h_margin = (global_x - element_width*grid_x)/2;
	document.getElementById('h-center').style.width = (element_width*grid_x).toString() + 'px';
	try {
		var glob_head = document.getElementById('global-header');
		glob_head.style.width = (element_width*grid_x).toString() + 'px';
		var g_header = document.getElementById('global_elem_header');
		g_header.style.backgroundSize = (element_width*grid_x).toString() + 'px 100%';
	} catch (e) {
		console.log(e);
	}

	current_elements = new Array(element_count);
	for (var i = 0; i < element_count; i++) {
		try {
			element = document.getElementById('elem_' + i.toString())
			current_elements[i] = element;
		} catch (e) {
			console.log(e);
			console.log('caught');
		}
	}
	if (order == 'r-assign') {
		current_elements.sort(function(a,b) {
			return r_assignment[parseInt(a.id.split('_')[1])] - r_assignment[parseInt(b.id.split('_')[1])];
		});
	}
	while (content_wrapper.firstChild) {
		content_wrapper.removeChild(content_wrapper.firstChild);
	}
	// Create columns
	for (var i = 0; i < grid_x; i++) {
		column = document.createElement('div');
		column.id = 'column_' + i.toString();
		column.className = 'column';
		column.style.minWidth = min_elem_width.toString() + 'px';
		column.style.width = element_width.toString() + 'px';
		column.style.left = (h_margin + (i)*element_width).toString() + 'px';
		content_wrapper.appendChild(column);
	}
	element_count = current_elements.length;
	for (var i = 0; i < element_count; i++) {
		try {
			i_working = current_elements[i].id.split('_')[1];
			column = assign_column(i_working);
			children = current_elements[i].childNodes;
			ch_count = children.length;
			for (var j = 0; j < ch_count; j++) {
				resize_child(column, children[j]);
			}
			column.appendChild(current_elements[i]);
		} catch (e) {
			console.log(current_elements[i]);
		}
	}
}

function assign_column(i) {
	if (order == 'vert') {
		return document.getElementById('column_' + (Math.floor(i/grid_y)).toString());
	} else if (order == 'horiz') {
		return document.getElementById('column_' + (i%grid_x).toString());
	} else if (order == 'c-assign' || order == 'r-assign') {
		return document.getElementById('column_' + (Math.min(grid_x-1, c_assignment[i])).toString());
	}
}

function resize_child(column, child) {
	try {
		classes = child.className.split(' ');
		if (classes.indexOf('resize') != -1) {
			child.style.maxWidth = Math.floor((Math.max(min_elem_width, element_width))*(.9)).toString() + 'px';
		}
	} catch(e) {
		// Do nothing
	}
}

function set_elem_size(x,y) {
	var image = document.getElementById('image');
	if (image !== null) {
		var w = image.width;
		var h = image.height;
		image.style.maxWidth = x +'px';
		image.style.maxHeight = (y-20) + 'px';
		if (x*(h/w) < (y-20)/2) {
			image.style.marginBottom = (((y-20)/2 - x*(h/w))/3) + 'px';
			image.style.marginTop = (((y-20)/2 - x*(h/w))/3) + 'px';
		}
	}
	var blocks = document.getElementsByClassName('block');
	var bLength = blocks.length;
	for (var i = 0; i < bLength; i++) {
		if (x > 600) {
			blocks[i].style.width = '75%';
		} else {
			blocks[i].style.width = '90%';
		}
	}
}

function context_menu(element) {
	var parent = element.parentNode;
	/*I do not need this yet*/
	var pid = parent.id.split;
	var level = pid[pid.length - 1];
	/*						*/
	var gparent = parent.parentNode;
	var context = document.getElementById(gparent.id + " context")
	var mode = context.style.display;
	if (mode == "none") {
		context.style.display = 'block';
	} else {
		context.style.display = 'none';
	}
}

function toggle_hide_item(item_input) {
	var item = null;
	if (typeof(item_input) == 'string') {
		item = document.getElementById(item_input);
	} else {
		item = item_input;
	}
	try {
		var classes = item.className.split(' ');
		if (classes.indexOf('hidden') != -1) {
			classes.splice(classes.indexOf('hidden'), 1);
			item.className = classes.join(' ');
		} else {
			item.className += ' hidden';
		}
	} catch (e) {
		item.className = 'hidden';
	}
}

function elem_toggle(index) {
	var elem = document.getElementById('elem_' + index.toString());
	var children = elem.childNodes;
	var ch_count = children.length;
	for (var i = 0; i < ch_count; i++) {
		try {
			if (children[i].className.split(' ').indexOf('elem_header') == -1) {
				toggle_hide_item(children[i]);
			}
		} catch (e) {
			console.log(e);
			try {
				toggle_hide_item(children[i]);
			} catch (ee) {
				console.log(ee);
			}
		}
	}
}
