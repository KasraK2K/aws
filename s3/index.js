const { S3 } = require("@aws-sdk/client-s3")
const fs = require("fs")
const path = require("path")

const s3Client = new S3({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
})

/* -------------------------------------------------------------------------- */
/*                            Create AWS S3 Bucket                            */
/* -------------------------------------------------------------------------- */
const createBucket = () => {
  return s3Client.createBucket({ Bucket: "ias" })
}

/* -------------------------------------------------------------------------- */
/*                            Upload file to AWS S3                           */
/* -------------------------------------------------------------------------- */
const uploadFileToS3 = () => {
  const exampleFilePath = path.resolve(process.cwd(), "s3/sample-file.txt")
  const fileStream = fs.createReadStream(exampleFilePath)
  const uploadParams = {
    Bucket: "ias",
    Body: fileStream,
    Key: "sample-file.txt",
  }
  s3Client.putObject(uploadParams)
}

/* -------------------------------------------------------------------------- */
/*                          Download file from AWS S3                         */
/* -------------------------------------------------------------------------- */
const downloadFileFromS3 = async () => {
  const downloadParams = {
    Bucket: "ias",
    Key: "sample-file.txt",
  }
  const writeStream = fs.createWriteStream(path.join(__dirname, "download.txt"))
  const response = await s3Client.getObject(downloadParams)
  const body = await response.Body?.transformToString()
  writeStream.write(body)
}

/* -------------------------------------------------------------------------- */
/*                               Using Functions                              */
/* -------------------------------------------------------------------------- */
Promise.resolve()
  // Create AWS S3 Bucket
  .then(() => createBucket())
  // Upload file to AWS S3
  .then(() => uploadFileToS3())
  // Download file from AWS S3
  .then(() => {
    downloadFileFromS3()
      .then((result) => console.log(result))
      .catch((err) => console.log(err))
  })
