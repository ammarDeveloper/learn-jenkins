const handler = require('./index');

const event = {

}

const context = {

}

try {
    const response = handler(event, context);
    console.log(response);
} catch (error) {
    console.loo(error.message);
}