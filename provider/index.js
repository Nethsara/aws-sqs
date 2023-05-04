const express = require("express");
const app = express();
const AWS = require("aws-sdk");
app.use(express.json());

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const listQueues = (queueName) => {
  const sqs = new AWS.SQS();
  return new Promise((resolve, reject) => {
    sqs.listQueues({
      QueueNamePrefix: queueName,
    });
  });
};

const createQueue = (queueName) => {};

const sendMessage = async (queueName, message) => {
  const listOfQues = await listQueues(queueName);

  if (listOfQues.QueueUrls.length === 0) {
  }
  const sqs = new AWS.SQS();
  const params = {
    QueueUrl: process.env.SQS_URI + queueName,
    MessageBody: message,
  };

  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

app.post("/", async (req, res) => {
  const result = await sendMessage(
    req.body.queueName,
    JSON.stringify({ mesage: req.body.message })
  );
  res.json({
    message: result,
  });
});

app.listen(process.env.PROVIDER_PORT, () => {
  console.log(`Running on ${process.env.PROVIDER_PORT}`);
});
