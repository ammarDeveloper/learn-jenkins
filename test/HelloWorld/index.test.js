const handler = require('../../lambdas/HelloWorld');

describe('Lambda handler', () => {
  it('should return statusCode 200 and "Hello world" message', () => {
    const event = {}; 
    const context = {};

    const result = handler(event, context);

    expect(result).toEqual({
      statusCode: 200,
      message: 'Hello world'
    });
  });
});
