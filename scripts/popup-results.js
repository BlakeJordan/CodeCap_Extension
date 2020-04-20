///////////////////////////////////////////////////////////////////////////////
//                                Constants                                  //
///////////////////////////////////////////////////////////////////////////////

const REQUEST_LAMBDA_RESULTS = "request_lambda_results"
const RESET_POPUP_MESSAGE    = "reset_popup"

const UNICODE_TAB = "\u2003"


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
    // Get text from results div.
    var text = document.getElementById("results").innerHTML;

    // Replace HTML line breaks with newlines.
    text = text.split("<br>").join("\n");
    text = text.split("< br >").join("\n");

    // Replace HTML tabs with tabs.
    text = text.split(UNICODE_TAB).join("\t");

    navigator.clipboard.writeText(text)
    .then(() => {
        console.log("Text copied to clipboard");
    })
    .catch(err => {
        console.error("Could not copy text: ", err);
    });

    sendMessageToContentScripts("copy");
};

// TODO: Save edited ocr results when clicking away
// var update_text = document.getElementById("results");
// update_text.onblur = function(element) {
//     var text = update_text.innerHTML;
//     alert(text);
//     update_text.innerHTML = text;
// };

// Request background.js to send the cached recognized text.
chrome.runtime.sendMessage({
    message: REQUEST_LAMBDA_RESULTS,
}, function (returnObject) {
    showResults(returnObject.lambdaStatusCode, returnObject.recognizedText,returnObject.area);
});

// Allow text results box to input tabs.
document.getElementById("results").onkeydown = function (e) {
    if (e.keyCode == 9 || e.which == 9) {
        e.preventDefault();
        
        var doc = e.target.ownerDocument.defaultView;
        var sel = doc.getSelection();
        var range = sel.getRangeAt(0);

        var tabNode = document.createTextNode(UNICODE_TAB);
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}


///////////////////////////////////////////////////////////////////////////////
//                                  Functions                                //
///////////////////////////////////////////////////////////////////////////////

// Called after background.js responds with the OCR results.
// Should handle displaying the results from a successful Lambda call or
// notifying the user of a Lambda call error.
function showResults(lambdaStatusCode, recognizedText) {

    // Case: OCR call successful.
    if (lambdaStatusCode == 200) {
        recognizedText = recognizedText.split("\\n").join("<br/>");         // Replace all hard-coded newlines with HTML line breaks.
        recognizedText = recognizedText.split("\\t").join(UNICODE_TAB);     // Replace all hard-coded tabs with HTML tabs.
        document.getElementById("results").innerHTML = recognizedText;
    }

    // Case: OCR call threw error.
    else {
        document.getElementById("results").innerHTML = "Text could not be recognized. Please try again.";
    }
}

function sendMessageToContentScripts(message) {
    chrome.runtime.sendMessage( {
        message: message
    });
}
