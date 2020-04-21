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
    console.log(input.files[0]);
    setTimeout(() => {
    window.close();	
        
    }, 1000);

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