module.exports.handler = async (event) => {
  let body
  if (event && event.body) body = JSON.parse(event.body)
  else body = event
  const { num1, num2 } = body
  const product = num1 * num2
  return {
    statusCode: 200,
    body: `The product of ${num1} and ${num2} is ${product}`,
  }
}
