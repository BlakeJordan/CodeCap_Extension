
// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        var penis = ("8===>~~");
  
        console.log(penis);
      }
    }
  );