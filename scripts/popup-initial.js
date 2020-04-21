	///////////////////////////////////////////////////////////////////////////////	
//                                  Messages                                 //	
///////////////////////////////////////////////////////////////////////////////	

const START_FILE_UPLOADER_MESSAGE  = "start_file_uploader";	
const START_SCREEN_SHOTTER_MESSAGE = "popup_init";	


///////////////////////////////////////////////////////////////////////////////	
//                               Initialization                              //	
///////////////////////////////////////////////////////////////////////////////	

// Set listener for screenshot button.	
var screenshotButton = document.getElementById("screenshot_button");
screenshotButton.onclick = function (element) {	
    onScreenShotButtonClick();	
};	

// Set listener for upload butto and pop up the file explorer
var input = document.querySelector('input');
var uploadButton = document.getElementById("upload_button");	
    uploadButton.addEventListener('click', function (e) {
    input.click();

    setTimeout(() => {
    const selectedFile = document.querySelector('input').files[0]
    const reader = new FileReader();
    reader.onloadend = function() {
        console.log('RESULT', reader.result);
        //send results to screenshotter-js
        const str = reader.result.split(',')[1];
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {	
            var activeTab = tabs[0];	
            chrome.runtime.sendMessage({message: "FILE_UPLOAD_RESULT", tabID: activeTab.id,imgString: str });	
            window.close();	

        });	

    }
    reader.readAsDataURL(selectedFile);

    }, 1000);
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {	
        var activeTab = tabs[0];	
        chrome.runtime.sendMessage({message: "INJECT", tabID: activeTab.id });	
       // window.close();	

    });	

 }); 


///////////////////////////////////////////////////////////////////////////////	
//                                  Functions                                //	
///////////////////////////////////////////////////////////////////////////////	

function onScreenShotButtonClick() {	
    // Send start message to screen-shotter.js.	
    sendMessageToContentScripts(START_SCREEN_SHOTTER_MESSAGE);	

    // Close popup.	
    window.close();	
}	
function onUploadButtonClick() {	
    // Send start message to file-uploader.js.	
    //var botton = document.getElementById('upload_button');
 //   uploadButton.addEventListener('click', function (e) {
   //     input.click();
     //   window.close();	

   // });    
    // Close popup.	
}


// Sends the message passed by parameter to the other content scripts.	
function sendMessageToContentScripts(message) {	
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {	
        var activeTab = tabs[0];	
        chrome.runtime.sendMessage({message: message, tabID: activeTab.id });	
    });	
}