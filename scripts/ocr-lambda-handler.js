///////////////////////////////////////////////////////////////////////////////
//                                 Constants                                 //
///////////////////////////////////////////////////////////////////////////////
const NOTIFY_OCR_EXECUTED_MESSAGE = "notify_ocr_executed";

const REGION                 = "us-east-2";
const IDENTITY_POOL_ID       = "us-east-2:3757c141-f9a2-47f1-954d-ad083326d738";
const AWS_API_VERSION        = "2015-03-31";

const LAMBDA_FUNCTION_NAME   = "codecap-ocr";
const LAMBDA_INVOCATION_TYPE = "RequestResponse";
const LAMBDA_LOG_TYPE        = "None";


// Calls the OCR Lambda function with the image passed by parameter.
function executeLambdaFunction(base64Image) {
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
      onOcrExecuted(JSON.parse(data.Payload));
    }
  });
}

// Executes after a successful Lambda function call.
function onOcrExecuted(payloadJSON) {
  var statusCode = payloadJSON.statusCode;
  var text = payloadJSON.text;
  var field = document.createElement("textarea");

  // Log Lambda function result.
  console.log("Status code: " + statusCode);
  console.log("Recognized text: " + text);

  // Notify background.js that the Lambda function has returned.
  chrome.runtime.sendMessage({
    message: NOTIFY_OCR_EXECUTED_MESSAGE,
    text: text,
    statusCode: statusCode
  }, function (message) {
      console.log("background recieved message: \"" + message + "\"");
  });

  // // Copy text to clipboard.
  // field.textContent = text;
  // document.body.appendChild(field);
  // field.select();
  // document.execCommand("copy");
  // document.body.removeChild(field);
}