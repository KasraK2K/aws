exports.handler = async (event) => {
  let body = JSON.parse(event.body)
  const product = body.num1 * body.num2 // num1 and num2 is key of our payload we send it later in our post request
  const response = {
    statusCode: 200,
    body: `The product of ${body.num1} and ${body.num2} is ${product}`,
  }
  return response
}
