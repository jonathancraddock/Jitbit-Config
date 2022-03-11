// Current Focus
var currFoc = 'none';

// Test (changing placeholder colour in dropdown custom field)
$('#CustomFieldValue47181').css('color','red');

// Insert div for "skip to new ticket"
// yellow 'bar' at top of page on first <tab>
// (JC, 8/3/2022)
$('#divBigHeader').prepend('<a id="skipNew" href="#newButton" onclick="document.getElementById(\'newTkt\').focus();" aria-labelledby="Skip to New Ticket"><span>Skip to New Ticket</span></a>');

// Hide "skip" on new ticket page
// no 'new ticket' button on the new ticket page
// (JC, 8/3/2022)
var url = window.location.href;
if(url.includes('/New')) { $('#skipNew').css('display','none'); }

// Add missing IDs where required
$('#divBigHeader #newTicket a.button').prop('id','newTkt');
$('#logo a').prop('id','logoLink');
$('#statusId').next().prop('id','statusIdButton');

// Set aria labels where missing
$('#newTicket a').attr('aria-label', 'button to create new ticket');
$('.report-input input.datepick').attr('aria-label', 'enter day slash month and a 4 digit year');
$('#filterForm input.datepick').attr('aria-label', 'enter four digit year hyphen month hyphen day');
$('#tbQuery').attr('aria-label', 'search');
$('#ddlSortBy').attr('aria-label', 'choose the ticket column to sort by');

// Set roles where missing
$('.topheader').attr('role', 'banner');
$('#tbQuery').attr('role', 'search');

// Reverse order of newTicket and divSearch DIV elements
// NOTE: requires a float: left in custom CSS above
$('#newTicket').insertBefore('.divSearch');

// Keystroke Shortcuts
// -------------------
// (JC, 10/3/2022)

document.addEventListener('keydown', e => {

// when focus moves, save the ID with current focus
$(':input').on('focus', function() {
  currFoc = this.id;
  // extract parent ID from current focus point
  // eg- "ui-multiselect-statusId-option-0" -> "statusId"
  currFocId = currFoc.replace('ui-multiselect-','');
  currFocId = currFocId.substring(0,currFocId.search('-'));
});

// using <alt>+<p> to 'jump' back to top of page
if (e.key.toLowerCase() === 'p' && e.altKey) {
  $('#content').click();
    // use 'logo' as a known point, top-left of page
    document.getElementById('logoLink').focus();
  }

// using <alt>+<q> to 'quit' out of modal/dropdown/trap elements
// simulates a mouse user having to click-away from the element to close it 
if (e.key.toLowerCase() === 'q' && e.altKey) {
  $('body').click();
  $('.datepick').datetimepicker('hide');
  // if the user is in a multiselect combo, close it and return the focus
    if ( currFoc.includes('ui-multiselect-') ) {
      $('.ui-multiselect-menu').css('display','none');
      $('#'+currFocId).next().focus();
    }
  }
});
