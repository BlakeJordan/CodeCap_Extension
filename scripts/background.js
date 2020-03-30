///////////////////////////////////////////////////////////////////////////////
//                                 Constants                                 //
///////////////////////////////////////////////////////////////////////////////
const NOTIFY_OCR_EXECUTED_MESSAGE = "notify_ocr_executed";
const SECONDARY_POPUP_FILE_PATH   = "../html/secondary-popup.html";
const START_SCREEN_SHOTTER_MESSAGE = "start_screen_shotter";

function getTab(callback){
  var tab
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    callback(tabs);
  });
};


function CaptureWork(){

       chrome.tabs.getSelected(null,(tab) =>{

        chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, (image) => {
          // image is base64
          crop(image, request.area, request.dpr, true, 'png', (cropped) => {
            sendResponse({message: 'image', image: cropped})
          })

        })


       })

}


function injectTab(tabs){
  var tab = tabs[0];
  chrome.tabs.sendMessage(tab.id, {message: 'init'}, (res) => {
    if (res) {
      clearTimeout(timeout)
    }
  })

var timeout = setTimeout(() => {
    chrome.tabs.insertCSS(tab.id, {file: 'css/jquery.Jcrop.min.css', runAt: 'document_start'})
    chrome.tabs.insertCSS(tab.id, {file: 'css/cropCSS.css', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'scripts/jquery/jquery-3.4.1.min.js', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'scripts/jquery/jquery.Jcrop.min.js', runAt: 'document_start'})
    chrome.tabs.executeScript(tab.id, {file: 'scripts/screen-shotter.js', runAt: 'document_start'})

    setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {message: 'init'})
      }, 1000)
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

      // Lambda function returned.
      case NOTIFY_OCR_EXECUTED_MESSAGE:
        onOcrExecuted(parseInt(request.statusCode), request.text);
        break;

      case "capture":
        chrome.tabs.getSelected(null,(tab) =>{

          chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, (image) => {
            // image is base64
            crop(image, request.area, true, true, 'png', (cropped) => {
              // sendResponse( cropped)
              chrome.tabs.sendMessage(tab.id,
                {
                  message: 'CROPPED_IMAGE',
                  croppedImage: cropped
                })
            })
  
          })
  
  
         })
      //capture();
        break;
      
      case "popup_init":
       getTab(injectTab);
       break;

//end new      
    case "active":
      return true;

    }

    // Notify sender that message was recieved.
//   sendResponse({'active': active})
  }
);




function inject(tab) {

  chrome.tabs.sendMessage(tab.id, {message: 'init'}, (res) => {
      if (res) {
        clearTimeout(timeout)
      }
    })

  var timeout = setTimeout(() => {
      chrome.tabs.insertCSS(tab.id, {file: 'css/jquery.Jcrop.min.css', runAt: 'document_start'})
      chrome.tabs.insertCSS(tab.id, {file: 'css/cropCSS.css', runAt: 'document_start'})
      chrome.tabs.executeScript(tab.id, {file: 'scripts/jquery/jquery-3.4.1.min.js', runAt: 'document_start'})
      chrome.tabs.executeScript(tab.id, {file: 'scripts/jquery/jquery.Jcrop.min.js', runAt: 'document_start'})
      chrome.tabs.executeScript(tab.id, {file: 'scripts/screen-shotter.js', runAt: 'document_start'})

      setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, {message: 'init'})
        }, 100)
      }, 100)

}


        
        function crop (image, area, dpr, preserve, format, done) {
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
          console.log(img.src);
        }




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


function fullCapture(){
  var screenshot = {
    content : document.createElement("canvas"),
    data : '',
  
    init : function() {
      this.initEvents();
    },
    
    saveScreenshot : function() {
      var image = new Image();
      image.onload = function() {
        var canvas = screenshot.content;
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
  
        // save the image
        var link = document.createElement('a');
        link.download = "download.png";
        link.href = screenshot.content.toDataURL();
        link.click();
        screenshot.data = '';
      };
      image.src = screenshot.data; 
    },
    
    initEvents : function() {
        chrome.tabs.captureVisibleTab(null, {
          format : "png",
          quality : 100
        }, function(data) {
          screenshot.data = data;
          
          // send an alert message to webpage
          chrome.tabs.query({
            active : true,
            currentWindow : true
          }, function(tabs) {

                screenshot.saveScreenshot();
              


          }); 
  
        });
    }
  };
  
  screenshot.init();
}