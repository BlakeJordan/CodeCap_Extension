chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { urlContains: ':' },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

// Called when the user clicks on the CodeCap icon.
// chrome.browserAction.onClicked.addListener(function(tab) {
//     // Send "clicked_browser_action" message to content.js.
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });
//     });
//   });


// Called by content.js function onOcrExecuted.
// Opens the popup upon execution of OCR Lambda function.
// Note: this must be done by background.js because chrome.browserAction cannot be executed by "content scripts".
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "open_popup") {
      console.log("Request message: open_popup");

      chrome.browserAction.setPopup({
        popup: "popup.html"
      });
      chrome.browserAction.setPopup({
        popup: ""
      });
    }
  }
);