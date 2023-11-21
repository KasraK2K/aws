# Lambda

AWS Lambda is a Serverless Function as a Service (FaaS) platform that lets you run code in your preferred programming language on the AWS ecosystem. AWS Lambda automatically scales your code to meet demand and handles server provisioning, management, and maintenance. AWS Lambda allows you to break down your application into smaller, independent functions that integrate seamlessly with AWS services.
With Lambda, you can focus on writing your application logic, and AWS takes care of the underlying infrastructure, scaling, and availability.

Lambda functions are small pieces of code that can be written in various programming languages, such as JavaScript, Python, Java, and more. They are event-driven, meaning they are triggered by specific events or actions, such as an HTTP request, changes to a database, or the uploading of a file to AWS S3.

Lambda functions are highly versatile and can be used in various scenarios, including:

  1. **Serverless Web Applications**: You can use Lambda functions to build the backend for web applications, handling HTTP requests and executing business logic.

  2. **Real-time File Processing**: Lambda can process files as soon as they are uploaded to services like S3, enabling real-time data processing and analysis.

  3. **Data Transformation**: Lambda functions can transform data between different formats or enrich data with additional information.

  4. **IoT Backend**: Lambda functions can handle IoT events, processing sensor data, and triggering actions based on predefined rules.

  5. **Scheduled Tasks**: Lambda functions can be scheduled to run at specific intervals or times, performing tasks such as data backups, generating reports, or sending notifications.

  6. **Chatbot and Voice Assistants**: Lambda functions can be integrated with messaging platforms or voice assistant services to build chatbot or voice-enabled applications.

  7. **Data Stream Processing**: Lambda functions can be part of a streaming pipeline, processing real-time data from sources like AWS Kinesis or Apache Kafka.

The serverless nature of Lambda offers several benefits, including automatic scaling, cost optimization (you only pay for the actual usage), reduced operational overhead, and improved development agility.

It's important to note that Lambda is not limited to AWS services; it can also integrate with third-party services, allowing you to build serverless applications that interact with a wide range of systems and APIs.

## Create a Lambda function

```javascript
// function.js

exports.handler = async (event) => {
 let body
 // When we invoke by using HTTP event has a body and if we invoke without HTTP by using AWS Lambda Client event is an object
 if (event && event.body) body = JSON.parse(event.body)
 else body = event
 const { num1, num2 } = body
 const product = num1 * num2
 return {
 statusCode: 200,
 body: `The product of ${num1} and ${num2} is ${product}`,
 }
}
```

Now if you want to create your lambda function by using the terminal use the following code:

```bash
FILE_NAME="function.js" # Our function file name
ZIP_FILE_NAME="function.zip" # Name for zipped function
FUNCTION_NAME="my-lambda-function" # Lambda function name

echo "Checking $ZIP_FILE_NAME existence..."

# Remove the last zipped file to create a new one
if [ -f "$ZIP_FILE_NAME" ]; then
 echo "Delete $ZIP_FILE_NAME."
 rm "$ZIP_FILE_NAME"
fi

echo "Create $ZIP_FILE_NAME file."

# Create a zip version of our function
zip ${ZIP_FILE_NAME} ${FILE_NAME}

# Create Lambda function
awslocal lambda create-function \
 --function-name ${FUNCTION_NAME} \ # Function name in lambda
 --runtime nodejs18.x \ # Runtime language and version
 --zip-file fileb://${ZIP_FILE_NAME} \ # Path of our zipped function
 --handler function.handler \ # handler name in our function file (we used `exports.handler` so it is handler now)
 --role arn:aws:iam::000000000000:role/lambda-role # We should change it when we are in real project
```

We also can do this by writing code:

```javascript
const fs = require("fs")
const archiver = require("archiver")
const {
 LambdaClient,
 CreateFunctionCommand,
} = require("@aws-sdk/client-lambda")

const zipFilePath = "function.zip"
const functionName = "my-lambda-function"
const roleArn = "arn:aws:iam::000000000000:role/lambda-role"

const FILE_NAME = "function.js"
const ZIP_FILE_NAME = "function.zip"

async function createLambdaFunction() {
 // Create a zip file containing the function code
 fs.existsSync(zipFilePath) && fs.unlinkSync(zipFilePath)
 const output = fs.createWriteStream(ZIP_FILE_NAME)
 const archive = archiver("zip", { zlib: { level: 9 } })

 output.on("close", () => {
 console.log(`${ZIP_FILE_NAME} created successfully.`)
 })

 output.on("error", (err) => {
 console.error(`Error writing ${ZIP_FILE_NAME}:`, err)
 })

 archive.on("warning", (err) => {
 if (err.code === "ENOENT") console.warn("Archive warning:", err)
 else throw err
 })

 archive.on("error", (err) => {
 console.error("Archive error:", err)
 throw err
 })

 output.on("finish", async () => {
 console.log("File write stream finished.")
 await register()
 })

 archive.pipe(output)
 archive.file(FILE_NAME, { name: FILE_NAME })
 archive.finalize()
}

async function register() {
 // Read the zip file contents
 const zipFileContent = fs.readFileSync(zipFilePath)

 // Create the Lambda client
 const lambdaClient = new LambdaClient({
 endpoint: "http://localhost:4566",
 region: "us-east-1",
 })

 // Create the Lambda function using the AWS SDK
 const createFunctionCommand = new CreateFunctionCommand({
 FunctionName: functionName,
 Runtime: "nodejs18.x",
 Role: roleArn,
 Handler: "function.handler",
 Code: {
 ZipFile: zipFileContent,
 },
 })

 try {
 const response = await lambdaClient.send(createFunctionCommand)
 console.log("Lambda function created successfully:", response)
 } catch (error) {
 console.error("Error creating Lambda function:", error)
 }
}

createLambdaFunction()
```

## Create a Function URL

function URL is useful when we would like to trigger a function by using the HTTP call

```bash
FUNCTION_NAME="my-lambda-function"

awslocal lambda create-function-url-config \
 --function-name ${FUNCTION_NAME} \
 --auth-type NONE
```

this command has a response like this:

```bash
{
 "FunctionUrl": "http://9vt6m9x3rjklpgxejkruoxt5r0chz4u9.lambda-url.us-east-1.localhost.localstack.cloud:4566/",
 "FunctionArn": "arn:aws:lambda:us-east-1:000000000000:function:my-lambda-function",
 "AuthType": "NONE",
 "CreationTime": "2023-06-07T11:58:36.776375+0000"
}
```

we need this `FunctionUrl` for our HTTP call

## Trigger the Lambda function URL

because I created a function url at first, I trigger our function by using curl

```bash
CREATED_URL="<FunctionUrl>"

curl -X POST \
 ${CREATED_URL} \
 -H 'Content-Type: application/json' \
 -d '{"num1": 10, "num2": 20}'

```

or we can skip creating the HTTP URL and post the request and use the invoker the same as this:

```javascript
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
 Payload: payload bytes,
 })

 try {
 const response = await lambdaClient.send(command)
 if (response.Payload) {
 const result = JSON.parse(decoder.decode(response.Payload))
 console.log(result.body)
 } else {
 console.log("Response payload is empty")
 }
 } catch (error) {
 console.error("Error invoking Lambda function:", error)
 }
}

invokeLambdaFunction()
```
