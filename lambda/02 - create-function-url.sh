FUNCTION_NAME="my-lamba-function"

awslocal lambda create-function-url-config \
  --function-name ${FUNCTION_NAME} \
  --auth-type NONE
