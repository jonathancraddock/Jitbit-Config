// VERSION TRACKER
// 1.06 - pre-pend ticket ref in recent tickets (1/8/2022)

// Current Focus/URL
var currFoc = 'none';
var url = window.location.href;
console.log(url);

// provide simple async delay function
function sleep(milliseconds) {  
  return new Promise(resolve => setTimeout(resolve, milliseconds));  
}

// ===





// TEST--Don't save global canned responses
// (JC, 9/8/2022)
// ----------------------------------------------------

sleep(250).then(() => { //1
// wait until page load/modification completed
$('#newTemplate').click( function() {
console.log('new template');

sleep(250).then(() => { //2
  //wait until dropdowns have been added
  let currCats = $('#templateEdit button span.ui-icon+span').html();
  console.log('new template and canned='+currCats);
  $('#templateEdit button span.ui-icon+span').attr('id','canCat');
  //append warning text, if it's not already added
  if ( $('#cannedWarn').length < 1 ) {
  $('#templateEdit div.grey2').append('. <strong id="cannedWarn">You cannot save a canned response unless you select one or more categories!</strong>');
  }
  // check if 'global' list of categories
  if (currCats == 'ALL') {
    console.log('ALL set');
    $("#templateEdit button[onclick='SaveTemplate()']").attr('disabled',true);
  } 

  // create the mutation observer
  const cannedCategory = document.querySelector("#canCat");
  var watchCannedCategory = new MutationObserver(allowCanSave);
  watchCannedCategory.observe(cannedCategory,{childList:true,subtree:true});

// monitor for any changes to the state of #canCat
function allowCanSave(mutations) {
  console.log('currCats - toggle');
  let currCats = $('#templateEdit button span.ui-icon+span').html();
  if (currCats !== 'ALL') {
    console.log('ALL not set');
    $("#templateEdit button[onclick='SaveTemplate()']").removeAttr('disabled');
  } else {
    $("#templateEdit button[onclick='SaveTemplate()']").attr('disabled',true);
  }

} 

}) //2

});

}) //1

// ====================================================




// Add ARIA label to +/- toggle on row with sub-tickets
// ----------------------------------------------------
// (JC, 19/4/22)

// mutation observer for page update event, new tickets, etc
if( $('#tblTickets').length != 0 ) {
  const ticketGrid = document.querySelector("#tblTickets");
  var watchTicketGrid = new MutationObserver(subticketToggle);
  watchTicketGrid.observe(ticketGrid,{childList:true,subtree:true});
}

// action on update event
function subticketToggle(mutations) {
  $('.ticketrowMeta+a.fa-plus-square-o').attr('aria-label', 'show sub tickets');
  $('.ticketrowMeta+a.fa-minus-square-o').attr('aria-label', 'hide sub tickets');
}

// target specific element by on-click trigger
$('.ticketrowMeta+a.fa').click( function() { 
  if ( $(this).hasClass('fa-plus-square-o') == true ) {
    $(this).attr('aria-label', 'show sub tickets'); } 
  else if ( $(this).hasClass('fa-minus-square-o') == true ) {
    $(this).attr('aria-label', 'hide sub tickets');
  }
});


// ===

