// test - track removal of a tag
// JC, 29/3/2024 *(PERSONAL)*

// track number of tags in current ticket
var tagsCount = 0; 

// watch ticket details 'tags' section for any updates
const tagsObserver = new MutationObserver((mutations, obs) => {

  const removeLinks = $('#tbTags_tagsinput span.tag a.remove');
  if (removeLinks !== null && removeLinks.length > 0) {
    tagsCount = removeLinks.length; //current number of tags
  // identify the removal of a tag
  $('#tbTags_tagsinput span.tag a.remove').click(function() {
    let removedTag = $(this).prev('a').text();
    console.log("tag removed: "+ removedTag);
    tagsCount -= 1;
  });

  // debug test, not needed
  let remainingTags = $('#tbTags_tagsinput span.tag a.remove').length;
  if ( remainingTags !== null && remainingTags !== tagsCount ) {
    console.log('[IF] Tags: '+ tagsCount + ', remaining=' + remainingTags );
  } else {
    console.log('[ELSE] Tags: '+ tagsCount + ', remaining=' + remainingTags );
  }
    
  //obs.disconnect(); (commented, observer needs to remain active as there may be multiple changes)
  return;
  } 
}); // const tagsObserver(end)

tagsObserver.observe(document, {
  childList: true,
  subtree: true
});


