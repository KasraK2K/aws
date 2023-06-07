exports.handler = async (event) => {
  const { num1, num2 } = event
  const product = num1 * num2
  return {
    statusCode: 200,
    body: `The product of ${num1} and ${num2} is ${product}`,
  }
}
