///////////////////////////////////////////////////////////////////////////////
//                                 Constants                                 //
///////////////////////////////////////////////////////////////////////////////
const NOTIFY_OCR_EXECUTED_MESSAGE = "notify_ocr_executed";
const REMOVE_POPUP_MESSAGE        = "remove_popup"

const SECONDARY_POPUP_FILE_PATH   = "../html/secondary-popup.html";



/* Messages that trigger actions that must be done by background.js because most chrome APIs can't be used by content scripts.
   Use:
   chrome.runtime.sendMessage({ message: "MESSAGE_HERE" });
   to send messages from content scripts. */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("background recieved message: \"" + request.message + "\"");

    // Switch on message.
    switch(request.message) {

      // Remove popup.
      case REMOVE_POPUP_MESSAGE:
        chrome.browserAction.setPopup({ popup: "" });    // Set to popup to null.
        break;

      // Lambda function returned.
      case NOTIFY_OCR_EXECUTED_MESSAGE:
        onOcrExecuted(parseInt(request.statusCode), request.text);
        break;
    }

    // Notify sender that message was recieved.
    sendResponse(request.message)
  }
);

// Executes when the OCR Lambda funciton returns.
function onOcrExecuted(statusCode, recognizedText) {
  // Switch on server-side status codes.

  switch(statusCode) {
    // Executed with no errors.
    case 200:
      chrome.browserAction.setPopup({ popup: SECONDARY_POPUP_FILE_PATH });    // Set to secondary popup.
      createNotification("Your text is ready to view!");                      // Notify user that text is ready.
      break;

    // Base64 encoding error occured.
    case 400:
      break;

    // Tesseract error occured.
    case 500:
      break;
  }
}

// Creates a Chrome notification with the specified message.
function createNotification(message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "media/codecap_logo.png",
    title: "CodeCap",
    message: message
  });
}