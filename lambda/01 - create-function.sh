ZIP_FILE_NAME="function.zip"
FUNCTION_NAME="my-lamba-function"

zip ${ZIP_FILE_NAME} index.js
awslocal lambda create-function \
    --function-name ${FUNCTION_NAME} \
    --runtime nodejs18.x \
    --zip-file fileb://${ZIP_FILE_NAME} \
    --handler index.handler \
    --role arn:aws:iam::000000000000:role/lambda-role
