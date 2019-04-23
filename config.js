// Number of elements in your website.  Must be correct.  This
// refers to the top level elements (the children of the div with
// id="h-center").  The elements should be named "elem_i" for
// i < element_count
var element_count = 6;

// The maximum number of columns you want the website to have. As
// the browser is widened, more columns will appear, but no more
// than this value.
var grid_x_max = 2;

// The minimum width a top-level element can have.
var min_elem_width = 200;
// The baseline maximum width a top-level element can have.  Note
// when there are fewer columns this increases slightly and when
// there are more columns this decreases slightly.
var max_elem_width = 450;
// The minimum width before creating a new column
var min_column_width = 400

// The order in which the elements are handled.  'vert' means the
// elements are placed in vertically until the column is full, then
// move on to the next column.  'horiz' means the row is filled
// before starting the next row.  'r-assign' uses the values of the
// r_assignment array to place the elements in rows.  'c-assign'
// uses the values of the c_assignment array to place the elements
// in columns.
var order = 'horiz';
var c_assignment = [0, 0, 0];
var r_assignment = [0, 0, 0];

// The elements that can be opened and closed
var hide_able = [0, 1, 2, 3, 4, 5];
