var aws = require("aws-sdk");
var stepfunctions = new aws.StepFunctions();

let SM_ARN = process.env.SM_ARN;

exports.handler = (event, context) => {
  console.log("Received event: " + event);
  //TODO: probably you want to make some validations here

  let params = {
    stateMachineArn: SM_ARN,
    waitSeconds: event.waitSeconds,
    preference: event.preference,
    message: event.message,
  };

  if (event.preference == "email") params["email"] = event.email;
  else params["phone"] = event.phone;

  stepfunctions.startExecution(params);

  let response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      status: "Success",
    }),
  };
  console.log("response: " + JSON.stringify(response));
  return response;
};
