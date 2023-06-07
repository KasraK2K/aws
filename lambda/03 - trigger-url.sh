CREATED_URL="http://cdfbso1926wlgj0vgqniy6367bjechi7.lambda-url.us-east-1.localhost.localstack.cloud:4566/"

curl -X POST \
  ${CREATED_URL} \
  -H 'Content-Type: application/json' \
  -d '{"num1": 10, "num2": 20}'
