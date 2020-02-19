// File path constants
const INITIAL_POPUP_FILE_PATH   = "../html/initial-state-popup.html"
const SECONDARY_POPUP_FILE_PATH = "../html/secondary-state-popup.html"


/* Messages that trigger actions that must be done by background.js because most chrome APIs can't be used by content scripts.
   Use:
   chrome.runtime.sendMessage({ message: "MESSAGE_HERE" });
   to send messages from content scripts. */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("Request message: " + request.message);

    // Switch on message.
    switch(request.message) {
      // Remove popup:
      case "REMOVE_POPUP":
        chrome.browserAction.setPopup({ popup: "" });
        break;

      // Add initial state popup:
      case "ADD_INITIAL_POPUP":
        chrome.browserAction.setPopup({ popup: INITIAL_POPUP_FILE_PATH });
        break;

      // Add secondary state popup:
      case "ADD_SECONDARY_POPUP":
        chrome.browserAction.setPopup({ popup: SECONDARY_POPUP_FILE_PATH });          // TODO: implement secondary popup
        break;

      // Show Chrome notification:
      case "SHOW_TEXT_READY_NOTIFICATION":
        console.log('TODO: implement text is ready Chrome notification.')
    }
  }
);