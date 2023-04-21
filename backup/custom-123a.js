// VERSION TRACKER
// 2.01 - Annotated/Reordered, Feb 2023
// 2.02 - predictive category dropdown
console.log('[Custom.JS] loaded');


// ===========================================================
// GLOBAL PAGE VARIABLES
// (all environments)
// ===========================================================

// Get the current user's department name
initializeCurrentUser().then(currentUser => {
  console.log('CustomJS, Dept: ' + currentUser.department);
});

// used in AT remediation, focus highlighting
var currFoc = 'none';

// used in AT remediation, conditions based on current page
var url     = window.location.href;

// used in 'back' behaviour, when ticket opened via email
var pageRef = document.referrer;
var prevUrl = "window.location.href='/';";

// -----------------------------------------------------------
// GLOBALS (END)
// -----------------------------------------------------------



// ===========================================================
// DISPLAY JITBIT DEPLOYMENT/CONFIG INFO IN FOOTER
// (all environments)
// ===========================================================

// eg- "v1.12"
var currConfig = "1.22e";

// (JC, 5/8/2022)
// append into footer, and add link to KB change section
$('div.footer').prepend('<div class="footerVersion"><a href="https://helpdesk.jitbit.cr.probation.service.justice.gov.uk/KB/Category/179-">JitBit Case Admin: config v'+currConfig+'</a></div>');

// -----------------------------------------------------------
// DISPLAY CONFIG VERSION (END)
// -----------------------------------------------------------



// ===========================================================
// NAVIGATION "BACK" LOGIC FOR CLOSE/EXIT BUTTON
// (all environments)
// ===========================================================

// (JC, 23/8/22)
if ( pageRef.includes('helpdesk') ) { prevUrl = 'history.go(-1);' }

// -----------------------------------------------------------
// NAVIGATION BACK (END)
// -----------------------------------------------------------



// ===========================================================
// SWAP OF MY SAVE FILTERS TO TOP-LEFT
// (all environments)
// ===========================================================

// Request via JitBit Forum, display saved filters top-left
if( url.endsWith('gov.uk') || url.endsWith('gov.uk/') || url.includes('gov.uk/?mode') ) {
 $('#divSavedFilters').insertBefore('#divCategories');
}

// -----------------------------------------------------------
// FILTER SWAP (END)
// -----------------------------------------------------------



// ===========================================================
// BLOCK SAVE OF "GLOBAL" CANNED RESPONSES
// (all environments)
// ===========================================================

// (JC, 9/8/2022)
sleep(250).then(() => { //1
// wait until page load/modification completed
  $('#newTemplate').click( function() { blockGlobalCanned(); } );

// TEST2--click pencil?
$('#selTemplates > button').click( function() {
  console.log('[Custom.JS] Canned Responses');
  sleep(250).then(() => { //1a
  //target the 'edit' pencil icon...
  //$('a.edit').click( function() { blockGlobalCanned(); } );
  $('li.cResponse > a.edit').on('click', function() { blockGlobalCanned(); } );
  }) //1a
});

}) //1

function blockGlobalCanned() {
console.log('[Custom.JS] New canned');

sleep(250).then(() => { //2
  //wait until dropdowns have been added
  let currCats = $('#templateEdit button span.ui-icon+span').html();
  console.log('[Custom.JS] New, cats='+currCats);
  $('#templateEdit button span.ui-icon+span').attr('id','canCat');
  //append warning text, if it's not already added
  if ( $('#cannedWarn').length < 1 ) {
  $('#templateEdit div.grey2').append('. <span id="cannedWarn"><br />You cannot save a canned response unless you select one or more categories.</span>');
  }
  // check if 'global' list of categories
  if (currCats == 'ALL') {
    console.log('[Custom.JS] ALL categories set');
    $("#templateEdit button[onclick='SaveTemplate()']").attr('disabled',true);
  } 

  // create the mutation observer
  const cannedCategory = document.querySelector("#canCat");
  var watchCannedCategory = new MutationObserver(allowCanSave);
  watchCannedCategory.observe(cannedCategory,{childList:true,subtree:true});

// monitor for any changes to the state of #canCat
function allowCanSave(mutations) {
  console.log('[Custom.JS] Categories toggled');
  let currCats = $('#templateEdit button span.ui-icon+span').html();
  if (currCats !== 'ALL') {
    console.log('[Custom.JS] ALL not set');
    $("#templateEdit button[onclick='SaveTemplate()']").removeAttr('disabled');
  } else {
    $("#templateEdit button[onclick='SaveTemplate()']").attr('disabled',true);
  }

} 

}) //2

}

