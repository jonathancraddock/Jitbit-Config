// Current Focus/URL
var currFoc = 'none';
var url = window.location.href;

// Test (changing placeholder colour in dropdown custom field)
$('#CustomFieldValue47181').css('color','red');

// Change placeholder colour overridden by inline jquery style
$('#placeholderspan').css('color','#555');

// Insert div for "skip to new ticket"
// yellow 'bar' at top of page on first <tab>
// (JC, 8/3/2022)
$('#divBigHeader').prepend('<a id="skipNew" href="#newButton" onclick="document.getElementById(\'newTkt\').focus();" aria-labelledby="Skip to New Ticket"><span>Skip to New Ticket</span></a>');

// Hide "skip" on new ticket page
// no 'new ticket' button on the new ticket page
// (JC, 8/3/2022)
if(url.includes('/New')) { $('#skipNew').css('display','none'); }

// TEST - add caption/heading to main ticket table list
if( url.endsWith('/helpdesk') || url.endsWith('/helpdesk/') || url.includes('/helpdesk?') ) { $('#tblTickets').prepend('<caption><h2>Tickets List</h2></caption>'); 
$('#maintable > tbody > tr > td:first-child').prepend('<h2>Categories and Filters</h2>'); }

// Add missing IDs where required
$('#divBigHeader #newTicket a.button').prop('id','newTkt');
$('#logo a').prop('id','logoLink');
$('#statusId').next().prop('id','statusIdButton');
$('.dropdownSelect a.dropdown-toggle').prop('id','catDrop');

// Set aria labels where missing
$('#newTicket a').attr('aria-label', 'create new ticket');
$('.report-input input.datepick').attr('aria-label', 'enter day slash month and a 4 digit year');
$('#filterForm input.datepick').attr('aria-label', 'enter four digit year hyphen month hyphen day');
$('#tbQuery').attr('aria-label', 'search');
$('#ddlSortBy').attr('aria-label', 'choose the ticket column to sort by');
$('table.horizseparated tr.overdue').attr('aria-label', 'ticket is overdue');
$('form#filterForm table button[type="submit"]').attr('aria-label', 'apply filters');

//$('table.outerroundedbox.menulist div a').attr('aria-label', $('table.outerroundedbox.menulist div a').text());
//^-fail... look at an 'each' ?

// Set roles where missing
$('.topheader').attr('role', 'banner');
$('#tbQuery').attr('role', 'search');

// remove font awesome icons from tabindex on Reports page
$('i.icon').parent('a').attr('tabindex', '-1');

// TEST - does screen reader now read the h2 and the body?
$('#ticketBody').attr('role', 'main');

// TEST - mark mis-used "layout" tables as ARIA presentation
$('#maintable').attr('role', 'presentation'); // page layout
$('#filterForm > table.grey').attr('role', 'presentation'); // filters
$('#divStats').attr('role', 'presentation'); // stats
$('.rightsidebar > .issueDetails').attr('role', 'presentation'); // details sidebar


// TEST - mark active tab title as H1...
$('div#divBigHeader ul.tabmenu li.active a').html( function() {
  let value = $('div#divBigHeader ul.tabmenu li.active').html();
  let innerHtml = value.substring(value.search('</i>')+5,value.length-4);
  let allHtml = value.replace(innerHtml,'<h1>'+innerHtml+'</h1>');
  let newHtml = allHtml.substring(allHtml.search('>')+1,allHtml.length-4);
  console.log( newHtml );
  $('div#divBigHeader ul.tabmenu li.active a').html(newHtml);
});


// add meaningful text label to button
$('#toolbar #status li button[title="Reply"]').append('Create Reply');

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


// Shift focus, category -> subject
// --------------------------------
// (JC, 15/3/2022)

$("#CategoryID").change(function(){
  $('#Subject').focus();
});


// Shift focus, filter -> reset ??
// ----------------------------
// (JC, 11/3/2022)

$('#filterForm button[type="submit"]').click(function(){
  $('#btnResetFilter').focus();
  currFoc = 'btnResetFilter';
});
