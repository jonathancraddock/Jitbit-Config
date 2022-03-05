// Test (changing placeholder colour in dropdown custom field)
$('#CustomFieldValue47181').css('color','red');

// Set aria labels where missing
$('#newTicket a').attr('aria-label', 'button to create new ticket');
$('input.datepick').attr('aria-label', 'enter day slash month and a 4 digit year');

// Set roles where missing
$('ul.dropdown-list').attr('role', 'list');

// Set alt text where missing


// Reverse order of newTicket and divSearch DIV elements
// NOTE: requires a float: left in custom CSS above
$('#newTicket').insertBefore('.divSearch');
