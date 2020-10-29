var aws = require("aws-sdk");
var ses = new aws.SES();

exports.handler = (event, context, callback) => {
  var params = {
    Destination: {
      ToAddresses: [event["Input"]["email"]],
    },
    Message: {
      Body: {
        Text: { Data: event["Input"]["message"] },
      },
      Subject: { Data: "Recordatorio de iamforgetful.luismena.info" },
    },
    Source: process.env.SOURCE_EMAIL_ADDRESS,
  };

  ses.sendEmail(params, function (err, data) {
    callback(null, { err: err, data: data });
    if (err) {
      console.log(err);
      context.fail(err);
    } else {
      console.log(data);
      context.succeed(event);
    }
  });
};
