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
// Set listener for upload button.	
var uploadButton = document.getElementById("upload_button");	
uploadButton.onclick = function (element) {	
    onUploadButtonClick();	
};	
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
    sendMessageToContentScripts(START_FILE_UPLOADER_MESSAGE);	
    // Close popup.	
    window.close();	
}	
// Sends the message passed by parameter to the other content scripts.	
function sendMessageToContentScripts(message) {	
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {	
        var activeTab = tabs[0];	
        chrome.runtime.sendMessage({message: "popup_init",tabID: activeTab.id });	
    });	
}