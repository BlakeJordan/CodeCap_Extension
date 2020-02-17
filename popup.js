
// Set listener for screenshot button.
var screenshotButton = document.getElementById("screenshot_button");
screenshotButton.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'console.log("Screen shot button pressed!");' });
    });
};

// Set listener for upload button.
var uploadButton = document.getElementById("upload_button");
uploadButton.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'console.log("Upload button pressed!");' });
    });
};

