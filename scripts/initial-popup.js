///////////////////////////////////////////////////////////////////////////////
//                                  Messages                                 //
///////////////////////////////////////////////////////////////////////////////
const START_FILE_UPLOADER_MESSAGE = "start_file_uploader";
const START_SCREEN_SHOTTER_MESSAGE = "start_screen_shotter";

// Set listener for upload button.
var uploadButton = document.getElementById("upload_button");
if (uploadButton){
    uploadButton.onclick = function (element) {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "message": START_FILE_UPLOADER_MESSAGE });
        });
    };
}
// Set listener for screenshot button.





var screenshotButton = document.getElementById("screenshot_button");
    screenshotButton.onclick = function (element) {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.runtime.sendMessage({message:"popup_init", tabID: activeTab.id})

        });
    }


