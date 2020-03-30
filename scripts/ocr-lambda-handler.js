///////////////////////////////////////////////////////////////////////////////
//                                 Constants                                 //
///////////////////////////////////////////////////////////////////////////////
const NOTIFY_OCR_EXECUTED_MESSAGE = "notify_ocr_executed";
const REMOVE_POPUP_MESSAGE        = "remove_popup"

const REGION                 = "us-east-2";
const IDENTITY_POOL_ID       = "us-east-2:3757c141-f9a2-47f1-954d-ad083326d738";
const AWS_API_VERSION        = "2015-03-31";

const LAMBDA_FUNCTION_NAME   = "codecap-ocr";
const LAMBDA_INVOCATION_TYPE = "RequestResponse";
const LAMBDA_LOG_TYPE        = "None";



///////////////////////////////////////////////////////////////////////////////
//                                  Functions                                //
///////////////////////////////////////////////////////////////////////////////

// Entry point function for ocr-lambda-handler.js.
// Executes OCR Lambda function and returns results to background.js.
function getTextFromBase64Image(base64Image) {
  // Send remove popup message to background.js.
  chrome.runtime.sendMessage({
    message: REMOVE_POPUP_MESSAGE
  });

  // Execute OCR Lambda function with callback function.
  executeLambdaFunction(base64Image,
    (payload) => {
      // Parse payload.
      var statusCode = payload.statusCode;
      var text = payload.text;

      // Log OCR results.
      console.log("Status code: " + statusCode);
      console.log("Recognized text: " + text);

      // Send OCR results to background.js.
      chrome.runtime.sendMessage({
        message: NOTIFY_OCR_EXECUTED_MESSAGE,
        text: text,
        statusCode: statusCode
      });
    })
}


// Calls the OCR Lambda function with the image passed by parameter.
// Executes callbackFunction (parameter) on Lambda function return.
function executeLambdaFunction(base64Image, callbackFunction) {

  // Configure AWS SDK.
  console.log("Configuring AWS SDK.")
  AWS.config.region = REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
  });

  // Prepare the call to the Lambda function.
  console.log("Preparing Lambda function parameters.")
  lambda = new AWS.Lambda({ region: REGION, apiVersion: AWS_API_VERSION });
  var lambdaParameters = {
    FunctionName: LAMBDA_FUNCTION_NAME,
    InvocationType: LAMBDA_INVOCATION_TYPE,
    LogType: LAMBDA_LOG_TYPE,
    Payload: JSON.stringify(base64Image)
  };

  // Call the Lambda function.
  console.log("Calling Lambda function.")
  var data;
  lambda.invoke(lambdaParameters, function (err, data) {
    if (err) {
      console.log("Lambda function execution failed.");
      prompt(err);
    } else {
      console.log("Lambda function returned.")
      callbackFunction(JSON.parse(data.Payload));
    }
  });
}