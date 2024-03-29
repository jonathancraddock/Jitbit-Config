// test - track removal of a tag
// track number of tags in current ticket
var tagsCount = 0;
var lastTag = '';

// watch ticket details 'tags' section for any updates
const tagsObserver = new MutationObserver((mutations, obs) => {
  const removeLinks = $('#tbTags_tagsinput span.tag a.remove');
  if (removeLinks !== null && removeLinks.length > 0) {
    tagsCount = removeLinks.length; //current number of tags
    console.log('current tags = ' + tagsCount);
  // identify the removal of a tag
  $('#tbTags_tagsinput span.tag a.remove').click(function() {

  // get the current user's ID, log to console
  let removedTag = $(this).prev('a').text();
  let remainingTags = $('#tbTags_tagsinput span.tag a.remove').length;

  if ( remainingTags !== null && remainingTags !== tagsCount && removedTag !== lastTag ) {

  initializeCurrentUser().then(currentUser => {
    console.log("tag removed: "+ removedTag + ', by ' + currentUser.userId + ', remaining ' + remainingTags + ', count '+ tagsCount +'.');
    tagsCount -= 1;
    lastTag = removedTag;
  });

  } // if(end)

  });
  return;
  } 
}); // const tagsObserver(end)

// initialise the observer
tagsObserver.observe(document, {
  childList: true,
  subtree: true
});
