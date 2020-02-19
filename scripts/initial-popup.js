// Set listener for upload button.
var uploadButton = document.getElementById("upload_button");
uploadButton.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { file: 'scripts/file-uploader.js' }
        );
    });
};

// Set listener for screenshot button.
var screenshotButton = document.getElementById("screenshot_button");
screenshotButton.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            { file: 'scripts/screen-shotter.js' }
        );
    });
};
