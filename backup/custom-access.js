// Current Focus/URL
var currFoc = 'none';
var url = window.location.href;

// Test (changing placeholder colour in dropdown custom field)
$('#CustomFieldValue47181').css('color','red');

// Change placeholder colour overridden by inline jquery style
$('#placeholderspan').css('color','#555');


// Insert div for "skip to new ticket"
// ===================================

// yellow 'bar' at top of page on first <tab>
// (JC, 8/3/2022)
$('#divBigHeader').prepend('<a id="skipNew" href="#newButton" onclick="document.getElementById(\'newTkt\').focus();" aria-labelledby="Skip to New Ticket"><span>Skip to New Ticket</span></a>');

// Hide "skip" on new ticket page
// no 'new ticket' button on the new ticket page
// (JC, 8/3/2022)
if(url.includes('/New')) { $('#skipNew').css('display','none'); }


// Reverse order of newTicket and divSearch DIV elements
// =====================================================
// NOTE: requires a "float: left" in custom CSS above
$('#newTicket').insertBefore('.divSearch');


// Mark active tab title as H1 for every page
// ==========================================
$('div#divBigHeader ul.tabmenu li.active a').html( function() {
  let value = $('div#divBigHeader ul.tabmenu li.active').html();
  let innerHtml = value.substring(value.search('</i>')+5,value.length-4);
  let allHtml = value.replace(innerHtml,'<h1>'+innerHtml+'</h1>');
  let newHtml = allHtml.substring(allHtml.search('>')+1,allHtml.length-4);
  console.log( newHtml );
  $('div#divBigHeader ul.tabmenu li.active a').html(newHtml);
});


// add caption/heading H2 to main ticket table list
// ================================================
if( url.endsWith('/helpdesk') || url.endsWith('/helpdesk/') || url.includes('/helpdesk?') ) { $('#tblTickets').prepend('<caption><h2>Tickets List</h2></caption>'); 
$('#maintable > tbody > tr > td:first-child').prepend('<h2>Categories and Filters</h2>'); }


// Add missing IDs where required
// ==============================
$('#divBigHeader #newTicket a.button').prop('id','newTkt');
$('#logo a').prop('id','logoLink');
$('#statusId').next().prop('id','statusIdButton');
$('.dropdownSelect a.dropdown-toggle').prop('id','catDrop');
$('#toolbar #status li button[title="Reply"]').prop('id','newReply');


// Set aria labels where missing
// =============================
$('#newTicket a').attr('aria-label', 'create new ticket');
$('.report-input input.datepick').attr('aria-label', 'enter day slash month and a 4 digit year');
$('#tbQuery').attr('aria-label', 'search');
$('#ddlSortBy').attr('aria-label', 'choose the ticket column to sort by');
$('table.horizseparated tr.overdue').attr('aria-label', 'ticket is overdue');

// filter pane
$('form#filterForm table button[type="submit"]').attr('aria-label', 'apply filters');
$('#toggleFilter').attr('aria-label', 'Toggle button. Press enter for filter options, or tab for categories list');
$('#dateFrom').attr('aria-label', 'ticket from date, four digit year hyphen month hyphen day');
$('#dateTo').attr('aria-label', 'ticket to date, four digit year hyphen month hyphen day');
$('#updFrom').attr('aria-label', 'ticket updated from date, four digit year hyphen month hyphen day');
$('#updTo').attr('aria-label', 'ticket updated to date, four digit year hyphen month hyphen day');
$('#fromDepartmentId').attr('aria-label', 'choose department');
$('#filterForm select[name="badge"]').attr('aria-label', 'last updated by');


// Add pseudo-placeholders where missing on <select>
// =================================================
//$('#fromDepartmentId').prepend('<option class="selectPlaceholder" value="" disabled selected hidden>department name</option>');
//$('#filterForm select[name="badge"]').prepend('<option class="selectPlaceholder" value="" disabled selected hidden>updated by</option>');
// ^- not working consistently ???


// Set roles where missing
// =======================
$('.topheader').attr('role', 'banner');
$('#tbQuery').attr('role', 'search');
// make body the 'main' region on ticket details page
$('#ticketBody').attr('role', 'main');
$('#ticketBody #body').attr('tabindex', '0');


// set role textbox on ticket/reply body
// =====================================
$('#txtNewComment').focus(function(){
  $('#txtNewComment').attr('role', 'textbox');
  $('#rtetbNewComment').attr('role', 'textbox');
});
$('#newReply').click(function(){
  $('#txtNewComment').attr('role', 'textbox');
  $('#rtetbNewComment').attr('role', 'textbox');
});
$('#Subject').focus(function(){
  $('#rteBody').attr('role', 'textbox');
});

// remove font awesome icons from tabindex
// =======================================
// (was causing double-tab for keyboard only navigation)
$('i.icon').parent('a').attr('tabindex', '-1');


// mark mis-used "layout" tables as ARIA presentation
// ==================================================
// (prevents JAWS reading misleading 'layout' info)
$('#maintable').attr('role', 'presentation'); // page layout
$('#filterForm > table.grey').attr('role', 'presentation'); // filters
$('#divStats').attr('role', 'presentation'); // stats
$('.rightsidebar > .issueDetails').attr('role', 'presentation'); // details sidebar


// add meaningful text labels to buttons
// =====================================
$('#toolbar #status li button[title="Reply"]').append('Create Reply');
// ^-reply on ticket details page


// remove appended 'days' label and replace placeholder
// ====================================================
// (filter panel, better use of placeholder for keyboard navigation)
$('table.grey tbody input[name=dueFilter]').attr('placeholder', 'Days until due');
$(".filterBox td:contains(days)").prev().attr('colspan',2);
$(".filterBox td:contains(days)").remove();


// Keystroke Shortcuts
// ===================
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
    // use 'skip' as a known point, top-left of page
    document.getElementById('skipNew').focus();
  }

// using <alt>+<q> to 'quit' out of modal/dropdown/trap elements
// (simulates a mouse user having to click-away from the element to close it) 
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
// ================================
// (JC, 15/3/2022)
$("#CategoryID").change(function(){
  $('#Subject').focus();
});


// TEST Shift focus, filter -> reset ??
// ------------------------------------
// (JC, 11/3/2022)

$('#filterForm button[type="submit"]').click(function(){
  $('#btnResetFilter').focus();
  currFoc = 'btnResetFilter';
});


// TEST - add meaningful label, based on title?
// --------------------------------------------
//$('table.outerroundedbox.menulist div a').attr('aria-label', //$('table.outerroundedbox.menulist div a').text());
//^-fail... look at an 'each' ???
