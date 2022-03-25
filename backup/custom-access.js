// Current Focus/URL
var currFoc = 'none';
var url = window.location.href;

// provide simple async delay function
function sleep(milliseconds) {  
  return new Promise(resolve => setTimeout(resolve, milliseconds));  
}

// Insert div for "skip to new ticket"
// ===================================
// yellow 'bar' at top of page on first <tab>
// (JC, 8/3/2022)
$('#divBigHeader').prepend('<a id="skipNew" href="#newButton" onclick="document.getElementById(\'newTkt\').focus();" aria-label="Skip to New Ticket"><span>Skip to New Ticket</span></a>');
// Hide "skip" on new ticket page
// no 'new ticket' button on the new ticket page
// (JC, 8/3/2022)
if(url.includes('/New')) {
  $('#skipNew').css('display','none');
}


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


// shift focus to first ticket after filter is applied
// ===================================================
if( url.includes('?mode=') && !url.includes('resetFilter=True') ) {
  $('tbody > tr:first-child > td:first-child a.ticketLink').focus();
}


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
$('#PriorityID').attr('aria-label', 'press space to open priority dropdown');
$('#btnAdd').attr('aria-label', 'submit ticket');


// ARIA labels on ticket details custom fields
// ===========================================
$('tbody#TicketCustomFields button.editButton').each(function() {
  let selId     = $(this).prop('id');
  let origTitle = $(this).prop('title');
  let newLabel  = origTitle.substring(0, origTitle.length-3);
  $(this).attr('aria-label', 'Change '+newLabel);
});


// Add pseudo-placeholders where missing on <select>
// =================================================
//$('#fromDepartmentId').prepend('<option class="selectPlaceholder" value="" disabled selected hidden>department name</option>');
//$('#filterForm select[name="badge"]').prepend('<option class="selectPlaceholder" value="" disabled selected hidden>updated by</option>');
// ^- disabled, not working consistently ???


// Set roles where missing
// =======================
$('.topheader').attr('role', 'banner');
//$('#tbQuery').attr('role', 'search');
// make body the 'main' region on ticket details page
$('#ticketBody').attr('role', 'main');
// add 'tab' to ticket body text to allow screen reader user to tab
$('#ticketBody #body').attr('tabindex', '0');
//$('#btnAdd').attr('role', 'button');


// set role textbox on ticket/reply body
// add ARIA label
// =====================================
$('#txtNewComment').focus(function(){
  $('#txtNewComment').attr('role', 'textbox');
  $('#rtetbNewComment').attr('role', 'textbox');
}); // ^- clicking or tabbing into field
$('#newReply').click(function(){
  $('#txtNewComment').attr('role', 'textbox');
  $('#rtetbNewComment').attr('role', 'textbox');
}); // ^- using new reply button
$('#Subject').focus(function(){
  $('#rteBody').attr('role', 'textbox');
  $('#rteBody').attr('aria-label', 'ticket body');
}); // ^- body on new ticket page


// remove font awesome icons from tabindex
// (prevents 'double-tab' for keyboard only navigation)
// =====================================================
$('i.icon').parent('a').attr('tabindex', '-1');      // report icons
$('.kbHeader .fa.fa-search').attr('tabindex', '-1'); // magnif glass


// mark mis-used "layout" tables as ARIA presentation
// ==================================================
// (prevents JAWS reading misleading 'layout' info)
$('#maintable').attr('role', 'presentation'); // page layout
$('#filterForm > table.grey').attr('role', 'presentation'); // filters
$('#divStats').attr('role', 'presentation'); // stats
$('.rightsidebar > .issueDetails').attr('role', 'presentation'); // details sidebar
$('#new-ticket-form table').attr('role', 'presentation'); // new ticket


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


// add 'close' button to user-profile recent tickets
// =================================================
// (JC, 24/3/2022)
$('#btnUser').click( function() {
  if ($('#closeButton').length)
  { console.log('button exists'); } else {
    console.log('button required');
    $('#divRecent a.graybutton').addClass('logoutButton');
    $('#divRecent').append('<button class="button graybutton" id="closeButton" tabindex="0">Close</button>');
  }
});

$('#closeButton').click( function() {
  $('body').click();
  $('#btnUser').focus();
  document.getElementById('btnUser').focus();
  console.log('close');
});


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
// added <Esc> key-press to same rule (24/3/2022)
// (simulates a mouse user clicking "away" from the element to close it) 
if (( e.key.toLowerCase() === 'q' && e.altKey) || e.key === 'Escape' ) {
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



//$('#filterForm button[type="submit"]').click(function(){
//  $('tbody > tr:first-child > td:first-child a.ticketLink').focus();
//});



// Delayed Actions
// ===============
// Eg/ sleep(250).then(() => { //here; })
// (JC, 24/3/2022)

sleep(250).then(() => {  
 
  // write 'tags' into title of tags input field on ticket details
  $('#tbTags_tag').attr('title', 'tags');

  // new ticket, move focus up to category
  $("#CategoryID + .dropdownSelect a.dropdown-toggle").focus();

})


