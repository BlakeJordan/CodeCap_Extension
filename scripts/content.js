// content.js

var ocrResults;

// Called by background.js, executes on camera icon click.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message === "clicked_browser_action") {
        console.log("Request message: clicked_browser_action");

        // Todo: Screen shot prompt.

        // Todo: Convert screen shot to Base64 encoded string.
        var base64String = "helloWorld Lambda function executed: ";

        // Execute OCR.
        executeOCR(base64String);
      }
    }
  );


// Calls the OCR Lambda function.
function executeOCR(base64String) {
  // Configure AWS SDK.
  console.log("Configuring AWS SDK.")
  AWS.config.region = 'us-east-2';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-2:3757c141-f9a2-47f1-954d-ad083326d738',
  });

  // Prepare the call to the Lambda function.
  console.log("Preparing Lambda function parameters.")
  lambda = new AWS.Lambda({ region: 'us-east-2', apiVersion: '2015-03-31' });
  var lambdaParameters = {
    FunctionName: 'helloWorld',
    InvocationType: 'RequestResponse',
    LogType: 'None',
    Payload: JSON.stringify(base64String)
  };

  // Call the Lambda function.
  console.log("Calling Lambda function.")
  var data;
  lambda.invoke(lambdaParameters, function (err, data) {
    if (err) {
      console.log("Lambda function execution failed.");
      prompt(err);
    } else {
      console.log("Lambda function execution succeeded.")
      onOcrExecuted(JSON.parse(data.Payload));
    }
  });
}

// Executes after a successful Lambda function call.
function onOcrExecuted(payloadJSON) {
  var statusCode = payloadJSON.statusCode;
  var text = payloadJSON.text;

  console.log("Status code: " + statusCode);
  console.log("Text: " + text);
}