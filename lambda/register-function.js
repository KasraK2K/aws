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
