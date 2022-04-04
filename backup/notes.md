Testing use of a mutation observer:
```javascript
// TEST - mutationobserver
// missing mandatory fields
function missedMandatory(mutations) {
  let errorCount = $('label.error').length;
  let cat =$('#CategoryID').val();
  let subj = $('#Subject').val();
  let body =$('#rteBody').text();
  console.log('Incomplete! (cat: '+cat+', subj: '+subj+')');
  //if ( cat == -1 ) {
  //  $("#CategoryID + label + .dropdownSelect a.dropdown-toggle").focus();
  //}
}

if( url.endsWith('/helpdesk/Tickets/New') || url.endsWith('/helpdesk/Tickets/New/') ) { 
  const newTicketForm = document.querySelector("#new-ticket-form");
  var watchMandatory = new MutationObserver(missedMandatory);
  watchMandatory.observe(newTicketForm,{childList:true,subtree:true});
}
```