// -----------------------------------------------------------
// BLOCK GLOBAL SAVE (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - ARIA LABELS
// (all environments)
// ===========================================================

// Add ARIA label to +/- toggle on row with sub-tickets
// (JC, 19/4/22)

// mutation observer for page update event, new tickets, etc
if( $('#tblTickets').length != 0 ) {
  const ticketGrid = document.querySelector("#tblTickets");
  var watchTicketGrid = new MutationObserver(subticketToggle);
  watchTicketGrid.observe(ticketGrid,{childList:true,subtree:true});
}

// add ARIA labels to +/- toggle on update event
function subticketToggle(mutations) {
  $('.ticketrowMeta+a.fa-plus-square-o').attr('aria-label', 'show sub tickets');
  $('.ticketrowMeta+a.fa-minus-square-o').attr('aria-label', 'hide sub tickets');
}

// target specific +/- element by on-click trigger
$('.ticketrowMeta+a.fa').click( function() { 
  if ( $(this).hasClass('fa-plus-square-o') == true ) {
    $(this).attr('aria-label', 'show sub tickets'); } 
  else if ( $(this).hasClass('fa-minus-square-o') == true ) {
    $(this).attr('aria-label', 'hide sub tickets');
  }
});

// Set aria labels where missing on buttons and labels

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
$('tbody#TicketCustomFields button.editButton').each(function() {
  let selId     = $(this).prop('id');
  let origTitle = $(this).prop('title');
  let newLabel  = origTitle.substring(0, origTitle.length-3);
  $(this).attr('aria-label', 'Change '+newLabel);
});

// -----------------------------------------------------------
// ARIA LABELS (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - MISSING MANDATORY FIELDS (JAWS)
// (all environments)
// ===========================================================

