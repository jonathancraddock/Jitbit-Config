# Notes

## Colours

* Header background color: 34383E (was F0F0F0)
* Menu-bar background color: 1D70B8 (was 8A4695)
* Active tab text color: FFFFFF (was FFFFFF)
* Header text color: FFFFFF (was 000000)
* Menu-bar tab text color: E4F4FF (was C7D4E2)

-----

## Javascript Tests

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
