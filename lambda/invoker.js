const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda")

const lambdaClient = new LambdaClient({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
})

// Define the Lambda function name and payload
const functionName = "my-lambda-function"
const payload = JSON.stringify({ num1: 10, num2: 20 })

// Convert payload to Uint8Array format
const encoder = new TextEncoder()
const decoder = new TextDecoder()
const payloadBytes = encoder.encode(payload)

// Invoke the Lambda function
const invokeLambdaFunction = async () => {
  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: payloadBytes,
  })

  try {
    const response = await lambdaClient.send(command)
    if (response.Payload) {
      const result = JSON.parse(decoder.decode(response.Payload))
      console.log(result)
    } else {
      console.log("Response payload is empty")
    }
  } catch (error) {
    console.error("Error invoking Lambda function:", error)
  }
}

invokeLambdaFunction()