// Missing "New Ticket" mandatory fields
// =====================================
// provide (JAWS) alert for missing mandatory fields
// (JC, 1/4/2022)
$('#btnAdd').click( function() { 
  sleep(100).then(() => { console.log('missing new ticket fields'); 

  // display errors *before* default fields
  $('#Subject-error').insertBefore('#Subject');
  $('#Body-error').parents('td').prop('id','bodytd');
  $('#Body-error').insertBefore('#bodytd>div');

  // display errors *before* custom fields
  $('label[id^="CustomFieldValue"].error').each(function() {
    $(this).insertBefore('#'+$(this).attr('for'));
  });

  // define variables and messages
  let cat        = $('#CategoryID').val();
  let subj       = $('#Subject').val();
  let bodyLength = $('#Body').val().length;

  let msg        = '';
  let customList = '';
  let errors     = $('label.error:visible').length; // count

  // new ticket default mandatory fields, warnings
  if (cat==-1) {msg += 'Ticket Category, '};
  if (subj.length==0) {msg += 'Subject, '};
  if (bodyLength==0) {msg += 'Body, '};

  // get list of missing/required custom fields
  $('[id^="CustomFieldValue"].required.error').each(function() {
    let label  = $(this).prev('label').prev('label').text();
    let field  = label.replace('*','').trim(); // remove '*' and tabs
    customList += field+", ";
  });

  // combine warnings, and trim trailing comma
  mfWarn = msg+customList;
  mfWarn = mfWarn.substring(0,mfWarn.length-2);

  // write errors to 'alert' DIV
  if ( errors > 0 ) {
    // set appropriate present indicative for error message
    if (errors>1) {
      pInd=" are"; 
      plur="fields are"; } else {
      pInd=" is";
      plur="field is"; };
    $('#mandatoryAlert').html('This ticket category includes mandatory fields and '+errors+pInd+' missing.<br />The missing '+plur+': '+mfWarn);
    $('#mandatoryAlert').css({'display':'block'}); // show
    sleep(250).then(() => {
      $("a.dropdown-toggle").focus();
      //$('html, body').scrollTop();
      $(window).scrollTop(0);
    })
  }
});

});

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
// ------------------------------------------------------------


// Reverse order of newTicket and divSearch DIV elements
// =====================================================
// NOTE: requires a "float: left" in custom CSS above
$('#newTicket').insertBefore('.divSearch');
// ------------------------------------------------------------


// Prepare missing fields 'alert' div on New Ticket page
// =====================================================
$('#new-ticket-form tbody').prepend('<tr><td><div id="mandatoryAlert" role="alert"></div></td></tr>');
// ------------------------------------------------------------


// Prepare subscribe notification 'alert' div on New Ticket page
// =============================================================
$('tr#trNewTicketTools + tr > td').prepend('<div id="subscribeAlert" role="alert"></div>');
// -------------------------------------------------------------


// Mark active tab title as H1 for every page
// ==========================================
$('div#divBigHeader ul.tabmenu li.active a').html( function() {
  let value = $('div#divBigHeader ul.tabmenu li.active').html();
  let innerHtml = value.substring(value.search('</i>')+5,value.length-4);
  let allHtml = value.replace(innerHtml,'<h1>'+innerHtml+'</h1>');
  let newHtml = allHtml.substring(allHtml.search('>')+1,allHtml.length-4);
  //console.log( newHtml );
  $('div#divBigHeader ul.tabmenu li.active a').html(newHtml);
});
// ------------------------------------------------------------


// add caption/heading H2 to main ticket table list
// ================================================
if( url.endsWith('/helpdesk') || url.endsWith('/helpdesk/') || url.includes('/helpdesk?') || url.includes('/helpdesk/?') ) { $('#tblTickets').prepend('<caption><h2>Tickets List</h2></caption>'); 
$('#maintable > tbody > tr > td:first-child').prepend('<h2>Categories and Filters</h2>'); }
// ------------------------------------------------------------


// shift focus to first ticket after filter is applied
// ===================================================
if( url.includes('?mode=') && !url.includes('resetFilter=True') ) {
  $('tbody > tr:first-child > td:first-child a.ticketLink').focus();
}
// ------------------------------------------------------------


// Add missing IDs where required
// ==============================
$('#divBigHeader #newTicket a.button').prop('id','newTkt');
$('#logo a').prop('id','logoLink');
$('#statusId').next().prop('id','statusIdButton');
$('.dropdownSelect a.dropdown-toggle').prop('id','catDrop');
$('#toolbar #status li button[title="Reply"]').prop('id','newReply');
// file upload button did not respond to tab...enter in Edge
$('#fileUploadLbl').parent().prop('id','attachFile');
$('#fileUploadLbl').parent().attr('onclick','this.firstChild.click()');
// ------------------------------------------------------------


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
$('#fileUploadLbl').parent().attr('aria-label', 'attach file');
$('#thTicketDate').attr('aria-label', 'Sort by Ticket Date');
// ------------------------------------------------------------


