///////////////////////////////////////////////////////////////////////////////
//                                 Constants                                 //
///////////////////////////////////////////////////////////////////////////////

const REMOVE_POPUP_MESSAGE = "remove_popup"
const NOTIFY_OCR_EXECUTED_MESSAGE = "notify_ocr_executed";
const REQUEST_RECOGNIZED_TEXT = "request_recognized_text";

const POPUP_RESULTS_FILE_PATH   = "../html/popup-results.html";



///////////////////////////////////////////////////////////////////////////////
//                                 Variables                                 //
///////////////////////////////////////////////////////////////////////////////

var lambdaStatusCodeCache = 0 // Latest OCR Lambda call's recognized text.
var recognizedTextCache = ""  // Latest OCR Lambda call's status code.



///////////////////////////////////////////////////////////////////////////////
//                               Initialization                              //
///////////////////////////////////////////////////////////////////////////////

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

      // popup-results.js is requesting the recognized text.
      case REQUEST_RECOGNIZED_TEXT:
        sendResponse({
          lambdaStatusCode: lambdaStatusCodeCache,
          recognizedText: recognizedTextCache
        });
        break;
    }
  }
);



///////////////////////////////////////////////////////////////////////////////
//                                  Functions                                //
///////////////////////////////////////////////////////////////////////////////

// Executes when the OCR Lambda funciton returns.
function onOcrExecuted(statusCode, recognizedText) {
  // Switch on server-side status codes.

  switch(statusCode) {
    // Executed with no errors.
    case 200:
      lambdaStatusCodeCache = statusCode
      recognizedTextCache = recognizedText
      chrome.browserAction.setPopup({ popup: POPUP_RESULTS_FILE_PATH });      // Set popup to results popup HTML.
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