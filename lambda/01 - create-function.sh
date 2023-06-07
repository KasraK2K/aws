FILE_NAME="function.js"
ZIP_FILE_NAME="function.zip"
FUNCTION_NAME="my-lambda-function"

echo "Cheking $ZIP_FILE_NAME existance..."
if [ -f "$ZIP_FILE_NAME" ]; then
    echo "Delete $ZIP_FILE_NAME."
    rm "$ZIP_FILE_NAME"
fi

echo "Create $ZIP_FILE_NAME file."
zip ${ZIP_FILE_NAME} ${FILE_NAME}
awslocal lambda create-function \
    --function-name ${FUNCTION_NAME} \
    --runtime nodejs18.x \
    --zip-file fileb://${ZIP_FILE_NAME} \
    --handler function.handler \
    --role arn:aws:iam::000000000000:role/lambda-role
