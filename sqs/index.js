const {
  SQSClient,
  AddPermissionCommand,
  ListQueuesCommand,
  CreateQueueCommand,
} = require("@aws-sdk/client-sqs")

const sqs = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
})
const queueName = "my-queue-1"

async function createSQSQueue() {
  const command = new CreateQueueCommand({ QueueName: queueName })
  const response = await sqs.send(command)
  console.log(response)
}
createSQSQueue()

async function listSQSQueues() {
  const command = new ListQueuesCommand({ QueueNamePrefix: "" })
  const response = await sqs.send(command)
  console.log(response.QueueUrls)
}
listSQSQueues()
