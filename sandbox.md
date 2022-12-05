## Misc Bug Fix

Checkbox state is lost when user submits ticket.

```javascript
// Toggle to 'source' before submit
// TEMP BUG FIX - JitBit does not save checkbox state on a new ticket submit
$('#btnAdd').on('click', function() {
  if ($('label.error:visible').length==0) {
    $('#Body').wswgEditor('switchEditor');
    $('#Body').wswgEditor('switchEditor');
  }
});
```
^- *Works, but behaviour can sometimes be temperamental if/when user omits mandatory fields and re-submits while warnings are displayed. The ticket does submit, but the checkbox state is not 100% reliable.*

-----

## Misc Experiments

Check if a file exists.

```javascript
// TEST - check if file exists, using a css file as an example
$.ajax({
 url:'/js/main.min.css',
    type:'HEAD',
    error: function()
    {
        //file not exists
        console.log('file not found (or another error!');
    },
    success: function()
    {
        //file exists
        console.log('file found');
    }
});
```
