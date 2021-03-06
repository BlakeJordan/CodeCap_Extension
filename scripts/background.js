///////////////////////////////////////////////////////////////////////////////
//                                 Constants                                 //
///////////////////////////////////////////////////////////////////////////////

const NOTIFY_OCR_EXECUTED_MESSAGE  = "notify_ocr_executed";
const SECONDARY_POPUP_FILE_PATH    = "../html/popup-results.html";
const START_SCREEN_SHOTTER_MESSAGE = "start_screen_shotter";
const REQUEST_LAMBDA_RESULTS       = "request_lambda_results"
const START_FILE_UPLOADER_MESSAGE  = "start_file_uploader";	


///////////////////////////////////////////////////////////////////////////////
//                                 Variables                                 //
///////////////////////////////////////////////////////////////////////////////

var lambdaFunctionStatusCodeCache = 0
var recognizedTextCache = ""
var selectionArea;


///////////////////////////////////////////////////////////////////////////////
//                                 Functions                                 //
///////////////////////////////////////////////////////////////////////////////

function getTab(callback){
  var tab;
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    callback(tabs);
  });
};

function uploadInject(tabs){
  var tab = tabs[0];
  chrome.tabs.executeScript(tab.id, {file: 'scripts/file-uploader.js', runAt: 'document_start'})



};

function injectTab(tabs){
  var tab = tabs[0];
  chrome.tabs.sendMessage(tab.id, {message: 'init'}, (res) => {
    if (res) {
      clearTimeout(timeout)
    }
  });

  

var timeout = setTimeout(() => {
    console.log("injection\n")
    chrome.tabs.insertCSS(tab.id, {file: 'css/jquery.Jcrop.min.css', runAt: 'document_start'})
    chrome.tabs.insertCSS(tab.id, {file: 'css/cropCSS.css', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'scripts/jquery/jquery-3.4.1.min.js', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'scripts/jquery/jquery.Jcrop.min.js', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'scripts/screen-shotter.js', runAt: 'document_start'})

    setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {message: 'init'})
      }, 100)
    }, 100)
};

/* Messages that trigger actions that must be done by background.js because most chrome APIs can't be used by content scripts.
   Use:
   chrome.runtime.sendMessage({ message: "MESSAGE_HERE" });
   to send messages from content scripts. */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("background recieved message: \"" + request.message + "\"");

    // Switch on message.
    switch(request.message) {

      // popup-results.js is requesting Lambda function results.
      case REQUEST_LAMBDA_RESULTS:
        sendResponse({ lambdaStatusCode: lambdaFunctionStatusCodeCache, recognizedText: recognizedTextCache, area: selectionArea });
        break;

      // Lambda function returned.
      case NOTIFY_OCR_EXECUTED_MESSAGE:
        onOcrExecuted(parseInt(request.statusCode), request.recognizedText);
        break;

      case "capture":
        chrome.tabs.getSelected(null,(tab) =>{

          chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, (image) => {
            // image is base64
            crop(image, request.area, request.dpr, true, 'png', (cropped) => {
              selectionArea = request.area;
              // sendResponse( cropped)
              chrome.tabs.sendMessage(tab.id,
                {
                  message: 'CROPPED_IMAGE',
                  croppedImage: cropped,
                })
            })
  
          })
         })
        break;
      
      case "popup_init":
        getTab(injectTab);

        return true;


      case "INJECT":
        // getTab(uploadInject);
        
        chrome.tabs.query({active: true}, function(tabs){ 
        chrome.tabs.executeScript(tabs[0].id, {file: 'scripts/file-uploader.js', runAt: 'document_start'})

        }); 
        break;
         
      case "FILE_UPLOAD_RESULT":


        chrome.tabs.query({active: true}, function(tabs){ 
          chrome.tabs.sendMessage(tabs[0].id, 
                                      {
                                        message: "UPLOAD_DONE", base64: request.imgString
                                      }
                                      )});
         break;
         /*
        getTab(uploadInject);
        chrome.tabs.sendMessage(tab.id,
          {
            message: 'UPLOAD_DONE',
            base64: request.imgString,
          })
        return true;
*/




//end new      
      case "active":
        return true;

      case "copy":
        createNotification("Copied to clipboard!");
        break; 
    }

    // Notify sender that message was recieved.
//   sendResponse({'active': active})
 return true; 
});



        
function crop (image, area, dpr, preserve, format, done) {
  if (image == undefined){
    return
  }
  var top = area.y * dpr
  var left = area.x * dpr
  var width = area.w * dpr
  var height = area.h * dpr
  var w = (dpr !== 1 && preserve) ? width : area.w
  var h = (dpr !== 1 && preserve) ? height : area.h
  var canvas = null
  if (!canvas) {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
  }
  canvas.width = w
  canvas.height = h

  var img = new Image()
  img.onload = () => {
  var context = canvas.getContext('2d')
  context.drawImage(img,
      left, top,
      width, height,
      0, 0,
      w, h
  )
  var cropped = canvas.toDataURL(`image/${format}`)
  done(cropped)
  }
  img.src = image


  //console.log(img.src);
}

// Executes when the OCR Lambda funciton returns.
function onOcrExecuted(statusCode, recognizedText) {
  lambdaFunctionStatusCodeCache = statusCode
  recognizedTextCache = recognizedText

  // Switch on server-side status codes.
  switch(statusCode) {
    // Executed with no errors.
    case 200:
      chrome.browserAction.setPopup({ popup: SECONDARY_POPUP_FILE_PATH });    // Set to secondary popup.
      createNotification("Your text is ready!\nClick on the extenion to view the results. ");                      // Notify user that text is ready.
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
