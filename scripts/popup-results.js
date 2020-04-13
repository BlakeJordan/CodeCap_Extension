///////////////////////////////////////////////////////////////////////////////
//                                  Messages                                 //
///////////////////////////////////////////////////////////////////////////////

const REQUEST_LAMBDA_RESULTS = "request_lambda_results"
const RESET_POPUP_MESSAGE = "reset_popup"


///////////////////////////////////////////////////////////////////////////////
//                               Initialization                              //
///////////////////////////////////////////////////////////////////////////////

// Set to initial popup (button)
var resetPopup = document.getElementById("reset_popup");
resetPopup.onclick = function(element) {
    window.close();
    chrome.browserAction.setPopup({ popup: "../html/popup-initial.html"});
    sendMessageToContentScripts(RESET_POPUP_MESSAGE);
};

// Copy results to clipboard (button)
var copy_resuts = document.getElementById("copy_results");
copy_results.onclick = function(element) {
    var text = document.getElementById("results").textContent;
    navigator.clipboard.writeText(text)
    .then(() => {
        console.log('Text copied to clipboard');
    })
    .catch(err => {
        console.error('Could not copy text: ', err);
    });
    sendMessageToContentScripts("copy");
};

// TODO: Save edited ocr results when clicking away
var update_text = document.getElementById("results");
update_text.onblur = function(element) {
    var text = update_text.textContent;
    alert(text);
    update_text.innerHTML = text;
}

// Request background.js to send the cached recognized text.
chrome.runtime.sendMessage({
    message: REQUEST_LAMBDA_RESULTS,
}, function (returnObject) {
    showResults(returnObject.lambdaStatusCode, returnObject.recognizedText,returnObject.area);
});




///////////////////////////////////////////////////////////////////////////////
//                                  Functions                                //
///////////////////////////////////////////////////////////////////////////////

// Called after background.js responds with the OCR results.
// Should handle displaying the results from a successful Lambda call or
// notifying the user of a Lambda call error.
function showResults(lambdaStatusCode, recognizedText) {

    // TODO: switch on status code results.
    // 200 -> good, 400 or 500 -> bad

    // If bad, notify user.
    // If good, show results.

    document.getElementById('results').innerHTML = recognizedText;
}

function sendMessageToContentScripts(message) {
    chrome.runtime.sendMessage( {
        message: message
    });
}
