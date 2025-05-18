const { handler } = require('../../lambdas/HelloWorld');

describe('Lambda handler', () => {
  it('should return statusCode 200 and "Hello world" message', async () => {
    const event = {}; 
    const context = {};

    const result = await handler(event, context);

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello world' })
    });
  });
});
