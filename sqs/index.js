const { SQS } = require("@aws-sdk/client-sqs")

const sqs = new SQS({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
})
const QueueName = "my-queue-1"
const QueueUrl = "http://localhost:4566/000000000000/my-queue-1"

async function createQueue() {
  sqs
    .createQueue({ QueueName })
    .then((result) => result.QueueUrl)
    .catch((err) => console.log(err.message))
}
// createQueue()

async function listQueues() {
  sqs
    .listQueues({ QueueNamePrefix: "" })
    .then((result) => result.QueueUrls)
    .catch((err) => console.log(err.message))
}
// listQueues()

async function deleteQueue() {
  sqs
    .deleteQueue({ QueueUrl })
    .then(() => console.log(`Queue delete successfuly`))
    .catch((err) => console.log(err.message))
}
// deleteQueue()

async function purgeQueue() {
  sqs
    .purgeQueue({ QueueUrl })
    .then(() => console.log(`Queue purge successfuly`))
    .catch((err) => console.log(err.message))
}
// purgeQueue()

async function sendMessage() {
  sqs
    .sendMessage({ QueueUrl, MessageBody: "my message body 1" })
    .then((result) => console.log(result.MessageId))
    .catch((err) => console.log(err.message))
}
// sendMessage()

async function receiveMessage() {
  sqs
    .receiveMessage({ QueueUrl, MaxNumberOfMessages: 10, VisibilityTimeout: 0 })
    .then((result) => {
      console.log(result.Messages)
      for (const message of result.Messages ?? []) {
        // Do something with message then delete message
        deleteMessage(message.ReceiptHandle)
      }
    })
    .catch((err) => console.log(err.message))
}
// receiveMessage()

async function deleteMessage(ReceiptHandle) {
  sqs
    .deleteMessage({ QueueUrl, ReceiptHandle })
    .then(() => console.log(`Message delete successfuly.`))
    .catch((err) => console.log(err.message))
}