// provide (JAWS) alert for missing mandatory fields
// (JC, 1/4/2022)
$('#btnAdd').click( function() { 
  sleep(100).then(() => { console.log('[Custom.JS] missing new ticket fields'); 

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
  // Modified for v10.14, JC 31/3/2023
  // $('[id^="CustomFieldValue"].required.error').each(function() {
  $('[id^="CustomFieldValue"].error[required="required"]').each(function() {
    let label  = $(this).prev('label').prev('label').text();
    let field  = label.replace('*','').trim(); // remove '*' and tabs
    customList += field+", ";

    let labelNew = $(this).prev('label').prev('label').text();
    console.log('CustomJS: '+labelNew+', ');

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

// Insert missing fields 'alert' div on New Ticket page
$('#new-ticket-form tbody').prepend('<tr><td><div id="mandatoryAlert" role="alert"></div></td></tr>');

// -----------------------------------------------------------
// MISSING MANDATORY FIELDS (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - SKIP TO NEW TICKET FUNCTIONALITY
// (all environments)
// ===========================================================

// yellow 'bar' at top of page on first <tab>
// (JC, 8/3/2022)

$('#divBigHeader').prepend('<a id="skipNew" href="#newButton" onclick="document.getElementById(\'newTkt\').focus();" aria-label="Skip to New Ticket"><span>Skip to New Ticket</span></a>');
// Hide "skip" on new ticket page
// no 'new ticket' button on the new ticket page
// (JC, 8/3/2022)
if(url.includes('/New') || url.includes('/User/LostPassword') || url.includes('/User/Login') || $('#userinfo button:visible').text()=='sign in') {
  $('#skipNew').css('display','none');
}

// -----------------------------------------------------------
// SKIP TO NEW (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - CORRECT 'UNUSUAL' TAB/FOCUS ORDERS
// (all environments)
// ===========================================================

// shift focus to first ticket after filter is applied
if( url.includes('?mode=') && !url.includes('resetFilter=True') ) {
  $('tbody > tr:first-child > td:first-child a.ticketLink').focus();
}

// Assign button on ticket details, shift focus to dropdown
$('#btnAssign').click( function() {
  $('#selTechId').focus();
  document.getElementById('selTechId').focus();
});

// Shift focus category -> subject, and check CRN
// (JC, 15/3/2022)
$("#CategoryID").change(function(){
  // hide mandatory field alert when category is changed
  $('#mandatoryAlert').css({'display':'none'}); // hide
  $('#Subject').focus();


// Warning if CRN does not match usual syntax
sleep(250).then(() => { //sleep
  $('#CustomFieldValue1').blur( function () {
    let crnVal = document.getElementById('CustomFieldValue1').value;
    let crnDis = 0;
    if ( $('#crnWarn').length == 1 ) { crnDis = 1; }
    if ( crnVal.match(/([a-z]\d{6}$)/i) ) { 
      console.log('[Custom.JS] crn looks ok');
      $('#crnWarn').remove();
    } else {
      console.log('[Custom.JS] crn looks invalid');
      if ( crnDis == 0 ) {
      $('<span id="crnWarn"><strong>THIS CRN DOES NOT FOLLOW THE USUAL FORMAT.</strong></span>').insertAfter('#CustomFieldValue1'); }
    };
  });
}); //wake
});
// end, cat->subj and CRN check

// Shift focus, advanced -> Subsribers_tag on New Ticket screen
// (JC, 7/4/2022)
$("#lnkAdvanced").click(function(){
  console.log('[Custom.JS] Clicked advanced');
  //sleep(200).then(() => {
    $('#Subscribers_tag').focus();
  //})
});
// ------------------------------------------------------------

// -----------------------------------------------------------
// FILTER, FOCUS FIRST TICKET (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - MOVE "NEW TICKET" BEFORE "SEARCH"
// (all environments)
// ===========================================================

// NOTE: requires a "float: left" in custom CSS above
$('#newTicket').insertBefore('.divSearch');

// -----------------------------------------------------------
// SWAP NEW/SEARCH (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - CREATE H1 HEADING ON EVERY PAGE
// (all environments)
// ===========================================================

// Mark active tab title as H1 for every page
$('div#divBigHeader ul.tabmenu li.active a').html( function() {
  let value = $('div#divBigHeader ul.tabmenu li.active').html();
  let innerHtml = value.substring(value.search('</i>')+5,value.length-4);
  let allHtml = value.replace(innerHtml,'<h1>'+innerHtml+'</h1>');
  let newHtml = allHtml.substring(allHtml.search('>')+1,allHtml.length-4);
  //console.log( newHtml );
  $('div#divBigHeader ul.tabmenu li.active a').html(newHtml);
});

// -----------------------------------------------------------
// ADD H1 HEADINGS (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - INSERT MISSING IDs AND ROLES AND LABELS
// (all environments)
// ===========================================================

// IDs
// ---
$('#divBigHeader #newTicket a.button').prop('id','newTkt');
$('#logo a').prop('id','logoLink');
$('#statusId').next().prop('id','statusIdButton');
$('.dropdownSelect a.dropdown-toggle').prop('id','catDrop');
$('#toolbar #status li button[title="Reply"]').prop('id','newReply');
// file upload button did not respond to tab...enter in Edge
$('#fileUploadLbl').parent().prop('id','attachFile');
$('#fileUploadLbl').parent().attr('onclick','this.firstChild.click()');

// ROLES
// -----
$('.topheader').attr('role', 'banner');
//$('#tbQuery').attr('role', 'search');
// make body the 'main' region on ticket details page
$('#ticketBody').attr('role', 'main');
// add 'tab' to ticket body text to allow screen reader user to tab
$('#ticketBody #body').attr('tabindex', '0');
//$('#btnAdd').attr('role', 'button');
$('#fileUploadLbl').parent().attr('role', 'button');

// TEXTBOX ON TICKET REPLY
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

// -----------------------------------------------------------
// IDs AND ROLES AND LABELS (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - REMOVE ICONS FROM TAB ORDER
// (all environments)
// ===========================================================

// remove font awesome icons from tabindex
// (prevents 'double-tab' for keyboard only navigation)
$('i.icon').parent('a').attr('tabindex', '-1');      // report icons
$('.kbHeader .fa.fa-search').attr('tabindex', '-1'); // magnif glass

// -----------------------------------------------------------
// ICONS (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - MISUSED LAYOUT TABLES, ADD 'PRESENTATION'
// (all environments)
// ===========================================================

// (prevents JAWS reading misleading 'layout' info)
$('#maintable').attr('role', 'presentation'); // page layout
$('#filterForm > table.grey').attr('role', 'presentation'); // filters
$('#divStats').attr('role', 'presentation'); // stats
$('.rightsidebar > .issueDetails').attr('role', 'presentation'); // details sidebar
$('#new-ticket-form table').attr('role', 'presentation'); // new ticket

// -----------------------------------------------------------
// PRESENTATION TABLES (END)
// -----------------------------------------------------------





// add meaningful text labels to buttons
// =====================================
$('button[title="Reply (R)"]').append('Reply');
// ^-reply on ticket details page
$('#btnInProcess').append('&nbsp;In Progress');
// ^-in progress 'icon' button on ticket details page
// ------------------------------------------------------------


// replace confusing 'close' button with an 'exit' button
// ======================================================
$('#btnClose').hide();
$('<li><button title="Exit" id="btnExit" onClick="'+prevUrl+'"><i class="fa fa-x"></i>Exit</button></li>').insertAfter('#toolbar > ul#status > li:first-child');
// ^- hide and append an 'exit' button
// ------------------------------------------------------------


// update "reply" text on ticket details update
// update "in progress" text (22-aug-22)
// hide "close" button (22-aug-22)
// append "exit" button (22-aug-22)
// correct navigation logic on exit button (23-aug-22)
// --------------------------------------------
// (JC, 23/08/22)

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
  // the REPLY button
  if ( $('button[title="Reply (R)"]').text() == "" ) {
  $('button[title="Reply (R)"]').append('Reply'); }
  // the IN PROGRESS button
  if ( $('#btnInProcess').text() == "" ) {
  $('#btnInProcess').append('&nbsp;In Progress'); }
  // hide CLOSE button
  $('#btnClose').hide();
  // append EXIT button
  if( $('#btnExit').length == 0 ) {
    $('<li><button title="Exit" id="btnExit" onClick="history.go(-1);"><i class="fa fa-x"></i>Exit</button></li>').insertAfter('#toolbar > ul#status > li:first-child');
  } //exit
}





// ===========================================================
// AT REMEDIATION - FILTER PANEL, KEYBOARD/TAB NAVIGATION
// (all environments)
// ===========================================================

// (filter panel, better use of placeholder for keyboard navigation)
$('table.grey tbody input[name=dueFilter]').attr('placeholder', 'Days until due');

// remediation for new fields from v10.14
$('table.grey tbody input[name=dueFilter]').parent().attr('colspan',2);
$('table.grey tbody input[name=dueFilter]').parent().next().remove();

// -----------------------------------------------------------
// FILTER PANEL (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - USER PROFILE, ALLOW KEYBOARD 'CLOSE'
// (all environments)
// ===========================================================

// (JC, 1/8/2022)
$('#btnUser').click( function() {
  if ($('#closeRecent').length)
  { console.log('[Custom.JS] close button exists'); } else {
    console.log('[Custom.JS] close button required');
    sleep(250).then(() => { 
    // prepend ticket ref
    $('#divRecent li a').each(function() {
      let refUrl=$(this).attr('href');
      let refId=refUrl.substring(refUrl.lastIndexOf('/')+1,99).trim();
      let refHtml=$(this).html();
      //console.log(refId+', '+refHtml);
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
  console.log('[Custom.JS] Close user profile');
});

// -----------------------------------------------------------
// USER PROFILE CLOSE (END)
// -----------------------------------------------------------



// ===========================================================
// AT REMEDIATION - KEYBOARD SHORTCUTS (Restore <esc> etc)
// (all environments)
// ===========================================================

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
  $('#catPredList').remove(); // predictive category list dropdown
  // if the user is in a multiselect combo, close it and return the focus
    if ( currFoc.includes('ui-multiselect-') ) {
      $('.ui-multiselect-menu').css('display','none');
      $('#'+currFocId).next().focus();
    }
  }
});

// -----------------------------------------------------------
// KEYBOARD SHORTCUTS (END)
// -----------------------------------------------------------



// ===========================================================
// DELAYED ACTIONS - FOCUS CHANGES AND LABELS
// (all environments)
// ===========================================================

// Eg/ sleep(250).then(() => { //here; })
// (JC, 24/3/2022)

sleep(333).then(() => {  
  console.log('[Custom.JS] Delayed 333ms');
 
  // write 'tags' into title of tags input field on ticket details
  $('#tbTags_tag').attr('title', 'tags');

  // new ticket, move focus up to category
  // modified 18/11/2022, custom category select dropdown
  //$("#CategoryID + .dropdownSelect a.dropdown-toggle").focus();
  //$('#catPred').focus();

  // insert 'textbox' before category (on new ticket)
  $("#CategoryID + .dropdownSelect a.dropdown-toggle").parent().prepend('<input type="text" name="catPred" id="catPred" placeholder="Category..." class="" autocomplete="off"><span id="catCheck"><i aria-hidden="true" class="fa fa-check icon"></i></span>');
  // give it focus
  $('#catPred').focus();

  // check for focus on textbox
  // --------------------------
  $('#catPred').focus( function() {
  if ($('#catPredList').length) { console.log('cat-list open'); } else {
    getUserCats();
  }
  });

  // check for click on textbox
  // --------------------------
  $('#catPred').on('click', function() {
  if ($('#catPredList').length) { console.log('cat-list open'); } else {
    getUserCats();
  }
  });

  // check for typing into textbox
  // --------------------------
  $('#catPred').on("input", function() {
  if ($('#catPredList').length) { console.log('cat-list open'); } else {
    getUserCats();
  }
  });

  // check for blur on textbox
  // -------------------------
  $('#catPred').blur( function() {
    sleep(10).then(() => {
      let jsId = document.activeElement.id;
      let curr = String(document.activeElement.classList);
      let list = curr.includes('catPredList');
      if (list==false) { $('#catPredList').remove();
      console.log(); }
    });
  });

});

// -----------------------------------------------------------
// DELAYED ACTIONS (END)
// -----------------------------------------------------------



// ===========================================================
// DEFINE FUNCTIONS
// (all environments)
// ===========================================================

// provide a simple async delay function
function sleep(milliseconds) {  
  return new Promise(resolve => setTimeout(resolve, milliseconds));  
}

// add date icon to custom fields
function addDateIcon() {
  sleep(100).then(() => {
    $('.report-settings div.report-input input.datepick').before('<i class="fa fa-calendar icon" aria-hidden="true"></i>');
  });
}

// create a cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// read a cookie
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}



// ===========================================================
// PREDICTIVE CATEGORY LOOKUP / DROPDOWN
// (all environments)
// ===========================================================

// Request via JitBit Forum, replaces default two-tier menu
// get all categories available to user
function getUserCats() {

  const catLookup = [];
  // step through built in category field to pull list of categories
  $('#CategoryID > optgroup').each( function() {
    let secName = $(this).attr('label');
    $(this).children('option').each( function() {
        let cat = $(this).text();
        let id = $(this).attr('value');
        let drop = secName+' > '+cat+' ('+id+')'
        catLookup.push(drop);
  });
});
console.table(catLookup);

// append dropdown
  $('#catPred').after('<div id="catPredList" class="catPredListText"><ul></ul></div>');

  catLookup.forEach( function(item) {
    let listId = item.substr(item.lastIndexOf('(')+1,item.lastIndexOf(')')-item.lastIndexOf('(')-1);
    let catOnly = item.substr(0,item.lastIndexOf('(')-1);
    let listItem = '<li><a href="#" id="'+listId+'"  class="catPredListItem">'+catOnly+'</a></li>';
    // add each item onto dropdown
    $('#catPredList ul').append(listItem);
    // hide any categories that don't match search query (if any)
    hideCats();
  });


  // check for blur on list-items
  $('.catPredListItem').blur( function() {
    sleep(10).then(() => {
      let jsId = document.activeElement.id;
      let curr = String(document.activeElement.classList);
      let list = curr.includes('catPredList');
      if (list==false && jsId!='catPred') { $('#catPredList').remove(); }
    });
  });


  // check for focus on list-items
  $('.catPredListItem').focus( function() {
    let jsId = document.activeElement.id;
    let catId = $(this).attr('id');
  });


  // check for click on list-items
  $('.catPredListItem').on('click', function() {
    let jsId = document.activeElement.id;
    let catId = $(this).attr('id');
    let catName = $('#catPredList a#'+catId).text();
    $('#CategoryID option[value='+catId+']').prop('selected', true);
    $('#catPred').val(catName);
    RefreshCategoryInfo();
    console.log('[Custom.JS] Selected a category.');
  //$('#mandatoryAlert').css({'display':'none'}); // hide field errors
  //$('label.error').css({'display':'none'}); // hide other errors
  $('#Subject').focus(); // 'tab' into subject
    $('#catCheck').css('display','inline-block');
    $('#catPred').css('background','#e0f0e0');
    $('#catPredList').remove();
    addDateIcon();
  });


  // user starts typing into the text input box
    $("#catPred").on("input", function(){
      //show dropdown, if currently hidden
      if ($('#catPredList').length) { console.log('cat-list open'); } else {
    getUserCats();
  }
      // remove green tick
      $('#catCheck').css('display','none');
      $('#catPred').css('background','white');
      // unset JitBit category
      $('#CategoryID option[value=-1]').prop('selected', true);

      // remove field warning if category changes
      $('#mandatoryAlert').css('display','none');

      // hide any categories that don't match search query (if any)
      hideCats()
    });

}


function hideCats() {
  $('#catPredList li a').each( function() {
    let srcText = $('#catPred').val().toLowerCase();
    let chkText = $(this).text().toLowerCase();
    if ( chkText.includes(srcText) ) {
      $(this).removeClass('hide');
    } else {
      $(this).addClass('hide');
    }
  });

} // (end, getUserCats)

// -----------------------------------------------------------
// CATEGORY LOOKUP (END)
// -----------------------------------------------------------



// ===========================================================
// RETRIEVE THE CURRENTLY LOGGED IN USER'S DEPARTMENT
// (all environments)
// ===========================================================

// Retrieve the current user's ID, Company and Department
// JC, 2/4/2023

async function initializeCurrentUser() {
  const myCookie = getCookie("myCookie");
  if (myCookie) {
    // cookie exists, parse the values and use them
    const currentUser = JSON.parse(myCookie);
    return currentUser;
  } else {
    // cookie doesn't exist, fetch the values from the server and create the cookie
    const result = await fetch("/User/GetRecentlyViewedTickets")
      .then(response => response.text())
      .then(data => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;
        const url = tempDiv.querySelector('h2 a').getAttribute('href');
        const fullUrl = url; // +`/${url}`;
        const userId = fullUrl.split('/').pop();
        
        return fetch(fullUrl)
          .then(response => response.text())
          .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            const company = tempDiv.querySelector('td a[href^="/User/Company/"]').textContent;
            const department = tempDiv.querySelector('td a[href^="/User/Department/"]').textContent;
      
            // create cookie
            setCookie("myCookie", JSON.stringify({ userId, company, department }), 1);
      
            return { company, department, userId };
          });
      });

    console.log('CustomJS, set cookie: '+result.userId+', '+result.company+', '+result.department);

    return result;
  }
}