// ARIA labels on ticket details custom fields
// ===========================================
$('tbody#TicketCustomFields button.editButton').each(function() {
  let selId     = $(this).prop('id');
  let origTitle = $(this).prop('title');
  let newLabel  = origTitle.substring(0, origTitle.length-3);
  $(this).attr('aria-label', 'Change '+newLabel);
});
// ------------------------------------------------------------


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
$('#fileUploadLbl').parent().attr('role', 'button');
// ------------------------------------------------------------


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
// ------------------------------------------------------------


// remove font awesome icons from tabindex
// (prevents 'double-tab' for keyboard only navigation)
// =====================================================
$('i.icon').parent('a').attr('tabindex', '-1');      // report icons
$('.kbHeader .fa.fa-search').attr('tabindex', '-1'); // magnif glass
// ------------------------------------------------------------


// mark mis-used "layout" tables as ARIA presentation
// ==================================================
// (prevents JAWS reading misleading 'layout' info)
$('#maintable').attr('role', 'presentation'); // page layout
$('#filterForm > table.grey').attr('role', 'presentation'); // filters
$('#divStats').attr('role', 'presentation'); // stats
$('.rightsidebar > .issueDetails').attr('role', 'presentation'); // details sidebar
$('#new-ticket-form table').attr('role', 'presentation'); // new ticket
// ------------------------------------------------------------


// add meaningful text labels to buttons
// =====================================
$('button[title="Reply"]').append('Reply');
// ^-reply on ticket details page
// ------------------------------------------------------------

// update "reply" text on ticket details update
// --------------------------------------------
// (JC, 21/4/22)

// mutation observer for status change, takeover, reply, etc
if( $('div.outerroundedbox > #toolbar #status').length != 0 ) {
  const replyButtons = document.querySelector("#toolbar");
  var watchReplyButtons = new MutationObserver(updateButtons);
  watchReplyButtons.observe(replyButtons,{attributes: true,
    attributeFilter: ['style'], childList:true, subtree:true});
}
// action if ticket details page is changed/updated
function updateButtons(mutations) {
  console.log('updateButtons');
  if ( $('button[title="Reply"]').text() == "" ) {
  $('button[title="Reply"]').append('Reply'); }
}


// remove appended 'days' label and replace placeholder
// ====================================================
// (filter panel, better use of placeholder for keyboard navigation)
$('table.grey tbody input[name=dueFilter]').attr('placeholder', 'Days until due');
$(".filterBox td:contains(days)").prev().attr('colspan',2);
$(".filterBox td:contains(days)").remove();
// ------------------------------------------------------------


// add 'close' button to user-profile recent tickets
// pre-pend ticket ref (1/8/22)
// =================================================
// (JC, 1/8/2022)
$('#btnUser').click( function() {
  if ($('#closeRecent').length)
  { console.log('button exists'); } else {
    console.log('button required');
    sleep(250).then(() => { 
    // prepend ticket ref
    $('#divRecent li a').each(function() {
      let refUrl=$(this).attr('href');
      let refId=refUrl.substring(refUrl.lastIndexOf('/')+1,99).trim();
      let refHtml=$(this).html();
      console.log(refId+', '+refHtml);
      $(this).html(refId+': '+refHtml);
    });
    // add a close button button
      $('#divRecent a.graybutton').addClass('logoutButton');
      $('#divRecent').append('<button class="button graybutton" id="closeRecent" tabindex="0">Close</button>');
    })
  }
});

