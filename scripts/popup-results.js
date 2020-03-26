///////////////////////////////////////////////////////////////////////////////
//                                  Messages                                 //
///////////////////////////////////////////////////////////////////////////////

const REQUEST_RECOGNIZED_TEXT = "request_recognized_text";



///////////////////////////////////////////////////////////////////////////////
//                               Initialization                              //
///////////////////////////////////////////////////////////////////////////////

// Request background.js to send the cached recognized text.
chrome.runtime.sendMessage({
    message: REQUEST_RECOGNIZED_TEXT,
}, function (returnObject) {
        showResults(returnObject.lambdaStatusCode, returnObject.recognizedText)
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

    document.getElementById('results').innerHTML = "OCR RESULTS:\n" + recognizedText;
}






// // Copy text to clipboard.
// var field = document.createElement("textarea");
// field.textContent = text;
// document.body.appendChild(field);
// field.select();
// document.execCommand("copy");
// document.body.removeChild(field);