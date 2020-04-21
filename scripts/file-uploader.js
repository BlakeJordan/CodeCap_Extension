///////////////////////////////////////////////////////////////////////////////
//                                  Messages                                 //
///////////////////////////////////////////////////////////////////////////////


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "UPLOAD_DONE") {
     
            getTextFromBase64Image(request.base64);
          }
        });