//$('#closeRecent').click( function() {
$('closeRecent').on('click', function() {
  //$('body').click();
  $('#divRecent').css('display','none');
  $('button#btnUser').focus();
  document.getElementById('btnUser').focus();
  console.log('close');
});
// ------------------------------------------------------------

// Assign button, shift focus to dropdown
$('#btnAssign').click( function() {
  $('#selTechId').focus();
  document.getElementById('selTechId').focus();
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
//if (( e.key.toLowerCase() === 'q' && e.altKey) ) {
  $('body').click();
  $('.datepick').datetimepicker('hide');
  // if the user is in a multiselect combo, close it and return the focus
    if ( currFoc.includes('ui-multiselect-') ) {
      $('.ui-multiselect-menu').css('display','none');
      $('#'+currFocId).next().focus();
    }
  }
});
// ------------------------------------------------------------


// Shift focus, category -> subject on New Ticket screen
// =====================================================
// (JC, 15/3/2022)
$("#CategoryID").change(function(){
  // hide mandatory field alert when category is changed
  $('#mandatoryAlert').css({'display':'none'}); // hide
  $('#Subject').focus();
});
// ------------------------------------------------------------


// Shift focus, advanced -> Subsribers_tag on New Ticket screen
// ============================================================
// (JC, 7/4/2022)
$("#lnkAdvanced").click(function(){
  console.log('click on advanced');
  //sleep(200).then(() => {
    $('#Subscribers_tag').focus();
  //})
});
// ------------------------------------------------------------


// Custom status "More..." button to be keybaord accessible
// ========================================================
// (JC, 29/3/2022)

// add ID and add options to tabindex order
$('#status button.moreBtnToolbar').prop('id','moreMouseOver');
$('li.customstatus form input').prop('tabindex','0');

//$('#btnInProcess').click( function() {
//  console.log('#btnInProcess');
//  $('#status button.moreBtnToolbar').prop('id','moreMouseOver');
//});

// trigger 'mouseover' when clicked
//$('#status button.moreBtnToolbar').click( function() {  
//  console.log('#moreMouseOver');
//  $('#status button.moreBtnToolbar').prop('id','moreMouseOver');
//  var elementButton = document.getElementById('moreMouseOver');
//  var eventTrig = new MouseEvent('mouseover', {'view': //window,'bubbles': true,'cancelable': true});
//  elementButton.dispatchEvent(eventTrig);
//});
// ------------------------------------------------------------


//$('#filterForm button[type="submit"]').click(function(){
//  $('tbody > tr:first-child > td:first-child a.ticketLink').focus();
//});


// Delayed Actions
// ===============
// Eg/ sleep(250).then(() => { //here; })
// (JC, 24/3/2022)

sleep(200).then(() => {  
 
  // write 'tags' into title of tags input field on ticket details
  $('#tbTags_tag').attr('title', 'tags');

  // new ticket, move focus up to category
  $("#CategoryID + .dropdownSelect a.dropdown-toggle").focus();

})
// ------------------------------------------------------------

// TEST - live services section, notify test
// =========================================
// JC, 10/5/2022

$('#CategoryID').change(function() { //new ticket, change of category
let currCat=$('#CategoryID').val();
if (currCat=="515452") {
  sleep(250).then(() => {
    $('#CustomFieldValue48430').change(function() {
      let currType=$('#CustomFieldValue48430').val();
      if (currType=="307460") { 
        $('#subscribeAlert').html('All new and modifications to existing case admin user accounts must be authorised.<br />Use <em>Advanced</em> > <em>Add Subscribers</em> to include your line manager in this request.');
        $('#subscribeAlert').css({'display':'block'}); // show
      } else { $('#subscribeAlert').css({'display':'none'}); }
    });
  });
}
});
// -----------------------------------------


//notes
//$('#Subject-error').insertBefore('#Subject');
//$('#Body-error').parents('td').prop('id','bodytd');
//$('#Body-error').insertBefore('#bodytd>div');
