// Test (changing placeholder colour in dropdown custom field)
$('#CustomFieldValue47181').css('color','red');

// Insert div for "skip to new ticket"
$('#divBigHeader').prepend('<a id="skipNew" href="#newButton" onclick="document.getElementById(\'newTkt\').focus();"><span>Skip to New Ticket</span></a>');

// Hide "skip" on new ticket page
var url = window.location.href;
if(url.includes('/New')) { $('#skipNew').css('display','none'); }

// Add an ID to the header (green) new ticket button
$('#divBigHeader #newTicket a.button').prop('id','newTkt');

// Set aria labels where missing
$('#newTicket a').attr('aria-label', 'button to create new ticket');
$('.report-input input.datepick').attr('aria-label', 'enter day slash month and a 4 digit year');
$('#filterForm input.datepick').attr('aria-label', 'enter four digit year hyphen month hyphen day');
$('#tbQuery').attr('aria-label', 'search');

// Set roles where missing
$('.topheader').attr('role', 'banner');
$('#tbQuery').attr('role', 'search');

// Set alt text where missing


// Reverse order of newTicket and divSearch DIV elements
// NOTE: requires a float: left in custom CSS above
$('#newTicket').insertBefore('.divSearch');
